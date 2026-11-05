import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

import 'picked_file.dart';

/// `MediaEngine.kt` on the other side.
const mediaChannel = MethodChannel('radial/media');

int _nextId = 0;
final _progressById = <int, void Function(double)>{};

void _listenForProgress() {
  mediaChannel.setMethodCallHandler((call) async {
    if (call.method != 'progress') return;
    final arguments = call.arguments as Map;
    _progressById[arguments['id'] as int]?.call(arguments['value'] as double);
  });
}

/// What the phone found out about the file at [path].
Future<MediaInfo> probeOnPhone(String path) async {
  final reply = await _call<Map>('probe', {'path': path});
  return MediaInfo(
    seconds: (reply['seconds'] as num).toDouble(),
    hasVideo: reply['videoCodec'] != null,
    hasAudio: reply['audioCodec'] != null,
    width: reply['width'] as int?,
    height: reply['height'] as int?,
    videoCodec: reply['videoCodec'] as String?,
    audioCodec: reply['audioCodec'] as String?,
  );
}

/// Reads a HEIC photo as a PNG. The phone writes it to a file, since 48 MP is a lot to pass across.
Future<Uint8List> decodeHeicOnPhone(String path) async {
  final reply = await _call<Map>('decodePhoto', {'path': path});
  final png = reply['path'] as String;
  try {
    return await File(png).readAsBytes();
  } finally {
    await _removeResult(png);
  }
}

/// The 7z or RAR at [path], unpacked into a ZIP. The phone writes it to a file, as a large one is a
/// lot to pass across.
Future<Uint8List> unpackOnPhone(String path) async {
  final reply = await _call<Map>('unpackArchive', {'path': path, 'limit': maxOpenedBytes});
  final zip = reply['path'] as String;
  try {
    return await File(zip).readAsBytes();
  } finally {
    await _removeResult(zip);
  }
}

/// One frame of the video at [path], as a small JPEG.
Future<Uint8List> videoFrameOnPhone(String path, double seconds) {
  return _call<Uint8List>('videoFrame', {'path': path, 'seconds': seconds});
}

Future<T> _call<T>(String method, Map<String, Object?> arguments) async {
  try {
    return (await mediaChannel.invokeMethod<T>(method, arguments)) as T;
  } on PlatformException catch (error) {
    if (error.code == 'cancelled') throw const JobCancelled();
    throw EngineFailed(error.message ?? 'This file could not be converted.');
  }
}

Future<void> _removeResult(String path) async {
  try {
    await File(path).parent.delete(recursive: true);
  } on FileSystemException catch (error) {
    debugPrint('Could not remove an unwanted result: $error');
  }
}

/// Runs the same plans as every other platform, using the phone's own encoders. Results wait in
/// the app's cache until the user saves them, because Android has no "beside the original".
Future<List<ConvertedFile>> convertMediaOnPhone(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control, [
  ActionOptions options = const ActionOptions(),
]) async {
  _listenForProgress();
  var stopped = false;
  int? runningId;
  control.cancel = () {
    stopped = true;
    final id = runningId;
    if (id != null) mediaChannel.invokeMethod<void>('cancel', {'id': id});
  };

  try {
    final results = <ConvertedFile>[];
    for (var i = 0; i < files.length; i++) {
      final file = files[i];
      final path = file.path;
      if (path == null) throw EngineFailed('${file.name} could not be read.');

      final info = await probeOnPhone(path);
      final plans = planMedia(action, kinds[i], info, options: options);
      final limit = mediaSizeLimit(action, options);
      final name = freeOutputName(
        inputName: file.name,
        extension: plans.first.output.extension,
        suffix: action.suffix,
        exists: (_) => false,
      );

      ConvertedFile? done;
      for (var attempt = 0; attempt < plans.length && done == null; attempt++) {
        if (stopped) throw const JobCancelled();
        final plan = plans[attempt];
        final id = _nextId++;
        runningId = id;
        _progressById[id] = (progress) {
          final part = limit == null ? progress : (attempt + progress) / plans.length;
          onProgress((i + part) / files.length);
        };
        final Map reply;
        try {
          reply = await _call<Map>('convert', {
            ...plan.toMap(),
            'id': id,
            'input': path,
            'name': name,
            'copyVideo': plan.copiesVideo(info),
            'copyAudio': plan.copiesAudio(info),
          });
        } finally {
          runningId = null;
          _progressById.remove(id);
        }

        final saved = reply['path'] as String;
        final size = reply['size'] as int;
        if (limit != null && size > limit) {
          debugPrint('Attempt ${attempt + 1} came to $size bytes, over $limit. Aiming lower.');
          await _removeResult(saved);
          continue;
        }
        done = ConvertedFile(
          name: name,
          size: size,
          download: () =>
              _call<bool>('save', {'path': saved, 'name': name, 'mime': plan.output.mime}),
        );
      }
      if (done == null) {
        throw EngineFailed('This video could not be made small enough for "${action.label}".');
      }
      results.add(done);
    }
    return results;
  } finally {
    control.cancel = null;
  }
}
