// Command-line test tool: runs any action on any file, without the app.
//
//   dart run radial_core:radial list [file...]
//   dart run radial_core:radial detect file...
//   dart run radial_core:radial run <action-id> [options] file...

import 'dart:convert';
import 'dart:io';

import 'package:radial_core/engines.dart';
import 'package:radial_core/radial_core.dart';

const _usage = '''
Usage:
  radial list [file...]              Actions, or those a file can use
  radial detect file...              What each file really is
  radial run <action-id> [options] file...

Options for run:
  --out=FOLDER          Where results go (default: beside each file)
  --size=PIXELS         Longest side
  --crop=L,T,W,H        Crop area in pixels
  --degrees=90          Rotate clockwise
  --vertical            Flip top to bottom
  --start=SECONDS       Trim start
  --end=SECONDS         Trim end
  --pages=1-3,7         PDF pages
  --password-stdin      Read a PDF password from standard input
  --kbps=128            Audio bitrate
  --target-mb=16        Video size target
  --shift-ms=-500       Move subtitles''';

Future<void> main(List<String> args) async {
  exitCode = await _main(args);
}

Future<int> _main(List<String> args) async {
  if (args.isEmpty) return _fail(_usage);
  final rest = args.sublist(1);
  try {
    return switch (args.first) {
      'list' => await _list(rest),
      'detect' => await _detect(rest),
      'run' => await _run(rest),
      _ => _fail(_usage),
    };
  } on FormatException catch (e) {
    return _fail(e.message);
  }
}

int _fail(String message) {
  stderr.writeln(message);
  return 2;
}

Future<FileKind> _kindOf(String path) async {
  if (await FileSystemEntity.isDirectory(path)) return FileKind.folder;
  final head = await File(
    path,
  ).openRead(0, detectHeadBytes).fold<List<int>>(<int>[], (bytes, chunk) => bytes..addAll(chunk));
  return detectKind(head, fileName: path.split(Platform.pathSeparator).last);
}

Future<int> _list(List<String> files) async {
  final Iterable<RadialAction> actions;
  if (files.isEmpty) {
    actions = actionCatalogue;
  } else {
    final kinds = [for (final file in files) await _kindOf(file)];
    actions = [...actionsFor(kinds, ActionMode.convert), ...actionsFor(kinds, ActionMode.tools)];
  }
  for (final action in actions) {
    final state = isActionWired(action) ? '' : '  (not available yet)';
    stdout.writeln('${action.id.padRight(24)}${action.mode.name.padRight(9)}${action.label}$state');
  }
  return 0;
}

Future<int> _detect(List<String> files) async {
  if (files.isEmpty) return _fail('Which files?');
  for (final file in files) {
    final kind = await _kindOf(file);
    stdout.writeln('${kind.name.padRight(10)}$file');
  }
  return 0;
}

Future<int> _run(List<String> args) async {
  if (args.isEmpty) return _fail(_usage);
  final action = actionById(args.first);
  if (action == null) return _fail('No action called "${args.first}". Try: radial list');

  final values = <String, String>{};
  final files = <String>[];
  for (final arg in args.skip(1)) {
    if (arg.startsWith('--')) {
      final equals = arg.indexOf('=');
      if (equals < 0) {
        values[arg.substring(2)] = '';
      } else {
        values[arg.substring(2, equals)] = arg.substring(equals + 1);
      }
    } else {
      files.add(arg);
    }
  }
  if (files.isEmpty) return _fail('Which files?');

  String? password;
  if (values.containsKey('password-stdin')) {
    password = stdin.readLineSync(encoding: utf8);
  }
  final options = ActionOptions(
    longSide: _int(values, 'size'),
    crop: _crop(values['crop']),
    degrees: _int(values, 'degrees'),
    flipVertical: values.containsKey('vertical'),
    startSeconds: _double(values, 'start'),
    endSeconds: _double(values, 'end'),
    pages: values['pages'],
    password: password,
    audioKbps: _int(values, 'kbps'),
    targetMb: _double(values, 'target-mb'),
    shift: switch (_int(values, 'shift-ms')) {
      final ms? => Duration(milliseconds: ms),
      null => null,
    },
  );

  final runner = ActionRunner(EngineTools());
  final queue = JobQueue(maxParallel: JobQueue.parallelFor(Platform.numberOfProcessors));
  // Merges take all the files at once; everything else is one job per file.
  final batches = action.minFiles > 1 || action.id == 'images-to-pdf'
      ? [files]
      : [
          for (final file in files) [file],
        ];
  final jobs = [
    for (final batch in batches)
      queue.add(
        (context) =>
            runner.run(action, batch, context, options: options, outputFolder: values['out']),
        label: batch.first,
      ),
  ];

  var failed = 0;
  for (final job in jobs) {
    try {
      for (final output in await job.result) {
        stdout.writeln(output);
      }
    } catch (error) {
      failed++;
      stderr.writeln('${job.label}: $error');
    }
  }
  await queue.dispose();
  return failed == 0 ? 0 : 1;
}

int? _int(Map<String, String> values, String key) {
  final value = values[key];
  if (value == null) return null;
  return int.tryParse(value) ?? (throw FormatException('--$key must be a whole number'));
}

double? _double(Map<String, String> values, String key) {
  final value = values[key];
  if (value == null) return null;
  return double.tryParse(value) ?? (throw FormatException('--$key must be a number'));
}

({int left, int top, int width, int height})? _crop(String? value) {
  if (value == null) return null;
  final parts = value.split(',').map(int.tryParse).toList();
  if (parts.length != 4 || parts.contains(null)) {
    throw const FormatException('--crop looks like 10,20,300,400');
  }
  return (left: parts[0]!, top: parts[1]!, width: parts[2]!, height: parts[3]!);
}
