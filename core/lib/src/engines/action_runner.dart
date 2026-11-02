import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:path/path.dart' as p;

import '../action_options.dart';
import '../actions.dart';
import '../detect.dart';
import '../file_kind.dart';
import '../job_queue.dart';
import '../media_plan.dart';
import '../naming.dart';
import '../pdf_writer.dart';
import '../portable_engine.dart';
import '../size_target.dart';
import 'ffmpeg_plan.dart';
import 'process.dart';
import 'tools.dart';

/// Actions waiting on an engine we have not wired up yet: PDFium for PDF pages to images,
/// and the built-in and add-on document converters.
bool isActionWired(RadialAction action) =>
    action.engine != Engine.pdfium && action.engine != Engine.document;

/// Actions that turn several inputs into one output.
const _combines = {'images-to-pdf', 'pdf-merge', 'video-merge', 'audio-merge'};

/// Runs catalogue actions with the engines as separate processes, so a broken file cannot
/// crash the app and a cancel is clean.
///
/// Originals are only ever read. Work happens in a temporary folder beside the output, and
/// a result gets its final name only once it is complete.
class ActionRunner {
  ActionRunner(this.tools);

  final EngineTools tools;

  /// Runs [action] and returns the output paths. [outputFolder] defaults to the folder of
  /// each input.
  Future<List<String>> run(
    RadialAction action,
    List<String> inputs,
    JobContext context, {
    ActionOptions options = const ActionOptions(),
    String? outputFolder,
  }) async {
    if (!isActionWired(action)) {
      throw EngineFailed('"${action.label}" is not available yet.');
    }
    if (inputs.length < action.minFiles) {
      throw EngineFailed('"${action.label}" needs at least ${action.minFiles} files.');
    }
    final kinds = <FileKind>[];
    for (final input in inputs) {
      final kind = await _kindOf(input);
      if (!action.accepts.contains(kind)) {
        throw EngineFailed('"${action.label}" can\'t use ${p.basename(input)}.');
      }
      kinds.add(kind);
    }

    if (_combines.contains(action.id)) {
      return [await _runOne(action, inputs, kinds, context, options, outputFolder)];
    }
    return [
      for (var i = 0; i < inputs.length; i++)
        await _runOne(action, [inputs[i]], [kinds[i]], context, options, outputFolder),
    ];
  }

  Future<FileKind> _kindOf(String path) async {
    if (await FileSystemEntity.isDirectory(path)) return FileKind.folder;
    final file = File(path);
    if (!await file.exists()) throw EngineFailed('${p.basename(path)} could not be found.');
    final head = await file
        .openRead(0, detectHeadBytes)
        .fold<List<int>>(<int>[], (bytes, chunk) => bytes..addAll(chunk));
    return detectKind(head, fileName: p.basename(path));
  }

  Future<String> _runOne(
    RadialAction action,
    List<String> inputs,
    List<FileKind> kinds,
    JobContext context,
    ActionOptions options,
    String? outputFolder,
  ) async {
    context.throwIfCancelled();
    final absolute = [for (final input in inputs) p.absolute(input)];
    final folder = outputFolder ?? p.dirname(absolute.first);
    final scratch = await Directory(folder).createTemp('.radial-');
    try {
      final job = _Job(
        action: action,
        inputs: absolute,
        kinds: kinds,
        options: options,
        context: context,
        scratch: scratch.path,
        tools: tools,
      );
      final temp = await job.run();
      return _publish(temp, absolute.first, job.outputExtension, action.suffix, folder);
    } finally {
      await scratch.delete(recursive: true);
    }
  }

