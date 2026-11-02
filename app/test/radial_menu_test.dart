import 'dart:ui' show PointerDeviceKind;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/radial_geometry.dart';
import 'package:radialconverter/radial_menu.dart';

const diameter = 280.0;
const hub = 56.0;

final image = actionsFor(const [FileKind.jpg], ActionMode.convert);
final pdf = actionsFor(const [FileKind.pdf], ActionMode.convert);

void main() {
  late List<RadialAction> selected;
  late int cancels;

  setUp(() {
    selected = [];
    cancels = 0;
  });

  Future<void> pump(
    WidgetTester tester,
    List<RadialAction> actions, {
    int fileCount = 1,
    bool reduceMotion = false,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        home: MediaQuery(
          data: MediaQueryData(disableAnimations: reduceMotion),
          child: Scaffold(
            body: Center(
              child: RadialMenu(
                actions: actions,
                fileCount: fileCount,
                onSelected: selected.add,
                onCancelled: () => cancels++,
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 200));
  }

  /// Screen position of the middle of a slice.
  Offset slicePoint(WidgetTester tester, int slice, int count) {
    final origin = tester.getTopLeft(find.byType(RadialMenu));
    return origin + sliceCentre(slice, diameter: diameter, hubRadius: hub, count: count);
  }

  Future<void> press(WidgetTester tester, LogicalKeyboardKey key) async {
    await tester.sendKeyEvent(key);
    await tester.pump();
  }

  group('mouse', () {
    testWidgets('clicking a slice selects its action', (tester) async {
      await pump(tester, pdf);
      expect(pdf.length, lessThanOrEqualTo(menuSlots));
      await tester.tapAt(slicePoint(tester, 0, pdf.length));
      expect(selected.single.id, menuPages(pdf).single.first.id);
    });

    testWidgets('clicking the centre cancels', (tester) async {
      await pump(tester, pdf);
      await tester.tapAt(tester.getCenter(find.byType(RadialMenu)));
      expect(cancels, 1);
      expect(selected, isEmpty);
    });

    testWidgets('clicking a corner of the square does nothing', (tester) async {
      await pump(tester, pdf);
      await tester.tapAt(tester.getTopLeft(find.byType(RadialMenu)) + const Offset(2, 2));
      expect(cancels, 0);
      expect(selected, isEmpty);
    });

    testWidgets('hovering highlights, and leaving clears it', (tester) async {
      await pump(tester, pdf);
      final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await mouse.addPointer(location: Offset.zero);
      addTearDown(mouse.removePointer);
      await mouse.moveTo(slicePoint(tester, 1, pdf.length));
      await tester.pump();
      final label = menuPages(pdf).single[1].label;
      expect(
        tester.getSemantics(find.bySemanticsLabel(label)),
        matchesSemantics(
          isButton: true,
          isSelected: true,
          hasSelectedState: true,
          hasTapAction: true,
          label: label,
        ),
      );
      await mouse.moveTo(const Offset(1, 1));
      await tester.pump();
      expect(
        tester.getSemantics(find.bySemanticsLabel(label)),
        matchesSemantics(isButton: true, hasSelectedState: true, hasTapAction: true, label: label),
      );
    });
  });

  group('More', () {
    testWidgets('appears when actions do not fit, and only then', (tester) async {
      await pump(tester, image);
      expect(find.text('More'), findsOneWidget);
      await pump(tester, pdf);
      expect(find.text('More'), findsNothing);
    });

    testWidgets('resting on More turns the page, as a drop cannot click', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      expect(find.text(pages[1].first.label), findsNothing);

      final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await mouse.addPointer(location: Offset.zero);
      addTearDown(mouse.removePointer);
      await mouse.moveTo(slicePoint(tester, pages.first.length, pages.first.length + 1));
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text(pages[1].first.label), findsNothing, reason: 'too early');
      await tester.pump(const Duration(milliseconds: 150));
      expect(find.text(pages[1].first.label), findsOneWidget);
    });

    testWidgets('moving off More before the wait does not turn the page', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
      await mouse.addPointer(location: Offset.zero);
      addTearDown(mouse.removePointer);
      final count = pages.first.length + 1;
      await mouse.moveTo(slicePoint(tester, pages.first.length, count));
      await tester.pump(const Duration(milliseconds: 200));
      await mouse.moveTo(slicePoint(tester, 0, count));
      await tester.pump(const Duration(seconds: 1));
      expect(find.text(pages.first.first.label), findsOneWidget);
    });

    testWidgets('clicking More turns the page without selecting', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      final count = pages.first.length + 1;
      await tester.tapAt(slicePoint(tester, pages.first.length, count));
      await tester.pump();
      expect(selected, isEmpty);
      expect(find.text(pages[1].first.label), findsOneWidget);
    });

    testWidgets('the last page wraps back to the first', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      for (var i = 0; i < pages.length; i++) {
        await press(tester, LogicalKeyboardKey.tab);
      }
      expect(find.text(pages.first.first.label), findsOneWidget);
    });
  });

  group('keyboard', () {
    testWidgets('arrows then Enter select', (tester) async {
      await pump(tester, pdf);
      await press(tester, LogicalKeyboardKey.arrowRight);
      await press(tester, LogicalKeyboardKey.arrowRight);
      await press(tester, LogicalKeyboardKey.enter);
      expect(selected.single.id, menuPages(pdf).single[1].id);
    });

    testWidgets('going back from the start wraps to the end', (tester) async {
      await pump(tester, pdf);
      await press(tester, LogicalKeyboardKey.arrowLeft);
      await press(tester, LogicalKeyboardKey.enter);
      expect(selected.single.id, menuPages(pdf).single.last.id);
    });

    testWidgets('Enter with nothing highlighted does nothing', (tester) async {
      await pump(tester, pdf);
      await press(tester, LogicalKeyboardKey.enter);
      expect(selected, isEmpty);
    });

    testWidgets('Esc cancels', (tester) async {
      await pump(tester, pdf);
      await press(tester, LogicalKeyboardKey.escape);
      expect(cancels, 1);
    });

    testWidgets('Tab turns the page', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      await press(tester, LogicalKeyboardKey.tab);
      expect(find.text(pages[1].first.label), findsOneWidget);
    });

    testWidgets('Enter on More turns the page and keeps the keyboard in the ring', (tester) async {
      await pump(tester, image);
      final pages = menuPages(image);
      await press(tester, LogicalKeyboardKey.arrowLeft);
      await press(tester, LogicalKeyboardKey.enter);
      expect(selected, isEmpty);
      await press(tester, LogicalKeyboardKey.enter);
      expect(selected.single.id, pages[1].first.id);
    });
  });

  group('screen readers', () {
    testWidgets('every slice and the centre is a labelled button', (tester) async {
      final handle = tester.ensureSemantics();
      await pump(tester, pdf);
      for (final action in menuPages(pdf).single) {
        expect(find.bySemanticsLabel(action.label), findsWidgets);
      }
      expect(find.bySemanticsLabel('Cancel'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('the file count is read out', (tester) async {
      final handle = tester.ensureSemantics();
      await pump(tester, pdf, fileCount: 3);
      expect(find.bySemanticsLabel('Cancel, 3 files'), findsOneWidget);
      handle.dispose();
    });
  });

  testWidgets('several files show a count; one file does not', (tester) async {
    await pump(tester, pdf, fileCount: 3);
    expect(find.text('3'), findsOneWidget);
    await pump(tester, pdf);
    expect(find.text('1'), findsNothing);
  });

  testWidgets('a file nothing can use still opens and can be cancelled', (tester) async {
    await pump(tester, const []);
    expect(find.text('Nothing fits'), findsOneWidget);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.tapAt(tester.getCenter(find.byType(RadialMenu)));
    expect(cancels, 1);
  });

  testWidgets('new actions go back to the first page', (tester) async {
    await pump(tester, image);
    await press(tester, LogicalKeyboardKey.tab);
    final videos = actionsFor(const [FileKind.mp4], ActionMode.convert);
    await pump(tester, videos);
    expect(find.text(menuPages(videos).first.first.label), findsWidgets);
  });

  testWidgets('it opens in 120 ms, and at once with Reduce motion', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RadialMenu(actions: pdf, onSelected: selected.add, onCancelled: () {}),
        ),
      ),
    );
    FadeTransition fade() => tester.widget(
      find.descendant(of: find.byType(RadialMenu), matching: find.byType(FadeTransition)).first,
    );
    expect(fade().opacity.value, 0);
    await tester.pump(const Duration(milliseconds: 120));
    expect(fade().opacity.value, 1);

    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(
      MaterialApp(
        home: MediaQuery(
          data: const MediaQueryData(disableAnimations: true),
          child: Scaffold(
            body: RadialMenu(actions: pdf, onSelected: selected.add, onCancelled: () {}),
          ),
        ),
      ),
    );
    expect(fade().opacity.value, 1);
  });

  testWidgets('no text overflows, for any kind of file', (tester) async {
    for (final kind in FileKind.values) {
      for (final mode in ActionMode.values) {
        final actions = actionsFor([kind], mode);
        await pump(tester, actions);
        for (var page = 0; page < menuPages(actions).length; page++) {
          expect(tester.takeException(), isNull, reason: '${kind.name} ${mode.name} page $page');
          await press(tester, LogicalKeyboardKey.tab);
        }
      }
    }
  });
}
