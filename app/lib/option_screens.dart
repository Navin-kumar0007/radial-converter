import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

import 'words.dart';

const _askFirst = {
  'image-crop',
  'subtitle-shift',
  'video-trim',
  'audio-trim',
  'archive-add-password',
  'image-form',
};

/// True if the user must choose something before [action] can run.
bool needsOptions(RadialAction action) => _askFirst.contains(action.id);

/// Asks what [action] needs, or returns null if the user changed their mind. [loadPicture] is only
/// called for a crop.
Future<ActionOptions?> askForOptions(
  BuildContext context,
  RadialAction action, {
  required Future<Uint8List> Function() loadPicture,
  TrimPreview? trimPreview,
  Future<List<Preset>> Function()? loadPresets,
  int fileCount = 1,
}) async {
  if (action.id == 'image-form') {
    return _askForForm(context, loadPicture, loadPresets, fileCount);
  }
  return showDialog<ActionOptions>(
    context: context,
    builder: (context) => switch (action.id) {
      'image-crop' => CropDialog(loadPicture: loadPicture),
      'subtitle-shift' => const ShiftDialog(),
      'archive-add-password' => const AddPasswordDialog(),
      _ => TrimDialog(preview: trimPreview),
    },
  );
}

/// What the form wants, then what part of the photo to use. Many files can't each stop to be
/// framed, so those use their middles.
Future<ActionOptions?> _askForForm(
  BuildContext context,
  Future<Uint8List> Function() loadPicture,
  Future<List<Preset>> Function()? loadPresets,
  int fileCount,
) async {
  final form = await showDialog<FormTarget>(
    context: context,
    builder: (context) => FormDialog(loadPresets: loadPresets),
  );
  if (form == null) return null;
  if (fileCount > 1 || !context.mounted) return ActionOptions(form: form);
  final width = form.width;
  final height = form.height;
  final framed = await showDialog<ActionOptions>(
    context: context,
    builder: (context) => CropDialog(
      loadPicture: loadPicture,
      shape: width != null && height != null ? width / height : null,
    ),
  );
  if (framed == null) return null;
  return ActionOptions(form: form, crop: framed.crop);
}

/// What a form wants a picture to be. A preset only fills in the boxes, since forms change their
/// rules and every one of these numbers may need correcting.
class FormDialog extends StatefulWidget {
  const FormDialog({super.key, this.loadPresets});

  final Future<List<Preset>> Function()? loadPresets;

  @override
  State<FormDialog> createState() => _FormDialogState();
}

