import 'package:radial_core/radial_core.dart';

export 'pdf_extras_native.dart' if (dart.library.js_interop) 'pdf_extras_web.dart';

/// What PDFium knows about a page beyond its text: which characters are bold, and the pictures on
/// it, already as JPEGs placed by their top edge.
class PageExtras {
  const PageExtras({required this.codes, required this.bold, required this.pictures});

  /// The page's characters, one per PDFium index, to check they line up with the text read.
  final List<int> codes;
  final List<bool> bold;
  final List<PagePicture> pictures;

  /// Bold flags lined up with [fullText] and its character boxes, or null if the text read isn't
  /// the same characters, as when it was reordered.
  List<bool>? boldFor(String fullText) {
    if (String.fromCharCodes(codes) != fullText) return null;
    return bold;
  }
}

/// Pictures smaller than this, in points on either side, are rules, bullets and specks.
const smallestPicture = 24.0;

/// Pictures are kept at most this many pixels on their long side, plenty for a page in Word.
const largestPictureSide = 1600;

/// Whether a picture of this size, on a page of this size, is worth keeping. One covering nearly
/// all of the page is its background or a scan, which the page as a picture already covers.
bool keepsPicture({
  required double width,
  required double height,
  required double pageWidth,
  required double pageHeight,
}) {
  if (width < smallestPicture || height < smallestPicture) return false;
  return width * height < pageWidth * pageHeight * 0.8;
}

/// Whether a font is bold. Its name says best, as in Arial-BoldMT or TeX's CMBX10: PDFium's weight
/// can be wrong, such as 630 for a regular face. So the weight counts only when the name says
/// nothing of the face, and then only clearly bold.
bool isBoldFont({required int weight, required String name, required int flags}) {
  // The font descriptor's ForceBold flag.
  const forceBold = 1 << 18;
  // A subset font's name starts with six letters and a plus, as ABCDEF+Calibri-Bold.
  final face = name.replaceFirst(RegExp(r'^[A-Z]{6}\+'), '');
  if (_boldName.hasMatch(face)) return true;
  if (flags & forceBold != 0) return true;
  if (_otherFace.hasMatch(face)) return false;
  return weight >= 700;
}

final _boldName = RegExp(r'bold|black|heavy|semibold|demi|^cmbx|^cmb\d', caseSensitive: false);
final _otherFace = RegExp(
  r'regular|roman|book|medium|light|thin|italic|oblique|normal|^cm[a-z]+\d',
  caseSensitive: false,
);
