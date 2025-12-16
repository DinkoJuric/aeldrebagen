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

- **Emotional Sensing**: `SeniorStatusCard` shifts atmospheric textures (Calm/Teal, Urgent/Orange) to convey mood instantly
- **Natural Language**: `SmartSummary` generates human-like daily briefings ("Mor har en god dag") instead of raw stats
- **Social Attribution**: "Fra [Name] ❤️" stamps on tasks and help offers to increase warmth
- **State Management**: Firebase hooks with `onSnapshot` for real-time sync
- **Routing**: Role-based views (`SeniorView` vs `RelativeView`) determined by `userProfile.role`
- **Data Flow**: Real-time sync via Firestore listeners in custom hooks (`useAuth`, `useSettings`, `useTasks`, etc.)

## Active Issues

- [ ] Production deployment shows stale content until hard refresh
- [ ] TypeScript types need tightening (currently using @ts-ignore in some UI components)

## Recent Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-16 | **CSS Sprites** for Avatars/Icons | High-res PNG sprites ensure 0 layout shift and instant loading of all family states |
| 2025-12-16 | Dark Overlay on Status Cards | Essential for white text readability against dynamic "Atmospheric" backgrounds |
| 2025-12-16 | Natural Language Summaries | "Briefing" card preferred over raw stats to reduce cognitive load for relatives |
| 2025-12-16 | Self-Healing Crash Loop | Auto-purge localStorage (keeping auth) prevents critical support calls |
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
