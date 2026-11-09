import 'dart:async';
import 'dart:typed_data';

import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'option_screens.dart';
import 'words.dart';

/// What the menu says a result will weigh: the most a size limit allows, or what a trial made.
class SizeGuess {
  const SizeGuess.upTo(this.bytes) : tried = false;
  const SizeGuess.about(this.bytes) : tried = true;

  final int bytes;

  /// True if this came from really converting, false if it is the limit the action promises.
  final bool tried;

  String describe(Words words) {
    final size = formatBytes(bytes);
    return tried ? words.sizeAbout(size) : words.sizeUpTo(size);
  }

  @override
  bool operator ==(Object other) =>
      other is SizeGuess && other.bytes == bytes && other.tried == tried;

  @override
  int get hashCode => Object.hash(bytes, tried);
}

/// Says how big a slice's result will be, or null if it can't tell.
typedef SizeGuesser = Future<SizeGuess?> Function(RadialAction action);

typedef TrialConverter = Future<List<PortableFile>> Function(
  RadialAction action,
  List<PortableFile> files,
);

/// Trial runs for one picture, so the menu can show how big each result comes out. Choosing a
/// slice already tried takes its result instead of doing the work again.
///
/// Only pictures the pure-Dart engine handles, as they take a moment, while video takes minutes.
class SizePreviews {
  SizePreviews(this.file, this.kind, this._convert);

  final PickedFile file;
  final FileKind kind;
  final TrialConverter _convert;

  /// Larger pictures take too long to try on a hover.
  static const maxTrialBytes = 25 * 1024 * 1024;

  /// Results kept at once: each is a whole picture in memory.
  static const keep = 4;

  Future<Uint8List>? _bytes;
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
