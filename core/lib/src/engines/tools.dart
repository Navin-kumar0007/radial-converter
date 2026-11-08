import 'dart:io';

import 'package:path/path.dart' as p;

/// A conversion program could not be found.
class EngineMissing implements Exception {
  const EngineMissing(this.tool);

  final String tool;

  @override
  String toString() => 'The $tool engine is missing. Reinstall the app to get it back.';
}

/// Finds the engine programs: the app's bundled folder first, then the system.
class EngineTools {
  EngineTools({String? bundledFolder, Map<String, String>? environment})
    : _folders = _searchFolders(bundledFolder, environment ?? Platform.environment);

  final List<String> _folders;
  final Map<String, String?> _found = {};

  static List<String> _searchFolders(String? bundled, Map<String, String> environment) {
    final separator = Platform.isWindows ? ';' : ':';
    return [
      ?bundled,
      ...?environment['PATH']?.split(separator),
      // Apps started from Finder get a short PATH.
      if (Platform.isMacOS) ...['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin'],
    ];
  }

  /// The full path of [name], or null.
  String? find(String name) => _found.putIfAbsent(name, () {
    final fileName = Platform.isWindows ? '$name.exe' : name;
    for (final folder in _folders) {
      if (folder.isEmpty) continue;
      final path = p.join(folder, fileName);
      if (File(path).existsSync()) return path;
    }
    return null;
  });

  String require(String name) => find(name) ?? (throw EngineMissing(name));

  String get vips => require('vips');
  String get vipsHeader => require('vipsheader');
  String get ffmpeg => require('ffmpeg');
  String get ffprobe => require('ffprobe');
  String get qpdf => require('qpdf');

  /// libarchive's command-line tool. macOS and Windows both ship it as `tar`.
  String get bsdtar => find('bsdtar') ?? find('tar') ?? (throw const EngineMissing('bsdtar'));
}
