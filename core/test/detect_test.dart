import 'dart:convert';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

List<int> ascii(String text) => text.codeUnits;

/// An ISO media file header: box size, `ftyp`, major brand, version, compatible brands.
List<int> ftyp(String major, [List<String> compatible = const []]) {
  final size = 16 + compatible.length * 4;
  return [
    0,
    0,
    0,
    size,
    ...ascii('ftyp'),
    ...ascii(major),
    0,
    0,
    0,
    0,
    for (final brand in compatible) ...ascii(brand),
    0,
    0,
    0,
    8,
    ...ascii('free'),
  ];
}

List<int> zipEntry(String firstName, [List<String> laterNames = const []]) {
  return [
    0x50,
    0x4B,
    0x03,
    0x04,
    ...List.filled(22, 0),
    firstName.length,
    0,
    0,
    0,
    ...ascii(firstName),
    for (final name in laterNames) ...ascii(name),
  ];
}

void main() {
  group('binary signatures', () {
    final cases = <String, (List<int>, FileKind)>{
      'PNG': ([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0], FileKind.png),
      'JPEG': ([0xFF, 0xD8, 0xFF, 0xE0, 0, 0x10], FileKind.jpg),
      'GIF87a': (ascii('GIF87a....'), FileKind.gif),
      'GIF89a': (ascii('GIF89a....'), FileKind.gif),
      'WebP': (ascii('RIFF\u0000\u0000\u0000\u0000WEBPVP8 '), FileKind.webp),
      'WAV': (ascii('RIFF\u0000\u0000\u0000\u0000WAVEfmt '), FileKind.wav),
      'AVI': (ascii('RIFF\u0000\u0000\u0000\u0000AVI LIST'), FileKind.avi),
      'TIFF little-endian': ([0x49, 0x49, 0x2A, 0x00, 8], FileKind.tiff),
      'TIFF big-endian': ([0x4D, 0x4D, 0x00, 0x2A, 0], FileKind.tiff),
      'PDF': (ascii('%PDF-1.7\n'), FileKind.pdf),
      'FLAC': (ascii('fLaC\u0000'), FileKind.flac),
      'MP3 with ID3': (ascii('ID3\u0004\u0000'), FileKind.mp3),
      'MP3 frame': ([0xFF, 0xFB, 0x90, 0x64, 0], FileKind.mp3),
      'AAC ADTS': ([0xFF, 0xF1, 0x50, 0x80, 0], FileKind.aac),
      'Ogg': (ascii('OggS\u0000\u0002vorbis'), FileKind.ogg),
      'Opus': (ascii('OggS\u0000\u0002....OpusHead'), FileKind.opus),
      '7z': ([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C, 0], FileKind.sevenZip),
      'RAR': ([0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0], FileKind.rar),
      'gzip': ([0x1F, 0x8B, 0x08, 0], FileKind.gz),
      'tar': ([...List.filled(257, 0), ...ascii('ustar'), 0], FileKind.tar),
      'WebM': ([0x1A, 0x45, 0xDF, 0xA3, 0x9F, ...ascii('B\u0082webm')], FileKind.webm),
      'Matroska': ([0x1A, 0x45, 0xDF, 0xA3, 0x9F, ...ascii('matroska')], FileKind.mkv),
    };
    cases.forEach((name, testCase) {
      test(name, () => expect(detectKind(testCase.$1), testCase.$2));
    });

    test('BMP needs a real header size', () {
      final bmp = [...ascii('BM'), ...List.filled(12, 0), 40, 0, 0, 0];
      expect(detectKind(bmp), FileKind.bmp);
      final notBmp = [...ascii('BM'), ...ascii('y name is plain text, really')];
      expect(detectKind(notBmp), FileKind.txt);
    });

    test('ICO needs an entry', () {
      final ico = [0, 0, 1, 0, 1, 0, 16, 16, 0, 0, ...List.filled(12, 0)];
      expect(detectKind(ico), FileKind.ico);
      final none = [0, 0, 1, 0, 0, 0, 16, 16, 0, 0, ...List.filled(12, 0)];
      expect(detectKind(none), FileKind.unknown);
    });
  });

  group('ISO media brands', () {
    test('HEIC', () => expect(detectKind(ftyp('heic', ['mif1', 'heic'])), FileKind.heic));
    test('AVIF', () => expect(detectKind(ftyp('avif', ['mif1', 'avif'])), FileKind.avif));
    test('mif1 with an avif brand is AVIF', () {
      expect(detectKind(ftyp('mif1', ['avif'])), FileKind.avif);
    });
    test('mif1 alone is HEIC', () => expect(detectKind(ftyp('mif1', ['mif1'])), FileKind.heic));
    test('MOV', () => expect(detectKind(ftyp('qt  ')), FileKind.mov));
    test('MP4', () => expect(detectKind(ftyp('isom', ['isom', 'mp42'])), FileKind.mp4));
    test('M4A', () => expect(detectKind(ftyp('M4A ')), FileKind.m4a));
    test('M4A as a compatible brand', () {
      expect(detectKind(ftyp('mp42', ['M4A '])), FileKind.m4a);
    });
    test('3GP', () => expect(detectKind(ftyp('3gp4')), FileKind.threeGp));
    test('3G2', () => expect(detectKind(ftyp('3g2a')), FileKind.threeGp));
    test('audio-only MP4 named .m4a', () {
      expect(detectKind(ftyp('isom'), fileName: 'song.m4a'), FileKind.m4a);
    });
  });

  group('ZIP family', () {
    test('plain ZIP', () => expect(detectKind(zipEntry('notes.txt')), FileKind.zip));
    test('empty ZIP', () {
      expect(detectKind([0x50, 0x4B, 0x05, 0x06, ...List.filled(18, 0)]), FileKind.zip);
    });
    test('DOCX', () {
      expect(detectKind(zipEntry('[Content_Types].xml', ['word/document.xml'])), FileKind.docx);
    });
    test('PPTX', () {
      expect(detectKind(zipEntry('[Content_Types].xml', ['ppt/slides/s1.xml'])), FileKind.pptx);
    });
    test('XLSX', () {
      expect(detectKind(zipEntry('[Content_Types].xml', ['xl/workbook.xml'])), FileKind.xlsx);
    });
    test('ODT', () {
      expect(
        detectKind(zipEntry('mimetype', ['application/vnd.oasis.opendocument.text'])),
        FileKind.odt,
      );
    });
    test('Office parts past the head fall back to the name', () {
      expect(detectKind(zipEntry('[Content_Types].xml'), fileName: 'a.docx'), FileKind.docx);
      expect(detectKind(zipEntry('[Content_Types].xml'), fileName: 'a.bin'), FileKind.zip);
    });
    test('Office parts first and the markers past what we read', () {
      expect(detectKind(zipEntry('word/_rels/document.xml.rels')), FileKind.docx);
      expect(detectKind(zipEntry('word/theme/theme1.xml', ['word/document.xml'])), FileKind.docx);
      expect(detectKind(zipEntry('ppt/_rels/presentation.xml.rels')), FileKind.pptx);
      expect(detectKind(zipEntry('xl/_rels/workbook.xml.rels')), FileKind.xlsx);
    });
    test('only big pictures in reach: the name settles it', () {
      expect(detectKind(zipEntry('word/media/1.png'), fileName: 'a.docx'), FileKind.docx);
      expect(detectKind(zipEntry('docProps/thumbnail.jpeg'), fileName: 'a.pptx'), FileKind.pptx);
    });
    test('a folder called word in an ordinary ZIP stays a ZIP', () {
      expect(detectKind(zipEntry('word/notes.txt'), fileName: 'mine.zip'), FileKind.zip);
      expect(detectKind(zipEntry('word/notes.txt')), FileKind.zip);
    });
    test('a plain ZIP named .docx stays a ZIP', () {
      expect(detectKind(zipEntry('notes.txt'), fileName: 'report.docx'), FileKind.zip);
    });
  });

  group('text formats', () {
    List<int> utf(String text) => utf8.encode(text);

    test('plain text', () => expect(detectKind(utf('hello\nworld\n')), FileKind.txt));
    test('Hindi text', () => expect(detectKind(utf('नमस्ते दुनिया\n')), FileKind.txt));
    test('Markdown needs the name', () {
      expect(detectKind(utf('# Title\n'), fileName: 'notes.md'), FileKind.markdown);
      expect(detectKind(utf('# Title\n'), fileName: 'NOTES.MARKDOWN'), FileKind.markdown);
      expect(detectKind(utf('# Title\n')), FileKind.txt);
    });
    test('SVG', () => expect(detectKind(utf('<svg xmlns="x"></svg>')), FileKind.svg));
    test('SVG with an XML header', () {
      expect(detectKind(utf('<?xml version="1.0"?>\n<svg></svg>')), FileKind.svg);
    });
    test('XML that is not SVG is text', () {
      expect(detectKind(utf('<?xml version="1.0"?>\n<note/>')), FileKind.txt);
    });
    test('HTML', () {
      expect(detectKind(utf('<!DOCTYPE html><html></html>')), FileKind.html);
      expect(detectKind(utf('  <html lang="hi"></html>')), FileKind.html);
    });
    test('VTT', () => expect(detectKind(utf('WEBVTT\n\n00:00.000 --> 00:01.000\n')), FileKind.vtt));
    test('text starting WEBVTTX is not VTT', () {
      expect(detectKind(utf('WEBVTTX\n')), FileKind.txt);
    });
    test('SRT', () {
      expect(detectKind(utf('1\n00:00:01,000 --> 00:00:02,000\nHello\n')), FileKind.srt);
    });
    test('SRT with Windows line endings', () {
      expect(detectKind(utf('1\r\n00:00:01,000 --> 00:00:02,000\r\nHi\r\n')), FileKind.srt);
    });
    test('UTF-8 byte order mark is skipped', () {
      expect(detectKind([0xEF, 0xBB, 0xBF, ...utf('WEBVTT\n')]), FileKind.vtt);
    });
    test('UTF-16 text is not mistaken for MP3', () {
      expect(detectKind([0xFF, 0xFE, 0x68, 0x00, 0x69, 0x00]), FileKind.txt);
      expect(detectKind([0xFE, 0xFF, 0x00, 0x68, 0x00, 0x69]), FileKind.txt);
    });
  });

  group('the bytes win over the name', () {
    final png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    test('a PNG called .jpg', () => expect(detectKind(png, fileName: 'a.jpg'), FileKind.png));
    test('text called .png', () {
      expect(detectKind(ascii('just text'), fileName: 'a.png'), FileKind.txt);
    });
    test('binary junk called .txt', () {
      expect(detectKind([0, 1, 2, 3, 0, 5], fileName: 'a.txt'), FileKind.unknown);
    });
    test('Hindi file name', () {
      expect(detectKind(png, fileName: 'तस्वीर 📷.heic'), FileKind.png);
    });
  });

  group('edge cases', () {
    test('empty file', () => expect(detectKind(const []), FileKind.unknown));
    test('one byte', () => expect(detectKind(const [0xFF]), FileKind.unknown));
    test('truncated PNG signature is not a PNG', () {
      expect(detectKind(const [0x89, 0x50, 0x4E]), isNot(FileKind.png));
    });
    test('invalid UTF-8 is binary, a few bad bytes are legacy text', () {
      expect(detectKind(List.filled(100, 0xFE)), FileKind.unknown);
      expect(detectKind([...ascii('caf'), 0xE9, ...ascii(' au lait\n')]), FileKind.txt);
    });
    test('mostly control bytes', () {
      expect(detectKind(List.filled(100, 1)), FileKind.unknown);
    });
    test('never throws on any short input', () {
      for (var length = 0; length < 300; length++) {
        for (final fill in [0, 0x50, 0xFF]) {
          expect(() => detectKind(List.filled(length, fill)), returnsNormally);
        }
      }
      expect(detectKind(ascii('....ftyp')), FileKind.txt);
      for (var length = 8; length < 40; length++) {
        final header = [...ascii('\u0000\u0000\u0000\u0020ftypisom'), ...List.filled(40, 0)];
        expect(() => detectKind(header.sublist(0, length)), returnsNormally);
      }
      expect(() => detectKind([0xFF, 0xFF, 0xFF, 0xFF, ...ascii('ftypisom')]), returnsNormally);
    });
  });
}
