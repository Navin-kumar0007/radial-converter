import 'dart:math' as math;

import 'docx_writer.dart';

/// Where a character sits on a page, with y growing upward, as PDFs measure it.
typedef CharBox = ({double left, double top, double right, double bottom});

/// Text on one line between two wide gaps: a table's cell, or a column's line.
class _Cell {
  _Cell(this.left, this.right);

  final double left;
  double right;
  final text = StringBuffer();

  /// Where each unit of [text] starts, so a cell spanning columns can be split between words.
  final starts = <double>[];

  void write(String unit, double at) {
    text.write(unit);
    starts.add(at);
  }
}

class _Line {
  _Line(this.top, this.bottom, this.left, this.right) : cells = [_Cell(left, right)];

  double top;
  double bottom;
  double left;
  double right;
  final text = StringBuffer();
  final heights = <double>[];

  /// The line split at its wide gaps, left to right.
  final List<_Cell> cells;

  double get height {
    final sorted = [...heights]..sort();
    return sorted.isEmpty ? top - bottom : sorted[sorted.length ~/ 2];
  }
}

class _Paragraph {
  _Paragraph(this.first) : left = first.left, right = first.right;

  final _Line first;
  double left;
  double right;
  final text = StringBuffer();
}

/// Whether a page is really a picture, even if it has some text. A scanner's app often stamps its
/// name on each page as text, and taking that as the page's content would lose all the rest. So it
/// compares how much of the page the text covers, [textCoverage], with how much is inked at all,
/// [inkCoverage], each from 0 to 1. [letters] is how many letters the page has.
bool pageIsAPicture({
  required int letters,
  required double textCoverage,
  required double inkCoverage,
}) {
  if (letters == 0) return true;
  // Text fills in only part of its boxes, so ink well beyond them must be something else.
  return inkCoverage > 0.1 && inkCoverage > textCoverage * 3 && textCoverage < 0.05;
}

/// A page's characters rebuilt into paragraphs and tables. A PDF only knows where each letter goes,
/// not what a paragraph or a table is, so this reads them from the gaps between lines and the
/// columns those gaps line up in, as a person would. [text] and [boxes] run side by side, one box to
/// a UTF-16 unit. Exact layout, merged table cells and pictures are out of reach this way, so callers
/// should say so.
List<DocxBlock> layoutPageText(
  String text,
  List<CharBox> boxes, {
  required double pageWidth,
  bool newPage = false,
}) {
  final lines = _lines(text, boxes);
  if (lines.isEmpty) return const [];
  final body = _bodyHeight(lines);
  final usual = _usualPitch(lines);
  final blocks = <DocxBlock>[];
  final pending = <_Line>[];
  void addParagraphs() {
    for (final paragraph in _paragraphs(pending, usual)) {
      blocks.add(_toBlock(paragraph, body, pageWidth, newPage: newPage && blocks.isEmpty));
    }
    pending.clear();
  }

  var i = 0;
  while (i < lines.length) {
    final table = _tableAt(lines, i, body, usual);
    if (table == null) {
      pending.add(lines[i]);
      i++;
      continue;
    }
    addParagraphs();
    blocks.add(
      DocxTable(table.rows, columnWidths: table.widths, newPage: newPage && blocks.isEmpty),
    );
    i = table.end;
  }
  addParagraphs();
  return blocks;
}

