import 'dart:async';

import 'package:flutter/material.dart';

import 'app_settings.dart';
import 'conversion.dart' as conversion;
import 'converter_screen.dart';
import 'open_page.dart';
import 'platform_files.dart';
import 'update_check.dart';
import 'update_fetch.dart';
import 'welcome_screen.dart';
import 'words.dart';

/// The main screen, with what goes around it: the guide on first launch, and a note when a newer
/// version is out.
class AppHome extends StatefulWidget {
  const AppHome({
    super.key,
    required this.settings,
    this.screen,
    this.convert = conversion.convert,
    this.fetch = fetchVersionFile,
    this.open = openPage,
    this.updateWay,
    this.checkAfter = const Duration(seconds: 5),
  });

  final SettingsStore settings;

  /// The main screen, given the way to show the guide. Null builds the real one.
  final Widget Function(VoidCallback showGuide)? screen;
  final Converter convert;
  final VersionFetcher fetch;
  final Future<bool> Function(Uri address) open;

  /// Null asks the platform.
  final UpdateWay? updateWay;

  /// Checking waits a moment, so starting up isn't slowed and a quick conversion isn't kept waiting.
  final Duration checkAfter;

  @override
  State<AppHome> createState() => _AppHomeState();
}

class _AppHomeState extends State<AppHome> {
  Timer? _checking;

  @override
  void initState() {
    super.initState();
    if (!widget.settings.value.welcomed) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _showGuide());
    }
    if ((widget.updateWay ?? updateWayHere) == UpdateWay.check) {
      _checking = Timer(widget.checkAfter, _check);
    }
  }

  @override
  void dispose() {
    _checking?.cancel();
    super.dispose();
  }

  void _showGuide() {
    if (!mounted) return;
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        fullscreenDialog: true,
        builder: (context) => WelcomeScreen(
          settings: widget.settings,
          convert: widget.convert,
          onDone: () => Navigator.of(context).pop(),
        ),
      ),
    );
  }

  Future<void> _check() async {
    final info = await checkForUpdate(widget.settings, fetch: widget.fetch);
    if (info == null || !mounted) return;
    final messenger = ScaffoldMessenger.of(context);
    final words = context.words;
    messenger.showMaterialBanner(
      MaterialBanner(
        leading: const Icon(Icons.system_update_alt),
        content: Text(words.updateReady(info.version)),
        actions: [
          TextButton(
            onPressed: messenger.hideCurrentMaterialBanner,
            child: Text(words.updateLater),
          ),
          FilledButton(
            onPressed: () async {
              messenger.hideCurrentMaterialBanner();
              final address = info.addressFor(updatePlatformName);
              if (!await widget.open(address)) {
                messenger.showSnackBar(
                  SnackBar(content: Text(words.pageFailed(address.toString()))),
                );
              }
            },
            child: Text(words.updateGet),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screen = widget.screen;
    if (screen != null) return screen(_showGuide);
    return ConverterScreen(
      pickFiles: pickFilesFromDevice,
      saveFile: saveFileToDevice,
      showGuide: _showGuide,
    );
  }
}
