import 'dart:io';

import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

Future<File> _file() async {
  return File(p.join((await getApplicationSupportDirectory()).path, 'history.json'));
}

/// The saved history, or null if there's none.
Future<String?> readHistoryText() async {
  final file = await _file();
  return file.existsSync() ? file.readAsString() : null;
}

/// Replaces the saved history. It appears whole or not at all, so a crash can't leave half a list.
Future<void> writeHistoryText(String text) async {
  final file = await _file();
  await file.parent.create(recursive: true);
  final part = File('${file.path}.part');
  await part.writeAsString(text, flush: true);
  await part.rename(file.path);
}
