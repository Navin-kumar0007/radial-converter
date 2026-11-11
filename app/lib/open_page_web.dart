import 'package:web/web.dart' as web;

/// Opens a web page in another tab. Only `https` ones. With `noopener` the browser gives nothing
/// back, so this can't tell whether a blocker stopped it.
Future<bool> openPage(Uri address) async {
  if (address.scheme != 'https') return false;
  web.window.open(address.toString(), '_blank', 'noopener');
  return true;
}
