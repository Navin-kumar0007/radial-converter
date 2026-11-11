// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'words.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class WordsEn extends Words {
  WordsEn([String locale = 'en']) : super(locale);

  @override
  String get tagline => 'Your files stay on this device.';

  @override
  String get about => 'About';

  @override
  String get history => 'History';

  @override
  String get chooseFiles => 'Choose files';

  @override
  String get chooseOtherFiles => 'Choose other files';

  @override
  String get receiving => 'Getting what you shared...';

  @override
  String get dropAnywhere => 'or drop them anywhere here';

  @override
  String get dropToConvert => 'Drop to convert';

  @override
  String get saveAllBeside => 'Save all beside the originals';

  @override
  String get saveAllZip => 'Save all as one ZIP';

  @override
  String get openMenuAgain => 'Open the menu again';

  @override
  String get modeConvert => 'Convert';

  @override
  String get modeTools => 'Tools';

  @override
  String fileCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count files',
      one: '1 file',
    );
    return '$_temp0';
  }

  @override
  String andMore(Object first, int count) {
    return '$first and $count more';
  }

  @override
  String get cancel => 'Cancel';

  @override
  String get save => 'Save';

  @override
  String get share => 'Share';

  @override
  String get copy => 'Copy';

  @override
  String get showInFolder => 'Show in folder';

  @override
  String get undo => 'Undo';

  @override
  String get converting => 'Converting';

  @override
  String get done => 'Done';

  @override
  String get failed => 'Failed';

  @override
  String get dragToApp => 'Drag to another app';

  @override
  String get more => 'More';

  @override
  String get moreActions => 'More actions';

  @override
  String get ringRotateRight => '90° right';

  @override
  String get ringRotateLeft => '90° left';

  @override
  String get ringMirror => 'Mirror';

  @override
  String get ringUpsideDown => 'Upside down';

  @override
  String get ringHalf => 'Half';

  @override
  String ringChoice(String action, String choice) {
    return '$action, $choice';
  }

  @override
  String cancelFiles(int count) {
    return 'Cancel, $count files';
  }

  @override
  String get nothingFits => 'Nothing fits';

  @override
  String sizeAbout(String size) {
    return 'About $size';
  }

  @override
  String sizeUpTo(String size) {
    return 'Up to $size';
  }

  @override
  String get trashMac => 'the Trash';

  @override
  String get trashWindows => 'the Recycle Bin';

  @override
  String movedTo(Object place) {
    return 'Moved to $place.';
  }

  @override
  String couldNotMove(Object name, Object place) {
    return '$name could not be moved to $place.';
  }

  @override
  String get undoFailed => 'This could not be undone.';

  @override
  String get showFailed => 'This could not be shown.';

  @override
  String get openFailed => 'These files could not be opened. Try again.';

  @override
  String get sharedNothing => 'What was shared could not be opened. Only files can be converted.';

  @override
  String get sharedSome => 'Some of what was shared could not be opened.';

  @override
  String get folderNothing => 'Nothing in that folder can be converted.';

  @override
  String folderTooMany(int count) {
    return 'Only the first $count files in that folder were looked at.';
  }

  @override
  String folderLeftOut(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count other files in that folder were left out.',
      one: '1 other file in that folder was left out.',
    );
    return '$_temp0';
  }

  @override
  String fileTooLarge(Object name, Object limit) {
    return '$name is too large to convert here (limit $limit).';
  }

  @override
  String filesTooLarge(Object limit) {
    return 'These files are too large to convert together (limit $limit). Try fewer at a time.';
  }

  @override
  String get convertFailed => 'Something went wrong. This file could not be converted.';

  @override
  String get readFailed => 'This file could not be read. It may have moved or be too large.';

  @override
  String get saveFailed => 'This file could not be saved. Try again.';

  @override
  String get saveAllFailed => 'These files could not be saved. Try again.';

  @override
  String get handOverFailed => 'This file could not be handed over. Try saving it instead.';

  @override
  String sizeChange(Object before, Object after) {
    return '$before to $after';
  }

  @override
  String savedBeside(Object sizes) {
    return 'Saved beside the original. $sizes';
  }

  @override
  String saved(Object sizes) {
    return 'Saved. $sizes';
  }

  @override
  String get cantTogether => 'These files can\'t be converted together in this build yet.';

  @override
  String get unsupportedType => 'This type of file isn\'t supported yet.';

  @override
  String cantConvert(Object kind) {
    return '$kind can\'t be converted in this build yet.';
  }

  @override
  String get kindPdf => 'PDF files';

  @override
  String get kindVideo => 'Videos on this device';

  @override
  String get kindAudio => 'Audio on this device';

  @override
  String kindDocument(Object format) {
    return '$format documents';
  }

  @override
  String kindArchive(Object format) {
    return '$format archives';
  }

  @override
  String get kindFolder => 'Folders';

  @override
  String kindPicture(Object format) {
    return '$format pictures';
  }

  @override
  String get kindSubtitle => 'Subtitles';

  @override
  String get kindUnknown => 'This file';

  @override
  String today(Object time) {
    return 'Today $time';
  }

  @override
  String yesterday(Object time) {
    return 'Yesterday $time';
  }

  @override
  String get clearHistoryTitle => 'Clear history?';

  @override
  String get clearHistoryBody => 'This only clears the list. Your files stay where they are.';

  @override
  String get clear => 'Clear';

  @override
  String undoneLine(Object action, Object when) {
    return 'Undone · $action · $when';
  }

  @override
  String get historyEmpty =>
      'What you save will be listed here for 30 days. It stays on this device.';

  @override
  String get licence => 'Free and open source, under the Mozilla Public License 2.0.';

  @override
  String get privacyPromise =>
      'Your files stay on this device. Nothing is uploaded, and there are no accounts, ads or tracking.';

  @override
  String get formPhoto => 'Form photo';

  @override
  String get fillInFrom => 'Fill in from';

  @override
  String get myOwnSizes => 'My own sizes';

  @override
  String get widthPixels => 'Width (pixels)';

  @override
  String get heightPixels => 'Height (pixels)';

  @override
  String get atLeastKb => 'At least (KB)';

  @override
  String get atMostKb => 'At most (KB)';

  @override
  String get checkNotice => 'Rules change, so check these against your form\'s own notice.';

  @override
  String get next => 'Next';

  @override
  String get giveBoth => 'Give both, or neither.';

  @override
  String get theseAboveZero => 'These must be above 0.';

  @override
  String get theseTooLarge => 'These are too large.';

  @override
  String get smallestOverLargest => 'The smallest can\'t be more than the largest.';

  @override
  String get thisAboveZero => 'This must be above 0.';

  @override
  String get fileLocked => 'This file is locked';

  @override
  String get password => 'Password';

  @override
  String get showPassword => 'Show password';

  @override
  String get hidePassword => 'Hide password';

  @override
  String get wrongPassword => 'That password didn\'t work. Try again.';

  @override
  String get typePassword => 'Type the password.';

  @override
  String get open => 'Open';

  @override
  String get addPassword => 'Add password';

  @override
  String get addPasswordWarning =>
      'Nobody can open the result without it, and a lost password can\'t be recovered.';

  @override
  String get samePasswordAgain => 'The same password again';

  @override
  String get choosePassword => 'Choose a password.';

  @override
  String get passwordsDiffer => 'These don\'t match.';

  @override
  String get shiftTiming => 'Shift timing';

  @override
  String get seconds => 'Seconds';

  @override
  String get secondsHint => 'Enter a number of seconds, like 1.5.';

  @override
  String get later => 'Later';

  @override
  String get earlier => 'Earlier';

  @override
  String get shift => 'Shift';

  @override
  String get trim => 'Trim';

  @override
  String get start => 'Start';

  @override
  String get end => 'End';

  @override
  String get emptyFromBeginning => 'Empty means from the beginning';

  @override
  String get emptyToEnd => 'Empty means to the end';

  @override
  String get useTime => 'Use a time like 1:30.';

  @override
  String get chooseStartOrEnd => 'Choose where to start or end.';

  @override
  String onlyThisLong(Object length) {
    return 'This is only $length long.';
  }

  @override
  String get afterStart => 'This must be after the start.';

  @override
  String get videoAtStart => 'The video at the start';

  @override
  String get videoAtEnd => 'The video at the end';

  @override
  String get crop => 'Crop';

  @override
  String get left => 'Left';

  @override
  String get top => 'Top';

  @override
  String get width => 'Width';

  @override
  String get height => 'Height';

  @override
  String get pictureNotShown => 'This picture could not be shown.';

  @override
  String get actionRotate => 'Rotate';

  @override
  String get actionMerge => 'Merge';

  @override
  String get actionEmail => 'Email';

  @override
  String get actionCompress => 'Compress';

  @override
  String actionUnder(Object size) {
    return 'Under $size';
  }

  @override
  String get actionTrim => 'Trim';

  @override
  String get actionStripMetadata => 'Strip metadata';

  @override
  String get actionResize => 'Resize';

  @override
  String get actionCrop => 'Crop';

  @override
  String get actionAddPassword => 'Add password';

  @override
  String get actionRemovePassword => 'Remove password';

  @override
  String get actionWebReady => 'Web-ready';

  @override
  String get actionSplit => 'Split';

  @override
  String get actionShiftTiming => 'Shift timing';

  @override
  String get actionPlainText => 'Plain text';

  @override
  String get actionOnePdf => 'One PDF';

  @override
  String get actionNormaliseVolume => 'Normalise volume';

  @override
  String get actionMute => 'Mute';

  @override
  String get actionFormPhoto => 'Form photo';

  @override
  String get actionFlip => 'Flip';

  @override
  String get actionExtractPages => 'Extract pages';

  @override
  String get actionExtract => 'Extract';

  @override
  String get actionChangeBitrate => 'Change bitrate';

  @override
  String cantShareHere(Object name) {
    return '$name can\'t be shared here.';
  }

  @override
  String cantHandOver(Object name) {
    return '$name can\'t be handed over.';
  }

  @override
  String noLongerThere(Object name) {
    return '$name is no longer there.';
  }

  @override
  String changedSince(Object name) {
    return '$name has changed since, so it was left alone.';
  }

  @override
  String needsPassword(Object name) {
    return '$name needs a password to open. It stays on this device.';
  }

  @override
  String get months => 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec';

  @override
  String get actionExtractAudio => 'Extract audio';

  @override
  String get actionCompressFolder => 'Compress folder';

  @override
  String get failAVideoUnreadable => 'A video could not be read.';

  @override
  String get failAddPasswordNeedsOne => '\"Add password\" needs a password.';

  @override
  String failAnimated(Object name) {
    return 'Animated pictures can\'t be changed here yet: $name.';
  }

  @override
  String get failArchiveCantStart => '7z and RAR files could not start in this browser.';

  @override
  String failAudioFormat(Object format) {
    return 'This audio format can\'t be written: $format.';
  }

  @override
  String get failBrowserCantMake => 'This browser can\'t convert this file to that format.';

  @override
  String get failBrowserCantRead =>
      'This file could not be converted. It may use a format this browser can\'t read.';

  @override
  String failCantOpenOnComputer(Object name) {
    return '$name can\'t be opened on this computer.';
  }

  @override
  String failCantRead(Object name) {
    return '$name could not be read.';
  }

  @override
  String failCantSaveBeside(Object name) {
    return '$name could not be saved beside the original.';
  }

  @override
  String failCantShare(Object name) {
    return '$name could not be shared.';
  }

  @override
  String failCantUse(Object action, Object name) {
    return '\"$action\" can\'t use $name.';
  }

  @override
  String failCantUseFile(Object action) {
    return '\"$action\" can\'t use this file.';
  }

  @override
  String get failChooseTrim => 'Choose where to trim.';

  @override
  String get failCropNeeded => '\"Crop\" needs a crop area.';

  @override
  String failDamaged(Object name) {
    return '$name could not be read. It may be damaged.';
  }

  @override
  String failDamagedOrLocked(Object name) {
    return '$name could not be read. It may be damaged or have a password.';
  }

  @override
  String failDamagedOrPart(Object name) {
    return '$name could not be read. It may be damaged, or one part of several.';
  }

  @override
  String failDamagedOrTooLarge(Object name) {
    return '$name could not be read. It may be damaged, or too large.';
  }

  @override
  String get failEditDoesntFit => 'That edit does not fit this picture.';

  @override
  String failEmptyArchive(Object name) {
    return '$name has no files in it.';
  }

  @override
  String get failFileDamaged => 'This file could not be read. It may be damaged.';

  @override
  String get failFileMoved => 'This file could not be read. It may have moved.';

  @override
  String get failFileUnreadable => 'This file could not be read.';

  @override
  String get failFinishSavingFirst => 'Finish saving the other file first.';

  @override
  String get failFormNeeded => '\"Form photo\" needs to know what the form wants.';

  @override
  String get failFormatNotYet => 'This format can\'t be written yet.';

  @override
  String failGoneBeforeSharing(Object name) {
    return '$name is no longer here to share.';
  }

  @override
  String get failHeicCantStart => 'HEIC photos could not start in this browser.';

  @override
  String get failHeicNeedsAndroid9 => 'HEIC photos need Android 9 or newer.';

  @override
  String get failLengthUnknown => 'This video\'s length could not be read.';

  @override
  String failLockedArchive(Object name) {
    return '$name has a password. Locked 7z and RAR files can\'t be opened yet.';
  }

  @override
  String failNeedsFiles(Object action, Object count) {
    return '\"$action\" needs at least $count files.';
  }

  @override
  String get failNoAppTakesIt => 'No app here can take this file.';

  @override
  String get failNoBitrate => 'WAV and FLAC have no bitrate setting. Try MP3 or M4A.';

  @override
  String get failNoFileMade => 'The engine finished without making a file.';

  @override
  String failNoPages(Object name) {
    return '$name has no pages.';
  }

  @override
  String failNoPasswordToRemove(Object name) {
    return '$name has no password to remove.';
  }

  @override
  String failNoPictureToShow(Object name) {
    return '$name has no picture to show here.';
  }

  @override
  String get failNoSaveChooser => 'This phone has no way to choose where to save.';

  @override
  String get failNoSound => 'This video has no sound.';

  @override
  String get failNoSubtitles => 'This file has no subtitles in it.';

  @override
  String failNotAPicture(Object name) {
    return '$name could not be read as a picture.';
  }

  @override
  String get failNotConverted => 'This file could not be converted.';

  @override
  String failNotFound(Object name) {
    return '$name could not be found.';
  }

  @override
  String get failNotSaved => 'This file could not be saved.';

  @override
  String failNotYet(Object action) {
    return '\"$action\" is not available yet.';
  }

  @override
  String failOnePage(Object name) {
    return '$name has only one page, so there is nothing to split.';
  }

  @override
  String failPageNotDrawn(Object page, Object name) {
    return 'Page $page of $name could not be drawn.';
  }

  @override
  String get failPagesFormat => 'Pages look like 1-3,7.';

  @override
  String failPagesTooFull(int count, Object action) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other:
          'These $count pages have too much in them to fit \"$action\" and still be readable. Try a larger limit, or Compress.',
      one:
          'This page has too much in it to fit \"$action\" and still be readable. Try a larger limit, or Compress.',
    );
    return '$_temp0';
  }

  @override
  String failPasswordNeeded(Object name) {
    return '$name has a password, so it wasn\'t opened.';
  }

  @override
  String get failPasswordUnusable => 'That password can\'t be used.';

  @override
  String get failPdfAsSmall => 'This PDF is already as small as it can usefully get.';

  @override
  String failPdfRotate(Object degrees) {
    return 'PDFs rotate by 90, 180 or 270, not $degrees.';
  }

  @override
  String failPdfShrinksTo(Object kb, Object limit) {
    return 'This PDF only shrinks to $kb KB, above the $limit KB limit.';
  }

  @override
  String get failPhoneCantMake => 'This phone can\'t make this kind of file at this size.';

  @override
  String get failPhoneCantRead => 'This phone can\'t read the video or sound in this file.';

  @override
  String get failPhotoDamaged => 'This photo could not be read. It may be damaged.';

  @override
  String failPictureRotate(Object degrees) {
    return 'Pictures rotate by 90, 180 or 270, not $degrees.';
  }

  @override
  String failPictureTooBig(Object action) {
    return 'This picture could not be made small enough for \"$action\".';
  }

  @override
  String get failPictureTooBigForForm =>
      'This picture could not be made small enough for that size.';

  @override
  String failPointsOutside(Object name) {
    return '$name has a file that points outside its folder, so it won\'t be opened.';
  }

  @override
  String get failShiftNeeded => '\"Shift timing\" needs how far to shift.';

  @override
  String get failSmallestOverLargest => 'The smallest size allowed is more than the largest.';

  @override
  String get failSomethingWrong => 'Something went wrong. This file could not be converted.';

  @override
  String failTooLargeForDevice(Object name) {
    return '$name is too large to open on this device.';
  }

  @override
  String failTooLargeHere(Object name) {
    return '$name is too large to open here.';
  }

  @override
  String failTooLongToFit(Object size) {
    return 'This video is too long to fit under $size MB.';
  }

  @override
  String failTooManyInArchive(Object name) {
    return '$name holds too many files to open here.';
  }

  @override
  String failTooManyToSave(Object name, Object count, Object limit) {
    return '$name has $count files, too many to save one at a time. The limit is $limit.';
  }

  @override
  String failTooMuchDetail(Object kb, Object width, Object height) {
    return 'This picture has too much detail to fit $kb KB at $width x $height.';
  }

  @override
  String get failTrimLeavesNothing => 'The trim leaves nothing.';

  @override
  String failTryMp4(Object name) {
    return '$name could not be read. Try MP4 or MOV.';
  }

  @override
  String get failVideoCantStart => 'Video could not start in this browser.';

  @override
  String get failVideoNoPicture => 'This video has no picture to show here.';

  @override
  String failVideoRotate(Object degrees) {
    return 'Videos rotate by 90, 180 or 270, not $degrees.';
  }

  @override
  String failVideoTooBig(Object action) {
    return 'This video could not be made small enough for \"$action\".';
  }

  @override
  String get failWidthAndHeight => 'Give both a width and a height, or neither.';

  @override
  String get notePictures => 'Pages are now pictures, so text can\'t be selected.';

  @override
  String get noteScanned =>
      'This PDF is scanned, so its pages came in as pictures and can\'t be edited as text.';

  @override
  String noteSomePictures(Object count, Object total) {
    return '$count of $total pages are mostly pictures, so they came in that way. On the others, simple tables come through, but pictures and exact layout aren\'t kept.';
  }

  @override
  String get noteTextEditable =>
      'The text and simple tables can be edited. Pictures and exact layout aren\'t kept.';

  @override
  String get trayStillRunning => 'ShiftDrop is still running';

  @override
  String get trayHowToQuit => 'Shift-drag keeps working. To quit, right-click this icon.';

  @override
  String get trayOpen => 'Open ShiftDrop';

  @override
  String get trayQuit => 'Quit';

  @override
  String get keepWorkingTitle => 'Converting your files';

  @override
  String get keepWorkingText =>
      'You can use other apps. ShiftDrop keeps going and the result will be waiting.';

  @override
  String get openAtLogin => 'Open at login';

  @override
  String get openAtLoginWhy =>
      'So Shift-drag works as soon as you sign in. It waits out of sight until you need it.';

  @override
  String get openAtLoginApprove => 'Allow ShiftDrop in System Settings, General, Login Items.';
}
