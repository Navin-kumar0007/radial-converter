import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/shift_drag.dart';
import 'package:shiftdrop/words.dart';

void main() {
  late Directory folder;

  setUp(() => folder = Directory.systemTemp.createTempSync('radial_shift_'));
  tearDown(() => folder.deleteSync(recursive: true));

  String aPhoto(String name) {
    final path = p.join(folder.path, name);
    File(path).writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
    return path;
  }

  group('saving beside the original', () {
    test('uses the name it was given', () async {
      final original = aPhoto('photo.png');
      final saved = await saveBesideOriginal(
        original,
        PortableFile('photo (converted).jpg', Uint8List.fromList([1, 2, 3])),
      );
      expect(p.basename(saved), 'photo (converted).jpg');
      expect(p.dirname(saved), folder.path);
      expect(File(saved).readAsBytesSync(), [1, 2, 3]);
    });

    test('never replaces anything already there', () async {
      final original = aPhoto('photo.png');
      final existing = p.join(folder.path, 'photo (converted).jpg');
      File(existing).writeAsBytesSync([9]);
      final file = PortableFile('photo (converted).jpg', Uint8List.fromList([1]));
      final second = await saveBesideOriginal(original, file);
      final third = await saveBesideOriginal(original, file);
      expect(File(existing).readAsBytesSync(), [9]);
      expect(second, isNot(existing));
      expect(third, isNot(second));
      expect(File(third).existsSync(), isTrue);
    });

    test('a file with the original\'s own name can\'t replace it', () async {
      final original = aPhoto('photo.png');
      final before = File(original).readAsBytesSync();
      final saved = await saveBesideOriginal(original, PortableFile('photo.png', Uint8List(1)));
      expect(saved, isNot(original));
      expect(File(original).readAsBytesSync(), before);
    });

    test('leaves no temporary file behind', () async {
      final original = aPhoto('photo.png');
      await saveBesideOriginal(original, PortableFile('out.jpg', Uint8List(1)));
      final names = folder.listSync().map((e) => p.basename(e.path)).toSet();
      expect(names, {'photo.png', 'out.jpg'});
    });

    test('a folder it can\'t write to fails in plain words', () async {
      await expectLater(
        saveBesideOriginal('/no/such/folder/a.png', PortableFile('b.png', Uint8List(1))),
        throwsA(isA<EngineFailed>().having((e) => e.message, 'message', contains('beside'))),
      );
    });
  });

  group('the channel', () {
    final hasMenu = Platform.isMacOS || Platform.isWindows;

    Future<Object?> ask(String method, Map<String, Object?> arguments) async {
      const codec = StandardMethodCodec();
      final messenger = TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
      ByteData? reply;
      await messenger.handlePlatformMessage(
        shiftDragChannel.name,
        codec.encodeMethodCall(MethodCall(method, arguments)),
        (data) => reply = data,
      );
      return codec.decodeEnvelope(reply!);
    }

    test('answers what the centre says for a slice', () async {
      TestWidgetsFlutterBinding.ensureInitialized();
      final asked = <String>[];
      final stop = listenForShiftDrag(
        menuFor: (paths, mode) async => const [],
        sizeOf: (action, paths) async {
          asked.add('${action.id} ${paths.join()}');
          return 'About 12 KB';
        },
        chosen: (action, paths, options) {},
      );
      addTearDown(stop);
      expect(
        await ask('sizeOf', {
          'id': 'image-to-jpg',
          'paths': ['/a.png'],
        }),
        'About 12 KB',
      );
      expect(
        await ask('sizeOf', {
          'id': 'no-such-action',
          'paths': ['/a.png'],
        }),
        isNull,
      );
      expect(asked, ['image-to-jpg /a.png']);
    }, skip: hasMenu ? false : 'Only macOS and Windows have the Shift-drag menu');

    test('Alt asks for Tools, whose slices bring their ring choices', () async {
      TestWidgetsFlutterBinding.ensureInitialized();
      final modes = <ActionMode>[];
      final picked = <(String, ActionOptions)>[];
      final stop = listenForShiftDrag(
        menuFor: (paths, mode) async {
          modes.add(mode);
          return [actionById('image-rotate')!, actionById('image-compress')!];
        },
        sizeOf: (action, paths) async => null,
        chosen: (action, paths, options) => picked.add((action.id, options)),
      );
      addTearDown(stop);
      final slices = await ask('menuFor', {
        'paths': ['/a.png'],
        'tools': true,
      }) as List;
      await ask('menuFor', {
        'paths': ['/a.png'],
      });
      expect(modes, [ActionMode.tools, ActionMode.convert]);
      expect(slices[0], {
        'id': 'image-rotate',
        'label': 'Rotate',
        'choices': ['90° right', '180°', '90° left'],
      });
      expect((slices[1] as Map).containsKey('choices'), isFalse);

      for (final choice in [null, 0, 2, 9, 'x']) {
        await ask('chosen', {
          'id': 'image-rotate',
          'paths': ['/a.png'],
          'choice': choice,
        });
      }
      expect([for (final (_, options) in picked) options.degrees], [null, null, 270, null, null]);
      // The slice itself runs as plain options, so its size trial can be reused.
      expect(identical(picked[1].$2, const ActionOptions()), isTrue);
    }, skip: hasMenu ? false : 'Only macOS and Windows have the Shift-drag menu');
  });

  test('ring choices are chosen by index, out of range runs the slice itself', () {
    final resize = actionById('image-resize')!;
    expect(shiftDragOptions(resize, 2).longSide, 1280);
    expect(shiftDragOptions(resize, 0), same(const ActionOptions()));
    expect(shiftDragOptions(resize, -1), same(const ActionOptions()));
    expect(shiftDragOptions(actionById('image-to-jpg')!, 1), same(const ActionOptions()));
    expect(shiftDragSlice(actionById('image-to-jpg')!, lookupWords(const Locale('en'))), {
      'id': 'image-to-jpg',
      'label': 'JPG',
    });
  });

  group('through the screen', () {
    late Future<List<RadialAction>> Function(List<String>, ActionMode) menuForMode;
    late Future<String?> Function(RadialAction, List<String>) sizeOf;
    late void Function(RadialAction, List<String>, ActionOptions) chooseWith;
    Future<List<RadialAction>> menuFor(List<String> paths) =>
        menuForMode(paths, ActionMode.convert);
    void chosen(RadialAction action, List<String> paths) {
      chooseWith(action, paths, const ActionOptions());
    }

    Future<void> untilSaved(WidgetTester tester, int count) async {
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().length < count; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
    }

    var stopped = false;

    Future<void> pump(WidgetTester tester, {Converter? converter}) async {
      stopped = false;
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (file) async => throw StateError('Nothing should ask to save'),
            mediaAvailable: false,
            acceptsDrops: false,
            sharedFiles: () => const Stream.empty(),
            converter:
                converter ??
                (action, files, onProgress, options) {
                  return runPortable(action, files, options: options);
                },
            shiftDrag: ({required menuFor, required sizeOf, required chosen}) {
              // Named differently from the test's, so both are in reach.
              _capture(menuFor, sizeOf, chosen);
              return () => stopped = true;
            },
          ),
        ),
      );
      menuForMode = _menuFor!;
      sizeOf = _sizeOf!;
      chooseWith = _chosen!;
    }

    testWidgets('the menu offers what runs at once, in few slices', (tester) async {
      await pump(tester);
      final path = aPhoto('photo.png');
      final actions = await tester.runAsync(() => menuFor([path]));
      expect(actions, isNotEmpty);
      expect(actions!.length, lessThanOrEqualTo(8));
      expect(actions.map((a) => a.id), isNot(contains('image-crop')));
    });

    testWidgets('with Alt held the menu offers tools instead', (tester) async {
      await pump(tester);
      final path = aPhoto('photo.png');
      final tools = await tester.runAsync(() => menuForMode([path], ActionMode.tools));
      final convert = await tester.runAsync(() => menuFor([path]));
      expect(tools!.map((a) => a.mode).toSet(), {ActionMode.tools});
      expect(tools.map((a) => a.id), contains('image-rotate'));
      expect(tools.map((a) => a.id), isNot(contains('image-crop')), reason: 'it asks first');
      expect(convert!.map((a) => a.mode).toSet(), {ActionMode.convert});
      expect(tools.length, lessThanOrEqualTo(8));
    });

    testWidgets('a ring choice from Shift-drag runs with its options', (tester) async {
      final ran = <(String, int?)>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          ran.add((action.id, options.degrees));
          return runPortable(action, files, options: options);
        },
      );
      final path = aPhoto('photo.png');
      final rotate = actionById('image-rotate')!;
      await tester.runAsync(() => menuForMode([path], ActionMode.tools));
      await tester.runAsync(() async => chooseWith(rotate, [path], ringChoices(rotate)[1].options));
      await untilSaved(tester, 1);
      expect(ran, [('image-rotate', 180)]);
      expect(find.text('Tools'), findsOneWidget, reason: 'the screen now shows Tools');
    });

    testWidgets('switching to Tools mid-drag keeps the trials made in Convert', (tester) async {
      final converted = <String>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          converted.add(action.id);
          return runPortable(action, files, options: options);
        },
      );
      final path = aPhoto('photo.png');
      final jpg = actionById('image-to-jpg')!;
      await tester.runAsync(() => menuFor([path]));
      await tester.runAsync(() => sizeOf(jpg, [path]));
      await tester.runAsync(() => menuForMode([path], ActionMode.tools));
      await tester.runAsync(() => menuFor([path]));
      await tester.runAsync(() async => chosen(jpg, [path]));
      await untilSaved(tester, 1);
      expect(converted, ['image-to-jpg']);
    });

    testWidgets('a file nothing can convert offers nothing', (tester) async {
      await pump(tester);
      final path = p.join(folder.path, 'notes.xyz');
      File(path).writeAsBytesSync(List.filled(100, 200));
      expect(await tester.runAsync(() => menuFor([path])), isEmpty);
    });

    testWidgets('a file that has gone offers nothing rather than failing', (tester) async {
      await pump(tester);
      expect(await tester.runAsync(() => menuFor([p.join(folder.path, 'gone.png')])), isEmpty);
    });

    testWidgets('choosing a slice saves beside the original, with no dialog', (tester) async {
      await pump(tester);
      final path = aPhoto('photo.png');
      final before = File(path).readAsBytesSync();
      // Real file work, outside the test's fake clock. The screen updates just after the file lands.
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [path]));
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().isEmpty; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
      final result = File(p.join(folder.path, 'photo (converted).jpg'));
      expect(result.existsSync(), isTrue);
      expect(detectKind(result.readAsBytesSync()), FileKind.jpg);
      expect(File(path).readAsBytesSync(), before);
      expect(find.textContaining('Saved beside the original'), findsOneWidget);
    });

    testWidgets('a folder dragged in offers what its files can do', (tester) async {
      await pump(tester);
      final holiday = Directory(p.join(folder.path, 'holiday'))..createSync();
      File(p.join(holiday.path, 'a.png'))
          .writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
      final actions = await tester.runAsync(() => menuFor([holiday.path]));
      expect(actions, isNotEmpty);
    });

    testWidgets('a folder\'s results go beside each file', (tester) async {
      await pump(tester);
      final holiday = Directory(p.join(folder.path, 'holiday'))..createSync();
      final bytes = img.encodePng(img.Image(width: 8, height: 8));
      File(p.join(holiday.path, 'a.png')).writeAsBytesSync(bytes);
      File(p.join(holiday.path, 'b.png')).writeAsBytesSync(bytes);
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [holiday.path]));
      final saved = find.textContaining('Saved beside the original');
      for (var i = 0; i < 250 && saved.evaluate().length < 2; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
      final names = holiday.listSync().map((e) => p.basename(e.path)).toSet();
      expect(names, {'a.png', 'b.png', 'a (converted).jpg', 'b (converted).jpg'});
    });

    testWidgets('after a damaged file each result still goes beside its own original', (
      tester,
    ) async {
      var shown = 0;
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(shiftDragChannel, (
        call,
      ) async {
        if (call.method == 'showWindow') shown++;
        return null;
      });
      addTearDown(() {
        tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(shiftDragChannel, null);
      });
      await pump(tester);
      final bad = Directory(p.join(folder.path, 'bad'))..createSync();
      final good = Directory(p.join(folder.path, 'good'))..createSync();
      final broken = p.join(bad.path, 'same.png');
      File(broken).writeAsBytesSync([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3]);
      final fine = p.join(good.path, 'same.png');
      File(fine).writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
      await tester.runAsync(() async => chosen(actionById('image-to-jpg')!, [broken, fine]));
      await untilSaved(tester, 1);
      expect(bad.listSync().map((e) => p.basename(e.path)), ['same.png']);
      expect(good.listSync().map((e) => p.basename(e.path)).toSet(), {
        'same.png',
        'same (converted).jpg',
      });
      expect(find.textContaining('could not be read as a picture'), findsOneWidget);
      // Only these have a window to bring forward. Elsewhere there's no Shift-drag to come from.
      final hasWindow = Platform.isMacOS || Platform.isWindows;
      expect(
        shown,
        hasWindow ? 1 : 0,
        reason: 'The window comes forward, or nobody learns a file failed',
      );
    });

    testWidgets('making one PDF still takes all the files together', (tester) async {
      final calls = <int>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          calls.add(files.length);
          return runPortable(action, files, options: options);
        },
      );
      final paths = [aPhoto('a.png'), aPhoto('b.png')];
      await tester.runAsync(() async => chosen(actionById('images-to-pdf')!, paths));
      await untilSaved(tester, 1);
      expect(calls, [2]);
      expect(folder.listSync().where((e) => e.path.endsWith('.pdf')), hasLength(1));
    });

    testWidgets('resting on a slice gives its real size, and dropping there reuses that work', (
      tester,
    ) async {
      final converted = <String>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          converted.add(action.id);
          return runPortable(action, files, options: options);
        },
      );
      final path = aPhoto('photo.png');
      final jpg = actionById('image-to-jpg')!;
      await tester.runAsync(() => menuFor([path]));
      final size = await tester.runAsync(() => sizeOf(jpg, [path]));
      expect(size, matches(RegExp(r'^About \d+ (B|KB)$')));
      expect(converted, ['image-to-jpg']);

      await tester.runAsync(() async => chosen(jpg, [path]));
      await untilSaved(tester, 1);
      expect(File(p.join(folder.path, 'photo (converted).jpg')).existsSync(), isTrue);
      expect(converted, ['image-to-jpg'], reason: 'the trial was the conversion');
    });

    testWidgets('dropping on another slice than the one tried converts afresh', (tester) async {
      final converted = <String>[];
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          converted.add(action.id);
          return runPortable(action, files, options: options);
        },
      );
      final path = aPhoto('photo.png');
      await tester.runAsync(() => menuFor([path]));
      await tester.runAsync(() => sizeOf(actionById('image-to-jpg')!, [path]));
      await tester.runAsync(() async => chosen(actionById('image-to-webp')!, [path]));
      await untilSaved(tester, 1);
      expect(converted, ['image-to-jpg', 'image-to-webp']);
      expect(File(p.join(folder.path, 'photo (converted).webp')).existsSync(), isTrue);
    });

    testWidgets('several files, or a drag the menu never saw, have no size', (tester) async {
      var conversions = 0;
      await pump(
        tester,
        converter: (action, files, onProgress, options) {
          conversions++;
          return runPortable(action, files, options: options);
        },
      );
      final jpg = actionById('image-to-jpg')!;
      final one = aPhoto('a.png');
      final two = [one, aPhoto('b.png')];
      expect(await tester.runAsync(() => sizeOf(jpg, [one])), isNull);
      await tester.runAsync(() => menuFor(two));
      expect(await tester.runAsync(() => sizeOf(jpg, two)), isNull);
      expect(conversions, 0);
    });

    testWidgets('it stops listening when the screen goes', (tester) async {
      await pump(tester);
      await tester.pumpWidget(const SizedBox());
      expect(stopped, isTrue);
    });
  });
}

Future<List<RadialAction>> Function(List<String>, ActionMode)? _menuFor;
Future<String?> Function(RadialAction, List<String>)? _sizeOf;
void Function(RadialAction, List<String>, ActionOptions)? _chosen;

void _capture(
  Future<List<RadialAction>> Function(List<String>, ActionMode) menuFor,
  Future<String?> Function(RadialAction, List<String>) sizeOf,
  void Function(RadialAction, List<String>, ActionOptions) chosen,
) {
  _menuFor = menuFor;
  _sizeOf = sizeOf;
  _chosen = chosen;
}
