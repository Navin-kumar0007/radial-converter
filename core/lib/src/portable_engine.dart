import 'dart:convert';
import 'dart:typed_data';

import 'package:image/image.dart' as img;

import 'action_options.dart';
import 'actions.dart';
import 'detect.dart';
import 'file_kind.dart';
import 'naming.dart';
import 'pdf_writer.dart';
import 'portable_archive.dart';
import 'size_target.dart';
import 'subtitles.dart';

/// A file in memory.
class PortableFile {
  const PortableFile(this.name, this.bytes);

  final String name;
  final Uint8List bytes;
}

/// Refuses pictures larger than this, so one file cannot use up all the memory. Phones now
/// take 200 megapixel photos, and those must open.
const maxPortablePixels = 210 * 1000 * 1000;

const _readable = {
  FileKind.jpg,
  FileKind.png,
  FileKind.webp,
  FileKind.gif,
  FileKind.bmp,
  FileKind.tiff,
  FileKind.ico,
};

const _writable = {
  FileKind.jpg,
  FileKind.png,
  FileKind.webp,
  FileKind.gif,
  FileKind.tiff,
  FileKind.ico,
  FileKind.pdf,
};

/// True if [action] can run on [kind] with pure Dart: on every platform, with no engines
/// installed. Video, audio, PDF tools, archives, HEIC and AVIF need native engines.
bool canRunPortably(RadialAction action, FileKind kind) {
  if (!action.accepts.contains(kind)) return false;
  if (kind.family == FileFamily.subtitle) return true;
  if (kind.family == FileFamily.archive) return canRunArchive(action, kind);
  return _readable.contains(kind) && _writable.contains(action.outputFor(kind));
}

/// True if [action] can run on [kind] once the platform has decoded it to a PNG. Each platform reads
/// HEIC its own way, and this engine takes it from there.
bool canRunDecoded(RadialAction action, FileKind kind) {
  return kind == FileKind.heic &&
      action.accepts.contains(kind) &&
      _writable.contains(action.outputFor(kind));
}

/// What [file] becomes. A decoded HEIC photo still has its own name, and becomes what a HEIC photo
/// should rather than what its PNG would: compressing one must not make a huge PNG.
FileKind _outputKind(RadialAction action, PortableFile file, FileKind kind) {
  final name = file.name.toLowerCase();
  final decoded = name.endsWith('.heic') || name.endsWith('.heif');
  return action.outputFor(decoded ? FileKind.heic : kind);
}

/// Runs [action] on [files] and returns the results in memory. Only reads its inputs.
///
/// [onProgress] gets 0 to 1. The work yields between steps, so a page can repaint in a
/// browser, where this runs on the main thread.
Future<List<PortableFile>> runPortable(
  RadialAction action,
  List<PortableFile> files, {
  ActionOptions options = const ActionOptions(),
  void Function(double progress)? onProgress,
}) async {
  if (files.length < action.minFiles) {
    throw EngineFailed('"${action.label}" needs at least ${action.minFiles} files.');
  }
  final kinds = [for (final file in files) detectKind(_head(file.bytes), fileName: file.name)];
  for (var i = 0; i < files.length; i++) {
    if (!canRunPortably(action, kinds[i])) {
      throw EngineFailed('"${action.label}" can\'t use ${files[i].name}.');
    }
  }

  if (combinesFiles(action)) {
    final bytes = await _imagesToPdf(files, onProgress);
    return [PortableFile(_outputName(action, files.first.name, FileKind.pdf), bytes)];
  }

  final outputs = <PortableFile>[];
  for (var i = 0; i < files.length; i++) {
    void step(double progress) => onProgress?.call((i + progress) / files.length);
    if (kinds[i].family == FileFamily.archive) {
      outputs.addAll(
        runArchive(
          action,
          files[i],
          kinds[i],
          password: options.password,
          newPassword: options.newPassword,
        ),
      );
      step(1);
      continue;
    }
    final kind = _outputKind(action, files[i], kinds[i]);
    final bytes = kinds[i].family == FileFamily.subtitle
        ? _subtitles(action, files[i], kinds[i], options)
        : await _image(action, files[i], kind, options, step);
    outputs.add(PortableFile(_outputName(action, files[i].name, kind), bytes));
  }
  onProgress?.call(1);
  return outputs;
}

