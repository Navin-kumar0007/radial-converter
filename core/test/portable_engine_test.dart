import 'dart:convert';
import 'dart:typed_data';

import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

img.Image picture({int width = 640, int height = 480, int channels = 3}) {
  final image = img.Image(width: width, height: height, numChannels: channels);
  for (final pixel in image) {
    pixel
      ..r = pixel.x * 255 ~/ width
      ..g = pixel.y * 255 ~/ height
      ..b = (pixel.x * pixel.y) % 256;
    if (channels == 4) pixel.a = 255;
  }
  return image;
}

/// A JPEG with EXIF saying "rotate 90 degrees" and a GPS tag, like a phone photo.
Uint8List phonePhoto() {
  final jpeg = img.encodeJpg(picture());
  final tiff = BytesBuilder();
  void u16(int value) => tiff.add([value & 0xFF, value >> 8]);
  void u32(int value) => tiff.add([for (var i = 0; i < 4; i++) (value >> (8 * i)) & 0xFF]);
  tiff.add(ascii.encode('II*\u0000'));
  u32(8);
  u16(2);
  u16(0x112);
  u16(3);
  u32(1);
  u16(6);
  u16(0);
  u16(0x8825);
  u16(4);
  u32(1);
  u32(38);
  u32(0);
  u16(1);
  u16(1);
  u16(2);
  u32(2);
  tiff.add(ascii.encode('N\u0000\u0000\u0000'));
  u32(0);
  final body = [...ascii.encode('Exif\u0000\u0000'), ...tiff.takeBytes()];
  final length = body.length + 2;
  return Uint8List.fromList([
    ...jpeg.sublist(0, 2),
    0xFF,
    0xE1,
    length >> 8,
    length & 0xFF,
    ...body,
    ...jpeg.sublist(2),
  ]);
}

Future<PortableFile> run(
  String id,
  Uint8List bytes, {
  String name = 'photo.jpg',
  ActionOptions options = const ActionOptions(),
}) async {
  final outputs = await runPortable(actionById(id)!, [PortableFile(name, bytes)], options: options);
  return outputs.single;
}

FileKind kind(PortableFile file) => detectKind(file.bytes, fileName: file.name);

bool containsAscii(Uint8List bytes, String text) => latin1.decode(bytes).contains(text);

