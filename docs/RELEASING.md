# Making a release

Pushing a tag like `v0.9.0` builds and tests everything, then creates a **draft** GitHub release with
the installers attached. Nothing is public until you press **Publish** on it.

## Each release

1. Update `version` in `app/pubspec.yaml`, `appVersion` in `app/lib/about.dart` (a test checks they match), and
   `CHANGELOG.md`, with a heading for the new version.
2. Merge to `main`, then tag it:
   ```sh
   git tag v0.10.0 && git push origin v0.10.0
   ```
3. When CI finishes, open the draft under **Releases**, try the downloads, and press **Publish**.
4. About two days later, once testers have had it, update `docs/site/version.json` to the new version and its
   download addresses, and push to `main`. Copies from the website then tell their users within a day. A test fails
   if the file names a version newer than `app/pubspec.yaml`, so update it after the release, never before.

## Set up once

### Android signing

Without this the APK is signed with a test key, is named `TEST-KEY`, and must not be published: Android
refuses updates signed by a different key, so the real one has to be used from the first public
release. **Keep the keystore safe and backed up. If it's lost, no one can ever update the app.**

```sh
keytool -genkeypair -v -keystore shiftdrop-release.jks -alias shiftdrop -keyalg RSA -keysize 4096 -validity 10000
base64 -i shiftdrop-release.jks | gh secret set ANDROID_KEYSTORE_BASE64 -R Navin-kumar0007/shiftdrop
gh secret set ANDROID_KEYSTORE_PASSWORD -R Navin-kumar0007/shiftdrop
gh secret set ANDROID_KEY_ALIAS -R Navin-kumar0007/shiftdrop --body shiftdrop
```

Never commit the keystore or its password. From 2027 Android also needs apps from websites to be
registered, through the US$25 Android Developer Console.

### The website and web app

CI builds the whole site (`app/tool/build_site.sh`: the page from `docs/site`, the web app under `/app/`) and
publishes it to Cloudflare Pages: pushes to `main` go to the live site, other branches to a preview address
such as `core-engine.shiftdrop.pages.dev`. It needs two secrets, set once:

1. In Cloudflare, open **My Profile, API Tokens, Create Token**, choose **Create Custom Token**, and give it
   one permission: **Account, Cloudflare Pages, Edit**, for your account. Copy the token.
2. Find your **Account ID**: open **Workers & Pages** in the dashboard; it's on the right of the page.
3. Store both in GitHub. Each command asks for the value, so it stays out of your shell history:
   ```sh
   gh secret set CLOUDFLARE_API_TOKEN -R Navin-kumar0007/shiftdrop
   gh secret set CLOUDFLARE_ACCOUNT_ID -R Navin-kumar0007/shiftdrop
   ```
4. Re-run the latest CI run, or push. The `website` job creates the `shiftdrop` project on its first run and
   prints the address. If that name is taken on pages.dev, Cloudflare adds a few letters to it.

Never paste the token anywhere else. To use another project name, set the repository variable
`CLOUDFLARE_PAGES_PROJECT`. A custom domain is added later under the project's **Custom domains**.
`docs/site/_headers` sets the caching the web app needs. `Download` buttons on the site use
`releases/latest/download/`, so they work once a full release is published.

`ShiftDrop-website.zip` in each release is the same site, for any other static host serving HTTPS.

### Windows signing (optional, free)

SignPath Foundation signs open-source projects for free, which removes most of Windows' warning. Apply
once the project has a public release.

### Mac signing (optional, US$99 a year)

The Apple Developer Program removes the **Open Anyway** step. Without it the app still works.
