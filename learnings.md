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
