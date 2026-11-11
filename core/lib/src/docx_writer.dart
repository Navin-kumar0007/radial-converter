import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:archive/archive.dart';

/// In a paragraph's or a cell's text, starts bold. Characters PDFs never hold: Unicode keeps them
/// for private use.
const docxBoldOn = '\uE000';

/// Ends what [docxBoldOn] started.
const docxBoldOff = '\uE001';

/// Something a Word document holds.
sealed class DocxBlock {
  const DocxBlock({this.newPage = false});

  /// Starts on a new page.
  final bool newPage;

  /// The same, starting on a new page.
  DocxBlock startingAPage() => switch (this) {
    DocxParagraph(:final text, :final heading, :final centred) => DocxParagraph(
      text,
      heading: heading,
      centred: centred,
      newPage: true,
    ),
    DocxPicture(:final jpeg, :final width, :final height, :final displayWidth) => DocxPicture(
      jpeg,
      width: width,
      height: height,
      displayWidth: displayWidth,
      newPage: true,
    ),
    DocxTable(:final rows, :final columnWidths) => DocxTable(
      rows,
      columnWidths: columnWidths,
      newPage: true,
    ),
  };
}

/// A paragraph. [heading] is 0 for body text, 1 for a large heading and 2 for a smaller one. A tab
/// in [text] stands for a wide gap, as between a table's columns, and [docxBoldOn] and
/// [docxBoldOff] mark what is bold.
class DocxParagraph extends DocxBlock {
  const DocxParagraph(this.text, {this.heading = 0, this.centred = false, super.newPage});

  final String text;
  final int heading;
  final bool centred;
}

/// A JPEG, keeping its shape. A whole page's picture fills the writing area; one from a page of
/// text is [displayWidth] points wide, as on its page, if the writing area has room.
class DocxPicture extends DocxBlock {
  const DocxPicture(
    this.jpeg, {
    required this.width,
    required this.height,
    this.displayWidth,
    super.newPage,
  });

  final Uint8List jpeg;
  final int width;
  final int height;
  final double? displayWidth;
}

/// A table, row by row, each row holding a cell's text for every column. [columnWidths] are in any
/// unit, as only their shares of the width count: the PDF's own measures do.
class DocxTable extends DocxBlock {
  const DocxTable(this.rows, {required this.columnWidths, super.newPage});

  final List<List<String>> rows;
  final List<double> columnWidths;
}

// A4 with one inch margins, in points.
const _writingWidth = 451.0;
const _writingHeight = 697.0;

/// EMUs, the unit Word measures pictures in, to a point.
const _emuPerPoint = 12700;

/// A Word document holding [blocks]. Only what every word processor reads, so it opens anywhere.
Uint8List buildDocx(List<DocxBlock> blocks) {
  final archive = Archive();
  void add(String name, String text) {
    archive.addFile(ArchiveFile.bytes(name, utf8.encode(text)));
  }

  final pictures = blocks.whereType<DocxPicture>().toList();
  add('[Content_Types].xml', _contentTypes(pictures.isNotEmpty));
  add('_rels/.rels', _packageRels);
  add('word/document.xml', _document(blocks, pictures));
  add('word/_rels/document.xml.rels', _documentRels(pictures.length));
  add('word/styles.xml', _styles);
  for (var i = 0; i < pictures.length; i++) {
    // Already compressed.
    archive.addFile(
      ArchiveFile.bytes('word/media/image${i + 1}.jpg', pictures[i].jpeg)
        ..compression = CompressionType.none,
    );
  }
  return Uint8List.fromList(ZipEncoder().encodeBytes(archive));
}

/// Text made safe for XML. PDFs can hold characters XML forbids, and one of them would stop Word
/// opening the whole document.
String _escape(String text) {
  final out = StringBuffer();
  final units = text.runes;
  for (final rune in units) {
    final allowed =
        rune == 0x09 ||
        rune == 0x0A ||
        rune == 0x0D ||
        (rune >= 0x20 && rune <= 0xD7FF) ||
        (rune >= 0xE000 && rune <= 0xFFFD) ||
        (rune >= 0x10000 && rune <= 0x10FFFF);
    if (!allowed) continue;
    switch (rune) {
      case 0x26:
        out.write('&amp;');
      case 0x3C:
        out.write('&lt;');
      case 0x3E:
        out.write('&gt;');
      case 0x22:
        out.write('&quot;');
      case 0x27:
        out.write('&apos;');
      default:
        out.writeCharCode(rune);
    }
  }
  return out.toString();
}

String _runs(String text) {
  final out = StringBuffer();
  var bold = false;
  for (final piece in RegExp(
    '[\t$docxBoldOn$docxBoldOff]|[^\t$docxBoldOn$docxBoldOff]+',
  ).allMatches(text).map((match) => match[0]!)) {
    switch (piece) {
      case docxBoldOn:
        bold = true;
      case docxBoldOff:
        bold = false;
      case '\t':
        out.write('<w:r><w:tab/></w:r>');
      default:
        final style = bold ? '<w:rPr><w:b/></w:rPr>' : '';
        out.write('<w:r>$style<w:t xml:space="preserve">${_escape(piece)}</w:t></w:r>');
    }
  }
  return out.toString();
}

