import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';

/// A file the user chose. Only its start is read until it is needed, so choosing a very large
/// file costs nothing, and files we cannot convert are never read at all.
class PickedFile {
  const PickedFile({
    required this.name,
    required this.size,
    required this.head,
    required this.read,
    this.webUrl,
    this.path,
  });

  final String name;
  final int size;

  /// The start of the file, enough to identify it.
  final List<int> head;
  final Future<Uint8List> Function() read;

  /// In a browser, a `blob:` address for the file, so video can be read piece by piece.
  final String? webUrl;

  /// On a desktop, where the file is on disk.
  final String? path;
}

/// What a drop brought: files dropped as they are, and files found inside dropped folders.
class DroppedFiles {
  const DroppedFiles({
    this.loose = const [],
    this.inFolders = const [],
    this.folders = 0,
    this.tooMany = false,
  });

  final List<PickedFile> loose;
  final List<PickedFile> inFolders;

  /// How many folders were dropped, as an empty one still needs an answer.
  final int folders;

  /// The folders held more than could be opened.
  final bool tooMany;
}

/// A finished result. Pictures are in memory. A video may be too large for that, so it is
/// already saved on a desktop, or brings its own way to save in a browser or on a phone.
class ConvertedFile {
  const ConvertedFile({
    required this.name,
    required this.size,
    this.inMemory,
    this.download,
    this.savedPath,
    this.note,
  });

  final String name;
  final int size;
  final PortableFile? inMemory;

  /// Saves a result that is not in memory. False if the user changed their mind.
  final Future<bool> Function()? download;

  /// Where the result already is, on a desktop.
  final String? savedPath;

  /// Anything the user should know about the result.
  final String? note;
}

/// Lets the screen stop a running conversion.
class ConvertControl {
  void Function()? cancel;
}
