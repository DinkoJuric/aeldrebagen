# Tryg Product Roadmap & Backlog 🗺️

This document tracks future enhancements, technical ideations, and non-critical features for the Tryg project.

---

## 📖 Table of Contents
1. [High Priority (Next Sprint)](#high-priority-next-sprint)
2. [Medium Priority (Future Vision)](#medium-priority-future-vision)
3. [Long-term / Ideation](#long-term--ideation)
4. [Technical Debt & Standardization](#technical-debt--standardization)

---

## 🟢 High Priority (Next Sprint)
### 1. Onboarding Media Refinement (Portrait Aspect Ratio) 🎥 ⭐ HIGH PRIORITY
- **Goal**: Ensure the "Unity" video asset in the onboarding flow renders in a proper portrait container without manual layout overrides.
- **Context**: Currently using a simplified manual layout after the initial `aspect-[9/16]` attempt was deferred.
- **Estimated Effort**: 3h.

### 2. Multi-Family Relational Schema 🌲 ⭐ HIGH PRIORITY
- **Goal**: Replace "Character Slots" with a fully dynamic `partnerId` and `parentIds` system.
- **Value**: Critical for extending testing to 2-3 separate families and supporting complex hierarchies.
- **Estimated Effort**: 12h (Data Migration + FamilyTree refactor).

### 3. "X-in-law" Role Support 👥
- **Goal**: Add "In-law" roles to the member enum and family tree visualization.
- **Value**: Essential for capturing the full scope of modern family circles.
- **Estimated Effort**: 4h (Type update + Pictogram additions).

## 🟡 Medium Priority (Backlog)

### 2. Family Photo Background 🖼️
- **Goal**: Allow relatives to upload photos that become the dynamic background for the Senior's view.
- **Value**: High emotional utility; strengthens the connection loop.
- **Estimated Effort**: 8h (Storage + State Management).

## 🔵 Low Priority / Ideations

### 3. Haptic Feedback 📳
- **Goal**: Add subtle tactile response to button presses on mobile.
- **Value**: Improves "Senior-friendly" interactivity confirmation.
- **Estimated Effort**: 4h (Capacitor Haptics integration).

### 4. Audio Affirmations 🎙️
- **Goal**: Play a warm vocal greeting when the app is opened (e.g., "Godmorgen, Louise").
- **Value**: Accessibility for visually impaired seniors.

### 6. ~~Admin Tools (POC)~~ ✅ (Dec 2025)
- **Goal**: Allow developers/admins to set up data without role restrictions.
- **Status**: ✅ Completed. `dinko1991@hotmail.com` has global edit rights in Firestore.

### 5. ~~Prop Drilling Refactor~~ ✅ (COMPLETED in Phase 2)

- **Goal**: Move frequently-drilled props to React Context.
- **Status**: ✅ Completed. `CareCircleContext` is now the central state hub.
- **Components now use**: `useCareCircleContext()` hook instead of prop drilling.

---
*Standards: Refer to [.agent/workflows/onboarding.md](../../.agent/workflows/onboarding.md) for implementation rules.*
