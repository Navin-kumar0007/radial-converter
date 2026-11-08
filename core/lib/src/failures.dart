import 'action_options.dart';

/// Every way a job can fail, each with a key and the blanks it fills, so the app can say it in the
/// user's language. The English here is what the command-line tool shows, and what the app falls
/// back to. `action` blanks hold an action's English label, which the app translates too.
abstract final class Fail {
  static EngineFailed _say(String key, String english, [Map<String, String> args = const {}]) =>
      EngineFailed(english, key: key, args: args);

  // Files that can't be read or opened.
  static EngineFailed cantRead(String name) =>
      _say('cantRead', '$name could not be read.', {'name': name});
  static EngineFailed damaged(String name) =>
      _say('damaged', '$name could not be read. It may be damaged.', {'name': name});
  static EngineFailed damagedOrLocked(String name) => _say(
    'damagedOrLocked',
    '$name could not be read. It may be damaged or have a password.',
    {'name': name},
  );
  static EngineFailed damagedOrPart(String name) => _say(
    'damagedOrPart',
    '$name could not be read. It may be damaged, or one part of several.',
    {'name': name},
  );
  static EngineFailed tryMp4(String name) =>
      _say('tryMp4', '$name could not be read. Try MP4 or MOV.', {'name': name});
  static EngineFailed notFound(String name) =>
      _say('notFound', '$name could not be found.', {'name': name});
  static EngineFailed notAPicture(String name) =>
      _say('notAPicture', '$name could not be read as a picture.', {'name': name});
  static EngineFailed tooLargeHere(String name) =>
      _say('tooLargeHere', '$name is too large to open here.', {'name': name});
  static EngineFailed tooLargeForDevice(String name) =>
      _say('tooLargeForDevice', '$name is too large to open on this device.', {'name': name});
  static EngineFailed cantOpenOnComputer(String name) =>
      _say('cantOpenOnComputer', '$name can\'t be opened on this computer.', {'name': name});
  static const fileUnreadable = EngineFailed('This file could not be read.', key: 'fileUnreadable');
  static const fileDamaged = EngineFailed(
    'This file could not be read. It may be damaged.',
    key: 'fileDamaged',
  );
  static const photoDamaged = EngineFailed(
    'This photo could not be read. It may be damaged.',
    key: 'photoDamaged',
  );
  static const notConverted = EngineFailed(
    'This file could not be converted.',
    key: 'notConverted',
  );

  // Archives.
  static EngineFailed emptyArchive(String name) =>
      _say('emptyArchive', '$name has no files in it.', {'name': name});
  static EngineFailed tooManyInArchive(String name) =>
      _say('tooManyInArchive', '$name holds too many files to open here.', {'name': name});
  static EngineFailed tooManyToSave(String name, int count, int limit) => _say(
    'tooManyToSave',
    '$name has $count files, too many to save one at a time. The limit is $limit.',
    {'name': name, 'count': '$count', 'limit': '$limit'},
  );
  static EngineFailed pointsOutside(String name) => _say(
    'pointsOutside',
    '$name has a file that points outside its folder, so it won\'t be opened.',
    {'name': name},
  );
  static EngineFailed lockedArchive(String name) => _say(
    'lockedArchive',
    '$name has a password. Locked 7z and RAR files can\'t be opened yet.',
    {'name': name},
  );
  static const addPasswordNeedsOne = EngineFailed(
    '"Add password" needs a password.',
    key: 'addPasswordNeedsOne',
  );

  // Choosing an action.
  static EngineFailed cantUseFile(String action) =>
      _say('cantUseFile', '"$action" can\'t use this file.', {'action': action});
  static EngineFailed cantUse(String action, String name) =>
      _say('cantUse', '"$action" can\'t use $name.', {'action': action, 'name': name});
  static EngineFailed notYet(String action) =>
      _say('notYet', '"$action" is not available yet.', {'action': action});
  static EngineFailed needsFiles(String action, int count) => _say(
    'needsFiles',
    '"$action" needs at least $count files.',
    {'action': action, 'count': '$count'},
  );

