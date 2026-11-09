import 'dart:io';

import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:test/test.dart';

void main() {
  late Directory folder;
  setUp(() => folder = Directory.systemTemp.createTempSync('size_on_disk_'));
  tearDown(() => folder.deleteSync(recursive: true));

  test('a file is its own length', () async {
    final file = File(p.join(folder.path, 'a.bin'))..writeAsBytesSync(List.filled(120, 1));
    expect(await sizeOnDisk(file.path), 120);
  });

  test('a folder counts everything inside it, however deep', () async {
    final nested = Directory(p.join(folder.path, 'pages', 'more'))..createSync(recursive: true);
    File(p.join(folder.path, 'pages', 'page-1.pdf')).writeAsBytesSync(List.filled(100, 1));
    File(p.join(nested.path, 'page-2.pdf')).writeAsBytesSync(List.filled(150, 1));
    expect(await sizeOnDisk(p.join(folder.path, 'pages')), 250);
  });

  test('a missing path is zero', () async {
    expect(await sizeOnDisk(p.join(folder.path, 'nope')), 0);
  });
}
