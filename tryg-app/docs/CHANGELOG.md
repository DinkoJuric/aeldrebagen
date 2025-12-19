# Tryg App Changelog

All notable changes to this project will be documented in this file.



## [Unreleased]

### 🌍 Localization Sweep (2025-12-19)
- Added 29 new translation keys for recurring tasks, privacy modal, and match task titles
- Fully localized `PrivacySettings.tsx` (removed all hardcoded Danish strings)
- Localized period labels in Add Task modal (SeniorView)
- Localized match-generated task titles in both Senior and Relative views
- Verified build and cross-language consistency (DA/TR/BS)

### 🐛 Critical Bug Fixes

**Scroll Fix (2025-12-18)**
- Removed `overflow: hidden` from `body` and `#root` in `index.css`
- Removed `overflow-hidden` from `LivingBackground.tsx` wrapper div
- Changed `min-h-screen` to `h-full` in LivingBackground for proper flex child sizing
- **Root cause**: Multiple nested `overflow-hidden` containers were blocking touch scrolling

---

### 🌍 Codebase Harmonization (Post-Merge Cleanup)

**I18N Sweep**
- Replaced 15 hardcoded Danish strings in `SeniorView.tsx` with `t()` calls
- Added 13 new translation keys to `da.json`, `bs.json`, `tr.json`
- Fixed grammar typo in `bs.json`: "Osedmično" → "Sedmično"

**Word Game Localization**
- Created `wordGameData_bs.ts` (30 Bosnian cultural words)
- Created `wordGameData_tr.ts` (30 Turkish cultural words)
- Updated `useWordGame.ts` to select word list based on `i18n.language`

**Type & Import Cleanup**
- Added missing `onToggleLike` prop to `SeniorViewProps` interface
- Added JSDoc documentation to `CoffeeToggle` and `Spillehjoernet` components

---

### 🌙 Dark Mode / Evening Mode (Circadian Theming)

**Circadian Theme System**
- Created `ThemeContext.tsx` with automatic Morning/Day/Evening/Night detection
- Theme shifts based on local time (6am-11am Morning, 11am-5pm Day, 5pm-9pm Evening, 9pm-6am Night)
- CSS variable orchestration via `--theme-*` tokens in `index.css`
- Manual override in Settings (Auto/Light/Dark) with localStorage persistence

**Component Integration**
- `LivingBackground` now syncs with circadian state for atmospheric color shifts
- `SettingsModal` gained new "Udseende" (Theme) section with Sun/Moon icons
- All `.card-warm` elements respond to theme tokens

**Localization**
- Added theme-related keys to `da.json`, `bs.json`, `tr.json`

---

### 🌈 Ambient Status Dashboard (RelativeView)

**Atmospheric Status Communication**
- Created `AmbientDashboard.tsx` using framer-motion animations
- Dynamic color gradients (Teal=Calm, Amber=Alert, Rose=Attention) communicate wellbeing through color
- Replaced static `StatusCard` in `PeaceOfMindTab` with the new atmospheric dashboard
- "Heartbeat" pulse effect when Senior is active

---

### 🛠️ Documentation & Standards

**Onboarding Workflow**
- Created `.agent/workflows/onboarding.md` to enforce project standards for future agents
- Codified Typography (1.125rem base), Mirror Protocol, and Documentation Rigor

**Docs Updated**
- `ARCHITECTURE.md`: Added ThemeContext to component tree
- `DEPENDENCIES.md`: Added ThemeContext to shared resources
- `LEARNINGS.md`: Documented circadian UI transitions pattern
- `ROADMAP.md`: Created with prioritized backlog

---

### ⚙️ Settings Integration & Navigation Refactoring

**Unified Settings Modal**
- Created `SettingsModal.tsx` - centralized settings with tabbed interface (General / Privacy & Data)
- Integrated `LanguageSwitcher` into modal, removed from individual view headers
- Added family circle management section with invite code display
- Added privacy controls (export data, delete account placeholders)

