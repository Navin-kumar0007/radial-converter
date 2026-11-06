import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:radial_core/radial_core.dart';
import 'package:radialconverter/words.dart';

Map<String, dynamic> _arb(String language) =>
    jsonDecode(File('lib/l10n/app_$language.arb').readAsStringSync()) as Map<String, dynamic>;

Set<String> _placeholders(String message) => {
  for (final match in RegExp(r'\{(\w+)[,}]').allMatches(message)) match.group(1)!,
};

void main() {
  final english = _arb('en');
  final hindi = _arb('hi');
  Iterable<String> keys(Map<String, dynamic> arb) => arb.keys.where((key) => !key.startsWith('@'));

  test('Hindi says everything English does, with the same blanks to fill', () {
    expect(keys(hindi).toSet(), keys(english).toSet());
    for (final key in keys(english)) {
      expect(
        _placeholders(hindi[key] as String),
        _placeholders(english[key] as String),
        reason: key,
      );
    }
  });

  test('both have twelve months', () {
    for (final arb in [english, hindi]) {
      expect((arb['months'] as String).split(','), hasLength(12));
    }
  });

  test('every action with words in its label has them translated', () {
    final words = wordsFor(const Locale('hi'));
    // Format names, and names of other products, are the same in every language.
    bool isAName(String label) =>
        RegExp(r'^[A-Z0-9.]+$').hasMatch(label) ||
        const {'WhatsApp', 'Instagram', 'Markdown', 'Opus', 'WebP', 'WebM', '7z'}.contains(label);
    for (final action in actionCatalogue) {
      if (isAName(action.label)) continue;
      expect(actionLabel(words, action.label), isNot(action.label), reason: action.label);
    }
  });

  test('a size limit keeps its number', () {
    expect(actionLabel(wordsFor(const Locale('hi')), 'Under 100 KB'), '100 KB से कम');
    expect(actionLabel(wordsFor(const Locale('en')), 'Under 100 KB'), 'Under 100 KB');
  });

  test('a language with no translation gets English', () {
    expect(wordsFor(const Locale('fr')).chooseFiles, 'Choose files');
  });
}
