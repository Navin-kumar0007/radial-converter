/// The choices an action may need from the user.
class ActionOptions {
  const ActionOptions({
    this.longSide,
    this.crop,
    this.degrees,
    this.flipVertical = false,
    this.startSeconds,
    this.endSeconds,
    this.pages,
    this.password,
    this.audioKbps,
    this.targetMb,
    this.shift,
  });

  final int? longSide;

  /// Left, top, width, height in pixels.
  final ({int left, int top, int width, int height})? crop;

  /// Clockwise: 90, 180 or 270.
  final int? degrees;
  final bool flipVertical;
  final double? startSeconds;
  final double? endSeconds;

  /// A qpdf page range such as `1-3,7`.
  final String? pages;
  final String? password;
  final int? audioKbps;
  final double? targetMb;
  final Duration? shift;
}

/// An engine could not do the job. [message] is written for the user; [details] is what
/// the engine said, for the Copy details button.
class EngineFailed implements Exception {
  const EngineFailed(this.message, {this.details = ''});

  final String message;
  final String details;

  @override
  String toString() => details.isEmpty ? message : '$message\n$details';
}

/// Seconds from a time as people write it: `90`, `1:30`, `1:02:03` or `1:30.5`. Null if it isn't one.
double? parseClock(String text) {
  final parts = text.trim().split(':');
  if (parts.length > 3) return null;
  var seconds = 0.0;
  for (var i = 0; i < parts.length; i++) {
    final isLast = i == parts.length - 1;
    final part = parts[i];
    if (!RegExp(isLast ? r'^\d+(\.\d+)?$' : r'^\d+$').hasMatch(part)) return null;
    final value = double.parse(part);
    // Only the first part may run past 59: `90` and `90:00` are fine, `1:90` is a typo.
    if (i > 0 && value >= 60) return null;
    seconds = seconds * 60 + value;
  }
  return seconds;
}
