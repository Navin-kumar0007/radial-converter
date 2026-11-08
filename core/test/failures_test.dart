import 'dart:io';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  test('every failure has its own key', () {
    final source = File('lib/src/failures.dart').readAsStringSync();
    final keys = [
      for (final match in RegExp(r"(?:_say\(\s*|key: )'(\w+)'").allMatches(source)) match.group(1)!,
    ];
    expect(keys.length, greaterThan(70));
    expect(keys.toSet(), hasLength(keys.length));
  });

  test('a failure names its blanks, and says them in English', () {
    final failure = Fail.tooManyToSave('a.zip', 80, 50);
    expect(failure.key, 'tooManyToSave');
    expect(failure.args, {'name': 'a.zip', 'count': '80', 'limit': '50'});
    expect(failure.message, 'a.zip has 80 files, too many to save one at a time. The limit is 50.');
  });

  test('what an engine said is added without losing which failure it is', () {
    final failure = Fail.cantRead('a.mov').withDetails('moov atom not found');
    expect(failure.key, 'cantRead');
    expect(failure.args, {'name': 'a.mov'});
    expect(failure.details, 'moov atom not found');
  });

  test('a locked file says which', () {
    expect(PasswordNeeded('a.pdf').key, 'passwordNeeded');
    expect(PasswordNeeded('a.pdf').args, {'name': 'a.pdf'});
  });
}