  /// Moves the finished output to its final name. The name check and the move happen with
  /// nothing in between, so parallel jobs cannot pick the same name.
  String _publish(String temp, String input, String extension, String suffix, String folder) {
    final isFolder = FileSystemEntity.isDirectorySync(temp);
    if (!isFolder && (!File(temp).existsSync() || File(temp).lengthSync() == 0)) {
      throw const EngineFailed('The engine finished without making a file.');
    }
    final name = freeOutputName(
      inputName: p.basename(input),
      extension: isFolder ? '' : extension,
      suffix: suffix,
      exists: (candidate) {
        return FileSystemEntity.typeSync(p.join(folder, candidate)) !=
            FileSystemEntityType.notFound;
      },
    );
    final target = p.join(folder, name);
    if (isFolder) {
      Directory(temp).renameSync(target);
    } else {
      File(temp).renameSync(target);
    }
    return target;
  }
}

/// Image formats where quality changes the file size.
const _qualityFormats = {FileKind.jpg, FileKind.webp, FileKind.avif};

class _Job {
  _Job({
    required this.action,
    required this.inputs,
    required this.kinds,
    required this.options,
    required this.context,
    required this.scratch,
    required this.tools,
  });

  final RadialAction action;
  final List<String> inputs;
  final List<FileKind> kinds;
  final ActionOptions options;
  final JobContext context;
  final String scratch;
  final EngineTools tools;

  FileKind get _outputKind => action.outputFor(kinds.first);
  String get outputExtension => _outputKind.extension;
  String get input => inputs.first;
  String get _temp => p.join(scratch, 'out.$outputExtension');

  /// Does the work and returns the temporary output path.
  Future<String> run() async {
    if (action.id == 'archive-extract') return _extract();
    if (inputs.length == 1 && canPlanMedia(action, kinds.first)) {
      await _planned();
      return _temp;
    }
    switch (action.engine) {
      case Engine.vips:
        await _image();
      case Engine.ffmpeg:
        if (action.accepts.contains(FileKind.mp3)) {
          await _audio();
        } else if (action.accepts.contains(FileKind.jpg)) {
          await _imageToIco();
        } else {
          await _video();
        }
      case Engine.qpdf:
        return _pdf();
      case Engine.libarchive:
        await _archive();
      case Engine.builtIn:
        await _subtitles();
      case Engine.pdfium:
      case Engine.document:
        throw EngineFailed('"${action.label}" is not available yet.');
    }
    return _temp;
  }

  // Images

  Future<void> _image() async {
    switch (action.id) {
      case 'image-to-pdf':
      case 'images-to-pdf':
        return _imagesToPdf();
      case 'fit-whatsapp-photo':
        return _vipsSave(input, _temp, longSide: 1600, quality: 80);
      case 'fit-web':
        return _vipsSave(input, _temp, longSide: 1920, quality: 80);
      case 'fit-instagram':
        return _vipsRun([
          'thumbnail',
          _vipsPath(input),
          _vipsTarget(_temp, 85),
          '1080',
          '--height',
          '1350',
          '--crop',
          'centre',
        ], failure: _unreadableImage);
      case 'image-resize':
        return _vipsSave(input, _temp, longSide: _need(options.longSide, 'a size'));
      case 'image-compress':
        return _vipsSave(input, _temp, quality: 70, palette: true);
      case 'image-crop':
        final crop = _need(options.crop, 'a crop area');
        return _vipsEdit([
          'crop',
          '${crop.left}',
          '${crop.top}',
          '${crop.width}',
          '${crop.height}',
        ]);
      case 'image-rotate':
        return _vipsEdit(['rot', 'd${_need(options.degrees, 'an angle')}']);
      case 'image-flip':
        final direction = options.flipVertical ? 'vertical' : 'horizontal';
        return _vipsEdit(['flip', direction]);
    }
    if (action.maxBytes != null) return _underSize(action.maxBytes!);
    return _vipsSave(input, _temp);
  }

  String get _unreadableImage => '${p.basename(input)} could not be read as an image.';

