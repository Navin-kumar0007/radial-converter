import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shiftdrop/about.dart';
import 'package:shiftdrop/converter_screen.dart';
import 'package:shiftdrop/shift_drag.dart';
import 'package:shiftdrop/words.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('the version shown is the one being built', () {
    final pubspec = File('pubspec.yaml').readAsStringSync();
    final version = RegExp(r'^version: ([^+\s]+)', multiLine: true).firstMatch(pubspec)![1];
    expect(appVersion, version);
  });

  test('the raw project name shows nowhere people would see it', () {
    final places = {
      'web/index.html': '<title>ShiftDrop</title>',
      'web/manifest.json': '"name": "ShiftDrop"',
      'windows/runner/main.cpp': 'L"ShiftDrop"',
      'macos/Runner/Configs/AppInfo.xcconfig': 'PRODUCT_NAME = ShiftDrop',
    };
    places.forEach((path, expected) {
      expect(File(path).readAsStringSync(), contains(expected), reason: path);
    });
    expect(
      File('macos/Runner/Base.lproj/MainMenu.xib').readAsStringSync(),
      isNot(contains('APP_NAME')),
    );
    expect(
      File('windows/runner/Runner.rc').readAsStringSync(),
      isNot(contains('"ProductName", "shiftdrop"')),
    );
  });

  group('licences', () {
    test('every part has its text, and it\'s the licence named', () {
      const expected = {
        'lgpl-2.1.txt': 'LESSER GENERAL PUBLIC LICENSE',
        'lgpl-3.0.txt': 'LESSER GENERAL PUBLIC LICENSE',
        'mpl-2.0.txt': 'Mozilla Public License',
        'libarchive.txt': 'libarchive',
        'apache-2.0.txt': 'Apache License',
      };
      for (final licence in bundledLicences) {
        final text = File('assets/licenses/${licence.file}').readAsStringSync();
        expect(text, contains(expected[licence.file]!), reason: licence.file);
      }
    });

    test('LGPL parts say where their source is, and that they can be replaced', () {
      for (final licence in bundledLicences.where((each) => each.file.startsWith('lgpl'))) {
        expect(licence.note, contains('https://'), reason: licence.packages);
        expect(licence.note, contains('replaced'), reason: licence.packages);
      }
    });

    test('they all reach the licence page', () async {
      registerBundledLicenses();
      final names = <String>{};
      await for (final entry in LicenseRegistry.licenses) {
        names.addAll(entry.packages);
      }
      expect(names, containsAll(['FFmpeg', 'libheif', 'libarchive', 'Mediabunny']));
    });
  });

  testWidgets('it opens from the main screen', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: Words.localizationsDelegates,
        home: ConverterScreen(
          pickFiles: () async => const [],
          saveFile: (file) async => null,
          mediaAvailable: false,
          historyReader: () async => null,
          historyWriter: (_) async {},
        ),
      ),
    );
    await tester.tap(find.byTooltip('About'));
    await tester.pumpAndSettle();
    expect(find.text('0.9.0'), findsOneWidget);
  });

  testWidgets('About says what the app promises, and fits a phone', (tester) async {
    tester.view.physicalSize = const Size(360, 640);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      MaterialApp(
        localizationsDelegates: Words.localizationsDelegates,
        home: Builder(
          builder: (context) =>
              TextButton(onPressed: () => showAbout(context), child: const Text('open')),
        ),
      ),
    );
    await tester.tap(find.text('open'));
    await tester.pumpAndSettle();
    expect(find.text('ShiftDrop'), findsOneWidget);
    expect(find.text('0.9.0'), findsOneWidget);
    expect(find.textContaining('Your files stay on this device'), findsOneWidget);
    expect(find.textContaining('Mozilla Public License'), findsOneWidget);
    expect(find.text('View licenses'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  group('open at login', () {
    Future<void> show(
      WidgetTester tester, {
      required LoginItem state,
      Future<LoginItem> Function(bool on)? write,
    }) async {
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: Words.localizationsDelegates,
          home: Scaffold(
            body: OpenAtLogin(read: () async => state, write: write ?? (on) async => state),
          ),
        ),
      );
      await tester.pump();
    }

    testWidgets('isn\'t offered where the app can\'t do it', (tester) async {
      await show(tester, state: LoginItem.unsupported);
      expect(find.byType(Switch), findsNothing);
    });

    testWidgets('turns on and off, showing what is true afterwards', (tester) async {
      final asked = <bool>[];
      var now = LoginItem.off;
      await show(
        tester,
        state: now,
        write: (on) async {
          asked.add(on);
          return now = on ? LoginItem.on : LoginItem.off;
        },
      );
      expect(find.text('Open at login'), findsOneWidget);
      expect(tester.widget<Switch>(find.byType(Switch)).value, isFalse);
      await tester.tap(find.byType(Switch));
      await tester.pump();
      expect(asked, [true]);
      expect(tester.widget<Switch>(find.byType(Switch)).value, isTrue);
      await tester.tap(find.byType(Switch));
      await tester.pump();
      expect(asked, [true, false]);
      expect(tester.widget<Switch>(find.byType(Switch)).value, isFalse);
    });

    testWidgets('says where to allow it when macOS asks', (tester) async {
      await show(tester, state: LoginItem.off, write: (on) async => LoginItem.needsApproval);
      await tester.tap(find.byType(Switch));
      await tester.pump();
      expect(find.textContaining('Login Items'), findsOneWidget);
    });
  });
}
