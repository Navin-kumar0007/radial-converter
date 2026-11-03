import 'package:radial_core/radial_core.dart';

import 'pdf_engine.dart';

export 'convert_native.dart' if (dart.library.js_interop) 'convert_web.dart';
export 'pdf_engine.dart' show PdfResult, canRunPdf, convertPdf;
export 'picked_file.dart';

/// What the menu offers for these files on this device. Pictures and subtitles run on all
/// platforms; video, audio and HEIC photos need that platform's engine.
List<RadialAction> availableActions(
  List<FileKind> kinds,
  ActionMode mode, {
  required bool mediaAvailable,
  Set<FileKind>? mediaOutputs,
}) {
  bool canRunMedia(RadialAction action, FileKind kind) {
    if (!mediaAvailable || !canPlanMedia(action, kind)) return false;
    return mediaOutputs == null || mediaOutputs.contains(action.outputFor(kind));
  }

  bool canRun(RadialAction action, FileKind kind) {
    return canRunPortably(action, kind) ||
        canRunPdf(action, kind) ||
        canRunMedia(action, kind) ||
        (mediaAvailable && canRunDecoded(action, kind));
  }

  return [
    for (final action in actionsFor(kinds, mode))
      // The crop frame is drawn on one picture, and wouldn't fit any others.
      if (!(action.id == 'image-crop' && kinds.length > 1) &&
          kinds.every((kind) => canRun(action, kind)))
        action,
  ];
}

/// Files larger than this are refused rather than read into memory. Everything converted so
/// far works on a whole file in memory, and a browser cannot hold much more.
const maxInMemoryBytes = 1024 * 1024 * 1024;

/// Says what the file is, so the user knows it was recognised and what is missing.
String notAvailableMessage(List<FileKind> kinds, ActionMode mode) {
  final names = {for (final kind in kinds) _kindName(kind)};
  if (names.length != 1) return 'These files can\'t be converted together in this build yet.';
  final name = names.single;
  if (kinds.first == FileKind.unknown) return 'This type of file isn\'t supported yet.';
  return '$name can\'t be converted in this build yet.';
}

String _kindName(FileKind kind) {
  return switch (kind.family) {
    FileFamily.pdf => 'PDF files',
    FileFamily.video => 'Videos on this device',
    FileFamily.audio => 'Audio on this device',
    FileFamily.document => '${kind.extension.toUpperCase()} documents',
    FileFamily.archive => '${kind.extension.toUpperCase()} archives',
    FileFamily.folder => 'Folders',
    FileFamily.image => '${kind.extension.toUpperCase()} pictures',
    FileFamily.subtitle => 'Subtitles',
    FileFamily.unknown => 'This file',
  };
}

/// Readable sizes: `340 KB`, `2.5 MB`.
String formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).round()} KB';
  if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
}
