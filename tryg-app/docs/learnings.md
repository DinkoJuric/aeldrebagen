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

### "Red Text" Panic (Git Status)
- **Problem**: User panicked seeing `git status` output in red, thinking it was a build error.
- **Action**: Explained that `git status` lists modified files in red before staging.
- **Future**: When presenting git status to non-technical users, explicitly clarify "These are just the files we changed, not errors."

---

## React & Vite

### Missing Named Imports
- **Problem**: App crashed on login with `ReferenceError: useMemo is not defined`.
- **Action**: Added `import { useMemo } from 'react'` to the component.
- **Future**: When using hooks, ALWAYS verify they are imported from 'react'. Use `husky` + `lint-staged` to catch this.

### Smart vs Dumb Components
- **Problem**: Presentational components (`HelpExchange`) were fetching their own data via context, making them hard to test and reuse.
- **Action**: Refactored to "Dumb" components taking data via props. Moved data fetching up to "Smart" views (`SeniorView`).
- **Future**: Keep leaf components pure. Fetch data in top-level views/pages.

### Shared Component Architecture
- **Problem**: Maintained two separate components (`SeniorStatusCard`, `FamilyStatusCard`) for similar purposes, leading to divergence.
- **Action**: Unified into a single `StatusCard` with `mode` prop.
- **Future**: Use the "Mirror Protocol": If a component has a dual role, use one file with modes instead of two files.

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

### Vite + TypeScript Client Types
- **Problem**: `import.meta.env` threw "Property env does not exist" type errors.
- **Action**: Added `/// <reference types="vite/client" />` reference or ensured `vite-env.d.ts` inclusion.
- **Future**: Always verify Vite client types are included in `tsconfig` `include` array.

### PWA Caching Aggressiveness
- **Problem**: New features (Living Background) invisible to users despite deploy.
- **Action**: Users had to "Empty Cache & Hard Reload".
- **Future**: Implement "New Version Available" toast using `virtual:pwa-register` to prompt sw skipWaiting().

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

## Mobile / PWA

### PWA Cache Limits (The "Missing File" Mystery)
- **Problem**: Large assets (e.g., 5MB PNGs) worked on localhost but failed to load in the installed PWA on mobile.
- **Root Cause**: VitePWA / Workbox has a default `maximumFileSizeToCacheInBytes` of **2MB**. Files larger than this are silently excluded from the service worker cache.
- **Fix**:
    1.  **Immediate**: Increased limit in `vite.config.js` to 6MB.
    2.  **Proper**: Compress assets! A 5MB image for a mobile app is an anti-pattern.
- **Lesson**: Always check `dist/sw.js` or build logs for warnings about "skipping large assets".

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

### Standardized Translation Keys for Shared Events
- **Problem**: Match events generated task titles in hardcoded Danish, inconsistent between views.
- **Action**: Created standardized `match_task_*` keys that handle both Senior-actor (`match_task_call`) and Relative-actor (`match_task_call_relative`) perspectives.
- **Future**: When an action in one view creates a record in another, use shared translation keys with parameters (e.g., `{{name}}`) to maintain brand voice symmetry across all locales.

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

### PWA Start URL on Subpaths
- **Problem**: PWA installed from GitHub Pages (subpath) failed to open (403 Error) because `start_url` defaulted to `/` (domain root).
- **Action**: Dynamically set `start_url` and `scope` in `vite.config.js` to match the `base` path (e.g., `/aeldrebagen/`).
- **Future**: Ensure `manifest.start_url` matches your deployment base path, especially for GitHub Pages.

---

## UI & Layout

### LivingBackground Layout Interference
- **Problem**: Animated background component caused scroll failures and bottom nav positioning issues.
- **Root Cause**: The `LivingBackground` component's CSS (overflow/position) interfered with parent container layout.
- **Symptoms**: Content wouldn't scroll, bottom nav floated in wrong position, UI felt broken.
- **Action**: Temporarily replaced with a simple gradient div to isolate and confirm the issue.
- **Future**: When implementing animated backgrounds:
  1. Use `position: absolute` with `inset-0` so background doesn't affect children's layout flow
  2. Test scroll behavior immediately after adding such components
  3. Avoid `overflow: hidden` on wrapper elements if children need to scroll