**Global Navigation Architecture**
- Lifted `activeTab` state from views to `AppCore.tsx` for unified navigation
- Moved `BottomNavigation` rendering to `AppCore.tsx` (no longer duplicated in views)
- Both `SeniorView` and `RelativeView` now receive `activeTab`/`onTabChange` via props
- Fixed `RelativeView` period selector - now includes all 4 time periods (was missing 3)

**PhotoViewerModal Enhancement**
- Added `isOpen` and `onClose` props for proper modal control
- Added close button (X) in modal header

**Component Cleanup**
- Removed redundant `LanguageSwitcher` from `SeniorView` Family tab
- Removed redundant `LanguageSwitcher` from `RelativeView` header
- Removed unused `BottomNavigation` import from `SeniorView`
- Fixed type mismatches in `RelativeView` props (`currentUserId`, `dismissedMatchIds`)

### 🎙️ Livshistorier (Family Heirloom)

**Audio Recording for Weekly Questions**
- Added `AudioRecorder` component with visual feedback, playback, and retry
- Added `useMemories` hook for Firebase Storage uploads and Firestore metadata
- Added `MemoriesGallery` (Livsbog) for relatives to browse recorded memories
- Integrated text/audio toggle into Weekly Question modal
- Added `audioUrl` field to `WeeklyAnswer` type
- Added Livsbog section to CoordinationTab for relatives

**Translation Keys Added (20+ new keys)**
- `text_answer`, `audio_answer`: Answer type labels
- `recording_active`, `stop_recording`, `start_recording`: Recording state
- `livsbog_title`, `no_memories_yet`, `stories`: Gallery UI
- `mic_permission_denied`, `audio_recorder_not_supported`: Error handling

### 🌍 Internationalization (i18n) Expansion

**Symptoms & BodyPainSelector**
- Added `getBodyRegions(t)` factory function for localized body region labels
- Added `getSeverityLevels(t)` factory function for localized severity labels  
- Updated BodyPainSelector UI text to use translation keys
- Added `getSymptomsList(t)` in `constants.ts` for localized symptom names
- Translations added: Danish (da), Bosnian (bs), Turkish (tr)

**Gaming Corner (Spillehjørnet)**
- Added i18n support to `Spillehjoernet.tsx` - title and subtitle now localized
- Full i18n overhaul of `WordGame.tsx` - all game messages, feedback, progress indicators
- 15+ new translation keys for game UI

**Translation Keys Added (45+ new keys)**
- `symptom_*`: Symptom names (pain, dizzy, nausea, fever, sleep, sweats, appetite)
- `body_*`: Body region labels (head, neck, chest, back, stomach, arms, legs)
- `severity_*`: Severity levels (mild, moderate, severe)
- `spillehjoernet_*`: Gaming corner UI
- `word_game_*`: Word game messages and feedback

### ☕ Spontan Kaffe (Open Door Signal)

**Senior-to-Relative Visit Signaling**
- Created `CoffeeToggle.tsx` - One-tap toggle for seniors to signal "coffee is ready"
- Created `CoffeeInviteCard.tsx` - Prominent invitation card for relatives
- Extended `usePings` hook with optional `type` and `message` fields for typed notifications
- Integrated coffee toggle in Senior Family tab, invite card in Relative Peace of Mind tab

**Type System Improvements**
- Added `coffee_ready` and `coffee_coming` to `Member.status` union
- Unified `CareCircleContextValue` interface in `types.ts` (removed duplicate definitions)
- Fixed multiple type mismatches in `SeniorView.tsx` and `PeaceOfMindTab.tsx`

**Translation Keys Added (12 new keys)**
- `coffee_coming_msg`, `status_coffee_ready`, `coffee_give_button`
- `coffee_coming_title`, `coffee_ready_desc`, `coffee_off_desc`
- `coffee_invite_title`, `coffee_invite_sub`, `coffee_invite_accept`
- `peace_morning_missing`, `peace_afternoon_missing`, `peace_all_well`
- Daily briefing keys (`daily_briefing_all_fine`, `daily_briefing_meds_fine`, etc.)


