import 'dart:async';
import 'dart:js_interop';

import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

import 'picked_file.dart';
import 'worker_protocol.dart';

/// Converts in a Web Worker, so the page stays alive and shows real progress.
///
/// The worker is compiled for release even during `flutter run`, so it stays fast there too.
/// If it cannot start, the work runs on the page instead, which is slower and can pause it.
Future<List<PortableFile>> convert(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress, [
  ActionOptions options = const ActionOptions(),
]) {
  final done = Completer<List<PortableFile>>();
  final web.Worker worker;
  try {
    worker = web.Worker('convert_worker.js'.toJS);
  } catch (_) {
    return runPortable(action, files, options: options, onProgress: onProgress);
  }

  worker.onmessage = ((web.MessageEvent event) {
    final reply = event.data as WorkerReply;
    final progress = reply.progress;
    if (progress != null) onProgress(progress.toDartDouble);
    final failure = reply.failure;
    final outputs = reply.files;
    final locked = reply.passwordNeeded;
    if (locked != null) {
      worker.terminate();
      if (!done.isCompleted) done.completeError(PasswordNeeded(locked.toDart));
    } else if (failure != null) {
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
      done.complete(runPortable(action, files, options: options, onProgress: onProgress));
    }
  }).toJS;

  final request = WorkerRequest(
    actionId: action.id.toJS,
    files: [for (final file in files) WorkerFile(name: file.name.toJS, bytes: file.bytes.toJS)]
        .toJS,
    cropLeft: options.crop?.left.toJS,
    cropTop: options.crop?.top.toJS,
    cropWidth: options.crop?.width.toJS,
    cropHeight: options.crop?.height.toJS,
    shiftMilliseconds: options.shift?.inMilliseconds.toJS,
    password: options.password?.toJS,
    newPassword: options.newPassword?.toJS,
    forForm: options.form == null ? null : true.toJS,
    formWidth: options.form?.width?.toJS,
    formHeight: options.form?.height?.toJS,
    formMinBytes: options.form?.minBytes?.toJS,
    formMaxBytes: options.form?.maxBytes?.toJS,
  );
  worker.postMessage(request);
  return done.future;
}

/// What the HEIC worker sends back.
extension type _PhotoReply._(JSObject _) implements JSObject {
  external JSUint8Array? get png;
  external JSString? get failure;
}

/// Reads a HEIC photo as a PNG, so the picture engine can take it from there.
Future<Uint8List> decodeHeic(PickedFile file) async {
  const cannotStart = EngineFailed('HEIC photos could not start in this browser.');
  final done = Completer<Uint8List>();
  final web.Worker worker;
  try {
    worker = web.Worker('heic_worker.js'.toJS);
  } catch (_) {
    throw cannotStart;
  }
  worker.onmessage = ((web.MessageEvent event) {
    final reply = event.data as _PhotoReply;
    final png = reply.png;
    if (png != null) {
      done.complete(png.toDart);
    } else {
      done.completeError(EngineFailed(reply.failure?.toDart ?? 'This photo could not be read.'));
    }
  }).toJS;
  worker.onerror = ((web.Event event) {
    event.preventDefault();
    if (!done.isCompleted) done.completeError(cannotStart);
  }).toJS;
  try {
    worker.postMessage((await file.read()).toJS);
    return await done.future;
  } finally {
    worker.terminate();
  }
}

/// What the video worker sends back.
extension type _MediaReply._(JSObject _) implements JSObject {
  external JSNumber? get progress;
  external JSObject? get info;
  external JSUint8Array? get frame;
  external web.Blob? get file;
  external JSNumber? get size;
  external JSString? get failure;
  external JSBoolean? get cleaned;
}

/// Browsers can convert video themselves, with their own hardware encoders.
bool mediaEngineAvailable() => true;

/// What video and audio can become here, or null for everything that can be planned.
Set<FileKind>? mediaOutputsHere() => null;

class _VideoWorker {
  _VideoWorker() : _worker = web.Worker('video_worker.js'.toJS, web.WorkerOptions(type: 'module')) {
    _worker.onmessage = ((web.MessageEvent event) {
      final reply = event.data as _MediaReply;
      final progress = reply.progress;
      if (progress != null) {
        onProgress?.call(progress.toDartDouble);
      } else {
        _settle((pending) => pending.complete(reply));
      }
    }).toJS;
    _worker.onerror = ((web.Event event) {
      event.preventDefault();
      _settle((pending) => pending.completeError(const EngineFailed(_cannotStart)));
    }).toJS;
  }

