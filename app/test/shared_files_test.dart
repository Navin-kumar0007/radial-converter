import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radialconverter/conversion.dart';
import 'package:radialconverter/converter_screen.dart';
import 'package:radialconverter/shared_files.dart';
import 'package:radialconverter/words.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger = TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;

  group('the channel', () {
    late Directory folder;
    late List<String> calls;

    setUp(() {
      folder = Directory.systemTemp.createTempSync('radial_share_');
      calls = [];
      messenger.setMockMethodCallHandler(shareChannel, (call) async => calls.add(call.method));
    });

    tearDown(() {
      messenger.setMockMethodCallHandler(shareChannel, null);
      folder.deleteSync(recursive: true);
    });

    Future<void> fromPhone(String method, [Object? arguments]) {
      final done = Completer<void>();
      messenger.handlePlatformMessage(
        shareChannel.name,
        shareChannel.codec.encodeMethodCall(MethodCall(method, arguments)),
        (_) => done.complete(),
      );
      return done.future;
    }

    test('says when it is ready, or a waiting share would be lost', () async {
      final subscription = listenOnShareChannel().listen((_) {});
      await pumpEventQueue();
      expect(calls, ['listen']);
      await subscription.cancel();
    });

    test('says files are coming, then gives them', () async {
      final path = p.join(folder.path, 'photo.png');
      File(path).writeAsBytesSync(img.encodePng(img.Image(width: 4, height: 4)));
      final seen = <SharedFiles>[];
      final subscription = listenOnShareChannel().listen(seen.add);
      await pumpEventQueue();
      await fromPhone('receiving');
      await fromPhone('shared', {
        'paths': [path],
        'failed': 0,
      });
      await pumpEventQueue();
      expect(seen.map((e) => e.receiving), [true, false]);
      final file = seen.last.files.single;
      expect(file.name, 'photo.png');
      expect(file.path, path);
      expect(file.size, File(path).lengthSync());
      await subscription.cancel();
    });

    test('counts what could not be opened, including a copy that has gone', () async {
      final seen = <SharedFiles>[];
      final subscription = listenOnShareChannel().listen(seen.add);
      await pumpEventQueue();
      await fromPhone('shared', {
        'paths': [p.join(folder.path, 'gone')],
        'failed': 1,
      });
      await pumpEventQueue();
      expect(seen.single.files, isEmpty);
      expect(seen.single.failed, 2);
      await subscription.cancel();
    });
  });

  group('on the screen', () {
    final png = Uint8List.fromList(img.encodePng(img.Image(width: 4, height: 4)));
    late StreamController<SharedFiles> shares;

    setUp(() => shares = StreamController<SharedFiles>());
    tearDown(() => shares.close());

    PickedFile photo() {
      return PickedFile(name: 'shared.png', size: png.length, head: png, read: () async => png);
    }

    Future<void> pump(WidgetTester tester) {
      return tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (file) async => const SavedAs(),
            mediaAvailable: false,
            acceptsDrops: false,
            sharedFiles: () => shares.stream,
          ),
        ),
      );
    }

    testWidgets('shows it is getting them, then opens the menu', (tester) async {
      await pump(tester);
      shares.add(const SharedFiles.receiving());
      await tester.pump();
      expect(find.textContaining('Getting what you shared'), findsOneWidget);
      shares.add(SharedFiles.arrived([photo()]));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
      expect(find.textContaining('Getting what you shared'), findsNothing);
      expect(find.textContaining('shared.png'), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
    });

    testWidgets('sharing a link says only files can be converted', (tester) async {
      await pump(tester);
      shares.add(const SharedFiles.arrived([], failed: 1));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
      expect(find.textContaining('Only files can be converted'), findsOneWidget);
    });

    testWidgets('some failing still opens the rest, and says so', (tester) async {
      await pump(tester);
      shares.add(SharedFiles.arrived([photo()], failed: 1));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
      expect(find.textContaining('shared.png'), findsOneWidget);
      expect(find.textContaining('Some of what was shared'), findsOneWidget);
    });
  });
}
