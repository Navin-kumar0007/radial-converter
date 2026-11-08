// The little the browser's archive worker needs from libarchive. Reads return real byte counts, so a
// damaged file can't pass for a whole one, and the worker counts what really comes out.

#include <archive.h>
#include <archive_entry.h>
#include <emscripten.h>
#include <locale.h>
#include <stddef.h>

// Only the formats wanted, so nothing else in the library ever sees a stranger's file.
EMSCRIPTEN_KEEPALIVE
struct archive *radial_open(const void *bytes, size_t size) {
  // Without this any name that isn't plain English comes back empty.
  setlocale(LC_ALL, "C.UTF-8");
  struct archive *archive = archive_read_new();
  if (archive == NULL) return NULL;
  archive_read_support_format_7zip(archive);
  archive_read_support_format_rar(archive);
  archive_read_support_format_rar5(archive);
  // If this fails, reading the first entry says why.
  archive_read_open_memory(archive, bytes, size);
  return archive;
}

// The next entry, 0 at the end, or -1 if the archive can't be read further.
EMSCRIPTEN_KEEPALIVE
long radial_next(struct archive *archive) {
  struct archive_entry *entry = NULL;
  int result;
  do {
    result = archive_read_next_header(archive, &entry);
  } while (result == ARCHIVE_RETRY);
  if (result == ARCHIVE_EOF) return 0;
  if (result != ARCHIVE_OK && result != ARCHIVE_WARN) return -1;
  return (long)entry;
}

// Links stay out, so they can't point anywhere.
EMSCRIPTEN_KEEPALIVE
int radial_is_regular_file(struct archive_entry *entry) {
  return archive_entry_filetype(entry) == AE_IFREG && archive_entry_hardlink(entry) == NULL;
}

EMSCRIPTEN_KEEPALIVE
int radial_is_encrypted(struct archive_entry *entry) {
  return archive_entry_is_encrypted(entry) > 0;
}

EMSCRIPTEN_KEEPALIVE
const char *radial_name(struct archive_entry *entry) {
  return archive_entry_pathname_utf8(entry);
}

// How many bytes were read, 0 at the end of the file, or below 0 if it failed.
EMSCRIPTEN_KEEPALIVE
long radial_read(struct archive *archive, void *buffer, size_t size) {
  la_ssize_t count;
  do {
    count = archive_read_data(archive, buffer, size);
  } while (count == ARCHIVE_RETRY);
  return (long)count;
}

EMSCRIPTEN_KEEPALIVE
const char *radial_error(struct archive *archive) {
  const char *message = archive_error_string(archive);
  return message == NULL ? "" : message;
}

EMSCRIPTEN_KEEPALIVE
void radial_close(struct archive *archive) {
  archive_read_free(archive);
}
