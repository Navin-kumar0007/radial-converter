# Engines

The conversion programs that ship with the desktop apps. They run as separate processes, so a broken
file can't crash the app and the licence boundary stays clear.

| Script | What it makes |
| --- | --- |
| `build_ffmpeg_macos.sh` | FFmpeg and ffprobe for macOS, Apple Silicon and Intel in one program each, built from pinned sources into `build/macos/bin/`. Needs `nasm` and `pkg-config` |
| `fetch_ffmpeg_windows.sh` | FFmpeg and ffprobe for Windows, a pinned LGPL build from BtbN/FFmpeg-Builds |

CI runs these and adds the results to the downloads. Nothing here is checked in.

## Rules

- LGPL or permissive only. No x264, x265 or anything else GPL. The scripts fail the build if any gets in.
- Video encoding uses each system's hardware encoder.
- Homebrew's FFmpeg is a GPL build. It is fine for local testing and must never ship.

## Known gaps

- The macOS build has networking compiled out, so it cannot reach the internet. The Windows build still
  has it, and the app only limits it with `-protocol_whitelist file,pipe`. Building our own would match
  macOS and shrink it: each Windows program is about 130 MB, against 27 MB per kind of Mac.
- LGPL asks that people can get the source. The macOS script names the exact sources. Publishing them
  with each release is still to do, before 1.0.
- Arm64 Windows is not built yet.
- Holding both kinds of Mac makes each macOS program about 54 MB. A separate download for each would halve it.
