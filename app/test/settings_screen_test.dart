import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as p;
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/about.dart';
import 'package:shiftdrop/app_settings.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/settings_screen.dart';
import 'package:shiftdrop/update_check.dart';
import 'package:shiftdrop/words.dart';

SettingsStore _store([AppSettings settings = const AppSettings()]) {
  return SettingsStore(settings, write: (_) async {});
}

Widget _app(Widget home, SettingsStore? settings) {
  final app = MaterialApp(localizationsDelegates: Words.localizationsDelegates, home: home);
  return settings == null ? app : SettingsScope(store: settings, child: app);
}

void main() {
  test('the new settings come back as they were saved, with sensible defaults', () {
    const settings = AppSettings(theme: 'dark', showPreviews: false, resultsFolder: '/r');
    final back = AppSettings.decode(settings.encode());
    expect(back.theme, 'dark');
    expect(back.themeMode, ThemeMode.dark);
    expect(back.showPreviews, isFalse);
    expect(back.resultsFolder, '/r');
    final fresh = AppSettings.decode('{"theme": "purple", "resultsFolder": ""}');
    expect(fresh.themeMode, ThemeMode.system);
    expect(fresh.showPreviews, isTrue);
    expect(fresh.resultsFolder, isNull);
  });

  group('the screen', () {
    Future<void> show(
      WidgetTester tester,
      SettingsStore store, {
      bool desktop = true,
      UpdateWay way = UpdateWay.check,
      VoidCallback? guide,
      Future<String?> Function()? choose,
    }) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        _app(
          SettingsScreen(
            desktop: desktop,
            updateWay: way,
            onShowGuide: guide,
            chooseFolder: choose ?? () async => null,
          ),
          store,
        ),
      );
      await tester.pumpAndSettle();
    }

    testWidgets('picks the theme, the language and previews', (tester) async {
      final store = _store();
      await show(tester, store);
      await tester.tap(find.text('Dark'));
      await tester.pumpAndSettle();
      expect(store.value.theme, 'dark');
      await tester.tap(find.text('English'));
      await tester.pumpAndSettle();
      expect(store.value.language, 'en');
      await tester.tap(find.text('As the device'));
      await tester.pumpAndSettle();
      expect(store.value.language, isNull);
      await tester.tap(find.text('Show previews'));
      await tester.pumpAndSettle();
      expect(store.value.showPreviews, isFalse);
    });

    testWidgets('chooses a folder for results, and goes back to beside the original', (
      tester,
    ) async {
      final store = _store();
      await show(tester, store, choose: () async => '/Users/me/Converted');
      await tester.tap(find.text('In one folder'));
      await tester.pumpAndSettle();
      expect(store.value.resultsFolder, '/Users/me/Converted');
      expect(find.text('/Users/me/Converted'), findsOneWidget);
      await tester.tap(find.text('Beside the original'));
      await tester.pumpAndSettle();
      expect(store.value.resultsFolder, isNull);
    });

    testWidgets('cancelling the folder dialog changes nothing', (tester) async {
      final store = _store();
      await show(tester, store);
      await tester.tap(find.text('In one folder'));
      await tester.pumpAndSettle();
      expect(store.value.resultsFolder, isNull);
    });

    testWidgets('phones and browsers have no folder or login choice', (tester) async {
      await show(tester, _store(), desktop: false, way: UpdateWay.none);
      expect(find.text('Where results go'), findsNothing);
      expect(find.text('Open at login'), findsNothing);
      expect(find.text('Check for new versions'), findsNothing);
      expect(find.text('Theme'), findsOneWidget);
    });

    testWidgets('a desktop copy from the website can turn the update check off', (tester) async {
      final store = _store();
      await show(tester, store);
      await tester.tap(find.text('Check for new versions'));
      await tester.pumpAndSettle();
      expect(store.value.checkForUpdates, isFalse);
    });

    testWidgets('opens the guide again, closing first', (tester) async {
      var shown = 0;
      await show(tester, _store(), guide: () => shown++);
      await tester.tap(find.text('Show the guide again'));
      await tester.pumpAndSettle();
      expect(shown, 1);
      expect(find.text('Settings'), findsNothing);
    });

    testWidgets('fits a small phone, in Hindi too', (tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        SettingsScope(
          store: _store(const AppSettings(resultsFolder: '/a/rather/long/folder/name/here')),
          child: MaterialApp(
            locale: const Locale('hi'),
            localizationsDelegates: Words.localizationsDelegates,
            supportedLocales: Words.supportedLocales,
            home: const SettingsScreen(desktop: true, updateWay: UpdateWay.check),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    });
  });

  testWidgets('a phone gets a link to the download page instead of a check', (tester) async {
    final opened = <Uri>[];
    await tester.pumpWidget(
      _app(
        Scaffold(
          body: GetNewest(
            open: (address) async {
              opened.add(address);
              return false;
            },
          ),
        ),
        null,
      ),
    );
    await tester.tap(find.text('Get the newest version'));
    await tester.pumpAndSettle();
    expect(opened.single.toString(), '$projectAddress/releases/latest');
    expect(find.textContaining("Couldn't open the page"), findsOneWidget);
  });

  group('the main screen', () {
    testWidgets('has a gear for Settings only where there are settings', (tester) async {
      Widget screen() => ConverterScreen(
        pickFiles: () async => const [],
        saveFile: (_) async => null,
        mediaAvailable: false,
        historyReader: () async => null,
        historyWriter: (_) async {},
        sharedFiles: () => const Stream.empty(),
      );
      await tester.pumpWidget(_app(screen(), null));
      expect(find.byTooltip('Settings'), findsNothing);
      await tester.pumpWidget(_app(screen(), _store()));
      await tester.tap(find.byTooltip('Settings'));
      await tester.pumpAndSettle();
      expect(find.text('Show previews'), findsOneWidget);
    });

    late Directory folder;
    setUp(() => folder = Directory.systemTemp.createTempSync('radial_results_'));
    tearDown(() => folder.deleteSync(recursive: true));

    /// Shift-drags a photo onto JPG with these settings, and waits for it to be saved. Returns the
    /// photo's folder. Previews stay off: one still reading the photo would stop Windows deleting
    /// the folder afterwards.
    Future<String> shiftDragAPhoto(WidgetTester tester, SettingsStore store) async {
      late void Function(RadialAction, List<String>, ActionOptions) choose;
      await tester.pumpWidget(
        _app(
          ConverterScreen(
            pickFiles: () async => const [],
            saveFile: (_) async => throw StateError('Nothing should ask to save'),
            mediaAvailable: false,
            acceptsDrops: false,
            savesBeside: true,
            historyReader: () async => null,
            historyWriter: (_) async {},
            sharedFiles: () => const Stream.empty(),
            converter: (action, files, onProgress, options) {
              return runPortable(action, files, options: options);
            },
            shiftDrag: ({required menuFor, required sizeOf, required chosen}) {
              choose = chosen;
              return () {};
            },
          ),
          store,
        ),
      );
      final photos = Directory(p.join(folder.path, 'photos'))..createSync();
      final photo = p.join(photos.path, 'photo.png');
      File(photo).writeAsBytesSync(img.encodePng(img.Image(width: 8, height: 8)));
      await tester.runAsync(() async {
        choose(actionById('image-to-jpg')!, [photo], const ActionOptions());
      });
      final saved = find.textContaining('Saved');
      for (var i = 0; i < 250 && saved.evaluate().isEmpty; i++) {
        await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 20)));
        await tester.pump();
      }
      return photos.path;
    }

    testWidgets('results go into the folder chosen in Settings', (tester) async {
      final results = Directory(p.join(folder.path, 'Converted'))..createSync();
      final photos = await shiftDragAPhoto(
        tester,
        _store(AppSettings(welcomed: true, showPreviews: false, resultsFolder: results.path)),
      );
      expect(File(p.join(results.path, 'photo (converted).jpg')).existsSync(), isTrue);
      expect(Directory(photos).listSync().map((e) => p.basename(e.path)), ['photo.png']);
      expect(find.textContaining('Saved in Converted'), findsOneWidget);
    });

    testWidgets('a folder that has gone falls back to beside the original, and says so', (
      tester,
    ) async {
      final gone = p.join(folder.path, 'not here');
      final photos = await shiftDragAPhoto(
        tester,
        _store(AppSettings(welcomed: true, showPreviews: false, resultsFolder: gone)),
      );
      expect(File(p.join(photos, 'photo (converted).jpg')).existsSync(), isTrue);
      expect(Directory(gone).existsSync(), isFalse, reason: 'it is never made');
      expect(find.textContaining("can't be used"), findsOneWidget);
      expect(find.textContaining('Saved beside the original'), findsOneWidget);
    });
  });
}
