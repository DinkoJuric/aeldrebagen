# Tryg UI/UX Design Document: "From Functional to Soulful"

> **Purpose**: Master reference for UI/UX enhancement opportunities.
> **Status**: Living document - update as features are implemented.
> **Last Updated**: 2025-12-18

---

## Design Philosophy

### Core Principles

| Principle | Source Insight | Tryg Application |
|-----------|----------------|------------------|
| **Hygge First** | Danish cozy warmth through muted colors, natural textures, inviting shapes | Warm teal/stone palette, rounded corners, ambient presence |
| **Passive Peace of Mind** | Life360 won by being passive; Calm succeeds with nature scenes | "Alt er vel" status should feel like a gentle exhale |
| **Micro-Interaction Delight** | Small animations release dopamine, build emotional bonds | Celebrate task completion, connection moments |
| **Accessibility as Care** | 44x44px touch targets, 7:1 contrast, 18px+ fonts | Show respect through usability |
| **Bidirectional Connection** | Family apps thrive on reciprocity, not surveillance | Core to Tryg philosophy - amplify it |

---

## Color Palette (Hygge-Inspired)

```css
:root {
  /* Primary - Warm Teal (not cold) */
  --color-primary: hsl(174, 55%, 38%);
  --color-primary-light: hsl(174, 50%, 92%);
  
  /* Warm Stone (not gray) */
  --color-stone: hsl(37, 20%, 95%);
  --color-stone-dark: hsl(37, 15%, 45%);
  
  /* Accent - Soft Gold (warmth) */
  --color-accent: hsl(43, 80%, 60%);
  
  /* Success - Soft Green (not harsh) */
  --color-success: hsl(152, 45%, 50%);
  
  /* Alert - Warm Red (not alarming) */
  --color-alert: hsl(8, 65%, 55%);
}
```

---

## Enhancement Backlog

### ✅ Implemented

| # | Enhancement | Date | Notes |
|---|-------------|------|-------|
| 1 | Breathing Pulse Animation on "Alt er vel" Card | 2025-12-18 | `animate-breathe` class on calm status |
| 3 | Warm Gradient Header | 2025-12-18 | `header-gradient` utility class |
| 5 | Rounded Corners (16px) | 2025-12-18 | CSS var `--radius-lg: 16px` |
| 6 | Whitespace Breathing | 2025-12-18 | CSS spacing scale vars |
| 9 | Smooth Page Transitions | 2025-12-18 | `tab-content` class with slide animation |
| 12 | Typography Refinement | 2025-12-18 | Font-size scale CSS vars |

---

### 🟢 Quick Wins (1-4 hours each)

| # | Enhancement | Status | Effort |
|---|-------------|--------|--------|
| 2 | Task Completion Celebration Micro-Interaction | ⏳ BACKLOG | 3h |
| 4 | "Connection Glow" on Family Activity | ⏳ BACKLOG | 2h |

---

### 🟡 Medium Effort (4-8 hours each)

| # | Enhancement | Status | Effort |
|---|-------------|--------|--------|
| 7 | Living Background 2.0 - Subtle Ambient Mode | ⏳ BACKLOG | 6h |
| 8 | Morning Greeting Personalization | ⏳ BACKLOG | 4h |
| 10 | "Thinking of You" Heart Animation Upgrade | ⏳ BACKLOG | 4h |
| 11 | Progress Ring Glow States | ⏳ BACKLOG | 4h |

---

### 🔴 Major Undertaking (1-3 days each)

| # | Enhancement | Status | Effort |
|---|-------------|--------|--------|
| 13 | Ambient Status "Dashboard" for Relatives | ⏳ BACKLOG | 12h |
| 14 | Dark Mode / Evening Mode | ⏳ BACKLOG | 8h |
| 15 | Haptic Feedback Integration | ⏳ BACKLOG | 4h |
| 16 | Animated Onboarding Flow | ⏳ BACKLOG | 16h |
| 17 | Family Photo Background Mode | ⏳ BACKLOG | 8h |

---

## Enhancement Details

### 1. Breathing Pulse Animation on "Alt er vel" Card

**What**: Subtle breathing/pulsing animation on peace of mind card when status is good.

**Why**: Calm app's looping visuals create serenity. A gentle pulse feels like a calm heartbeat.

```css
@keyframes gentle-breathe {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50% { transform: scale(1.015); opacity: 1; }
}
.peace-card-ok { animation: gentle-breathe 4s ease-in-out infinite; }
```

---

### 2. Task Completion Celebration

**What**: Satisfying checkmark animation with subtle particle effect on task completion.

**Why**: "Well done" animations create positive reinforcement and dopamine release.

---

### 3. Warm Gradient Header

**What**: Replace flat header with subtle warm gradient (teal → lighter teal).

```css
.app-header {
  background: linear-gradient(180deg, hsl(174 62% 35%) 0%, hsl(174 55% 42%) 100%);
}
```

---

### 4. Connection Glow

**What**: Avatar briefly glows when family member becomes active.

**Why**: Ambient awareness without demanding attention. Hygge "porch light" effect.

---

### 5. Rounded Corners (16px)

**What**: Ensure ALL cards, buttons, modals use consistent 16px+ border-radius.

**Why**: Sharp edges feel clinical. Headspace deliberately avoids them for warmth.

---

### 6. Whitespace Breathing

**What**: Increase padding between sections by 20-30%.

**Why**: Scandinavian design uses generous whitespace for calm.

---

### 9. Smooth Page Transitions

**What**: Subtle fade/slide transitions when switching tabs.

**Why**: Abrupt switches feel jarring. Smooth transitions feel premium.

---

## Research Sources

- Elder care accessibility: WCAG 2.1 AA, Hong Kong Digital Inclusion Guide
- Emotional wellness: Headspace, Calm UI analysis
- Scandinavian design: Hygge principles, Nordic minimalism
- Animation trends: 2024 micro-interaction best practices
- Family apps: Life360, Papa, Medisafe competitive analysis

---

*This document should be updated as enhancements are implemented.*
