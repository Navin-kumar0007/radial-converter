import 'package:flutter_test/flutter_test.dart';
import 'package:shiftdrop/pdf_extras.dart';

void main() {
  group('telling a bold font', () {
    bool bold(String name, {int weight = 0, int flags = 0}) =>
        isBoldFont(weight: weight, name: name, flags: flags);

    test('by its name', () {
      expect(bold('Arial-BoldMT'), isTrue);
      expect(bold('ABCDEF+Calibri-Bold'), isTrue);
      expect(bold('Times-Bold'), isTrue);
      expect(bold('Montserrat-SemiBold'), isTrue);
      expect(bold('CMBX10'), isTrue);
      expect(bold('Times-Roman'), isFalse);
      expect(bold('CMR10'), isFalse);
    });

    test('a weight that a regular face\'s name contradicts is not believed', () {
      // PDFium gives 630 for both faces of Charis SIL in one real paper.
      expect(bold('CharisSIL', weight: 630), isFalse);
      expect(bold('Lato-Regular', weight: 700), isFalse);
    });

    test('a name that says nothing leaves it to a clearly bold weight', () {
      expect(bold('F1', weight: 700), isTrue);
      expect(bold('F1', weight: 630), isFalse);
      expect(bold('', weight: -1), isFalse);
    });

    test('the descriptor can force it', () {
      expect(bold('F2', flags: 1 << 18), isTrue);
      // Other flags, such as non-symbolic, don't.
      expect(bold('F2', flags: 0x80004), isFalse);
    });
  });

  group('keeping pictures', () {
    test('rules, bullets and specks are left out', () {
      expect(keepsPicture(width: 400, height: 2, pageWidth: 595, pageHeight: 842), isFalse);
      expect(keepsPicture(width: 10, height: 10, pageWidth: 595, pageHeight: 842), isFalse);
    });

    test('a photo on a page of text is kept', () {
      expect(keepsPicture(width: 240, height: 160, pageWidth: 595, pageHeight: 842), isTrue);
    });

    test('a picture filling the page is its background, not a picture in it', () {
      expect(keepsPicture(width: 595, height: 842, pageWidth: 595, pageHeight: 842), isFalse);
    });
  });

  test('bold is only used when the text read is the same characters', () {
    const extras = PageExtras(codes: [72, 105], bold: [true, false], pictures: []);
    expect(extras.boldFor('Hi'), [true, false]);
    expect(extras.boldFor('iH'), isNull);
  });
}
