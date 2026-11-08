// Turns a HEIC photo into a PNG, so the picture engine can take it from there. Chrome and Firefox
// can't read HEIC themselves. In its own worker because libheif is large and only loaded when needed.
importScripts('vendor/libheif/libheif-bundle.js');

self.onmessage = async ({ data }) => {
  try {
    const lib = libheif();
    const images = new lib.HeifDecoder().decode(data);
    if (!images || images.length === 0) throw new Error('No pictures');
    const image = images[0];
    const width = image.get_width();
    const height = image.get_height();
    const pixels = new ImageData(width, height);
    await new Promise((resolve, reject) => {
      image.display(pixels, (shown) => (shown ? resolve() : reject(new Error('Not decoded'))));
    });
    for (const each of images) each.free();

    const canvas = new OffscreenCanvas(width, height);
    canvas.getContext('2d').putImageData(pixels, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const png = new Uint8Array(await blob.arrayBuffer());
    self.postMessage({ png }, [png.buffer]);
  } catch (error) {
    console.warn('Could not decode a HEIC photo', error);
    self.postMessage({ failure: 'This photo could not be read. It may be damaged.', key: 'photoDamaged' });
  }
};
