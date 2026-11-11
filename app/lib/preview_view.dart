import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

import 'action_icons.dart';
import 'conversion.dart';
import 'preview.dart';
import 'words.dart';

/// A PNG's own width and height, from its header.
Size? pngSize(Uint8List png) {
  if (png.length < 24 || png[12] != 0x49 || png[13] != 0x48) return null;
  final data = ByteData.sublistView(png);
  return Size(data.getUint32(16).toDouble(), data.getUint32(20).toDouble());
}

/// Whether two pictures have the same shape, so one can be laid over the other to compare.
bool sameShape(Uint8List a, Uint8List b) {
  final first = pngSize(a);
  final second = pngSize(b);
  if (first == null || second == null || first.height == 0 || second.height == 0) return false;
  final ratio = (first.width / first.height) / (second.width / second.height);
  return (ratio - 1).abs() < 0.02;
}

String _duration(double seconds) {
  final whole = seconds.round();
  final minutes = whole ~/ 60;
  final rest = (whole % 60).toString().padLeft(2, '0');
  return minutes >= 60
      ? '${minutes ~/ 60}:${(minutes % 60).toString().padLeft(2, '0')}:$rest'
      : '$minutes:$rest';
}

/// The line under a preview, such as "4032×3024 to 1280×960 · 3.2 MB to 240 KB".
String previewFactsLine(Words words, PreviewFacts before, [PreviewFacts? after]) {
  String pair(String? from, String? to) {
    if (from == null) return to ?? '';
    if (to == null || to == from) return from;
    return words.sizeChange(from, to);
  }

  String? size(PreviewFacts? facts) {
    final width = facts?.width;
    final height = facts?.height;
    return width == null || height == null ? null : '$width×$height';
  }

  String? pages(PreviewFacts? facts) =>
      facts?.pages == null ? null : words.previewPages(facts!.pages!);
  String? length(PreviewFacts? facts) => facts?.seconds == null ? null : _duration(facts!.seconds!);
  String? bytes(PreviewFacts? facts) => facts?.bytes == null ? null : formatBytes(facts!.bytes!);

  return [
    pair(size(before), size(after)),
    pair(pages(before), pages(after)),
    pair(length(before), length(after)),
    pair(bytes(before), bytes(after)),
  ].where((part) => part.isNotEmpty).join(' · ');
}

/// The panel above the menu: the first file's first page, and its result's once there is one.
class PreviewPanel extends StatelessWidget {
  const PreviewPanel({
    super.key,
    required this.before,
    required this.kind,
    required this.name,
    this.afterKind,
    this.after,
    this.onHide,
    this.onEnlarge,
    this.height = 180,
  });

  final Future<Preview> before;
  final Future<Preview>? after;
  final FileKind kind;

  /// What the result is, if not the same kind.
  final FileKind? afterKind;
  final String name;
  final VoidCallback? onHide;
  final VoidCallback? onEnlarge;
  final double height;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final colours = Theme.of(context).colorScheme;
    final styles = Theme.of(context).textTheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: colours.outlineVariant),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 4, 4, 10),
        child: FutureBuilder<Preview>(
          future: before,
          builder: (context, first) => FutureBuilder<Preview>(
            future: after,
            builder: (context, second) {
              final shown = first.data;
              final result = second.data;
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Text(words.previewTitle, style: styles.titleSmall),
                      const Spacer(),
                      if (onEnlarge != null && (shown?.picture != null || result?.picture != null))
                        IconButton(
                          tooltip: words.previewEnlarge,
                          icon: const Icon(Icons.open_in_full, size: 18),
                          onPressed: onEnlarge,
                        ),
                      if (onHide != null)
                        IconButton(
                          tooltip: words.previewHide,
                          icon: const Icon(Icons.visibility_off_outlined, size: 18),
                          onPressed: onHide,
                        ),
                    ],
                  ),
                  SizedBox(
                    height: height,
                    child: GestureDetector(
                      onTap: onEnlarge,
                      child: _body(context, shown, result, waitingForAfter: after != null),
                    ),
                  ),
                  if (shown != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      previewFactsLine(words, shown.facts, result?.facts),
                      style: styles.bodySmall,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _body(
    BuildContext context,
    Preview? shown,
    Preview? result, {
    required bool waitingForAfter,
  }) {
    final words = context.words;
    if (shown == null) return const Center(child: CircularProgressIndicator());
    final first = shown.picture;
    final second = result?.picture;
    if (first != null && second != null && sameShape(first, second)) {
      return CompareSlider(before: first, after: second, name: name);
    }
    if (!waitingForAfter) return PreviewView(preview: shown, kind: kind, name: name);
    return Row(
      children: [
        Expanded(
          child: _labelled(
            words.previewBefore,
            PreviewView(preview: shown, kind: kind, name: name),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _labelled(
            words.previewAfter,
            result == null
                ? const Center(child: CircularProgressIndicator())
                : PreviewView(preview: result, kind: afterKind ?? kind, name: name),
          ),
        ),
      ],
    );
  }

  Widget _labelled(String label, Widget child) {
    return Column(
      children: [
        Text(label),
        const SizedBox(height: 4),
        Expanded(child: child),
      ],
    );
  }
}

/// One preview: its picture, its lines of text, or what can be said without either.
class PreviewView extends StatelessWidget {
  const PreviewView({super.key, required this.preview, required this.kind, required this.name});

  final Preview preview;
  final FileKind kind;
  final String name;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final styles = Theme.of(context).textTheme;
    final colours = Theme.of(context).colorScheme;
    final picture = preview.picture;
    if (picture != null) {
      return Image.memory(
        picture,
        fit: BoxFit.contain,
        gaplessPlayback: true,
        semanticLabel: words.previewOf(name),
      );
    }
    if (preview.lines.isNotEmpty) {
      return Semantics(
        label: words.previewOf(name),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final line in preview.lines)
                Text(line, maxLines: 1, overflow: TextOverflow.ellipsis, style: styles.bodySmall),
            ],
          ),
        ),
      );
    }
    final (icon, said) = preview.locked
        ? (Icons.lock_outline, words.previewLocked)
        : preview.failed
        ? (Icons.hide_image_outlined, words.previewCant)
        : (iconForFamily(kind.family), null);
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 40, color: colours.onSurfaceVariant),
          if (said != null) ...[
            const SizedBox(height: 6),
            Text(said, style: styles.bodySmall, textAlign: TextAlign.center),
          ],
        ],
      ),
    );
  }
}