List<int> _head(Uint8List bytes) {
  return bytes.length <= detectHeadBytes ? bytes : Uint8List.sublistView(bytes, 0, detectHeadBytes);
}

/// In memory nothing exists yet to collide with; saving picks the final name.
String _outputName(RadialAction action, String input, FileKind kind) {
  return freeOutputName(
    inputName: input,
    extension: kind.extension,
    suffix: action.suffix,
    exists: (_) => false,
  );
}

// Subtitles

/// The text of a subtitle action. Shared with the desktop runner.
String convertSubtitles(String actionId, String source, FileKind kind, Duration? shift) {
  final cues = parseSubtitles(source);
  if (cues.isEmpty) throw const EngineFailed('This file has no subtitles in it.');
  return switch (actionId) {
    'subtitle-to-srt' => toSrt(cues),
    'subtitle-to-vtt' => toVtt(cues),
    'subtitle-to-text' => toPlainText(cues),
    _ when shift == null => throw const EngineFailed('"Shift timing" needs how far to shift.'),
    _ when kind == FileKind.vtt => toVtt(shiftCues(cues, shift)),
    _ => toSrt(shiftCues(cues, shift)),
  };
}

Uint8List _subtitles(RadialAction action, PortableFile file, FileKind kind, ActionOptions options) {
  final source = utf8.decode(file.bytes, allowMalformed: true);
  return utf8.encode(convertSubtitles(action.id, source, kind, options.shift));
}

// Images

Future<void> _yield() => Future<void>.delayed(Duration.zero);

/// Decodes the first frame, upright and with all metadata gone except the colour profile:
/// EXIF holds GPS, so it never reaches an output.
img.Image _decode(PortableFile file, {required bool keepsAnimationFormat}) {
  final unreadable = EngineFailed('${file.name} could not be read as a picture.');
  final decoder = img.findDecoderForData(file.bytes);
  if (decoder == null) throw unreadable;
  final img.DecodeInfo? info;
  try {
    info = decoder.startDecode(file.bytes);
  } catch (_) {
    throw unreadable;
  }
  if (info == null) throw unreadable;
  if (info.width * info.height > maxPortablePixels) {
    throw EngineFailed('${file.name} is too large to open here.');
  }
  if (keepsAnimationFormat && info.numFrames > 1) {
    throw EngineFailed('Animated pictures can\'t be changed here yet: ${file.name}.');
  }

  final img.Image? decoded;
  try {
    decoded = img.decodeImage(file.bytes, frame: 0);
  } catch (_) {
    // A very large picture usually fails because the device ran out of memory.
    if (info.width * info.height > 50 * 1000 * 1000) {
      throw EngineFailed('${file.name} is too large to open on this device.');
    }
    throw unreadable;
  }
  if (decoded == null) throw unreadable;

  final upright = img.bakeOrientation(decoded);
  final plain = upright.format == img.Format.uint8 && !upright.hasPalette
      ? upright
      : upright.convert(
          format: img.Format.uint8,
          numChannels: upright.hasAlpha ? 4 : 3,
          noAnimation: true,
        );
  return plain
    ..exif = img.ExifData()
    ..textData = null;
}

/// JPEG has no transparency. Without this, transparent areas would turn black.
img.Image _onWhite(img.Image image) {
  if (!image.hasAlpha) return image;
  final page = img.Image(width: image.width, height: image.height, numChannels: 3)
    ..iccProfile = image.iccProfile;
  img.fill(page, color: img.ColorRgb8(255, 255, 255));
  return img.compositeImage(page, image);
}

Uint8List _encode(img.Image image, FileKind kind, {int? quality, bool reduceColours = false}) {
  return switch (kind) {
    FileKind.jpg => img.encodeJpg(_onWhite(image), quality: quality ?? 85),
    FileKind.webp => img.encodeWebP(
      image,
      lossless: false,
      quality: quality ?? 80,
      singleFrame: true,
    ),
    FileKind.gif => img.encodeGif(image, singleFrame: true),
    FileKind.tiff => img.encodeTiff(image, singleFrame: true),
    FileKind.ico => img.encodeIco(_longSide(image, 256), singleFrame: true),
    _ => img.encodePng(reduceColours ? img.quantize(image) : image, singleFrame: true),
  };
}

