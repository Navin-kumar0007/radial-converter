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
| `core/` | Dart package `radial_core`: file detection by bytes, 74-action catalogue, preset loader, never-overwrite naming, "under X KB" search, video bitrate maths, job queue, PDF writer, subtitles, and `portable_engine.dart` (images and subtitles in pure Dart, on every platform). `lib/history.dart` is the drift history database. `lib/engines.dart` (desktop only) runs engines as separate processes; `bin/radial.dart` is the command-line test tool. 474 tests; engine tests need `brew install vips qpdf ffmpeg` and skip otherwise. |
| `app/` | Flutter app (`io.github.navinkumar0007.radialconverter`): pick files, radial menu, real conversion, save. Same screen on all four platforms. 147 tests, plus 19 PDF ones needing `PDFIUM_PATH`. `integration_test/` runs the real Android engine on an emulator, in CI. |
| `engines/` | Scripts that build or fetch the FFmpeg we ship. See its README. |
| `presets/` | Form-ready presets, one JSON file per preset; file name must equal the id. |
| `test-files/` | Sample files for tests: `portrait.heic`, tiled and turned by a tag, as iPhone photos are. |
| `docs/` | User guide, privacy policy, website (later). |

The first `core/` (from `radial-core.zip` in the planning chat) never reached git. This one was
rebuilt from the plan on 2 Nov. Run it with `cd core && dart pub get && dart test`.

How the spike detects a drag: a 30 Hz timer checks left mouse button down + Shift held + the drag
pasteboard's changeCount changed + it holds file URLs, then shows a borderless non-activating
NSPanel (level .popUpMenu) centred on the cursor. The panel is the drop target. Hiding after
mouse-up is delayed 0.4 s so a drop on the menu arrives first. No special permissions needed.

## Status

- Works on every platform, from one code path: images (JPG, PNG, WebP, GIF, BMP, TIFF, ICO, HEIC in; JPG, PNG,
  WebP, GIF, TIFF, ICO, PDF out) and subtitles, through the app's pick, menu, convert, save flow.
  Tested for real only in Chrome so far; the others are built by CI but not yet run by anyone.
- Video and audio: `core/lib/src/media_plan.dart` decides what each action does, and each platform carries
  out that same plan. Web: `app/web/video_worker.js` with Mediabunny. Desktop: `ffmpeg_plan.dart` with a
  bundled LGPL FFmpeg, saving beside the original. Android: `MediaEngine.kt` with Media3 Transformer and the
  phone's encoders, saving through the system dialog. It writes only MP4 and M4A (`phoneMediaOutputs`), so the
  phone's menu leaves out WebM, MOV, WAV and Opus.
- Archives on every platform through `core/lib/src/portable_archive.dart` (pure Dart, `archive` package, MIT):
  ZIP, TAR, TAR.GZ and GZ to ZIP or TAR.GZ, and Extract. Extract gives each file its own Save button, flat, up to
  50 files, since a browser or phone can't simply save a folder. Saving a whole folder needs screens per platform.
  It refuses `../` paths and stops past 1 GB opened, counting what really comes out. 7z and RAR are not read,
  and 7z not written, until libarchive is bundled.
- HEIC: each platform decodes it to a PNG, then the picture engine takes over (`canRunDecoded`). Desktop: the
  bundled FFmpeg. Android: `ImageDecoder`, Android 9 or newer. Web: `heic_worker.js` with libheif-js. Tested on
  a made-up photo, not yet a real iPhone one. FFmpeg and libheif ignore the colour profile, so a wide-colour
  photo may look a little duller, and FFmpeg drops transparency.
- PDF on every platform through `app/lib/pdf_engine.dart`, using pdfrx 2.9.0 (MIT) and PDFium (BSD): to JPG or
  PNG, merge, split, rotate, compress, under a size limit. Compress and size limits redraw pages as
  pictures, because that is the only way to shrink a scan, and the result says text can't be selected.
  Passwords and page picking need screens; adding a password needs qpdf, since PDFium can't.
  Size limits try a few sample pages first, because redrawing all of a long PDF per step takes minutes,
  and they stop at 72 dpi rather than produce something unreadable. It works on the page in a browser, so
  long PDFs stutter; moving JPEG encoding into the worker would fix that.
