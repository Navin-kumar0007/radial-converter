import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:radial_core/radial_core.dart';
import 'package:radial_core/src/portable_archive.dart';
import 'package:test/test.dart';

Archive archiveOf(Map<String, String> files) {
  final archive = Archive();
  files.forEach((name, text) => archive.addFile(ArchiveFile.string(name, text)));
  return archive;
}

PortableFile zipOf(Map<String, String> files, {String name = 'box.zip'}) {
  return PortableFile(name, ZipEncoder().encodeBytes(archiveOf(files)));
}

PortableFile tarOf(Map<String, String> files, {String name = 'box.tar'}) {
  return PortableFile(name, TarEncoder().encodeBytes(archiveOf(files)));
}

PortableFile tarGzOf(Map<String, String> files, {String name = 'box.tar.gz'}) {
  final tar = TarEncoder().encodeBytes(archiveOf(files));
  return PortableFile(name, const GZipEncoder().encodeBytes(tar));
}

Future<List<PortableFile>> run(String id, PortableFile file) {
  return runPortable(actionById(id)!, [file]);
}

Map<String, String> inZip(PortableFile file) {
  return {
    for (final entry in ZipDecoder().decodeBytes(file.bytes).files)
      if (entry.isFile) entry.name: utf8.decode(entry.readBytes()!),
  };
}

Matcher failsSaying(String words) {
  return throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains(words)));
}

