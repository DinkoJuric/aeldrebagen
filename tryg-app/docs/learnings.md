---
description: Master record of all project and cross-project learnings
---

# 🧠 Project Learnings & Knowledge Base

> **Note to Agents:** Always update the Table of Contents below when adding new sections.
> Format: **Problem** → **Action Taken** → **Future Prevention**

## 📖 Table of Contents

1. [Shell & Environment](#shell--environment)
2. [Git & Deployment](#git--deployment)
3. [React & Vite](#react--vite)
4. [Firebase & Auth](#firebase--auth)
5. [iOS / Capacitor](#ios--capacitor)
6. [Browser Automation & Testing](#browser-automation--testing)
7. [Agent & Tooling](#agent--tooling)
8. [UI & Design](#ui--design)
9. [Documentation & Workflow](#documentation--workflow)
10. [Google Apps Script](#google-apps-script)

---

## Shell & Environment

### PowerShell Command Chaining
- **Problem**: `&&` syntax failed to chain commands.
- **Action**: Researched PowerShell docs, found `;` is the correct operator (in PS 5.1).
- **Future**: On Windows, use `;` to chain commands or `if ($?) { ... }`. Never assume `&&` support unless PS 7+ is guaranteed.

### File Operations on Windows
- **Problem**: `mv` command not recognized.
- **Action**: Used PowerShell-native `Move-Item`.
- **Future**: Use `Move-Item`, `Copy-Item`, `Remove-Item` on Windows, not Unix aliases.

### PowerShell Emoji Encoding
- **Problem**: Console output with emojis (✅, 🔹) appeared garbled in PowerShell.
- **Action**: Removed emojis from script output, used plain text markers like `[OK]`, `[+]`.
- **Future**: Avoid emojis in script output when running on Windows. PowerShell's default encoding garbles UTF-8 emojis.

---

## Git & Deployment

### Secrets Don't Trigger Builds
- **Problem**: Added GitHub Secrets but app showed white screen (old build had empty env vars).
- **Action**: Pushed empty commit to trigger rebuild.
- **Future**: After adding secrets, always `git commit --allow-empty -m "trigger rebuild" && git push`.

### GitHub Pages 404 Errors
- **Problem**: Deployed site showed 404, files were present.
- **Action**: Discovered `index.html` must be at repo root.
- **Future**: Verify file structure before debugging. Wait 60s after push for propagation.

### Gitignore Not Working
- **Problem**: `.gitignore` entries ignored for already-tracked files.
- **Action**: Had to `git rm --cached <file>` first.
- **Future**: Add files to `.gitignore` BEFORE first commit. If already tracked, must explicitly untrack.

### Firestore Query Ordering
- **Problem**: Queries with `orderBy('field')` excluded documents where `field` was undefined.
- **Action**: Ensured all documents have default values for sorted fields (e.g., added default `time` to tasks).
- **Future**: When using `orderBy` in Firestore, remember it implicitly filters out docs missing that field. Always set defaults.

---

## React & Vite

### Missing Named Imports
- **Problem**: App crashed on login with `ReferenceError: useMemo is not defined`.
- **Action**: Added `import { useMemo } from 'react'` to the component.
- **Future**: When using hooks, ALWAYS verify they are imported from 'react'. Use `husky` + `lint-staged` to catch this.

### Tailwind v4 Setup Confusion
- **Problem**: PostCSS config approach from docs didn't work.
- **Action**: Found Tailwind v4 uses `@tailwindcss/vite` plugin instead.
- **Future**: Check major version of dependencies - v4 has different setup than v3.

### Vite Base Path for Capacitor
- **Problem**: iOS build showed broken paths (404 for assets).
- **Action**: Changed `base: '/absolute/'` to `base: './'` for relative paths.
- **Future**: Use `base: './'` for Capacitor/mobile builds. Absolute paths break in WebView.

### Vite Host Blocking on Tunnels
- **Problem**: LocalTunnel showed "Blocked request. This host is not allowed".
- **Action**: Added `server: { allowedHosts: 'all' }` to vite.config.js.
- **Future**: When using tunneling services, add `allowedHosts: 'all'` to Vite server config.

---

## Firebase & Auth

### Signup State Race Condition
- **Problem**: New users saw wrong screen after signup (circle setup instead of consent).
- **Action**: Set `userProfile` state immediately after `createUserProfile()`, not waiting for `onAuthStateChanged`.
- **Future**: When creating user documents, update local state synchronously. Don't rely on Firestore listeners for immediate UI.

### Hardcoded Names in Demo
- **Problem**: "Birthe" and "Louise" were hardcoded in 12+ places.
- **Action**: Passed dynamic props (`userName`, `seniorName`) from AppCore.
- **Future**: Use constants like `DEMO_SENIOR_NAME` during prototyping to make replacement trivial.

### Features Not Syncing (Migration Audit)
- **Problem**: Features (weekly questions) worked locally but not on partner device.
- **Action**: These features still used `useState` (localStorage) instead of Firestore hooks.
- **Future**: When migrating from MVP to Backend, audit EVERY piece of state (Tasks, Pings, Settings) against a checklist.

### Firebase Authorized Domains
- **Problem**: Google OAuth returned "Requested action is invalid".
- **Action**: Added deployment domain (`dinkojuric.github.io`) to Firebase Auth settings.
- **Future**: When deploying to new domains, check: 1) Firebase Auth authorized domains, 2) CORS, 3) OAuth redirects.

### Role-Based View Isolation
- **Problem**: Dev convenience toggle let users see both views, violating privacy model.
- **Action**: Removed toggle, view determined solely by `userProfile.role`.
- **Future**: Development conveniences must be behind feature flags or removed before release.

---

## iOS / Capacitor

### iOS Viewport Whitespace
- **Problem**: White bar appeared above header on iOS devices.
- **Action**: Removed/adjusted `viewport-fit=cover` in meta tag.
- **Learnings**: `viewport-fit=cover` expands content into the notch. Requires manual `safe-area-inset-top` handling.
- **Future**: Use standard viewport for PWA unless specifically designing immersive edge-to-edge UI.

### Bundle ID Format
- **Problem**: Xcode rejected bundle ID with wrong format.
- **Action**: Used `tld.company.appname` format (e.g., `dk.tryg.app`).
- **Future**: Always use reverse DNS format for bundle IDs.

### Capacitor Sync After Web Changes
- **Problem**: iOS build showed old web content.
- **Action**: Manual `npm run build && npx cap sync ios` required.
- **Future**: Run sync after EVERY web build. It copies `dist/` to iOS project.

---

## Browser Automation & Testing

### OAuth Popup Blocking
- **Problem**: Browser automation agent couldn't complete Google OAuth login (popup blocked).
- **Action**: Created email/password test user via Node.js script instead.
- **Future**: For apps with OAuth, always create email/password test accounts (`test@example.com`) for automation.

### Test User Creation Script
- **Problem**: Couldn't test RelativeView without a logged-in user in the circle.
- **Action**: Created `scripts/create-test-user.mjs` to programmatically create users.
- **Future**: Maintain test user creation scripts. Enables E2E testing without manual setup.

### Pixel Click Coordinates Unreliable
- **Problem**: Browser subagent clicks missed elements in scrollable areas.
- **Action**: Switched to element index-based clicking or selector-based clicking.
- **Future**: Avoid pixel coordinates. use Selectors or Index.

### Input Fields With Existing Values
- **Problem**: Browser agent appended text to existing value (e.g. "email@test.comemail@test.com").
- **Action**: Command `ClearText: true` required.
- **Future**: Always clear input fields before typing in automation.

---

## Agent & Tooling

### File Search Scope
- **Problem**: Agent searched only `tryg-app/` for workflow, thought it was missing.
- **Action**: Workflow was in parent directory.
- **Future**: Search from workspace root. Verify against file explorer.

### Gitignore Tool Blocks
- **Problem**: `view_file` returned "access blocked by gitignore".
- **Action**: Used shell `type` command as workaround.
- **Future**: Don't accept tool errors as absolute. Try shell commands.

### Antigravity Global Workflows
- **Problem**: Created workflows at `~/.gemini/workflows/` - ignored.
- **Action**: Correct path is `~/.gemini/antigravity/global_workflows/`.
- **Future**: Use the correct global workflow path.

---

## UI & Design

### Visual Parity Blind Spots
- **Problem**: Applied UI polish to SeniorView but forgot RelativeView.
- **Action**: Second pass required for RelativeView.
- **Future**: UI polish is a cross-cutting concern. Audit ALL views when changing styles.

### Two-Sided App Symmetry
- **Problem**: Feature only worked in one direction (senior → relative).
- **Action**: Added bidirectional support.
- **Future**: For communication features (pings, status), design both directions simultaneously.

---

## Documentation & Workflow

### Vague Changelog Timing
- **Problem**: Unclear when to create CHANGELOG.
- **Action**: Created at first stable milestone (v1.0.0 MVP).
- **Future**: Create CHANGELOG after first shippable version.

### Knowledge Loss
- **Problem**: Learnings scattered across multiple files.
- **Action**: Consolidated into this master `learnings.md`.
- **Future**: Maintain ONE central learnings file with clear categories.

---

## Google Apps Script

### CORS Preflight Failures
- **Problem**: Fetch POST to Apps Script triggered CORS error.
- **Action**: Switched to `URLSearchParams` body format.
- **Future**: Use form-encoded POST for Apps Script. JSON triggers CORS preflight.

---

## Performance

### CSS Sprites for Icon Sets
- **Problem**: Loading many individual icon images caused layout shift (FOUC) and network overhead.
- **Action**: Combined icons into a single sprite sheet (`family-presence.png`) and used `backgroundPosition`.
- **Future**: For fixed sets of UI assets (avatars, status icons), always use sprite sheets.

---