class _FormDialogState extends State<FormDialog> {
  final _width = TextEditingController();
  final _height = TextEditingController();
  final _atLeast = TextEditingController();
  final _atMost = TextEditingController();
  List<Preset> _presets = const [];
  Preset? _chosen;
  String? _pixelsError;
  String? _sizeError;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _width.dispose();
    _height.dispose();
    _atLeast.dispose();
    _atMost.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final load = widget.loadPresets;
    if (load == null) return;
    try {
      final presets = await load();
      if (mounted) setState(() => _presets = presets);
    } catch (error) {
      debugPrint('Could not load presets: $error');
    }
  }

  void _choose(Preset? preset) {
    setState(() {
      _chosen = preset;
      _pixelsError = null;
      _sizeError = null;
      final output = preset?.output;
      _width.text = '${output?.width ?? ''}';
      _height.text = '${output?.height ?? ''}';
      final atLeast = output?.minBytes;
      final atMost = output?.maxBytes;
      _atLeast.text = atLeast == null ? '' : '${formMinKb(atLeast)}';
      _atMost.text = atMost == null ? '' : '${formMaxKb(atMost)}';
    });
  }

  void _finish() {
    final words = context.words;
    int? read(TextEditingController field) => int.tryParse(field.text.trim());
    final width = read(_width);
    final height = read(_height);
    final atLeast = read(_atLeast);
    final atMost = read(_atMost);
    setState(() {
      _pixelsError = (width == null) != (height == null) ? words.giveBoth : null;
      if ((width ?? 1) < 1 || (height ?? 1) < 1) _pixelsError = words.theseAboveZero;
      if ((width ?? 0) > 10000 || (height ?? 0) > 10000) _pixelsError = words.theseTooLarge;
      _sizeError = atLeast != null && atMost != null && atLeast > atMost
          ? words.smallestOverLargest
          : atMost == 0
          ? words.thisAboveZero
          : null;
    });
    if (_pixelsError != null || _sizeError != null) return;
    Navigator.of(context).pop(
      FormTarget(
        width: width,
        height: height,
        minBytes: atLeast == null || atLeast == 0 ? null : formMinBytes(atLeast),
        maxBytes: atMost == null ? null : formMaxBytes(atMost),
      ),
    );
  }

  Widget _number(TextEditingController field, String label, {String? errorText}) {
    return Expanded(
      child: TextField(
        controller: field,
        keyboardType: TextInputType.number,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        decoration: InputDecoration(labelText: label, errorText: errorText, errorMaxLines: 2),
        onChanged: (_) {
          // Changed by hand, it's no longer what the preset says, so its source no longer applies.
          if (_chosen != null) setState(() => _chosen = null);
        },
        onSubmitted: (_) => _finish(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final styles = Theme.of(context).textTheme;
    final chosen = _chosen;
    return AlertDialog(
      title: Text(context.words.formPhoto),
      content: SizedBox(
        width: 420,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_presets.isNotEmpty) ...[
                DropdownButtonFormField<Preset?>(
                  initialValue: chosen,
                  isExpanded: true,
                  decoration: InputDecoration(labelText: context.words.fillInFrom),
                  items: [
                    DropdownMenuItem(child: Text(context.words.myOwnSizes)),
                    for (final preset in _presets)
                      DropdownMenuItem(
                        value: preset,
                        child: Text(
                          preset.label(context.words.localeName),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                  ],
                  onChanged: _choose,
                ),
                const SizedBox(height: 16),
              ],
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _number(_width, context.words.widthPixels, errorText: _pixelsError),
                  const SizedBox(width: 12),
                  _number(_height, context.words.heightPixels),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _number(_atLeast, context.words.atLeastKb, errorText: _sizeError),
                  const SizedBox(width: 12),
                  _number(_atMost, context.words.atMostKb),
                ],
              ),
              const SizedBox(height: 16),
              if (chosen != null) ...[
                if (chosen.note != null) Text(chosen.note!, style: styles.bodySmall),
                const SizedBox(height: 4),
                if (chosen.source != null) SelectableText(chosen.source!, style: styles.bodySmall),
                const SizedBox(height: 8),
              ],
              Text(context.words.checkNotice, style: styles.bodySmall),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(context.words.cancel)),
        FilledButton(onPressed: _finish, child: Text(context.words.next)),
      ],
    );
  }
}

/// Asks what opens [fileName], or returns null if the user would rather not.
Future<String?> askForPassword(BuildContext context, String fileName, {required bool wrong}) {
  return showDialog<String>(
    context: context,
    builder: (context) => PasswordDialog(fileName: fileName, wrong: wrong),
  );
}

/// A password box whose text stays hidden unless asked for, and is never suggested or remembered.
class _PasswordField extends StatefulWidget {
  const _PasswordField({
    required this.controller,
    required this.label,
    this.errorText,
    this.autofocus = false,
    this.onSubmitted,
  });

  final TextEditingController controller;
  final String label;
  final String? errorText;
  final bool autofocus;
  final void Function(String)? onSubmitted;

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool _hidden = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: widget.controller,
      autofocus: widget.autofocus,
      obscureText: _hidden,
      autocorrect: false,
      enableSuggestions: false,
      decoration: InputDecoration(
        labelText: widget.label,
        errorText: widget.errorText,
        // Tab goes on to the next box. This stays a click away, and in reach of a screen reader.
        suffixIcon: ExcludeFocusTraversal(
          child: IconButton(
            tooltip: _hidden ? context.words.showPassword : context.words.hidePassword,
            icon: Icon(_hidden ? Icons.visibility_outlined : Icons.visibility_off_outlined),
            onPressed: () => setState(() => _hidden = !_hidden),
          ),
        ),
      ),
      onSubmitted: widget.onSubmitted,
    );
  }
}

/// What opens a locked file.
class PasswordDialog extends StatefulWidget {
  const PasswordDialog({super.key, required this.fileName, required this.wrong});

