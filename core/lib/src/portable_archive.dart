import 'dart:typed_data';

import 'package:archive/archive.dart';

import 'action_options.dart';
import 'actions.dart';
import 'file_kind.dart';
import 'naming.dart';
import 'portable_engine.dart';

const _readable = {FileKind.zip, FileKind.tar, FileKind.gz};
const _runs = {'archive-to-zip', 'archive-to-targz', 'archive-extract'};

/// Archives are small and hold a lot, so this is what they may open up to, not their own size.
const maxOpenedBytes = 1024 * 1024 * 1024;

/// Each extracted file gets its own Save button, so this is about as many as anyone would click.
const maxExtractedFiles = 50;

/// True if [action] can run on [kind] in pure Dart. Nothing here reads 7z or RAR, or writes 7z.
bool canRunArchive(RadialAction action, FileKind kind) {
  return _readable.contains(kind) && _runs.contains(action.id);
}

/// Runs an archive action on [file] in memory. Nothing is written to disk, and [limit] holds
/// however much the archive claims to contain, so a zip bomb stops here.
List<PortableFile> runArchive(
  RadialAction action,
  PortableFile file,
  FileKind kind, {
  int limit = maxOpenedBytes,
}) {
  final entries = _open(file, kind, limit);
  if (action.id == 'archive-extract') return _extract(file, entries);

  final archive = Archive();
  entries.forEach(archive.addFile);
  final Uint8List bytes;
  final String extension;
  if (action.id == 'archive-to-zip') {
    bytes = ZipEncoder().encodeBytes(archive);
    extension = FileKind.zip.extension;
  } else {
    bytes = const GZipEncoder().encodeBytes(TarEncoder().encodeBytes(archive));
    extension = FileKind.tarGz.extension;
  }
  final name = freeOutputName(
    inputName: file.name,
    extension: extension,
    suffix: action.suffix,
    exists: (_) => false,
  );
  return [PortableFile(name, bytes)];
}

List<ArchiveFile> _open(PortableFile file, FileKind kind, int limit) {
  try {
    if (kind == FileKind.zip) {
      final archive = ZipDecoder().decodeBytes(file.bytes, verify: true, throwOnError: true);
      return _entries(file, archive, limit);
    }
    if (kind == FileKind.tar) return _entries(file, TarDecoder().decodeBytes(file.bytes), limit);
    final inner = const GZipDecoder().decodeBytes(
      file.bytes,
      throwOnError: true,
      maxOutputSize: limit,
    );
    if (_isTar(inner)) return _entries(file, TarDecoder().decodeBytes(inner), limit);
    return [ArchiveFile.bytes(splitFileName(file.name).stem, inner)];
  } on ArchivePasswordException {
    throw EngineFailed('${file.name} has a password, so it can\'t be opened yet.');
  } on ArchiveLimitException {
    throw EngineFailed('${file.name} is too large to open here.');
  } on EngineFailed {
    rethrow;
  } catch (_) {
    throw EngineFailed('${file.name} could not be read. It may be damaged.');
  }
}

bool _isTar(Uint8List bytes) {
  const magic = [0x75, 0x73, 0x74, 0x61, 0x72];
  if (bytes.length < 262) return false;
  for (var i = 0; i < magic.length; i++) {
    if (bytes[257 + i] != magic[i]) return false;
  }
  return true;
}

/// A copy of each entry, opened with a limit. An archive can lie about how big its files are, so
/// what comes out is what is counted.
List<ArchiveFile> _entries(PortableFile file, Archive archive, int limit) {
  var total = 0;
  final entries = <ArchiveFile>[];
  for (final entry in archive.files) {
    // tar writes `./` in front of everything, which shows up as a strange folder in a ZIP.
    final name = entry.name.startsWith('./') ? entry.name.substring(2) : entry.name;
    if (name.isEmpty) continue;
    if (_leavesItsFolder(name)) {
      throw EngineFailed(
        '${file.name} has a file that points outside its folder, so it won\'t be opened.',
      );
    }
    final ArchiveFile copy;
    if (entry.isSymbolicLink) {
      copy = ArchiveFile.symlink(name, entry.symbolicLink!);
    } else if (entry.isDirectory) {
      copy = ArchiveFile.directory(name);
    } else {
      final output = _LimitedOutput(limit - total);
      entry.writeContent(output);
      total += output.length;
      copy = ArchiveFile.bytes(name, output.getBytes());
    }
    entries.add(
      copy
        ..mode = entry.mode
        ..lastModTime = entry.lastModTime,
    );
  }
  return entries;
}

bool _leavesItsFolder(String name) {
  if (name.startsWith('/') || name.startsWith(r'\') || name.contains('\u0000')) return true;
  if (RegExp(r'^[A-Za-z]:').hasMatch(name)) return true;
  return name.split(RegExp(r'[/\\]')).contains('..');
}

/// Throws once more than [_left] bytes arrive.
class _LimitedOutput extends OutputMemoryStream {
  _LimitedOutput(this._left);

  int _left;

  void _spend(int count) {
    _left -= count;
    if (_left < 0) throw ArchiveLimitException('Over the limit');
  }

  @override
  void writeByte(int value) {
    _spend(1);
    super.writeByte(value);
  }

  @override
  void writeBytes(List<int> bytes, {int? length}) {
    _spend(length ?? bytes.length);
    super.writeBytes(bytes, length: length);
  }

  @override
  void writeStream(InputStream stream) {
    _spend(stream.length);
    super.writeStream(stream);
  }
}

/// Every file, on its own. A flat list of results has no folders, so names may need telling apart.
/// Links are left out, as a link alone is no use, and so is what macOS adds to its ZIPs.
List<PortableFile> _extract(PortableFile file, List<ArchiveFile> entries) {
  final files = [
    for (final entry in entries)
      if (entry.isFile && !entry.isSymbolicLink && !_isMacClutter(entry.name)) entry,
  ];
  if (files.isEmpty) throw EngineFailed('${file.name} has no files in it.');
  if (files.length > maxExtractedFiles) {
    throw EngineFailed(
      '${file.name} has ${files.length} files, too many to save one at a time. '
      'The limit is $maxExtractedFiles.',
    );
  }
  final used = <String>{};
  return [
    for (final entry in files)
      PortableFile(_freeName(_lastPart(entry.name), used), entry.readBytes() ?? Uint8List(0)),
  ];
}

String _lastPart(String name) => name.split(RegExp(r'[/\\]')).last;

bool _isMacClutter(String name) {
  return name.split('/').first == '__MACOSX' || _lastPart(name) == '.DS_Store';
}

String _freeName(String name, Set<String> used) {
  final free = used.contains(name)
      ? freeOutputName(
          inputName: name,
          extension: splitFileName(name).extension,
          suffix: 'extracted',
          exists: used.contains,
        )
      : name;
  used.add(free);
  return free;
}
