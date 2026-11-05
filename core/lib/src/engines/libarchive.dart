import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:isolate';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:ffi/ffi.dart';
import 'package:path/path.dart' as p;

import '../action_options.dart';
import '../portable_archive.dart';

// libarchive's C functions. https://github.com/libarchive/libarchive/wiki/ManualPages
typedef _NewC = Pointer<Void> Function();
typedef _OneC = Int Function(Pointer<Void>);
typedef _OneD = int Function(Pointer<Void>);
typedef _OpenC = Int Function(Pointer<Void>, Pointer<Void>, Size);
typedef _OpenD = int Function(Pointer<Void>, Pointer<Void>, int);
typedef _NextC = Int Function(Pointer<Void>, Pointer<Pointer<Void>>);
typedef _NextD = int Function(Pointer<Void>, Pointer<Pointer<Void>>);
typedef _ReadC = IntPtr Function(Pointer<Void>, Pointer<Uint8>, Size);
typedef _ReadD = int Function(Pointer<Void>, Pointer<Uint8>, int);
typedef _TextC = Pointer<Utf8> Function(Pointer<Void>);
typedef _FileTypeC = UnsignedInt Function(Pointer<Void>);

const _ok = 0;
const _eof = 1;
const _retry = -10;
const _warn = -20;
const _regularFile = 32768; // AE_IFREG, 0100000

/// How many files one archive may hold, so a tiny file can't make millions of empty ones.
const _mostFiles = 100000;

/// A copy of libarchive to use, or null if this computer has none. macOS has its own, which is why
/// the Mac app needn't carry one. On Windows the app ships it beside the program.
DynamicLibrary? _library(String? given) {
  final candidates = [
    ?given,
    ?Platform.environment['LIBARCHIVE_PATH'],
    if (Platform.isMacOS) '/usr/lib/libarchive.2.dylib',
    if (Platform.isWindows) 'archive.dll',
    if (Platform.isLinux) 'libarchive.so.13',
  ];
  for (final path in candidates) {
    try {
      return DynamicLibrary.open(path);
    } on ArgumentError {
      continue;
    }
  }
  return null;
}

/// True if 7z and RAR can be read on this computer.
bool libarchiveAvailable({String? libraryPath}) => _library(libraryPath) != null;

/// Unpacks the 7z or RAR at [path] into a ZIP in memory, for the portable engine to take from there.
/// Only regular files come out, so links can't point anywhere. [limit] counts what really comes
/// out, however little the archive claims, so a zip bomb stops here. Runs apart from the app.
Future<Uint8List> unpackToZip(String path, {int limit = maxOpenedBytes, String? libraryPath}) {
  return Isolate.run(() => _unpack(path, limit, libraryPath));
}

Uint8List _unpack(String path, int limit, String? libraryPath) {
  final name = p.basename(path);
  final library = _library(libraryPath);
  if (library == null) throw EngineFailed('$name can\'t be opened on this computer.');
  final archive = _Reader(library);
  final handle = archive.create();
  if (handle == nullptr) throw EngineFailed('$name could not be read.');
  final entryOut = malloc<Pointer<Void>>();
  const bufferSize = 1 << 20;
  final buffer = malloc<Uint8>(bufferSize);
  final Pointer<Void> nativePath = Platform.isWindows
      ? path.toNativeUtf16().cast()
      : path.toNativeUtf8().cast();
  try {
    if (archive.open(handle, nativePath, bufferSize) != _ok) {
      throw _failure(name, archive.error(handle));
    }
    final zip = Archive();
    var total = 0;
    var files = 0;
    while (true) {
      final next = archive.next(handle, entryOut);
      if (next == _eof) break;
      if (next == _retry) continue;
      if (next != _ok && next != _warn) throw _failure(name, archive.error(handle));
      final entry = entryOut.value;
      if (archive.isEncrypted(entry)) throw _locked(name);
      if (archive.fileType(entry) != _regularFile || archive.isHardLink(entry)) continue;
      if (++files > _mostFiles) throw EngineFailed('$name holds too many files to open here.');

      final declared = archive.declaredSize(entry);
      final bytes = BytesBuilder(copy: true);
      while (true) {
        final count = archive.read(handle, buffer, bufferSize);
        if (count == 0) break;
        if (count == _retry) continue;
        if (count < 0 && count != _warn) throw _failure(name, archive.error(handle));
        if (count < 0) continue;
        total += count;
        if (total > limit) throw EngineFailed('$name is too large to open here.');
        bytes.add(buffer.asTypedList(count));
      }
      // Some builds treat a cut-off file as simply ending. A short file must not pass for a whole one.
      if (declared != null && bytes.length != declared) throw _failure(name, '');
      // A name that can't be read mustn't lose the file.
      final entryName = archive.pathname(entry);
      zip.addFile(
        ArchiveFile.bytes(
          entryName == null || entryName.isEmpty ? 'file $files' : entryName,
          bytes.takeBytes(),
        )..compression = CompressionType.none,
      );
    }
    if (zip.isEmpty) throw EngineFailed('$name has no files in it.');
    return Uint8List.fromList(ZipEncoder().encodeBytes(zip));
  } finally {
    archive.free(handle);
    malloc
      ..free(entryOut)
      ..free(buffer)
      ..free(nativePath);
  }
}

