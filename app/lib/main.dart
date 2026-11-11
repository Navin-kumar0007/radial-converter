import 'package:flutter/material.dart';

import 'about.dart';
import 'app_home.dart';
import 'app_settings.dart';
import 'settings_store.dart';
import 'shift_drag.dart';
import 'words.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  registerBundledLicenses();
  // A small file, read before the first frame so the guide and language are right from the start.
  final settings = await SettingsStore.load(read: readSettingsText, write: writeSettingsText);
  runApp(RadialApp(settings: settings));
}

class RadialApp extends StatefulWidget {
  const RadialApp({super.key, required this.settings});

  final SettingsStore settings;

  @override
  State<RadialApp> createState() => _RadialAppState();
}

class _RadialAppState extends State<RadialApp> {
  String? _language;

  @override
  void initState() {
    super.initState();
    _language = widget.settings.value.language;
    chosenLocale = widget.settings.value.locale;
    widget.settings.addListener(_changed);
  }

  @override
  void dispose() {
    widget.settings.removeListener(_changed);
    super.dispose();
  }

  void _changed() {
    final language = widget.settings.value.language;
    if (language == _language) return;
    chosenLocale = widget.settings.value.locale;
    // The Shift-drag menu draws its own words, so it's told too.
    sendNativeWords();
    setState(() => _language = language);
  }

  @override
  Widget build(BuildContext context) {
    const accent = Color(0xFF0B6E5F);
    return SettingsScope(
      store: widget.settings,
      child: MaterialApp(
        title: 'ShiftDrop',
        debugShowCheckedModeBanner: false,
        localizationsDelegates: Words.localizationsDelegates,
        supportedLocales: Words.supportedLocales,
        locale: widget.settings.value.locale,
        theme: _theme(accent, Brightness.light),
        darkTheme: _theme(accent, Brightness.dark),
        home: AppHome(settings: widget.settings),
      ),
    );
  }

  /// Hindi file names and labels need a font we ship: in a browser, Flutter would otherwise
  /// fetch a missing font from Google, and nothing here may touch the network.
  ThemeData _theme(Color accent, Brightness brightness) {
    final base = ThemeData(colorSchemeSeed: accent, brightness: brightness);
    return base.copyWith(
      textTheme: base.textTheme.apply(fontFamilyFallback: const ['NotoSansDevanagari']),
    );
  }
}
