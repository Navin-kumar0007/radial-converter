// Converts video and audio in a browser worker, using the browser's own hardware encoders through
// Mediabunny. Reads the file piece by piece and writes to the browser's private storage, so a file
// far larger than memory still works. Nothing here touches the network.

import {
  ALL_FORMATS,
  BufferTarget,
  Conversion,
  Input,
  MkvOutputFormat,
  MovOutputFormat,
  Mp4OutputFormat,
  OggOutputFormat,
  Output,
  Quality,
  StreamTarget,
  UrlSource,
  WavOutputFormat,
  WebMOutputFormat,
} from './vendor/mediabunny/mediabunny.min.mjs';

const prefix = 'radial-';

class Plain extends Error {}

async function storage() {
  return navigator.storage.getDirectory();
}

async function openInput(url) {
  // Piece by piece. Asking for the whole file as a blob fails on very large files.
  return new Input({ source: new UrlSource(url), formats: ALL_FORMATS });
}

async function probe(url) {
  const input = await openInput(url);
  try {
    const video = await input.getPrimaryVideoTrack();
    const audio = await input.getPrimaryAudioTrack();
    return {
      seconds: await input.computeDuration(),
      hasVideo: video !== null,
      hasAudio: audio !== null,
      width: video ? video.displayWidth : null,
      height: video ? video.displayHeight : null,
    };
  } finally {
    input.dispose?.();
  }
}

function formatFor(extension) {
  switch (extension) {
    case 'mp4':
    case 'm4a':
      return new Mp4OutputFormat();
    case 'mov':
      return new MovOutputFormat();
    case 'mkv':
      return new MkvOutputFormat();
    case 'webm':
      return new WebMOutputFormat();
    case 'opus':
      return new OggOutputFormat();
    case 'wav':
      return new WavOutputFormat();
    default:
      throw new Plain('This format can\'t be written yet.');
  }
}

/// Writes to private storage when the browser can, otherwise to memory.
async function openTarget() {
  try {
    const root = await storage();
    const name = prefix + crypto.randomUUID();
    const handle = await root.getFileHandle(name, { create: true });
    const writable = await handle.createWritable();
    return {
      target: new StreamTarget(writable, { chunked: true }),
      finish: () => handle.getFile(),
      discard: () => root.removeEntry(name).catch(() => {}),
    };
  } catch (_) {
    const target = new BufferTarget();
    return {
      target,
      finish: async () => new Blob([target.buffer]),
      discard: async () => {},
    };
  }
}

/// A container may technically allow a codec that players won't open, like MP3 in an .m4a. So
/// streams are copied only when the plan's codec is what people expect in that format.
const copyable = { avc: ['avc', 'hevc'], vp9: ['vp9', 'vp8', 'av1'] };

function videoOptions(plan) {
  if (plan.dropVideo) return { discard: true };
  return (track) => {
    const expected = copyable[plan.videoCodec] ?? [plan.videoCodec];
    if (plan.copyIfPossible && (!plan.videoCodec || expected.includes(track.codec))) return {};
    const options = {};
    if (plan.videoCodec) options.codec = plan.videoCodec;
    if (plan.videoKbps) options.quality = new Quality({ bitrate: plan.videoKbps * 1000 });
    if (plan.width && plan.height) {
      options.width = plan.width;
      options.height = plan.height;
      options.fit = 'contain';
    }
    if (plan.degrees) options.rotate = plan.degrees;
    return options;
  };
}

function audioOptions(plan) {
  if (plan.dropAudio) return { discard: true };
  return (track) => {
    if (plan.copyIfPossible && (!plan.audioCodec || track.codec === plan.audioCodec)) return {};
    const options = {};
    if (plan.audioCodec) options.codec = plan.audioCodec;
    if (plan.audioKbps) options.quality = new Quality({ bitrate: plan.audioKbps * 1000 });
    return options;
  };
}

async function convert(url, plan) {
  const input = await openInput(url);
  const opened = await openTarget();
  const output = new Output({ target: opened.target, format: formatFor(plan.output) });
  try {
    const options = {
      input,
      output,
      video: videoOptions(plan),
      audio: audioOptions(plan),
      // Location and other details in the file are not carried over.
      tags: {},
    };
    if (plan.startSeconds != null || plan.endSeconds != null) {
      options.trim = {};
      if (plan.startSeconds != null) options.trim.start = plan.startSeconds;
      if (plan.endSeconds != null) options.trim.end = plan.endSeconds;
    }
    const conversion = await Conversion.init(options);
    if (!conversion.isValid) {
      console.error('Discarded tracks', conversion.discardedTracks);
      throw new Plain('This browser can\'t convert this file to that format.');
    }
    conversion.onProgress = (progress) => self.postMessage({ progress });
    await conversion.execute();
    const file = await opened.finish();
    return { file, size: file.size };
  } catch (error) {
    await opened.discard();
    throw error;
  } finally {
    input.dispose?.();
  }
}

async function cleanUp() {
  try {
    const root = await storage();
    for await (const name of root.keys()) {
      if (name.startsWith(prefix)) await root.removeEntry(name).catch(() => {});
    }
  } catch (_) {
    // No private storage in this browser, so nothing to clean.
  }
}

self.onmessage = async ({ data }) => {
  try {
    if (data.command === 'cleanUp') {
      await cleanUp();
      self.postMessage({ cleaned: true });
    } else if (data.command === 'probe') {
      self.postMessage({ info: await probe(data.url) });
    } else if (data.command === 'convert') {
      self.postMessage(await convert(data.url, data.plan));
    }
  } catch (error) {
    console.error(error);
    self.postMessage({
      failure: error instanceof Plain
        ? error.message
        : 'This file could not be converted. It may use a format this browser can\'t read.',
    });
  }
};
