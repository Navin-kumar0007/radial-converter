import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

List<String> ids(Iterable<RadialAction> actions) => actions.map((action) => action.id).toList();

void main() {
  group('catalogue', () {
    test('has about 70 actions', () {
      expect(actionCatalogue.length, inInclusiveRange(60, 80));
    });
    test('ids are unique', () {
      expect(ids(actionCatalogue).toSet().length, actionCatalogue.length);
    });
    test('ids are lowercase words joined by hyphens', () {
      for (final action in actionCatalogue) {
        expect(action.id, matches(RegExp(r'^[a-z0-9]+(-[a-z0-9]+)*$')));
      }
    });
    test('every action accepts something and has a label', () {
      for (final action in actionCatalogue) {
        expect(action.accepts, isNotEmpty, reason: action.id);
        expect(action.label, isNotEmpty, reason: action.id);
        expect(action.suffix, isNotEmpty, reason: action.id);
      }
    });
    test('nothing writes a format we cannot encode', () {
      for (final action in actionCatalogue) {
        for (final input in action.accepts) {
          final output = action.outputFor(input);
          expect(output, isNot(FileKind.heic), reason: '${action.id} from ${input.name}');
          expect(output, isNot(FileKind.svg), reason: '${action.id} from ${input.name}');
        }
      }
    });
    test('the catalogue is read-only', () {
      expect(() => actionCatalogue.clear(), throwsUnsupportedError);
    });
    test('actionById', () {
      expect(actionById('image-to-png')?.output, FileKind.png);
      expect(actionById('nope'), isNull);
    });
  });

  group('actionsFor', () {
    test('no files, no actions', () {
      expect(actionsFor(const [], ActionMode.convert), isEmpty);
    });
    test('a JPG can become a PNG but not a JPG', () {
      final found = ids(actionsFor(const [FileKind.jpg], ActionMode.convert));
      expect(found, contains('image-to-png'));
      expect(found, isNot(contains('image-to-jpg')));
    });
    test('a PNG can become a JPG', () {
      expect(ids(actionsFor(const [FileKind.png], ActionMode.convert)), contains('image-to-jpg'));
    });
    test('make-it-fit is offered even when the format already matches', () {
      final jpg = ids(actionsFor(const [FileKind.jpg], ActionMode.convert));
      expect(jpg, containsAll(['fit-whatsapp-photo', 'fit-instagram']));
      final mp4 = ids(actionsFor(const [FileKind.mp4], ActionMode.convert));
      expect(mp4, contains('fit-whatsapp-video'));
      expect(mp4, isNot(contains('video-to-mp4')));
      final webp = ids(actionsFor(const [FileKind.webp], ActionMode.convert));
      expect(webp, contains('fit-web'));
    });
    test('tools with a fixed output are offered for that format too', () {
      final pdfTools = ids(actionsFor(const [FileKind.jpg], ActionMode.tools));
      expect(pdfTools, contains('images-to-pdf'));
      final m4a = ids(actionsFor(const [FileKind.mov], ActionMode.tools));
      expect(m4a, contains('video-extract-audio'));
    });
    test('modes are separate', () {
      final convert = ids(actionsFor(const [FileKind.jpg], ActionMode.convert));
      final tools = ids(actionsFor(const [FileKind.jpg], ActionMode.tools));
      expect(tools, contains('image-crop'));
      expect(convert, isNot(contains('image-crop')));
      expect(tools, isNot(contains('image-to-png')));
    });
    test('mixed families share only common actions', () {
      expect(actionsFor(const [FileKind.jpg, FileKind.mp3], ActionMode.convert), isEmpty);
    });
    test('mixed images share image actions', () {
      final found = ids(actionsFor(const [FileKind.jpg, FileKind.png], ActionMode.convert));
      expect(found, containsAll(['image-to-jpg', 'image-to-png', 'image-to-webp']));
    });
    test('merge needs two files', () {
      expect(ids(actionsFor(const [FileKind.pdf], ActionMode.tools)), isNot(contains('pdf-merge')));
      expect(
        ids(actionsFor(const [FileKind.pdf, FileKind.pdf], ActionMode.tools)),
        contains('pdf-merge'),
      );
    });
    test('unknown files get nothing', () {
      expect(actionsFor(const [FileKind.unknown], ActionMode.convert), isEmpty);
      expect(actionsFor(const [FileKind.unknown], ActionMode.tools), isEmpty);
    });
    test('a folder can only be compressed', () {
      expect(ids(actionsFor(const [FileKind.folder], ActionMode.tools)), ['folder-compress']);
      expect(actionsFor(const [FileKind.folder], ActionMode.convert), isEmpty);
    });
    test('Markdown, HTML and DOCX convert to each other, TXT only to PDF', () {
      final markdown = ids(actionsFor(const [FileKind.markdown], ActionMode.convert));
      expect(markdown, containsAll(['document-to-html', 'document-to-docx', 'document-to-pdf']));
      expect(markdown, isNot(contains('document-to-markdown')));
      expect(ids(actionsFor(const [FileKind.txt], ActionMode.convert)), ['document-to-pdf']);
      expect(ids(actionsFor(const [FileKind.xlsx], ActionMode.convert)), ['document-to-pdf']);
    });
    test('every kind the menu can receive has actions', () {
      for (final kind in FileKind.values) {
        if (kind == FileKind.unknown || kind == FileKind.tarGz) continue;
        final all = [
          ...actionsFor([kind], ActionMode.convert),
          ...actionsFor([kind], ActionMode.tools),
        ];
        expect(all, isNotEmpty, reason: kind.name);
      }
    });
  });

  group('outputFor', () {
    final compress = actionById('image-compress')!;
    test('keeps a writable format', () {
      expect(compress.outputFor(FileKind.png), FileKind.png);
      expect(compress.outputFor(FileKind.webp), FileKind.webp);
    });
    test('HEIC becomes JPG because we ship no HEIC encoder', () {
      expect(compress.outputFor(FileKind.heic), FileKind.jpg);
    });
    test('read-only image formats become PNG', () {
      expect(compress.outputFor(FileKind.svg), FileKind.png);
      expect(compress.outputFor(FileKind.bmp), FileKind.png);
      expect(compress.outputFor(FileKind.ico), FileKind.png);
    });
    test('a fixed output wins', () {
      expect(actionById('fit-whatsapp-photo')!.outputFor(FileKind.png), FileKind.jpg);
    });
  });

  group('FileKind', () {
    test('fromExtension ignores case and the dot', () {
      expect(FileKind.fromExtension('PNG'), FileKind.png);
      expect(FileKind.fromExtension('.jpeg'), FileKind.jpg);
      expect(FileKind.fromExtension('tar.gz'), FileKind.tarGz);
      expect(FileKind.fromExtension('nope'), isNull);
      expect(FileKind.fromExtension(''), isNull);
    });
    test('ofFamily', () {
      expect(FileKind.ofFamily(FileFamily.pdf), {FileKind.pdf});
      expect(FileKind.ofFamily(FileFamily.image), contains(FileKind.heic));
    });
  });

  group('combinesFiles', () {
    test('merging and making one PDF take all the files together', () {
      for (final id in ['pdf-merge', 'video-merge', 'audio-merge', 'images-to-pdf']) {
        expect(combinesFiles(actionById(id)!), isTrue, reason: id);
      }
    });

    test('everything else works on each file alone', () {
      for (final id in ['image-to-jpg', 'pdf-compress', 'archive-extract', 'video-to-mp4']) {
        final action = actionById(id);
        expect(action, isNotNull, reason: id);
        expect(combinesFiles(action!), isFalse, reason: id);
      }
    });

    test('everything that combines files asks for their order first', () {
      for (final action in actionCatalogue) {
        expect(keepsOrder(action), combinesFiles(action), reason: action.id);
      }
      expect(keepsOrder(actionById('image-to-jpg')!), isFalse);
    });
  });
}
