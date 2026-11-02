import 'dart:io';

import 'package:drift/native.dart';

import '../actions.dart';
import 'history_database.dart';

/// Opens the history database in [file], creating it if needed.
HistoryDatabase openHistoryFile(File file) {
  return HistoryDatabase(NativeDatabase.createInBackground(file));
}

/// The size of a file, or of everything inside a folder. Missing paths count as zero.
Future<int> sizeOnDisk(String path) async {
  final type = await FileSystemEntity.type(path);
  if (type == FileSystemEntityType.file) return File(path).length();
  if (type != FileSystemEntityType.directory) return 0;
  var total = 0;
  await for (final entity in Directory(path).list(recursive: true, followLinks: false)) {
    if (entity is File) total += await entity.length();
  }
  return total;
}

/// Logs a finished job: one entry per output, as a batch produces one output per input.
///
/// Sizes are measured here, so call this straight after the job. A merge's single output is
/// compared with all its inputs together.
Future<List<HistoryEntry>> recordFinishedJob(
  HistoryDatabase database, {
  required RadialAction action,
  required List<String> inputs,
  required List<String> outputs,
  required DateTime finishedAt,
}) async {
  final entries = <HistoryEntry>[];
  final oneToOne = inputs.length == outputs.length;
  for (var i = 0; i < outputs.length; i++) {
    final sources = oneToOne ? [inputs[i]] : inputs;
    var before = 0;
    for (final source in sources) {
      before += await sizeOnDisk(source);
    }
    entries.add(
      await database.record(
        actionId: action.id,
        inputs: sources,
        output: outputs[i],
        bytesBefore: before,
        bytesAfter: await sizeOnDisk(outputs[i]),
        finishedAt: finishedAt,
      ),
    );
  }
  return entries;
}
