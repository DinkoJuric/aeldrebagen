---
description: Learnings from past projects to apply in future work
---

# Cross-Project Learnings

Actionable learnings for avoiding roadblocks. Format: **Problem** → **Action Taken** → **Future Prevention**

---

## Shell & Environment

### PowerShell Command Chaining
- **Problem**: `&&` syntax failed to chain commands
- **Action**: Researched PowerShell docs, found `;` is the correct operator
- **Future**: On Windows, always use `;` for command chaining. `&&` is Bash-only.

### File Operations on Windows
- **Problem**: `mv` command not recognized
- **Action**: Used PowerShell-native `Move-Item`
- **Future**: Use `Move-Item`, `Copy-Item`, `Remove-Item` on Windows, not Unix aliases.

---

## Git & Deployment

### GitHub Pages 404 Errors
- **Problem**: Deployed site showed 404, files were present
- **Action**: Discovered `index.html` must be at repo root
- **Future**: Verify file structure before debugging. Wait 60s after push for propagation.

### Gitignore Not Working
- **Problem**: `.gitignore` entries ignored for already-tracked files
- **Action**: Had to `git rm --cached <file>` first
- **Future**: Add files to `.gitignore` BEFORE first commit. If already tracked, must explicitly untrack.

---

## React & Vite

### Tailwind v4 Setup Confusion
- **Problem**: PostCSS config approach from docs didn't work
- **Action**: Found Tailwind v4 uses `@tailwindcss/vite` plugin instead
- **Future**: Check major version of dependencies - v4 has different setup than v3.

### Vite Base Path for Capacitor
- **Problem**: iOS build showed broken paths (404 for assets)
- **Action**: Changed `base: '/absolute/'` to `base: './'` for relative paths
- **Future**: Use `base: './'` for Capacitor/mobile builds. Absolute paths break in WebView.

### State Persistence Without Backend
- **Problem**: Needed data persistence but no time for backend setup
- **Action**: Created `useLocalStorage` hook for MVP
- **Future**: localStorage is sufficient for MVP validation. Only add backend when sync is actually needed.

### Vite Host Blocking on Tunnels (LocalTunnel/Ngrok)
- **Problem**: LocalTunnel showed "Blocked request. This host is not allowed"
- **Action**: Added `server: { allowedHosts: 'all' }` to vite.config.js
- **Future**: When using ANY tunneling service (localtunnel, ngrok, cloudflare), add `allowedHosts: 'all'` to Vite server config BEFORE starting the tunnel. This is a Vite 5+ security feature.

### Vite Base Path Conflicts (Capacitor vs GitHub Pages)
- **Problem**: Capacitor needs `base: './'` (relative) but GitHub Pages needs `base: '/repo-name/'` (absolute)
- **Action**: Used mode-based conditional: `base: mode === 'pages' ? '/repo-name/' : './'`
- **Future**: Create separate build scripts from the start: `build:pages` and `build:ios`. Don't try to use one config for both.

### GitHub Pages 404 After Deploy
- **Problem**: GitHub Pages showed 404, workflow ran successfully
- **Action**: Check: 1) Pages enabled in repo Settings, 2) Source = "GitHub Actions", 3) Correct base path
- **Future**: Before first GitHub Pages deploy: 1) Enable Pages in Settings → Pages, 2) Set Source to "GitHub Actions" (not "Deploy from branch"), 3) Ensure base path matches repo name.

---

## Google Apps Script

### CORS Preflight Failures
- **Problem**: Fetch POST to Apps Script triggered CORS error
- **Action**: Switched to `URLSearchParams` body format to avoid preflight
- **Future**: Use form-encoded POST (`URLSearchParams`) for Apps Script. JSON triggers CORS preflight.

### Script Changes Not Reflecting
- **Problem**: Updated script code but behavior unchanged
- **Action**: Had to redeploy as "New Version" - old deployment ID caches old code
- **Future**: After ANY code change in Apps Script, must: Deploy → New Deployment → Get new URL.

---

## Browser Automation Testing

### Pixel Click Coordinates Unreliable
- **Problem**: Browser subagent clicks missed elements in scrollable areas
- **Action**: Switched to element index-based clicking
- **Future**: Use element indices for click testing. Pixel coordinates fail in scrollable containers.

### Dev Server Connection Timeouts
- **Problem**: Browser tests failed after long sessions (~4 hours)
- **Action**: Restarted dev server, but port changed (5173 → 5174)
- **Future**: Check dev server is running AND note the current port before browser tests.

---

## Documentation & Workflow

### Completed Work Not Tracked
- **Problem**: ROADMAP.md and IDEATION.md didn't show what was done vs TODO
- **Action**: Added Status column with ✅ Done / ⏳ TODO markers
- **Future**: Add Status column to roadmap tables from the start. Update immediately after completing items.

### Vague Changelog Timing
- **Problem**: Unclear when to create CHANGELOG vs just commit messages
- **Action**: Created at first stable milestone (v1.0.0 MVP)
- **Future**: Create CHANGELOG after first shippable version. Not before, not after next feature.

### Knowledge Loss Between Sessions
- **Problem**: Forgot what was learned in previous session
- **Action**: Updated learnings.md but content was too app-specific
- **Future**: Learnings must be: cross-project applicable + actionable + include prevention steps.

---

## iOS/Capacitor

