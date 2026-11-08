import 'dart:async';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

/// Lets queued work and completions run.
Future<void> settle() => Future<void>.delayed(Duration.zero);

void main() {
  group('running', () {
    test('returns the value', () async {
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add((_) async => 42);
      expect(await job.result, 42);
      expect(job.state, JobState.done);
      expect(job.progress, 1);
    });

    test('never runs more than maxParallel at once', () async {
      final queue = JobQueue(maxParallel: 2);
      var running = 0;
      var peak = 0;
      final jobs = [
        for (var i = 0; i < 6; i++)
          queue.add((_) async {
            running++;
            peak = peak > running ? peak : running;
            await settle();
            running--;
          }),
      ];
      await Future.wait(jobs.map((job) => job.result));
      expect(peak, 2);
    });

    test('starts jobs in order', () async {
      final queue = JobQueue(maxParallel: 1);
      final order = <int>[];
      final jobs = [for (var i = 0; i < 4; i++) queue.add((_) async => order.add(i))];
      await Future.wait(jobs.map((job) => job.result));
      expect(order, [0, 1, 2, 3]);
    });

    test('ids and labels', () {
      final queue = JobQueue(maxParallel: 1);
      final first = queue.add((_) async {}, label: 'a');
      final second = queue.add((_) async {}, label: 'b');
      expect(first.id, isNot(second.id));
      expect(second.label, 'b');
    });

    test('maxParallel must be at least 1', () {
      expect(() => JobQueue(maxParallel: 0), throwsArgumentError);
    });

    test('parallelFor leaves one core free', () {
      expect(JobQueue.parallelFor(8), 7);
      expect(JobQueue.parallelFor(2), 1);
      expect(JobQueue.parallelFor(1), 1);
    });
  });

  group('failure', () {
    test('a failed job keeps its error and the queue carries on', () async {
      final queue = JobQueue(maxParallel: 1);
      final bad = queue.add<int>((_) async => throw StateError('broken file'));
      final good = queue.add((_) async => 1);
      await expectLater(bad.result, throwsStateError);
      expect(bad.state, JobState.failed);
      expect(bad.error, isStateError);
      expect(await good.result, 1);
    });

    test('a task that throws before its first await is still caught', () async {
      final queue = JobQueue(maxParallel: 1);
      final bad = queue.add<int>((_) => throw StateError('sync'));
      await expectLater(bad.result, throwsStateError);
      expect(bad.state, JobState.failed);
    });

    test('nobody listening to a failed job is not a crash', () async {
      final queue = JobQueue(maxParallel: 1);
      final bad = queue.add<int>((_) async => throw StateError('quiet'));
      await settle();
      await settle();
      expect(bad.state, JobState.failed);
    });
  });

  group('progress', () {
    test('reports and clamps', () async {
      final queue = JobQueue(maxParallel: 1);
      final step = Completer<void>();
      final finish = Completer<void>();
      final job = queue.add((context) async {
        context.report(0.5);
        await step.future;
        context.report(7);
        await finish.future;
      });
      await settle();
      expect(job.progress, 0.5);
      step.complete();
      await settle();
      expect(job.progress, 1);
      finish.complete();
      await job.result;
    });

    test('changes fires for state and progress', () async {
      final queue = JobQueue(maxParallel: 1);
      final states = <JobState>[];
      final subscription = queue.changes.listen((job) => states.add(job.state));
      final job = queue.add((context) async => context.report(0.5));
      await job.result;
      await settle();
      expect(states.first, JobState.queued);
      expect(states, contains(JobState.running));
      expect(states.last, JobState.done);
      await subscription.cancel();
    });

    test('a repeated value does not fire', () async {
      final queue = JobQueue(maxParallel: 1);
      var changes = 0;
      final gate = Completer<void>();
      final subscription = queue.changes.listen((_) => changes++);
      final job = queue.add((context) async {
        context.report(0.5);
        context.report(0.5);
        await gate.future;
      });
      await settle();
      expect(changes, 3); // queued, running, one progress
      gate.complete();
      await job.result;
      await subscription.cancel();
    });
  });

  group('cancel', () {
    test('a queued job never starts', () async {
      final queue = JobQueue(maxParallel: 1);
      final gate = Completer<void>();
      final first = queue.add((_) => gate.future);
      var started = false;
      final second = queue.add((_) async => started = true);
      second.cancel();
      expect(second.state, JobState.cancelled);
      await expectLater(second.result, throwsA(isA<JobCancelled>()));
      gate.complete();
      await first.result;
      await settle();
      expect(started, isFalse);
      expect(queue.queuedCount, 0);
    });

    test('a running job is told and ends cancelled', () async {
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add<void>((context) async {
        await context.cancelled;
        context.throwIfCancelled();
      });
      await settle();
      expect(job.state, JobState.running);
      job.cancel();
      await expectLater(job.result, throwsA(isA<JobCancelled>()));
      expect(job.state, JobState.cancelled);
    });

    test('any error after a cancel counts as cancelled', () async {
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add<void>((context) async {
        await context.cancelled;
        throw StateError('killed process exited with 137');
      });
      await settle();
      job.cancel();
      await expectLater(job.result, throwsA(isA<JobCancelled>()));
      expect(job.state, JobState.cancelled);
      expect(job.error, isNull);
    });

    test('a job that finishes anyway stays done', () async {
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add((context) async {
        await context.cancelled;
        return 'finished';
      });
      await settle();
      job.cancel();
      expect(await job.result, 'finished');
      expect(job.state, JobState.done);
    });

    test('cancel frees a slot for the next job', () async {
      final queue = JobQueue(maxParallel: 1);
      final first = queue.add<void>((context) async {
        await context.cancelled;
        throw const JobCancelled();
      });
      final second = queue.add((_) async => 'next');
      await settle();
      first.cancel();
      expect(await second.result, 'next');
    });

    test('cancelling twice or after finishing does nothing', () async {
      final queue = JobQueue(maxParallel: 1);
      final job = queue.add((_) async => 1);
      await job.result;
      job.cancel();
      job.cancel();
      expect(job.state, JobState.done);
    });

    test('cancelAll', () async {
      final queue = JobQueue(maxParallel: 1);
      final running = queue.add<void>((context) async {
        await context.cancelled;
        throw const JobCancelled();
      });
      final waiting = queue.add((_) async => 1);
      await settle();
      queue.cancelAll();
      await expectLater(running.result, throwsA(isA<JobCancelled>()));
      await expectLater(waiting.result, throwsA(isA<JobCancelled>()));
    });
  });

  group('dispose', () {
    test('cancels everything and closes changes', () async {
      final queue = JobQueue(maxParallel: 1);
      var closed = false;
      queue.changes.listen(null, onDone: () => closed = true);
      final running = queue.add<void>((context) async {
        await context.cancelled;
        throw const JobCancelled();
      });
      final waiting = queue.add((_) async => 1);
      await settle();
      await queue.dispose();
      expect(running.state, JobState.cancelled);
      expect(waiting.state, JobState.cancelled);
      expect(closed, isTrue);
    });

    test('add after dispose throws', () async {
      final queue = JobQueue(maxParallel: 1);
      await queue.dispose();
      expect(() => queue.add((_) async {}), throwsStateError);
    });

    test('dispose twice is fine', () async {
      final queue = JobQueue(maxParallel: 1);
      await queue.dispose();
      await queue.dispose();
    });
  });
}
