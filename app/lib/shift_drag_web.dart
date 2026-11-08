import 'package:radial_core/radial_core.dart';

/// A page can't watch drags outside itself.
void Function() listenForShiftDrag({
  required Future<List<RadialAction>> Function(List<String> paths) menuFor,
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
