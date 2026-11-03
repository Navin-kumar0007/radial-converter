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
}
