import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('pdfrx\'s worker still has what web/pdf_extras_worker.js adds to', () {
    // The addition runs inside pdfrx's own worker and uses its names. If an update renames them,
    // bold and pictures would quietly stop in browsers, so this says so first.
    final config = File('.dart_tool/package_config.json');
    final packages = (jsonDecode(config.readAsStringSync()) as Map)['packages'] as List;
    final pdfrx = packages.cast<Map>().firstWhere((package) => package['name'] == 'pdfrx');
    final root = config.uri.resolve(pdfrx['rootUri'] as String);
    final folder = root.path.endsWith('/') ? root : Uri.parse('${root.toString()}/');
    final worker = File.fromUri(folder.resolve('assets/pdfium_worker.js')).readAsStringSync();
    expect(worker, contains('const functions = {'));
    expect(worker, contains('const Pdfium = {'));
    expect(worker, contains('static allocateUTF8('));
    expect(worker, contains('static freeUTF8('));
    // pdfrx defines pdfiumWasmUrl in the script that loads the worker, as lib/pdf_extras_web.dart
    // does, so the worker must still read it from there.
    expect(worker, contains('pdfiumWasmUrl'));
    final ours = File('web/pdf_extras_worker.js').readAsStringSync();
    expect(ours, contains('functions.readExtras = readExtras;'));
  });

  test('both readers leave out the same pictures', () {
    final ours = File('web/pdf_extras_worker.js').readAsStringSync();
    final dart = File('lib/pdf_extras.dart').readAsStringSync();
    final small = RegExp(r'const smallestPicture = ([\d.]+)').firstMatch(ours)![1];
    final large = RegExp(r'const largestPictureSide = (\d+)').firstMatch(ours)![1];
    expect(dart, contains('const smallestPicture = ${double.parse(small!)};'));
    expect(dart, contains('const largestPictureSide = $large;'));
  });
}
