import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:radialconverter/file_chip.dart';

void main() {
  Widget host(FileChip chip) => MaterialApp(
    home: Scaffold(body: Center(child: chip)),
  );

  testWidgets('working shows progress and no actions', (tester) async {
    await tester.pumpWidget(
      host(const FileChip(name: 'a.png', state: FileChipState.working, progress: 0.4)),
    );
    final ring = tester.widget<CircularProgressIndicator>(find.byType(CircularProgressIndicator));
    expect(ring.value, 0.4);
    expect(find.byTooltip('Undo'), findsNothing);
  });

  testWidgets('done offers each action it was given', (tester) async {
    final pressed = <String>[];
    await tester.pumpWidget(
      host(
        FileChip(
          name: 'a.png',
          state: FileChipState.done,
          onSave: () => pressed.add('save'),
          onCopy: () => pressed.add('copy'),
          onShowInFolder: () => pressed.add('show'),
          onUndo: () => pressed.add('undo'),
        ),
      ),
    );
    await tester.tap(find.byTooltip('Save'));
    await tester.tap(find.byTooltip('Copy'));
    await tester.tap(find.byTooltip('Show in folder'));
    await tester.tap(find.byTooltip('Undo'));
    expect(pressed, ['save', 'copy', 'show', 'undo']);
  });

  testWidgets('actions it was not given are not shown', (tester) async {
    await tester.pumpWidget(host(FileChip(name: 'a', state: FileChipState.done, onSave: () {})));
    expect(find.byTooltip('Save'), findsOneWidget);
    expect(find.byTooltip('Undo'), findsNothing);
    expect(find.byTooltip('Copy'), findsNothing);
  });

  testWidgets('shows the sizes once done', (tester) async {
    await tester.pumpWidget(
      host(const FileChip(name: 'a', state: FileChipState.done, detail: '2 MB → 100 KB')),
    );
    expect(find.text('2 MB → 100 KB'), findsOneWidget);
  });

  testWidgets('cancel is its own button for screen readers while working', (tester) async {
    final handle = tester.ensureSemantics();
    var cancelled = 0;
    await tester.pumpWidget(
      host(
        FileChip(
          name: 'a.mp4',
          state: FileChipState.working,
          progress: 0.1,
          onCancel: () => cancelled++,
        ),
      ),
    );
    final node = tester.getSemantics(find.byTooltip('Cancel'));
    expect(node.getSemanticsData().tooltip, 'Cancel');
    expect(node.getSemanticsData().hasAction(SemanticsAction.tap), isTrue);
    expect(node.getSemanticsData().label, isNot(contains('a.mp4')));
    await tester.tap(find.byTooltip('Cancel'));
    expect(cancelled, 1);
    handle.dispose();
  });

  testWidgets('an indeterminate ring has no value', (tester) async {
    await tester.pumpWidget(
      host(const FileChip(name: 'a', state: FileChipState.working, indeterminate: true)),
    );
    final ring = tester.widget<CircularProgressIndicator>(find.byType(CircularProgressIndicator));
    expect(ring.value, isNull);
  });

  testWidgets('failed shows why, in words', (tester) async {
    await tester.pumpWidget(
      host(const FileChip(name: 'a.mov', state: FileChipState.failed, message: 'Try MP4 or MOV.')),
    );
    expect(find.text('Try MP4 or MOV.'), findsOneWidget);
    expect(find.byTooltip('Undo'), findsNothing);
    expect(find.bySemanticsLabel('Failed'), findsOneWidget);
  });

  testWidgets('fades after 10 seconds, only once done', (tester) async {
    var faded = 0;
    Widget chip(FileChipState state) =>
        host(FileChip(name: 'a.png', state: state, onFaded: () => faded++));

    await tester.pumpWidget(chip(FileChipState.working));
    await tester.pump(const Duration(seconds: 30));
    expect(faded, 0, reason: 'a running job never fades');

    await tester.pumpWidget(chip(FileChipState.done));
    await tester.pump(const Duration(seconds: 9));
    expect(faded, 0);
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
    expect(faded, 1);
  });

  testWidgets('a failure stays until dealt with', (tester) async {
    var faded = 0;
    await tester.pumpWidget(
      host(FileChip(name: 'a.png', state: FileChipState.failed, onFaded: () => faded++)),
    );
    await tester.pump(const Duration(minutes: 1));
    expect(faded, 0);
  });

  testWidgets('closing before the fade leaves no timer behind', (tester) async {
    await tester.pumpWidget(host(const FileChip(name: 'a.png', state: FileChipState.done)));
    await tester.pumpWidget(const SizedBox());
    await tester.pump(const Duration(seconds: 20));
    expect(tester.takeException(), isNull);
  });

  testWidgets('a long Hindi name does not overflow', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: 240,
              child: FileChip(
                name: '${'बहुत लंबा फ़ाइल नाम ' * 6}(converted).png',
                state: FileChipState.done,
              ),
            ),
          ),
        ),
      ),
    );
    expect(tester.takeException(), isNull);
  });

  group('handing a result on', () {
    Future<void> pump(WidgetTester tester, FileChip chip) {
      return tester.pumpWidget(
        MaterialApp(
          home: Scaffold(body: Center(child: chip)),
        ),
      );
    }

    testWidgets('dragging a finished chip starts a drag', (tester) async {
      var dragged = 0;
      await pump(
        tester,
        FileChip(name: 'a.png', state: FileChipState.done, onDragOut: () => dragged++),
      );
      await tester.drag(find.text('a.png'), const Offset(60, 0));
      expect(dragged, 1);
    });

    testWidgets('a tap doesn\'t count as a drag', (tester) async {
      var dragged = 0;
      await pump(
        tester,
        FileChip(name: 'a.png', state: FileChipState.done, onDragOut: () => dragged++),
      );
      await tester.tap(find.text('a.png'));
      expect(dragged, 0);
    });

    testWidgets('its Save button still works on a chip that can be dragged', (tester) async {
      var saved = 0;
      var dragged = 0;
      await pump(
        tester,
        FileChip(
          name: 'a.png',
          state: FileChipState.done,
          onDragOut: () => dragged++,
          onSave: () => saved++,
        ),
      );
      await tester.tap(find.byTooltip('Save'));
      expect((saved, dragged), (1, 0));
    });

    testWidgets('nothing can be dragged until it\'s finished', (tester) async {
      var dragged = 0;
      await pump(
        tester,
        FileChip(name: 'a.png', state: FileChipState.working, onDragOut: () => dragged++),
      );
      await tester.drag(find.text('a.png'), const Offset(60, 0));
      expect(dragged, 0);
    });

    testWidgets('a failed one can\'t be dragged', (tester) async {
      var dragged = 0;
      await pump(
        tester,
        FileChip(name: 'a.png', state: FileChipState.failed, onDragOut: () => dragged++),
      );
      await tester.drag(find.text('a.png'), const Offset(60, 0));
      expect(dragged, 0);
    });

    testWidgets('sharing has its own button, only when offered', (tester) async {
      var shared = 0;
      await pump(
        tester,
        FileChip(name: 'a.png', state: FileChipState.done, onShare: () => shared++),
      );
      await tester.tap(find.byTooltip('Share'));
      expect(shared, 1);
      await pump(tester, const FileChip(name: 'a.png', state: FileChipState.done));
      expect(find.byTooltip('Share'), findsNothing);
    });
  });
}