  final String fileName;

  /// The last password typed didn't open it.
  final bool wrong;

  @override
  State<PasswordDialog> createState() => _PasswordDialogState();
}

class _PasswordDialogState extends State<PasswordDialog> {
  final _password = TextEditingController();
  String? _error;

  bool _toldWrong = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (widget.wrong && !_toldWrong) {
      _toldWrong = true;
      _error = context.words.wrongPassword;
    }
  }

  @override
  void dispose() {
    _password.dispose();
    super.dispose();
  }

  void _finish() {
    if (_password.text.isEmpty) {
      setState(() => _error = context.words.typePassword);
      return;
    }
    Navigator.of(context).pop(_password.text);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.words.fileLocked),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.words.needsPassword(widget.fileName)),
          const SizedBox(height: 16),
          _PasswordField(
            controller: _password,
            label: context.words.password,
            errorText: _error,
            autofocus: true,
            onSubmitted: (_) => _finish(),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(context.words.cancel)),
        FilledButton(onPressed: _finish, child: Text(context.words.open)),
      ],
    );
  }
}

/// What a new locked file should open with, typed twice since a mistake here can't be undone.
class AddPasswordDialog extends StatefulWidget {
  const AddPasswordDialog({super.key});

  @override
  State<AddPasswordDialog> createState() => _AddPasswordDialogState();
}

class _AddPasswordDialogState extends State<AddPasswordDialog> {
  final _password = TextEditingController();
  final _again = TextEditingController();
  String? _error;
  String? _againError;

  @override
  void dispose() {
    _password.dispose();
    _again.dispose();
    super.dispose();
  }

  void _finish() {
    setState(() {
      _error = _password.text.isEmpty ? context.words.choosePassword : null;
      _againError = _error == null && _again.text != _password.text
          ? context.words.passwordsDiffer
          : null;
    });
    if (_error != null || _againError != null) return;
    Navigator.of(context).pop(ActionOptions(newPassword: _password.text));
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.words.addPassword),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.words.addPasswordWarning),
          const SizedBox(height: 16),
          _PasswordField(
            controller: _password,
            label: context.words.password,
            errorText: _error,
            autofocus: true,
          ),
          const SizedBox(height: 16),
          _PasswordField(
            controller: _again,
            label: context.words.samePasswordAgain,
            errorText: _againError,
            onSubmitted: (_) => _finish(),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(context.words.cancel)),
        FilledButton(onPressed: _finish, child: Text(context.words.addPassword)),
      ],
    );
  }
}

/// How far to move subtitles, and which way.
class ShiftDialog extends StatefulWidget {
  const ShiftDialog({super.key});

  @override
  State<ShiftDialog> createState() => _ShiftDialogState();
}

class _ShiftDialogState extends State<ShiftDialog> {
  final _seconds = TextEditingController(text: '1');
  bool _later = true;
  String? _error;

  @override
  void dispose() {
    _seconds.dispose();
    super.dispose();
  }

  void _finish() {
    final seconds = double.tryParse(_seconds.text.trim());
    if (seconds == null || seconds <= 0) {
      setState(() => _error = context.words.secondsHint);
      return;
    }
    final milliseconds = (seconds * 1000).round();
    Navigator.of(context)
        .pop(ActionOptions(shift: Duration(milliseconds: _later ? milliseconds : -milliseconds)));
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(context.words.shiftTiming),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _seconds,
            autofocus: true,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(labelText: context.words.seconds, errorText: _error),
            onSubmitted: (_) => _finish(),
          ),
          const SizedBox(height: 16),
          SegmentedButton<bool>(
            segments: [
              ButtonSegment(value: true, label: Text(context.words.later)),
              ButtonSegment(value: false, label: Text(context.words.earlier)),
            ],
            selected: {_later},
            onSelectionChanged: (selection) => setState(() => _later = selection.single),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(context.words.cancel)),
        FilledButton(onPressed: _finish, child: Text(context.words.shift)),
      ],
    );
  }
}

/// Which part of a video or sound file to keep.
class TrimDialog extends StatefulWidget {
  const TrimDialog({super.key, this.preview});

