import 'dart:math' as math;

import 'action_options.dart';
import 'actions.dart';
import 'file_kind.dart';
import 'size_target.dart';

/// What an engine found out about a video or audio file.
class MediaInfo {
  const MediaInfo({
    required this.seconds,
    this.hasVideo = false,
    this.hasAudio = false,
    this.width,
    this.height,
    this.videoCodec,
    this.audioCodec,
  });

  final double seconds;
  final bool hasVideo;
  final bool hasAudio;

  /// As displayed, after any rotation in the file.
  final int? width;
  final int? height;

  /// In the names plans use: `avc`, `hevc`, `vp9`, `aac`, `mp3`. Null if unknown.
  final String? videoCodec;
  final String? audioCodec;
}

/// One way to run a video or audio action. Each platform's engine carries this out, so all
/// of them make the same decisions.
class MediaPlan {
  const MediaPlan({
    required this.output,
    this.dropVideo = false,
    this.dropAudio = false,
    this.copyIfPossible = false,
    this.videoCodec,
    this.audioCodec,
    this.videoKbps,
    this.audioKbps,
    this.width,
    this.height,
    this.degrees,
    this.startSeconds,
    this.endSeconds,
  });

  final FileKind output;
  final bool dropVideo;
  final bool dropAudio;

  /// Keep the streams as they are when the output format allows it, which is much faster.
  final bool copyIfPossible;
  final String? videoCodec;
  final String? audioCodec;
  final int? videoKbps;
  final int? audioKbps;
  final int? width;
  final int? height;

  /// Clockwise: 90, 180 or 270.
  final int? degrees;
  final double? startSeconds;
  final double? endSeconds;

  /// True if the picture can be kept as it is. A container may technically allow a codec that
  /// players won't open, so streams are copied only when they are what people expect here.
  bool copiesVideo(MediaInfo info) {
    if (!copyIfPossible) return false;
    final wanted = videoCodec;
    if (wanted == null) return true;
    return (_copyableVideo[wanted] ?? {wanted}).contains(info.videoCodec);
  }

  /// True if the sound can be kept as it is. See [copiesVideo].
  bool copiesAudio(MediaInfo info) {
    if (!copyIfPossible) return false;
    return audioCodec == null || audioCodec == info.audioCodec;
  }

  Map<String, Object?> toMap() => {
    'output': output.extension,
    'dropVideo': dropVideo,
    'dropAudio': dropAudio,
    'copyIfPossible': copyIfPossible,
    'videoCodec': videoCodec,
    'audioCodec': audioCodec,
    'videoKbps': videoKbps,
    'audioKbps': audioKbps,
    'width': width,
    'height': height,
    'degrees': degrees,
    'startSeconds': startSeconds,
    'endSeconds': endSeconds,
  };
}

const _copyableVideo = {
  'avc': {'avc', 'hevc'},
  'vp9': {'vp9', 'vp8', 'av1'},
};

const _videoInputs = {FileKind.mp4, FileKind.mov, FileKind.mkv, FileKind.webm};
const _audioInputs = {
  FileKind.mp3,
  FileKind.m4a,
  FileKind.aac,
  FileKind.wav,
  FileKind.flac,
  FileKind.ogg,
  FileKind.opus,
};

const _videoOutputs = {FileKind.mp4, FileKind.mov, FileKind.mkv, FileKind.webm};
const _audioOutputs = {FileKind.m4a, FileKind.wav, FileKind.opus};

const _plannedActions = {
  'video-to-mp4',
  'video-to-mov',
  'video-to-webm',
  'video-to-m4a',
  'video-extract-audio',
  'video-compress',
  'video-resize',
  'video-rotate',
  'video-mute',
  'video-trim',
  'fit-whatsapp-video',
  'fit-email-video',
  'audio-to-m4a',
  'audio-to-wav',
  'audio-to-opus',
  'audio-trim',
};

/// WhatsApp's default limit in the plan's Settings; the app will pass its own.
const whatsappVideoMb = 16.0;

/// Encoders overshoot, so a size target aims under it and retries lower until the file fits.
const _sizeMargins = [0.95, 0.85, 0.7, 0.5];

/// Below this a video is unwatchable, so saying it won't fit is more honest.
const _minUsefulKbps = 100;

/// The size a result must stay under, in bytes, or null if it has no limit.
int? mediaSizeLimit(RadialAction action, ActionOptions options) {
  final target = options.targetMb;
  if (target != null) return (target * 1024 * 1024).floor();
  if (action.id == 'fit-whatsapp-video') return (whatsappVideoMb * 1024 * 1024).floor();
  return action.maxBytes;
}

/// True if [action] can be planned for [kind].
bool canPlanMedia(RadialAction action, FileKind kind) {
  if (!_plannedActions.contains(action.id) || !action.accepts.contains(kind)) return false;
  final output = action.outputFor(kind);
  if (_videoInputs.contains(kind)) {
    return _videoOutputs.contains(output) || _audioOutputs.contains(output);
  }
  return _audioInputs.contains(kind) && _audioOutputs.contains(output);
}

