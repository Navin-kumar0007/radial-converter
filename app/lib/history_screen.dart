import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';

/// How long ago, as people say it.
String formatWhen(DateTime at, DateTime now) {
  final local = at.toLocal();
  final today = DateTime(now.year, now.month, now.day);
  final day = DateTime(local.year, local.month, local.day);
  final days = today.difference(day).inDays;
  String two(int value) => value.toString().padLeft(2, '0');
  final time = '${two(local.hour)}:${two(local.minute)}';
  if (days == 0) return 'Today $time';
  if (days == 1) return 'Yesterday $time';
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return '${local.day} ${months[local.month - 1]}, $time';
}

/// What has been saved on this device. Undo and showing a file only appear where the app can reach
/// what it saved.
class HistoryScreen extends StatefulWidget {
  const HistoryScreen({
    super.key,
    required this.log,
    required this.onClear,
    this.onUndo,
    this.onShow,
    this.now,
  });

  final HistoryLog log;
  final Future<void> Function() onClear;

  /// True if it was undone.
  final Future<bool> Function(HistoryItem item)? onUndo;
  final Future<void> Function(HistoryItem item)? onShow;
  final DateTime? now;

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  Future<void> _clear() async {
    final sure = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear history?'),
        content: const Text('This only clears the list. Your files stay where they are.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
    if (sure != true) return;
    await widget.onClear();
    if (mounted) setState(() {});
  }

  String _sizes(HistoryItem item) {
    final before = item.bytesBefore;
    final after = formatBytes(item.bytesAfter);
    return before == null ? after : '${formatBytes(before)} to $after';
  }

  Widget _buildItem(HistoryItem item, DateTime now) {
    final path = item.path;
    final undone = item.undoneAt != null;
    final onUndo = widget.onUndo;
    final onShow = widget.onShow;
    final when = formatWhen(item.finishedAt, now);
    return ListTile(
      title: Text(item.name, maxLines: 1, overflow: TextOverflow.ellipsis),
      subtitle: Text(
        undone
            ? 'Undone · ${item.actionLabel} · $when'
            : '${item.actionLabel} · ${_sizes(item)} · $when',
      ),
      trailing: path == null || undone
          ? null
          : Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (onShow != null)
                  IconButton(
                    tooltip: 'Show in folder',
                    icon: const Icon(Icons.folder_open_outlined),
                    onPressed: () => onShow(item),
                  ),
                if (onUndo != null)
                  IconButton(
                    tooltip: 'Undo',
                    icon: const Icon(Icons.undo),
                    onPressed: () async {
                      await onUndo(item);
                      if (mounted) setState(() {});
                    },
                  ),
              ],
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final items = widget.log.items;
    final now = widget.now ?? DateTime.now();
    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
        actions: [if (items.isNotEmpty) TextButton(onPressed: _clear, child: const Text('Clear'))],
      ),
      body: items.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'What you save will be listed here for 30 days. It stays on this device.',
                  textAlign: TextAlign.center,
                ),
              ),
            )
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) => _buildItem(items[index], now),
            ),
    );
  }
}
