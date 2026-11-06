/// A file name split into its name and extension, keeping `.tar.gz` together.
({String stem, String extension}) splitFileName(String fileName) {
  final lower = fileName.toLowerCase();
  if (lower.endsWith('.tar.gz') && fileName.length > 7) {
    return (stem: fileName.substring(0, fileName.length - 7), extension: 'tar.gz');
  }
  final dot = fileName.lastIndexOf('.');
  if (dot <= 0 || dot == fileName.length - 1) return (stem: fileName, extension: '');
  return (stem: fileName.substring(0, dot), extension: fileName.substring(dot + 1));
}

/// Picks an output name that does not exist yet, so nothing is ever overwritten:
/// `photo (converted).png`, then `photo (converted 2).png`, and so on.
///
/// [inputName] is the original file's name, [extension] the output's (without the dot,
/// empty for a folder), [suffix] the word in brackets. [exists] checks a candidate in
/// the output folder; it should ignore case on file systems that do.
String freeOutputName({
  required String inputName,
  required String extension,
  required bool Function(String name) exists,
  String suffix = 'converted',
}) {
  final stem = splitFileName(inputName).stem;
  final tail = extension.isEmpty ? '' : '.$extension';
  var candidate = '$stem ($suffix)$tail';
  for (var n = 2; exists(candidate); n++) {
    candidate = '$stem ($suffix $n)$tail';
  }
  return candidate;
}
