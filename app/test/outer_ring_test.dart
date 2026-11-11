import 'dart:ui' show PointerDeviceKind;

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/radial_geometry.dart';
import 'package:shiftdrop/radial_menu.dart';
import 'package:shiftdrop/words.dart';

const diameter = 280.0;
const hub = 56.0;
const band = 60.0;
const size = diameter + 2 * band;

final tools = actionsFor(const [FileKind.jpg], ActionMode.tools);
final page = menuPages(tools).first;
final count = page.length + (menuPages(tools).length > 1 ? 1 : 0);
final rotate = page.indexWhere((action) => action.id == 'image-rotate');
final compress = page.indexWhere((action) => action.id == 'image-compress');

void main() {
  late List<RadialAction> selected;
  late List<(RadialAction, ActionOptions)> chosen;

  setUp(() {
    selected = [];
    chosen = [];
  });

  Future<void> pump(WidgetTester tester, {double? width, bool withRing = true}) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: Words.localizationsDelegates,
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: width ?? 800,
              child: Center(
                child: RadialMenu(
                  actions: tools,
                  onSelected: selected.add,
                  onChoice: withRing ? (action, options) => chosen.add((action, options)) : null,
                  onCancelled: () {},
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 200));
  }

  Offset centre(WidgetTester tester) => tester.getCenter(find.byType(RadialMenu));

  Offset slicePoint(WidgetTester tester, int slice) {
    final origin = centre(tester) - const Offset(diameter / 2, diameter / 2);
    return origin + sliceCentre(slice, diameter: diameter, hubRadius: hub, count: count);
  }

  Offset choicePoint(WidgetTester tester, int choice, int choices) {
    final origin = centre(tester) - const Offset(size / 2, size / 2);
    return origin +
        choiceCentre(
          choice,
          size: size,
          diameter: diameter,
          parent: rotate,
          count: count,
          choices: choices,
        );
  }

  Future<TestGesture> hover(WidgetTester tester, Offset point) async {
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(point);
    await tester.pump();
    return mouse;
  }

  test('the tools these tests use have choices where expected', () {
    expect(rotate, isNot(-1));
    expect(compress, isNot(-1));
    expect(ringChoices(page[compress]), isEmpty);
  });

  testWidgets('resting on a slice with choices shows them around it', (tester) async {
    await pump(tester);
    expect(find.text('180°'), findsNothing);
    await hover(tester, slicePoint(tester, rotate));
    expect(find.text('90° right'), findsOneWidget);
    expect(find.text('180°'), findsOneWidget);
    expect(find.text('90° left'), findsOneWidget);
  });

  testWidgets('a slice without choices shows no ring', (tester) async {
    await pump(tester);
    await hover(tester, slicePoint(tester, compress));
    expect(find.text('180°'), findsNothing);
    expect(find.text('Half'), findsNothing);
  });

  testWidgets('a choice runs the action with what it chose', (tester) async {
    await pump(tester);
    final mouse = await hover(tester, slicePoint(tester, rotate));
    final point = choicePoint(tester, 2, 3);
    await mouse.moveTo(point);
    await tester.pump();
    await tester.tapAt(point, kind: PointerDeviceKind.mouse);
    expect(chosen, hasLength(1));
    expect(chosen.single.$1.id, 'image-rotate');
    expect(chosen.single.$2.degrees, 270);
    expect(selected, isEmpty);
  });

  testWidgets('the first choice, or the slice itself, runs it as it always did', (tester) async {
    await pump(tester);
    final mouse = await hover(tester, slicePoint(tester, rotate));
    await tester.tapAt(slicePoint(tester, rotate), kind: PointerDeviceKind.mouse);
    final first = choicePoint(tester, 0, 3);
    await mouse.moveTo(first);
    await tester.pump();
    await tester.tapAt(first, kind: PointerDeviceKind.mouse);
    expect(selected.map((action) => action.id), ['image-rotate', 'image-rotate']);
    expect(chosen, isEmpty, reason: 'so the trial of the slice can be reused');
  });

  testWidgets('the ring stays while moving onto it, even past its choices', (tester) async {
    await pump(tester);
    final mouse = await hover(tester, slicePoint(tester, rotate));
    // Out on the ring, half way round from the choices.
    final opposite = centre(tester) * 2 - choicePoint(tester, 1, 3);
    await mouse.moveTo(opposite);
    await tester.pump();
    expect(find.text('180°'), findsOneWidget);
    await tester.tapAt(opposite, kind: PointerDeviceKind.mouse);
    expect(chosen, isEmpty);
    expect(selected, isEmpty);
  });

  testWidgets('a finger taps once to see the choices, then picks one', (tester) async {
    await pump(tester);
    await tester.tapAt(slicePoint(tester, rotate));
    await tester.pump();
    expect(selected, isEmpty);
    expect(find.text('180°'), findsOneWidget);
    await tester.tapAt(choicePoint(tester, 1, 3));
    expect(chosen.single.$2.degrees, 180);
  });

  testWidgets('a finger tapping a slice without choices runs it at once', (tester) async {
    await pump(tester);
    await tester.tapAt(slicePoint(tester, compress));
    expect(selected.single.id, 'image-compress');
  });

  testWidgets('Tab goes into the choices, arrows move along them, Enter runs one', (tester) async {
    await pump(tester);
    for (var i = 0; i <= rotate; i++) {
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    }
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    expect(chosen.single.$2.degrees, 180);

    // Tab again comes back out, and Enter runs the slice.
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    expect(selected.single.id, 'image-rotate');
  });

  testWidgets('screen readers reach the choices from the slice', (tester) async {
    final semantics = tester.ensureSemantics();
    await pump(tester);
    final node = tester.getSemantics(find.bySemanticsLabel('Rotate'));
    final labels = node.getSemanticsData().customSemanticsActionIds!.map((id) {
      return CustomSemanticsAction.getAction(id)!.label;
    });
    expect(labels, containsAll(['180°', '90° left']));
    semantics.dispose();
  });

  testWidgets('without a way to run choices, the menu has no ring and keeps its size', (
    tester,
  ) async {
    await pump(tester, withRing: false);
    expect(tester.getSize(find.byType(RadialMenu)), const Size.square(diameter));
    await hover(tester, slicePoint(tester, rotate));
    expect(find.text('180°'), findsNothing);
  });

  testWidgets('a narrow screen gets a narrower ring, then a smaller menu, then no ring', (
    tester,
  ) async {
    // A phone: the menu keeps its size and the ring gives way.
    await pump(tester, width: 380);
    expect(tester.getSize(find.byType(RadialMenu)), const Size.square(380));
    await pump(tester, width: 340);
    expect(tester.getSize(find.byType(RadialMenu)), const Size.square(340));
    await pump(tester, width: 300);
    expect(tester.getSize(find.byType(RadialMenu)), const Size.square(diameter));
    await tester.tapAt(slicePoint(tester, rotate));
    expect(selected.single.id, 'image-rotate', reason: 'no ring to show, so it runs');
  });

  test('every choice reads in Hindi, except angles and sizes', () {
    final hindi = wordsFor(const Locale('hi'));
    for (final action in actionCatalogue) {
      for (final choice in ringChoices(action)) {
        final label = ringChoiceLabel(hindi, choice);
        if (RegExp(r'^[\d° px]+$').hasMatch(choice.label)) {
          expect(label, choice.label);
        } else {
          expect(label, isNot(choice.label), reason: choice.key);
        }
      }
    }
  });

  group('ring geometry', () {
    test('each choice is found where it is drawn, for any menu', () {
      for (var count = 1; count <= 8; count++) {
        for (var choices = 2; choices <= 4; choices++) {
          for (var parent = 0; parent < count; parent++) {
            for (var i = 0; i < choices; i++) {
              final point = choiceCentre(
                i,
                size: size,
                diameter: diameter,
                parent: parent,
                count: count,
                choices: choices,
              );
              final found = choiceAt(
                point,
                size: size,
                diameter: diameter,
                parent: parent,
                count: count,
                choices: choices,
              );
              expect(found, i, reason: '$count slices, $choices choices, slice $parent');
            }
          }
        }
      }
    });

    test('an odd number of choices puts the middle one in line with its slice', () {
      final middle = choiceAngle(1, parent: 2, count: 7, choices: 3);
      expect(middle, closeTo(2 * 2 * 3.141592653589793 / 7, 1e-9));
      expect(choiceSpan(count: 7, choices: 3), closeTo(2 * 3.141592653589793 / 7, 1e-9));
    });

    test('few slices still get modest choices, and choices never go round twice', () {
      expect(choiceSpan(count: 2, choices: 3), closeTo(2 * 3.141592653589793 / 6, 1e-9));
      expect(choiceSpan(count: 8, choices: 8) * 8, closeTo(2 * 3.141592653589793, 1e-9));
    });

    test('the menu itself and beyond the ring are not choices', () {
      const centre = Offset(size / 2, size / 2);
      int? at(Offset point) =>
          choiceAt(point, size: size, diameter: diameter, parent: 0, count: 8, choices: 3);
      expect(at(centre + const Offset(0, -100)), isNull);
      expect(at(centre + const Offset(0, -170)), 1);
      expect(at(centre + const Offset(0, -210)), isNull);
    });
  });
}
