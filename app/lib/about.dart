import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_settings.dart';
import 'open_page.dart';
import 'shift_drag.dart';
import 'update_check.dart';
import 'words.dart';

/// Shown to people, and checked against `pubspec.yaml` by a test.
const appName = 'ShiftDrop';
const appVersion = '0.9.1';

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

/// What the app is, what it promises, and the licences of everything in it, with the few choices
/// there are. [onShowGuide] opens the first-launch guide again.
void showAbout(BuildContext context, {VoidCallback? onShowGuide}) {
  final settings = SettingsScope.maybeOf(context);
  final updates = updateWayHere;
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
      const OpenAtLogin(),
      if (settings != null) ...[
        const SizedBox(height: 4),
        LanguageChoice(settings: settings),
        if (updates == UpdateWay.check) UpdateChecks(settings: settings),
      ],
      if (updates == UpdateWay.page) const GetNewest(),
      if (onShowGuide != null)
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: Builder(
            builder: (context) => TextButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                onShowGuide();
              },
              icon: const Icon(Icons.school_outlined),
              label: Text(context.words.showGuide),
            ),
          ),
        ),
    ],
  );
}

/// The app's language: the device's, or one chosen here.
class LanguageChoice extends StatelessWidget {
  const LanguageChoice({super.key, required this.settings});

  final SettingsStore settings;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ValueListenableBuilder(
      valueListenable: settings,
      builder: (context, value, _) => Padding(
        padding: const EdgeInsets.only(top: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(words.language, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            SegmentedButton<String>(
              showSelectedIcon: false,
              segments: [
                ButtonSegment(value: '', label: Text(words.languageDevice)),
                // Each language named in itself, so it can be found whatever is showing.
                const ButtonSegment(value: 'en', label: Text('English')),
                const ButtonSegment(
                  value: 'hi',
                  label: Text('\u0939\u093f\u0928\u094d\u0926\u0940'),
                ),
              ],
              selected: {value.language ?? ''},
              onSelectionChanged: (chosen) {
                final language = chosen.single;
                settings.change(
                  (old) => old.copyWith(language: () => language.isEmpty ? null : language),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

/// The switch for the daily check for a newer version, on copies downloaded from the website.
class UpdateChecks extends StatelessWidget {
  const UpdateChecks({super.key, required this.settings});

  final SettingsStore settings;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ValueListenableBuilder(
      valueListenable: settings,
      builder: (context, value, _) => SwitchListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(words.checkUpdates),
        subtitle: Text(words.checkUpdatesWhy),
        value: value.checkForUpdates,
        onChanged: (on) => settings.change((old) => old.copyWith(checkForUpdates: on)),
      ),
    );
  }
}

/// Where the app can't check by itself, a way to the download page in the browser.
class GetNewest extends StatelessWidget {
  const GetNewest({super.key, this.open = openPage});

  final Future<bool> Function(Uri address) open;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.system_update_alt),
      title: Text(words.getNewest),
      subtitle: Text(words.getNewestWhy),
      onTap: () async {
        final messenger = ScaffoldMessenger.maybeOf(context);
        if (!await open(releasesPage)) {
          messenger?.showSnackBar(
            SnackBar(content: Text(words.pageFailed(releasesPage.toString()))),
          );
        }
      },
    );
  }
}

/// The switch for opening at login, shown only where the app can do it.
class OpenAtLogin extends StatefulWidget {
  const OpenAtLogin({super.key, this.read = loginItem, this.write = setLoginItem});

  final Future<LoginItem> Function() read;
  final Future<LoginItem> Function(bool on) write;

  @override
  State<OpenAtLogin> createState() => _OpenAtLoginState();
}

class _OpenAtLoginState extends State<OpenAtLogin> {
  LoginItem _state = LoginItem.unsupported;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    widget.read().then((state) {
      if (mounted) setState(() => _state = state);
    });
  }

  Future<void> _set(bool on) async {
    setState(() => _busy = true);
    final state = await widget.write(on);
    if (mounted) {
      setState(() {
        _state = state;
        _busy = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_state == LoginItem.unsupported) return const SizedBox.shrink();
    final words = context.words;
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: SwitchListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(words.openAtLogin),
        subtitle: Text(
          _state == LoginItem.needsApproval ? words.openAtLoginApprove : words.openAtLoginWhy,
        ),
        value: _state != LoginItem.off,
        onChanged: _busy ? null : _set,
      ),
    );
  }
}