/// Two pictures of the same shape, one over the other: before on the left of the line, after on
/// the right. Dragging, or the arrow keys, move the line.
class CompareSlider extends StatefulWidget {
  const CompareSlider({super.key, required this.before, required this.after, required this.name});

  final Uint8List before;
  final Uint8List after;
  final String name;

  @override
  State<CompareSlider> createState() => _CompareSliderState();
}

class _CompareSliderState extends State<CompareSlider> {
  double _at = 0.5;

  void _set(double at) => setState(() => _at = at.clamp(0.0, 1.0));

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final colours = Theme.of(context).colorScheme;
    final shape = pngSize(widget.after);
    final ratio = shape == null || shape.height == 0 ? 1.0 : shape.width / shape.height;
    return Center(
      child: AspectRatio(
        aspectRatio: ratio,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;
            return Semantics(
              slider: true,
              label: words.previewCompare,
              value: '${(_at * 100).round()}%',
              increasedValue: '${((_at + 0.1).clamp(0.0, 1.0) * 100).round()}%',
              decreasedValue: '${((_at - 0.1).clamp(0.0, 1.0) * 100).round()}%',
              onIncrease: () => _set(_at + 0.1),
              onDecrease: () => _set(_at - 0.1),
              child: Focus(
                onKeyEvent: (node, event) {
                  if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
                    return KeyEventResult.ignored;
                  }
                  if (event.logicalKey == LogicalKeyboardKey.arrowLeft) {
                    _set(_at - 0.05);
                  } else if (event.logicalKey == LogicalKeyboardKey.arrowRight) {
                    _set(_at + 0.05);
                  } else {
                    return KeyEventResult.ignored;
                  }
                  return KeyEventResult.handled;
                },
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onHorizontalDragUpdate: (details) => _set(details.localPosition.dx / width),
                  onTapDown: (details) => _set(details.localPosition.dx / width),
                  child: MouseRegion(
                    cursor: SystemMouseCursors.resizeLeftRight,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.memory(widget.after, fit: BoxFit.fill, gaplessPlayback: true),
                        ClipRect(
                          clipper: _LeftPart(_at),
                          child: Image.memory(
                            widget.before,
                            fit: BoxFit.fill,
                            gaplessPlayback: true,
                          ),
                        ),
                        Positioned(
                          left: width * _at - 1,
                          top: 0,
                          bottom: 0,
                          child: Container(width: 2, color: colours.primary),
                        ),
                        Positioned(
                          left: width * _at - 14,
                          top: 0,
                          bottom: 0,
                          child: Center(
                            child: CircleAvatar(
                              radius: 14,
                              backgroundColor: colours.primary,
                              child: Icon(Icons.compare_arrows, size: 16, color: colours.onPrimary),
                            ),
                          ),
                        ),
                        Positioned(left: 6, top: 6, child: _Tag(words.previewBefore)),
                        Positioned(right: 6, top: 6, child: _Tag(words.previewAfter)),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _LeftPart extends CustomClipper<Rect> {
  const _LeftPart(this.at);

  final double at;

  @override
  Rect getClip(Size size) => Rect.fromLTWH(0, 0, size.width * at, size.height);

  @override
  bool shouldReclip(_LeftPart oldClipper) => oldClipper.at != at;
}

class _Tag extends StatelessWidget {
  const _Tag(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.55),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        child: Text(text, style: const TextStyle(color: Colors.white, fontSize: 11)),
      ),
    );
  }
}

/// A small square picture of a file, for a row of results or the order before merging.
class PreviewThumb extends StatelessWidget {
  const PreviewThumb({super.key, required this.preview, required this.kind, this.size = 40});

  final Future<Preview> preview;
  final FileKind kind;
  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: size,
      child: FutureBuilder<Preview>(
        future: preview,
        builder: (context, made) {
          final picture = made.data?.picture;
          if (picture == null) return Icon(iconForFamily(kind.family), size: size * 0.6);
          return ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: Image.memory(picture, fit: BoxFit.cover, gaplessPlayback: true),
          );
        },
      ),
    );
  }
}

