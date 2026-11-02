#!/bin/bash
# Builds the FFmpeg we ship on macOS, from pinned sources. LGPL only: no x264 and no other GPL parts,
# so video encoding uses Apple's hardware encoder. Networking is compiled out, so this binary cannot
# reach the internet at all. Result: engines/build/macos/bin/{ffmpeg,ffprobe}
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)/build/macos"
sources="$root/sources"
prefix="$root/prefix"
mkdir -p "$sources" "$prefix"

fetch() {
  local url="$1" sum="$2" file
  file="$sources/$(basename "$url")"
  [ -f "$file" ] || curl -fsSL -o "$file" "$url"
  echo "$sum  $file" | shasum -a 256 -c - >/dev/null
  echo "$file"
}

unpack() {
  local dir="$sources/$2"
  rm -rf "$dir"
  mkdir -p "$dir"
  tar -xf "$1" -C "$dir" --strip-components=1
  echo "$dir"
}

jobs="$(sysctl -n hw.ncpu)"

opus="$(unpack "$(fetch https://downloads.xiph.org/releases/opus/opus-1.5.2.tar.gz \
  65c1d2f78b9f2fb20082c38cbe47c951ad5839345876e46941612ee87f9a7ce1)" opus)"
(cd "$opus" && ./configure --prefix="$prefix" --disable-shared --enable-static --disable-doc \
  --disable-extra-programs && make -j"$jobs" install) >/dev/null

lame="$(unpack "$(fetch https://downloads.sourceforge.net/project/lame/lame/3.100/lame-3.100.tar.gz \
  ddfe36cab873794038ae2c1210557ad34857a4b6bdc515785d1da9e175b1da1e)" lame)"
# LAME's export list names a symbol that no longer exists.
sed -i '' '/lame_init_old/d' "$lame/include/libmp3lame.sym"
(cd "$lame" && ./configure --prefix="$prefix" --disable-shared --enable-static --disable-frontend \
  --disable-decoder && make -j"$jobs" install) >/dev/null

vpx="$(unpack "$(fetch https://github.com/webmproject/libvpx/archive/refs/tags/v1.15.2.tar.gz \
  26fcd3db88045dee380e581862a6ef106f49b74b6396ee95c2993a260b4636aa)" vpx)"
(cd "$vpx" && ./configure --prefix="$prefix" --disable-shared --enable-static --disable-examples \
  --disable-tools --disable-docs --disable-unit-tests --enable-vp9-highbitdepth \
  && make -j"$jobs" install) >/dev/null

ffmpeg="$(unpack "$(fetch https://ffmpeg.org/releases/ffmpeg-9.0.2.tar.xz \
  8c3850283eb25fa026482078a04051e0be17347b09ef81a0849bec15a96e002e)" ffmpeg)"
(cd "$ffmpeg" && PKG_CONFIG_PATH="$prefix/lib/pkgconfig" ./configure \
  --prefix="$prefix" \
  --extra-cflags="-I$prefix/include" \
  --extra-ldflags="-L$prefix/lib" \
  --pkg-config-flags=--static \
  --disable-autodetect \
  --disable-doc \
  --disable-debug \
  --disable-ffplay \
  --disable-network \
  --disable-shared \
  --enable-static \
  --enable-audiotoolbox \
  --enable-videotoolbox \
  --enable-zlib \
  --enable-libmp3lame \
  --enable-libopus \
  --enable-libvpx \
  && make -j"$jobs" install) >/dev/null

mkdir -p "$root/bin"
cp "$prefix/bin/ffmpeg" "$prefix/bin/ffprobe" "$root/bin/"
cp "$ffmpeg/COPYING.LGPLv2.1" "$root/bin/FFMPEG-LICENSE.txt"
strip "$root/bin/ffmpeg" "$root/bin/ffprobe"

# Fail the build if anything that must not ship got in.
config="$("$root/bin/ffmpeg" -hide_banner -buildconf)"
if echo "$config" | grep -qE 'enable-(gpl|nonfree)|libx26[45]'; then
  echo "This FFmpeg build includes GPL or non-free parts." >&2
  exit 1
fi
"$root/bin/ffmpeg" -hide_banner -L | grep -q 'GNU Lesser General Public'
"$root/bin/ffmpeg" -hide_banner -encoders | grep -q h264_videotoolbox
# PNG needs zlib, and ICO and some MOV files need PNG support.
"$root/bin/ffmpeg" -hide_banner -encoders | grep -q ' png '
if "$root/bin/ffmpeg" -hide_banner -protocols | grep -qE '\b(http|https|tcp|udp|rtmp)\b'; then
  echo "This FFmpeg build can reach the network." >&2
  exit 1
fi
echo "Built $root/bin/ffmpeg"
