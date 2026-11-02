import 'package:file_picker/file_picker.dart';
import 'package:file_picker_web/file_picker_web.dart';

/// By default the web picker reads every chosen file into memory, up to 2 GB, before anything
/// knows whether it can be used. Files here are read only when needed.
// ignore: deprecated_member_use
const WebOptions pickerWebOptions = FilePickerWebOptions(withData: false);