  // Pictures.
  static EngineFailed animated(String name) =>
      _say('animated', 'Animated pictures can\'t be changed here yet: $name.', {'name': name});
  static EngineFailed pictureRotate(int degrees) => _say(
    'pictureRotate',
    'Pictures rotate by 90, 180 or 270, not $degrees.',
    {'degrees': '$degrees'},
  );
  static const cropNeeded = EngineFailed('"Crop" needs a crop area.', key: 'cropNeeded');
  static const editDoesntFit = EngineFailed(
    'That edit does not fit this picture.',
    key: 'editDoesntFit',
  );
  static const formNeeded = EngineFailed(
    '"Form photo" needs to know what the form wants.',
    key: 'formNeeded',
  );
  static const widthAndHeight = EngineFailed(
    'Give both a width and a height, or neither.',
    key: 'widthAndHeight',
  );
  static const smallestOverLargest = EngineFailed(
    'The smallest size allowed is more than the largest.',
    key: 'smallestOverLargest',
  );
  static EngineFailed tooMuchDetail(int kb, int width, int height) => _say(
    'tooMuchDetail',
    'This picture has too much detail to fit $kb KB at $width x $height.',
    {'kb': '$kb', 'width': '$width', 'height': '$height'},
  );
  static const pictureTooBigForForm = EngineFailed(
    'This picture could not be made small enough for that size.',
    key: 'pictureTooBigForForm',
  );
  static EngineFailed pictureTooBig(String action) => _say(
    'pictureTooBig',
    'This picture could not be made small enough for "$action".',
    {'action': action},
  );

  // Video and sound.
  static const noSound = EngineFailed('This video has no sound.', key: 'noSound');
  static EngineFailed videoRotate(int degrees) => _say(
    'videoRotate',
    'Videos rotate by 90, 180 or 270, not $degrees.',
    {'degrees': '$degrees'},
  );
  static const chooseTrim = EngineFailed('Choose where to trim.', key: 'chooseTrim');
  static const trimLeavesNothing = EngineFailed(
    'The trim leaves nothing.',
    key: 'trimLeavesNothing',
  );
  static const lengthUnknown = EngineFailed(
    'This video\'s length could not be read.',
    key: 'lengthUnknown',
  );
  static EngineFailed tooLongToFit(String megabytes) => _say(
    'tooLongToFit',
    'This video is too long to fit under $megabytes MB.',
    {'size': megabytes},
  );
  static EngineFailed videoTooBig(String action) => _say(
    'videoTooBig',
    'This video could not be made small enough for "$action".',
    {'action': action},
  );
  static const aVideoUnreadable = EngineFailed(
    'A video could not be read.',
    key: 'aVideoUnreadable',
  );
  static EngineFailed noPictureToShow(String name) =>
      _say('noPictureToShow', '$name has no picture to show here.', {'name': name});
  static EngineFailed audioFormat(String format) =>
      _say('audioFormat', 'This audio format can\'t be written: $format.', {'format': format});
  static const noBitrate = EngineFailed(
    'WAV and FLAC have no bitrate setting. Try MP3 or M4A.',
    key: 'noBitrate',
  );
  static const noFileMade = EngineFailed(
    'The engine finished without making a file.',
    key: 'noFileMade',
  );

  // Subtitles.
  static const noSubtitles = EngineFailed('This file has no subtitles in it.', key: 'noSubtitles');
  static const shiftNeeded = EngineFailed(
    '"Shift timing" needs how far to shift.',
    key: 'shiftNeeded',
  );

  // PDFs.
  static const pagesFormat = EngineFailed('Pages look like 1-3,7.', key: 'pagesFormat');
  static const passwordUnusable = EngineFailed(
    'That password can\'t be used.',
    key: 'passwordUnusable',
  );
  static EngineFailed pdfShrinksTo(int kb, int limitKb) => _say(
    'pdfShrinksTo',
    'This PDF only shrinks to $kb KB, above the $limitKb KB limit.',
    {'kb': '$kb', 'limit': '$limitKb'},
  );

