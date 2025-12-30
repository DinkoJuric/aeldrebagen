# Feature Backlog & Ideation 💡

> **Status:** Living document for future roadmap items.
> **Philosophy:** Connection over surveillance. Features must enable reciprocity.

## 🦄 High-Priority Concepts

### 1. Spontan Kaffe (The Open Door Strategy)
**Goal:** Reduce loneliness through low-friction connection.
*   **The Problem:** Seniors feel "intrusive" calling for a visit.
*   **The Solution:** A "Kaffekande" toggle.
    *   **Senior Action:** Toggles "Coffee Pot" icon => Status becomes "Coffee Ready".
    *   **Relative View:** Sees "Mor giver kaffe i eftermiddag" card/notification.
    *   **Reaction:** Relative taps "I'm coming" (Senior sees approaching car icon).
    *   **Implementation:** Status modifier in `SeniorView`.

### 2. Livshistorier (The Family Heirloom)
**Goal:** Preserve legacy and replace "medical interrogation" with meaningful conversation.
*   **Concept:** Turn "Weekly Question" into an Audio Biography.
*   **Prompt Examples:** "Hvordan mødte du Far?" instead of "Hvordan har du det?"
*   **Tech:** `AudioRecorder` (already implemented in `WeeklyQuestion`).
*   **Storage:** Permanent "Livsbog" (Life Book) gallery.
*   **Value:** Transforms user from "patient" to "storyteller".

### 3. The SOSU Bridge (Guest View)
**Goal:** Sync the Family and Municipality (Hjemmeplejen).
*   **Concept:** QR Code on the fridge for SOSU workers.
*   **Access:** Read-only web view (no app install).
*   **Data:**
    *   **Status:** "Daughter gave meds at 10:00."
    *   **Input:** "Please remind Mor to drink water."
*   **Strategic Value:** Massive B2B selling point for Municipalities.

---

## 🚀 Connection Features

### Photo Exchange & Reactions
*   **Two-Way Sharing:** Simplified camera UI for seniors.
*   **Reactions:** Simple emojis (❤️ 😊 👍) on shared content.
*   **Memory Integration:** Display photos in `ThinkingOfYou` loop.

### Sunday Coffee Chat (Video)
*   **Indicator:** "Kafferum" video drop-in status.
*   **Vibe:** Low pressure, casual presence (not a formal "Call").

### Milestone Celebrations
*   **Context:** Connect health data to life events.
*   **Examples:**
    *   "Du har gået 100 ture denne måned! 🎉"
    *   "Klar til at danse til Emmas bryllup."

---

## 🏥 Health & Dignity

### Pain & Symptom Context
*   **Severity Scale:** 3-level pictogram (🙂 Lidt → 😐 Noget → 😣 Meget).
*   **Pattern Recognition:** "Du har ofte hovedpine om morgenen." ( Automated insight).

---

## 🔒 Anti-Surveillance Principles
1.  **Notification when viewed:** "Louise så din opdatering" (Reciprocity).
2.  **Share controls:** Granular privacy (Family vs Everyone).
3.  **Pause mode:** Ability to "Go off the grid".
4.  **Senior initiates:** Default to senior-triggered data sharing.

---

## 📚 Research References
*   **Reciprocity:** Bidirectional features reduce surveillance perception.
*   **Shared activities > monitoring:** Connection comes from doing things together.
*   **Voice-first:** Better for motor/vision issues and feels more personal.

*Last Updated: 2025-12-30*
