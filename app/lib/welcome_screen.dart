import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image/image.dart' as img;
import 'package:radial_core/radial_core.dart';

import 'about.dart';
import 'app_settings.dart';
import 'conversion.dart';
import 'converter_screen.dart' show Converter;
import 'option_screens.dart' show needsOptions;
import 'radial_menu.dart';
import 'update_check.dart';
import 'words.dart';

/// The first-launch guide: what the app is, a practice drag on a sample photo, then a few choices.
/// Shown once, and again from About. Skipping counts as seen.
class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({
    super.key,
    required this.convert,
    required this.onDone,
    this.settings,
    this.platform,
    this.web = kIsWeb,
    this.updateWay,
  });

  /// Runs the practice conversion, as the main screen would.
  final Converter convert;
  final VoidCallback onDone;
  final SettingsStore? settings;

  /// Which platform's tips to give. Null asks the device.
  final TargetPlatform? platform;
  final bool web;
  final UpdateWay? updateWay;

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  int _step = 0;
  static const _steps = 3;

  TargetPlatform get _platform => widget.platform ?? defaultTargetPlatform;

  void _next() {
    if (_step < _steps - 1) {
      setState(() => _step++);
    } else {
      _finish();
    }
  }

  void _finish() {
    widget.settings?.change((old) => old.copyWith(welcomed: true));
    widget.onDone();
  }

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final last = _step == _steps - 1;
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.transparent,
        actions: [if (!last) TextButton(onPressed: _finish, child: Text(words.welcomeSkip))],
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                children: [
                  Expanded(
                    child: switch (_step) {
                      0 => const _Hello(),
                      1 => _Practice(convert: widget.convert, platform: _platform, web: widget.web),
                      _ => _Choices(
                        settings: widget.settings,
                        updateWay:
                            widget.updateWay ??
                            updateWayFor(web: widget.web, platform: _platform, store: storeCopy),
                        desktop:
                            !widget.web &&
                            (_platform == TargetPlatform.macOS ||
                                _platform == TargetPlatform.windows),
                      ),
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      for (var i = 0; i < _steps; i++)
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: _Dot(on: i == _step),
                        ),
                      const Spacer(),
                      if (_step > 0)
                        TextButton(
                          onPressed: () => setState(() => _step--),
                          child: Text(words.welcomeBack),
                        ),
                      const SizedBox(width: 8),
                      FilledButton(
                        onPressed: _next,
                        child: Text(last ? words.welcomeStart : words.welcomeNext),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot({required this.on});

  final bool on;

  @override
  Widget build(BuildContext context) {
    final colours = Theme.of(context).colorScheme;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      width: on ? 18 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: on ? colours.primary : colours.outlineVariant,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}

class _Hello extends StatelessWidget {
  const _Hello();

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final styles = Theme.of(context).textTheme;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset('assets/app_icon.png', width: 88, height: 88, excludeFromSemantics: true),
        const SizedBox(height: 20),
        Text(words.welcomeTitle, style: styles.headlineSmall, textAlign: TextAlign.center),
        const SizedBox(height: 12),
        Text(words.welcomeText, style: styles.bodyLarge, textAlign: TextAlign.center),
      ],
    );
  }
}

/// A small made-up photo to practise on: sky, sun and hills, drawn here so nothing ships or loads.
Uint8List samplePhoto() {
  const width = 480;
  const height = 320;
  final picture = img.Image(width: width, height: height);
  for (var y = 0; y < height; y++) {
    final t = y / height;
    final sky = img.ColorRgb8((90 + 120 * t).round(), (160 + 70 * t).round(), 235);
    for (var x = 0; x < width; x++) {
      picture.setPixel(x, y, sky);
    }
  }
  img.fillCircle(picture, x: 360, y: 90, radius: 42, color: img.ColorRgb8(255, 214, 92));
  for (var x = 0; x < width; x++) {
    final far = (210 + 30 * _wave(x / 90)).round();
    final near = (250 + 22 * _wave(x / 60 + 2)).round();
    for (var y = far; y < height; y++) {
      picture.setPixel(x, y, y < near ? img.ColorRgb8(46, 125, 96) : img.ColorRgb8(11, 110, 95));
    }
  }
  return img.encodeJpg(picture, quality: 85);
}

double _wave(double x) => (x % 2 < 1 ? x % 1 : 1 - x % 1) * 2 - 1;

/// What practising goes through.
enum _Practising { waiting, dragging, working, done }

class _Practice extends StatefulWidget {
  const _Practice({required this.convert, required this.platform, required this.web});

  final Converter convert;
  final TargetPlatform platform;
  final bool web;

  @override
  State<_Practice> createState() => _PracticeState();
}

class _PracticeState extends State<_Practice> {
  static const _name = 'sample photo.jpg';
  late final Uint8List _photo = samplePhoto();
  late final FileKind _kind = detectKind(_photo, fileName: _name);
  late final List<RadialAction> _actions = [
    for (final action in availableActions([_kind], ActionMode.convert, mediaAvailable: false))
      if (!needsOptions(action) && canRunPortably(action, _kind)) action,
  ];

