import 'dart:io';

import 'package:flutter/services.dart';

import 'shift_drag.dart';

/// `MainActivity.kt` on the other side. Opening a page needs no internet permission: the browser
/// does the fetching.
const _pages = MethodChannel('radial/pages');

/// Opens a web page in the user's browser. Only `https` ones. False if it couldn't be done.
Future<bool> openPage(Uri address) async {
  if (address.scheme != 'https') return false;
  final arguments = {'url': address.toString()};
  try {
    if (Platform.isMacOS || Platform.isWindows) {
      return await shiftDragChannel.invokeMethod<bool>('openPage', arguments) ?? false;
    }
    if (Platform.isAndroid) return await _pages.invokeMethod<bool>('open', arguments) ?? false;
  } catch (_) {
    // Said by the caller.
  }
  return false;
}
