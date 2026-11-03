import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/option_screens.dart';

void main() {
  group('moving the crop frame', () {
    const picture = Size(100, 80);
    const area = Rect.fromLTWH(10, 10, 50, 40);

    test('a corner moves two edges and leaves the others', () {
      expect(
        moveCrop(area, CropHandle.topLeft, const Offset(5, 3), picture),
        const Rect.fromLTRB(15, 13, 60, 50),
      );
      expect(
        moveCrop(area, CropHandle.bottomRight, const Offset(5, 3), picture),
        const Rect.fromLTRB(10, 10, 65, 53),
      );
    });

    test('moving keeps the size and stays inside', () {
      final moved = moveCrop(area, CropHandle.move, const Offset(500, 500), picture);
      expect(moved, const Rect.fromLTWH(50, 40, 50, 40));
      final back = moveCrop(area, CropHandle.move, const Offset(-500, -500), picture);
      expect(back, const Rect.fromLTWH(0, 0, 50, 40));
    });

    test('a corner stops at the picture edge', () {
      final out = moveCrop(area, CropHandle.bottomRight, const Offset(500, 500), picture);
      expect(out, const Rect.fromLTRB(10, 10, 100, 80));
    });

    test('the frame can\'t turn inside out or vanish', () {
      final out = moveCrop(area, CropHandle.topLeft, const Offset(500, 500), picture);
      expect(out.width, 8);
      expect(out.height, 8);
      expect(out.right, area.right);
    });

    test('which handle a touch takes hold of', () {
      expect(cropHandleAt(area, const Offset(11, 11), 5), CropHandle.topLeft);
      expect(cropHandleAt(area, const Offset(59, 49), 5), CropHandle.bottomRight);
      expect(cropHandleAt(area, const Offset(30, 30), 5), CropHandle.move);
      expect(cropHandleAt(area, const Offset(90, 70), 5), isNull);
    });
  });

  Future<ActionOptions?> open(WidgetTester tester, Widget dialog) async {
    ActionOptions? chosen;
    await tester.pumpWidget(
      MaterialApp(
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () async {
              chosen = await showDialog<ActionOptions>(context: context, builder: (_) => dialog);
            },
            child: const Text('open'),
          ),
        ),
      ),
    );
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();
    return chosen;
  }

  group('shifting subtitles', () {
    testWidgets('later is positive', (tester) async {
      ActionOptions? chosen;
      await tester.pumpWidget(_host((value) => chosen = value, const ShiftDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField), '1.5');
      await tester.tap(find.text('Shift').last);
      await tester.pumpAndSettle();
      expect(chosen!.shift, const Duration(milliseconds: 1500));
    });

    testWidgets('earlier is negative', (tester) async {
      ActionOptions? chosen;
      await tester.pumpWidget(_host((value) => chosen = value, const ShiftDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Earlier'));
      await tester.pump();
      await tester.tap(find.text('Shift').last);
      await tester.pumpAndSettle();
      expect(chosen!.shift, const Duration(seconds: -1));
    });

    testWidgets('nonsense is explained, and stays open', (tester) async {
      await open(tester, const ShiftDialog());
      await tester.enterText(find.byType(TextField), 'soon');
      await tester.tap(find.text('Shift').last);
      await tester.pump();
      expect(find.textContaining('number of seconds'), findsOneWidget);
    });
  });

  group('trimming', () {
    Future<ActionOptions?> trim(WidgetTester tester, String from, String to) async {
      ActionOptions? chosen;
      await tester.pumpWidget(_host((value) => chosen = value, const TrimDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField).first, from);
      await tester.enterText(find.byType(TextField).last, to);
      await tester.tap(find.text('Trim').last);
      await tester.pumpAndSettle();
      return chosen;
    }

    testWidgets('both ends', (tester) async {
      final options = await trim(tester, '0:10', '1:30');
      expect(options!.startSeconds, 10);
      expect(options.endSeconds, 90);
    });

    testWidgets('one end is enough', (tester) async {
      final options = await trim(tester, '', '0:30');
      expect(options!.startSeconds, isNull);
      expect(options.endSeconds, 30);
    });

    testWidgets('nothing chosen is explained', (tester) async {
      expect(await trim(tester, '', ''), isNull);
      expect(find.textContaining('where to start or end'), findsOneWidget);
    });

    testWidgets('a bad time is explained', (tester) async {
      expect(await trim(tester, '1:90', ''), isNull);
      expect(find.textContaining('like 1:30'), findsOneWidget);
    });

    testWidgets('the end must be after the start', (tester) async {
      expect(await trim(tester, '1:00', '0:30'), isNull);
      expect(find.textContaining('after the start'), findsOneWidget);
    });
  });

  group('through the app', () {
    final mp4 = Uint8List.fromList(const [
      0,
      0,
      0,
      16,
      0x66,
      0x74,
      0x79,
      0x70,
      0x69,
      0x73,
      0x6F,
      0x6D,
    ]);

    Future<void> tapAction(WidgetTester tester, String label) async {
      await tester.tap(find.text('Choose files'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
      await tester.tap(find.text('Tools'));
      await tester.pumpAndSettle();
      await tester.tap(find.text(label));
      await tester.pumpAndSettle();
    }

    testWidgets('what the user chose reaches the engine', (tester) async {
      ActionOptions? received;
      await tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => [
              PickedFile(name: 'clip.mp4', size: mp4.length, head: mp4, read: () async => mp4),
            ],
            saveFile: (file) async => true,
            mediaAvailable: true,
            mediaConverter: (a, f, k, p, c, options) async {
              received = options;
              return [ConvertedFile(name: 'clip (trimmed).mp4', size: 1)];
            },
          ),
        ),
      );
      await tapAction(tester, 'Trim');
      await tester.enterText(find.byType(TextField).last, '0:05');
      await tester.tap(find.text('Trim').last);
      await tester.pumpAndSettle();
      expect(received!.endSeconds, 5);
    });

    testWidgets('changing your mind runs nothing and keeps the menu', (tester) async {
      var ran = false;
      await tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => [
              PickedFile(name: 'clip.mp4', size: mp4.length, head: mp4, read: () async => mp4),
            ],
            saveFile: (file) async => true,
            mediaAvailable: true,
            mediaConverter: (a, f, k, p, c, o) async {
              ran = true;
              return const [];
            },
          ),
        ),
      );
      await tapAction(tester, 'Trim');
      await tester.tap(find.text('Cancel').last);
      await tester.pumpAndSettle();
      expect(ran, isFalse);
      expect(find.text('Trim'), findsOneWidget);
    });
  });

  group('cropping', () {
    final png = img.encodePng(img.Image(width: 40, height: 30));

    Future<ActionOptions?> crop(WidgetTester tester, Map<String, String> typed) async {
      ActionOptions? chosen;
      await tester.pumpWidget(
        _host((value) => chosen = value, CropDialog(loadPicture: () async => png)),
      );
      await tester.tap(find.text('open'));
      await tester.pump();
      // Pictures decode outside the test's fake clock.
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
      await tester.pumpAndSettle();
      for (final entry in typed.entries) {
        await tester.enterText(find.widgetWithText(TextField, entry.key), entry.value);
      }
      await tester.pump();
      await tester.tap(find.widgetWithText(FilledButton, 'Crop'));
      await tester.pumpAndSettle();
      return chosen;
    }

    testWidgets('starts as the whole picture', (tester) async {
      final options = await crop(tester, const {});
      expect(options!.crop, (left: 0, top: 0, width: 40, height: 30));
    });

    testWidgets('dragging a corner moves the frame, in the picture\'s pixels', (tester) async {
      ActionOptions? chosen;
      await tester.pumpWidget(
        _host((value) => chosen = value, CropDialog(loadPicture: () async => png)),
      );
      await tester.tap(find.text('open'));
      await tester.pump();
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
      await tester.pumpAndSettle();
      final picture = find.byType(RawImage);
      final box = tester.getRect(picture);
      final scale = box.width / 40;
      // Half the picture's width and height, from its bottom-right corner.
      // The handle's outer half is past the picture, and must still take hold.
      await tester.dragFrom(box.bottomRight + const Offset(4, 4), Offset(-20 * scale, -15 * scale));
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(FilledButton, 'Crop'));
      await tester.pumpAndSettle();
      final crop = chosen!.crop!;
      expect(crop.left, 0);
      expect(crop.top, 0);
      // A drag loses a little to the distance it takes to be recognised.
      expect(crop.width, closeTo(20, 2));
      expect(crop.height, closeTo(15, 2));
    });

    testWidgets('typed numbers are used', (tester) async {
      final options = await crop(tester, const {
        'Width': '20',
        'Height': '10',
        'Left': '5',
        'Top': '6',
      });
      expect(options!.crop, (left: 5, top: 6, width: 20, height: 10));
    });

    testWidgets('numbers that don\'t fit are not used', (tester) async {
      final options = await crop(tester, const {'Width': '999'});
      expect(options!.crop, (left: 0, top: 0, width: 40, height: 30));
    });

    testWidgets('a picture that can\'t be shown says so', (tester) async {
      await tester.pumpWidget(
        _host((_) {}, CropDialog(loadPicture: () async => Uint8List.fromList([1, 2, 3]))),
      );
      await tester.tap(find.text('open'));
      await tester.pump();
      await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
      await tester.pumpAndSettle();
      expect(find.textContaining('could not be shown'), findsOneWidget);
    });
  });
}

Widget _host(void Function(ActionOptions?) onChosen, Widget dialog) {
  return MaterialApp(
    home: Builder(
      builder: (context) => TextButton(
        onPressed: () async {
          onChosen(await showDialog<ActionOptions>(context: context, builder: (_) => dialog));
        },
        child: const Text('open'),
      ),
    ),
  );
}