/// The table starting at line [start], if one does: at least two lines split by wide gaps at the
/// same places, with any wrapped cell text below them. [end] is the line after it.
({List<List<String>> rows, List<double> widths, int end})? _tableAt(
  List<_Line> lines,
  int start,
  double body,
  double? usual,
) {
  if (lines[start].cells.length < 2) return null;
  final pitchLimit = (usual ?? body * 1.2) * 1.6;
  final tolerance = body * 1.5;
  final columns = <double>[for (final cell in lines[start].cells) cell.left];
  int? column(double left) {
    for (var i = 0; i < columns.length; i++) {
      if ((columns[i] - left).abs() <= tolerance) return i;
    }
    return null;
  }

  var end = start + 1;
  var rowsWithGaps = 1;
  while (end < lines.length) {
    final line = lines[end];
    final pitch = _middle(lines[end - 1]) - _middle(line);
    if (pitch <= 0 || pitch > pitchLimit * (line.cells.length > 1 ? 1.5 : 1)) break;
    if (line.cells.length > 1) {
      // A row must share at least two column starts with the table so far: the left edge and one
      // more. Headings often sit closer together than the cells under them, so may share fewer.
      final shared = line.cells.where((cell) => column(cell.left) != null).length;
      if (shared < 2) break;
      for (final cell in line.cells) {
        if (column(cell.left) == null) columns.add(cell.left);
      }
      rowsWithGaps++;
    } else if (column(line.left) case final index? when index > 0) {
      // Wrapped text in a later column belongs to the row above.
    } else {
      break;
    }
    end++;
  }
  // Wrapped text can't end a table: it may be the paragraph after it.
  while (end > start + 1 && lines[end - 1].cells.length < 2) {
    end--;
  }
  if (rowsWithGaps < 2) return null;
  columns.sort();
  // Two rows of two say too little to be sure of, and read as well as two lines with a tab each.
  if (rowsWithGaps < 3 && columns.length < 3) return null;

  final rows = <List<StringBuffer>>[];
  for (var i = start; i < end; i++) {
    final line = lines[i];
    if (line.cells.length > 1) rows.add([for (final _ in columns) StringBuffer()]);
    for (final cell in line.cells) {
      for (final (index, words) in _splitAtColumns(cell, columns, body)) {
        final buffer = rows.last[index];
        if (words.isEmpty) continue;
        if (buffer.isNotEmpty) buffer.write(' ');
        buffer.write(words);
      }
    }
  }
  final table = [
    for (final row in rows) [for (final cell in row) cell.toString()],
  ];
  if (_isProseInColumns(lines.sublist(start, end), columns, body)) return null;
  // Bullets hang apart from their text, but a list isn't a table.
  if (table.every((row) => _bullet.hasMatch(row.first))) return null;
  // Prose caught between columns reads mid-sentence, so most of its pieces start in lower case,
  // where a table's cells start with a capital or a number.
  final worded = [
    for (final row in table)
      for (final cell in row)
        if (cell.isNotEmpty && _letter.hasMatch(cell[0])) cell[0],
  ];
  final lower = worded.where((first) => first != first.toUpperCase()).length;
  if (worded.isNotEmpty && lower > worded.length / 2) return null;

  // Each column runs to where the next starts, the last to the widest line's end.
  final right = lines.sublist(start, end).map((line) => line.right).reduce(math.max);
  final widths = [
    for (var i = 0; i < columns.length; i++)
      (i + 1 < columns.length ? columns[i + 1] : right) - columns[i],
  ];
  return (rows: table, widths: widths, end: end);
}

/// A cell's words by column. A cell whose gaps were too narrow to split it, as in a heading row,
/// is split before the first word starting at or past each later column it reaches.
List<(int, String)> _splitAtColumns(_Cell cell, List<double> columns, double body) {
  final text = cell.text.toString();
  final first = _nearest(columns, cell.left);
  final out = <(int, String)>[];
  var column = first;
  var from = 0;
  for (var i = 1; i < text.length; i++) {
    final next = column + 1;
    if (next >= columns.length) break;
    final startsWord = text[i - 1] == ' ' && text[i] != ' ';
    if (startsWord && cell.starts[i] >= columns[next] - body) {
      out.add((column, text.substring(from, i).trim()));
      from = i;
      // A word may start past more than one column, leaving the ones between empty.
      column = math.max(next, _nearest(columns, cell.starts[i]));
    }
  }
  out.add((column, text.substring(from).trim()));
  return out;
}

int _nearest(List<double> columns, double left) {
  var best = 0;
  for (var i = 1; i < columns.length; i++) {
    if ((columns[i] - left).abs() < (columns[best] - left).abs()) best = i;
  }
  return best;
}

