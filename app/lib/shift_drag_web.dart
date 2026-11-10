import 'package:radial_core/radial_core.dart';

/// A page can't watch drags outside itself.
void Function() listenForShiftDrag({
  required Future<List<RadialAction>> Function(List<String> paths) menuFor,
  required Future<String?> Function(RadialAction action, List<String> paths) sizeOf,
  required void Function(RadialAction action, List<String> paths) chosen,
}) {
  return () {};
}

/// Only a desktop has a folder to save beside.
Future<String> saveBesideOriginal(String originalPath, PortableFile file) {
  throw UnsupportedError('No folders in a browser');
}

/// Only a desktop has a window to bring forward from behind other apps.
void showAppWindow() {}

/// Whether the app opens when the user signs in. A page can't.
enum LoginItem { unsupported, off, on, needsApproval }

Future<LoginItem> loginItem() async => LoginItem.unsupported;

Future<LoginItem> setLoginItem(bool on) async => LoginItem.unsupported;
