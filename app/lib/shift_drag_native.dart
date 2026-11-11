import 'dart:io';

import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';

import 'words.dart';

/// `MainFlutterWindow.swift` or `shift_drag.cpp` on the other side.
const shiftDragChannel = MethodChannel('radial/shift_drag');

/// Answers the system-wide Shift-drag menu: what these files can become, and what was chosen. Returns
/// how to stop.
///
/// The menu asks with `tools` true while Alt (Option on a Mac) is held as well, and each slice comes
/// with the labels of its outer-ring choices, if it has any. A choice comes back as its index:
/// none, or 0, is what the slice itself does.
void Function() listenForShiftDrag({
  required Future<List<RadialAction>> Function(List<String> paths, ActionMode mode) menuFor,
  required Future<String?> Function(RadialAction action, List<String> paths) sizeOf,
  required void Function(RadialAction action, List<String> paths, ActionOptions options) chosen,
}) {
  if (!Platform.isMacOS && !Platform.isWindows) return () {};
  shiftDragChannel.setMethodCallHandler((call) async {
    final arguments = call.arguments as Map;
    final paths = (arguments['paths'] as List).cast<String>();
    if (call.method == 'menuFor') {
      final mode = arguments['tools'] == true ? ActionMode.tools : ActionMode.convert;
      return [for (final action in await menuFor(paths, mode)) shiftDragSlice(action, deviceWords)];
    }
    if (call.method == 'sizeOf') {
      // What the centre shows while the drag rests on a slice, such as "About 240 KB".
      final action = actionById(arguments['id'] as String);
      return action == null ? null : await sizeOf(action, paths);
    }
    if (call.method == 'chosen') {
      final action = actionById(arguments['id'] as String);
      if (action != null) chosen(action, paths, shiftDragOptions(action, arguments['choice']));
    }
    return null;
  });
  sendNativeWords();
  return () => shiftDragChannel.setMethodCallHandler(null);
}

/// A slice as the native menu draws it.
Map<String, Object> shiftDragSlice(RadialAction action, Words words) {
  final choices = ringChoices(action);
  return {
    'id': action.id,
    'label': actionLabel(words, action.label),
    if (choices.isNotEmpty)
      'choices': [for (final choice in choices) ringChoiceLabel(words, choice)],
  };
}

/// What a choice from the native menu's outer ring runs with. The first is the slice itself, and
/// runs as plain options so the slice's size trial can be reused.
ActionOptions shiftDragOptions(RadialAction action, Object? choice) {
  final choices = ringChoices(action);
  if (choice is! int || choice <= 0 || choice >= choices.length) return const ActionOptions();
  return choices[choice].options;
}

/// Gives the native menus their words in the app's language, again whenever it changes.
void sendNativeWords() {
  if (!Platform.isMacOS && !Platform.isWindows) return;
  final words = deviceWords;
  shiftDragChannel
      .invokeMethod<void>('setWords', {
        'cancel': words.cancel,
        'tools': words.modeTools,
        'dragToApp': words.dragToApp,
        'trayStillRunning': words.trayStillRunning,
        'trayHowToQuit': words.trayHowToQuit,
        'trayOpen': words.trayOpen,
        'trayQuit': words.trayQuit,
      })
      .catchError((Object _) {
        // The native side keeps its English.
      });
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

/// Whether the app opens when the user signs in, so Shift-drag works from then on.
enum LoginItem {
  /// Not on this platform, or this version of it.
  unsupported,
  off,
  on,

  /// Asked for, but macOS wants the user to allow it in System Settings.
  needsApproval;

  static LoginItem _from(String? answer) => switch (answer) {
    'on' => on,
    'off' => off,
    'approval' => needsApproval,
    _ => unsupported,
  };
}

Future<LoginItem> loginItem() async {
  if (!Platform.isMacOS && !Platform.isWindows) return LoginItem.unsupported;
  try {
    return LoginItem._from(await shiftDragChannel.invokeMethod<String>('loginItem'));
  } catch (_) {
    return LoginItem.unsupported;
  }
}

/// Turns opening at login on or off, and answers with how it is now.
Future<LoginItem> setLoginItem(bool on) async {
  try {
    return LoginItem._from(await shiftDragChannel.invokeMethod<String>('setLoginItem', {'on': on}));
  } catch (_) {
    return loginItem();
  }
}