  /// What can be shown of the file. Without it, or if it fails, times can still be typed.
  final TrimPreview? preview;

  @override
  State<TrimDialog> createState() => _TrimDialogState();
}

/// What the trim screen can look at. Audio has no frames.
class TrimPreview {
  const TrimPreview({required this.seconds, this.frameAt});

  final Future<double> Function() seconds;
  final Future<Uint8List> Function(double seconds)? frameAt;
}

/// The frame shown for one end. Dragging asks far faster than frames arrive, so only the newest wish
/// waits while one is being fetched.
class _FrameSlot {
  Uint8List? frame;
  double? wanted;
  bool busy = false;
}

class _TrimDialogState extends State<TrimDialog> {
  final _from = TextEditingController();
  final _to = TextEditingController();
  final _startSlot = _FrameSlot();
  final _endSlot = _FrameSlot();
  double? _length;
  RangeValues _range = const RangeValues(0, 1);
  String? _fromError;
  String? _toError;

  @override
  void initState() {
    super.initState();
    _readLength();
  }

  @override
  void dispose() {
    _from.dispose();
    _to.dispose();
    super.dispose();
  }

  Future<void> _readLength() async {
    final preview = widget.preview;
    if (preview == null) return;
    final double length;
    try {
      length = await preview.seconds();
    } catch (error) {
      debugPrint('Could not read how long this is: $error');
      return;
    }
    if (!mounted || length <= 0) return;
    setState(() {
      _length = length;
      _syncRange();
    });
    _want(_startSlot, _range.start);
    _want(_endSlot, _range.end);
  }

  void _want(_FrameSlot slot, double seconds) {
    if (widget.preview?.frameAt == null) return;
    slot.wanted = seconds;
    if (!slot.busy) _fetch(slot);
  }

  Future<void> _fetch(_FrameSlot slot) async {
    slot.busy = true;
    while (slot.wanted != null && mounted) {
      final seconds = slot.wanted!;
      slot.wanted = null;
      try {
        final frame = await widget.preview!.frameAt!(seconds);
        if (mounted) setState(() => slot.frame = frame);
      } catch (error) {
        debugPrint('Could not read a frame: $error');
      }
    }
    if (!mounted) return;
    setState(() => slot.busy = false);
  }

  /// Moves the slider to what is typed. Whatever isn't a time leaves its end where it was.
  void _syncRange() {
    final length = _length;
    if (length == null) return;
    final fromText = _from.text.trim();
    final toText = _to.text.trim();
    final from = fromText.isEmpty ? 0.0 : parseClock(fromText) ?? _range.start;
    final to = toText.isEmpty ? length : parseClock(toText) ?? _range.end;
    final start = from.clamp(0.0, length);
    _range = RangeValues(start, to.clamp(start, length));
  }

  void _typed() {
    final length = _length;
    if (length == null) return;
    final before = _range;
    setState(_syncRange);
    if (_range.start != before.start) _want(_startSlot, _range.start);
    if (_range.end != before.end) _want(_endSlot, _range.end);
  }

  void _dragged(RangeValues values) {
    final length = _length!;
    double tenth(double seconds) => (seconds * 10).round() / 10;
    final start = values.start == 0 ? 0.0 : tenth(values.start);
    final end = values.end == length ? length : tenth(values.end).clamp(start, length);
    final before = _range;
    setState(() {
      _range = RangeValues(start, end);
      _from.text = start == 0 ? '' : formatClock(start);
      _to.text = end == length ? '' : formatClock(end);
      _fromError = null;
      _toError = null;
    });
    if (start != before.start) _want(_startSlot, start);
    if (end != before.end) _want(_endSlot, end);
  }

  void _finish() {
    final words = context.words;
    final useTime = words.useTime;
    final fromText = _from.text.trim();
    final toText = _to.text.trim();
    final from = parseClock(fromText);
    final to = parseClock(toText);
    final fromBad = fromText.isNotEmpty && from == null;
    final toBad = toText.isNotEmpty && to == null;
    final length = _length;
    setState(() {
      _fromError = fromBad ? useTime : null;
      _toError = toBad ? useTime : null;
      if (fromBad || toBad) return;
      if (from == null && to == null) {
        _fromError = words.chooseStartOrEnd;
      } else if (from != null && length != null && from >= length) {
        _fromError = words.onlyThisLong(formatClock(length));
      } else if (from != null && to != null && to <= from) {
        _toError = words.afterStart;
      }
    });
    if (_fromError != null || _toError != null) return;
    Navigator.of(context).pop(ActionOptions(startSeconds: from, endSeconds: to));
  }

