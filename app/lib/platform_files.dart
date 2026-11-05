import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'pick_options_native.dart' if (dart.library.js_interop) 'pick_options_web.dart';

/// Opens the system file dialog. Nothing is sent anywhere, and only the start of each file
/// is read for now.
Future<List<PickedFile>> pickFilesFromDevice() async {
  final picked = await FilePicker.pickFiles(webOptions: pickerWebOptions);
  return [
    for (final file in picked)
      PickedFile(
        name: file.name,
        size: await file.length() ?? 0,
        head: await readPickedHead(file),
        read: file.readAsBytes,
        webUrl: kIsWeb ? file.uri.toString() : null,
        path: kIsWeb ? null : file.path,
      ),
  ];
}

/// Opens the system save dialog, or downloads the file in a browser. Null if cancelled.
Future<SavedAs?> saveFileToDevice(PortableFile file) async {
  final detected = detectKind(file.bytes, fileName: file.name);
  final saved = await FilePicker.saveFile(
    fileName: file.name,
    bytes: file.bytes,
    mimeType: detected.mime,
  );
  // A browser just starts a download, with no dialog to cancel and nothing to return.
  if (kIsWeb) return const SavedAs();
  if (saved == null) return null;
  // A phone may give an address that isn't a path, and then nothing can follow the file later.
  return SavedAs(path: saved.scheme == 'file' ? saved.toFilePath() : null);
}
