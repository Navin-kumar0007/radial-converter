import 'package:web/web.dart' as web;

const _key = 'radial_history';

/// The saved history, or null if there's none. A private window may refuse this.
Future<String?> readHistoryText() async => web.window.localStorage.getItem(_key);

/// Replaces the saved history.
Future<void> writeHistoryText(String text) async => web.window.localStorage.setItem(_key, text);
