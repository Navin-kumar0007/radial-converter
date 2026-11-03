import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';

final _mp4 = Uint8List.fromList(const [
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
  0,
  0,
  0,
  0,
]);

PickedFile video({int? size, void Function()? onRead}) {
  return PickedFile(
    name: 'clip.mp4',
    size: size ?? _mp4.length,
    head: _mp4,
    webUrl: 'blob:test',
    read: () async {
      onRead?.call();
      return _mp4;
    },
  );
}

void main() {
  late List<String> downloaded;

  setUp(() => downloaded = []);

  Future<void> pump(
    WidgetTester tester,
    List<PickedFile> files,
    MediaConverter converter, {
    bool mediaAvailable = true,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ConverterScreen(
          pickFiles: () async => files,
          saveFile: (file) async => true,
          mediaConverter: converter,
          mediaAvailable: mediaAvailable,
        ),
      ),
    );
    await tester.tap(find.text('Choose files'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
  }

  Future<void> selectFirstSlice(WidgetTester tester) async {
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pump();
  }

  ConvertedFile result(String name) {
    return ConvertedFile(
      name: name,
      size: 1000,
      download: () async {
        downloaded.add(name);
        return true;
      },
    );
  }

  testWidgets('a video gets a menu when the engine is here', (tester) async {
    await pump(tester, [video()], (a, f, k, p, c) async => []);
    expect(find.text('WhatsApp'), findsOneWidget);
    expect(find.textContaining('in this build yet'), findsNothing);
  });

  testWidgets('without the engine it says so', (tester) async {
    await pump(tester, [video()], (a, f, k, p, c) async => [], mediaAvailable: false);
    expect(find.text('WhatsApp'), findsNothing);
    expect(find.textContaining('Videos on this device'), findsOneWidget);
  });

  testWidgets('a huge video is never read into memory', (tester) async {
    var reads = 0;
    await pump(tester, [
      video(size: 5 * 1024 * 1024 * 1024, onRead: () => reads++),
    ], (a, f, k, p, c) async => [result('clip (converted).mov')]);
    expect(find.textContaining('5.0 GB'), findsOneWidget);
    await selectFirstSlice(tester);
    await tester.pump();
    await tester.pump();
    expect(reads, 0);
    expect(find.textContaining('too large'), findsNothing);
    expect(find.text('clip (converted).mov'), findsOneWidget);
  });

  testWidgets('the engine gets the file and what it is', (tester) async {
    List<FileKind>? kinds;
    String? url;
    await pump(tester, [video()], (a, files, k, p, c) async {
      kinds = k;
      url = files.single.webUrl;
      return [result('x.mov')];
    });
    await selectFirstSlice(tester);
    await tester.pump();
    expect(kinds, [FileKind.mp4]);
    expect(url, 'blob:test');
  });

  testWidgets('progress shows, then save uses the download', (tester) async {
    late void Function(double) report;
    final finish = Completer<List<ConvertedFile>>();
    await pump(tester, [video()], (a, f, k, onProgress, c) {
      report = onProgress;
      return finish.future;
    });
    await selectFirstSlice(tester);
    await tester.pump();
    report(0.25);
    await tester.pump();
    final ring = tester.widget<CircularProgressIndicator>(find.byType(CircularProgressIndicator));
    expect(ring.value, 0.25);

    finish.complete([result('clip (whatsapp).mp4')]);
    await tester.pump();
    await tester.pump();
    expect(find.text('clip (whatsapp).mp4'), findsOneWidget);
    expect(find.textContaining('to 1000 B'), findsOneWidget);
    await tester.tap(find.byTooltip('Save'));
    await tester.pump();
    expect(downloaded, ['clip (whatsapp).mp4']);
    expect(find.textContaining('Saved'), findsOneWidget);
  });

  testWidgets('a long job can be cancelled, and leaves the menu to try again', (tester) async {
    var cancelled = 0;
    final finish = Completer<List<ConvertedFile>>();
    await pump(tester, [video()], (a, f, k, p, control) {
      control.cancel = () => cancelled++;
      return finish.future;
    });
    await selectFirstSlice(tester);
    await tester.pump();
    await tester.tap(find.byTooltip('Cancel'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(cancelled, 1);
    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('WhatsApp'), findsOneWidget);

    // The cancelled job finishing later changes nothing.
    finish.complete([result('late.mp4')]);
    await tester.pump();
    await tester.pump();
    expect(find.text('late.mp4'), findsNothing);
  });

  testWidgets('choosing new files stops the running job', (tester) async {
    var cancelled = 0;
    await pump(tester, [video()], (a, f, k, p, control) {
      control.cancel = () => cancelled++;
      return Completer<List<ConvertedFile>>().future;
    });
    await selectFirstSlice(tester);
    await tester.pump();
    await tester.tap(find.text('Choose other files'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(cancelled, 1);
  });

  testWidgets('a result already saved on disk says so and offers no Save', (tester) async {
    await pump(
      tester,
      [video()],
      (a, f, k, p, c) async => [
        const ConvertedFile(name: 'clip (compressed).mp4', size: 500, savedPath: '/x/clip.mp4'),
      ],
    );
    await selectFirstSlice(tester);
    await tester.pump();
    await tester.pump();
    expect(find.textContaining('Saved beside the original'), findsOneWidget);
    expect(find.byTooltip('Save'), findsNothing);
  });

  testWidgets('a failure from the engine is shown in its words', (tester) async {
    await pump(tester, [
      video(),
    ], (a, f, k, p, c) async => throw const EngineFailed('This video has no sound.'));
    await selectFirstSlice(tester);
    await tester.pump();
    await tester.pump();
    expect(find.text('This video has no sound.'), findsOneWidget);
  });

  group('HEIC photos', () {
    // Enough of a HEIC file's start for detection.
    final heic = Uint8List.fromList(const [
      0,
      0,
      0,
      24,
      0x66,
      0x74,
      0x79,
      0x70,
      0x68,
      0x65,
      0x69,
      0x63,
    ]);
    final png = Uint8List.fromList(img.encodePng(img.Image(width: 4, height: 4)));

    PickedFile photo() {
      return PickedFile(name: 'photo.heic', size: heic.length, head: heic, read: () async => heic);
    }

    Future<void> pumpPhoto(
      WidgetTester tester, {
      required PhotoDecoder decoder,
      Converter? converter,
      bool mediaAvailable = true,
    }) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ConverterScreen(
            pickFiles: () async => [photo()],
            saveFile: (file) async => true,
            photoDecoder: decoder,
            converter: converter ?? (a, f, p) async => const [],
            mediaAvailable: mediaAvailable,
          ),
        ),
      );
      await tester.tap(find.text('Choose files'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
    }

    testWidgets('reach the picture engine already decoded, under their own name', (tester) async {
      List<PortableFile>? received;
      await pumpPhoto(
        tester,
        decoder: (file) async => png,
        converter: (action, files, onProgress) async {
          received = files;
          return [PortableFile('photo (converted).jpg', png)];
        },
      );
      expect(find.textContaining('in this build yet'), findsNothing);
      await selectFirstSlice(tester);
      await tester.pumpAndSettle();
      expect(received!.single.name, 'photo.heic');
      expect(received!.single.bytes, png);
    });

    testWidgets('without the engine it says so', (tester) async {
      await pumpPhoto(tester, decoder: (file) async => png, mediaAvailable: false);
      expect(find.textContaining('HEIC pictures'), findsOneWidget);
    });

    testWidgets('a photo that can\'t be read says why', (tester) async {
      await pumpPhoto(
        tester,
        decoder: (file) async => throw const EngineFailed('HEIC photos need Android 9 or newer.'),
      );
      await selectFirstSlice(tester);
      await tester.pumpAndSettle();
      expect(find.textContaining('Android 9'), findsOneWidget);
    });
  });
}
