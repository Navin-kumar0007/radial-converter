import 'dart:io';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';

import 'picked_file.dart';

/// The dropped files, of which only the start is read, as when they are chosen. Folders are opened.
Future<DroppedFiles> readDroppedFiles(List<DropItem> items) async {
  final loose = <PickedFile>[];
  final inFolders = <PickedFile>[];
  var folders = 0;
  var tooMany = false;
  for (final item in items) {
    // Asked of the disk, as on Windows a dropped folder arrives looking like a file.
    if (!await FileSystemEntity.isDirectory(item.path)) {
      loose.add(await _read(item.path));
      continue;
    }
    folders++;
    await for (final path in _filesIn(Directory(item.path))) {
      if (inFolders.length == maxFolderFiles) {
        tooMany = true;
        break;
      }
      try {
        inFolders.add(await _read(path));
      } on FileSystemException {
        // One file we may not read shouldn't lose the rest of the folder.
      }
    }
  }
  return DroppedFiles(loose: loose, inFolders: inFolders, folders: folders, tooMany: tooMany);
}

/// Every file inside, in order. Links are not followed: they could lead anywhere, even back here.
Stream<String> _filesIn(Directory folder) async* {
  final List<FileSystemEntity> entries;
  try {
    entries = await folder.list(followLinks: false).toList();
  } on FileSystemException {
    return;
  }
  entries.sort((a, b) => a.path.compareTo(b.path));
  for (final entry in entries) {
    if (isFolderClutter(p.basename(entry.path))) continue;
    if (entry is Directory) {
      yield* _filesIn(entry);
    } else if (entry is File) {
      yield entry.path;
    }
  }
}

Future<PickedFile> _read(String path) async {
  return PickedFile(
    name: p.basename(path),
    size: await File(path).length(),
    head: await _readHead(path),
    read: File(path).readAsBytes,
    path: path,
  );
}

Future<List<int>> _readHead(String path) async {
  final file = await File(path).open();
  try {
    return await file.read(detectHeadBytes);
  } finally {
    await file.close();
  }
}
