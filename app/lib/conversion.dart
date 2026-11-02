import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';

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

class _Request {
  const _Request(this.actionId, this.files);

  final String actionId;
  final List<PortableFile> files;
}

Future<List<PortableFile>> _run(_Request request) {
  return runPortable(actionById(request.actionId)!, request.files);
}

/// Converts without freezing the app: a background isolate on phones and desktops. Browsers
/// have no isolates, so there the work runs on the page and a large picture can pause it.
Future<List<PortableFile>> convert(RadialAction action, List<PortableFile> files) {
  return compute(_run, _Request(action.id, files));
}

/// Readable sizes: `340 KB`, `2.5 MB`.
String formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).round()} KB';
  return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
}
