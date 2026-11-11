import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:pdfrx/pdfrx.dart';
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/pdf_engine.dart';

/// A picture full of detail, so PDF sizes behave like a real scan.
Uint8List scan({int width = 1200, int height = 1600, int seed = 1}) {
  final image = img.Image(width: width, height: height);
  var state = seed;
  for (final pixel in image) {
    state = (state * 1103515245 + 12345) & 0x7FFFFFFF;
    pixel
      ..r = (pixel.x + state) % 256
      ..g = (pixel.y + (state >> 8)) % 256
      ..b = (state >> 16) % 256;
  }
  return img.encodeJpg(image, quality: 95);
}

/// A PDF with [count] pages, each a picture.
PortableFile pdf(String name, int count, {int seed = 1, int width = 1200, int height = 1600}) {
  final bytes = buildImagePdf([
    for (var i = 0; i < count; i++) scan(width: width, height: height, seed: seed + i),
  ]);
  return PortableFile(name, bytes);
}

Future<int> pagesIn(Uint8List bytes) async {
  final document = await PdfDocument.openData(bytes, sourceName: 'check-${bytes.hashCode}');
  try {
    return document.pages.length;
  } finally {
    await document.dispose();
  }
}

Future<List<PdfResult>> run(
  String id,
  List<PortableFile> files, {
  ActionOptions options = const ActionOptions(),
}) {
  return convertPdf(actionById(id)!, files, (_) {}, options: options);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  // A test has no app bundle holding PDFium, so these need a copy, named in PDFIUM_PATH. Without
  // one they are skipped: the app itself is checked in a browser and by building for each platform.
  final pdfium = Platform.environment['PDFIUM_PATH'];
  final skipReal = pdfium == null ? 'Set PDFIUM_PATH to run against real PDFium' : null;

  setUpAll(() async {
    if (pdfium == null) return;
    // PDFium asks for a temporary folder through a plugin, which tests don't have.
    final temporary = Directory.systemTemp.createTempSync('radial_pdf_');
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      const MethodChannel('plugins.flutter.io/path_provider'),
      (call) async => temporary.path,
    );
    Pdfrx.pdfiumModulePath = pdfium;
    await pdfrxFlutterInitialize();
  });

  group('telling whether a PDF is locked', () {
    Uint8List sample(String name) {
      final testFiles = p.join(Directory.current.parent.path, 'test-files');
      return File(p.join(testFiles, name)).readAsBytesSync();
    }

    test('a password', () => expect(isPdfLocked(sample('locked.pdf')), isTrue));
    test('only restrictions', () => expect(isPdfLocked(sample('restricted.pdf')), isTrue));

    test('none', () {
      final plain = buildImagePdf([img.encodeJpg(img.Image(width: 8, height: 8))]);
      expect(isPdfLocked(plain), isFalse);
    });

    test('an empty or tiny file', () {
      expect(isPdfLocked(Uint8List(0)), isFalse);
      expect(isPdfLocked(Uint8List.fromList('/Encryp'.codeUnits)), isFalse);
    });
  });

  group('which actions run', () {
    test('the ones PDFium can do', () {
      for (final id in [
        'pdf-to-jpg',
        'pdf-to-png',
        'pdf-to-docx',
        'pdf-merge',
        'pdf-split',
        'pdf-rotate',
        'pdf-compress',
        'fit-email-pdf',
        'fit-pdf-100kb',
      ]) {
        expect(canRunPdf(actionById(id)!, FileKind.pdf), isTrue, reason: id);
      }
    });

    test('removing a password is here, as PDFium can do it', () {
      expect(canRunPdf(actionById('pdf-remove-password')!, FileKind.pdf), isTrue);
    });

    test('adding a password needs qpdf, and page picking needs a screen', () {
      for (final id in ['pdf-add-password', 'pdf-extract-pages']) {
        expect(canRunPdf(actionById(id)!, FileKind.pdf), isFalse, reason: id);
      }
    });

    test('only PDFs', () {
      expect(canRunPdf(actionById('pdf-merge')!, FileKind.jpg), isFalse);
    });
  });

  group('to pictures', skip: skipReal, () {
    test('one page makes one picture', () async {
      final out = (await run('pdf-to-jpg', [pdf('doc.pdf', 1)])).single.file;
      expect(out.name, 'doc (converted).jpg');
      expect(detectKind(out.bytes), FileKind.jpg);
    });

    test('several pages make a ZIP, in order', () async {
      final out = (await run('pdf-to-png', [pdf('doc.pdf', 3)])).single.file;
      expect(out.name, 'doc (converted).zip');
      final archive = ZipDecoder().decodeBytes(out.bytes);
      expect(archive.files.map((f) => f.name), [
        'doc page 1.png',
        'doc page 2.png',
        'doc page 3.png',
      ]);
      expect(detectKind(archive.files.first.content), FileKind.png);
    });

    test('the page size is right at 150 dpi', () async {
      // 720 by 1080 points is 10 by 15 inches, so 1500 by 2250 pixels.
      final out = (await run('pdf-to-png', [pdf('doc.pdf', 1, width: 720, height: 1080)])).single;
      final decoded = img.decodePng(out.file.bytes)!;
      expect('${decoded.width}x${decoded.height}', '1500x2250');
    });

    test('the picture is really drawn, not blank', () async {
      final out = (await run('pdf-to-png', [pdf('doc.pdf', 1, width: 200, height: 200)])).single;
      final decoded = img.decodePng(out.file.bytes)!;
      final colours = {for (final pixel in decoded) '${pixel.r},${pixel.g},${pixel.b}'};
      expect(colours.length, greaterThan(50));
    });
  });

  group('pages', skip: skipReal, () {
    test('merge adds them up, in the order chosen', () async {
      final out = (await run('pdf-merge', [pdf('a.pdf', 2), pdf('b.pdf', 3, seed: 9)])).single;
      expect(out.file.name, 'a (merged).pdf');
      expect(await pagesIn(out.file.bytes), 5);
    });

    test('merge needs two files', () async {
      await expectLater(run('pdf-merge', [pdf('a.pdf', 1)]), throwsA(isA<EngineFailed>()));
    });

    test('split makes one PDF per page in a ZIP', () async {
      final out = (await run('pdf-split', [pdf('doc.pdf', 3)])).single.file;
      expect(out.name, 'doc (split).zip');
      final archive = ZipDecoder().decodeBytes(out.bytes);
      expect(archive.files, hasLength(3));
      for (final file in archive.files) {
        expect(await pagesIn(file.content), 1, reason: file.name);
      }
    });

    test('a single page has nothing to split', () async {
      await expectLater(
        run('pdf-split', [pdf('doc.pdf', 1)]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('one page'))),
      );
    });

    test('rotate keeps every page and turns them', () async {
      final out = (await run('pdf-rotate', [pdf('doc.pdf', 2, width: 720, height: 1080)])).single;
      final document = await PdfDocument.openData(out.file.bytes, sourceName: 'rotated');
      try {
        expect(document.pages, hasLength(2));
        expect(document.pages.first.rotation, PdfPageRotation.clockwise90);
        expect(document.pages.first.width, greaterThan(document.pages.first.height));
      } finally {
        await document.dispose();
      }
    });

    test('rotate refuses other angles', () async {
      await expectLater(
        run('pdf-rotate', [pdf('doc.pdf', 1)], options: const ActionOptions(degrees: 45)),
        throwsA(isA<EngineFailed>()),
      );
    });
  });

  group('making it smaller', skip: skipReal, () {
    test('compress keeps the pages, says what it did, and is smaller', () async {
      final source = pdf('doc.pdf', 2);
      final out = (await run('pdf-compress', [source])).single;
      expect(out.file.bytes.length, lessThan(source.bytes.length));
      expect(await pagesIn(out.file.bytes), 2);
      expect(out.note, contains('pictures'));
    });

    test('a page keeps its physical size', () async {
      final source = pdf('doc.pdf', 1, width: 720, height: 1080);
      final out = (await run('pdf-compress', [source])).single;
      final document = await PdfDocument.openData(out.file.bytes, sourceName: 'same-size');
      try {
        expect(document.pages.first.width, closeTo(720, 1));
        expect(document.pages.first.height, closeTo(1080, 1));
      } finally {
        await document.dispose();
      }
    });

    test('under a limit really is', () async {
      // Like a photo. Pure noise is rightly refused: it can't be both this small and readable.
      final image = img.Image(width: 1200, height: 1600);
      var state = 1;
      for (final pixel in image) {
        state = (state * 1103515245 + 12345) & 0x7FFFFFFF;
        pixel
          ..r = pixel.x ~/ 5 + state % 16
          ..g = pixel.y ~/ 7 + (state >> 8) % 16
          ..b = 100 + (state >> 16) % 16;
      }
      final source = PortableFile('doc.pdf', buildImagePdf([img.encodeJpg(image, quality: 95)]));
      expect(source.bytes.length, greaterThan(100 * 1024));
      final out = (await run('fit-pdf-100kb', [source])).single;
      expect(out.file.bytes.length, lessThanOrEqualTo(100 * 1024));
      expect(out.file.name, 'doc (under 100 KB).pdf');
      expect(out.note, contains('pictures'));
    });

    test('a PDF that already fits stays as it is, with no note', () async {
      final source = pdf('doc.pdf', 1, width: 100, height: 100);
      final out = (await run('fit-pdf-1mb', [source])).single;
      expect(out.note, isNull);
      expect(await pagesIn(out.file.bytes), 1);
    });

    test('too many pages to fit says so rather than making it unreadable', () async {
      await expectLater(
        run('fit-pdf-100kb', [pdf('doc.pdf', 40, width: 300, height: 400)]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('too much'))),
      );
    }, timeout: const Timeout(Duration(minutes: 2)));
  });

  group('safety', skip: skipReal, () {
    test('the input is not changed', () async {
      final source = pdf('doc.pdf', 2);
      final before = Uint8List.fromList(source.bytes);
      await run('pdf-rotate', [source]);
      await run('pdf-compress', [source]);
      expect(source.bytes, before);
    });

    test('a batch handles each file', () async {
      final out = await run('pdf-rotate', [pdf('a.pdf', 1), pdf('b.pdf', 1, seed: 5)]);
      expect(out.map((r) => r.file.name), ['a (rotated).pdf', 'b (rotated).pdf']);
    });

    test('progress goes up to 1', () async {
      final seen = <double>[];
      await convertPdf(actionById('pdf-to-jpg')!, [pdf('doc.pdf', 2)], seen.add);
      expect(seen.last, 1);
      expect(seen, everyElement(inInclusiveRange(0, 1)));
    });

    test('a damaged PDF is a plain error', () async {
      final junk = PortableFile('bad.pdf', utf8.encode('%PDF-1.7 this is not really a PDF'));
      await expectLater(
        run('pdf-to-jpg', [junk]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('bad.pdf'))),
      );
    });
  });

  group('pictures turned into PDFs have huge pages', skip: skipReal, () {
    test('they can still fit a limit', () async {
      final source = pdf('photo.pdf', 1, width: 3000, height: 2000);
      final out = (await run('fit-pdf-500kb', [source])).single;
      expect(out.file.bytes.length, lessThanOrEqualTo(500 * 1024));
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('shrinking does not blow them up first', () async {
      final source = pdf('photo.pdf', 1, width: 3000, height: 2000);
      final out = (await run('pdf-compress', [source])).single;
      expect(out.file.bytes.length, lessThan(source.bytes.length));
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('saving as a picture keeps every pixel and adds none', () async {
      final source = pdf('photo.pdf', 1, width: 3000, height: 2000);
      final out = (await run('pdf-to-png', [source])).single;
      final picture = img.decodePng(out.file.bytes)!;
      expect(picture.width, 3000);
      expect(picture.height, 2000);
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('a paper-sized page still comes out at full quality', () async {
      final source = pdf('page.pdf', 1, width: 595, height: 842);
      final picture = img.decodePng((await run('pdf-to-png', [source])).single.file.bytes)!;
      expect(picture.height, closeTo(842 * 150 / 72, 2));
    });
  });

  group('to Word', skip: skipReal, () {
    Future<String> wordsIn(Uint8List docx) async {
      final archive = ZipDecoder().decodeBytes(docx);
      return utf8.decode(archive.findFile('word/document.xml')!.readBytes()!);
    }

    final testFiles = p.join(Directory.current.parent.path, 'test-files');
    final locked = PortableFile(
      'locked.pdf',
      File(p.join(testFiles, 'locked.pdf')).readAsBytesSync(),
    );

    test('bold words stay bold, and a picture on the page sits between its paragraphs', () async {
      final out = (await run('pdf-to-docx', [_styledPdf()])).single;
      final body = await wordsIn(out.file.bytes);
      expect(body, contains('<w:rPr><w:b/></w:rPr><w:t xml:space="preserve">bold words</w:t>'));
      expect(body, contains('<w:t xml:space="preserve">Plain words then </w:t>'));
      final archive = ZipDecoder().decodeBytes(out.file.bytes);
      expect(archive.findFile('word/media/image1.jpg'), isNotNull);
      final above = body.indexOf('Plain words');
      final picture = body.indexOf('<w:drawing>');
      final below = body.indexOf('Text below the picture.');
      expect(above < picture && picture < below, isTrue, reason: 'in the order of the page');
      // 200 points wide on the page, so as wide in Word.
      expect(body, contains('cx="${200 * 12700}"'));
    });

    test('text comes through as text, one page to a page', () async {
      final out = (await run('pdf-to-docx', [
        locked,
      ], options: const ActionOptions(password: 'open sesame'))).single;
      expect(out.file.name, 'locked (converted).docx');
      expect(detectKind(out.file.bytes), FileKind.docx);
      final xml = await wordsIn(out.file.bytes);
      expect(xml, contains('Page one'));
      expect(xml, contains('Page two'));
      expect('<w:pageBreakBefore/>'.allMatches(xml), hasLength(1));
      expect(out.note, contains('ready to edit'));
    });

    test('a scan comes in as pictures, and says so', () async {
      final out = (await run('pdf-to-docx', [pdf('scan.pdf', 2, width: 300, height: 400)])).single;
      final archive = ZipDecoder().decodeBytes(out.file.bytes);
      expect(archive.files.where((file) => file.name.startsWith('word/media/')), hasLength(2));
      expect(out.note, contains('scanned'));
      expect(out.note, contains('can\'t be edited'));
    });

    test('a locked PDF still asks', () async {
      await expectLater(run('pdf-to-docx', [locked]), throwsA(isA<PasswordNeeded>()));
    });

    test('a scan with a scanner\'s stamp keeps its page, not just the stamp', () async {
      final stamped = PortableFile(
        'scan.pdf',
        File(p.join(testFiles, 'scan-with-stamp.pdf')).readAsBytesSync(),
      );
      final page = await PdfDocument.openData(stamped.bytes, sourceName: 'check-stamp');
      final text = await page.pages.first.loadText();
      expect(text!.fullText, contains('Page one'), reason: 'The sample must have the stamp');
      await page.dispose();

      final out = (await run('pdf-to-docx', [stamped])).single;
      final archive = ZipDecoder().decodeBytes(out.file.bytes);
      expect(archive.files.where((file) => file.name.startsWith('word/media/')), hasLength(1));
      expect(out.note, contains('scanned'));
    });
  });

  group('locked PDFs', skip: skipReal, () {
    final testFiles = p.join(Directory.current.parent.path, 'test-files');
    final locked = PortableFile(
      'locked.pdf',
      File(p.join(testFiles, 'locked.pdf')).readAsBytesSync(),
    );
    final restricted = PortableFile(
      'restricted.pdf',
      File(p.join(testFiles, 'restricted.pdf')).readAsBytesSync(),
    );
    const right = ActionOptions(password: 'open sesame');

    Future<bool> opensFreely(Uint8List bytes) async {
      try {
        await pagesIn(bytes);
        return true;
      } on PdfPasswordException {
        return false;
      }
    }

    test('with no password it asks, naming the file', () async {
      await expectLater(
        run('pdf-to-jpg', [locked]),
        throwsA(isA<PasswordNeeded>().having((e) => e.fileName, 'fileName', 'locked.pdf')),
      );
    });

    test('a wrong password asks again', () async {
      await expectLater(
        run('pdf-to-jpg', [locked], options: const ActionOptions(password: 'nope')),
        throwsA(isA<PasswordNeeded>()),
      );
    });

    test('the right one opens it', () async {
      final out = (await run('pdf-to-jpg', [locked], options: right)).single;
      expect(detectKind(out.file.bytes), FileKind.zip);
    });

    test('removing the password really removes it', () async {
      final out = (await run('pdf-remove-password', [locked], options: right)).single;
      expect(out.file.name, 'locked (unlocked).pdf');
      expect(await opensFreely(locked.bytes), isFalse, reason: 'The sample must really be locked');
      expect(await opensFreely(out.file.bytes), isTrue);
      expect(await pagesIn(out.file.bytes), 2);
      expect(isPdfLocked(out.file.bytes), isFalse);
    });

    test('the original is left locked', () async {
      final before = Uint8List.fromList(locked.bytes);
      await run('pdf-remove-password', [locked], options: right);
      expect(locked.bytes, before);
    });

    test('removing restrictions needs no password', () async {
      final out = (await run('pdf-remove-password', [restricted])).single;
      expect(isPdfLocked(out.file.bytes), isFalse);
    });

    test('a PDF with no password says there is nothing to remove', () async {
      await expectLater(
        run('pdf-remove-password', [pdf('plain.pdf', 1, width: 50, height: 50)]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('no password'))),
      );
    });

    test('rotating leaves it locked, as nobody asked to unlock it', () async {
      final out = (await run('pdf-rotate', [locked], options: right)).single;
      expect(await opensFreely(out.file.bytes), isFalse);
    });

    test('merging opens with the password', () async {
      final out = (await run('pdf-merge', [
        locked,
        pdf('b.pdf', 1, width: 50, height: 50),
      ], options: right)).single;
      expect(await pagesIn(out.file.bytes), 3);
    });

    test('a password never shows in an error', () async {
      try {
        await run('pdf-to-jpg', [locked], options: const ActionOptions(password: 'my secret'));
        fail('Should not open');
      } on EngineFailed catch (error) {
        expect(error.toString(), isNot(contains('my secret')));
      }
    });
  });
}

/// A one-page PDF in the standard Helvetica and Helvetica-Bold, which every reader has built in,
/// with a photo between two lines of text.
PortableFile _styledPdf() {
  final jpeg = img.encodeJpg(img.Image(width: 80, height: 60)..clear(img.ColorRgb8(200, 80, 40)));
  const content =
      'BT /F1 12 Tf 72 760 Td (Plain words then ) Tj /F2 12 Tf (bold words) Tj ET\n'
      'q 200 0 0 150 72 560 cm /Im1 Do Q\n'
      'BT /F1 12 Tf 72 500 Td (Text below the picture.) Tj ET\n';
  final objects = <List<int>>[
    utf8.encode('<< /Type /Catalog /Pages 2 0 R >>'),
    utf8.encode('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    utf8.encode(
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 7 0 R '
      '/Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Im1 6 0 R >> >> >>',
    ),
    utf8.encode('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),
    utf8.encode('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'),
    [
      ...utf8.encode(
        '<< /Type /XObject /Subtype /Image /Width 80 /Height 60 /ColorSpace /DeviceRGB '
        '/BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n',
      ),
      ...jpeg,
      ...utf8.encode('\nendstream'),
    ],
    utf8.encode('<< /Length ${content.length} >>\nstream\n${content}endstream'),
  ];
  final out = BytesBuilder()..add(utf8.encode('%PDF-1.4\n'));
  final offsets = <int>[];
  for (var i = 0; i < objects.length; i++) {
    offsets.add(out.length);
    out
      ..add(utf8.encode('${i + 1} 0 obj\n'))
      ..add(objects[i])
      ..add(utf8.encode('\nendobj\n'));
  }
  final xref = out.length;
  out.add(utf8.encode('xref\n0 ${objects.length + 1}\n0000000000 65535 f \n'));
  for (final offset in offsets) {
    out.add(utf8.encode('${offset.toString().padLeft(10, '0')} 00000 n \n'));
  }
  out.add(
    utf8.encode(
      'trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n$xref\n%%EOF\n',
    ),
  );
  return PortableFile('styled.pdf', out.toBytes());
}
