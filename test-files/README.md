# Test files

Sample files for automated tests (Phase 1 target: 200+). Add at least:

- One file per supported format (JPG, PNG, WebP, HEIC, AVIF, GIF, TIFF, SVG, MP4, MOV, MP3, WAV, PDF, ZIP...)
- Tiny and very large files
- Corrupted and wrongly named files (a PNG called `.jpg`)
- File names in Hindi and Tamil, with spaces and emoji
- A photo with GPS data, a portrait phone video, a password-protected PDF

Only add files you are allowed to share publicly (your own photos or public-domain samples).

`sample-*.rar` and `sample-*.7z` come from libarchive's own test suite (BSD licence), v3.8.11, because
RAR files can't be made with free tools. `locked.pdf` has the password `open sesame`.
