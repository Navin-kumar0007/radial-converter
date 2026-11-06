import 'dart:async';
import 'dart:io';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:flutter/services.dart';

import 'drop_files_native.dart';
import 'picked_file.dart';
import 'shared_files.dart';

/// `ShareReceiver.kt` on the other side.
const shareChannel = MethodChannel('radial/share');

/// Only Android shares files with apps this way so far.
Stream<SharedFiles> listenForSharedFiles() {
  if (!Platform.isAndroid) return const Stream.empty();
  return listenOnShareChannel();
}

/// Everything is copied to real files before it arrives here, so it reads like a dropped file.
Stream<SharedFiles> listenOnShareChannel() {
  late final StreamController<SharedFiles> events;
  events = StreamController<SharedFiles>(
    onListen: () {
      shareChannel.setMethodCallHandler((call) async {
        if (call.method == 'receiving') {
          events.add(const SharedFiles.receiving());
        } else if (call.method == 'shared') {
          final arguments = call.arguments as Map;
          final paths = (arguments['paths'] as List).cast<String>();
          var failed = arguments['failed'] as int;
          final files = <PickedFile>[];
          for (final path in paths) {
            try {
              files.addAll((await readDroppedFiles([DropItemFile(path)])).loose);
            } on FileSystemException {
              failed++;
            }
          }
          events.add(SharedFiles.arrived(files, failed: failed));
        }
      });
      shareChannel.invokeMethod<void>('listen');
    },
    onCancel: () => shareChannel.setMethodCallHandler(null),
  );
  return events.stream;
}
