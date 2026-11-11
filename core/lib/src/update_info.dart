import 'dart:convert';

/// What the website's version file says about the newest release, which copies downloaded from
/// the website check for. Store copies and the web app update by other means.
///
/// The file is `docs/site/version.json`, changed by hand after a release has had a couple of days
/// with testers, so everyone isn't told at once.
class UpdateInfo {
  const UpdateInfo({required this.version, required this.page, this.downloads = const {}});

  /// Three numbers, such as 0.10.0.
  final String version;

  /// The release's page, with every download and its notes.
  final Uri page;

  /// A direct download for each platform that has one, by name: `macos`, `windows`, `android`.
  final Map<String, Uri> downloads;

  /// The file's contents, or null if they aren't a version file. Only `https` addresses on the
  /// project's own hosts are kept, so a tampered file can't send anyone elsewhere.
  static UpdateInfo? parse(String text) {
    final Object? json;
    try {
      json = jsonDecode(text);
    } on FormatException {
      return null;
    }
    if (json is! Map) return null;
    final version = json['version'];
    final page = _address(json['page']);
    if (version is! String || parseVersion(version) == null || page == null) return null;
    final downloads = <String, Uri>{};
    final given = json['downloads'];
    if (given is Map) {
      for (final MapEntry(:key, :value) in given.entries) {
        final address = _address(value);
        if (key is String && address != null) downloads[key] = address;
      }
    }
    return UpdateInfo(version: version, page: page, downloads: downloads);
  }

  /// Where to get it on [platform]: its download, or the release page.
  Uri addressFor(String platform) => downloads[platform] ?? page;

  bool isNewerThan(String current) {
    final mine = parseVersion(current);
    final theirs = parseVersion(version);
    if (mine == null || theirs == null) return false;
    return compareVersions(theirs, mine) > 0;
  }
}

/// Hosts the version file may send people to.
const trustedUpdateHosts = {'github.com', 'shiftdrop.pages.dev'};

Uri? _address(Object? value) {
  if (value is! String) return null;
  final address = Uri.tryParse(value);
  if (address == null || address.scheme != 'https') return null;
  if (!trustedUpdateHosts.contains(address.host)) return null;
  if (address.userInfo.isNotEmpty || address.hasPort) return null;
  return address;
}

/// `0.10.0` as `[0, 10, 0]`, or null if it isn't three numbers. A `+2` build number is ignored.
List<int>? parseVersion(String version) {
  final match = RegExp(r'^(\d{1,6})\.(\d{1,6})\.(\d{1,6})(\+\d+)?$').firstMatch(version.trim());
  if (match == null) return null;
  return [for (var i = 1; i <= 3; i++) int.parse(match.group(i)!)];
}

/// Below zero if [a] is older than [b], zero if the same, above zero if newer.
int compareVersions(List<int> a, List<int> b) {
  for (var i = 0; i < 3; i++) {
    if (a[i] != b[i]) return a[i].compareTo(b[i]);
  }
  return 0;
}

/// Whether a day has passed since the last check, so the app asks at most once a day.
bool updateCheckDue(DateTime? lastChecked, DateTime now) {
  if (lastChecked == null) return true;
  // A clock set back must not stop checks for good.
  if (lastChecked.isAfter(now)) return true;
  return now.difference(lastChecked) >= const Duration(hours: 20);
}
