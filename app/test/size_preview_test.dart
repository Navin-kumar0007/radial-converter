import 'dart:typed_data';

import 'package:flutter/widgets.dart' show Locale;
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/conversion.dart';
import 'package:shiftdrop/size_preview.dart';
import 'package:shiftdrop/words.dart';

final _jpeg = img.encodeJpg(img.Image(width: 64, height: 48));

PickedFile _file(String name, {int? size, void Function()? onRead}) {
  return PickedFile(
    name: name,
    size: size ?? _jpeg.length,
    head: _jpeg.sublist(0, 16),
    read: () async {
      onRead?.call();
      return _jpeg;
    },
  );
}

RadialAction _action(String id) => actionById(id)!;

void main() {
  late int conversions;
  late int reads;
  late PickedFile file;

  Future<List<PortableFile>> fake(RadialAction action, List<PortableFile> files) async {
    conversions++;
    return [PortableFile('out', Uint8List(1500))];
  }

  setUp(() {
    conversions = 0;
    reads = 0;
    file = _file('photo.jpg', onRead: () => reads++);
  });

  test('a picture with a size limit is tried, as the limit says little about it', () async {
    final previews = SizePreviews(file, FileKind.jpg, fake);
    expect(await previews.guess(_action('fit-email-image')), const SizeGuess.about(1500));
    expect(conversions, 1);
  });

  test('a picture too large to try gets its limit at once, with nothing read', () async {
    final large = SizePreviews(
      _file('huge.jpg', size: SizePreviews.maxTrialBytes + 1, onRead: () => reads++),
      FileKind.jpg,
      fake,
    );
    expect(await large.guess(_action('fit-image-100kb')), const SizeGuess.upTo(100 * 1024));
    expect(conversions, 0);
    expect(reads, 0);
  });

  test('a picture is tried once, however often it is asked', () async {
    final previews = SizePreviews(file, FileKind.jpg, fake);
    final action = _action('image-to-png');
    expect(await previews.guess(action), const SizeGuess.about(1500));
    expect(await previews.guess(action), const SizeGuess.about(1500));
    expect(conversions, 1);
    expect(reads, 1);
  });

  test('the file is read once for every slice tried', () async {
    final previews = SizePreviews(file, FileKind.jpg, fake);
    await previews.guess(_action('image-to-png'));
    await previews.guess(_action('image-to-webp'));
    expect(conversions, 2);
    expect(reads, 1);
  });

  test('choosing a tried slice takes its result, once, and only for the same file', () async {
    final previews = SizePreviews(file, FileKind.jpg, fake);
    final action = _action('image-to-png');
    await previews.guess(action);
    expect(previews.take(action, _file('photo.jpg')), isNull);
    final taken = previews.take(action, file);
    expect((await taken!).single.bytes.length, 1500);
    expect(previews.take(action, file), isNull);
    expect(conversions, 1);
  });

  test('nothing is tried for what asks first, video, HEIC, or a large picture', () async {
    final picture = SizePreviews(file, FileKind.jpg, fake);
    expect(await picture.guess(_action('image-crop')), isNull);
    final large = SizePreviews(
      _file('huge.jpg', size: SizePreviews.maxTrialBytes + 1),
      FileKind.jpg,
      fake,
    );
    expect(await large.guess(_action('image-to-png')), isNull);
    final video = SizePreviews(_file('clip.mp4'), FileKind.mp4, fake);
    expect(await video.guess(_action('video-to-webm')), isNull);
    final heic = SizePreviews(_file('photo.heic'), FileKind.heic, fake);
    expect(await heic.guess(_action('image-to-jpg')), isNull);
    expect(conversions, 0);
  });

  test('a video size limit is still promised', () async {
    final video = SizePreviews(_file('clip.mp4'), FileKind.mp4, fake);
    expect(await video.guess(_action('fit-email-video')), const SizeGuess.upTo(20 * 1024 * 1024));
  });

  test('a failed trial gives no size, and choosing it fails as a real run would', () async {
    final previews = SizePreviews(file, FileKind.jpg, (action, files) async {
      throw Fail.notConverted;
    });
    final action = _action('image-to-png');
    expect(await previews.guess(action), isNull);
    await expectLater(previews.take(action, file), throwsA(isA<EngineFailed>()));
  });

  test('only the last few results are kept', () async {
    final previews = SizePreviews(file, FileKind.jpg, fake);
    final ids = ['image-to-png', 'image-to-webp', 'image-to-gif', 'image-to-tiff', 'image-to-ico'];
    for (final id in ids) {
      await previews.guess(_action(id));
    }
    expect(previews.take(_action(ids.first), file), isNull);
    expect(previews.take(_action(ids.last), file), isNotNull);
  });

  test('sizes read as words, in English and Hindi', () {
    final english = wordsFor(const Locale('en'));
    expect(const SizeGuess.about(85 * 1024).describe(english), 'About 85 KB');
    expect(const SizeGuess.upTo(100 * 1024).describe(english), 'Up to 100 KB');
    final hindi = wordsFor(const Locale('hi'));
    expect(const SizeGuess.upTo(1024 * 1024).describe(hindi), '1.0 MB तक');
  });
}
