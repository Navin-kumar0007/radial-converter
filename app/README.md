# Radial Converter app

The Flutter app. Right now it opens a preview of the radial menu and file chip, with no Shift-drag
and no conversion. Those arrive with the macOS build.

```bash
flutter test
flutter build web --no-web-resources-cdn   # bundles everything, so nothing loads from the internet
cd build/web && python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/
