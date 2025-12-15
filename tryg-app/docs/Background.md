# App Name: Tryg (Danish for "Safe" / "Secure")

## Core Concept
A dual-interface daily tracker designed for the Danish market that connects elderly parents with their adult children. It replaces invasive surveillance with a "peace of mind" check-in system, focusing on medication adherence, hydration, and wellbeing.

## Target Audience
*   **The Senior (User A):** 70+ years old. Likely has reduced vision, motor control issues (tremors), or mild cognitive decline. Wants autonomy but needs gentle nudges.
*   **The Relative (User B):** Adult child (40-50s). Wants to know their parent is okay without calling them 5 times a day. Needs quick "at-a-glance" reassurance.

## Current Features & Functionality

### 1. Senior View (Min Hverdag)
*   **Design Language:** High contrast, massive touch targets, simplified text, calming colors (Teal/Stone).
*   **The "Check-in":** A large button to confirm "I'm okay" or "I'm in pain."
*   **Contextual Tasks:** Medication and activities are grouped by time of day (Morning, Lunch, Afternoon) to reduce cognitive load.
*   **Symptom Tracker:** Simple pictogram-based interface to log pain, dizziness, nausea, or fever.
*   **Intrinsic Rewards:** Completing the morning routine unlocks a "Photo of the Day" (e.g., a grandchild) to motivate adherence.
*   **Emergency Contact:** A prominent (but not scary) button to call their primary relative.

### 2. Relative View (Pårørende Dashboard)
*   **Peace of Mind Card:** Instantly shows parent's last active time, battery level, and overall status ("Alt er vel").
*   **Reciprocity Status:** Allows the relative to set their own status (e.g., "Louise is at work"), visible to the parent, making the app feel like a two-way connection rather than surveillance.
*   **Remote Management:** Relatives can add appointments or reminders that appear instantly on the senior's screen.
*   **Health Report:** Aggregates data (medication adherence + symptom logs) into a simple view for doctor consultations.

## Design Context 
*   **Aesthetic Goal:** Needs to feel "Danish" — functional, minimalistic, warm, and safe. Avoid "medical" or "clinical" sterile looks.
*   **UX Challenge:** Balancing "ease of use" for the senior with "detailed data" for the relative.
*   **Behavioral Hook:** The app currently uses "Habit Stacking" (grouping tasks) and "Variable Rewards" (photo unlock) to drive engagement.

## Technical Context
*   Built in **React** using **Tailwind CSS**.
*   Uses **Lucide React** for iconography.
*   Uses **Lucide React** for iconography.
*   **Architecture:** Multi-user PWA with Firebase Backend (Auth, Firestore, Storage).


---

## App Pitches

### 1-Sentence Pitch

> *"Tryg gives adult children daily peace of mind that their aging parent is okay — without surveillance, micromanagement, or awkward daily phone calls."*

### 3-Sentence Pitch

> *"Tryg is a Danish elder care app that replaces the 'daily worry call' with a simple 'mor har det godt' check-in system. Unlike GPS trackers that treat seniors like children, Tryg is bidirectional — parents can see what their adult kids are up to too, making it feel like connection, not surveillance. It bundles medication reminders, symptom tracking, and family status into one calm interface designed for 70+ year olds with tremors, reduced vision, and Danish sensibilities."*

---

## The Porch Light Metaphor

> *"Tryg is like leaving the porch light on for your parents — a quiet signal that says 'I'm thinking of you' without the intrusion of knocking on their door five times a day.*
> 
> *Other solutions (Life360, medical alert buttons) treat elders like packages to track or emergencies waiting to happen. Tryg treats them like autonomous adults who just need a simple way to say 'alt er vel' — and for their family to exhale."*

### Why the Metaphor Works

| Element | Meaning |
|---------|---------|
| **Porch light** | Passive, non-intrusive, warm, familiar |
| **Knocking 5 times** | The current reality of anxious adult children calling repeatedly |
| **Package tracking** | What competitors feel like (surveillance) |
| **"Alt er vel"** | The Danish concept of everything being well — culturally resonant |

---

## Tab Differentiation Strategy (RelativeView)

The two tabs serve distinct emotional needs:

| Tab | Focus | Content |
|-----|-------|---------|
| **Min Dag** | 💕 Connection | Senior status w/ gates (incl. meds %, symptoms), family presence, connection history ("Du sendte knus") |
| **Familie** | 🤝 Koordinering | Your status, HelpExchange, task list, health report |

### Rationale from Strategy Docs

- *"Make peace of mind summary FIRST thing relatives see"*
- *"Sell peace of mind, not task management"*
- *"Your real customer is the adult child... build for their anxiety"*

**The differentiation:** Min Dag = emotional connection, Familie = practical coordination.

---

## Behavioral Science Framework

These principles guide ALL design decisions in Tryg:

| Principle | Application |
|-----------|-------------|
| **Variable Reward** | Match celebrations, connection events, surprise delight moments |
| **Social Proof** | Seeing other family members active normalizes engagement |
| **Reciprocity** | Connection history shows bidirectional relationship ("Du sendte knus") |
| **Progressive Disclosure** | Summary first (senior card), details on tap (symptoms) |
| **Chunking** | Group related info (Senior card = status + gates + symptoms) |
| **Ambient Awareness** | "Familien Nu" creates presence without surveillance feel |
| **Commitment & Consistency** | Publicly visible status creates gentle accountability |

### The Porch Light Insight

> *"Tryg is like leaving the porch light on for your parents — a quiet signal that says 'I'm thinking of you' without the intrusion of knocking on their door five times a day."*

The app creates a **sense of presence** without requiring action. Unlike Life360 (GPS surveillance) or medical alert systems (emergency-focused), Tryg establishes a warm **ambient connection** that feels like family, not monitoring.

