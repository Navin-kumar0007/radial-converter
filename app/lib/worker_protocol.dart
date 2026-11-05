import 'dart:js_interop';

/// A file crossing between the page and the conversion worker.
extension type WorkerFile._(JSObject _) implements JSObject {
  external factory WorkerFile({JSString name, JSUint8Array bytes});

  external JSString get name;
  external JSUint8Array get bytes;
}

/// What the page sends the worker.
extension type WorkerRequest._(JSObject _) implements JSObject {
  external factory WorkerRequest({
    JSString actionId,
    JSArray<WorkerFile> files,
    JSNumber? cropLeft,
    JSNumber? cropTop,
    JSNumber? cropWidth,
    JSNumber? cropHeight,
    JSNumber? shiftMilliseconds,
    JSString? password,
    JSString? newPassword,
    JSNumber? formWidth,
    JSNumber? formHeight,
    JSNumber? formMinBytes,
    JSNumber? formMaxBytes,
    JSBoolean? forForm,
  });

  external JSString get actionId;
  external JSArray<WorkerFile> get files;
  external JSNumber? get cropLeft;
  external JSNumber? get cropTop;
  external JSNumber? get cropWidth;
  external JSNumber? get cropHeight;
  external JSNumber? get shiftMilliseconds;
  external JSString? get password;
  external JSString? get newPassword;
  external JSNumber? get formWidth;
  external JSNumber? get formHeight;
  external JSNumber? get formMinBytes;
  external JSNumber? get formMaxBytes;
  external JSBoolean? get forForm;
}

/// What the worker sends back: progress, then the results or why it failed.
extension type WorkerReply._(JSObject _) implements JSObject {
  external factory WorkerReply({
    JSNumber? progress,
    JSArray<WorkerFile>? files,
    JSString? failure,
    JSString? passwordNeeded,
  });

  external JSNumber? get progress;
  external JSArray<WorkerFile>? get files;
  external JSString? get failure;

  /// The name of a locked file that no password given opens.
  external JSString? get passwordNeeded;
}
