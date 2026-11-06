#!/bin/bash
# Builds what gets hosted: the website from docs/site, with the web app under /app/. The result is
# in build/site.
set -euo pipefail
cd "$(dirname "$0")/.."

tool/build_web.sh --base-href /app/

rm -rf build/site
mkdir -p build/site
cp -R ../docs/site/. build/site/
cp -R build/web build/site/app

# The page promises it loads nothing from anyone else, so hold it to that.
cd build/site
if grep -nE '(src|href)="(https?:)?//[^"]*"' index.html | grep -vE '<a |<a$' | grep .; then
  echo "index.html loads something from another site." >&2
  exit 1
fi
# url(#...) points inside the page, at an SVG gradient, so it's allowed.
if grep -nE "url\\([[:space:]]*['\"]?[^#'\") ]|@import" style.css; then
  echo "style.css loads something." >&2
  exit 1
fi