### 💊 Medication Management Enhancements

**Daily Reset Logic**
- Added automatic daily reset for recurring/medication tasks
- On app load, `useTasks` checks if `lastResetDate` differs from today
- If new day detected, all `recurring: true` tasks are unchecked automatically
- `lastResetDate` stored in `careCircles/{circleId}` to prevent duplicate resets

**Recurring Task Support**
- Added "Gentag hver dag" (Repeat daily) checkbox to Add Task modals
- Both SeniorView and RelativeView support creating recurring tasks
- Medication-type tasks default to recurring behavior

**PWA Notifications (Helper)**
- Created `src/utils/notifications.ts` with:
  - `requestNotificationPermission()` - Browser permission request
  - `scheduleNotification(title, time)` - Time-based scheduling
  - `showMedicationReminder(title, time)` - Immediate notification display
- Ready for integration in AppCore.tsx

**Schema Updates**
- `Task` interface: Added `recurring?: boolean` and `originalId?: string`
- `CareCircle` interface: Added `lastResetDate?: string` (YYYY-MM-DD format)
- `INITIAL_TASKS` IDs changed from numbers to strings for type consistency

### Refactor
- **TypeScript Migration**: Converted entire UI layer (`SeniorView`, `RelativeView`, `App`, `AppCore`, `main`), all custom hooks (`useAuth`, `useCareCircle`, etc.), and utility functions to TypeScript (`.tsx`/`.ts`).
- **Feature Folders**: Restructured codebase into domain-specific feature folders (`features/tasks`, `features/helpExchange`, etc.) with barrel exports.
- **Cleanup**: Removed legacy `types.js` and consolidated types in `types.ts` and components interfaces. Updated `ARCHITECTURE.md` to reflect new structure.

## [1.14.0] - 2025-12-17

### 🛠️ Critical Layout & UI Fixes

**LivingBackground Disabled (Temporary)**
- Replaced animated `LivingBackground` component with simple gradient (`sky-100` → `stone-100`)
- **Reason**: Background component was causing scroll failures and bottom nav positioning issues
- **Fix pending**: Need to refactor LivingBackground to use `position: absolute; inset: 0` without affecting children's layout

**Bottom Navigation Fixed**
- Changed from `position: absolute` to `position: sticky` for proper bottom alignment
- Now correctly sticks to viewport bottom inside scrollable containers
- Reduced padding from `py-3 pb-6` to `px-4 py-2` for compact appearance

**Header & Status Bar Cleanup**
- Unified top status bar: **Share** (left) → **Settings** (center) → **Logout** (right)
- Removed duplicate gear button from RelativeView header
- Settings gear now opens Privacy & Data directly
- Share button opens invite code panel only

**Badge Modal Fix (React Portal)**
- SuperpowerBadge modal now uses `createPortal` to render at `document.body`
- Fixes positioning issues caused by CSS transforms in orbit component
- Modal centered on screen instead of bottom sheet

**Data Flow Fix: Orbit Badges**
- Changed `FamilyConstellation` to receive `memberStatuses` instead of `members`
- Archetypes now display correctly (data was in `memberStatuses` subcollection, not `careCircleMemberships`)

### 🧹 Code Cleanup
- Removed `overflow-hidden` from SeniorView and RelativeView containers (was blocking scroll)
- Removed unused imports: `Settings` from RelativeView, `LivingBackground` usage (commented)
- Added fallback archetype logic for when Firestore data missing


### 🎨 UI Architecture Overhaul

**Component Standardization (CVA)**
- Adopted **Class Variance Authority (CVA)** for all core UI components (`Button`, `Avatar`, `Badge`, `TaskCard`).
- Implemented **`cn()` utility** (`clsx` + `tailwind-merge`) to strictly manage class conflicts and conditional styling.
- **Removed**: Ad-hoc template literal class logic.
- **Benefit**: Type-safe variants (`variant="primary"`, `size="lg"`) and zero style conflicts.

