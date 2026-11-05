import 'dart:convert';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

final now = DateTime.utc(2026, 11, 5, 12);

HistoryItem add(HistoryLog log, String name, {DateTime? at, String? path}) {
  return log.add(
    finishedAt: at ?? now,
    actionLabel: 'JPG',
    name: name,
    path: path,
    bytesBefore: 1000,
    bytesAfter: 400,
  );
}

void main() {
  test('newest first, each with its own number', () {
    final log = HistoryLog();
    final first = add(log, 'a.jpg');
    final second = add(log, 'b.jpg');
    expect(log.items.map((item) => item.name), ['b.jpg', 'a.jpg']);
    expect(second.id, isNot(first.id));
  });

  test('numbers aren\'t reused after clearing the newest away is reloaded', () {
    final log = HistoryLog();
    add(log, 'a.jpg');
    final again = HistoryLog.decode(log.encode());
    expect(add(again, 'b.jpg').id, 2);
  });

  test('everything survives being saved and read back', () {
    final log = HistoryLog();
    final item = add(log, 'पोर्ट्रेट (converted).jpg', path: '/x/पोर्ट्रेट (converted).jpg');
    log.markUndone(item.id, now.add(const Duration(minutes: 1)));
    final back = HistoryLog.decode(log.encode()).items.single;
    expect(back.name, 'पोर्ट्रेट (converted).jpg');
    expect(back.path, '/x/पोर्ट्रेट (converted).jpg');
    expect(back.bytesBefore, 1000);
    expect(back.bytesAfter, 400);
    expect(back.actionLabel, 'JPG');
    expect(back.finishedAt, now);
    expect(back.undoneAt, now.add(const Duration(minutes: 1)));
  });

  test('a result with no path or earlier size is fine', () {
    final log = HistoryLog();
    log.add(finishedAt: now, actionLabel: 'ZIP', name: 'a.zip', bytesAfter: 5);
    final back = HistoryLog.decode(log.encode()).items.single;
    expect(back.path, isNull);
    expect(back.bytesBefore, isNull);
  });

  group('undoing', () {
    test('only once, so nothing moves a file twice', () {
      final log = HistoryLog();
      final item = add(log, 'a.jpg');
      expect(log.markUndone(item.id, now), isTrue);
      expect(log.markUndone(item.id, now), isFalse);
    });

    test('something not there can\'t be undone', () {
      expect(HistoryLog().markUndone(99, now), isFalse);
    });

    test('it leaves the others alone', () {
      final log = HistoryLog();
      final a = add(log, 'a.jpg');
      final b = add(log, 'b.jpg');
      log.markUndone(a.id, now);
      expect(log.find(b.id)!.undoneAt, isNull);
      expect(log.find(a.id)!.undoneAt, now);
    });
  });

  group('how long it keeps things', () {
    test('30 days, then gone', () {
      final log = HistoryLog();
      add(log, 'old.jpg', at: now.subtract(const Duration(days: 31)));
      add(log, 'recent.jpg', at: now.subtract(const Duration(days: 29)));
      expect(log.prune(now), 1);
      expect(log.items.single.name, 'recent.jpg');
    });

    test('it can\'t grow without end, and keeps the newest', () {
      final log = HistoryLog();
      for (var i = 0; i < historyMostItems + 5; i++) {
        add(log, '$i.jpg');
      }
      expect(log.items, hasLength(historyMostItems));
      expect(log.items.first.name, '${historyMostItems + 4}.jpg');
    });

    test('clearing forgets everything', () {
      final log = HistoryLog();
      add(log, 'a.jpg');
      log.clear();
      expect(log.items, isEmpty);
    });
  });

  group('damaged history can\'t stop anything', () {
    test('nothing there yet', () {
      expect(HistoryLog.decode(null).items, isEmpty);
      expect(HistoryLog.decode('').items, isEmpty);
    });

    test('rubbish starts afresh', () {
      expect(HistoryLog.decode('not json {').items, isEmpty);
      expect(HistoryLog.decode('{"a":1}').items, isEmpty);
      expect(HistoryLog.decode('42').items, isEmpty);
    });

    test('one bad line loses only itself', () {
      final log = HistoryLog();
      add(log, 'good.jpg');
      final json = jsonDecode(log.encode()) as List;
      final text = jsonEncode([
        ...json,
        {'id': 'x'},
        7,
        null,
      ]);
      expect(HistoryLog.decode(text).items.single.name, 'good.jpg');
    });
  });

  test('no file\'s contents are ever kept, only facts', () {
    final log = HistoryLog();
    add(log, 'a.jpg', path: '/x/a.jpg');
    final fields = (jsonDecode(log.encode()) as List).single as Map<String, dynamic>;
    expect(fields.keys.toSet(), {'id', 'at', 'action', 'name', 'path', 'before', 'after'});
  });
}
