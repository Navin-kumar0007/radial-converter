import 'package:flutter/material.dart';
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

  testWidgets('done offers copy, show and undo', (tester) async {
    final pressed = <String>[];
    await tester.pumpWidget(
      host(
        FileChip(
          name: 'a.png',
          state: FileChipState.done,
          onCopy: () => pressed.add('copy'),
          onShowInFolder: () => pressed.add('show'),
          onUndo: () => pressed.add('undo'),
        ),
      ),
    );
    await tester.tap(find.byTooltip('Copy'));
    await tester.tap(find.byTooltip('Show in folder'));
    await tester.tap(find.byTooltip('Undo'));
    expect(pressed, ['copy', 'show', 'undo']);
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
}
