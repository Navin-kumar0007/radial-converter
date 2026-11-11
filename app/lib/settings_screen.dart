import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as p;

import 'app_settings.dart';
import 'open_page.dart';
import 'shift_drag.dart';
import 'update_check.dart';
import 'words.dart';

/// Opens Settings over the current screen.
Future<void> openSettings(BuildContext context, {VoidCallback? onShowGuide}) {
  return Navigator.of(context).push(
    MaterialPageRoute<void>(
      fullscreenDialog: true,
      builder: (_) => SettingsScreen(onShowGuide: onShowGuide),
    ),
  );
}

/// Every choice the app has, in one place. Each is saved as soon as it changes.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({
    super.key,
    this.onShowGuide,
    this.desktop,
    this.updateWay,
    this.chooseFolder = _chooseFolder,
  });

  /// Opens the first-launch guide again, after Settings closes.
  final VoidCallback? onShowGuide;

  /// Whether this is a Mac or Windows, with folders to save into and a login to open at. Null
  /// asks the platform.
  final bool? desktop;
  final UpdateWay? updateWay;
  final Future<String?> Function() chooseFolder;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final settings = SettingsScope.maybeOf(context);
    final isDesktop =
        desktop ??
        (!kIsWeb &&
            (defaultTargetPlatform == TargetPlatform.macOS ||
                defaultTargetPlatform == TargetPlatform.windows));
    final updates = updateWay ?? updateWayHere;
    return Scaffold(
      appBar: AppBar(title: Text(words.settingsTitle)),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
              children: [
                if (settings != null) ...[
                  if (isDesktop) ResultsFolderChoice(settings: settings, choose: chooseFolder),
                  ThemeChoice(settings: settings),
                  LanguageChoice(settings: settings),
                  const SizedBox(height: 8),
                  PreviewsSwitch(settings: settings),
                ],
                if (isDesktop) const OpenAtLogin(),
                if (settings != null && updates == UpdateWay.check)
                  UpdateChecks(settings: settings),
                if (updates == UpdateWay.page) const GetNewest(),
                if (onShowGuide != null)
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.school_outlined),
                    title: Text(words.showGuide),
                    onTap: () {
                      Navigator.of(context).pop();
                      onShowGuide!();
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Future<String?> _chooseFolder() => FilePicker.getDirectoryPath();

/// A heading and its choices, as each setting is laid out.
class _Labelled extends StatelessWidget {
  const _Labelled({required this.label, required this.child, this.below});

  final String label;
  final Widget child;
  final Widget? below;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          child,
          ?below,
        ],
      ),
    );
  }
}

/// Where results go on a desktop: beside each original, or one folder chosen here. A folder
/// that's gone is still shown, and results go beside the originals until it's back or changed.
class ResultsFolderChoice extends StatelessWidget {
  const ResultsFolderChoice({super.key, required this.settings, required this.choose});

  final SettingsStore settings;
  final Future<String?> Function() choose;

  Future<void> _pick() async {
    final String? folder;
    try {
      folder = await choose();
    } catch (error) {
      debugPrint('Choosing a folder failed: $error');
      return;
    }
    if (folder == null || folder.isEmpty) return;
    await settings.change((old) => old.copyWith(resultsFolder: () => folder));
  }

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ValueListenableBuilder(
      valueListenable: settings,
      builder: (context, value, _) {
        final folder = value.resultsFolder;
        return _Labelled(
          label: words.resultsWhere,
          below: folder == null
              ? null
              : Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: [
                      const Icon(Icons.folder_outlined, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          folder,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          semanticsLabel: words.resultsFolderIs(p.basename(folder)),
                        ),
                      ),
                      TextButton(onPressed: _pick, child: Text(words.resultsChange)),
                    ],
                  ),
                ),
          child: SegmentedButton<bool>(
            showSelectedIcon: false,
            segments: [
              ButtonSegment(value: false, label: Text(words.resultsBeside)),
              ButtonSegment(value: true, label: Text(words.resultsInFolder)),
            ],
            selected: {folder != null},
            onSelectionChanged: (chosen) {
              if (chosen.single) {
                _pick();
              } else {
                settings.change((old) => old.copyWith(resultsFolder: () => null));
              }
            },
          ),
        );
      },
    );
  }
}

/// Light, dark, or as the system is.
class ThemeChoice extends StatelessWidget {
  const ThemeChoice({super.key, required this.settings});

  final SettingsStore settings;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ValueListenableBuilder(
      valueListenable: settings,
      builder: (context, value, _) => _Labelled(
        label: words.theme,
        child: SegmentedButton<String>(
          showSelectedIcon: false,
          segments: [
            ButtonSegment(value: 'system', label: Text(words.themeSystem)),
            ButtonSegment(value: 'light', label: Text(words.themeLight)),
            ButtonSegment(value: 'dark', label: Text(words.themeDark)),
          ],
          selected: {value.theme},
          onSelectionChanged: (chosen) =>
              settings.change((old) => old.copyWith(theme: chosen.single)),
        ),
      ),
    );
  }
}

/// The switch for showing a small picture of each file and result.
class PreviewsSwitch extends StatelessWidget {
  const PreviewsSwitch({super.key, required this.settings});

  final SettingsStore settings;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return ValueListenableBuilder(
      valueListenable: settings,
      builder: (context, value, _) => SwitchListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(words.showPreviews),
        subtitle: Text(words.showPreviewsWhy),
        value: value.showPreviews,
        onChanged: (on) => settings.change((old) => old.copyWith(showPreviews: on)),
      ),
    );
  }
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
