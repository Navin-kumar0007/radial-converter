import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

const hd = MediaInfo(
  seconds: 60,
  hasVideo: true,
  hasAudio: true,
  width: 1920,
  height: 1080,
  videoCodec: 'avc',
  audioCodec: 'aac',
);

MediaPlan plan(String id, FileKind kind, MediaInfo info, [ActionOptions? options]) {
  return planMedia(actionById(id)!, kind, info, options: options ?? const ActionOptions()).first;
}

List<String> args(MediaPlan plan, MediaInfo info, {bool qualityMode = true}) {
  return ffmpegPlanArguments(plan, info, h264Encoder: 'h264_test', qualityMode: qualityMode);
}

void main() {
  group('never a GPL encoder', () {
    test('no plan asks for x264', () {
      for (final action in actionCatalogue) {
        for (final kind in action.accepts) {
          if (!canPlanMedia(action, kind)) continue;
          const options = ActionOptions(startSeconds: 1, endSeconds: 2);
          final info = kind.family == FileFamily.audio
              ? const MediaInfo(seconds: 200, hasAudio: true, audioCodec: 'mp3')
              : hd;
          for (final plan in planMedia(action, kind, info, options: options)) {
            expect(args(plan, info).join(' '), isNot(contains('x264')), reason: action.id);
          }
        }
      }
    });

    test('this computer gets a hardware encoder', () {
      expect(platformH264Encoder(), startsWith('h264_'));
      expect(platformH264Encoder(), isNot(contains('264_x')));
    });
  });

  group('metadata', () {
    test('always dropped, even when streams are copied', () {
      final out = args(plan('video-to-mov', FileKind.mp4, hd), hd);
      expect(out, containsAllInOrder(['-map_metadata', '-1']));
      expect(out, containsAllInOrder(['-c:v', 'copy']));
    });
  });

  group('copying', () {
    test('MP4 to MOV copies H.264 and AAC, which is much faster', () {
      final out = args(plan('video-to-mov', FileKind.mp4, hd), hd);
      expect(out, containsAllInOrder(['-c:v', 'copy']));
      expect(out, containsAllInOrder(['-c:a', 'copy']));
    });

    test('an iPhone HEVC video copies too', () {
      const hevc = MediaInfo(
        seconds: 60,
        hasVideo: true,
        hasAudio: true,
        videoCodec: 'hevc',
        audioCodec: 'aac',
      );
      expect(
        args(plan('video-to-mov', FileKind.mp4, hevc), hevc),
        containsAllInOrder(['-c:v', 'copy']),
      );
    });

    test('MP3 in an M4A would not open in many players, so it is re-encoded', () {
      const song = MediaInfo(seconds: 200, hasAudio: true, audioCodec: 'mp3');
      final out = args(plan('audio-to-m4a', FileKind.mp3, song), song);
      expect(out, containsAllInOrder(['-c:a', 'aac']));
      expect(out, isNot(containsAllInOrder(['-c:a', 'copy'])));
    });

    test('AAC to M4A copies', () {
      const song = MediaInfo(seconds: 200, hasAudio: true, audioCodec: 'aac');
      expect(
        args(plan('audio-to-m4a', FileKind.aac, song), song),
        containsAllInOrder(['-c:a', 'copy']),
      );
    });

    test('VP9 in an MP4 would not open in many players, so it is re-encoded', () {
      const vp9 = MediaInfo(
        seconds: 60,
        hasVideo: true,
        hasAudio: true,
        videoCodec: 'vp9',
        audioCodec: 'opus',
      );
      final out = args(plan('video-to-mp4', FileKind.webm, vp9), vp9);
      expect(out, containsAllInOrder(['-c:v', 'h264_test']));
      expect(out, containsAllInOrder(['-c:a', 'aac']));
    });

    test('H.264 to WebM is re-encoded', () {
      final out = args(plan('video-to-webm', FileKind.mp4, hd), hd);
      expect(out, containsAllInOrder(['-c:v', 'libvpx-vp9']));
      expect(out, containsAllInOrder(['-c:a', 'libopus']));
    });

    test('an unknown source codec is never copied into a format that expects one', () {
      const unknown = MediaInfo(seconds: 60, hasVideo: true, hasAudio: true);
      expect(
        args(plan('video-to-mp4', FileKind.mkv, unknown), unknown),
        containsAllInOrder(['-c:v', 'h264_test']),
      );
    });

    test('mute copies the picture and drops the sound', () {
      final out = args(plan('video-mute', FileKind.mp4, hd), hd);
      expect(out, containsAllInOrder(['-c:v', 'copy']));
      expect(out, contains('-an'));
    });
  });

  group('encoding', () {
    test('a size target uses a capped bitrate', () {
      final p = plan('fit-email-video', FileKind.mp4, hd);
      final out = args(p, hd);
      expect(out, containsAllInOrder(['-b:v', '${p.videoKbps}k']));
      expect(out, containsAllInOrder(['-maxrate', '${p.videoKbps}k']));
    });

    test('WhatsApp scales to 720p', () {
      expect(args(plan('fit-whatsapp-video', FileKind.mp4, hd), hd), contains('scale=1280:720'));
    });

    test('rotation', () {
      List<String> at(int degrees) {
        return args(plan('video-rotate', FileKind.mp4, hd, ActionOptions(degrees: degrees)), hd);
      }

      expect(at(90), contains('transpose=1'));
      expect(at(180), contains('transpose=1,transpose=1'));
      expect(at(270), contains('transpose=2'));
    });

    test('encoders without a quality mode get a bitrate', () {
      final p = planMedia(actionById('video-rotate')!, FileKind.mp4, hd).first;
      expect(args(p, hd), containsAllInOrder(['-q:v', '65']));
      expect(args(p, hd, qualityMode: false), containsAllInOrder(['-b:v', '4000k']));
    });

    test('H.264 uses a pixel format players can open', () {
      expect(
        args(plan('video-compress', FileKind.mp4, hd), hd),
        containsAllInOrder(['-pix_fmt', 'yuv420p']),
      );
    });

    test('MP4 and M4A start playing before the whole file arrives', () {
      expect(args(plan('video-compress', FileKind.mp4, hd), hd), contains('+faststart'));
      expect(args(plan('video-extract-audio', FileKind.mp4, hd), hd), contains('+faststart'));
      expect(args(plan('video-compress', FileKind.webm, hd), hd), isNot(contains('+faststart')));
    });

    test('a silent video asks for no audio', () {
      const silent = MediaInfo(seconds: 60, hasVideo: true, width: 1920, height: 1080);
      expect(args(plan('video-compress', FileKind.mp4, silent), silent), contains('-an'));
    });

    test('extract audio drops the picture', () {
      expect(args(plan('video-extract-audio', FileKind.mp4, hd), hd), contains('-vn'));
    });

    test('WAV is plain PCM', () {
      const song = MediaInfo(seconds: 200, hasAudio: true, audioCodec: 'mp3');
      expect(
        args(plan('audio-to-wav', FileKind.mp3, song), song),
        containsAllInOrder(['-c:a', 'pcm_s16le']),
      );
    });
  });

  group('trim', () {
    test('times go before the input', () {
      final p = plan(
        'video-trim',
        FileKind.mp4,
        hd,
        const ActionOptions(startSeconds: 5, endSeconds: 9),
      );
      expect(ffmpegInputFlags(p), ['-ss', '5.0', '-to', '9.0']);
    });

    test('no times, no flags', () {
      expect(ffmpegInputFlags(plan('video-compress', FileKind.mp4, hd)), isEmpty);
    });
  });

  test('codec names match the plan vocabulary', () {
    expect(planCodecName('h264'), 'avc');
    expect(planCodecName('hevc'), 'hevc');
    expect(planCodecName(null), isNull);
  });

  group('mediaSizeLimit', () {
    test('WhatsApp and email have limits, others do not', () {
      const none = ActionOptions();
      expect(mediaSizeLimit(actionById('fit-whatsapp-video')!, none), 16 * 1024 * 1024);
      expect(mediaSizeLimit(actionById('fit-email-video')!, none), 20 * 1024 * 1024);
      expect(mediaSizeLimit(actionById('video-compress')!, none), isNull);
    });

    test('a chosen target wins', () {
      expect(
        mediaSizeLimit(actionById('fit-email-video')!, const ActionOptions(targetMb: 2)),
        2 * 1024 * 1024,
      );
    });
  });
}
