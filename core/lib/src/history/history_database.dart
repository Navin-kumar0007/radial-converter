import 'dart:convert';

import 'package:drift/drift.dart';

part 'history_database.g.dart';

/// The plan keeps history for 30 days unless the user changes it.
const defaultHistoryRetention = Duration(days: 30);

class _PathListConverter extends TypeConverter<List<String>, String> {
  const _PathListConverter();

  @override
  List<String> fromSql(String fromDb) => (jsonDecode(fromDb) as List<dynamic>).cast<String>();

  @override
  String toSql(List<String> value) => jsonEncode(value);
}

/// One finished job. Merges have several inputs, so inputs are a list.
@DataClassName('HistoryEntry')
class HistoryEntries extends Table {
  IntColumn get id => integer().autoIncrement()();
  DateTimeColumn get finishedAt => dateTime()();
  TextColumn get actionId => text()();
  TextColumn get inputs => text().map(const _PathListConverter())();
  TextColumn get output => text()();
  IntColumn get bytesBefore => integer()();
  IntColumn get bytesAfter => integer()();

  /// When the user undid this job. Null while the output is still in place.
  DateTimeColumn get undoneAt => dateTime().nullable()();
}

/// The on-device log of finished jobs. It only stores facts about files: nothing here
/// moves or deletes a file, so clearing history never touches anyone's outputs.
@DriftDatabase(tables: [HistoryEntries])
class HistoryDatabase extends _$HistoryDatabase {
  HistoryDatabase(super.executor);

  @override
  int get schemaVersion => 1;

  Future<HistoryEntry> record({
    required String actionId,
    required List<String> inputs,
    required String output,
    required int bytesBefore,
    required int bytesAfter,
    required DateTime finishedAt,
  }) {
    return into(historyEntries).insertReturning(
      HistoryEntriesCompanion.insert(
        finishedAt: finishedAt,
        actionId: actionId,
        inputs: inputs,
        output: output,
        bytesBefore: bytesBefore,
        bytesAfter: bytesAfter,
      ),
    );
  }

  SimpleSelectStatement<$HistoryEntriesTable, HistoryEntry> _newestFirst(int limit) {
    return select(historyEntries)
      ..orderBy([
        (entry) => OrderingTerm.desc(entry.finishedAt),
        (entry) => OrderingTerm.desc(entry.id),
      ])
      ..limit(limit);
  }

  /// The newest jobs first.
  Future<List<HistoryEntry>> recent({int limit = 200}) => _newestFirst(limit).get();

  /// Like [recent], and fires again whenever history changes.
  Stream<List<HistoryEntry>> watchRecent({int limit = 200}) => _newestFirst(limit).watch();

  Future<HistoryEntry?> entry(int id) {
    return (select(historyEntries)..where((entry) => entry.id.equals(id))).getSingleOrNull();
  }

  /// Marks a job undone. Returns false if it was not found or was already undone, so
  /// the caller knows not to move a file a second time.
  Future<bool> markUndone(int id, DateTime at) async {
    final query = update(historyEntries)
      ..where((entry) => entry.id.equals(id) & entry.undoneAt.isNull());
    final changed = await query.write(HistoryEntriesCompanion(undoneAt: Value(at)));
    return changed == 1;
  }

  /// Forgets jobs older than [keep]. Returns how many were removed.
  Future<int> prune({required DateTime now, Duration keep = defaultHistoryRetention}) {
    final cutoff = now.subtract(keep);
    final query = delete(historyEntries)
      ..where((entry) => entry.finishedAt.isSmallerThanValue(cutoff));
    return query.go();
  }

  /// Forgets everything. Returns how many were removed.
  Future<int> clear() => delete(historyEntries).go();
}
