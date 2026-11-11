// Adds one command to pdfrx's PDFium worker (MIT), which is loaded unmodified just before this:
// readExtras, which reads what pdfrx doesn't, each letter's font and each picture on a page, for
// PDF to Word. lib/pdf_extras_web.dart starts it, and lib/pdf_extras_native.dart does the same on
// other platforms, so keep the two alike.

/* global Pdfium, StringUtils, functions */

const smallestPicture = 24; // points, as smallestPicture in pdf_extras.dart
const largestPictureSide = 1600; // pixels, as largestPictureSide there

/**
 * @param {{data: ArrayBuffer, password: string | null}} params
 */
async function readExtras(params) {
  const api = Pdfium.wasmExports;
  const size = params.data.byteLength;
  const buffer = api.malloc(size);
  if (buffer === 0) throw new Error('Out of memory');
  new Uint8Array(Pdfium.memory.buffer, buffer, size).set(new Uint8Array(params.data));
  const password = StringUtils.allocateUTF8(params.password || '');
  const document = api.FPDF_LoadMemDocument(buffer, size, password);
  StringUtils.freeUTF8(password);
  const pages = [];
  try {
    if (document === 0) return { pages };
    const count = api.FPDF_GetPageCount(document);
    for (let i = 0; i < count; i++) {
      try {
        pages.push(await readPage(api, document, i));
      } catch (_) {
        pages.push(null);
      }
    }
  } finally {
    if (document !== 0) api.FPDF_CloseDocument(document);
    api.free(buffer);
  }
  const transfer = [];
  for (const page of pages) {
    for (const picture of page?.pictures ?? []) transfer.push(picture.jpeg);
  }
  return { result: { pages }, transfer };
}

async function readPage(api, document, index) {
  const page = api.FPDF_LoadPage(document, index);
  if (page === 0) return null;
  try {
    // Heights are measured from the page's own bottom edge, as pdfrx measures the text.
    const box = api.malloc(16);
    api.FPDF_GetPageBoundingBox(page, box);
    const bottom = new Float32Array(Pdfium.memory.buffer, box, 4)[3];
    api.free(box);
    const pageWidth = api.FPDF_GetPageWidthF(page);
    const pageHeight = api.FPDF_GetPageHeightF(page);
    const text = readText(api, page);
    const pictures = await readPictures(api, document, page, bottom, pageWidth, pageHeight);
    return { ...text, pictures };
  } finally {
    api.FPDF_ClosePage(page);
  }
}

/** Each letter's code and font, the fonts listed once each. */
function readText(api, page) {
  const textPage = api.FPDFText_LoadPage(page);
  const codes = [];
  const fontIds = [];
  const fonts = [];
  if (textPage === 0) return { codes, fontIds, fonts };
  const nameLength = 256;
  const name = api.malloc(nameLength);
  const flags = api.malloc(4);
  const known = new Map();
  try {
    const count = api.FPDFText_CountChars(textPage);
    for (let i = 0; i < count; i++) {
      codes.push(api.FPDFText_GetUnicode(textPage, i));
      const length = api.FPDFText_GetFontInfo(textPage, i, name, nameLength, flags);
      const font =
        length <= 1
          ? ''
          : new TextDecoder().decode(
              new Uint8Array(Pdfium.memory.buffer, name, Math.min(length, nameLength) - 1).slice()
            );
      const weight = api.FPDFText_GetFontWeight(textPage, i);
      const flagBits = new Int32Array(Pdfium.memory.buffer, flags, 1)[0];
      const key = `${font}/${weight}/${flagBits}`;
      let id = known.get(key);
      if (id === undefined) {
        id = fonts.length;
        known.set(key, id);
        fonts.push({ name: font, weight, flags: flagBits });
      }
      fontIds.push(id);
    }
  } finally {
    api.free(name);
    api.free(flags);
    api.FPDFText_ClosePage(textPage);
  }
  return { codes, fontIds, fonts };
}

async function readPictures(api, document, page, bottom, pageWidth, pageHeight) {
  const imageObject = 3;
  const edges = api.malloc(16);
  const pictures = [];
  try {
    const count = api.FPDFPage_CountObjects(page);
    for (let i = 0; i < count; i++) {
      const object = api.FPDFPage_GetObject(page, i);
      if (api.FPDFPageObj_GetType(object) !== imageObject) continue;
      if (!api.FPDFPageObj_GetBounds(object, edges, edges + 4, edges + 8, edges + 12)) continue;
      const [left, low, right, top] = new Float32Array(Pdfium.memory.buffer, edges, 4);
      const width = right - left;
      const height = top - low;
      // As keepsPicture in pdf_extras.dart: no specks, and no background filling the page.
      if (width < smallestPicture || height < smallestPicture) continue;
      if (width * height >= pageWidth * pageHeight * 0.8) continue;
      const jpeg = await renderedJpeg(api, document, page, object);
      if (jpeg) pictures.push({ top: top - bottom, width, ...jpeg });
    }
  } finally {
    api.free(edges);
  }
  return pictures;
}

/** The picture as drawn on the page, turned and masked as there, as a JPEG on white. */
async function renderedJpeg(api, document, page, object) {
  const bitmap = api.FPDFImageObj_GetRenderedBitmap(document, page, object);
  if (bitmap === 0) return null;
  try {
    const width = api.FPDFBitmap_GetWidth(bitmap);
    const height = api.FPDFBitmap_GetHeight(bitmap);
    const stride = api.FPDFBitmap_GetStride(bitmap);
    const format = api.FPDFBitmap_GetFormat(bitmap);
    if (width <= 0 || height <= 0 || width * height > 40000000) return null;
    // PDFium's formats: 1 grey, 2 BGR, 3 BGRx, 4 BGRA.
    const channels = { 1: 1, 2: 3, 3: 4, 4: 4 }[format];
    if (!channels) return null;
    const source = new Uint8Array(
      Pdfium.memory.buffer,
      api.FPDFBitmap_GetBuffer(bitmap),
      stride * height
    );
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const from = y * stride + x * channels;
        const to = (y * width + x) * 4;
        if (channels === 1) {
          rgba[to] = rgba[to + 1] = rgba[to + 2] = source[from];
        } else {
          const alpha = format === 4 ? source[from + 3] : 255;
          rgba[to] = (source[from + 2] * alpha + 255 * (255 - alpha)) / 255;
          rgba[to + 1] = (source[from + 1] * alpha + 255 * (255 - alpha)) / 255;
          rgba[to + 2] = (source[from] * alpha + 255 * (255 - alpha)) / 255;
        }
        rgba[to + 3] = 255;
      }
    }
    const scale = Math.min(1, largestPictureSide / Math.max(width, height));
    const wide = Math.max(1, Math.round(width * scale));
    const high = Math.max(1, Math.round(height * scale));
    const full = new OffscreenCanvas(width, height);
    full.getContext('2d').putImageData(new ImageData(rgba, width, height), 0, 0);
    const sized = new OffscreenCanvas(wide, high);
    sized.getContext('2d').drawImage(full, 0, 0, wide, high);
    const blob = await sized.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
    return { jpeg: await blob.arrayBuffer(), pixelsWide: wide, pixelsHigh: high };
  } finally {
    api.FPDFBitmap_Destroy(bitmap);
  }
}

functions.readExtras = readExtras;
