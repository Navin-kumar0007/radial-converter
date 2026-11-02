import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';

export 'convert_native.dart' if (dart.library.js_interop) 'convert_web.dart';

/// Actions that need a screen we have not built yet, such as the crop frame.
const _needsScreen = {'image-crop', 'subtitle-shift'};

/// What the menu offers for these files on this device. Every action here runs on all
/// platforms; native engines add more as they arrive.
List<RadialAction> availableActions(List<FileKind> kinds, ActionMode mode) {
  return [
    for (final action in actionsFor(kinds, mode))
      if (!_needsScreen.contains(action.id) && kinds.every((kind) => canRunPortably(action, kind)))
        action,
  ];
}

/// Files larger than this are refused rather than read into memory. Everything converted so
/// far works on a whole file in memory, and a browser cannot hold much more.
const maxInMemoryBytes = 1024 * 1024 * 1024;

/// A file the user chose. Only its start is read until it is needed, so choosing a very large
/// file costs nothing, and files we cannot convert are never read at all.
class PickedFile {
  const PickedFile({
    required this.name,
    required this.size,
    required this.head,
    required this.read,
  });

  final String name;
  final int size;

  /// The start of the file, enough to identify it.
  final List<int> head;
  final Future<Uint8List> Function() read;
}

/// Readable sizes: `340 KB`, `2.5 MB`.
String formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).round()} KB';
  if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
}
