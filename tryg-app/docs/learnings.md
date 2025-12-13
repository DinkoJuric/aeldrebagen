# Learnings & Insights

## Design & UI/UX

### Benevolent Condescension (2025-12-13)
* **Observation**: We initially designed the Senior View as a "wizard" (passive, guided) and the Relative View as a "dashboard" (active, management). While well-intentioned to reduce cognitive load, this created a tiered system where the senior was a subject of care rather than a participant.
* **The Fix**: Aligning the Senior UI to the same "Tag + Picker" dashboard pattern as the Relative.
* **Result**: Seniors feel more empowered ("I'm managing my offers just like you"), and the shared mental model makes the app easier to explain.
* **Rule**: Empower, don't just guide. Seniors can handle "tools" if the UI is clear.

## Technical Patterns

### Config-Driven Extensibility (2025-12-13)
* **Problem**: Hardcoding match logic (Offer A matches Request B) in components makes it hard to iterate or add new ideas.
* **Solution**: Moved all match pairs, offers, and requests to `helpExchangeConfig.js`.
* **Benefit**: We can add new match concepts (e.g., "Tech Support") by just editing a JSON array, without touching component application logic.
