#!/bin/bash
# Builds what reads 7z and RAR on Windows, with vcpkg, and copies it to the folder given: the one
# holding the app's program, as Windows looks there for a library's own libraries. libarchive has no
# Windows downloads. BSD and similar licences only: no OpenSSL, as encrypted archives can't be read.
# macOS has its own libarchive, and Android's comes with the Gradle package.
set -euo pipefail

destination="$1"
root="$(cd "$(dirname "$0")" && pwd)/build/windows-libarchive"

if [ ! -f "$root/archive.dll" ]; then
  vcpkg="${VCPKG_INSTALLATION_ROOT:?This needs vcpkg}"
  "$vcpkg/vcpkg" install 'libarchive[core,bzip2,lzma]:x64-windows' --clean-after-build
  mkdir -p "$root"
  cp "$vcpkg"/installed/x64-windows/bin/*.dll "$root/"
  "$vcpkg/vcpkg" list | grep -E '^(libarchive|liblzma|bzip2|zlib)' | tee "$root/versions.txt"
fi

mkdir -p "$destination"
cp "$root"/*.dll "$destination/"
echo "Copied to $destination:"
ls "$root"
