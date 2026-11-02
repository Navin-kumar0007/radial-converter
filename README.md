# Radial Converter (working name)

A free, open-source, offline file converter. Hold **Shift** while dragging a file and a
radial menu of conversions appears at the cursor. Drop the file on a slice to convert,
compress, crop, trim or merge it. Files never leave your device.

Platforms: macOS, Windows, Android and the web (iPhone and iPad use the web app).
Everything is downloaded from the project website; Windows is also on the Microsoft Store.

**Status:** Phase 0, setup and proof (from 2 Nov 2026).

## Repository layout

| Folder | What lives there |
| --- | --- |
| `spike/` | Throwaway prototypes that prove risky ideas (Phase 0) |
| `core/` | Dart package shared by every platform: file detection, actions, presets, naming, size targets |
| `app/` | Flutter app (for now, a preview of the radial menu) |
| `presets/` | Make-it-fit and form-ready presets, one JSON file each |
| `test-files/` | Sample files for automated tests |
| `docs/` | User guide, privacy policy, website |

Added in later phases: `native/macos`, `native/windows`, `native/android`, `engines/`, `web/`, `.github/workflows/`.

## Phase 0 spike: Shift-drag on macOS

Needs only Apple's Command Line Tools (no Xcode, no Flutter).

```bash
bash spike/macos-shift-drag/run.sh
```

Then, in Finder: start dragging an image, hold **Shift**, move onto a slice
(PNG, JPG, WhatsApp, Half size) and let go. The new file appears next to the original;
the original is never changed. Press **Ctrl+C** in Terminal to quit.

## Licence

Mozilla Public License 2.0. See `LICENSE`.
