import 'package:web/web.dart' as web;

const _key = 'radial_settings';

/// The saved settings, or null if there are none. A private window may refuse this.
Future<String?> readSettingsText() async => web.window.localStorage.getItem(_key);

Future<void> writeSettingsText(String text) async => web.window.localStorage.setItem(_key, text);