/// The preview full size. With a result there's a choice of comparing the two, or either one
/// alone to zoom into: zooming would fight the comparing line's drag, so they're kept apart.
Future<void> showPreviewLarge(
  BuildContext context, {
  required String name,
  required FileKind kind,
  required Future<Preview> before,
  Future<Preview>? after,
}) {
  return showDialog<void>(
    context: context,
    builder: (_) => LargePreview(name: name, kind: kind, before: before, after: after),
  );
}

enum _Showing { compare, before, after }

class LargePreview extends StatefulWidget {
  const LargePreview({
    super.key,
    required this.name,
    required this.kind,
    required this.before,
    this.after,
  });

  final String name;
  final FileKind kind;
  final Future<Preview> before;
  final Future<Preview>? after;

  @override
  State<LargePreview> createState() => _LargePreviewState();
}

class _LargePreviewState extends State<LargePreview> {
  /// Null until chosen: then comparing where it can, or the result.
  _Showing? _chosen;

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    return Dialog.fullscreen(
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.name, maxLines: 1, overflow: TextOverflow.ellipsis),
          leading: IconButton(
            tooltip: MaterialLocalizations.of(context).closeButtonTooltip,
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: FutureBuilder<Preview>(
          future: widget.before,
          builder: (context, first) => FutureBuilder<Preview>(
            future: widget.after,
            builder: (context, second) {
              final shown = first.data;
              if (shown == null) return const Center(child: CircularProgressIndicator());
              final result = second.data;
              final a = shown.picture;
              final b = result?.picture;
              final comparable = a != null && b != null && sameShape(a, b);
              final choices = [
                if (comparable) _Showing.compare,
                if (b != null) ...[_Showing.before, _Showing.after],
              ];
              var showing = _chosen ?? (comparable ? _Showing.compare : _Showing.after);
              if (!choices.contains(showing)) {
                showing = b == null ? _Showing.before : _Showing.after;
              }
              return Column(
                children: [
                  if (choices.length > 1)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: SegmentedButton<_Showing>(
                        showSelectedIcon: false,
                        segments: [
                          for (final choice in choices)
                            ButtonSegment(
                              value: choice,
                              label: Text(switch (choice) {
                                _Showing.compare => words.previewCompareShort,
                                _Showing.before => words.previewBefore,
                                _Showing.after => words.previewAfter,
                              }),
                            ),
                        ],
                        selected: {showing},
                        onSelectionChanged: (picked) => setState(() => _chosen = picked.single),
                      ),
                    ),
                  Expanded(
                    child: showing == _Showing.compare
                        ? Padding(
                            padding: const EdgeInsets.all(16),
                            child: CompareSlider(before: a!, after: b!, name: widget.name),
                          )
                        : _zoomable(
                            showing == _Showing.after && result != null ? result : shown,
                            words,
                          ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Text(previewFactsLine(words, shown.facts, result?.facts)),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _zoomable(Preview preview, Words words) {
    final picture = preview.picture;
    return InteractiveViewer(
      maxScale: 8,
      child: Center(
        child: picture == null
            ? PreviewView(preview: preview, kind: widget.kind, name: widget.name)
            : Image.memory(
                picture,
                semanticLabel: words.previewOf(widget.name),
                gaplessPlayback: true,
              ),
      ),
    );
  }
}
