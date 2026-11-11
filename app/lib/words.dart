import 'dart:ui';

import 'package:flutter/widgets.dart';
import 'package:radial_core/radial_core.dart';

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

/// A choice on the outer ring, in [words]' language. Angles and pixel sizes read the same everywhere.
String ringChoiceLabel(Words words, RingChoice choice) {
  return switch (choice.key) {
    'rotateRight' => words.ringRotateRight,
    'rotateLeft' => words.ringRotateLeft,
    'flipSideways' => words.ringMirror,
    'flipUpsideDown' => words.ringUpsideDown,
    'resizeHalf' => words.ringHalf,
    _ => choice.label,
  };
}

/// Why a job failed, in [words]' language. Failures name their message from `Fail` in core, with
/// what fills its blanks; one that doesn't, or a message this app has no words for, stays as it was
/// written.
String failureText(Words words, EngineFailed failure) {
  String blank(String name) => failure.args[name] ?? '';
  int number(String name) => int.tryParse(blank(name)) ?? 0;
  final action = actionLabel(words, blank('action'));
  return switch (failure.key) {
    'aVideoUnreadable' => words.failAVideoUnreadable,
    'addPasswordNeedsOne' => words.failAddPasswordNeedsOne,
    'animated' => words.failAnimated(blank('name')),
    'archiveCantStart' => words.failArchiveCantStart,
    'audioFormat' => words.failAudioFormat(blank('format')),
    'browserCantMake' => words.failBrowserCantMake,
    'browserCantRead' => words.failBrowserCantRead,
    'cantOpenOnComputer' => words.failCantOpenOnComputer(blank('name')),
    'cantRead' => words.failCantRead(blank('name')),
    'cantSaveBeside' => words.failCantSaveBeside(blank('name')),
    'cantShare' => words.failCantShare(blank('name')),
    'cantUse' => words.failCantUse(action, blank('name')),
    'cantUseFile' => words.failCantUseFile(action),
    'chooseTrim' => words.failChooseTrim,
    'cropNeeded' => words.failCropNeeded,
    'damaged' => words.failDamaged(blank('name')),
    'damagedOrLocked' => words.failDamagedOrLocked(blank('name')),
    'damagedOrPart' => words.failDamagedOrPart(blank('name')),
    'damagedOrTooLarge' => words.failDamagedOrTooLarge(blank('name')),
    'editDoesntFit' => words.failEditDoesntFit,
    'emptyArchive' => words.failEmptyArchive(blank('name')),
    'fileDamaged' => words.failFileDamaged,
    'fileMoved' => words.failFileMoved,
    'fileUnreadable' => words.failFileUnreadable,
    'finishSavingFirst' => words.failFinishSavingFirst,
    'formNeeded' => words.failFormNeeded,
    'formatNotYet' => words.failFormatNotYet,
    'goneBeforeSharing' => words.failGoneBeforeSharing(blank('name')),
    'heicCantStart' => words.failHeicCantStart,
    'heicNeedsAndroid9' => words.failHeicNeedsAndroid9,
    'lengthUnknown' => words.failLengthUnknown,
    'lockedArchive' => words.failLockedArchive(blank('name')),
    'needsFiles' => words.failNeedsFiles(action, blank('count')),
    'noAppTakesIt' => words.failNoAppTakesIt,
    'noBitrate' => words.failNoBitrate,
    'noFileMade' => words.failNoFileMade,
    'noPages' => words.failNoPages(blank('name')),
    'noPasswordToRemove' => words.failNoPasswordToRemove(blank('name')),
    'noPictureToShow' => words.failNoPictureToShow(blank('name')),
    'noSaveChooser' => words.failNoSaveChooser,
    'noSound' => words.failNoSound,
    'noSubtitles' => words.failNoSubtitles,
    'notAPicture' => words.failNotAPicture(blank('name')),
    'notConverted' => words.failNotConverted,
    'notFound' => words.failNotFound(blank('name')),
    'notSaved' => words.failNotSaved,
    'notYet' => words.failNotYet(action),
    'onePage' => words.failOnePage(blank('name')),
    'pageNotDrawn' => words.failPageNotDrawn(blank('page'), blank('name')),
    'pagesFormat' => words.failPagesFormat,
    'pagesTooFull' => words.failPagesTooFull(number('count'), action),
    'passwordNeeded' => words.failPasswordNeeded(blank('name')),
    'passwordUnusable' => words.failPasswordUnusable,
    'pdfAsSmall' => words.failPdfAsSmall,
    'pdfRotate' => words.failPdfRotate(blank('degrees')),
    'pdfShrinksTo' => words.failPdfShrinksTo(blank('kb'), blank('limit')),
    'phoneCantMake' => words.failPhoneCantMake,
    'phoneCantRead' => words.failPhoneCantRead,
    'photoDamaged' => words.failPhotoDamaged,
    'pictureRotate' => words.failPictureRotate(blank('degrees')),
    'pictureTooBig' => words.failPictureTooBig(action),
    'pictureTooBigForForm' => words.failPictureTooBigForForm,
    'pointsOutside' => words.failPointsOutside(blank('name')),
    'shiftNeeded' => words.failShiftNeeded,
    'smallestOverLargest' => words.failSmallestOverLargest,
    'somethingWrong' => words.failSomethingWrong,
    'tooLargeForDevice' => words.failTooLargeForDevice(blank('name')),
    'tooLargeHere' => words.failTooLargeHere(blank('name')),
    'tooLongToFit' => words.failTooLongToFit(blank('size')),
    'tooManyInArchive' => words.failTooManyInArchive(blank('name')),
    'tooManyToSave' => words.failTooManyToSave(blank('name'), blank('count'), blank('limit')),
    'tooMuchDetail' => words.failTooMuchDetail(blank('kb'), blank('width'), blank('height')),
    'trimLeavesNothing' => words.failTrimLeavesNothing,
    'tryMp4' => words.failTryMp4(blank('name')),
    'videoCantStart' => words.failVideoCantStart,
    'videoNoPicture' => words.failVideoNoPicture,
    'videoRotate' => words.failVideoRotate(blank('degrees')),
    'videoTooBig' => words.failVideoTooBig(action),
    'widthAndHeight' => words.failWidthAndHeight,
    _ => failure.message,
  };
}
