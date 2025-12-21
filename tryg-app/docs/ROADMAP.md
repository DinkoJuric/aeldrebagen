# Tryg Product Roadmap & Backlog 🗺️

This document tracks future enhancements, technical ideations, and non-critical features for the Tryg project.

## 🟢 High Priority (Next Sprint)

### 1. Animated Onboarding 🚀 ⭐ HIGH PRIORITY
- **Goal**: A smooth, Lottie-driven welcome flow for new Seniors that tells the "porch light" story.
- **Value**: Reduces cognitive load during first-time use; sets emotional tone.
- **Estimated Effort**: 16h (Asset Creation + Flow Logic).
- **Status**: Backlog - waiting for more features before implementation.

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