  _Practising _state = _Practising.waiting;
  RadialMenuDrag? _drag;
  Offset? _pressedAt;
  PointerDeviceKind? _pointer;
  String? _said;

  bool get _desktop =>
      widget.platform == TargetPlatform.macOS ||
      widget.platform == TargetPlatform.windows ||
      widget.platform == TargetPlatform.linux;

  /// A mouse on a desktop holds Shift, as in Finder and Explorer. A finger just drags.
  bool get _needsShift => _desktop && _pointer != PointerDeviceKind.touch;

  void _down(PointerDownEvent event) {
    if (_state == _Practising.working) return;
    _pressedAt = event.position;
    _pointer = event.kind;
  }

  void _move(PointerMoveEvent event) {
    final start = _pressedAt;
    if (start == null) return;
    final drag = _drag;
    if (drag != null) {
      drag.move(event.position);
      return;
    }
    if ((event.position - start).distance < kTouchSlop / 2) return;
    if (_needsShift && !HardwareKeyboard.instance.isShiftPressed) {
      setState(() => _said = context.words.practiceHoldShift);
      _pressedAt = null;
      return;
    }
    setState(() {
      _drag = RadialMenuDrag();
      _state = _Practising.dragging;
      _said = null;
    });
    // Placed once the menu is laid out.
    WidgetsBinding.instance.addPostFrameCallback((_) => _drag?.move(event.position));
  }

  void _up(PointerUpEvent event) {
    _pressedAt = null;
    _drag?.drop(event.position);
  }

  void _cancelPointer(PointerCancelEvent event) {
    _pressedAt = null;
    if (_drag != null) _closeMenu(context.words.practiceCancelled);
  }

  void _closeMenu(String? said) {
    setState(() {
      _drag = null;
      _state = _Practising.waiting;
      _said = said;
    });
  }

  Future<void> _chosen(RadialAction action) async {
    final words = context.words;
    setState(() {
      _drag = null;
      _state = _Practising.working;
      _said = null;
    });
    String said;
    try {
      final results = await widget.convert(
        action,
        [PortableFile(_name, _photo)],
        (_) {},
        const ActionOptions(),
      );
      final result = results.first;
      said = words.practiceDone(result.name, formatBytes(result.bytes.length));
    } catch (error) {
      debugPrint('The practice conversion failed: $error');
      said = words.practiceFailed;
    }
    if (!mounted) return;
    setState(() {
      _state = _Practising.done;
      _said = said;
    });
  }

  String _tip(Words words) {
    if (widget.web) return words.tipWeb;
    return switch (widget.platform) {
      TargetPlatform.macOS => words.tipMac,
      TargetPlatform.windows => words.tipWindows,
      TargetPlatform.android => words.tipAndroid,
      _ => words.tipWeb,
    };
  }

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final styles = Theme.of(context).textTheme;
    final colours = Theme.of(context).colorScheme;
    final ask = _desktop ? words.practiceShiftDrag : words.practiceDrag;
    return Column(
      children: [
        const SizedBox(height: 8),
        Text(words.practiceTitle, style: styles.headlineSmall, textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text(ask, style: styles.bodyLarge, textAlign: TextAlign.center),
        Expanded(
          child: Stack(
            alignment: Alignment.center,
            clipBehavior: Clip.none,
            children: [
              Listener(
                onPointerDown: _down,
                onPointerMove: _move,
                onPointerUp: _up,
                onPointerCancel: _cancelPointer,
                child: MouseRegion(
                  cursor: SystemMouseCursors.grab,
                  child: Semantics(
                    label: words.practicePhoto,
                    image: true,
                    child: Opacity(
                      opacity: _state == _Practising.dragging ? 0.35 : 1,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: colours.outlineVariant),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Image.memory(_photo, width: 180, height: 120, fit: BoxFit.cover),
                      ),
                    ),
                  ),
                ),
              ),
              if (_drag != null)
                // The real menu, under the pointer, as it opens over other apps.
                RadialMenu(
                  actions: _actions,
                  diameter: 240,
                  drag: _drag,
                  onSelected: _chosen,
                  onCancelled: () => _closeMenu(words.practiceCancelled),
                ),
              if (_state == _Practising.working) const CircularProgressIndicator(),
            ],
          ),
        ),
        if (_said != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              _said!,
              style: styles.titleSmall,
              textAlign: TextAlign.center,
              semanticsLabel: _said,
            ),
          ),
        if (_state == _Practising.done)
          Text(_tip(words), style: styles.bodyMedium, textAlign: TextAlign.center),
      ],
    );
  }
}

class _Choices extends StatelessWidget {
  const _Choices({required this.settings, required this.updateWay, required this.desktop});

  final SettingsStore? settings;
  final UpdateWay updateWay;
  final bool desktop;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final styles = Theme.of(context).textTheme;
    return ListView(
      children: [
        const SizedBox(height: 8),
        Text(words.choicesTitle, style: styles.headlineSmall, textAlign: TextAlign.center),
        const SizedBox(height: 16),
        if (settings != null) LanguageChoice(settings: settings!),
        if (desktop) const OpenAtLogin(),
        if (settings != null && updateWay == UpdateWay.check) UpdateChecks(settings: settings!),
      ],
    );
  }
}
