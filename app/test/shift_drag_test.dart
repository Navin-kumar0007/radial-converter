import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/shift_drag.dart';

void main() {
  late Directory folder;

  setUp(() => folder = Directory.systemTemp.createTempSync('radial_shift_'));
  tearDown(() => folder.deleteSync(recursive: true));

  String aPhoto(String name) {
    final path = p.join(folder.path, name);
    File(path).writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
    return path;
  }

  group('saving beside the original', () {
    test('uses the name it was given', () async {
      final original = aPhoto('photo.png');
      final saved = await saveBesideOriginal(
        original,
        PortableFile('photo (converted).jpg', Uint8List.fromList([1, 2, 3])),
      );
      expect(p.basename(saved), 'photo (converted).jpg');
      expect(p.dirname(saved), folder.path);
      expect(File(saved).readAsBytesSync(), [1, 2, 3]);
    });

    test('never replaces anything already there', () async {
      final original = aPhoto('photo.png');
      final existing = p.join(folder.path, 'photo (converted).jpg');
      File(existing).writeAsBytesSync([9]);
      final file = PortableFile('photo (converted).jpg', Uint8List.fromList([1]));
      final second = await saveBesideOriginal(original, file);
      final third = await saveBesideOriginal(original, file);
      expect(File(existing).readAsBytesSync(), [9]);
      expect(second, isNot(existing));
      expect(third, isNot(second));
      expect(File(third).existsSync(), isTrue);
    });

    test('a file with the original\'s own name can\'t replace it', () async {
      final original = aPhoto('photo.png');
      final before = File(original).readAsBytesSync();
      final saved = await saveBesideOriginal(original, PortableFile('photo.png', Uint8List(1)));
      expect(saved, isNot(original));
      expect(File(original).readAsBytesSync(), before);
    });

    test('leaves no temporary file behind', () async {
      final original = aPhoto('photo.png');
      await saveBesideOriginal(original, PortableFile('out.jpg', Uint8List(1)));
      final names = folder.listSync().map((e) => p.basename(e.path)).toSet();
      expect(names, {'photo.png', 'out.jpg'});
    });

    test('a folder it can\'t write to fails in plain words', () async {
      await expectLater(
        saveBesideOriginal('/no/such/folder/a.png', PortableFile('b.png', Uint8List(1))),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('beside'))),
      );
    });
  });

  group('through the screen', () {
    late Future<List<RadialAction>> Function(List<String>) menuFor;
    late void Function(RadialAction, List<String>) chosen;
    var stopped = false;

    Future<void> pump(WidgetTester tester, {Converter? converter}) async {
      stopped = false;
      await tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (file) async => throw StateError('Nothing should ask to save'),
            mediaAvailable: false,
            acceptsDrops: false,
            sharedFiles: () => const Stream.empty(),
            converter:
                converter ??
                (action, files, onProgress, options) {
                  return runPortable(action, files, options: options);
                },
            shiftDrag: ({required menuFor, required chosen}) {
              // Named differently from the test's, so both are in reach.
              _capture(menuFor, chosen);
              return () => stopped = true;
            },
          ),
        ),
      );
      menuFor = _menuFor!;
      chosen = _chosen!;
    }

    testWidgets('the menu offers what runs at once, in few slices', (tester) async {
      await pump(tester);
      final path = aPhoto('photo.png');
      final actions = await tester.runAsync(() => menuFor([path]));
      expect(actions, isNotEmpty);
      expect(actions!.length, lessThanOrEqualTo(8));
      expect(actions.map((a) => a.id), isNot(contains('image-crop')));
    });

    testWidgets('a file nothing can convert offers nothing', (tester) async {
      await pump(tester);
      final path = p.join(folder.path, 'notes.xyz');
      File(path).writeAsBytesSync(List.filled(100, 200));
      expect(await tester.runAsync(() => menuFor([path])), isEmpty);
    });

    testWidgets('a file that has gone offers nothing rather than failing', (tester) async {
      await pump(tester);
      expect(await tester.runAsync(() => menuFor([p.join(folder.path, 'gone.png')])), isEmpty);
    });

    testWidgets('choosing a slice saves beside the original, with no dialog', (tester) async {
      await pump(tester);
      final path = aPhoto('photo.png');
      final before = File(path).readAsBytesSync();
      // Real file work, outside the test's fake clock. The screen updates just after the file lands.
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [path]));
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().isEmpty; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
      final result = File(p.join(folder.path, 'photo (converted).jpg'));
      expect(result.existsSync(), isTrue);
      expect(detectKind(result.readAsBytesSync()), FileKind.jpg);
      expect(File(path).readAsBytesSync(), before);
      expect(find.textContaining('Saved beside the original'), findsOneWidget);
    });

    testWidgets('a folder dragged in offers what its files can do', (tester) async {
      await pump(tester);
      final holiday = Directory(p.join(folder.path, 'holiday'))..createSync();
      File(p.join(holiday.path, 'a.png'))
          .writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
      final actions = await tester.runAsync(() => menuFor([holiday.path]));
      expect(actions, isNotEmpty);
    });

    testWidgets('a folder\'s results go beside each file', (tester) async {
      await pump(tester);
      final holiday = Directory(p.join(folder.path, 'holiday'))..createSync();
      final bytes = img.encodePng(img.Image(width: 8, height: 8));
      File(p.join(holiday.path, 'a.png')).writeAsBytesSync(bytes);
      File(p.join(holiday.path, 'b.png')).writeAsBytesSync(bytes);
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [holiday.path]));
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().length < 2; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
      final names = holiday.listSync().map((e) => p.basename(e.path)).toSet();
      expect(names, {'a.png', 'b.png', 'a (converted).jpg', 'b (converted).jpg'});
    });

    Future<void> untilSaved(WidgetTester tester, int count) async {
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().length < count; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
    }

    testWidgets('after a damaged file each result still goes beside its own original', (
      tester,
    ) async {
      var shown = 0;
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(shiftDragChannel, (
        call,
      ) async {
        if (call.method == 'showWindow') shown++;
        return null;
      });
      addTearDown(() {
        tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(shiftDragChannel, null);
      });
      await pump(tester);
      final bad = Directory(p.join(folder.path, 'bad'))..createSync();
      final good = Directory(p.join(folder.path, 'good'))..createSync();
      final broken = p.join(bad.path, 'same.png');
      File(broken).writeAsBytesSync([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3]);
      final fine = p.join(good.path, 'same.png');
      File(fine).writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [broken, fine]));
      await untilSaved(tester, 1);
      expect(bad.listSync().map((e) => p.basename(e.path)), ['same.png']);
      expect(good.listSync().map((e) => p.basename(e.path)).toSet(), {
        'same.png',
        'same (converted).jpg',
      });
      expect(find.textContaining('could not be read as a picture'), findsOneWidget);
      // Only these have a window to bring forward. Elsewhere there's no Shift-drag to come from.
      final hasWindow = Platform.isMacOS || Platform.isWindows;
      expect(
        shown,
        hasWindow ? 1 : 0,
        reason: 'The window comes forward, or nobody learns a file failed',
      );
    });

    testWidgets('making one PDF still takes all the files together', (tester) async {
      final calls = <int>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          calls.add(files.length);
          return runPortable(action, files, options: options);
        },
      );
      final paths = [aPhoto('a.png'), aPhoto('b.png')];
      await tester.runAsync(() async => chosen(actionById('images-to-pdf')!, paths));
      await untilSaved(tester, 1);
      expect(calls, [2]);
      expect(folder.listSync().where((e) => e.path.endsWith('.pdf')), hasLength(1));
    });

    testWidgets('it stops listening when the screen goes', (tester) async {
      await pump(tester);
      await tester.pumpWidget(const SizedBox());
      expect(stopped, isTrue);
    });
  });
}

Future<List<RadialAction>> Function(List<String>)? _menuFor;
void Function(RadialAction, List<String>)? _chosen;

void _capture(
  Future<List<RadialAction>> Function(List<String>) menuFor,
  void Function(RadialAction, List<String>) chosen,
) {
  _menuFor = menuFor;
  _chosen = chosen;
}
