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

typedef MediaConverter = Future<List<ConvertedFile>> Function(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control,
);

class _Job {
  _Job(this.name, this.bytesBefore);

  final String name;
  final int bytesBefore;
  FileChipState state = FileChipState.working;
  double? progress;
  ConvertedFile? output;
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
    this.mediaConverter = convertMedia,
    this.mediaAvailable = mediaEngineAvailable,
  });

  final FilesPicker pickFiles;
  final FileSaver saveFile;
  final Converter converter;
  final MediaConverter mediaConverter;
  final bool mediaAvailable;

  @override
  State<ConverterScreen> createState() => _ConverterScreenState();
}

class _ConverterScreenState extends State<ConverterScreen> {
  List<PickedFile> _files = const [];
  List<FileKind> _kinds = const [];
  ActionMode _mode = ActionMode.convert;
  bool _menuOpen = false;
  List<_Job> _jobs = const [];
  ConvertControl? _control;

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
    _stopRunningJob();
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

  void _stopRunningJob() {
    _control?.cancel?.call();
    _control = null;
  }

  void _cancel() {
    _stopRunningJob();
    setState(() {
      _jobs = const [];
      _menuOpen = true;
    });
  }

  /// Pictures and subtitles in memory, or video and audio piece by piece.
  Future<List<ConvertedFile>> _run(
    RadialAction action,
    List<PickedFile> files,
    List<FileKind> kinds,
    void Function(double) onProgress,
    ConvertControl control,
  ) async {
    if (!kinds.every((kind) => canRunPortably(action, kind))) {
      return widget.mediaConverter(action, files, kinds, onProgress, control);
    }
    final tooLarge = _tooLarge();
    if (tooLarge != null) throw EngineFailed(tooLarge);
    final List<PortableFile> inputs;
    try {
      inputs = [for (final file in files) PortableFile(file.name, await file.read())];
    } catch (_) {
      throw const EngineFailed('This file could not be read. It may have moved or be too large.');
    }
    final outputs = await widget.converter(action, inputs, onProgress);
    return [
      for (final output in outputs)
        ConvertedFile(name: output.name, size: output.bytes.length, inMemory: output),
    ];
  }

  Future<void> _start(RadialAction action) async {
    final before = _files.fold<int>(0, (sum, file) => sum + file.size);
    final files = _files;
    final jobs = [_Job(_workingName(), before)];
    final control = ConvertControl();
    _stopRunningJob();
    _control = control;
    setState(() {
      _menuOpen = false;
      _jobs = jobs;
    });
    final job = jobs.single;
    try {
      final outputs = await _run(action, files, _kinds, (progress) {
        if (mounted && identical(_jobs, jobs)) setState(() => job.progress = progress);
      }, control);
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        _jobs = [
          for (var i = 0; i < outputs.length; i++)
            _Job(outputs[i].name, outputs.length == files.length ? files[i].size : before)
              ..state = FileChipState.done
              ..output = outputs[i],
        ];
      });
    } on JobCancelled {
      // The screen already moved on.
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
      final inMemory = output.inMemory;
      if (inMemory != null) {
        saved = await widget.saveFile(inMemory);
      } else {
        output.download?.call();
        saved = true;
      }
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
    final actions = availableActions(_kinds, _mode, mediaAvailable: widget.mediaAvailable);
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
        : '${formatBytes(job.bytesBefore)} to ${formatBytes(output.size)}';
    return FileChip(
      name: job.name,
      state: job.state,
      progress: job.progress ?? 0,
      indeterminate: job.state == FileChipState.working && job.progress == null,
      detail: job.saved ? 'Saved. $sizes' : sizes,
      message: job.message,
      fadeAfter: null,
      onSave: output == null ? null : () => _save(job),
      onCancel: job.state == FileChipState.working ? _cancel : null,
    );
  }
}
