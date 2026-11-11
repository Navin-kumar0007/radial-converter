import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:typed_data';

import 'package:pdfrx/pdfrx.dart';
import 'package:radial_core/radial_core.dart';
import 'package:web/web.dart' as web;

import 'pdf_extras.dart';

/// Each page's bold letters and pictures, or null where they couldn't be read: then the page
/// comes through as before, plain and without pictures. pdfrx's worker takes only its own
/// commands, so this starts another from the same files, plus `web/pdf_extras_worker.js`.
Future<List<PageExtras?>?> readPageExtras(Uint8List pdf, {String? password}) async {
  final base = Uri.parse(web.document.baseURI);
  // Where pdfrx finds its own, as its _getWorkerUrl does.
  final modules = base.resolve(Pdfrx.pdfiumWasmModulesUrl ?? 'assets/packages/pdfrx/assets/');
  final script =
      'const pdfiumWasmUrl="${modules.resolve('pdfium.wasm')}";'
      'importScripts("${modules.resolve('pdfium_worker.js')}");'
      'importScripts("${base.resolve('pdf_extras_worker.js')}");';
  final url = web.URL.createObjectURL(
    web.Blob([script.toJS].toJS, web.BlobPropertyBag(type: 'application/javascript')),
  );
  final worker = web.Worker(url.toJS);
  final done = Completer<Map<Object?, Object?>?>();
  worker.onmessage = ((web.MessageEvent event) {
    final reply = event.data.dartify();
    if (reply is! Map || reply['id'] != 2 || done.isCompleted) return;
    done.complete(reply['status'] == 'success' ? reply['result'] as Map? : null);
  }).toJS;
  worker.onerror = ((web.Event event) {
    event.preventDefault();
    if (!done.isCompleted) done.complete(null);
  }).toJS;
  try {
    worker.postMessage({'id': 1, 'command': 'init', 'parameters': <String, Object?>{}}.jsify());
    // A copy goes, as the worker takes it over.
    final data = Uint8List.fromList(pdf).buffer.toJS;
    final parameters = {'password': password}.jsify()! as JSObject..setProperty('data'.toJS, data);
    final message = {'id': 2, 'command': 'readExtras'}.jsify()! as JSObject
      ..setProperty('parameters'.toJS, parameters);
    worker.postMessage(message, [data].toJS);
    final result = await done.future;
    final pages = result?['pages'];
    if (pages is! List) return null;
    return [for (final page in pages) page is Map ? _page(page) : null];
  } catch (_) {
    return null;
  } finally {
    worker.terminate();
    web.URL.revokeObjectURL(url);
  }
}

PageExtras _page(Map<Object?, Object?> page) {
  final fonts = [
    for (final font in page['fonts']! as List)
      isBoldFont(
        weight: ((font! as Map)['weight']! as num).toInt(),
        name: font['name']! as String,
        flags: (font['flags']! as num).toInt(),
      ),
  ];
  return PageExtras(
    codes: [for (final code in page['codes']! as List) (code! as num).toInt()],
    bold: [for (final id in page['fontIds']! as List) fonts[(id! as num).toInt()]],
    pictures: [
      for (final picture in page['pictures']! as List)
        if (picture case final Map picture)
          (
            top: (picture['top']! as num).toDouble(),
            picture: DocxPicture(
              (picture['jpeg']! as ByteBuffer).asUint8List(),
              width: (picture['pixelsWide']! as num).toInt(),
              height: (picture['pixelsHigh']! as num).toInt(),
              displayWidth: (picture['width']! as num).toDouble(),
            ),
          ),
    ],
  );
}
