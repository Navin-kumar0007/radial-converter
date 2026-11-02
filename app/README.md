# Radial Converter app

The Flutter app. Pick files, choose a slice, save the result. Images and subtitles convert for
real on every platform, using pure Dart from `core`. Shift-drag and native engines come later.

```bash
flutter test
flutter run -d chrome    # try it while developing; press r to reload after a change
tool/build_web.sh        # release web build, in build/web
```

To try the release build:

```bash
cd build/web && python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/. Only release builds block outside connections. `flutter run`
loads Flutter's own engine from Google, because debug mode needs that.
