import 'package:flutter/foundation.dart';
import 'package:radial_core/radial_core.dart';

class _Request {
  const _Request(this.actionId, this.files);

  final String actionId;
  final List<PortableFile> files;
}

Future<List<PortableFile>> _run(_Request request) {
  return runPortable(actionById(request.actionId)!, request.files);
}

/// Converts in a background isolate, so the app stays responsive. Isolates report no progress
/// through `compute`, so [onProgress] is not called here.
Future<List<PortableFile>> convert(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
) {
  return compute(_run, _Request(action.id, files));
}
