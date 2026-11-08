import 'dart:js_interop';
import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

import 'picked_file.dart';
import 'words.dart';

/// A page can't start a drag other apps would understand on the canvas Flutter draws.
bool get canDragOut => false;

web.File _fileOf(String name, Uint8List bytes) {
  return web.File([bytes.toJS].toJS, name, web.FilePropertyBag(type: FileKind.mimeOf(name)));
}

/// Whether this browser can share files. iPhones and Android phones can; most desktop ones can't.
/// Browsers keep a page's work going for as long as the tab is open.
Future<void> keepWorkingInBackground(bool working) async {}

bool get canShareOut {
  try {
    final probe = _fileOf('probe.jpg', Uint8List(1));
    return web.window.navigator.canShare(web.ShareData(files: [probe].toJS));
  } catch (_) {
    return false;
  }
}

Future<void> cleanUpHandedOver() async {}

Future<void> dragOut(ConvertedFile output) async {}

void showChipAtCursor(List<String> paths) {}

/// Opens the system's share sheet for [output].
Future<void> shareOut(ConvertedFile output) async {
  final inMemory = output.inMemory;
  if (inMemory == null) throw EngineFailed(deviceWords.cantShareHere(output.name));
  try {
    final data = web.ShareData(files: [_fileOf(output.name, inMemory.bytes)].toJS);
    await web.window.navigator.share(data).toDart;
  } catch (error) {
    // Closing the share sheet counts as this, and isn't a failure.
    if (!'$error'.contains('AbortError')) rethrow;
  }
}

bool get canUndoSaved => false;

String trashName(Words words) => words.trashMac;

Future<void> moveResultToTrash(String path, int expectedSize) async {}

Future<void> showResultInFolder(String path) async {}
