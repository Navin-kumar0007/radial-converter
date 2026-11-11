import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';

import 'about.dart';
import 'app_settings.dart';

/// The version file on the website, `docs/site/version.json`.
final versionFileAddress = Uri.parse('https://shiftdrop.pages.dev/version.json');

/// Where every download is, for copies that can't check by themselves.
final releasesPage = Uri.parse('$projectAddress/releases/latest');

/// Set when building the Microsoft Store copy, which the Store keeps up to date.
const storeCopy = bool.fromEnvironment('SHIFTDROP_STORE');

/// How this copy gets newer versions.
enum UpdateWay {
  /// Updated by other means: the web app with each deploy, the Store copy by the Store.
  none,

  /// Asks the version file once a day, if the user hasn't turned that off.
  check,

  /// Can only offer the download page. The Android app has no permission to use the internet, so
  /// Android itself keeps the promise that it never connects; the browser fetches the page instead.
  page,
}

UpdateWay updateWayFor({required bool web, required TargetPlatform platform, bool store = false}) {
  if (web) return UpdateWay.none;
  return switch (platform) {
    TargetPlatform.macOS => UpdateWay.check,
    TargetPlatform.windows => store ? UpdateWay.none : UpdateWay.check,
    TargetPlatform.android => UpdateWay.page,
    _ => UpdateWay.none,
  };
}

UpdateWay get updateWayHere =>
    updateWayFor(web: kIsWeb, platform: defaultTargetPlatform, store: storeCopy);

/// The version file's name for this platform's download.
String get updatePlatformName => switch (defaultTargetPlatform) {
  TargetPlatform.macOS => 'macos',
  TargetPlatform.windows => 'windows',
  TargetPlatform.android => 'android',
  _ => '',
};

typedef VersionFetcher = Future<String> Function(Uri address);

/// Asks the website whether there's a newer version, at most once a day and only if the user lets
/// it. Null when there isn't one, and when anything goes wrong: a failed check says nothing, and
/// the next launch tries again.
Future<UpdateInfo?> checkForUpdate(
  SettingsStore settings, {
  required VersionFetcher fetch,
  DateTime? now,
  String current = appVersion,
}) async {
  final when = now ?? DateTime.now();
  if (!settings.value.checkForUpdates || !updateCheckDue(settings.value.lastUpdateCheck, when)) {
    return null;
  }
  final String text;
  try {
    text = await fetch(versionFileAddress);
  } catch (error) {
    debugPrint('Could not check for a newer version: $error');
    return null;
  }
  await settings.change((old) => old.copyWith(lastUpdateCheck: when));
  final info = UpdateInfo.parse(text);
  return info != null && info.isNewerThan(current) ? info : null;
}
