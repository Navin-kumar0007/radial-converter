import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

import 'action_icons.dart';
import 'radial_geometry.dart';
import 'words.dart';

const _openDuration = Duration(milliseconds: 120);

/// The radial menu: slices around a centre that cancels. Works by mouse, by keyboard and with
/// screen readers. Files are dropped on it during a drag, so "More" opens by hovering alone.
class RadialMenu extends StatefulWidget {
  const RadialMenu({
    super.key,
    required this.actions,
    required this.onSelected,
    required this.onCancelled,
    this.fileCount = 1,
    this.diameter = 280,
    this.moreDwell = const Duration(milliseconds: 400),
  });

  final List<RadialAction> actions;
  final ValueChanged<RadialAction> onSelected;
  final VoidCallback onCancelled;

  /// Several files show a count in the centre.
  final int fileCount;
  final double diameter;

  /// How long hovering on "More" takes to turn the page.
  final Duration moreDwell;

  @override
  State<RadialMenu> createState() => _RadialMenuState();
}

class _RadialMenuState extends State<RadialMenu> with SingleTickerProviderStateMixin {
  late final AnimationController _opening = AnimationController(
    vsync: this,
    duration: _openDuration,
  );
  late List<List<RadialAction>> _pages = menuPages(widget.actions);
  int _page = 0;
  int? _highlighted;
  Timer? _moreTimer;

  double get _hubRadius => widget.diameter * 0.2;
  bool get _hasMore => _pages.length > 1;
  List<RadialAction> get _shown => _pages.isEmpty ? const [] : _pages[_page];

