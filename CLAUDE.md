# ShiftDrop: notes for Claude Code

Named ShiftDrop on 8 Nov 2026; it was "Radial Converter" until then. The GitHub repository is now
`Navin-kumar0007/shiftdrop` (the old address redirects); only this folder keeps the old name. Read this first; it carries the decisions and status from the planning chat in the Claude app
(2 Nov 2026).

## What we're building

A free, open-source, offline file converter that replaces the Mac-only, paid "Tangerine" app.
Hold **Shift** while dragging a file and a radial menu appears at the cursor; drop on a slice to
convert, compress, crop, trim or merge. Files never leave the device. Must not copy Tangerine's
name or branding.

Headline features that make people switch:
1. **Convert and keep dragging**: after converting, a draggable file chip appears under the cursor
   so the result can be dragged straight into Gmail, WhatsApp Web or an upload box.
2. **Make it fit**: slices named by purpose (WhatsApp, Email, Instagram, Under 100 KB).
3. **Form-ready presets**: exam/job/government form photo and signature presets (JSON in `core/lib/presets/`).
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
| `core/` | Dart package `radial_core`: file detection by bytes, 77-action catalogue, preset loader, never-overwrite naming, "under X KB" search, video bitrate maths, job queue, PDF writer, subtitles, and `portable_engine.dart` (images and subtitles in pure Dart, on every platform). `lib/engines.dart` (desktop only) runs engines as separate processes; `bin/radial.dart` is the command-line test tool. 632 tests; engine tests need `brew install vips qpdf ffmpeg` and skip otherwise. |
| `app/` | Flutter app (`io.github.navinkumar0007.shiftdrop`): pick files, radial menu, real conversion, save. Same screen on all four platforms. 396 tests, plus 37 PDF ones needing `PDFIUM_PATH`. `tool/test_android_device.sh` runs the real Android engine and share menu on an emulator, in CI. |
| `engines/` | Scripts that build or fetch the FFmpeg we ship. See its README. |
| `core/lib/presets/` | Form presets, one JSON file per preset; the file name must equal the id. Inside `lib/` because that's the only way an app can ship a package's files, and each must also be listed in `app/pubspec.yaml`. A test catches a missed one. |
| `test-files/` | Sample files for tests: `portrait.heic`, tiled and turned by a tag, as iPhone photos are; `locked.pdf` (password `open sesame`) and `restricted.pdf`, made with qpdf; `sample-*` 7z and RAR files, including a locked one and a bomb. |
| `docs/` | User guide, privacy policy, `site/` (the website), `RELEASING.md`. |

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
  It refuses `../` paths and stops past 1 GB opened, counting what really comes out.
- 7z and RAR are read but never written: each platform unpacks them into a ZIP, as HEIC becomes a PNG, then the archive
  engine takes over (`canRunUnpacked`). All use libarchive (BSD). macOS: its own, through `dart:ffi`
  (`core/lib/src/engines/libarchive.dart`), so nothing is bundled. Windows: the same Dart with `archive.dll`, built with
  vcpkg in CI and placed beside the program, as Windows looks there for its own libraries. Android: Kotlin in
  `MediaEngine.kt`, with `me.zhanghai.android.libarchive` (Apache). Web: `archive_worker.js` and our own WebAssembly.
  libarchive can't decrypt 7z or RAR, so locked ones say so rather than ask for a password that can't help.
- Don't use the libarchive.js package: it ignores how many bytes a read returned, so a damaged RAR came out at the right
  size holding whatever was in memory. The recipe is `engines/build_libarchive_wasm.sh`, run by
  `.github/workflows/libarchive-wasm.yml` when it changes. Download its artifact into `app/web/vendor/libarchive/`,
  test it, and commit it. Test damaged files, not only good ones, on anything that reads archives.
- HEIC: each platform decodes it to a PNG, then the picture engine takes over (`canRunDecoded`). Desktop: the
  bundled FFmpeg. Android: `ImageDecoder`, Android 9 or newer. Web: `heic_worker.js` with libheif-js. Tested on
  a made-up photo, not yet a real iPhone one. FFmpeg and libheif ignore the colour profile, so a wide-colour
  photo may look a little duller, and FFmpeg drops transparency.
