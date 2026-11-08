import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/conversion.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/history_screen.dart';
import 'package:shiftdrop/words.dart';

final english = wordsFor(const Locale('en'));

void main() {
  final jpeg = Uint8List.fromList(img.encodeJpg(img.Image(width: 8, height: 8)));

  group('saying when', () {
    final now = DateTime(2026, 11, 5, 15, 30);

    test('today, yesterday, then the date', () {
      expect(formatWhen(english, DateTime(2026, 11, 5, 9, 5), now), 'Today 09:05');
      expect(formatWhen(english, DateTime(2026, 11, 4, 23, 59), now), 'Yesterday 23:59');
      expect(formatWhen(english, DateTime(2026, 10, 2, 7, 0), now), '2 Oct, 07:00');
    });
  });

  group('through the app', () {
    late String? stored;
    late List<(String, int)> trashed;
    late List<String> revealed;
    late String? savePath;
    Object? trashFails;

    setUp(() {
      stored = null;
      trashed = [];
      revealed = [];
      savePath = '/saved/photo (converted).png';
      trashFails = null;
    });

    Future<void> pump(WidgetTester tester, {bool undo = true}) async {
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: ConverterScreen(
            pickFiles: () async => [
              PickedFile(name: 'photo.jpg', size: jpeg.length, head: jpeg, read: () async => jpeg),
            ],
            saveFile: (file) async => SavedAs(path: savePath),
            mediaAvailable: false,
            undoAvailable: undo,
            resultsDrag: false,
            resultsShare: false,
            historyReader: () async => stored,
            historyWriter: (text) async => stored = text,
            trashResult: (path, size) async {
              final failure = trashFails;
              if (failure != null) throw failure;
              trashed.add((path, size));
            },
            revealResult: (path) async => revealed.add(path),
            converter: (action, files, onProgress, options) {
              return runPortable(action, files, options: options, onProgress: onProgress);
            },
          ),
        ),
      );
      await tester.pump();
    }

    Future<void> settle(WidgetTester tester) async {
      await tester.pump(const Duration(milliseconds: 50));
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 300)));
      await tester.pump(const Duration(milliseconds: 400));
    }

    Future<void> convertAndSave(WidgetTester tester) async {
      await tester.tap(find.text('Choose files'));
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await settle(tester);
      await tester.tap(find.byTooltip('Save'));
      await settle(tester);
    }

    Future<void> openHistory(WidgetTester tester) async {
      await tester.tap(find.byTooltip('History'));
      await tester.pumpAndSettle();
    }

    testWidgets('it starts empty and says what it\'s for', (tester) async {
      await pump(tester);
      await openHistory(tester);
      expect(find.textContaining('listed here for 30 days'), findsOneWidget);
      expect(find.text('Clear'), findsNothing);
    });

    testWidgets('a saved result is listed, and kept for next time', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      final log = HistoryLog.decode(stored);
      expect(log.items.single.path, savePath);
      expect(log.items.single.bytesBefore, jpeg.length);
      await openHistory(tester);
      expect(find.textContaining('(converted)'), findsOneWidget);
      expect(find.textContaining('Today'), findsOneWidget);
    });

    testWidgets('a result nobody saved isn\'t listed', (tester) async {
      await pump(tester);
      await tester.tap(find.text('Choose files'));
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await settle(tester);
      expect(stored, isNull);
    });

    testWidgets('history from last time is there on opening', (tester) async {
      final earlier = HistoryLog()
        ..add(finishedAt: DateTime.now(), actionLabel: 'PNG', name: 'earlier.png', bytesAfter: 9);
      stored = earlier.encode();
      await pump(tester);
      await openHistory(tester);
      expect(find.text('earlier.png'), findsOneWidget);
    });

    testWidgets('what\'s over 30 days old is forgotten on opening', (tester) async {
      final earlier = HistoryLog()
        ..add(
          finishedAt: DateTime.now().subtract(const Duration(days: 40)),
          actionLabel: 'PNG',
          name: 'ancient.png',
          bytesAfter: 9,
        );
      stored = earlier.encode();
      await pump(tester);
      expect(HistoryLog.decode(stored).items, isEmpty);
    });

    testWidgets('undo from the list moves the right file, with its size to check', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      final size = HistoryLog.decode(stored).items.single.bytesAfter;
      await openHistory(tester);
      await tester.tap(find.byTooltip('Undo'));
      await tester.pumpAndSettle();
      expect(trashed, [(savePath!, size)]);
      expect(find.textContaining('Undone'), findsOneWidget);
      expect(find.byTooltip('Undo'), findsNothing);
      expect(HistoryLog.decode(stored).items.single.undoneAt, isNotNull);
    });

    testWidgets('undo from the result itself, and it stops offering to', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      await tester.tap(find.byTooltip('Undo'));
      await tester.pumpAndSettle();
      expect(trashed, hasLength(1));
      expect(find.byTooltip('Undo'), findsNothing);
      expect(find.textContaining('Moved to'), findsWidgets);
    });

    testWidgets('undo that fails says why, and stays undoable', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      trashFails = const EngineFailed('It has changed since, so it was left alone.');
      await openHistory(tester);
      await tester.tap(find.byTooltip('Undo'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.textContaining('changed since'), findsOneWidget);
      expect(find.byTooltip('Undo'), findsOneWidget);
      expect(HistoryLog.decode(stored).items.single.undoneAt, isNull);
    });

    testWidgets('show in folder asks for the right file', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      await openHistory(tester);
      await tester.tap(find.byTooltip('Show in folder'));
      await tester.pump();
      expect(revealed, [savePath]);
    });

    testWidgets('where saves can\'t be reached, it lists but offers no undo', (tester) async {
      await pump(tester, undo: false);
      await convertAndSave(tester);
      expect(find.byTooltip('Undo'), findsNothing);
      await openHistory(tester);
      expect(find.textContaining('(converted)'), findsOneWidget);
      expect(find.byTooltip('Undo'), findsNothing);
      expect(find.byTooltip('Show in folder'), findsNothing);
    });

    testWidgets('a save with no path to give can\'t be undone', (tester) async {
      savePath = null;
      await pump(tester);
      await convertAndSave(tester);
      await openHistory(tester);
      expect(find.textContaining('(converted)'), findsOneWidget);
      expect(find.byTooltip('Undo'), findsNothing);
    });

    testWidgets('clearing asks first, then only forgets the list', (tester) async {
      await pump(tester);
      await convertAndSave(tester);
      await openHistory(tester);
      await tester.tap(find.text('Clear'));
      await tester.pumpAndSettle();
      expect(find.textContaining('Your files stay where they are'), findsOneWidget);
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(HistoryLog.decode(stored).items, hasLength(1));

      await tester.tap(find.text('Clear'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Clear').last);
      await tester.pumpAndSettle();
      expect(HistoryLog.decode(stored).items, isEmpty);
      expect(trashed, isEmpty, reason: 'Clearing the list touches no files');
      expect(find.textContaining('listed here for 30 days'), findsOneWidget);
    });

    testWidgets('history that can\'t be read or written stops nothing', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: ConverterScreen(
            pickFiles: () async => [
              PickedFile(name: 'photo.jpg', size: jpeg.length, head: jpeg, read: () async => jpeg),
            ],
            saveFile: (file) async => const SavedAs(),
            mediaAvailable: false,
            resultsDrag: false,
            resultsShare: false,
            historyReader: () async => throw StateError('no'),
            historyWriter: (text) async => throw StateError('no'),
            converter: (action, files, onProgress, options) {
              return runPortable(action, files, options: options, onProgress: onProgress);
            },
          ),
        ),
      );
      await tester.pump();
      await convertAndSave(tester);
      expect(tester.takeException(), isNull);
      expect(find.textContaining('Saved.'), findsOneWidget);
    });
  });
}