/// The ways to try [action], best first. Most actions have one; a size target has several, to
/// use in turn until the result fits. Throws [EngineFailed] if it cannot be done.
List<MediaPlan> planMedia(
  RadialAction action,
  FileKind kind,
  MediaInfo info, {
  ActionOptions options = const ActionOptions(),
}) {
  if (!canPlanMedia(action, kind)) {
    throw EngineFailed('"${action.label}" can\'t use this file.');
  }
  final output = action.outputFor(kind);
  final audioOnly = _audioOutputs.contains(output);
  if (audioOnly && !info.hasAudio) throw const EngineFailed('This video has no sound.');

  final videoCodec = output == FileKind.webm ? 'vp9' : 'avc';
  final audioCodec = switch (output) {
    FileKind.webm || FileKind.opus => 'opus',
    FileKind.wav => 'pcm-s16',
    _ => 'aac',
  };
  final audioKbps = audioCodec == 'pcm-s16' ? null : 128;

  MediaPlan encode({int? kbps, int? width, int? height, int? degrees}) {
    return MediaPlan(
      output: output,
      videoCodec: videoCodec,
      audioCodec: info.hasAudio ? audioCodec : null,
      videoKbps: kbps,
      audioKbps: info.hasAudio ? audioKbps : null,
      width: width,
      height: height,
      degrees: degrees,
    );
  }

  if (audioOnly && action.id != 'audio-trim') {
    return [
      MediaPlan(
        output: output,
        dropVideo: true,
        copyIfPossible: true,
        audioCodec: audioCodec,
        audioKbps: audioCodec == 'aac' ? 192 : audioKbps,
      ),
    ];
  }

  switch (action.id) {
    case 'video-to-mp4':
    case 'video-to-mov':
    case 'video-to-webm':
      return [
        MediaPlan(
          output: output,
          copyIfPossible: true,
          videoCodec: videoCodec,
          audioCodec: info.hasAudio ? audioCodec : null,
        ),
      ];
    case 'video-mute':
      return [MediaPlan(output: output, dropAudio: true, copyIfPossible: true)];
    case 'video-compress':
      return [encode(kbps: _compressedKbps(info))];
    case 'video-resize':
      final side = options.longSide ?? ((_longest(info) ?? 2) / 2).ceil();
      final size = fitVideoSize(info, maxLongSide: side);
      return [encode(width: size?.width, height: size?.height)];
    case 'video-rotate':
      final degrees = options.degrees ?? 90;
      if (degrees != 90 && degrees != 180 && degrees != 270) {
        throw EngineFailed('Videos rotate by 90, 180 or 270, not $degrees.');
      }
      return [encode(degrees: degrees)];
    case 'video-trim':
    case 'audio-trim':
      final start = options.startSeconds;
      final end = options.endSeconds;
      if (start == null && end == null) throw const EngineFailed('Choose where to trim.');
      if ((end ?? info.seconds) <= (start ?? 0)) {
        throw const EngineFailed('The trim leaves nothing.');
      }
      return [
        MediaPlan(
          output: output,
          dropVideo: audioOnly,
          videoCodec: audioOnly ? null : videoCodec,
          audioCodec: info.hasAudio ? audioCodec : null,
          audioKbps: info.hasAudio ? audioKbps : null,
          startSeconds: start,
          endSeconds: end,
        ),
      ];
    case 'fit-whatsapp-video':
      final size = fitVideoSize(info, maxShortSide: 720);
      return _toSize(options.targetMb ?? whatsappVideoMb, info, encode, size);
    case 'fit-email-video':
      return _toSize(options.targetMb ?? action.maxBytes! / (1024 * 1024), info, encode, null);
  }
  throw EngineFailed('"${action.label}" is not available yet.');
}

List<MediaPlan> _toSize(
  double targetMb,
  MediaInfo info,
  MediaPlan Function({int? kbps, int? width, int? height, int? degrees}) encode,
  ({int width, int height})? size,
) {
  if (info.seconds <= 0) throw const EngineFailed('This video\'s length could not be read.');
  final plans = <MediaPlan>[];
  for (final margin in _sizeMargins) {
    final kbps = videoKbpsForTarget(
      targetMb: targetMb * margin,
      durationSeconds: info.seconds,
      audioKbps: info.hasAudio ? 128 : 0,
    );
    if (kbps != null && kbps >= _minUsefulKbps) {
      plans.add(encode(kbps: kbps, width: size?.width, height: size?.height));
    }
  }
  if (plans.isEmpty) {
    throw EngineFailed('This video is too long to fit under ${targetMb.toStringAsFixed(0)} MB.');
  }
  return plans;
}

int? _longest(MediaInfo info) {
  final width = info.width;
  final height = info.height;
  return width == null || height == null ? null : math.max(width, height);
}

/// About half the bits of ordinary footage at this size.
int _compressedKbps(MediaInfo info) {
  final pixels = (info.width ?? 1280) * (info.height ?? 720);
  return (pixels * 30 * 0.05 / 1000).round().clamp(300, 8000);
}

/// The size that fits both limits, never larger than the source and always even, which H.264
/// needs. Null when the size is unknown or nothing needs to change.
({int width, int height})? fitVideoSize(MediaInfo info, {int? maxShortSide, int? maxLongSide}) {
  final width = info.width;
  final height = info.height;
  if (width == null || height == null) return null;
  var scale = 1.0;
  if (maxShortSide != null) scale = math.min(scale, maxShortSide / math.min(width, height));
  if (maxLongSide != null) scale = math.min(scale, maxLongSide / math.max(width, height));
  if (scale >= 1) return null;
  int even(double value) => math.max(2, (value / 2).round() * 2);
  return (width: even(width * scale), height: even(height * scale));
}
