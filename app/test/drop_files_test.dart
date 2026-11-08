import 'dart:io';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/conversion.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/drop_files.dart';
import 'package:shiftdrop/words.dart';

void main() {
  group('reading dropped files', () {
    late Directory folder;

    setUp(() => folder = Directory.systemTemp.createTempSync('radial_drop_'));
    tearDown(() => folder.deleteSync(recursive: true));

    test('only the start is read, until it is needed', () async {
      final path = p.join(folder.path, 'photo.png');
      final bytes = img.encodePng(img.Image(width: 400, height: 400));
      File(path).writeAsBytesSync([...bytes, ...List.filled(detectHeadBytes * 2, 0)]);
      final picked = (await readDroppedFiles([DropItemFile(path)])).loose.single;
      expect(picked.name, 'photo.png');
      expect(picked.path, path);
      expect(picked.size, File(path).lengthSync());
      expect(picked.head.length, detectHeadBytes);
      expect(detectKind(picked.head), FileKind.png);
      expect(await picked.read(), File(path).readAsBytesSync());
    });

    test('a small file is read whole, and has a name with no folder in it', () async {
      final path = p.join(folder.path, 'पोर्ट्रेट.txt');
      File(path).writeAsStringSync('hi');
      final picked = (await readDroppedFiles([DropItemFile(path)])).loose.single;
      expect(picked.name, 'पोर्ट्रेट.txt');
      expect(picked.head.length, 2);
    });

    test('a file that has gone fails rather than pretending', () async {
      expect(readDroppedFiles([DropItemFile(p.join(folder.path, 'gone'))]), throwsA(anything));
    });

    group('folders', () {
      void write(String relative) {
        final file = File(p.join(folder.path, relative));
        file.parent.createSync(recursive: true);
        file.writeAsStringSync(relative);
      }

      List<String> names(List<PickedFile> files) => [for (final file in files) file.name];

      test('everything inside is found, in order, deeper folders too', () async {
        write('holiday/b.txt');
        write('holiday/a.txt');
        write('holiday/day 2/c.txt');
        final dropped = await readDroppedFiles([
          DropItemDirectory(p.join(folder.path, 'holiday'), const []),
        ]);
        expect(dropped.loose, isEmpty);
        expect(dropped.folders, 1);
        expect(names(dropped.inFolders), ['a.txt', 'b.txt', 'c.txt']);
        expect(dropped.inFolders.first.path, p.join(folder.path, 'holiday', 'a.txt'));
        expect(dropped.tooMany, isFalse);
      });

      test('a folder that arrives looking like a file is still a folder, as on Windows', () async {
        write('holiday/a.txt');
        final dropped = await readDroppedFiles([DropItemFile(p.join(folder.path, 'holiday'))]);
        expect(dropped.loose, isEmpty);
        expect(names(dropped.inFolders), ['a.txt']);
      });

      test('hidden files and hidden folders stay out', () async {
        write('holiday/.DS_Store');
        write('holiday/Thumbs.db');
        write('holiday/.git/config');
        write('holiday/a.txt');
        final dropped = await readDroppedFiles([DropItemFile(p.join(folder.path, 'holiday'))]);
        expect(names(dropped.inFolders), ['a.txt']);
      });

      test('a link is not followed, so a loop can\'t trap it', () async {
        write('holiday/a.txt');
        write('elsewhere/secret.txt');
        Link(p.join(folder.path, 'holiday', 'loop')).createSync(p.join(folder.path, 'holiday'));
        Link(p.join(folder.path, 'holiday', 'out')).createSync(p.join(folder.path, 'elsewhere'));
        final dropped = await readDroppedFiles([DropItemFile(p.join(folder.path, 'holiday'))]);
        expect(names(dropped.inFolders), ['a.txt']);
      }, skip: Platform.isWindows ? 'Links need extra rights on Windows' : false);

      test('an empty folder is still known to have been dropped', () async {
        Directory(p.join(folder.path, 'empty')).createSync();
        final dropped = await readDroppedFiles([DropItemFile(p.join(folder.path, 'empty'))]);
        expect(dropped.inFolders, isEmpty);
        expect(dropped.folders, 1);
      });

      test('a huge folder stops at the limit and says so', () async {
        for (var i = 0; i < maxFolderFiles + 5; i++) {
          write('huge/$i.txt');
        }
        final dropped = await readDroppedFiles([DropItemFile(p.join(folder.path, 'huge'))]);
        expect(dropped.inFolders, hasLength(maxFolderFiles));
        expect(dropped.tooMany, isTrue);
      });

      test('files and folders can arrive together', () async {
        write('loose.txt');
        write('holiday/a.txt');
        final dropped = await readDroppedFiles([
          DropItemFile(p.join(folder.path, 'loose.txt')),
          DropItemFile(p.join(folder.path, 'holiday')),
        ]);
        expect(names(dropped.loose), ['loose.txt']);
        expect(names(dropped.inFolders), ['a.txt']);
      });
    });
  });

  group('on the screen', () {
    final png = Uint8List.fromList(img.encodePng(img.Image(width: 4, height: 4)));

    PickedFile photo(String name) {
      return PickedFile(name: name, size: png.length, head: png, read: () async => png);
    }

    PickedFile pdf(String name) {
      final bytes = Uint8List.fromList('%PDF-1.7 ...'.codeUnits);
      return PickedFile(name: name, size: bytes.length, head: bytes, read: () async => bytes);
    }

    PickedFile mystery(String name) {
      final bytes = Uint8List.fromList(List.filled(32, 0));
      return PickedFile(name: name, size: bytes.length, head: bytes, read: () async => bytes);
    }

    Future<void> pump(WidgetTester tester, DropReader reader, {bool? acceptsDrops = true}) {
      return tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (file) async => const SavedAs(),
            mediaAvailable: false,
            dropReader: reader,
            acceptsDrops: acceptsDrops,
          ),
        ),
      );
    }

    Future<void> drop(WidgetTester tester, List<DropItem> items) async {
      final target = tester.widget<DropTarget>(find.byType(DropTarget));
      target.onDragDone!(
        DropDoneDetails(files: items, localPosition: Offset.zero, globalPosition: Offset.zero),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
    }

    testWidgets('dropped files open the menu, as chosen ones do', (tester) async {
      await pump(tester, (items) async => DroppedFiles(loose: [photo('dropped.png')]));
      expect(find.textContaining('drop them'), findsOneWidget);
      await drop(tester, [DropItemFile('/x/dropped.png')]);
      expect(find.textContaining('dropped.png'), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
      expect(find.textContaining('drop them'), findsNothing);
    });

    testWidgets('a hint shows while dragging over, and goes', (tester) async {
      await pump(tester, (items) async => const DroppedFiles());
      final target = tester.widget<DropTarget>(find.byType(DropTarget));
      final here = DropEventDetails(localPosition: Offset.zero, globalPosition: Offset.zero);
      target.onDragEntered!(here);
      await tester.pump();
      expect(find.text('Drop to convert'), findsOneWidget);
      target.onDragExited!(here);
      await tester.pump();
      expect(find.text('Drop to convert'), findsNothing);
    });

    testWidgets('a folder opens the files inside, as chosen ones do', (tester) async {
      await pump(
        tester,
        (items) async => DroppedFiles(inFolders: [photo('a.png'), photo('b.png')], folders: 1),
      );
      await drop(tester, [DropItemDirectory('/x/holiday', const [])]);
      expect(find.textContaining('2 files'), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
      expect(find.byType(SnackBar), findsNothing);
    });

    testWidgets('files in a folder that don\'t go with the rest are left out, and it says so', (
      tester,
    ) async {
      await pump(
        tester,
        (items) async => DroppedFiles(
          inFolders: [photo('a.png'), pdf('notes.pdf'), photo('b.png'), mystery('data.bin')],
          folders: 1,
        ),
      );
      await drop(tester, [DropItemDirectory('/x/holiday', const [])]);
      expect(find.textContaining('2 files'), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
      expect(find.textContaining('2 other files in that folder were left out'), findsOneWidget);
    });

    testWidgets('one file left out reads properly', (tester) async {
      await pump(
        tester,
        (items) async => DroppedFiles(inFolders: [photo('a.png'), pdf('notes.pdf')], folders: 1),
      );
      await drop(tester, [DropItemDirectory('/x/holiday', const [])]);
      expect(find.textContaining('1 other file in that folder was left out'), findsOneWidget);
    });

    testWidgets('files dropped by hand all stay, even if they don\'t go together', (tester) async {
      await pump(tester, (items) async => DroppedFiles(loose: [photo('a.png'), pdf('notes.pdf')]));
      await drop(tester, [DropItemFile('/x/a.png'), DropItemFile('/x/notes.pdf')]);
      expect(find.textContaining('2 files'), findsOneWidget);
      expect(find.byType(SnackBar), findsNothing);
    });

    testWidgets('a folder with nothing usable says so and opens nothing', (tester) async {
      await pump(
        tester,
        (items) async => DroppedFiles(inFolders: [mystery('data.bin')], folders: 1),
      );
      await drop(tester, [DropItemDirectory('/x/junk', const [])]);
      expect(find.textContaining('Nothing in that folder'), findsOneWidget);
      expect(find.text('WhatsApp'), findsNothing);
    });

    testWidgets('an empty folder says so too', (tester) async {
      await pump(tester, (items) async => const DroppedFiles(folders: 1));
      await drop(tester, [DropItemDirectory('/x/empty', const [])]);
      expect(find.textContaining('Nothing in that folder'), findsOneWidget);
    });

    testWidgets('a folder too big to open whole says so', (tester) async {
      await pump(
        tester,
        (items) async => DroppedFiles(inFolders: [photo('a.png')], folders: 1, tooMany: true),
      );
      await drop(tester, [DropItemDirectory('/x/huge', const [])]);
      expect(find.textContaining('Only the first $maxFolderFiles files'), findsOneWidget);
    });

    testWidgets('files that can\'t be opened say so', (tester) async {
      await pump(tester, (items) async => throw const FileSystemException('gone'));
      await drop(tester, [DropItemFile('/x/gone.png')]);
      expect(find.textContaining('could not be opened'), findsOneWidget);
    });

    testWidgets('phones have nothing to drop on', (tester) async {
      await pump(tester, (items) async => const DroppedFiles(), acceptsDrops: false);
      expect(find.byType(DropTarget), findsNothing);
      expect(find.textContaining('drop them'), findsNothing);
    });
  });
}
