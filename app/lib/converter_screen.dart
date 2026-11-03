import 'package:desktop_drop/desktop_drop.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'drop_files.dart';
import 'file_chip.dart';
import 'option_screens.dart';
import 'radial_menu.dart';

typedef FilesPicker = Future<List<PickedFile>> Function();
typedef DropReader = Future<List<PickedFile>> Function(List<DropItem> items);
typedef FileSaver = Future<bool> Function(PortableFile file);
typedef Converter = Future<List<PortableFile>> Function(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
  ActionOptions options,
);

typedef PdfConverter = Future<List<PdfResult>> Function(
  RadialAction action,
  List<PortableFile> files,
  void Function(double progress) onProgress,
);
typedef PhotoDecoder = Future<Uint8List> Function(PickedFile file);
typedef MediaConverter = Future<List<ConvertedFile>> Function(
  RadialAction action,
  List<PickedFile> files,
  List<FileKind> kinds,
  void Function(double progress) onProgress,
  ConvertControl control,
  ActionOptions options,
);

class _Job {
  _Job(this.name, this.bytesBefore);

  final String name;

  /// What this result can fairly be compared with. Null for one of many files from one archive.
  final int? bytesBefore;
  FileChipState state = FileChipState.working;
  double? progress;
  ConvertedFile? output;
  String? message;
  bool saved = false;
}

/// Pick files, choose a slice, save the result. The same screen on every platform. On desktop
/// the Shift-drag trigger will open the same menu at the cursor.
Future<List<PdfResult>> _defaultPdf(
  RadialAction action,
  List<PortableFile> files,
  void Function(double) onProgress,
) => convertPdf(action, files, onProgress);

class ConverterScreen extends StatefulWidget {
  const ConverterScreen({
    super.key,
    required this.pickFiles,
    required this.saveFile,
    this.converter = convert,
    this.mediaConverter = convertMedia,
    this.pdfConverter = _defaultPdf,
    this.photoDecoder = decodeHeic,
    this.dropReader = readDroppedFiles,
    this.mediaAvailable,
    this.acceptsDrops,
  });

  final FilesPicker pickFiles;
  final FileSaver saveFile;
  final Converter converter;
  final MediaConverter mediaConverter;
  final PdfConverter pdfConverter;
  final PhotoDecoder photoDecoder;
  final DropReader dropReader;

  /// Whether this device can run video. Null asks the platform.
  final bool? mediaAvailable;

