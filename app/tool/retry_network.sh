#!/bin/bash
# Runs a build, and runs it again if it failed only because a download did. Gradle, PDFium, FFmpeg
# and the Mac's Swift packages all come from GitHub release downloads, which sometimes answer 502-504
# for a while even when GitHub says all is well (8 Nov 2026: about an hour). A real compile or test
# failure doesn't match and fails at once. Usage: retry_network.sh command [arguments...]
set -uo pipefail

log="$(mktemp)"
status=1
for attempt in 1 2 3 4; do
  "$@" 2>&1 | tee "$log"
  status=${PIPESTATUS[0]}
  [ "$status" -eq 0 ] && exit 0
  if ! grep -qiE 'response code: 5[0-9][0-9]|badResponseStatusCode\(5[0-9][0-9]\)|HTTP 5[0-9][0-9]|Failed to download|Could not resolve host|Connection (reset|refused|timed out)|Read timed out|SocketException|handshake|Hash of downloaded file' "$log"; then
    exit "$status"
  fi
  [ "$attempt" -eq 4 ] && break
  wait=$((attempt * 90))
  echo "::warning::A download failed on attempt $attempt. Trying again in ${wait} seconds."
  sleep "$wait"
done
exit "$status"
