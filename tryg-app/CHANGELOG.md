# Tryg App Changelog

All notable changes to this project will be documented in this file.

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

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes to user experience or data model
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, performance improvements
