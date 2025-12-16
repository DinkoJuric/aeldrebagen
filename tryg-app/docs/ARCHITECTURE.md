# Tryg App Architecture

> Technical overview for developers and AI agents

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [System Overview](#system-overview)
2. [Directory Structure](#directory-structure)
3. [Data Model (Firestore)](#data-model-firestore)
4. [HelpExchange Match System](#helpexchange-match-system)
5. [RelativeView Tab Architecture](#relativeview-tab-architecture)
6. [Key Patterns](#key-patterns)
7. [Authentication Flow](#authentication-flow)
8. [Related Documentation](#related-documentation)


## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Tryg PWA                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ SeniorView  │  │RelativeView │  │   Shared Components  │  │
│  │ (Elder UI)  │  │ (Family UI) │  │ (Modals, Buttons)   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐  │
│  │                    AppCore.jsx                          │  │
│  │              (State Management + Routing)               │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴───────────────────────────────┐  │
│  │                   Firebase Hooks Layer                   │  │
│  │  useTasks | useSymptoms | useSettings | usePings | ...  │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  Firebase Cloud  │
                    │  - Auth          │
                    │  - Firestore     │
                    │  - Storage       │
                    └─────────────────┘
```

---

## Directory Structure

```
tryg-app/
├── src/
│   ├── components/          # UI Components
│   │   ├── SeniorView.jsx   # Elder interface (tasks, symptoms)
│   │   ├── RelativeView.jsx # Family dashboard (monitoring)
│   │   ├── AuthScreen.jsx   # Login/signup
│   │   ├── CircleSetup.jsx  # Create/join care circle
│   │   ├── Spillehjoernet.jsx # Gaming container
│   │   ├── HealthReport.jsx   # Reusable medical report
│   │   └── ui/              # Reusable components
│   │
│   ├── hooks/               # Firebase Data Hooks
│   │   ├── useAuth.js       # Authentication state
│   │   ├── useCareCircle.js # Circle membership
│   │   ├── useTasks.js      # Task CRUD + sync
│   │   ├── useSymptoms.js   # Symptom tracking
│   │   ├── useSettings.js   # Circle settings
│   │   ├── usePings.js      # "Thinking of you" notifications
│   │   ├── useWeeklyQuestions.js
│   │   ├── useHelpExchange.js
│   │   ├── useHelpExchange.js
│   │   ├── useMemberStatus.js  # Per-member status tracking (NEW)
│   │   ├── useWordGame.js      # Daily word game logic + scoring
│   │   └── useCheckIn.js    # Senior check-in tracking
│   │
│   ├── config/
│   │   ├── firebase.js      # Firebase initialization
│   │   └── features.js      # Feature flags
│   │
│   ├── data/constants.js    # Tasks, symptoms, profile defaults
│   ├── utils/               # Helpers (sounds, images)
│   │
│   ├── AppWithAuth.jsx      # Auth flow wrapper
│   ├── AppCore.jsx          # Main app with Firebase hooks
│   └── App.jsx              # localStorage demo version
│
├── docs/                    # Documentation
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── .env.example             # Environment variable template
```

---

## Data Model (Firestore)

```
users/
  └── {userId}
      ├── email, displayName, role
      ├── careCircleId
      └── consentGiven, consentTimestamp

careCircles/
  └── {circleId}
      ├── seniorId, seniorName
      ├── inviteCode
      ├── createdAt
      │
      ├── tasks/
      │   └── {taskId}: title, time, period, completed, completedAt  ← Used for activity feed
      │
      ├── symptoms/
      │   └── {symptomId}: type, location, timestamp
      │
      ├── settings/
      │   └── familyStatus: {userId}: status, updatedAt
      │
      ├── wordGame/
      │   ├── scores/
      │   │   └── {userId}: score, lastPlayedDate
      │   └── daily/
      │       └── {userId}_{date}: completed
      │
      ├── pings/
      │   └── {pingId}: fromName, toRole, sentAt
      │
      ├── memberStatuses/           ← NEW: Per-member status tracking
      │   └── {userId}
      │       ├── status: 'home' | 'work' | 'traveling' | 'available' | 'busy'
      │       ├── displayName
      │       ├── role: 'senior' | 'relative'
      │       └── updatedAt
      │
      ├── helpOffers/
      │   └── {offerId}
      │       ├── id, label, emoji
      │       ├── createdByUid, createdByRole
      │       └── createdAt
      │
      ├── helpRequests/
      │   └── {requestId}
      │       ├── id, label, emoji
      │       ├── createdByUid, createdByRole
      │       └── createdAt
      │
      └── weeklyAnswers/

careCircleMemberships/
  └── {circleId}_{userId}
      ├── circleId, userId, role, joinedAt
```

---

## HelpExchange Match System

Bidirectional offer/request system with match celebration when offers align with requests.

```
┌─────────────────────────────────────────────────────────────┐
│                    HelpExchange Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   SENIOR                           RELATIVE                  │
│   ┌─────────────┐                 ┌─────────────┐           │
│   │ 💚 Offers   │                 │ 💚 Offers   │           │
│   │ 💜 Requests │                 │ 💜 Requests │           │
│   └──────┬──────┘                 └──────┬──────┘           │
│          │                               │                   │
│          └───────────┬───────────────────┘                   │
│                      ↓                                       │
│         ┌────────────────────────┐                          │
│         │  useHelpExchangeMatch  │                          │
│         │  (Detection Hook)      │                          │
│         └───────────┬────────────┘                          │
│                     ↓                                        │
│         ┌────────────────────────┐                          │
│         │  🎉 Match Celebration  │                          │
│         │  (Modal/Banner)        │                          │
│         └────────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

**Key Files:**
- `src/config/helpExchangeConfig.js` - Match pairs, status matches, offer/request options
- `src/hooks/useHelpExchangeMatch.js` - Match detection logic
- `src/components/MatchCelebration.jsx` - Celebration UI (modal + banner)

**See:** [HELPEXCHANGE_MATCHES.md](./HELPEXCHANGE_MATCHES.md) for complete match pairs reference.

---

## RelativeView Tab Architecture

```
RelativeView
├── PeaceOfMindTab (Min Dag)        ← Emotional reassurance
│   ├── Hero "Alt er vel" card
│   ├── ProgressRing (3-segment Gates)
│   │   ├── ☀️ Morgen (6-12)
│   │   ├── 🌤️ Eftermiddag (12-18)
│   │   └── 🌙 Aften (18-22)
│   │   Colors: 🟢 On-time | 🟡 Late | 🔴 Overdue
│   └── Quick glance stats (Medicin, Symptomer)
│
├── CoordinationTab (Familie)        ← Practical coordination
│   ├── Status picker (visible to senior)
│   ├── HelpExchange (bidirectional)
│   ├── Match banners
│   ├── Task lists (open/completed)
│   └── Symptom summary
│
└── RelativeBottomNavigation         ← Tab switching
    ├── ❤️ Min dag (peace of mind)
    ├── 👥 Familie (coordination)
    └── 📄 Rapport (shortcut)
```

**ProgressRing Component** (`src/components/ProgressRing.jsx`):
- Visual: 3-segment SVG ring representing day periods
- Logic: Compares task `period` and `completed` status against current time
- Colors:
  - 🟢 Green (`#10B981`): Task completed within expected window (±2 hours)
  - 🟡 Yellow (`#F59E0B`): Task completed outside expected window
  - 🔴 Red (`#EF4444`): Task not completed, period has passed
  - Gray (`#D1D5DB`): Future period, not yet actionable


---

## Key Patterns

### 1. Firebase Hooks Pattern
Each hook follows the same structure:
```javascript
export function useXxx(circleId) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Subscribe to Firestore collection
    const unsubscribe = onSnapshot(query, (snapshot) => {
      setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [circleId]);
  
  const addItem = async (item) => { /* setDoc */ };
  
  return { data, addItem, ... };
}
```

### 2. CareCircleContext (State Sharing)
To avoid prop drilling, shared data (careCircleId, memberStatuses, currentUserId) is provided via React Context:

```javascript
// In AppCore.jsx
<CareCircleProvider
    careCircleId={careCircle?.id}
    memberStatuses={memberStatuses}
    currentUserId={user?.uid}
    ...
>
    {/* Views */}
</CareCircleProvider>

// In any nested component
const { memberStatuses, currentUserId } = useCareCircleContext();
```

**Key files:**
- `src/contexts/CareCircleContext.jsx` - Provider + hook
- `src/components/FamilyPresence.jsx` - Uses context for memberStatuses
```

### 2. Role-Based Views
View is determined by `userProfile.role`:
- `senior` → SeniorView (elder interface)
- `relative` → RelativeView (family dashboard)

No toggle - users only see their own role's view.

### 3. Feature Flags
Toggle features in `src/config/features.js`:
```javascript
photoSharing: false,  // Requires Firebase Blaze plan
weeklyQuestion: true,
thinkingOfYou: true,
```

---

## Authentication Flow

```
1. User opens app
   ↓
2. AppWithAuth checks auth state
   ↓
3. Not logged in? → AuthScreen (login/signup)
   ↓
4. No consent? → ConsentModal (GDPR)
   ↓
5. No care circle? → CircleSetup (create/join)
   ↓
6. Ready → AppCore renders SeniorView or RelativeView
```

---

## Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - How to deploy
- [SECURITY.md](./SECURITY.md) - Security model
- [firebase_learnings.md](./firebase_learnings.md) - Lessons learned
