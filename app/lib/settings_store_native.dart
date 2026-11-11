import 'dart:io';

import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

Future<File> _file() async {
  return File(p.join((await getApplicationSupportDirectory()).path, 'settings.json'));
}

/// The saved settings, or null if there are none.
Future<String?> readSettingsText() async {
  final file = await _file();
  return file.existsSync() ? file.readAsString() : null;
}

/// Replaces the saved settings, whole or not at all, as history is.
Future<void> writeSettingsText(String text) async {
  final file = await _file();
  await file.parent.create(recursive: true);
  final part = File('${file.path}.part');
  await part.writeAsString(text, flush: true);
  await part.rename(file.path);
}
