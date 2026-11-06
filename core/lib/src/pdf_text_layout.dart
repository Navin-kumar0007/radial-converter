import 'dart:math' as math;

import 'docx_writer.dart';

/// Where a character sits on a page, with y growing upward, as PDFs measure it.
typedef CharBox = ({double left, double top, double right, double bottom});

class _Line {
  _Line(this.top, this.bottom, this.left, this.right);

  double top;
  double bottom;
  double left;
  double right;
  final text = StringBuffer();
  final heights = <double>[];

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

/// A page's characters rebuilt into paragraphs. A PDF only knows where each letter goes, not what a
/// paragraph is, so this reads it from the gaps between lines, as a person would. [text] and [boxes]
/// run side by side, one box to a UTF-16 unit. Exact layout, columns of tables and pictures are out
/// of reach this way, so callers should say so.
List<DocxParagraph> layoutPageText(
  String text,
  List<CharBox> boxes, {
  required double pageWidth,
  bool newPage = false,
}) {
  final lines = _lines(text, boxes);
  if (lines.isEmpty) return const [];
  final body = _bodyHeight(lines);
  final paragraphs = _paragraphs(lines);
  return [
    for (var i = 0; i < paragraphs.length; i++)
      _toBlock(paragraphs[i], body, pageWidth, newPage: newPage && i == 0),
  ];
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
      if (current != null && !_endsInSpace(current.text)) current.text.write(' ');
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
    // A gap this wide on one line is a column, not a space.
    if (current.heights.isNotEmpty && box.left - current.right > current.height * 3) {
      final words = current.text.toString().trimRight();
      current.text
        ..clear()
        ..write('$words\t');
    }
    current
      ..top = math.max(current.top, box.top)
      ..bottom = math.min(current.bottom, box.bottom)
      ..left = math.min(current.left, box.left)
      ..right = math.max(current.right, box.right);
    current.heights.add(height);
    current.text.write(unit);
  }
  return lines;
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

List<_Paragraph> _paragraphs(List<_Line> lines) {
  final usual = _usualPitch(lines);
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
