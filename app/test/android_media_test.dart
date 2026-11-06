// The Dart half of Android video, against a stand-in for MediaEngine.kt. The real thing is tested
// by integration_test/android_media_test.dart on an emulator.

import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/android_media.dart';
import 'package:radialconverter/conversion.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger = TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  late Directory folder;
  late List<MethodCall> calls;
  late Map<String, Object?> probeReply;
  late Future<Object?> Function(MethodCall call) onConvert;

  const clip = {
    'seconds': 60.0,
    'width': 1280,
    'height': 720,
    'videoCodec': 'avc',
    'audioCodec': 'aac',
  };

  /// A finished result of [size] bytes in its own folder, as the engine makes them.
  Map<String, Object?> made(MethodCall call, int size) {
    final arguments = call.arguments as Map;
    final path = p.join(folder.path, '${arguments['id']}', arguments['name'] as String);
    File(path).createSync(recursive: true);
    return {'path': path, 'size': size};
  }

  setUp(() {
    folder = Directory.systemTemp.createTempSync('radial_phone_');
    calls = [];
    probeReply = clip;
    onConvert = (call) async => made(call, 1000);
    messenger.setMockMethodCallHandler(mediaChannel, (call) async {
      calls.add(call);
      return switch (call.method) {
        'probe' => probeReply,
        'convert' => onConvert(call),
        'save' => true,
        _ => null,
      };
    });
  });

  tearDown(() {
    messenger.setMockMethodCallHandler(mediaChannel, null);
    folder.deleteSync(recursive: true);
  });

  PickedFile video([String? path]) {
    return PickedFile(
      name: 'clip.mp4',
      size: 5000,
      head: const [],
      read: () async => Uint8List(0),
      path: path ?? '/picked/clip.mp4',
    );
  }

  Future<List<ConvertedFile>> run(
    String id, {
    List<PickedFile>? files,
    void Function(double)? onProgress,
    ConvertControl? control,
  }) {
    final chosen = files ?? [video()];
    return convertMediaOnPhone(
      actionById(id)!,
      chosen,
      [for (final _ in chosen) FileKind.mp4],
      onProgress ?? (_) {},
      control ?? ConvertControl(),
    );
  }

  Map converts(int index) => calls.where((c) => c.method == 'convert').elementAt(index).arguments;

  group('what it asks the phone for', () {
    test('compress sends the plan, for the chosen file', () async {
      final result = (await run('video-compress')).single;
      expect(result.name, 'clip (compressed).mp4');
      expect(result.size, 1000);
      final sent = converts(0);
      expect(sent['input'], '/picked/clip.mp4');
      expect(sent['name'], 'clip (compressed).mp4');
      expect(sent['videoCodec'], 'avc');
      expect(sent['videoKbps'], isPositive);
      expect(sent['copyVideo'], isFalse);
    });

    test('mute keeps the picture as it is', () async {
      await run('video-mute');
      expect(converts(0)['dropAudio'], isTrue);
      expect(converts(0)['copyVideo'], isTrue);
    });

    test('sound in AAC is copied into an M4A, and other sound is converted', () async {
      await run('video-extract-audio');
      expect(converts(0)['dropVideo'], isTrue);
      expect(converts(0)['copyAudio'], isTrue);

      calls.clear();
      probeReply = {...clip, 'audioCodec': 'opus'};
      await run('video-extract-audio');
      expect(converts(0)['copyAudio'], isFalse);
      expect(converts(0)['audioCodec'], 'aac');
    });

    test('H.265 stays as it is when only the format changes, and VP9 does not', () async {
      Future<bool> copies(String codec) async {
        calls.clear();
        probeReply = {...clip, 'videoCodec': codec};
        await convertMediaOnPhone(
          actionById('video-to-mp4')!,
          [video()],
          const [FileKind.mov],
          (_) {},
          ConvertControl(),
        );
        return converts(0)['copyVideo'] as bool;
      }

      expect(await copies('hevc'), isTrue);
      expect(await copies('vp9'), isFalse);
    });

    test('a video with no sound asks for none', () async {
      probeReply = {...clip, 'audioCodec': null};
      await run('video-compress');
      expect(converts(0)['audioCodec'], isNull);
      expect(converts(0)['audioKbps'], isNull);
    });
  });

  group('size limits', () {
    test('aims lower until it fits, removing what was too big', () async {
      final limit = mediaSizeLimit(actionById('fit-whatsapp-video')!, const ActionOptions())!;
      final tooBig = <String>[];
      var attempt = 0;
      onConvert = (call) async {
        final reply = made(call, attempt++ == 0 ? limit + 1 : limit);
        if (attempt == 1) tooBig.add(reply['path'] as String);
        return reply;
      };
      final result = (await run('fit-whatsapp-video')).single;
      expect(result.size, limit);
      expect(attempt, 2);
      expect(converts(1)['videoKbps'], lessThan(converts(0)['videoKbps'] as int));
      expect(File(tooBig.single).existsSync(), isFalse);
    });

    test('says so when nothing fits', () async {
      final limit = mediaSizeLimit(actionById('fit-whatsapp-video')!, const ActionOptions())!;
      onConvert = (call) async => made(call, limit + 1);
      await expectLater(
        run('fit-whatsapp-video'),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('small enough'))),
      );
    });
  });

  group('while running', () {
    test('progress is shared across a batch', () async {
      final seen = <double>[];
      onConvert = (call) async {
        final id = (call.arguments as Map)['id'];
        await messenger.handlePlatformMessage(
          mediaChannel.name,
          mediaChannel.codec.encodeMethodCall(MethodCall('progress', {'id': id, 'value': 0.5})),
          (_) {},
        );
        return made(call, 1000);
      };
      final results = await run('video-compress', files: [video(), video()], onProgress: seen.add);
      expect(results, hasLength(2));
      expect(seen, [0.25, 0.75]);
    });

    test('cancel reaches the engine, and ends as cancelled', () async {
      final control = ConvertControl();
      onConvert = (call) async {
        control.cancel!();
        await pumpEventQueue();
        throw PlatformException(code: 'cancelled');
      };
      await expectLater(run('video-compress', control: control), throwsA(isA<JobCancelled>()));
      expect(calls.map((c) => c.method), contains('cancel'));
      expect(control.cancel, isNull);
    });

    test('cancelling while reading the file stops before converting', () async {
      final control = ConvertControl();
      final running = run('video-compress', control: control);
      control.cancel!();
      await expectLater(running, throwsA(isA<JobCancelled>()));
      expect(calls.map((c) => c.method), isNot(contains('convert')));
    });

    test('a failure arrives in the words the engine chose', () async {
      onConvert = (call) async {
        throw PlatformException(code: 'failed', message: 'This phone can\'t read this.');
      };
      await expectLater(
        run('video-compress'),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('phone'))),
      );
    });

    test('a file with no path says so', () async {
      final file = PickedFile(
        name: 'x.mp4',
        size: 1,
        head: const [],
        read: () async => Uint8List(0),
      );
      await expectLater(run('video-compress', files: [file]), throwsA(isA<EngineFailed>()));
    });
  });

  test('saving goes through the phone, and can be changed by the user', () async {
    final result = (await run('video-compress')).single;
    expect(await result.download!(), isTrue);
    final sent = calls.last.arguments as Map;
    expect(calls.last.method, 'save');
    expect(sent['name'], 'clip (compressed).mp4');
    expect(sent['mime'], 'video/mp4');

    messenger.setMockMethodCallHandler(mediaChannel, (call) async => false);
    expect(await result.download!(), isFalse);
  });

  group('the menu on a phone', () {
    List<String> ids(FileKind kind) {
      return [
        for (final mode in ActionMode.values)
          for (final action in availableActions(
            [kind],
            mode,
            mediaAvailable: true,
            mediaOutputs: phoneMediaOutputs,
          ))
            action.id,
      ];
    }

    test('offers what it can make', () {
      final video = ids(FileKind.mp4);
      expect(video, containsAll(['video-compress', 'video-mute', 'video-extract-audio']));
      expect(ids(FileKind.mov), contains('video-to-mp4'));
      expect(ids(FileKind.mp3), contains('audio-to-m4a'));
    });

    test('leaves out formats Android can\'t write', () {
      expect(ids(FileKind.mp4), isNot(contains('video-to-webm')));
      expect(ids(FileKind.mp4), isNot(contains('video-to-mov')));
      expect(ids(FileKind.mp3), isNot(contains('audio-to-opus')));
      expect(ids(FileKind.mp3), isNot(contains('audio-to-wav')));
    });
  });
}
