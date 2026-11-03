#ifndef RUNNER_RADIAL_SLICE_H_
#define RUNNER_RADIAL_SLICE_H_

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

#endif  // RUNNER_RADIAL_SLICE_H_
