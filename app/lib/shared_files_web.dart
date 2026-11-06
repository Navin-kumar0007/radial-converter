import 'shared_files.dart';

/// Browsers aren't offered files by other apps.
Stream<SharedFiles> listenForSharedFiles() => const Stream.empty();