- PDF on every platform through `app/lib/pdf_engine.dart`, using pdfrx 2.9.0 (MIT) and PDFium (BSD): to JPG or
  PNG, merge, split, rotate, compress, under a size limit. Compress and size limits redraw pages as
  pictures, because that is the only way to shrink a scan, and the result says text can't be selected.
  Page picking needs a screen. A page larger than A4 is drawn as A4 when shrinking, or a photo PDF, a page 55 inches
  wide, could never fit a limit. These tests need real PDFium, which the `macos` CI job runs against what it just built.
  Size limits try a few sample pages first, because redrawing all of a long PDF per step takes minutes,
  and they stop at 72 dpi rather than produce something unreadable. It works on the page in a browser, so
  long PDFs stutter; moving JPEG encoding into the worker would fix that.
- The owner has tried the apps on a MacBook, an Android phone and an iPhone (5 Nov 2026) and reports they work, including
  on the Mac Shift-drag from Finder, dragging results out, history and undo. Windows is still to come. Not yet tried:
  a form photo on a real form, a real iPhone HEIC photo.
- Tested for real: web in Chrome; the desktop path through its tests against the shipping macOS FFmpeg; the
  Android engine on an emulator in CI, though its Save dialog has no test.
- Desktop only, command line only so far: libvips, qpdf and bsdtar in `lib/engines.dart`. Not bundled with
  the app yet. `radial run` needs them, plus FFmpeg, installed.
- Crop, trim and subtitle shift ask first (`option_screens.dart`), and what is chosen reaches every engine.
  Crop has a frame to drag plus the same four numbers typed. Trim shows the real frames at both ends and a slider over
  the real length, plus typed times, which always work even if looking inside the file fails. Nothing plays video:
  frames come from each platform's engine (FFmpeg on a desktop, `MediaMetadataRetriever` on a phone, Mediabunny in a
  browser), so there's no player to ship per platform. Audio gets the slider only.
- Files can be dropped on the window on macOS, Windows and web (`drop_files_*.dart`, `desktop_drop`, Apache), kept at
  0.8.x because 0.9 needs a `cross_file` that `file_picker` doesn't allow. Folders open too, and Shift-drag takes them,
  up to `maxFolderFiles` (200), without hidden files or links. The menu only offers what all files share, so a folder
  keeps its biggest family that this device can run (`pickFromFolder`) and says how many it left out. Windows reports a
  dropped folder as a file, so ask the disk, not the plugin.