### 🧹 Code Health & cleanup
- **Complete TypeScript Verification**: Production build now runs with strict type checking (exit code 0).
- **Dead Code Removal**: Cleaned up unused props in `AppCore`, `SeniorView`, and `RelativeView`.
- **Infrastructure**: Converted `animations` and `Contexts` from `.jsx` to `.tsx`.

---

## [1.12.0] - 2025-12-17

### 🏗️ TypeScript Migration

**Core Hooks Converted**
- Migrated 8 key data hooks from JavaScript to TypeScript (`.ts`)
- Added strict interface definitions for: `Task`, `SymptomLog`, `MemberStatus`, `Photo`, `HelpOffer`, `Word`
- Eliminated hundreds of "implicit any" risks
- **Benefit**: Better autocomplete, earlier error detection, and safer refactoring

### 📂 Feature Folder Architecture

**Reorganized Codebase**
- Moved from `src/components/feature` and `src/hooks` to `src/features/[featureName]`
- Each feature bundle now contains its own:
  - Components (`.jsx`)
  - Logic Hooks (`.ts`)
  - Assets/Config
- **Features Migrated**: `wordGame`, `helpExchange`, `familyPresence`, `weeklyQuestion`, `thinkingOfYou`, `photos`, `symptoms`, `tasks`

---

## [1.11.0] - 2025-12-17

### 🏗️ Help Exchange Refactor & Architecture

**Refactored Help Exchange Data Flow**
- Stopped prop-drilling by moving data fetching directly into `CoordinationTab` (Relative) and `SeniorView` (Senior).
- `useHelpExchange` hook is now "Smart", fetching its own data.
- `HelpExchange` component is now "Dumb" (pure presentational), relying strictly on props.
- Removed redundant props from `RelativeView` and `SeniorView`.

**Unified Component Architecture**
- **StatusCard**: Merged `SeniorStatusCard` and `FamilyStatusCard` into a single `StatusCard` component.
- Supports `mode="senior" | "relative"` to toggle between dashboard and list styles.
- Complies with "Mirror Protocol" for shared components.

**Debugging & Reliability**
- Added `console.debug` logs for match detection and data synchronization.
- Updated unit tests to support new architecture.

## [1.10.0] - 2025-12-17

### 🎉 Help Exchange Match System Completion

**Match Celebration UI for Seniors**
- Match banner now appears in SeniorView when help exchange matches occur
- Clicking banner opens MatchCelebration modal with action buttons
- Match sound (`playMatchSound`) - cheerful ascending arpeggio (G5→B5→D6→G6)

**Match Actions Create Tasks**
- "Ring og hjælp →" and other CTAs now create actual tasks
- **TimePickerModal**: New component for selecting task time (Morgen/Formiddag/Eftermiddag/Aften)
- Tasks include `period` field for proper sorting in views
- Social attribution: tasks show `createdBy` name

**Match Dismissal**
- X button on MatchBanner allows dismissing without acting
- Matches dismissed after task creation don't reappear (session-based)
- Works in both SeniorView and RelativeView

### 🩺 Symptom Display Improvements

**Severe Symptoms Filter**
- "Alvorlige symptomer" section now only shows severe symptoms when expanded
- Added severity badge display in expanded symptom list
- Filter logic: `trend === 'warning'` triggers severe-only view

### 💊 Medicine Reward Improvements

**Hide Button**
- Added ✕ button to medicine reward card (minimized and expanded states)
- Session-based hiding (reappears after refresh)

### 🐛 Bug Fixes
- Fixed sparkle decoration overlap in MatchCelebration modal
- Fixed task sync between Relative and Senior views
- Avatar component refactored to use individual images instead of CSS sprites

---

## [1.9.0] - 2025-12-16

### 🎨 Emotional Sensing & Visuals

**Atmospheric Status Backgrounds**
- Seniors' status now changes the entire card atmosphere, not just a badge color
- **Dynamic Textures**: 3 high-end abstract backgrounds (Calm/Teal, Neutral/Blue, Urgent/Orange)
- **Context Aware**: Shifts based on completion rate, symptoms, and check-in timeliness
- **Readability**: Dark glass overlay ensures white text pops against any texture

