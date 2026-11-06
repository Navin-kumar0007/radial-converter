// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'history_database.dart';

// ignore_for_file: type=lint
class $HistoryEntriesTable extends HistoryEntries
    with TableInfo<$HistoryEntriesTable, HistoryEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $HistoryEntriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'),
  );
  static const VerificationMeta _finishedAtMeta = const VerificationMeta('finishedAt');
  @override
  late final GeneratedColumn<DateTime> finishedAt = GeneratedColumn<DateTime>(
    'finished_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _actionIdMeta = const VerificationMeta('actionId');
  @override
  late final GeneratedColumn<String> actionId = GeneratedColumn<String>(
    'action_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  late final GeneratedColumnWithTypeConverter<List<String>, String> inputs =
      GeneratedColumn<String>(
        'inputs',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      ).withConverter<List<String>>($HistoryEntriesTable.$converterinputs);
  static const VerificationMeta _outputMeta = const VerificationMeta('output');
  @override
  late final GeneratedColumn<String> output = GeneratedColumn<String>(
    'output',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _bytesBeforeMeta = const VerificationMeta('bytesBefore');
  @override
  late final GeneratedColumn<int> bytesBefore = GeneratedColumn<int>(
    'bytes_before',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _bytesAfterMeta = const VerificationMeta('bytesAfter');
  @override
  late final GeneratedColumn<int> bytesAfter = GeneratedColumn<int>(
    'bytes_after',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _undoneAtMeta = const VerificationMeta('undoneAt');
  @override
  late final GeneratedColumn<DateTime> undoneAt = GeneratedColumn<DateTime>(
    'undone_at',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    finishedAt,
    actionId,
    inputs,
    output,
    bytesBefore,
    bytesAfter,
    undoneAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'history_entries';
  @override
  VerificationContext validateIntegrity(
    Insertable<HistoryEntry> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('finished_at')) {
      context.handle(
        _finishedAtMeta,
        finishedAt.isAcceptableOrUnknown(data['finished_at']!, _finishedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_finishedAtMeta);
    }
    if (data.containsKey('action_id')) {
      context.handle(
        _actionIdMeta,
        actionId.isAcceptableOrUnknown(data['action_id']!, _actionIdMeta),
      );
    } else if (isInserting) {
      context.missing(_actionIdMeta);
    }
    if (data.containsKey('output')) {
      context.handle(_outputMeta, output.isAcceptableOrUnknown(data['output']!, _outputMeta));
    } else if (isInserting) {
      context.missing(_outputMeta);
    }
    if (data.containsKey('bytes_before')) {
      context.handle(
        _bytesBeforeMeta,
        bytesBefore.isAcceptableOrUnknown(data['bytes_before']!, _bytesBeforeMeta),
      );
    } else if (isInserting) {
      context.missing(_bytesBeforeMeta);
    }
    if (data.containsKey('bytes_after')) {
      context.handle(
        _bytesAfterMeta,
        bytesAfter.isAcceptableOrUnknown(data['bytes_after']!, _bytesAfterMeta),
      );
    } else if (isInserting) {
      context.missing(_bytesAfterMeta);
    }
    if (data.containsKey('undone_at')) {
      context.handle(
        _undoneAtMeta,
        undoneAt.isAcceptableOrUnknown(data['undone_at']!, _undoneAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  HistoryEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return HistoryEntry(
      id: attachedDatabase.typeMapping.read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      finishedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}finished_at'],
      )!,
      actionId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}action_id'],
      )!,
      inputs: $HistoryEntriesTable.$converterinputs.fromSql(
        attachedDatabase.typeMapping.read(DriftSqlType.string, data['${effectivePrefix}inputs'])!,
      ),
      output: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}output'],
      )!,
      bytesBefore: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}bytes_before'],
      )!,
      bytesAfter: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}bytes_after'],
      )!,
      undoneAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}undone_at'],
      ),
    );
  }

  @override
  $HistoryEntriesTable createAlias(String alias) {
    return $HistoryEntriesTable(attachedDatabase, alias);
  }

  static TypeConverter<List<String>, String> $converterinputs = const _PathListConverter();
}

