# Tryg App Architecture

> Technical overview for developers and AI agents

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
      │   └── {taskId}: title, time, period, completed
      │
      ├── symptoms/
      │   └── {symptomId}: type, location, timestamp
      │
      ├── settings/
      │   └── familyStatus, checkIn/
      │
      ├── pings/
      │   └── {pingId}: fromName, toRole, sentAt
      │
      └── weeklyAnswers/, helpOffers/, helpRequests/

careCircleMemberships/
  └── {circleId}_{userId}
      ├── circleId, userId, role, joinedAt
```

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
