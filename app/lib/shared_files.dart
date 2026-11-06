import 'picked_file.dart';

export 'shared_files_native.dart' if (dart.library.js_interop) 'shared_files_web.dart';

/// News of files shared from another app: first that they are coming, as copying a large one takes
/// a while, and then the files themselves.
class SharedFiles {
  const SharedFiles.receiving() : receiving = true, files = const [], failed = 0;
  const SharedFiles.arrived(this.files, {this.failed = 0}) : receiving = false;

  final bool receiving;
  final List<PickedFile> files;

  /// How many shared items could not be opened.
  final int failed;
}
