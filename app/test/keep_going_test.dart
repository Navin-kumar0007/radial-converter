import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/keep_going_native.dart';
import 'package:radialconverter/picked_file.dart';
import 'package:radialconverter/shift_drag_native.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final skip = Platform.isMacOS || Platform.isWindows ? null : 'Only desktops drag';
  late List<MethodCall> calls;
  final messenger = TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;

  setUp(() {
    calls = [];
    messenger.setMockMethodCallHandler(shiftDragChannel, (call) async {
      calls.add(call);
      return true;
    });
  });
  tearDown(() => messenger.setMockMethodCallHandler(shiftDragChannel, null));

  List<String> pathsOf(MethodCall call) {
    return ((call.arguments as Map)['paths'] as List).cast<String>();
  }

  group('dragging out', skip: skip, () {
    test('a result in memory becomes a real file under its own name', () async {
      await dragOut(
        ConvertedFile(
          name: 'photo (converted).png',
          size: 3,
          inMemory: PortableFile('photo (converted).png', Uint8List.fromList([1, 2, 3])),
        ),
      );
      final path = pathsOf(calls.single).single;
      expect(calls.single.method, 'dragOut');
      expect(p.basename(path), 'photo (converted).png');
      expect(File(path).readAsBytesSync(), [1, 2, 3]);
    });

    test('two results of one name don\'t overwrite each other', () async {
      ConvertedFile result(int value) {
        return ConvertedFile(
          name: 'same.png',
          size: 1,
          inMemory: PortableFile('same.png', Uint8List.fromList([value])),
        );
      }

      await dragOut(result(1));
      await dragOut(result(2));
      final first = pathsOf(calls[0]).single;
      final second = pathsOf(calls[1]).single;
      expect(first, isNot(second));
      expect(File(first).readAsBytesSync(), [1]);
      expect(File(second).readAsBytesSync(), [2]);
    });

    test('a name can\'t write outside its folder', () async {
      await dragOut(
        ConvertedFile(
          name: '../../evil.png',
          size: 1,
          inMemory: PortableFile('x', Uint8List.fromList([1])),
        ),
      );
      expect(p.basename(pathsOf(calls.single).single), 'evil.png');
      expect(pathsOf(calls.single).single, contains('radial_handed_over'));
      expect(p.split(pathsOf(calls.single).single), isNot(contains('..')));
    });

    test('what is already saved is used as it is, not copied', () async {
      await dragOut(const ConvertedFile(name: 'a.mp4', size: 1, savedPath: '/somewhere/a.mp4'));
      expect(pathsOf(calls.single), ['/somewhere/a.mp4']);
    });

    test('nothing to hand over says so', () async {
      await expectLater(
        dragOut(const ConvertedFile(name: 'a.mp4', size: 1)),
        throwsA(isA<EngineFailed>()),
      );
    });

    group('clearing what earlier runs left', () {
      Future<String> handOver() async {
        await dragOut(
          ConvertedFile(
            name: 'old.png',
            size: 1,
            inMemory: PortableFile('old.png', Uint8List.fromList([1])),
          ),
        );
        return pathsOf(calls.last).single;
      }

      test('old ones go', () async {
        final path = await handOver();
        expect(File(path).existsSync(), isTrue);
        await cleanUpHandedOver(olderThan: Duration.zero);
        expect(File(path).existsSync(), isFalse);
      });

      test('a recent one stays, as another copy of the app may be dragging it', () async {
        final path = await handOver();
        await cleanUpHandedOver();
        expect(File(path).readAsBytesSync(), [1]);
      });
    });
  });

  group('the chip after a Shift-drag', skip: skip, () {
    test('it\'s given the saved files', () {
      showChipAtCursor(['/a/b.png']);
      expect(calls.single.method, 'showChip');
      expect(pathsOf(calls.single), ['/a/b.png']);
    });

    test('nothing saved shows nothing', () {
      showChipAtCursor(const []);
      expect(calls, isEmpty);
    });

    test('a native side that can\'t show it is no failure', () async {
      messenger.setMockMethodCallHandler(shiftDragChannel, null);
      showChipAtCursor(['/a/b.png']);
      await Future<void>.delayed(Duration.zero);
    });
  });

  test('other apps are told what a file is from its name', () {
    expect(FileKind.mimeOf('a (converted).jpg'), 'image/jpeg');
    expect(FileKind.mimeOf('a.PDF'), 'application/pdf');
    expect(FileKind.mimeOf('noextension'), FileKind.unknown.mime);
    expect(FileKind.mimeOf('a.notreal'), FileKind.unknown.mime);
  });
}
