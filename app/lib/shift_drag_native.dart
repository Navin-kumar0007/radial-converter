import 'dart:io';

import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';

import 'words.dart';

/// `MainFlutterWindow.swift` or `shift_drag.cpp` on the other side.
const shiftDragChannel = MethodChannel('radial/shift_drag');

/// Answers the system-wide Shift-drag menu: what these files can become, and what was chosen. Returns
/// how to stop.
void Function() listenForShiftDrag({
  required Future<List<RadialAction>> Function(List<String> paths) menuFor,
  required void Function(RadialAction action, List<String> paths) chosen,
}) {
  if (!Platform.isMacOS && !Platform.isWindows) return () {};
  shiftDragChannel.setMethodCallHandler((call) async {
    final arguments = call.arguments as Map;
    final paths = (arguments['paths'] as List).cast<String>();
    if (call.method == 'menuFor') {
      return [
        for (final action in await menuFor(paths))
          {'id': action.id, 'label': actionLabel(deviceWords, action.label)},
      ];
    }
    if (call.method == 'chosen') {
      final action = actionById(arguments['id'] as String);
      if (action != null) chosen(action, paths);
    }
    return null;
  });
  final words = deviceWords;
  shiftDragChannel
      .invokeMethod<void>('setWords', {
        'cancel': words.cancel,
        'dragToApp': words.dragToApp,
        'trayStillRunning': words.trayStillRunning,
        'trayHowToQuit': words.trayHowToQuit,
        'trayOpen': words.trayOpen,
        'trayQuit': words.trayQuit,
      })
      .catchError((Object _) {
        // The native side keeps its English.
      });
  return () => shiftDragChannel.setMethodCallHandler(null);
}

/// Writes [file] next to the file it came from, under a free name. Returns where. Originals and
/// anything else already there are never replaced.
Future<String> saveBesideOriginal(String originalPath, PortableFile file) async {
  final folder = p.dirname(originalPath);
  bool taken(String name) => File(p.join(folder, name)).existsSync();
  final name = !taken(file.name)
      ? file.name
      : freeOutputName(
          inputName: file.name,
          extension: splitFileName(file.name).extension,
          suffix: 'copy',
          exists: taken,
        );
  final path = p.join(folder, name);
  // It appears whole or not at all, so nothing can pick up half a file.
  final part = File('$path.part');
  try {
    await part.writeAsBytes(file.bytes, flush: true);
    await part.rename(path);
  } on FileSystemException {
    if (part.existsSync()) part.deleteSync();
    throw Fail.cantSaveBeside(name);
  }
  return path;
}

/// Brings the window forward, as the user may have closed it or be in another app.
void showAppWindow() {
  if (Platform.isMacOS || Platform.isWindows) shiftDragChannel.invokeMethod<void>('showWindow');
}
