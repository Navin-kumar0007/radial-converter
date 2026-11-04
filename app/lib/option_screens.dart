import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:radial_core/radial_core.dart';

const _askFirst = {'image-crop', 'subtitle-shift', 'video-trim', 'audio-trim'};

/// True if the user must choose something before [action] can run.
bool needsOptions(RadialAction action) => _askFirst.contains(action.id);

/// Asks what [action] needs, or returns null if the user changed their mind. [loadPicture] is only
/// called for a crop.
Future<ActionOptions?> askForOptions(
  BuildContext context,
  RadialAction action, {
  required Future<Uint8List> Function() loadPicture,
  TrimPreview? trimPreview,
}) {
  return showDialog<ActionOptions>(
    context: context,
    builder: (context) => switch (action.id) {
      'image-crop' => CropDialog(loadPicture: loadPicture),
      'subtitle-shift' => const ShiftDialog(),
      _ => TrimDialog(preview: trimPreview),
    },
  );
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
      setState(() => _error = 'Enter a number of seconds, like 1.5.');
      return;
    }
    final milliseconds = (seconds * 1000).round();
    Navigator.of(context)
        .pop(ActionOptions(shift: Duration(milliseconds: _later ? milliseconds : -milliseconds)));
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Shift timing'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _seconds,
            autofocus: true,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(labelText: 'Seconds', errorText: _error),
            onSubmitted: (_) => _finish(),
          ),
          const SizedBox(height: 16),
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment(value: true, label: Text('Later')),
              ButtonSegment(value: false, label: Text('Earlier')),
            ],
            selected: {_later},
            onSelectionChanged: (selection) => setState(() => _later = selection.single),
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(onPressed: _finish, child: const Text('Shift')),
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
    const useTime = 'Use a time like 1:30.';
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
        _fromError = 'Choose where to start or end.';
      } else if (from != null && length != null && from >= length) {
        _fromError = 'This is only ${formatClock(length)} long.';
      } else if (from != null && to != null && to <= from) {
        _toError = 'This must be after the start.';
      }
    });
    if (_fromError != null || _toError != null) return;
    Navigator.of(context).pop(ActionOptions(startSeconds: from, endSeconds: to));
  }

  Widget _buildFrame(String label, _FrameSlot slot) {
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
                      semanticLabel: 'The video at the ${label.toLowerCase()}',
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
            _buildFrame('Start', _startSlot),
            const SizedBox(width: 8),
            _buildFrame('End', _endSlot),
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
      title: const Text('Trim'),
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
                  labelText: 'Start',
                  hintText: '0:00',
                  helperText: 'Empty means from the beginning',
                  errorText: _fromError,
                ),
                onChanged: (_) => _typed(),
                onSubmitted: (_) => _finish(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _to,
                decoration: InputDecoration(
                  labelText: 'End',
                  hintText: '1:30',
                  helperText: 'Empty means to the end',
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
        TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Cancel')),
        FilledButton(onPressed: _finish, child: const Text('Trim')),
      ],
    );
  }
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
  const CropDialog({super.key, required this.loadPicture});

  final Future<Uint8List> Function() loadPicture;

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
        _setArea(Rect.fromLTWH(0, 0, picture.width.toDouble(), picture.height.toDouble()));
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
            tooltip: 'Cancel',
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: const Text('Crop'),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: FilledButton(
                onPressed: picture == null ? null : _finish,
                child: const Text('Crop'),
              ),
            ),
          ],
        ),
        body: _failed
            ? const Center(child: Text('This picture could not be shown.'))
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
                              decoration: InputDecoration(labelText: entry.key),
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
          setState(() => _setArea(moveCrop(_area, handle, details.delta / scale, size)));
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
