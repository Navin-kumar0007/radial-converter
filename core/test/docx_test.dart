import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

/// Letters laid out as on a page: each line given as its top y, left x and text.
({String text, List<CharBox> boxes}) page(
  List<({double top, double left, String text})> lines, {
  double size = 12,
  Map<int, double>? sizes,
}) {
  final text = StringBuffer();
  final boxes = <CharBox>[];
  for (var i = 0; i < lines.length; i++) {
    final line = lines[i];
    final height = sizes?[i] ?? size;
    var x = line.left;
    for (final unit in line.text.split('')) {
      if (unit == '\t') {
        x += height * 6;
        continue;
      }
      text.write(unit);
      boxes.add((left: x, top: line.top, right: x + height * 0.5, bottom: line.top - height));
      x += height * 0.5;
    }
    text.write('\r\n');
    boxes.addAll([
      (left: x, top: line.top, right: x, bottom: line.top),
      (left: x, top: line.top, right: x, bottom: line.top),
    ]);
  }
  return (text: text.toString(), boxes: boxes);
}

List<DocxParagraph> layout(
  List<({double top, double left, String text})> lines, {
  Map<int, double>? sizes,
}) {
  final made = page(lines, sizes: sizes);
  return layoutPageText(made.text, made.boxes, pageWidth: 600).cast<DocxParagraph>();
}

