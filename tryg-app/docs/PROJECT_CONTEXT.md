# Project Context

Last updated: 2025-12-13

## Key Patterns

- **State Management**: Firebase hooks with `onSnapshot` for real-time sync
- **Routing**: Role-based views (`SeniorView` vs `RelativeView`) determined by `userProfile.role`
- **Data Flow**: Real-time sync via Firestore listeners in custom hooks (`useAuth`, `useSettings`, `useTasks`, etc.)
- **Feature Flags**: Toggle in `src/config/features.js`
- **Error Handling**: Whitelist sanitization for Firestore data (prevents Symbol property serialization errors)

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
- [ ] Offline error handling shows generic error instead of specific message

## Recent Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-12 | Whitelist sanitization in hooks | Symbol properties from Lucide icons broke Firestore serialization |
| 2025-12-12 | Propagate authError to AppWithAuth | Prevents wrong setup flow when offline |
| 2025-12-12 | Global workflows in `~/.gemini/antigravity/global_workflows/` | Correct Antigravity path for cross-project workflows |
