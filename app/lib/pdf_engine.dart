import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:image/image.dart' as img;
import 'package:pdfrx/pdfrx.dart';
import 'package:radial_core/radial_core.dart';

const _pdfActions = {
  'pdf-to-jpg',
  'pdf-to-png',
  'pdf-merge',
  'pdf-split',
  'pdf-rotate',
  'pdf-compress',
  'fit-email-pdf',
  'fit-pdf-100kb',
  'fit-pdf-500kb',
  'fit-pdf-1mb',
};

/// True if [action] can run on [kind] here. PDFium does this on every platform.
bool canRunPdf(RadialAction action, FileKind kind) {
  return kind == FileKind.pdf && _pdfActions.contains(action.id);
}

/// A result, and anything the user should know about it.
class PdfResult {
  const PdfResult(this.file, {this.note});

  final PortableFile file;
  final String? note;
}

/// Pages become pictures to shrink a PDF, which is the only way to shrink a scan.
const _picturesNote = 'Pages are now pictures, so text can\'t be selected.';

/// Pixels per inch for pages saved as pictures.
const _pictureDpi = 150.0;

/// Tried in turn to fit a size limit: sharpest first.
///
/// The last is about the limit of what can still be read, so it stops there rather than make a
/// file that fits but is useless.
const _shrinkSteps = [(150.0, 70), (120.0, 55), (96.0, 45), (72.0, 35)];

/// A few pages are tried first, because drawing every page for each step takes minutes.
const _samplePages = 3;

int _sourceCounter = 0;

/// Each document needs its own name, or PDFium may mix them up.
String _sourceName(String name) => 'radial-${_sourceCounter++}-$name';

Future<PdfDocument> _open(PortableFile file) async {
  try {
    return await PdfDocument.openData(file.bytes, sourceName: _sourceName(file.name));
  } on PdfPasswordException {
    throw EngineFailed('${file.name} has a password, so it can\'t be opened yet.');
  } catch (_) {
    throw EngineFailed('${file.name} could not be read. It may be damaged.');
  }
}

/// Runs a PDF action on [files] in memory. Their bytes are only read.
Future<List<PdfResult>> convertPdf(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress, {
  ActionOptions options = const ActionOptions(),
}) async {
  if (files.length < action.minFiles) {
    throw EngineFailed('"${action.label}" needs at least ${action.minFiles} files.');
  }
  await pdfrxFlutterInitialize();
  if (action.id == 'pdf-merge') return [await _merge(action, files)];

  final results = <PdfResult>[];
  for (var i = 0; i < files.length; i++) {
    void step(double progress) => onProgress((i + progress) / files.length);
    final document = await _open(files[i]);
    try {
      results.add(await _one(action, files[i], document, step, options));
    } finally {
      await document.dispose();
    }
  }
  onProgress(1);
  return results;
}

String _name(RadialAction action, String input, String extension) {
  return freeOutputName(
    inputName: input,
    extension: extension,
    suffix: action.suffix,
    exists: (_) => false,
  );
}

Future<PdfResult> _one(
  RadialAction action,
  PortableFile file,
  PdfDocument document,
  void Function(double) step,
  ActionOptions options,
) async {
  switch (action.id) {
    case 'pdf-to-jpg':
      return _toPictures(action, file, document, step, jpeg: true);
    case 'pdf-to-png':
      return _toPictures(action, file, document, step, jpeg: false);
    case 'pdf-split':
      return _split(action, file, document, step);
    case 'pdf-rotate':
      final degrees = options.degrees ?? 90;
      final PdfPageRotation by = switch (degrees) {
        90 => PdfPageRotation.clockwise90,
        180 => PdfPageRotation.clockwise180,
        270 => PdfPageRotation.clockwise270,
        _ => throw EngineFailed('PDFs rotate by 90, 180 or 270, not $degrees.'),
      };
      document.pages = [for (final page in document.pages) page.rotatedBy(by)];
      final bytes = await document.encodePdf();
      return PdfResult(PortableFile(_name(action, file.name, 'pdf'), bytes));
    case 'pdf-compress':
      return _compress(action, file, document, step);
  }
  return _fit(action, file, document, step);
}

