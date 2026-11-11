import 'dart:convert';

import 'package:flutter/widgets.dart';

/// What the user has chosen, kept between launches. Anything missing or damaged reads as the
/// default, so a bad file never stops the app.
@immutable
class AppSettings {
  const AppSettings({
    this.welcomed = false,
    this.checkForUpdates = true,
    this.language,
    this.lastUpdateCheck,
  });

  /// Whether the first-launch guide has been seen, or skipped.
  final bool welcomed;

  /// Whether a copy downloaded from the website asks once a day if there's a newer version. The only
  /// thing the app ever fetches, and it can be turned off.
  final bool checkForUpdates;

  /// `en` or `hi`, or null to follow the device.
  final String? language;
  final DateTime? lastUpdateCheck;

  AppSettings copyWith({
    bool? welcomed,
    bool? checkForUpdates,
    String? Function()? language,
    DateTime? lastUpdateCheck,
  }) {
    return AppSettings(
      welcomed: welcomed ?? this.welcomed,
      checkForUpdates: checkForUpdates ?? this.checkForUpdates,
      language: language == null ? this.language : language(),
      lastUpdateCheck: lastUpdateCheck ?? this.lastUpdateCheck,
    );
  }

  static const languages = {'en', 'hi'};

  static AppSettings decode(String? text) {
    if (text == null) return const AppSettings();
    final Object? json;
    try {
      json = jsonDecode(text);
    } on FormatException {
      return const AppSettings();
    }
    if (json is! Map) return const AppSettings();
    final language = json['language'];
    final checked = json['lastUpdateCheck'];
    return AppSettings(
      welcomed: json['welcomed'] == true,
      checkForUpdates: json['checkForUpdates'] != false,
      language: language is String && languages.contains(language) ? language : null,
      lastUpdateCheck: checked is String ? DateTime.tryParse(checked) : null,
    );
  }

  String encode() => jsonEncode({
    'welcomed': welcomed,
    'checkForUpdates': checkForUpdates,
    'language': ?language,
    if (lastUpdateCheck != null) 'lastUpdateCheck': lastUpdateCheck!.toUtc().toIso8601String(),
  });

  Locale? get locale => language == null ? null : Locale(language!);
}

/// The settings, saved whenever they change. Failing to save never gets in the way.
class SettingsStore extends ValueNotifier<AppSettings> {
  SettingsStore(super.value, {required this.write});

  final Future<void> Function(String text) write;

  static Future<SettingsStore> load({
    required Future<String?> Function() read,
    required Future<void> Function(String text) write,
  }) async {
    AppSettings settings;
    try {
      settings = AppSettings.decode(await read());
    } catch (error) {
      debugPrint('Could not read settings: $error');
      settings = const AppSettings();
    }
    return SettingsStore(settings, write: write);
  }

  Future<void> change(AppSettings Function(AppSettings settings) how) async {
    value = how(value);
    try {
      await write(value.encode());
    } catch (error) {
      debugPrint('Could not write settings: $error');
    }
  }
}

/// Hands the settings to every screen below it.
class SettingsScope extends InheritedNotifier<SettingsStore> {
  const SettingsScope({super.key, required SettingsStore store, required super.child})
    : super(notifier: store);

  /// Null where there are none, as in tests of a single screen.
  static SettingsStore? maybeOf(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<SettingsScope>()?.notifier;
  }
}
