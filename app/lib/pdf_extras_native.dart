import 'dart:convert';
import 'dart:ffi';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:ffi/ffi.dart';
import 'package:image/image.dart' as img;
import 'package:pdfium_dart/pdfium_dart.dart' as pdfium_bindings;
import 'package:pdfrx/pdfrx.dart';
import 'package:radial_core/radial_core.dart';

import 'pdf_extras.dart';

typedef _Picture = ({double top, double width, Uint8List jpeg, int pixelsWide, int pixelsHigh});
typedef _Page = ({List<int> codes, List<bool> bold, List<_Picture> pictures});

/// Each page's bold letters and pictures, or null where they couldn't be read: then the page
/// comes through as before, plain and without pictures. Runs on pdfrx's own PDFium thread, as
/// PDFium can't be used from two at once.
Future<List<PageExtras?>?> readPageExtras(Uint8List pdf, {String? password}) async {
  try {
    final pages = await PdfrxEntryFunctions.instance.compute(_read, (
      pdf: pdf,
      password: password,
      module: Pdfrx.pdfiumModulePath,
    ));
    return [
      for (final page in pages)
        page == null
            ? null
            : PageExtras(
                codes: page.codes,
                bold: page.bold,
                pictures: [
                  for (final picture in page.pictures)
                    (
                      top: picture.top,
                      picture: DocxPicture(
                        picture.jpeg,
                        width: picture.pixelsWide,
                        height: picture.pixelsHigh,
                        displayWidth: picture.width,
                      ),
                    ),
                ],
              ),
    ];
  } catch (_) {
    return null;
  }
}

List<_Page?> _read(({Uint8List pdf, String? password, String? module}) message) {
  final pdfium = pdfium_bindings.getPdfium(modulePath: message.module);
  return using((arena) {
    final data = arena<Uint8>(message.pdf.length);
    data.asTypedList(message.pdf.length).setAll(0, message.pdf);
    final password = message.password == null
        ? nullptr
        : message.password!.toNativeUtf8(allocator: arena).cast<Char>();
    final document = pdfium.FPDF_LoadMemDocument64(data.cast(), message.pdf.length, password);
    if (document == nullptr) return const [];
    try {
      final count = pdfium.FPDF_GetPageCount(document);
      return [for (var i = 0; i < count; i++) _readPage(pdfium, document, i, arena)];
    } finally {
      pdfium.FPDF_CloseDocument(document);
    }
  });
}

_Page? _readPage(
  pdfium_bindings.PDFium pdfium,
  pdfium_bindings.FPDF_DOCUMENT document,
  int index,
  Arena arena,
) {
  final page = pdfium.FPDF_LoadPage(document, index);
  if (page == nullptr) return null;
  try {
    // Heights are measured from the page's own bottom edge, as pdfrx measures the text.
    final box = arena<pdfium_bindings.FS_RECTF>();
    pdfium.FPDF_GetPageBoundingBox(page, box);
    final bottom = box.ref.bottom.toDouble();
    final pageWidth = pdfium.FPDF_GetPageWidthF(page);
    final pageHeight = pdfium.FPDF_GetPageHeightF(page);
    final (:codes, :bold) = _readText(pdfium, page, arena);
    final pictures = _readPictures(
      pdfium,
      document,
      page,
      arena,
      bottom: bottom,
      pageWidth: pageWidth,
      pageHeight: pageHeight,
    );
    return (codes: codes, bold: bold, pictures: pictures);
  } catch (_) {
    return null;
  } finally {
    pdfium.FPDF_ClosePage(page);
  }
}

({List<int> codes, List<bool> bold}) _readText(
  pdfium_bindings.PDFium pdfium,
  pdfium_bindings.FPDF_PAGE page,
  Arena arena,
) {
  final text = pdfium.FPDFText_LoadPage(page);
  if (text == nullptr) return (codes: const [], bold: const []);
  try {
    const nameLength = 256;
    final name = arena<Uint8>(nameLength);
    final flags = arena<Int>();
    final count = pdfium.FPDFText_CountChars(text);
    final codes = <int>[];
    final bold = <bool>[];
    // Fonts repeat, so each one's answer is kept.
    final known = <String, bool>{};
    for (var i = 0; i < count; i++) {
      codes.add(pdfium.FPDFText_GetUnicode(text, i));
      final length = pdfium.FPDFText_GetFontInfo(text, i, name.cast(), nameLength, flags);
      final font = length <= 1
          ? ''
          : utf8.decode(name.asTypedList(math.min(length, nameLength) - 1), allowMalformed: true);
      final weight = pdfium.FPDFText_GetFontWeight(text, i);
      bold.add(
        known['$font/$weight/${flags.value}'] ??= isBoldFont(
          weight: weight,
          name: font,
          flags: flags.value,
        ),
      );
    }
    return (codes: codes, bold: bold);
  } finally {
    pdfium.FPDFText_ClosePage(text);
  }
}

