#!/bin/bash
# Builds the FFmpeg we ship on macOS, from pinned sources. LGPL only: no x264 and no other GPL parts,
# so video encoding uses Apple's hardware encoder. Networking is compiled out, so this binary cannot
# reach the internet at all. Both kinds of Mac, in one program each.
# Result: engines/build/macos/bin/{ffmpeg,ffprobe}. Needs nasm and pkg-config.
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)/build/macos"
sources="$root/sources"
mkdir -p "$sources"

# The oldest macOS the app runs on. Without this the programs ask for the macOS that built them.
export MACOSX_DEPLOYMENT_TARGET=12.0

fetch() {
  local url="$1" sum="$2" file
  file="$sources/$(basename "$url")"
  [ -f "$file" ] || curl -fsSL -o "$file" "$url"
  echo "$sum  $file" | shasum -a 256 -c - >/dev/null
  echo "$file"
}

jobs="$(sysctl -n hw.ncpu)"
native="$(uname -m)"

opus_src="$(fetch https://downloads.xiph.org/releases/opus/opus-1.5.2.tar.gz \
  65c1d2f78b9f2fb20082c38cbe47c951ad5839345876e46941612ee87f9a7ce1)"
lame_src="$(fetch https://downloads.sourceforge.net/project/lame/lame/3.100/lame-3.100.tar.gz \
  ddfe36cab873794038ae2c1210557ad34857a4b6bdc515785d1da9e175b1da1e)"
vpx_src="$(fetch https://github.com/webmproject/libvpx/archive/refs/tags/v1.15.2.tar.gz \
  26fcd3db88045dee380e581862a6ef106f49b74b6396ee95c2993a260b4636aa)"
ffmpeg_src="$(fetch https://ffmpeg.org/releases/ffmpeg-9.0.2.tar.xz \
  8c3850283eb25fa026482078a04051e0be17347b09ef81a0849bec15a96e002e)"

# Builds everything for one kind of Mac. Result: engines/build/macos/<arch>/prefix/bin
build_for() {
  local arch="$1" work="$root/$1" prefix="$root/$1/prefix"
  # darwin21 is macOS 12, as above. Left to itself libvpx may not recognise a newer system.
  local host_args=() vpx_args=(--target="$arch-darwin21-gcc") ffmpeg_args=()
  if [ "$arch" != "$native" ]; then
    local triple="$arch"
    [ "$arch" = arm64 ] && triple=aarch64
    host_args=(--host="$triple-apple-darwin")
    ffmpeg_args=(--enable-cross-compile --target-os=darwin --arch="$arch")
  fi
  if [ "$arch" = x86_64 ]; then
    # Intel needs an assembler to run at full speed.
    vpx_args+=(--as=nasm)
    ffmpeg_args+=(--x86asmexe=nasm)
  fi
  rm -rf "$work"
  mkdir -p "$prefix"

  unpack() {
    local dir="$work/$2"
    mkdir -p "$dir"
    tar -xf "$1" -C "$dir" --strip-components=1
    echo "$dir"
  }

  (
    export CFLAGS="-arch $arch -O2" CXXFLAGS="-arch $arch -O2" LDFLAGS="-arch $arch"

    opus="$(unpack "$opus_src" opus)"
    (cd "$opus" && ./configure "${host_args[@]+"${host_args[@]}"}" --prefix="$prefix" \
      --disable-shared --enable-static --disable-doc --disable-extra-programs \
      && make -j"$jobs" install) >/dev/null

    lame="$(unpack "$lame_src" lame)"
    # LAME's export list names a symbol that no longer exists.
    sed -i '' '/lame_init_old/d' "$lame/include/libmp3lame.sym"
    (cd "$lame" && ./configure "${host_args[@]+"${host_args[@]}"}" --prefix="$prefix" \
      --disable-shared --enable-static --disable-frontend --disable-decoder \
      && make -j"$jobs" install) >/dev/null

    vpx="$(unpack "$vpx_src" vpx)"
    (cd "$vpx" && ./configure "${vpx_args[@]+"${vpx_args[@]}"}" --prefix="$prefix" \
      --disable-shared --enable-static --disable-examples --disable-tools --disable-docs \
      --disable-unit-tests --enable-vp9-highbitdepth && make -j"$jobs" install) >/dev/null

    unset CFLAGS CXXFLAGS LDFLAGS
    ffmpeg="$(unpack "$ffmpeg_src" ffmpeg)"
    (cd "$ffmpeg" && PKG_CONFIG_PATH="$prefix/lib/pkgconfig" ./configure \
      "${ffmpeg_args[@]+"${ffmpeg_args[@]}"}" \
      --cc="clang -arch $arch" \
      --cxx="clang++ -arch $arch" \
      --prefix="$prefix" \
      --extra-cflags="-I$prefix/include" \
      --extra-ldflags="-L$prefix/lib" \
      --pkg-config=pkg-config \
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
  )
}

build_for arm64
build_for x86_64

# One program holding both, as the app itself is.
rm -rf "$root/bin"
mkdir -p "$root/bin"
for program in ffmpeg ffprobe; do
  lipo -create "$root/arm64/prefix/bin/$program" "$root/x86_64/prefix/bin/$program" \
    -output "$root/bin/$program"
done
cp "$root/$native/ffmpeg/COPYING.LGPLv2.1" "$root/bin/FFMPEG-LICENSE.txt"
strip "$root/bin/ffmpeg" "$root/bin/ffprobe"

for program in ffmpeg ffprobe; do
  for arch in arm64 x86_64; do
    lipo "$root/bin/$program" -verify_arch "$arch"
    if ! vtool -show-build -arch "$arch" "$root/bin/$program" | grep -q "minos $MACOSX_DEPLOYMENT_TARGET"; then
      echo "The $arch $program asks for a newer macOS than the app does." >&2
      exit 1
    fi
  done
done

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
