#!/bin/bash
# Builds the web app for release: everything bundled, and a policy that lets the page load and
# connect only to itself, so nothing can leave the device. It goes in here rather than in
# web/index.html because the policy blocks `flutter run`, which needs inline scripts.
set -euo pipefail
cd "$(dirname "$0")/.."

flutter build web --no-web-resources-cdn

policy="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob: data:; worker-src 'self' blob:; base-uri 'self'; form-action 'none'"
page=build/web/index.html

awk -v policy="$policy" '
  { print }
  /<meta charset="UTF-8">/ { printf "  <meta http-equiv=\"Content-Security-Policy\" content=\"%s\">\n", policy; added = 1 }
  END { if (!added) { print "Could not add the security policy" > "/dev/stderr"; exit 1 } }
' "$page" > "$page.new"
mv "$page.new" "$page"