/// Shrinks so the longest side is at most [side]; never enlarges.
img.Image _longSide(img.Image image, int side) {
  final longest = image.width > image.height ? image.width : image.height;
  if (longest <= side) return image;
  return image.width >= image.height
      ? img.copyResize(image, width: side, interpolation: img.Interpolation.average)
      : img.copyResize(image, height: side, interpolation: img.Interpolation.average);
}

/// Crops the middle to the target's shape, then scales to exactly its size.
img.Image _coverExactly(img.Image image, int width, int height) {
  final target = width / height;
  var cropWidth = image.width;
  var cropHeight = image.height;
  if (image.width / image.height > target) {
    cropWidth = (image.height * target).round();
  } else {
    cropHeight = (image.width / target).round();
  }
  final cropped = img.copyCrop(
    image,
    x: (image.width - cropWidth) ~/ 2,
    y: (image.height - cropHeight) ~/ 2,
    width: cropWidth,
    height: cropHeight,
  );
  return img.copyResize(
    cropped,
    width: width,
    height: height,
    interpolation: img.Interpolation.cubic,
  );
}

Future<Uint8List> _image(
  RadialAction action,
  PortableFile file,
  FileKind output,
  ActionOptions options,
  void Function(double) step,
) async {
  if (output == FileKind.pdf) return _imagesToPdf([file], step);

  step(0.05);
  await _yield();
  final keepsAnimation = output == FileKind.gif || output == FileKind.webp;
  final image = _decode(file, keepsAnimationFormat: keepsAnimation);
  step(0.4);
  await _yield();

  if (action.maxBytes != null) return _underSize(action, image, output, step);

  switch (action.id) {
    case 'fit-whatsapp-photo':
      return _encode(_longSide(image, 1600), output, quality: 80);
    case 'fit-web':
      return _encode(_longSide(image, 1920), output, quality: 80);
    case 'fit-instagram':
      return _encode(_coverExactly(image, 1080, 1350), output, quality: 85);
    case 'image-resize':
      final longest = image.width > image.height ? image.width : image.height;
      final side = options.longSide ?? (longest / 2).ceil();
      return _encode(_longSide(image, side), output);
    case 'image-compress':
      return _encode(image, output, quality: 70, reduceColours: true);
    case 'image-rotate':
      final degrees = options.degrees ?? 90;
      if (degrees != 90 && degrees != 180 && degrees != 270) {
        throw EngineFailed('Pictures rotate by 90, 180 or 270, not $degrees.');
      }
      return _encode(img.copyRotate(image, angle: degrees), output);
    case 'image-flip':
      final direction = options.flipVertical
          ? img.FlipDirection.vertical
          : img.FlipDirection.horizontal;
      return _encode(img.copyFlip(image, direction: direction), output);
    case 'image-crop':
      final crop = options.crop;
      if (crop == null) throw const EngineFailed('"Crop" needs a crop area.');
      return _encode(_cropped(image, crop), output);
    case 'image-form':
      return _forForm(image, options, step);
  }
  return _encode(image, output);
}

img.Image _cropped(img.Image image, ({int left, int top, int width, int height}) crop) {
  final fits =
      crop.left >= 0 &&
      crop.top >= 0 &&
      crop.width > 0 &&
      crop.height > 0 &&
      crop.left + crop.width <= image.width &&
      crop.top + crop.height <= image.height;
  if (!fits) throw const EngineFailed('That edit does not fit this picture.');
  return img.copyCrop(image, x: crop.left, y: crop.top, width: crop.width, height: crop.height);
}

/// Without a pixel size a form takes any, and a phone photo has far more than one needs.
const _formLongestSide = 1200;

/// A JPEG the size a form asks for. It only crops and scales: forms may reject retouched photos.
Future<Uint8List> _forForm(
  img.Image source,
  ActionOptions options,
  void Function(double) step,
) async {
  final form = options.form;
  if (form == null) throw const EngineFailed('"Form photo" needs to know what the form wants.');
  final width = form.width;
  final height = form.height;
  if ((width == null) != (height == null)) {
    throw const EngineFailed('Give both a width and a height, or neither.');
  }
  final minBytes = form.minBytes ?? 0;
  final maxBytes = form.maxBytes;
  if (maxBytes != null && minBytes > maxBytes) {
    throw const EngineFailed('The smallest size allowed is more than the largest.');
  }

  final crop = options.crop;
  final framed = crop == null ? source : _cropped(source, crop);
  final exact = width != null && height != null;
  final image = exact ? _coverExactly(framed, width, height) : _longSide(framed, _formLongestSide);
  await _yield();

  final Uint8List best;
  if (maxBytes == null) {
    best = _encode(image, FileKind.jpg, quality: 90);
  } else if (exact) {
    best = await _highestQualityUnder(image, maxBytes, step);
  } else {
    best = await _underBytes(image, FileKind.jpg, maxBytes, 'that size', step);
  }
  return _paddedTo(best, minBytes);
}