EngineFailed _locked(String name) {
  return EngineFailed('$name has a password. Locked 7z and RAR files can\'t be opened yet.');
}

EngineFailed _failure(String name, String reason) {
  final lower = reason.toLowerCase();
  if (lower.contains('encrypt') || lower.contains('passphrase') || lower.contains('password')) {
    return _locked(name);
  }
  return EngineFailed('$name could not be read. It may be damaged, or one part of several.');
}

class _Reader {
  _Reader(DynamicLibrary library)
    : _new = library.lookupFunction<_NewC, _NewC>('archive_read_new'),
      _free = library.lookupFunction<_OneC, _OneD>('archive_read_free'),
      _formats = [
        library.lookupFunction<_OneC, _OneD>('archive_read_support_format_7zip'),
        library.lookupFunction<_OneC, _OneD>('archive_read_support_format_rar'),
        library.lookupFunction<_OneC, _OneD>('archive_read_support_format_rar5'),
      ],
      _open = Platform.isWindows
          ? library.lookupFunction<_OpenC, _OpenD>('archive_read_open_filename_w')
          : library.lookupFunction<_OpenC, _OpenD>('archive_read_open_filename'),
      _next = library.lookupFunction<_NextC, _NextD>('archive_read_next_header'),
      read = library.lookupFunction<_ReadC, _ReadD>('archive_read_data'),
      _error = library.lookupFunction<_TextC, _TextC>('archive_error_string'),
      _fileType = library.lookupFunction<_FileTypeC, int Function(Pointer<Void>)>(
        'archive_entry_filetype',
      ),
      _hardLink = library.lookupFunction<_TextC, _TextC>('archive_entry_hardlink'),
      _pathname = library.lookupFunction<_TextC, _TextC>('archive_entry_pathname_utf8'),
      _encrypted = library.lookupFunction<_OneC, _OneD>('archive_entry_is_encrypted'),
      _sizeIsSet = library.lookupFunction<_OneC, _OneD>('archive_entry_size_is_set'),
      _size = library.lookupFunction<Int64 Function(Pointer<Void>), int Function(Pointer<Void>)>(
        'archive_entry_size',
      );

  final _NewC _new;
  final _OneD _free;
  final List<_OneD> _formats;
  final _OpenD _open;
  final _NextD _next;
  final _ReadD read;
  final _TextC _error;
  final int Function(Pointer<Void>) _fileType;
  final _TextC _hardLink;
  final _TextC _pathname;
  final _OneD _encrypted;
  final _OneD _sizeIsSet;
  final int Function(Pointer<Void>) _size;

  /// What the archive says this file's size is, or null if it doesn't.
  int? declaredSize(Pointer<Void> entry) => _sizeIsSet(entry) != 0 ? _size(entry) : null;

  /// Only the formats wanted, so nothing else in the library ever sees a stranger's file.
  Pointer<Void> create() {
    final handle = _new();
    if (handle == nullptr) return handle;
    for (final format in _formats) {
      format(handle);
    }
    return handle;
  }

  int open(Pointer<Void> handle, Pointer<Void> path, int size) => _open(handle, path, size);
  int next(Pointer<Void> handle, Pointer<Pointer<Void>> out) => _next(handle, out);
  void free(Pointer<Void> handle) => _free(handle);
  int fileType(Pointer<Void> entry) => _fileType(entry);
  bool isHardLink(Pointer<Void> entry) => _hardLink(entry) != nullptr;
  bool isEncrypted(Pointer<Void> entry) => _encrypted(entry) > 0;

  String? pathname(Pointer<Void> entry) {
    final text = _pathname(entry);
    return text == nullptr ? null : const Utf8Decoder(allowMalformed: true).convert(_bytes(text));
  }

  String error(Pointer<Void> handle) {
    final text = _error(handle);
    return text == nullptr ? '' : const Utf8Decoder(allowMalformed: true).convert(_bytes(text));
  }

  List<int> _bytes(Pointer<Utf8> text) => text.cast<Uint8>().asTypedList(text.length);
}