/// Uses the sharpest step that a few sample pages suggest will really help. Pages that are mostly
/// text are small already, and pictures of them can come out larger, so that takes a lower step.
Future<PdfResult> _compress(
  RadialAction action,
  PortableFile file,
  PdfDocument document,
  void Function(double) step,
) async {
  final original = file.bytes.length;
  for (final (dpi, quality) in _shrinkSteps) {
    // Only worth losing selectable text for a real saving.
    if (await _estimateBytes(document, dpi, quality) > original * 0.9) continue;
    final bytes = await _asPictures(file, document, dpi, quality, step);
    if (bytes.length < original) {
      return PdfResult(PortableFile(_name(action, file.name, 'pdf'), bytes), note: _picturesNote);
    }
  }
  throw const EngineFailed('This PDF is already as small as it can usefully get.');
}

/// Keeps the PDF as it is if it already fits. Otherwise shrinks it, going straight to the first
/// step that a few sample pages suggest will fit, and says so at once if none will.
Future<PdfResult> _fit(
  RadialAction action,
  PortableFile file,
  PdfDocument document,
  void Function(double) step,
) async {
  final limit = action.maxBytes!;
  final name = _name(action, file.name, 'pdf');
  final same = await document.encodePdf();
  if (same.length <= limit) return PdfResult(PortableFile(name, same));

  final total = document.pages.length;
  for (final (dpi, quality) in _shrinkSteps) {
    final estimate = await _estimateBytes(document, dpi, quality);
    // Sample pages are only a guide, so a near miss is still worth trying.
    if (estimate > limit * 1.15) continue;
    final bytes = await _asPictures(file, document, dpi, quality, step);
    if (bytes.length <= limit) return PdfResult(PortableFile(name, bytes), note: _picturesNote);
  }
  throw EngineFailed(
    '${total == 1 ? 'This page has' : 'These $total pages have'} too much in them to fit '
    '"${action.label}" and still be readable. Try a larger limit, or Compress.',
  );
}

/// Roughly how big the whole PDF would be, from pages spread through it.
Future<int> _estimateBytes(PdfDocument document, double dpi, int quality) async {
  final total = document.pages.length;
  final count = total < _samplePages ? total : _samplePages;
  var bytes = 0;
  for (var i = 0; i < count; i++) {
    final picture = await _draw(document.pages[i * total ~/ count], dpi);
    if (picture == null) continue;
    await _breathe();
    bytes += img.encodeJpg(picture, quality: quality).length;
  }
  return count == 0 ? 0 : bytes * total ~/ count;
}

/// Draws one page at [dpi], on white. Null if PDFium could not draw it.
Future<img.Image?> _draw(PdfPage page, double dpi) async {
  final scale = dpi / 72;
  final width = (page.width * scale).ceil();
  final height = (page.height * scale).ceil();
  final drawn = await page.render(
    width: width,
    height: height,
    fullWidth: width.toDouble(),
    fullHeight: height.toDouble(),
    backgroundColor: 0xFFFFFFFF,
  );
  if (drawn == null) return null;
  try {
    return img.Image.fromBytes(
      width: drawn.width,
      height: drawn.height,
      bytes: drawn.pixels.buffer,
      bytesOffset: drawn.pixels.offsetInBytes,
      numChannels: 4,
      order: img.ChannelOrder.bgra,
    ).convert(numChannels: 3);
  } finally {
    drawn.dispose();
  }
}

Future<void> _breathe() => Future<void>.delayed(Duration.zero);

