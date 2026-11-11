import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

const hd = MediaInfo(seconds: 60, hasVideo: true, hasAudio: true, width: 1920, height: 1080);
const portrait = MediaInfo(seconds: 60, hasVideo: true, hasAudio: true, width: 1080, height: 1920);
const silent = MediaInfo(seconds: 60, hasVideo: true, width: 1920, height: 1080);
const song = MediaInfo(seconds: 200, hasAudio: true);

MediaPlan one(String id, FileKind kind, MediaInfo info, [ActionOptions? options]) {
  final plans = planMedia(actionById(id)!, kind, info, options: options ?? const ActionOptions());
  expect(plans, hasLength(1));
  return plans.single;
}

void main() {
  group('canPlanMedia', () {
    test('common video actions on common containers', () {
      for (final kind in [FileKind.mp4, FileKind.mov, FileKind.mkv, FileKind.webm]) {
        expect(canPlanMedia(actionById('video-compress')!, kind), isTrue, reason: kind.name);
        expect(canPlanMedia(actionById('fit-whatsapp-video')!, kind), isTrue, reason: kind.name);
      }
    });

    test('containers the engines cannot all read are left out', () {
      expect(canPlanMedia(actionById('video-compress')!, FileKind.avi), isFalse);
      expect(canPlanMedia(actionById('video-compress')!, FileKind.threeGp), isFalse);
    });

    test('audio it can write', () {
      expect(canPlanMedia(actionById('audio-to-m4a')!, FileKind.mp3), isTrue);
      expect(canPlanMedia(actionById('audio-to-wav')!, FileKind.flac), isTrue);
      expect(canPlanMedia(actionById('audio-to-opus')!, FileKind.m4a), isTrue);
    });

    test('formats needing an extra encoder wait', () {
      expect(canPlanMedia(actionById('audio-to-mp3')!, FileKind.wav), isFalse);
      expect(canPlanMedia(actionById('audio-to-flac')!, FileKind.wav), isFalse);
      expect(canPlanMedia(actionById('video-to-mp3')!, FileKind.mp4), isFalse);
      expect(canPlanMedia(actionById('video-to-gif')!, FileKind.mp4), isFalse);
      expect(canPlanMedia(actionById('video-merge')!, FileKind.mp4), isFalse);
    });

    test('a trim that keeps a format we cannot write waits', () {
      expect(canPlanMedia(actionById('audio-trim')!, FileKind.mp3), isFalse);
      expect(canPlanMedia(actionById('audio-trim')!, FileKind.wav), isTrue);
    });

    test('never pictures', () {
      expect(canPlanMedia(actionById('image-to-png')!, FileKind.jpg), isFalse);
    });

    test('every planned pairing really plans', () {
      const options = ActionOptions(startSeconds: 1, endSeconds: 2);
      for (final action in actionCatalogue) {
        for (final kind in action.accepts) {
          if (!canPlanMedia(action, kind)) continue;
          final info = kind.family == FileFamily.audio ? song : hd;
          expect(planMedia(action, kind, info, options: options), isNotEmpty, reason: action.id);
        }
      }
    });
  });

  group('format changes', () {
    test('copy streams when possible, because it is far faster', () {
      final plan = one('video-to-mov', FileKind.mp4, hd);
      expect(plan.output, FileKind.mov);
      expect(plan.copyIfPossible, isTrue);
      expect(plan.videoKbps, isNull);
    });

    test('WebM uses open codecs', () {
      final plan = one('video-to-webm', FileKind.mp4, hd);
      expect(plan.output, FileKind.webm);
      expect(plan.videoCodec, 'vp9');
      expect(plan.audioCodec, 'opus');
    });

    test('MP4 uses H.264 and AAC', () {
      final plan = one('video-to-mp4', FileKind.mkv, hd);
      expect(plan.videoCodec, 'avc');
      expect(plan.audioCodec, 'aac');
    });

    test('a silent video gets no audio codec', () {
      expect(one('video-to-mp4', FileKind.mkv, silent).audioCodec, isNull);
    });
  });

  group('sound', () {
    test('extract audio drops the picture', () {
      final plan = one('video-extract-audio', FileKind.mp4, hd);
      expect(plan.output, FileKind.m4a);
      expect(plan.dropVideo, isTrue);
      expect(plan.audioCodec, 'aac');
    });

    test('a silent video has none to extract', () {
      expect(
        () => planMedia(actionById('video-extract-audio')!, FileKind.mp4, silent),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('no sound'))),
      );
    });

    test('mute keeps the picture untouched', () {
      final plan = one('video-mute', FileKind.mp4, hd);
      expect(plan.dropAudio, isTrue);
      expect(plan.copyIfPossible, isTrue);
      expect(plan.output, FileKind.mp4);
    });

    test('audio conversions', () {
      expect(one('audio-to-wav', FileKind.mp3, song).audioCodec, 'pcm-s16');
      expect(one('audio-to-wav', FileKind.mp3, song).audioKbps, isNull);
      expect(one('audio-to-opus', FileKind.mp3, song).audioCodec, 'opus');
      expect(one('audio-to-m4a', FileKind.wav, song).output, FileKind.m4a);
    });
  });

  group('size targets', () {
    test('WhatsApp is 720p, with attempts aiming lower each time', () {
      final plans = planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, hd);
      expect(plans.length, greaterThan(1));
      expect(plans.first.height, 720);
      expect(plans.first.width, 1280);
      expect(plans.first.output, FileKind.mp4);
      for (var i = 1; i < plans.length; i++) {
        expect(plans[i].videoKbps!, lessThan(plans[i - 1].videoKbps!));
      }
    });

    test('a portrait video keeps its shape: the short side is 720', () {
      final plan = planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, portrait).first;
      expect(plan.width, 720);
      expect(plan.height, 1280);
    });

    test('a small video is not enlarged', () {
      const small = MediaInfo(seconds: 60, hasVideo: true, hasAudio: true, width: 640, height: 360);
      final plan = planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, small).first;
      expect(plan.width, isNull);
      expect(plan.height, isNull);
    });

    test('the bitrate follows the plan formula', () {
      final plan = planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, hd).first;
      expect(
        plan.videoKbps,
        videoKbpsForTarget(targetMb: 16 * 0.95, durationSeconds: 60, audioKbps: 128),
      );
    });

    test('silence leaves more room for the picture', () {
      final loud = planMedia(actionById('fit-email-video')!, FileKind.mp4, hd).first;
      final quiet = planMedia(actionById('fit-email-video')!, FileKind.mp4, silent).first;
      expect(quiet.videoKbps!, greaterThan(loud.videoKbps!));
    });

    test('a chosen target wins', () {
      final plan = planMedia(
        actionById('fit-email-video')!,
        FileKind.mp4,
        hd,
        options: const ActionOptions(targetMb: 5),
      ).first;
      expect(
        plan.videoKbps,
        videoKbpsForTarget(targetMb: 5 * 0.95, durationSeconds: 60, audioKbps: 128),
      );
    });

    test('a video too long for the target says so', () {
      const long = MediaInfo(
        seconds: 7200,
        hasVideo: true,
        hasAudio: true,
        width: 1920,
        height: 1080,
      );
      expect(
        () => planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, long),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('too long'))),
      );
    });

    test('attempts too low to watch are dropped', () {
      const long = MediaInfo(
        seconds: 400,
        hasVideo: true,
        hasAudio: true,
        width: 1920,
        height: 1080,
      );
      final plans = planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, long);
      expect(plans, hasLength(3));
      expect(plans.every((plan) => plan.videoKbps! >= 100), isTrue);
    });

    test('a video that would be unwatchable at the target says it is too long', () {
      const long = MediaInfo(
        seconds: 800,
        hasVideo: true,
        hasAudio: true,
        width: 1920,
        height: 1080,
      );
      expect(
        () => planMedia(actionById('fit-whatsapp-video')!, FileKind.mp4, long),
        throwsA(isA<EngineFailed>()),
      );
    });
  });

  group('tools', () {
    test('compress sets a bitrate that suits the size', () {
      final plan = one('video-compress', FileKind.mp4, hd);
      expect(plan.videoKbps, inInclusiveRange(300, 8000));
      expect(plan.copyIfPossible, isFalse);
    });

    test('compress stays in the same format', () {
      expect(one('video-compress', FileKind.webm, hd).output, FileKind.webm);
      expect(one('video-compress', FileKind.webm, hd).videoCodec, 'vp9');
      expect(one('video-compress', FileKind.mov, hd).output, FileKind.mov);
    });

    test('resize defaults to half', () {
      final plan = one('video-resize', FileKind.mp4, hd);
      expect('${plan.width}x${plan.height}', '960x540');
    });

    test('resize to a size, never enlarging', () {
      final smaller = one('video-resize', FileKind.mp4, hd, const ActionOptions(longSide: 640));
      expect('${smaller.width}x${smaller.height}', '640x360');
      final same = one('video-resize', FileKind.mp4, hd, const ActionOptions(longSide: 5000));
      expect(same.width, isNull);
    });

    test('rotate defaults to 90 and refuses other angles', () {
      expect(one('video-rotate', FileKind.mp4, hd).degrees, 90);
      expect(
        () => planMedia(
          actionById('video-rotate')!,
          FileKind.mp4,
          hd,
          options: const ActionOptions(degrees: 45),
        ),
        throwsA(isA<EngineFailed>()),
      );
    });

    test('trim keeps its times', () {
      final plan = one(
        'video-trim',
        FileKind.mp4,
        hd,
        const ActionOptions(startSeconds: 5, endSeconds: 10),
      );
      expect(plan.startSeconds, 5);
      expect(plan.endSeconds, 10);
    });

    test('trim needs times, and something left', () {
      expect(
        () => planMedia(actionById('video-trim')!, FileKind.mp4, hd),
        throwsA(isA<EngineFailed>()),
      );
      expect(
        () => planMedia(
          actionById('video-trim')!,
          FileKind.mp4,
          hd,
          options: const ActionOptions(startSeconds: 10, endSeconds: 5),
        ),
        throwsA(isA<EngineFailed>()),
      );
    });
  });

  group('fitVideoSize', () {
    test('always even', () {
      const odd = MediaInfo(seconds: 1, hasVideo: true, width: 1001, height: 701);
      final size = fitVideoSize(odd, maxLongSide: 501)!;
      expect(size.width.isEven, isTrue);
      expect(size.height.isEven, isTrue);
    });

    test('unknown sizes change nothing', () {
      expect(fitVideoSize(const MediaInfo(seconds: 1), maxLongSide: 100), isNull);
    });

    test('never below 2 pixels', () {
      const thin = MediaInfo(seconds: 1, hasVideo: true, width: 4000, height: 2);
      expect(fitVideoSize(thin, maxLongSide: 100)!.height, 2);
    });
  });

  test('the plan crosses to JavaScript as plain data', () {
    final map = one('video-compress', FileKind.webm, hd).toMap();
    expect(map['output'], 'webm');
    expect(map['videoCodec'], 'vp9');
    expect(map['dropAudio'], false);
  });

  test('everything a phone can make can be planned', () {
    for (final kind in phoneMediaOutputs) {
      final makes = actionCatalogue.where((a) => a.accepts.contains(FileKind.mp4)).where((a) {
        return canPlanMedia(a, FileKind.mp4) && a.outputFor(FileKind.mp4) == kind;
      });
      expect(makes, isNotEmpty, reason: kind.extension);
    }
  });

  group('estimateMediaBytes', () {
    const phoneClip = MediaInfo(
      seconds: 60,
      hasVideo: true,
      hasAudio: true,
      width: 1920,
      height: 1080,
      videoCodec: 'avc',
      audioCodec: 'aac',
    );
    const mb = 1024 * 1024;

    ({int bytes, bool atMost})? estimate(String id, FileKind kind, MediaInfo info) {
      return estimateMediaBytes(one(id, kind, info), info, inputBytes: 90 * mb);
    }

    test('streams kept as they are weigh what the file did', () {
      expect(estimate('video-to-mp4', FileKind.mov, phoneClip), (bytes: 90 * mb, atMost: false));
    });

    test('a copy that drops the sound is at most the file', () {
      expect(estimate('video-mute', FileKind.mp4, phoneClip), (bytes: 90 * mb, atMost: true));
    });

    test('sound copied out of a video tells nothing, as its share is unknown', () {
      // A real 15 MB clip gave 0.4 MB of sound: "up to 15 MB" would mislead.
      expect(estimate('video-to-m4a', FileKind.mp4, phoneClip), isNull);
    });

    test('sound encoded out of a video is its bitrate over the length', () {
      const mp3 = MediaInfo(
        seconds: 60,
        hasVideo: true,
        hasAudio: true,
        videoCodec: 'avc',
        audioCodec: 'mp3',
      );
      final plan = one('video-to-m4a', FileKind.mp4, mp3);
      expect(estimateMediaBytes(plan, mp3, inputBytes: 90 * mb), (
        bytes: (plan.audioKbps! * 1000 / 8 * 60).round(),
        atMost: false,
      ));
    });

    test('a set bitrate gives the size over the length', () {
      final plan = one('video-compress', FileKind.mp4, phoneClip);
      final kbps = plan.videoKbps! + plan.audioKbps!;
      expect(estimateMediaBytes(plan, phoneClip, inputBytes: 90 * mb), (
        bytes: (kbps * 1000 / 8 * 60).round(),
        atMost: false,
      ));
    });

    test('sound encoded from another codec is its bitrate over the length', () {
      const opus = MediaInfo(seconds: 200, hasAudio: true, audioCodec: 'opus');
      final plan = one('audio-to-m4a', FileKind.opus, opus);
      expect(plan.copiesAudio(opus), isFalse);
      expect(estimateMediaBytes(plan, opus, inputBytes: mb), (
        bytes: (plan.audioKbps! * 1000 / 8 * 200).round(),
        atMost: false,
      ));
    });

    test('an encoder left to its own bitrate, or an unknown codec, tells nothing', () {
      const vp9 = MediaInfo(
        seconds: 60,
        hasVideo: true,
        hasAudio: true,
        videoCodec: 'vp9',
        audioCodec: 'opus',
      );
      expect(estimate('video-to-mp4', FileKind.webm, vp9), isNull);
      // A browser or a probe that didn't say which codec: copying can't be counted on.
      expect(estimate('video-to-mp4', FileKind.mov, hd), isNull);
      expect(estimate('audio-to-wav', FileKind.mp3, song), isNull);
    });

    test('a trim or an unknown length tells nothing', () {
      final trim = one(
        'video-trim',
        FileKind.mp4,
        phoneClip,
        const ActionOptions(startSeconds: 1, endSeconds: 5),
      );
      expect(estimateMediaBytes(trim, phoneClip, inputBytes: mb), isNull);
      const noLength = MediaInfo(seconds: 0, hasVideo: true, videoCodec: 'avc');
      expect(
        estimateMediaBytes(one('video-mute', FileKind.mp4, noLength), noLength, inputBytes: mb),
        isNull,
      );
    });
  });
}
