# Release plan

What goes into each version up to 1.0, agreed with the owner on 11 November 2026. How to make a release is in
[RELEASING.md](RELEASING.md).

## How releases go out

Releases are prepared ahead and published one after another, with time to test each:

1. Build the version on `core-engine`, raise the version, write its changelog section, and tag it. CI builds a
   **draft** release that only the owner can see.
2. Test the draft's downloads for about 10 days. A bug found then is fixed and the version tagged again, or it waits
   for a patch release.
3. Publish the draft. Then move `main` to that tag only (`git push origin vX.Y.Z^{commit}:main`), never the whole
   branch: every push to `main` redeploys the website and web app, and later versions may already be on the branch.
4. About two days later, update `docs/site/version.json`, so copies from the website offer the new version.

Publish in version order, as GitHub's "latest" release, which the site's Download buttons use, follows commit date.

## 0.10.0: guide, update check, Tools in Shift-drag

**Done.** Draft built on 11 November 2026 from `778461f`; publishing around 21 November.

- First-launch guide with a practice Shift-drag on a sample photo.
- Daily check for a newer version on Mac and Windows copies from the website; a link to the download page on Android.
- Option (Mac) or Alt (Windows) during a Shift-drag for Tools, with outer rings in the native menus.
- Language chosen in the app.

## 0.11.0: Settings, reorder before merging, previews

Build from 12 November, tag about 26 November, publish about 6 December 2026.

### 1. Settings screen

One screen for every choice, opened from a gear icon beside About and History. About goes back to saying what the
app is, with its licences.

| Setting | Platforms | Default |
| --- | --- | --- |
| Where results go: beside the original, or a folder you choose | Mac, Windows | Beside the original |
| Theme: light, dark or as the system | All | As the system |
| Language: as the device, English or Hindi | All | As the device |
| Show previews | All | On |
| Open at login | Mac, Windows | Off |
| Check for new versions | Mac and Windows website copies | On |
| Get the newest version (a link, not a setting) | Android | — |
| Show the guide again (a button) | All | — |

Phones and browsers keep asking where to save, as now. A chosen folder that has gone, or can't be written to, falls back
to beside the original and says so once. Animations already follow the system's Reduce motion.

### 2. Reorder before merging

Merging PDFs, video or sound, and One PDF from pictures, first show the files in a list to drag into order, with a
small preview of each, then **Merge**. Up and down buttons do the same for keyboards and screen readers. In a
Shift-drag there is no screen to ask on, so the files are merged in the order they were dragged; the result chip says
so, and **Open menu again** in the window offers the list.

### 3. Previews

A small panel shows the first page of the file: before converting, and after it, beside the result. **Show previews**
in Settings turns it off, and an eye button on the panel hides it for now.

| Kind | Before | After |
| --- | --- | --- |
| Pictures, including HEIC, TIFF, ICO | The picture | The result |
| PDF | Page 1 | Page 1 of the result |
| Video | A frame about a second in | A frame of the result |
| Sound | Its length, with an icon | The new length |
| Subtitles | The first three lines | The first three lines after the change |
| Archives | The first five names inside | The names in the new archive |
| PDF to Word | Page 1 of the PDF | The first lines of text |

With it:

- **Compare slider** for pictures and PDF pages: drag a line across one picture, before on the left and after on the
  right, to see what Compress or a size limit did.
- **Info line** under the preview, such as `4032×3024 → 1280×960 · 3.2 MB → 240 KB`, or pages and length for PDFs,
  video and sound.
- **Thumbnails on every result row**, in place of the plain file icon, so a batch can be checked at a glance.
- **Tap to enlarge**, full size, with pinch or scroll to zoom, to check sharpness.

Rules:

- Previews never slow or stop a conversion. They are made in the background, after the menu opens, and a failure shows
  "Can't preview" instead.
- Pictures are decoded straight to about 600 pixels wide, never at full size. Video frames are asked for once per file.
- Locked PDFs show a lock until their password is given. 7z and RAR show their names only once unpacked for a job.
- Several files: the panel shows the first, and every row gets its thumbnail.
- Previews live in memory only. They are never written to disk or kept in history.
- Every preview has a text description for screen readers.

### Done when

- Each feature works in Chrome, on the Mac, on an Android emulator in CI, and builds for Windows.
- Tests cover every file kind's preview, its failures, the compare slider, the reorder list and every setting.
- The user guide, privacy policy (previews stay on the device) and changelog say what changed.

## 0.12.0: errors and polish

Build from about 27 November, publish about 20 December 2026.

- **Copy details** on every failed file: app version, platform, action, file kind and the error's key, ready to paste
  into a bug report. Never file names or contents.
- **Live preview in the menu's centre**: resting on Rotate, Flip or Resize, or one of their choices, shows the
  picture already turned, flipped or smaller, without converting. Window menu only.
- **Thumbnails on the Shift-drag result chip**, from the system's own thumbnails (Quick Look on a Mac, the shell on
  Windows).
- **Signature cleanup**: crop to the ink, whiten the paper, darken the ink, then the form's size and KB limits.
- **Scanned document** preset: a greyscale PDF under a size limit.
- **Quality levels on Compress's outer ring**: high, medium and small, honoured by every engine.

## Later, before 1.0

- Learned slice order: the most-used actions move to the easiest slots, learned on the device only.
- A page picker for splitting and extracting PDF pages.
- Keep photo details (EXIF) while removing location, as the plan asks; outputs drop all of it today.
- Changing the trigger key from Shift.
- Extract an archive to a folder. Add a password to a PDF once qpdf is bundled. RAR files in several parts.

## 1.0 checklist (launch 12 April 2027)

- Windows tried in the VM: Shift-drag from Explorer, Alt for Tools (and whether Alt+Shift switches the keyboard
  language), the native rings, dragging results out, open at login.
- The menu opens within 100 ms of pressing Shift, measured on both desktops.
- No crash bugs open. Real-device tries: an iPhone HEIC photo, a form photo accepted by a real form, at least three
  Android phone brands.
- SignPath signing for Windows, and the Microsoft Store package, built with `--dart-define=SHIFTDROP_STORE=true`.
- A native Hindi speaker has reviewed `app_hi.arb`.
- Android package name registered with Google, with the real signing key.
