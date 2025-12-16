# Project Context

Last updated: 2025-12-16 (v1.8.0)

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [Key Patterns](#key-patterns)
2. [Match Logic Reference (HelpExchange)](#match-logic-reference-helpexchange)
3. [Key Files](#key-files)
4. [Active Issues](#active-issues)
5. [Recent Decisions](#recent-decisions)
6. [Test Credentials](#test-credentials)
7. [Color System](#color-system)


## Key Patterns

- **State Management**: Firebase hooks with `onSnapshot` for real-time sync
- **Routing**: Role-based views (`SeniorView` vs `RelativeView`) determined by `userProfile.role`
- **Data Flow**: Real-time sync via Firestore listeners in custom hooks (`useAuth`, `useSettings`, `useTasks`, etc.)
- **Match System**: `useHelpExchangeMatch` detects alignment (Offer ↔ Request) and triggers `MatchCelebration`
- **Connection History**: `PeceOfMindTab` aggregates completed tasks and symptoms into a "Familiens hjerteslag" feed
- **Bidirectional Presence**: `FamilyPresence` component replciates status tracking for both Seniors (Health) and Relatives (Availability)
- **Inline Gates**: `InlineGatesIndicator` replaces static status text in Senior View for real-time compliance feedback
- **Tab Differentiation**: RelativeView splits emotional reassurance ("Min Dag") from logistical work ("Familie" Tab)
- **UI Consistency**: Senior UI aligns with Relative UI (Tag-based Dashboards) to empower seniors
- **Feature Flags**: Toggle in `src/config/features.js`
- **Error Handling**: Whitelist sanitization for Firestore data (prevents Symbol property serialization errors)
- **Responsive Strategy**: Mobile-first full width (`100dvh`) with `viewport-fit=cover` for iOS safely handling safe areas

## Match Logic Reference (HelpExchange)

We use a "Celebration Match" system when Senior requests align with Relative offers.

**Offer ↔ Request Matches:**
| Offer ID | Request ID | Celebration |
|----------|------------|-------------|
| `cook` | `shop` | 🍽️ "Lav et måltid sammen!" |
| `visit` | `company` | ☕ "Tid til en hyggelig visit!" |
| `drive` | `transport` | 🚗 "Koordinér turen!" |
| `garden` | `outdoor` | 🌿 "Tid i haven sammen!" |
| `tech` | `help-tech` | 💻 "Tech-hjælp!" |

**Status ↔ Request Matches:**
| Status ID | Request ID | Celebration |
|-----------|------------|-------------|
| `available` | `talk` | 📞 "Ring nu - der er tid!" |
| `home` | `visit` | 🏠 "Kom forbi!" |


## Key Files

| File | Purpose |
|------|---------|
| `src/types.js` | **🤖 START HERE** — JSDoc type definitions for Task, Member, etc. |
| `src/AppCore.jsx` | Main app logic & state hub (Real-time data hooks) |
| `src/components/SeniorView.jsx` | Elder-facing interface (Tag-based dashboard) |
| `src/components/RelativeView.jsx` | Family dashboard (Split: PeaceOfMind / Coordination) |
| `src/components/PeaceOfMindTab.jsx` | Relative's "Min Dag" tab (Emotional reassurance) |
| `src/components/CoordinationTab.jsx` | Relative's "Familie" tab (Tasks & HelpExchange) |
| `src/components/HelpExchange.jsx` | Bidirectional help component (Shared design) |
| `src/components/MatchCelebration.jsx` | "Confetti" modal for help matches |
| `src/config/helpExchangeConfig.js` | Central config for Match Pairs, Offers, and Requests |
| `src/hooks/useHelpExchangeMatch.js` | Match detection logic (Senior Request ↔ Relative Offer) |
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
| 2025-12-14 | Per-member status tracking | Each relative has own status in `memberStatuses/{userId}`, replaces shared `familyStatus` |

---

## Test Credentials

For automated testing and development:

| Role | Name | Email | Password | Circle |
|------|------|-------|----------|--------|
| Relative | Fatima | `louise.relative@test.com` | `Test1234!` | 6C9Y3M |

> **Note**: These credentials work on localhost and production. Use for testing RelativeView and cross-role sync scenarios.

---

## Color System

| Element | Senior (teal) | Relative (indigo) | Neutral |
|---------|---------------|-------------------|---------|
| Primary accent | `teal-600` | `indigo-600` | - |
| Light background | `teal-50` | `indigo-50` | `stone-50` |
| Avatar background | `teal-100` | `indigo-100` | `stone-200` |
| Text | `teal-700` | `indigo-700` | `stone-700` |
