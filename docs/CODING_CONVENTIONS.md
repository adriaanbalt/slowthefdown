# Coding Conventions

Living guidelines for **Slow the F Down** (Slow it down). Prefer this file for *how we write code*; use the [README](../README.md) for setup, EAS builds, and Firebase console links.

This document describes how the codebase is **actually built today** — grounded in the real tree, not an idealized target. Where the code diverges from these conventions, see [Known Issues / Cleanup](#known-issues--cleanup). History belongs in commits and PRs, not here.

## Table of Contents

1. [General Principles](#general-principles)
2. [Repository Layout](#repository-layout)
3. [Mobile App (`src/`)](#mobile-app-src)
4. [Routing & Screens](#routing--screens)
5. [State (Zustand)](#state-zustand)
6. [Services & Firebase](#services--firebase)
7. [Game Logic vs Render Loop](#game-logic-vs-render-loop)
8. [Scoring & Leaderboards](#scoring--leaderboards)
9. [Auth & Security Rules](#auth--security-rules)
10. [Legacy Server (`server/`)](#legacy-server-server)
11. [Build, EAS & Config](#build-eas--config)
12. [Testing](#testing)
13. [Style & Naming](#style--naming)
14. [Documentation & Comments](#documentation--comments)
15. [Known Issues / Cleanup](#known-issues--cleanup)

---

## General Principles

- **Prefer the platform's canonical primitive.** Use Expo Router for navigation, `@react-native-firebase/*` for auth and Realtime Database, `expo-secure-store` for on-device bests, `expo-gl` + Three.js for rendering, Zustand for client state, and EAS/`app.config.ts` for native capabilities. Don't bypass these with ad-hoc globals or duplicate config in multiple places.
- **Simplicity over defense-in-depth.** The game is a small, solo-maintained codebase. Add a guard or fallback only when you have evidence it is needed (a real device bug, a logged failure). Prefer one clear path over parallel "just in case" branches.
- **Fail soft for UX, loud for correctness in pure code.** Storage and network failures in the UI path use `console.warn` and keep local play working (see `localHighscore`, `userStore.onSignedIn`). Pure game modules (`RunController`, `mergeHighscore`) should be deterministic and tested — bugs there are not masked with silent defaults.
- **Trace a value before guarding it.** Highscores are normalized once via `parseHighscore` in `highscoreMerge.ts`. Auth identity is `auth.uid` from Firebase; stores read `uid` from Zustand after `watchAuth`. Don't re-parse or re-validate the same field at every layer.
- **Keep scoring units explicit.** Classic and focus bests are stored as **whole tenths** (legacy contract). Run timers in the UI may use milliseconds; conversion to tenths happens at the boundary (`Math.ceil(ms / 100)` in `recordRun`). Document any new score type with its unit at the write site.
- **Secrets never belong in git.** See [Security](#auth--security-rules) and [Known Issues](#known-issues--cleanup). `.gitignore` already lists `*.p8`, service-account JSON patterns, and `server/secrets/` — keep it that way and rotate anything that was committed historically.

---

## Repository Layout

The **shipping product** is the Expo app under `src/`. The repo root is a thin wrapper that delegates scripts to `src/`.

```
slowthefdown/
├── package.json          # Delegates start/ios/test/build → npm --prefix src
├── README.md
├── database.rules.json   # Firebase RTDB rules (deploy with Firebase CLI)
├── firebase.json         # Root Firebase config (minimal)
├── docs/                 # This file + future ops docs
├── server/               # Legacy GraphQL + Cloud Functions (see below)
└── src/                  # Expo 58 app — primary codebase
    ├── app.config.ts     # Expo config (bundle id, Firebase plugins, APS, EAS projectId)
    ├── eas.json          # EAS build/submit profiles
    ├── app/              # expo-router routes (thin; often re-export screens)
    ├── screens/          # Feature screens (Home game, Profile, Highscores, …)
    ├── components/       # Reusable UI (PhoneAuth, FloatingTabBar, …)
    ├── shared/           # Small presentational primitives (Button, Input, Loader)
    ├── constants/        # Colors, Styles
    ├── game/             # Pure game rules (no React, no GL)
    ├── gl/               # Three.js renderer setup for expo-gl
    ├── state/            # Zustand stores
    ├── services/         # Firebase, highscores, local secure storage
    ├── scripts/          # One-off maintenance (e.g. migrateHighscores)
    └── vitest.config.mts
```

**Dependency direction**

```
app/ (routes)  →  screens/  →  state/ · game/ · gl/ · components/
state/         →  services/  →  @react-native-firebase/*
game/          →  (no imports from screens or React)
```

- All day-to-day development happens in **`src/`** (`npm start`, `npm run ios`, `npm test` from repo root or `src/`).
- **`server/`** is not on the mobile app's runtime path today; treat it as legacy unless you are explicitly maintaining the old GraphQL API.

---

## Mobile App (`src/`)

- **Stack**: Expo SDK 58, React 19, React Native 0.88, **expo-router** (file-based routes), **expo-dev-client**, **TypeScript strict** (`noUncheckedIndexedAccess`).
- **Path alias**: `@/*` → `src/*` (see `tsconfig.json`). Use `@/game/...`, `@/state/...` — avoid deep relative paths from screens.
- **Native project**: `ios/` is generated by prebuild and **gitignored**. Change native behavior through `app.config.ts` plugins and `expo run:ios`, not by hand-editing checked-in Xcode projects.
- **Firebase**: Configured via `GoogleService-Info.plist` and `@react-native-firebase/app`, `auth`, `database` plugins in `app.config.ts`. The app talks to **Firebase Realtime Database** directly from `services/firebase.ts` — there is no GraphQL client in `src/`.

---

## Routing & Screens

- **Routes live in `app/`**; **screens live in `screens/`**. Prefer thin route files that re-export the screen default, e.g. `app/(tabs)/index.tsx` → `export { default } from "@/screens/Home"`.
- **Route groups**: `(tabs)` for the main shell (Game, Times, Profile), `(auth)`-style flows as modals (`login-phone`). Keep `app/_layout.tsx` responsible for global theme, splash, and store initialization — not feature logic.
- **Tab layout** (`app/(tabs)/_layout.tsx`): custom `FloatingTabBar`, `freezeOnBlur: false` on the Game tab so the GL loop stays scheduled when switching tabs — preserve that when adding tabs.
- **Screens** compose hooks, Zustand selectors, and child components. Heavy game code stays in `screens/Home/` (`gameEngine`, drivers) but **rules** stay in `game/`.

---

## State (Zustand)

Three stores; don't add a fourth without a clear new domain.

| Store | File | Role |
|-------|------|------|
| `useUserStore` | `state/userStore.ts` | Auth lifecycle, bests, `recordRun` / `recordFocusScore`, display name |
| `useLeaderboardStore` | `state/leaderboardStore.ts` | RTDB listeners for classic + focus leaderboards |
| `useSettingsStore` | `state/settingsStore.ts` | `classic` \| `focus` mode; persisted `defaultMode` via AsyncStorage |

Conventions:

- **Subscribe in one place**: `useUserStore.getState().init()` and `useLeaderboardStore.getState().subscribe()` run from root `app/_layout.tsx` on mount; screens only select slices with `useUserStore((s) => s.highscore)`.
- **Async side effects** inside store actions (`recordRun`, `onSignedIn`) catch errors with `console.warn` and a short context string — don't throw to the UI unless you add explicit error UI.
- **Persist only what must survive reinstall policy**: settings use `zustand/middleware` + `AsyncStorage`; highscores use **SecureStore** in `services/localHighscore.ts` (legacy key names preserved for upgrades).
- **Race safety on auth**: after `await`, re-check `currentUid() === user.uid` (or `currentUid() === null` on sign-out) before applying server results — see `onSignedIn` / `onSignedOut`.

---

## Services & Firebase

`services/` is the only layer that imports `@react-native-firebase/*` (except Phone Auth UI that calls helpers).

- **`firebase.ts`**: module-level `getAuth()` / `getDatabase()`, `watchAuth`, phone sign-in, `fetchUser` / `updateUser`, `watchLeaderboard` / `watchFocusLeaderboard` (ordered queries on `users` by `highscore` / `focusHighscore`).
- **`highscores.ts`**: `submitClassicScore` / `submitFocusScore` — local SecureStore first, then `updateUser` when signed in and `isNewBest`.
- **`updates.ts`**: EAS Update launch check (`expo-updates`); fail-soft `console.warn` on network errors.
- **`appStoreVersion.ts`**: App Store (iTunes lookup) newer-binary check; pure `compareVersions` / `isStoreNewer` are unit-tested, `fetchAppStoreUpdate` is fail-soft. Compares against `Constants.nativeAppVersion` (the binary, not the OTA bundle).
- **`highscoreMerge.ts`**: pure parsing, merge, sort, leaderboard row shape — **no Firebase imports**; unit-test here.
- **`localHighscore.ts`**: SecureStore read/write; never change `HIGHSCORE_KEY` / `FOCUS_HIGHSCORE_KEY` without a migration plan (SDK 39 legacy installs).

Do not scatter `ref(db, ...)` or `update(...)` across screens — add a function on `firebase.ts` or extend an existing service.

---

## Game Logic vs Render Loop

Split is intentional and should stay strict.

### Pure layer — `src/game/`

- **`RunController`**: per-frame rules; `step(dtS, input)` returns a `RunSnapshot`. No React, no Three.js, no Firebase.
- **`FocusMeter`**, **`difficulty`**, **`worldSchedule`**, **`constants`** (`Tuning`): deterministic; tune via `Tuning` / `RunControllerOptions` in tests.
- **`random.ts`**: seeded RNG for reproducible tests.
- **`telemetry.ts`**: optional local run history in AsyncStorage (debug/analytics only).

All new gameplay rules belong here first, with Vitest coverage, before touching GL.

### Bridge layer — `screens/Home/`

- **`gameEngine.ts`**: creates Three.js scene, `createClassicDriver` / `createFocusDriver`, wires `RunController` to GL frame loop, pointer input, and callbacks (`onHoldEnd`, `onFocusRunEnd`).
- **`classicDriver.ts` / `focusDriver.ts`**: mode-specific behavior on top of the same engine; each `frame()` returns a `DriverFrame` (`world`, `changed`, `pace`).
- **`worlds/`**: one scene per scheduled world; `WorldLayer` crossfades between them from the driver's `DriverFrame`.
- **`Home/index.tsx`**: `GLView`, `PanResponder`, HUD throttling (`HUD_INTERVAL_MS`), tab focus via `useFocusEffect`, calls `useUserStore` for scores.

**Rules**

- The render loop calls `engine.frame(dtS)`; it does not embed drain/refill math inline.
- Use `onInterrupted()` / `isInterruptedFrame` for long hitches; `FocusMeter` already clamps via `maxFrameS` in tuning — don't double-clamp inconsistently.
- Dispose GL resources in `gameEngine.dispose()` when remounting `GLView` (`onContextCreate`).

---

## Scoring & Leaderboards

- **Units**: persisted highs are **integer tenths** (tenth of a second for classic hold time; focus mode uses weighted focus tenths from `RunSnapshot.scoreTenths`).
- **Merge on login**: `mergeHighscore(local, server)` → `max` + `pushToServer` when local wins; then `updateUser` only for fields that need pushing.
- **Leaderboard rows**: built with `toLeaderboardEntry(uid, val, scoreKey)`; sorted with `sortLeaderboard`. Focus board skips users without `focusHighscore` in the RTDB listener (see `watchOrdered` in `firebase.ts`).
- **Submit path**: always `isNewBest` against local SecureStore and in-memory store best before writing.

---

## Auth & Security Rules

- **Sign-in**: phone number via `@react-native-firebase/auth` (`requestPhoneCode` → confirm); UI in `components/PhoneAuth` and `app/login-phone.tsx`.
- **RTDB rules** ([`database.rules.json`](../database.rules.json)): under `users`, **read is public** (leaderboards); **write** only when `auth.uid == $uid`. Any new user fields must keep writes self-scoped.
- **Client trust model**: the app only writes the signed-in user's `users/{uid}` node. Do not add client-side paths that write another uid. Server-side admin (legacy `server/`) is out of band.
- **Logout** (`userStore.logout`): clears legacy SecureStore uid key, resets local bests in store, then `signOut` — order matters for anonymous play after logout.

---

## Legacy Server (`server/`)

The **`server/`** package is an older **Apollo Server + Express** stack on **Firebase Cloud Functions**, with `firebase-admin` and a checked-in `serviceAccountKey.json`. It exposed GraphQL queries/mutations for users and highscores.

The **current mobile app does not call this API** — it uses RTDB from the client. Keep `server/` in mind only when:

- Deploying or debugging legacy Cloud Functions (`npm run deploy` inside `server/`).
- Migrating data or retiring GraphQL entirely.

If you change scoring or user shape, update **`src/services`** and RTDB rules first; treat GraphQL resolvers as optional follow-up unless consumers still exist.

Conventions if you touch `server/`:

- CommonJS (`require` / `module.exports`), Babel ES2015 build to `build/`.
- Do not copy patterns from `server/` into `src/` — the mobile app is TypeScript-first and Firebase-client-native.

---

## Build, EAS & Config

- **Versioning**: `version` / iOS `buildNumber` in `app.config.ts`; production EAS profile uses `autoIncrement` (`eas.json`).
- **EAS Update (OTA)**: `runtimeVersion` uses the `appVersion` policy; `updates.url` points at the EAS project. `preview` / `production` build profiles set matching `channel` values in `eas.json`. Launch-time check lives in `services/updates.ts` and runs from `app/_layout.tsx` (not in screens). Dev client / `__DEV__` skips OTA; release builds use `shared/Loader` only while downloading/reloading. After the OTA check finishes without reloading, `app/_layout.tsx` runs the App Store check and shows `shared/UpdatePrompt` (generic two-button prompt) with an "Update" button that opens the store listing; "Later" dismisses for the session.
- **APS / push**: `APS_ENVIRONMENT=production` on `preview` and `production` EAS profiles; `app.config.ts` maps that to `aps-environment` entitlement — keep preview/production aligned with TestFlight/App Store.
- **Scripts** (repo root): `npm run build`, `deploy`, `submit`, `update:preview`, `update:production` delegate to `src/` EAS commands documented in README.
- **Change native capabilities** via `app.config.ts` `plugins` and `ios.infoPlist`, then prebuild — not by editing gitignored `ios/` in place on one machine.

---

## Testing

- **Runner**: Vitest (`src/vitest.config.mts`), `npm test` from root → `vitest run` in `src/`.
- **Scope**: `game/**/*.test.ts` and `services/**/*.test.ts` only — no component snapshot suite yet.
- **Game tests**: inject `tuning`, `seed`, and fixed world lists through `RunControllerOptions`; assert on `RunSnapshot` fields and events, not on pixels.
- **Service tests**: pure functions in `highscoreMerge` and similar — no Firebase mocks required if logic is isolated.
- **CI**: run `npm run typecheck` and `npm test` before shipping gameplay or scoring changes. A scoring bug is not caught by TypeScript alone.

When adding behavior, prefer a failing test in `game/` or `services/` over manual-only QA on device.

---

## Style & Naming

- **Files**: `PascalCase.tsx` for components and screens (`RunSummary.tsx`, `Home/index.tsx`); `camelCase.ts` for logic (`gameEngine.ts`, `highscoreMerge.ts`); game modules often single-word PascalCase class files (`RunController.ts`, `FocusMeter.ts`).
- **Components**: named default export for screens; named exports for shared pieces where reused (`createGameEngine`).
- **Types**: `PascalCase` interfaces (`RunSnapshot`, `LeaderboardEntry`, `UserRecord`). Use `type` for unions (`GameMode`, `MeterPhase`).
- **Imports**: external packages first, blank line, then `@/` aliases, then relative `.` imports within a feature folder.
- **React**: functional components and hooks; `useRef` for GL/engine/pointer state that must survive renders without triggering re-render.
- **Lint**: `expo lint` in `src/` when touching UI; keep `tsc --noEmit` clean.

---

## Documentation & Comments

- **Comments explain non-obvious intent** — e.g. why `freezeOnBlur` is false, why SecureStore keys are legacy-named, why `mergeHighscore` sets `pushToServer`. Avoid narrating obvious code.
- **README** stays the entry for Expo start, EAS, and Firebase console links; **this file** is the engineering contract for structure and boundaries.
- **Privacy**: `privacy-policy.txt` at repo root is user-facing legal text — don't duplicate it in code comments.

| Topic | Location |
|-------|----------|
| Local run & EAS | [README.md](../README.md) |
| RTDB rules | [database.rules.json](../database.rules.json) |
| Expo config | [src/app.config.ts](../src/app.config.ts) |
| EAS profiles | [src/eas.json](../src/eas.json) |
| OTA launch check | [src/services/updates.ts](../src/services/updates.ts) |

The thin auto-attached editor rule mirroring this file lives at `.cursor/rules/coding-conventions.mdc`.

---

## Known Issues / Cleanup

Where today's tree diverges from the target shape. Fix opportunistically; align new work with the conventions above.

- **`server/src/serviceAccountKey.json` is tracked in git.** This is a critical secret exposure. Rotate the Firebase service account, remove the file from history or stop tracking it, load credentials from environment/secret manager in Cloud Functions, and rely on `.gitignore` patterns already present for `*service-account*.json`.
- **Legacy GraphQL server vs client RTDB.** `server/` still ships Apollo + playground; the app uses RTDB only. Either document deprecation and delete the deploy path, or add a short `server/README.md` stating "legacy / unused by mobile" to avoid accidental dual writes.
- **Public read on all `users` nodes** enables leaderboards but exposes display names and scores to unauthenticated clients — acceptable for this product today; revisit if PII or opt-out is required.
- **Firestore rules in `server/firestore.rules`** appear unused by the current RTDB-first app — confirm before investing in Firestore features.
- **Root `AuthKey_*.p8`** may exist locally; `*.p8` is gitignored — ensure keys are never committed and use ASC/EAS for signing credentials.
- **`server/` Node 8 / Apollo 2 / Babel 6** stack is far behind `src/` (Node 20+, modern Expo). Do not modernize server and mobile in one undifferentiated PR; treat server as optional maintenance.
- **No automated CI workflow** in repo (unlike newer Balt apps) — adding a minimal GitHub Action for `typecheck` + `vitest` in `src/` would catch scoring regressions early.
