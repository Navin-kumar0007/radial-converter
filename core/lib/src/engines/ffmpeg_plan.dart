import 'dart:io';

import '../file_kind.dart';
import '../media_plan.dart';

/// The hardware H.264 encoder on this computer. x264 is GPL and must never ship.
String platformH264Encoder() {
  if (Platform.isMacOS) return 'h264_videotoolbox';
  if (Platform.isWindows) return 'h264_mf';
  return 'h264_v4l2m2m';
}

/// FFmpeg flags that go before `-i`.
List<String> ffmpegInputFlags(MediaPlan plan) {
  final start = plan.startSeconds;
  final end = plan.endSeconds;
  return [
    if (start != null) ...['-ss', '$start'],
    if (end != null) ...['-to', '$end'],
  ];
}

/// How [plan] looks to FFmpeg, for flags after `-i`.
///
/// Metadata is dropped whatever the plan says, because location lives there.
List<String> ffmpegPlanArguments(
  MediaPlan plan,
  MediaInfo info, {
  required String h264Encoder,
  bool qualityMode = true,
}) {
  return [
    '-map_metadata',
    '-1',
    '-sn',
    ..._video(plan, info, h264Encoder, qualityMode),
    ..._audio(plan, info),
    if (const {FileKind.mp4, FileKind.mov, FileKind.m4a}.contains(plan.output)) ...[
      '-movflags',
      '+faststart',
    ],
  ];
}

List<String> _video(MediaPlan plan, MediaInfo info, String h264Encoder, bool qualityMode) {
  if (plan.dropVideo || !info.hasVideo) return const ['-vn'];
  if (plan.copiesVideo(info)) return const ['-c:v', 'copy'];

  final filters = [
    if (plan.width != null && plan.height != null) 'scale=${plan.width}:${plan.height}',
    ...switch (plan.degrees) {
      90 => const ['transpose=1'],
      180 => const ['transpose=1', 'transpose=1'],
      270 => const ['transpose=2'],
      _ => const <String>[],
    },
  ];
  final kbps = plan.videoKbps;
  final vp9 = plan.videoCodec == 'vp9';
  return [
    if (filters.isNotEmpty) ...['-vf', filters.join(',')],
    '-c:v',
    if (vp9) ...['libvpx-vp9', '-row-mt', '1'] else h264Encoder,
    if (kbps != null) ...['-b:v', '${kbps}k', '-maxrate', '${kbps}k', '-bufsize', '${kbps * 2}k'],
    if (kbps == null && vp9) ...['-b:v', '0', '-crf', '32'],
    if (kbps == null && !vp9 && qualityMode) ...['-q:v', '65'],
    if (kbps == null && !vp9 && !qualityMode) ...['-b:v', '4000k'],
    if (!vp9) ...['-pix_fmt', 'yuv420p'],
  ];
}

List<String> _audio(MediaPlan plan, MediaInfo info) {
  if (plan.dropAudio || !info.hasAudio) return const ['-an'];
  if (plan.copiesAudio(info)) return const ['-c:a', 'copy'];
  final kbps = plan.audioKbps;
  return [
    '-c:a',
    switch (plan.audioCodec) {
      'opus' => 'libopus',
      'pcm-s16' => 'pcm_s16le',
      _ => 'aac',
    },
    if (kbps != null) ...['-b:a', '${kbps}k'],
  ];
}

/// The codec names FFmpeg reports, in the words plans use.
String? planCodecName(String? ffmpegName) {
  return switch (ffmpegName) {
    null => null,
    'h264' => 'avc',
    final other => other,
  };
}
