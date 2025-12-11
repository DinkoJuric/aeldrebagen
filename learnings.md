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

## Capacitor / iOS Deployment
- Use `base: './'` in Vite for Capacitor (not absolute paths)
- Run `npm run build && npx cap sync ios` after every web change
- Xcode project lives in `ios/App/App.xcworkspace`
- Bundle ID format: `tld.company.appname` (e.g., `dk.tryg.app`)

## Behavioral Science for Health Apps
- **Fogg Model**: Behavior = Motivation × Ability × Prompt (reduce friction first)
- **Implementation intentions**: "After X, I will do Y" prompts increase adherence
- **Gentle streaks**: Celebrate consistency without punishing breaks
- **Pre-filled defaults**: Reduce cognitive load for seniors
- **Autonomy-respecting design**: Avoid surveillance feeling, emphasize mutual care

## Senior Accessibility (WCAG 2.1 AA+)
- Minimum 18px font, 7:1 contrast ratio
- Touch targets: 48x48px minimum
- Debounce taps (300ms) to prevent accidental double-activation
- Support iOS Dynamic Type for system font scaling
- Visible focus indicators for all interactive elements

## Connection-First Design (Anti-Surveillance)
- **Reciprocity by default**: If family sees senior's status, senior sees family's status
- **Senior as contributor**: Offer ways to give help, not just receive
- **Shared experiences > monitoring**: Photo exchanges, voice notes, rituals
- **Agency controls**: "Pause" mode, temporary sharing, notification when viewed
- **Meaningful goals**: "Dancing at the wedding" > abstract health metrics

## Development Process Insights
- **Changelog timing**: Create at first stable milestone, update with each feature release
- **Ideation docs**: Capture future ideas immediately to maintain focus on current sprint
- **Mirror components**: For two-sided apps, create matching components (FamilyStatusCard for senior, StatusSelector for relative)
- **LocalStorage for MVP**: Enables quick iteration without backend complexity
- **Browser testing**: Use element indices for reliable click testing, pixel coordinates unreliable in scrollable areas
- **Reflect periodically**: Pause after each feature to update learnings.md - prevents knowledge loss
- **Animation for feedback**: Animated states (heart fill, sparkles) provide better emotional feedback than static changes
- **Toast notifications**: Auto-dismiss with tap-to-dismiss option respects user agency
- **Bidirectional features**: When adding communication features, always implement in both directions (senior→relative AND relative→senior)

