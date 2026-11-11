import 'dart:convert';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/app_settings.dart';
import 'package:shiftdrop/conversion.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/preview.dart';
import 'package:shiftdrop/preview_view.dart';
import 'package:shiftdrop/words.dart';

final english = wordsFor(const Locale('en'));

Uint8List _png(int width, int height) => img.encodePng(img.Image(width: width, height: height));

PickedFile _file(String name, Uint8List bytes) => PickedFile(
  name: name,
  size: bytes.length,
  head: bytes.length <= detectHeadBytes ? bytes : bytes.sublist(0, detectHeadBytes),
  read: () async => bytes,
);

PreviewSubject _subject(String name, Uint8List bytes) => PreviewSubject(
  file: _file(name, bytes),
  kind: detectKind(bytes, fileName: name),
);

Previewer _previewer({
  PdfPageReader? pdfPage,
  FrameAt? frameAt,
  Probe? probe,
  List<String>? asked,
}) {
  return Previewer(
    readPicture: (file, kind) async {
      asked?.add(file.name);
      return file.read();
    },
    frameAt: frameAt ?? (file, seconds) async => _png(320, 180),
    probe: probe ?? (file) async => const MediaInfo(seconds: 65, width: 1920, height: 1080),
    pdfPage:
        pdfPage ??
        (bytes, name, {int width = 600}) async =>
            (png: _png(width, width * 1414 ~/ 1000), pages: 3),
  );
}

