# Tryg App - Feature Ideation

A living document for brainstorming features that could make Tryg more valuable.

> **Core Philosophy Shift**: Tryg is not a monitoring tool. It's a **shared family space** where connection flows both ways. The senior is a **host and contributor**, not a data source.

---

## 🌟 Connection-First Features (Priority)

### Bidirectional Visibility ("Mirror Features") ✅ IMPLEMENTED
The key to avoiding surveillance: **reciprocity by default**.

| Senior Sees | Family Sees |
|-------------|-------------|
| "Louise er på arbejde" | "Mor har det godt" |
| "Børnene er kommet hjem fra skole" | "Farmor tog sin morgen medicin" |
| "Emma løb 5km i morges" | "Farmor har gået en tur i haven" |

**Implementation**: ✅ `FamilyStatusCard.jsx` shows relative's status (work, home, traveling, available, busy). Picker in RelativeView, display in SeniorView.

---

### Shared Moments (Not Data)
Replace "health dashboard" with **shared experiences**.

**Photo Exchange**
- **Daily Photo Ritual**: Family sends one photo → Senior sees it as "Dagens Billede" (already built!)
- **Two-Way**: Senior can share photos back (simplified camera UI)
- **Reactions**: Simple emoji reactions (❤️ 😊 👍) on shared content

**Voice Notes** 
- 30-second voice clips instead of text (better for motor issues)
- Grandchildren recording "Godmorgen Farmor!" as morning greeting
- Senior can respond with voice, not typing

**"Jeg tænker på dig" Button** ✅ IMPLEMENTED
- ✅ One-tap "thinking of you" ping (`ThinkingOfYou.jsx`)
- ✅ Visual: Heart animation on recipient's screen
- ✅ Pink toast notification with auto-dismiss
- ✅ Web Audio ping sound for emotional feedback

---

### Weekly Rituals ✅ IMPLEMENTED

**Family Question of the Week**
> "Hvad var det bedste øjeblik denne uge?"

- ✅ Everyone answers (family + senior) via `WeeklyQuestionCard.jsx`
- ✅ Creates shared stories and memories
- ✅ Displayed as a carousel of answers
- ✅ 8 rotating questions based on week number

**Sunday Coffee Chat**
- Scheduled video drop-in time
- "Kafferum" indicator shows who's available
- Low-pressure, can leave anytime

---

### Dignity-Preserving Help Requests ✅ IMPLEMENTED

Instead of: "Alert: Mom needs help"
Reframe as: **Mutual exchange**

| Senior Can Offer | Senior Can Request |
|-----------------|-------------------|
| "Jeg kan hjælpe med at lytte" | "Kan nogen ringe mig i dag?" |
| "Jeg har en god opskrift" | "Hjælp til indkøb denne uge" |
| "Vil gerne høre om jeres dag" | "Følgeskab til lægen" |

**The senior contributes value, not just receives care.**

✅ `HelpExchange.jsx` - Two-way offers/requests with success feedback

---

## 💡 "Dancing at the Wedding" Features

Features that connect health goals to **meaningful life moments**:

### Milestone Celebrations
- "Du har gået 100 ture denne måned! 🎉"
- "Klar til at danse til Emmas bryllup"
- Connect streaks to personal goals, not abstract metrics

### Memory Triggers ✅ IMPLEMENTED
- ✅ "Husker du da...?" via `MemoryTrigger` component
- ✅ Rotating memories every 10 seconds
- ⏳ Photo memories from family shared album (TODO)

### Anticipation Calendar
- Countdown to family events
- "42 dage til Emmas bryllup"
- Daily motivation tied to real moments

---

## 🔒 Anti-Surveillance Design Principles

1. **Notification when viewed**: "Louise så din opdatering" - interaction, not silent watching
2. **Share controls**: "Del kun med nær familie / alle / kun mig"
3. **Temporary sharing**: "Del min placering de næste 2 timer"
4. **Pause mode**: "Gå på pause" - take a break from sharing
5. **Senior initiates**: Most data sharing should be senior-triggered, not automatic

---

## 🏥 Health Tracking Enhancements

### Body Pain Mapping ✅ IMPLEMENTED
When senior clicks "Jeg har ondt" → "Smerter", they can tap WHERE on their body:
- ✅ `BodyPainSelector.jsx` with large touch-friendly grid
- ✅ Regions: Head, Neck, Chest, Arms (L/R), Stomach, Back, Legs (L/R)
- ✅ Stored with timestamp and shown in doctor report
- ⏳ TODO: Visual history ("You've had head pain 3 times this week")

### Pain Severity Scale
- After location, ask "Hvor ondt?" (How much?)
- 3-level pictogram: 🙂 Lidt → 😐 Noget → 😣 Meget
- Avoid clinical 1-10 scales - too complex for seniors

### Symptom Patterns
- Weekly summary: "Du har ofte hovedpine om morgenen"
- Helpful for doctor consultations
- Non-alarming presentation

---

## 🎯 High-Value / Low-Effort (MVP+1)

| Feature | Connection Value | Effort | Status |
|---------|-----------------|--------|--------|
| Two-way status ("Louise er...") | ★★★★★ | 2h | ✅ Done |
| "Tænker på dig" one-tap ping | ★★★★★ | 1h | ✅ Done |
| Voice note sharing | ★★★★☆ | 4h | ⏳ TODO |
| Simple photo sharing from senior | ★★★★☆ | 3h | ⏳ TODO |
| Emoji reactions on photos | ★★★★☆ | 2h | ⏳ TODO |

---

## 📚 Research References

- **Reciprocity in eldercare apps**: Bidirectional features reduce surveillance perception
- **Shared activities > monitoring**: Connection comes from doing things together
- **Agency and control**: Strong privacy controls build trust
- **Voice-first**: Better for motor/vision issues and feels more personal
- **Participatory design**: Co-design with actual seniors

Sources: JMIR Formative Research, ACM CHI, PMC studies on technology for reducing elderly loneliness

---

*Last updated: 2025-12-11*
