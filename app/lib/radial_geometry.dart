import 'dart:math' as math;
import 'dart:ui';

/// The slice under [point], in a ring centred in a square of [diameter]. Slice 0 is at the
/// top and they run clockwise. Null means the centre (cancel) or outside the ring.
int? sliceAt(
  Offset point, {
  required double diameter,
  required double hubRadius,
  required int count,
}) {
  if (count < 1) return null;
  final centre = diameter / 2;
  final dx = point.dx - centre;
  final dy = point.dy - centre;
  final distance = math.sqrt(dx * dx + dy * dy);
  if (distance <= hubRadius || distance > centre) return null;

  final span = 2 * math.pi / count;
  var angle = math.atan2(dx, -dy); // 0 is straight up, growing clockwise; y grows downward
  if (angle < 0) angle += 2 * math.pi;
  return ((angle + span / 2) / span).floor() % count;
}

/// True when [point] is in the centre of the menu.
bool isInHub(Offset point, {required double diameter, required double hubRadius}) {
  final centre = diameter / 2;
  final dx = point.dx - centre;
  final dy = point.dy - centre;
  return dx * dx + dy * dy <= hubRadius * hubRadius;
}

/// The middle of slice [index], where its icon and label go.
Offset sliceCentre(
  int index, {
  required double diameter,
  required double hubRadius,
  required int count,
}) {
  final middle = (hubRadius + diameter / 2) / 2;
  final angle = index * 2 * math.pi / count;
  return Offset(diameter / 2 + math.sin(angle) * middle, diameter / 2 - math.cos(angle) * middle);
}

/// How wide each outer-ring choice is: as wide as a slice, so the middle one lines up with the
/// slice it belongs to, but never so wide that a menu of few slices gets huge choices, nor so wide
/// that the choices go round more than once.
double choiceSpan({required int count, required int choices}) {
  return math.min(2 * math.pi / math.max(count, 6), 2 * math.pi / math.max(choices, 1));
}

/// The angle of [index]'s middle among [choices] gathered around slice [parent] of [count]: 0 is
/// straight up, growing clockwise.
double choiceAngle(int index, {required int parent, required int count, required int choices}) {
  final middle = parent * 2 * math.pi / count;
  final span = choiceSpan(count: count, choices: choices);
  return middle - choices * span / 2 + (index + 0.5) * span;
}

/// The outer-ring choice under [point], in a square of [size] holding the menu's [diameter] with
/// the ring around it. Null off the ring, or on it beyond the choices.
int? choiceAt(
  Offset point, {
  required double size,
  required double diameter,
  required int parent,
  required int count,
  required int choices,
}) {
  if (choices < 1 || count < 1) return null;
  final centre = size / 2;
  final dx = point.dx - centre;
  final dy = point.dy - centre;
  final distance = math.sqrt(dx * dx + dy * dy);
  if (distance <= diameter / 2 || distance > centre) return null;
  final span = choiceSpan(count: count, choices: choices);
  final first = choiceAngle(0, parent: parent, count: count, choices: choices) - span / 2;
  var from = math.atan2(dx, -dy) - first;
  from %= 2 * math.pi;
  final index = (from / span).floor();
  return index < choices ? index : null;
}

/// The middle of outer-ring choice [index], where its label goes. See [choiceAt].
Offset choiceCentre(
  int index, {
  required double size,
  required double diameter,
  required int parent,
  required int count,
  required int choices,
}) {
  final middle = (diameter / 2 + size / 2) / 2;
  final angle = choiceAngle(index, parent: parent, count: count, choices: choices);
  return Offset(size / 2 + math.sin(angle) * middle, size / 2 - math.cos(angle) * middle);
}
