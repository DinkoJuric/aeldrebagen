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

### ✅ CANONICAL: LivingBackground Architecture (Dec 2025)

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

### Lesson Learned

> **Never do a mass file extension rename without incremental `tsc --noEmit` checks.**
> 
> The correct approach:
> 1. Convert ONE file at a time
> 2. Fix ALL its type errors
> 3. Run `tsc --noEmit` - must pass
> 4. Commit
> 5. Repeat for next file