List<_Picture> _readPictures(
  pdfium_bindings.PDFium pdfium,
  pdfium_bindings.FPDF_DOCUMENT document,
  pdfium_bindings.FPDF_PAGE page,
  Arena arena, {
  required double bottom,
  required double pageWidth,
  required double pageHeight,
}) {
  const imageObject = 3;
  final edges = arena<Float>(4);
  final pictures = <_Picture>[];
  final count = pdfium.FPDFPage_CountObjects(page);
  for (var i = 0; i < count; i++) {
    final object = pdfium.FPDFPage_GetObject(page, i);
    if (pdfium.FPDFPageObj_GetType(object) != imageObject) continue;
    if (pdfium.FPDFPageObj_GetBounds(object, edges, edges + 1, edges + 2, edges + 3) == 0) {
      continue;
    }
    final width = edges[2] - edges[0];
    final height = edges[3] - edges[1];
    final keep = keepsPicture(
      width: width,
      height: height,
      pageWidth: pageWidth,
      pageHeight: pageHeight,
    );
    if (!keep) continue;
    final jpeg = _renderedJpeg(pdfium, document, page, object);
    if (jpeg == null) continue;
    pictures.add((
      top: edges[3] - bottom,
      width: width,
      jpeg: jpeg.bytes,
      pixelsWide: jpeg.width,
      pixelsHigh: jpeg.height,
    ));
  }
  return pictures;
}

/// The picture as it is drawn on the page, turned and masked as there, as a JPEG.
({Uint8List bytes, int width, int height})? _renderedJpeg(
  pdfium_bindings.PDFium pdfium,
  pdfium_bindings.FPDF_DOCUMENT document,
  pdfium_bindings.FPDF_PAGE page,
  pdfium_bindings.FPDF_PAGEOBJECT object,
) {
  final bitmap = pdfium.FPDFImageObj_GetRenderedBitmap(document, page, object);
  if (bitmap == nullptr) return null;
  try {
    final width = pdfium.FPDFBitmap_GetWidth(bitmap);
    final height = pdfium.FPDFBitmap_GetHeight(bitmap);
    final stride = pdfium.FPDFBitmap_GetStride(bitmap);
    final format = pdfium.FPDFBitmap_GetFormat(bitmap);
    if (width <= 0 || height <= 0 || width * height > 40000000) return null;
    final pixels = pdfium.FPDFBitmap_GetBuffer(bitmap).cast<Uint8>().asTypedList(stride * height);
    // PDFium's formats: 1 grey, 2 BGR, 3 BGRx, 4 BGRA.
    final channels = switch (format) {
      1 => 1,
      2 => 3,
      3 || 4 => 4,
      _ => 0,
    };
    if (channels == 0) return null;
    final picture = img.Image(width: width, height: height);
    for (var y = 0; y < height; y++) {
      final row = y * stride;
      for (var x = 0; x < width; x++) {
        final at = row + x * channels;
        if (channels == 1) {
          final grey = pixels[at];
          picture.setPixelRgb(x, y, grey, grey, grey);
          continue;
        }
        var red = pixels[at + 2];
        var green = pixels[at + 1];
        var blue = pixels[at];
        if (format == 4) {
          // A see-through picture goes on white, as Word's page is.
          final alpha = pixels[at + 3];
          red = (red * alpha + 255 * (255 - alpha)) ~/ 255;
          green = (green * alpha + 255 * (255 - alpha)) ~/ 255;
          blue = (blue * alpha + 255 * (255 - alpha)) ~/ 255;
        }
        picture.setPixelRgb(x, y, red, green, blue);
      }
    }
    final longest = math.max(width, height);
    final sized = longest <= largestPictureSide
        ? picture
        : img.copyResize(
            picture,
            width: width >= height ? largestPictureSide : null,
            height: height > width ? largestPictureSide : null,
            interpolation: img.Interpolation.average,
          );
    return (bytes: img.encodeJpg(sized, quality: 85), width: sized.width, height: sized.height);
  } finally {
    pdfium.FPDFBitmap_Destroy(bitmap);
  }
}