- Tested for real: web in Chrome; the desktop path through its tests against the shipping macOS FFmpeg; the
  Android engine on an emulator in CI, though its Save dialog has no test. No one has yet run the macOS, Windows
  or Android apps themselves.
- Desktop only, command line only so far: libvips, qpdf and bsdtar in `lib/engines.dart`. Not bundled with
  the app yet. `radial run` needs them, plus FFmpeg, installed.
- Crop, trim and subtitle shift ask first (`option_screens.dart`), and what is chosen reaches every engine.
  Crop has a frame to drag plus the same four numbers typed; trim takes typed times, as nothing plays video yet.
- Files can be dropped on the window on macOS, Windows and web (`drop_files_*.dart`, `desktop_drop`, Apache), kept at
  0.8.x because 0.9 needs a `cross_file` that `file_picker` doesn't allow. Folders aren't handled yet.
- Not started: Shift-drag in the app, Android share target, video preview for trim.
- Android results and picked-file copies sit in the app's cache and are deleted on the next launch, so a big
  video briefly needs twice the space. A long job can be killed if the user leaves the app: no foreground
  service yet.
- History only records: moving an undone output to the Trash needs native code, and the app must
  call `prune` on launch. After changing the schema, run `dart run build_runner build` in `core/`;
  `history_database.g.dart` is generated but checked in.
- Test as you go: `cd app && flutter run -d chrome`. CI (`.github/workflows/build.yml`) builds web,
  Android, Windows and macOS downloads on every push.

Engine decisions that differ from the plan or are easy to get wrong:

- Dev engines from Homebrew are GPL builds (FFmpeg with x264, libvips with Poppler). Local testing
  only. Wrappers never ask for x264 or Poppler. To test against what ships, run
  `engines/build_ffmpeg_macos.sh`, then put `engines/build/macos/bin` first on `PATH` for `dart test`.
- Desktop video saves beside the original instead of asking, so the macOS app is no longer sandboxed: a
  sandbox forbids both that and running engines. That matches shipping outside the App Store.
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
- HEIC on web uses libheif-js 1.23.5 (LGPL-3.0, vendored unmodified in `app/web/vendor/libheif/`), loaded only
  when a HEIC photo is chosen. It holds a software HEVC decoder, as FFmpeg does on desktop; Android uses the
  phone's. Android and Safari could use their own, but one path for all browsers is simpler. Release checks
  must keep the 2 MB file replaceable, which LGPL requires.
- Web video uses Mediabunny 1.61.6 (MPL-2.0, vendored unmodified in `app/web/vendor/mediabunny/`), which
  drives the browser's own encoders, so no FFmpeg, x264 or GPL. It reads and writes piece by piece and
  stores results in the browser's private storage, so there's no 1 GB limit; a 3 GB file was tested. Never ask for a large file as a blob (`response.blob()`,
  or the picker's `readAsByteStream`): it fails on them. Read `blob:` addresses in pieces (`readBlobHead`, `UrlSource`).
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

1. Run the macOS, Windows and Android downloads from CI, and fix what they find.
2. Try a real iPhone HEIC photo, on every platform.
3. Video preview for trim. Dropping folders.
4. Real triggers per platform: Shift-drag on macOS (Swift) and Windows (C++), sharing on Android.
5. Extract to a folder, ZIP passwords, 7z and RAR. PDF password screens.
6. Menu: estimated size on hover, outer ring. Move text to ARB files with Hindi.
7. Android package name: registered with Google in Phase 5. It holds the working name, so revisit it
   when the real name is chosen.
8. The owner is installing Xcode. Then: `sudo xcode-select -s /Applications/Xcode.app`,
   `sudo xcodebuild -license accept`, `sudo xcodebuild -runFirstLaunch`, `flutter doctor`.

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