  /// libvips reads a trailing `[...]` in a path as options, so such names go through a copy.
  String _vipsPath(String path) {
    if (!path.endsWith(']')) return path;
    final copy = p.join(scratch, 'in${_copies++}${p.extension(path.split('[').first)}');
    File(path).copySync(copy);
    return copy;
  }

  int _copies = 0;

  String _vipsTarget(String path, int? quality, {FileKind? kind, bool palette = false}) {
    final format = kind ?? _outputKind;
    final settings = <String>[
      // Removes EXIF, and so GPS, keeping only the colour profile. Rotation is applied first.
      'keep=icc',
      if (_qualityFormats.contains(format)) 'Q=${quality ?? 85}',
      // JPEG has no transparency; without this, transparent areas turn black.
      if (format == FileKind.jpg) 'background=255',
      if (format == FileKind.png && palette) 'palette',
    ];
    return '$path[${settings.join(',')}]';
  }

  /// `thumbnail` applies the EXIF rotation, which is why it is used even without resizing.
  Future<void> _vipsSave(
    String source,
    String target, {
    int? longSide,
    int? quality,
    FileKind? kind,
    bool palette = false,
    bool sRgb = false,
  }) {
    final size = '${longSide ?? 100000}';
    return _vipsRun([
      'thumbnail',
      _vipsPath(source),
      _vipsTarget(target, quality, kind: kind, palette: palette),
      size,
      '--height',
      size,
      '--size',
      'down',
      if (sRgb) ...['--export-profile', 'srgb'],
    ], failure: _unreadableImage);
  }

  Future<void> _vipsRun(List<String> arguments, {required String failure}) {
    return runTool(tools.vips, arguments, context, failure: failure);
  }

  /// Rotates to upright, applies one libvips operation, then saves.
  ///
  /// [operation] is the operation's name followed by its values.
  Future<void> _vipsEdit(List<String> operation) async {
    final upright = p.join(scratch, 'upright.v');
    final edited = p.join(scratch, 'edited.v');
    await _vipsRun([
      'thumbnail',
      _vipsPath(input),
      upright,
      '100000',
      '--height',
      '100000',
      '--size',
      'down',
    ], failure: _unreadableImage);
    await _vipsRun([
      operation.first,
      upright,
      edited,
      ...operation.skip(1),
    ], failure: 'That edit does not fit this picture.');
    await _vipsRun(['copy', edited, _vipsTarget(_temp, null)], failure: _unreadableImage);
  }

  Future<void> _underSize(int maxBytes) async {
    final width = await _header('width');
    final height = await _header('height');
    final longest = width > height ? width : height;
    final hasQuality = _qualityFormats.contains(_outputKind);
    final attempt = p.join(scratch, 'try.$outputExtension');

    int longSideFor(double scale) => (longest * scale).round().clamp(1, longest);
    Future<void> encode(int quality, double scale, String target) =>
        _vipsSave(input, target, longSide: longSideFor(scale), quality: quality);

    final best = await searchUnderSize(
      maxBytes: maxBytes,
      // Without a quality setting, only shrinking changes the size.
      minQuality: hasQuality ? 40 : 85,
      maxQuality: hasQuality ? 95 : 85,
      encode: (quality, scale) async {
        await encode(quality, scale, attempt);
        return File(attempt).length();
      },
    );
    if (best == null) {
      throw EngineFailed('This picture could not be made small enough for "${action.label}".');
    }
    await encode(best.quality, best.scale, _temp);
  }

  Future<int> _header(String field) async {
    final output = await runTool(
      tools.vipsHeader,
      ['-f', field, _vipsPath(input)],
      context,
      failure: _unreadableImage,
    );
    return int.parse(output.trim());
  }

  Future<void> _imagesToPdf() async {
    final jpegs = <Uint8List>[];
    for (var i = 0; i < inputs.length; i++) {
      final page = p.join(scratch, 'page$i.jpg');
      await _vipsSave(inputs[i], page, quality: 90, kind: FileKind.jpg, sRgb: true);
      jpegs.add(await File(page).readAsBytes());
      context.report((i + 1) / inputs.length);
    }
    await File(_temp).writeAsBytes(buildImagePdf(jpegs));
  }

  Future<void> _imageToIco() async {
    final png = p.join(scratch, 'icon.png');
    await _vipsSave(input, png, longSide: 256, kind: FileKind.png);
    await runTool(tools.ffmpeg, [
      ..._ffmpegStart,
      '-i',
      png,
      '-vf',
      'scale=256:256:force_original_aspect_ratio=decrease',
      _temp,
    ], context);
  }

  // Video and audio

  /// `-protocol_whitelist` stops a crafted file from reaching the network or other files.
  List<String> get _ffmpegStart => [
    '-hide_banner',
    '-loglevel',
    'error',
    '-nostdin',
    '-n',
    '-protocol_whitelist',
    'file,pipe',
  ];

  /// Hardware H.264 only: x264 is GPL and must never ship. Quality mode on Apple; a
  /// fixed bitrate where the encoder has no such mode.
  List<String> _h264({int? kbps}) {
    final encoder = Platform.isMacOS
        ? 'h264_videotoolbox'
        : Platform.isWindows
        ? 'h264_mf'
        : 'h264_v4l2m2m';
    return [
      '-c:v',
      encoder,
      if (kbps != null) ...['-b:v', '${kbps}k', '-maxrate', '${kbps}k', '-bufsize', '${kbps * 2}k'],
      if (kbps == null && Platform.isMacOS) ...['-q:v', '65'],
      if (kbps == null && !Platform.isMacOS) ...['-b:v', '4000k'],
      '-pix_fmt',
      'yuv420p',
    ];
  }

  List<String> _videoCodec(FileKind kind, {int? kbps}) {
    return switch (kind) {
      FileKind.webm => [
        '-c:v',
        'libvpx-vp9',
        if (kbps != null) ...['-b:v', '${kbps}k'] else ...['-b:v', '0', '-crf', '32'],
        '-row-mt',
        '1',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
      ],
      FileKind.mp4 || FileKind.mov => [
        ..._h264(kbps: kbps),
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-movflags',
        '+faststart',
      ],
      _ => [..._h264(kbps: kbps), '-c:a', 'aac', '-b:a', '128k'],
    };
  }

  List<String> _audioCodec(FileKind kind, {int? kbps}) {
    return switch (kind) {
      FileKind.mp3 => [
        '-c:a',
        'libmp3lame',
        if (kbps != null) ...['-b:a', '${kbps}k'] else ...['-q:a', '2'],
      ],
      FileKind.m4a || FileKind.aac => ['-c:a', 'aac', '-b:a', '${kbps ?? 192}k'],
      FileKind.wav => ['-c:a', 'pcm_s16le'],
      FileKind.flac => ['-c:a', 'flac'],
      FileKind.ogg || FileKind.opus => ['-c:a', 'libopus', '-b:a', '${kbps ?? 128}k'],
      _ => throw EngineFailed('This audio format can\'t be written: ${kind.extension}.'),
    };
  }

  /// Runs FFmpeg and turns its progress lines into job progress.
  Future<void> _ffmpeg(List<String> arguments, double? seconds) {
    return runTool(
      tools.ffmpeg,
      [...arguments, '-progress', 'pipe:1', '-nostats', _temp],
      context,
      failure: '${p.basename(input)} could not be read. Try MP4 or MOV.',
      onLine: (line) {
        if (seconds == null || seconds <= 0 || !line.startsWith('out_time_us=')) return;
        final micros = int.tryParse(line.substring('out_time_us='.length));
        if (micros != null) context.report(micros / 1000000 / seconds);
      },
    );
  }

  Future<MediaInfo> _probe(String path) async {
    final output = await runTool(
      tools.ffprobe,
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration:stream=codec_type,codec_name,width,height',
        '-of',
        'json',
        path,
      ],
      context,
      failure: '${p.basename(path)} could not be read.',
    );
    final json = jsonDecode(output) as Map<String, dynamic>;
    final streams = (json['streams'] as List<dynamic>).cast<Map<String, dynamic>>();
    Map<String, dynamic>? stream(String type) {
      return streams.where((entry) => entry['codec_type'] == type).firstOrNull;
    }

    final video = stream('video');
    final audio = stream('audio');
    final format = json['format'] as Map<String, dynamic>? ?? const {};
    return MediaInfo(
      seconds: double.tryParse('${format['duration']}') ?? 0,
      hasVideo: video != null,
      hasAudio: audio != null,
      width: video?['width'] as int?,
      height: video?['height'] as int?,
      videoCodec: planCodecName(video?['codec_name'] as String?),
      audioCodec: planCodecName(audio?['codec_name'] as String?),
    );
  }

