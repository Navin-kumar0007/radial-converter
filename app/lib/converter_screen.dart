import 'dart:async';

import 'package:desktop_drop/desktop_drop.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:radial_core/radial_core.dart';

import 'conversion.dart';
import 'drop_files.dart';
import 'file_chip.dart';
import 'option_screens.dart';
import 'radial_menu.dart';
import 'shared_files.dart';
import 'shift_drag.dart';

typedef FilesPicker = Future<List<PickedFile>> Function();
typedef DropReader = Future<DroppedFiles> Function(List<DropItem> items);
typedef ShiftDragListener = void Function() Function({
  required Future<List<RadialAction>> Function(List<String> paths) menuFor,
  required void Function(RadialAction action, List<String> paths) chosen,
});
typedef FileSaver = Future<bool> Function(PortableFile file);
typedef MediaProbe = Future<MediaInfo> Function(PickedFile file);
typedef FrameReader = Future<Uint8List> Function(PickedFile file, double seconds);
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
  ActionOptions options,
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

/// As many slices as the Shift-drag menu can label readably.
const _shiftDragSlices = 8;

/// A result, and the original it belongs beside. Files can fail along the way, so position in the
/// list says nothing about that.
class _Result {
  _Result(this.output, this.from, this.bytesBefore);

  final ConvertedFile output;
  final PickedFile from;
  final int? bytesBefore;
}

class _Job {
  _Job(this.name, this.bytesBefore);

  final String name;

  /// What this result can fairly be compared with. Null for one of many files from one archive.
  final int? bytesBefore;
  FileChipState state = FileChipState.working;
  double? progress;
  ConvertedFile? output;
  PickedFile? from;
  String? message;
  bool saved = false;
}

/// Pick files, choose a slice, save the result. The same screen on every platform. On desktop
/// the Shift-drag trigger will open the same menu at the cursor.
Future<List<PdfResult>> _defaultPdf(
  RadialAction action,
  List<PortableFile> files,
  void Function(double) onProgress,
  ActionOptions options,
) => convertPdf(action, files, onProgress, options: options);

class ConverterScreen extends StatefulWidget {
  const ConverterScreen({
    super.key,
    required this.pickFiles,
    required this.saveFile,
    this.converter = convert,
    this.mediaConverter = convertMedia,
    this.pdfConverter = _defaultPdf,
    this.photoDecoder = decodeHeic,
    this.mediaProbe = probeMedia,
    this.frameReader = videoFrame,
    this.dropReader = readDroppedFiles,
    this.sharedFiles = listenForSharedFiles,
    this.shiftDrag = listenForShiftDrag,
    this.mediaAvailable,
    this.acceptsDrops,
    this.savesBeside,
  });

  final FilesPicker pickFiles;
  final FileSaver saveFile;
  final Converter converter;
  final MediaConverter mediaConverter;
  final PdfConverter pdfConverter;
  final PhotoDecoder photoDecoder;
  final MediaProbe mediaProbe;
  final FrameReader frameReader;
  final DropReader dropReader;

  /// What other apps share with this one. Called once.
  final Stream<SharedFiles> Function() sharedFiles;

  /// Starts listening for the system-wide Shift-drag menu, and returns how to stop.
  final ShiftDragListener shiftDrag;

  /// Whether this device can run video. Null asks the platform.
  final bool? mediaAvailable;

  /// Whether files can be dropped on the window. Null asks the platform: phones have no window to
  /// drag onto, and sharing is how files arrive there.
  final bool? acceptsDrops;

  /// Whether many results can go straight beside their originals. Null asks the platform: a phone's
  /// copies sit in a cache nobody would look in, and a browser has no folders to write to.
  final bool? savesBeside;

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
  late final bool _savesBeside =
      widget.savesBeside ??
      (!kIsWeb &&
          (defaultTargetPlatform == TargetPlatform.macOS ||
              defaultTargetPlatform == TargetPlatform.windows));
  bool _savingAll = false;
  bool _dragging = false;
  bool _receiving = false;
  late final StreamSubscription<SharedFiles> _shares;
  late final void Function() _stopShiftDrag;

