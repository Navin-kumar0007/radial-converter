import 'dart:async';

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

    group('looking at the video', () {
      final red = Uint8List.fromList(img.encodePng(img.Image(width: 8, height: 4)));

      Future<void> open(
        WidgetTester tester,
        TrimPreview preview, [
        void Function(ActionOptions?)? got,
      ]) async {
        await tester.pumpWidget(_host(got ?? (_) {}, TrimDialog(preview: preview)));
        await tester.tap(find.text('open'));
        await tester.pumpAndSettle();
      }

      Offset thumb(WidgetTester tester, double fraction) {
        final box = tester.getRect(find.byType(RangeSlider));
        // The slider's track stops short of its ends by the size of a thumb.
        return Offset(box.left + 24 + (box.width - 48) * fraction, box.center.dy);
      }

      testWidgets('both ends show their frames, and the length', (tester) async {
        final asked = <double>[];
        await open(
          tester,
          TrimPreview(
            seconds: () async => 95,
            frameAt: (seconds) async {
              asked.add(seconds);
              return red;
            },
          ),
        );
        expect(asked, [0, 95]);
        expect(find.byType(Image), findsNWidgets(2));
        expect(find.text('1:35'), findsOneWidget);
        // Beside the slider, and as the Start field's hint.
        expect(find.text('0:00'), findsNWidgets(2));
      });

      testWidgets('audio has the slider and no frames', (tester) async {
        await open(tester, TrimPreview(seconds: () async => 90));
        expect(find.byType(RangeSlider), findsOneWidget);
        expect(find.byType(Image), findsNothing);
        expect(find.byIcon(Icons.movie_outlined), findsNothing);
      });

      testWidgets('dragging an end fills in its time and shows its frame', (tester) async {
        ActionOptions? chosen;
        final asked = <double>[];
        await open(
          tester,
          TrimPreview(
            seconds: () async => 100,
            frameAt: (seconds) async {
              asked.add(seconds);
              return red;
            },
          ),
          (value) => chosen = value,
        );
        asked.clear();
        await tester.dragFrom(
          thumb(tester, 1),
          Offset(-(tester.getRect(find.byType(RangeSlider)).width - 48) / 2, 0),
        );
        await tester.pumpAndSettle();
        final end = parseClock(
          tester.widget<TextField>(find.byType(TextField).last).controller!.text,
        )!;
        expect(end, closeTo(50, 5));
        expect(tester.widget<TextField>(find.byType(TextField).first).controller!.text, isEmpty);
        expect(asked.last, end);
        await tester.tap(find.text('Trim').last);
        await tester.pumpAndSettle();
        expect(chosen!.startSeconds, isNull);
        expect(chosen!.endSeconds, end);
      });

      testWidgets('typing a time moves the slider and shows its frame', (tester) async {
        final asked = <double>[];
        await open(
          tester,
          TrimPreview(
            seconds: () async => 100,
            frameAt: (seconds) async {
              asked.add(seconds);
              return red;
            },
          ),
        );
        asked.clear();
        await tester.enterText(find.byType(TextField).first, '0:30');
        await tester.pumpAndSettle();
        expect(tester.widget<RangeSlider>(find.byType(RangeSlider)).values.start, 30);
        expect(asked, [30]);
      });

      testWidgets('half-typed times don\'t move anything or fetch anything', (tester) async {
        final asked = <double>[];
        await open(
          tester,
          TrimPreview(
            seconds: () async => 100,
            frameAt: (seconds) async {
              asked.add(seconds);
              return red;
            },
          ),
        );
        asked.clear();
        await tester.enterText(find.byType(TextField).first, '1:');
        await tester.pumpAndSettle();
        expect(tester.widget<RangeSlider>(find.byType(RangeSlider)).values.start, 0);
        expect(asked, isEmpty);
      });

      testWidgets('frames that arrive slowly don\'t pile up: only the newest wish waits', (
        tester,
      ) async {
        final asked = <double>[];
        final replies = <Completer<Uint8List>>[];
        await tester.pumpWidget(
          _host(
            (_) {},
            TrimDialog(
              preview: TrimPreview(
                seconds: () async => 100,
                frameAt: (seconds) {
                  asked.add(seconds);
                  final reply = Completer<Uint8List>();
                  replies.add(reply);
                  return reply.future;
                },
              ),
            ),
          ),
        );
        await tester.tap(find.text('open'));
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 300));
        expect(asked, [0, 100]);
        final start = find.byType(TextField).first;
        await tester.enterText(start, '0:10');
        await tester.pump();
        await tester.enterText(start, '0:20');
        await tester.pump();
        await tester.enterText(start, '0:30');
        await tester.pump();
        expect(asked, [0, 100], reason: 'Still waiting for the first');
        replies[0].complete(red);
        await tester.pump();
        await tester.pump();
        expect(asked, [0, 100, 30], reason: 'Straight to the newest');
        replies[1].complete(red);
        replies[2].complete(red);
        await tester.pump();
        await tester.pump(const Duration(seconds: 1));
      });

      testWidgets('a start past the end is refused, in words', (tester) async {
        ActionOptions? chosen;
        await open(tester, TrimPreview(seconds: () async => 90), (value) => chosen = value);
        await tester.enterText(find.byType(TextField).first, '2:00');
        await tester.tap(find.text('Trim').last);
        await tester.pumpAndSettle();
        expect(chosen, isNull);
        expect(find.text('This is only 1:30 long.'), findsOneWidget);
      });

      testWidgets('a file it can\'t look inside still trims by typing', (tester) async {
        ActionOptions? chosen;
        await open(
          tester,
          TrimPreview(seconds: () async => throw const EngineFailed('no')),
          (value) => chosen = value,
        );
        expect(find.byType(RangeSlider), findsNothing);
        await tester.enterText(find.byType(TextField).last, '0:30');
        await tester.tap(find.text('Trim').last);
        await tester.pumpAndSettle();
        expect(chosen!.endSeconds, 30);
      });

      testWidgets('a frame that won\'t come leaves the rest working', (tester) async {
        ActionOptions? chosen;
        await open(
          tester,
          TrimPreview(
            seconds: () async => 90,
            frameAt: (seconds) async => throw const EngineFailed('no'),
          ),
          (value) => chosen = value,
        );
        expect(find.byIcon(Icons.movie_outlined), findsNWidgets(2));
        await tester.enterText(find.byType(TextField).last, '0:30');
        await tester.tap(find.text('Trim').last);
        await tester.pumpAndSettle();
        expect(chosen!.endSeconds, 30);
      });

      testWidgets('leaving while a frame is on its way is safe', (tester) async {
        final reply = Completer<Uint8List>();
        await tester.pumpWidget(
          _host(
            (_) {},
            TrimDialog(
              preview: TrimPreview(seconds: () async => 90, frameAt: (seconds) => reply.future),
            ),
          ),
        );
        await tester.tap(find.text('open'));
        await tester.pump();
        await tester.pump();
        await tester.tap(find.text('Cancel'));
        await tester.pump(const Duration(seconds: 1));
        reply.complete(red);
        await tester.pump();
        expect(tester.takeException(), isNull);
      });

      testWidgets('it fits a phone', (tester) async {
        tester.view.physicalSize = const Size(360, 640);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.reset);
        await open(tester, TrimPreview(seconds: () async => 90, frameAt: (s) async => red));
        expect(tester.takeException(), isNull);
        expect(find.byType(RangeSlider), findsOneWidget);
      });
    });

    testWidgets('the screen looks at the first file, for video only', (tester) async {
      final probed = <String>[];
      final framed = <String>[];
      await tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => [
              PickedFile(name: 'clip.mp4', size: mp4.length, head: mp4, read: () async => mp4),
            ],
            saveFile: (file) async => true,
            mediaAvailable: true,
            mediaProbe: (file) async {
              probed.add(file.name);
              return const MediaInfo(seconds: 10, hasVideo: true);
            },
            frameReader: (file, seconds) async {
              framed.add(file.name);
              return Uint8List.fromList(img.encodePng(img.Image(width: 8, height: 4)));
            },
          ),
        ),
      );
      await tapAction(tester, 'Trim');
      await tester.pumpAndSettle();
      expect(probed, ['clip.mp4']);
      expect(framed, ['clip.mp4', 'clip.mp4']);
      expect(find.byType(RangeSlider), findsOneWidget);
    });

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
            mediaProbe: (file) async => throw const EngineFailed('Not in a test'),
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
            mediaProbe: (file) async => throw const EngineFailed('Not in a test'),
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

  group('adding a password', () {
    Future<ActionOptions?> add(WidgetTester tester, String first, String second) async {
      ActionOptions? chosen;
      await tester.pumpWidget(_host((value) => chosen = value, const AddPasswordDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField).first, first);
      await tester.enterText(find.byType(TextField).last, second);
      await tester.tap(find.text('Add password').last);
      await tester.pumpAndSettle();
      return chosen;
    }

    testWidgets('typed twice the same, it goes through', (tester) async {
      expect((await add(tester, 'secret', 'secret'))!.newPassword, 'secret');
    });

    testWidgets('a mistake is caught before it locks anything', (tester) async {
      expect(await add(tester, 'secret', 'secrt'), isNull);
      expect(find.textContaining('don\'t match'), findsOneWidget);
    });

    testWidgets('it must have one', (tester) async {
      expect(await add(tester, '', ''), isNull);
      expect(find.text('Choose a password.'), findsOneWidget);
    });

    testWidgets('Tab goes straight to the second box', (tester) async {
      await tester.pumpWidget(_host((_) {}, const AddPasswordDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      final second = tester.widget<EditableText>(find.byType(EditableText).last);
      expect(second.focusNode.hasFocus, isTrue);
    });

    testWidgets('both boxes stay hidden', (tester) async {
      await tester.pumpWidget(_host((_) {}, const AddPasswordDialog()));
      await tester.tap(find.text('open'));
      await tester.pumpAndSettle();
      for (final box in tester.widgetList<TextField>(find.byType(TextField))) {
        expect(box.obscureText, isTrue);
      }
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
