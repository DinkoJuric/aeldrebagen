---
description: Learnings from past projects to apply in future work
---

# Cross-Project Learnings

## Windows/PowerShell
- Use `;` to chain commands, NOT `&&` (Bash syntax)
- Use `Move-Item` instead of `mv` for file operations

## GitHub Pages
- `index.html` MUST be at repository root (not in subfolder)
- 404 errors usually mean file structure issue
- Wait 60s after push for changes to propagate

## Google Apps Script (Sheets API)
- Use `URLSearchParams` for form-encoded POST (avoids CORS preflight)
- Always `decodeURIComponent()` on received form data
- Must redeploy as "New Version" after code changes (old ID = old code)
- User must click "Advanced" → "Go to unsafe" for personal scripts

## User Communication
- When providing code snippets, warn not to copy markdown formatting (` ```javascript`)
- For IDs/keys, explicitly show "copy ONLY this part: `ABC123`"
- Test APIs directly in browser before debugging client code

## Git Workflow
- Commit frequently with descriptive messages
- Push after every significant change
- `.gitignore` entries take effect immediately if file not already tracked

## React + Vite Development
- Use `npx -y create-vite@latest` for non-interactive project scaffolding
- For Tailwind v4+, use `@tailwindcss/vite` plugin instead of PostCSS config
- `useLocalStorage` custom hook enables simple state persistence without backend
- GitHub Actions workflow can deploy Vite apps to Pages with `base` path config

## Product & UX Insights
- **Changelog timing**: Create at first stable milestone (MVP), not after
- **Ideation docs**: Keep a running list of ideas - prevents scope creep by capturing "later" features
- **Two-sided apps**: Design both user types simultaneously to ensure symmetry (e.g., what senior sees vs. what relative sees)
- **Behavioral hooks**: Small rewards (photos, streaks) dramatically increase engagement for habit-forming apps
- **Offline-first**: localStorage MVP proves value before investing in backend sync

## Component Design Patterns
- Modal as slide-up sheet on mobile feels native and less jarring
- Large touch targets (48px+) are essential for accessibility
- Period-based task grouping reduces cognitive load for seniors (Habit Stacking)
- Pictogram-based inputs work better than text for quick selections
