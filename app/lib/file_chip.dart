import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import 'words.dart';

enum FileChipState { working, done, failed }

/// The chip shown under the cursor after a drop: a progress ring, then the result with its
/// actions. It fades after [fadeAfter], unless that is null because the result only exists
/// in memory until saved.
///
/// With [onDragOut], the finished chip can be dragged out to another app. Phones share instead.
class FileChip extends StatefulWidget {
  const FileChip({
    super.key,
    required this.name,
    required this.state,
    this.progress = 0,
    this.indeterminate = false,
    this.detail,
    this.message,
    this.onSave,
    this.onShare,
    this.onDragOut,
    this.onCancel,
    this.onCopy,
    this.onShowInFolder,
    this.onUndo,
    this.onFaded,
    this.fadeAfter = const Duration(seconds: 10),
    this.thumbnail,
  });

  final String name;
  final FileChipState state;

  /// From 0 to 1, while working.
  final double progress;

  /// True when the work cannot report how far along it is.
  final bool indeterminate;

  /// A second line once done, such as the sizes.
  final String? detail;

  /// Why it failed, in plain words.
  final String? message;
  final VoidCallback? onSave;
  final VoidCallback? onShare;

  /// Called as a drag starts from the chip, with the mouse button still down.
  final VoidCallback? onDragOut;
  final VoidCallback? onCancel;
  final VoidCallback? onCopy;
  final VoidCallback? onShowInFolder;
  final VoidCallback? onUndo;
  final VoidCallback? onFaded;
  final Duration? fadeAfter;

  /// A small picture of the result, shown in place of the tick once it's done.
  final Widget? thumbnail;

  @override
  State<FileChip> createState() => _FileChipState();
}

class _FileChipState extends State<FileChip> {
  static const _fadeDuration = Duration(milliseconds: 250);
  Timer? _timer;
  bool _fading = false;
  Offset? _pressedAt;

  @override
  void initState() {
    super.initState();
    _startFadeTimer();
  }

  @override
  void didUpdateWidget(FileChip oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.state != widget.state || oldWidget.name != widget.name) {
      _timer?.cancel();
      _fading = false;
      _startFadeTimer();
    }
  }

  void _startFadeTimer() {
    final fadeAfter = widget.fadeAfter;
    if (widget.state != FileChipState.done || fadeAfter == null) return;
    _timer = Timer(fadeAfter, () => setState(() => _fading = true));
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final colours = Theme.of(context).colorScheme;
    final instant = MediaQuery.disableAnimationsOf(context);
    return AnimatedOpacity(
      opacity: _fading ? 0 : 1,
      duration: instant ? Duration.zero : _fadeDuration,
      onEnd: () {
        if (_fading) widget.onFaded?.call();
      },
      child: Material(
        color: colours.surfaceContainerHigh,
        elevation: 6,
        borderRadius: BorderRadius.circular(14),
        child: _draggable(
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildLeading(colours),
                const SizedBox(width: 10),
                Flexible(child: _buildText(context)),
                if (widget.state == FileChipState.working && widget.onCancel != null) ...[
                  const SizedBox(width: 6),
                  _action(Icons.close, words.cancel, widget.onCancel),
                ],
                if (widget.state == FileChipState.done) ...[
                  const SizedBox(width: 6),
                  if (widget.onSave != null) _action(Icons.save_alt, words.save, widget.onSave),
                  if (widget.onShare != null) _action(Icons.ios_share, words.share, widget.onShare),
                  if (widget.onCopy != null)
                    _action(Icons.copy_outlined, words.copy, widget.onCopy),
                  if (widget.onShowInFolder != null)
                    _action(Icons.folder_open_outlined, words.showInFolder, widget.onShowInFolder),
                  if (widget.onUndo != null) _action(Icons.undo, words.undo, widget.onUndo),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// All of a finished chip can be dragged, which is easier to hit than its handle alone.
  Widget _draggable(Widget chip) {
    final onDragOut = widget.onDragOut;
    if (widget.state != FileChipState.done || onDragOut == null) return chip;
    // Watched directly, as a gesture detector takes a click for a drag that didn't move.
    return MouseRegion(
      cursor: SystemMouseCursors.grab,
      child: Listener(
        onPointerDown: (event) => _pressedAt = event.position,
        onPointerUp: (_) => _pressedAt = null,
        onPointerCancel: (_) => _pressedAt = null,
        onPointerMove: (event) {
          final start = _pressedAt;
          if (start == null || (event.position - start).distance < kPanSlop) return;
          _pressedAt = null;
          onDragOut();
        },
        child: chip,
      ),
    );
  }

  Widget _buildLeading(ColorScheme colours) {
    return switch (widget.state) {
      FileChipState.working => SizedBox.square(
        dimension: 24,
        child: CircularProgressIndicator(
          value: widget.indeterminate ? null : widget.progress,
          strokeWidth: 3,
          semanticsLabel: context.words.converting,
          semanticsValue: widget.indeterminate ? null : '${(widget.progress * 100).round()}%',
        ),
      ),
      FileChipState.done when widget.thumbnail != null => Semantics(
        label: context.words.done,
        child: widget.onDragOut == null
            ? widget.thumbnail
            : Tooltip(message: context.words.dragToApp, child: widget.thumbnail),
      ),
      FileChipState.done => Semantics(
        label: context.words.done,
        child: widget.onDragOut == null
            ? Icon(Icons.check_circle_outline, color: colours.primary)
            : Tooltip(
                message: context.words.dragToApp,
                child: Icon(Icons.drag_indicator, color: colours.primary),
              ),
      ),
      FileChipState.failed => Semantics(
        label: context.words.failed,
        child: Icon(Icons.error_outline, color: colours.error),
      ),
    };
  }

  Widget _buildText(BuildContext context) {
    final styles = Theme.of(context).textTheme;
    final message = widget.message;
    final detail = widget.detail;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: styles.bodyMedium),
        if (widget.state == FileChipState.done && detail != null)
          Text(detail, maxLines: 3, overflow: TextOverflow.ellipsis, style: styles.bodySmall),
        if (widget.state == FileChipState.failed && message != null)
          Text(message, maxLines: 2, overflow: TextOverflow.ellipsis, style: styles.bodySmall),
      ],
    );
  }

  Widget _action(IconData icon, String label, VoidCallback? onPressed) {
    // A separate node, or a screen reader merges it into the progress ring and can't reach it.
    return Semantics(
      container: true,
      child: IconButton(
        icon: Icon(icon, size: 18),
        tooltip: label,
        onPressed: onPressed,
        visualDensity: VisualDensity.compact,
      ),
    );
  }
}