void main() {
  final jpg = img.encodeJpg(picture());
  final png = img.encodePng(picture());

  group('which actions run everywhere', () {
    final portable = actionCatalogue.where(
      (action) => action.accepts.any((kind) => canRunPortably(action, kind)),
    );

    test('images and subtitles do, and nothing else', () {
      for (final action in portable) {
        final families = action.accepts.map((kind) => kind.family).toSet();
        expect(
          families.intersection({FileFamily.image, FileFamily.subtitle}),
          isNotEmpty,
          reason: action.id,
        );
      }
    });

    test('there are about two dozen', () {
      expect(portable.length, inInclusiveRange(20, 30));
    });

    test('formats it cannot read or write are left out', () {
      expect(canRunPortably(actionById('image-to-png')!, FileKind.heic), isFalse);
      expect(canRunPortably(actionById('image-to-png')!, FileKind.avif), isFalse);
      expect(canRunPortably(actionById('image-to-png')!, FileKind.svg), isFalse);
      expect(canRunPortably(actionById('image-to-avif')!, FileKind.jpg), isFalse);
      expect(canRunPortably(actionById('video-to-mp3')!, FileKind.mp4), isFalse);
      expect(canRunPortably(actionById('pdf-merge')!, FileKind.pdf), isFalse);
    });

    test('every portable action really runs on a JPG or an SRT', () async {
      const srt = '1\n00:00:01,000 --> 00:00:02,000\nHi\n';
      const options = ActionOptions(
        crop: (left: 0, top: 0, width: 10, height: 10),
        shift: Duration(seconds: 1),
      );
      for (final action in portable) {
        final isSubtitle = action.accepts.contains(FileKind.srt);
        final file = isSubtitle
            ? PortableFile('a.srt', utf8.encode(srt))
            : PortableFile('a.jpg', jpg);
        final outputs = await runPortable(action, [file], options: options);
        expect(outputs.single.bytes, isNotEmpty, reason: action.id);
      }
    });
  });

  group('conversions', () {
    final expected = {
      'image-to-png': FileKind.png,
      'image-to-webp': FileKind.webp,
      'image-to-gif': FileKind.gif,
      'image-to-tiff': FileKind.tiff,
      'image-to-ico': FileKind.ico,
      'image-to-pdf': FileKind.pdf,
    };
    expected.forEach((id, output) {
      test(id, () async {
        final result = await run(id, jpg);
        expect(kind(result), output);
        expect(result.name, 'photo (converted).${output.extension}');
      });
    });

    test('PNG to JPG', () async {
      expect(kind(await run('image-to-jpg', png, name: 'a.png')), FileKind.jpg);
    });

    test('every readable format opens', () async {
      final sources = {
        'a.png': png,
        'a.jpg': jpg,
        'a.webp': img.encodeWebP(picture()),
        'a.gif': img.encodeGif(picture(), singleFrame: true),
        'a.bmp': img.encodeBmp(picture()),
        'a.tiff': img.encodeTiff(picture()),
        'a.ico': img.encodeIco(picture(width: 64, height: 64)),
      };
      for (final entry in sources.entries) {
        final out = await run('image-to-jpg', entry.value, name: entry.key);
        expect(kind(out), FileKind.jpg, reason: entry.key);
      }
    });

    test('the input bytes are not changed', () async {
      final copy = Uint8List.fromList(jpg);
      await run('image-to-png', copy);
      expect(copy, jpg);
    });

    test('a PNG called .jpg is treated as the PNG it is', () async {
      final result = await run('image-to-jpg', png, name: 'liar.jpg');
      expect(kind(result), FileKind.jpg);
      expect(result.name, 'liar (converted).jpg');
    });
  });

  group('privacy and rotation', () {
    final photo = phonePhoto();

    test('the test photo has what we need to remove', () {
      expect(containsAscii(photo, 'Exif'), isTrue);
      // The decoder applies the EXIF rotation itself, so a 640 x 480 file reads as tall.
      expect(img.decodeJpg(photo)!.width, 480);
    });

    for (final id in [
      'image-to-jpg',
      'image-to-png',
      'image-to-webp',
      'fit-whatsapp-photo',
      'fit-instagram',
      'image-compress',
      'image-strip-metadata',
      'image-rotate',
      'image-flip',
      'image-resize',
      'fit-image-100kb',
    ]) {
      test('$id leaves no EXIF', () async {
        final result = await run(id, photo);
        expect(containsAscii(result.bytes, 'Exif'), isFalse);
        final decoded = img.decodeImage(result.bytes)!;
        expect(decoded.exif.isEmpty, isTrue);
      });
    }

    test('the picture comes out upright', () async {
      final decoded = img.decodeImage((await run('image-to-png', photo)).bytes)!;
      expect(decoded.width, 480);
      expect(decoded.height, 640);
    });

    test('PDF pages are upright too and have no EXIF', () async {
      final result = await run('image-to-pdf', photo);
      expect(containsAscii(result.bytes, 'Exif'), isFalse);
      expect(latin1.decode(result.bytes), contains('/MediaBox [0 0 480.00 640.00]'));
    });
  });

  group('make it fit', () {
    test('WhatsApp: long side 1600 and JPG', () async {
      final big = img.encodeJpg(picture(width: 3200, height: 1600));
      final result = await run('fit-whatsapp-photo', big);
      final decoded = img.decodeImage(result.bytes)!;
      expect(kind(result), FileKind.jpg);
      expect(decoded.width, 1600);
      expect(decoded.height, 800);
      expect(result.name, 'photo (whatsapp).jpg');
    });

    test('WhatsApp never enlarges', () async {
      final decoded = img.decodeImage((await run('fit-whatsapp-photo', jpg)).bytes)!;
      expect(decoded.width, 640);
    });

    test('a tall picture limits its height', () async {
      final tall = img.encodeJpg(picture(width: 1000, height: 4000));
      final decoded = img.decodeImage((await run('fit-whatsapp-photo', tall)).bytes)!;
      expect(decoded.height, 1600);
      expect(decoded.width, 400);
    });

    test('Instagram is exactly 1080 x 1350, for wide and tall pictures', () async {
      for (final source in [picture(width: 2000, height: 500), picture(width: 500, height: 2000)]) {
        final result = await run('fit-instagram', img.encodeJpg(source));
        final decoded = img.decodeImage(result.bytes)!;
        expect('${decoded.width}x${decoded.height}', '1080x1350');
      }
    });

    test('web-ready is WebP with long side 1920', () async {
      final big = img.encodeJpg(picture(width: 3000, height: 1500));
      final result = await run('fit-web', big);
      expect(kind(result), FileKind.webp);
      expect(img.decodeImage(result.bytes)!.width, 1920);
    });

    test('under 100 KB really is, and stays a JPG', () async {
      final big = img.encodeJpg(picture(width: 2000, height: 1500), quality: 95);
      final result = await run('fit-image-100kb', big);
      expect(result.bytes.length, lessThanOrEqualTo(100 * 1024));
      expect(kind(result), FileKind.jpg);
      expect(result.name, 'photo (under 100 KB).jpg');
    });

    test('a PNG stays a PNG, by shrinking', () async {
      final big = img.encodePng(picture(width: 1500, height: 1500));
      final result = await run('fit-image-100kb', big, name: 'a.png');
      expect(result.bytes.length, lessThanOrEqualTo(100 * 1024));
      expect(kind(result), FileKind.png);
    });

    test('uses the best quality that fits', () async {
      final result = await run('fit-image-1mb', jpg);
      final atMax = img.encodeJpg(img.decodeImage(jpg)!, quality: 95);
      expect(result.bytes.length, atMax.length);
    });
  });

  group('tools', () {
    test('resize defaults to half', () async {
      final decoded = img.decodeImage((await run('image-resize', jpg)).bytes)!;
      expect('${decoded.width}x${decoded.height}', '320x240');
    });

    test('resize to a size, never enlarging', () async {
      Future<int> widthFor(int side) async {
        final out = await run('image-resize', jpg, options: ActionOptions(longSide: side));
        return img.decodeImage(out.bytes)!.width;
      }

      expect(await widthFor(100), 100);
      expect(await widthFor(5000), 640);
    });

    test('rotate swaps the sides', () async {
      final decoded = img.decodeImage((await run('image-rotate', png, name: 'a.png')).bytes)!;
      expect('${decoded.width}x${decoded.height}', '480x640');
    });

    test('rotate refuses other angles', () async {
      await expectLater(
        run('image-rotate', jpg, options: const ActionOptions(degrees: 45)),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('flip mirrors the pixels', () async {
      final original = img.decodePng(png)!;
      final flipped = img.decodePng((await run('image-flip', png, name: 'a.png')).bytes)!;
      expect(flipped.getPixel(0, 0).r, original.getPixel(639, 0).r);
      final vertical = img.decodePng(
        (await run(
          'image-flip',
          png,
          name: 'a.png',
          options: const ActionOptions(flipVertical: true),
        )).bytes,
      )!;
      expect(vertical.getPixel(0, 0).g, original.getPixel(0, 479).g);
    });

    test('crop is exact', () async {
      final out = await run(
        'image-crop',
        jpg,
        options: const ActionOptions(crop: (left: 10, top: 20, width: 100, height: 50)),
      );
      final decoded = img.decodeImage(out.bytes)!;
      expect('${decoded.width}x${decoded.height}', '100x50');
    });

    test('a crop outside the picture is refused, not squeezed in', () async {
      await expectLater(
        run(
          'image-crop',
          jpg,
          options: const ActionOptions(crop: (left: 600, top: 0, width: 100, height: 50)),
        ),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('crop without an area says so', () async {
      await expectLater(run('image-crop', jpg), throwsA(isA<EngineFailed>()));
    });

    test('compress makes a JPG smaller', () async {
      final big = img.encodeJpg(picture(width: 1200, height: 900), quality: 100);
      expect((await run('image-compress', big)).bytes.length, lessThan(big.length));
    });

    test('compress reduces a PNG to a palette and still reads back', () async {
      final result = await run('image-compress', png, name: 'a.png');
      final decoded = img.decodePng(result.bytes)!;
      expect(decoded.hasPalette, isTrue);
      expect(decoded.width, 640);
    });
  });

  group('transparency', () {
    final clear = img.Image(width: 32, height: 32, numChannels: 4);

    test('transparent areas turn white in JPG, not black', () async {
      final result = await run('image-to-jpg', img.encodePng(clear), name: 'a.png');
      final pixel = img.decodeJpg(result.bytes)!.getPixel(5, 5);
      expect(pixel.r, greaterThan(250));
      expect(pixel.g, greaterThan(250));
      expect(pixel.b, greaterThan(250));
    });

    test('and in PDF pages', () async {
      final result = await run('image-to-pdf', img.encodePng(clear), name: 'a.png');
      expect(kind(result), FileKind.pdf);
    });

    test('PNG keeps its transparency', () async {
      final result = await run('image-resize', img.encodePng(clear), name: 'a.png');
      expect(img.decodePng(result.bytes)!.getPixel(1, 1).a, 0);
    });
  });

  group('batches and merges', () {
    test('one output per file, in order', () async {
      final outputs = await runPortable(actionById('image-to-webp')!, [
        PortableFile('a.jpg', jpg),
        PortableFile('b.png', png),
      ]);
      expect(outputs.map((file) => file.name), ['a (converted).webp', 'b (converted).webp']);
    });

    test('images to one PDF keeps every page', () async {
      final outputs = await runPortable(actionById('images-to-pdf')!, [
        PortableFile('a.jpg', jpg),
        PortableFile('b.png', png),
        PortableFile('c.jpg', jpg),
      ]);
      expect(outputs.single.name, 'a (combined).pdf');
      expect(latin1.decode(outputs.single.bytes), contains('/Count 3'));
    });

    test('progress rises to 1', () async {
      final seen = <double>[];
      await runPortable(actionById('image-to-png')!, [
        PortableFile('a.jpg', jpg),
        PortableFile('b.jpg', jpg),
      ], onProgress: seen.add);
      expect(seen, isNotEmpty);
      expect(seen.last, 1);
      expect(seen, everyElement(inInclusiveRange(0, 1)));
      for (var i = 1; i < seen.length; i++) {
        expect(seen[i], greaterThanOrEqualTo(seen[i - 1]));
      }
    });
  });

  group('subtitles', () {
    final srt = utf8.encode('1\n00:00:01,000 --> 00:00:02,000\nनमस्ते\n');

    test('to VTT, text and back', () async {
      final vtt = await run('subtitle-to-vtt', srt, name: 'a.srt');
      expect(utf8.decode(vtt.bytes), startsWith('WEBVTT'));
      expect(vtt.name, 'a (converted).vtt');
      final text = await run('subtitle-to-text', srt, name: 'a.srt');
      expect(utf8.decode(text.bytes), 'नमस्ते\n');
      final back = await run('subtitle-to-srt', vtt.bytes, name: 'a.vtt');
      expect(utf8.decode(back.bytes), contains('00:00:01,000'));
    });

    test('shift keeps the format', () async {
      final shifted = await run(
        'subtitle-shift',
        srt,
        name: 'a.srt',
        options: const ActionOptions(shift: Duration(seconds: 1)),
      );
      expect(shifted.name, 'a (shifted).srt');
      expect(utf8.decode(shifted.bytes), contains('00:00:02,000'));
    });

    test('shift without an amount says so', () async {
      await expectLater(run('subtitle-shift', srt, name: 'a.srt'), throwsA(isA<EngineFailed>()));
    });

    test('text with no cues', () async {
      final blank = utf8.encode('WEBVTT\n\nNOTE nothing here\n');
      await expectLater(run('subtitle-to-srt', blank, name: 'a.vtt'), throwsA(isA<EngineFailed>()));
    });
  });

  group('bad files fail in plain words', () {
    Matcher plain(String words) {
      return throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains(words)));
    }

    test('wrong kind', () async {
      await expectLater(
        run('image-to-png', utf8.encode('text'), name: 'a.png'),
        plain("can't use"),
      );
    });

    test('a picture over the pixel limit is refused before decoding it', () async {
      final forged = Uint8List.fromList(jpg);
      var i = 2;
      while (forged[i + 1] != 0xC0) {
        i += 2 + (forged[i + 2] << 8 | forged[i + 3]);
      }
      const side = 15000;
      forged[i + 5] = side >> 8;
      forged[i + 6] = side & 0xFF;
      forged[i + 7] = side >> 8;
      forged[i + 8] = side & 0xFF;
      await expectLater(run('image-to-png', forged), plain('too large'));
    });

    test('the limit allows a 200 megapixel phone photo', () {
      expect(16320 * 12240, lessThan(maxPortablePixels));
    });

    test('a truncated JPEG', () async {
      final broken = jpg.sublist(0, 40);
      await expectLater(run('image-to-png', broken), plain('could not be read'));
    });

    test('random bytes after a PNG signature', () async {
      final broken = Uint8List.fromList([...png.sublist(0, 8), 1, 2, 3, 4]);
      await expectLater(run('image-to-jpg', broken, name: 'a.png'), plain('could not be read'));
    });

    test('merging one file', () async {
      const action = RadialAction(
        id: 'x',
        label: 'Join',
        mode: ActionMode.tools,
        engine: Engine.builtIn,
        accepts: {FileKind.jpg},
        suffix: 'x',
        minFiles: 2,
      );
      await expectLater(runPortable(action, [PortableFile('a.jpg', jpg)]), plain('at least 2'));
    });

    test('an animated GIF is not silently flattened to its first frame', () async {
      final first = picture(width: 16, height: 16);
      first.addFrame(picture(width: 16, height: 16));
      final animated = img.encodeGif(first);
      await expectLater(run('image-resize', animated, name: 'a.gif'), plain('Animated'));
    });

    test('an animated GIF can still become a still JPG', () async {
      final first = picture(width: 16, height: 16);
      first.addFrame(picture(width: 16, height: 16));
      final out = await run('image-to-jpg', img.encodeGif(first), name: 'a.gif');
      expect(kind(out), FileKind.jpg);
    });
  });

  group('a HEIC photo the platform has decoded', () {
    PortableFile decoded() => PortableFile('photo.heic', img.encodePng(picture()));

    test('can run what makes sense', () {
      for (final id in ['image-to-jpg', 'image-to-png', 'image-compress', 'image-rotate']) {
        expect(canRunDecoded(actionById(id)!, FileKind.heic), isTrue, reason: id);
      }
    });

    test('nothing else is treated this way', () {
      expect(canRunDecoded(actionById('image-to-png')!, FileKind.png), isFalse);
      expect(canRunDecoded(actionById('video-mute')!, FileKind.heic), isFalse);
      expect(canRunDecoded(actionById('image-to-avif')!, FileKind.heic), isFalse);
    });

    test('compressing makes a JPG rather than a huge PNG', () async {
      final out = (await runPortable(actionById('image-compress')!, [decoded()])).single;
      expect(out.name, 'photo (compressed).jpg');
      expect(detectKind(out.bytes), FileKind.jpg);
    });

    test('asking for PNG still makes one', () async {
      final out = (await runPortable(actionById('image-to-png')!, [decoded()])).single;
      expect(out.name, 'photo (converted).png');
      expect(detectKind(out.bytes), FileKind.png);
    });

    test('an ordinary PNG stays a PNG', () async {
      final png = PortableFile('photo.png', img.encodePng(picture()));
      final out = (await runPortable(actionById('image-compress')!, [png])).single;
      expect(detectKind(out.bytes), FileKind.png);
    });
  });
}
