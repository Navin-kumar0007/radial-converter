// End-to-end tests with the real engines. Samples are generated, so nothing is checked in.
// Skipped when the engines are not installed.

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

final tools = EngineTools();
final runner = ActionRunner(tools);
late Directory folder;
late String png, jpg, mp4, wav, pdf, srt, zip, gpsJpg, alphaPng;

String? missingEngines() {
  const needed = ['vips', 'vipsheader', 'ffmpeg', 'ffprobe', 'qpdf'];
  final missing = needed.where((tool) => tools.find(tool) == null);
  return missing.isEmpty ? null : 'Not installed: ${missing.join(', ')}';
}

void sh(String executable, List<String> args) {
  final result = Process.runSync(executable, args, workingDirectory: folder.path);
  if (result.exitCode != 0) throw StateError('$executable failed: ${result.stderr}');
}

/// A JPEG with EXIF saying "rotate 90 degrees" and a GPS tag, like a phone photo.
Uint8List withExif(Uint8List jpeg) {
  final tiff = BytesBuilder();
  void u16(int value) => tiff.add([value & 0xFF, value >> 8]);
  void u32(int value) => tiff.add([for (var i = 0; i < 4; i++) (value >> (8 * i)) & 0xFF]);
  tiff.add(ascii.encode('II*\u0000'));
  u32(8);
  u16(2); // IFD0: two entries
  u16(0x112);
  u16(3);
  u32(1);
  u16(6);
  u16(0); // Orientation = 6
  u16(0x8825);
  u16(4);
  u32(1);
  u32(38); // GPS IFD pointer
  u32(0);
  u16(1); // GPS IFD: one entry
  u16(1);
  u16(2);
  u32(2);
  tiff.add(ascii.encode('N\u0000\u0000\u0000')); // GPSLatitudeRef = N
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

/// Runs an action through the queue, the way the app will.
Future<List<String>> runAction(
  String id,
  List<String> inputs, {
  ActionOptions options = const ActionOptions(),
  String? outputFolder,
}) async {
  final queue = JobQueue(maxParallel: 1);
  final job = queue.add(
    (context) =>
        runner.run(actionById(id)!, inputs, context, options: options, outputFolder: outputFolder),
  );
  return job.result;
}

Future<FileKind> kindOf(String path) async {
  final bytes = await File(
    path,
  ).openRead(0, detectHeadBytes).fold<List<int>>(<int>[], (all, chunk) => all..addAll(chunk));
  return detectKind(bytes, fileName: p.basename(path));
}

String header(String path) {
  final result = Process.runSync(tools.vipsHeader, ['-a', path]);
  return result.stdout as String;
}

String imageSize(String path) {
  final width = Process.runSync(tools.vipsHeader, ['-f', 'width', path]).stdout as String;
  final height = Process.runSync(tools.vipsHeader, ['-f', 'height', path]).stdout as String;
  return '${width.trim()}x${height.trim()}';
}

double seconds(String path) {
  final result = Process.runSync(tools.ffprobe, [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    path,
  ]);
  return double.parse((result.stdout as String).trim());
}

int pdfPages(String path) {
  final result = Process.runSync(tools.qpdf, ['--show-npages', path]);
  return int.parse((result.stdout as String).trim());
}

/// No temporary folders left behind.
void expectClean(String directory) {
  final leftovers = Directory(
    directory,
  ).listSync().where((entry) => p.basename(entry.path).startsWith('.radial-'));
  expect(leftovers, isEmpty);
}

/// True if [bytes] contains [text] anywhere.
Matcher containsOnce(String text) =>
    predicate<List<int>>((bytes) => latin1.decode(bytes).contains(text), 'contains "$text"');

void main() {
  final skip = missingEngines();

  setUpAll(() {
    if (skip != null) return;
    folder = Directory.systemTemp.createTempSync('radial_engines_');
    png = p.join(folder.path, 'base.png');
    jpg = p.join(folder.path, 'base.jpg');
    mp4 = p.join(folder.path, 'clip.mp4');
    wav = p.join(folder.path, 'tone.wav');
    pdf = p.join(folder.path, 'doc.pdf');
    srt = p.join(folder.path, 'subs.srt');
    zip = p.join(folder.path, 'pack.zip');
    gpsJpg = p.join(folder.path, 'phone.jpg');
    alphaPng = p.join(folder.path, 'alpha.png');

    sh(tools.ffmpeg, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'testsrc=size=640x480:rate=1',
      '-frames:v',
      '1',
      png,
    ]);
    sh(tools.vips, ['copy', png, jpg]);
    File(gpsJpg).writeAsBytesSync(withExif(File(jpg).readAsBytesSync()));
    sh(tools.ffmpeg, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'color=c=red@0.0:s=64x64,format=rgba',
      '-frames:v',
      '1',
      alphaPng,
    ]);
    sh(tools.ffmpeg, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'testsrc2=duration=2:size=640x360:rate=15',
      '-f',
      'lavfi',
      '-i',
      'sine=duration=2',
      '-c:v',
      'h264_videotoolbox',
      '-b:v',
      '1000k',
      '-c:a',
      'aac',
      mp4,
    ]);
    sh(tools.ffmpeg, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'sine=duration=2',
      wav,
    ]);
    File(
      pdf,
    ).writeAsBytesSync(buildImagePdf([File(jpg).readAsBytesSync(), File(jpg).readAsBytesSync()]));
    File(srt).writeAsStringSync('1\n00:00:01,000 --> 00:00:02,000\nHello\n');
    File(p.join(folder.path, 'note.txt')).writeAsStringSync('hi');
    sh(tools.bsdtar, ['-cf', zip, '--format', 'zip', 'note.txt']);
  });

  tearDownAll(() {
    if (skip == null) folder.deleteSync(recursive: true);
  });

  group('images', skip: skip, () {
    final conversions = {
      'image-to-jpg': FileKind.jpg,
      'image-to-webp': FileKind.webp,
      'image-to-avif': FileKind.avif,
      'image-to-gif': FileKind.gif,
      'image-to-tiff': FileKind.tiff,
      'image-to-ico': FileKind.ico,
      'image-to-pdf': FileKind.pdf,
    };
    conversions.forEach((id, kind) {
      test(id, () async {
        final out = (await runAction(id, [png])).single;
        expect(await kindOf(out), kind);
        expect(p.basename(out), 'base (converted).${kind.extension}');
      });
    });

    test('the original is untouched', () async {
      final before = File(png).readAsBytesSync();
      await runAction('image-to-webp', [png]);
      expect(File(png).readAsBytesSync(), before);
    });

    test('never overwrites an earlier result', () async {
      final first = (await runAction('fit-web', [png])).single;
      final second = (await runAction('fit-web', [png])).single;
      expect(first, isNot(second));
      expect(p.basename(second), 'base (web 2).webp');
    });

    test('GPS is gone and the picture is upright', () async {
      expect(header(gpsJpg), contains('GPSLatitudeRef'));
      expect(imageSize(gpsJpg), '640x480');
      final out = (await runAction('image-to-png', [gpsJpg])).single;
      expect(header(out), isNot(contains('GPS')));
      expect(imageSize(out), '480x640');
    });

    test('GPS is gone after every kind of edit', () async {
      final results = [
        ...await runAction('fit-whatsapp-photo', [gpsJpg]),
        ...await runAction('image-compress', [gpsJpg]),
        ...await runAction('fit-image-100kb', [gpsJpg]),
        ...await runAction('image-rotate', [gpsJpg], options: const ActionOptions(degrees: 90)),
        ...await runAction('image-flip', [gpsJpg]),
        ...await runAction('image-crop', [
          gpsJpg,
        ], options: const ActionOptions(crop: (left: 0, top: 0, width: 10, height: 10))),
      ];
      for (final out in results) {
        expect(header(out), isNot(contains('GPS')), reason: out);
      }
    });

    test('rotate and flip work from the upright picture', () async {
      final rotated = (await runAction('image-rotate', [
        gpsJpg,
      ], options: const ActionOptions(degrees: 90))).single;
      expect(imageSize(rotated), '640x480');
    });

    test('crop is exact', () async {
      final out = (await runAction('image-crop', [
        png,
      ], options: const ActionOptions(crop: (left: 10, top: 20, width: 100, height: 50)))).single;
      expect(imageSize(out), '100x50');
    });

    test('a crop outside the picture is a plain error', () async {
      await expectLater(
        runAction('image-crop', [
          png,
        ], options: const ActionOptions(crop: (left: 600, top: 0, width: 100, height: 50))),
        throwsA(isA<EngineFailed>()),
      );
      expectClean(folder.path);
    });

    test('resize never enlarges', () async {
      final smaller = (await runAction('image-resize', [
        png,
      ], options: const ActionOptions(longSide: 320))).single;
      expect(imageSize(smaller), '320x240');
      final same = (await runAction('image-resize', [
        png,
      ], options: const ActionOptions(longSide: 5000))).single;
      expect(imageSize(same), '640x480');
    });

    test('resize without a size says so', () async {
      await expectLater(
        runAction('image-resize', [png]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('needs a size'))),
      );
    });

    test('Instagram is exactly 1080 x 1350', () async {
      final out = (await runAction('fit-instagram', [png])).single;
      expect(imageSize(out), '1080x1350');
      expect(await kindOf(out), FileKind.jpg);
    });

    test('transparent areas turn white in JPG, not black', () async {
      final out = (await runAction('image-to-jpg', [alphaPng])).single;
      final result = Process.runSync(tools.vips, ['getpoint', out, '5', '5']);
      final values = (result.stdout as String).trim().split(RegExp(r'\s+')).map(double.parse);
      expect(values, everyElement(greaterThan(250)));
    });

    test('under 100 KB really is', () async {
      final out = (await runAction('fit-image-100kb', [jpg])).single;
      expect(File(out).lengthSync(), lessThanOrEqualTo(100 * 1024));
      expect(await kindOf(out), FileKind.jpg);
    });

    test('a PNG stays a PNG under a size limit, by shrinking', () async {
      final out = (await runAction('fit-image-100kb', [png])).single;
      expect(File(out).lengthSync(), lessThanOrEqualTo(100 * 1024));
      expect(await kindOf(out), FileKind.png);
    });

    test('images-to-pdf keeps the order and passes a PDF check', () async {
      final out = (await runAction('images-to-pdf', [png, jpg, gpsJpg])).single;
      expect(pdfPages(out), 3);
      expect(Process.runSync(tools.qpdf, ['--check', out]).exitCode, 0);
    });

    test('awkward file names', () async {
      for (final name in [
        'तस्वीर 📷.png',
        'photo[1].png',
        'ends in bracket[Q=1]',
        '-dash.png',
        "quote's \"name\".png",
        r'dollar $HOME `id`.png',
      ]) {
        final input = p.join(folder.path, name);
        File(png).copySync(input);
        final out = (await runAction('image-to-jpg', [input])).single;
        expect(await kindOf(out), FileKind.jpg, reason: name);
        expect(File(out).existsSync(), isTrue, reason: name);
      }
    });

    test('a folder name with brackets', () async {
      final odd = Directory(p.join(folder.path, 'odd[x] %d'))..createSync();
      final input = p.join(odd.path, 'a.png');
      File(png).copySync(input);
      final out = (await runAction('image-to-jpg', [input])).single;
      expect(p.dirname(out), odd.path);
      expectClean(odd.path);
    });

    test('a result can go to another folder', () async {
      final elsewhere = Directory(p.join(folder.path, 'elsewhere'))..createSync();
      final out = (await runAction('image-to-jpg', [png], outputFolder: elsewhere.path)).single;
      expect(p.dirname(out), elsewhere.path);
    });

    test('a corrupt picture is a plain error and leaves nothing', () async {
      final bad = p.join(folder.path, 'bad.png');
      File(bad).writeAsBytesSync([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3]);
      await expectLater(runAction('image-to-jpg', [bad]), throwsA(isA<EngineFailed>()));
      expectClean(folder.path);
    });

    test('text named .png is refused by its bytes', () async {
      final fake = p.join(folder.path, 'fake.png');
      File(fake).writeAsStringSync('not a picture');
      await expectLater(runAction('image-to-jpg', [fake]), throwsA(isA<EngineFailed>()));
    });

    test('a missing file is a plain error', () async {
      await expectLater(
        runAction('image-to-jpg', [p.join(folder.path, 'nope.png')]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('found'))),
      );
    });
  });

  group('video', skip: skip, () {
    final conversions = {
      'video-to-mov': FileKind.mov,
      'video-to-webm': FileKind.webm,
      'video-to-gif': FileKind.gif,
      'video-to-mp3': FileKind.mp3,
      'video-to-m4a': FileKind.m4a,
      'video-extract-audio': FileKind.m4a,
    };
    conversions.forEach((id, kind) {
      test(id, () async {
        final out = (await runAction(id, [mp4])).single;
        expect(await kindOf(out), kind);
      }, timeout: const Timeout(Duration(minutes: 2)));
    });

    test('trim', () async {
      final out = (await runAction('video-trim', [
        mp4,
      ], options: const ActionOptions(startSeconds: 0.5, endSeconds: 1.5))).single;
      expect(seconds(out), closeTo(1, 0.3));
    });

    group('looking inside before trimming', () {
      test('how long it is', () async {
        final info = await runner.probe(mp4);
        expect(info.seconds, greaterThan(1));
        expect(info.hasVideo, isTrue);
      });

      test('a frame comes back as a picture, no wider than asked', () async {
        final frame = await runner.frameAt(mp4, 0.5, width: 64);
        expect(detectKind(frame), FileKind.png);
        final width = ByteData.sublistView(frame).getUint32(16);
        expect(width, 64);
      });

      test('different moments show different frames', () async {
        final first = await runner.frameAt(mp4, 0);
        final later = await runner.frameAt(mp4, 1);
        expect(first, isNot(later));
      });

      test('the very end still gives a frame', () async {
        final info = await runner.probe(mp4);
        final frame = await runner.frameAt(mp4, info.seconds);
        expect(detectKind(frame), FileKind.png);
      });

      test('past the end still gives a frame', () async {
        expect(detectKind(await runner.frameAt(mp4, 100000)), FileKind.png);
      });

      test('a file with no pictures is a plain error', () async {
        await expectLater(
          runner.frameAt(wav, 0),
          throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('picture'))),
        );
      });

      test('the original is only read', () async {
        final before = File(mp4).readAsBytesSync();
        final inFolder = folder.listSync().length;
        await runner.frameAt(mp4, 0.5);
        expect(File(mp4).readAsBytesSync(), before);
        expect(folder.listSync(), hasLength(inFolder));
      });
    });

    test('a trim that leaves nothing is refused', () async {
      await expectLater(
        runAction('video-trim', [
          mp4,
        ], options: const ActionOptions(startSeconds: 5, endSeconds: 1)),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('location does not survive any planned conversion', () async {
      final tagged = p.join(folder.path, 'tagged.mp4');
      sh(tools.ffmpeg, [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        mp4,
        '-c',
        'copy',
        '-metadata',
        'location=+12.97+77.59/',
        '-metadata',
        'title=secret',
        tagged,
      ]);
      expect(File(tagged).readAsBytesSync(), containsOnce('secret'));
      for (final id in ['video-to-mov', 'video-compress', 'fit-whatsapp-video', 'video-mute']) {
        final out = (await runAction(id, [tagged])).single;
        expect(File(out).readAsBytesSync(), isNot(containsOnce('secret')), reason: id);
      }
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('WhatsApp output plays: 720p H.264 under the limit', () async {
      final big = p.join(folder.path, 'hd.mp4');
      sh(tools.ffmpeg, [
        '-hide_banner',
        '-loglevel',
        'error',
        '-f',
        'lavfi',
        '-i',
        'testsrc2=duration=2:size=1920x1080:rate=15',
        '-f',
        'lavfi',
        '-i',
        'sine=duration=2',
        '-c:v',
        'h264_videotoolbox',
        '-b:v',
        '8000k',
        '-c:a',
        'aac',
        big,
      ]);
      final out = (await runAction('fit-whatsapp-video', [big])).single;
      expect(File(out).lengthSync(), lessThanOrEqualTo(16 * 1024 * 1024));
      final result = Process.runSync(tools.ffprobe, [
        '-v',
        'error',
        '-select_streams',
        'v',
        '-show_entries',
        'stream=codec_name,width,height',
        '-of',
        'csv=p=0',
        out,
      ]);
      expect((result.stdout as String).trim(), 'h264,1280,720');
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('MP4 to MOV copies the streams rather than re-encoding', () async {
      final out = (await runAction('video-to-mov', [mp4])).single;
      List<String> packets(String path) {
        final result = Process.runSync(tools.ffprobe, [
          '-v',
          'error',
          '-select_streams',
          'v',
          '-show_entries',
          'packet=size',
          '-of',
          'csv=p=0',
          path,
        ]);
        return (result.stdout as String).trim().split('\n');
      }

      expect(packets(out), packets(mp4));
    });

    test('mute removes the sound', () async {
      final out = (await runAction('video-mute', [mp4])).single;
      final result = Process.runSync(tools.ffprobe, [
        '-v',
        'error',
        '-show_entries',
        'stream=codec_type',
        '-of',
        'csv=p=0',
        out,
      ]);
      expect((result.stdout as String), isNot(contains('audio')));
    });

    test('extracting sound from a silent video says so', () async {
      final silent = (await runAction('video-mute', [mp4])).single;
      await expectLater(
        runAction('video-to-mp3', [silent]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('no sound'))),
      );
    });

    test('rotate swaps width and height', () async {
      final out = (await runAction('video-rotate', [
        mp4,
      ], options: const ActionOptions(degrees: 90))).single;
      final result = Process.runSync(tools.ffprobe, [
        '-v',
        'error',
        '-select_streams',
        'v',
        '-show_entries',
        'stream=width,height',
        '-of',
        'csv=p=0',
        out,
      ]);
      expect((result.stdout as String).trim(), '360,640');
    });

    test('a size target is met', () async {
      final out = (await runAction('fit-email-video', [
        mp4,
      ], options: const ActionOptions(targetMb: 0.25))).single;
      expect(File(out).lengthSync(), lessThanOrEqualTo(0.25 * 1024 * 1024));
    });

    test('a target too small for the audio is a plain error', () async {
      await expectLater(
        runAction('fit-email-video', [mp4], options: const ActionOptions(targetMb: 0.001)),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('too long'))),
      );
      expectClean(folder.path);
    });

    test('merge adds the lengths, and silent clips are allowed', () async {
      final silent = (await runAction('video-mute', [mp4])).single;
      final out = (await runAction('video-merge', [mp4, silent])).single;
      expect(seconds(out), closeTo(4, 0.5));
    }, timeout: const Timeout(Duration(minutes: 2)));

    test('progress is reported as the engine runs', () async {
      final clean = Directory(p.join(folder.path, 'progress'))..createSync();
      final queue = JobQueue(maxParallel: 1);
      final seen = <double>[];
      final subscription = queue.changes.listen((job) {
        if (job.state == JobState.running && job.progress > 0) seen.add(job.progress);
      });
      final job = queue.add(
        (context) =>
            runner.run(actionById('video-to-mov')!, [mp4], context, outputFolder: clean.path),
      );
      await job.result;
      await subscription.cancel();
      expect(seen, isNotEmpty);
      expect(seen, everyElement(inInclusiveRange(0, 1)));
    });

    test('cancel kills the engine, leaving nothing', () async {
      final clean = Directory(p.join(folder.path, 'cancel'))..createSync();
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add(
        (context) =>
            runner.run(actionById('video-to-webm')!, [mp4], context, outputFolder: clean.path),
      );
      await Future<void>.delayed(const Duration(milliseconds: 150));
      job.cancel();
      await expectLater(job.result, throwsA(isA<JobCancelled>()));
      expect(job.state, JobState.cancelled);
      expect(clean.listSync(), isEmpty);
    });
  });

  group('audio', skip: skip, () {
    final conversions = {
      'audio-to-mp3': FileKind.mp3,
      'audio-to-m4a': FileKind.m4a,
      'audio-to-flac': FileKind.flac,
      'audio-to-opus': FileKind.opus,
    };
    conversions.forEach((id, kind) {
      test(id, () async {
        expect(await kindOf((await runAction(id, [wav])).single), kind);
      });
    });

    test('an M4A from an MP3 really holds AAC', () async {
      final mp3 = (await runAction('audio-to-mp3', [wav])).single;
      final out = (await runAction('audio-to-m4a', [mp3])).single;
      final result = Process.runSync(tools.ffprobe, [
        '-v',
        'error',
        '-show_entries',
        'stream=codec_name',
        '-of',
        'csv=p=0',
        out,
      ]);
      expect((result.stdout as String).trim(), 'aac');
    });

    test('wav output', () async {
      final mp3 = (await runAction('audio-to-mp3', [wav])).single;
      expect(await kindOf((await runAction('audio-to-wav', [mp3])).single), FileKind.wav);
    });

    test('trim', () async {
      final out = (await runAction('audio-trim', [
        wav,
      ], options: const ActionOptions(endSeconds: 1))).single;
      expect(seconds(out), closeTo(1, 0.1));
    });

    test('merge', () async {
      final out = (await runAction('audio-merge', [wav, wav])).single;
      expect(seconds(out), closeTo(4, 0.1));
    });

    test('normalise', () async {
      expect(await kindOf((await runAction('audio-normalise', [wav])).single), FileKind.wav);
    });

    test('bitrate', () async {
      final mp3 = (await runAction('audio-to-mp3', [wav])).single;
      final out = (await runAction('audio-bitrate', [
        mp3,
      ], options: const ActionOptions(audioKbps: 64))).single;
      expect(await kindOf(out), FileKind.mp3);
    });

    test('WAV has no bitrate to change', () async {
      await expectLater(
        runAction('audio-bitrate', [wav], options: const ActionOptions(audioKbps: 64)),
        throwsA(isA<EngineFailed>()),
      );
    });
  });

  group('PDF', skip: skip, () {
    test('merge', () async {
      final out = (await runAction('pdf-merge', [pdf, pdf])).single;
      expect(pdfPages(out), 4);
    });

    test('merge needs two files', () async {
      await expectLater(runAction('pdf-merge', [pdf]), throwsA(isA<EngineFailed>()));
    });

    test('split makes a folder of pages', () async {
      final out = (await runAction('pdf-split', [pdf])).single;
      expect(p.basename(out), 'doc (split)');
      expect(Directory(out).listSync(), hasLength(2));
    });

    test('split in a folder with %d in its name', () async {
      final odd = Directory(p.join(folder.path, 'split %d'))..createSync();
      final input = p.join(odd.path, 'doc.pdf');
      File(pdf).copySync(input);
      final out = (await runAction('pdf-split', [input])).single;
      expect(Directory(out).listSync(), hasLength(2));
    });

    test('extract pages', () async {
      final out = (await runAction('pdf-extract-pages', [
        pdf,
      ], options: const ActionOptions(pages: '2'))).single;
      expect(pdfPages(out), 1);
    });

    test('page ranges are checked', () async {
      await expectLater(
        runAction('pdf-extract-pages', [pdf], options: const ActionOptions(pages: '--evil')),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('rotate', () async {
      final out = (await runAction('pdf-rotate', [
        pdf,
      ], options: const ActionOptions(degrees: 90))).single;
      expect(pdfPages(out), 2);
    });

    test('compress and strip metadata', () async {
      for (final id in ['pdf-compress', 'pdf-strip-metadata']) {
        expect(pdfPages((await runAction(id, [pdf])).single), 2, reason: id);
      }
    });

    test('password on and off, with awkward characters', () async {
      const secret = r'p@ss wörd"$\-- न';
      final locked = (await runAction('pdf-add-password', [
        pdf,
      ], options: const ActionOptions(password: secret))).single;
      expect(Process.runSync(tools.qpdf, ['--is-encrypted', locked]).exitCode, 0);

      await expectLater(
        runAction('pdf-remove-password', [locked], options: const ActionOptions(password: 'wrong')),
        throwsA(isA<EngineFailed>()),
      );

      final open = (await runAction('pdf-remove-password', [
        locked,
      ], options: const ActionOptions(password: secret))).single;
      expect(Process.runSync(tools.qpdf, ['--is-encrypted', open]).exitCode, 2);
      expect(pdfPages(open), 2);
    });

    test('a limit that cannot be met is a plain error, not a bad file', () async {
      final big = p.join(folder.path, 'big.pdf');
      final noise = Directory(p.join(folder.path, 'noise'))..createSync();
      final image = p.join(noise.path, 'noise.jpg');
      sh(tools.ffmpeg, [
        '-hide_banner',
        '-loglevel',
        'error',
        '-f',
        'lavfi',
        '-i',
        'nullsrc=s=1600x1600,geq=random(1)*255:128:128',
        '-frames:v',
        '1',
        '-q:v',
        '1',
        image,
      ]);
      File(big).writeAsBytesSync(buildImagePdf([File(image).readAsBytesSync()]));
      await expectLater(
        runAction('fit-pdf-100kb', [big]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('shrinks'))),
      );
    });
  });

  group('archives', skip: skip, () {
    test('extract', () async {
      final out = (await runAction('archive-extract', [zip])).single;
      expect(File(p.join(out, 'note.txt')).readAsStringSync(), 'hi');
    });

    test('convert between formats', () async {
      final tgz = (await runAction('archive-to-targz', [zip])).single;
      expect(p.basename(tgz), 'pack (converted).tar.gz');
      expect(await kindOf(tgz), FileKind.gz);
      final sevenZip = (await runAction('archive-to-7z', [tgz])).single;
      expect(await kindOf(sevenZip), FileKind.sevenZip);
      final back = (await runAction('archive-to-zip', [sevenZip])).single;
      final extracted = (await runAction('archive-extract', [back])).single;
      expect(File(p.join(extracted, 'note.txt')).readAsStringSync(), 'hi');
    });

    test('a gzip of one plain file', () async {
      final gz = p.join(folder.path, 'solo.txt.gz');
      File(gz).writeAsBytesSync(gzip.encode(utf8.encode('alone')));
      final out = (await runAction('archive-extract', [gz])).single;
      expect(File(p.join(out, 'solo.txt')).readAsStringSync(), 'alone');
    });

    test('compress a folder', () async {
      final source = Directory(p.join(folder.path, 'to pack'))..createSync();
      File(p.join(source.path, 'a.txt')).writeAsStringSync('a');
      final out = (await runAction('folder-compress', [source.path])).single;
      expect(p.basename(out), 'to pack (compressed).zip');
      expect(await kindOf(out), FileKind.zip);
    });

    test('an archive cannot write outside its folder', () async {
      final trap = Directory(p.join(folder.path, 'trap'))..createSync();
      final tar = p.join(trap.path, 'evil.tar');
      List<int> field(String text, int length) => [
        ...ascii.encode(text),
        ...List.filled(length - text.length, 0),
      ];
      final block = <int>[
        ...field('../escaped.txt', 100),
        ...field('0000644', 8),
        ...field('0000000', 8),
        ...field('0000000', 8),
        ...field('00000000004', 12),
        ...field('00000000000', 12),
        ...List.filled(8, 0x20),
        0x30,
        ...List.filled(100, 0),
        ...field('ustar', 6),
        0x30,
        0x30,
        ...List.filled(512 - 265, 0),
      ];
      final sum = block.fold<int>(0, (total, byte) => total + byte);
      block.setRange(148, 155, ascii.encode(sum.toRadixString(8).padLeft(6, '0')).followedBy([0]));
      File(tar).writeAsBytesSync([
        ...block,
        ...ascii.encode('evil'),
        ...List.filled(508, 0),
        ...List.filled(1024, 0),
      ]);
      expect(await kindOf(tar), FileKind.tar);
      try {
        await runAction('archive-extract', [tar]);
      } on EngineFailed {
        // Refusing the whole archive is fine too.
      }
      expect(File(p.join(folder.path, 'escaped.txt')).existsSync(), isFalse);
      expect(File(p.join(p.dirname(trap.path), 'escaped.txt')).existsSync(), isFalse);
      expectClean(trap.path);
    });

    test('a damaged archive is a plain error', () async {
      final bad = p.join(folder.path, 'bad.zip');
      File(bad).writeAsBytesSync([0x50, 0x4B, 0x03, 0x04, 1, 2, 3]);
      await expectLater(runAction('archive-extract', [bad]), throwsA(isA<EngineFailed>()));
      expectClean(folder.path);
    });
  });

  group('subtitles', skip: skip, () {
    test('SRT to VTT and text', () async {
      final vtt = (await runAction('subtitle-to-vtt', [srt])).single;
      expect(File(vtt).readAsStringSync(), startsWith('WEBVTT'));
      final text = (await runAction('subtitle-to-text', [srt])).single;
      expect(File(text).readAsStringSync(), 'Hello\n');
    });

    test('shift keeps the format', () async {
      final out = (await runAction('subtitle-shift', [
        srt,
      ], options: const ActionOptions(shift: Duration(seconds: 1)))).single;
      expect(p.extension(out), '.srt');
      expect(File(out).readAsStringSync(), contains('00:00:02,000'));
    });
  });

  group('not wired yet', skip: skip, () {
    test('says so plainly', () async {
      await expectLater(
        runAction('pdf-to-jpg', [pdf]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('not available'))),
      );
    });

    test('a "protected" archive is never made without a password', () async {
      await expectLater(
        runAction('archive-add-password', [zip]),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('not available'))),
      );
    });

    test('the list of what is waiting is short and known', () {
      final waiting = actionCatalogue.where((action) => !isActionWired(action)).map((a) => a.id);
      expect(waiting.toSet(), {
        'image-form',
        'archive-add-password',
        'pdf-to-jpg',
        'pdf-to-png',
        'document-to-pdf',
        'document-to-markdown',
        'document-to-html',
        'document-to-docx',
      });
    });

    test('every wired action has an engine that exists here', () {
      for (final action in actionCatalogue.where(isActionWired)) {
        expect(action.engine, isNot(Engine.pdfium), reason: action.id);
        expect(action.engine, isNot(Engine.document), reason: action.id);
      }
    });
  });
}
