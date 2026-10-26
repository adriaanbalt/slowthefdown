# Slow it down

1. Create an account at [Expo](https://expo.io/)
2. Install on your computer [Expo CLI](https://docs.expo.io/versions/latest/introduction/installation)
3. Install on your mobile device [Expo Client](https://expo.io/tools#client)
4. In expo project folder `/src` on command line: `expo start`
5. Start server open server folder `/server` on command line: `npm run start`
6. Start ngrok tunnel in different terminal window `ngrok http -subdomain=slowitdown 4337`
7. On your mobile device, open Expo and load project (having an Expo login helps)

## Local iOS (dev client)

From the repo root:

```bash
npm run ios          # pod install + Xcode build + simulator (from src/)
npm start            # Metro with expo-dev-client
```

Generated `src/ios/` is gitignored; Expo prebuild creates it when you run `expo run:ios`.

## EAS builds (same flow as GREATFLIX mobile)

Run from the repo root or from `src/` (profiles in `src/eas.json`):

```bash
npm run build:dev        # iOS Simulator dev client
npm run build            # physical device dev client
npm run deploy:preview   # internal preview (APS production)
npm run deploy             # App Store / TestFlight (auto-increment build number)
npm run submit             # submit latest production build to ASC
```

`preview` and `production` set `APS_ENVIRONMENT=production` so push entitlements match TestFlight/App Store (`app.config.ts`).

## EAS Update (OTA)

JavaScript and assets can ship over the air to **preview** and **production** builds without a new App Store binary, as long as native code and `version` in `app.config.ts` are unchanged.

- **Runtime version**: `appVersion` policy (matches `version`, currently tied to store releases).
- **Channels**: `preview` ↔ `deploy:preview` builds; `production` ↔ `deploy` builds. Dev-client profiles do not use OTA (Metro in `__DEV__`).

Publish an update (from repo root or `src/`):

```bash
npm run update:preview -- --message "Describe the change"
npm run update:production -- --message "Describe the change"
```

**First-time setup:** install a **new** EAS build after OTA config lands (`deploy:preview` or `deploy`). Older binaries were built without updates enabled.

**Native rebuild required** when you change Expo SDK, native modules (e.g. Firebase), plugins/entitlements, or bump `version` in `app.config.ts`.

Rollback: `cd src && eas update:rollback` (pick channel in the CLI) or use the Expo dashboard.

## Expo + Firebase

[Reference](https://docs.expo.io/versions/latest/guides/using-firebase)

[Firebase console](https://console.firebase.google.com/u/0/project/slowitdown-d1ac8/overview)
