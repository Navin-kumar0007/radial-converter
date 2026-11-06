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
  String cancelFiles(int count) {
    return 'Cancel, $count files';
  }

  @override
  String get nothingFits => 'Nothing fits';

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
}