  // Each platform's own engines: PDFs through PDFium, browsers' and phones' encoders.
  static EngineFailed pdfRotate(int degrees) =>
      _say('pdfRotate', 'PDFs rotate by 90, 180 or 270, not $degrees.', {'degrees': '$degrees'});
  static EngineFailed noPasswordToRemove(String name) =>
      _say('noPasswordToRemove', '$name has no password to remove.', {'name': name});
  static const pdfAsSmall = EngineFailed(
    'This PDF is already as small as it can usefully get.',
    key: 'pdfAsSmall',
  );
  static EngineFailed pagesTooFull(int pages, String action) => _say(
    'pagesTooFull',
    '${pages == 1 ? 'This page has too much in it' : 'These $pages pages have too much in them'} to fit '
        '"$action" and still be readable. Try a larger limit, or Compress.',
    {'count': '$pages', 'action': action},
  );
  static EngineFailed pageNotDrawn(int page, String name) => _say(
    'pageNotDrawn',
    'Page $page of $name could not be drawn.',
    {'page': '$page', 'name': name},
  );
  static EngineFailed noPages(String name) =>
      _say('noPages', '$name has no pages.', {'name': name});
  static EngineFailed onePage(String name) =>
      _say('onePage', '$name has only one page, so there is nothing to split.', {'name': name});
  static EngineFailed cantSaveBeside(String name) =>
      _say('cantSaveBeside', '$name could not be saved beside the original.', {'name': name});
  static const heicCantStart = EngineFailed(
    'HEIC photos could not start in this browser.',
    key: 'heicCantStart',
  );
  static const videoCantStart = EngineFailed(
    'Video could not start in this browser.',
    key: 'videoCantStart',
  );
  static const archiveCantStart = EngineFailed(
    '7z and RAR files could not start in this browser.',
    key: 'archiveCantStart',
  );
  static EngineFailed damagedOrTooLarge(String name) => _say(
    'damagedOrTooLarge',
    '$name could not be read. It may be damaged, or too large.',
    {'name': name},
  );
  static const videoNoPicture = EngineFailed(
    'This video has no picture to show here.',
    key: 'videoNoPicture',
  );
  static const formatNotYet = EngineFailed(
    'This format can\'t be written yet.',
    key: 'formatNotYet',
  );
  static const browserCantMake = EngineFailed(
    'This browser can\'t convert this file to that format.',
    key: 'browserCantMake',
  );
  static const browserCantRead = EngineFailed(
    'This file could not be converted. It may use a format this browser can\'t read.',
    key: 'browserCantRead',
  );
  static const heicNeedsAndroid9 = EngineFailed(
    'HEIC photos need Android 9 or newer.',
    key: 'heicNeedsAndroid9',
  );
  static EngineFailed goneBeforeSharing(String name) =>
      _say('goneBeforeSharing', '$name is no longer here to share.', {'name': name});
  static EngineFailed cantShare(String name) =>
      _say('cantShare', '$name could not be shared.', {'name': name});
  static const noAppTakesIt = EngineFailed('No app here can take this file.', key: 'noAppTakesIt');
  static const phoneCantRead = EngineFailed(
    'This phone can\'t read the video or sound in this file.',
    key: 'phoneCantRead',
  );
  static const phoneCantMake = EngineFailed(
    'This phone can\'t make this kind of file at this size.',
    key: 'phoneCantMake',
  );
  static const fileMoved = EngineFailed(
    'This file could not be read. It may have moved.',
    key: 'fileMoved',
  );
  static const finishSavingFirst = EngineFailed(
    'Finish saving the other file first.',
    key: 'finishSavingFirst',
  );
  static const noSaveChooser = EngineFailed(
    'This phone has no way to choose where to save.',
    key: 'noSaveChooser',
  );
  static const notSaved = EngineFailed('This file could not be saved.', key: 'notSaved');
  static const somethingWrong = EngineFailed(
    'Something went wrong. This file could not be converted.',
    key: 'somethingWrong',
  );
}
