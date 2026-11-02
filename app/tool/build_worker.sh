#!/bin/bash
# Compiles the conversion worker into web/, where `flutter run` and web builds pick it up. The
# result is checked in, so `flutter run` works straight away. Run this after changing conversions
# in core/ if you are testing in a browser; release builds run it for you.
set -euo pipefail
cd "$(dirname "$0")/.."

flutter pub get
dart compile js -O2 --no-source-maps web_worker/convert_worker.dart -o web/convert_worker.js
rm -f web/convert_worker.js.deps