**Family Presence Visuals**
- **Avatars**: Replaced generic icons with specific illustrations (Louise, Fatima, Brad)
- **Status Icons**: Custom pictograms for Home, Work, Traveling, Coffee, and Busy statuses
- **Sprites**: Implemented efficient CSS sprites (`family-presence.png`) for optimal performance

**Smart Summary (Natural Language)**
- "Briefing" card in Peace of Mind tab
- Generates human-like daily summaries: "Mor har haft en rolig morgen og har klaret medicinen."
- Contextual aware of streaks, symptoms, and time of day

### 🚀 PWA & Stability

**PWA Native Feel**
- **Install Prompt**: Custom iOS-styled "Add to Home Screen" sheet with dismissal logic
- **Update Toast**: "New version available" notification for seamless updates
- **Icons**: Generated full suite of PWA icons (192, 512, apple-touch)
- **Manifest**: Updated for standalone display mode

**Self-Healing & Performance**
- **Crash Recovery**: Auto-detects crash loops (3 crashes < 5 min) and purges corrupt local state while preserving auth
- **Ghost UI**: Skeleton loading screens replaced spinners for better perceived performance
- **Assets**: CSS Sprites used for Help Exchange pictograms to reduce network requests

### 🧩 Feature Polish

**Social Attribution**
- Tasks now show "Fra [Name] ❤️" stamp
- Help Exchange uses custom pictograms ('cook', 'drive', 'tech') via `Pictogram` component
- Word Game victory screen now features a "Success Trophy" animation
- Infinite Reward: Daily nature photo from `picsum.photos` (seeded by date)

---

### 🎮 Spillehjørnet (Gaming Corner)

**Word of the Day Game**
- New dedicated "Spil" tab in both SeniorView and RelativeView
- Daily word challenge with 5 words (seeded by date)
- Competition between senior and relatives
- **Leaderboard**: Real-time family scoring tracking
- **Data**: 40+ Danish word definitions added (`wordGameData.js`)

### 📊 Health & Data Transparency

**Health Report (Rapport)**
- New `HealthReport` reusable component
- **Filters**: Clickable chart bars filert symptom log by date
- **Accordion**: Symptom log grouped by date (today open by default)
- **Stats**: Summary of total symptoms and most common symptom
- **Medicine**: Compliance chart with percentage labels

### 📱 Senior View Enhancements

**Task Management**
- **Add Own Task**: Seniors can now create their own tasks (`onAddTask`)
- **Period Selector**: Simple 4-button interface (Morgen, Frokost, Eftermiddag, Aften)
- **Medicine Section**: Decoupled from activity tasks, distinct UI with tick marks
- **Rewards**: "Dagens Billede" reward is now minimizable to restore screen space

**UI Refinements**
- **Navigation**: Replaced "Call" with "Rapport" in bottom nav
- **Layout**: Moved "Tænker på dig" (Connection) above "Familien Nu" (Presence)
- **Feedback**: Minimized reward card shows "Fra familien med kærlighed ❤️"

### 🛠️ Bug Fixes
- **Data Visibility**: Fixed bug where Senior-created tasks weren't visible (missing `time` field in Firestore query)
- **Game Logic**: Fixed "next word reveal" bug in WordGame
- **Tab Bleeding**: Fixed Conditional rendering in RelativeView (content overlapping tabs)

---

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

**Families Hjerteslag (Connection History)**
- New activity feed in RelativeView (Peace of Mind tab)
- Aggregates completed tasks and logged symptoms into a chronological timeline
- Gives relatives immediate context on senior's day

**UI Polish & Refinements**
- **Inline Gates**: Replaced static "Alt er vel" with dynamic 3-segment progress indicator in Senior Header
- **Match Celebration**: Enhanced with premium gradients and pulsing animations
- **Din Status**: Moved to top of Coordination tab in compact inline format
- **iOS Fix**: Adjusted viewport meta tag to prevent top whitespace


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
