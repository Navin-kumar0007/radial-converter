import 'dart:io';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';

import 'picked_file.dart';

/// The dropped files, of which only the start is read, as when they are chosen.
Future<List<PickedFile>> readDroppedFiles(List<DropItem> items) async {
  return [
    for (final item in items)
      PickedFile(
        name: p.basename(item.path),
        size: await File(item.path).length(),
        head: await _readHead(item.path),
        read: File(item.path).readAsBytes,
        path: item.path,
      ),
  ];
}

Future<List<int>> _readHead(String path) async {
  final file = await File(path).open();
  try {
    return await file.read(detectHeadBytes);
  } finally {
    await file.close();
  }
}
