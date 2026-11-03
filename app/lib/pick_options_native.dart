import 'package:file_picker/file_picker.dart';
import 'package:radial_core/radial_core.dart';

/// Native platforms read picked files on demand already.
const WebOptions pickerWebOptions = WebOptions();

/// The start of a chosen file.
Future<List<int>> readPickedHead(PlatformFile file) async {
  final head = <int>[];
  await for (final chunk in file.readAsByteStream()) {
    head.addAll(chunk);
    if (head.length >= detectHeadBytes) break;
  }
  return head.length <= detectHeadBytes ? head : head.sublist(0, detectHeadBytes);
}
