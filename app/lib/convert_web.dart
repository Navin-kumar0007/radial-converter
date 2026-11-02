import 'dart:async';
import 'dart:js_interop';

import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

import 'worker_protocol.dart';

/// Converts in a Web Worker, so the page stays alive and shows real progress.
///
/// The worker is compiled for release even during `flutter run`, so it stays fast there too.
/// If it cannot start, the work runs on the page instead, which is slower and can pause it.
Future<List<PortableFile>> convert(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
) {
  final done = Completer<List<PortableFile>>();
  final web.Worker worker;
  try {
    worker = web.Worker('convert_worker.js'.toJS);
  } catch (_) {
    return runPortable(action, files, onProgress: onProgress);
  }

  worker.onmessage = ((web.MessageEvent event) {
    final reply = event.data as WorkerReply;
    final progress = reply.progress;
    if (progress != null) onProgress(progress.toDartDouble);
    final failure = reply.failure;
    final outputs = reply.files;
    if (failure != null) {
      worker.terminate();
      if (!done.isCompleted) done.completeError(EngineFailed(failure.toDart));
    } else if (outputs != null) {
      worker.terminate();
      if (!done.isCompleted) {
        done.complete([
          for (final file in outputs.toDart) PortableFile(file.name.toDart, file.bytes.toDart),
        ]);
      }
    }
  }).toJS;

  worker.onerror = ((web.Event event) {
    event.preventDefault();
    worker.terminate();
    if (!done.isCompleted) {
      done.complete(runPortable(action, files, onProgress: onProgress));
    }
  }).toJS;

  final request = WorkerRequest(
    actionId: action.id.toJS,
    files: [for (final file in files) WorkerFile(name: file.name.toJS, bytes: file.bytes.toJS)]
        .toJS,
  );
  worker.postMessage(request);
  return done.future;
}
