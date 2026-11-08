import 'dart:convert';
import 'dart:typed_data';

/// What a PDF needs to know about a JPEG to embed it without re-encoding.
typedef JpegInfo = ({int width, int height, int components});

/// Reads the size and colour channels from a JPEG's frame header. Null if it is not a JPEG.
JpegInfo? readJpegInfo(Uint8List bytes) {
  if (bytes.length < 4 || bytes[0] != 0xFF || bytes[1] != 0xD8) return null;
  var i = 2;
  while (i + 9 < bytes.length) {
    if (bytes[i] != 0xFF) return null;
    final marker = bytes[i + 1];
    if (marker == 0xFF) {
      i++;
      continue;
    }
    final isFrameHeader =
        marker >= 0xC0 && marker <= 0xCF && marker != 0xC4 && marker != 0xC8 && marker != 0xCC;
    if (isFrameHeader) {
      return (
        height: bytes[i + 5] << 8 | bytes[i + 6],
        width: bytes[i + 7] << 8 | bytes[i + 8],
        components: bytes[i + 9],
      );
    }
    i += 2 + (bytes[i + 2] << 8 | bytes[i + 3]);
  }
  return null;
}

/// PDF pages cannot be larger than this many points on a side.
const _maxPagePoints = 14400;

/// Builds a PDF with one page per JPEG, each page the size of its picture.
///
/// libvips has no PDF writer without ImageMagick, and JPEG data can go into a PDF as is.
Uint8List buildImagePdf(List<Uint8List> jpegs) {
  if (jpegs.isEmpty) throw ArgumentError('A PDF needs at least one image');
  final images = <JpegInfo>[];
  for (final jpeg in jpegs) {
    final info = readJpegInfo(jpeg);
    if (info == null) throw ArgumentError('Not a JPEG image');
    images.add(info);
  }

  final out = BytesBuilder(copy: false);
  final offsets = <int>[];
  void write(String text) => out.add(latin1.encode(text));
  void object(int number, void Function() body) {
    offsets.add(out.length);
    write('$number 0 obj\n');
    body();
    write('\nendobj\n');
  }

  // Objects: 1 catalogue, 2 page list, then a page, content and image for each picture.
  int pageObject(int index) => 3 + index * 3;
  write('%PDF-1.4\n');
  object(1, () => write('<< /Type /Catalog /Pages 2 0 R >>'));
  final kids = [for (var i = 0; i < images.length; i++) '${pageObject(i)} 0 R'].join(' ');
  object(2, () => write('<< /Type /Pages /Kids [$kids] /Count ${images.length} >>'));

  for (var i = 0; i < images.length; i++) {
    final image = images[i];
    final page = pageObject(i);
    final longest = image.width > image.height ? image.width : image.height;
    final scale = longest > _maxPagePoints ? _maxPagePoints / longest : 1.0;
    final width = (image.width * scale).toStringAsFixed(2);
    final height = (image.height * scale).toStringAsFixed(2);

    object(
      page,
      () => write(
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $width $height] '
        '/Resources << /XObject << /Im0 ${page + 2} 0 R >> >> /Contents ${page + 1} 0 R >>',
      ),
    );
    final content = 'q $width 0 0 $height 0 0 cm /Im0 Do Q';
    object(page + 1, () {
      write('<< /Length ${content.length} >>\nstream\n$content\nendstream');
    });
    object(page + 2, () {
      final (colourSpace, decode) = switch (image.components) {
        1 => ('/DeviceGray', ''),
        4 => ('/DeviceCMYK', ' /Decode [1 0 1 0 1 0 1 0]'),
        _ => ('/DeviceRGB', ''),
      };
      write(
        '<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} '
        '/ColorSpace $colourSpace /BitsPerComponent 8 /Filter /DCTDecode$decode '
        '/Length ${jpegs[i].length} >>\nstream\n',
      );
      out.add(jpegs[i]);
      write('\nendstream');
    });
  }

  final xref = out.length;
  write('xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n');
  for (final offset in offsets) {
    write('${offset.toString().padLeft(10, '0')} 00000 n \n');
  }
  write('trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n$xref\n%%EOF\n');
  return out.takeBytes();
}
