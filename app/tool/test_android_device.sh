#!/bin/bash
# Runs the real Android engine on a connected device or emulator. Meanwhile it keeps sharing a file
# with the app through the system, as another app would, until the share test has seen it.
# Run from app/.
set -u

device="${ANDROID_SERIAL:-emulator-5554}"
app=io.github.navinkumar0007.shiftdrop
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
if [ "$result" -ne 0 ]; then
  exit "$result"
fi

# Everything above is a debug build. People get a release one, so it must at least start, and have no
# way to reach a network.
flutter build apk --release --no-shrink || exit 1
adb -s "$device" install -r build/app/outputs/flutter-apk/app-release.apk || exit 1
adb -s "$device" logcat -c
adb -s "$device" shell am start -n "$app/.MainActivity" || exit 1
sleep 15
if [ -z "$(adb -s "$device" shell pidof "$app")" ]; then
  echo "The release app didn't stay open." >&2
  adb -s "$device" logcat -d | tail -60
  exit 1
fi
granted="$(adb -s "$device" shell dumpsys package "$app" | grep -E 'android.permission.(INTERNET|ACCESS_NETWORK_STATE|ACCESS_WIFI_STATE)' || true)"
if [ -n "$granted" ]; then
  echo "The release app can reach a network: $granted" >&2
  exit 1
fi
echo "The release app starts, and has no way to reach a network."
