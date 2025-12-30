# UX Research & Brand Strategy 🎨

> **The Bible of Tryg's Soul.**
> This document consolidates User Research, Design Philosophy, Branding, and Market Strategy.

---

## 📖 Table of Contents
1. [Messaging & Pitching](#messaging--pitching)
2. [Target Audience & Personas](#target-audience--personas)
3. [Design Philosophy (Hygge)](#design-philosophy-hygge)
4. [Visual Language](#visual-language)
5. [Premium Inspiration (God Tier)](#premium-inspiration-god-tier)
6. [Market Strategy](#market-strategy)

---

## Messaging & Pitching

### The Porch Light Metaphor
> *"Tryg is like leaving the porch light on for your parents — a quiet signal that says 'I'm thinking of you' without the intrusion of knocking on their door five times a day."*

Use this to differentiate from Life360 and medical alert buttons (surveillance vs. connection).

### 1-Sentence Pitch (for elevators)
> *"Tryg gives adult children daily peace of mind that their aging parent is okay — without surveillance, micromanagement, or awkward daily phone calls."*

### 3-Sentence Pitch (for meetings)
> *"Tryg is a Danish elder care app that replaces the 'daily worry call' with a simple 'mor har det godt' check-in system. Unlike GPS trackers that treat seniors like children, Tryg is bidirectional — parents can see what their adult kids are up to too, making it feel like connection, not surveillance. It bundles medication reminders, symptom tracking, and family status into one calm interface designed for 70+ year olds with tremors, reduced vision, and Danish sensibilities."*

---

## Target Audience & Personas

**1. The Senior (Brad, 70+)**
*   **Needs**: Clarity, large touch targets (48px+), high contrast.
*   **Pain Points**: "Techy" interfaces, feeling monitored, loss of agency.
*   **Goal**: To feel dignified and independent, not managed.

**2. The Relative (Fatima, 40s)**
*   **Needs**: Reassurance ("Everything is OK"), efficiency.
*   **Pain Points**: Anxiety about parent's safety, guilt over not calling enough.
*   **Goal**: Peace of mind in <2 seconds.

---

## Design Philosophy (Hygge)

**"From Functional to Soulful"**

*   **Hygge over Clinical:** If it looks like a hospital chart, we failed. It should feel like a living room.
*   **Verbal > Numerical:** "Mor har det godt" > "87% Wellness Score". Numbers induce anxiety; words induce calm.
*   **Bidirectional Connection:** Family apps thrive on reciprocity. If Mom shares data, she should see family status back ("Open Door" philosophy).
*   **Accessibility IS Luxury:** 220ms transitions, 18px+ fonts, and "Tempered Glass" styling create a premium feel that happens to be accessible.

---

## Visual Language

### Palette (Hygge-Inspired)
*   **Primary:** Warm Teal (`hsl(174, 55%, 38%)`) - not cold medical blue.
*   **Base:** Warm Stone (`hsl(37, 20%, 95%)`) - not sterile white.
*   **Accent:** Soft Gold/Ochre (`hsl(43, 80%, 60%)`) - warmth/coffee.
*   **Alert:** Warm Coral (`hsl(8, 65%, 55%)`) - not alarming red.

### Typography
*   **Headings:** `Outfit` (Friendly, geometric, wide).
*   **Body:** `Inter` (High legibility).
*   **Size:** Base 18px (`1.125rem`). Fluid scaling with `clamp()`.

### Animations (The Calm Motion Scale)
*   **Duration:** 220-260ms (Instant feels cheap; slow feels broken).
*   **Easing:** `ease-out` (Natural deceleration).
*   **Micro-interactions:**
    *   *Check-in:* Avatar creates a warm "ripple" (0% -> 100% scale fade).
    *   *Task Complete:* Soft confetti + glow.
    *   *Idle:* "Breathing" orb animation (4000ms cycle).

---

## Premium Inspiration (God Tier)

**1. Nordic Glass (Accessible Glassmorphism)**
*   **Concept:** "Tempered Glass" over a "Living Background".
*   **Technique:** High blur (40px) + low opacity tint + solid content container *inside* the glass to ensure text legibility.
*   **Ref:** Arc Browser sidebar, macOS.

**2. The "B&O Dial" (Tactile Inputs)**
*   **Concept:** Circular interfaces for "tuning" values (Mood, Time).
*   **Why:** Linear lists are administrative; circles represent cycles and are easier for motor control (Fitts's Law).

**3. Kinetic Typography**
*   **Ref:** WealthFront. Numbers "roll" into place rather than flashing. Reduces financial/health anxiety.

---

## Market Strategy

### Key Insights
1.  **B2C Failure Rate:** Pure consumer elder care apps fail (high churn, low willingness to pay).
2.  **The Real Customer:** The Adult Child (B2C) or The Partner (B2B).
3.  **The Play:** B2B2C (Health Plans / Municipalities).

### Revenue Models
1.  **Hybrid (Recommended):**
    *   **Phase 1:** Freemium to validate engagement (100 families).
    *   **Phase 2:** Low-cost subscription (49 DKK) for "Family" features.
    *   **Phase 3:** Enterprise contracts (Kommune/Insurance) using engagement data as leverage.

### The "Anti-Surveillance" Advantage
Competitors like Life360 win on anxiety but lose on dignity. Tryg wins by actively rejecting surveillance:
*   **Reciprocity:** Senior sees Relative's status.
*   **Privacy:** Senior controls the data flow ("Pause Reporting").

---
*Consolidated: 2025-12-30*
