import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/conversion.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/reorder_dialog.dart';
import 'package:shiftdrop/words.dart';

PickedFile _picture(String name) {
  final bytes = img.encodePng(img.Image(width: 8, height: 8));
  return PickedFile(name: name, size: bytes.length, head: bytes, read: () async => bytes);
}

void main() {
  group('the dialog', () {
    late List<int>? answer;

    Future<void> show(WidgetTester tester, List<String> names) async {
      answer = [-1];
      final files = [for (final name in names) _picture(name)];
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: Builder(
            builder: (context) => TextButton(
              onPressed: () async {
                answer = await askForOrder(
                  context,
                  action: actionById('pdf-merge')!,
                  files: files,
                  kinds: [for (final _ in files) FileKind.pdf],
                );
              },
              child: const Text('open'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
    }

    testWidgets('shows the files in order, and answers with that order', (tester) async {
      await show(tester, ['a.pdf', 'b.pdf', 'c.pdf']);
      expect(find.text('Put them in order'), findsOneWidget);
      expect(find.text('1. a.pdf'), findsOneWidget);
      expect(find.text('3. c.pdf'), findsOneWidget);
      await tester.tap(find.text('Merge'));
      await tester.pumpAndSettle();
      expect(answer, [0, 1, 2]);
    });

    testWidgets('the arrows move a file, and stop at the ends', (tester) async {
      await show(tester, ['a.pdf', 'b.pdf', 'c.pdf']);
      final upFirst = tester.widget<IconButton>(
        find.ancestor(of: find.byIcon(Icons.arrow_upward), matching: find.byType(IconButton)).first,
      );
      expect(upFirst.onPressed, isNull);
      await tester.tap(find.byTooltip('Move c.pdf up'));
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip('Move a.pdf down'));
      await tester.pumpAndSettle();
      expect(find.text('1. c.pdf'), findsOneWidget);
      expect(find.text('2. a.pdf'), findsOneWidget);
      await tester.tap(find.text('Merge'));
      await tester.pumpAndSettle();
      expect(answer, [2, 0, 1]);
    });

    testWidgets('a file can be dragged by its handle', (tester) async {
      await show(tester, ['a.pdf', 'b.pdf', 'c.pdf']);
      final handle = find.byIcon(Icons.drag_handle).first;
      final gesture = await tester.startGesture(tester.getCenter(handle));
      await tester.pump(kLongPressTimeout);
      for (var i = 0; i < 10; i++) {
        await gesture.moveBy(const Offset(0, 15));
        await tester.pump(const Duration(milliseconds: 16));
      }
      await gesture.up();
      await tester.pumpAndSettle();
      await tester.tap(find.text('Merge'));
      await tester.pumpAndSettle();
      expect(answer!.first, isNot(0), reason: 'a.pdf moved down');
      expect(answer!.toSet(), {0, 1, 2});
    });

    testWidgets('cancelling answers nothing', (tester) async {
      await show(tester, ['a.pdf', 'b.pdf']);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(answer, isNull);
    });

    testWidgets('many files with long names fit a small phone', (tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await show(tester, [for (var i = 0; i < 12; i++) 'a rather long scanned page name $i.pdf']);
      expect(tester.takeException(), isNull);
    });
  });

  testWidgets('One PDF from the main screen uses the order chosen', (tester) async {
    final orders = <List<String>>[];
    final files = [_picture('first.png'), _picture('second.png')];
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: Words.localizationsDelegates,
        home: ConverterScreen(
          pickFiles: () async => files,
          saveFile: (_) async => const SavedAs(),
          mediaAvailable: false,
          historyReader: () async => null,
          historyWriter: (_) async {},
          sharedFiles: () => const Stream.empty(),
          keepWorking: (_) async {},
          converter: (action, given, onProgress, options) async {
            orders.add([for (final file in given) file.name]);
            return [PortableFile('combined.pdf', Uint8List(4))];
          },
        ),
      ),
    );
    await tester.tap(find.textContaining('hoose'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Tools'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('One PDF'));
    await tester.pumpAndSettle();
    expect(find.text('Put them in order'), findsOneWidget);
    await tester.tap(find.byTooltip('Move second.png up'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('One PDF').last);
    await tester.pumpAndSettle();
    expect(orders, [
      ['second.png', 'first.png'],
    ]);
  });
}
