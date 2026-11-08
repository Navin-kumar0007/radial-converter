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
