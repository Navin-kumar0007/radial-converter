import 'dart:convert';

import 'file_kind.dart';

/// How many bytes from the start of a file [detectKind] wants. Office files list
/// their parts near the start of the ZIP, so this is more than a magic number needs.
const detectHeadBytes = 64 * 1024;

/// Identifies a file from its first bytes (see [detectHeadBytes]).
///
/// [fileName] only breaks ties the bytes cannot settle: Markdown is plain text, and an
/// MP4 container may hold only audio. A wrong extension never overrides the bytes, so a
/// PNG called `photo.jpg` is a PNG.
FileKind detectKind(List<int> head, {String? fileName}) {
  if (head.isEmpty) return FileKind.unknown;
  final ext = _extensionOf(fileName);
  return _detectBinary(head, ext) ?? _detectText(head, ext);
}

FileKind? _detectBinary(List<int> head, String ext) {
  if (_startsWith(head, const [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
    return FileKind.png;
  }
  if (_startsWith(head, const [0xFF, 0xD8, 0xFF])) return FileKind.jpg;
  if (_ascii(head, 0, 6) == 'GIF87a' || _ascii(head, 0, 6) == 'GIF89a') return FileKind.gif;
  if (_ascii(head, 0, 4) == 'RIFF') {
    switch (_ascii(head, 8, 12)) {
      case 'WEBP':
        return FileKind.webp;
      case 'WAVE':
        return FileKind.wav;
      case 'AVI ':
        return FileKind.avi;
    }
  }
  if (head.length >= 12 && _ascii(head, 4, 8) == 'ftyp') return _detectIsoBmff(head, ext);
  if (_isBmp(head)) return FileKind.bmp;
  if (_startsWith(head, const [0x49, 0x49, 0x2A, 0x00]) ||
      _startsWith(head, const [0x4D, 0x4D, 0x00, 0x2A])) {
    return FileKind.tiff;
  }
  if (_isIco(head)) return FileKind.ico;
  if (_ascii(head, 0, 5) == '%PDF-') return FileKind.pdf;
  if (_startsWith(head, const [0x1A, 0x45, 0xDF, 0xA3])) {
    return _indexOf(head, 'webm') >= 0 ? FileKind.webm : FileKind.mkv;
  }
  if (_ascii(head, 0, 4) == 'OggS') {
    return _indexOf(head, 'OpusHead') >= 0 ? FileKind.opus : FileKind.ogg;
  }
  if (_ascii(head, 0, 4) == 'fLaC') return FileKind.flac;
  if (_ascii(head, 0, 3) == 'ID3') return FileKind.mp3;
  if (_isUtf16Bom(head)) return null;
  if (_isAdts(head)) return FileKind.aac;
  if (_isMp3Frame(head)) return FileKind.mp3;
  if (_startsWith(head, const [0x50, 0x4B, 0x03, 0x04]) ||
      _startsWith(head, const [0x50, 0x4B, 0x05, 0x06])) {
    return _detectZip(head, ext);
  }
  if (_startsWith(head, const [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) return FileKind.sevenZip;
  if (_startsWith(head, const [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07])) return FileKind.rar;
  if (_startsWith(head, const [0x1F, 0x8B])) return FileKind.gz;
  if (_ascii(head, 257, 262) == 'ustar') return FileKind.tar;
  return null;
}

/// MP4, MOV, HEIC, AVIF, M4A and 3GP are all this container; the brand tells them apart.
FileKind _detectIsoBmff(List<int> head, String ext) {
  final major = _ascii(head, 8, 12);
  final boxSize = head[0] << 24 | head[1] << 16 | head[2] << 8 | head[3];
  final boxEnd = boxSize < head.length ? boxSize : head.length;
  final compatible = <String>[for (var i = 16; i + 4 <= boxEnd; i += 4) _ascii(head, i, i + 4)];

  const heicBrands = {'heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs'};
  if (heicBrands.contains(major)) return FileKind.heic;
  if (major == 'avif' || major == 'avis') return FileKind.avif;
  if (major == 'mif1' || major == 'msf1') {
    return compatible.contains('avif') ? FileKind.avif : FileKind.heic;
  }
  if (major == 'qt  ') return FileKind.mov;
  if (const {'M4A ', 'M4B ', 'M4P '}.contains(major)) return FileKind.m4a;
  if (major.startsWith('3gp') || major.startsWith('3g2')) return FileKind.threeGp;
  if (compatible.contains('M4A ')) return FileKind.m4a;
  return ext == 'm4a' ? FileKind.m4a : FileKind.mp4;
}

/// DOCX, PPTX, XLSX and ODT are ZIP files; their part names give them away.
FileKind _detectZip(List<int> head, String ext) {
  if (_ascii(head, 30, 38) == 'mimetype') {
    final mime = _ascii(head, 38, 38 + FileKind.odt.mime.length);
    if (mime == FileKind.odt.mime) return FileKind.odt;
  }
  final isOffice = _indexOf(head, '[Content_Types].xml') >= 0 || _indexOf(head, '_rels/.rels') >= 0;
  if (!isOffice) return FileKind.zip;
  if (_indexOf(head, 'word/') >= 0) return FileKind.docx;
  if (_indexOf(head, 'ppt/') >= 0) return FileKind.pptx;
  if (_indexOf(head, 'xl/') >= 0) return FileKind.xlsx;
  // An Office file whose parts sit past the bytes we read: the name settles it.
  return switch (ext) {
    'docx' => FileKind.docx,
    'pptx' => FileKind.pptx,
    'xlsx' => FileKind.xlsx,
    _ => FileKind.zip,
  };
}

FileKind _detectText(List<int> head, String ext) {
  final text = _decodeText(head);
  if (text == null) return FileKind.unknown;
  final trimmed = text.trimLeft();
  final lower = trimmed.toLowerCase();

  if (lower.startsWith('<') && lower.contains('<svg')) return FileKind.svg;
  if (lower.startsWith('<!doctype html') || lower.startsWith('<html')) return FileKind.html;
  if (RegExp(r'^WEBVTT(\s|$)').hasMatch(trimmed)) return FileKind.vtt;
  if (RegExp(r'^\d+[ \t]*\r?\n\d{1,2}:\d{2}:\d{2},\d{1,3}[ \t]*-->').hasMatch(trimmed)) {
    return FileKind.srt;
  }
  if (ext == 'md' || ext == 'markdown') return FileKind.markdown;
  return FileKind.txt;
}

/// The text in [head], or null if it looks like binary data.
String? _decodeText(List<int> head) {
  if (_isUtf16Bom(head)) {
    final littleEndian = head[0] == 0xFF;
    final units = <int>[
      for (var i = 2; i + 1 < head.length; i += 2)
        littleEndian ? head[i] | head[i + 1] << 8 : head[i] << 8 | head[i + 1],
    ];
    return String.fromCharCodes(units);
  }
  final start = _startsWith(head, const [0xEF, 0xBB, 0xBF]) ? 3 : 0;
  final sample = head.sublist(start, head.length < 8192 ? head.length : 8192);
  var controls = 0;
  for (final byte in sample) {
    if (byte == 0) return null;
    final isWhitespace = byte >= 9 && byte <= 13;
    if (byte < 32 && !isWhitespace && byte != 27) controls++;
  }
  if (controls * 100 > sample.length) return null;
  // Legacy encodings leave some invalid UTF-8; binary data leaves little else.
  final decoded = utf8.decode(sample, allowMalformed: true);
  final invalid = '\uFFFD'.allMatches(decoded).length;
  if (invalid * 3 > decoded.length) return null;
  return utf8.decode(head.sublist(start), allowMalformed: true);
}

bool _isUtf16Bom(List<int> head) =>
    _startsWith(head, const [0xFF, 0xFE]) || _startsWith(head, const [0xFE, 0xFF]);

bool _isBmp(List<int> head) {
  if (head.length < 18 || _ascii(head, 0, 2) != 'BM') return false;
  final headerSize = head[14] | head[15] << 8 | head[16] << 16 | head[17] << 24;
  return const {12, 40, 52, 56, 64, 108, 124}.contains(headerSize);
}

bool _isIco(List<int> head) {
  if (head.length < 22 || !_startsWith(head, const [0x00, 0x00, 0x01, 0x00])) return false;
  final count = head[4] | head[5] << 8;
  return count > 0 && head[9] == 0;
}

bool _isAdts(List<int> head) => head.length >= 4 && head[0] == 0xFF && (head[1] & 0xF6) == 0xF0;

bool _isMp3Frame(List<int> head) {
  if (head.length < 4 || head[0] != 0xFF || (head[1] & 0xE0) != 0xE0) return false;
  final version = (head[1] >> 3) & 3;
  final layer = (head[1] >> 1) & 3;
  final bitrate = head[2] >> 4;
  final sampleRate = (head[2] >> 2) & 3;
  return version != 1 && layer != 0 && bitrate != 15 && sampleRate != 3;
}

String _extensionOf(String? fileName) {
  if (fileName == null) return '';
  final dot = fileName.lastIndexOf('.');
  return dot < 0 ? '' : fileName.substring(dot + 1).toLowerCase();
}

bool _startsWith(List<int> head, List<int> prefix) {
  if (head.length < prefix.length) return false;
  for (var i = 0; i < prefix.length; i++) {
    if (head[i] != prefix[i]) return false;
  }
  return true;
}

String _ascii(List<int> head, int start, int end) {
  if (head.length < end) return '';
  return String.fromCharCodes(head.sublist(start, end));
}

int _indexOf(List<int> head, String needle) {
  final codes = needle.codeUnits;
  for (var i = 0; i + codes.length <= head.length; i++) {
    var found = true;
    for (var j = 0; j < codes.length; j++) {
      if (head[i + j] != codes[j]) {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  return -1;
}