void main() {
  group('what runs', () {
    test('ZIP, TAR and GZ can be converted and extracted', () {
      for (final kind in [FileKind.zip, FileKind.tar, FileKind.gz]) {
        expect(canRunPortably(actionById('archive-extract')!, kind), isTrue, reason: '$kind');
        expect(canRunPortably(actionById('archive-to-targz')!, kind), isTrue, reason: '$kind');
      }
    });

    test('nothing here reads 7z or RAR, or writes 7z', () {
      expect(canRunPortably(actionById('archive-extract')!, FileKind.sevenZip), isFalse);
      expect(canRunPortably(actionById('archive-extract')!, FileKind.rar), isFalse);
      expect(canRunPortably(actionById('archive-to-7z')!, FileKind.zip), isFalse);
    });
  });

  group('converting', () {
    const files = {'a.txt': 'one', 'folder/b.txt': 'two'};

    test('TAR.GZ to ZIP keeps every file and its place', () async {
      final out = (await run('archive-to-zip', tarGzOf(files))).single;
      expect(out.name, 'box (converted).zip');
      expect(detectKind(out.bytes), FileKind.zip);
      expect(inZip(out), files);
    });

    test('TAR to ZIP', () async {
      expect(inZip((await run('archive-to-zip', tarOf(files))).single), files);
    });

    test('ZIP to TAR.GZ opens again', () async {
      final out = (await run('archive-to-targz', zipOf(files))).single;
      expect(out.name, 'box (converted).tar.gz');
      expect(detectKind(out.bytes), FileKind.gz);
      expect(inZip((await run('archive-to-zip', PortableFile(out.name, out.bytes))).single), files);
    });

    test('one gzipped file becomes a ZIP holding it, by its own name', () async {
      final gz = PortableFile(
        'notes.txt.gz',
        const GZipEncoder().encodeBytes(utf8.encode('hello')),
      );
      expect(inZip((await run('archive-to-zip', gz)).single), {'notes.txt': 'hello'});
    });

    test('the ./ that tar adds is left behind, but not the check behind it', () async {
      final archive = Archive()..addFile(ArchiveFile.directory('./'));
      archive.addFile(ArchiveFile.string('./a.txt', 'one'));
      final tar = PortableFile('box.tar', TarEncoder().encodeBytes(archive));
      final out = ZipDecoder().decodeBytes((await run('archive-to-zip', tar)).single.bytes);
      expect(out.files.map((f) => f.name), ['a.txt']);
      await expectLater(run('archive-extract', zipOf({'./../evil': 'x'})), failsSaying('outside'));
    });

    test('empty folders and dates survive', () async {
      final archive = Archive()..addFile(ArchiveFile.directory('empty/'));
      archive.addFile(ArchiveFile.string('a.txt', 'one')..lastModTime = 1000000000);
      final tar = PortableFile('box.tar', TarEncoder().encodeBytes(archive));
      final out = ZipDecoder().decodeBytes((await run('archive-to-zip', tar)).single.bytes);
      expect(out.files.where((f) => f.isDirectory).map((f) => f.name), ['empty/']);
      final copied = out.files.firstWhere((f) => f.name == 'a.txt');
      expect(copied.lastModTime, closeTo(1000000000, 2));
    });

    test('the input is not changed', () async {
      final source = zipOf(files);
      final before = Uint8List.fromList(source.bytes);
      await run('archive-to-targz', source);
      await run('archive-extract', source);
      expect(source.bytes, before);
    });
  });

  group('extracting', () {
    test('gives each file, flat, with its contents', () async {
      final out = await run('archive-extract', zipOf({'a.txt': 'one', 'deep/down/b.txt': 'two'}));
      expect(out.map((f) => f.name), ['a.txt', 'b.txt']);
      expect(utf8.decode(out.last.bytes), 'two');
    });

    test('works on TAR, TAR.GZ and a single gzipped file', () async {
      expect((await run('archive-extract', tarOf({'a.txt': 'one'}))).single.name, 'a.txt');
      expect((await run('archive-extract', tarGzOf({'a.txt': 'one'}))).single.name, 'a.txt');
      final gz = PortableFile(
        'notes.txt.gz',
        const GZipEncoder().encodeBytes(utf8.encode('hello')),
      );
      final out = (await run('archive-extract', gz)).single;
      expect(out.name, 'notes.txt');
      expect(utf8.decode(out.bytes), 'hello');
    });

    test('files with the same name in different folders stay apart', () async {
      final out = await run('archive-extract', zipOf({'a/same.txt': 'one', 'b/same.txt': 'two'}));
      expect(out.map((f) => f.name).toSet(), hasLength(2));
      expect(out.first.name, 'same.txt');
      expect(utf8.decode(out.last.bytes), 'two');
    });

    test('leaves out what macOS adds', () async {
      final out = await run(
        'archive-extract',
        zipOf({'a.txt': 'one', '__MACOSX/._a.txt': 'x', '.DS_Store': 'x'}),
      );
      expect(out.single.name, 'a.txt');
    });

    test('too many files says so', () async {
      final many = {for (var i = 0; i <= maxExtractedFiles; i++) '$i.txt': 'x'};
      await expectLater(run('archive-extract', zipOf(many)), failsSaying('too many'));
      // Converting still works, since that is one file.
      expect(
        inZip(
          (await run('archive-to-targz', zipOf(many)).then((out) {
            return run('archive-to-zip', out.single);
          })).single,
        ),
        hasLength(many.length),
      );
    });

    test('an empty archive says so', () async {
      await expectLater(run('archive-extract', zipOf({})), failsSaying('no files'));
    });
  });

  group('hostile and broken files', () {
    for (final name in [
      '../evil.txt',
      'a/../../evil.txt',
      '/etc/evil',
      r'..\evil.txt',
      'C:/evil',
    ]) {
      test('$name is refused', () async {
        await expectLater(run('archive-extract', zipOf({name: 'x'})), failsSaying('outside'));
        await expectLater(run('archive-to-targz', zipOf({name: 'x'})), failsSaying('outside'));
      });
    }

    test('a name with dots that does not leave is fine', () async {
      final out = await run('archive-extract', zipOf({'a..b/c..txt': 'x'}));
      expect(out.single.name, 'c..txt');
    });

    final action = actionById('archive-extract')!;
    final big = String.fromCharCodes(List.filled(1024 * 1024, 0x41));

    test('more than the limit stops, in a ZIP', () {
      expect(
        () => runArchive(action, zipOf({'a': big}), FileKind.zip, limit: 1024),
        failsSaying('too large'),
      );
    });

    test('the limit counts all the files together', () {
      final half = String.fromCharCodes(List.filled(800, 0x41));
      expect(
        () => runArchive(action, zipOf({'a': half, 'b': half}), FileKind.zip, limit: 1024),
        failsSaying('too large'),
      );
    });

    test('a ZIP that lies about its size still stops', () {
      final bytes = Uint8List.fromList(zipOf({'a': big}).bytes);
      final view = ByteData.sublistView(bytes);
      // Claim one byte, in both the entry's header and the list at the end of the file.
      view.setUint32(22, 1, Endian.little);
      for (var i = bytes.length - 22; i >= 0; i--) {
        if (view.getUint32(i, Endian.little) == 0x02014B50) {
          view.setUint32(i + 24, 1, Endian.little);
          break;
        }
      }
      Object? failure;
      List<PortableFile>? out;
      try {
        out = runArchive(action, PortableFile('box.zip', bytes), FileKind.zip, limit: 1024);
      } catch (error) {
        failure = error;
      }
      // Refused, or cut to what it claimed: never the whole megabyte.
      if (failure == null) {
        expect(out!.single.bytes.length, lessThanOrEqualTo(1024));
      } else {
        expect(failure, isA<EngineFailed>());
      }
    });

    test('more than the limit stops, in a GZ', () {
      final gz = PortableFile('a.gz', const GZipEncoder().encodeBytes(utf8.encode(big)));
      expect(() => runArchive(action, gz, FileKind.gz, limit: 1024), failsSaying('too large'));
    });

    test('a password says so', () async {
      final archive = archiveOf({'a.txt': 'secret'});
      final locked = ZipEncoder(password: 'pw').encodeBytes(archive);
      await expectLater(
        run('archive-extract', PortableFile('box.zip', locked)),
        failsSaying('password'),
      );
    });

    test('a damaged ZIP says so', () async {
      final bytes = Uint8List.fromList(zipOf({'a.txt': 'hello there'}).bytes);
      await expectLater(
        run('archive-extract', PortableFile('box.zip', bytes.sublist(0, 20))),
        failsSaying('damaged'),
      );
    });

    test('a cut-off GZ says so', () async {
      final gz = const GZipEncoder().encodeBytes(utf8.encode(big));
      final cut = PortableFile('a.gz', Uint8List.sublistView(gz, 0, gz.length ~/ 2));
      await expectLater(run('archive-extract', cut), failsSaying('damaged'));
    });
  });
}
