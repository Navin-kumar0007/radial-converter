import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'words_en.dart';
import 'words_hi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of Words
/// returned by `Words.of(context)`.
///
/// Applications need to include `Words.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/words.dart';
///
/// return MaterialApp(
///   localizationsDelegates: Words.localizationsDelegates,
///   supportedLocales: Words.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the Words.supportedLocales
/// property.
abstract class Words {
  Words(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static Words of(BuildContext context) {
    return Localizations.of<Words>(context, Words)!;
  }

  static const LocalizationsDelegate<Words> delegate = _WordsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[Locale('en'), Locale('hi')];

  /// No description provided for @tagline.
  ///
  /// In en, this message translates to:
  /// **'Your files stay on this device.'**
  String get tagline;

  /// No description provided for @about.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get about;

  /// No description provided for @history.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get history;

  /// No description provided for @chooseFiles.
  ///
  /// In en, this message translates to:
  /// **'Choose files'**
  String get chooseFiles;

  /// No description provided for @chooseOtherFiles.
  ///
  /// In en, this message translates to:
  /// **'Choose other files'**
  String get chooseOtherFiles;

  /// No description provided for @receiving.
  ///
  /// In en, this message translates to:
  /// **'Getting what you shared...'**
  String get receiving;

  /// No description provided for @dropAnywhere.
  ///
  /// In en, this message translates to:
  /// **'or drop them anywhere here'**
  String get dropAnywhere;

  /// No description provided for @dropToConvert.
  ///
  /// In en, this message translates to:
  /// **'Drop to convert'**
  String get dropToConvert;

  /// No description provided for @saveAllBeside.
  ///
  /// In en, this message translates to:
  /// **'Save all beside the originals'**
  String get saveAllBeside;

  /// No description provided for @saveAllZip.
  ///
  /// In en, this message translates to:
  /// **'Save all as one ZIP'**
  String get saveAllZip;

  /// No description provided for @openMenuAgain.
  ///
  /// In en, this message translates to:
  /// **'Open the menu again'**
  String get openMenuAgain;

  /// No description provided for @modeConvert.
  ///
  /// In en, this message translates to:
  /// **'Convert'**
  String get modeConvert;

  /// No description provided for @modeTools.
  ///
  /// In en, this message translates to:
  /// **'Tools'**
  String get modeTools;

  /// No description provided for @fileCount.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 file} other{{count} files}}'**
  String fileCount(int count);

  /// No description provided for @andMore.
  ///
  /// In en, this message translates to:
  /// **'{first} and {count} more'**
  String andMore(Object first, int count);

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @share.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get share;

  /// No description provided for @copy.
  ///
  /// In en, this message translates to:
  /// **'Copy'**
  String get copy;

  /// No description provided for @showInFolder.
  ///
  /// In en, this message translates to:
  /// **'Show in folder'**
  String get showInFolder;

  /// No description provided for @undo.
  ///
  /// In en, this message translates to:
  /// **'Undo'**
  String get undo;

  /// No description provided for @converting.
  ///
  /// In en, this message translates to:
  /// **'Converting'**
  String get converting;

  /// No description provided for @done.
  ///
  /// In en, this message translates to:
  /// **'Done'**
  String get done;

  /// No description provided for @failed.
  ///
  /// In en, this message translates to:
  /// **'Failed'**
  String get failed;

  /// No description provided for @dragToApp.
  ///
  /// In en, this message translates to:
  /// **'Drag to another app'**
  String get dragToApp;

  /// No description provided for @more.
  ///
  /// In en, this message translates to:
  /// **'More'**
  String get more;

  /// No description provided for @moreActions.
  ///
  /// In en, this message translates to:
  /// **'More actions'**
  String get moreActions;

  /// No description provided for @ringRotateRight.
  ///
  /// In en, this message translates to:
  /// **'90° right'**
  String get ringRotateRight;

  /// No description provided for @ringRotateLeft.
  ///
  /// In en, this message translates to:
  /// **'90° left'**
  String get ringRotateLeft;

  /// No description provided for @ringMirror.
  ///
  /// In en, this message translates to:
  /// **'Mirror'**
  String get ringMirror;

  /// No description provided for @ringUpsideDown.
  ///
  /// In en, this message translates to:
  /// **'Upside down'**
  String get ringUpsideDown;

  /// No description provided for @ringHalf.
  ///
  /// In en, this message translates to:
  /// **'Half'**
  String get ringHalf;

  /// A choice on the outer ring, read out by screen readers, such as: Rotate, 180°
  ///
  /// In en, this message translates to:
  /// **'{action}, {choice}'**
  String ringChoice(String action, String choice);

  /// No description provided for @cancelFiles.
  ///
  /// In en, this message translates to:
  /// **'Cancel, {count} files'**
  String cancelFiles(int count);

  /// No description provided for @nothingFits.
  ///
  /// In en, this message translates to:
  /// **'Nothing fits'**
  String get nothingFits;

  /// In the menu's centre: how big a result came out when tried, such as About 85 KB.
  ///
  /// In en, this message translates to:
  /// **'About {size}'**
  String sizeAbout(String size);

  /// In the menu's centre: the most a size-limited result can be, such as Up to 100 KB.
  ///
  /// In en, this message translates to:
  /// **'Up to {size}'**
  String sizeUpTo(String size);

  /// No description provided for @trashMac.
  ///
  /// In en, this message translates to:
  /// **'the Trash'**
  String get trashMac;

  /// No description provided for @trashWindows.
  ///
  /// In en, this message translates to:
  /// **'the Recycle Bin'**
  String get trashWindows;

  /// No description provided for @movedTo.
  ///
  /// In en, this message translates to:
  /// **'Moved to {place}.'**
  String movedTo(Object place);

  /// No description provided for @couldNotMove.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be moved to {place}.'**
  String couldNotMove(Object name, Object place);

  /// No description provided for @undoFailed.
  ///
  /// In en, this message translates to:
  /// **'This could not be undone.'**
  String get undoFailed;

  /// No description provided for @showFailed.
  ///
  /// In en, this message translates to:
  /// **'This could not be shown.'**
  String get showFailed;

  /// No description provided for @openFailed.
  ///
  /// In en, this message translates to:
  /// **'These files could not be opened. Try again.'**
  String get openFailed;

  /// No description provided for @sharedNothing.
  ///
  /// In en, this message translates to:
  /// **'What was shared could not be opened. Only files can be converted.'**
  String get sharedNothing;

  /// No description provided for @sharedSome.
  ///
  /// In en, this message translates to:
  /// **'Some of what was shared could not be opened.'**
  String get sharedSome;

  /// No description provided for @folderNothing.
  ///
  /// In en, this message translates to:
  /// **'Nothing in that folder can be converted.'**
  String get folderNothing;

  /// No description provided for @folderTooMany.
  ///
  /// In en, this message translates to:
  /// **'Only the first {count} files in that folder were looked at.'**
  String folderTooMany(int count);

  /// No description provided for @folderLeftOut.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{1 other file in that folder was left out.} other{{count} other files in that folder were left out.}}'**
  String folderLeftOut(int count);

  /// No description provided for @fileTooLarge.
  ///
  /// In en, this message translates to:
  /// **'{name} is too large to convert here (limit {limit}).'**
  String fileTooLarge(Object name, Object limit);

  /// No description provided for @filesTooLarge.
  ///
  /// In en, this message translates to:
  /// **'These files are too large to convert together (limit {limit}). Try fewer at a time.'**
  String filesTooLarge(Object limit);

  /// No description provided for @convertFailed.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. This file could not be converted.'**
  String get convertFailed;

  /// No description provided for @readFailed.
  ///
  /// In en, this message translates to:
  /// **'This file could not be read. It may have moved or be too large.'**
  String get readFailed;

  /// No description provided for @saveFailed.
  ///
  /// In en, this message translates to:
  /// **'This file could not be saved. Try again.'**
  String get saveFailed;

  /// No description provided for @saveAllFailed.
  ///
  /// In en, this message translates to:
  /// **'These files could not be saved. Try again.'**
  String get saveAllFailed;

  /// No description provided for @handOverFailed.
  ///
  /// In en, this message translates to:
  /// **'This file could not be handed over. Try saving it instead.'**
  String get handOverFailed;

  /// No description provided for @sizeChange.
  ///
  /// In en, this message translates to:
  /// **'{before} to {after}'**
  String sizeChange(Object before, Object after);

  /// No description provided for @savedBeside.
  ///
  /// In en, this message translates to:
  /// **'Saved beside the original. {sizes}'**
  String savedBeside(Object sizes);

  /// No description provided for @saved.
  ///
  /// In en, this message translates to:
  /// **'Saved. {sizes}'**
  String saved(Object sizes);

  /// No description provided for @cantTogether.
  ///
  /// In en, this message translates to:
  /// **'These files can\'t be converted together in this build yet.'**
  String get cantTogether;

  /// No description provided for @unsupportedType.
  ///
  /// In en, this message translates to:
  /// **'This type of file isn\'t supported yet.'**
  String get unsupportedType;

  /// No description provided for @cantConvert.
  ///
  /// In en, this message translates to:
  /// **'{kind} can\'t be converted in this build yet.'**
  String cantConvert(Object kind);

  /// No description provided for @kindPdf.
  ///
  /// In en, this message translates to:
  /// **'PDF files'**
  String get kindPdf;

  /// No description provided for @kindVideo.
  ///
  /// In en, this message translates to:
  /// **'Videos on this device'**
  String get kindVideo;

  /// No description provided for @kindAudio.
  ///
  /// In en, this message translates to:
  /// **'Audio on this device'**
  String get kindAudio;

  /// No description provided for @kindDocument.
  ///
  /// In en, this message translates to:
  /// **'{format} documents'**
  String kindDocument(Object format);

  /// No description provided for @kindArchive.
  ///
  /// In en, this message translates to:
  /// **'{format} archives'**
  String kindArchive(Object format);

  /// No description provided for @kindFolder.
  ///
  /// In en, this message translates to:
  /// **'Folders'**
  String get kindFolder;

  /// No description provided for @kindPicture.
  ///
  /// In en, this message translates to:
  /// **'{format} pictures'**
  String kindPicture(Object format);

  /// No description provided for @kindSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Subtitles'**
  String get kindSubtitle;

  /// No description provided for @kindUnknown.
  ///
  /// In en, this message translates to:
  /// **'This file'**
  String get kindUnknown;

  /// No description provided for @today.
  ///
  /// In en, this message translates to:
  /// **'Today {time}'**
  String today(Object time);

  /// No description provided for @yesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday {time}'**
  String yesterday(Object time);

  /// No description provided for @clearHistoryTitle.
  ///
  /// In en, this message translates to:
  /// **'Clear history?'**
  String get clearHistoryTitle;

  /// No description provided for @clearHistoryBody.
  ///
  /// In en, this message translates to:
  /// **'This only clears the list. Your files stay where they are.'**
  String get clearHistoryBody;

  /// No description provided for @clear.
  ///
  /// In en, this message translates to:
  /// **'Clear'**
  String get clear;

  /// No description provided for @undoneLine.
  ///
  /// In en, this message translates to:
  /// **'Undone · {action} · {when}'**
  String undoneLine(Object action, Object when);

  /// No description provided for @historyEmpty.
  ///
  /// In en, this message translates to:
  /// **'What you save will be listed here for 30 days. It stays on this device.'**
  String get historyEmpty;

  /// No description provided for @licence.
  ///
  /// In en, this message translates to:
  /// **'Free and open source, under the Mozilla Public License 2.0.'**
  String get licence;

  /// No description provided for @privacyPromise.
  ///
  /// In en, this message translates to:
  /// **'Your files stay on this device. Nothing is uploaded, and there are no accounts, ads or tracking.'**
  String get privacyPromise;

  /// No description provided for @formPhoto.
  ///
  /// In en, this message translates to:
  /// **'Form photo'**
  String get formPhoto;

  /// No description provided for @fillInFrom.
  ///
  /// In en, this message translates to:
  /// **'Fill in from'**
  String get fillInFrom;

  /// No description provided for @myOwnSizes.
  ///
  /// In en, this message translates to:
  /// **'My own sizes'**
  String get myOwnSizes;

  /// No description provided for @widthPixels.
  ///
  /// In en, this message translates to:
  /// **'Width (pixels)'**
  String get widthPixels;

  /// No description provided for @heightPixels.
  ///
  /// In en, this message translates to:
  /// **'Height (pixels)'**
  String get heightPixels;

  /// No description provided for @atLeastKb.
  ///
  /// In en, this message translates to:
  /// **'At least (KB)'**
  String get atLeastKb;

  /// No description provided for @atMostKb.
  ///
  /// In en, this message translates to:
  /// **'At most (KB)'**
  String get atMostKb;

  /// No description provided for @checkNotice.
  ///
  /// In en, this message translates to:
  /// **'Rules change, so check these against your form\'s own notice.'**
  String get checkNotice;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @giveBoth.
  ///
  /// In en, this message translates to:
  /// **'Give both, or neither.'**
  String get giveBoth;

  /// No description provided for @theseAboveZero.
  ///
  /// In en, this message translates to:
  /// **'These must be above 0.'**
  String get theseAboveZero;

  /// No description provided for @theseTooLarge.
  ///
  /// In en, this message translates to:
  /// **'These are too large.'**
  String get theseTooLarge;

  /// No description provided for @smallestOverLargest.
  ///
  /// In en, this message translates to:
  /// **'The smallest can\'t be more than the largest.'**
  String get smallestOverLargest;

  /// No description provided for @thisAboveZero.
  ///
  /// In en, this message translates to:
  /// **'This must be above 0.'**
  String get thisAboveZero;

  /// No description provided for @fileLocked.
  ///
  /// In en, this message translates to:
  /// **'This file is locked'**
  String get fileLocked;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @showPassword.
  ///
  /// In en, this message translates to:
  /// **'Show password'**
  String get showPassword;

  /// No description provided for @hidePassword.
  ///
  /// In en, this message translates to:
  /// **'Hide password'**
  String get hidePassword;

  /// No description provided for @wrongPassword.
  ///
  /// In en, this message translates to:
  /// **'That password didn\'t work. Try again.'**
  String get wrongPassword;

  /// No description provided for @typePassword.
  ///
  /// In en, this message translates to:
  /// **'Type the password.'**
  String get typePassword;

  /// No description provided for @open.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get open;

  /// No description provided for @addPassword.
  ///
  /// In en, this message translates to:
  /// **'Add password'**
  String get addPassword;

  /// No description provided for @addPasswordWarning.
  ///
  /// In en, this message translates to:
  /// **'Nobody can open the result without it, and a lost password can\'t be recovered.'**
  String get addPasswordWarning;

  /// No description provided for @samePasswordAgain.
  ///
  /// In en, this message translates to:
  /// **'The same password again'**
  String get samePasswordAgain;

  /// No description provided for @choosePassword.
  ///
  /// In en, this message translates to:
  /// **'Choose a password.'**
  String get choosePassword;

  /// No description provided for @passwordsDiffer.
  ///
  /// In en, this message translates to:
  /// **'These don\'t match.'**
  String get passwordsDiffer;

  /// No description provided for @shiftTiming.
  ///
  /// In en, this message translates to:
  /// **'Shift timing'**
  String get shiftTiming;

  /// No description provided for @seconds.
  ///
  /// In en, this message translates to:
  /// **'Seconds'**
  String get seconds;

  /// No description provided for @secondsHint.
  ///
  /// In en, this message translates to:
  /// **'Enter a number of seconds, like 1.5.'**
  String get secondsHint;

  /// No description provided for @later.
  ///
  /// In en, this message translates to:
  /// **'Later'**
  String get later;

  /// No description provided for @earlier.
  ///
  /// In en, this message translates to:
  /// **'Earlier'**
  String get earlier;

  /// No description provided for @shift.
  ///
  /// In en, this message translates to:
  /// **'Shift'**
  String get shift;

  /// No description provided for @trim.
  ///
  /// In en, this message translates to:
  /// **'Trim'**
  String get trim;

  /// No description provided for @start.
  ///
  /// In en, this message translates to:
  /// **'Start'**
  String get start;

  /// No description provided for @end.
  ///
  /// In en, this message translates to:
  /// **'End'**
  String get end;

  /// No description provided for @emptyFromBeginning.
  ///
  /// In en, this message translates to:
  /// **'Empty means from the beginning'**
  String get emptyFromBeginning;

  /// No description provided for @emptyToEnd.
  ///
  /// In en, this message translates to:
  /// **'Empty means to the end'**
  String get emptyToEnd;

  /// No description provided for @useTime.
  ///
  /// In en, this message translates to:
  /// **'Use a time like 1:30.'**
  String get useTime;

  /// No description provided for @chooseStartOrEnd.
  ///
  /// In en, this message translates to:
  /// **'Choose where to start or end.'**
  String get chooseStartOrEnd;

  /// No description provided for @onlyThisLong.
  ///
  /// In en, this message translates to:
  /// **'This is only {length} long.'**
  String onlyThisLong(Object length);

  /// No description provided for @afterStart.
  ///
  /// In en, this message translates to:
  /// **'This must be after the start.'**
  String get afterStart;

  /// No description provided for @videoAtStart.
  ///
  /// In en, this message translates to:
  /// **'The video at the start'**
  String get videoAtStart;

  /// No description provided for @videoAtEnd.
  ///
  /// In en, this message translates to:
  /// **'The video at the end'**
  String get videoAtEnd;

  /// No description provided for @crop.
  ///
  /// In en, this message translates to:
  /// **'Crop'**
  String get crop;

  /// No description provided for @left.
  ///
  /// In en, this message translates to:
  /// **'Left'**
  String get left;

  /// No description provided for @top.
  ///
  /// In en, this message translates to:
  /// **'Top'**
  String get top;

  /// No description provided for @width.
  ///
  /// In en, this message translates to:
  /// **'Width'**
  String get width;

  /// No description provided for @height.
  ///
  /// In en, this message translates to:
  /// **'Height'**
  String get height;

  /// No description provided for @pictureNotShown.
  ///
  /// In en, this message translates to:
  /// **'This picture could not be shown.'**
  String get pictureNotShown;

  /// No description provided for @actionRotate.
  ///
  /// In en, this message translates to:
  /// **'Rotate'**
  String get actionRotate;

  /// No description provided for @actionMerge.
  ///
  /// In en, this message translates to:
  /// **'Merge'**
  String get actionMerge;

  /// No description provided for @actionEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get actionEmail;

  /// No description provided for @actionCompress.
  ///
  /// In en, this message translates to:
  /// **'Compress'**
  String get actionCompress;

  /// No description provided for @actionUnder.
  ///
  /// In en, this message translates to:
  /// **'Under {size}'**
  String actionUnder(Object size);

  /// No description provided for @actionTrim.
  ///
  /// In en, this message translates to:
  /// **'Trim'**
  String get actionTrim;

  /// No description provided for @actionStripMetadata.
  ///
  /// In en, this message translates to:
  /// **'Strip metadata'**
  String get actionStripMetadata;

  /// No description provided for @actionResize.
  ///
  /// In en, this message translates to:
  /// **'Resize'**
  String get actionResize;

  /// No description provided for @actionCrop.
  ///
  /// In en, this message translates to:
  /// **'Crop'**
  String get actionCrop;

  /// No description provided for @actionAddPassword.
  ///
  /// In en, this message translates to:
  /// **'Add password'**
  String get actionAddPassword;

  /// No description provided for @actionRemovePassword.
  ///
  /// In en, this message translates to:
  /// **'Remove password'**
  String get actionRemovePassword;

  /// No description provided for @actionWebReady.
  ///
  /// In en, this message translates to:
  /// **'Web-ready'**
  String get actionWebReady;

  /// No description provided for @actionSplit.
  ///
  /// In en, this message translates to:
  /// **'Split'**
  String get actionSplit;

  /// No description provided for @actionShiftTiming.
  ///
  /// In en, this message translates to:
  /// **'Shift timing'**
  String get actionShiftTiming;

  /// No description provided for @actionPlainText.
  ///
  /// In en, this message translates to:
  /// **'Plain text'**
  String get actionPlainText;

  /// No description provided for @actionOnePdf.
  ///
  /// In en, this message translates to:
  /// **'One PDF'**
  String get actionOnePdf;

  /// No description provided for @actionNormaliseVolume.
  ///
  /// In en, this message translates to:
  /// **'Normalise volume'**
  String get actionNormaliseVolume;

  /// No description provided for @actionMute.
  ///
  /// In en, this message translates to:
  /// **'Mute'**
  String get actionMute;

  /// No description provided for @actionFormPhoto.
  ///
  /// In en, this message translates to:
  /// **'Form photo'**
  String get actionFormPhoto;

  /// No description provided for @actionFlip.
  ///
  /// In en, this message translates to:
  /// **'Flip'**
  String get actionFlip;

  /// No description provided for @actionExtractPages.
  ///
  /// In en, this message translates to:
  /// **'Extract pages'**
  String get actionExtractPages;

  /// No description provided for @actionExtract.
  ///
  /// In en, this message translates to:
  /// **'Extract'**
  String get actionExtract;

  /// No description provided for @actionChangeBitrate.
  ///
  /// In en, this message translates to:
  /// **'Change bitrate'**
  String get actionChangeBitrate;

  /// No description provided for @cantShareHere.
  ///
  /// In en, this message translates to:
  /// **'{name} can\'t be shared here.'**
  String cantShareHere(Object name);

  /// No description provided for @cantHandOver.
  ///
  /// In en, this message translates to:
  /// **'{name} can\'t be handed over.'**
  String cantHandOver(Object name);

  /// No description provided for @noLongerThere.
  ///
  /// In en, this message translates to:
  /// **'{name} is no longer there.'**
  String noLongerThere(Object name);

  /// No description provided for @changedSince.
  ///
  /// In en, this message translates to:
  /// **'{name} has changed since, so it was left alone.'**
  String changedSince(Object name);

  /// No description provided for @needsPassword.
  ///
  /// In en, this message translates to:
  /// **'{name} needs a password to open. It stays on this device.'**
  String needsPassword(Object name);

  /// Short month names, in order, separated by commas with no spaces.
  ///
  /// In en, this message translates to:
  /// **'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'**
  String get months;

  /// No description provided for @actionExtractAudio.
  ///
  /// In en, this message translates to:
  /// **'Extract audio'**
  String get actionExtractAudio;

  /// No description provided for @actionCompressFolder.
  ///
  /// In en, this message translates to:
  /// **'Compress folder'**
  String get actionCompressFolder;

  /// No description provided for @failAVideoUnreadable.
  ///
  /// In en, this message translates to:
  /// **'A video could not be read.'**
  String get failAVideoUnreadable;

  /// No description provided for @failAddPasswordNeedsOne.
  ///
  /// In en, this message translates to:
  /// **'\"Add password\" needs a password.'**
  String get failAddPasswordNeedsOne;

  /// No description provided for @failAnimated.
  ///
  /// In en, this message translates to:
  /// **'Animated pictures can\'t be changed here yet: {name}.'**
  String failAnimated(Object name);

  /// No description provided for @failArchiveCantStart.
  ///
  /// In en, this message translates to:
  /// **'7z and RAR files could not start in this browser.'**
  String get failArchiveCantStart;

  /// No description provided for @failAudioFormat.
  ///
  /// In en, this message translates to:
  /// **'This audio format can\'t be written: {format}.'**
  String failAudioFormat(Object format);

  /// No description provided for @failBrowserCantMake.
  ///
  /// In en, this message translates to:
  /// **'This browser can\'t convert this file to that format.'**
  String get failBrowserCantMake;

  /// No description provided for @failBrowserCantRead.
  ///
  /// In en, this message translates to:
  /// **'This file could not be converted. It may use a format this browser can\'t read.'**
  String get failBrowserCantRead;

  /// No description provided for @failCantOpenOnComputer.
  ///
  /// In en, this message translates to:
  /// **'{name} can\'t be opened on this computer.'**
  String failCantOpenOnComputer(Object name);

  /// No description provided for @failCantRead.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read.'**
  String failCantRead(Object name);

  /// No description provided for @failCantSaveBeside.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be saved beside the original.'**
  String failCantSaveBeside(Object name);

  /// No description provided for @failCantShare.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be shared.'**
  String failCantShare(Object name);

  /// No description provided for @failCantUse.
  ///
  /// In en, this message translates to:
  /// **'\"{action}\" can\'t use {name}.'**
  String failCantUse(Object action, Object name);

  /// No description provided for @failCantUseFile.
  ///
  /// In en, this message translates to:
  /// **'\"{action}\" can\'t use this file.'**
  String failCantUseFile(Object action);

  /// No description provided for @failChooseTrim.
  ///
  /// In en, this message translates to:
  /// **'Choose where to trim.'**
  String get failChooseTrim;

  /// No description provided for @failCropNeeded.
  ///
  /// In en, this message translates to:
  /// **'\"Crop\" needs a crop area.'**
  String get failCropNeeded;

  /// No description provided for @failDamaged.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read. It may be damaged.'**
  String failDamaged(Object name);

  /// No description provided for @failDamagedOrLocked.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read. It may be damaged or have a password.'**
  String failDamagedOrLocked(Object name);

  /// No description provided for @failDamagedOrPart.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read. It may be damaged, or one part of several.'**
  String failDamagedOrPart(Object name);

  /// No description provided for @failDamagedOrTooLarge.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read. It may be damaged, or too large.'**
  String failDamagedOrTooLarge(Object name);

  /// No description provided for @failEditDoesntFit.
  ///
  /// In en, this message translates to:
  /// **'That edit does not fit this picture.'**
  String get failEditDoesntFit;

  /// No description provided for @failEmptyArchive.
  ///
  /// In en, this message translates to:
  /// **'{name} has no files in it.'**
  String failEmptyArchive(Object name);

  /// No description provided for @failFileDamaged.
  ///
  /// In en, this message translates to:
  /// **'This file could not be read. It may be damaged.'**
  String get failFileDamaged;

  /// No description provided for @failFileMoved.
  ///
  /// In en, this message translates to:
  /// **'This file could not be read. It may have moved.'**
  String get failFileMoved;

  /// No description provided for @failFileUnreadable.
  ///
  /// In en, this message translates to:
  /// **'This file could not be read.'**
  String get failFileUnreadable;

  /// No description provided for @failFinishSavingFirst.
  ///
  /// In en, this message translates to:
  /// **'Finish saving the other file first.'**
  String get failFinishSavingFirst;

  /// No description provided for @failFormNeeded.
  ///
  /// In en, this message translates to:
  /// **'\"Form photo\" needs to know what the form wants.'**
  String get failFormNeeded;

  /// No description provided for @failFormatNotYet.
  ///
  /// In en, this message translates to:
  /// **'This format can\'t be written yet.'**
  String get failFormatNotYet;

  /// No description provided for @failGoneBeforeSharing.
  ///
  /// In en, this message translates to:
  /// **'{name} is no longer here to share.'**
  String failGoneBeforeSharing(Object name);

  /// No description provided for @failHeicCantStart.
  ///
  /// In en, this message translates to:
  /// **'HEIC photos could not start in this browser.'**
  String get failHeicCantStart;

  /// No description provided for @failHeicNeedsAndroid9.
  ///
  /// In en, this message translates to:
  /// **'HEIC photos need Android 9 or newer.'**
  String get failHeicNeedsAndroid9;

  /// No description provided for @failLengthUnknown.
  ///
  /// In en, this message translates to:
  /// **'This video\'s length could not be read.'**
  String get failLengthUnknown;

  /// No description provided for @failLockedArchive.
  ///
  /// In en, this message translates to:
  /// **'{name} has a password. Locked 7z and RAR files can\'t be opened yet.'**
  String failLockedArchive(Object name);

  /// No description provided for @failNeedsFiles.
  ///
  /// In en, this message translates to:
  /// **'\"{action}\" needs at least {count} files.'**
  String failNeedsFiles(Object action, Object count);

  /// No description provided for @failNoAppTakesIt.
  ///
  /// In en, this message translates to:
  /// **'No app here can take this file.'**
  String get failNoAppTakesIt;

  /// No description provided for @failNoBitrate.
  ///
  /// In en, this message translates to:
  /// **'WAV and FLAC have no bitrate setting. Try MP3 or M4A.'**
  String get failNoBitrate;

  /// No description provided for @failNoFileMade.
  ///
  /// In en, this message translates to:
  /// **'The engine finished without making a file.'**
  String get failNoFileMade;

  /// No description provided for @failNoPages.
  ///
  /// In en, this message translates to:
  /// **'{name} has no pages.'**
  String failNoPages(Object name);

  /// No description provided for @failNoPasswordToRemove.
  ///
  /// In en, this message translates to:
  /// **'{name} has no password to remove.'**
  String failNoPasswordToRemove(Object name);

  /// No description provided for @failNoPictureToShow.
  ///
  /// In en, this message translates to:
  /// **'{name} has no picture to show here.'**
  String failNoPictureToShow(Object name);

  /// No description provided for @failNoSaveChooser.
  ///
  /// In en, this message translates to:
  /// **'This phone has no way to choose where to save.'**
  String get failNoSaveChooser;

  /// No description provided for @failNoSound.
  ///
  /// In en, this message translates to:
  /// **'This video has no sound.'**
  String get failNoSound;

  /// No description provided for @failNoSubtitles.
  ///
  /// In en, this message translates to:
  /// **'This file has no subtitles in it.'**
  String get failNoSubtitles;

  /// No description provided for @failNotAPicture.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read as a picture.'**
  String failNotAPicture(Object name);

  /// No description provided for @failNotConverted.
  ///
  /// In en, this message translates to:
  /// **'This file could not be converted.'**
  String get failNotConverted;

  /// No description provided for @failNotFound.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be found.'**
  String failNotFound(Object name);

  /// No description provided for @failNotSaved.
  ///
  /// In en, this message translates to:
  /// **'This file could not be saved.'**
  String get failNotSaved;

  /// No description provided for @failNotYet.
  ///
  /// In en, this message translates to:
  /// **'\"{action}\" is not available yet.'**
  String failNotYet(Object action);

  /// No description provided for @failOnePage.
  ///
  /// In en, this message translates to:
  /// **'{name} has only one page, so there is nothing to split.'**
  String failOnePage(Object name);

  /// No description provided for @failPageNotDrawn.
  ///
  /// In en, this message translates to:
  /// **'Page {page} of {name} could not be drawn.'**
  String failPageNotDrawn(Object page, Object name);

  /// No description provided for @failPagesFormat.
  ///
  /// In en, this message translates to:
  /// **'Pages look like 1-3,7.'**
  String get failPagesFormat;

  /// No description provided for @failPagesTooFull.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =1{This page has too much in it to fit \"{action}\" and still be readable. Try a larger limit, or Compress.} other{These {count} pages have too much in them to fit \"{action}\" and still be readable. Try a larger limit, or Compress.}}'**
  String failPagesTooFull(int count, Object action);

  /// No description provided for @failPasswordNeeded.
  ///
  /// In en, this message translates to:
  /// **'{name} has a password, so it wasn\'t opened.'**
  String failPasswordNeeded(Object name);

  /// No description provided for @failPasswordUnusable.
  ///
  /// In en, this message translates to:
  /// **'That password can\'t be used.'**
  String get failPasswordUnusable;

  /// No description provided for @failPdfAsSmall.
  ///
  /// In en, this message translates to:
  /// **'This PDF is already as small as it can usefully get.'**
  String get failPdfAsSmall;

  /// No description provided for @failPdfRotate.
  ///
  /// In en, this message translates to:
  /// **'PDFs rotate by 90, 180 or 270, not {degrees}.'**
  String failPdfRotate(Object degrees);

  /// No description provided for @failPdfShrinksTo.
  ///
  /// In en, this message translates to:
  /// **'This PDF only shrinks to {kb} KB, above the {limit} KB limit.'**
  String failPdfShrinksTo(Object kb, Object limit);

  /// No description provided for @failPhoneCantMake.
  ///
  /// In en, this message translates to:
  /// **'This phone can\'t make this kind of file at this size.'**
  String get failPhoneCantMake;

  /// No description provided for @failPhoneCantRead.
  ///
  /// In en, this message translates to:
  /// **'This phone can\'t read the video or sound in this file.'**
  String get failPhoneCantRead;

  /// No description provided for @failPhotoDamaged.
  ///
  /// In en, this message translates to:
  /// **'This photo could not be read. It may be damaged.'**
  String get failPhotoDamaged;

  /// No description provided for @failPictureRotate.
  ///
  /// In en, this message translates to:
  /// **'Pictures rotate by 90, 180 or 270, not {degrees}.'**
  String failPictureRotate(Object degrees);

  /// No description provided for @failPictureTooBig.
  ///
  /// In en, this message translates to:
  /// **'This picture could not be made small enough for \"{action}\".'**
  String failPictureTooBig(Object action);

  /// No description provided for @failPictureTooBigForForm.
  ///
  /// In en, this message translates to:
  /// **'This picture could not be made small enough for that size.'**
  String get failPictureTooBigForForm;

  /// No description provided for @failPointsOutside.
  ///
  /// In en, this message translates to:
  /// **'{name} has a file that points outside its folder, so it won\'t be opened.'**
  String failPointsOutside(Object name);

  /// No description provided for @failShiftNeeded.
  ///
  /// In en, this message translates to:
  /// **'\"Shift timing\" needs how far to shift.'**
  String get failShiftNeeded;

  /// No description provided for @failSmallestOverLargest.
  ///
  /// In en, this message translates to:
  /// **'The smallest size allowed is more than the largest.'**
  String get failSmallestOverLargest;

  /// No description provided for @failSomethingWrong.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. This file could not be converted.'**
  String get failSomethingWrong;

  /// No description provided for @failTooLargeForDevice.
  ///
  /// In en, this message translates to:
  /// **'{name} is too large to open on this device.'**
  String failTooLargeForDevice(Object name);

  /// No description provided for @failTooLargeHere.
  ///
  /// In en, this message translates to:
  /// **'{name} is too large to open here.'**
  String failTooLargeHere(Object name);

  /// No description provided for @failTooLongToFit.
  ///
  /// In en, this message translates to:
  /// **'This video is too long to fit under {size} MB.'**
  String failTooLongToFit(Object size);

  /// No description provided for @failTooManyInArchive.
  ///
  /// In en, this message translates to:
  /// **'{name} holds too many files to open here.'**
  String failTooManyInArchive(Object name);

  /// No description provided for @failTooManyToSave.
  ///
  /// In en, this message translates to:
  /// **'{name} has {count} files, too many to save one at a time. The limit is {limit}.'**
  String failTooManyToSave(Object name, Object count, Object limit);

  /// No description provided for @failTooMuchDetail.
  ///
  /// In en, this message translates to:
  /// **'This picture has too much detail to fit {kb} KB at {width} x {height}.'**
  String failTooMuchDetail(Object kb, Object width, Object height);

  /// No description provided for @failTrimLeavesNothing.
  ///
  /// In en, this message translates to:
  /// **'The trim leaves nothing.'**
  String get failTrimLeavesNothing;

  /// No description provided for @failTryMp4.
  ///
  /// In en, this message translates to:
  /// **'{name} could not be read. Try MP4 or MOV.'**
  String failTryMp4(Object name);

  /// No description provided for @failVideoCantStart.
  ///
  /// In en, this message translates to:
  /// **'Video could not start in this browser.'**
  String get failVideoCantStart;

  /// No description provided for @failVideoNoPicture.
  ///
  /// In en, this message translates to:
  /// **'This video has no picture to show here.'**
  String get failVideoNoPicture;

  /// No description provided for @failVideoRotate.
  ///
  /// In en, this message translates to:
  /// **'Videos rotate by 90, 180 or 270, not {degrees}.'**
  String failVideoRotate(Object degrees);

  /// No description provided for @failVideoTooBig.
  ///
  /// In en, this message translates to:
  /// **'This video could not be made small enough for \"{action}\".'**
  String failVideoTooBig(Object action);

  /// No description provided for @failWidthAndHeight.
  ///
  /// In en, this message translates to:
  /// **'Give both a width and a height, or neither.'**
  String get failWidthAndHeight;

  /// No description provided for @notePictures.
  ///
  /// In en, this message translates to:
  /// **'Pages are now pictures, so text can\'t be selected.'**
  String get notePictures;

  /// No description provided for @noteScanned.
  ///
  /// In en, this message translates to:
  /// **'This PDF is scanned, so its pages came in as pictures and can\'t be edited as text.'**
  String get noteScanned;

  /// No description provided for @noteSomePictures.
  ///
  /// In en, this message translates to:
  /// **'{count} of {total} pages are mostly pictures, so they came in that way. On the others, text, bold, simple tables and pictures came through, but not the exact layout.'**
  String noteSomePictures(Object count, Object total);

  /// No description provided for @noteTextEditable.
  ///
  /// In en, this message translates to:
  /// **'Text, bold, simple tables and pictures came through, ready to edit. The exact layout isn\'t kept.'**
  String get noteTextEditable;

  /// No description provided for @trayStillRunning.
  ///
  /// In en, this message translates to:
  /// **'ShiftDrop is still running'**
  String get trayStillRunning;

  /// No description provided for @trayHowToQuit.
  ///
  /// In en, this message translates to:
  /// **'Shift-drag keeps working. To quit, right-click this icon.'**
  String get trayHowToQuit;

  /// No description provided for @trayOpen.
  ///
  /// In en, this message translates to:
  /// **'Open ShiftDrop'**
  String get trayOpen;

  /// No description provided for @trayQuit.
  ///
  /// In en, this message translates to:
  /// **'Quit'**
  String get trayQuit;

  /// No description provided for @keepWorkingTitle.
  ///
  /// In en, this message translates to:
  /// **'Converting your files'**
  String get keepWorkingTitle;

  /// No description provided for @keepWorkingText.
  ///
  /// In en, this message translates to:
  /// **'You can use other apps. ShiftDrop keeps going and the result will be waiting.'**
  String get keepWorkingText;

  /// No description provided for @openAtLogin.
  ///
  /// In en, this message translates to:
  /// **'Open at login'**
  String get openAtLogin;

  /// No description provided for @openAtLoginWhy.
  ///
  /// In en, this message translates to:
  /// **'So Shift-drag works as soon as you sign in. It waits out of sight until you need it.'**
  String get openAtLoginWhy;

  /// No description provided for @openAtLoginApprove.
  ///
  /// In en, this message translates to:
  /// **'Allow ShiftDrop in System Settings, General, Login Items.'**
  String get openAtLoginApprove;

  /// No description provided for @welcomeTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to ShiftDrop'**
  String get welcomeTitle;

  /// No description provided for @welcomeText.
  ///
  /// In en, this message translates to:
  /// **'Convert, shrink and tidy files right here. Nothing is uploaded: every file stays on this device.'**
  String get welcomeText;

  /// No description provided for @welcomeSkip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get welcomeSkip;

  /// No description provided for @welcomeBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get welcomeBack;

  /// No description provided for @welcomeNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get welcomeNext;

  /// No description provided for @welcomeStart.
  ///
  /// In en, this message translates to:
  /// **'Start'**
  String get welcomeStart;

  /// No description provided for @practiceTitle.
  ///
  /// In en, this message translates to:
  /// **'Try it'**
  String get practiceTitle;

  /// No description provided for @practiceShiftDrag.
  ///
  /// In en, this message translates to:
  /// **'Hold Shift and drag the photo, then let go on a slice.'**
  String get practiceShiftDrag;

  /// No description provided for @practiceDrag.
  ///
  /// In en, this message translates to:
  /// **'Drag the photo, then let go on a slice.'**
  String get practiceDrag;

  /// No description provided for @practiceHoldShift.
  ///
  /// In en, this message translates to:
  /// **'Hold Shift while you drag.'**
  String get practiceHoldShift;

  /// No description provided for @practiceCancelled.
  ///
  /// In en, this message translates to:
  /// **'Nothing was chosen: the centre cancels. Try again, letting go on a slice.'**
  String get practiceCancelled;

  /// No description provided for @practiceDone.
  ///
  /// In en, this message translates to:
  /// **'Done: {name}, {size}.'**
  String practiceDone(Object name, Object size);

  /// No description provided for @practiceFailed.
  ///
  /// In en, this message translates to:
  /// **'That didn\'t work this time. You can still carry on.'**
  String get practiceFailed;

  /// No description provided for @practicePhoto.
  ///
  /// In en, this message translates to:
  /// **'A sample photo to practise on'**
  String get practicePhoto;

  /// No description provided for @tipMac.
  ///
  /// In en, this message translates to:
  /// **'It works the same from Finder, over any app: Shift-drag a file and let go on a slice. Hold Option as well for tools such as Compress, Rotate and Resize.'**
  String get tipMac;

  /// No description provided for @tipWindows.
  ///
  /// In en, this message translates to:
  /// **'It works the same from File Explorer, over any app: Shift-drag a file and let go on a slice. Hold Alt as well for tools such as Compress, Rotate and Resize.'**
  String get tipWindows;

  /// No description provided for @tipAndroid.
  ///
  /// In en, this message translates to:
  /// **'In other apps, tap Share, then ShiftDrop.'**
  String get tipAndroid;

  /// No description provided for @tipWeb.
  ///
  /// In en, this message translates to:
  /// **'Drop files on this page, or choose them. On an iPhone or iPad, open it in Safari, tap Share, then Add to Home Screen, and it works offline.'**
  String get tipWeb;

  /// No description provided for @choicesTitle.
  ///
  /// In en, this message translates to:
  /// **'A few choices'**
  String get choicesTitle;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @languageDevice.
  ///
  /// In en, this message translates to:
  /// **'As the device'**
  String get languageDevice;

  /// No description provided for @checkUpdates.
  ///
  /// In en, this message translates to:
  /// **'Check for new versions'**
  String get checkUpdates;

  /// No description provided for @checkUpdatesWhy.
  ///
  /// In en, this message translates to:
  /// **'Once a day, ShiftDrop asks its website whether a newer version is out. Nothing about you or your files is sent.'**
  String get checkUpdatesWhy;

  /// No description provided for @getNewest.
  ///
  /// In en, this message translates to:
  /// **'Get the newest version'**
  String get getNewest;

  /// No description provided for @getNewestWhy.
  ///
  /// In en, this message translates to:
  /// **'Opens the download page in your browser. ShiftDrop itself can\'t use the internet.'**
  String get getNewestWhy;

  /// No description provided for @updateReady.
  ///
  /// In en, this message translates to:
  /// **'ShiftDrop {version} is out.'**
  String updateReady(Object version);

  /// No description provided for @updateGet.
  ///
  /// In en, this message translates to:
  /// **'Download'**
  String get updateGet;

  /// No description provided for @updateLater.
  ///
  /// In en, this message translates to:
  /// **'Later'**
  String get updateLater;

  /// No description provided for @pageFailed.
  ///
  /// In en, this message translates to:
  /// **'Couldn\'t open the page. It\'s at {address}'**
  String pageFailed(Object address);

  /// No description provided for @showGuide.
  ///
  /// In en, this message translates to:
  /// **'Show the guide again'**
  String get showGuide;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @resultsWhere.
  ///
  /// In en, this message translates to:
  /// **'Where results go'**
  String get resultsWhere;

  /// No description provided for @resultsBeside.
  ///
  /// In en, this message translates to:
  /// **'Beside the original'**
  String get resultsBeside;

  /// No description provided for @resultsInFolder.
  ///
  /// In en, this message translates to:
  /// **'In one folder'**
  String get resultsInFolder;

  /// No description provided for @resultsFolderIs.
  ///
  /// In en, this message translates to:
  /// **'Results go in {folder}'**
  String resultsFolderIs(Object folder);

  /// No description provided for @resultsChange.
  ///
  /// In en, this message translates to:
  /// **'Change'**
  String get resultsChange;

  /// No description provided for @resultsFolderGone.
  ///
  /// In en, this message translates to:
  /// **'{folder} can\'t be used, so results went beside the originals. Choose another folder in Settings.'**
  String resultsFolderGone(Object folder);

  /// No description provided for @saveAllTo.
  ///
  /// In en, this message translates to:
  /// **'Save all in {folder}'**
  String saveAllTo(Object folder);

  /// No description provided for @savedIn.
  ///
  /// In en, this message translates to:
  /// **'Saved in {folder}. {sizes}'**
  String savedIn(Object folder, Object sizes);

  /// No description provided for @theme.
  ///
  /// In en, this message translates to:
  /// **'Theme'**
  String get theme;

  /// No description provided for @themeSystem.
  ///
  /// In en, this message translates to:
  /// **'As the system'**
  String get themeSystem;

  /// No description provided for @themeLight.
  ///
  /// In en, this message translates to:
  /// **'Light'**
  String get themeLight;

  /// No description provided for @themeDark.
  ///
  /// In en, this message translates to:
  /// **'Dark'**
  String get themeDark;

  /// No description provided for @showPreviews.
  ///
  /// In en, this message translates to:
  /// **'Show previews'**
  String get showPreviews;

  /// No description provided for @showPreviewsWhy.
  ///
  /// In en, this message translates to:
  /// **'A small picture of each file\'s first page, before and after. Made on this device and never kept.'**
  String get showPreviewsWhy;

  /// No description provided for @reorderTitle.
  ///
  /// In en, this message translates to:
  /// **'Put them in order'**
  String get reorderTitle;

  /// No description provided for @reorderHint.
  ///
  /// In en, this message translates to:
  /// **'They go together from top to bottom. Drag them, or use the arrows.'**
  String get reorderHint;

  /// No description provided for @reorderUp.
  ///
  /// In en, this message translates to:
  /// **'Move {name} up'**
  String reorderUp(Object name);

  /// No description provided for @reorderDown.
  ///
  /// In en, this message translates to:
  /// **'Move {name} down'**
  String reorderDown(Object name);
}

class _WordsDelegate extends LocalizationsDelegate<Words> {
  const _WordsDelegate();

  @override
  Future<Words> load(Locale locale) {
    return SynchronousFuture<Words>(lookupWords(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'hi'].contains(locale.languageCode);

  @override
  bool shouldReload(_WordsDelegate old) => false;
}

Words lookupWords(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return WordsEn();
    case 'hi':
      return WordsHi();
  }

  throw FlutterError(
    'Words.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
