import 'file_kind.dart';

/// Which radial menu an action lives in: Shift = convert and fit, Shift + Alt = tools.
enum ActionMode { convert, tools }

/// The program that does the work.
enum Engine { vips, ffmpeg, qpdf, pdfium, libarchive, document, builtIn }

class RadialAction {
  const RadialAction({
    required this.id,
    required this.label,
    required this.mode,
    required this.engine,
    required this.accepts,
    required this.suffix,
    this.output,
    this.minFiles = 1,
    this.maxBytes,
  });

  final String id;

  /// English text. Translations live in the app's ARB files, keyed by [id].
  final String label;
  final ActionMode mode;
  final Engine engine;
  final Set<FileKind> accepts;

  /// The word in brackets in the output name: `photo (whatsapp).jpg`.
  final String suffix;

  /// The output format. Null keeps the input's format where possible; see [outputFor].
  final FileKind? output;

  /// Merges need at least two files.
  final int minFiles;

  /// The size limit for "under X" actions.
  final int? maxBytes;

  /// True if changing the format is all this action does. Only these do nothing when the file
  /// is already in that format: WhatsApp on a JPG still resizes it.
  bool get isFormatChange => suffix == 'converted';

  /// The format this action writes for [input].
  ///
  /// Keeps the input's format unless the engines can only read it: we ship no HEIC
  /// encoder (x265 is GPL), and SVG, BMP and ICO are not worth writing back after an edit.
  FileKind outputFor(FileKind input) {
    if (output != null) return output!;
    return switch (input) {
      FileKind.heic => FileKind.jpg,
      FileKind.svg || FileKind.bmp || FileKind.ico => FileKind.png,
      _ => input,
    };
  }
}

/// What the menu shows for these files: only the actions every file shares, without
/// conversions that would change nothing and merges that need more files.
List<RadialAction> actionsFor(Iterable<FileKind> kinds, ActionMode mode) {
  final files = kinds.toList();
  if (files.isEmpty) return const [];
  return [
    for (final action in actionCatalogue)
      if (action.mode == mode &&
          files.length >= action.minFiles &&
          files.every(action.accepts.contains) &&
          !(action.isFormatChange && files.every((kind) => kind == action.output)))
        action,
  ];
}

/// Whether [action] makes one result from all its files, rather than one from each.
bool combinesFiles(RadialAction action) => action.minFiles > 1 || action.id == 'images-to-pdf';

/// The action with this id, or null.
RadialAction? actionById(String id) {
  for (final action in actionCatalogue) {
    if (action.id == id) return action;
  }
  return null;
}

final Set<FileKind> _images = FileKind.ofFamily(FileFamily.image);
final Set<FileKind> _videos = FileKind.ofFamily(FileFamily.video);
final Set<FileKind> _audio = FileKind.ofFamily(FileFamily.audio);
final Set<FileKind> _documents = FileKind.ofFamily(FileFamily.document);
final Set<FileKind> _subtitles = FileKind.ofFamily(FileFamily.subtitle);
final Set<FileKind> _archives = {...FileKind.ofFamily(FileFamily.archive)}..remove(FileKind.tarGz);
const Set<FileKind> _pdf = {FileKind.pdf};
const Set<FileKind> _markup = {FileKind.markdown, FileKind.html, FileKind.docx};

const int _kb = 1024;
const int _mb = 1024 * 1024;

RadialAction _convert(
  String id,
  String label,
  Engine engine,
  Set<FileKind> accepts,
  FileKind output,
) => RadialAction(
  id: id,
  label: label,
  mode: ActionMode.convert,
  engine: engine,
  accepts: accepts,
  suffix: 'converted',
  output: output,
);

RadialAction _fit(
  String id,
  String label,
  Engine engine,
  Set<FileKind> accepts,
  String suffix, {
  FileKind? output,
  int? maxBytes,
}) => RadialAction(
  id: id,
  label: label,
  mode: ActionMode.convert,
  engine: engine,
  accepts: accepts,
  suffix: suffix,
  output: output,
  maxBytes: maxBytes,
);

RadialAction _tool(
  String id,
  String label,
  Engine engine,
  Set<FileKind> accepts,
  String suffix, {
  FileKind? output,
  int minFiles = 1,
}) => RadialAction(
  id: id,
  label: label,
  mode: ActionMode.tools,
  engine: engine,
  accepts: accepts,
  suffix: suffix,
  output: output,
  minFiles: minFiles,
);

