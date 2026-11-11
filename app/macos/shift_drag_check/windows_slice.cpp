// Checks the Windows menu's geometry against what the macOS one does. Run by check_shift_drag.sh.

#include <cmath>
#include <cstdio>

#include "radial_slice.h"

static int failures = 0;

static void Check(const char* what, int got, int expected) {
  if (got != expected) {
    std::printf("FAILED %s: got %d, expected %d\n", what, got, expected);
    failures++;
  }
}

int main() {
  const double radius = 38;
  Check("top", RadialSliceAt(0, 100, 4, radius), 0);
  Check("right", RadialSliceAt(100, 0, 4, radius), 1);
  Check("bottom", RadialSliceAt(0, -100, 4, radius), 2);
  Check("left", RadialSliceAt(-100, 0, 4, radius), 3);
  Check("just left of the top", RadialSliceAt(-30, 100, 4, radius), 0);
  Check("the centre cancels", RadialSliceAt(10, 10, 4, radius), -1);
  Check("no slices", RadialSliceAt(0, 100, 0, radius), -1);
  Check("one slice", RadialSliceAt(-80, -80, 1, radius), 0);
  for (int count = 1; count <= 8; count++) {
    for (int degrees = 0; degrees < 360; degrees += 7) {
      const double angle = degrees * 3.141592653589793 / 180;
      const int found = RadialSliceAt(std::sin(angle) * 100, std::cos(angle) * 100, count, radius);
      if (found < 0 || found >= count) {
        std::printf("FAILED %d slices at %d degrees: %d\n", count, degrees, found);
        failures++;
      }
    }
  }
  // The outer ring, as ShiftDrag.swift has it.
  const double menu = 150, ring = 178, edge = 206;
  Check("ring: the middle of three around the top", RadialChoiceAt(0, ring, 0, 6, 3, menu, edge), 1);
  const double side = ChoiceSpan(6, 3);
  Check("ring: one span clockwise",
        RadialChoiceAt(std::sin(side) * ring, std::cos(side) * ring, 0, 6, 3, menu, edge), 2);
  Check("ring: one span anticlockwise",
        RadialChoiceAt(-std::sin(side) * ring, std::cos(side) * ring, 0, 6, 3, menu, edge), 0);
  Check("ring: opposite is nothing", RadialChoiceAt(0, -ring, 0, 6, 3, menu, edge), -1);
  Check("ring: inside the menu is nothing", RadialChoiceAt(0, 140, 0, 6, 3, menu, edge), -1);
  Check("ring: past the ring is nothing", RadialChoiceAt(0, 210, 0, 6, 3, menu, edge), -1);
  Check("ring: wrapping past the top",
        RadialChoiceAt(-std::sin(0.05) * ring, std::cos(0.05) * ring, 3, 4, 3, menu, edge), 2);
  Check("ring: the middle choice lines up with its slice",
        static_cast<int>(std::lround(ChoiceAngle(1, 1, 4, 3) * 180 / 3.141592653589793)), 90);
  if (failures == 0) std::printf("Windows slice checks passed.\n");
  return failures == 0 ? 0 : 1;
}
