import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/radial_menu.dart';

Uint8List jpeg() => img.encodeJpg(img.Image(width: 64, height: 48));

// An MP4 header: size, ftyp, brand.
final _mp4 = Uint8List.fromList(const [
  0,
  0,
  0,
  16,
  0x66,
  0x74,
  0x79,
  0x70,
  0x69,
  0x73,
  0x6F,
  0x6D,
  0,
  0,
  0,
  0,
]);

void main() {
  late List<PortableFile> toPick;
  late List<PortableFile> saved;
  late bool saveWorks;

  setUp(() {
    toPick = [PortableFile('photo.jpg', jpeg())];
    saved = [];
    saveWorks = true;
  });

  Future<void> pump(WidgetTester tester, {Converter? converter}) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ConverterScreen(
          pickFiles: () async => toPick,
          saveFile: (file) async {
            if (saveWorks) saved.add(file);
            return saveWorks;
          },
          // Isolates need real time, so tests run the conversion directly.
          converter: converter ?? (action, files) => runPortable(action, files),
        ),
      ),
    );
  }

  /// Lets real conversion work finish, outside the test's fake clock.
  Future<void> settleWork(WidgetTester tester) async {
    await tester.pump(const Duration(milliseconds: 50));
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 300)));
    await tester.pump(const Duration(milliseconds: 50));
  }

  Future<void> chooseFiles(WidgetTester tester) async {
    await tester.tap(find.textContaining('hoose'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
  }

  Future<void> selectFirstSlice(WidgetTester tester) async {
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
  }

  testWidgets('starts with only the button', (tester) async {
    await pump(tester);
    expect(find.text('Choose files'), findsOneWidget);
    expect(find.byType(RadialMenu), findsNothing);
  });

  testWidgets('cancelling the file dialog changes nothing', (tester) async {
    toPick = [];
    await pump(tester);
    await chooseFiles(tester);
    expect(find.byType(RadialMenu), findsNothing);
    expect(find.text('Choose files'), findsOneWidget);
  });

  testWidgets('picking a file opens the menu and names the file', (tester) async {
    await pump(tester);
    await chooseFiles(tester);
    expect(find.byType(RadialMenu), findsOneWidget);
    expect(find.textContaining('photo.jpg'), findsOneWidget);
  });

  testWidgets('the whole trip: pick, convert for real, see sizes, save', (tester) async {
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester); // PNG comes first for a JPG
    await settleWork(tester);

    expect(find.text('photo (converted).png'), findsOneWidget);
    expect(find.textContaining(RegExp(r'\d (B|KB|MB) to \d')), findsOneWidget);
    expect(saved, isEmpty, reason: 'nothing saves until asked');

    await tester.tap(find.byTooltip('Save'));
    await tester.pump();
    expect(saved.single.name, 'photo (converted).png');
    expect(detectKind(saved.single.bytes), FileKind.png);
    expect(find.textContaining('Saved'), findsOneWidget);
  });

  testWidgets('cancelling the save dialog does not claim it saved', (tester) async {
    saveWorks = false;
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    await tester.tap(find.byTooltip('Save'));
    await tester.pump();
    expect(find.textContaining('Saved'), findsNothing);
  });

  testWidgets('a failed save says so and keeps the result', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ConverterScreen(
          pickFiles: () async => toPick,
          saveFile: (file) async => throw StateError('disk full'),
          converter: (action, files) => runPortable(action, files),
        ),
      ),
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    await tester.tap(find.byTooltip('Save'));
    await tester.pump();
    expect(find.textContaining('could not be saved'), findsOneWidget);
    expect(find.textContaining('disk full'), findsNothing);
    expect(find.byTooltip('Save'), findsOneWidget);
  });

  testWidgets('the result does not fade, because it is not saved yet', (tester) async {
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    await tester.pump(const Duration(minutes: 5));
    expect(find.text('photo (converted).png'), findsOneWidget);
  });

  testWidgets('a batch gets one chip per file, each saved separately', (tester) async {
    toPick = [PortableFile('a.jpg', jpeg()), PortableFile('b.jpg', jpeg())];
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.text('a (converted).png'), findsOneWidget);
    expect(find.text('b (converted).png'), findsOneWidget);
    await tester.tap(find.byTooltip('Save').last);
    await tester.pump();
    expect(saved.single.name, 'b (converted).png');
  });

  testWidgets('a bad file shows why, in plain words', (tester) async {
    await pump(
      tester,
      converter: (action, files) async => throw const EngineFailed('Try another picture.'),
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.text('Try another picture.'), findsOneWidget);
    expect(find.byTooltip('Save'), findsNothing);
  });

  testWidgets('an unexpected error does not show technical text', (tester) async {
    await pump(tester, converter: (action, files) async => throw StateError('stack internals'));
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.textContaining('stack internals'), findsNothing);
    expect(find.textContaining('could not be converted'), findsOneWidget);
  });

  testWidgets('a file this build cannot handle says so', (tester) async {
    toPick = [PortableFile('clip.mp4', _mp4)];
    await pump(tester);
    await chooseFiles(tester);
    expect(find.textContaining('not available in this build'), findsOneWidget);
    expect(find.text('Nothing fits'), findsOneWidget);
  });

  testWidgets('the mode switch changes the slices', (tester) async {
    await pump(tester);
    await chooseFiles(tester);
    expect(find.text('Rotate'), findsNothing);
    await tester.tap(find.text('Tools'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('Rotate'), findsOneWidget);
  });

  testWidgets('a slow job finishing after new files are picked is ignored', (tester) async {
    await pump(
      tester,
      converter: (action, files) {
        return Future<List<PortableFile>>.delayed(
          const Duration(seconds: 5),
          () => [PortableFile('old (converted).png', files.first.bytes)],
        );
      },
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await tester.pump(const Duration(milliseconds: 50));
    toPick = [PortableFile('new.jpg', jpeg())];
    await chooseFiles(tester);
    await tester.pump(const Duration(seconds: 6));
    expect(find.text('old (converted).png'), findsNothing);
    expect(find.textContaining('new.jpg'), findsOneWidget);
  });

  group('availableActions', () {
    test('runs on every platform and needs no extra screen', () {
      final ids = availableActions(const [FileKind.jpg], ActionMode.tools).map((a) => a.id);
      expect(ids, contains('image-rotate'));
      expect(ids, isNot(contains('image-crop')));
    });

    test('video has nothing yet', () {
      expect(availableActions(const [FileKind.mp4], ActionMode.convert), isEmpty);
      expect(availableActions(const [FileKind.mp4], ActionMode.tools), isEmpty);
    });

    test('a mix must all be supported', () {
      expect(availableActions(const [FileKind.jpg, FileKind.heic], ActionMode.convert), isEmpty);
    });
  });

  test('the release web page may only connect to itself', () {
    final script = File('tool/build_web.sh').readAsStringSync();
    expect(script, contains('--no-web-resources-cdn'));
    expect(script, contains('Content-Security-Policy'));
    expect(script, contains("connect-src 'self'"));
    expect(script, contains("default-src 'self'"));
  });

  test('every character the app writes is in a font we ship', () {
    // Anything else makes Flutter fetch a font from Google in a browser.
    for (final file in Directory('lib').listSync(recursive: true).whereType<File>()) {
      final odd = file.readAsStringSync().runes.where(
        (c) => c > 0xFF && !(c >= 0x900 && c <= 0x97F),
      );
      expect(odd, isEmpty, reason: file.path);
    }
  });

  test('formatBytes picks a sensible unit', () {
    expect(formatBytes(512), '512 B');
    expect(formatBytes(2048), '2 KB');
    expect(formatBytes(2621440), '2.5 MB');
  });
}