/// Every 1.0 action, from the plan's "Supported conversions" and "Make-it-fit" tables.
final List<RadialAction> actionCatalogue = List.unmodifiable([
  // Images: convert
  _convert('image-to-jpg', 'JPG', Engine.vips, _images, FileKind.jpg),
  _convert('image-to-png', 'PNG', Engine.vips, _images, FileKind.png),
  _convert('image-to-webp', 'WebP', Engine.vips, _images, FileKind.webp),
  _convert('image-to-avif', 'AVIF', Engine.vips, _images, FileKind.avif),
  _convert('image-to-gif', 'GIF', Engine.vips, _images, FileKind.gif),
  _convert('image-to-tiff', 'TIFF', Engine.vips, _images, FileKind.tiff),
  _convert('image-to-ico', 'ICO', Engine.ffmpeg, _images, FileKind.ico),
  _convert('image-to-pdf', 'PDF', Engine.vips, _images, FileKind.pdf),

  // Make it fit
  _fit('fit-whatsapp-photo', 'WhatsApp', Engine.vips, _images, 'whatsapp', output: FileKind.jpg),
  _fit('fit-whatsapp-video', 'WhatsApp', Engine.ffmpeg, _videos, 'whatsapp', output: FileKind.mp4),
  _fit('fit-email-image', 'Email', Engine.vips, _images, 'email', maxBytes: 20 * _mb),
  _fit('fit-email-pdf', 'Email', Engine.qpdf, _pdf, 'email', maxBytes: 20 * _mb),
  _fit('fit-email-video', 'Email', Engine.ffmpeg, _videos, 'email', maxBytes: 20 * _mb),
  _fit('fit-instagram', 'Instagram', Engine.vips, _images, 'instagram', output: FileKind.jpg),
  _fit('fit-web', 'Web-ready', Engine.vips, _images, 'web', output: FileKind.webp),
  _fit(
    'fit-image-100kb',
    'Under 100 KB',
    Engine.vips,
    _images,
    'under 100 KB',
    maxBytes: 100 * _kb,
  ),
  _fit(
    'fit-image-500kb',
    'Under 500 KB',
    Engine.vips,
    _images,
    'under 500 KB',
    maxBytes: 500 * _kb,
  ),
  _fit('fit-image-1mb', 'Under 1 MB', Engine.vips, _images, 'under 1 MB', maxBytes: _mb),
  _fit('fit-pdf-100kb', 'Under 100 KB', Engine.qpdf, _pdf, 'under 100 KB', maxBytes: 100 * _kb),
  _fit('fit-pdf-500kb', 'Under 500 KB', Engine.qpdf, _pdf, 'under 500 KB', maxBytes: 500 * _kb),
  _fit('fit-pdf-1mb', 'Under 1 MB', Engine.qpdf, _pdf, 'under 1 MB', maxBytes: _mb),

  // Images: tools
  _tool('image-resize', 'Resize', Engine.vips, _images, 'resized'),
  _tool('image-crop', 'Crop', Engine.vips, _images, 'cropped'),
  _tool('image-rotate', 'Rotate', Engine.vips, _images, 'rotated'),
  _tool('image-flip', 'Flip', Engine.vips, _images, 'flipped'),
  _tool('image-compress', 'Compress', Engine.vips, _images, 'compressed'),
  _tool('image-strip-metadata', 'Strip metadata', Engine.vips, _images, 'no metadata'),
  _tool('images-to-pdf', 'One PDF', Engine.vips, _images, 'combined', output: FileKind.pdf),

  // Video: convert
  _convert('video-to-mp4', 'MP4', Engine.ffmpeg, _videos, FileKind.mp4),
  _convert('video-to-mov', 'MOV', Engine.ffmpeg, _videos, FileKind.mov),
  _convert('video-to-webm', 'WebM', Engine.ffmpeg, _videos, FileKind.webm),
  _convert('video-to-gif', 'GIF', Engine.ffmpeg, _videos, FileKind.gif),
  _convert('video-to-mp3', 'MP3', Engine.ffmpeg, _videos, FileKind.mp3),
  _convert('video-to-m4a', 'M4A', Engine.ffmpeg, _videos, FileKind.m4a),

  // Video: tools
  _tool('video-trim', 'Trim', Engine.ffmpeg, _videos, 'trimmed'),
  _tool('video-compress', 'Compress', Engine.ffmpeg, _videos, 'compressed'),
  _tool('video-resize', 'Resize', Engine.ffmpeg, _videos, 'resized'),
  _tool('video-crop', 'Crop', Engine.ffmpeg, _videos, 'cropped'),
  _tool('video-rotate', 'Rotate', Engine.ffmpeg, _videos, 'rotated'),
  _tool('video-mute', 'Mute', Engine.ffmpeg, _videos, 'muted'),
  _tool('video-merge', 'Merge', Engine.ffmpeg, _videos, 'merged', minFiles: 2),
  _tool(
    'video-extract-audio',
    'Extract audio',
    Engine.ffmpeg,
    _videos,
    'audio',
    output: FileKind.m4a,
  ),

  // Audio: convert
  _convert('audio-to-mp3', 'MP3', Engine.ffmpeg, _audio, FileKind.mp3),
  _convert('audio-to-m4a', 'M4A', Engine.ffmpeg, _audio, FileKind.m4a),
  _convert('audio-to-wav', 'WAV', Engine.ffmpeg, _audio, FileKind.wav),
  _convert('audio-to-flac', 'FLAC', Engine.ffmpeg, _audio, FileKind.flac),
  _convert('audio-to-opus', 'Opus', Engine.ffmpeg, _audio, FileKind.opus),

  // Audio: tools
  _tool('audio-trim', 'Trim', Engine.ffmpeg, _audio, 'trimmed'),
  _tool('audio-merge', 'Merge', Engine.ffmpeg, _audio, 'merged', minFiles: 2),
  _tool('audio-normalise', 'Normalise volume', Engine.ffmpeg, _audio, 'normalised'),
  _tool('audio-bitrate', 'Change bitrate', Engine.ffmpeg, _audio, 'bitrate'),

  // PDF: convert
  _convert('pdf-to-jpg', 'JPG', Engine.pdfium, _pdf, FileKind.jpg),
  _convert('pdf-to-png', 'PNG', Engine.pdfium, _pdf, FileKind.png),

  // PDF: tools
  _tool('pdf-merge', 'Merge', Engine.qpdf, _pdf, 'merged', minFiles: 2),
  _tool('pdf-split', 'Split', Engine.qpdf, _pdf, 'split'),
  _tool('pdf-extract-pages', 'Extract pages', Engine.qpdf, _pdf, 'pages'),
  _tool('pdf-rotate', 'Rotate', Engine.qpdf, _pdf, 'rotated'),
  _tool('pdf-compress', 'Compress', Engine.qpdf, _pdf, 'compressed'),
  _tool('pdf-add-password', 'Add password', Engine.qpdf, _pdf, 'protected'),
  _tool('pdf-remove-password', 'Remove password', Engine.qpdf, _pdf, 'unlocked'),
  _tool('pdf-strip-metadata', 'Strip metadata', Engine.qpdf, _pdf, 'no metadata'),

  // Documents: desktop only, LibreOffice and Pandoc add-ons beyond TXT, Markdown and HTML
  _convert('document-to-pdf', 'PDF', Engine.document, _documents, FileKind.pdf),
  _convert('document-to-markdown', 'Markdown', Engine.document, _markup, FileKind.markdown),
  _convert('document-to-html', 'HTML', Engine.document, _markup, FileKind.html),
  _convert('document-to-docx', 'DOCX', Engine.document, _markup, FileKind.docx),

  // Subtitles
  _convert('subtitle-to-srt', 'SRT', Engine.builtIn, _subtitles, FileKind.srt),
  _convert('subtitle-to-vtt', 'VTT', Engine.builtIn, _subtitles, FileKind.vtt),
  _convert('subtitle-to-text', 'Plain text', Engine.builtIn, _subtitles, FileKind.txt),
  _tool('subtitle-shift', 'Shift timing', Engine.builtIn, _subtitles, 'shifted'),

  // Archives
  _convert('archive-to-zip', 'ZIP', Engine.libarchive, _archives, FileKind.zip),
  _convert('archive-to-targz', 'TAR.GZ', Engine.libarchive, _archives, FileKind.tarGz),
  _convert('archive-to-7z', '7z', Engine.libarchive, _archives, FileKind.sevenZip),
  _tool('archive-extract', 'Extract', Engine.libarchive, _archives, 'extracted'),
  _tool('archive-add-password', 'Add password', Engine.libarchive, _archives, 'protected'),
  _tool(
    'folder-compress',
    'Compress folder',
    Engine.libarchive,
    const {FileKind.folder},
    'compressed',
    output: FileKind.zip,
  ),
]);
