import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  group('what a folder leaves behind', () {
    test('hidden files and system files are clutter', () {
      for (final name in ['.DS_Store', '.hidden.png', 'Thumbs.db', 'thumbs.db', 'desktop.ini']) {
        expect(isFolderClutter(name), isTrue, reason: name);
      }
      expect(isFolderClutter(r'~$report.docx'), isTrue);
    });

    test('ordinary names are not', () {
      for (final name in ['photo.png', 'thumbs.png', 'a.b.c.jpg', 'पोर्ट्रेट.jpg']) {
        expect(isFolderClutter(name), isFalse, reason: name);
      }
    });
  });

  group('which files of a folder to open', () {
    bool everything(FileKind kind) => kind != FileKind.unknown;

    test('files of one family all stay, in order', () {
      expect(pickFromFolder([FileKind.jpg, FileKind.png, FileKind.heic], canUse: everything), [
        0,
        1,
        2,
      ]);
    });

    test('the biggest family wins, as the menu only offers what all files share', () {
      expect(
        pickFromFolder([
          FileKind.pdf,
          FileKind.jpg,
          FileKind.mp4,
          FileKind.png,
        ], canUse: everything),
        [1, 3],
      );
    });

    test('files nothing can use do not count, however many', () {
      expect(
        pickFromFolder([
          FileKind.unknown,
          FileKind.unknown,
          FileKind.unknown,
          FileKind.pdf,
        ], canUse: everything),
        [3],
      );
    });

    test('a family this device cannot run loses to a smaller one it can', () {
      expect(
        pickFromFolder([
          FileKind.mp4,
          FileKind.mp4,
          FileKind.mp4,
          FileKind.jpg,
        ], canUse: (kind) => kind == FileKind.jpg),
        [3],
      );
    });

    test('a tie goes to the family seen first', () {
      expect(pickFromFolder([FileKind.pdf, FileKind.jpg], canUse: everything), [0]);
    });

    test('nothing usable picks nothing', () {
      expect(pickFromFolder([FileKind.unknown], canUse: everything), isEmpty);
      expect(pickFromFolder(const [], canUse: everything), isEmpty);
    });
  });
}
