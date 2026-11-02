import 'dart:async';

import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import '../file_chip.dart';
import '../radial_menu.dart';

/// A pretend file for the preview.
class _Sample {
  const _Sample(this.label, this.fileName, this.kinds);

  final String label;
  final String fileName;
  final List<FileKind> kinds;
}

const _samples = [
  _Sample('Photo (JPG)', 'photo.jpg', [FileKind.jpg]),
  _Sample('iPhone photo (HEIC)', 'IMG_0042.heic', [FileKind.heic]),
  _Sample('Video (MP4)', 'holiday.mp4', [FileKind.mp4]),
  _Sample('Song (MP3)', 'song.mp3', [FileKind.mp3]),
  _Sample('PDF', 'form.pdf', [FileKind.pdf]),
  _Sample('Word document', 'letter.docx', [FileKind.docx]),
  _Sample('Subtitles (SRT)', 'film.srt', [FileKind.srt]),
  _Sample('Archive (ZIP)', 'pack.zip', [FileKind.zip]),
  _Sample('Folder', 'Holiday photos', [FileKind.folder]),
  _Sample('Photo and PNG together', 'photo.jpg', [FileKind.jpg, FileKind.png]),
  _Sample('Photo and song together', 'photo.jpg', [FileKind.jpg, FileKind.mp3]),
];

/// Shows the radial menu and file chip without Shift-drag or engines, so they can be tried
/// in a browser. Nothing is converted: the progress here is pretend.
class MenuPreview extends StatefulWidget {
  const MenuPreview({super.key});

  @override
  State<MenuPreview> createState() => _MenuPreviewState();
}

class _MenuPreviewState extends State<MenuPreview> {
  _Sample _sample = _samples.first;
  ActionMode _mode = ActionMode.convert;
  int _copies = 1;
  bool _menuOpen = true;
  Timer? _pretendJob;
  String? _chipName;
  double _progress = 0;
  bool _done = false;

  List<FileKind> get _kinds => [for (var copy = 0; copy < _copies; copy++) ..._sample.kinds];

  @override
  void dispose() {
    _pretendJob?.cancel();
    super.dispose();
  }

  void _select(RadialAction action) {
    final name = freeOutputName(
      inputName: _sample.fileName,
      extension: action.outputFor(_sample.kinds.first).extension,
      suffix: action.suffix,
      exists: (_) => false,
    );
    _pretendJob?.cancel();
    setState(() {
      _menuOpen = false;
      _chipName = name;
      _progress = 0;
      _done = false;
    });
    _pretendJob = Timer.periodic(const Duration(milliseconds: 50), (timer) {
      setState(() {
        _progress += 0.05;
        if (_progress >= 1) {
          _progress = 1;
          _done = true;
          timer.cancel();
        }
      });
    });
  }

  /// Any change of file or mode starts again with an open menu.
  void _openWith(VoidCallback change) {
    _pretendJob?.cancel();
    setState(() {
      change();
      _menuOpen = true;
      _chipName = null;
    });
  }

  void _say(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final styles = Theme.of(context).textTheme;
    final kinds = _kinds;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 640),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('Radial menu preview', style: styles.headlineSmall),
                const SizedBox(height: 4),
                Text(
                  'Nothing is converted here. This only shows how the menu and file chip behave.',
                  style: styles.bodyMedium,
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    DropdownButton<_Sample>(
                      value: _sample,
                      items: [
                        for (final sample in _samples)
                          DropdownMenuItem(value: sample, child: Text(sample.label)),
                      ],
                      onChanged: (sample) {
                        if (sample != null) _openWith(() => _sample = sample);
                      },
                    ),
                    SegmentedButton<ActionMode>(
                      segments: const [
                        ButtonSegment(value: ActionMode.convert, label: Text('Shift: Convert')),
                        ButtonSegment(value: ActionMode.tools, label: Text('Shift + Alt: Tools')),
                      ],
                      selected: {_mode},
                      onSelectionChanged: (selection) {
                        _openWith(() => _mode = selection.single);
                      },
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove),
                          tooltip: 'Fewer files',
                          onPressed: _copies > 1 ? () => _openWith(() => _copies--) : null,
                        ),
                        Text('${kinds.length} ${kinds.length == 1 ? 'file' : 'files'}'),
                        IconButton(
                          icon: const Icon(Icons.add),
                          tooltip: 'More files',
                          onPressed: _copies < 9 ? () => _openWith(() => _copies++) : null,
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 320,
                  child: Center(
                    child: _menuOpen
                        ? RadialMenu(
                            actions: actionsFor(kinds, _mode),
                            fileCount: kinds.length,
                            onSelected: _select,
                            onCancelled: () => setState(() => _menuOpen = false),
                          )
                        : _buildClosed(),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Mouse: hover, click, or rest on More. Keyboard: arrows move, Enter applies, '
                  'Tab turns the page, Esc cancels.',
                  textAlign: TextAlign.center,
                  style: styles.bodySmall,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildClosed() {
    final name = _chipName;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (name == null)
          const Text('Cancelled. The file stays where it was.')
        else
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: FileChip(
              name: name,
              state: _done ? FileChipState.done : FileChipState.working,
              progress: _progress,
              onCopy: () => _say('Preview only: this will copy the file.'),
              onShowInFolder: () => _say('Preview only: this will open the folder.'),
              onUndo: () => _say('Preview only: this will move the result to the Trash.'),
              onFaded: () => setState(() => _chipName = null),
            ),
          ),
        const SizedBox(height: 20),
        TextButton.icon(
          onPressed: () => _openWith(() {}),
          icon: const Icon(Icons.refresh),
          label: const Text('Open the menu again'),
        ),
      ],
    );
  }
}
