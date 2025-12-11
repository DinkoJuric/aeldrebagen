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
*   Currently a single-file prototype simulating a mobile experience.