void main() {
  group('text previews', () {
    test('subtitles show what is said, not numbers, timings or tags', () {
      const srt =
          '1\n00:00:01,000 --> 00:00:02,000\n<i>Hello</i> there\n\n2\n'
          '00:00:03,000 --> 00:00:04,000\n{\\an8}Second line\n';
      expect(subtitleLines(utf8.encode(srt)), ['Hello there', 'Second line']);
      expect(subtitleLines(utf8.encode('WEBVTT\n\nNOTE x\n\n00:01.000 --> 00:02.000\nHi\n')), [
        'Hi',
      ]);
    });

    test('archives list their first files, and 7z or RAR nothing', () {
      final zip = Archive();
      for (final name in ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt', 'f.txt']) {
        zip.addFile(ArchiveFile.bytes(name, utf8.encode(name)));
      }
      final bytes = ZipEncoder().encodeBytes(zip);
      expect(archiveNames(bytes, FileKind.zip), ['a.txt', 'b.txt', 'c.txt', 'd.txt', 'e.txt']);
      expect(archiveNames(bytes, FileKind.sevenZip), isEmpty);
    });

    test('a Word document shows its first paragraphs', () {
      final docx = buildDocx(const [
        DocxParagraph('Results & marks', heading: 1),
        DocxParagraph(''),
        DocxParagraph('First <line>'),
      ]);
      expect(documentLines(docx), ['Results & marks', 'First <line>']);
    });
  });

  test('a result is known by its name when its bytes are elsewhere', () {
    expect(kindFromName('clip (converted).mp4'), FileKind.mp4);
    expect(kindFromName('notes'), FileKind.unknown);
  });

  group('making previews', () {
    test('a picture is shrunk, keeping its real size to say', () async {
      final made = await _previewer().make(_subject('photo.png', _png(1200, 800)), width: 300);
      expect(pngSize(made.picture!), const Size(300, 200));
      expect(made.facts.width, 1200);
      expect(made.facts.height, 800);
    });

    test('a small picture is never blown up', () async {
      final made = await _previewer().make(_subject('icon.png', _png(64, 32)));
      expect(pngSize(made.picture!), const Size(64, 32));
    });

    test('a PDF shows page 1 and its page count', () async {
      final pdf = buildImagePdf([img.encodeJpg(img.Image(width: 10, height: 10))]);
      final made = await _previewer().make(_subject('a.pdf', pdf), width: 200);
      expect(pngSize(made.picture!)!.width, 200);
      expect(made.facts.pages, 3);
    });

    test('a locked PDF says so, and a failure is only a failed preview', () async {
      final pdf = buildImagePdf([img.encodeJpg(img.Image(width: 10, height: 10))]);
      final locked = await _previewer(
        pdfPage: (bytes, name, {int width = 600}) async => throw PasswordNeeded(name),
      ).make(_subject('a.pdf', pdf));
      expect(locked.locked, isTrue);
      final broken = await _previewer(
        pdfPage: (bytes, name, {int width = 600}) async => throw StateError('broken'),
      ).make(_subject('a.pdf', pdf));
      expect(broken.failed, isTrue);
    });

    test('a video shows a frame a second in, with its length and size', () async {
      final at = <double>[];
      final made = await _previewer(
        frameAt: (file, seconds) async {
          at.add(seconds);
          return _png(320, 180);
        },
      ).make(PreviewSubject(file: _file('clip.mp4', Uint8List(16)), kind: FileKind.mp4));
      expect(at, [1.0]);
      expect(made.picture, isNotNull);
      expect(made.facts.seconds, 65);
      expect(made.facts.width, 1920);
    });

    test('a very short clip is looked at halfway', () async {
      final at = <double>[];
      await _previewer(
        probe: (file) async => const MediaInfo(seconds: 0.4),
        frameAt: (file, seconds) async {
          at.add(seconds);
          return _png(10, 10);
        },
      ).make(PreviewSubject(file: _file('clip.mp4', Uint8List(16)), kind: FileKind.mp4));
      expect(at, [0.2]);
    });

    test('sound has no picture, only its length', () async {
      final made = await _previewer().make(
        PreviewSubject(file: _file('song.mp3', Uint8List(16)), kind: FileKind.mp3),
      );
      expect(made.picture, isNull);
      expect(made.facts.seconds, 65);
    });
  });

  test('the cache makes each preview once, and again after clearing', () async {
    final asked = <String>[];
    final cache = PreviewCache(_previewer(asked: asked));
    final file = _file('photo.png', _png(20, 20));
    final subject = PreviewSubject(file: file, kind: FileKind.png);
    final first = cache.of(file, subject);
    expect(identical(cache.of(file, subject), first), isTrue);
    await first;
    await cache.of(file, subject, width: 1600);
    cache.clear();
    await cache.of(file, subject);
    expect(asked, ['photo.png', 'photo.png', 'photo.png']);
  });

  group('the line under a preview', () {
    test('pictures say their size and weight, before and after', () {
      expect(
        previewFactsLine(
          english,
          const PreviewFacts(width: 4032, height: 3024, bytes: 3200000),
          const PreviewFacts(width: 1280, height: 960, bytes: 240000),
        ),
        '4032×3024 to 1280×960 · ${formatBytes(3200000)} to ${formatBytes(240000)}',
      );
    });

    test('what stays the same is said once', () {
      expect(
        previewFactsLine(
          english,
          const PreviewFacts(pages: 3, bytes: 1000),
          const PreviewFacts(pages: 3, bytes: 500),
        ),
        '3 pages · ${formatBytes(1000)} to ${formatBytes(500)}',
      );
      expect(previewFactsLine(english, const PreviewFacts(seconds: 3725)), '1:02:05');
      expect(previewFactsLine(english, const PreviewFacts(pages: 1)), '1 page');
    });
  });

  test('pictures of the same shape can be laid over each other', () {
    expect(sameShape(_png(400, 300), _png(200, 150)), isTrue);
    expect(sameShape(_png(400, 300), _png(300, 400)), isFalse, reason: 'rotated');
    expect(pngSize(Uint8List(4)), isNull);
  });

  group('the panel', () {
    Future<void> show(WidgetTester tester, Widget panel) async {
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: Scaffold(
            body: Center(child: SizedBox(width: 400, child: panel)),
          ),
        ),
      );
      await tester.pumpAndSettle();
    }

    testWidgets('compares before and after with a line to drag', (tester) async {
      await show(
        tester,
        PreviewPanel(
          before: Future.value(
            Preview(picture: _png(400, 300), facts: const PreviewFacts(bytes: 2000)),
          ),
          after: Future.value(
            Preview(picture: _png(200, 150), facts: const PreviewFacts(bytes: 1000)),
          ),
          kind: FileKind.jpg,
          name: 'photo.jpg',
        ),
      );
      expect(find.byType(CompareSlider), findsOneWidget);
      expect(find.text('Before'), findsOneWidget);
      expect(find.text('After'), findsOneWidget);
      expect(find.textContaining(' to '), findsOneWidget);
      expect(find.bySemanticsLabel(RegExp('Move the line')), findsOneWidget);
      final line = find.byType(CircleAvatar);
      final before = tester.getCenter(line);
      await tester.tapAt(before - const Offset(50, 0));
      await tester.pump();
      expect(tester.getCenter(line).dx, lessThan(before.dx));
    });

    testWidgets('a turned result is shown beside, not over, the original', (tester) async {
      await show(
        tester,
        PreviewPanel(
          before: Future.value(Preview(picture: _png(400, 300))),
          after: Future.value(Preview(picture: _png(300, 400))),
          kind: FileKind.jpg,
          name: 'photo.jpg',
        ),
      );
      expect(find.byType(CompareSlider), findsNothing);
      expect(find.byType(Image), findsNWidgets(2));
    });

    testWidgets('text, locks and failures say so in words', (tester) async {
      await show(
        tester,
        PreviewPanel(
          before: Future.value(const Preview(lines: ['Hello there'])),
          after: Future.value(const Preview(locked: true)),
          kind: FileKind.srt,
          name: 'film.srt',
        ),
      );
      expect(find.text('Hello there'), findsOneWidget);
      expect(find.textContaining('Locked'), findsOneWidget);
      await show(
        tester,
        PreviewPanel(
          before: Future.value(const Preview.failed()),
          kind: FileKind.jpg,
          name: 'x.jpg',
        ),
      );
      expect(find.text("Can't preview this"), findsOneWidget);
    });
  });

  group('on the main screen', () {
    Future<void> pump(WidgetTester tester, {required bool previews}) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      final store = SettingsStore(
        AppSettings(welcomed: true, showPreviews: previews),
        write: (_) async {},
      );
      await tester.pumpWidget(
        SettingsScope(
          store: store,
          child: MaterialApp(
            localizationsDelegates: Words.localizationsDelegates,
            home: ConverterScreen(
              pickFiles: () async => [_file('photo.png', _png(400, 300))],
              saveFile: (_) async => const SavedAs(),
              mediaAvailable: false,
              historyReader: () async => null,
              historyWriter: (_) async {},
              sharedFiles: () => const Stream.empty(),
              keepWorking: (_) async {},
              converter: (action, files, onProgress, options) =>
                  runPortable(action, files, options: options),
            ),
          ),
        ),
      );
      await tester.tap(find.textContaining('hoose'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));
    }

    Future<void> letPreviewsFinish(WidgetTester tester) async {
      for (var i = 0; i < 10; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 50)));
        await tester.pump(const Duration(milliseconds: 50));
      }
    }

    testWidgets('shows the file, then compares it with the result', (tester) async {
      await pump(tester, previews: true);
      await letPreviewsFinish(tester);
      expect(find.text('Preview'), findsOneWidget);
      expect(find.textContaining('400×300'), findsOneWidget);
      await tester.tap(find.text('JPG'));
      await letPreviewsFinish(tester);
      await letPreviewsFinish(tester);
      expect(find.byType(CompareSlider), findsOneWidget);
      expect(find.byType(PreviewThumb), findsOneWidget, reason: 'the result row has its picture');
    });

    testWidgets('hiding it leaves a way back', (tester) async {
      await pump(tester, previews: true);
      await tester.tap(find.byTooltip('Hide the preview'));
      await tester.pump();
      expect(find.text('Preview'), findsNothing);
      await tester.tap(find.text('Show the preview'));
      await tester.pump();
      expect(find.text('Preview'), findsOneWidget);
    });

    testWidgets('turned off in Settings, there are none', (tester) async {
      await pump(tester, previews: false);
      expect(find.text('Preview'), findsNothing);
      expect(find.text('Show the preview'), findsNothing);
    });
  });
}