  @override
  void initState() {
    super.initState();
    _shares = widget.sharedFiles().listen(_shared);
    _stopShiftDrag = widget.shiftDrag(menuFor: _menuFor, chosen: _chosenFromShiftDrag);
  }

  @override
  void dispose() {
    _shares.cancel();
    _stopShiftDrag();
    super.dispose();
  }

  /// What the Shift-drag menu offers. It has room for few slices, and a drag can't stop to ask
  /// questions, so actions that ask first are left out.
  Future<List<RadialAction>> _menuFor(List<String> paths) async {
    final List<PickedFile> files;
    try {
      files = (await _readDrop([for (final path in paths) DropItemFile(path)])).files;
    } catch (_) {
      return const [];
    }
    final kinds = [for (final file in files) detectKind(file.head, fileName: file.name)];
    return availableActions(
      kinds,
      ActionMode.convert,
      mediaAvailable: _mediaAvailable,
      mediaOutputs: mediaOutputsHere(),
    ).where((action) => !needsOptions(action)).take(_shiftDragSlices).toList();
  }

  /// A slice was chosen outside the window, so results go straight beside the originals.
  Future<void> _chosenFromShiftDrag(RadialAction action, List<String> paths) async {
    final List<PickedFile> files;
    try {
      files = (await _readDrop([for (final path in paths) DropItemFile(path)])).files;
    } catch (_) {
      showAppWindow();
      if (mounted) _say('These files could not be opened. Try again.');
      return;
    }
    if (!mounted) return;
    _open(files);
    await _start(action, const ActionOptions(), saveBeside: true);
  }

  /// Saves results held in memory next to what they came from. Video is already there.
  Future<List<_Result>> _saveBeside(List<_Result> results) async {
    final saved = <_Result>[];
    for (final result in results) {
      final inMemory = result.output.inMemory;
      final original = result.from.path;
      if (inMemory == null || original == null) {
        saved.add(result);
        continue;
      }
      final path = await saveBesideOriginal(original, inMemory);
      saved.add(_Result(_savedAt(result.output, path), result.from, result.bytesBefore));
    }
    return saved;
  }

  ConvertedFile _savedAt(ConvertedFile output, String path) {
    return ConvertedFile(
      name: output.name,
      size: output.size,
      inMemory: output.inMemory,
      savedPath: path,
      note: output.note,
    );
  }

  void _shared(SharedFiles shared) {
    if (!mounted) return;
    setState(() => _receiving = shared.receiving);
    if (shared.receiving) return;
    _open(shared.files);
    if (shared.failed > 0) {
      _say(
        shared.files.isEmpty
            ? 'What was shared could not be opened. Only files can be converted.'
            : 'Some of what was shared could not be opened.',
      );
    }
  }

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

  /// What a drop opens. Files from folders are narrowed to those that can go together.
  Future<({List<PickedFile> files, int leftOut, DroppedFiles dropped})> _readDrop(
    List<DropItem> items,
  ) async {
    final dropped = await widget.dropReader(items);
    final inFolders = dropped.inFolders;
    final kept = pickFromFolder([
      for (final file in inFolders) detectKind(file.head, fileName: file.name),
    ], canUse: _canUse);
    return (
      files: [...dropped.loose, for (final i in kept) inFolders[i]],
      leftOut: inFolders.length - kept.length,
      dropped: dropped,
    );
  }

  bool _canUse(FileKind kind) {
    return ActionMode.values.any((mode) {
      return availableActions(
        [kind],
        mode,
        mediaAvailable: _mediaAvailable,
        mediaOutputs: mediaOutputsHere(),
      ).isNotEmpty;
    });
  }

