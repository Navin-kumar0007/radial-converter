// Unpacks 7z and RAR in a browser, which pure Dart can't read, so the archive engine can take it from
// there. Its own worker because libarchive is large and only loaded when needed. Nothing here touches
// the network: the file is a blob: address.

import createLibarchive from './vendor/libarchive/libarchive.js';

// As in core/lib/src/portable_archive.dart.
const limit = 1024 * 1024 * 1024;
const chunk = 1024 * 1024;
const mostFiles = 100000;
const retryable = -20; // ARCHIVE_WARN

// A failure written for the user. key and args name the message in core/lib/src/failures.dart, so
// the app can show it in its own language.
class Plain extends Error {
  constructor(message, key, args = {}) {
    super(message);
    this.key = key;
    this.args = args;
  }
}

function locked(name) {
  return new Plain(`${name} has a password. Locked 7z and RAR files can't be opened yet.`, 'lockedArchive', { name });
}

function tooLarge(name) {
  return new Plain(`${name} is too large to open here.`, 'tooLargeHere', { name });
}

function failure(name, reason) {
  const lower = reason.toLowerCase();
  if (lower.includes('encrypt') || lower.includes('passphrase') || lower.includes('password')) {
    return locked(name);
  }
  return new Plain(
    `${name} could not be read. It may be damaged, or one part of several.`,
    'damagedOrPart',
    { name },
  );
}

async function unpack(url, name) {
  const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
  const lib = await createLibarchive();
  const source = lib._malloc(bytes.length);
  const buffer = lib._malloc(chunk);
  if (source === 0 || buffer === 0) throw tooLarge(name);
  lib.HEAPU8.set(bytes, source);
  const archive = lib._radial_open(source, bytes.length);
  try {
    const error = () => lib.UTF8ToString(lib._radial_error(archive));
    const files = [];
    let total = 0;
    while (true) {
      const entry = lib._radial_next(archive);
      if (entry === 0) break;
      if (entry === -1) throw failure(name, error());
      if (lib._radial_is_encrypted(entry)) throw locked(name);
      if (!lib._radial_is_regular_file(entry)) continue;
      if (files.length >= mostFiles) {
        throw new Plain(`${name} holds too many files to open here.`, 'tooManyInArchive', { name });
      }
      const namePointer = lib._radial_name(entry);
      // A name that can't be read mustn't lose the file.
      const entryName = (namePointer && lib.UTF8ToString(namePointer)) || `file ${files.length + 1}`;

      const parts = [];
      let size = 0;
      while (true) {
        const count = lib._radial_read(archive, buffer, chunk);
        if (count === 0) break;
        if (count === retryable) continue;
        if (count < 0) throw failure(name, error());
        total += count;
        // What really comes out, however little the archive claims, so a zip bomb stops here.
        if (total > limit) throw tooLarge(name);
        // A new view each time, as memory growing leaves old ones empty.
        parts.push(lib.HEAPU8.slice(buffer, buffer + count));
        size += count;
      }
      const whole = new Uint8Array(size);
      let at = 0;
      for (const part of parts) {
        whole.set(part, at);
        at += part.length;
      }
      files.push({ name: entryName, bytes: whole });
    }
    if (files.length === 0) throw new Plain(`${name} has no files in it.`, 'emptyArchive', { name });
    return files;
  } finally {
    lib._radial_close(archive);
  }
}

self.onmessage = async ({ data }) => {
  try {
    const files = await unpack(data.url, data.name);
    self.postMessage({ files }, files.map((file) => file.bytes.buffer));
  } catch (error) {
    if (error instanceof Plain) {
      self.postMessage({ failure: error.message, key: error.key, args: error.args });
    } else {
      console.error(error);
      self.postMessage({
        failure: `${data.name} could not be read. It may be damaged, or too large.`,
        key: 'damagedOrTooLarge',
        args: { name: data.name },
      });
    }
  }
};