  /// Slices on this page, counting "More".
  int get _sliceCount => _shown.length + (_hasMore ? 1 : 0);
  bool _isMore(int slice) => _hasMore && slice == _shown.length;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_opening.isAnimating || _opening.isCompleted) return;
    if (MediaQuery.disableAnimationsOf(context)) {
      _opening.value = 1;
    } else {
      _opening.forward();
    }
  }

  @override
  void didUpdateWidget(RadialMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.actions != widget.actions) {
      _pages = menuPages(widget.actions);
      _page = 0;
      _setHighlight(null);
    }
  }

  @override
  void dispose() {
    _moreTimer?.cancel();
    _opening.dispose();
    super.dispose();
  }

  void _setHighlight(int? slice) {
    if (slice == _highlighted) return;
    _moreTimer?.cancel();
    setState(() => _highlighted = slice);
    if (slice != null && _isMore(slice)) {
      _moreTimer = Timer(widget.moreDwell, () => _nextPage(highlight: null));
    }
  }

  void _nextPage({required int? highlight}) {
    if (!_hasMore) return;
    _moreTimer?.cancel();
    setState(() {
      _page = (_page + 1) % _pages.length;
      _highlighted = highlight;
    });
  }

  void _apply(int slice) {
    if (_isMore(slice)) {
      _nextPage(highlight: 0);
    } else {
      widget.onSelected(_shown[slice]);
    }
  }

  int? _sliceUnder(Offset point) {
    return sliceAt(point, diameter: widget.diameter, hubRadius: _hubRadius, count: _sliceCount);
  }

  void _handleTap(Offset point) {
    if (isInHub(point, diameter: widget.diameter, hubRadius: _hubRadius)) {
      widget.onCancelled();
      return;
    }
    final slice = _sliceUnder(point);
    if (slice != null) _apply(slice);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) return KeyEventResult.ignored;
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      widget.onCancelled();
    } else if (key == LogicalKeyboardKey.tab) {
      _nextPage(highlight: 0);
    } else if (_sliceCount == 0) {
      return KeyEventResult.ignored;
    } else if (key == LogicalKeyboardKey.arrowRight || key == LogicalKeyboardKey.arrowDown) {
      _moveBy(1);
    } else if (key == LogicalKeyboardKey.arrowLeft || key == LogicalKeyboardKey.arrowUp) {
      _moveBy(-1);
    } else if (key == LogicalKeyboardKey.enter || key == LogicalKeyboardKey.numpadEnter) {
      final slice = _highlighted;
      if (slice == null) return KeyEventResult.ignored;
      _apply(slice);
    } else {
      return KeyEventResult.ignored;
    }
    return KeyEventResult.handled;
  }

  /// Keyboard moves never auto-turn the page: Enter on "More" does that.
  void _moveBy(int step) {
    final current = _highlighted;
    final next = current == null ? (step > 0 ? 0 : _sliceCount - 1) : current + step;
    _moreTimer?.cancel();
    setState(() => _highlighted = next % _sliceCount);
  }

  @override
  Widget build(BuildContext context) {
    final colours = Theme.of(context).colorScheme;
    final diameter = widget.diameter;
    return Focus(
      autofocus: true,
      onKeyEvent: _handleKey,
      child: ScaleTransition(
        scale: CurvedAnimation(
          parent: _opening,
          curve: Curves.easeOut,
        ).drive(Tween<double>(begin: 0.85, end: 1)),
        child: FadeTransition(
          opacity: _opening,
          child: SizedBox.square(
            dimension: diameter,
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              onHover: (event) => _setHighlight(_sliceUnder(event.localPosition)),
              onExit: (_) => _setHighlight(null),
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapUp: (details) => _handleTap(details.localPosition),
                child: ClipOval(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: CustomPaint(
                            painter: _RingPainter(
                              count: _sliceCount,
                              highlighted: _highlighted,
                              hubRadius: _hubRadius,
                              surface: colours.surfaceContainerHigh.withValues(alpha: 0.92),
                              hub: colours.surface,
                              divider: colours.outlineVariant,
                              accent: colours.primary,
                            ),
                          ),
                        ),
                        for (var slice = 0; slice < _sliceCount; slice++) _buildSlice(slice),
                        Center(child: _buildHub(colours)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSlice(int slice) {
    final colours = Theme.of(context).colorScheme;
    final isMore = _isMore(slice);
    final action = isMore ? null : _shown[slice];
    final isOn = slice == _highlighted;
    final colour = isOn ? colours.onPrimary : colours.onSurface;
    final centre = sliceCentre(
      slice,
      diameter: widget.diameter,
      hubRadius: _hubRadius,
      count: _sliceCount,
    );
    const width = 76.0;
    const height = 54.0;
    final words = context.words;
    final label = isMore ? words.more : actionLabel(words, action!.label);
    return Positioned(
      left: centre.dx - width / 2,
      top: centre.dy - height / 2,
      width: width,
      height: height,
      child: Semantics(
        button: true,
        selected: isOn,
        label: isMore ? words.moreActions : label,
        onTap: () => _apply(slice),
        child: ExcludeSemantics(
          child: IgnorePointer(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(isMore ? Icons.more_horiz : iconFor(action!), size: 20, color: colour),
                const SizedBox(height: 2),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    height: 1.1,
                    color: colour,
                    fontWeight: isOn ? FontWeight.w700 : FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHub(ColorScheme colours) {
    final words = context.words;
    final empty = widget.actions.isEmpty;
    return Semantics(
      button: true,
      label: widget.fileCount > 1 ? words.cancelFiles(widget.fileCount) : words.cancel,
      onTap: widget.onCancelled,
      child: ExcludeSemantics(
        child: IgnorePointer(
          child: SizedBox.square(
            dimension: _hubRadius * 2,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.fileCount > 1)
                  Container(
                    margin: const EdgeInsets.only(bottom: 2),
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
                    decoration: BoxDecoration(
                      color: colours.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '${widget.fileCount}',
                      style: TextStyle(fontSize: 11, color: colours.onPrimary),
                    ),
                  ),
                Text(
                  empty ? words.nothingFits : words.cancel,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: colours.onSurfaceVariant),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  const _RingPainter({
    required this.count,
    required this.highlighted,
    required this.hubRadius,
    required this.surface,
    required this.hub,
    required this.divider,
    required this.accent,
  });

  final int count;
  final int? highlighted;
  final double hubRadius;
  final Color surface;
  final Color hub;
  final Color divider;
  final Color accent;

  @override
  void paint(Canvas canvas, Size size) {
    final centre = size.center(Offset.zero);
    final outer = Rect.fromCircle(center: centre, radius: size.width / 2);
    final inner = Rect.fromCircle(center: centre, radius: hubRadius);
    canvas.drawCircle(centre, size.width / 2, Paint()..color = surface);

    final span = count == 0 ? 0.0 : 2 * math.pi / count;
    for (var i = 0; i < count; i++) {
      final start = -math.pi / 2 + i * span - span / 2;
      if (i == highlighted) {
        final Path slice;
        if (count == 1) {
          // A sweep of a full circle draws nothing, so one slice is a whole ring.
          slice = Path()
            ..addOval(outer)
            ..addOval(inner)
            ..fillType = PathFillType.evenOdd;
        } else {
          slice = Path()
            ..arcTo(outer, start, span, true)
            ..arcTo(inner, start + span, -span, false)
            ..close();
        }
        canvas.drawPath(slice, Paint()..color = accent);
      }
      if (count > 1) {
        final direction = Offset(math.cos(start), math.sin(start));
        canvas.drawLine(
          centre + direction * hubRadius,
          centre + direction * (size.width / 2),
          Paint()
            ..color = divider
            ..strokeWidth = 1,
        );
      }
    }
    canvas.drawCircle(centre, hubRadius, Paint()..color = hub);
    canvas.drawCircle(
      centre,
      hubRadius,
      Paint()
        ..color = divider
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(_RingPainter oldDelegate) {
    return oldDelegate.count != count ||
        oldDelegate.highlighted != highlighted ||
        oldDelegate.surface != surface ||
        oldDelegate.accent != accent;
  }
}