  Widget _buildFrame(String label, String described, _FrameSlot slot) {
    final styles = Theme.of(context);
    final frame = slot.frame;
    return Expanded(
      child: Column(
        children: [
          SizedBox(
            height: 96,
            width: double.infinity,
            child: ColoredBox(
              color: styles.colorScheme.surfaceContainerHighest,
              child: frame != null
                  ? Image.memory(
                      frame,
                      fit: BoxFit.contain,
                      gaplessPlayback: true,
                      semanticLabel: described,
                    )
                  : Center(
                      child: slot.busy
                          ? const SizedBox.square(
                              dimension: 24,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.movie_outlined),
                    ),
            ),
          ),
          const SizedBox(height: 4),
          Text(label, style: styles.textTheme.bodySmall),
        ],
      ),
    );
  }

  List<Widget> _buildPreview(double length) {
    return [
      if (widget.preview?.frameAt != null) ...[
        Row(
          children: [
            _buildFrame(context.words.start, context.words.videoAtStart, _startSlot),
            const SizedBox(width: 8),
            _buildFrame(context.words.end, context.words.videoAtEnd, _endSlot),
          ],
        ),
        const SizedBox(height: 8),
      ],
      RangeSlider(
        values: _range,
        max: length,
        labels: RangeLabels(formatClock(_range.start), formatClock(_range.end)),
        semanticFormatterCallback: formatClock,
        onChanged: _dragged,
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [Text(formatClock(_range.start)), Text(formatClock(_range.end))],
        ),
      ),
      const SizedBox(height: 8),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final length = _length;
    return AlertDialog(
      title: Text(context.words.trim),
      content: SizedBox(
        width: 420,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (length != null) ..._buildPreview(length),
              TextField(
                controller: _from,
                autofocus: length == null,
                decoration: InputDecoration(
                  labelText: context.words.start,
                  hintText: '0:00',
                  helperText: context.words.emptyFromBeginning,
                  errorText: _fromError,
                ),
                onChanged: (_) => _typed(),
                onSubmitted: (_) => _finish(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _to,
                decoration: InputDecoration(
                  labelText: context.words.end,
                  hintText: '1:30',
                  helperText: context.words.emptyToEnd,
                  errorText: _toError,
                ),
                onChanged: (_) => _typed(),
                onSubmitted: (_) => _finish(),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: Text(context.words.cancel)),
        FilledButton(onPressed: _finish, child: Text(context.words.trim)),
      ],
    );
  }
}

/// The crop frame after dragging [handle] by [by], keeping its [shape], a width over a height, as
/// a form that sets a pixel size needs. The corner opposite stays put.
Rect moveCropKeepingShape(
  Rect area,
  CropHandle handle,
  Offset by,
  Size picture,
  double shape, {
  double minSide = 8,
}) {
  if (handle == CropHandle.move) return moveCrop(area, handle, by, picture);
  final onLeft = handle == CropHandle.topLeft || handle == CropHandle.bottomLeft;
  final onTop = handle == CropHandle.topLeft || handle == CropHandle.topRight;
  final fixedX = onLeft ? area.right : area.left;
  final fixedY = onTop ? area.bottom : area.top;
  final grownX = onLeft ? -by.dx : by.dx;
  final grownY = onTop ? -by.dy : by.dy;
  // Whichever way the drag went further decides, so a drag in either direction does something.
  final wanted = grownX.abs() >= (grownY * shape).abs()
      ? area.width + grownX
      : (area.height + grownY) * shape;
  final roomX = onLeft ? fixedX : picture.width - fixedX;
  final roomY = onTop ? fixedY : picture.height - fixedY;
  final most = math.min(roomX, roomY * shape);
  final least = math.min(most, math.max(minSide, minSide * shape));
  final width = wanted.clamp(least, most);
  final height = width / shape;
  return Rect.fromLTWH(
    onLeft ? fixedX - width : fixedX,
    onTop ? fixedY - height : fixedY,
    width,
    height,
  );
}

/// The largest frame of this [shape] that fits [picture], in its middle.
Rect largestCrop(Size picture, double shape) {
  final width = math.min(picture.width, picture.height * shape);
  final height = width / shape;
  return Rect.fromLTWH((picture.width - width) / 2, (picture.height - height) / 2, width, height);
}

/// What dragging can take hold of.
enum CropHandle { move, topLeft, topRight, bottomLeft, bottomRight }

/// The crop frame after dragging [handle] by [by], in the picture's pixels. It stays inside the
/// picture and never gets smaller than [minSide]. Moving keeps its size.
Rect moveCrop(Rect area, CropHandle handle, Offset by, Size picture, {double minSide = 8}) {
  if (handle == CropHandle.move) {
    final left = (area.left + by.dx).clamp(0.0, picture.width - area.width);
    final top = (area.top + by.dy).clamp(0.0, picture.height - area.height);
    return Rect.fromLTWH(left, top, area.width, area.height);
  }
  var left = area.left;
  var top = area.top;
  var right = area.right;
  var bottom = area.bottom;
  if (handle == CropHandle.topLeft || handle == CropHandle.bottomLeft) {
    left = (left + by.dx).clamp(0.0, right - minSide);
  } else {
    right = (right + by.dx).clamp(left + minSide, picture.width);
  }
  if (handle == CropHandle.topLeft || handle == CropHandle.topRight) {
    top = (top + by.dy).clamp(0.0, bottom - minSide);
  } else {
    bottom = (bottom + by.dy).clamp(top + minSide, picture.height);
  }
  return Rect.fromLTRB(left, top, right, bottom);
}

/// The handle at [point], or null if it misses the frame. Corners win within [reach].
CropHandle? cropHandleAt(Rect area, Offset point, double reach) {
  bool near(Offset corner) => (corner - point).distance <= reach;
  if (near(area.topLeft)) return CropHandle.topLeft;
  if (near(area.topRight)) return CropHandle.topRight;
  if (near(area.bottomLeft)) return CropHandle.bottomLeft;
  if (near(area.bottomRight)) return CropHandle.bottomRight;
  return area.contains(point) ? CropHandle.move : null;
}

/// Shows the picture with a frame to drag, and the same four numbers to type.
class CropDialog extends StatefulWidget {
  const CropDialog({super.key, required this.loadPicture, this.shape});