/// A page set in columns also has wide gaps that line up, but its text runs right up to the next
/// column on most lines and is long, where a table's cells are short and ragged. That stays as it
/// was, rather than becoming a table of sentences.
bool _isProseInColumns(List<_Line> lines, List<double> columns, double body) {
  if (columns.length < 2) return false;
  var cells = 0;
  var letters = 0;
  var filled = 0;
  var fillable = 0;
  for (final line in lines) {
    for (final cell in line.cells) {
      cells++;
      letters += cell.text.toString().trim().length;
      final index = _nearest(columns, cell.left);
      if (index + 1 < columns.length) {
        fillable++;
        if (cell.right >= columns[index + 1] - body * 5) filled++;
      }
    }
  }
  final long = cells > 0 && letters / cells > 25;
  return long && fillable > 0 && filled / fillable > 0.6;
}

List<_Line> _lines(String text, List<CharBox> boxes) {
  final lines = <_Line>[];
  _Line? current;
  final count = math.min(text.length, boxes.length);
  for (var i = 0; i < count; i++) {
    final unit = text[i];
    if (unit == '\n' || unit == '\r') {
      current = null;
      continue;
    }
    final box = boxes[i];
    final height = box.top - box.bottom;
    if (unit.trim().isEmpty || height <= 0) {
      // PDFium gives real spaces, so gaps alone never make one: letter spacing would split words.
      if (current != null && !_endsInSpace(current.text)) {
        current.text.write(' ');
        current.cells.last.write(' ', current.right);
      }
      continue;
    }
    if (current != null) {
      // Boxes hug each glyph, so a comma sits low and a footnote mark high. Only a clear jump is a
      // new line.
      final middle = (box.top + box.bottom) / 2;
      final reach = current.height * 0.8;
      if (middle > current.top + reach || middle < current.bottom - reach) current = null;
    }
    if (current == null) {
      current = _Line(box.top, box.bottom, box.left, box.right);
      lines.add(current);
    }
    final gap = box.left - current.right;
    // A gap this wide on one line is a column, not a space.
    if (current.heights.isNotEmpty && gap > current.height * 3) {
      final words = current.text.toString().trimRight();
      current.text
        ..clear()
        ..write('$words\t');
    }
    // Table columns can sit closer: about an em apart is past any space, even in justified text.
    // Only gaps that line up over several rows make a table, so a stray wide space does no harm.
    if (current.heights.isNotEmpty && gap > current.height * 1.5) {
      current.cells.add(_Cell(box.left, box.right));
    }
    final cell = current.cells.last;
    cell
      ..right = math.max(cell.right, box.right)
      ..write(unit, box.left);
    current
      ..top = math.max(current.top, box.top)
      ..bottom = math.min(current.bottom, box.bottom)
      ..left = math.min(current.left, box.left)
      ..right = math.max(current.right, box.right);
    current.heights.add(height);
    current.text.write(unit);
  }
  for (final line in lines) {
    _rejoinJustified(line);
  }
  return lines;
}

/// Justified text stretches every space on a line by the same amount, which can pass for a table's
/// gaps. A table's gaps differ with its cells, so a line of many words whose gaps are all about
/// equal is text. Numbers are left alone, as a grid of them can be evenly spaced too.
void _rejoinJustified(_Line line) {
  final cells = line.cells;
  if (cells.length < 5) return;
  final gaps = [for (var i = 1; i < cells.length; i++) cells[i].left - cells[i - 1].right];
  final widest = gaps.reduce(math.max);
  final narrowest = gaps.reduce(math.min);
  if (widest - narrowest > widest * 0.2) return;
  final words = cells.where((cell) => _letter.hasMatch(cell.text.toString())).length;
  if (words < cells.length * 0.75) return;
  final whole = _Cell(cells.first.left, cells.last.right);
  for (var i = 0; i < cells.length; i++) {
    if (i > 0) whole.write(' ', cells[i - 1].right);
    final cell = cells[i];
    final text = cell.text.toString();
    for (var j = 0; j < text.length; j++) {
      whole.write(text[j], cell.starts[j]);
    }
  }
  cells
    ..clear()
    ..add(whole);
}

bool _endsInSpace(StringBuffer text) {
  if (text.isEmpty) return false;
  final soFar = text.toString();
  return soFar.endsWith(' ') || soFar.endsWith('\t');
}

