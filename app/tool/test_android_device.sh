#!/bin/bash
# Runs the real Android engine on a connected device or emulator. Meanwhile it keeps sharing a file
# with the app through the system, as another app would, until the share test has seen it.
# Run from app/.
set -u

device="${ANDROID_SERIAL:-emulator-5554}"
flutter test integration_test/android_media_test.dart -d "$device" &
tests=$!

while kill -0 "$tests" 2>/dev/null; do
  adb -s "$device" shell am start -a android.intent.action.SEND -t application/x-subrip \
    --eu android.intent.extra.STREAM \
    content://io.github.navinkumar0007.radialconverter.testshare/notes.srt >/dev/null 2>&1
  sleep 10
done

wait "$tests"
result=$?
if [ "$result" -ne 0 ]; then
  adb -s "$device" logcat -d -s RadialMedia:* RadialShare:* TransformerInternal:* flutter:* | tail -80
fi
exit "$result"
