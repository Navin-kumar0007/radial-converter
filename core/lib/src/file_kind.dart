/// The families from the plan's "Supported conversions" table.
enum FileFamily { image, video, audio, pdf, document, subtitle, archive, folder, unknown }

enum FileKind {
  jpg(FileFamily.image, 'jpg', 'image/jpeg'),
  png(FileFamily.image, 'png', 'image/png'),
  webp(FileFamily.image, 'webp', 'image/webp'),
  heic(FileFamily.image, 'heic', 'image/heic'),
  avif(FileFamily.image, 'avif', 'image/avif'),
  gif(FileFamily.image, 'gif', 'image/gif'),
  bmp(FileFamily.image, 'bmp', 'image/bmp'),
  tiff(FileFamily.image, 'tiff', 'image/tiff'),
  svg(FileFamily.image, 'svg', 'image/svg+xml'),
  ico(FileFamily.image, 'ico', 'image/x-icon'),

  mp4(FileFamily.video, 'mp4', 'video/mp4'),
  mov(FileFamily.video, 'mov', 'video/quicktime'),
  mkv(FileFamily.video, 'mkv', 'video/x-matroska'),
  webm(FileFamily.video, 'webm', 'video/webm'),
  avi(FileFamily.video, 'avi', 'video/x-msvideo'),
  threeGp(FileFamily.video, '3gp', 'video/3gpp'),

  mp3(FileFamily.audio, 'mp3', 'audio/mpeg'),
  m4a(FileFamily.audio, 'm4a', 'audio/mp4'),
  aac(FileFamily.audio, 'aac', 'audio/aac'),
  wav(FileFamily.audio, 'wav', 'audio/wav'),
  flac(FileFamily.audio, 'flac', 'audio/flac'),
  ogg(FileFamily.audio, 'ogg', 'audio/ogg'),
  opus(FileFamily.audio, 'opus', 'audio/opus'),

  pdf(FileFamily.pdf, 'pdf', 'application/pdf'),

  txt(FileFamily.document, 'txt', 'text/plain'),
  markdown(FileFamily.document, 'md', 'text/markdown'),
  html(FileFamily.document, 'html', 'text/html'),
  docx(
    FileFamily.document,
    'docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ),
  odt(FileFamily.document, 'odt', 'application/vnd.oasis.opendocument.text'),
  pptx(
    FileFamily.document,
    'pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ),
  xlsx(
    FileFamily.document,
    'xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ),

  srt(FileFamily.subtitle, 'srt', 'application/x-subrip'),
  vtt(FileFamily.subtitle, 'vtt', 'text/vtt'),

  zip(FileFamily.archive, 'zip', 'application/zip'),
  tar(FileFamily.archive, 'tar', 'application/x-tar'),
  gz(FileFamily.archive, 'gz', 'application/gzip'),
  tarGz(FileFamily.archive, 'tar.gz', 'application/gzip'),
  sevenZip(FileFamily.archive, '7z', 'application/x-7z-compressed'),
  rar(FileFamily.archive, 'rar', 'application/vnd.rar'),

  /// Folders are never detected from bytes; the app reports them from the file system.
  folder(FileFamily.folder, '', 'inode/directory'),
  unknown(FileFamily.unknown, '', 'application/octet-stream');

  const FileKind(this.family, this.extension, this.mime);

  final FileFamily family;

  /// Without the leading dot. Empty for folders and unknown files.
  final String extension;
  final String mime;

  /// Every kind in [family].
  static Set<FileKind> ofFamily(FileFamily family) =>
      FileKind.values.where((kind) => kind.family == family).toSet();

  /// The kind with this extension, ignoring case and a leading dot. Null if none.
  /// What other apps should be told [fileName] is, from its extension alone.
  static String mimeOf(String fileName) {
    final dot = fileName.lastIndexOf('.');
    if (dot < 0) return unknown.mime;
    return (fromExtension(fileName.substring(dot + 1)) ?? unknown).mime;
  }

  static FileKind? fromExtension(String extension) {
    var ext = extension.toLowerCase();
    if (ext.startsWith('.')) ext = ext.substring(1);
    if (ext.isEmpty) return null;
    const aliases = {
      'jpeg': FileKind.jpg,
      'jpe': FileKind.jpg,
      'heif': FileKind.heic,
      'tif': FileKind.tiff,
      'markdown': FileKind.markdown,
      'htm': FileKind.html,
      'tgz': FileKind.tarGz,
    };
    final alias = aliases[ext];
    if (alias != null) return alias;
    for (final kind in FileKind.values) {
      if (kind.extension == ext) return kind;
    }
    return null;
  }
}