String _document(List<DocxBlock> blocks, List<DocxPicture> pictures) {
  final body = StringBuffer();
  for (final block in blocks) {
    final newPage = block.newPage ? '<w:pageBreakBefore/>' : '';
    switch (block) {
      case DocxParagraph():
        final style = block.heading == 0 ? '' : '<w:pStyle w:val="Heading${block.heading}"/>';
        final centred = block.centred ? '<w:jc w:val="center"/>' : '';
        body.write('<w:p><w:pPr>$style$newPage$centred</w:pPr>${_runs(block.text)}</w:p>');
      case DocxPicture():
        final index = pictures.indexOf(block) + 1;
        body.write(
          '<w:p><w:pPr>$newPage<w:jc w:val="center"/></w:pPr>${_picture(block, index)}</w:p>',
        );
      case DocxTable():
        // A table can't break a page itself, so an empty paragraph before it does.
        if (block.newPage) body.write('<w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>');
        body.write(_table(block));
    }
  }
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
      'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
      'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
      '<w:body>$body'
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
      '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>'
      '</w:body></w:document>';
}

/// Twentieths of a point, the unit Word measures tables in.
const _twipsPerPoint = 20;

String _table(DocxTable table) {
  final total = table.columnWidths.fold<double>(0, (sum, width) => sum + width);
  final widths = [
    for (final width in table.columnWidths)
      total <= 0
          ? (_writingWidth * _twipsPerPoint / table.columnWidths.length).round()
          : (width / total * _writingWidth * _twipsPerPoint).round(),
  ];
  const border = 'w:val="single" w:sz="4" w:space="0" w:color="999999"';
  final out = StringBuffer(
    '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>'
    '<w:top $border/><w:left $border/><w:bottom $border/><w:right $border/>'
    '<w:insideH $border/><w:insideV $border/></w:tblBorders>'
    '<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>',
  );
  for (final width in widths) {
    out.write('<w:gridCol w:w="$width"/>');
  }
  out.write('</w:tblGrid>');
  for (final row in table.rows) {
    out.write('<w:tr>');
    for (var i = 0; i < widths.length; i++) {
      final text = i < row.length ? row[i] : '';
      // Every cell needs a paragraph, even an empty one, or Word calls the file damaged.
      out.write(
        '<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/></w:tcPr>'
        '<w:p><w:pPr><w:spacing w:after="0"/></w:pPr>${_runs(text)}</w:p></w:tc>',
      );
    }
    out.write('</w:tr>');
  }
  out.write('</w:tbl>');
  return out.toString();
}

String _picture(DocxPicture picture, int index) {
  final wide = picture.displayWidth;
  final byWidth = (wide == null ? _writingWidth : math.min(wide, _writingWidth)) / picture.width;
  final byHeight = _writingHeight / picture.height;
  final scale = byWidth < byHeight ? byWidth : byHeight;
  final cx = (picture.width * scale * _emuPerPoint).round();
  final cy = (picture.height * scale * _emuPerPoint).round();
  return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">'
      '<wp:extent cx="$cx" cy="$cy"/><wp:docPr id="$index" name="Page $index"/>'
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
      '<pic:pic><pic:nvPicPr><pic:cNvPr id="$index" name="image$index.jpg"/><pic:cNvPicPr/></pic:nvPicPr>'
      '<pic:blipFill><a:blip r:embed="rId${index + 1}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="$cx" cy="$cy"/></a:xfrm>'
      '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
      '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
}

String _contentTypes(bool hasPictures) {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      '<Default Extension="xml" ContentType="application/xml"/>'
      '${hasPictures ? '<Default Extension="jpg" ContentType="image/jpeg"/>' : ''}'
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
      '</Types>';
}

const _packageRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
    '</Relationships>';

String _documentRels(int pictureCount) {
  final out = StringBuffer(
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
  );
  for (var i = 1; i <= pictureCount; i++) {
    out.write(
      '<Relationship Id="rId${i + 1}" '
      'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
      'Target="media/image$i.jpg"/>',
    );
  }
  out.write('</Relationships>');
  return out.toString();
}

const _styles =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:docDefaults><w:rPrDefault><w:rPr><w:sz w:val="22"/></w:rPr></w:rPrDefault>'
    '<w:pPrDefault><w:pPr><w:spacing w:after="120"/></w:pPr></w:pPrDefault></w:docDefaults>'
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>'
    '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>'
    '<w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr>'
    '<w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:style>'
    '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>'
    '<w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr>'
    '<w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>'
    '</w:styles>';
