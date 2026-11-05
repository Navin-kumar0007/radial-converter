import 'dart:io';

import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';

import 'android_media.dart';
import 'picked_file.dart';
import 'shift_drag_native.dart';

/// Whether a result can be dragged out to another app. Phones have no dragging between apps.
bool get canDragOut => Platform.isMacOS || Platform.isWindows;

/// Whether a result can be shared with another app.
bool get canShareOut => Platform.isAndroid;

int _next = 0;

/// Results handed to other apps sit here, as they need a real file. They go when the app next opens.
Directory get _desktopFolder => Directory(p.join(Directory.systemTemp.path, 'radial_handed_over'));

/// Removes what earlier runs left. Only what's [olderThan] this: another copy of the app may be open
/// and dragging its file right now, and a drop may still be copying.
Future<void> cleanUpHandedOver({Duration olderThan = const Duration(days: 1)}) async {
  if (!canDragOut) return;
  final cutOff = DateTime.now().subtract(olderThan);
  try {
    if (!_desktopFolder.existsSync()) return;
    await for (final entry in _desktopFolder.list()) {
      try {
        final changed = (await entry.stat()).modified;
        if (!changed.isAfter(cutOff)) await entry.delete(recursive: true);
      } on FileSystemException {
        // Still in use. It can wait for next time.
      }
    }
  } on FileSystemException {
    // Nothing is lost by leaving it.
  }
}

/// A real file for [output], which may only be in memory until now.
Future<String> _fileFor(ConvertedFile output, Future<String> Function() newFolder) async {
  final existing = output.savedPath ?? output.cachedPath;
  if (existing != null) return existing;
  final inMemory = output.inMemory;
  if (inMemory == null) throw EngineFailed('${output.name} can\'t be handed over.');
  // Its own folder, so it keeps its name even beside another of the same name.
  final path = p.join(await newFolder(), p.basename(output.name));
  await File(path).writeAsBytes(inMemory.bytes, flush: true);
  return path;
}

/// Starts dragging [output] to wherever the user drops it. The mouse button must still be down.
Future<void> dragOut(ConvertedFile output) async {
  final path = await _fileFor(output, () async {
    final folder = Directory(p.join(_desktopFolder.path, '${pid}_${_next++}'));
    await folder.create(recursive: true);
    return folder.path;
  });
  await shiftDragChannel.invokeMethod<bool>('dragOut', {
    'paths': [path],
  });
}

/// Opens the system's share sheet for [output].
Future<void> shareOut(ConvertedFile output) async {
  final path = await _fileFor(output, () async {
    return (await mediaChannel.invokeMethod<String>('handOverFolder'))!;
  });
  await shareOnPhone(path, FileKind.mimeOf(output.name));
}

/// Shows a chip at the cursor, to drag results straight on after a Shift-drag.
void showChipAtCursor(List<String> paths) {
  if (!canDragOut || paths.isEmpty) return;
  shiftDragChannel.invokeMethod<void>('showChip', {'paths': paths}).catchError((Object _) {
    // Nothing to do without it: the results are saved already.
  });
}

/// Whether saved results can be undone or shown here. A phone's saves go where the app can't follow.
bool get canUndoSaved => Platform.isMacOS || Platform.isWindows;

/// What the place results go when undone is called here.
String get trashName => Platform.isWindows ? 'the Recycle Bin' : 'the Trash';

/// Moves a result to the Trash, where it can still be got back. Never deletes anything itself. It
/// refuses if the file isn't the size it was left at, as that means it isn't what was made any more.
Future<void> moveResultToTrash(String path, int expectedSize) async {
  final file = File(path);
  if (!file.existsSync()) throw EngineFailed('${p.basename(path)} is no longer there.');
  if (file.lengthSync() != expectedSize) {
    throw EngineFailed('${p.basename(path)} has changed since, so it was left alone.');
  }
  final moved = await shiftDragChannel.invokeMethod<bool>('moveToTrash', {
    'paths': [path],
  });
  if (moved != true) throw EngineFailed('${p.basename(path)} could not be moved to $trashName.');
}

/// Opens the folder holding a result, with it selected.
Future<void> showResultInFolder(String path) async {
  if (!File(path).existsSync()) throw EngineFailed('${p.basename(path)} is no longer there.');
  await shiftDragChannel.invokeMethod<void>('showInFolder', {
    'paths': [path],
  });
}