/// The sharpest JPEG under [maxBytes], keeping the picture's size, since the form set it.
Future<Uint8List> _highestQualityUnder(
  img.Image image,
  int maxBytes,
  void Function(double) step,
) async {
  var low = 10;
  var high = 100;
  Uint8List? fitting;
  var tries = 0;
  while (low <= high) {
    await _yield();
    tries++;
    step(0.4 + 0.55 * (1 - 1 / (tries + 1)));
    final quality = (low + high) ~/ 2;
    final bytes = _encode(image, FileKind.jpg, quality: quality);
    if (bytes.length <= maxBytes) {
      fitting = bytes;
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }
  if (fitting == null) {
    throw EngineFailed(
      'This picture has too much detail to fit ${maxBytes ~/ 1000} KB at '
      '${image.width} x ${image.height}.',
    );
  }
  return fitting;
}

/// Forms refuse files that are too small, and a plain signature can be small at any quality. A
/// JPEG may carry comments that nothing draws, so empty ones bring it up to [minBytes].
Uint8List _paddedTo(Uint8List jpeg, int minBytes) {
  var missing = minBytes - jpeg.length;
  if (missing <= 0) return jpeg;
  // Comments go after the JFIF header, which some readers insist comes first.
  var at = 2;
  if (jpeg.length > 5 && jpeg[2] == 0xFF && jpeg[3] == 0xE0) {
    at = 4 + (jpeg[4] << 8 | jpeg[5]);
  }
  final out = BytesBuilder(copy: false)..add(Uint8List.sublistView(jpeg, 0, at));
  while (missing > 0) {
    // A segment's length counts itself, and it costs two more bytes for its marker.
    const most = 65535;
    final total = (missing + 2).clamp(4, most + 2);
    final length = total - 2;
    out
      ..add([0xFF, 0xFE, length >> 8, length & 0xFF])
      ..add(Uint8List(length - 2));
    missing -= total;
  }
  out.add(Uint8List.sublistView(jpeg, at));
  return out.takeBytes();
}

Future<Uint8List> _underSize(
  RadialAction action,
  img.Image image,
  FileKind output,
  void Function(double) step,
) {
  return _underBytes(image, output, action.maxBytes!, '"${action.label}"', step);
}

Future<Uint8List> _underBytes(
  img.Image image,
  FileKind output,
  int maxBytes,
  String target,
  void Function(double) step,
) async {
  final hasQuality = output == FileKind.jpg || output == FileKind.webp;
  final longest = image.width > image.height ? image.width : image.height;
  Uint8List? fitting;
  var tries = 0;

  final best = await searchUnderSize(
    maxBytes: maxBytes,
    // Without a quality setting, only shrinking changes the size.
    minQuality: hasQuality ? 40 : 85,
    maxQuality: hasQuality ? 95 : 85,
    encode: (quality, scale) async {
      await _yield();
      tries++;
      step(0.4 + 0.55 * (1 - 1 / (tries + 1)));
      final side = (longest * scale).round().clamp(1, longest);
      final bytes = _encode(_longSide(image, side), output, quality: quality);
      // The search only moves on to better settings after a fit, so the last fit is the best.
      if (bytes.length <= maxBytes) fitting = bytes;
      return bytes.length;
    },
  );
  final result = fitting;
  if (best == null || result == null) {
    throw EngineFailed('This picture could not be made small enough for $target.');
  }
  return result;
}

Future<Uint8List> _imagesToPdf(List<PortableFile> files, void Function(double)? onProgress) async {
  final pages = <Uint8List>[];
  for (var i = 0; i < files.length; i++) {
    await _yield();
    pages.add(_encode(_decode(files[i], keepsAnimationFormat: false), FileKind.jpg, quality: 90));
    onProgress?.call((i + 1) / files.length);
  }
  return buildImagePdf(pages);
}
