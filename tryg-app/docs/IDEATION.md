# Tryg App - Feature Ideation

A living document for brainstorming features that could make Tryg more valuable.

> **Core Philosophy Shift**: Tryg is not a monitoring tool. It's a **shared family space** where connection flows both ways. The senior is a **host and contributor**, not a data source.

---

## 📖 Table of Contents
1. [The SOSU Bridge](#high-priority-the-sosu-bridge)
2. [Specialized Onboarding](#specialized-onboarding--connection-setup)
3. [Connection & Shared Experiences](#connection--shared-experiences)
4. [Health & Well-being](#health--well-being-dignity-first)
5. [Motivation & Meaningful Moments](#motivation--meaningful-moments)
6. [Development Roadmap (MVP+)](#development-roadmap-mvp)
7. [Anti-Surveillance Principles](#anti-surveillance-design-principles)
8. [Research References](#research-references)

---

## 🦄 High-Priority: The "SOSU Bridge"
The biggest friction in Danish care is the lack of sync between the Senior, the Family, and the Municipality (Hjemmeplejen).

### Guest View for SOSU Workers
A QR Code on the fridge allows SOSU workers to access a read-only web view (no app install) to see and contribute to the daily flow.
- **Family Status**: "Daughter picked up meds at 10:00."
- **Communication**: "Please remind Mor to drink water."
- **Value**: Turns Tryg into the central communication hub for the entire care ecosystem.

### The Insight 
In Denmark, care is a triangle: The Senior, The Family, and the Municipality (Hjemmeplejen/SOSU). The biggest friction is the lack of sync. 
The daughter calls: "Did the home nurse give the meds?" 
The nurse wonders: "Did the daughter make lunch?" 
This Feature: A "Guest View" specifically for SOSU workers.

### Why it's works 
It turns Tryg into the central communication hub for the entire care ecosystem, not just the family. It solves a massive pain point in the Danish welfare model

---

## 🚀 Specialized Onboarding & Connection Setup
To support 2-3 families and more complex circles, the onboarding needs to be more than just a code.
- **Connection Rituals**: Users choose how they are connected to each other and the Senior explicitly (e.g., "Grandchild", "Son-in-law").
- **Local Group Documents**: Instead of one flat list, relatives could maintain "Sub-group" documents for their specific branch of the family tree.
- **In-Law Visibility**: Explicitly adding "X-in-law" relations to ensure everyone feels included in the "Livstræet".

---

## 🌟 Connection & Shared Experiences

### Photo Exchange & Reactions
Move beyond simple viewing to active engagement.
- **Two-Way Sharing**: Simplified camera UI for seniors to share photos back to the family.
- **Reactions**: Simple emoji reactions (❤️ 😊 👍) on shared content to acknowledge receipt and emotion.
- **Photo Memories**: Integrate photos from the family shared album into the `MemoryTrigger` component.

### Sunday Coffee Chat
- **Kafferum**: A scheduled video drop-in indicator showing who is currently available for a chat.
- **Low Pressure**: Designed for casual presence rather than a formal "call."

---

## 🏥 Health & Well-being (Dignity-First)

### Pain & Symptom Tracking
Building on the existing pain mapping to provide clinical value without alarmism.
- **Pain Severity Scale**: A 3-level pictogram (🙂 Lidt → 😐 Noget → 😣 Meget) following the location selection.
- **Visual History**: A summary of pain patterns (e.g., "You've had head pain 3 times this week") to assist in doctor consultations.
- **Symptom Patterns**: Automated insights like "Du har ofte hovedpine om morgenen."

---

## 💡 Motivation & Meaningful Moments

### Milestone Celebrations
Connect health data to life events to provide purpose.
- **Personal Goals**: "Du har gået 100 ture denne måned! 🎉"
- **Event Readiness**: "Klar til at danse til Emmas bryllup."

### Anticipation Calendar
- **Countdowns**: Visual countdowns to family events (e.g., "42 dage til Emmas bryllup").
- **Daily Motivation**: Tying daily activity to these upcoming real-world moments.

---

## 🎯 Development Roadmap (MVP+)

| Feature | Connection Value | Effort | Priority |
|---------|-----------------|--------|----------|
| SOSU Bridge (QR Web View) | ★★★★★ | High | High |
| Voice Note Sharing | ★★★★☆ | Med | ✅ Done (Livshistorier) |
| Two-way Photo Sharing | ★★★★☆ | Med | Med | // Postpone for now 
| Emoji Reactions | ★★★★☆ | Low | Med |
| Pain Severity/History | ★★★☆☆ | Med | Low |

---

## 🔒 Anti-Surveillance Design Principles

1. **Notification when viewed**: "Louise så din opdatering" - interaction, not silent watching.
2. **Share controls**: Granular privacy (Family / Everyone / Only Me).
3. **Temporary sharing**: Time-boxed location sharing (e.g., "Next 2 hours").
4. **Pause mode**: Ability for the senior to "Go off the grid" easily.
5. **Senior initiates**: Default to senior-triggered data sharing.

---

## 📚 Research References
- **Reciprocity in eldercare apps**: Bidirectional features reduce surveillance perception.
- **Shared activities > monitoring**: Connection comes from doing things together.
- **Agency and control**: Strong privacy controls build trust.
- **Voice-first**: Better for motor/vision issues and feels more personal.

*Last updated: 2025-12-11*
