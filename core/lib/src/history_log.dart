import 'dart:convert';

/// The plan keeps history for 30 days.
const historyKeepsFor = Duration(days: 30);

/// So a list nobody ever clears can't grow without end.
const historyMostItems = 500;

/// One result that was saved. Only facts about it: no file's contents are ever kept here.
class HistoryItem {
  const HistoryItem({
    required this.id,
    required this.finishedAt,
    required this.actionLabel,
    required this.name,
    required this.bytesAfter,
    this.path,
    this.bytesBefore,
    this.undoneAt,
  });

  final int id;
  final DateTime finishedAt;

  /// What was done, as the menu called it.
  final String actionLabel;
  final String name;

  /// Where it was saved, if this device can say. Undo needs it.
  final String? path;
  final int? bytesBefore;
  final int bytesAfter;

  /// When it was undone, or null while it's still in place.
  final DateTime? undoneAt;

  Map<String, Object?> toJson() => {
    'id': id,
    'at': finishedAt.toUtc().toIso8601String(),
    'action': actionLabel,
    'name': name,
    if (path != null) 'path': path,
    if (bytesBefore != null) 'before': bytesBefore,
    'after': bytesAfter,
    if (undoneAt != null) 'undone': undoneAt!.toUtc().toIso8601String(),
  };

  /// Null if this isn't one, so one damaged line can't lose the rest.
  static HistoryItem? fromJson(Object? json) {
    if (json is! Map<String, dynamic>) return null;
    final id = json['id'];
    final at = DateTime.tryParse('${json['at']}');
    final action = json['action'];
    final name = json['name'];
    final after = json['after'];
    if (id is! int || at == null || action is! String || name is! String || after is! int) {
      return null;
    }
    final path = json['path'];
    final before = json['before'];
    final undone = json['undone'];
    return HistoryItem(
      id: id,
      finishedAt: at,
      actionLabel: action,
      name: name,
      path: path is String ? path : null,
      bytesBefore: before is int ? before : null,
      bytesAfter: after,
      undoneAt: undone is String ? DateTime.tryParse(undone) : null,
    );
  }

  HistoryItem undone(DateTime at) {
    return HistoryItem(
      id: id,
      finishedAt: finishedAt,
      actionLabel: actionLabel,
      name: name,
      path: path,
      bytesBefore: bytesBefore,
      bytesAfter: bytesAfter,
      undoneAt: at,
    );
  }
}

/// What has been done on this device, newest first. Plain data, kept in a small file or the browser's
/// storage by whoever holds it. Nothing here moves or deletes a file, so forgetting history never
/// touches anyone's results.
class HistoryLog {
  HistoryLog([List<HistoryItem> items = const []]) : _items = [...items];

  final List<HistoryItem> _items;

  List<HistoryItem> get items => List.unmodifiable(_items);

  HistoryItem add({
    required DateTime finishedAt,
    required String actionLabel,
    required String name,
    required int bytesAfter,
    String? path,
    int? bytesBefore,
  }) {
    final newest = _items.fold<int>(0, (most, item) => item.id > most ? item.id : most);
    final item = HistoryItem(
      id: newest + 1,
      finishedAt: finishedAt,
      actionLabel: actionLabel,
      name: name,
      path: path,
      bytesBefore: bytesBefore,
      bytesAfter: bytesAfter,
    );
    _items.insert(0, item);
    if (_items.length > historyMostItems) _items.removeRange(historyMostItems, _items.length);
    return item;
  }

  HistoryItem? find(int id) => _items.where((item) => item.id == id).firstOrNull;

  /// False if it's gone or already undone, so nothing moves a file twice.
  bool markUndone(int id, DateTime at) {
    final index = _items.indexWhere((item) => item.id == id);
    if (index < 0 || _items[index].undoneAt != null) return false;
    _items[index] = _items[index].undone(at);
    return true;
  }

  /// Forgets what's older than [keep]. Returns how many went.
  int prune(DateTime now, {Duration keep = historyKeepsFor}) {
    final before = _items.length;
    _items.removeWhere((item) => now.difference(item.finishedAt) > keep);
    return before - _items.length;
  }

  void clear() => _items.clear();

  String encode() => jsonEncode([for (final item in _items) item.toJson()]);

  /// Reads what [encode] wrote. Anything unreadable just starts afresh: losing a list of past
  /// conversions must never stop a conversion.
  static HistoryLog decode(String? text) {
    if (text == null || text.isEmpty) return HistoryLog();
    try {
      final json = jsonDecode(text);
      if (json is! List) return HistoryLog();
      return HistoryLog([for (final each in json) ?HistoryItem.fromJson(each)]);
    } on FormatException {
      return HistoryLog();
    }
  }
}
