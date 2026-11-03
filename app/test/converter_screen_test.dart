import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/radial_menu.dart';

/// A picked file, counting how many times it is really read.
PickedFile picked(String name, Uint8List bytes, {int? size, void Function()? onRead}) {
  return PickedFile(
    name: name,
    size: size ?? bytes.length,
    head: bytes.length <= detectHeadBytes ? bytes : bytes.sublist(0, detectHeadBytes),
    read: () async {
      onRead?.call();
      return bytes;
    },
  );
}

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
  late List<PickedFile> toPick;
  late List<PortableFile> saved;
  late bool saveWorks;

  setUp(() {
    toPick = [picked('photo.jpg', jpeg())];
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
          mediaAvailable: false,
          // Isolates need real time, so tests run the conversion directly.
          converter:
              converter ??
              (action, files, onProgress) => runPortable(action, files, onProgress: onProgress),
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
          mediaAvailable: false,
          converter: (action, files, onProgress) => runPortable(action, files),
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
    toPick = [picked('a.jpg', jpeg()), picked('b.jpg', jpeg())];
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
      converter: (action, files, onProgress) async =>
          throw const EngineFailed('Try another picture.'),
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.text('Try another picture.'), findsOneWidget);
    expect(find.byTooltip('Save'), findsNothing);
  });

  testWidgets('an unexpected error does not show technical text', (tester) async {
    await pump(
      tester,
      converter: (action, files, onProgress) async => throw StateError('stack internals'),
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.textContaining('stack internals'), findsNothing);
    expect(find.textContaining('could not be converted'), findsOneWidget);
  });

  testWidgets('a file this build cannot handle says so', (tester) async {
    toPick = [picked('clip.mp4', _mp4)];
    await pump(tester);
    await chooseFiles(tester);
    expect(find.textContaining("can't be converted in this build"), findsOneWidget);
    expect(find.text('Nothing fits'), findsOneWidget);
  });

  testWidgets('a file we cannot convert is never read', (tester) async {
    var reads = 0;
    toPick = [picked('clip.mp4', _mp4, size: 5 * 1024 * 1024 * 1024, onRead: () => reads++)];
    await pump(tester);
    await chooseFiles(tester);
    expect(find.textContaining('5.0 GB'), findsOneWidget);
    expect(reads, 0);
  });

  testWidgets('a picture is read only once a slice is chosen', (tester) async {
    var reads = 0;
    toPick = [picked('photo.jpg', jpeg(), onRead: () => reads++)];
    await pump(tester);
    await chooseFiles(tester);
    expect(reads, 0);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(reads, 1);
  });

  testWidgets('a picture too large for memory says so, without reading it', (tester) async {
    var reads = 0;
    toPick = [picked('giant.jpg', jpeg(), size: maxInMemoryBytes + 1, onRead: () => reads++)];
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.textContaining('too large'), findsOneWidget);
    expect(reads, 0);
  });

  testWidgets('a file that cannot be read says so', (tester) async {
    toPick = [
      PickedFile(name: 'gone.jpg', size: 10, head: jpeg(), read: () async => throw StateError('x')),
    ];
    await pump(tester);
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.textContaining('could not be read'), findsOneWidget);
  });

  testWidgets('a file dialog that fails says so instead of doing nothing', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ConverterScreen(
          pickFiles: () async => throw StateError('no access'),
          saveFile: (file) async => false,
          mediaAvailable: false,
        ),
      ),
    );
    await chooseFiles(tester);
    expect(find.textContaining('could not be opened'), findsOneWidget);
    expect(find.textContaining('no access'), findsNothing);
  });

  testWidgets('real progress shows on the ring', (tester) async {
    late void Function(double) report;
    final finish = Completer<List<PortableFile>>();
    await pump(
      tester,
      converter: (action, files, onProgress) {
        report = onProgress;
        return finish.future;
      },
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await settleWork(tester);
    final ring = find.byType(CircularProgressIndicator);
    expect(tester.widget<CircularProgressIndicator>(ring).value, isNull);
    report(0.5);
    await tester.pump();
    expect(tester.widget<CircularProgressIndicator>(ring).value, 0.5);
    finish.complete([PortableFile('done.png', jpeg())]);
    await tester.pump();
    await tester.pump();
    expect(find.text('done.png'), findsOneWidget);
  });

  testWidgets('a PDF gets a menu, and its note shows', (tester) async {
    final pdfBytes = Uint8List.fromList(utf8.encode('%PDF-1.7 pretend'));
    toPick = [picked('form.pdf', pdfBytes)];
    await tester.pumpWidget(
      MaterialApp(
        home: ConverterScreen(
          pickFiles: () async => toPick,
          saveFile: (file) async => true,
          mediaAvailable: false,
          pdfConverter: (action, files, onProgress) async => [
            PdfResult(
              PortableFile('form (converted).jpg', pdfBytes),
              note: 'Pages are now pictures.',
            ),
          ],
        ),
      ),
    );
    await chooseFiles(tester);
    expect(find.text('JPG'), findsOneWidget);
    await selectFirstSlice(tester);
    await settleWork(tester);
    expect(find.textContaining('Pages are now pictures.'), findsOneWidget);
    expect(find.byTooltip('Save'), findsOneWidget);
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
      converter: (action, files, onProgress) {
        return Future<List<PortableFile>>.delayed(
          const Duration(seconds: 5),
          () => [PortableFile('old (converted).png', files.first.bytes)],
        );
      },
    );
    await chooseFiles(tester);
    await selectFirstSlice(tester);
    await tester.pump(const Duration(milliseconds: 50));
    toPick = [picked('new.jpg', jpeg())];
    await chooseFiles(tester);
    await tester.pump(const Duration(seconds: 6));
    expect(find.text('old (converted).png'), findsNothing);
    expect(find.textContaining('new.jpg'), findsOneWidget);
  });

  group('availableActions', () {
    test('runs on every platform and needs no extra screen', () {
      final ids = availableActions(
        const [FileKind.jpg],
        ActionMode.tools,
        mediaAvailable: false,
      ).map((a) => a.id);
      expect(ids, contains('image-rotate'));
      expect(ids, isNot(contains('image-crop')));
    });

    test('video needs the platform engine', () {
      expect(
        availableActions(const [FileKind.mp4], ActionMode.convert, mediaAvailable: false),
        isEmpty,
      );
      final withEngine = availableActions(
        const [FileKind.mp4],
        ActionMode.convert,
        mediaAvailable: true,
      ).map((a) => a.id);
      expect(withEngine, contains('fit-whatsapp-video'));
      expect(withEngine, isNot(contains('video-to-mp4')));
    });

    test('PDFs run without the video engine', () {
      final ids = availableActions(
        const [FileKind.pdf],
        ActionMode.convert,
        mediaAvailable: false,
      ).map((a) => a.id);
      expect(ids, containsAll(['pdf-to-jpg', 'fit-pdf-100kb']));
    });

    test('actions needing a screen stay hidden', () {
      final tools = availableActions(
        const [FileKind.mp4],
        ActionMode.tools,
        mediaAvailable: true,
      ).map((a) => a.id);
      expect(tools, isNot(contains('video-trim')));
      expect(tools, contains('video-mute'));
    });

    test('a mix must all be supported', () {
      expect(
        availableActions(
          const [FileKind.jpg, FileKind.avif],
          ActionMode.convert,
          mediaAvailable: true,
        ),
        isEmpty,
      );
    });

    test('a HEIC photo can join other pictures, given the engine that reads it', () {
      const kinds = [FileKind.jpg, FileKind.heic];
      final ids = availableActions(
        kinds,
        ActionMode.convert,
        mediaAvailable: true,
      ).map((a) => a.id);
      expect(ids, contains('image-to-png'));
      expect(availableActions(kinds, ActionMode.convert, mediaAvailable: false), isEmpty);
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

  group('notAvailableMessage names what it found', () {
    String say(List<FileKind> kinds) => notAvailableMessage(kinds, ActionMode.convert);

    test('PDF', () => expect(say(const [FileKind.pdf]), contains('PDF files')));
    test('HEIC', () => expect(say(const [FileKind.heic]), contains('HEIC pictures')));
    test('Word', () => expect(say(const [FileKind.docx]), contains('DOCX documents')));
    test('a mix', () => expect(say(const [FileKind.pdf, FileKind.jpg]), contains('together')));
    test('unknown', () => expect(say(const [FileKind.unknown]), contains('isn\'t supported')));
  });

  test('formatBytes picks a sensible unit', () {
    expect(formatBytes(512), '512 B');
    expect(formatBytes(2048), '2 KB');
    expect(formatBytes(2621440), '2.5 MB');
    expect(formatBytes(1500 * 1024 * 1024), '1.5 GB');
  });
}
