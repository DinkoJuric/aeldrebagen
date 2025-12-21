# 🚀 Agent Onboarding: Project Tryg

> **Identity**: A "Soulful & High-Fidelity" PWA for elderly care.
> **Stack**: Vite, React, Tailwind, Firebase (Firestore/Auth).
> **Key Pattern**: Dual-View Architecture ("Mirror Protocol").

---

## 1. The Core Philosophy (Don't Break This)
- **High-Fidelity or Bust**: This is not a CRUD app. It must feel "alive". Use `framer-motion`, glassmorphism, and the `LivingBackground`.
- **The Mirror Protocol**: Every feature has two faces.
  - **Senior View (`SeniorView.tsx`)**: Big buttons, simple text, read-only mostly.
  - **Relative View (`RelativeView.tsx`)**: Dashboards, controls, status updates.
  - **Rule**: If you touch one, you **MUST** verify the other.

## 2. Architecture & Data Flow
- **Data Source**: `AppCore.tsx` creates the `CareCircleContext`.
- **Hooks**:
  - `useCareCircle.ts`: Handles **Auth & Membership** (Join/Leave/Create).
  - `useCareCircleContext.tsx`: Provides **Hydrated Data** (Tasks, symptoms, statuses).
- **Common Trap**:
  - `members` array comes from `useCareCircle` (raw auth data).
  - `memberStatuses` array comes from `useMemberStatus` (rich status data).
  - **Always checked**: Does your component need just the *user* (`members`) or their *status* (`memberStatuses`)?

## 3. The "Third Rails" (Instant Bugs)
- ❌ **Hardcoded Colors**: Never use `text-stone-800`. Use `theme-text` or `theme-card`.
- ❌ **Pixel Values**: Never use `18px`. Use `--font-size-lg` variables.
- ❌ **UserId vs DocId**:
  - `userId`: The auth UID (e.g., `google_123`).
  - `docId`: The Firestore document key (e.g., `circle_ABC_google_123`).
  - **Rule**: Updates (`setDoc`) require `docId`. Display logic often uses `userId`. **Do not confuse them.**

## 4. Current "Active Zone" (Watch Your Step)
- **Feature**: "Livstræet" (Family Tree) Admin Actions.
- **Files**: `src/features/visualizations/FamilyTree.tsx`, `src/components/ui/MemberActionMenu.tsx`.
- **State**:
  - We just refactored `useCareCircle.ts` to use `docId` for updates.
  - **CRITICAL BUG**: The hook returns an object that tries to export `updateAnyMember`, but the function was renamed to `updateMemberByDocId`. This throws a ReferenceError.
  - **Next Step**: Fix the return statement in `useCareCircle.ts`.

## 5. Development Cheatsheet
- **Run Dev**: `npm run dev`
- **Lint**: `tsc --noEmit` (Run this before "finishing" any task).
- **Test User**: "Brad Pitt" (Senior) / "Fatima" (Relative).
- **Toggle Role**: Click the "S/R" button in the top right (Dev only).
