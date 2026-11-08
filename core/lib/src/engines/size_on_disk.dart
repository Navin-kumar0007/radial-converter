import 'dart:io';

/// The size of a file, or of everything inside a folder. Missing paths count as zero.
Future<int> sizeOnDisk(String path) async {
  final type = await FileSystemEntity.type(path);
  if (type == FileSystemEntityType.file) return File(path).length();
  if (type != FileSystemEntityType.directory) return 0;
  var total = 0;
  await for (final entity in Directory(path).list(recursive: true, followLinks: false)) {
    if (entity is File) total += await entity.length();
  }
  return total;
}
