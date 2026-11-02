import 'dart:async';

import 'package:flutter/material.dart';

enum FileChipState { working, done, failed }

/// The chip shown under the cursor after a drop: a progress ring, then the result with its
/// actions. It fades after [fadeAfter]; the file stays saved.
///
/// Dragging the chip out to another app needs native drag support, which arrives with the
/// macOS build. Until then the handle only shows where the drag will start.
class FileChip extends StatefulWidget {
  const FileChip({
    super.key,
    required this.name,
    required this.state,
    this.progress = 0,
    this.message,
    this.onCopy,
    this.onShowInFolder,
    this.onUndo,
    this.onFaded,
    this.fadeAfter = const Duration(seconds: 10),
  });

  final String name;
  final FileChipState state;

  /// From 0 to 1, while working.
  final double progress;

  /// Why it failed, in plain words.
  final String? message;
  final VoidCallback? onCopy;
  final VoidCallback? onShowInFolder;
  final VoidCallback? onUndo;
  final VoidCallback? onFaded;
  final Duration fadeAfter;

  @override
  State<FileChip> createState() => _FileChipState();
}

class _FileChipState extends State<FileChip> {
  static const _fadeDuration = Duration(milliseconds: 250);
  Timer? _timer;
  bool _fading = false;

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
    if (widget.state != FileChipState.done) return;
    _timer = Timer(widget.fadeAfter, () => setState(() => _fading = true));
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildLeading(colours),
              const SizedBox(width: 10),
              Flexible(child: _buildText(context)),
              if (widget.state == FileChipState.done) ...[
                const SizedBox(width: 6),
                _action(Icons.copy_outlined, 'Copy', widget.onCopy),
                _action(Icons.folder_open_outlined, 'Show in folder', widget.onShowInFolder),
                _action(Icons.undo, 'Undo', widget.onUndo),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLeading(ColorScheme colours) {
    return switch (widget.state) {
      FileChipState.working => SizedBox.square(
        dimension: 24,
        child: CircularProgressIndicator(
          value: widget.progress,
          strokeWidth: 3,
          semanticsLabel: 'Converting',
          semanticsValue: '${(widget.progress * 100).round()}%',
        ),
      ),
      FileChipState.done => Semantics(
        label: 'Done',
        child: Icon(Icons.drag_indicator, color: colours.primary),
      ),
      FileChipState.failed => Semantics(
        label: 'Failed',
        child: Icon(Icons.error_outline, color: colours.error),
      ),
    };
  }

  Widget _buildText(BuildContext context) {
    final styles = Theme.of(context).textTheme;
    final message = widget.message;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: styles.bodyMedium),
        if (widget.state == FileChipState.failed && message != null)
          Text(message, maxLines: 2, overflow: TextOverflow.ellipsis, style: styles.bodySmall),
      ],
    );
  }

  Widget _action(IconData icon, String label, VoidCallback? onPressed) {
    return IconButton(
      icon: Icon(icon, size: 18),
      tooltip: label,
      onPressed: onPressed,
      visualDensity: VisualDensity.compact,
    );
  }
}
