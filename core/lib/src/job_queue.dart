import 'dart:async';

enum JobState { queued, running, done, failed, cancelled }

/// The error a job's result completes with when it was cancelled.
class JobCancelled implements Exception {
  const JobCancelled();

  @override
  String toString() => 'Job cancelled';
}

/// What a running job uses to report progress and notice a cancel.
class JobContext {
  JobContext._(this._job);

  final Job<Object?> _job;

  /// Reports progress from 0 to 1.
  void report(double progress) => _job._setProgress(progress);

  bool get isCancelled => _job._cancel.isCompleted;

  /// Completes on cancel. Engine wrappers wait on this to kill their process.
  Future<void> get cancelled => _job._cancel.future;

  void throwIfCancelled() {
    if (isCancelled) throw const JobCancelled();
  }
}

typedef JobTask<T> = Future<T> Function(JobContext context);

class Job<T> {
  Job._(this.id, this.label, this._queue, this._task) {
    // A failed job is reported through its state too, so nobody has to listen to [result].
    _result.future.ignore();
  }

  final int id;
  final String label;
  final JobQueue _queue;
  final JobTask<T> _task;
  final Completer<T> _result = Completer<T>();
  final Completer<void> _cancel = Completer<void>();

  JobState _state = JobState.queued;
  double _progress = 0;
  Object? _error;

  JobState get state => _state;
  double get progress => _progress;

  /// Why the job failed, when [state] is [JobState.failed].
  Object? get error => _error;

  /// The job's value. Completes with [JobCancelled] if it was cancelled.
  Future<T> get result => _result.future;

  bool get isFinished => _state != JobState.queued && _state != JobState.running;

  /// Cancels the job. A queued job stops at once; a running one when its task notices.
  void cancel() {
    if (isFinished || _cancel.isCompleted) return;
    _cancel.complete();
    if (_state == JobState.queued) {
      _queue._removeQueued(this);
      _finishCancelled();
    }
  }

  void _setProgress(double value) {
    if (_state != JobState.running) return;
    final clamped = value.clamp(0.0, 1.0);
    if (clamped == _progress) return;
    _progress = clamped;
    _queue._notify(this);
  }

  void _setState(JobState state) {
    _state = state;
    _queue._notify(this);
  }

  void _finishCancelled() {
    _result.completeError(const JobCancelled());
    _setState(JobState.cancelled);
  }

  Future<void> _run() async {
    _setState(JobState.running);
    try {
      final value = await Future<T>.sync(() => _task(JobContext._(this)));
      _progress = 1;
      _result.complete(value);
      _setState(JobState.done);
    } catch (error, stackTrace) {
      if (_cancel.isCompleted || error is JobCancelled) {
        _finishCancelled();
      } else {
        _error = error;
        _result.completeError(error, stackTrace);
        _setState(JobState.failed);
      }
    }
  }
}

/// Runs jobs first in, first out, at most [maxParallel] at a time.
class JobQueue {
  JobQueue({required this.maxParallel}) {
    if (maxParallel < 1) {
      throw ArgumentError.value(maxParallel, 'maxParallel', 'must be at least 1');
    }
  }

  /// The plan's limit: the number of CPU cores minus one, and at least one.
  static int parallelFor(int cpuCores) => cpuCores > 1 ? cpuCores - 1 : 1;

  final int maxParallel;
  final List<Job<Object?>> _queued = [];
  final Set<Job<Object?>> _running = {};
  final StreamController<Job<Object?>> _changes = StreamController.broadcast(sync: true);
  int _nextId = 1;
  bool _disposed = false;

  /// Fires whenever a job changes state or progress.
  Stream<Job<Object?>> get changes => _changes.stream;

  int get runningCount => _running.length;
  int get queuedCount => _queued.length;

  Job<T> add<T>(JobTask<T> task, {String label = ''}) {
    if (_disposed) throw StateError('JobQueue is disposed');
    final job = Job<T>._(_nextId++, label, this, task);
    _queued.add(job);
    _notify(job);
    _pump();
    return job;
  }

  void cancelAll() {
    for (final job in [..._queued, ..._running]) {
      job.cancel();
    }
  }

  /// Cancels everything, waits for running jobs to stop, then closes [changes].
  Future<void> dispose() async {
    if (_disposed) return;
    _disposed = true;
    final waiting = [
      for (final job in _running) job._result.future.then<void>((_) {}, onError: (_) {}),
    ];
    cancelAll();
    await Future.wait(waiting);
    await _changes.close();
  }

  void _pump() {
    while (!_disposed && _running.length < maxParallel && _queued.isNotEmpty) {
      final job = _queued.removeAt(0);
      _running.add(job);
      unawaited(
        job._run().whenComplete(() {
          _running.remove(job);
          _pump();
        }),
      );
    }
  }

  void _removeQueued(Job<Object?> job) => _queued.remove(job);

  void _notify(Job<Object?> job) {
    if (!_changes.isClosed) _changes.add(job);
  }
}
