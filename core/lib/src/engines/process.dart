import 'dart:async';
import 'dart:convert';
import 'dart:io';

import '../action_options.dart';
import '../job_queue.dart';
import '../failures.dart';

/// How much of an engine's error output is kept.
const _maxDetails = 8 * 1024;

/// Runs a program without a shell, so file names can never be read as commands.
///
/// A cancel kills the process and throws [JobCancelled]. A bad exit throws [EngineFailed].
/// Returns standard output. [stdinText] keeps secrets out of the process list.
Future<String> runTool(
  String executable,
  List<String> arguments,
  JobContext context, {
  String? stdinText,
  String? workingDirectory,
  void Function(String line)? onLine,
  EngineFailed failure = Fail.notConverted,
}) async {
  context.throwIfCancelled();
  final process = await Process.start(executable, arguments, workingDirectory: workingDirectory);
  unawaited(context.cancelled.then((_) => process.kill()));

  if (stdinText != null) process.stdin.write(stdinText);
  unawaited(process.stdin.close().catchError((Object _) {}));

  final output = StringBuffer();
  final errors = StringBuffer();
  const decoder = Utf8Decoder(allowMalformed: true);
  final done = [
    process.stdout.transform(decoder).transform(const LineSplitter()).forEach((line) {
      output.writeln(line);
      onLine?.call(line);
    }),
    process.stderr.transform(decoder).forEach((text) {
      if (errors.length < _maxDetails) errors.write(text);
    }),
  ];
  final exitCode = await process.exitCode;
  await Future.wait(done);

  context.throwIfCancelled();
  if (exitCode != 0) throw failure.withDetails(errors.toString().trim());
  return output.toString();
}