  final Future<Uint8List> Function() loadPicture;

  /// A width over a height the frame must keep, or null to let it take any shape.
  final double? shape;

  @override
  State<CropDialog> createState() => _CropDialogState();
}

class _CropDialogState extends State<CropDialog> {
  final _fields = {
    for (final name in const ['Left', 'Top', 'Width', 'Height']) name: TextEditingController(),
  };
  ui.Image? _picture;
  Rect _area = Rect.zero;
  CropHandle? _dragging;
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final picture = await decodeImageFromList(await widget.loadPicture());
      if (!mounted) {
        picture.dispose();
        return;
      }
      setState(() {
        _picture = picture;
        final size = Size(picture.width.toDouble(), picture.height.toDouble());
        final shape = widget.shape;
        _setArea(shape == null ? Offset.zero & size : largestCrop(size, shape));
      });
    } catch (_) {
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  void dispose() {
    _picture?.dispose();
    for (final field in _fields.values) {
      field.dispose();
    }
    super.dispose();
  }

  String _fieldLabel(Words words, String name) => switch (name) {
    'Left' => words.left,
    'Top' => words.top,
    'Width' => words.width,
    _ => words.height,
  };

  void _setArea(Rect area) {
    _area = area;
    _fields['Left']!.text = '${area.left.round()}';
    _fields['Top']!.text = '${area.top.round()}';
    _fields['Width']!.text = '${area.width.round()}';
    _fields['Height']!.text = '${area.height.round()}';
  }

  /// Typed numbers take effect once they all make sense, so half-typed ones aren't fought.
  void _typed() {
    final picture = _picture;
    if (picture == null) return;
    int? read(String name) => int.tryParse(_fields[name]!.text.trim());
    final left = read('Left');
    final top = read('Top');
    final width = read('Width');
    final height = read('Height');
    if (left == null || top == null || width == null || height == null) return;
    if (left < 0 || top < 0 || width < 1 || height < 1) return;
    if (left + width > picture.width || top + height > picture.height) return;
    setState(() {
      _area = Rect.fromLTWH(left.toDouble(), top.toDouble(), width.toDouble(), height.toDouble());
    });
  }

  void _finish() {
    final picture = _picture!;
    final left = _area.left.round();
    final top = _area.top.round();
    Navigator.of(context).pop(
      ActionOptions(
        crop: (
          left: left,
          top: top,
          width: _area.width.round().clamp(1, picture.width - left),
          height: _area.height.round().clamp(1, picture.height - top),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final picture = _picture;
    return Dialog.fullscreen(
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            tooltip: context.words.cancel,
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Text(context.words.crop),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: FilledButton(
                onPressed: picture == null ? null : _finish,
                child: Text(context.words.crop),
              ),
            ),
          ],
        ),
        body: _failed
            ? Center(child: Text(context.words.pictureNotShown))
            : picture == null
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: LayoutBuilder(
                        builder: (context, space) => _buildFrame(picture, space),
                      ),
                    ),
                  ),
                  // Typed numbers could break the shape, and dragging is all that's needed.
                  if (widget.shape == null)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          for (final entry in _fields.entries)
                            SizedBox(
                              width: 96,
                              child: TextField(
                                controller: entry.value,
                                keyboardType: TextInputType.number,
                                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                                decoration: InputDecoration(
                                  labelText: _fieldLabel(context.words, entry.key),
                                ),
                                onChanged: (_) => _typed(),
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
      ),
    );
  }

