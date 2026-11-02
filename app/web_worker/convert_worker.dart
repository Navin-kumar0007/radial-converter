// Runs conversions in a browser worker. Compiled by tool/build_worker.sh into web/convert_worker.js.

import 'dart:js_interop';

import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/worker_protocol.dart';
import 'package:web/web.dart' as web;

@JS('self')
external web.DedicatedWorkerGlobalScope get _self;

void main() {
  _self.onmessage = ((web.MessageEvent event) {
    _handle(event.data as WorkerRequest);
  }).toJS;
}

Future<void> _handle(WorkerRequest request) async {
  void reply(WorkerReply message) => _self.postMessage(message);
  try {
    final files = [
      for (final file in request.files.toDart) PortableFile(file.name.toDart, file.bytes.toDart),
    ];
    final outputs = await runPortable(
      actionById(request.actionId.toDart)!,
      files,
      onProgress: (progress) => reply(WorkerReply(progress: progress.toJS)),
    );
    reply(
      WorkerReply(
        files: [
          for (final file in outputs) WorkerFile(name: file.name.toJS, bytes: file.bytes.toJS),
        ].toJS,
      ),
    );
  } on EngineFailed catch (error) {
    reply(WorkerReply(failure: error.message.toJS));
  } catch (_) {
    reply(WorkerReply(failure: 'Something went wrong. This file could not be converted.'.toJS));
  }
}