  /// Files dropped on the window, which then behave as if they had been chosen.
  Future<void> _dropped(List<DropItem> items) async {
    final ({List<PickedFile> files, int leftOut, DroppedFiles dropped}) read;
    try {
      read = await _readDrop(items);
    } catch (_) {
      if (mounted) _say('These files could not be opened. Try again.');
      return;
    }
    if (!mounted) return;
    if (read.files.isEmpty) {
      if (read.dropped.folders > 0) _say('Nothing in that folder can be converted.');
      return;
    }
    _open(read.files);
    if (read.dropped.tooMany) {
      _say('Only the first $maxFolderFiles files in that folder were looked at.');
    } else if (read.leftOut == 1) {
      _say('1 other file in that folder was left out.');
    } else if (read.leftOut > 1) {
      _say('${read.leftOut} other files in that folder were left out.');
    }
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
    var total = 0;
    for (final file in _files) {
      if (file.size > maxInMemoryBytes) {
        return '${file.name} is too large to convert here (limit '
            '${formatBytes(maxInMemoryBytes)}).';
      }
      total += file.size;
    }
    if (total <= maxInMemoryBytes) return null;
    return 'These files are too large to convert together (limit '
        '${formatBytes(maxInMemoryBytes)}). Try fewer at a time.';
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

  /// True if these are worked on whole in memory, rather than piece by piece as video is.
  bool _inMemory(RadialAction action, List<FileKind> kinds) {
    return kinds.every((kind) {
      return canRunPdf(action, kind) || canRunPortably(action, kind) || canRunDecoded(action, kind);
    });
  }

  /// Runs each file alone unless the action combines them. So one damaged file costs only itself,
  /// joining [failed], and only one file is held in memory on its way in.
  Future<List<_Result>> _run(
    RadialAction action,
    List<PickedFile> files,
    List<FileKind> kinds,
    void Function(double) onProgress,
    ConvertControl control,
    ActionOptions options, {
    required List<_Job> failed,
    required bool Function() wanted,
    required bool outsideTheWindow,
  }) async {
    if (_inMemory(action, kinds)) {
      final tooLarge = _tooLarge();
      if (tooLarge != null) throw EngineFailed(tooLarge);
    }

    // Files in a batch often share a password, so one that worked is tried on the next before
    // asking. It lasts only as long as this job.
    String? remembered;
    Future<List<_Result>> unlocking(
      List<PickedFile> some,
      List<FileKind> theirKinds,
      void Function(double) progress,
    ) async {
      var current = remembered == null ? options : options.withPassword(remembered!);
      var typedOne = false;
      while (true) {
        try {
          return await _runTogether(action, some, theirKinds, progress, control, current);
        } on PasswordNeeded catch (needed) {
          if (!wanted()) throw const JobCancelled();
          if (outsideTheWindow) showAppWindow();
          if (!mounted) rethrow;
          final password = await askForPassword(context, needed.fileName, wrong: typedOne);
          if (password == null) rethrow;
          if (!wanted()) throw const JobCancelled();
          typedOne = true;
          remembered = password;
          current = options.withPassword(password);
        }
      }
    }

    if (files.length == 1 || combinesFiles(action)) {
      return unlocking(files, kinds, onProgress);
    }
    _Job failure(PickedFile file, String message) {
      return _Job(file.name, null)
        ..state = FileChipState.failed
        ..message = message;
    }

    final results = <_Result>[];
    for (var i = 0; i < files.length; i++) {
      if (!wanted()) throw const JobCancelled();
      try {
        results.addAll(
          await unlocking(
            [files[i]],
            [kinds[i]],
            (progress) => onProgress((i + progress) / files.length),
          ),
        );
      } on JobCancelled {
        rethrow;
      } on EngineFailed catch (error) {
        failed.add(failure(files[i], error.message));
      } catch (_) {
        failed.add(failure(files[i], 'Something went wrong. This file could not be converted.'));
      }
    }
    return results;
  }

  /// Pictures and subtitles in memory, or video and audio piece by piece.
  Future<List<_Result>> _runTogether(
    RadialAction action,
    List<PickedFile> files,
    List<FileKind> kinds,
    void Function(double) onProgress,
    ConvertControl control,
    ActionOptions options,
  ) async {
    final before = files.fold<int>(0, (sum, file) => sum + file.size);
    List<_Result> matched(List<ConvertedFile> outputs) {
      return [
        for (var i = 0; i < outputs.length; i++)
          outputs.length == files.length
              ? _Result(outputs[i], files[i], files[i].size)
              : _Result(outputs[i], files.first, outputs.length < files.length ? before : null),
      ];
    }

    final isPdf = kinds.every((kind) => canRunPdf(action, kind));
    if (!_inMemory(action, kinds)) {
      return matched(
        await widget.mediaConverter(action, files, kinds, onProgress, control, options),
      );
    }
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
      final results = await widget.pdfConverter(action, inputs, onProgress, options);
      return matched([
        for (final result in results)
          ConvertedFile(
            name: result.file.name,
            size: result.file.bytes.length,
            inMemory: result.file,
            note: result.note,
          ),
      ]);
    }
    final outputs = await widget.converter(action, inputs, onProgress, options);
    return matched([
      for (final output in outputs)
        ConvertedFile(name: output.name, size: output.bytes.length, inMemory: output),
    ]);
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
      trimPreview: TrimPreview(
        seconds: () async => (await widget.mediaProbe(file)).seconds,
        frameAt: kind.family == FileFamily.video
            ? (seconds) => widget.frameReader(file, seconds)
            : null,
      ),
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

  Future<void> _start(RadialAction action, ActionOptions options, {bool saveBeside = false}) async {
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
    final failed = <_Job>[];
    try {
      var results = await _run(
        action,
        files,
        _kinds,
        (progress) {
          if (mounted && identical(_jobs, jobs)) setState(() => job.progress = progress);
        },
        control,
        options,
        failed: failed,
        wanted: () => mounted && identical(_jobs, jobs),
        outsideTheWindow: saveBeside,
      );
      if (saveBeside) {
        results = await _saveBeside(results);
        if (failed.isNotEmpty) showAppWindow();
      }
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        _jobs = [
          for (final result in results)
            _Job(result.output.name, result.bytesBefore)
              ..state = FileChipState.done
              ..output = result.output
              ..from = result.from
              ..saved = result.output.savedPath != null,
          ...failed,
        ];
      });
    } on JobCancelled {
      // The screen already moved on.
    } on EngineFailed catch (error) {
      if (saveBeside) showAppWindow();
      if (!mounted || !identical(_jobs, jobs)) return;
      setState(() {
        job
          ..state = FileChipState.failed
          ..message = error.message;
      });
    } catch (error) {
      if (saveBeside) showAppWindow();
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
        saved = await output.download?.call() ?? false;
      }
    } catch (_) {
      if (mounted) _say('This file could not be saved. Try again.');
      return;
    }
    if (!mounted || !saved) return;
    setState(() => job.saved = true);
  }

  /// Results that have no home yet and can be saved with others. Video brings its own way to save.
  List<_Job> get _waitingToSave => [
    for (final job in _jobs)
      if (job.output?.inMemory != null && job.output?.savedPath == null && !job.saved) job,
  ];

  /// Beside the originals where there's a folder to write to. Elsewhere one ZIP, as each file would
  /// otherwise ask where to go.
  Future<void> _saveAll() async {
    final waiting = _waitingToSave;
    setState(() => _savingAll = true);
    try {
      if (_savesBeside) {
        for (final job in waiting) {
          final output = job.output!;
          final path = await saveBesideOriginal(job.from!.path!, output.inMemory!);
          if (!mounted) return;
          setState(() {
            job
              ..output = _savedAt(output, path)
              ..saved = true;
          });
        }
      } else {
        final saved = await widget.saveFile(
          zipFiles([for (final job in waiting) job.output!.inMemory!]),
        );
        if (!mounted || !saved) return;
        setState(() {
          for (final job in waiting) {
            job.saved = true;
          }
        });
      }
    } on EngineFailed catch (error) {
      if (mounted) _say(error.message);
    } catch (_) {
      if (mounted) _say('These files could not be saved. Try again.');
    } finally {
      if (mounted) setState(() => _savingAll = false);
    }
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
                if (_receiving) ...[
                  const SizedBox(height: 24),
                  const Center(child: CircularProgressIndicator()),
                  const SizedBox(height: 12),
                  Text(
                    'Getting what you shared...',
                    style: styles.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                ],
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
                if (_waitingToSave.length > 1)
                  Center(
                    child: FilledButton.tonalIcon(
                      onPressed: _savingAll ? null : _saveAll,
                      icon: const Icon(Icons.save_alt),
                      label: Text(
                        _savesBeside ? 'Save all beside the originals' : 'Save all as one ZIP',
                      ),
                    ),
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