  /// Carries out the shared plan, the same one every platform follows. A size target tries
  /// each plan in turn until the file really fits.
  Future<void> _planned() async {
    final info = await _probe(input);
    final plans = planMedia(action, kinds.first, info, options: options);
    final limit = mediaSizeLimit(action, options);
    for (final plan in plans) {
      final start = plan.startSeconds ?? 0;
      await _ffmpeg([
        ..._ffmpegStart,
        ...ffmpegInputFlags(plan),
        '-i',
        input,
        ...ffmpegPlanArguments(
          plan,
          info,
          h264Encoder: platformH264Encoder(),
          qualityMode: Platform.isMacOS,
        ),
      ], (plan.endSeconds ?? info.seconds) - start);
      if (limit == null || await File(_temp).length() <= limit) return;
      await File(_temp).delete();
    }
    throw EngineFailed('This video could not be made small enough for "${action.label}".');
  }

  /// A trim's input flags, and how long the result will be.
  (List<String>, double?) _trim(double? seconds) {
    final start = options.startSeconds;
    final end = options.endSeconds;
    if (start == null && end == null) throw const EngineFailed('Choose where to trim.');
    final length = seconds == null ? null : (end ?? seconds) - (start ?? 0);
    if (length != null && length <= 0) throw const EngineFailed('The trim leaves nothing.');
    return (
      [
        if (start != null) ...['-ss', '$start'],
        if (end != null) ...['-to', '$end'],
      ],
      length,
    );
  }

