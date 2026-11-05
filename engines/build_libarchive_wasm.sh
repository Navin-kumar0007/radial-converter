#!/bin/bash
# Builds what reads 7z and RAR in a browser, from pinned sources. Runs in CI, in the Emscripten image:
# see .github/workflows/libarchive-wasm.yml.
# BSD and similar licences only. No OpenSSL, as encrypted archives can't be read. Its results are
# checked in, at app/web/vendor/libarchive/, as they are small and rarely change.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$here/build/libarchive-wasm"
sources="$root/sources"
prefix="$root/prefix"
out="$here/../app/web/vendor/libarchive"
mkdir -p "$sources" "$prefix" "$out"

fetch() {
  local url="$1" sum="$2" file
  file="$sources/$(basename "$url")"
  [ -f "$file" ] || curl -fsSL -o "$file" "$url"
  echo "$sum  $file" | sha256sum -c - >/dev/null
  echo "$file"
}

unpack() {
  local dir="$sources/$2"
  rm -rf "$dir"
  mkdir -p "$dir"
  tar -xf "$1" -C "$dir" --strip-components=1
  echo "$dir"
}

xz="$(unpack "$(fetch https://github.com/tukaani-project/xz/releases/download/v5.8.4/xz-5.8.4.tar.xz \
  4ce24038fd4221e0d13bc1a2de7a4db56e90b92b3bf75321f6c14be73f65de4b)" xz)"
(cd "$xz" && emconfigure ./configure --prefix="$prefix" --host=wasm32 --disable-shared --enable-static \
  --disable-threads --disable-xz --disable-xzdec --disable-lzmadec --disable-lzmainfo --disable-scripts \
  --disable-doc --disable-nls --enable-small && emmake make -j8 install) >/dev/null

libarchive="$(unpack "$(fetch https://github.com/libarchive/libarchive/releases/download/v3.8.11/libarchive-3.8.11.tar.xz \
  a3dc0872b1b39da34dc18ef1b944f0f11ffd37425d70ae04be679279f1cf43d2)" libarchive)"
mkdir -p "$libarchive/build"
(cd "$libarchive/build" && emcmake cmake .. \
  -DCMAKE_BUILD_TYPE=MinSizeRel \
  -DCMAKE_INSTALL_PREFIX="$prefix" \
  -DCMAKE_PREFIX_PATH="$prefix" \
  -DCMAKE_FIND_ROOT_PATH="$prefix" \
  -DCMAKE_C_FLAGS="-sUSE_ZLIB=1 -sUSE_BZIP2=1 -I$prefix/include" \
  -DLIBLZMA_LIBRARY="$prefix/lib/liblzma.a" \
  -DLIBLZMA_INCLUDE_DIR="$prefix/include" \
  -DENABLE_TAR=OFF -DENABLE_CPIO=OFF -DENABLE_CAT=OFF -DENABLE_UNZIP=OFF -DENABLE_TEST=OFF \
  -DENABLE_ACL=OFF -DENABLE_XATTR=OFF -DENABLE_ICONV=OFF -DENABLE_OPENSSL=OFF -DENABLE_MBEDTLS=OFF \
  -DENABLE_NETTLE=OFF -DENABLE_CNG=OFF -DENABLE_LIBXML2=OFF -DENABLE_EXPAT=OFF -DENABLE_LZ4=OFF \
  -DENABLE_LZO=OFF -DENABLE_ZSTD=OFF -DENABLE_LIBB2=OFF -DENABLE_PCREPOSIX=OFF -DENABLE_PCRE2POSIX=OFF \
  -DBUILD_SHARED_LIBS=OFF \
  && emmake make -j8 archive_static) >/dev/null

emcc "$here/libarchive_wasm/wrapper.c" \
  -I"$libarchive/libarchive" \
  "$libarchive/build/libarchive/libarchive.a" "$prefix/lib/liblzma.a" \
  -sUSE_ZLIB=1 -sUSE_BZIP2=1 \
  -Oz -flto \
  -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=createLibarchive \
  -sENVIRONMENT=worker \
  -sDYNAMIC_EXECUTION=0 \
  -sFILESYSTEM=0 \
  -sALLOW_MEMORY_GROWTH=1 -sMAXIMUM_MEMORY=3gb \
  -sEXPORTED_FUNCTIONS=_malloc,_free \
  -sEXPORTED_RUNTIME_METHODS=UTF8ToString,HEAPU8 \
  -o "$out/libarchive.js"

cp "$libarchive/COPYING" "$out/LICENSE"
cat > "$out/README.txt" <<TEXT
libarchive 3.8.11 (BSD), xz 5.8.4 (0BSD) and zlib and bzip2 from Emscripten's ports, compiled to WebAssembly
with engines/build_libarchive_wasm.sh and our own wrapper, engines/libarchive_wasm/wrapper.c.
Source: https://github.com/libarchive/libarchive, https://github.com/tukaani-project/xz
TEXT
ls -la "$out"
