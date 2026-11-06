// Draws the app's icon at every size each platform wants. It's drawn from numbers, so it needs no
// design tool and stays sharp. Run from app/ with: dart run tool/make_icons.dart
import 'dart:io';
import 'dart:math' as math;

import 'package:image/image.dart' as img;

const _top = (r: 14, g: 142, b: 122);
const _bottom = (r: 9, g: 88, b: 76);
const _slice = (r: 255, g: 255, b: 255);
const _chosen = (r: 255, g: 200, b: 87);

/// How much of a pixel a shape with soft edges of this width covers.
double _cover(double distanceInside, double edge) => (distanceInside / edge + 0.5).clamp(0.0, 1.0);

/// Inside a square with rounded corners, from -1 to 1 across, how far in from its edge.
double _insideRounded(double x, double y, double half, double radius) {
  final dx = x.abs() - (half - radius);
  final dy = y.abs() - (half - radius);
  if (dx <= 0 && dy <= 0) return radius - math.max(dx, dy);
  return radius - math.sqrt(math.pow(math.max(dx, 0), 2) + math.pow(math.max(dy, 0), 2));
}

({int r, int g, int b}) _mix(({int r, int g, int b}) a, ({int r, int g, int b}) b, double t) {
  int part(int from, int to) => (from + (to - from) * t).round();
  return (r: part(a.r, b.r), g: part(a.g, b.g), b: part(a.b, b.b));
}

/// One size of the icon. [plate] is how much of the square its background fills, as macOS wants a
/// margin. [rounded] false fills the square, for platforms that cut their own shape. [ring] is how
/// large the menu is on the plate.
img.Image _draw(int size, {double plate = 1, bool rounded = true, double ring = 1}) {
  // Drawn large and scaled down, so small sizes stay clean.
  const samples = 4;
  final big = size * samples;
  final image = img.Image(width: big, height: big, numChannels: 4);
  const slices = 6;
  const gapDegrees = 7.0;
  final outer = 0.66 * ring * plate;
  final inner = 0.31 * ring * plate;
  final hub = 0.17 * ring * plate;
  final edge = 2.5 / big;
  for (var py = 0; py < big; py++) {
    final y = (py + 0.5) / big * 2 - 1;
    for (var px = 0; px < big; px++) {
      final x = (px + 0.5) / big * 2 - 1;
      final inside = rounded ? _insideRounded(x, y, plate, 0.46 * plate) : 1.0;
      final alpha = _cover(inside, edge);
      if (alpha <= 0) continue;
      var colour = _mix(_top, _bottom, ((y / plate + 1) / 2).clamp(0.0, 1.0));

      final radius = math.sqrt(x * x + y * y);
      if (radius > inner - edge && radius < outer + edge) {
        var angle = math.atan2(x, -y) * 180 / math.pi;
        if (angle < 0) angle += 360;
        final span = 360 / slices;
        final index = ((angle + span / 2) % 360) ~/ span;
        final fromMiddle = ((angle + span / 2) % span - span / 2).abs();
        final across = (span / 2 - gapDegrees / 2 - fromMiddle) * math.pi / 180 * radius;
        final band = math.min(outer - radius, radius - inner);
        final amount = _cover(math.min(across, band), edge);
        if (amount > 0) {
          colour = _mix(colour, index == 0 ? _chosen : _slice, amount * (index == 0 ? 1 : 0.92));
        }
      }
      if (radius < hub + edge) colour = _mix(colour, _slice, _cover(hub - radius, edge));
      image.setPixelRgba(px, py, colour.r, colour.g, colour.b, (alpha * 255).round());
    }
  }
  return img.copyResize(image, width: size, height: size, interpolation: img.Interpolation.average);
}

void _png(String path, img.Image image) {
  File(path)
    ..parent.createSync(recursive: true)
    ..writeAsBytesSync(img.encodePng(image));
}

void main() {
  const macFolder = 'macos/Runner/Assets.xcassets/AppIcon.appiconset';
  for (final size in const [16, 32, 64, 128, 256, 512, 1024]) {
    // Apple's icons leave a margin around the plate.
    _png('$macFolder/app_icon_$size.png', _draw(size, plate: 0.82));
  }
  _png('web/favicon.png', _draw(32));
  _png('web/icons/Icon-192.png', _draw(192));
  _png('web/icons/Icon-512.png', _draw(512));
  // Phones may cut anything off beyond the middle 80%, so the menu sits well inside.
  _png('web/icons/Icon-maskable-192.png', _draw(192, rounded: false, ring: 0.8));
  _png('web/icons/Icon-maskable-512.png', _draw(512, rounded: false, ring: 0.8));
  const android = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192};
  android.forEach((name, size) {
    _png('android/app/src/main/res/mipmap-$name/ic_launcher.png', _draw(size));
  });
  final windows = [
    for (final size in const [16, 24, 32, 48, 64, 128, 256]) _draw(size),
  ];
  File('windows/runner/resources/app_icon.ico')
      .writeAsBytesSync(img.IcoEncoder().encodeImages(windows));
}
