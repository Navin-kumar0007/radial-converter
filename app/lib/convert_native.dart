import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';

import 'android_media.dart';
import 'picked_file.dart';

class _Request {
  const _Request(this.actionId, this.files);

  final String actionId;
  final List<PortableFile> files;
}

Future<List<PortableFile>> _run(_Request request) {
  return runPortable(actionById(request.actionId)!, request.files);
}

/// Converts in a background isolate, so the app stays responsive. Isolates report no progress
/// through `compute`, so [onProgress] is not called here.
Future<List<PortableFile>> convert(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
) {
  return compute(_run, _Request(action.id, files));
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

/// Runs the engine as a separate process and saves beside the original, so size is not limited
/// by memory. The original is never touched.
Future<List<ConvertedFile>> convertMedia(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control,
) async {
  if (Platform.isAndroid) {
    return convertMediaOnPhone(action, files, kinds, onProgress, control);
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
      final job = queue.add((context) => runner.run(action, [paths[i]], context));
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
