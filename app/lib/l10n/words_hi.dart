// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'words.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class WordsHi extends Words {
  WordsHi([String locale = 'hi']) : super(locale);

  @override
  String get tagline => 'आपकी फ़ाइलें इसी डिवाइस पर रहती हैं।';

  @override
  String get about => 'जानकारी';

  @override
  String get history => 'इतिहास';

  @override
  String get chooseFiles => 'फ़ाइलें चुनें';

  @override
  String get chooseOtherFiles => 'दूसरी फ़ाइलें चुनें';

  @override
  String get receiving => 'आपकी भेजी फ़ाइलें आ रही हैं...';

  @override
  String get dropAnywhere => 'या उन्हें यहाँ कहीं भी छोड़ें';

  @override
  String get dropToConvert => 'बदलने के लिए छोड़ें';

  @override
  String get saveAllBeside => 'सभी को मूल फ़ाइलों के पास सहेजें';

  @override
  String get saveAllZip => 'सभी को एक ZIP में सहेजें';

  @override
  String get openMenuAgain => 'मेन्यू फिर से खोलें';

  @override
  String get modeConvert => 'बदलें';

  @override
  String get modeTools => 'टूल';

  @override
  String fileCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count फ़ाइलें',
      one: '1 फ़ाइल',
    );
    return '$_temp0';
  }

  @override
  String andMore(Object first, int count) {
    return '$first और $count अन्य';
  }

  @override
  String get cancel => 'रद्द करें';

  @override
  String get save => 'सहेजें';

  @override
  String get share => 'शेयर करें';

  @override
  String get copy => 'कॉपी करें';

  @override
  String get showInFolder => 'फ़ोल्डर में दिखाएँ';

  @override
  String get undo => 'पहले जैसा करें';

  @override
  String get converting => 'बदल रहे हैं';

  @override
  String get done => 'हो गया';

  @override
  String get failed => 'नहीं हो सका';

  @override
  String get dragToApp => 'किसी दूसरे ऐप में खींचें';

  @override
  String get more => 'और';

  @override
  String get moreActions => 'और विकल्प';

  @override
  String cancelFiles(int count) {
    return 'रद्द करें, $count फ़ाइलें';
  }

  @override
  String get nothingFits => 'कुछ भी नहीं चलेगा';

  @override
  String get trashMac => 'ट्रैश';

  @override
  String get trashWindows => 'रीसायकल बिन';

  @override
  String movedTo(Object place) {
    return '$place में भेज दिया गया।';
  }

  @override
  String couldNotMove(Object name, Object place) {
    return '$name को $place में नहीं भेजा जा सका।';
  }

  @override
  String get undoFailed => 'इसे पहले जैसा नहीं किया जा सका।';

  @override
  String get showFailed => 'इसे दिखाया नहीं जा सका।';

  @override
  String get openFailed => 'ये फ़ाइलें खुल नहीं सकीं। फिर से कोशिश करें।';

  @override
  String get sharedNothing => 'जो भेजा गया, वह खुल नहीं सका। सिर्फ़ फ़ाइलें बदली जा सकती हैं।';

  @override
  String get sharedSome => 'भेजी गई कुछ चीज़ें खुल नहीं सकीं।';

  @override
  String get folderNothing => 'उस फ़ोल्डर में ऐसा कुछ नहीं है जिसे बदला जा सके।';

  @override
  String folderTooMany(int count) {
    return 'उस फ़ोल्डर की सिर्फ़ पहली $count फ़ाइलें देखी गईं।';
  }

  @override
  String folderLeftOut(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'उस फ़ोल्डर की $count और फ़ाइलें छोड़ दी गईं।',
      one: 'उस फ़ोल्डर की 1 और फ़ाइल छोड़ दी गई।',
    );
    return '$_temp0';
  }

  @override
  String fileTooLarge(Object name, Object limit) {
    return '$name यहाँ बदलने के लिए बहुत बड़ी है (सीमा $limit)।';
  }

  @override
  String filesTooLarge(Object limit) {
    return 'ये फ़ाइलें एक साथ बदलने के लिए बहुत बड़ी हैं (सीमा $limit)। एक बार में कम फ़ाइलें लें।';
  }

  @override
  String get convertFailed => 'कुछ गड़बड़ हो गई। यह फ़ाइल बदली नहीं जा सकी।';

  @override
  String get readFailed => 'यह फ़ाइल पढ़ी नहीं जा सकी। शायद वह कहीं और चली गई है या बहुत बड़ी है।';

  @override
  String get saveFailed => 'यह फ़ाइल सहेजी नहीं जा सकी। फिर से कोशिश करें।';

  @override
  String get saveAllFailed => 'ये फ़ाइलें सहेजी नहीं जा सकीं। फिर से कोशिश करें।';

  @override
  String get handOverFailed => 'यह फ़ाइल आगे नहीं भेजी जा सकी। इसकी जगह इसे सहेज लें।';

  @override
  String sizeChange(Object before, Object after) {
    return '$before से $after';
  }

  @override
  String savedBeside(Object sizes) {
    return 'मूल फ़ाइल के पास सहेजी गई। $sizes';
  }

  @override
  String saved(Object sizes) {
    return 'सहेजी गई। $sizes';
  }

  @override
  String get cantTogether => 'इस संस्करण में ये फ़ाइलें अभी एक साथ नहीं बदली जा सकतीं।';

  @override
  String get unsupportedType => 'इस तरह की फ़ाइल अभी नहीं चलती।';

  @override
  String cantConvert(Object kind) {
    return 'इस संस्करण में अभी ये नहीं बदले जा सकते: $kind।';
  }

  @override
  String get kindPdf => 'PDF फ़ाइलें';

  @override
  String get kindVideo => 'इस डिवाइस पर वीडियो';

  @override
  String get kindAudio => 'इस डिवाइस पर ऑडियो';

  @override
  String kindDocument(Object format) {
    return '$format दस्तावेज़';
  }

  @override
  String kindArchive(Object format) {
    return '$format आर्काइव';
  }

  @override
  String get kindFolder => 'फ़ोल्डर';

  @override
  String kindPicture(Object format) {
    return '$format तस्वीरें';
  }

  @override
  String get kindSubtitle => 'सबटाइटल';

  @override
  String get kindUnknown => 'यह फ़ाइल';

  @override
  String today(Object time) {
    return 'आज $time';
  }

  @override
  String yesterday(Object time) {
    return 'कल $time';
  }

  @override
  String get clearHistoryTitle => 'इतिहास मिटाएँ?';

  @override
  String get clearHistoryBody => 'इससे सिर्फ़ सूची मिटेगी। आपकी फ़ाइलें जहाँ हैं, वहीं रहेंगी।';

  @override
  String get clear => 'मिटाएँ';

  @override
  String undoneLine(Object action, Object when) {
    return 'पहले जैसा किया · $action · $when';
  }

  @override
  String get historyEmpty =>
      'आप जो सहेजेंगे, वह 30 दिन तक यहाँ दिखेगा। यह सूची इसी डिवाइस पर रहती है।';

  @override
  String get licence => 'मुफ़्त और ओपन सोर्स, Mozilla Public License 2.0 के तहत।';

  @override
  String get privacyPromise =>
      'आपकी फ़ाइलें इसी डिवाइस पर रहती हैं। कुछ भी अपलोड नहीं होता, और कोई अकाउंट, विज्ञापन या ट्रैकिंग नहीं है।';

  @override
  String get formPhoto => 'फ़ॉर्म फ़ोटो';

  @override
  String get fillInFrom => 'यहाँ से भरें';

  @override
  String get myOwnSizes => 'अपने साइज़';

  @override
  String get widthPixels => 'चौड़ाई (पिक्सेल)';

  @override
  String get heightPixels => 'ऊँचाई (पिक्सेल)';

  @override
  String get atLeastKb => 'कम से कम (KB)';

  @override
  String get atMostKb => 'ज़्यादा से ज़्यादा (KB)';

  @override
  String get checkNotice => 'नियम बदलते रहते हैं, इसलिए इन्हें अपने फ़ॉर्म की सूचना से मिला लें।';

  @override
  String get next => 'आगे';

  @override
  String get giveBoth => 'दोनों भरें, या कोई नहीं।';

  @override
  String get theseAboveZero => 'ये 0 से ज़्यादा होने चाहिए।';

  @override
  String get theseTooLarge => 'ये बहुत बड़े हैं।';

  @override
  String get smallestOverLargest => 'कम से कम वाला, ज़्यादा से ज़्यादा वाले से बड़ा नहीं हो सकता।';

  @override
  String get thisAboveZero => 'यह 0 से ज़्यादा होना चाहिए।';

  @override
  String get fileLocked => 'यह फ़ाइल लॉक है';

  @override
  String get password => 'पासवर्ड';

  @override
  String get showPassword => 'पासवर्ड दिखाएँ';

  @override
  String get hidePassword => 'पासवर्ड छिपाएँ';

  @override
  String get wrongPassword => 'यह पासवर्ड नहीं चला। फिर से कोशिश करें।';

  @override
  String get typePassword => 'पासवर्ड लिखें।';

  @override
  String get open => 'खोलें';

  @override
  String get addPassword => 'पासवर्ड लगाएँ';

  @override
  String get addPasswordWarning =>
      'इसके बिना नतीजा कोई नहीं खोल पाएगा, और भूला हुआ पासवर्ड वापस नहीं मिल सकता।';

  @override
  String get samePasswordAgain => 'वही पासवर्ड दोबारा';

  @override
  String get choosePassword => 'पासवर्ड चुनें।';

  @override
  String get passwordsDiffer => 'ये मेल नहीं खाते।';

  @override
  String get shiftTiming => 'समय खिसकाएँ';

  @override
  String get seconds => 'सेकंड';

  @override
  String get secondsHint => 'सेकंड की संख्या लिखें, जैसे 1.5';

  @override
  String get later => 'बाद में';

  @override
  String get earlier => 'पहले';

  @override
  String get shift => 'खिसकाएँ';

  @override
  String get trim => 'ट्रिम करें';

  @override
  String get start => 'शुरू';

  @override
  String get end => 'अंत';

  @override
  String get emptyFromBeginning => 'खाली छोड़ें तो शुरुआत से';

  @override
  String get emptyToEnd => 'खाली छोड़ें तो आख़िर तक';

  @override
  String get useTime => '1:30 जैसा समय लिखें।';

  @override
  String get chooseStartOrEnd => 'चुनें कि कहाँ से शुरू या कहाँ ख़त्म करना है।';

  @override
  String onlyThisLong(Object length) {
    return 'यह सिर्फ़ $length लंबा है।';
  }

  @override
  String get afterStart => 'यह शुरू के बाद होना चाहिए।';

  @override
  String get videoAtStart => 'शुरू में वीडियो';

  @override
  String get videoAtEnd => 'अंत में वीडियो';

  @override
  String get crop => 'क्रॉप करें';

  @override
  String get left => 'बाएँ';

  @override
  String get top => 'ऊपर';

  @override
  String get width => 'चौड़ाई';

  @override
  String get height => 'ऊँचाई';

  @override
  String get pictureNotShown => 'यह तस्वीर दिखाई नहीं जा सकी।';

  @override
  String get actionRotate => 'घुमाएँ';

  @override
  String get actionMerge => 'जोड़ें';

  @override
  String get actionEmail => 'ईमेल';

  @override
  String get actionCompress => 'छोटा करें';

  @override
  String actionUnder(Object size) {
    return '$size से कम';
  }

  @override
  String get actionTrim => 'ट्रिम करें';

  @override
  String get actionStripMetadata => 'मेटाडेटा हटाएँ';

  @override
  String get actionResize => 'साइज़ बदलें';

  @override
  String get actionCrop => 'क्रॉप करें';

  @override
  String get actionAddPassword => 'पासवर्ड लगाएँ';

  @override
  String get actionRemovePassword => 'पासवर्ड हटाएँ';

  @override
  String get actionWebReady => 'वेब के लिए';

  @override
  String get actionSplit => 'अलग करें';

  @override
  String get actionShiftTiming => 'समय खिसकाएँ';

  @override
  String get actionPlainText => 'सादा टेक्स्ट';

  @override
  String get actionOnePdf => 'एक PDF';

  @override
  String get actionNormaliseVolume => 'आवाज़ बराबर करें';

  @override
  String get actionMute => 'आवाज़ हटाएँ';

  @override
  String get actionFormPhoto => 'फ़ॉर्म फ़ोटो';

  @override
  String get actionFlip => 'पलटें';

  @override
  String get actionExtractPages => 'पेज निकालें';

  @override
  String get actionExtract => 'निकालें';

  @override
  String get actionChangeBitrate => 'बिटरेट बदलें';

  @override
  String cantShareHere(Object name) {
    return '$name यहाँ से शेयर नहीं की जा सकती।';
  }

  @override
  String cantHandOver(Object name) {
    return '$name आगे नहीं भेजी जा सकती।';
  }

  @override
  String noLongerThere(Object name) {
    return '$name अब वहाँ नहीं है।';
  }

  @override
  String changedSince(Object name) {
    return '$name तब से बदल गई है, इसलिए उसे छुआ नहीं गया।';
  }

  @override
  String needsPassword(Object name) {
    return '$name खोलने के लिए पासवर्ड चाहिए। यह इसी डिवाइस पर रहता है।';
  }

  @override
  String get months => 'जन॰,फ़र॰,मार्च,अप्रैल,मई,जून,जुल॰,अग॰,सित॰,अक्तू॰,नव॰,दिस॰';

  @override
  String get actionExtractAudio => 'ऑडियो निकालें';

  @override
  String get actionCompressFolder => 'फ़ोल्डर का ZIP बनाएँ';
}