void main() {
  group('rebuilding paragraphs', () {
    final longLine = 'a' * 90;

    test('lines close together that fill the width join into one', () {
      final out = layout([
        (top: 700, left: 50, text: '$longLine first'),
        (top: 686, left: 50, text: '$longLine second'),
      ]);
      expect(out, hasLength(1));
      expect(out.single.text, '$longLine first $longLine second');
    });

    test('a bigger gap starts a new paragraph', () {
      expect(
        layout([
          (top: 700, left: 50, text: '$longLine one'),
          (top: 660, left: 50, text: '$longLine two'),
        ]),
        hasLength(2),
      );
    });

    test('a line stopping short ended its paragraph', () {
      expect(
        layout([
          (top: 700, left: 50, text: longLine),
          (top: 686, left: 50, text: 'Short end.'),
          (top: 672, left: 50, text: longLine),
        ]).length,
        2,
      );
    });

    test('an indented line starts a new paragraph', () {
      expect(
        layout([(top: 700, left: 50, text: longLine), (top: 686, left: 80, text: longLine)]),
        hasLength(2),
      );
    });

    test('a word broken across lines joins up', () {
      final out = layout([
        (top: 700, left: 50, text: '$longLine exam-'),
        (top: 686, left: 50, text: 'ple$longLine'),
      ]);
      expect(out.single.text, contains('example'));
    });

    test('a hyphen before a capital stays, as in a name', () {
      final out = layout([
        (top: 700, left: 50, text: '$longLine Anglo-'),
        (top: 686, left: 50, text: 'Saxon$longLine'),
      ]);
      expect(out.single.text, contains('Anglo- Saxon'));
    });

    test('larger short text is a heading, and the size most text uses is not', () {
      final out = layout(
        [
          (top: 760, left: 50, text: 'The Title'),
          (top: 720, left: 50, text: 'A Section'),
          (top: 690, left: 50, text: longLine),
          (top: 676, left: 50, text: longLine),
        ],
        sizes: {0: 24, 1: 16},
      );
      expect(out.map((block) => block.heading).toList(), [1, 2, 0]);
    });

    test('a long paragraph in larger type is not a heading', () {
      final words = 'word ' * 50;
      final out = layout(
        [
          (top: 760, left: 50, text: words),
          (top: 700, left: 50, text: longLine),
          (top: 686, left: 50, text: longLine),
          (top: 672, left: 50, text: longLine),
          (top: 658, left: 50, text: longLine),
        ],
        sizes: {0: 16},
      );
      expect(out.first.heading, 0);
    });

    test('text in the middle of the page is centred', () {
      final out = layout([
        (top: 700, left: 250, text: 'Centred line here..'),
        (top: 650, left: 50, text: longLine),
      ]);
      expect(out.first.centred, isTrue);
      expect(out.last.centred, isFalse);
    });

    test('one line with a wide gap stays a paragraph, with a tab', () {
      final out = layout([
        (top: 700, left: 50, text: 'Name\tMarks'),
        (top: 660, left: 50, text: 'Some ordinary text after it.'),
      ]);
      expect(out.first.text, 'Name\tMarks');
    });

    test('words on a line keep their spaces', () {
      expect(layout([(top: 700, left: 50, text: 'two words')]).single.text, 'two words');
    });

    group('as real PDFs behave', () {
      CharBox at(double left, double top, double bottom) {
        return (left: left, top: top, right: left + 5, bottom: bottom);
      }

      test('wide letter spacing doesn\'t split a word', () {
        const word = 'Frontiers';
        final boxes = [for (var i = 0; i < word.length; i++) at(50 + i * 9.0, 700, 690)];
        expect((layoutPageText(word, boxes, pageWidth: 600).single as DocxParagraph).text, word);
      });

      test('a comma sitting low stays on its line', () {
        const text = 'Chen, Li';
        final boxes = [
          at(50, 700, 690),
          at(56, 700, 690),
          at(62, 700, 690),
          at(68, 700, 690),
          at(74, 691, 687),
          at(80, 691, 690.5),
          at(86, 700, 690),
          at(92, 700, 690),
        ];
        expect((layoutPageText(text, boxes, pageWidth: 600).single as DocxParagraph).text, text);
      });

      test('a footnote mark sitting high stays on its line', () {
        const text = 'Chen1';
        final boxes = [
          at(50, 700, 690),
          at(56, 700, 690),
          at(62, 700, 690),
          at(68, 700, 690),
          at(74, 705, 698),
        ];
        expect((layoutPageText(text, boxes, pageWidth: 600).single as DocxParagraph).text, text);
      });

      test('a narrow column still makes paragraphs, with the page far wider', () {
        final short = 'b' * 40;
        final out = layout([
          (top: 700, left: 50, text: short),
          (top: 686, left: 50, text: short),
          (top: 672, left: 50, text: short),
        ]);
        expect(out, hasLength(1));
      });

      test('punctuation on a line of its own rejoins the text', () {
        final out = layout([
          (top: 700, left: 50, text: 'The end of it'),
          (top: 686, left: 50, text: '.'),
          (top: 600, left: 50, text: 'Next.'),
        ]);
        expect(out.map((block) => block.text), ['The end of it.', 'Next.']);
      });

      test('a capitalised line isn\'t a heading just for having no x-height', () {
        const caps = 'KEYWORDS';
        final boxes = [for (var i = 0; i < caps.length; i++) at(50 + i * 6.0, 700, 690)];
        final body = 'aaaa ' * 8;
        final text = '$caps\r\n$body';
        final all = [
          ...boxes,
          at(0, 0, 0),
          at(0, 0, 0),
          for (var i = 0; i < body.length; i++) at(50 + i * 6.0, 680, 668),
        ];
        expect((layoutPageText(text, all, pageWidth: 600).first as DocxParagraph).heading, 0);
      });
    });

    test('Hindi comes through', () {
      expect(layout([(top: 700, left: 50, text: 'नमस्ते दुनिया')]).single.text, 'नमस्ते दुनिया');
    });

    test('nothing on the page gives nothing', () {
      expect(layoutPageText('', const [], pageWidth: 600), isEmpty);
      expect(layoutPageText('  \r\n ', const [], pageWidth: 600), isEmpty);
    });

    test('text and boxes that don\'t match in length can\'t crash it', () {
      final made = page([(top: 700, left: 50, text: 'hello')]);
      expect(layoutPageText(made.text, made.boxes.sublist(0, 2), pageWidth: 600), isNotEmpty);
      expect(layoutPageText('he', made.boxes, pageWidth: 600), isNotEmpty);
    });

    test('only the first paragraph of a page starts it', () {
      final made = page([(top: 700, left: 50, text: 'One.'), (top: 600, left: 50, text: 'Two.')]);
      final out = layoutPageText(made.text, made.boxes, pageWidth: 600, newPage: true);
      expect(out.map((block) => block.newPage).toList(), [true, false]);
    });
  });

  group('tables', () {
    List<DocxBlock> blocks(List<({double top, double left, String text})> lines) {
      final made = page(lines);
      return layoutPageText(made.text, made.boxes, pageWidth: 600);
    }

    /// Lines of cells, each cell starting at its own x, as a table's columns do.
    List<DocxBlock> grid(List<(double top, List<(double left, String text)> cells)> lines) {
      const size = 12.0;
      final text = StringBuffer();
      final boxes = <CharBox>[];
      for (final (top, cells) in lines) {
        for (final (left, words) in cells) {
          var x = left;
          for (final unit in words.split('')) {
            text.write(unit);
            boxes.add((left: x, top: top, right: x + size * 0.5, bottom: top - size));
            x += size * 0.5;
          }
        }
        text.write('\r\n');
        boxes.addAll([
          (left: 0, top: top, right: 0, bottom: top),
          (left: 0, top: top, right: 0, bottom: top),
        ]);
      }
      return layoutPageText(text.toString(), boxes, pageWidth: 600);
    }

    test('rows with gaps in the same places become a table', () {
      final out = blocks([
        (top: 700, left: 50, text: 'Name\tMarks\tGrade'),
        (top: 686, left: 50, text: 'Asha\t91\tA'),
        (top: 672, left: 50, text: 'Ravi\t78\tB'),
      ]);
      final table = out.single as DocxTable;
      expect(table.rows, [
        ['Name', 'Marks', 'Grade'],
        ['Asha', '91', 'A'],
        ['Ravi', '78', 'B'],
      ]);
      expect(table.columnWidths, hasLength(3));
      expect(table.columnWidths.every((width) => width > 0), isTrue);
    });

    test('text around a table stays as paragraphs, in order', () {
      final out = blocks([
        (top: 760, left: 50, text: 'Results'),
        (top: 700, left: 50, text: 'Name\tMarks'),
        (top: 686, left: 50, text: 'Asha\t91'),
        (top: 672, left: 50, text: 'Ravi\t78'),
        (top: 620, left: 50, text: 'Well done, everyone.'),
      ]);
      expect(out.map((block) => block.runtimeType), [DocxParagraph, DocxTable, DocxParagraph]);
      expect((out.first as DocxParagraph).text, 'Results');
      expect((out.last as DocxParagraph).text, 'Well done, everyone.');
    });

    test('an empty cell keeps the others in their columns', () {
      final out = grid([
        (700, [(50, 'Item'), (200, 'Qty'), (350, 'Price')]),
        (686, [(50, 'Pens'), (350, '40')]),
        (672, [(50, 'Ink'), (200, '2'), (350, '15')]),
      ]);
      final table = out.single as DocxTable;
      expect(table.rows[1], ['Pens', '', '40']);
    });

    test('text wrapped inside a later column joins its row', () {
      final out = grid([
        (700, [(50, 'Step'), (150, 'What to do')]),
        (686, [(50, '1'), (150, 'Open the form and fill')]),
        (672, [(150, 'in every box')]),
        (658, [(50, '2'), (150, 'Sign it')]),
      ]);
      final table = out.single as DocxTable;
      expect(table.rows, [
        ['Step', 'What to do'],
        ['1', 'Open the form and fill in every box'],
        ['2', 'Sign it'],
      ]);
    });

    test('a page set in two columns of prose is not a table', () {
      // Each column's lines run right up to the gap before the next.
      const left = 'The committee met on Monday to discuss';
      const right = 'Members agreed that the new library will';
      final out = grid([
        for (var i = 0; i < 6; i++) (700.0 - i * 14, [(50.0, left), (330.0, right)]),
      ]);
      // The gutter is wide enough to split each line, so only the guard keeps it from a table.
      final made = out.whereType<DocxParagraph>().first.text;
      expect(made, contains('\t'));
      expect(out.whereType<DocxTable>(), isEmpty);
    });

    test('justified text, its spaces stretched evenly, is not a table', () {
      // Each word stands apart by the same wide gap, line after line.
      List<(double, String)> spread(List<String> words) {
        var x = 50.0;
        final out = <(double, String)>[];
        for (final word in words) {
          out.add((x, word));
          x += word.length * 6 + 24;
        }
        return out;
      }

      final out = grid([
        (700, spread(['photos', 'are', 'still', 'the', 'best', 'way'])),
        (686, spread(['to', 'keep', 'what', 'we', 'saw', 'then'])),
        (672, spread(['and', 'show', 'it', 'to', 'our', 'friends'])),
      ]);
      expect(out.whereType<DocxTable>(), isEmpty);
    });

    test('evenly spaced numbers still make a table', () {
      List<(double, String)> spread(List<String> words) => [
        for (var i = 0; i < words.length; i++) (50.0 + i * 70, words[i]),
      ];
      final out = grid([
        (700, spread(['10', '20', '30', '40', '50'])),
        (686, spread(['11', '21', '31', '41', '51'])),
      ]);
      expect((out.single as DocxTable).rows.last, ['11', '21', '31', '41', '51']);
    });

    test('two rows of two are left as lines with tabs', () {
      final out = blocks([
        (top: 700, left: 50, text: 'Name\tAsha'),
        (top: 686, left: 50, text: 'Class\t10'),
      ]);
      expect(out.whereType<DocxTable>(), isEmpty);
      expect((out.first as DocxParagraph).text, 'Name\tAsha');
    });

    test('pieces of sentences that happen to line up are not a table', () {
      final out = grid([
        (700, [(50, 'performance'), (150, 'parameters'), (260, 'response')]),
        (686, [(50, 'latency, and'), (150, 'prediction'), (260, 'accuracy')]),
      ]);
      expect(out.whereType<DocxTable>(), isEmpty);
    });

    test('a list with its bullets hanging apart is not a table', () {
      final out = grid([
        (700, [(50, '•'), (80, 'Team work')]),
        (686, [(50, '•'), (80, 'Time management')]),
        (672, [(50, '•'), (80, 'Speaking to groups')]),
      ]);
      expect(out.whereType<DocxTable>(), isEmpty);
    });

    test('rows whose gaps don\'t line up are not one table', () {
      final out = blocks([
        (top: 700, left: 50, text: 'Name\tMarks'),
        (top: 686, left: 300, text: 'Asha\t91'),
      ]);
      expect(out.whereType<DocxTable>(), isEmpty);
    });

    test('only the first block of a page starts it, table or not', () {
      final made = page([
        (top: 700, left: 50, text: 'Name\tMarks'),
        (top: 686, left: 50, text: 'Asha\t91'),
        (top: 672, left: 50, text: 'Ravi\t78'),
        (top: 620, left: 50, text: 'After.'),
      ]);
      final out = layoutPageText(made.text, made.boxes, pageWidth: 600, newPage: true);
      expect(out.map((block) => block.newPage), [true, false]);
    });
  });

  group('telling a scan from text', () {
    bool isPicture(int letters, double text, double ink) {
      return pageIsAPicture(letters: letters, textCoverage: text, inkCoverage: ink);
    }

    test('no text at all is a picture', () => expect(isPicture(0, 0, 0), isTrue));
    test('an empty page with no text still has nothing else', () {
      expect(isPicture(0, 0, 0.001), isTrue);
    });
    test('a full page of text is text', () => expect(isPicture(3000, 0.3, 0.12), isFalse));
    test('a short page of text is text', () => expect(isPicture(8, 0.004, 0.004), isFalse));
    test('a scan with a stamp on it is a picture', () {
      expect(isPicture(40, 0.01, 0.4), isTrue);
    });
    test('a page of text with a chart keeps its text', () {
      expect(isPicture(1500, 0.15, 0.3), isFalse);
    });
    test('a scan read by OCR keeps its text', () {
      expect(isPicture(2500, 0.25, 0.9), isFalse);
    });
  });

  group('writing a Word file', () {
    Archive parts(Uint8List docx) => ZipDecoder().decodeBytes(docx);

    String xml(Uint8List docx, String name) {
      return utf8.decode(parts(docx).findFile(name)!.readBytes()!);
    }

    test('it is what the app recognises as one', () {
      final docx = buildDocx(const [DocxParagraph('Hello')]);
      expect(detectKind(docx), FileKind.docx);
    });

    test('it has the parts Word needs, with the types first', () {
      final names = parts(buildDocx(const [DocxParagraph('Hello')])).files.map((f) => f.name);
      expect(names.first, '[Content_Types].xml');
      expect(names, containsAll(['_rels/.rels', 'word/document.xml', 'word/styles.xml']));
    });

    test('characters XML treats specially are safe', () {
      final docx = buildDocx(const [DocxParagraph('a < b & c > d "e" \'f\'')]);
      expect(
        xml(docx, 'word/document.xml'),
        contains('a &lt; b &amp; c &gt; d &quot;e&quot; &apos;f&apos;'),
      );
    });

    test('characters XML forbids are dropped, or Word refuses the whole file', () {
      final docx = buildDocx(const [DocxParagraph('ok\u0000\u0001\u000Bfine￾')]);
      expect(xml(docx, 'word/document.xml'), contains('okfine'));
    });

    test('a tab becomes a real one', () {
      final docx = buildDocx(const [DocxParagraph('a\tb')]);
      expect(xml(docx, 'word/document.xml'), contains('<w:tab/>'));
    });

    test('pictures go in, fitting the page and keeping their shape', () {
      final jpeg = Uint8List.fromList(img.encodeJpg(img.Image(width: 200, height: 400)));
      final docx = buildDocx([DocxPicture(jpeg, width: 200, height: 400, newPage: true)]);
      expect(parts(docx).findFile('word/media/image1.jpg')!.size, jpeg.length);
      final body = xml(docx, 'word/document.xml');
      final match = RegExp(r'<wp:extent cx="(\d+)" cy="(\d+)"').firstMatch(body)!;
      final cx = int.parse(match[1]!);
      final cy = int.parse(match[2]!);
      expect(cy / cx, closeTo(2, 0.01));
      expect(cy, lessThanOrEqualTo(697 * 12700));
      expect(body, contains('<w:pageBreakBefore/>'));
      expect(xml(docx, '[Content_Types].xml'), contains('image/jpeg'));
    });

    test('a table has a grid, its rows and an empty paragraph in each blank cell', () {
      final docx = buildDocx(const [
        DocxTable(
          [
            ['Name', 'Marks'],
            ['Asha & co', ''],
          ],
          columnWidths: [100, 300],
        ),
      ]);
      final body = xml(docx, 'word/document.xml');
      expect(body, contains('<w:tbl>'));
      expect('<w:gridCol '.allMatches(body), hasLength(2));
      expect('<w:tr>'.allMatches(body), hasLength(2));
      expect('<w:tc>'.allMatches(body), hasLength(4));
      expect(body, contains('Asha &amp; co'));
      // Widths keep the PDF's shares: a quarter and three quarters of the writing width.
      expect(body, contains('<w:gridCol w:w="2255"/>'));
      expect(body, contains('<w:gridCol w:w="6765"/>'));
    });

    test('macOS\'s own reader opens it, and finds the words', () async {
      final folder = Directory.systemTemp.createTempSync('radial_docx_');
      addTearDown(() => folder.deleteSync(recursive: true));
      final path = p.join(folder.path, 'a.docx');
      File(path).writeAsBytesSync(
        buildDocx(const [
          DocxParagraph('A Title', heading: 1),
          DocxParagraph('Tom & Jerry < 5', centred: true),
          DocxParagraph('नमस्ते दुनिया', newPage: true),
          DocxParagraph('left\tright'),
          DocxTable(
            [
              ['Cell one', 'Cell two'],
              ['Cell three', 'Cell four'],
            ],
            columnWidths: [1, 1],
            newPage: true,
          ),
        ]),
      );
      final result = await Process.run('/usr/bin/textutil', ['-convert', 'txt', '-stdout', path]);
      expect(result.exitCode, 0, reason: '${result.stderr}');
      final text = result.stdout as String;
      expect(text, contains('A Title'));
      expect(text, contains('Tom & Jerry < 5'));
      expect(text, contains('नमस्ते दुनिया'));
      expect(text, contains('left\tright'));
      for (final word in ['Cell one', 'Cell two', 'Cell three', 'Cell four']) {
        expect(text, contains(word));
      }
    }, skip: Platform.isMacOS ? false : 'Needs macOS');
  });
}
