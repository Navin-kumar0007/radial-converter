import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:radial_core/radial_core.dart';
import 'package:shiftdrop/app_home.dart';
import 'package:shiftdrop/app_settings.dart';
import 'package:shiftdrop/update_check.dart';
import 'package:shiftdrop/welcome_screen.dart';
import 'package:shiftdrop/words.dart';

SettingsStore _store([AppSettings settings = const AppSettings(), List<String>? written]) {
  return SettingsStore(settings, write: (text) async => written?.add(text));
}

Widget _app(Widget home, {SettingsStore? settings}) {
  final app = MaterialApp(localizationsDelegates: Words.localizationsDelegates, home: home);
  return settings == null ? app : SettingsScope(store: settings, child: app);
}

const _newer = '''
{
  "version": "99.0.0",
  "page": "https://github.com/Navin-kumar0007/shiftdrop/releases/tag/v99.0.0",
  "downloads": {"macos": "https://github.com/Navin-kumar0007/shiftdrop/releases/download/v99.0.0/ShiftDrop-mac.dmg"}
}''';

void main() {
  group('settings', () {
    test('come back as they were saved', () {
      final settings = AppSettings(
        welcomed: true,
        checkForUpdates: false,
        language: 'hi',
        lastUpdateCheck: DateTime.utc(2026, 11, 11, 9),
      );
      final back = AppSettings.decode(settings.encode());
      expect(back.welcomed, isTrue);
      expect(back.checkForUpdates, isFalse);
      expect(back.language, 'hi');
      expect(back.locale, const Locale('hi'));
      expect(back.lastUpdateCheck, DateTime.utc(2026, 11, 11, 9));
    });

    test('missing or damaged ones are the defaults, with update checks on', () {
      for (final text in [null, '', 'not json', '[1]', '{"language": "xx", "welcomed": "yes"}']) {
        final settings = AppSettings.decode(text);
        expect(settings.welcomed, isFalse, reason: text);
        expect(settings.checkForUpdates, isTrue, reason: text);
        expect(settings.language, isNull, reason: text);
      }
    });

    test('a change is saved, and failing to save never throws', () async {
      final written = <String>[];
      final store = _store(const AppSettings(), written);
      await store.change((old) => old.copyWith(welcomed: true));
      expect(AppSettings.decode(written.single).welcomed, isTrue);
      final broken = SettingsStore(const AppSettings(), write: (_) async => throw StateError('no'));
      await broken.change((old) => old.copyWith(language: () => 'en'));
      expect(broken.value.language, 'en');
    });

    test('a damaged file loads as the defaults', () async {
      final store = await SettingsStore.load(
        read: () async => throw StateError('unreadable'),
        write: (_) async {},
      );
      expect(store.value.welcomed, isFalse);
    });
  });

  group('the update check', () {
    final now = DateTime(2026, 11, 11, 12);

    test('only copies from the website check by themselves', () {
      expect(updateWayFor(web: false, platform: TargetPlatform.macOS), UpdateWay.check);
      expect(updateWayFor(web: false, platform: TargetPlatform.windows), UpdateWay.check);
      expect(
        updateWayFor(web: false, platform: TargetPlatform.windows, store: true),
        UpdateWay.none,
      );
      // No internet permission, so only a link the browser opens.
      expect(updateWayFor(web: false, platform: TargetPlatform.android), UpdateWay.page);
      expect(updateWayFor(web: true, platform: TargetPlatform.macOS), UpdateWay.none);
      expect(updateWayFor(web: false, platform: TargetPlatform.iOS), UpdateWay.none);
    });

    test('tells of a newer version and remembers when it asked', () async {
      final store = _store();
      final asked = <Uri>[];
      final info = await checkForUpdate(
        store,
        now: now,
        current: '0.9.1',
        fetch: (address) async {
          asked.add(address);
          return _newer;
        },
      );
      expect(info?.version, '99.0.0');
      expect(asked.single.toString(), 'https://shiftdrop.pages.dev/version.json');
      expect(store.value.lastUpdateCheck, now);
    });

    test('says nothing about the same or an older version', () async {
      final info = await checkForUpdate(
        _store(),
        now: now,
        current: '99.0.0',
        fetch: (_) async => _newer,
      );
      expect(info, isNull);
    });

    test('asks nothing when turned off, or already asked today', () async {
      var fetched = 0;
      Future<String> fetch(Uri _) async {
        fetched++;
        return _newer;
      }

      await checkForUpdate(
        _store(const AppSettings(checkForUpdates: false)),
        now: now,
        fetch: fetch,
      );
      await checkForUpdate(
        _store(AppSettings(lastUpdateCheck: now.subtract(const Duration(hours: 3)))),
        now: now,
        fetch: fetch,
      );
      expect(fetched, 0);
    });

    test('a failed check says nothing, and the next launch tries again', () async {
      final store = _store();
      final info = await checkForUpdate(
        store,
        now: now,
        fetch: (_) async => throw const FormatException('offline'),
      );
      expect(info, isNull);
      expect(store.value.lastUpdateCheck, isNull);
      expect(await checkForUpdate(store, now: now, fetch: (_) async => '<html>'), isNull);
    });
  });

  group('the main screen', () {
    Widget home(
      SettingsStore store, {
      Future<String> Function(Uri)? fetch,
      List<Uri>? opened,
      UpdateWay way = UpdateWay.check,
    }) {
      return _app(
        AppHome(
          settings: store,
          updateWay: way,
          checkAfter: Duration.zero,
          fetch: fetch ?? (_) async => throw StateError('offline'),
          open: (address) async {
            opened?.add(address);
            return true;
          },
          convert: (action, files, onProgress, options) async => files,
          screen: (showGuide) => Scaffold(
            body: TextButton(onPressed: showGuide, child: const Text('main screen')),
          ),
        ),
        settings: store,
      );
    }

    testWidgets('shows the guide on first launch only', (tester) async {
      final store = _store();
      await tester.pumpWidget(home(store));
      await tester.pumpAndSettle();
      expect(find.text('Welcome to ShiftDrop'), findsOneWidget);
      await tester.tap(find.text('Skip'));
      await tester.pumpAndSettle();
      expect(find.text('main screen'), findsOneWidget);
      expect(store.value.welcomed, isTrue);

      await tester.pumpWidget(const SizedBox());
      await tester.pumpWidget(home(store));
      await tester.pumpAndSettle();
      expect(find.text('Welcome to ShiftDrop'), findsNothing);
      // And again when asked for, as About does.
      await tester.tap(find.text('main screen'));
      await tester.pumpAndSettle();
      expect(find.text('Welcome to ShiftDrop'), findsOneWidget);
    });

    testWidgets('a newer version shows a note, whose button opens its download', (tester) async {
      final opened = <Uri>[];
      final store = _store(const AppSettings(welcomed: true));
      await tester.pumpWidget(home(store, fetch: (_) async => _newer, opened: opened));
      await tester.pumpAndSettle();
      expect(find.text('ShiftDrop 99.0.0 is out.'), findsOneWidget);
      await tester.tap(find.text('Download'));
      await tester.pumpAndSettle();
      expect(opened.single.host, 'github.com');
      expect(find.text('ShiftDrop 99.0.0 is out.'), findsNothing);
    });

    testWidgets('"Later" puts the note away', (tester) async {
      final store = _store(const AppSettings(welcomed: true));
      await tester.pumpWidget(home(store, fetch: (_) async => _newer));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Later'));
      await tester.pumpAndSettle();
      expect(find.text('ShiftDrop 99.0.0 is out.'), findsNothing);
    });

    testWidgets('copies that update otherwise never ask', (tester) async {
      var fetched = 0;
      final store = _store(const AppSettings(welcomed: true));
      for (final way in [UpdateWay.none, UpdateWay.page]) {
        await tester.pumpWidget(
          home(
            store,
            way: way,
            fetch: (_) async {
              fetched++;
              return _newer;
            },
          ),
        );
        await tester.pumpAndSettle();
      }
      expect(fetched, 0);
      expect(find.textContaining('is out'), findsNothing);
    });
  });

  group('the guide', () {
    test('the sample photo is a real JPEG', () {
      final photo = samplePhoto();
      expect(detectKind(photo, fileName: 'sample photo.jpg'), FileKind.jpg);
      expect(photo.length, lessThan(100 * 1024));
    });

    Future<List<String>> showGuide(
      WidgetTester tester, {
      required TargetPlatform platform,
      SettingsStore? store,
      bool web = false,
    }) async {
      final converted = <String>[];
      tester.view.physicalSize = const Size(800, 900);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        _app(
          WelcomeScreen(
            platform: platform,
            web: web,
            settings: store,
            updateWay: UpdateWay.check,
            onDone: () {},
            convert: (action, files, onProgress, options) async {
              converted.add(action.id);
              return [PortableFile('sample photo (converted).png', Uint8List(2048))];
            },
          ),
          settings: store,
        ),
      );
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();
      return converted;
    }

    /// Drags from the photo to the menu's top slice and lets go there.
    Future<void> dragToTopSlice(WidgetTester tester, PointerDeviceKind kind) async {
      final start = tester.getCenter(find.bySemanticsLabel('A sample photo to practise on'));
      final gesture = await tester.startGesture(start, kind: kind);
      await gesture.moveBy(const Offset(0, -12));
      await tester.pumpAndSettle();
      await gesture.moveTo(start + const Offset(0, -84));
      await tester.pump();
      await gesture.up();
      await tester.pumpAndSettle();
    }

    testWidgets('on a desktop, a Shift-drag onto a slice converts the sample', (tester) async {
      final converted = await showGuide(tester, platform: TargetPlatform.macOS);
      expect(find.text('Hold Shift and drag the photo, then let go on a slice.'), findsOneWidget);
      await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
      await dragToTopSlice(tester, PointerDeviceKind.mouse);
      await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
      expect(converted, hasLength(1));
      expect(find.text('Done: sample photo (converted).png, 2 KB.'), findsOneWidget);
      expect(find.textContaining('from Finder'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('without Shift it says to hold it', (tester) async {
      final converted = await showGuide(tester, platform: TargetPlatform.windows);
      await dragToTopSlice(tester, PointerDeviceKind.mouse);
      expect(converted, isEmpty);
      expect(find.text('Hold Shift while you drag.'), findsOneWidget);
    });

    testWidgets('a finger just drags, and gets the phone tip', (tester) async {
      final converted = await showGuide(tester, platform: TargetPlatform.android);
      expect(find.text('Drag the photo, then let go on a slice.'), findsOneWidget);
      await dragToTopSlice(tester, PointerDeviceKind.touch);
      expect(converted, hasLength(1));
      expect(find.text('In other apps, tap Share, then ShiftDrop.'), findsOneWidget);
    });

    testWidgets('letting go in the centre cancels, and it can be tried again', (tester) async {
      final converted = await showGuide(tester, platform: TargetPlatform.android);
      final start = tester.getCenter(find.bySemanticsLabel('A sample photo to practise on'));
      final gesture = await tester.startGesture(start, kind: PointerDeviceKind.touch);
      await gesture.moveBy(const Offset(0, -12));
      await tester.pumpAndSettle();
      await gesture.moveTo(start);
      await gesture.up();
      await tester.pumpAndSettle();
      expect(converted, isEmpty);
      expect(find.textContaining('the centre cancels'), findsOneWidget);
      await dragToTopSlice(tester, PointerDeviceKind.touch);
      expect(converted, hasLength(1));
    });

    testWidgets('ends with the language and update choices, and counts as seen', (tester) async {
      final store = _store();
      await showGuide(tester, platform: TargetPlatform.macOS, store: store);
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();
      expect(find.text('Check for new versions'), findsOneWidget);
      await tester.tap(find.text('हिन्दी'));
      await tester.pumpAndSettle();
      expect(store.value.language, 'hi');
      await tester.tap(find.text('Check for new versions'));
      await tester.pumpAndSettle();
      expect(store.value.checkForUpdates, isFalse);
      await tester.tap(find.text('Start'));
      await tester.pumpAndSettle();
      expect(store.value.welcomed, isTrue);
    });

    testWidgets('fits a small phone', (tester) async {
      await showGuide(tester, platform: TargetPlatform.android);
      tester.view.physicalSize = const Size(320, 568);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    });
  });
}