---

### Nested Overflow-Hidden Scroll Blocking (Dec 2025)
- **Problem**: App couldn't scroll at all — content was stuck in place.
- **Root Cause**: THREE levels of `overflow-hidden`: `body`, `#root` (both in `index.css`), AND `LivingBackground.tsx` wrapper.
- **Symptoms**: Pull-to-refresh worked, but actual content scrolling was blocked.
- **Action**: Removed `overflow: hidden` from `body` and `#root`, removed `overflow-hidden` from LivingBackground, changed `min-h-screen` to `h-full`.
- **Future**: 
  1. Never use `overflow-hidden` on layout containers (`body`, `#root`, page wrappers)
  2. `overflow-hidden` should only be on decorative elements with clipped rounded corners
  3. Test scroll behavior immediately after touching layout CSS

---


> **This is the APPROVED baseline for all atmospheric/background implementations going forward.**

After significant trial and error with backgrounds, headers, navigation bars, and screen sizes, the following pattern is now established as correct:

#### The Correct Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LivingBackground (OUTER WRAPPER)                           │
│  ├── className="min-h-screen w-full relative overflow-hidden"│
│  ├── Gradient theme (via ThemeContext circadianTheme)       │
│  │                                                          │
│  │  ┌─────────────────────────────────────────────────────┐ │
│  │  │  Ambient SVG Blobs (DECORATIVE LAYER)               │ │
│  │  │  ├── className="absolute inset-0 z-0 pointer-events-none"│
│  │  │  └── blur-3xl opacity effects                       │ │
│  │  └─────────────────────────────────────────────────────┘ │
│  │                                                          │
│  │  ┌─────────────────────────────────────────────────────┐ │
│  │  │  Content Container (SCROLLABLE)                     │ │
│  │  │  ├── className="relative z-10 min-h-screen"         │ │
│  │  │  └── Children are passed here                       │ │
│  │  └─────────────────────────────────────────────────────┘ │
│  │                                                          │
└──┴──────────────────────────────────────────────────────────┘
```

#### Key Principles

| Principle | Implementation |
|-----------|---------------|
| **Background is decorative** | `pointer-events-none` on blobs, `z-0` |
| **Content is interactive** | `z-10` on content wrapper |
| **Layout is preserved** | Content wrapper has `min-h-screen`, NOT `h-full` |
| **Scroll is unaffected** | Parent has `overflow-hidden`, CHILDREN scroll |
| **Theme is centralized** | `useTheme()` from `ThemeContext` drives gradient |

#### Critical CSS Pattern

```tsx
// LivingBackground.tsx (CORRECT)
<div className={`min-h-screen w-full transition-all duration-[3000ms] relative overflow-hidden ${theme.gradient}`}>
    {/* Blobs - MUST be absolute + pointer-events-none */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden blur-3xl opacity-80">
        {/* SVG blobs here */}
    </div>
    
    {/* Content - MUST be relative + z-10 */}
    <div className="relative z-10 min-h-screen">
        {children}
    </div>
</div>
```

#### What NOT To Do ❌

| Anti-Pattern | Why It Breaks |
|--------------|--------------|
| `h-screen` on content wrapper | Clips content on mobile (use `min-h-screen`) |
| `overflow-hidden` on content area | Blocks scrolling in views |
| `position: fixed` inside background | CSS transforms break fixed positioning |
| Nested `h-full` without parent height | Collapses to 0 |

#### Integration Points

| Entry Point | How to Integrate |
|-------------|-----------------|
| `AppWithAuth.tsx` | Wrap AuthScreen conditionally with `<ThemeProvider><LivingBackground>` |
| `AppCore.tsx` | Conditional: `{FEATURES.livingDesign ? <LivingBackground>...</LivingBackground> : <div className="static-gradient">...</div>}` |

#### Feature Flag Fallback

Always gate with `FEATURES.livingDesign` in `features.ts`:
- `true` = Use circadian LivingBackground
- `false` = Use static gradient (instant revert)

---

### Bottom Navigation Positioning
- **Problem**: `position: absolute; bottom: 0` didn't work properly inside scrollable containers.
- **Root Cause**: `absolute` positioning places element at the bottom of the **scroll content**, not the viewport.
- **Solution**: Changed to `position: sticky; bottom: 0` which sticks to viewport within scroll container.
- **Future**: For fixed-bottom elements inside scrollable areas, always use `sticky` not `absolute`.

### CSS `fixed` Inside Transformed Containers
- **Problem**: Modal with `position: fixed` rendered in wrong position, overlaying other content incorrectly.
- **Root Cause**: Any parent with `transform`, `perspective`, or `filter` creates a new stacking context that breaks `fixed` positioning. The orbit component had CSS transforms.
- **Solution**: Use **React Portal** (`createPortal(modal, document.body)`) to render modal at document root level.
- **Future**: Any modal/overlay component in a complex UI should use Portal to escape CSS context issues.

### Data Flow: Members vs MemberStatuses
- **Problem**: Archetype badges not showing in orbit despite archetype data existing in Firestore.
- **Root Cause**: Two different data sources:
  - `members` from `useCareCircle` (careCircleMemberships collection) - **no archetype**
  - `memberStatuses` from `useMemberStatus` (memberStatuses subcollection) - **has archetype**
- **Action**: Changed `FamilyConstellation` to receive `memberStatuses` instead of `members`.
- **Future**: Always trace data flow when a field appears missing. Check which hook/collection the data comes from.

---

### Dark Mode Typography Pattern (Dec 2025)
- **Problem**: Hardcoded text colors (`text-stone-800`, `text-stone-500`) become invisible on dark backgrounds.
- **Root Cause**: Tailwind colors don't respond to `.theme-dark` class - need CSS variables.
- **Solution**: Created theme-aware utility classes in `index.css`:
  ```css
  .theme-text { color: var(--theme-text); }
  .theme-text-muted { color: var(--theme-text-muted); }
  .theme-card { background: var(--theme-card-bg); }
  ```
- **Where to apply**:
  - All headers: `className="theme-text"` instead of `text-stone-800`
  - All subtext: `className="theme-text-muted"` instead of `text-stone-500`
  - All cards/modals: `className="theme-card"` instead of `bg-white`
- **Future**: When adding new components, ALWAYS use `theme-text` / `theme-card` classes. Never hardcode `bg-white` or `text-stone-*`.

---

## Debugging Methodology

### Hypothesis Testing for Layout Issues
- **Learned**: When multiple CSS issues compound (scroll, positioning, z-index), isolating variables is critical.
- **Approach**:
  1. Comment out complex components one at a time
  2. Replace with simple alternatives (e.g., gradient div instead of animated background)
  3. Verify fix before re-enabling complexity
- **Example**: Disabling `LivingBackground` immediately fixed 3+ issues (scroll, nav position, layout overflow).

### TypeScript Pre-existing Errors
- **Problem**: IDE shows many TypeScript errors unrelated to current changes, causing confusion.
- **Action**: Focus on errors introduced by your changes. Pre-existing errors should be tracked separately.
- **Future**: Run `tsc --noEmit` before starting work to establish baseline error count.

---

## Refactor Timeline & Error Source

### ⚠️ CRITICAL: Last Known Good Build

The codebase went through a major refactor that introduced TypeScript errors. Here is the timeline:

| Date | Commit | State |
|------|--------|-------|
| Pre-Dec 17 | Feature folders created | ✅ **LAST SAFE BUILD** - `.jsx` files, working code |
| Dec 17 | TypeScript migration | ⚠️ Errors introduced - type mismatches, unused vars |
| Dec 17 | CVA + cn() adoption | ⚠️ More refactoring, potential class issues |
| Dec 17 | Layout/CSS fixes | Today's session - fixing symptoms |

### What Went Wrong

1. **Mass Conversion**: Renaming `.jsx` → `.tsx` across entire codebase at once
2. **No Incremental Testing**: Build not verified after each batch of changes
3. **Type Mismatches**: Props interfaces don't match actual usage (e.g., `onSendPing` takes `type: string` but callers pass no args)
4. **Cascading Errors**: One type fix reveals dependent errors elsewhere

### How to Recover (If Needed)

If TypeScript errors become unmanageable:

```bash
# Find last working commit before TypeScript migration
git log --oneline --all | grep -i "feature"
# Or look for commit before "TypeScript migration"
git log --oneline -20

# Option 1: Check out specific files from that commit
git checkout <commit-hash> -- src/components/RelativeView.jsx

# Option 2: Create a "fix-types" branch to address systematically
git checkout -b fix-typescript-errors
```

### Error Categories to Watch

| Category | Example | Priority |
|----------|---------|----------|
| **Prop Type Mismatches** | `onSendPing: (type: string) => void` called as `onSendPing()` | High - fix signatures or callers |
| **Unused Variables** | `'profile' is declared but never read` | Low - prefix with `_` or remove |
| **Null vs Undefined** | `string | null` not assignable to `string | undefined` | Medium - standardize on one |
| **Generic Types** | `Set<unknown>` not assignable to `Set<string>` | Medium - add explicit type |

### Circadian UI Transitions
- **Problem**: Manually updating background and theme at different intervals caused "flicker" or inconsistent atmospheres.
- **Action**: Centralized all circadian logic into a `ThemeContext` provider that drives both global CSS variables and the `LivingBackground` SVG states.
- **Future**: Always centralize "Atmospheric State" (Time, Weather, Urgency) in a single provider to ensure UI-wide harmony.

### Documentation Rigor (Standardized)
- **Problem**: Standards (typography, architecture) can be lost between different agent sessions.
- **Action**: Created a mandatory `.agent/workflows/onboarding.md` and added it to the global requirements.
- **Future**: Use workflows to enforce project-specific constraints (e.g., --font-size-lg base).

### Mass Refactoring Risk (Dec 2025)
- **Problem**: Renaming dozens of files to `.tsx` and refactoring prop flows simultaneously introduced a cascade of 50+ type errors.
- **Action**: Established a baseline `tsc --noEmit`, then fixed errors component-by-component, starting with the Shared Context.
- **Future**: Always refactor incrementally. Commit after each successful `tsc` verification of a single module.

### i18n Migration Syntax Errors
- **Problem**: Accidental markdown fences and broken template literals were injected during bulk string replacement in `HealthTab.tsx`.
- **Action**: Surgically repaired the syntax errors and verified with `tsc`.
- **Future**: When performing multi-file search-and-replace for localization, perform a final lint audit specifically on the affected files before committing.

### Type Safety as Architectural Documentation
- **Problem**: Hardcoded `any` and local interface duplication obscured the relationship between features.
- **Action**: Centralized all domain types in `src/types.ts`.
- **Future**: Treat `types.ts` as the "Source of Truth" for the app's data model. Never duplicate a core interface locally.

### Tailwind Class Corruption (2025-12-20)
- **Problem**: Symptom chart bars weren't rendering. Classes like `flex - 1` (with spaces) were breaking styling silently.
- **Action**: Fixed by removing spurious spaces (`flex-1`, `w-full`, etc.) and `{h}px` instead of `{h} px`.
- **Future**: When charts or layouts break unexpectedly, grep for spaces in Tailwind class strings. Template literal formatting can inject unwanted whitespace.

---

## Configuration & Security (Dec 2025)

### MCP Server Configuration
- **Problem**: mcp_config.json became corrupted during edits, and You.com server returned Bad Gateway.
- **Action**: Switched You.com to use local npm package @youdotcom-oss/mcp instead of remote HTTP URL. Switched GitHub to 
px execution to avoid Docker dependency.
- **Learnings**: Remote HTTP MCP servers can be flaky. Local 
px execution is more robust.
- **Future**: When configuring MCP servers, prefer local 
px packages over remote URLs where possible.

### Firestore Rules for POC
- **Problem**: Needed to allow a specific user to edit ANY document for demo setup, bypassing ownership rules.
- **Action**: Hardcoded email check 
equest.auth.token.email == 'admin@email.com' in irestore.rules.
- **Future**: For rapid POC data setup, use email-based exceptions in rules rather than complex RBAC if speed is the priority.

---

## UI Components & UX (Dec 2025)

### Modal Scroll Bleed
- **Problem**: Opening a modal allowed the background application to scroll, confusing the user and hiding the header/footer.
- **Root Cause**: Modal was just a `div` on top of the DOM. Touch events propagated to the body.
- **Action**: Implemented `useScrollLock` hook to set `overflow: hidden` on `body` when modal opens.
- **Future**: For any "App-like" overlay, Scroll Locking is mandatory for premium feel.

### React Portals for Layout Safety
- **Problem**: Modals were clipped by `overflow: hidden` on parent containers or affected by CSS transforms.
- **Action**: Refactored `Modal` and `ShareModal` to use `createPortal` to render directly into `body`.
- **Future**: Never render a Modal "inline". Always Portal it out.

### Admin Data Silent Failure
- **Problem**: Admin edits to members saved but "nothing happened" (firestore update failed silently).
- **Root Cause**: Type mismatch. Component expected `docId` but Hook provided `id`. No TypeScript error because `any` or loose typing masked it.
- **Action**: Added explicit mapping `docId: doc.id` in `useCareCircle` hook.
- **Action**: Added explicit mapping `docId: doc.id` in `useCareCircle` hook.
- **Future**: When data isn't saving, check the ID field names first. `id` vs `docId` vs `uid` is a classic trap.

### Type Safety: The `as Type` Trap
- **Problem**: TypeScript didn't catch that `docId` was missing from the `Member` object because we used `as Member[]` casting.
- **Root Cause**: `as Type` tells TS "I know better," suppressing errors for missing fields.
- **Action**: In the future, prefer Zod validation or constructor functions (e.g., `createMember(doc)`) that strictly assign fields. If using `as Type`, MANUALLY verify every required field matches the Firestore data transformation.

### Refactoring Hook Exports
- **Problem**: Renamed `updateAnyMember` to `updateMemberByDocId` inside `useCareCircle` but did not update the `return` object.
- **Result**: `ReferenceError` at runtime (function undefined), causing Admin features to break silently or throw.
- **Action**: Renamed export key to match function name or aliased it.
- **Future**: When renaming functions in a custom hook, **IMMEDIATELY** check the `return` statement. Typescript might not catch this if the return type is inferred or loose.

### Firestore ID Confusion (Member Updates)
- **Problem**: `updateAnyMember` assumed `circleId_userId` format. Failed for manual members or if `userId` was missing/different.
- **Action**: Shifted to updating by `docId` directly, which is the reliable primary key.
- **Future**: Always prefer `docId` for update/delete operations. `userId` is a property, not necessarily the key.

### Firestore Persistence Locking
- **Problem**: Application showed ailed-precondition errors and failed to sync writes in dev environment (concurrent tabs).
- **Action**: Switched from enableIndexedDbPersistence to enableMultiTabIndexedDbPersistence.
- **Future**: Always use enableMultiTabIndexedDbPersistence for modern web apps to ensure resilience across tabs.


### Hook Context & Scoping
- **Problem**: useCareCircle hook was called inside a child component (FamilyTree) without a valid careCircleId or context, causing it to return a dead update function.
- **Action**: Lifted the update logic to the parent (ShareModal) which has access to the Firestore instance, and passed it down as a callback prop.
- **Future**: Avoid initializing data-fetching hooks in presentational components just to get mutation functions. Pass mutation callbacks from the container/page level.


### Fragile Logic in POCs
- **Problem**: UI logic relied on string matching of names (includes('Fatima')) to build the family tree structure. Renaming the user broke the tree structure.
- **Action**: Switched to exclusion-based logic (defaults to parent if not the other sibling) or ID-based logic where possible, to make it robust against user edits.
- **Future**: Never use mutable fields like displayName for structural logic. Always rely on stable IDs.


### UI Density vs Clarity
- **Problem**: Default Tailwind spacing (gap-4, p-4) created a sparse feeling in a modal context where information density was preferred.
- **Action**: Reduced vertical rhythm significantly (mt-1, h-4 trunks) and used negative margins (-mt-2) to overlap labels with avatars slightly for a tighter look.
- **Future**: For information-rich modals, start with tighter spacing tokens or custom density classes.


### Data Synchronization Pitfalls
- **Problem**: Renaming a user in one collection (careCircleMemberships) did not reflect in a component reading from another (memberStatuses), leading to stale UI.
- **Action**: Refactored the UI component (FamilyPresence) to read names from the canonical source (members list from context) and join with status data on the fly.
- **Future**: Avoid duplicating mutable data like names across collections. Store them in one place and join/read as needed.


---

## PWA & Viewport Layout (Dec 2025)

### The 120% Height Conflict (Viewport Inheritance)
- **Problem**: In PWA, the onboarding flow had an unwanted scrollbar, and the "Next" button was pushed out of sight.
- **Root Cause**: A "Math Error" in the CSS hierarchy. `AppCore.tsx` had a Global Header + Content Area + Global Footer. The Content Area (Onboarding) was set to `h-[100dvh]`. This caused the total height to be `100dvh + 40px (header) + 80px (footer)`, resulting in ~115% vertical overflow.
- **Action**: Refactored the parent container to `flex flex-col`. Set the Header/Footer to `shrink-0` and the Content Area to `flex-1` with `h-full`.
- **Future**: Never use `100dvh` for a component that will be nested alongside siblings. Use `h-full` and let a Flexbox parent handle the "squeeze". Ensure the middle container has `min-h-0` to allow its children to scroll internally if they exceed the squeezed height.

### Mixed-Orientation Media in Fixed Containers
- **Problem**: Portrait videos (9:16) appearing letterboxed or "constrained" inside 16:9-style containers.
- **Root Cause**: Fixed `h-64` or `aspect-video` on containers forced the video to fit width-first, adding black bars.
- **Action**: Implemented a flexible layout (`w-auto h-full`) for the video element and a `white` background to match the app's hygge aesthetic, effectively hiding the aspect ratio mismatch.
- **Discovery**: Explicit `aspect-[9/16]` works great for layout but can cause visual "jumps" if the container background doesn't match the card. For now, manual unconstraining provides the cleanest look.
- **Future**: Standardize on a `MediaContainer` component that adapts to the asset's aspect ratio or uses `object-cover` within a consistent card shape.

### React Keys with Optional IDs
- **Problem**: Build failed because `key={member.userId}` was used, but `userId` is optional in `Member` type.
- **Action**: Used explicit fallback `key={member.userId || member.docId}`.
- **Future**: When using a type with optional IDs as a React key, always provide a stable fallback (like `docId` or index) to satisfy TypeScript and ensure rendering stability.

### PWA Assets in Subdirectories
- **Problem**: Images and videos failed to load on iOS/PWA when deployed to GitHub Pages (subdirectory `/aeldrebagen/`).
- **Action**: Created `resolvePath()` utility using `import.meta.env.BASE_URL` to prepend the correct base path dynamically.
- **Future**: Never use hardcoded absolute paths `/assets/...`. Always wrap in `resolvePath()` or import explicitly.

### PWA Video Caching
- **Problem**: Onboarding videos didn't load offline.
- **Action**: Added `mp4` to `workbox.globPatterns` in `vite.config.js`.
- **Future**: Explicitly verify that large media assets needed for core flows (like onboarding) are included in the SW cache.

### Mobile Video Mute Stability
- **Problem**: Toggling `muted` prop on `<video>` elements was unreliable in iOS PWA (UI showed unmuted, video remained silent).
- **Action**: Refactored to use `ref.current.muted = state` inside a `useEffect`.
- **Future**: For media playback state (play/pause/mute) on mobile, prefer direct DOM manipulation via refs over declarative props to ensure sync with browser autoplay policies.

### PWA Updates & Caching
- **Observation**: Significant changes to assets or manifest often require iOS users to re-save to Home Screen if the service worker update strategy isn't aggressive (`clientsClaim: true`, `skipWaiting: true`).
- **Action**: Confirmed fix by reinstalling PWA.
- **Future**: When shipping critical PWA fixes, assume users might need to clear cache or reinstall unless an explicit "New Version Available" prompt (Toast) is implemented to trigger SW updates.
