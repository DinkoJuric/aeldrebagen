# Tryg App Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2025-12-14

### 💕 Connection-Focused Design

**Per-Member Status Tracking**
- Each family member now has their own status (replaces shared `familyStatus`)
- New `useMemberStatus` hook with Firestore subcollection `memberStatuses/{userId}`
- Stores: status, displayName, role, updatedAt per member

**FamilyPresence Component** ("Familien Nu")
- New modular component showing all family members' current statuses
- Added to both RelativeView (Familie tab) and SeniorView (Familie tab)
- Bidirectional: Seniors see relatives' statuses, relatives see each other
- Displays role-appropriate labels (Senior: "Har det godt", Relative: "Hjemme")
- Shows update timestamps ("for 2 timer siden")
- Marks current user with "(dig)"

**HelpExchange Attribution Fix**
- Added `createdByName` field to offers/requests
- Match popup and feed now show actual creator names

**Behavioral Science Framework**
- Documented 7 principles in Background.md: Variable Reward, Social Proof, 
  Reciprocity, Progressive Disclosure, Chunking, Ambient Awareness, 
  Commitment & Consistency

**Debug Logging**
- Added `[useMemberStatus]` and `[SeniorView]` debug logs for status tracking

---

## [1.6.0] - 2025-12-13

### 👨‍👩‍👧 Family Features Enhancement

**HelpExchange Reset**
- Added dismiss (×) buttons to active offers/requests
- Seniors can now clear their help selections

**Multiple Relatives Display**
- New `FamilyStatusList` component for SeniorView
- Shows up to 3 relatives, "+N more" for additional
- Isolated care circles support multiple pilot families

**Modular Status Cards**
- Extracted `SeniorStatusCard` component for RelativeView
- Dynamic status badge based on task completion rate
- Consistent design with `FamilyStatusCard`

---

## [1.5.0] - 2025-12-13

### 🎨 RelativeView Visual Parity

**UI Polish**
- Unified `stone-*` color scheme across both SeniorView and RelativeView
- Header now uses `rounded-b-3xl` corners for consistent styling
- Senior status card with teal-themed avatar and larger font
- Task cards with `rounded-xl` icon containers and blue accents
- Completed tasks accordion styled with teal theme

**Bug Fix**
- Fixed "last time online" not reflecting senior's check-in time
- Improved `useCheckIn` hook error handling for new circles

**Developer Experience**
- Added `scripts/create-test-user.mjs` for E2E testing without OAuth
- Test credentials: `louise.relative@test.com` / `Test1234!`
- Documented color system in PROJECT_CONTEXT.md

### 📱 Bottom Navigation + Modal Fixes

**Navigation**
- Replaced `TabNavigation` with `BottomNavigation` for mobile-native feel
- Fixed navigation bar overlapping content

**Modal Improvements**
- Fixed Symptom Modal scroll behavior (content now scrollable)
- Improved modal height constraints (`max-h-[85vh]`)

---

## [1.4.0] - 2025-12-11

### 🔥 Firebase Multi-User Backend

**Authentication**
- Email/password login and signup
- Google OAuth integration
- Role selection: Senior or Pårørende (Relative)
- Danish-localized auth screens

**Care Circles**
- Seniors create a "care circle" on first login
- 6-character invite codes for relatives to join
- Real-time membership sync

**Real-Time Data Sync**
- Tasks sync across all family members instantly
- Symptoms logged to Firestore with timestamps
- Family status (work/home/traveling) syncs in real-time
- Offline-first with IndexedDB persistence

**New Files**
| File | Purpose |
|------|---------|
| `src/config/firebase.js` | Config + offline persistence |
| `src/hooks/useAuth.js` | Auth state management |
| `src/hooks/useCareCircle.js` | Circle create/join logic |
| `src/hooks/useTasks.js` | Task sync |
| `src/hooks/useSymptoms.js` | Symptom sync |
| `src/hooks/useSettings.js` | Settings sync |
| `src/components/AuthScreen.jsx` | Login/signup UI |
| `src/components/CircleSetup.jsx` | Circle onboarding |
| `src/AppWithAuth.jsx` | Auth wrapper |
| `src/AppCore.jsx` | Firebase-connected app |

**Feature Flag**
Toggle `useFirebase: true/false` in `features.js` to switch between:
- `true`: Full Firebase multi-user mode
- `false`: Demo mode with localStorage

---

## [1.3.0] - 2025-12-11

### 🎨 Phase 4: Polish & Accessibility

**Pain Severity Scale**
- 3-level pain scale: Lidt (🙂), Noget (😐), Meget (😣)
- Two-step flow: body location → severity
- Displayed in symptom alerts and doctor report

**Accessibility Enhancements**
- aria-labels for all icon-only buttons
- Button focus indicators (`focus:ring-2`)
- Global `focus-visible` CSS outline
- localStorage graceful degradation check

**Emotional Design**
- Morning sun-pulse animation (amber glow)
- "Alt er vel ✨" reassuring micro-copy in header

---

### 💜 Phase 5: Emotional Connection

**Weekly Question Ritual**
- `WeeklyQuestionCard.jsx` - rotating question based on week number
- 8 questions: "Hvad var det bedste øjeblik denne uge?", etc.
- Shared answers carousel - family and senior answer together
- Displayed in both SeniorView and RelativeView

**Memory Triggers**
- `MemoryTrigger` component - "Husker du da...?"
- Rotating memories every 10 seconds
- Warm amber styling for nostalgic feel

**Dignity-Preserving Help Exchange**
- `HelpExchange.jsx` - senior can offer AND request help
- Offers: "Jeg kan hjælpe med at lytte", recipes, conversation
- Requests: Phone calls, shopping help, doctor escort
- Two-direction flow respects senior's agency
- Success feedback with emoji confirmation

---

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

**Body Pain Location Selector (Phase 3 Health Tracking)**
- Two-step symptom flow: symptom type → body location
- `BodyPainSelector.jsx` with 9 body regions (head, neck, chest, arms, stomach, back, legs)
- Body location stored with symptom log and displayed in doctor report
- Large touch-friendly grid layout for senior accessibility

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
