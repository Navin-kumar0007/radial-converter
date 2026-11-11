import 'dart:async';
import 'dart:convert';
import 'dart:io';

/// The version file is a few hundred bytes. Anything far larger isn't it.
const _largest = 64 * 1024;

/// Fetches the version file. Sends nothing but the request itself: no cookies, no identifiers,
/// and a plain name rather than the Dart version.
Future<String> fetchVersionFile(Uri address) async {
  final client = HttpClient()
    ..connectionTimeout = const Duration(seconds: 10)
    ..userAgent = 'ShiftDrop';
  try {
    final request = await client.getUrl(address).timeout(const Duration(seconds: 10));
    final response = await request.close().timeout(const Duration(seconds: 10));
    if (response.statusCode != HttpStatus.ok) {
      throw HttpException('Version file answered ${response.statusCode}', uri: address);
    }
    final bytes = <int>[];
    await for (final piece in response.timeout(const Duration(seconds: 10))) {
      bytes.addAll(piece);
      if (bytes.length > _largest) throw const HttpException('Version file too large');
    }
    return utf8.decode(bytes);
  } finally {
    client.close(force: true);
  }
}
