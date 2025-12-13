# Project Context

Last updated: 2025-12-13

## Key Patterns

- **State Management**: Firebase hooks with `onSnapshot` for real-time sync
- **Routing**: Role-based views (`SeniorView` vs `RelativeView`) determined by `userProfile.role`
- **Data Flow**: Real-time sync via Firestore listeners in custom hooks (`useAuth`, `useSettings`, `useTasks`, etc.)
- **Feature Flags**: Toggle in `src/config/features.js`
- **Error Handling**: Whitelist sanitization for Firestore data (prevents Symbol property serialization errors)
- **Responsive Strategy**: Mobile-first full width (`100dvh`) vs Desktop Phone Simulator (`AppCore.jsx`)

## Key Files

| File | Purpose |
|------|---------|
| `src/AppCore.jsx` | Main app entry, initializes all Firebase hooks |
| `src/AppWithAuth.jsx` | Authentication wrapper, handles circle setup flow |
| `src/hooks/useAuth.js` | Authentication state and user profile |
| `src/hooks/useSettings.js` | Real-time settings sync (family status) |
| `src/hooks/useTasks.js` | Task management with Firestore |
| `src/hooks/useCareCircle.js` | Care circle membership queries |
| `src/components/SeniorView.jsx` | Elder-facing interface |
| `src/components/RelativeView.jsx` | Family dashboard |
| `src/config/firebase.js` | Firebase initialization |

## Active Issues

- [ ] Production deployment shows stale content until hard refresh
- [ ] Production deployment shows stale content until hard refresh

## Recent Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-12 | Whitelist sanitization in hooks | Symbol properties from Lucide icons broke Firestore serialization |
| 2025-12-12 | Propagate authError to AppWithAuth | Prevents wrong setup flow when offline |
| 2025-12-12 | Global workflows in `~/.gemini/antigravity/global_workflows/` | Correct Antigravity path for cross-project workflows |
| 2025-12-13 | Responsive Phone Simulator | Remove simulator frame on mobile (`sm:` breakpoint) for native feeling |
| 2025-12-13 | Auth/Profile Loading Guard | Wait for `userProfile` before rendering main app to prevent `RelativeView` flash |
| 2025-12-13 | RelativeView visual parity | Unified `stone-*` color scheme across both views, consistent `rounded-b-3xl` headers |
| 2025-12-13 | Test user script | Created `scripts/create-test-user.mjs` for E2E testing without OAuth |

---

## Test Credentials

For automated testing and development:

| Role | Email | Password | Circle |
|------|-------|----------|--------|
| Relative | `louise.relative@test.com` | `Test1234!` | 6C9Y3M |

> **Note**: These credentials work on localhost and production. Use for testing RelativeView and cross-role sync scenarios.

---

## Color System

| Element | Senior (teal) | Relative (indigo) | Neutral |
|---------|---------------|-------------------|---------|
| Primary accent | `teal-600` | `indigo-600` | - |
| Light background | `teal-50` | `indigo-50` | `stone-50` |
| Avatar background | `teal-100` | `indigo-100` | `stone-200` |
| Text | `teal-700` | `indigo-700` | `stone-700` |
