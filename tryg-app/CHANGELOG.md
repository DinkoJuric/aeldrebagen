# Tryg App Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-12-11

### 🤝 Two-Way Family Status (Phase 2 - Connection)

**Anti-Surveillance Reciprocity**
- **Senior View**: New `FamilyStatusCard` showing relative's current status
- **Relative View**: Status picker with 5 options (work, home, traveling, available, busy)
- Status persists in localStorage and syncs instantly between views
- Status options: På arbejde, Hjemme, Undervejs, Har tid til en snak, Optaget

> This is the core "mirror feature" - if senior can be monitored, senior can also see what family is up to. Reduces surveillance feeling.

**"Tænker på dig" One-Tap Ping**
- Pink heart button in both views - one tap sends warmth
- Animated heart with "Sendt! ❤️" confirmation
- Pink toast notification appears in recipient's view
- Auto-dismisses after 5 seconds or tap to dismiss
- Uses Web Audio ping sound for emotional feedback

---

## [1.1.0] - 2025-12-11


### 🛡️ Stability & Emotional Feedback (Phase 1)

**Error Handling**
- Added React Error Boundary with Danish fallback UI and retry button
- Global `window.onerror` and `onunhandledrejection` handlers
- Prepared for Sentry integration (TODOs in place)

**Emotional Feedback Sounds**
- Gentle two-note chime on task completion (Web Audio API)
- Celebration arpeggio on "Jeg har det godt" check-in
- "Thinking of you" ping sound for future connection features

---

## [1.0.0] - 2025-12-11


### 🎉 Initial MVP Release

**Senior View (Min Hverdag)**
- Task completion with visual checkboxes and haptic-like feedback
- Period-based task grouping (Morning, Lunch, Afternoon) for cognitive ease
- Symptom tracker with pictogram-based selection (Pain, Dizziness, Nausea, Fever)
- "Reward card" system - completing morning tasks reveals a family photo
- Emergency call button to primary relative
- Dynamic greeting based on time of day
- Localized for Danish (`da-DK`)

**Relative View (Pårørende Dashboard)**
- "Peace of mind" status card with last active time and battery level
- Reciprocity feature - relative's status visible to senior (two-way connection)
- Live symptom alerts with timestamps
- Remote reminder management - add tasks that appear instantly on senior's screen
- 7-day medication adherence chart for doctor consultations
- Symptom log export view

**Technical**
- React 19 + Vite 7 stack
- Tailwind CSS v4 with custom animations
- localStorage persistence for offline-first operation
- GitHub Actions deployment pipeline to GitHub Pages
- Mobile-first responsive design with phone frame simulator
- **Capacitor iOS** wrapper for TestFlight distribution
- Xcode project ready for App Store submission


---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes to user experience or data model
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, performance improvements
