// Runs the real Android engine on a device or emulator. CI does this on every push:
//   flutter test integration_test/android_media_test.dart -d <device>

import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:integration_test/integration_test.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/android_media.dart';
import 'package:radialconverter/convert_native.dart';
import 'package:radialconverter/picked_file.dart';

import 'clip_data.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  late String clip;
  late List<int> original;

  setUpAll(() async {
    final folder = await getApplicationSupportDirectory();
    original = base64.decode(clipBase64);
    clip = p.join(folder.path, 'clip.mp4');
    File(clip).writeAsBytesSync(original);
  });

  PickedFile picked() {
    return PickedFile(
      name: 'clip.mp4',
      size: original.length,
      head: original.take(detectHeadBytes).toList(),
      read: () => File(clip).readAsBytes(),
      path: clip,
    );
  }

  Future<ConvertedFile> run(String id, {void Function(double)? onProgress}) async {
    final results = await convertMedia(
      actionById(id)!,
      [picked()],
      const [FileKind.mp4],
      onProgress ?? (_) {},
      ConvertControl(),
    );
    return results.single;
  }

  /// The results wait in the cache, and the file it says is really there.
  Future<String> where(ConvertedFile result) async {
    final cache = await getTemporaryDirectory();
    final outputs = Directory(p.join(cache.path, 'radial_output'));
    final found = outputs
        .listSync(recursive: true)
        .whereType<File>()
        .where((file) => p.basename(file.path) == result.name);
    final file = found.last;
    expect(file.lengthSync(), result.size);
    return file.path;
  }

  test('the clip is what the tests think it is', () async {
    final info = await probeOnPhone(clip);
    expect(info.videoCodec, 'avc');
    expect(info.audioCodec, 'aac');
    expect('${info.width}x${info.height}', '320x240');
    expect(info.seconds, closeTo(2, 0.3));
    expect(latin1.decode(original), contains(clipLocation));
  });

  test('the engine is here, and offers only what it can make', () {
    expect(mediaEngineAvailable(), isTrue);
    expect(mediaOutputsHere(), phoneMediaOutputs);
  });

  test('compress makes a real MP4, and leaves out where it was filmed', () async {
    final seen = <double>[];
    final result = await run('video-compress', onProgress: seen.add);
    expect(result.name, 'clip (compressed).mp4');
    final path = await where(result);
    final info = await probeOnPhone(path);
    expect(info.videoCodec, 'avc');
    expect(info.audioCodec, 'aac');
    expect(info.seconds, closeTo(2, 0.3));
    final bytes = File(path).readAsBytesSync();
    expect(detectKind(bytes), FileKind.mp4);
    expect(latin1.decode(bytes), isNot(contains(clipLocation)));
    expect(seen, everyElement(inInclusiveRange(0, 1)));
  });

  test('the original is not touched', () async {
    await run('video-compress');
    expect(File(clip).readAsBytesSync(), original);
  });

  test('mute removes the sound and keeps the picture', () async {
    final info = await probeOnPhone(await where(await run('video-mute')));
    expect(info.hasAudio, isFalse);
    expect(info.videoCodec, 'avc');
    expect('${info.width}x${info.height}', '320x240');
  });

  test('copying a stream also leaves out where it was filmed', () async {
    final path = await where(await run('video-mute'));
    expect(latin1.decode(File(path).readAsBytesSync()), isNot(contains(clipLocation)));
  });

  test('extract sound makes an M4A with no picture', () async {
    final result = await run('video-extract-audio');
    expect(p.extension(result.name), '.m4a');
    final info = await probeOnPhone(await where(result));
    expect(info.hasVideo, isFalse);
    expect(info.audioCodec, 'aac');
    expect(info.seconds, closeTo(2, 0.3));
  });

  test('rotate turns the picture', () async {
    final info = await probeOnPhone(await where(await run('video-rotate')));
    expect('${info.width}x${info.height}', '240x320');
  });

  test('resize halves the picture', () async {
    final info = await probeOnPhone(await where(await run('video-resize')));
    expect('${info.width}x${info.height}', '160x120');
  });

  test('a size limit is met', () async {
    final result = await run('fit-whatsapp-video');
    expect(result.size, lessThanOrEqualTo(16 * 1024 * 1024));
    expect((await probeOnPhone(await where(result))).videoCodec, 'avc');
  });

  test('cancel stops it and leaves nothing behind', () async {
    final cache = await getTemporaryDirectory();
    final outputs = Directory(p.join(cache.path, 'radial_output'));
    final before = outputs.listSync().length;
    final control = ConvertControl();
    final running = convertMedia(
      actionById('video-compress')!,
      [picked()],
      const [FileKind.mp4],
      (_) {},
      control,
    );
    // Stopped as soon as it can be, whichever stage it reached.
    while (control.cancel == null) {
      await Future<void>.delayed(const Duration(milliseconds: 1));
    }
    await Future<void>.delayed(const Duration(milliseconds: 50));
    control.cancel!();
    await expectLater(running, throwsA(isA<JobCancelled>()));
    expect(outputs.listSync().length, before);
  });

  test('a HEIC photo comes out upright as a PNG', () async {
    final folder = await getApplicationSupportDirectory();
    final photo = p.join(folder.path, 'portrait.heic');
    File(photo).writeAsBytesSync(base64.decode(portraitHeicBase64));
    final png = await decodeHeicOnPhone(photo);
    expect(detectKind(png), FileKind.png);
    final decoded = img.decodePng(png)!;
    expect('${decoded.width}x${decoded.height}', '800x1200');
    // The first bar of the picture, which is red once it is the right way up.
    final top = decoded.getPixel(400, 100);
    expect(top.r, greaterThan(200));
    expect(top.g, lessThan(60));
  });

  test('a damaged file fails in plain words', () async {
    final junk = p.join(p.dirname(clip), 'junk.mp4');
    File(junk).writeAsBytesSync(List.filled(4096, 7));
    await expectLater(
      convertMedia(
        actionById('video-mute')!,
        [
          PickedFile(
            name: 'junk.mp4',
            size: 4096,
            head: const [],
            read: () async => throw 'x',
            path: junk,
          ),
        ],
        const [FileKind.mp4],
        (_) {},
        ConvertControl(),
      ),
      throwsA(
        isA<EngineFailed>().having((e) => e.message, 'message', contains('could not be read')),
      ),
    );
  });
}
