# Tryg App Development Walkthrough

> Last updated: 2025-12-11

## What Was Built

**Tryg** is a dual-interface senior care app connecting elderly parents with adult children:

- **Senior View**: Task tracking, symptom logging, reward system, emergency contact
- **Relative View**: Status monitoring, remote reminders, health reports

**Live Demo:** https://dinkojuric.github.io/aeldrebagen/

---

## Project Structure

```
tryg-app/
├── src/
│   ├── components/          # UI components
│   │   ├── ui/Button.jsx    # Reusable button variants
│   │   ├── ui/Modal.jsx     # Slide-up modal
│   │   ├── SeniorView.jsx   # Elder interface
│   │   ├── RelativeView.jsx # Family dashboard
│   │   ├── BodyPainSelector.jsx
│   │   ├── FamilyStatusCard.jsx
│   │   ├── HelpExchange.jsx
│   │   ├── ThinkingOfYou.jsx
│   │   ├── WeeklyQuestion.jsx
│   │   └── TabNavigation.jsx
│   ├── hooks/useLocalStorage.js # State persistence
│   ├── config/features.js   # Feature flags
│   ├── data/constants.js    # Tasks, symptoms, profile
│   ├── utils/sounds.js      # Web Audio feedback
│   ├── App.jsx              # Main controller
│   └── index.css            # Tailwind + animations
├── docs/                    # Project documentation
├── vite.config.js           # Build config
└── .github/workflows/       # Auto-deploy on push
```

---

## Version History

### v1.4.0 - Firebase Multi-User Backend 🔥
**Real multi-user sync with authentication and care circles**

| File | Purpose |
|------|---------|
| `src/config/firebase.js` | Config + offline persistence |
| `src/hooks/useAuth.js` | Email/Google auth, role selection |
| `src/hooks/useCareCircle.js` | Create/join circles via invite codes |
| `src/hooks/useTasks.js` | Real-time task sync |
| `src/hooks/useSymptoms.js` | Real-time symptom sync |
| `src/hooks/useSettings.js` | Family status sync |
| `src/hooks/useWeeklyQuestions.js` | Weekly answers sync |
| `src/hooks/usePings.js` | "Thinking of you" ping sync |
| `src/components/AuthScreen.jsx` | Login/signup UI (Danish) |
| `src/components/CircleSetup.jsx` | Create/join circle UI |
| `src/components/ConsentModal.jsx` | GDPR consent flow |
| `src/components/PrivacySettings.jsx` | Data export/deletion |
| `src/AppWithAuth.jsx` | Auth flow wrapper |
| `src/AppCore.jsx` | Main app with Firebase hooks |

Toggle with `useFirebase: true/false` in features.js.

### v1.4.1 - Bug Fixes from Testing 🐛
**Issues discovered during first real-user testing**

- Removed view toggle (users only see their own role's view)
- Fixed hardcoded "Birthe"/"Louise" → dynamic names from care circle
- Fixed signup flow → consent modal shows correctly after registration
- Added circle members list in settings panel
- Real-time sync for weekly questions and thinking-of-you pings

> See [firebase_learnings.md](./firebase_learnings.md) for detailed lessons learned

### v1.3.0 - Emotional Connection
- Weekly question ritual
- Memory triggers
- Help exchange (dignity-preserving)
- Tabbed layout (experimental)
- New symptoms: sleep, night sweats, appetite

### v1.2.0 - Two-Way Connection
- Family status card (bidirectional visibility)
- "Thinking of you" ping button
- Body pain location selector

### v1.1.0 - Stability
- Error boundary with Danish UI
- Web Audio completion sounds
- Global error handlers

### v1.0.0 - MVP
- Task completion with checkboxes
- Symptom tracker
- Reward card system
- Emergency contact
- localStorage persistence

---

## Key Design Decisions

1. **localStorage over backend**: Enables offline-first MVP without server costs
2. **Vite over CRA**: Faster builds, simpler config
3. **Tailwind v4**: Modern CSS-first approach
4. **Feature flags**: Toggle features without code removal
5. **Bidirectional design**: Senior sees family status too (anti-surveillance)

---

## Feature Flags

Toggle in `src/config/features.js`:

```javascript
tabbedLayout: true,       // Tab vs scroll layout
weeklyQuestion: true,     // Question of the week
thinkingOfYou: true,      // Ping button
helpExchange: true,       // Mutual help offers
demoNotification: false,  // Demo water reminder
```

---

## Tested Features

| Feature | Status |
|---------|--------|
| Task completion | ✅ Working |
| Symptom logging | ✅ Working |
| Body pain selector | ✅ Working |
| Reward card unlock | ✅ Working |
| View toggle | ✅ Working |
| Family status sync | ✅ Working |
| Thinking of you ping | ✅ Working |
| Weekly questions | ✅ Working |
| localStorage persistence | ✅ Working |

---

## Deployment

- **GitHub Pages**: Auto-deploys on push to `main`
- **URL**: https://dinkojuric.github.io/aeldrebagen/
- **iOS**: Capacitor wrapper ready (see IOS_DEPLOYMENT.md)

---

## Next Steps

See `docs/competitor_analysis.md` for business strategy and `implementation_plan.md` for Firebase multi-user backend.