  /// What plans don't cover yet: GIF, MP3 and merging.
  Future<void> _video() async {
    if (action.id == 'video-merge') return _mergeVideo();
    final media = await _probe(input);
    final open = [..._ffmpegStart, '-i', input];
    const clean = ['-map_metadata', '-1', '-sn'];
    switch (action.id) {
      case 'video-to-gif':
        return _ffmpeg([
          ...open,
          ...clean,
          '-an',
          '-filter_complex',
          'fps=12,scale=480:-2:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse',
        ], media.seconds);
      case 'video-to-mp3':
        if (!media.hasAudio) throw const EngineFailed('This video has no sound.');
        return _ffmpeg([...open, ...clean, '-vn', ..._audioCodec(_outputKind)], media.seconds);
    }
    throw EngineFailed('"${action.label}" can\'t use this file.');
  }

  /// Fits every clip into the first clip's frame. Clips without sound get silence.
  Future<void> _mergeVideo() async {
    final clips = [for (final clip in inputs) await _probe(clip)];
    final first = clips.first;
    final width = first.width;
    final height = first.height;
    if (width == null || height == null) throw const EngineFailed('A video could not be read.');
    final withAudio = clips.any((clip) => clip.hasAudio);
    final total = clips.fold<double>(0, (sum, clip) => sum + clip.seconds);

    final filter = StringBuffer();
    final joined = StringBuffer();
    for (var i = 0; i < clips.length; i++) {
      filter.write(
        '[$i:v]scale=$width:$height:force_original_aspect_ratio=decrease,'
        'pad=$width:$height:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v$i];',
      );
      joined.write('[v$i]');
      if (withAudio) {
        filter.write(
          clips[i].hasAudio
              ? '[$i:a]aformat=sample_rates=48000:channel_layouts=stereo[a$i];'
              : 'aevalsrc=0:d=${clips[i].seconds}:s=48000:c=stereo[a$i];',
        );
        joined.write('[a$i]');
      }
    }
    filter.write('${joined}concat=n=${clips.length}:v=1:a=${withAudio ? 1 : 0}[v]');
    if (withAudio) filter.write('[a]');

    await _ffmpeg([
      ..._ffmpegStart,
      for (final clip in inputs) ...['-i', clip],
      '-map_metadata',
      '-1',
      '-filter_complex',
      filter.toString(),
      '-map',
      '[v]',
      if (withAudio) ...['-map', '[a]'],
      ..._videoCodec(_outputKind),
    ], total);
  }

