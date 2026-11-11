import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

import 'action_icons.dart';
import 'radial_geometry.dart';
import 'size_preview.dart';
import 'words.dart';

const _openDuration = Duration(milliseconds: 120);

/// A drag that began outside the menu and goes on over it, as in the guide's practice, where the
/// photo is pressed first and the menu opens under the pointer. Positions are global.
class RadialMenuDrag extends ChangeNotifier {
  Offset? _at;
  bool _dropped = false;

  Offset? get at => _at;
  bool get dropped => _dropped;

  void move(Offset global) {
    if (_dropped) return;
    _at = global;
    notifyListeners();
  }

  /// Let go: on a slice runs it, on the centre or off the menu cancels.
  void drop(Offset global) {
    if (_dropped) return;
    _at = global;
    _dropped = true;
    notifyListeners();
  }
}

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
    this.sizeOf,
    this.sizeDwell = const Duration(milliseconds: 250),
    this.onChoice,
    this.ringWidth = 60,
    this.drag,
  });

  final List<RadialAction> actions;
  final ValueChanged<RadialAction> onSelected;
  final VoidCallback onCancelled;

  /// Several files show a count in the centre.
  final int fileCount;
  final double diameter;

  /// How long hovering on "More" takes to turn the page.
  final Duration moreDwell;

  /// Tells the centre how big the highlighted slice's result will be.
  final SizeGuesser? sizeOf;

  /// How long a slice stays highlighted before its size is asked, so sweeping across the ring
  /// doesn't start work for every slice passed.
  final Duration sizeDwell;

  /// Runs one of an action's choices from the outer ring. Without it there is no ring, and a slice
  /// runs as it is.
  final void Function(RadialAction action, ActionOptions options)? onChoice;

  /// How wide the outer ring is, around [diameter]. Narrower where the screen is.
  final double ringWidth;

  /// A drag to follow, which hovers as the pointer moves and chooses where it's let go.
  final RadialMenuDrag? drag;

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

  /// The highlighted slice's choice on the outer ring, if the pointer or keyboard is there.
  int? _choice;
  Timer? _moreTimer;
  Timer? _sizeTimer;

  /// Sizes by action id. Null while asking, or if it can't be told.
  final _sizes = <String, SizeGuess?>{};

  /// The square holding the menu and its ring, to place a drag's global positions in it.
  final _square = GlobalKey();

  /// The inner menu and the ring around it, as the space allows: set when laid out.
  late double _diameter = widget.diameter;
  late double _band = widget.onChoice == null ? 0 : widget.ringWidth;

  /// The whole square, ring included.
  double get _size => _diameter + 2 * _band;
  Offset get _inset => Offset(_band, _band);

  double get _hubRadius => _diameter * 0.2;
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
  void initState() {
    super.initState();
    widget.drag?.addListener(_followDrag);
  }

  void _followDrag() {
    final drag = widget.drag;
    final at = drag?.at;
    final box = _square.currentContext?.findRenderObject() as RenderBox?;
    if (drag == null || at == null || box == null || !box.hasSize || !mounted) return;
    final point = box.globalToLocal(at);
    final inside = (point - Offset(_size / 2, _size / 2)).distance <= _size / 2;
    if (!drag.dropped) {
      if (inside) {
        _hover(point);
      } else {
        _setHighlight(null);
      }
      return;
    }
    if (!inside) {
      widget.onCancelled();
      return;
    }
    // Let go, as a mouse click would be: a finger's first tap only shows a slice's choices.
    _hover(point);
    _handleTap(point, PointerDeviceKind.mouse);
  }

  @override
  void didUpdateWidget(RadialMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.drag != widget.drag) {
      oldWidget.drag?.removeListener(_followDrag);
      widget.drag?.addListener(_followDrag);
    }
    if (oldWidget.sizeOf != widget.sizeOf) _sizes.clear();
    if (oldWidget.actions != widget.actions) {
      _pages = menuPages(widget.actions);
      _page = 0;
      _setHighlight(null);
    }
  }

  @override
  void dispose() {
    widget.drag?.removeListener(_followDrag);
    _moreTimer?.cancel();
    _sizeTimer?.cancel();
    _opening.dispose();
    super.dispose();
  }

  void _setHighlight(int? slice) {
    if (slice == _highlighted) return;
    _moreTimer?.cancel();
    setState(() {
      _highlighted = slice;
      _choice = null;
    });
    _askSize();
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
      _choice = null;
    });
    _askSize();
  }

  RadialAction? get _highlightedAction {
    final slice = _highlighted;
    if (slice == null || _isMore(slice) || slice >= _shown.length) return null;
    return _shown[slice];
  }

  /// The highlighted slice's choices, shown on the outer ring. None if there's no ring.
  List<RingChoice> get _ring {
    final action = _highlightedAction;
    if (action == null || _band == 0) return const [];
    return ringChoices(action);
  }

  void _setChoice(int? choice) {
    if (choice != _choice) setState(() => _choice = choice);
  }

  /// The first choice is what the slice does, so it runs as the slice itself, which lets the
  /// menu's trial of that slice be reused.
  void _runChoice(RadialAction action, int index) {
    final choices = ringChoices(action);
    final onChoice = widget.onChoice;
    if (onChoice == null || index == 0) {
      widget.onSelected(action);
    } else {
      onChoice(action, choices[index].options);
    }
  }

  bool _inInner(Offset inner) {
    final centre = _diameter / 2;
    return (inner - Offset(centre, centre)).distance <= centre;
  }

  int? _choiceUnder(Offset point, List<RingChoice> ring) {
    return choiceAt(
      point,
      size: _size,
      diameter: _diameter,
      parent: _highlighted!,
      count: _sliceCount,
      choices: ring.length,
    );
  }

  void _hover(Offset point) {
    final inner = point - _inset;
    final ring = _ring;
    // Off the inner menu with a ring showing, the slice stays highlighted while choices are tried.
    if (ring.isNotEmpty && !_inInner(inner)) {
      _setChoice(_choiceUnder(point, ring));
      return;
    }
    _setHighlight(_sliceUnder(inner));
  }

  /// Asks the size of the highlighted slice once it has stayed highlighted for a moment.
  void _askSize() {
    _sizeTimer?.cancel();
    final sizeOf = widget.sizeOf;
    final action = _highlightedAction;
    if (sizeOf == null || action == null || _sizes.containsKey(action.id)) return;
    _sizeTimer = Timer(widget.sizeDwell, () async {
      _sizes[action.id] = null;
      SizeGuess? guess;
      try {
        guess = await sizeOf(action);
      } catch (_) {
        // Without a size the menu works as before.
      }
      if (!mounted || widget.sizeOf != sizeOf) return;
      setState(() => _sizes[action.id] = guess);
    });
  }

  void _apply(int slice) {
    if (_isMore(slice)) {
      _nextPage(highlight: 0);
    } else {
      widget.onSelected(_shown[slice]);
    }
  }

  int? _sliceUnder(Offset inner) {
    return sliceAt(inner, diameter: _diameter, hubRadius: _hubRadius, count: _sliceCount);
  }

  void _handleTap(Offset point, PointerDeviceKind? kind) {
    final inner = point - _inset;
    if (isInHub(inner, diameter: _diameter, hubRadius: _hubRadius)) {
      widget.onCancelled();
      return;
    }
    final ring = _ring;
    final action = _highlightedAction;
    if (ring.isNotEmpty && action != null && !_inInner(inner)) {
      final choice = _choiceUnder(point, ring);
      if (choice != null) _runChoice(action, choice);
      return;
    }
    final slice = _sliceUnder(inner);
    if (slice == null) return;
    // A finger can't hover, so the first tap on a slice with choices shows them.
    final hasChoices = !_isMore(slice) && _band > 0 && ringChoices(_shown[slice]).isNotEmpty;
    if (kind == PointerDeviceKind.touch && hasChoices && slice != _highlighted) {
      _setHighlight(slice);
      return;
    }
    _apply(slice);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) return KeyEventResult.ignored;
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      widget.onCancelled();
    } else if (key == LogicalKeyboardKey.tab) {
      // Into a slice's choices and back out. Elsewhere, the next page.
      if (_ring.isNotEmpty) {
        _setChoice(_choice == null ? 0 : null);
      } else {
        _nextPage(highlight: 0);
      }
    } else if (_sliceCount == 0) {
      return KeyEventResult.ignored;
    } else if (key == LogicalKeyboardKey.arrowRight || key == LogicalKeyboardKey.arrowDown) {
      _moveBy(1);
    } else if (key == LogicalKeyboardKey.arrowLeft || key == LogicalKeyboardKey.arrowUp) {
      _moveBy(-1);
    } else if (key == LogicalKeyboardKey.enter || key == LogicalKeyboardKey.numpadEnter) {
      final slice = _highlighted;
      if (slice == null) return KeyEventResult.ignored;
      final choice = _choice;
      final action = _highlightedAction;
      if (choice != null && action != null) {
        _runChoice(action, choice);
      } else {
        _apply(slice);
      }
    } else {
      return KeyEventResult.ignored;
    }
    return KeyEventResult.handled;
  }

  /// Keyboard moves never auto-turn the page: Enter on "More" does that.
  void _moveBy(int step) {
    final choice = _choice;
    if (choice != null) {
      final count = _ring.length;
      _setChoice((choice + step) % count);
      return;
    }
    final current = _highlighted;
    final next = current == null ? (step > 0 ? 0 : _sliceCount - 1) : current + step;
    _moreTimer?.cancel();
    setState(() => _highlighted = next % _sliceCount);
    _askSize();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        _fit(constraints.maxWidth);
        return _buildMenu(context);
      },
    );
  }

  /// Narrow screens get a narrower ring and then a smaller menu. If even that doesn't fit, there's
  /// no ring, and slices run as they are.
  void _fit(double width) {
    final wanted = widget.onChoice == null ? 0.0 : widget.ringWidth;
    _diameter = widget.diameter;
    _band = wanted;
    if (!width.isFinite || _size <= width) return;
    // The ring narrows first, as far as its labels allow, so the slices keep their room.
    const narrowest = 44.0;
    _band = math.max(narrowest, (width - _diameter) / 2);
    if (_size <= width) return;
    // Then the menu shrinks, down to where its own labels still fit.
    const smallest = 240.0;
    _diameter = math.max(smallest, width - 2 * _band);
    if (_size <= width) return;
    // No room for a ring: the menu is as it is without one, and slices run as they are.
    _band = 0;
    _diameter = widget.diameter;
  }

  Widget _buildMenu(BuildContext context) {
    final colours = Theme.of(context).colorScheme;
    final diameter = _diameter;
    final ring = _ring;
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
            key: _square,
            dimension: _size,
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              onHover: (event) => _hover(event.localPosition),
              onExit: (_) => _setHighlight(null),
              child: GestureDetector(
                behavior: HitTestBehavior.translucent,
                onTapUp: (details) => _handleTap(details.localPosition, details.kind),
                child: Stack(
                  children: [
                    if (ring.isNotEmpty) ...[
                      Positioned.fill(
                        child: CustomPaint(
                          painter: _OuterRingPainter(
                            diameter: diameter,
                            parent: _highlighted!,
                            count: _sliceCount,
                            choices: ring.length,
                            highlighted: _choice,
                            surface: colours.surfaceContainerHigh.withValues(alpha: 0.96),
                            divider: colours.outlineVariant,
                            accent: colours.primary,
                          ),
                        ),
                      ),
                      for (var i = 0; i < ring.length; i++) _buildChoice(i, ring[i]),
                    ],
                    Center(
                      child: SizedBox.square(
                        dimension: diameter,
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
                                      accent: _choice == null
                                          ? colours.primary
                                          : colours.primary.withValues(alpha: 0.45),
                                    ),
                                  ),
                                ),
                                for (var slice = 0; slice < _sliceCount; slice++)
                                  _buildSlice(slice),
                                Center(child: _buildHub(colours)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChoice(int index, RingChoice choice) {
    final colours = Theme.of(context).colorScheme;
    final words = context.words;
    final action = _highlightedAction!;
    final isOn = index == _choice;
    final centre = choiceCentre(
      index,
      size: _size,
      diameter: _diameter,
      parent: _highlighted!,
      count: _sliceCount,
      choices: _ring.length,
    );
    final label = ringChoiceLabel(words, choice);
    final width = _band + 16;
    const height = 34.0;
    return Positioned(
      left: centre.dx - width / 2,
      top: centre.dy - height / 2,
      width: width,
      height: height,
      child: Semantics(
        button: true,
        selected: isOn,
        label: words.ringChoice(actionLabel(words, action.label), label),
        onTap: () => _runChoice(action, index),
        child: ExcludeSemantics(
          child: IgnorePointer(
            child: Center(
              child: Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11,
                  height: 1.1,
                  color: isOn ? colours.onPrimary : colours.onSurface,
                  fontWeight: isOn ? FontWeight.w700 : FontWeight.w500,
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
      diameter: _diameter,
      hubRadius: _hubRadius,
      count: _sliceCount,
    );
    const width = 76.0;
    const height = 54.0;
    final words = context.words;
    final label = isMore ? words.more : actionLabel(words, action!.label);
    final size = isMore ? null : _sizes[action!.id];
    final choices = isMore || _band == 0 ? const <RingChoice>[] : ringChoices(action!);
    return Positioned(
      left: centre.dx - width / 2,
      top: centre.dy - height / 2,
      width: width,
      height: height,
      child: Semantics(
        button: true,
        selected: isOn,
        label: isMore ? words.moreActions : label,
        value: size?.describe(words),
        onTap: () => _apply(slice),
        // Screen readers reach the ring's choices from the slice itself.
        customSemanticsActions: {
          for (var i = 1; i < choices.length; i++)
            CustomSemanticsAction(label: ringChoiceLabel(words, choices[i])): () =>
                _runChoice(action!, i),
        },
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
    final action = _highlightedAction;
    // A choice may differ in size from what the slice makes, so the centre only speaks for the slice.
    final size = action == null || _choice != null ? null : _sizes[action.id];
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
                if (size != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        size.describe(words),
                        maxLines: 1,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: colours.onSurface,
                        ),
                      ),
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

/// The highlighted slice's choices, as a band of the outer ring around it.
class _OuterRingPainter extends CustomPainter {
  const _OuterRingPainter({
    required this.diameter,
    required this.parent,
    required this.count,
    required this.choices,
    required this.highlighted,
    required this.surface,
    required this.divider,
    required this.accent,
  });

  final double diameter;
  final int parent;
  final int count;
  final int choices;
  final int? highlighted;
  final Color surface;
  final Color divider;
  final Color accent;

  @override
  void paint(Canvas canvas, Size size) {
    final centre = size.center(Offset.zero);
    final outer = Rect.fromCircle(center: centre, radius: size.width / 2);
    // A small gap, so the ring reads as apart from the menu.
    final inner = Rect.fromCircle(center: centre, radius: diameter / 2 + 3);
    final line = Paint()
      ..color = divider
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final span = choiceSpan(count: count, choices: choices);
    for (var i = 0; i < choices; i++) {
      // Canvas angles start to the right; ours start at the top.
      final start =
          choiceAngle(i, parent: parent, count: count, choices: choices) - span / 2 - math.pi / 2;
      final band = Path()
        ..arcTo(outer, start, span, true)
        ..arcTo(inner, start + span, -span, false)
        ..close();
      canvas.drawPath(band, Paint()..color = i == highlighted ? accent : surface);
      canvas.drawPath(band, line);
    }
  }

  @override
  bool shouldRepaint(_OuterRingPainter oldDelegate) {
    return oldDelegate.diameter != diameter ||
        oldDelegate.parent != parent ||
        oldDelegate.count != count ||
        oldDelegate.choices != choices ||
        oldDelegate.highlighted != highlighted ||
        oldDelegate.surface != surface ||
        oldDelegate.accent != accent;
  }
}
