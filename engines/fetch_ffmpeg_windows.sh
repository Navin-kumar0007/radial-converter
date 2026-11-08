#!/bin/bash
# Puts the FFmpeg we ship on Windows into the folder given. It is an LGPL build from
# https://github.com/BtbN/FFmpeg-Builds, pinned by release and checksum. Old releases there get removed:
# when this download fails, choose a newer autobuild tag and update these three lines.
set -euo pipefail

tag=autobuild-2026-11-02-12-51
name=ffmpeg-N-128293-gb034eb5e7e-win64-lgpl
sum=dffd61c77a4d8b7d29fdbcafd661e41b806bf5cb896645073518a962cb8c92b9

target="$1"
work="$(mktemp -d)"
# Kept between runs (CI caches this folder), as GitHub's release downloads can fail for a while.
downloads="$(cd "$(dirname "$0")" && pwd)/build/downloads"
zip="$downloads/$name.zip"
mkdir -p "$downloads"
if [ ! -f "$zip" ] || ! echo "$sum  $zip" | sha256sum -c - >/dev/null 2>&1; then
  curl -fsSL --retry 6 --retry-all-errors --retry-delay 30 -o "$zip" \
    "https://github.com/BtbN/FFmpeg-Builds/releases/download/$tag/$name.zip"
fi
echo "$sum  $zip" | sha256sum -c -
unzip -q "$zip" -d "$work"

# Fail if anything that must not ship got in, or the hardware encoder went missing.
strings "$work/$name/bin/ffmpeg.exe" > "$work/strings.txt"
if grep -qE -- '--enable-(gpl|nonfree|libx264|libx265)' "$work/strings.txt"; then
  echo "This FFmpeg build includes GPL or non-free parts." >&2
  exit 1
fi
grep -q '^h264_mf$' "$work/strings.txt"

mkdir -p "$target"
cp "$work/$name/bin/ffmpeg.exe" "$work/$name/bin/ffprobe.exe" "$target/"
cp "$work/$name/LICENSE.txt" "$target/FFMPEG-LICENSE.txt"
