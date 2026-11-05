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

ActionOptions _options(WorkerRequest request) {
  final left = request.cropLeft;
  final top = request.cropTop;
  final width = request.cropWidth;
  final height = request.cropHeight;
  final shift = request.shiftMilliseconds;
  return ActionOptions(
    crop: left == null || top == null || width == null || height == null
        ? null
        : (
            left: left.toDartInt,
            top: top.toDartInt,
            width: width.toDartInt,
            height: height.toDartInt,
          ),
    shift: shift == null ? null : Duration(milliseconds: shift.toDartInt),
    password: request.password?.toDart,
    newPassword: request.newPassword?.toDart,
    form: request.forForm == null
        ? null
        : FormTarget(
            width: request.formWidth?.toDartInt,
            height: request.formHeight?.toDartInt,
            minBytes: request.formMinBytes?.toDartInt,
            maxBytes: request.formMaxBytes?.toDartInt,
          ),
  );
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
      options: _options(request),
      onProgress: (progress) => reply(WorkerReply(progress: progress.toJS)),
    );
    reply(
      WorkerReply(
        files: [
          for (final file in outputs) WorkerFile(name: file.name.toJS, bytes: file.bytes.toJS),
        ].toJS,
      ),
    );
  } on PasswordNeeded catch (needed) {
    reply(WorkerReply(passwordNeeded: needed.fileName.toJS));
  } on EngineFailed catch (error) {
    reply(WorkerReply(failure: error.message.toJS));
  } catch (_) {
    reply(WorkerReply(failure: 'Something went wrong. This file could not be converted.'.toJS));
  }
}
