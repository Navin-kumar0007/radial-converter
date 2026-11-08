# Making a release

Pushing a tag like `v0.9.0` builds and tests everything, then creates a **draft** GitHub release with
the installers attached. Nothing is public until you press **Publish** on it.

## Each release

1. Update `version` in `app/pubspec.yaml`, `appVersion` in `app/lib/about.dart` (a test checks they match), and
   `CHANGELOG.md`, with a heading for the new version.
2. Merge to `main`, then tag it:
   ```sh
   git tag v0.9.0 && git push origin v0.9.0
   ```
3. When CI finishes, open the draft under **Releases**, try the downloads, and press **Publish**.

## Set up once

### Android signing

Without this the APK is signed with a test key, is named `TEST-KEY`, and must not be published: Android
refuses updates signed by a different key, so the real one has to be used from the first public
release. **Keep the keystore safe and backed up. If it's lost, no one can ever update the app.**

```sh
keytool -genkeypair -v -keystore radial-release.jks -alias radial -keyalg RSA -keysize 4096 -validity 10000
base64 -i radial-release.jks | gh secret set ANDROID_KEYSTORE_BASE64 -R Navin-kumar0007/radial-converter
gh secret set ANDROID_KEYSTORE_PASSWORD -R Navin-kumar0007/radial-converter
gh secret set ANDROID_KEY_ALIAS -R Navin-kumar0007/radial-converter --body radial
```

Never commit the keystore or its password. From 2027 Android also needs apps from websites to be
registered, through the US$25 Android Developer Console.

### The website and web app

`ShiftDrop-website.zip` is the whole site: the page from `docs/site`, with the web app under `/app/`. Any static host serving HTTPS works, and offline use needs
HTTPS. The plan is Cloudflare Pages: upload the folder, or connect the repository with `app/tool/build_site.sh`
as the build, serving `app/build/site`. `docs/site/_headers` sets the caching Cloudflare Pages needs. On another host, set `Cache-Control: no-cache` for
`/app/index.html`, `/app/offline_files.js` and `/app/offline_worker.js`.

The page's download links use `releases/latest/download/`, so they only work once a full release, not a draft or
prerelease, is published. CI fails a release that lacks a file the page links to.

### Windows signing (optional, free)

SignPath Foundation signs open-source projects for free, which removes most of Windows' warning. Apply
once the project has a public release.

### Mac signing (optional, US$99 a year)

The Apple Developer Program removes the **Open Anyway** step. Without it the app still works.
