import 'package:radial_core/radial_core.dart';

export 'convert_native.dart' if (dart.library.js_interop) 'convert_web.dart';
export 'picked_file.dart';

/// Actions that need a screen we have not built yet, such as the crop frame.
const _needsScreen = {'image-crop', 'subtitle-shift', 'video-trim', 'audio-trim'};

/// What the menu offers for these files on this device. Pictures and subtitles run on all
/// platforms; video and audio need that platform's engine.
List<RadialAction> availableActions(
  List<FileKind> kinds,
  ActionMode mode, {
  required bool mediaAvailable,
}) {
  bool canRun(RadialAction action, FileKind kind) {
    return canRunPortably(action, kind) || (mediaAvailable && canPlanMedia(action, kind));
  }

  return [
    for (final action in actionsFor(kinds, mode))
      if (!_needsScreen.contains(action.id) && kinds.every((kind) => canRun(action, kind))) action,
  ];
}

/// Files larger than this are refused rather than read into memory. Everything converted so
/// far works on a whole file in memory, and a browser cannot hold much more.
const maxInMemoryBytes = 1024 * 1024 * 1024;

/// Readable sizes: `340 KB`, `2.5 MB`.
String formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).round()} KB';
  if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
}