- Size on hover (`size_preview.dart`): resting 250 ms on a slice shows its size in the centre. One
  picture the pure-Dart engine handles, up to 25 MB, is really converted (`SizePreviews`, last 4 kept), and choosing that
  slice takes the trial's result (`take` in `_runTogether`), so nothing runs twice. Otherwise only a size limit is shown
  ("Up to 20 MB"). The Shift-drag menus ask Dart over the channel (`sizeOf`) once a drag rests on a slice, and Dart keeps
  the dragged file and its trials (`_dragged`) so the drop reuses them. Mac checked by `check_shift_drag.sh`, Windows
  built by CI but untried. Video and sound aren't tried, as that takes minutes: the file is probed once (`readMedia`, the
  trim screen's probe, now with codecs on web too), and `estimateMediaBytes` reads the size off the shared plan. Copied
  streams weigh what they did, a set bitrate gives bitrate times length, a size limit stays "Up to". Anything else
  (an encoder's own bitrate, a trim, sound copied out of a video) shows nothing rather than a guess. Checked against
  real FFmpeg results: copies and mute match; compress came out under the estimate on a synthetic clip.
- Outer ring (`ringChoices` in `core/lib/src/ring_choices.dart`, `onChoice` in `radial_menu.dart`): resting on Rotate,
  Flip or Resize shows their choices around the slice (90° right, 180°, 90° left; Mirror, Upside down; Half, 1920, 1280,
  640 px), using options every engine already honoured but nobody could pick. The first choice is what the slice does,
  and runs as the slice, so its size trial is reused; others run with their options. A finger taps once to see the
  choices; Tab goes in and out of them; screen readers get them as actions on the slice. A narrow screen narrows the ring,
  then the menu, then drops the ring. Tried in Chrome. Quality levels for Compress need a new option in every engine.
- Tools in Shift-drag: holding Option (Mac) or Alt (Windows) as well asks `menuFor` with `tools: true`, and pressing or
  releasing it mid-drag asks again (the same file keeps its trials). Each slice comes with its ring choices' labels
  (`shiftDragSlice`), and a drop on one sends its index as `choice` (`shiftDragOptions`; 0 or none is the slice itself).
  Native rings: `radialChoice` in `ShiftDrag.swift` and `RadialChoiceAt` in `radial_slice.h` copy `choiceAt` in
  `radial_geometry.dart`, checked by `check_shift_drag.sh`. The Mac panel grows to 412 px when a slice has choices; on
  Windows the window's region is the menu plus the highlighted slice's choices, so drags elsewhere still reach the apps
  below. Neither has been tried in a real drag. Alt+Shift is Windows' default shortcut for switching keyboard language,
  so check in the VM whether a Tools drag also switches it.
- Order before combining (`reorder_dialog.dart`, `keepsOrder` in core): in the window, actions that combine files ask
  for their order first, and `_files`/`_kinds` are put in that order before the job. Up and down buttons do what dragging
  does, for keyboards and screen readers. Shift-drag can't ask, so it keeps the drag's order.
- Jobs run one file at a time from the screen unless the action combines them (`combinesFiles`), so a damaged file gets
  its own failed row and the rest still finish. Results carry the original they came from: don't match them by position.
  In a browser each file starts its own worker. Results still pile up in memory until saved.
- Many results get one "Save all": beside the originals on a desktop, one ZIP (`zipFiles`) in a browser or on a phone.
  Results not held in memory, such as browser and phone video, keep their own Save.
- Android share menu: `ShareReceiver.kt` takes files from other apps, copies each into the cache, since engines need a
  real path, and the app opens as if they were chosen. Only `content:` addresses, and names lose any folders, since
  the sender may be hostile. `launchMode` is `singleTask`, or each share would open another copy of the app.
- Shift-drag on macOS: `macos/Runner/ShiftDrag.swift` shows a native menu over other apps, Dart decides its slices
  (`_menuFor`) and runs the choice, and results save beside the original. Actions that ask first aren't offered.
  Closing the window leaves the app running. `app/tool/check_shift_drag.sh` tests what it can without a real drag.
  The owner confirmed a real drag from Finder on 5 Nov 2026.
- Keep going (`keep_going_*.dart`): a finished chip can be dragged out to other apps on a desktop (`FileDragger`,
  `ShiftDrag::DragOut`, with results in memory written to a temporary file, cleared at the next launch). After a Shift-drag a
  native chip appears at the cursor (`ResultChip`), to drag on from. Phones and browsers that can get a Share button instead
  (`shareOnPhone`, `navigator.share`), and only results can be shared (`res/xml/shared_results.xml`). Browsers can't drag
  out of Flutter's canvas, and some desktop browsers can't share, so there it's Save.
- Shift-drag on Windows: `windows/runner/shift_drag.cpp`. Windows has no drag pasteboard, so while Shift and the left
  button are held an invisible window sits under the cursor, and only a file drag entering it reveals the menu. Drawn with
  plain GDI, so edges are jagged for now. Closing the window leaves an icon in the notification area (`flutter_window.cpp`),
  whose menu quits, and opening the app again brings back the running copy. Nobody has run it.
- Not started: playing video and sound while trimming.
- Form photo (`image-form`, `FormDialog`, `_forForm`): what the form wants, then framing in a crop that keeps the shape,
  then a JPEG of exactly that size within the KB limits. Forms refuse files that are too small, so a plain signature
  gets empty JPEG comments up to the minimum. Limits are stored so they hold whether a site counts a KB as 1000 or 1024
  bytes (`formMinBytes`, `formMaxBytes`). It only crops and scales: NTA warns "computer made" photos are rejected.
- Presets must not pretend to be the rules: forms change them, and sources disagree. Each one fills in boxes that stay
  editable, shows its source, and tells people to check their notice. Only add numbers traced to an official document.
  SSC isn't included, as its notice couldn't be read: guides say 3.5 x 4.5 cm, 20-50 KB and 4 x 2 cm, 10-20 KB. UPSC isn't
  either, for the same reason, and it now also needs a live photo. The NTA numbers are from 2020.
- PDF to DOCX on every platform (`_toDocx`, `core/lib/src/docx_writer.dart`, `pdf_text_layout.dart`): pure Dart from
  PDFium's text and character positions. Text becomes editable paragraphs and headings, one PDF page to a Word page. A
  page that's mostly a picture comes in as one (`pageIsAPicture`), by comparing what its text covers with how much is
  inked: a scanner app's stamp must not replace the page. Scans can't be edited until OCR. Pictures on text pages and
  exact layout aren't kept, and the result says so. Trust PDFium's spaces and line breaks: character boxes hug each
  glyph, so gaps and box heights mislead. Tested on 53 real PDFs. Check real ones when changing this.
- Tables in PDF to DOCX (`_tableAt` in `pdf_text_layout.dart`, `DocxTable`): lines split at gaps over about an em (soft
  cells, narrower than the 2 em tab rule paragraphs use), whose starts line up over rows, become a Word table with the
  PDF's column widths. Wrapped text under a later column joins its row; a heading cell spanning columns is split at the
  word nearest each column. Not a table: two rows of two, justified text (5+ evenly spaced gaps of words), bullet lists,
  prose in page columns (long cells filling their column), sentence pieces (mostly lower-case cells). Checked on the
  owner's 54 Downloads PDFs: results, invoices, receipts, nutrition labels and report tables come through; a table whose
  cells wrap with the rest centred beside them still breaks up, as rows can't be told apart without its ruling lines.
- Bold and pictures in PDF to DOCX (`pdf_extras*.dart`, `web/pdf_extras_worker.js`): pdfrx exposes neither, so each
  platform reads them from PDFium itself. Native: `pdfium_dart` (pdfrx's own bindings) inside
  `PdfrxEntryFunctions.instance.compute`, pdfrx's PDFium thread, as PDFium can't run on two at once. Browser: a second
  worker made like pdfrx's (`pdfiumWasmUrl` then `importScripts` of pdfrx's unmodified `pdfium_worker.js`), then our
  file, which adds `readExtras` to its `functions`; `pdf_extras_worker_test.dart` fails if a pdfrx update renames what
  that uses. Bold goes through layout as two private-use marks (`docxBoldOn`/`docxBoldOff`), so paragraph and table
  logic stays as it was, and becomes bold runs. Trust font names, not PDFium's weight: it gave 630 for a regular face
  and 380 for Helvetica-Bold (`isBoldFont`). Pictures are image objects over 24 pt and under 80% of the page, drawn as
  on the page, as JPEGs at most 1600 px, placed before the first text below their top and shown at their width on the
  page. Pictures inside form objects aren't reached yet. Any failure leaves pages as before, plain and without
  pictures. Checked on the 54 Downloads PDFs (about a second at most) and in Chrome.
- Passwords: a locked PDF or ZIP throws `PasswordNeeded`, and the screen asks and runs it again, so every action handles
  locked files with no code of its own. The right password is tried on the next file of a batch before asking, and lasts
  only for that job. Remove password runs on PDFs through PDFium; Add password runs on archives and always makes an AES
  ZIP. Adding one to a PDF is not offered: it needs qpdf, which isn't bundled. Merging only takes one password. Results
  redrawn or rebuilt (Compress, Split, Merge) have no password; Rotate keeps it. PDFium leaves the old encryption
  details behind as an unused object after removing a password, so hashes of it stay in the file.
- Never use pdfrx's `isEncrypted`: in a browser it's false for nearly all locked PDFs. `isPdfLocked` reads the file.
- Android results and picked-file copies sit in the app's cache and are deleted on the next launch, so a big
  video briefly needs twice the space. While any job runs, `KeepWorkingService` (a foreground service, type
  mediaProcessing on Android 15+, dataSync before) keeps the app alive with a notification, so leaving the app
  doesn't kill the job. Dart starts and stops it around each job (`keepWorkingInBackground`).
- History and undo (`core/lib/src/history_log.dart`, `history_store_*.dart`, `history_screen.dart`): each saved result is
  listed for 30 days, at most 500, as facts only, in a small file or the browser's storage. Damaged history starts afresh
  and failing to store it never stops a conversion. Undo moves a result to the Trash or Recycle Bin, never deleting it,
  on Mac and Windows only, and refuses if the file's size has changed. Phones and browsers list only, as their saves go where
  the app can't follow. Only a day-old handed-over file is cleared, as another copy of the app may be dragging one.
  An older drift/SQLite history database was removed on 8 Nov 2026: nothing used it, and its SQLite downloads made every
  build depend on GitHub serving them. Don't bring SQLite back for a list this small.
- Open at login (Settings' switch, `OpenAtLogin`, `loginItem`/`setLoginItem` over the Shift-drag channel): Mac uses
  `SMAppService.mainApp` (macOS 13+; `LoginItem` in `ShiftDrag.swift`) and hides the window when macOS says it opened
  the app at login; Windows writes `HKCU\...\Run` as `"shiftdrop.exe" --hidden`, which starts in the notification
  area, and the uninstaller removes it. CI checks the hidden start and the removal. Nobody has tried it on a real Mac yet.
- CI downloads Gradle, PDFium (Windows, Mac) and FFmpeg for Windows from GitHub release downloads, which returned 504 for
  over an hour on 8 Nov 2026 while GitHub's status page said all was well. Each is cached between runs, and builds go
  through `app/tool/retry_network.sh`, which retries only when the log shows a failed download. Don't edit
  `engines/build_ffmpeg_macos.sh` or `build_libarchive_wasm.sh` lightly: their hash keys a cache, and a change means a
  full rebuild.
- Releases: pushing a tag like `v0.9.0` makes a draft GitHub release with a Mac disk image, a Windows installer and portable
  zip, APKs, the web app, the LGPL source and checksums. See `docs/RELEASING.md`. The installer and disk image are also made
  and tried on every push. APKs say `TEST-KEY` until the owner sets up a signing key. `--no-shrink` is deliberate: R8 can't see
  what native code calls.
- First launch (`welcome_screen.dart`, shown by `app_home.dart` until `welcomed`): a hello, a practice drag on a sample
  photo drawn in Dart (`samplePhoto`), then language, open at login and update checks. The practice uses the real
  `RadialMenu`, following a drag that began outside it (`RadialMenuDrag`), and really converts the photo. A mouse on a
  desktop must hold Shift; a finger just drags. Skipping counts as seen, and Settings shows it again.
- Settings (`app_settings.dart`, `settings_store_*.dart`, `settings_screen.dart`, behind the gear): `settings.json`
  beside the history, or localStorage. Read before the first frame in `main()`. Damaged or missing reads as the
  defaults; failing to save never stops anything. Holds the guide, language, theme, previews, update checks and, on a
  desktop, a results folder: `_resultsFolder` checks it can take a file (`folderWritable`) at each job, falls back to
  beside the original and says so once, and passes it to `saveBesideOriginal(folder:)` and, through
  `ConvertControl.outputFolder`, to the engines. Phones and browsers keep their save dialogs. About is information only.
- Update check (`update_check.dart`, `core/lib/src/update_info.dart`): Mac and Windows copies from the website fetch
  `https://shiftdrop.pages.dev/version.json` (`docs/site/version.json`) at most once a day, 5 s after launch, and show a
  banner whose Download opens the address in the browser (`openPage`, native `openPage`/`radial/pages`, https only).
  Only github.com and shiftdrop.pages.dev addresses are kept from the file. The Store copy is built with
  `--dart-define=SHIFTDROP_STORE=true` and never checks. Android keeps no internet permission, so Settings only opens the
  releases page. Update `version.json` by hand after a release (`docs/RELEASING.md`); a test fails if it runs ahead of
  `pubspec.yaml`. Sparkle and in-app APK downloads, as the plan has them, aren't done: both need more than a link.
- Languages: English and Hindi, following the device unless one is picked in Settings (`chosenLocale` for `deviceWords`,
  and `sendNativeWords` tells the native menus again) (`app/lib/l10n/app_*.arb`, `flutter gen-l10n` writes `words*.dart`,
  checked in). `context.words` on screen, `deviceWords` where there's no screen, such as the Shift-drag menu. Action
  labels stay English in `core/` and in history, and `actionLabel` translates them by their English text; a test fails
  if a catalogue label with words has no translation. Format and product names stay as they are. Android 13+ and macOS
  can pick a language per app.
- Failures: every one comes from `Fail` in `core/lib/src/failures.dart`, with a key and its blanks beside the English.
  The app shows `failureText`, which translates by key and falls back to the English. Workers (`*_worker.js`,
  `convert_worker.dart`) and `MediaEngine.kt` (`Said`) send the key and blanks too. Add a new failure to `Fail` and to
  both ARB files as `fail<Key>`: a test fails if Hindi lacks any key in `failures.dart`.
- Website: `docs/site`, one static page with its own security policy, loading nothing from elsewhere. Scroll scenes are our
  own `site.js`; springs, the orbit and card effects use Motion 14.6.0 (MIT), vendored unmodified in `docs/site/vendor/motion/`. `app/tool/build_site.sh`
  puts the web app under `/app/`. CI's `website` job publishes it to Cloudflare Pages once the
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets exist (project `shiftdrop`). Download links need a published release.
- Test as you go: `cd app && flutter run -d chrome`. CI (`.github/workflows/build.yml`) builds web,
  Android, Windows and macOS downloads on every push.

Engine decisions that differ from the plan or are easy to get wrong:

- Dev engines from Homebrew are GPL builds (FFmpeg with x264, libvips with Poppler). Local testing
  only. Wrappers never ask for x264 or Poppler. To test against what ships, run
  `engines/build_ffmpeg_macos.sh`, then put `engines/build/macos/bin` first on `PATH` for `dart test`.
- CI signs the macOS app again after adding FFmpeg, which drops its entitlements unless they're given again. Without
  them `file_picker` refuses to open any dialog, though the app isn't sandboxed. CI now checks they survive. No test can
  see this: only the real signed app does it, so run downloads, not just tests.
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
  formats later. It works on whole files in memory: pictures up to 210 MP, up to 1 GB across all the
  files in a job (`maxInMemoryBytes`). Video can't use this approach.
- The macOS FFmpeg holds Apple Silicon and Intel, as the app does, and asks for macOS 12 like the app.
  Set `MACOSX_DEPLOYMENT_TARGET` or it asks for whatever built it. It needs `nasm`. This Mac has no
  Rosetta, so only the `macos-intel` CI job can run the Intel half.
- In a browser, conversions run in a Web Worker (`app/web_worker/convert_worker.dart`), compiled into
  `app/web/convert_worker.js`, which is checked in. After changing conversions in `core/`, run
  `app/tool/build_worker.sh` or browser tests use the old code; release builds run it for you.
- HEIC on web uses libheif-js 1.23.5 (LGPL-3.0, vendored unmodified in `app/web/vendor/libheif/`), loaded only
  when a HEIC photo is chosen. It holds a software HEVC decoder, as FFmpeg does on desktop; Android uses the
  phone's. Android and Safari could use their own, but one path for all browsers is simpler. Release checks
  must keep the 2 MB file replaceable, which LGPL requires.
- The web app works offline after its first visit, through our own `web/offline_worker.js`. `tool/build_web.sh` lists what
  it keeps and adds it to the page, so `flutter run` doesn't get one. Flutter's own worker is deprecated and now only
  removes itself, taking ours with it, so `web/flutter_bootstrap.js` leaves it out. A worker file added to `web/` is kept
  automatically. Service workers need HTTPS or localhost, so it can't be tried on a phone over plain HTTP.
- Android has no permission to use a network: `AndroidManifest.xml` removes the ones libraries bring, which makes the
  promise something Android enforces. Debug builds add the internet back for Flutter's tools.
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

What goes into each version, 0.11 to 1.0, is in `docs/release-plan.md`. 0.11 is Settings, reorder before merging, and
previews. Releases are drafted ahead and published in order; never merge the whole branch to `main`, only a published
tag. The list below is older and finer-grained.

1. Run the Windows download from CI, and fix what it finds.
2. Try a real iPhone HEIC photo, on every platform.
3. PDF to DOCX: tables whose cells wrap, pictures inside form objects, italic. Try PDF to DOCX on a phone and on Windows. Try the trim preview on real long videos: a seek far into one may be slow on a phone.
4. Try Shift-drag from Explorer in the Windows VM, and dragging results out on both desktops.
5. Extract to a folder. Adding a password to a PDF, once qpdf is bundled. Multi-part RAR files.
6. Menu: quality levels on Compress's ring. Try in a real Shift-drag on both desktops: size on hover, Option/Alt for
   Tools, and the native rings. Try size on hover for video in a browser and on a phone. Try the first-launch guide and
   the update banner on each platform. A native
   speaker should review `app_hi.arb`.
7. Android package name `io.github.navinkumar0007.shiftdrop`: register it with Google in Phase 5. It can't change after
   the first public release, as Android treats a new name as a different app.
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
