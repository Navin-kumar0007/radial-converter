# ShiftDrop

A free, open-source file converter that works offline. Hold **Shift** while dragging a file and a round menu appears at your cursor. Drop the file on a slice, and the result lands next to the original, ready to drag straight into an email or a chat.

**Your files never leave your device.** There's no account, no ads and no tracking, and nothing is uploaded.

> **Beta.** The Mac, Android and web apps have been used on real devices; Windows has been built and tested automatically but not yet used by hand.

## What it does

- **Convert** pictures, video, audio, PDFs, archives and subtitles, including HEIC photos, 7z and RAR.
- **Make it fit**: slices named by purpose, such as WhatsApp, Email or Under 100 KB.
- **Form photos**: the exact pixels and KB an exam or job form asks for, with limits you can check and change.
- **Keep going**: drag a result straight to Gmail, WhatsApp Web or a folder, or share it from your phone.
- **History and undo**: see what you've saved, and move a result to the Trash if you change your mind. Originals are never touched.
- **Unlock and lock**: open password-protected PDFs and ZIPs, remove a PDF's password, and add one to a ZIP.

See the [user guide](docs/user-guide.md) for what each platform can do, and the [privacy policy](docs/privacy.md) for exactly what stays where.

## Platforms

| Platform | How you use it |
| --- | --- |
| macOS 12 or newer (Apple Silicon and Intel) | Shift-drag from anywhere, or the app window |
| Windows 10 or newer | Shift-drag from anywhere, or the app window |
| Android 7 or newer | Share a file to the app, or open it and choose files |
| iPhone, iPad and browsers | The web app, which can be added to the Home Screen |

## Build it yourself

You need [Flutter](https://flutter.dev) 3.47.

```sh
cd app
flutter pub get
flutter run -d chrome    # or macos, windows, or an Android device
```

Video and HEIC on a desktop need FFmpeg beside the app. See [`engines/`](engines/README.md).

Tests: `dart test` in `core/`, and `flutter test` in `app/`.

## Repository layout

| Folder | What's there |
| --- | --- |
| `core/` | Shared logic in pure Dart: detection, the action catalogue, picture, archive and Word engines, presets |
| `app/` | The Flutter app, with native code for macOS, Windows and Android, and workers for the web |
| `engines/` | Scripts that build or fetch FFmpeg and libarchive |
| `test-files/` | Sample files for tests |
| `docs/` | User guide and privacy policy |
| `spike/` | The first macOS prototype, kept for reference |

Notes for working on the code are in [`CLAUDE.md`](CLAUDE.md), and [`docs/RELEASING.md`](docs/RELEASING.md) covers making a release.

## Licence

Our code is under the [Mozilla Public License 2.0](LICENSE). The app includes parts under other licences, listed in the app under **About → View licenses**. Only LGPL or permissive parts are included, and never GPL, so FFmpeg uses your system's hardware encoders instead of x264.
