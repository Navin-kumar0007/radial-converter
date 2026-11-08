/// One subtitle: when it shows and what it says.
class SubtitleCue {
  const SubtitleCue(this.start, this.end, this.text);

  final Duration start;
  final Duration end;
  final String text;
}

final RegExp _timing = RegExp(
  r'^\s*((?:\d+:)?\d{1,2}:\d{2}[,.]\d{1,3})\s*-->\s*((?:\d+:)?\d{1,2}:\d{2}[,.]\d{1,3})',
);

/// Parses SRT or VTT. Blocks without a timing line (VTT headers, notes, styles) are skipped.
List<SubtitleCue> parseSubtitles(String source) {
  final text = source.replaceFirst('﻿', '').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  final cues = <SubtitleCue>[];
  for (final block in text.split(RegExp(r'\n[ \t]*\n'))) {
    final lines = block.split('\n');
    for (var i = 0; i < lines.length; i++) {
      final match = _timing.firstMatch(lines[i]);
      if (match == null) continue;
      final body = lines.sublist(i + 1).join('\n').trimRight();
      cues.add(SubtitleCue(_parseTime(match[1]!), _parseTime(match[2]!), body));
      break;
    }
  }
  return cues;
}

Duration _parseTime(String value) {
  final parts = value.replaceAll(',', '.').split(':');
  final seconds = parts.last.split('.');
  final millis = int.parse(seconds[1].padRight(3, '0'));
  final minutes = int.parse(parts[parts.length - 2]);
  final hours = parts.length == 3 ? int.parse(parts[0]) : 0;
  return Duration(
    hours: hours,
    minutes: minutes,
    seconds: int.parse(seconds[0]),
    milliseconds: millis,
  );
}

String _formatTime(Duration time, String separator) {
  String two(int value) => value.toString().padLeft(2, '0');
  final millis = (time.inMilliseconds % 1000).toString().padLeft(3, '0');
  return '${two(time.inHours)}:${two(time.inMinutes % 60)}:${two(time.inSeconds % 60)}'
      '$separator$millis';
}

String toSrt(List<SubtitleCue> cues) {
  final out = StringBuffer();
  for (var i = 0; i < cues.length; i++) {
    final cue = cues[i];
    out
      ..writeln(i + 1)
      ..writeln('${_formatTime(cue.start, ',')} --> ${_formatTime(cue.end, ',')}')
      ..writeln(cue.text)
      ..writeln();
  }
  return out.toString();
}

String toVtt(List<SubtitleCue> cues) {
  final out = StringBuffer('WEBVTT\n\n');
  for (final cue in cues) {
    out
      ..writeln('${_formatTime(cue.start, '.')} --> ${_formatTime(cue.end, '.')}')
      ..writeln(cue.text)
      ..writeln();
  }
  return out.toString();
}

/// Just the words, without timing or `<i>`-style tags.
String toPlainText(List<SubtitleCue> cues) {
  final tag = RegExp(r'<[^>]+>');
  return cues.map((cue) => '${cue.text.replaceAll(tag, '')}\n').join();
}

/// Moves every cue by [offset]. Cues pushed entirely before the start are dropped;
/// a cue that only partly crosses the start begins at zero.
List<SubtitleCue> shiftCues(List<SubtitleCue> cues, Duration offset) {
  return [
    for (final cue in cues)
      if (cue.end + offset > Duration.zero)
        SubtitleCue(
          cue.start + offset < Duration.zero ? Duration.zero : cue.start + offset,
          cue.end + offset,
          cue.text,
        ),
  ];
}
