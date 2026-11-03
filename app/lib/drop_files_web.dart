import 'dart:js_interop';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:web/web.dart' as web;

import 'blob_head.dart';
import 'picked_file.dart';

/// The dropped files, of which only the start is read, as when they are chosen. In a browser a
/// dropped file is a `blob:` address.
Future<List<PickedFile>> readDroppedFiles(List<DropItem> items) async {
  return [for (final item in items) await _read(item)];
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
