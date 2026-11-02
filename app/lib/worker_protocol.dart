import 'dart:js_interop';

/// A file crossing between the page and the conversion worker.
extension type WorkerFile._(JSObject _) implements JSObject {
  external factory WorkerFile({JSString name, JSUint8Array bytes});

  external JSString get name;
  external JSUint8Array get bytes;
}

/// What the page sends the worker.
extension type WorkerRequest._(JSObject _) implements JSObject {
  external factory WorkerRequest({JSString actionId, JSArray<WorkerFile> files});

  external JSString get actionId;
  external JSArray<WorkerFile> get files;
}

/// What the worker sends back: progress, then the results or why it failed.
extension type WorkerReply._(JSObject _) implements JSObject {
  external factory WorkerReply({JSNumber? progress, JSArray<WorkerFile>? files, JSString? failure});

  external JSNumber? get progress;
  external JSArray<WorkerFile>? get files;
  external JSString? get failure;
}
