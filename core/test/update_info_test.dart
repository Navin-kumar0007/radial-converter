import 'dart:io';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  group('parseVersion', () {
    test('reads three numbers and ignores a build number', () {
      expect(parseVersion('0.10.0'), [0, 10, 0]);
      expect(parseVersion('1.2.3+45'), [1, 2, 3]);
      expect(parseVersion(' 2.0.1 '), [2, 0, 1]);
    });

    test('refuses anything else', () {
      for (final bad in ['', '1.2', '1.2.3.4', 'v1.2.3', '1.2.x', '1.2.3-beta']) {
        expect(parseVersion(bad), isNull, reason: bad);
      }
    });
  });

  test('versions compare by number, not as text', () {
    expect(compareVersions([0, 10, 0], [0, 9, 1]), greaterThan(0));
    expect(compareVersions([0, 9, 1], [0, 10, 0]), lessThan(0));
    expect(compareVersions([1, 0, 0], [1, 0, 0]), 0);
    expect(compareVersions([2, 0, 0], [1, 99, 99]), greaterThan(0));
  });

  group('UpdateInfo.parse', () {
    const good = '''
{
  "version": "0.10.0",
  "page": "https://github.com/Navin-kumar0007/shiftdrop/releases/tag/v0.10.0",
  "downloads": {
    "macos": "https://github.com/Navin-kumar0007/shiftdrop/releases/download/v0.10.0/ShiftDrop-mac.dmg",
    "android": "https://elsewhere.example/evil.apk",
    "windows": 7
  }
}''';

    test('keeps the version, page and downloads from trusted hosts', () {
      final info = UpdateInfo.parse(good)!;
      expect(info.version, '0.10.0');
      expect(info.page.host, 'github.com');
      expect(info.downloads.keys, ['macos']);
      expect(info.addressFor('macos').path, endsWith('ShiftDrop-mac.dmg'));
      // An untrusted or missing download falls back to the release page.
      expect(info.addressFor('android'), info.page);
      expect(info.addressFor('windows'), info.page);
    });

    test('says which version is newer', () {
      final info = UpdateInfo.parse(good)!;
      expect(info.isNewerThan('0.9.1'), isTrue);
      expect(info.isNewerThan('0.10.0'), isFalse);
      expect(info.isNewerThan('0.11.0'), isFalse);
      expect(info.isNewerThan('nonsense'), isFalse);
    });

    test('refuses files that are not version files', () {
      for (final bad in [
        '',
        'not json',
        '[]',
        '{"version": "0.10.0"}',
        '{"version": "soon", "page": "https://github.com/x"}',
        '{"version": "0.10.0", "page": "http://github.com/x"}',
        '{"version": "0.10.0", "page": "https://github.com.evil.example/x"}',
        '{"version": "0.10.0", "page": "https://user@github.com/x"}',
        '{"version": "0.10.0", "page": "https://github.com:444/x"}',
      ]) {
        expect(UpdateInfo.parse(bad), isNull, reason: bad);
      }
    });

    test("the website's own version file is one, never ahead of the app", () {
      final text = File('../docs/site/version.json').readAsStringSync();
      final info = UpdateInfo.parse(text);
      expect(info, isNotNull);
      final pubspec = File('../app/pubspec.yaml').readAsStringSync();
      final building = RegExp(r'^version: ([0-9.]+)', multiLine: true).firstMatch(pubspec)!;
      // It lags behind while a release waits for testers, but never runs ahead of the app.
      expect(info!.isNewerThan(building.group(1)!), isFalse);
      for (final platform in ['macos', 'windows', 'android']) {
        expect(info.addressFor(platform).toString(), contains('v${info.version}'));
      }
    });
  });

  test('checks are due once a day, and after the clock goes back', () {
    final now = DateTime(2026, 11, 11, 12);
    expect(updateCheckDue(null, now), isTrue);
    expect(updateCheckDue(now.subtract(const Duration(hours: 2)), now), isFalse);
    expect(updateCheckDue(now.subtract(const Duration(hours: 21)), now), isTrue);
    expect(updateCheckDue(now.add(const Duration(days: 3)), now), isTrue);
  });
}
