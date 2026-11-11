import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:archive/archive.dart';
import 'package:flutter/foundation.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';

/// What a preview can say about a file besides its picture, for the line under it.
@immutable
class PreviewFacts {
  const PreviewFacts({this.bytes, this.width, this.height, this.pages, this.seconds});

  final int? bytes;
  final int? width;
  final int? height;
  final int? pages;
  final double? seconds;
}

/// A small look at a file's first page: a picture, or a few lines of text, or only its facts.
@immutable
class Preview {
  const Preview({
    this.picture,
    this.lines = const [],
    this.facts = const PreviewFacts(),
    this.locked = false,
    this.failed = false,
  });

  /// Nothing could be shown, and nothing more is said than that.
  const Preview.failed() : this(failed: true);

  /// A PNG, at most as wide as was asked.
  final Uint8List? picture;

  /// For subtitles, the names in an archive, or the text of a document.
  final List<String> lines;
  final PreviewFacts facts;

  /// A locked PDF, which shows a lock until its password is given.
  final bool locked;
  final bool failed;
}

/// A file to preview: one picked, or a result.
class PreviewSubject {
  const PreviewSubject({required this.file, required this.kind, this.password});

  /// A result, read from memory or from where it was saved. Null if it can't be reached, as a
  /// browser's video kept in its private storage.
  static PreviewSubject? ofResult(ConvertedFile output) {
    final inMemory = output.inMemory;
    final path = output.savedPath ?? output.cachedPath;
    if (inMemory != null) {
      final bytes = inMemory.bytes;
      return PreviewSubject(
        file: PickedFile(
          name: output.name,
          size: bytes.length,
          head: bytes.length <= detectHeadBytes ? bytes : bytes.sublist(0, detectHeadBytes),
          read: () async => bytes,
        ),
        kind: detectKind(bytes, fileName: output.name),
      );
    }
    if (path == null || kIsWeb) return null;
    // Only video and sound are kept outside memory, and their engines read them by path.
    return PreviewSubject(
      file: PickedFile(
        name: output.name,
        size: output.size,
        head: const [],
        read: () async => throw UnsupportedError('Read by path'),
        path: path,
      ),
      kind: kindFromName(output.name),
    );
  }

  final PickedFile file;
  final FileKind kind;

  /// What opened a locked PDF during a job. Used once, to draw it, and never kept.
  final String? password;
}

/// The kind a file's name says, for results whose bytes aren't at hand.
FileKind kindFromName(String name) {
  final extension = splitFileName(name).extension.toLowerCase();
  if (extension.isEmpty) return FileKind.unknown;
  for (final kind in FileKind.values) {
    if (kind.extension == extension) return kind;
  }
  return FileKind.unknown;
}

typedef PictureReader = Future<Uint8List> Function(PickedFile file, FileKind kind);
typedef FrameAt = Future<Uint8List> Function(PickedFile file, double seconds);
typedef Probe = Future<MediaInfo> Function(PickedFile file);
typedef PdfPageReader = Future<({Uint8List png, int pages})> Function(
  Uint8List bytes,
  String name, {
  int width,
  String? password,
});

/// Makes previews from the engines the app already has, on every platform. Anything that goes
/// wrong is a [Preview.failed], never an error, as a preview must never get in the way.
class Previewer {
  Previewer({
    required this.readPicture,
    required this.frameAt,
    required this.probe,
    required this.pdfPage,
    this.namesInside,
  });

  /// A picture's bytes in a form Flutter can draw: HEIC and TIFF come decoded.
  final PictureReader readPicture;
  final FrameAt frameAt;
  final Probe probe;
  final PdfPageReader pdfPage;

  /// The names in a 7z or RAR, known once a job has unpacked it. They can't be listed without
  /// unpacking, which is too much work for a preview.
  final List<String>? Function(PickedFile file)? namesInside;

  /// How many lines of text a preview shows.
  static const textLines = 4;

  Future<Preview> make(PreviewSubject subject, {int width = 600}) async {
    final file = subject.file;
    final kind = subject.kind;
    try {
      return switch (kind.family) {
        FileFamily.image => await _picture(file, kind, width),
        FileFamily.pdf => await _pdf(file, width, subject.password),
        FileFamily.video => await _video(file, width),
        FileFamily.audio => Preview(
          facts: PreviewFacts(bytes: file.size, seconds: (await probe(file)).seconds),
        ),
        FileFamily.subtitle => Preview(
          lines: subtitleLines(await file.read()),
          facts: PreviewFacts(bytes: file.size),
        ),
        FileFamily.archive when kind == FileKind.sevenZip || kind == FileKind.rar => Preview(
          lines: namesInside?.call(file) ?? const [],
          facts: PreviewFacts(bytes: file.size),
        ),
        FileFamily.archive => Preview(
          lines: archiveNames(await file.read(), kind),
          facts: PreviewFacts(bytes: file.size),
        ),
        FileFamily.document => Preview(
          lines: documentLines(await file.read()),
          facts: PreviewFacts(bytes: file.size),
        ),
        _ => const Preview.failed(),
      };
    } on PasswordNeeded {
      return Preview(locked: true, facts: PreviewFacts(bytes: file.size));
    } catch (error) {
      debugPrint('No preview of ${file.name}: $error');
      return const Preview.failed();
    }
  }

