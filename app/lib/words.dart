import 'dart:ui';

import 'package:flutter/widgets.dart';

import 'l10n/words.dart';

export 'l10n/words.dart';

extension WordsOf on BuildContext {
  /// The text on screen, in the language the device asks for.
  Words get words => Words.of(this);
}

/// For code with no screen to ask, such as the Shift-drag menu and engines.
Words get deviceWords => wordsFor(PlatformDispatcher.instance.locale);

/// English for any language there's no translation for.
Words wordsFor(Locale locale) =>
    lookupWords(Words.delegate.isSupported(locale) ? locale : const Locale('en'));

/// An action's label from the catalogue, in the screen's language. The catalogue and history keep
/// English, so this works on both. Format names such as PNG are the same everywhere.
String actionLabel(Words words, String label) {
  final under = RegExp(r'^Under (.+)$').firstMatch(label);
  if (under != null) return words.actionUnder(under.group(1)!);
  return switch (label) {
    'Rotate' => words.actionRotate,
    'Merge' => words.actionMerge,
    'Email' => words.actionEmail,
    'Compress' => words.actionCompress,
    'Trim' => words.actionTrim,
    'Strip metadata' => words.actionStripMetadata,
    'Resize' => words.actionResize,
    'Crop' => words.actionCrop,
    'Add password' => words.actionAddPassword,
    'Remove password' => words.actionRemovePassword,
    'Web-ready' => words.actionWebReady,
    'Split' => words.actionSplit,
    'Shift timing' => words.actionShiftTiming,
    'Plain text' => words.actionPlainText,
    'One PDF' => words.actionOnePdf,
    'Normalise volume' => words.actionNormaliseVolume,
    'Mute' => words.actionMute,
    'Form photo' => words.actionFormPhoto,
    'Flip' => words.actionFlip,
    'Extract pages' => words.actionExtractPages,
    'Extract' => words.actionExtract,
    'Extract audio' => words.actionExtractAudio,
    'Compress folder' => words.actionCompressFolder,
    'Change bitrate' => words.actionChangeBitrate,
    _ => label,
  };
}
