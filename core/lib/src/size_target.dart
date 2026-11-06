/// One encode attempt: the quality used, the scale of the original dimensions, and bytes.
typedef SizeAttempt = ({int quality, double scale, int bytes});

/// Encodes at [quality] and a [scale] of the original dimensions; returns the size in bytes.
typedef SizeEncoder = Future<int> Function(int quality, double scale);

/// The plan's "under X KB" search for images: binary-search the quality for the highest
/// one that fits; if even [minQuality] is too big, shrink the dimensions by 10% and repeat.
///
/// Returns the best attempt, or null if nothing above [minScale] fits.
Future<SizeAttempt?> searchUnderSize({
  required int maxBytes,
  required SizeEncoder encode,
  int minQuality = 40,
  int maxQuality = 95,
  double shrink = 0.9,
  double minScale = 0.1,
}) async {
  for (var scale = 1.0; scale >= minScale; scale *= shrink) {
    final lowest = await encode(minQuality, scale);
    if (lowest > maxBytes) continue;

    SizeAttempt best = (quality: minQuality, scale: scale, bytes: lowest);
    var low = minQuality + 1;
    var high = maxQuality;
    while (low <= high) {
      final quality = (low + high) ~/ 2;
      final bytes = await encode(quality, scale);
      if (bytes <= maxBytes) {
        best = (quality: quality, scale: scale, bytes: bytes);
        low = quality + 1;
      } else {
        high = quality - 1;
      }
    }
    return best;
  }
  return null;
}

/// The plan's video formula: target MB × 8192 ÷ seconds − audio kbps.
///
/// Rounded down so the result stays under the target. Null if the target cannot be met:
/// an empty clip, or too little room left once the audio is counted.
int? videoKbpsForTarget({
  required double targetMb,
  required double durationSeconds,
  required int audioKbps,
}) {
  if (targetMb <= 0 || durationSeconds <= 0) return null;
  final kbps = (targetMb * 8192 / durationSeconds - audioKbps).floor();
  return kbps > 0 ? kbps : null;
}