  Future<void> _audio() async {
    if (action.id == 'audio-merge') return _mergeAudio();
    final media = await _probe(input);
    final seconds = media.seconds;
    final open = [..._ffmpegStart, '-i', input];
    const clean = ['-map_metadata', '-1', '-vn'];
    final kind = _outputKind;

    switch (action.id) {
      case 'audio-trim':
        final (flags, length) = _trim(seconds);
        return _ffmpeg([
          ..._ffmpegStart,
          ...flags,
          '-i',
          input,
          ...clean,
          ..._audioCodec(kind),
        ], length);
      case 'audio-normalise':
        return _ffmpeg([...open, ...clean, '-af', 'loudnorm', ..._audioCodec(kind)], seconds);
      case 'audio-bitrate':
        if (kind == FileKind.wav || kind == FileKind.flac) {
          throw const EngineFailed('WAV and FLAC have no bitrate setting. Try MP3 or M4A.');
        }
        final kbps = _need(options.audioKbps, 'a bitrate');
        return _ffmpeg([...open, ...clean, ..._audioCodec(kind, kbps: kbps)], seconds);
    }
    return _ffmpeg([...open, ...clean, ..._audioCodec(kind)], seconds);
  }

  Future<void> _mergeAudio() async {
    final clips = [for (final clip in inputs) await _probe(clip)];
    final total = clips.fold<double>(0, (sum, clip) => sum + clip.seconds);
    final filter = StringBuffer();
    final joined = StringBuffer();
    for (var i = 0; i < clips.length; i++) {
      filter.write('[$i:a]aformat=sample_rates=48000:channel_layouts=stereo[a$i];');
      joined.write('[a$i]');
    }
    filter.write('${joined}concat=n=${clips.length}:v=0:a=1[a]');
    await _ffmpeg([
      ..._ffmpegStart,
      for (final clip in inputs) ...['-i', clip],
      '-map_metadata',
      '-1',
      '-filter_complex',
      filter.toString(),
      '-map',
      '[a]',
      ..._audioCodec(_outputKind),
    ], total);
  }

  // PDF

  Future<String> _qpdf(List<String> arguments, {String? stdinText, String? workingDirectory}) {
    return runTool(
      tools.qpdf,
      ['--warning-exit-0', ...arguments],
      context,
      stdinText: stdinText,
      workingDirectory: workingDirectory,
      failure: '${p.basename(input)} could not be read. It may be damaged or have a password.',
    );
  }

  /// Compression flags for qpdf. Lossless only; shrinking pictures needs PDFium later.
  static const _pdfCompress = [
    '--object-streams=generate',
    '--compress-streams=y',
    '--recompress-flate',
    '--compression-level=9',
  ];

