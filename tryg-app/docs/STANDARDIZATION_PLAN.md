# The Great Harmonization Plan ⚖️
> "Calling a shovel a shovel, not a specific ground-displacement tool."

## 1. The Core Confusion
We have too many terms for the same thing. This creates cognitive load and architectural spaghetti.

| Current Term(s) | **Standardized Term** | Definition |
| :--- | :--- | :--- |
| *Circle, Constellation, Orbit, Graph* | **Family Cirkel** | The abstract collection of people connected to a Senior. |
| *Tree, Heart, Livstræet* | **Livstræet** | The *visual representation* of the Member relationships (the Tree UI). |
| *Relative, Caregiver, Helper* | **Relationer** | Any family member who is NOT the Senior. |
| *Senior, Citizen, Focus Person* | **Senior** | The center of the Care Circle. |
| *Matrix, Wizard, Onboarding* | **Relation Wizard** | The flow where users define who is who. |

## 2. Visual Architecture (The Views)

We need to strictly define the **Views** to avoid "section soup".

### A. **Senior View** (The iPad/Tablet)
- **Goal:** Clarity, Status, Peace of Mind.
- **Key Component:** `SeniorDashboard`
- **Widgets:**
    - `StatusToggle` (For setting "I am okay")
    - `Aktivitetsmåler` (Tracking daily activity)
    <!-- - `Livsbog` (Memories) (Not enabled yet) -->
    <!-- - `FamilyTreeWidget` (Read-only view of the tree)

### B. **Relative View** (The Phone)
- **Goal:** Coordination, Monitoring, Action.
- **Key Component:** `FamilyDashboard`
- **Widgets:**
    - `MemberStatusList` (Who is where?)
    - `CoordinationFeed` (Tasks/Chat)
    - `RelationManager` (Edit the tree)

## 3. Standardization Strategy (Scope)

To harmonize the codebase without breaking everything, we will follow this 3-Step Migration:

### Phase 1: The Rename (Low Risk) 🏷️
*Goal: Fix the names in the UI and Types first.*
1.  **Type Aliases**: Create a global `DomainTypes.ts` that re-exports `Member`, `Relation`, `Task` with strict naming.
2.  **Prop Standardization**: Rename unclear props.
    - `currentMember` -> `activeUser`
    - `allMembers` -> `circleMembers`
    - `seniorName` -> `targetName`
3.  **Drilling Prevention**: Migrate deep prop chains to Context or specialized hooks to avoid passing data across multiple layers.

### Phase 2: The Folder Re-Shuffle (Medium Risk) 📂
*Goal: Move files to where they belong based on the new definitions.*

```text
src/
  features/
    family-circle/         <-- THE TRUTH (Data & Logic)
       hooks/useFamilyCircle.ts
       types.ts
    
    visualizations/        <-- THE LOOKS (UI Only)
       FamilyTree.tsx      (The Tree)
       FamilyOrbit.tsx     (The Constellation)
       StatusCard.tsx      (The Cards)

    onboarding/
       RelationWizard.tsx  (The Matrix)
```

### Phase 3: The Component Purge (High Risk) 🧹
*Goal: Delete legacy components (Constellation, Old Tree).*
1.  Audit `src/components` and move reusable logic to `src/features`.
2.  Deprecated components get a `_DEPRECATED` suffix for 1 week, then deleted.

## 4. Immediate Action Plan (Next Steps)
Do not implement this big refactor yet. Today, we focus on:
1.  **Fixing the Tree**: Making `FamilyTree.tsx` look good (Done check).
2.  **Replacing the "Heart"**: Swapping the `FamilyConstellation` inside the "Familiens Hjerte" modal with the fixed `FamilyTree`.

---
*Approved by the Ministry of Sanity.*