  static const _cannotStart = 'Video could not start in this browser.';

  final web.Worker _worker;
  Completer<_MediaReply>? _pending;
  void Function(double)? onProgress;

  void _settle(void Function(Completer<_MediaReply>) action) {
    final pending = _pending;
    _pending = null;
    if (pending != null && !pending.isCompleted) action(pending);
  }

  Future<_MediaReply> send(Map<String, Object?> message) async {
    final pending = Completer<_MediaReply>();
    _pending = pending;
    _worker.postMessage(message.jsify());
    final reply = await pending.future;
    final failure = reply.failure;
    if (failure != null) throw EngineFailed(failure.toDart);
    return reply;
  }

  void stop() {
    _worker.terminate();
    _settle((pending) => pending.completeError(const JobCancelled()));
  }
}

MediaInfo _readInfo(JSObject info) {
  final map = (info.dartify()! as Map).cast<Object?, Object?>();
  return MediaInfo(
    seconds: (map['seconds']! as num).toDouble(),
    hasVideo: map['hasVideo']! as bool,
    hasAudio: map['hasAudio']! as bool,
    width: (map['width'] as num?)?.toInt(),
    height: (map['height'] as num?)?.toInt(),
  );
}

void _download(web.Blob file, String name) {
  final url = web.URL.createObjectURL(file);
  (web.document.createElement('a') as web.HTMLAnchorElement)
    ..href = url
    ..download = name
    ..click();
  // The browser needs the address until the download starts.
  Timer(const Duration(minutes: 1), () => web.URL.revokeObjectURL(url));
}

/// What is inside a video or audio file, read without changing it.
Future<MediaInfo> probeMedia(PickedFile file) async {
  final url = file.webUrl;
  if (url == null) throw const EngineFailed('This file could not be read.');
  final worker = _VideoWorker();
  try {
    return _readInfo((await worker.send({'command': 'probe', 'url': url})).info!);
  } finally {
    worker.stop();
  }
}

/// One frame of a video, to show before trimming.
Future<Uint8List> videoFrame(PickedFile file, double seconds) async {
  final url = file.webUrl;
  if (url == null) throw const EngineFailed('This file could not be read.');
  final worker = _VideoWorker();
  try {
    final reply = await worker.send({'command': 'frame', 'url': url, 'seconds': seconds});
    return reply.frame!.toDart;
  } finally {
    worker.stop();
  }
}

/// Converts each file piece by piece in a worker. A size target retries lower until it fits.
Future<List<ConvertedFile>> convertMedia(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control, [
  ActionOptions options = const ActionOptions(),
]) async {
  final worker = _VideoWorker();
  control.cancel = worker.stop;
  try {
    await worker.send({'command': 'cleanUp'});
    final results = <ConvertedFile>[];
    for (var i = 0; i < files.length; i++) {
      final file = files[i];
      final url = file.webUrl;
      if (url == null) throw const EngineFailed('This file could not be read.');

      final probe = await worker.send({'command': 'probe', 'url': url});
      final info = _readInfo(probe.info!);
      final plans = planMedia(action, kinds[i], info, options: options);
      final limit = mediaSizeLimit(action, options);

      void Function(double)? report(int attempt) => (progress) {
        final part = (attempt + progress) / plans.length;
        onProgress((i + (limit == null ? progress : part)) / files.length);
      };

      _MediaReply? done;
      for (var attempt = 0; attempt < plans.length; attempt++) {
        worker.onProgress = report(attempt);
        final reply = await worker.send({
          'command': 'convert',
          'url': url,
          'plan': plans[attempt].toMap(),
        });
        final size = reply.size!.toDartInt;
        if (limit == null || size <= limit) {
          done = reply;
          break;
        }
        debugPrint('Attempt ${attempt + 1} came to $size bytes, over $limit. Aiming lower.');
      }
      if (done == null) {
        throw EngineFailed('This video could not be made small enough for "${action.label}".');
      }

      final name = freeOutputName(
        inputName: file.name,
        extension: plans.first.output.extension,
        suffix: action.suffix,
        exists: (_) => false,
      );
      final blob = done.file!;
      results.add(
        ConvertedFile(
          name: name,
          size: done.size!.toDartInt,
          download: () async {
            _download(blob, name);
            return true;
          },
        ),
      );
    }
    return results;
  } finally {
    control.cancel = null;
    worker.stop();
  }
}
