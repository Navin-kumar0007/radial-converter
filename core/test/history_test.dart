import 'dart:async';
import 'dart:io';

import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:radial_core/engines.dart';
import 'package:radial_core/history.dart';
import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

final now = DateTime.utc(2026, 11, 2, 12);

void main() {
  late HistoryDatabase database;

  setUp(() => database = HistoryDatabase(NativeDatabase.memory()));
  tearDown(() => database.close());

  Future<HistoryEntry> add(
    String output, {
    DateTime? at,
    List<String> inputs = const ['/in/a.png'],
  }) {
    return database.record(
      actionId: 'image-to-jpg',
      inputs: inputs,
      output: output,
      bytesBefore: 1000,
      bytesAfter: 400,
      finishedAt: at ?? now,
    );
  }

  group('record', () {
    test('keeps every field', () async {
      final saved = await add('/out/a.jpg', inputs: ['/in/फ़ोटो 📷.png', '/in/b.png']);
      final loaded = await database.entry(saved.id);
      expect(loaded?.actionId, 'image-to-jpg');
      expect(loaded?.inputs, ['/in/फ़ोटो 📷.png', '/in/b.png']);
      expect(loaded?.output, '/out/a.jpg');
      expect(loaded?.bytesBefore, 1000);
      expect(loaded?.bytesAfter, 400);
      expect(loaded?.finishedAt.isAtSameMomentAs(now), isTrue);
      expect(loaded?.undoneAt, isNull);
    });

    test('files over 4 GB fit', () async {
      final saved = await database.record(
        actionId: 'video-compress',
        inputs: const ['/in/big.mov'],
        output: '/out/big.mov',
        bytesBefore: 50 * 1024 * 1024 * 1024,
        bytesAfter: 5 * 1024 * 1024 * 1024,
        finishedAt: now,
      );
      expect((await database.entry(saved.id))?.bytesBefore, 50 * 1024 * 1024 * 1024);
    });

    test('a quote in a path is only text', () async {
      const odd = "/out/'; DROP TABLE history_entries; --.jpg";
      await add(odd);
      expect((await database.recent()).single.output, odd);
    });
  });

  group('recent', () {
    test('newest first', () async {
      await add('/out/old.jpg', at: now.subtract(const Duration(hours: 1)));
      await add('/out/new.jpg');
      final outputs = (await database.recent()).map((entry) => entry.output);
      expect(outputs, ['/out/new.jpg', '/out/old.jpg']);
    });

    test('jobs in the same second keep their order', () async {
      await add('/out/first.jpg');
      await add('/out/second.jpg');
      expect((await database.recent()).first.output, '/out/second.jpg');
    });

    test('respects the limit', () async {
      for (var i = 0; i < 5; i++) {
        await add('/out/$i.jpg');
      }
      expect(await database.recent(limit: 2), hasLength(2));
    });

    test('a missing entry is null', () async {
      expect(await database.entry(999), isNull);
    });
  });

  test('watchRecent fires when history changes', () async {
    final updates = StreamIterator(database.watchRecent());
    expect(await updates.moveNext(), isTrue);
    expect(updates.current, isEmpty);
    await add('/out/a.jpg');
    expect(await updates.moveNext(), isTrue);
    expect(updates.current, hasLength(1));
    await updates.cancel();
  });

  group('undo', () {
    test('marks once', () async {
      final saved = await add('/out/a.jpg');
      expect(await database.markUndone(saved.id, now), isTrue);
      expect((await database.entry(saved.id))?.undoneAt?.isAtSameMomentAs(now), isTrue);
    });

    test('a second undo is refused, so a file is not moved twice', () async {
      final saved = await add('/out/a.jpg');
      await database.markUndone(saved.id, now);
      final later = now.add(const Duration(hours: 1));
      expect(await database.markUndone(saved.id, later), isFalse);
      expect((await database.entry(saved.id))?.undoneAt?.isAtSameMomentAs(now), isTrue);
    });

    test('undoing a missing entry is refused', () async {
      expect(await database.markUndone(999, now), isFalse);
    });
  });

  group('retention', () {
    test('forgets jobs older than 30 days and keeps the rest', () async {
      await add('/out/old.jpg', at: now.subtract(const Duration(days: 31)));
      await add('/out/edge.jpg', at: now.subtract(const Duration(days: 30)));
      await add('/out/new.jpg', at: now.subtract(const Duration(days: 1)));
      expect(await database.prune(now: now), 1);
      final outputs = (await database.recent()).map((entry) => entry.output);
      expect(outputs, ['/out/new.jpg', '/out/edge.jpg']);
    });

    test('a custom period', () async {
      await add('/out/a.jpg', at: now.subtract(const Duration(days: 8)));
      expect(await database.prune(now: now, keep: const Duration(days: 7)), 1);
    });

    test('clear forgets everything', () async {
      await add('/out/a.jpg');
      await add('/out/b.jpg');
      expect(await database.clear(), 2);
      expect(await database.recent(), isEmpty);
    });
  });

  group('on disk', () {
    late Directory folder;

    setUp(() => folder = Directory.systemTemp.createTempSync('radial_history_'));
    tearDown(() => folder.deleteSync(recursive: true));

    test('survives closing and reopening', () async {
      final file = File(p.join(folder.path, 'हिस्ट्री history.sqlite'));
      final first = openHistoryFile(file);
      await first.record(
        actionId: 'image-to-png',
        inputs: const ['/in/a.jpg'],
        output: '/out/a.png',
        bytesBefore: 1,
        bytesAfter: 2,
        finishedAt: now,
      );
      await first.close();

      final second = openHistoryFile(file);
      expect((await second.recent()).single.output, '/out/a.png');
      await second.close();
    });

    test('clearing and pruning never touch the files themselves', () async {
      final output = File(p.join(folder.path, 'a (converted).png'))..writeAsStringSync('kept');
      await add(output.path, at: now.subtract(const Duration(days: 90)));
      await database.prune(now: now);
      await add(output.path);
      await database.clear();
      expect(output.readAsStringSync(), 'kept');
    });

    group('recordFinishedJob', () {
      File make(String name, int bytes) {
        return File(p.join(folder.path, name))..writeAsBytesSync(List.filled(bytes, 1));
      }

      test('a batch logs one entry per file', () async {
        final a = make('a.png', 100);
        final b = make('b.png', 200);
        final aOut = make('a (converted).jpg', 10);
        final bOut = make('b (converted).jpg', 20);
        final entries = await recordFinishedJob(
          database,
          action: actionById('image-to-jpg')!,
          inputs: [a.path, b.path],
          outputs: [aOut.path, bOut.path],
          finishedAt: now,
        );
        expect(entries, hasLength(2));
        expect(entries[0].inputs, [a.path]);
        expect(entries[0].bytesBefore, 100);
        expect(entries[0].bytesAfter, 10);
        expect(entries[1].inputs, [b.path]);
        expect(entries[1].bytesBefore, 200);
        expect(entries[1].bytesAfter, 20);
      });

      test('a merge compares its output with all its inputs', () async {
        final a = make('a.pdf', 100);
        final b = make('b.pdf', 200);
        final out = make('a (merged).pdf', 250);
        final entries = await recordFinishedJob(
          database,
          action: actionById('pdf-merge')!,
          inputs: [a.path, b.path],
          outputs: [out.path],
          finishedAt: now,
        );
        expect(entries.single.inputs, [a.path, b.path]);
        expect(entries.single.bytesBefore, 300);
        expect(entries.single.bytesAfter, 250);
      });

      test('a folder output counts everything inside it', () async {
        final input = make('doc.pdf', 500);
        final pages = Directory(p.join(folder.path, 'doc (split)'))..createSync();
        File(p.join(pages.path, 'page-1.pdf')).writeAsBytesSync(List.filled(100, 1));
        final nested = Directory(p.join(pages.path, 'more'))..createSync();
        File(p.join(nested.path, 'page-2.pdf')).writeAsBytesSync(List.filled(150, 1));
        final entries = await recordFinishedJob(
          database,
          action: actionById('pdf-split')!,
          inputs: [input.path],
          outputs: [pages.path],
          finishedAt: now,
        );
        expect(entries.single.bytesAfter, 250);
      });
    });

    test('sizeOnDisk of a missing path is zero', () async {
      expect(await sizeOnDisk(p.join(folder.path, 'nope')), 0);
    });
  });
}
