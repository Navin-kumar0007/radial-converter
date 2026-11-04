import 'dart:js_interop';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

import 'blob_head.dart';
import 'picked_file.dart';

/// The dropped files, of which only the start is read, as when they are chosen. In a browser a
/// dropped file is a `blob:` address, and a dropped folder arrives already listing what it holds.
Future<DroppedFiles> readDroppedFiles(List<DropItem> items) async {
  final loose = <PickedFile>[];
  final inFolders = <PickedFile>[];
  var folders = 0;
  var tooMany = false;
  for (final item in items) {
    if (item is! DropItemDirectory) {
      loose.add(await _read(item));
      continue;
    }
    folders++;
    for (final file in _filesIn(item)) {
      if (inFolders.length == maxFolderFiles) {
        tooMany = true;
        break;
      }
      inFolders.add(await _read(file));
    }
  }
  return DroppedFiles(loose: loose, inFolders: inFolders, folders: folders, tooMany: tooMany);
}

Iterable<DropItem> _filesIn(DropItemDirectory folder) sync* {
  for (final item in folder.children) {
    if (isFolderClutter(item.name)) continue;
    if (item is DropItemDirectory) {
      yield* _filesIn(item);
    } else {
      yield item;
    }
  }
}

Future<PickedFile> _read(DropItem item) async {
  final url = item.path;
  return PickedFile(
    name: item.name,
    size: await item.length(),
    head: await readBlobHead(url),
    read: () async {
      final response = await web.window.fetch(url.toJS).toDart;
      return (await response.arrayBuffer().toDart).toDart.asUint8List();
    },
    webUrl: url,
  );
}
