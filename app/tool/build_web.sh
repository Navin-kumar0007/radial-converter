#!/bin/bash
# Builds the web app for release: everything bundled, and a policy that lets the page load and
# connect only to itself, so nothing can leave the device. It goes in here rather than in
# web/index.html because the policy blocks `flutter run`, which needs inline scripts.
set -euo pipefail
cd "$(dirname "$0")/.."

tool/build_worker.sh
# Flutter leaves behind whatever an earlier build or a test put here, and it would get published.
rm -rf build/web
flutter build web --no-web-resources-cdn "$@"

policy="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob: data:; worker-src 'self' blob:; base-uri 'self'; form-action 'none'"
page=build/web/index.html

awk -v policy="$policy" '
  { print }
  /<meta charset="UTF-8">/ {
    printf "  <meta http-equiv=\"Content-Security-Policy\" content=\"%s\">\n", policy
    print "  <script src=\"offline_register.js\" defer></script>"
    added = 1
  }
  END { if (!added) { print "Could not add the security policy" > "/dev/stderr"; exit 1 } }
' "$page" > "$page.new"
mv "$page.new" "$page"

# Flutter's own only removes itself, and would take ours with it.
rm -f build/web/flutter_service_worker.js

# What to keep for offline use. Leaves out debug symbols and renderers this build doesn't load. A
# version from their contents means a new build replaces the old, and an unchanged one doesn't.
cd build/web
files="$(find . -type f \
  ! -name '.*' ! -name '*.symbols' ! -name '*.map' ! -name 'skwasm*' ! -name 'wimp*' ! -path './canvaskit/webparagraph/*' \
  ! -name 'offline_worker.js' ! -name 'offline_files.js' ! -name 'flutter_service_worker.js' \
  | sed 's|^\./||' | LC_ALL=C sort)"
version="$(echo "$files" | tr '\n' '\0' | xargs -0 cat | shasum -a 256 | cut -c1-16)"
{
  echo "self.offlineVersion = '$version';"
  echo "self.offlineFiles = ['./',"
  echo "$files" | sed "s/.*/  '&',/"
  echo "];"
} > offline_files.js

