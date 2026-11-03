import 'dart:io';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/drop_files.dart';

void main() {
  group('reading dropped files', () {
    late Directory folder;

    setUp(() => folder = Directory.systemTemp.createTempSync('radial_drop_'));
    tearDown(() => folder.deleteSync(recursive: true));

    test('only the start is read, until it is needed', () async {
      final path = p.join(folder.path, 'photo.png');
      final bytes = img.encodePng(img.Image(width: 400, height: 400));
      File(path).writeAsBytesSync([...bytes, ...List.filled(detectHeadBytes * 2, 0)]);
      final picked = (await readDroppedFiles([DropItemFile(path)])).single;
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
      final picked = (await readDroppedFiles([DropItemFile(path)])).single;
      expect(picked.name, 'पोर्ट्रेट.txt');
      expect(picked.head.length, 2);
    });

    test('a file that has gone fails rather than pretending', () async {
      expect(readDroppedFiles([DropItemFile(p.join(folder.path, 'gone'))]), throwsA(anything));
    });
  });

  group('on the screen', () {
    final png = Uint8List.fromList(img.encodePng(img.Image(width: 4, height: 4)));

    PickedFile photo(String name) {
      return PickedFile(name: name, size: png.length, head: png, read: () async => png);
    }

    Future<void> pump(WidgetTester tester, DropReader reader, {bool? acceptsDrops = true}) {
      return tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (file) async => true,
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
      await pump(tester, (items) async => [photo('dropped.png')]);
      expect(find.textContaining('drop them'), findsOneWidget);
      await drop(tester, [DropItemFile('/x/dropped.png')]);
      expect(find.textContaining('dropped.png'), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
      expect(find.textContaining('drop them'), findsNothing);
    });

    testWidgets('a hint shows while dragging over, and goes', (tester) async {
      await pump(tester, (items) async => const []);
      final target = tester.widget<DropTarget>(find.byType(DropTarget));
      final here = DropEventDetails(localPosition: Offset.zero, globalPosition: Offset.zero);
      target.onDragEntered!(here);
      await tester.pump();
      expect(find.text('Drop to convert'), findsOneWidget);
      target.onDragExited!(here);
      await tester.pump();
      expect(find.text('Drop to convert'), findsNothing);
    });

    testWidgets('a folder alone says what to do', (tester) async {
      var read = false;
      await pump(tester, (items) async {
        read = true;
        return const [];
      });
      await drop(tester, [DropItemDirectory('/x/holiday', const [])]);
      expect(read, isFalse);
      expect(find.textContaining('Folders can\'t be dropped'), findsOneWidget);
    });

    testWidgets('a folder among files is left out, and says so', (tester) async {
      List<DropItem>? received;
      await pump(tester, (items) async {
        received = items;
        return [photo('a.png')];
      });
      await drop(tester, [DropItemFile('/x/a.png'), DropItemDirectory('/x/holiday', const [])]);
      expect(received!.single.path, '/x/a.png');
      expect(find.textContaining('a.png'), findsOneWidget);
      expect(find.textContaining('Folders were left out'), findsOneWidget);
    });

    testWidgets('files that can\'t be opened say so', (tester) async {
      await pump(tester, (items) async => throw const FileSystemException('gone'));
      await drop(tester, [DropItemFile('/x/gone.png')]);
      expect(find.textContaining('could not be opened'), findsOneWidget);
    });

    testWidgets('phones have nothing to drop on', (tester) async {
      await pump(tester, (items) async => const [], acceptsDrops: false);
      expect(find.byType(DropTarget), findsNothing);
      expect(find.textContaining('drop them'), findsNothing);
    });
  });
}