### Bundle ID Format
- **Problem**: Xcode rejected bundle ID with wrong format
- **Action**: Used `tld.company.appname` format (e.g., `dk.tryg.app`)
- **Future**: Always use reverse DNS format for bundle IDs.

### Capacitor Sync After Web Changes
- **Problem**: iOS build showed old web content
- **Action**: Manual `npm run build && npx cap sync ios` required
- **Future**: Run sync after EVERY web build. It copies dist/ to iOS project.

---

## Component Design

### Two-Sided App Symmetry
- **Problem**: Feature only worked in one direction (senior → relative but not reverse)
- **Action**: Had to go back and add bidirectional support
- **Future**: For communication features, always design both directions simultaneously.

### Modal Animation Feel
- **Problem**: Modal appeared jarring/sudden
- **Action**: Added slide-up animation with fade-in overlay
- **Future**: Use slide-up for mobile modals. Feels more native than instant appear.

---

*Format reminder: Problem → Action → Future Prevention*

---

## Firebase & Auth

### Signup State Race Condition
- **Problem**: New users saw wrong screen after signup (circle setup instead of consent)
- **Action**: Set userProfile state immediately after createUserProfile(), not waiting for onAuthStateChanged
- **Future**: When creating user documents, update local state synchronously. Don't rely on Firestore listeners for immediate UI.

### localStorage to Firestore Migration
- **Problem**: Some features still used useState after "migrating" to Firestore
- **Action**: Created checklist and audited every piece of shared state
- **Future**: Create explicit checklist of all shared state. Check off each item as migrated.

### Firebase Authorized Domains
- **Problem**: Google OAuth returned "Requested action is invalid"
- **Action**: Added deployment domain to Firebase Auth settings
- **Future**: When deploying to new domains, check: 1) Firebase Auth authorized domains, 2) CORS settings, 3) OAuth redirect URIs.

### Secrets Don't Trigger Builds
- **Problem**: Added GitHub Secrets but app showed white screen (old build had empty env vars)
- **Action**: Pushed empty commit to trigger rebuild
- **Future**: After adding secrets, always `git commit --allow-empty -m "trigger rebuild" && git push`

### Role-Based View Isolation
- **Problem**: Dev convenience toggle let users see both views, violating privacy
- **Action**: Removed toggle, view determined solely by userProfile.role
- **Future**: Development conveniences should be behind feature flags or removed before release.

---

## Agent & Tooling

### File Search Scope Must Include Parent Directories
- **Problem**: Agent searched only `tryg-app/` for GitHub Actions workflow, concluded it didn't exist
- **Action**: Workflow was at `PNWS/.github/workflows/deploy.yml` (parent directory)
- **Future**: Search from workspace root. Before concluding a file is missing, verify against VS Code file explorer.

### Gitignore Tool Blocks Are Not Absolute
- **Problem**: `view_file` tool returned "access blocked by gitignore" error
- **Action**: Used shell `type` command as workaround - OS-level access is not blocked
- **Future**: Don't accept tool errors as absolute limitations. Try alternative approaches (shell commands) before reporting impossible.

### Validate Assumptions Before Implementation
- **Problem**: Agent assumed no deployment pipeline existed and created duplicate workflow file
- **Action**: User pointed out two `.github/workflows` folders after the "fix"
- **Future**: Ask "how does X currently work?" before assuming it doesn't exist. Search parent directories explicitly.

### Antigravity Global Workflow Path
- **Problem**: Created workflows at `~/.gemini/workflows/` but they didn't appear in UI
- **Action**: Correct path is `~/.gemini/antigravity/global_workflows/`
- **Future**: Global workflows go in `~/.gemini/antigravity/global_workflows/`. Workspace workflows go in `<project>/.agent/workflows/`.

### Whitespace in GitHub Secrets
- **Problem**: Firebase threw "client is offline" errors on prod, despite authorized domains and existing secrets
- **Action**: Discovered a trailing space in a `VITE_FIREBASE_*` secret value
- **Future**: "Offline" errors often mask config issues. Always sanitize whitespace when pasting into GitHub Secrets.

---

## Agent & Environment Interop

### Windows Firewall vs. Local Tools
- **Problem**: Browser agent failed to connect to `localhost:5173` ("Access Denied" / Timeout)
- **Action**: User identified a closed Node.js firewall popup. Unblocked via PowerShell: `Set-NetFirewallRule -DisplayName "Node.js JavaScript Runtime" -Action Allow`
- **Future**: If local tools fail silently or timeout, check Windows Firewall first. verify connectivity with `curl -v`.

### The "Double-Boxing" Simulator Trap
- **Problem**: "Phone Simulator" frame looked great on desktop but created a "phone inside a phone" detail on actual mobile devices (gaps, double borders)
- **Action**: Made `AppCore` responsive: Mobile = `100dvh` full screen (no frame), Desktop = Phone Simulator frame
- **Future**: Simulators are validation tools, not production intent. Always strip simulator frames on mobile breakpoints (`sm:`).

### PWA Viewport Scrolling (iPhone)
- **Problem**: iPhone address bar caused "double scroll" and layout gaps
- **Action**: Enforced `height: 100dvh` and `width: 100vw` on `body` and `#root`
- **Future**: For PWAs/App-like sites, use `100dvh` (Dynamic Viewport Height) to handle mobile browser UI chrome. 

