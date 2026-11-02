import 'package:flutter_test/flutter_test.dart';
import 'package:radialconverter/radial_geometry.dart';

const diameter = 280.0;
const hub = 56.0;

int? at(double x, double y, int count) {
  return sliceAt(Offset(x, y), diameter: diameter, hubRadius: hub, count: count);
}

void main() {
  group('sliceAt', () {
    test('slice 0 is at the top and they run clockwise', () {
      expect(at(140, 40, 4), 0); // top
      expect(at(240, 140, 4), 1); // right
      expect(at(140, 240, 4), 2); // bottom
      expect(at(40, 140, 4), 3); // left
    });

    test('eight slices', () {
      expect(at(140, 40, 8), 0);
      expect(at(210, 70, 8), 1);
      expect(at(240, 140, 8), 2);
      expect(at(70, 70, 8), 7);
    });

    test('a slice straddles the top, so just left of top is still slice 0', () {
      expect(at(139, 40, 8), 0);
      expect(at(141, 40, 8), 0);
    });

    test('the hub and outside the ring are nothing', () {
      expect(at(140, 140, 8), isNull);
      expect(at(150, 150, 8), isNull);
      expect(at(0, 0, 8), isNull);
      expect(at(279, 279, 8), isNull);
    });

    test('no slices means nothing', () => expect(at(140, 40, 0), isNull));

    test('one slice covers the whole ring', () {
      expect(at(140, 40, 1), 0);
      expect(at(140, 240, 1), 0);
    });

    test('never out of range anywhere', () {
      for (var count = 1; count <= 9; count++) {
        for (var x = 0.0; x < diameter; x += 7) {
          for (var y = 0.0; y < diameter; y += 7) {
            final slice = at(x, y, count);
            if (slice != null) expect(slice, inInclusiveRange(0, count - 1));
          }
        }
      }
    });
  });

  test('isInHub', () {
    expect(isInHub(const Offset(140, 140), diameter: diameter, hubRadius: hub), isTrue);
    expect(isInHub(const Offset(140, 90), diameter: diameter, hubRadius: hub), isTrue);
    expect(isInHub(const Offset(140, 40), diameter: diameter, hubRadius: hub), isFalse);
  });

  test('every slice centre is under its own slice', () {
    for (var count = 1; count <= 9; count++) {
      for (var slice = 0; slice < count; slice++) {
        final centre = sliceCentre(slice, diameter: diameter, hubRadius: hub, count: count);
        expect(sliceAt(centre, diameter: diameter, hubRadius: hub, count: count), slice);
      }
    }
  });
}
