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

  group('failures', failures);

  test('a language with no translation gets English', () {
    expect(wordsFor(const Locale('fr')).chooseFiles, 'Choose files');
  });
}

void failures() {
  final english = wordsFor(const Locale('en'));
  final hindi = wordsFor(const Locale('hi'));
  final catalogue = File('../core/lib/src/failures.dart').readAsStringSync();
  final keys = {
    for (final match in RegExp(r"(?:_say\(\s*|key: )'(\w+)'").allMatches(catalogue))
      match.group(1)!,
    'passwordNeeded',
  };
  const blanks = {
    'name': 'a.zip',
    'count': '3',
    'limit': '50',
    'action': 'Compress',
    'degrees': '45',
    'kb': '120',
    'width': '600',
    'height': '800',
    'size': '16',
    'page': '2',
    'format': 'opus',
  };

  test('there are failures to check', () => expect(keys.length, greaterThan(70)));

  test('every failure in core is said in Hindi', () {
    for (final key in keys) {
      final failure = EngineFailed('English', key: key, args: blanks);
      final said = failureText(hindi, failure);
      expect(said, isNot('English'), reason: key);
      expect(said, isNot(contains('{')), reason: key);
    }
  });

  test('the English says what core says', () {
    for (final failure in [
      Fail.cantRead('a.zip'),
      Fail.tooManyToSave('a.zip', 80, 50),
      Fail.pdfShrinksTo(300, 200),
      Fail.needsFiles('Merge', 2),
      Fail.tooLongToFit('16'),
      Fail.noSound,
      PasswordNeeded('a.pdf'),
      Fail.pagesTooFull(3, 'Under 100 KB'),
    ]) {
      expect(failureText(english, failure), failure.message, reason: failure.key);
    }
  });

  test('a page that is too full is one page, not "them"', () {
    expect(failureText(english, Fail.pagesTooFull(1, 'Email')), startsWith('This page has'));
  });

  test('an action named in a failure is translated too', () {
    expect(failureText(hindi, Fail.needsFiles('Merge', 2)), contains('"जोड़ें"'));
  });

  test('anything without a key stays as written', () {
    expect(failureText(hindi, const EngineFailed('Already said.')), 'Already said.');
    expect(failureText(hindi, const EngineFailed('Unknown.', key: 'nothing')), 'Unknown.');
  });
}
