// Reads real 7z and RAR files with real libarchive. Skipped on a computer that has none: macOS always
// does, and CI points LIBARCHIVE_PATH at the copy the Windows app ships.

import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:crypto/crypto.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

String sample(String name) => p.join('..', 'test-files', name);

Archive opened(List<int> zip) => ZipDecoder().decodeBytes(zip);

void main() {
  // Windows has other programs' copies around, which aren't what ships.
  final skip = Platform.isWindows && Platform.environment['LIBARCHIVE_PATH'] == null
      ? 'Only the copy the app ships counts on Windows'
      : libarchiveAvailable()
      ? null
      : 'No libarchive on this computer';

  group('reading what only libarchive can', skip: skip, () {
    test('a RAR 4, with only its real files', () async {
      final archive = opened(await unpackToZip(sample('sample-rar4.rar')));
      expect(archive.files.map((file) => file.name).toSet(), {'test.txt', 'testdir/test.txt'});
      expect(utf8.decode(archive.findFile('test.txt')!.readBytes()!), 'test text document\r\n');
    });

    test('links stay out, so they can\'t point anywhere', () async {
      final archive = opened(await unpackToZip(sample('sample-rar4.rar')));
      expect(archive.findFile('testlink'), isNull);
      expect(archive.files.every((file) => file.isFile && !file.isSymbolicLink), isTrue);
    });

    test('a compressed RAR 5, byte for byte', () async {
      final file = opened(await unpackToZip(sample('sample-rar5.rar'))).files.single;
      expect(file.name, 'test.bin');
      expect(
        sha256.convert(file.readBytes()!).toString(),
        '588870a2dade35c2650fbb7898c9a9c7f21fce7c281198604e8d0c9737f2c375',
      );
    });

    test('a 7z using LZMA2, byte for byte', () async {
      final file = opened(await unpackToZip(sample('sample-lzma2.7z'))).files.single;
      expect(file.name, 'file1');
      expect(
        sha256.convert(file.readBytes()!).toString(),
        'ea4bf20fca5f07682e1f15e766509ead7ff97c17ae51f33f226da7194c68fca2',
      );
    });

    test('a file named in Hindi keeps its name', () async {
      final file = opened(await unpackToZip(sample('sample-hindi.7z'))).files.single;
      expect(file.name, 'पोर्ट्रेट.txt');
      expect(utf8.decode(file.readBytes()!), 'नमस्ते दुनिया\n');
      // Linux isn't shipped to, and libarchive needs a locale there that nothing here sets.
    }, skip: Platform.isLinux ? 'Needs a UTF-8 locale on Linux' : false);

    test('a name that can\'t be read doesn\'t lose its file', () async {
      final file = opened(await unpackToZip(sample('sample-hindi.7z'))).files.single;
      expect(utf8.decode(file.readBytes()!), 'नमस्ते दुनिया\n');
    });

    test('the original is only read', () async {
      final before = File(sample('sample-rar5.rar')).readAsBytesSync();
      await unpackToZip(sample('sample-rar5.rar'));
      expect(File(sample('sample-rar5.rar')).readAsBytesSync(), before);
    });

    test('what comes out runs through the same engine as any ZIP', () async {
      final zip = await unpackToZip(sample('sample-lzma2.7z'));
      final out = await runPortable(actionById('archive-extract')!, [
        PortableFile('sample-lzma2.7z', zip),
      ]);
      expect(out.single.name, 'file1');
      expect(out.single.bytes.length, 2844);
    });

    group('hostile and broken files', () {
      late Directory folder;
      setUp(() => folder = Directory.systemTemp.createTempSync('radial_archive_'));
      tearDown(() => folder.deleteSync(recursive: true));

      test('what really comes out is counted, whatever the archive claims', () async {
        await expectLater(
          unpackToZip(sample('sample-rar5.rar'), limit: 100),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('too large'))),
        );
      });

      test('a real bomb stops at the limit: 163 KB that opens to 1.1 GB', () async {
        await expectLater(
          unpackToZip(sample('sample-bomb.7z')),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('too large'))),
        );
      }, timeout: const Timeout(Duration(minutes: 2)));

      test('exactly at the limit is fine', () async {
        final zip = await unpackToZip(sample('sample-rar5.rar'), limit: 1200);
        expect(opened(zip).files.single.size, 1200);
      });

      test('a locked RAR says so', () async {
        await expectLater(
          unpackToZip(sample('sample-locked.rar')),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('password'))),
        );
      });

      test('a locked 7z says so', () async {
        await expectLater(
          unpackToZip(sample('sample-locked.7z')),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('password'))),
        );
      });

      test('a cut-off file is a plain error, not a crash', () async {
        final bytes = File(sample('sample-rar5.rar')).readAsBytesSync();
        final cut = p.join(folder.path, 'cut.rar');
        File(cut).writeAsBytesSync(bytes.sublist(0, bytes.length ~/ 2));
        await expectLater(
          unpackToZip(cut),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('damaged'))),
        );
      });

      test('one flipped byte is a plain error, not a wrong file', () async {
        final bytes = File(sample('sample-rar5.rar')).readAsBytesSync();
        bytes[bytes.length ~/ 2] ^= 0xFF;
        final flipped = p.join(folder.path, 'flipped.rar');
        File(flipped).writeAsBytesSync(bytes);
        await expectLater(unpackToZip(flipped), throwsA(isA<EngineFailed>()));
      });

      test('rubbish with the right start is a plain error, not a crash', () async {
        final fake = p.join(folder.path, 'fake.7z');
        File(fake).writeAsBytesSync([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C, ...List.filled(500, 7)]);
        await expectLater(unpackToZip(fake), throwsA(isA<EngineFailed>()));
      });

      test('a file that has gone is a plain error', () async {
        await expectLater(
          unpackToZip(p.join(folder.path, 'gone.rar')),
          throwsA(isA<EngineFailed>()),
        );
      });

      test('a Hindi file name opens', () async {
        final named = p.join(folder.path, 'फ़ाइल.rar');
        File(sample('sample-rar5.rar')).copySync(named);
        expect(opened(await unpackToZip(named)).files.single.name, 'test.bin');
      });
    });
  });

  group('which actions run', () {
    for (final kind in [FileKind.sevenZip, FileKind.rar]) {
      test('$kind opens but is never written', () {
        for (final id in ['archive-extract', 'archive-to-zip', 'archive-add-password']) {
          expect(canRunUnpacked(actionById(id)!, kind), isTrue, reason: id);
        }
        expect(canRunUnpacked(actionById('archive-to-7z')!, kind), isFalse);
      });
    }

    test('other kinds don\'t come this way', () {
      expect(canRunUnpacked(actionById('archive-extract')!, FileKind.zip), isFalse);
      expect(canRunUnpacked(actionById('image-to-jpg')!, FileKind.rar), isFalse);
    });
  });
}