  /// Whether files can be dropped on the window. Null asks the platform: phones have no window to
  /// drag onto, and sharing is how files arrive there.
  final bool? acceptsDrops;

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
  late final bool _mediaAvailable = widget.mediaAvailable ?? mediaEngineAvailable();
  late final bool _acceptsDrops =
      widget.acceptsDrops ??
      (kIsWeb ||
          defaultTargetPlatform == TargetPlatform.macOS ||
          defaultTargetPlatform == TargetPlatform.windows);
  bool _dragging = false;

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
    if (mounted) _open(files);
  }

  /// Files dropped on the window, which then behave as if they had been chosen.
  Future<void> _dropped(List<DropItem> items) async {
    final files = [
      for (final item in items)
        if (item is! DropItemDirectory) item,
    ];
    final leftOut = files.length < items.length;
    if (files.isEmpty) {
      if (leftOut) _say('Folders can\'t be dropped yet. Drop the files inside instead.');
      return;
    }
    final List<PickedFile> read;
    try {
      read = await widget.dropReader(files);
    } catch (_) {
      if (mounted) _say('These files could not be opened. Try again.');
      return;
    }
    if (!mounted) return;
    _open(read);
    if (leftOut) _say('Folders were left out. Drop the files inside them.');
  }

  void _open(List<PickedFile> files) {
    if (files.isEmpty) return;
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
    ActionOptions options,
  ) async {
    final isPdf = kinds.every((kind) => canRunPdf(action, kind));
    bool isPicture(FileKind kind) => canRunPortably(action, kind) || canRunDecoded(action, kind);
    if (!isPdf && !kinds.every(isPicture)) {
      return widget.mediaConverter(action, files, kinds, onProgress, control, options);
    }
    final tooLarge = _tooLarge();
    if (tooLarge != null) throw EngineFailed(tooLarge);
    final List<PortableFile> inputs;
    try {
      inputs = [
        for (var i = 0; i < files.length; i++)
          PortableFile(
            files[i].name,
            kinds[i] == FileKind.heic ? await widget.photoDecoder(files[i]) : await files[i].read(),
          ),
      ];
    } on EngineFailed {
      rethrow;
    } catch (_) {
      throw const EngineFailed('This file could not be read. It may have moved or be too large.');
    }
    if (isPdf) {
      final results = await widget.pdfConverter(action, inputs, onProgress);
      return [
        for (final result in results)
          ConvertedFile(
            name: result.file.name,
            size: result.file.bytes.length,
            inMemory: result.file,
            note: result.note,
          ),
      ];
    }
    final outputs = await widget.converter(action, inputs, onProgress, options);
    return [
      for (final output in outputs)
        ConvertedFile(name: output.name, size: output.bytes.length, inMemory: output),
    ];
  }

  /// Asks anything the action needs to know, then starts it.
  Future<void> _choose(RadialAction action) async {
    if (!needsOptions(action)) {
      await _start(action, const ActionOptions());
      return;
    }
    if (action.id == 'image-crop') {
      final tooLarge = _tooLarge();
      if (tooLarge != null) {
        _say(tooLarge);
        return;
      }
    }
    final file = _files.first;
    final kind = _kinds.first;
    final options = await askForOptions(
      context,
      action,
      loadPicture: () => _pictureToShow(file, kind),
    );
    if (options != null && mounted) await _start(action, options);
  }

  /// The picture as something the screen can draw, with its pixels where the engine will see them.
  Future<Uint8List> _pictureToShow(PickedFile file, FileKind kind) async {
    if (kind == FileKind.heic) return widget.photoDecoder(file);
    final bytes = await file.read();
    if (kind != FileKind.tiff) return bytes;
    final png = await widget.converter(
      actionById('image-to-png')!,
      [PortableFile(file.name, bytes)],
      (_) {},
      const ActionOptions(),
    );
    return png.single.bytes;
  }

  Future<void> _start(RadialAction action, ActionOptions options) async {
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
      final outputs = await _run(
        action,
        files,
        _kinds,
        (progress) {
          if (mounted && identical(_jobs, jobs)) setState(() => job.progress = progress);
        },
        control,
        options,
      );
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        _jobs = [
          for (var i = 0; i < outputs.length; i++)
            _Job(outputs[i].name, _comparedWith(outputs.length, files, i, before))
              ..state = FileChipState.done
              ..output = outputs[i]
              ..saved = outputs[i].savedPath != null,
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

  int? _comparedWith(int outputCount, List<PickedFile> files, int index, int before) {
    if (outputCount == files.length) return files[index].size;
    return outputCount < files.length ? before : null;
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
        saved = await output.download?.call() ?? false;
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
    final screen = Scaffold(
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
                if (_files.isEmpty && _acceptsDrops) ...[
                  const SizedBox(height: 12),
                  Text(
                    'or drop them anywhere here',
                    style: styles.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                ],
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
    if (!_acceptsDrops) return screen;
    return DropTarget(
      onDragEntered: (_) => setState(() => _dragging = true),
      onDragExited: (_) => setState(() => _dragging = false),
      onDragDone: (details) {
        setState(() => _dragging = false);
        _dropped(details.files);
      },
      child: Stack(fit: StackFit.expand, children: [screen, if (_dragging) _buildDropHint(styles)]),
    );
  }

  Widget _buildDropHint(TextTheme styles) {
    final colours = Theme.of(context).colorScheme;
    return IgnorePointer(
      child: ColoredBox(
        color: colours.surface.withValues(alpha: 0.92),
        child: Center(child: Text('Drop to convert', style: styles.headlineSmall)),
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
    final actions = availableActions(
      _kinds,
      _mode,
      mediaAvailable: _mediaAvailable,
      mediaOutputs: mediaOutputsHere(),
    );
    return Column(
      children: [
        RadialMenu(
          actions: actions,
          fileCount: _files.length,
          onSelected: _choose,
          onCancelled: () => setState(() => _menuOpen = false),
        ),
        if (actions.isEmpty) ...[
          const SizedBox(height: 12),
          Text(
            notAvailableMessage(_kinds, _mode),
            textAlign: TextAlign.center,
            style: styles.bodyMedium,
          ),
        ],
      ],
    );
  }

  Widget _buildChip(_Job job) {
    final output = job.output;
    final note = output?.note;
    final before = job.bytesBefore;
    final sizes = output == null
        ? null
        : '${before == null ? '' : '${formatBytes(before)} to '}${formatBytes(output.size)}'
              '${note == null ? '' : '\n$note'}';
    return FileChip(
      name: job.name,
      state: job.state,
      progress: job.progress ?? 0,
      indeterminate: job.state == FileChipState.working && job.progress == null,
      detail: output?.savedPath != null
          ? 'Saved beside the original. $sizes'
          : job.saved
          ? 'Saved. $sizes'
          : sizes,
      message: job.message,
      fadeAfter: null,
      onSave: output == null || output.savedPath != null ? null : () => _save(job),
      onCancel: job.state == FileChipState.working ? _cancel : null,
    );
  }
}
