import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';

import 'android_media.dart';
import 'picked_file.dart';

class _Request {
  const _Request(this.actionId, this.files, this.options);

  final String actionId;
  final List<PortableFile> files;
  final ActionOptions options;
}

Future<List<PortableFile>> _run(_Request request) {
  return runPortable(actionById(request.actionId)!, request.files, options: request.options);
}

/// Converts in a background isolate, so the app stays responsive. Isolates report no progress
/// through `compute`, so [onProgress] is not called here.
Future<List<PortableFile>> convert(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress, [
  ActionOptions options = const ActionOptions(),
]) {
  return compute(_run, _Request(action.id, files, options));
}

/// On a desktop the engines ship inside the app.
EngineTools _appEngines() {
  final folder = p.dirname(Platform.resolvedExecutable);
  return EngineTools(
    bundledFolder: Platform.isMacOS
        ? p.join(p.dirname(folder), 'Resources', 'engines')
        : p.join(folder, 'engines'),
  );
}

/// True if these tools can run video on a desktop.
bool mediaEngineAvailableWith(EngineTools tools) {
  if (!Platform.isMacOS && !Platform.isWindows) return false;
  return tools.find('ffmpeg') != null && tools.find('ffprobe') != null;
}

/// Android brings its own encoders.
bool mediaEngineAvailable() => Platform.isAndroid || mediaEngineAvailableWith(_appEngines());

/// What video and audio can become here, or null for everything that can be planned.
Set<FileKind>? mediaOutputsHere() => Platform.isAndroid ? phoneMediaOutputs : null;

/// Reads a HEIC photo, upright, as a PNG. Desktops use the FFmpeg they already carry.
Future<Uint8List> decodeHeicWith(EngineTools tools, String path) async {
  final result = await Process.run(
    tools.ffmpeg,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      path,
      '-frames:v',
      '1',
      '-c:v',
      'png',
      '-f',
      'image2pipe',
      '-',
    ],
    stdoutEncoding: null,
    stderrEncoding: null,
  );
  final png = result.stdout as List<int>;
  if (result.exitCode != 0 || png.isEmpty) {
    throw const EngineFailed('This photo could not be read. It may be damaged.');
  }
  return Uint8List.fromList(png);
}

/// Reads a HEIC photo as a PNG, so the picture engine can take it from there.
Future<Uint8List> decodeHeic(PickedFile file) async {
  final path = file.path;
  if (path == null) throw EngineFailed('${file.name} could not be read.');
  return Platform.isAndroid ? decodeHeicOnPhone(path) : decodeHeicWith(_appEngines(), path);
}

/// Runs the engine as a separate process and saves beside the original, so size is not limited
/// by memory. The original is never touched.
Future<List<ConvertedFile>> convertMedia(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control, [
  ActionOptions options = const ActionOptions(),
]) async {
  if (Platform.isAndroid) {
    return convertMediaOnPhone(action, files, kinds, onProgress, control, options);
  }
  final paths = <String>[];
  for (final file in files) {
    final path = file.path;
    if (path == null) throw EngineFailed('${file.name} could not be read.');
    paths.add(path);
  }

  final runner = ActionRunner(_appEngines());
  final queue = JobQueue(maxParallel: 1);
  final results = <ConvertedFile>[];
  try {
    for (var i = 0; i < paths.length; i++) {
      final job = queue.add((context) => runner.run(action, [paths[i]], context, options: options));
      control.cancel = job.cancel;
      final progress = queue.changes.listen((changed) {
        if (identical(changed, job) && changed.progress > 0) {
          onProgress((i + changed.progress) / paths.length);
        }
      });
      try {
        for (final output in await job.result) {
          results.add(
            ConvertedFile(
              name: p.basename(output),
              size: await sizeOnDisk(output),
              savedPath: output,
            ),
          );
        }
      } finally {
        await progress.cancel();
      }
    }
  } finally {
    control.cancel = null;
    await queue.dispose();
  }
  return results;
}
