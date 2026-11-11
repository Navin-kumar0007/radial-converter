/// The web app is updated by redeploying the site, so it never fetches this.
Future<String> fetchVersionFile(Uri address) async {
  throw UnsupportedError('The web app updates itself.');
}
