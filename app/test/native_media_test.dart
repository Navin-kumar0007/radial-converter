// Runs the desktop video path with the real engine, so it is checked without building an app.
// Skipped where FFmpeg is not installed.

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/convert_native.dart';
import 'package:shiftdrop/picked_file.dart';

void main() {
  final tools = EngineTools();
  final missing = tools.find('ffmpeg') == null || tools.find('ffprobe') == null;
  final skip = missing ? 'FFmpeg is not installed' : null;
  late Directory folder;
  late String clip;

  setUpAll(() {
    if (missing) return;
    folder = Directory.systemTemp.createTempSync('radial_native_');
    clip = p.join(folder.path, 'clip.mp4');
    final result = Process.runSync(tools.ffmpeg, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'testsrc2=duration=2:size=1280x720:rate=15',
      '-f',
      'lavfi',
      '-i',
      'sine=duration=2',
      '-c:v',
      platformH264Encoder(),
      '-b:v',
      '2000k',
      '-c:a',
      'aac',
      clip,
    ]);
    expect(result.exitCode, 0, reason: '${result.stderr}');
  });

  tearDownAll(() {
    if (!missing) folder.deleteSync(recursive: true);
  });

  PickedFile picked(String path) {
    final file = File(path);
    return PickedFile(
      name: p.basename(path),
      size: file.lengthSync(),
      head: file.readAsBytesSync().take(detectHeadBytes).toList(),
      read: file.readAsBytes,
      path: path,
    );
  }

  test('finds the engine, or says it cannot', () {
    expect(mediaEngineAvailableWith(tools), isTrue);
    final empty = EngineTools(environment: const {'PATH': '/nowhere'});
    if (empty.find('ffmpeg') == null) expect(mediaEngineAvailableWith(empty), isFalse);
  }, skip: skip);

  test('saves beside the original, never replacing it', () async {
    final before = File(clip).readAsBytesSync();
    final seen = <double>[];
    final results = await convertMedia(
      actionById('video-compress')!,
      [picked(clip)],
      const [FileKind.mp4],
      seen.add,
      ConvertControl(),
    );
    final result = results.single;
    expect(result.name, 'clip (compressed).mp4');
    expect(p.dirname(result.savedPath!), folder.path);
    expect(File(result.savedPath!).lengthSync(), result.size);
    expect(File(clip).readAsBytesSync(), before);
    expect(seen, isNotEmpty);
    expect(seen, everyElement(inInclusiveRange(0, 1)));
  }, skip: skip);

  test('a batch makes one result per file', () async {
    final second = p.join(folder.path, 'second.mp4');
    File(clip).copySync(second);
    final results = await convertMedia(
      actionById('video-mute')!,
      [picked(clip), picked(second)],
      const [FileKind.mp4, FileKind.mp4],
      (_) {},
      ConvertControl(),
    );
    expect(results.map((r) => r.name), ['clip (muted).mp4', 'second (muted).mp4']);
  }, skip: skip);

  test('cancel stops the engine', () async {
    final clean = Directory(p.join(folder.path, 'cancel'))..createSync();
    final input = p.join(clean.path, 'clip.mp4');
    File(clip).copySync(input);
    final control = ConvertControl();
    final running = convertMedia(
      actionById('video-to-webm')!,
      [picked(input)],
      const [FileKind.mp4],
      (_) {},
      control,
    );
    await Future<void>.delayed(const Duration(milliseconds: 100));
    control.cancel?.call();
    await expectLater(running, throwsA(isA<JobCancelled>()));
    final left = clean.listSync().map((e) => p.basename(e.path));
    expect(left, ['clip.mp4']);
  }, skip: skip);

  test('a failure arrives in plain words', () async {
    final silent = (await convertMedia(
      actionById('video-mute')!,
      [picked(clip)],
      const [FileKind.mp4],
      (_) {},
      ConvertControl(),
    )).single;
    await expectLater(
      convertMedia(
        actionById('video-extract-audio')!,
        [picked(silent.savedPath!)],
        const [FileKind.mp4],
        (_) {},
        ConvertControl(),
      ),
      throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('no sound'))),
    );
  }, skip: skip);

  group('HEIC photos', () {
    final photo = p.join('..', 'test-files', 'portrait.heic');

    test('come out upright, whole and in colour', () async {
      final decoded = img.decodePng(await decodeHeicWith(tools, photo))!;
      expect('${decoded.width}x${decoded.height}', '800x1200');
      // The first bar of the picture, which is red once it is the right way up.
      final top = decoded.getPixel(400, 100);
      expect(top.r, greaterThan(200));
      expect(top.g, lessThan(60));
    }, skip: skip);

    test('a damaged one fails in plain words', () async {
      final junk = p.join(folder.path, 'junk.heic');
      File(junk).writeAsBytesSync(List.filled(4096, 7));
      await expectLater(
        decodeHeicWith(tools, junk),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('damaged'))),
      );
    }, skip: skip);
  });

  test('a file with no path on disk says so', () async {
    await expectLater(
      convertMedia(
        actionById('video-mute')!,
        [PickedFile(name: 'x.mp4', size: 1, head: const [], read: () async => throw 'x')],
        const [FileKind.mp4],
        (_) {},
        ConvertControl(),
      ),
      throwsA(isA<EngineFailed>()),
    );
  });
}
