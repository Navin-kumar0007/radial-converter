import 'dart:js_interop';

import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

/// The start of the file at a `blob:` address, read piece by piece. Asking for a very large file
/// as a blob fails outright, and would read all of it just to look at the start.
Future<List<int>> readBlobHead(String url) async {
  final response = await web.window.fetch(url.toJS).toDart;
  final body = response.body;
  if (body == null) return const [];
  final reader = body.getReader() as web.ReadableStreamDefaultReader;
  final head = <int>[];
  while (head.length < detectHeadBytes) {
    final chunk = await reader.read().toDart;
    final value = chunk.value;
    if (chunk.done || value == null) break;
    head.addAll((value as JSUint8Array).toDart);
  }
  await reader.cancel().toDart;
  return head.length <= detectHeadBytes ? head : head.sublist(0, detectHeadBytes);
}
