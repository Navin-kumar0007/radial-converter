#ifndef RUNNER_RADIAL_SLICE_H_
#define RUNNER_RADIAL_SLICE_H_

#include <algorithm>
#include <cmath>

// The slice at a point, for `count` slices: 0 is at the top, then clockwise. -1 is the centre, which
// cancels. Coordinates are from the menu's centre, with y growing upwards. Matches ShiftDrag.swift.
inline int RadialSliceAt(double dx, double dy, int count, double inner_radius) {
  if (count <= 0 || std::hypot(dx, dy) <= inner_radius) return -1;
  const double two_pi = 6.283185307179586;
  const double span = two_pi / count;
  double angle = std::atan2(dx, dy);
  if (angle < 0) angle += two_pi;
  const int index = static_cast<int>(std::fmod(angle + span / 2, two_pi) / span);
  return index < count - 1 ? index : count - 1;
}

// How wide each outer-ring choice is, as choiceSpan in radial_geometry.dart: as wide as a slice, but
// never so wide that a menu of few slices gets huge choices, nor going round more than once.
inline double ChoiceSpan(int count, int choices) {
  const double two_pi = 6.283185307179586;
  return std::min(two_pi / std::max(count, 6), two_pi / std::max(choices, 1));
}

// The middle of choice `index` among `choices` around slice `parent` of `count`, in radians: 0 is
// straight up, growing clockwise.
inline double ChoiceAngle(int index, int parent, int count, int choices) {
  const double two_pi = 6.283185307179586;
  const double span = ChoiceSpan(count, choices);
  return parent * two_pi / count - choices * span / 2 + (index + 0.5) * span;
}

// The outer-ring choice at a point, from the menu's centre with y growing upwards. -1 inside the
// menu, past the ring, or on the ring beyond the choices. Matches radialChoice in ShiftDrag.swift.
inline int RadialChoiceAt(double dx, double dy, int parent, int count, int choices,
                          double menu_radius, double ring_radius) {
  if (choices <= 0 || count <= 0) return -1;
  const double distance = std::hypot(dx, dy);
  if (distance <= menu_radius || distance > ring_radius) return -1;
  const double two_pi = 6.283185307179586;
  const double span = ChoiceSpan(count, choices);
  const double first = ChoiceAngle(0, parent, count, choices) - span / 2;
  double from = std::fmod(std::atan2(dx, dy) - first, two_pi);
  if (from < 0) from += two_pi;
  const int index = static_cast<int>(from / span);
  return index < choices ? index : -1;
}

#endif  // RUNNER_RADIAL_SLICE_H_
