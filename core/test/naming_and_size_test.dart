import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

void main() {
  group('freeOutputName', () {
    bool none(String _) => false;

    test('default suffix', () {
      expect(
        freeOutputName(inputName: 'photo.heic', extension: 'png', exists: none),
        'photo (converted).png',
      );
    });
    test('purpose suffix', () {
      expect(
        freeOutputName(inputName: 'photo.jpg', extension: 'jpg', exists: none, suffix: 'whatsapp'),
        'photo (whatsapp).jpg',
      );
    });
    test('counts up past taken names', () {
      final taken = {'photo (converted).png', 'photo (converted 2).png'};
      expect(
        freeOutputName(inputName: 'photo.jpg', extension: 'png', exists: taken.contains),
        'photo (converted 3).png',
      );
    });
    test('never returns the original name', () {
      final name = freeOutputName(inputName: 'photo.png', extension: 'png', exists: none);
      expect(name, isNot('photo.png'));
    });
    test('names with dots keep them', () {
      expect(
        freeOutputName(inputName: 'my.holiday.2026.jpg', extension: 'png', exists: none),
        'my.holiday.2026 (converted).png',
      );
    });
    test('.tar.gz counts as one extension', () {
      expect(
        freeOutputName(inputName: 'backup.tar.gz', extension: 'zip', exists: none),
        'backup (converted).zip',
      );
    });
    test('Hindi and emoji names', () {
      expect(
        freeOutputName(inputName: 'तस्वीर 📷.jpg', extension: 'png', exists: none),
        'तस्वीर 📷 (converted).png',
      );
    });
    test('no extension on the input', () {
      expect(
        freeOutputName(inputName: 'README', extension: 'pdf', exists: none),
        'README (converted).pdf',
      );
    });
    test('folder output has no extension', () {
      expect(
        freeOutputName(inputName: 'a.zip', extension: '', exists: none, suffix: 'extracted'),
        'a (extracted)',
      );
    });
    test('hidden files keep their whole name', () {
      expect(
        freeOutputName(inputName: '.bashrc', extension: 'txt', exists: none),
        '.bashrc (converted).txt',
      );
    });
  });

  group('splitFileName', () {
    test('plain', () {
      final parts = splitFileName('a.png');
      expect(parts.stem, 'a');
      expect(parts.extension, 'png');
    });
    test('trailing dot', () {
      final parts = splitFileName('a.');
      expect(parts.stem, 'a.');
      expect(parts.extension, '');
    });
    test('.TAR.GZ in capitals', () {
      expect(splitFileName('A.TAR.GZ').stem, 'A');
    });
    test('a file called only .tar.gz', () {
      expect(splitFileName('.tar.gz').extension, 'gz');
    });
  });

  group('searchUnderSize', () {
    /// A fake encoder: size grows with quality and the area of the picture.
    SizeEncoder fake(List<(int, double)> calls, {int base = 1000}) {
      return (quality, scale) async {
        calls.add((quality, scale));
        return (base * quality * scale * scale).round();
      };
    }

    test('finds the highest quality that fits', () async {
      final result = await searchUnderSize(maxBytes: 60000, encode: fake([]));
      expect(result!.quality, 60);
      expect(result.scale, 1.0);
      expect(result.bytes, lessThanOrEqualTo(60000));
    });
    test('uses the top quality when everything fits', () async {
      final result = await searchUnderSize(maxBytes: 1 << 30, encode: fake([]));
      expect(result!.quality, 95);
    });
    test('takes few encodes', () async {
      final calls = <(int, double)>[];
      await searchUnderSize(maxBytes: 60000, encode: fake(calls));
      expect(calls.length, lessThanOrEqualTo(8));
    });
    test('shrinks by 10% when quality 40 is too big', () async {
      final result = await searchUnderSize(maxBytes: 35000, encode: fake([]));
      expect(result!.scale, closeTo(0.9, 0.001));
      expect(result.bytes, lessThanOrEqualTo(35000));
    });
    test('keeps shrinking', () async {
      final result = await searchUnderSize(maxBytes: 20000, encode: fake([]));
      expect(result!.scale, lessThan(0.9));
      expect(result.bytes, lessThanOrEqualTo(20000));
    });
    test('gives up when nothing can fit', () async {
      final result = await searchUnderSize(maxBytes: 1, encode: fake([]));
      expect(result, isNull);
    });
    test('an encoder error reaches the caller', () async {
      await expectLater(
        searchUnderSize(maxBytes: 1, encode: (_, _) async => throw StateError('broken')),
        throwsStateError,
      );
    });
  });

  group('videoKbpsForTarget', () {
    test('the plan formula', () {
      expect(videoKbpsForTarget(targetMb: 16, durationSeconds: 60, audioKbps: 128), 2056);
    });
    test('rounds down', () {
      expect(videoKbpsForTarget(targetMb: 1, durationSeconds: 7, audioKbps: 0), 1170);
    });
    test('null when the audio takes all the room', () {
      expect(videoKbpsForTarget(targetMb: 1, durationSeconds: 600, audioKbps: 128), isNull);
    });
    test('null for an empty clip or target', () {
      expect(videoKbpsForTarget(targetMb: 16, durationSeconds: 0, audioKbps: 128), isNull);
      expect(videoKbpsForTarget(targetMb: 0, durationSeconds: 60, audioKbps: 128), isNull);
    });
  });
}
