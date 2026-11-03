#!/bin/bash
# Runs the real Android engine on a connected device or emulator. Meanwhile it keeps sharing a file
# with the app through the system, as another app would, until the share test has seen it.
# Run from app/.
set -u

device="${ANDROID_SERIAL:-emulator-5554}"
app=io.github.navinkumar0007.radialconverter
flutter test integration_test/android_media_test.dart -d "$device" &
tests=$!

# Named directly: other apps accept shares too, so Android would otherwise stop to ask which one.
# Whether the share sheet offers this app is checked separately below.
share() {
  adb -s "$device" shell am start -n "$app/.MainActivity" -a android.intent.action.SEND \
    -t application/x-subrip --eu android.intent.extra.STREAM "content://$app.testshare/notes.srt"
}

offered=no
last=""
while kill -0 "$tests" 2>/dev/null; do
  said="$(share 2>&1)"
  if [ "$said" != "$last" ]; then
    echo "Sharing said: $said"
    last="$said"
  fi
  if adb -s "$device" shell cmd package query-activities -a android.intent.action.SEND \
    -t image/png 2>/dev/null | grep -q "$app"; then
    offered=yes
  fi
  sleep 10
done

wait "$tests"
result=$?
if [ "$result" -ne 0 ]; then
  adb -s "$device" logcat -d -s RadialMedia:* RadialShare:* TransformerInternal:* flutter:* | tail -80
fi
if [ "$offered" != yes ]; then
  echo "The share sheet doesn't offer this app." >&2
  exit 1
fi
exit "$result"
