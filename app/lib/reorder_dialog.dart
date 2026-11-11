import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import 'action_icons.dart';
import 'conversion.dart';
import 'words.dart';

/// Asks what order files go together in, for merging or making one PDF: they become pages or clips
/// one after another. Answers with the files' positions in the order chosen, or null if cancelled.
Future<List<int>?> askForOrder(
  BuildContext context, {
  required RadialAction action,
  required List<PickedFile> files,
  required List<FileKind> kinds,
  Widget Function(int index)? picture,
}) {
  return showDialog<List<int>>(
    context: context,
    builder: (_) => ReorderDialog(action: action, files: files, kinds: kinds, picture: picture),
  );
}

class ReorderDialog extends StatefulWidget {
  const ReorderDialog({
    super.key,
    required this.action,
    required this.files,
    required this.kinds,
    this.picture,
  });

  final RadialAction action;
  final List<PickedFile> files;
  final List<FileKind> kinds;

  /// A small picture of each file, by its position as given. Without one, its kind's icon.
  final Widget Function(int index)? picture;

  @override
  State<ReorderDialog> createState() => _ReorderDialogState();
}

class _ReorderDialogState extends State<ReorderDialog> {
  late final List<int> _order = [for (var i = 0; i < widget.files.length; i++) i];

  static const _rowHeight = 64.0;

  void _move(int from, int to) {
    setState(() => _order.insert(to, _order.removeAt(from)));
  }

  @override
  Widget build(BuildContext context) {
    final words = context.words;
    final size = MediaQuery.sizeOf(context);
    // Room for every file and the hint above them, up to most of the screen; more scroll.
    final height = math.min(_order.length * _rowHeight + 72, size.height * 0.6);
    return AlertDialog(
      title: Text(words.reorderTitle),
      contentPadding: const EdgeInsets.fromLTRB(8, 16, 8, 0),
      content: SizedBox(
        width: 440,
        height: height,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(words.reorderHint, style: Theme.of(context).textTheme.bodyMedium),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ReorderableListView.builder(
                buildDefaultDragHandles: false,
                itemCount: _order.length,
                onReorderItem: _move,
                itemBuilder: (context, position) => _row(context, position),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(words.cancel)),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(List<int>.unmodifiable(_order)),
          child: Text(actionLabel(words, widget.action.label)),
        ),
      ],
    );
  }

  Widget _row(BuildContext context, int position) {
    final words = context.words;
    final index = _order[position];
    final file = widget.files[index];
    final picture = widget.picture;
    return ListTile(
      key: ValueKey(index),
      contentPadding: const EdgeInsets.symmetric(horizontal: 8),
      leading: SizedBox.square(
        dimension: 44,
        child: picture != null
            ? picture(index)
            : Icon(iconForFamily(widget.kinds[index].family), size: 28),
      ),
      title: Text('${position + 1}. ${file.name}', maxLines: 1, overflow: TextOverflow.ellipsis),
      subtitle: Text(formatBytes(file.size)),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            tooltip: words.reorderUp(file.name),
            icon: const Icon(Icons.arrow_upward),
            onPressed: position == 0 ? null : () => _move(position, position - 1),
          ),
          IconButton(
            tooltip: words.reorderDown(file.name),
            icon: const Icon(Icons.arrow_downward),
            onPressed: position == _order.length - 1 ? null : () => _move(position, position + 1),
          ),
          ReorderableDragStartListener(
            index: position,
            child: const MouseRegion(
              cursor: SystemMouseCursors.grab,
              child: Padding(padding: EdgeInsets.all(8), child: Icon(Icons.drag_handle)),
            ),
          ),
        ],
      ),
    );
  }
}
