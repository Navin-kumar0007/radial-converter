import 'dart:convert';
import 'dart:io';

import 'package:radial_core/radial_core.dart';
import 'package:test/test.dart';

Map<String, dynamic> valid() => {
  'id': 'form-photo-50kb',
  'label': {'en': 'Form photo', 'hi': 'फ़ॉर्म फ़ोटो'},
  'accepts': ['image/*'],
  'output': {
    'format': 'jpg',
    'width': 200,
    'height': 230,
    'maxBytes': 51200,
    'background': 'white',
    'crop': 'user',
  },
  'source': 'https://example.org/form',
};

Preset parse(Map<String, dynamic> json, {String? fileName}) =>
    Preset.parse(jsonEncode(json), fileName: fileName);

void main() {
  test('parses every field', () {
    final preset = parse(valid());
    expect(preset.id, 'form-photo-50kb');
    expect(preset.output.format, FileKind.jpg);
    expect(preset.output.width, 200);
    expect(preset.output.height, 230);
    expect(preset.output.maxBytes, 51200);
    expect(preset.output.background, 'white');
    expect(preset.output.crop, PresetCrop.user);
    expect(preset.source, 'https://example.org/form');
  });

  test('crop defaults to none', () {
    final json = valid();
    (json['output'] as Map).remove('crop');
    expect(parse(json).output.crop, PresetCrop.none);
  });

  test('label falls back to English', () {
    final preset = parse(valid());
    expect(preset.label('hi'), 'फ़ॉर्म फ़ोटो');
    expect(preset.label('ta'), 'Form photo');
  });

  group('acceptsKind', () {
    test('wildcard', () {
      final preset = parse(valid());
      expect(preset.acceptsKind(FileKind.png), isTrue);
      expect(preset.acceptsKind(FileKind.pdf), isFalse);
    });
    test('exact MIME type', () {
      final preset = parse(valid()..['accepts'] = ['application/pdf']);
      expect(preset.acceptsKind(FileKind.pdf), isTrue);
      expect(preset.acceptsKind(FileKind.png), isFalse);
    });
    test('anything', () {
      expect(parse(valid()..['accepts'] = ['*/*']).acceptsKind(FileKind.mp3), isTrue);
    });
    test('a wildcard does not match another family', () {
      final preset = parse(valid()..['accepts'] = ['image/*']);
      expect(preset.acceptsKind(FileKind.unknown), isFalse);
    });
  });

  test('the file name must equal the id', () {
    expect(() => parse(valid(), fileName: 'other.json'), throwsFormatException);
    expect(parse(valid(), fileName: 'form-photo-50kb.json').id, 'form-photo-50kb');
  });

  group('rejects', () {
    void rejects(String name, void Function(Map<String, dynamic>) change) {
      test(name, () {
        final json = valid();
        change(json);
        expect(() => parse(json), throwsFormatException);
      });
    }

    test('bad JSON', () => expect(() => Preset.parse('{'), throwsFormatException));
    test('not an object', () => expect(() => Preset.parse('[]'), throwsFormatException));
    rejects('missing id', (json) => json.remove('id'));
    rejects('capitals in the id', (json) => json['id'] = 'Form-Photo');
    rejects('slashes in the id', (json) => json['id'] = '../evil');
    rejects('missing label', (json) => json.remove('label'));
    rejects('no English label', (json) => json['label'] = {'hi': 'x'});
    rejects('a label that is not text', (json) => json['label'] = {'en': 'x', 'hi': 1});
    rejects('missing accepts', (json) => json.remove('accepts'));
    rejects('empty accepts', (json) => json['accepts'] = <String>[]);
    rejects('accepts with a number', (json) => json['accepts'] = [1]);
    rejects('missing output', (json) => json.remove('output'));
    rejects('unknown format', (json) => (json['output'] as Map)['format'] = 'xyz');
    rejects('zero width', (json) => (json['output'] as Map)['width'] = 0);
    rejects('negative maxBytes', (json) => (json['output'] as Map)['maxBytes'] = -1);
    rejects('fractional height', (json) => (json['output'] as Map)['height'] = 1.5);
    rejects('bad crop', (json) => (json['output'] as Map)['crop'] = 'sideways');
    rejects('background not text', (json) => (json['output'] as Map)['background'] = 1);
    rejects('source not text', (json) => json['source'] = 1);
  });

  test('every preset in presets/ loads and is named after its id', () {
    final folder = Directory('../presets');
    final files = folder.listSync().whereType<File>().where((f) => f.path.endsWith('.json'));
    expect(files, isNotEmpty);
    for (final file in files) {
      final name = file.uri.pathSegments.last;
      expect(() => Preset.parse(file.readAsStringSync(), fileName: name), returnsNormally);
    }
  });
}
