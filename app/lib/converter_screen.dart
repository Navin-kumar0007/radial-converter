import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'file_chip.dart';
import 'radial_menu.dart';

typedef FilesPicker = Future<List<PickedFile>> Function();
typedef FileSaver = Future<bool> Function(PortableFile file);
typedef Converter = Future<List<PortableFile>> Function(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
);

class _Job {
  _Job(this.name, this.bytesBefore);

  final String name;
  final int bytesBefore;
  FileChipState state = FileChipState.working;
  double? progress;
  PortableFile? output;
  String? message;
  bool saved = false;
}

/// Pick files, choose a slice, save the result. The same screen on every platform. On desktop
/// the Shift-drag trigger will open the same menu at the cursor.
class ConverterScreen extends StatefulWidget {
  const ConverterScreen({
    super.key,
    required this.pickFiles,
    required this.saveFile,
    this.converter = convert,
  });

  final FilesPicker pickFiles;
  final FileSaver saveFile;
  final Converter converter;

  @override
  State<ConverterScreen> createState() => _ConverterScreenState();
}

class _ConverterScreenState extends State<ConverterScreen> {
  List<PickedFile> _files = const [];
  List<FileKind> _kinds = const [];
  ActionMode _mode = ActionMode.convert;
  bool _menuOpen = false;
  List<_Job> _jobs = const [];

  void _say(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _pick() async {
    final List<PickedFile> files;
    try {
      files = await widget.pickFiles();
    } catch (_) {
      if (mounted) _say('These files could not be opened. Try again.');
      return;
    }
    if (!mounted || files.isEmpty) return;
    setState(() {
      _files = files;
      _kinds = [for (final file in files) detectKind(file.head, fileName: file.name)];
      _menuOpen = true;
      _jobs = const [];
    });
  }

  /// A failure message, or null if these files can be read into memory.
  String? _tooLarge() {
    for (final file in _files) {
      if (file.size > maxInMemoryBytes) {
        return '${file.name} is too large to convert here (limit '
            '${formatBytes(maxInMemoryBytes)}).';
      }
    }
    return null;
  }

  Future<void> _start(RadialAction action) async {
    final before = _files.fold<int>(0, (sum, file) => sum + file.size);
    final files = _files;
    final jobs = [_Job(_workingName(), before)];
    setState(() {
      _menuOpen = false;
      _jobs = jobs;
    });
    final job = jobs.single;
    try {
      final tooLarge = _tooLarge();
      if (tooLarge != null) throw EngineFailed(tooLarge);
      final List<PortableFile> inputs;
      try {
        inputs = [for (final file in files) PortableFile(file.name, await file.read())];
      } catch (_) {
        throw const EngineFailed('This file could not be read. It may have moved or be too large.');
      }
      final outputs = await widget.converter(action, inputs, (progress) {
        if (mounted && identical(_jobs, jobs)) setState(() => job.progress = progress);
      });
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        _jobs = [
          for (var i = 0; i < outputs.length; i++)
            _Job(outputs[i].name, outputs.length == files.length ? files[i].size : before)
              ..state = FileChipState.done
              ..output = outputs[i],
        ];
      });
    } on EngineFailed catch (error) {
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        job
          ..state = FileChipState.failed
          ..message = error.message;
      });
    } catch (error) {
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        job
          ..state = FileChipState.failed
          ..message = 'Something went wrong. This file could not be converted.';
      });
    }
  }

  String _workingName() {
    final first = _files.first.name;
    return _files.length == 1 ? first : '$first and ${_files.length - 1} more';
  }

  Future<void> _save(_Job job) async {
    final output = job.output;
    if (output == null) return;
    final bool saved;
    try {
      saved = await widget.saveFile(output);
    } catch (_) {
      if (mounted) _say('This file could not be saved. Try again.');
      return;
    }
    if (!mounted || !saved) return;
    setState(() => job.saved = true);
  }

  @override
  Widget build(BuildContext context) {
    final styles = Theme.of(context).textTheme;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560),
            child: ListView(
              shrinkWrap: true,
              padding: const EdgeInsets.all(16),
              children: [
                Text('Radial Converter', style: styles.headlineSmall, textAlign: TextAlign.center),
                const SizedBox(height: 4),
                Text(
                  'Your files stay on this device.',
                  style: styles.bodyMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Center(
                  child: FilledButton.icon(
                    onPressed: _pick,
                    icon: const Icon(Icons.upload_file),
                    label: Text(_files.isEmpty ? 'Choose files' : 'Choose other files'),
                  ),
                ),
                if (_files.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(_summary(), textAlign: TextAlign.center, style: styles.bodyMedium),
                  const SizedBox(height: 16),
                  Center(child: _buildModeSwitch()),
                ],
                const SizedBox(height: 24),
                if (_menuOpen) Center(child: _buildMenu(styles)),
                for (final job in _jobs)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Center(child: _buildChip(job)),
                  ),
                if (_files.isNotEmpty && !_menuOpen)
                  Center(
                    child: TextButton.icon(
                      onPressed: () => setState(() => _menuOpen = true),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Open the menu again'),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _summary() {
    final total = _files.fold<int>(0, (sum, file) => sum + file.size);
    final names = _files.length == 1 ? _files.first.name : '${_files.length} files';
    return '$names · ${formatBytes(total)}';
  }

  Widget _buildModeSwitch() {
    return SegmentedButton<ActionMode>(
      segments: const [
        ButtonSegment(value: ActionMode.convert, label: Text('Convert')),
        ButtonSegment(value: ActionMode.tools, label: Text('Tools')),
      ],
      selected: {_mode},
      onSelectionChanged: (selection) {
        setState(() {
          _mode = selection.single;
          _menuOpen = true;
          _jobs = const [];
        });
      },
    );
  }

  Widget _buildMenu(TextTheme styles) {
    final actions = availableActions(_kinds, _mode);
    return Column(
      children: [
        RadialMenu(
          actions: actions,
          fileCount: _files.length,
          onSelected: _start,
          onCancelled: () => setState(() => _menuOpen = false),
        ),
        if (actions.isEmpty) ...[
          const SizedBox(height: 12),
          Text(
            'This type of file is not available in this build yet.',
            textAlign: TextAlign.center,
            style: styles.bodyMedium,
          ),
        ],
      ],
    );
  }

  Widget _buildChip(_Job job) {
    final output = job.output;
    final sizes = output == null
        ? null
        : '${formatBytes(job.bytesBefore)} to ${formatBytes(output.bytes.length)}';
    return FileChip(
      name: job.name,
      state: job.state,
      progress: job.progress ?? 0,
      indeterminate: job.state == FileChipState.working && job.progress == null,
      detail: job.saved ? 'Saved. $sizes' : sizes,
      message: job.message,
      fadeAfter: null,
      onSave: output == null ? null : () => _save(job),
    );
  }
}
