import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';

/// Opens the system file dialog. Files are read into memory, so nothing is sent anywhere.
Future<List<PortableFile>> pickFilesFromDevice() async {
  final picked = await FilePicker.pickFiles();
  return [for (final file in picked) PortableFile(file.name, await file.readAsBytes())];
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
