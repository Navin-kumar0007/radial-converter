import 'package:file_picker/file_picker.dart';
import 'package:file_picker_web/file_picker_web.dart';

import 'blob_head.dart';

/// By default the web picker reads every chosen file into memory, up to 2 GB, before anything
/// knows whether it can be used. Files here are read only when needed.
// ignore: deprecated_member_use
const WebOptions pickerWebOptions = FilePickerWebOptions(withData: false);

/// The start of a chosen file. The picker's own stream reads all of it first, and fails if it is very
/// large.
Future<List<int>> readPickedHead(PlatformFile file) => readBlobHead(file.uri.toString());
