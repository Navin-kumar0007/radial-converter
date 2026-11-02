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
        head: await _readHead(file),
        read: file.readAsBytes,
        webUrl: kIsWeb ? file.uri.toString() : null,
        path: kIsWeb ? null : file.path,
      ),
  ];
}

Future<List<int>> _readHead(PlatformFile file) async {
  final head = <int>[];
  await for (final chunk in file.readAsByteStream()) {
    head.addAll(chunk);
    if (head.length >= detectHeadBytes) break;
  }
  return head.length <= detectHeadBytes ? head : head.sublist(0, detectHeadBytes);
}

/// Opens the system save dialog, or downloads the file in a browser. False if cancelled.
Future<bool> saveFileToDevice(PortableFile file) async {
  final detected = detectKind(file.bytes, fileName: file.name);
  final saved = await FilePicker.saveFile(
    fileName: file.name,
    bytes: file.bytes,
    mimeType: detected.mime,
  );
  // A browser just starts a download, with no dialog to cancel and nothing to return.
  return saved != null || kIsWeb;
}
