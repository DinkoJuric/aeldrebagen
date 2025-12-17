# From Testable to Loveable: Stability & Delight Roadmap

A prioritized plan to make Tryg robust, accessible, and emotionally resonant.

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [Phase 1: Stability Foundation](#phase-1-stability-foundation) ✅ COMPLETE
2. [Phase 2: Accessibility Excellence](#phase-2-accessibility-excellence)
3. [Phase 3: Behavioral Design Enhancements](#phase-3-behavioral-design-enhancements)
4. [Phase 4: From Functional to Loveable](#phase-4-from-functional-to-loveable)
5. [Success Metrics](#success-metrics)
6. [Technical Debt Backlog](#-technical-debt-backlog)
7. [Idea Backlog](#-idea-backlog-from-ideation)

---

## Phase 1: Stability Foundation ✅ COMPLETE

All stability foundation work has been completed:

- ✅ React Error Boundary at app root (`ErrorBoundary.jsx`)
- ✅ Sentry integration (`@sentry/react` in `main.jsx`)
- ✅ Global error handlers (`window.onerror`, `window.onunhandledrejection`)
- ✅ Crash loop detection with auto-reset
- ✅ Vitest for unit tests
- ✅ Component architecture refactoring (StatusCard, Help Exchange)

**Remaining (Low Priority):**
| Task | Priority | Effort |
|------|----------|--------|
| Wrap Capacitor plugin calls in try/catch | 🟡 Medium | 2h |
| Add "offline" visual indicator | 🟢 Low | 1h |
| Add Playwright for E2E browser tests | 🟢 Low | 4h |

---

## Phase 2: Accessibility Excellence

### WCAG 2.1 AA Compliance

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Increase all text to minimum 18px | 🔴 High | 2h | ⏳ TODO |
| Ensure 7:1 contrast ratio for all text | 🔴 High | 2h | ⏳ TODO |
| Add visible focus indicators for all interactive elements | 🔴 High | 2h | ⏳ TODO |
| Support iOS Dynamic Type (font scaling) | 🟡 Medium | 3h | ⏳ TODO |
| Add `aria-label` to all icon-only buttons | 🔴 High | 1h | ⏳ TODO |

### Motor Accessibility

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Minimum 48x48px touch targets (verify all) | 🔴 High | 1h | ⏳ TODO |
| Add 300ms debounce to prevent double-taps | 🟡 Medium | 1h | ⏳ TODO |
| Increase spacing between interactive elements | 🟡 Medium | 1h | ⏳ TODO |

---

## Phase 3: Behavioral Design Enhancements

### Habit Formation (Research-Backed)

| Feature | Behavioral Principle | Effort | Status |
|---------|---------------------|--------|--------|
| **5-second check-in** | Reduce friction | 1h | ✅ Done |
| **Implementation intentions** prompts | Fogg Behavior Model | 3h | ⏳ TODO |
| **Gentle streaks**: "4 days in a row ✓" | Intrinsic motivation | 2h | ⏳ TODO |
| **Pre-filled defaults** | Reduce cognitive load | 2h | ⏳ TODO |

### Emotional Design

| Feature | Trust/Safety Principle | Effort | Status |
|---------|----------------------|--------|--------|
| **Success sounds** | Positive reinforcement | 1h | ✅ Done |
| **Calm color palette audit** | Emotional safety | 2h | ⏳ TODO |
| **Reassuring micro-copy** | Dignity preservation | 2h | ✅ Done |
| **Family photo personalization** | Emotional connection | 4h | ⏳ TODO |

---

## Phase 4: From Functional to Loveable

### Delight Features

| Feature | Why It Creates Love | Effort | Status |
|---------|-------------------|--------|--------|
| **Morning greeting animation** | Warmth, daily ritual | 2h | ⏳ TODO |
| **Weather integration** | Context-aware care | 3h | ⏳ TODO |
| **Voice check-in** | Hands-free for tremors | 8h | ⏳ TODO |
| **Personalized push notifications** | Personal, not robotic | 2h | ⏳ TODO |
| **Family voice messages** | Emotional payoff | 6h | ⏳ TODO |

### Trust Builders

| Feature | Why It Builds Trust | Effort | Status |
|---------|-------------------|--------|--------|
| **Activity history** | Transparency, memory aid | 3h | ⏳ TODO |
| **Privacy dashboard** | Autonomy respect | 4h | ⏳ TODO |
| **"Pause" mode** | Independence | 2h | ⏳ TODO |

---

## Success Metrics

| Metric | Testable (Now) | Loveable (Target) |
|--------|---------------|-------------------|
| Daily active use | 40% | 75%+ |
| Task completion rate | 60% | 85%+ |
| 7-day retention | 50% | 80%+ |
| "Would recommend" (NPS) | 6 | 9+ |
| Crash-free sessions | 95% | 99.5%+ |

---

## 🏗️ Technical Debt Backlog

### Completed Technical Debt
- ✅ Feature Folder Refactoring (Organized by feature instead of type)
- ✅ TypeScript Migration (Core hooks converted to `.ts` with strict typing)
- ✅ StatusCard unification (SeniorStatusCard + FamilyStatusCard → StatusCard)
- ✅ Help Exchange prop drilling fix
- ✅ Test suite updates for Firebase architecture
- ✅ Symptom Modal scroll fix
- ✅ Bottom Navigation implementation
- ✅ Question of the Week UI optimization

---

## 💡 Idea Backlog (from Ideation)

**Unscheduled concepts to be reviewed for future phases.**

### Connection Features
- **Voice Notes**: 30s audio clips (better for motor issues)
- **Photo Reactions**: Emoji reactions (❤️ 😊 👍) on shared photos
- **Shared Album**: Senior can upload photos
- **Sunday Coffee Chat**: Scheduled video drop-in time
- **Message reactions**: Add ability to react to each other's messages

### Health Enhancements
- **Pain Severity Scale**: 3-level pictogram (🙂 😐 😣) after location selection
- **Symptom Patterns**: "You often have headaches on Mondays"

### Contextual Empathy
- **Night Watch Mode**: Auto-activate between 10 PM - 6 AM. Soothing dark screen with override button.

### "Dancing at the Wedding" (Milestones)
- **Milestone Celebrations**: "You walked 100 times!"
- **Anticipation Calendar**: "42 days until Emma's wedding"

### Translations
- **Multilingual Support**: Add support for multiple languages (Danish, Bosnian, Turkish)
- **Language Switcher**: Add language switcher in settings

### UI/UX
- **Dark Mode**: Add dark mode support
- **Light Mode**: Add light mode support

### Other Health Data
- **Blood Pressure**: Add blood pressure monitoring, 3 entries per day. Use switcher to view trends in health report.

---

## Research References

**Behavioral Science:**
- Fogg Behavior Model: Motivation × Ability × Prompt
- Implementation Intentions (Gollwitzer, 1999)
- COM-B Model for medication adherence in seniors

**Accessibility:**
- WCAG 2.1 AA guidelines
- Hong Kong Digital Inclusion Elderly Design Guide
- Bentley UX Center: Mobile Experiences for Seniors

**Technical:**
- Sentry for React/Capacitor crash reporting
- Service Workers for offline-first PWA
- React Error Boundaries

---

*This roadmap balances technical robustness with behavioral science insights for elderly-specific engagement.*
