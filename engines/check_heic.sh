#!/bin/bash
# Checks that the FFmpeg we ship reads iPhone photos: split into tiles, and turned by a tag rather than
# in the pixels. test-files/portrait.heic is 1200 by 800 in the file and 800 by 1200 when upright.
# Usage: engines/check_heic.sh <folder with ffmpeg and ffprobe>
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
out="$(mktemp -d)/portrait.png"
"$1/ffmpeg" -hide_banner -loglevel error -i "$here/../test-files/portrait.heic" -frames:v 1 "$out"
size="$("$1/ffprobe" -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$out" | tr -d '\r')"
if [ "$size" != "800,1200" ]; then
  echo "This FFmpeg read the photo as $size, not 800,1200." >&2
  exit 1
fi
echo "HEIC reads correctly."