  Future<Preview> _picture(PickedFile file, FileKind kind, int width) async {
    final shrunk = await shrinkPicture(await readPicture(file, kind), width);
    return Preview(
      picture: shrunk.png,
      facts: PreviewFacts(bytes: file.size, width: shrunk.width, height: shrunk.height),
    );
  }

  Future<Preview> _pdf(PickedFile file, int width, String? password) async {
    final page = await pdfPage(await file.read(), file.name, width: width, password: password);
    return Preview(
      picture: page.png,
      facts: PreviewFacts(bytes: file.size, pages: page.pages),
    );
  }

  Future<Preview> _video(PickedFile file, int width) async {
    final info = await probe(file);
    // A second in, past a fade from black, unless the clip is shorter than that.
    final at = math.min(1.0, info.seconds / 2);
    final shrunk = await shrinkPicture(await frameAt(file, at), width);
    return Preview(
      picture: shrunk.png,
      facts: PreviewFacts(
        bytes: file.size,
        seconds: info.seconds,
        width: info.width,
        height: info.height,
      ),
    );
  }
}

/// [encoded] as a PNG at most [width] wide, with the full picture's size. The size comes from the
/// file's header, and Flutter decodes straight to the smaller size, so a 200-megapixel photo never
/// sits whole in memory. The same on every platform: a browser can't say a size before decoding.
Future<({Uint8List png, int width, int height})> shrinkPicture(Uint8List encoded, int width) async {
  final header = img.findDecoderForData(encoded)?.startDecode(encoded);
  final fullWidth = header?.width;
  final codec = await ui.instantiateImageCodec(
    encoded,
    targetWidth: fullWidth == null || fullWidth > width ? width : null,
    allowUpscaling: false,
  );
  try {
    final frame = await codec.getNextFrame();
    try {
      final picture = frame.image;
      final data = await picture.toByteData(format: ui.ImageByteFormat.png);
      if (data == null) throw StateError('No picture');
      return (
        png: data.buffer.asUint8List(),
        width: fullWidth ?? picture.width,
        height: header?.height ?? picture.height,
      );
    } finally {
      frame.image.dispose();
    }
  } finally {
    codec.dispose();
  }
}

/// The first lines spoken in a subtitle file, without numbers, timings or styling.
List<String> subtitleLines(Uint8List bytes) {
  final text = utf8.decode(bytes, allowMalformed: true);
  final lines = <String>[];
  for (final raw in const LineSplitter().convert(text)) {
    final line = raw.replaceAll(RegExp(r'<[^>]*>|\{[^}]*\}'), '').trim();
    if (line.isEmpty || line.startsWith('WEBVTT') || line.contains('-->')) continue;
    if (RegExp(r'^\d+$').hasMatch(line)) continue;
    if (line.startsWith('NOTE') || line.startsWith('STYLE')) continue;
    lines.add(line);
    if (lines.length == Previewer.textLines) break;
  }
  return lines;
}

/// The first names in an archive, where it can be listed without unpacking it.
List<String> archiveNames(Uint8List bytes, FileKind kind) {
  final Archive archive;
  switch (kind) {
    case FileKind.zip:
      archive = ZipDecoder().decodeBytes(bytes);
    case FileKind.tar:
      archive = TarDecoder().decodeBytes(bytes);
    case FileKind.tarGz:
      archive = TarDecoder().decodeBytes(GZipDecoder().decodeBytes(bytes));
    default:
      return const [];
  }
  return [
    for (final entry in archive.files)
      if (entry.isFile) entry.name,
  ].take(Previewer.textLines + 1).toList();
}

/// The first paragraphs of a Word document's text.
List<String> documentLines(Uint8List bytes) {
  final body = ZipDecoder().decodeBytes(bytes).findFile('word/document.xml');
  if (body == null) return const [];
  final xml = utf8.decode(body.content, allowMalformed: true);
  final lines = <String>[];
  for (final paragraph in xml.split('</w:p>')) {
    final text = RegExp(r'<w:t(?:\s[^>]*)?>([^<]*)</w:t>')
        .allMatches(paragraph)
        .map((match) => match.group(1)!)
        .join()
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'")
        .replaceAll('&amp;', '&')
        .trim();
    if (text.isEmpty) continue;
    lines.add(text);
    if (lines.length == Previewer.textLines) break;
  }
  return lines;
}

/// Previews made one at a time and remembered for as long as the screen shows the same files.
class PreviewCache {
  PreviewCache(this.previewer);

  final Previewer previewer;
  final _made = <(Object, int), Future<Preview>>{};
  Future<void> _queue = Future.value();

  /// The preview of [subject], made once. [key] names it, as the same file comes back as a new
  /// object each time it is wrapped.
  Future<Preview> of(Object key, PreviewSubject subject, {int width = 600}) {
    return _made.putIfAbsent((key, width), () {
      final made = _queue.then((_) => previewer.make(subject, width: width));
      // The next waits for this one, whether or not it worked.
      _queue = made.then((_) {}, onError: (_) {});
      return made;
    });
  }

  /// Forgets [key]'s previews at every size, so the next ask makes them again, as when a job has
  /// learnt something new about the file.
  void forget(Object key) => _made.removeWhere((made, _) => made.$1 == key);

  void clear() => _made.clear();
}
