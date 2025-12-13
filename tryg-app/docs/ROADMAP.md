# From Testable to Loveable: Stability & Delight Roadmap

A prioritized plan to make Tryg robust, accessible, and emotionally resonant.

---

## Phase 1: Stability Foundation (Week 1-2)

### Error Handling & Crash Prevention

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Add React Error Boundary at app root | 🔴 High | 1h | ✅ Done |
| Install `@sentry/react` + `@sentry/capacitor` | 🔴 High | 2h | ⏳ TODO |
| Wrap all Capacitor plugin calls in try/catch | 🟡 Medium | 2h | ⏳ TODO |
| Add global `window.onerror` handler | 🔴 High | 30m | ✅ Done |

**Why**: Seniors can't debug white screens. Every crash = lost trust.

### Offline-First Architecture

| Task | Priority | Effort |
|------|----------|--------|
| Verify localStorage graceful degradation | 🔴 High | 1h |
| Add "offline" visual indicator | 🟡 Medium | 1h |
| Queue state changes when offline, sync on reconnect | 🟢 Low | 4h |

**Why**: Rural Denmark + elderly = unreliable connectivity.

### Testing Infrastructure

| Task | Priority | Effort |
|------|----------|--------|
| Add Vitest for unit tests | 🟡 Medium | 2h |
| Write tests for `useLocalStorage` hook | 🟡 Medium | 1h |
| Add Playwright for E2E browser tests | 🟢 Low | 4h |
| Test on real older iOS device (iPhone 8) | 🔴 High | 2h |

---

## Phase 2: Accessibility Excellence (Week 2-3)

### WCAG 2.1 AA Compliance

| Task | Priority | Effort |
|------|----------|--------|
| Increase all text to minimum 18px (currently some 14px) | 🔴 High | 2h |
| Ensure 7:1 contrast ratio for all text | 🔴 High | 2h |
| Add visible focus indicators for all interactive elements | 🔴 High | 2h |
| Support iOS Dynamic Type (font scaling) | 🟡 Medium | 3h |
| Add `aria-label` to all icon-only buttons | 🔴 High | 1h |

### Motor Accessibility

| Task | Priority | Effort |
|------|----------|--------|
| Minimum 48x48px touch targets (verify all) | 🔴 High | 1h |
| Add 300ms debounce to prevent double-taps | 🟡 Medium | 1h |
| Increase spacing between interactive elements | 🟡 Medium | 1h |

---

## Phase 3: Behavioral Design Enhancements (Week 3-4)

### Habit Formation (Research-Backed)

| Feature | Behavioral Principle | Effort |
|---------|---------------------|--------|
| **5-second check-in**: Single tap "Jeg har det godt" | Reduce friction → Habit stickiness | 1h | ✅ Done |
| **Implementation intentions**: "After breakfast, I will..." prompts | Fogg Behavior Model | 3h |
| **Gentle streaks**: "4 days in a row ✓" (no punishment for breaks) | Intrinsic motivation | 2h |
| **Pre-filled defaults**: Remember last medication dose | Reduce cognitive load | 2h |

### Emotional Design

| Feature | Trust/Safety Principle | Effort | Status |
|---------|----------------------|--------|--------|
| **Success sounds**: Gentle chime on task completion | Positive reinforcement | 1h | ✅ Done |
| **Calm color palette audit**: Remove any anxiety-inducing reds | Emotional safety | 2h | ⏳ TODO |
| **Reassuring micro-copy**: "Alt er godt" instead of clinical language | Dignity preservation | 2h | ✅ Done |
| **Family photo personalization**: Let relatives upload real photos | Emotional connection | 4h | ⏳ TODO |

---

## Phase 4: From Functional to Loveable (Week 4-5)

### Delight Features

| Feature | Why It Creates Love | Effort |
|---------|-------------------|--------|
| **Morning greeting animation**: Gentle sun rise | Warmth, daily ritual | 2h |
| **Weather integration**: "Godt vejr til en gåtur i dag" | Context-aware care | 3h |
| **Voice check-in**: "Hey Tryg, jeg har det godt" | Hands-free for tremors | 8h |
| **Personalized push notifications**: Use senior's name | Personal, not robotic | 2h |
| **Family voice messages**: Grandchild audio clips as rewards | Emotional payoff | 6h |

### Trust Builders

| Feature | Why It Builds Trust | Effort |
|---------|-------------------|--------|
| **Activity history**: "Her er hvad du har taget i dag" | Transparency, memory aid | 3h |
| **Privacy dashboard**: Show what family can see | Autonomy respect | 4h |
| **"Pause" mode**: Hide from family temporarily | Independence | 2h |

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

## Success Metrics

| Metric | Testable (Now) | Loveable (Target) |
|--------|---------------|-------------------|
| Daily active use | 40% | 75%+ |
| Task completion rate | 60% | 85%+ |
| 7-day retention | 50% | 80%+ |
| "Would recommend" (NPS) | 6 | 9+ |
| Crash-free sessions | 95% | 99.5%+ |

---

*This roadmap balances technical robustness with behavioral science insights for elderly-specific engagement.*

---

## Backlog

### Technical Debt
| Task | Priority | Notes |
|------|----------|-------|
| Refactoring | 🟡 Medium | General code cleanup | ✅ Done |
| Test suite update | 🟡 Medium | Ensure tests reflect new Firebase architecture |

### Question of the Week Feature
| Task | Priority | Notes |
|------|----------|-------|
| Investigate storage location | ✅ Done | Stored at `careCircles/{circleId}/weeklyAnswers/` |
| UI space optimization | ✅ Done | Moved to header widget with modal |
| Message reactions | 🟢 Feature | Add ability to react to each other's messages |

### Daily Tasks Feature
| Task | Priority | Notes |
|------|----------|-------|
| Completed tasks UX | ✅ Done | Collapsible section at bottom in both views |

### Design Reflection
| Task | Priority | Notes |
|------|----------|-------|
| Symptom Modal Scroll | ✅ Done | Expanded modal height, moved outside main |
| Bottom Navigation | ✅ Done | Added persistent bottom bar "Min dag / Familie / Ring" |
| Consent Modal | 🟡 Medium | Verify on small screens |
