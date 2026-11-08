# radial_core

`radial_core.dart` is pure Dart logic shared by every platform. No `dart:io`, so it also runs in
the web app.

| File | What it does |
| --- | --- |
| `file_kind.dart` | File families and kinds, with extension and MIME type |
| `detect.dart` | `detectKind`: identify a file from its bytes |
| `actions.dart` | The action catalogue and `actionsFor` (what the menu shows) |
| `preset.dart` | Loads and validates preset JSON |
| `naming.dart` | `freeOutputName`: output names that never overwrite |
| `size_target.dart` | The "under X KB" search and video bitrate maths |
| `job_queue.dart` | Parallel jobs with progress and cancel |
| `pdf_writer.dart` | Builds a PDF from JPEGs |
| `subtitles.dart` | Parses, converts and shifts SRT and VTT |

`lib/engines.dart` is separate because it uses `dart:io`: it runs the engines as separate
processes (desktop only). Try any action without the app:

```bash
dart run radial_core:radial list
dart run radial_core:radial run image-to-png photo.heic
```

```bash
dart pub get
dart test
```

Engine tests use real tools (`brew install vips qpdf ffmpeg`) and skip when they are missing.