Future<Uint8List> _asPictures(
  PortableFile file,
  PdfDocument document,
  double dpi,
  int quality,
  void Function(double) step,
) async {
  final pages = <PdfDocument>[];
  try {
    final total = document.pages.length;
    for (var i = 0; i < total; i++) {
      final page = document.pages[i];
      final picture = await _draw(page, dpi);
      if (picture == null) throw EngineFailed('Page ${i + 1} of ${file.name} could not be drawn.');
      await _breathe();
      pages.add(
        await PdfDocument.createFromJpegData(
          img.encodeJpg(picture, quality: quality),
          width: page.width,
          height: page.height,
          sourceName: _sourceName('page'),
        ),
      );
      step((i + 1) / total);
    }
    if (pages.isEmpty) throw EngineFailed('${file.name} has no pages.');
    final result = await PdfDocument.createNew(sourceName: _sourceName('shrunk'));
    try {
      result.pages = [for (final page in pages) page.pages.first];
      return await result.encodePdf();
    } finally {
      await result.dispose();
    }
  } finally {
    for (final page in pages) {
      await page.dispose();
    }
  }
}

Future<PdfResult> _toPictures(
  RadialAction action,
  PortableFile file,
  PdfDocument document,
  void Function(double) step, {
  required bool jpeg,
}) async {
  final extension = jpeg ? 'jpg' : 'png';
  final stem = splitFileName(file.name).stem;
  final total = document.pages.length;
  if (total == 0) throw EngineFailed('${file.name} has no pages.');
  final pictures = <String, Uint8List>{};
  for (var i = 0; i < total; i++) {
    final picture = await _draw(document.pages[i], _pictureDpi);
    if (picture == null) throw EngineFailed('Page ${i + 1} of ${file.name} could not be drawn.');
    await _breathe();
    pictures['$stem page ${i + 1}.$extension'] = jpeg
        ? img.encodeJpg(picture, quality: 90)
        : img.encodePng(picture);
    step((i + 1) / total);
  }
  if (total == 1) {
    return PdfResult(PortableFile(_name(action, file.name, extension), pictures.values.single));
  }
  return PdfResult(PortableFile(_name(action, file.name, 'zip'), _zip(pictures)));
}

Future<PdfResult> _split(
  RadialAction action,
  PortableFile file,
  PdfDocument document,
  void Function(double) step,
) async {
  final total = document.pages.length;
  if (total < 2) {
    throw EngineFailed('${file.name} has only one page, so there is nothing to split.');
  }
  final stem = splitFileName(file.name).stem;
  final pages = <String, Uint8List>{};
  for (var i = 0; i < total; i++) {
    final single = await PdfDocument.createNew(sourceName: _sourceName('split'));
    try {
      single.pages = [document.pages[i]];
      pages['$stem page ${i + 1}.pdf'] = await single.encodePdf();
    } finally {
      await single.dispose();
    }
    step((i + 1) / total);
  }
  return PdfResult(PortableFile(_name(action, file.name, 'zip'), _zip(pages)));
}

Future<PdfResult> _merge(RadialAction action, List<PortableFile> files) async {
  final sources = <PdfDocument>[];
  try {
    for (final file in files) {
      sources.add(await _open(file));
    }
    final merged = await PdfDocument.createNew(sourceName: _sourceName('merged'));
    try {
      merged.pages = [for (final source in sources) ...source.pages];
      final bytes = await merged.encodePdf();
      return PdfResult(PortableFile(_name(action, files.first.name, 'pdf'), bytes));
    } finally {
      await merged.dispose();
    }
  } finally {
    for (final source in sources) {
      await source.dispose();
    }
  }
}

/// Pictures and PDFs are compressed already, so the files are stored as they are.
Uint8List _zip(Map<String, Uint8List> files) {
  final archive = Archive();
  files.forEach((name, bytes) {
    archive.addFile(ArchiveFile.bytes(name, bytes)..compression = CompressionType.none);
  });
  return Uint8List.fromList(ZipEncoder().encodeBytes(archive));
}
