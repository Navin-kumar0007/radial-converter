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
  if (failures == 0) std::printf("Windows slice checks passed.\n");
  return failures == 0 ? 0 : 1;
}
