# User guide

## Getting started

### Mac

1. Download the disk image, open it, and move **ShiftDrop** to Applications.
2. Open it. macOS warns about apps from unidentified developers, as this one isn't signed yet. Go to **System Settings → Privacy & Security**, scroll down, and choose **Open Anyway**.
3. Leave it running. Closing the window keeps it working in the background. To stop it, right-click its Dock icon and choose **Quit**.

### Windows

Download the installer and run it. Windows may warn that it doesn't recognise the app. Choose **More info**, then **Run anyway**. Closing the window keeps it working in the background, with an icon in the notification area by the clock. To stop it, right-click that icon and choose **Quit**.

### Android

Download the APK and open it. Android asks you to allow installing from your browser the first time.

### iPhone and iPad

Open the web app in Safari, tap **Share**, then **Add to Home Screen**. It works offline after the first visit.

## Converting a file

**Open at login (Mac and Windows).** Shift-drag works only while ShiftDrop runs. Turn on **Open at login** in **About** (the i icon at the top) and it starts when you sign in, out of sight until you need it. On a Mac this needs macOS 13 or newer, and macOS may ask you to allow it in **System Settings → General → Login Items**.

**Shift-drag (Mac and Windows).** Start dragging a file or folder from anywhere, hold **Shift** while dragging, and a round menu appears at your cursor. Drop on a slice. The result lands next to the original, and a chip appears at your cursor to drag it straight on. Drop in the middle to cancel.

**In the window.** Choose files, or drop them on the window, and pick a slice. Press **Tools** for things like merging and compressing, and use **More** for further slices.

Some tools have choices. Rest on **Rotate**, **Flip** or **Resize** and they appear in an outer ring around the slice, such as 180° or a long side of 1280 pixels: move out onto one and click. Choosing the slice itself does the first choice. On a phone, tap the slice once to see its choices. With a keyboard, press **Tab** to move into them and back.

Rest on a slice for a moment, in the window or while Shift-dragging, and the middle of the menu says how big the result will be. For one picture, ShiftDrop really makes it to find out, so choosing that slice is then instant. For video and sound it works the size out from the length, without converting. For PDFs, and for size limits, it shows the most the result can be, such as "Up to 20 MB". When it can't tell, it shows nothing.

**On Android.** Share a file from any app and choose ShiftDrop, or open the app and choose files.

## After converting

| Do this | How | Where |
| --- | --- | --- |
| Save | The **Save** icon. With several results, **Save all** saves beside the originals on a desktop, or as one ZIP elsewhere | Everywhere |
| Drag to another app | Hold and drag the result to Gmail, WhatsApp Web, a folder and so on | Mac, Windows |
| Share | The **Share** icon | Android, iPhone, some browsers |
| Undo | The **Undo** icon, here or in History. The result goes to the Trash, so you can get it back | Mac, Windows |

The clock icon at the top opens **History**, which lists what you've saved for 30 days.

## What it can convert

| Kind | From | To |
| --- | --- | --- |
| Pictures | JPG, PNG, WebP, GIF, BMP, TIFF, ICO, HEIC | JPG, PNG, WebP, GIF, TIFF, ICO, PDF |
| Video | MP4, MOV, MKV, WebM and others on a desktop | MP4, MOV, WebM, GIF, MP3 and M4A from a desktop; MP4 and M4A on Android |
| Audio | MP3, M4A, WAV, Opus and others on a desktop | MP3, M4A, WAV, Opus on a desktop; M4A on Android |
| PDF | PDF | JPG, PNG, Word (DOCX) |
| Archives | ZIP, TAR, TAR.GZ, GZ, 7z, RAR | ZIP, TAR.GZ, or extract the files |
| Subtitles | SRT, VTT | SRT, VTT |

Exactly what's offered depends on the file and the device. The menu only shows what will work.

## Good to know

**PDF to Word.** Text comes through as paragraphs and headings you can edit. Pictures on text pages, tables and exact layout aren't kept yet, and the result says so. Scanned pages come in as pictures, so their text can't be edited.

**Form photos.** Pick a preset or type your own sizes. Rules change and differ between forms, so **always check against your form's own notice**. A file of the right size can still be refused for other reasons, such as what the photo shows.

**Locked files.** PDFs and ZIPs ask for their password. Locked 7z and RAR files can't be opened yet, and neither can a RAR in several parts. A password can be added to an archive, but not yet to a PDF.

**Limits.** Pictures, PDFs and archives work in memory, up to 1 GB across a job, and folders open up to 200 files. Very large videos work, as they're read piece by piece.

**Language.** The app follows your device's language, in English or Hindi. On Android 13 or newer and on a Mac you can also choose a language for this app alone, in the system settings.

**Something wrong?** Please tell us in the project's [issues](https://github.com/Navin-kumar0007/shiftdrop/issues).
