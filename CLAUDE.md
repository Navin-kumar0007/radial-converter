# Radial Converter: notes for Claude Code

Working name until the real name is chosen. Read this first; it carries the decisions and
status from the planning chat in the Claude app (2 Nov 2026).

## What we're building

A free, open-source, offline file converter that replaces the Mac-only, paid "Tangerine" app.
Hold **Shift** while dragging a file and a radial menu appears at the cursor; drop on a slice to
convert, compress, crop, trim or merge. Files never leave the device. Must not copy Tangerine's
name or branding.

Headline features that make people switch:
1. **Convert and keep dragging**: after converting, a draggable file chip appears under the cursor
   so the result can be dragged straight into Gmail, WhatsApp Web or an upload box.
2. **Make it fit**: slices named by purpose (WhatsApp, Email, Instagram, Under 100 KB).
3. **Form-ready presets**: exam/job/government form photo and signature presets (JSON in `presets/`).
4. **History and undo**: originals are never touched; outputs can be reverted.

## Decisions already made

- **Build order (owner's decision, 2 Nov 2026)**: every feature on all platforms first, testable as
  it is written. This replaces the Mac-first order in the roadmap below; those dates need replanning.
  Shared code goes in `core/` and `app/`; a Mac-only slice is not finished. The plan is also at
  `~/Desktop/Cross platform recreation.pages`.
- **Platforms**: macOS and Windows (Shift-drag), Android (Share menu), web app (also serves
  iPhone and iPad, added to the Home Screen from Safari). No native iPhone app for now.
- **Distribution**: downloads from our own website; installers on GitHub Releases. Windows also on
  the free Microsoft Store. No Google Play, no App Store.
- **Hosting (free tiers)**: Cloudflare Pages (site + web app), GitHub Releases (installers),
  GitHub Actions (builds), SignPath Foundation (free Windows code signing), Cloudflare R2 only
  if a web engine file exceeds 25 MiB.
- **Costs**: only US$25 once for the Android Developer Console (needed for website APK installs
  from 2027). Apple Developer Program (US$99/yr) is optional; until then the Mac app is
  self-signed and users click "Open Anyway".
- **Stack**: Flutter app + pure-Dart `core` package. Native trigger code: Swift (macOS),
  C++ (Windows), Kotlin (Android). Engines: FFmpeg (LGPL build, OS hardware encoders),
  libvips, qpdf + PDFium, libarchive; LibreOffice and Pandoc are optional desktop add-ons.
  Web: ffmpeg.wasm, wasm-vips, pdf-lib. FFmpegKit is retired; use our own FFmpeg builds.
- **Licence**: our code MPL-2.0. Only LGPL or permissive engines inside the app. No GPL parts
  (e.g. x264), never Ghostscript (AGPL).
- **Privacy**: no analytics, ads or accounts; no network calls during conversion.

## Developer machine

- MacBook Air M4, macOS 27.0, Homebrew 6. Repo at `~/Developer/radial-converter`.
- Flutter 3.47.9 (Homebrew cask), VS Code, Android Studio installed.
- Swift 6.4 via Command Line Tools. **Xcode is not installed yet** (App Store download pending);
  after it installs: `sudo xcode-select -s /Applications/Xcode.app`,
  `sudo xcodebuild -license accept`, `sudo xcodebuild -runFirstLaunch`, then `flutter doctor`.
- Windows will be tested in a Windows 11 on Arm VM (UTM or VMware Fusion) and built in
  GitHub Actions. Android in the emulator. iPhone available for testing the web app.

## Repository layout

| Path | Contents |
| --- | --- |
| `spike/macos-shift-drag/` | Phase 0 prototype in Swift: Shift-drag detection + radial panel + `sips` conversion. Run with `bash spike/macos-shift-drag/run.sh`. **Works** (tested 2 Nov). |
| `core/` | Dart package `radial_core`: file detection by bytes, 74-action catalogue, preset loader, never-overwrite naming, "under X KB" search, video bitrate maths, job queue, PDF writer, subtitles, and `portable_engine.dart` (images and subtitles in pure Dart, on every platform). `lib/history.dart` is the drift history database. `lib/engines.dart` (desktop only) runs engines as separate processes; `bin/radial.dart` is the command-line test tool. 390 tests; engine tests need `brew install vips qpdf ffmpeg` and skip otherwise. |
| `app/` | Flutter app (`io.github.navinkumar0007.radialconverter`): pick files, radial menu, real conversion, save. Same screen on all four platforms. 76 tests. |
| `presets/` | Form-ready presets, one JSON file per preset; file name must equal the id. |
| `test-files/` | Sample files for tests (still to collect). |
| `docs/` | User guide, privacy policy, website (later). |

The first `core/` (from `radial-core.zip` in the planning chat) never reached git. This one was
rebuilt from the plan on 2 Nov. Run it with `cd core && dart pub get && dart test`.

How the spike detects a drag: a 30 Hz timer checks left mouse button down + Shift held + the drag
pasteboard's changeCount changed + it holds file URLs, then shows a borderless non-activating
NSPanel (level .popUpMenu) centred on the cursor. The panel is the drop target. Hiding after
mouse-up is delayed 0.4 s so a drop on the menu arrives first. No special permissions needed.

## Status

- Works on every platform, from one code path: images (JPG, PNG, WebP, GIF, BMP, TIFF, ICO in; JPG, PNG,
  WebP, GIF, TIFF, ICO, PDF out) and subtitles, through the app's pick, menu, convert, save flow.
  Tested for real only in Chrome so far; the others are built by CI but not yet run by anyone.
- Video and audio work in browsers only so far. `core/lib/src/media_plan.dart` decides what each action
  does, and each platform carries out that same plan. Web: `app/web/video_worker.js` with Mediabunny.
  Still to wire up: Android (Media3 Transformer) and desktop (LGPL FFmpeg via `lib/engines.dart`). Until
  then `mediaEngineAvailable` is false there and the app says video isn't available.
- Desktop only, command line only: `lib/engines.dart` runs FFmpeg, libvips, qpdf and bsdtar (68 of 74
  actions). Not bundled with the app yet, so the app can't do video, audio, HEIC or PDF tools.
- Not started: Shift-drag in the app, Android share target, web video and audio (ffmpeg.wasm).
- History only records: moving an undone output to the Trash needs native code, and the app must
  call `prune` on launch. After changing the schema, run `dart run build_runner build` in `core/`;
  `history_database.g.dart` is generated but checked in.
- Test as you go: `cd app && flutter run -d chrome`. CI (`.github/workflows/build.yml`) builds web,
  Android, Windows and macOS downloads on every push.

Engine decisions that differ from the plan or are easy to get wrong:

- Dev engines from Homebrew are GPL builds (FFmpeg with x264, libvips with Poppler). Local testing
  only. Wrappers never ask for x264 or Poppler; shipping needs our own LGPL builds.
- libvips has no PDF or ICO writer without ImageMagick: images to PDF uses our `buildImagePdf`, ICO
  goes through FFmpeg.
- Hardware encoders have no second pass, so size targets aim low and retry until the file fits.
- Plan says strip GPS but keep other metadata. The libvips command line can't remove one field, so
  outputs keep only the colour profile for now (`keep=icc`), with rotation applied first. Video drops
  all metadata. Revisit if users want EXIF kept.
- Lossless only for PDF (qpdf), so "under X KB" can fail on picture-heavy PDFs until PDFium arrives.
- Passwords go to qpdf over stdin, never in arguments, which other processes can read.
- The portable engine (`image` package, MIT) is the shared baseline; native engines add speed and
  formats later. It works on whole files in memory: pictures up to 210 MP, files up to 1 GB
  (`maxInMemoryBytes`). Video can't use this approach.
- In a browser, conversions run in a Web Worker (`app/web_worker/convert_worker.dart`), compiled into
  `app/web/convert_worker.js`, which is checked in. After changing conversions in `core/`, run
  `app/tool/build_worker.sh` or browser tests use the old code; release builds run it for you.
- Web video uses Mediabunny 1.61.6 (MPL-2.0, vendored unmodified in `app/web/vendor/mediabunny/`), which
  drives the browser's own encoders, so no FFmpeg, x264 or GPL. It reads and writes piece by piece and
  stores results in the browser's private storage, so there's no 1 GB limit; a 1.4 GB file was tested.
  MP3, FLAC, GIF and merge aren't planned yet: they need extra encoders or a compose step. Only MP4, MOV,
  MKV and WebM open: Mediabunny doesn't list AVI or 3GP.
- Streams are copied only when the codec is what people expect in that format. A container may allow MP3
  in `.m4a` or VP9 in `.mp4`, but many players won't open those.
- Chosen files are read only when needed. The web picker reads everything up front unless told not to
  (`pick_options_web.dart`), so check memory when touching file reading.
- In a browser, Flutter fetches any font it lacks from Google. So the app ships Noto Sans Devanagari,
  a test bans characters outside Latin-1 and Devanagari in `app/lib`, and `app/tool/build_web.sh` adds a
  policy blocking outside connections. Build release web only with that script: the policy can't live in
  `web/index.html` because it blanks `flutter run`. Other Indian scripts and emoji in file names show as
  boxes on web until their fonts ship.

## Next steps

1. Push so CI builds all four platforms, then fix whatever it finds on Windows and Android.
2. The owner is installing Xcode. Then: `sudo xcode-select -s /Applications/Xcode.app`,
   `sudo xcodebuild -license accept`, `sudo xcodebuild -runFirstLaunch`, `flutter doctor`.
3. Drag files onto the window; Android share target; screens for crop and subtitle shift.
4. Real triggers per platform: Shift-drag on macOS (Swift) and Windows (C++), sharing on Android.
5. More formats on every platform: PDF tools, video and audio. Bundle desktop engines; web needs
   ffmpeg.wasm and pdf-lib, Android needs its own FFmpeg build.
6. Menu: estimated size on hover, outer ring. Move text to ARB files with Hindi.
7. Android package name: registered with Google in Phase 5. It holds the working name, so revisit it
   when the real name is chosen.

## Roadmap (one developer, full time, no buffer)

Written before the all-platforms-first decision: treat it as scope, not order.

| Phase | Weeks | What |
| --- | --- | --- |
| 0 | 1-2 | Setup and proof |
| 1 | 3-6 | Core engine |
| 2 | 7-14 | Mac app |
| 3 | 15-19 | Windows app (VM + GitHub Actions, SignPath) |
| 4 | 20-23 | Desktop beta, website, launch 1.0 on 12 Apr 2027 |
| 5 | 24-30 | Android (website APK), launch 31 May 2027 |
| 6 | 31-36 | Web app for browsers, iPhone, iPad, launch 12 Jul 2027 |
| 7 | 37-46 | 2.0: recipes, offline OCR/subtitles/background removal, watch folders, plugins |

Full plan (Claude Doc): https://claude.ai/code/artifact/fa273b0d-8cc2-44eb-87aa-ee40805756ee

## Conventions

- Never overwrite or modify a user's original file. Output names come from `freeOutputName`
  in `core`: `photo (converted).png`, `photo (whatsapp).jpg`.
- Detect formats from bytes (`detectKind`), never from the extension alone.
- Dart: `dart format` (page width 100 is set in `analysis_options.yaml`), `dart analyze` clean,
  and add tests with every `core` change.
- Keep user-facing text plain and short; English and Hindi in 1.0.
