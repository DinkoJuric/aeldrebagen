# Tryg App Architecture

> Technical overview for developers and AI agents

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [System Overview: The Mirror Architecture](#system-overview-the-mirror-architecture)
2. [Directory Structure](#directory-structure)
3. [Data Model (Firestore)](#data-model-firestore)
4. [HelpExchange Match System](#helpexchange-match-system)
5. [RelativeView Tab Architecture](#relativeview-tab-architecture)
6. [Key Patterns](#key-patterns)
7. [Authentication Flow](#authentication-flow)
8. [MCP Integration](#mcp-integration-agentic-tooling)
9. [Modals & Overlays Strategy](#modals--overlays-strategy-dec-2025)
10. [Security Model: Admin Access](#security-model-admin-access-poc)
11. [Family Tree: POC Slot System](#family-tree-poc-identity--slot-system)
12. [Related Documentation](#related-documentation)


## System Overview: The Mirror Architecture

Tryg is built on a **Symmetrical Mirror Protocol** where data flows bidirectionally through a single Source of Truth, projected through role-specific "Lenses."

```mermaid
graph TD
    subgraph Lenses ["Experience Lenses (Role-Aware)"]
        direction LR
        SV["<b>SeniorView</b><br/>iPad/Tablet Lens"]
        RV["<b>RelativeView</b><br/>Mobile/Handheld Lens"]
    end

    subgraph Mirror ["The Mirror Protocol (Shared Core)"]
        direction TB
        AT["AmbientTab<br/>Daily Reassurance"]
        HT["HealthTab<br/>Clinical Visibility"]
        FT["FamilyTree<br/>Relationship Map"]
        ST["SpilTab<br/>Mutual Play"]
    end

    subgraph Engine ["Living Data Engine (State)"]
        CCC["CareCircleContext<br/>Data Brain"]
        TC["ThemeContext<br/>Circadian Pulse"]
        FHL["Firebase Hooks<br/>Real-time Sync"]
    end

    subgraph Cloud ["Infrastructure"]
        FB["Firebase Cloud<br/>Auth / DB / Storage"]
    end

    %% Flow
    SV <--> Mirror
    RV <--> Mirror
    Mirror <--> Engine
    Engine <--> Cloud

    %% Styling for Max Legibility
    classDef lens fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#0f172a;
    classDef shared fill:#f0f9ff,stroke:#0ea5e9,stroke-width:2px,color:#0c4a6e;
    classDef engine fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f;
    classDef cloud fill:#fafafa,stroke:#262626,stroke-width:2px,color:#171717;
    
    class SV,RV lens;
    class AT,HT,FT,ST shared;
    class CCC,TC,FHL engine;
    class FB cloud;
```

### Text-Based Overview (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│                      Experience Lenses                      │
│  ┌──────────────────────┐          ┌──────────────────────┐  │
│  │     SeniorView       │          │    RelativeView      │  │
│  │  (iPad/Tablet Lens)  │          │ (Mobile/Handheld Lens)│ │
│  └──────────┬───────────┘          └───────────┬──────────┘  │
│             └────────────────┬─────────────────┘             │
│                              ▼                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 The Mirror Protocol (Shared)           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  ┌─────┐│  │
│  │  │ AmbientTab │  │ HealthTab  │  │ FamilyTree│  │Spil ││  │
│  │  └────────────┘  └────────────┘  └───────────┘  └─────┘│  │
│  └───────────────────────────┬────────────────────────────┘  │
│                              ▼                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                Living Data Engine (State)              │  │
│  │  CareCircleContext  |  ThemeContext  |  Firebase Hooks │  │
│  └───────────────────────────┬────────────────────────────┘  │
└──────────────────────────────┼───────────────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    Firebase Cloud   │
                    │ (Auth/DB/Storage)   │
                    └─────────────────────┘
```

---

## Directory Structure

```
tryg-app/
├── src/
│   ├── features/            # Feature Bundles (Components + Hooks)
│   │   ├── familyPresence/
│   │   │   ├── index.ts      # Public API
│   │   │   ├── FamilyPresence.tsx
│   │   │   ├── StatusCard.tsx
│   │   │   └── useMemberStatus.ts
│   │   ├── helpExchange/
│   │   │   ├── index.ts
│   │   │   ├── HelpExchange.tsx
│   │   │   └── useHelpExchange.ts
│   │   ├── tasks/
│   │   │   ├── index.ts
│   │   │   └── useTasks.ts
│   │   ├── symptoms/
│   │   │   ├── index.ts
│   │   │   └── useSymptoms.ts
│   │   ├── wordGame/
│   │   ├── photos/
│   │   ├── coffee/              # Spontan Kaffe (Open Door) signaling
│   │   │   ├── index.ts
│   │   │   ├── CoffeeToggle.tsx
│   │   │   └── CoffeeInviteCard.tsx
│   │   ├── onboarding/          # App Guide & Feature Tour
│   │   │   ├── index.ts
│   │   │   ├── Onboarding.tsx
│   │   │   ├── SeniorWelcome.tsx
│   │   │   └── RelativeWelcome.tsx
│   │   └── ... (thinkingOfYou, weeklyQuestion)
│   │
│   ├── components/          # Shared/Orchestration Components
│   │   ├── SeniorView.tsx   # Elder interface
│   │   ├── RelativeView.tsx # Family dashboard
│   │   ├── AppCore.tsx      # Main app logic
│   │   ├── ui/              # Generic UI (Button, Modal, Avatar)
│   │   └── ...
│   │
│   ├── hooks/               # Global/Auth Hooks
│   │   ├── useAuth.ts
│   │   ├── useCareCircle.ts
│   │
│   ├── config/              # Configuration
│   ├── data/                # Static Data (wordGameData*.ts for localized words)
│   ├── utils/               # Helpers
│   └── locales/             # i18n translation files (da.json, bs.json, tr.json)
│
├── docs/                    # Documentation
├── tsconfig.json            # TypeScript Config
└── ...
```
---

## Migration Status (Dec 2025)

✅ **Feature Folder Migration**: COMPLETED. All domain logic is now organized under `src/features/`.
✅ **TypeScript Conversion**: COMPLETED (100% type-safe, no `any`).
✅ **Senior View Refactor**: COMPLETED. (Phase 3)
✅ **Relative View Refactor**: COMPLETED. (Phase 4)
✅ **State Management Refactor**: COMPLETED. `CareCircleContext` is the central state hub.
✅ **Localization Audit**: COMPLETED. 100% translation coverage.
✅ **AmbientTab Unification**: COMPLETED. (Phase 8) `DailyTab` + `PeaceOfMindTab` merged into `AmbientTab`.
✅ **Onboarding Audio Sync**: COMPLETED. Global `isMuted` state via `AudioContext`.
✅ **Onboarding Feature**: COMPLETED. Role-based welcome guide accessible via Settings.

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
      ├── lastResetDate                ← Daily reset tracker (YYYY-MM-DD)
      │
      ├── tasks/
      │   └── {taskId}: title, time, period, completed, completedAt, recurring  ← recurring for daily reset
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
│         │  🎉 Match Celebration  │ ← playMatchSound()       │
│         │  (Modal/Banner)        │                          │
│         └───────────┬────────────┘                          │
│                     ↓                                        │
│         ┌────────────────────────┐                          │
│         │  TimePickerModal       │ (Relative only)          │
│         │  (Select task time)    │                          │
│         └───────────┬────────────┘                          │
│                     ↓                                        │
│         ┌────────────────────────┐                          │
│         │  📋 Task Created       │                          │
│         │  (Synced via useTasks) │                          │
│         └────────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

**Match Action Flow:**
1. User clicks MatchBanner → Opens MatchCelebration modal
2. User clicks CTA (e.g., "Ring og hjælp →")
3. For Relative: TimePickerModal opens for time selection
4. Task created with title, period, and `createdBy` attribution
5. Match is dismissed (added to `dismissedMatchIds` state)

**Match Dismissal:**
- X button on MatchBanner dismisses without action
- Session-based: `dismissedMatchIds` is a React state (Set)
- Not persisted to Firestore (matches reappear on refresh)

**Key Files:**
- `src/config/helpExchangeConfig.ts` - Match pairs, status matches, offer/request options
- `src/hooks/useHelpExchangeMatch.ts` - Match detection logic
- `src/components/MatchCelebration.tsx` - Celebration UI (modal + banner with `onDismiss` prop)
- `src/components/TimePickerModal.tsx` - Time selection for task creation
- `src/utils/sounds.ts` - `playMatchSound()` for audio feedback

**See:** [HELPEXCHANGE_MATCHES.md](./HELPEXCHANGE_MATCHES.md) for complete match pairs reference.

---

## RelativeView Tab Architecture

> **Note (Dec 2025)**: Navigation state (`activeTab`) is now lifted to `AppCore.tsx`. Both `SeniorView` and `RelativeView` receive `activeTab` and `onTabChange` via props. The `BottomNavigation` component is rendered once in `AppCore`, not inside each view. The header navigation is split into **Share/Care Circle** (Top-Left) and **Settings/Privacy** (Center) to reduce cognitive load.

```
AppCore (owns activeTab, SettingsModal, BottomNavigation)
├── ThemeProvider (owns Dark Mode / Circadian State)
├── SeniorView (receives activeTab, isDark via props/context)
│   ├── Daily Tab (Min Hverdag)
│   ├── Family Tab (Familie)
│   └── Spil Tab (Gaming Corner)
│
└── RelativeView (Context-driven)
    ├── PeaceOfMindTab (Daily reassurance)
    ├── CoordinationTab (Family coordination)
    ├── HealthTab (Shared - High Fidelity)
    ├── SpilTab (Shared - Gaming Corner)
    └── RelativeModals (Extracted logic)
```

**ProgressRing Component** (`src/features/tasks/ProgressRing.tsx`):
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

### 2. State Management (The Prop Drilling Cure)
Shared data (careCircleId, memberStatuses, currentUserId, etc.) and global actions are centralized in `CareCircleContext`. This is the **Single Source of Truth** for the application state.

**Key Benefits:**
- **Zero Prop Drilling**: Components access data directly via `useCareCircleContext()`.
- **Real-time Sync**: Firestore listeners inside the context update all views simultaneously.
- **Role Symmetry**: Both roles share the same logic containers, fulfilling the Mirror Protocol.

**The Visual Map**: This diagram illustrates how the unified context eliminates prop drilling across both Senior and Relative views.

```mermaid
graph TD
    AppCore[AppCore.tsx] --> Provider[CareCircleProvider]
    
    Provider --> SeniorView[SeniorView.tsx]
    SeniorView --> STabs[Tabs: Daily, Family, Health, Spil]
    SeniorView --> SModals[SeniorModals.tsx]
    
    Provider --> RelativeView[RelativeView.tsx]
    RelativeView --> RTabs[Tabs: PeaceOfMind, Coordination, Health, Spil]
    RelativeView --> RModals[RelativeModals.tsx]
    
    STabs -.-> Context[useCareCircleContext]
    RTabs -.-> Context
    SModals -.-> Context
    RModals -.-> Context
```

**Key Consumers:**
- All Tabs: `DailyTab`, `FamilyTab`, `PeaceOfMindTab`, `CoordinationTab`, `HealthTab`, `SpilTab`
- All Modals: `SeniorModals`, `RelativeModals`

**Key files:**
- `src/contexts/CareCircleContext.tsx` - Provider + Hook
- `src/types.ts` - `CareCircleContextValue` definition

### 2. Role-Based Views
View is determined by `userProfile.role`:
- `senior` → SeniorView (elder interface)
- `relative` → RelativeView (family dashboard)

No toggle - users only see their own role's view.

### 3. Feature Flags
Toggle features in `src/config/features.ts`:
```javascript
export const FEATURES = {
  photoSharing: false,  // Requires Firebase Blaze plan
  weeklyQuestion: true,
  thinkingOfYou: true,
}
```

### 4. Natural Language Generator (Smart Summary)
Logic resides in `src/utils/briefing.ts`:
- Inputs: Tasks (completed/total), Symptoms (count/severity), Streak info
- Logic: Heuristics based on completeness and time of day
- Output: "Friendly Danish sentence" (e.g., "Mor har det godt, men husk medicinen.")
- Used in: `PeaceOfMindTab` for instant status context.

### 5. Crash Loop Protection (Self-Healing)
Implemented in `src/main.tsx`:
- **Detection**: Tracks crash timestamps in `localStorage`
- **Trigger**: >3 crashes in 5 minutes
- **Action**: Clears `localStorage` (except critical auth tokens) and reloads
- **Benefit**: Prevents white-screen-of-death loops for non-technical seniors

### 6. Sprite System (Performance)
Used for `Avatar` and `Pictogram`:
- **Asset**: Single large png (`family-presence.png`, `help-sheet.png`)
- **Component**: Calculates `backgroundPosition` percentage based on ID
- **Benefit**: Reduces HTTP requests, ensures instant load of all related icons

### 7. UI Styling Architecture (New)
Standardized usage of Tailwind CSS:
- **`cn()` Utility**: Located in `src/lib/utils.ts`. Combines `clsx` (conditionals) and `tailwind-merge` (conflict resolution).
- **CVA (Class Variance Authority)**: Used for defining component variants.
  ```typescript
  const buttonVariants = cva("base-styles", {
    variants: { variant: { ... }, size: { ... } }
  });
  ```
- **Rule**: Never use string concatenation for classes. Always use `cn()`.
```

---

### 8. The "Soul" Layer (Design Systems)

#### Circadian Engine (New Dec 2025)
Instead of a static theme, Tryg uses a **Time-Aware Engine** (`useCircadianTheme.ts`) that shifts the app's emotional state through 4 phases:
1.  **Dawn (05-09)**: Lavender/Peach (Soft awakening)
2.  **Day (09-17)**: Sky/Teal (Clear & Bright)
3.  **Golden (17-18)**: Warm Sand/Amber (Hygge transition)
4.  **Midnight (18-05)**: Deep Slate/Indigo (Premium Dark Mode)

**Key Logic**:
*   Manual "Dark Mode" overrides time and forces **Midnight** phase.
*   `LivingBackground.tsx` interpolates gradients over 4000ms for imperceptible shifts.
*   **Nordic Glass**: Uses `.glass-nordic` token for accessible, double-pane glassmorphism.

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

---

## MCP Integration (Agentic Tooling)

The project utilizes the **Model Context Protocol (MCP)** to empower AI agents with direct access to external tools.

**Configuration Location**: `~/.gemini/antigravity/mcp_config.json` (Local only, not checked in)

**Active Servers**:
1.  **Google Chrome DevTools** (`npx chrome-devtools-mcp`) - Browser control
2.  **GitHub** (`npx @modelcontextprotocol/server-github`) - Repo management
3.  **You.com** (`npx @youdotcom-oss/mcp`) - Search & Reasoning
4.  **Firebase** (`firebase-mcp-server`) - Database management
5.  **Perplexity** (`perplexity-ask`) - Deep research

---

## Modals & Overlays Strategy (Dec 2025)

**The "Native App" Feel Rule**:
Web-based modals often feel "cheap" because they allow the background to scroll or get clipped by parent containers.

**The Solution:**
1.  **React Portals**: All modals (`Modal.tsx`, `ShareModal.tsx`)- **Solution**: Use **React Portal** (`createPortal(modal, document.body)`) to render modal at document root level.
- **Future**: Any modal/overlay component in a complex UI should use Portal to escape CSS context issues.
2.  **Scroll Locking**: The `useScrollLock` hook MUST be called whenever a modal is open. This freezes the `<body>` scroll, preventing the "rubber band" effect and ensuring the user's touch actions apply ONLY to the modal.

---

### 8. Admin Override Pattern (Client-Side)
- **Problem**: Need to allow specific admin users (e.g., `dinko1991@hotmail.com`) to edit ANY member's data.
- **Solution**:
  1. **Backend**: `firestore.rules` checks `request.auth.token.email`.
  2. **Frontend**: `ShareModal` logic checks `currentUserId` and email to bypass "You can only edit yourself" checks.
  3. **Data**: Mapping `doc.id` -> `docId` strictly in hooks ensures update operations hit the correct document.

---

## Security Model: Admin Access (POC)

For rapid development and Proof-of-Concept (POC) data setup, the following admin permissions are hardcoded in `firestore.rules`:
- **Admin Email**: `dinko1991@hotmail.com`
- **Privileges**: Can update ANY document in `careCircleMemberships` regardless of ownership.
- **Purpose**: Allows setting up demo circles and modifying member statuses without simulating multiple user logins.

---

## Family Tree: POC Identity & Slot System

To accelerate development while maintaining a high-fidelity visual experience, the `FamilyTree.tsx` component utilizes a **Stable Slot Heuristic** rather than a dynamic relationship database.

### 1. The Heuristic Character Mapping
The system maps existing `careCircleMemberships` to specific "Archetype Slots" based on a stable sort of their `userId`.

*   **Stable Sorting**: Members are always sorted by ID before mapping. This ensures that Character A (Slot 0) remains Character A even if their `displayName` changes.
*   **Slot 0 (The "Louise" Archetype)**:
    *   Hardcoded Partner: `Jacob` (Dummy Node).
    *   No offspring in current view.
*   **Slot 1 (The "Fatima" Archetype)**:
    *   No dummy partner.
    *   Offspring: All members with "Juzu" in their name (heuristic tagging).

### 2. Long-term Implications
*   **Current Phase**: Perfect for testing and "Wizard of Oz" demos where names like "Louise" are swapped for "Pernille" without breaking the visual hierarchy.
*   **Future Scaling**: When supporting multiple families or 3+ children, this will migrate to a **Relational Schema**:
    *   `partnerId`: Linked to another `userId`.
    *   `parentIds`: Array of linkable IDs.
    *   **In-law Support**: Future "In-law" roles will be added to the `Member` role enum.

> [!NOTE]
> **Agents**: Do not refactor this to a fully dynamic relation model without explicit user confirmation. This structure is intentionally kept simple to avoid premature schema expansion.
