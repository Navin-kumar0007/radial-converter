import 'file_kind.dart';

/// How many files one drop opens from inside folders. Each costs a read of its start and a result
/// on the screen, and a folder can hold anything.
const maxFolderFiles = 200;

/// What systems and apps leave in folders, which nobody means to convert.
bool isFolderClutter(String name) {
  final lower = name.toLowerCase();
  return name.startsWith('.') ||
      name.startsWith(r'~$') ||
      lower == 'thumbs.db' ||
      lower == 'desktop.ini';
}

/// Which of a folder's files to open, by position. The menu only offers what every file shares,
/// so one PDF among fifty photos would leave it empty. This keeps the biggest family that
/// [canUse] allows. Files chosen by hand aren't for this: those the user meant.
List<int> pickFromFolder(List<FileKind> kinds, {required bool Function(FileKind) canUse}) {
  final counts = <FileFamily, int>{};
  for (final kind in kinds) {
    if (canUse(kind)) counts.update(kind.family, (count) => count + 1, ifAbsent: () => 1);
  }
  if (counts.isEmpty) return const [];
  // Maps keep their order, so a tie stays with the family seen first.
  final biggest = counts.entries.reduce((a, b) => b.value > a.value ? b : a).key;
  return [
    for (var i = 0; i < kinds.length; i++)
      if (canUse(kinds[i]) && kinds[i].family == biggest) i,
  ];
}