  Widget _buildFrame(ui.Image picture, BoxConstraints space) {
    final size = Size(picture.width.toDouble(), picture.height.toDouble());
    // Corners start on the picture's edge, so touches must count past it, and are easy to grab
    // however small the picture is on screen.
    const reach = 28.0;
    final room = space.biggest - const Offset(reach * 2, reach * 2) as Size;
    final fitted = applyBoxFit(BoxFit.contain, size, room).destination;
    final scale = fitted.width / size.width;
    return Center(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onPanStart: (details) {
          final point = (details.localPosition - const Offset(reach, reach)) / scale;
          _dragging = cropHandleAt(_area, point, reach / scale);
        },
        onPanUpdate: (details) {
          final handle = _dragging;
          if (handle == null) return;
          final by = details.delta / scale;
          final shape = widget.shape;
          setState(() {
            _setArea(
              shape == null
                  ? moveCrop(_area, handle, by, size)
                  : moveCropKeepingShape(_area, handle, by, size, shape),
            );
          });
        },
        onPanEnd: (_) => _dragging = null,
        child: Padding(
          padding: const EdgeInsets.all(reach),
          child: SizedBox.fromSize(
            size: fitted,
            child: CustomPaint(
              foregroundPainter: _FramePainter(_area, scale, Theme.of(context).colorScheme.primary),
              child: RawImage(image: picture, fit: BoxFit.fill),
            ),
          ),
        ),
      ),
    );
  }
}

class _FramePainter extends CustomPainter {
  const _FramePainter(this.area, this.scale, this.colour);

  final Rect area;
  final double scale;
  final Color colour;

  @override
  void paint(Canvas canvas, Size size) {
    final frame = Rect.fromLTRB(
      area.left * scale,
      area.top * scale,
      area.right * scale,
      area.bottom * scale,
    );
    canvas.drawPath(
      Path.combine(
        PathOperation.difference,
        Path()..addRect(Offset.zero & size),
        Path()..addRect(frame),
      ),
      Paint()..color = const Color(0x99000000),
    );
    canvas.drawRect(
      frame,
      Paint()
        ..color = colour
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    final corner = Paint()..color = colour;
    for (final point in [frame.topLeft, frame.topRight, frame.bottomLeft, frame.bottomRight]) {
      canvas.drawCircle(point, 7, corner);
    }
  }

  @override
  bool shouldRepaint(_FramePainter old) {
    return old.area != area || old.scale != scale || old.colour != colour;
  }
}
