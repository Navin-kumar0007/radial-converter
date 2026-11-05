// Runs the real Android engine on a device or emulator. CI does this on every push:
//   flutter test integration_test/android_media_test.dart -d <device>

import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:integration_test/integration_test.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/android_media.dart';
import 'package:radialconverter/convert_native.dart';
import 'package:radialconverter/pdf_engine.dart';
import 'package:radialconverter/picked_file.dart';
import 'package:radialconverter/shared_files.dart';

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

  testWidgets('a locked PDF asks, then opens and unlocks with its password', (tester) async {
    final locked = PortableFile('locked.pdf', base64.decode(lockedPdfBase64));
    final remove = actionById('pdf-remove-password')!;
    await expectLater(convertPdf(remove, [locked], (_) {}), throwsA(isA<PasswordNeeded>()));
    final out = await convertPdf(
      remove,
      [locked],
      (_) {},
      options: const ActionOptions(password: 'open sesame'),
    );
    final unlocked = out.single.file;
    await expectLater(
      convertPdf(remove, [unlocked], (_) {}),
      throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('no password'))),
    );
  });

  group('7z and RAR on the phone', () {
    Future<PickedFile> fileOf(String name, String data) async {
      final folder = await getApplicationSupportDirectory();
      final bytes = base64.decode(data);
      final path = p.join(folder.path, name);
      File(path).writeAsBytesSync(bytes);
      return PickedFile(
        name: name,
        size: bytes.length,
        head: bytes,
        read: () => File(path).readAsBytes(),
        path: path,
      );
    }

    Future<Archive> unpacked(String name, String data) async {
      return ZipDecoder().decodeBytes(await unpackArchive(await fileOf(name, data)));
    }

    testWidgets('a RAR 5 comes out whole', (tester) async {
      final file = (await unpacked('a.rar', rar5Base64)).files.single;
      expect(file.name, 'test.bin');
      expect(file.readBytes(), hasLength(1200));
    });

    testWidgets('a 7z using LZMA2 comes out whole', (tester) async {
      final file = (await unpacked('a.7z', sevenZipBase64)).files.single;
      expect(file.name, 'file1');
      expect(file.readBytes(), hasLength(2844));
    });

    testWidgets('a RAR 4 gives its real files and no link', (tester) async {
      final names = (await unpacked('b.rar', rar4Base64)).files.map((file) => file.name).toSet();
      expect(names, {'test.txt', 'testdir/test.txt'});
    });

    testWidgets('a file named in Hindi keeps its name', (tester) async {
      final file = (await unpacked('hindi.7z', hindi7zBase64)).files.single;
      expect(file.name, 'पोर्ट्रेट.txt');
    });

    testWidgets('a locked one says so', (tester) async {
      await expectLater(
        unpackArchive(await fileOf('locked.7z', locked7zBase64)),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('password'))),
      );
    });

    testWidgets('a broken one is a plain error, not a crash', (tester) async {
      final folder = await getApplicationSupportDirectory();
      final path = p.join(folder.path, 'cut.rar');
      final bytes = base64.decode(rar5Base64);
      File(path).writeAsBytesSync(bytes.sublist(0, bytes.length ~/ 2));
      final file = PickedFile(
        name: 'cut.rar',
        size: bytes.length ~/ 2,
        head: bytes,
        read: () => File(path).readAsBytes(),
        path: path,
      );
      await expectLater(unpackArchive(file), throwsA(isA<EngineFailed>()));
    });
  });

  group('sharing a result', () {
    test('a result gets an address other apps can read', () async {
      final folder = (await mediaChannel.invokeMethod<String>('handOverFolder'))!;
      final path = p.join(folder, 'photo (converted).jpg');
      File(path).writeAsBytesSync([1, 2, 3]);
      final address = await shareOnPhone(path, 'image/jpeg', dryRun: true);
      expect(address, startsWith('content://'));
      expect(address, contains('.results/'));
    });

    test('anything else in the app\'s storage can\'t be shared', () async {
      final folder = await getApplicationSupportDirectory();
      final path = p.join(folder.path, 'private.txt');
      File(path).writeAsStringSync('secret');
      await expectLater(
        shareOnPhone(path, 'text/plain', dryRun: true),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('a file that has gone says so', () async {
      await expectLater(
        shareOnPhone('/data/no/such/file', 'text/plain', dryRun: true),
        throwsA(isA<EngineFailed>()),
      );
    });
  });

  testWidgets('a frame comes back as a small picture', (tester) async {
    final frame = await videoFrame(picked(), 0.5);
    expect(detectKind(frame), FileKind.jpg);
    final picture = img.decodeJpg(frame)!;
    expect(picture.width, lessThanOrEqualTo(480));
    expect(picture.height, lessThanOrEqualTo(480));
  });

  testWidgets('a file with no pictures is a plain error', (tester) async {
    final folder = await getApplicationSupportDirectory();
    final notes = p.join(folder.path, 'notes.mp4');
    File(notes).writeAsBytesSync(List.filled(100, 1));
    final file = PickedFile(
      name: 'notes.mp4',
      size: 100,
      head: const [],
      read: () => File(notes).readAsBytes(),
      path: notes,
    );
    await expectLater(videoFrame(file, 0), throwsA(isA<EngineFailed>()));
  });

  testWidgets('looking inside says how long it is', (tester) async {
    expect((await probeMedia(picked())).seconds, greaterThan(0));
  });

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

  test('trim keeps only the part asked for', () async {
    final results = await convertMedia(
      actionById('video-trim')!,
      [picked()],
      const [FileKind.mp4],
      (_) {},
      ConvertControl(),
      const ActionOptions(endSeconds: 1),
    );
    expect(results.single.name, 'clip (trimmed).mp4');
    final info = await probeOnPhone(await where(results.single));
    expect(info.seconds, closeTo(1, 0.2));
    expect(info.videoCodec, 'avc');
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

  // `tool/test_android_device.sh` keeps sharing a file with the app from outside it, as another
  // app would, through the real share filter. See the debug-only TestShareProvider.
  test('a file shared from another app arrives, by its own name', () async {
    final shared = await listenForSharedFiles()
        .firstWhere((event) => !event.receiving)
        .timeout(const Duration(minutes: 5));
    final file = shared.files.first;
    expect(file.name, 'shared notes.srt');
    expect(shared.failed, 0);
    expect(utf8.decode(await file.read()), contains('From another app'));
    expect(detectKind(file.head, fileName: file.name), FileKind.srt);
  }, timeout: const Timeout(Duration(minutes: 6)));

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
