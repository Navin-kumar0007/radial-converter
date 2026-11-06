import 'dart:convert';

import 'file_kind.dart';

/// How the picture is framed before it is sized.
enum PresetCrop { none, user, auto }

class PresetOutput {
  const PresetOutput({
    required this.format,
    this.width,
    this.height,
    this.minBytes,
    this.maxBytes,
    this.background,
    this.crop = PresetCrop.none,
  });

  final FileKind format;
  final int? width;
  final int? height;

  /// Forms refuse files that are too small as well as too large.
  final int? minBytes;
  final int? maxBytes;
  final String? background;
  final PresetCrop crop;
}

/// A make-it-fit or form-ready preset, loaded from a JSON file in `presets/`.
class Preset {
  const Preset({
    required this.id,
    required this.labels,
    required this.accepts,
    required this.output,
    this.source,
    this.note,
  });

  final String id;

  /// Locale code to label. Always has `en`.
  final Map<String, String> labels;

  /// MIME patterns such as `image/*` or `application/pdf`.
  final List<String> accepts;
  final PresetOutput output;

  /// Link to the form's official instructions.
  final String? source;
  final String? note;

  /// The label for [locale], falling back to English.
  String label(String locale) => labels[locale] ?? labels['en']!;

  bool acceptsKind(FileKind kind) {
    for (final pattern in accepts) {
      if (pattern == '*/*' || pattern == kind.mime) return true;
      if (pattern.endsWith('/*') &&
          kind.mime.startsWith(pattern.substring(0, pattern.length - 1))) {
        return true;
      }
    }
    return false;
  }

  /// Parses a preset file. Throws [FormatException] with a plain reason if it is wrong.
  ///
  /// When [fileName] is given it must equal the id: `form-photo-50kb.json`.
  static Preset parse(String json, {String? fileName}) {
    final Object? root;
    try {
      root = jsonDecode(json);
    } on FormatException catch (e) {
      throw FormatException('Preset is not valid JSON: ${e.message}');
    }
    if (root is! Map<String, dynamic>) throw const FormatException('Preset must be a JSON object');

    final id = root['id'];
    if (id is! String || !RegExp(r'^[a-z0-9]+(-[a-z0-9]+)*$').hasMatch(id)) {
      throw const FormatException('Preset id must be lowercase words joined by hyphens');
    }
    if (fileName != null && fileName != '$id.json') {
      throw FormatException('Preset file "$fileName" must be named "$id.json"');
    }

    final labels = root['label'];
    if (labels is! Map<String, dynamic> || labels['en'] is! String) {
      throw FormatException('Preset $id needs a label with an "en" entry');
    }
    if (labels.values.any((value) => value is! String)) {
      throw FormatException('Preset $id has a label that is not text');
    }

    final accepts = root['accepts'];
    if (accepts is! List || accepts.isEmpty || accepts.any((value) => value is! String)) {
      throw FormatException('Preset $id needs "accepts" as a list of MIME patterns');
    }

    final output = root['output'];
    if (output is! Map<String, dynamic>) throw FormatException('Preset $id needs an "output"');

    final source = root['source'];
    final note = root['note'];
    if (source != null && source is! String) {
      throw FormatException('Preset $id: "source" must be text');
    }
    if (note != null && note is! String) throw FormatException('Preset $id: "note" must be text');

    return Preset(
      id: id,
      labels: labels.cast<String, String>(),
      accepts: accepts.cast<String>(),
      output: _parseOutput(id, output),
      source: source as String?,
      note: note as String?,
    );
  }

  static PresetOutput _parseOutput(String id, Map<String, dynamic> output) {
    final formatName = output['format'];
    final format = formatName is String ? FileKind.fromExtension(formatName) : null;
    if (format == null) throw FormatException('Preset $id has an unknown output format');

    int? positive(String key) {
      final value = output[key];
      if (value == null) return null;
      if (value is! int || value <= 0) {
        throw FormatException('Preset $id: "$key" must be a positive whole number');
      }
      return value;
    }

    final background = output['background'];
    if (background != null && background is! String) {
      throw FormatException('Preset $id: "background" must be text');
    }

    final cropName = output['crop'] ?? 'none';
    final crop = PresetCrop.values.where((value) => value.name == cropName).firstOrNull;
    if (crop == null) throw FormatException('Preset $id: "crop" must be none, user or auto');

    final minBytes = positive('minBytes');
    final maxBytes = positive('maxBytes');
    if (minBytes != null && maxBytes != null && minBytes > maxBytes) {
      throw FormatException('Preset $id: "minBytes" is more than "maxBytes"');
    }

    return PresetOutput(
      format: format,
      width: positive('width'),
      height: positive('height'),
      minBytes: minBytes,
      maxBytes: maxBytes,
      background: background as String?,
      crop: crop,
    );
  }
}
