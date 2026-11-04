import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  group('parseClock', () {
    final good = {
      '0': 0.0,
      '90': 90.0,
      '1.5': 1.5,
      '1:30': 90.0,
      ' 1:30 ': 90.0,
      '1:30.5': 90.5,
      '90:00': 5400.0,
      '1:02:03': 3723.0,
      '0:00': 0.0,
    };
    good.forEach((text, seconds) {
      test(text, () => expect(parseClock(text), seconds));
    });

    for (final text in ['', 'abc', '1:', ':30', '1:90', '1:2:3:4', '-5', '1.5:00', '1:2:60']) {
      test('"$text" is not a time', () => expect(parseClock(text), isNull));
    }
  });

  group('writing a time', () {
    test('as people write it', () {
      expect(formatClock(0), '0:00');
      expect(formatClock(5), '0:05');
      expect(formatClock(65), '1:05');
      expect(formatClock(600), '10:00');
      expect(formatClock(3723), '1:02:03');
    });

    test('tenths only when there are some', () {
      expect(formatClock(1.5), '0:01.5');
      expect(formatClock(90.25), '1:30.3');
      expect(formatClock(59.96), '1:00');
    });

    test('nothing below zero', () => expect(formatClock(-3), '0:00'));

    test('reads back as what it says', () {
      for (final seconds in const [0.0, 1.5, 59.9, 60.0, 90.5, 3599.9, 3600.0, 7384.2]) {
        expect(parseClock(formatClock(seconds)), closeTo(seconds, 0.001), reason: '$seconds');
      }
    });
  });
}
