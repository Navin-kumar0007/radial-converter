import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  test('rotating offers every quarter turn, right first as the slice itself does', () {
    for (final id in ['image-rotate', 'video-rotate', 'pdf-rotate']) {
      final degrees = [for (final choice in ringChoices(actionById(id)!)) choice.options.degrees];
      expect(degrees, [90, 180, 270], reason: id);
    }
  });

  test('flipping offers both ways, sideways first as the slice itself does', () {
    final choices = ringChoices(actionById('image-flip')!);
    expect([for (final choice in choices) choice.options.flipVertical], [false, true]);
  });

  test('resizing offers half, then long sides from large to small', () {
    for (final id in ['image-resize', 'video-resize']) {
      final choices = ringChoices(actionById(id)!);
      expect(choices.first.options.longSide, isNull, reason: 'half, as the slice does');
      expect([for (final choice in choices.skip(1)) choice.options.longSide], ringLongSides);
      expect(choices.last.label, '640 px');
    }
  });

  test('the first choice is what choosing the slice does', () {
    for (final action in actionCatalogue) {
      final choices = ringChoices(action);
      if (choices.isEmpty) continue;
      final first = choices.first.options;
      // Engines treat no angle as 90, no direction as sideways, and no size as half.
      expect(first.degrees ?? 90, 90, reason: action.id);
      expect(first.flipVertical, isFalse, reason: action.id);
      expect(first.longSide, isNull, reason: action.id);
    }
  });

  test('a ring never holds more than a ring of slices, nor asks anything', () {
    for (final action in actionCatalogue) {
      final choices = ringChoices(action);
      expect(choices.length, lessThanOrEqualTo(menuSlots), reason: action.id);
      expect(choices.length, isNot(1), reason: 'one choice is just the slice: ${action.id}');
    }
  });

  test('actions without choices have no ring', () {
    expect(ringChoices(actionById('image-to-jpg')!), isEmpty);
    expect(ringChoices(actionById('video-compress')!), isEmpty);
  });
}
