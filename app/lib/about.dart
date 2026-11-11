import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'words.dart';

/// Shown to people, and checked against `pubspec.yaml` by a test.
const appName = 'ShiftDrop';
const appVersion = '0.11.0';

const projectAddress = 'https://github.com/Navin-kumar0007/shiftdrop';

/// Parts built into the app whose licences Flutter can't find by itself, as they aren't Dart
/// packages. LGPL parts say where their source is and that they can be replaced, as LGPL asks.
const bundledLicences = <({String packages, String file, String note})>[
  (
    packages: 'FFmpeg',
    file: 'lgpl-2.1.txt',
    note:
        'FFmpeg 9.0.2 is used under the LGPL 2.1, as separate programs in the desktop apps, and '
        'can be replaced with your own build. Source: https://ffmpeg.org/releases/ffmpeg-9.0.2.tar.xz. '
        'How ours is built: engines/ in $projectAddress. It includes LAME (LGPL), Opus and libvpx (BSD).',
  ),
  (
    packages: 'libheif, libde265',
    file: 'lgpl-3.0.txt',
    note:
        'libheif-js 1.23.5 is used under the LGPL 3.0 in the web app, as one separate file that '
        'can be replaced with your own build. Source: https://github.com/catdad-experiments/libheif-js',
  ),
  (
    packages: 'Mediabunny',
    file: 'mpl-2.0.txt',
    note: 'Mediabunny 1.61.6, in the web app. Source: https://github.com/Vanilagy/mediabunny',
  ),
  (
    packages: 'libarchive, xz',
    file: 'libarchive.txt',
    note: 'Reads 7z and RAR. Source: https://github.com/libarchive/libarchive',
  ),
  (
    packages: 'AndroidX Media3, libarchive-android',
    file: 'apache-2.0.txt',
    note:
        'In the Android app. Source: https://github.com/androidx/media and '
        'https://github.com/zhanghai/libarchive-android',
  ),
];

/// Adds [bundledLicences] to what the licence page shows. Read only when someone opens it.
void registerBundledLicenses() {
  LicenseRegistry.addLicense(() async* {
    for (final licence in bundledLicences) {
      final text = await rootBundle.loadString('assets/licenses/${licence.file}');
      yield LicenseEntryWithLineBreaks(licence.packages.split(', '), '${licence.note}\n\n$text');
    }
  });
}

/// What the app is, what it promises, and the licences of everything in it. Choices are in
/// Settings.
void showAbout(BuildContext context) {
  showAboutDialog(
    context: context,
    applicationName: appName,
    applicationVersion: appVersion,
    applicationIcon: Image.asset(
      'assets/app_icon.png',
      width: 56,
      height: 56,
      excludeFromSemantics: true,
    ),
    applicationLegalese: context.words.licence,
    children: [
      const SizedBox(height: 16),
      Text(context.words.privacyPromise),
      const SizedBox(height: 12),
      const SelectableText(projectAddress),
    ],
  );
}
