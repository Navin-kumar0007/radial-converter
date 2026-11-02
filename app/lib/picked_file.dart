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
  });

  final String name;
  final int size;

  /// The start of the file, enough to identify it.
  final List<int> head;
  final Future<Uint8List> Function() read;

  /// In a browser, a `blob:` address for the file, so video can be read piece by piece.
  final String? webUrl;
}

/// A finished result. Pictures are in memory; a video may be too large for that, so it brings
/// its own way to save.
class ConvertedFile {
  const ConvertedFile({required this.name, required this.size, this.inMemory, this.download});

  final String name;
  final int size;
  final PortableFile? inMemory;
  final void Function()? download;
}

/// Lets the screen stop a running conversion.
class ConvertControl {
  void Function()? cancel;
}
