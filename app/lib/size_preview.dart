import 'dart:async';
import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'option_screens.dart';
import 'words.dart';

/// What the menu says a result will weigh: the most it can be, such as a size limit, or about what
/// it will be, from a trial or a video's bitrate and length.
class SizeGuess {
  const SizeGuess.upTo(this.bytes) : approximate = false;
  const SizeGuess.about(this.bytes) : approximate = true;

  final int bytes;

  /// True if the result will be about this, false if this is only the most it can be.
  final bool approximate;

  String describe(Words words) {
    final size = formatBytes(bytes);
    return approximate ? words.sizeAbout(size) : words.sizeUpTo(size);
  }

  @override
  bool operator ==(Object other) =>
      other is SizeGuess && other.bytes == bytes && other.approximate == approximate;

  @override
  int get hashCode => Object.hash(bytes, approximate);
}

/// Says how big a slice's result will be, or null if it can't tell.
typedef SizeGuesser = Future<SizeGuess?> Function(RadialAction action);

typedef TrialConverter = Future<List<PortableFile>> Function(
  RadialAction action,
  List<PortableFile> files,
);

/// Reads a video or audio file's length and codecs, as the trim screen does.
typedef MediaReader = Future<MediaInfo> Function(PickedFile file);

/// Trial runs for one picture, so the menu can show how big each result comes out. Choosing a
/// slice already tried takes its result instead of doing the work again.
///
/// Only pictures the pure-Dart engine handles, as they take a moment, while video takes minutes.
/// Video and sound are worked out instead, from their length and the plan every engine follows.
class SizePreviews {
  SizePreviews(this.file, this.kind, this._convert, {this.readMedia});

  final PickedFile file;
  final FileKind kind;
  final TrialConverter _convert;

  /// Null where video and sound can't be read, which leaves them their size limits.
  final MediaReader? readMedia;

  /// Larger pictures take too long to try on a hover.
  static const maxTrialBytes = 25 * 1024 * 1024;

  /// Results kept at once: each is a whole picture in memory.
  static const keep = 4;

  Future<Uint8List>? _bytes;
  Future<MediaInfo>? _media;
  final _trials = <String, Future<List<PortableFile>>>{};

  bool _canTry(RadialAction action) {
    return kind.family == FileFamily.image &&
        file.size <= maxTrialBytes &&
        !needsOptions(action) &&
        canRunPortably(action, kind);
  }

  /// A trial where there can be one, as "Up to 20 MB" says little about a small photo. Otherwise
  /// only a size limit, which the engines never go over.
  Future<SizeGuess?> guess(RadialAction action) async {
    final read = readMedia;
    if (read != null && canPlanMedia(action, kind)) return _guessMedia(action, read);
    if (!_canTry(action)) {
      final limit = action.maxBytes;
      return limit == null ? null : SizeGuess.upTo(limit);
    }
    try {
      final outputs = await _trial(action);
      if (outputs.isEmpty) return null;
      return SizeGuess.about(outputs.fold(0, (sum, output) => sum + output.bytes.length));
    } catch (_) {
      // The real run will say what went wrong, if it is chosen.
      return null;
    }
  }

  /// A size limit says the most there can be. Otherwise the plan says how the file is made, which
  /// gives its size when streams are kept or encoded at a set bitrate.
  Future<SizeGuess?> _guessMedia(RadialAction action, MediaReader readMedia) async {
    final limit = mediaSizeLimit(action, const ActionOptions());
    if (limit != null) return SizeGuess.upTo(limit);
    if (needsOptions(action)) return null;
    try {
      // Read once, as each slice asks.
      final media = _media ??= readMedia(file);
      final info = await media;
      final estimate = estimateMediaBytes(
        planMedia(action, kind, info).first,
        info,
        inputBytes: file.size,
      );
      if (estimate == null) return null;
      return estimate.atMost ? SizeGuess.upTo(estimate.bytes) : SizeGuess.about(estimate.bytes);
    } catch (_) {
      // The real run will say what went wrong, if it is chosen.
      return null;
    }
  }

  Future<List<PortableFile>> _trial(RadialAction action) {
    final started = _trials[action.id];
    if (started != null) return started;
    if (_trials.length >= keep) _trials.remove(_trials.keys.first);
    final trial = () async {
      final bytes = await (_bytes ??= file.read());
      return _convert(action, [PortableFile(file.name, bytes)]);
    }();
    // Errors reach whoever awaits it; this only stops an unwatched one from being reported.
    trial.ignore();
    return _trials[action.id] = trial;
  }

  /// The trial of [action] on [of], if one was started, handed over once.
  Future<List<PortableFile>>? take(RadialAction action, PickedFile of) {
    if (!identical(of, file)) return null;
    return _trials.remove(action.id);
  }
}
