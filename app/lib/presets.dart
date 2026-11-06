import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

const _folder = 'packages/radial_core/presets/';

/// The form presets that ship with the app, by name. One that can't be read is left out, as custom
/// sizes still work without it.
Future<List<Preset>> loadBundledPresets() async {
  final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
  final presets = <Preset>[];
  for (final asset in manifest.listAssets()) {
    if (!asset.startsWith(_folder) || !asset.endsWith('.json')) continue;
    try {
      presets.add(Preset.parse(await rootBundle.loadString(asset)));
    } on FormatException catch (error) {
      debugPrint('A preset could not be read: $error');
    }
  }
  presets.sort((a, b) => a.label('en').compareTo(b.label('en')));
  return presets;
}
