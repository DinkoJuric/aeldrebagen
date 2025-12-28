# Ideation: Feature & Functionality Onboarding (V2)

## 1. Problem Identification
The current onboarding is a beautiful "Welcome" sequence that sets the emotional tone and vision (The Porch Light). However, it stops short of teaching the user **how to actually navigate the app**. 

*   **Senior Users**: May feel lost after the welcome video. They need to understand the "Big 3": Check-in, Family Presence, and Pings.
*   **Relative Users**: May not discover high-value features like "Remote Task Creation", "Health Trends", or "Mutual Word Games".

## 2. The Mirror Protocol Analysis

| Feature | Senior Needs to Know | Relative Needs to Know |
|---------|----------------------|------------------------|
| **Check-in** | How to press the big button & what "I'm okay" does. | Where to see the "Peace of Mind" summary. |
| **Family Presence** | How to see who is active/available. | Role of setting their own status (Hygge signaling). |
| **Pings (Knus)** | How to receive and send a "hug" back. | How to send a gentle nudge without calling. |
| **Tasks** | Where to see the morning routine. | How to add a reminder remotely. |

## 3. Design Concepts

### Option A: The "Friendly Guide" (Contextual Overlays)
When a user enters a tab for the first time, a dark semi-transparent overlay appears with 1-2 highlighted zones.

#### 💎 Familie Børsen: The Match Engine
For the Relative, we showcase how Tryg turns intention into action:
1.  **Selection**: A family member shares: "Jeg har fundet en god opskrift".
2.  **The Match**: Tryg detects a matching interest (e.g., "Vil gerne lave mad") from another member.
3.  **Active Assistance**: The app **generates a Call-to-Action** (CTA) automatically: "**MATCH FUNDET! Skal vi lave mad sammen?**"
4.  **The Outcome**: One tap converts a passive match into a shared calendar event, removing the mental burden.

### Option B: The "Practice Run" (Simulated Task)
At the end of the `WelcomeVideo`, the app stays in a "Sandbox Mode."
*   **Senior**: "Prøv at sige hej til Louise!" (User taps Ping). Louise (bot) responds immediately. "Det virker! 🎉"
*   **Relative**: "Prøv at indstille din status." (User sets status to 'Work'). The app shows how this looks from the Senior's perspective.

### Option C: The "Feature Carousel" (Passive Learning)
A small, dismissible "Did you know?" card at the bottom of the main dashboard.
*   **Pros**: Non-intrusive.
*   **Cons**: Easy to ignore for seniors with cognitive decline.

## 4. Proposed Feature List (MVP V2 Onboarding)

### For the Senior (User A)
1.  **The "Big Green Button" Intro**: Brief highlight on the check-in area.
2.  **The "Family Glow" Intro**: Explain that when a circle glows, someone is "available" for a chat.
3.  **The "Photo Reward" Tease**: Explain that check-ins unlock the daily photo.

### For the Relative (User B)
1.  **Peace of Mind Card**: Explain the "Battery/Status/Last Active" trio.
2.  **Remote Medication**: Short clip showing where to add medication reminders.
3.  **Reciprocity**: "Don't forget to set your status—it makes Mor feel connected."

## 5. Technical Implementation Thoughts
*   **State Tracking**: Store `hasCompletedFeatureTour` in `userProfile` (Firestore).
*   **Trigger**: Use a `useEffect` in `AppCore` that detects when `hasCompletedWelcome` is true but `hasCompletedFeatureTour` is false.
*   **Component**: Create a `FeatureTour` component that uses `framer-motion` for smooth, non-jarring transitions.

---
> [!IMPORTANT]
> **Hygge Rule**: Onboarding must not feel like a "tutorial." It should feel like a family member walking you through their new home. Avoid jargon like "tabs," "navigation," or "dashboard." Use "Værelser" (Rooms) or "Overblik" (Overview).
