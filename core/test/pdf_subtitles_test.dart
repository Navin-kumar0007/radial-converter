import 'dart:convert';
import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

/// The smallest JPEG shape readJpegInfo needs: SOI, a comment, a frame header.
Uint8List jpeg({int width = 640, int height = 480, int components = 3, int marker = 0xC0}) {
  return Uint8List.fromList([
    0xFF, 0xD8, // SOI
    0xFF, 0xFE, 0, 4, 1, 2, // comment
    0xFF, marker, 0, 17, 8,
    height >> 8, height & 0xFF,
    width >> 8, width & 0xFF,
    components,
    ...List.filled(12, 0),
  ]);
}

void main() {
  group('readJpegInfo', () {
    test('reads size and channels', () {
      final info = readJpegInfo(jpeg(width: 1600, height: 900));
      expect(info?.width, 1600);
      expect(info?.height, 900);
      expect(info?.components, 3);
    });
    test('progressive JPEG', () {
      expect(readJpegInfo(jpeg(marker: 0xC2))?.width, 640);
    });
    test('not a JPEG', () {
      expect(readJpegInfo(Uint8List.fromList([1, 2, 3, 4])), isNull);
      expect(readJpegInfo(Uint8List(0)), isNull);
    });
    test('truncated', () {
      expect(readJpegInfo(Uint8List.fromList([0xFF, 0xD8, 0xFF, 0xFE, 0, 200])), isNull);
    });
  });

  group('buildImagePdf', () {
    String text(Uint8List bytes) => latin1.decode(bytes);

    test('one page per image', () {
      final pdf = text(buildImagePdf([jpeg(), jpeg()]));
      expect(pdf, startsWith('%PDF-1.4'));
      expect(pdf, contains('/Count 2'));
      expect('/Type /Page '.allMatches(pdf).length, 2);
      expect(pdf, endsWith('%%EOF\n'));
    });
    test('the page is the size of the picture', () {
      expect(text(buildImagePdf([jpeg()])), contains('/MediaBox [0 0 640.00 480.00]'));
    });
    test('huge pictures fit PDF page limits', () {
      final pdf = text(buildImagePdf([jpeg(width: 28800, height: 14400)]));
      expect(pdf, contains('/MediaBox [0 0 14400.00 7200.00]'));
    });
    test('colour space follows the channels', () {
      expect(text(buildImagePdf([jpeg(components: 1)])), contains('/DeviceGray'));
      expect(text(buildImagePdf([jpeg()])), contains('/DeviceRGB'));
      expect(text(buildImagePdf([jpeg(components: 4)])), contains('/DeviceCMYK'));
    });
    test('xref offsets point at their objects', () {
      final bytes = buildImagePdf([jpeg()]);
      final pdf = text(bytes);
      final table = pdf.substring(pdf.lastIndexOf('xref\n0 '));
      final offsets = RegExp(r'(\d{10}) 00000 n').allMatches(table).toList();
      expect(offsets, hasLength(5));
      for (var i = 0; i < offsets.length; i++) {
        final at = int.parse(offsets[i][1]!);
        expect(pdf.substring(at), startsWith('${i + 1} 0 obj'));
      }
    });
    test('needs a real JPEG', () {
      expect(() => buildImagePdf(const []), throwsArgumentError);
      expect(() => buildImagePdf([Uint8List(4)]), throwsArgumentError);
    });
  });

  group('subtitles', () {
    const srt =
        '1\n00:00:01,000 --> 00:00:02,500\nHello\nthere\n\n'
        '2\n00:01:00,000 --> 00:01:01,000\nनमस्ते\n';
    const vtt =
        'WEBVTT\n\nNOTE a comment\n\n00:01.000 --> 00:02.500 align:start\n<i>Hello</i>\n\n'
        '01:00:00.000 --> 01:00:01.000\nBye\n';

    test('parses SRT', () {
      final cues = parseSubtitles(srt);
      expect(cues, hasLength(2));
      expect(cues[0].start, const Duration(seconds: 1));
      expect(cues[0].end, const Duration(milliseconds: 2500));
      expect(cues[0].text, 'Hello\nthere');
      expect(cues[1].text, 'नमस्ते');
    });
    test('parses VTT, skipping notes and cue settings', () {
      final cues = parseSubtitles(vtt);
      expect(cues, hasLength(2));
      expect(cues[0].start, const Duration(seconds: 1));
      expect(cues[1].start, const Duration(hours: 1));
    });
    test('Windows line endings and a byte order mark', () {
      expect(parseSubtitles('﻿${srt.replaceAll('\n', '\r\n')}'), hasLength(2));
    });
    test('no cues', () => expect(parseSubtitles('just words\n'), isEmpty));
    test('SRT to VTT', () {
      final out = toVtt(parseSubtitles(srt));
      expect(out, startsWith('WEBVTT\n\n'));
      expect(out, contains('00:00:01.000 --> 00:00:02.500\nHello\nthere\n'));
    });
    test('VTT to SRT', () {
      final out = toSrt(parseSubtitles(vtt));
      expect(out, contains('1\n00:00:01,000 --> 00:00:02,500\n<i>Hello</i>\n'));
      expect(out, contains('2\n01:00:00,000 --> 01:00:01,000\nBye\n'));
    });
    test('round trip', () {
      final once = toSrt(parseSubtitles(srt));
      expect(toSrt(parseSubtitles(once)), once);
    });
    test('plain text drops tags', () {
      expect(toPlainText(parseSubtitles(vtt)), 'Hello\nBye\n');
    });
    test('shift forward', () {
      final cues = shiftCues(parseSubtitles(srt), const Duration(seconds: 1));
      expect(cues[0].start, const Duration(seconds: 2));
    });
    test('shift back clamps at zero and drops what ends before the start', () {
      final cues = shiftCues(parseSubtitles(srt), const Duration(seconds: -2));
      expect(cues[0].start, Duration.zero);
      expect(cues[0].end, const Duration(milliseconds: 500));
      final gone = shiftCues(parseSubtitles(srt), const Duration(seconds: -3));
      expect(gone, hasLength(1));
      expect(gone[0].text, 'नमस्ते');
    });
  });
}