/// The size most of the page is written in, from the height of whole lines, as single glyphs vary
/// too much: capitals look far bigger than an x. Counted by letters, so a few short lines of large
/// type can't move it.
double _bodyHeight(List<_Line> lines) {
  final all = [
    for (final line in lines)
      for (var i = 0; i < line.heights.length; i++) line.top - line.bottom,
  ]..sort();
  return all.isEmpty ? 1 : all[all.length ~/ 2];
}

/// The usual distance between one line and the next, which a paragraph's gap is measured against.
double? _usualPitch(List<_Line> lines) {
  final pitches = <double>[];
  for (var i = 1; i < lines.length; i++) {
    final pitch = _middle(lines[i - 1]) - _middle(lines[i]);
    final height = lines[i].top - lines[i].bottom;
    if (pitch > 0 && pitch < height * 2) pitches.add(pitch);
  }
  if (pitches.isEmpty) return null;
  pitches.sort();
  return pitches[pitches.length ~/ 2];
}

double _middle(_Line line) => (line.top + line.bottom) / 2;

final _onlyPunctuation = RegExp(r'^[.,;:)\]]+$');

final _letter = RegExp(r'\p{L}', unicode: true);

/// A list's mark, alone in its cell: a bullet, a dash, or a number or letter with a full stop or
/// bracket.
final _bullet = RegExp(r'^([•●○◦▪■□►▸–—\-*]|\(?[0-9a-zA-Z]{1,3}[.)])$');

List<_Paragraph> _paragraphs(List<_Line> lines, double? usual) {
  final out = <_Paragraph>[];
  _Line? before;
  for (final line in lines) {
    final words = line.text.toString().trim();
    if (words.isEmpty) continue;
    final previous = before;
    // Citation marks set high can leave the punctuation after them looking like a line of its own.
    if (out.isNotEmpty && _onlyPunctuation.hasMatch(words)) {
      out.last.text.write(words);
      continue;
    }
    var joins = false;
    if (previous != null) {
      final height = previous.top - previous.bottom;
      final pitch = _middle(previous) - _middle(line);
      final similar = ((line.top - line.bottom) - height).abs() < height * 0.35;
      final indented = line.left > previous.left + previous.height * 1.5;
      final wentBack = line.left < previous.left - previous.height * 1.5;
      // A line stopping well short of the next one is where a paragraph ended. Measured against its
      // neighbour, not the page, as columns are narrower than the page.
      final endedEarly = previous.right < line.right - previous.height * 3;
      final hasColumns = words.contains('\t') || previous.text.toString().contains('\t');
      joins =
          similar &&
          pitch > 0 &&
          pitch <= (usual ?? height * 1.1) * 1.4 &&
          !indented &&
          !wentBack &&
          !endedEarly &&
          !hasColumns;
    }
    if (joins) {
      final paragraph = out.last;
      final soFar = paragraph.text.toString();
      // A word broken across lines joins up again, unless it's a name like Anglo-Saxon.
      final next = words[0];
      final broken =
          soFar.endsWith('-') && next.toLowerCase() == next && next.toUpperCase() != next;
      if (broken) {
        paragraph.text
          ..clear()
          ..write(soFar.substring(0, soFar.length - 1));
      } else {
        paragraph.text.write(' ');
      }
      paragraph.text.write(words);
      paragraph
        ..left = math.min(paragraph.left, line.left)
        ..right = math.max(paragraph.right, line.right);
    } else {
      out.add(_Paragraph(line)..text.write(words));
    }
    before = line;
  }
  return out;
}

DocxParagraph _toBlock(
  _Paragraph paragraph,
  double body,
  double pageWidth, {
  required bool newPage,
}) {
  final text = paragraph.text.toString();
  final ratio = (paragraph.first.top - paragraph.first.bottom) / body;
  final short = text.length < 150;
  final heading = !short
      ? 0
      : ratio >= 1.8
      ? 1
      : ratio >= 1.3
      ? 2
      : 0;
  final leftGap = paragraph.left;
  final rightGap = pageWidth - paragraph.right;
  final centred =
      leftGap > pageWidth * 0.1 &&
      rightGap > pageWidth * 0.1 &&
      (leftGap - rightGap).abs() < pageWidth * 0.04;
  return DocxParagraph(text, heading: heading, centred: centred, newPage: newPage);
}