class HistoryEntry extends DataClass implements Insertable<HistoryEntry> {
  final int id;
  final DateTime finishedAt;
  final String actionId;
  final List<String> inputs;
  final String output;
  final int bytesBefore;
  final int bytesAfter;

  /// When the user undid this job. Null while the output is still in place.
  final DateTime? undoneAt;
  const HistoryEntry({
    required this.id,
    required this.finishedAt,
    required this.actionId,
    required this.inputs,
    required this.output,
    required this.bytesBefore,
    required this.bytesAfter,
    this.undoneAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['finished_at'] = Variable<DateTime>(finishedAt);
    map['action_id'] = Variable<String>(actionId);
    {
      map['inputs'] = Variable<String>($HistoryEntriesTable.$converterinputs.toSql(inputs));
    }
    map['output'] = Variable<String>(output);
    map['bytes_before'] = Variable<int>(bytesBefore);
    map['bytes_after'] = Variable<int>(bytesAfter);
    if (!nullToAbsent || undoneAt != null) {
      map['undone_at'] = Variable<DateTime>(undoneAt);
    }
    return map;
  }

  HistoryEntriesCompanion toCompanion(bool nullToAbsent) {
    return HistoryEntriesCompanion(
      id: Value(id),
      finishedAt: Value(finishedAt),
      actionId: Value(actionId),
      inputs: Value(inputs),
      output: Value(output),
      bytesBefore: Value(bytesBefore),
      bytesAfter: Value(bytesAfter),
      undoneAt: undoneAt == null && nullToAbsent ? const Value.absent() : Value(undoneAt),
    );
  }

  factory HistoryEntry.fromJson(Map<String, dynamic> json, {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return HistoryEntry(
      id: serializer.fromJson<int>(json['id']),
      finishedAt: serializer.fromJson<DateTime>(json['finishedAt']),
      actionId: serializer.fromJson<String>(json['actionId']),
      inputs: serializer.fromJson<List<String>>(json['inputs']),
      output: serializer.fromJson<String>(json['output']),
      bytesBefore: serializer.fromJson<int>(json['bytesBefore']),
      bytesAfter: serializer.fromJson<int>(json['bytesAfter']),
      undoneAt: serializer.fromJson<DateTime?>(json['undoneAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'finishedAt': serializer.toJson<DateTime>(finishedAt),
      'actionId': serializer.toJson<String>(actionId),
      'inputs': serializer.toJson<List<String>>(inputs),
      'output': serializer.toJson<String>(output),
      'bytesBefore': serializer.toJson<int>(bytesBefore),
      'bytesAfter': serializer.toJson<int>(bytesAfter),
      'undoneAt': serializer.toJson<DateTime?>(undoneAt),
    };
  }

  HistoryEntry copyWith({
    int? id,
    DateTime? finishedAt,
    String? actionId,
    List<String>? inputs,
    String? output,
    int? bytesBefore,
    int? bytesAfter,
    Value<DateTime?> undoneAt = const Value.absent(),
  }) => HistoryEntry(
    id: id ?? this.id,
    finishedAt: finishedAt ?? this.finishedAt,
    actionId: actionId ?? this.actionId,
    inputs: inputs ?? this.inputs,
    output: output ?? this.output,
    bytesBefore: bytesBefore ?? this.bytesBefore,
    bytesAfter: bytesAfter ?? this.bytesAfter,
    undoneAt: undoneAt.present ? undoneAt.value : this.undoneAt,
  );
  HistoryEntry copyWithCompanion(HistoryEntriesCompanion data) {
    return HistoryEntry(
      id: data.id.present ? data.id.value : this.id,
      finishedAt: data.finishedAt.present ? data.finishedAt.value : this.finishedAt,
      actionId: data.actionId.present ? data.actionId.value : this.actionId,
      inputs: data.inputs.present ? data.inputs.value : this.inputs,
      output: data.output.present ? data.output.value : this.output,
      bytesBefore: data.bytesBefore.present ? data.bytesBefore.value : this.bytesBefore,
      bytesAfter: data.bytesAfter.present ? data.bytesAfter.value : this.bytesAfter,
      undoneAt: data.undoneAt.present ? data.undoneAt.value : this.undoneAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('HistoryEntry(')
          ..write('id: $id, ')
          ..write('finishedAt: $finishedAt, ')
          ..write('actionId: $actionId, ')
          ..write('inputs: $inputs, ')
          ..write('output: $output, ')
          ..write('bytesBefore: $bytesBefore, ')
          ..write('bytesAfter: $bytesAfter, ')
          ..write('undoneAt: $undoneAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, finishedAt, actionId, inputs, output, bytesBefore, bytesAfter, undoneAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is HistoryEntry &&
          other.id == this.id &&
          other.finishedAt == this.finishedAt &&
          other.actionId == this.actionId &&
          other.inputs == this.inputs &&
          other.output == this.output &&
          other.bytesBefore == this.bytesBefore &&
          other.bytesAfter == this.bytesAfter &&
          other.undoneAt == this.undoneAt);
}

class HistoryEntriesCompanion extends UpdateCompanion<HistoryEntry> {
  final Value<int> id;
  final Value<DateTime> finishedAt;
  final Value<String> actionId;
  final Value<List<String>> inputs;
  final Value<String> output;
  final Value<int> bytesBefore;
  final Value<int> bytesAfter;
  final Value<DateTime?> undoneAt;
  const HistoryEntriesCompanion({
    this.id = const Value.absent(),
    this.finishedAt = const Value.absent(),
    this.actionId = const Value.absent(),
    this.inputs = const Value.absent(),
    this.output = const Value.absent(),
    this.bytesBefore = const Value.absent(),
    this.bytesAfter = const Value.absent(),
    this.undoneAt = const Value.absent(),
  });
  HistoryEntriesCompanion.insert({
    this.id = const Value.absent(),
    required DateTime finishedAt,
    required String actionId,
    required List<String> inputs,
    required String output,
    required int bytesBefore,
    required int bytesAfter,
    this.undoneAt = const Value.absent(),
  }) : finishedAt = Value(finishedAt),
       actionId = Value(actionId),
       inputs = Value(inputs),
       output = Value(output),
       bytesBefore = Value(bytesBefore),
       bytesAfter = Value(bytesAfter);
  static Insertable<HistoryEntry> custom({
    Expression<int>? id,
    Expression<DateTime>? finishedAt,
    Expression<String>? actionId,
    Expression<String>? inputs,
    Expression<String>? output,
    Expression<int>? bytesBefore,
    Expression<int>? bytesAfter,
    Expression<DateTime>? undoneAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (finishedAt != null) 'finished_at': finishedAt,
      if (actionId != null) 'action_id': actionId,
      if (inputs != null) 'inputs': inputs,
      if (output != null) 'output': output,
      if (bytesBefore != null) 'bytes_before': bytesBefore,
      if (bytesAfter != null) 'bytes_after': bytesAfter,
      if (undoneAt != null) 'undone_at': undoneAt,
    });
  }

  HistoryEntriesCompanion copyWith({
    Value<int>? id,
    Value<DateTime>? finishedAt,
    Value<String>? actionId,
    Value<List<String>>? inputs,
    Value<String>? output,
    Value<int>? bytesBefore,
    Value<int>? bytesAfter,
    Value<DateTime?>? undoneAt,
  }) {
    return HistoryEntriesCompanion(
      id: id ?? this.id,
      finishedAt: finishedAt ?? this.finishedAt,
      actionId: actionId ?? this.actionId,
      inputs: inputs ?? this.inputs,
      output: output ?? this.output,
      bytesBefore: bytesBefore ?? this.bytesBefore,
      bytesAfter: bytesAfter ?? this.bytesAfter,
      undoneAt: undoneAt ?? this.undoneAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (finishedAt.present) {
      map['finished_at'] = Variable<DateTime>(finishedAt.value);
    }
    if (actionId.present) {
      map['action_id'] = Variable<String>(actionId.value);
    }
    if (inputs.present) {
      map['inputs'] = Variable<String>($HistoryEntriesTable.$converterinputs.toSql(inputs.value));
    }
    if (output.present) {
      map['output'] = Variable<String>(output.value);
    }
    if (bytesBefore.present) {
      map['bytes_before'] = Variable<int>(bytesBefore.value);
    }
    if (bytesAfter.present) {
      map['bytes_after'] = Variable<int>(bytesAfter.value);
    }
    if (undoneAt.present) {
      map['undone_at'] = Variable<DateTime>(undoneAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('HistoryEntriesCompanion(')
          ..write('id: $id, ')
          ..write('finishedAt: $finishedAt, ')
          ..write('actionId: $actionId, ')
          ..write('inputs: $inputs, ')
          ..write('output: $output, ')
          ..write('bytesBefore: $bytesBefore, ')
          ..write('bytesAfter: $bytesAfter, ')
          ..write('undoneAt: $undoneAt')
          ..write(')'))
        .toString();
  }
}

abstract class _$HistoryDatabase extends GeneratedDatabase {
  _$HistoryDatabase(QueryExecutor e) : super(e);
  $HistoryDatabaseManager get managers => $HistoryDatabaseManager(this);
  late final $HistoryEntriesTable historyEntries = $HistoryEntriesTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [historyEntries];
}

typedef $$HistoryEntriesTableCreateCompanionBuilder =
    HistoryEntriesCompanion Function({
      Value<int> id,
      required DateTime finishedAt,
      required String actionId,
      required List<String> inputs,
      required String output,
      required int bytesBefore,
      required int bytesAfter,
      Value<DateTime?> undoneAt,
    });
typedef $$HistoryEntriesTableUpdateCompanionBuilder =
    HistoryEntriesCompanion Function({
      Value<int> id,
      Value<DateTime> finishedAt,
      Value<String> actionId,
      Value<List<String>> inputs,
      Value<String> output,
      Value<int> bytesBefore,
      Value<int> bytesAfter,
      Value<DateTime?> undoneAt,
    });

class $$HistoryEntriesTableFilterComposer
    extends Composer<_$HistoryDatabase, $HistoryEntriesTable> {
  $$HistoryEntriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get finishedAt =>
      $composableBuilder(column: $table.finishedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get actionId =>
      $composableBuilder(column: $table.actionId, builder: (column) => ColumnFilters(column));

  ColumnWithTypeConverterFilters<List<String>, List<String>, String> get inputs =>
      $composableBuilder(
        column: $table.inputs,
        builder: (column) => ColumnWithTypeConverterFilters(column),
      );

  ColumnFilters<String> get output =>
      $composableBuilder(column: $table.output, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get bytesBefore =>
      $composableBuilder(column: $table.bytesBefore, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get bytesAfter =>
      $composableBuilder(column: $table.bytesAfter, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get undoneAt =>
      $composableBuilder(column: $table.undoneAt, builder: (column) => ColumnFilters(column));
}

class $$HistoryEntriesTableOrderingComposer
    extends Composer<_$HistoryDatabase, $HistoryEntriesTable> {
  $$HistoryEntriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get finishedAt =>
      $composableBuilder(column: $table.finishedAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get actionId =>
      $composableBuilder(column: $table.actionId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get inputs =>
      $composableBuilder(column: $table.inputs, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get output =>
      $composableBuilder(column: $table.output, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get bytesBefore =>
      $composableBuilder(column: $table.bytesBefore, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get bytesAfter =>
      $composableBuilder(column: $table.bytesAfter, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get undoneAt =>
      $composableBuilder(column: $table.undoneAt, builder: (column) => ColumnOrderings(column));
}

class $$HistoryEntriesTableAnnotationComposer
    extends Composer<_$HistoryDatabase, $HistoryEntriesTable> {
  $$HistoryEntriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id => $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get finishedAt =>
      $composableBuilder(column: $table.finishedAt, builder: (column) => column);

  GeneratedColumn<String> get actionId =>
      $composableBuilder(column: $table.actionId, builder: (column) => column);

  GeneratedColumnWithTypeConverter<List<String>, String> get inputs =>
      $composableBuilder(column: $table.inputs, builder: (column) => column);

  GeneratedColumn<String> get output =>
      $composableBuilder(column: $table.output, builder: (column) => column);

  GeneratedColumn<int> get bytesBefore =>
      $composableBuilder(column: $table.bytesBefore, builder: (column) => column);

  GeneratedColumn<int> get bytesAfter =>
      $composableBuilder(column: $table.bytesAfter, builder: (column) => column);

  GeneratedColumn<DateTime> get undoneAt =>
      $composableBuilder(column: $table.undoneAt, builder: (column) => column);
}

class $$HistoryEntriesTableTableManager
    extends
        RootTableManager<
          _$HistoryDatabase,
          $HistoryEntriesTable,
          HistoryEntry,
          $$HistoryEntriesTableFilterComposer,
          $$HistoryEntriesTableOrderingComposer,
          $$HistoryEntriesTableAnnotationComposer,
          $$HistoryEntriesTableCreateCompanionBuilder,
          $$HistoryEntriesTableUpdateCompanionBuilder,
          (HistoryEntry, BaseReferences<_$HistoryDatabase, $HistoryEntriesTable, HistoryEntry>),
          HistoryEntry,
          PrefetchHooks Function()
        > {
  $$HistoryEntriesTableTableManager(_$HistoryDatabase db, $HistoryEntriesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$HistoryEntriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$HistoryEntriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$HistoryEntriesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<DateTime> finishedAt = const Value.absent(),
                Value<String> actionId = const Value.absent(),
                Value<List<String>> inputs = const Value.absent(),
                Value<String> output = const Value.absent(),
                Value<int> bytesBefore = const Value.absent(),
                Value<int> bytesAfter = const Value.absent(),
                Value<DateTime?> undoneAt = const Value.absent(),
              }) => HistoryEntriesCompanion(
                id: id,
                finishedAt: finishedAt,
                actionId: actionId,
                inputs: inputs,
                output: output,
                bytesBefore: bytesBefore,
                bytesAfter: bytesAfter,
                undoneAt: undoneAt,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required DateTime finishedAt,
                required String actionId,
                required List<String> inputs,
                required String output,
                required int bytesBefore,
                required int bytesAfter,
                Value<DateTime?> undoneAt = const Value.absent(),
              }) => HistoryEntriesCompanion.insert(
                id: id,
                finishedAt: finishedAt,
                actionId: actionId,
                inputs: inputs,
                output: output,
                bytesBefore: bytesBefore,
                bytesAfter: bytesAfter,
                undoneAt: undoneAt,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$HistoryEntriesTable, HistoryEntry>(table),
                  BaseReferences<_$HistoryDatabase, $HistoryEntriesTable, HistoryEntry>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$HistoryEntriesTableProcessedTableManager =
    ProcessedTableManager<
      _$HistoryDatabase,
      $HistoryEntriesTable,
      HistoryEntry,
      $$HistoryEntriesTableFilterComposer,
      $$HistoryEntriesTableOrderingComposer,
      $$HistoryEntriesTableAnnotationComposer,
      $$HistoryEntriesTableCreateCompanionBuilder,
      $$HistoryEntriesTableUpdateCompanionBuilder,
      (HistoryEntry, BaseReferences<_$HistoryDatabase, $HistoryEntriesTable, HistoryEntry>),
      HistoryEntry,
      PrefetchHooks Function()
    >;

class $HistoryDatabaseManager {
  final _$HistoryDatabase _db;
  $HistoryDatabaseManager(this._db);
  $$HistoryEntriesTableTableManager get historyEntries =>
      $$HistoryEntriesTableTableManager(_db, _db.historyEntries);
}