  Future<String> _pdf() async {
    final password = options.password;
    switch (action.id) {
      case 'pdf-merge':
        await _qpdf(['--empty', '--pages', ...inputs, '--', _temp]);
      case 'pdf-split':
        final folder = p.join(scratch, 'pages');
        await Directory(folder).create();
        // qpdf expands %d in the whole path, so the user's folder name stays out of it.
        await _qpdf(['--split-pages', input, 'page-%d.pdf'], workingDirectory: folder);
        return folder;
      case 'pdf-extract-pages':
        final pages = _need(options.pages, 'which pages');
        if (!RegExp(r'^[0-9zr,\-]+$').hasMatch(pages)) {
          throw const EngineFailed('Pages look like 1-3,7.');
        }
        await _qpdf([input, '--pages', '.', pages, '--', _temp]);
      case 'pdf-rotate':
        final degrees = _need(options.degrees, 'an angle');
        await _qpdf(['--rotate=+$degrees:1-z', input, _temp]);
      case 'pdf-compress':
        await _qpdf([..._pdfCompress, input, _temp]);
      case 'pdf-add-password':
        final secret = _need(password, 'a password');
        if (secret.isEmpty || secret.contains('\n')) {
          throw const EngineFailed('That password can\'t be used.');
        }
        await _qpdf(
          [input, '@-', _temp],
          stdinText:
              '--encrypt\n--user-password=$secret\n--owner-password=$secret\n--bits=256\n--\n',
        );
      case 'pdf-remove-password':
        final secret = _need(password, 'the password');
        await _qpdf(['--password-file=-', '--decrypt', input, _temp], stdinText: '$secret\n');
      case 'pdf-strip-metadata':
        await _qpdf(['--remove-info', '--remove-metadata', input, _temp]);
      default:
        await _qpdf([..._pdfCompress, input, _temp]);
        final limit = action.maxBytes!;
        final size = await File(_temp).length();
        if (size > limit) {
          throw EngineFailed(
            'This PDF only shrinks to ${(size / 1024).ceil()} KB, '
            'above the ${(limit / 1024).ceil()} KB limit.',
          );
        }
    }
    return _temp;
  }

  // Archives and folders

  Future<String> _extract() async {
    final folder = p.join(scratch, 'extracted');
    await _unpack(folder);
    return folder;
  }

  /// bsdtar refuses paths that climb out of the target folder.
  Future<void> _unpack(String folder) async {
    await Directory(folder).create();
    try {
      await runTool(
        tools.bsdtar,
        ['-xf', input, '-C', folder],
        context,
        failure: '${p.basename(input)} could not be opened. It may be damaged.',
      );
    } on EngineFailed {
      if (kinds.first != FileKind.gz) rethrow;
      // A gzip of one plain file is not an archive to bsdtar.
      final name = splitFileName(p.basename(input)).stem;
      await File(
        input,
      ).openRead().transform(gzip.decoder).pipe(File(p.join(folder, name)).openWrite());
    }
  }

  Future<void> _archive() async {
    final format = switch (_outputKind) {
      FileKind.zip => ['--format', 'zip'],
      FileKind.sevenZip => ['--format', '7zip'],
      _ => ['-z', '--format', 'pax'],
    };
    final List<String> contents;
    if (action.id == 'folder-compress') {
      contents = ['-C', p.dirname(input), p.basename(input)];
    } else {
      final folder = p.join(scratch, 'contents');
      await _unpack(folder);
      contents = ['-C', folder, '.'];
    }
    await runTool(tools.bsdtar, ['-c', ...format, '-f', _temp, ...contents], context);
  }

  // Subtitles

  Future<void> _subtitles() async {
    final bytes = await File(input).readAsBytes();
    final text = convertSubtitles(
      action.id,
      utf8.decode(bytes, allowMalformed: true),
      kinds.first,
      options.shift,
    );
    await File(_temp).writeAsString(text);
  }

  T _need<T>(T? value, String what) {
    if (value == null) throw EngineFailed('"${action.label}" needs $what.');
    return value;
  }
}
