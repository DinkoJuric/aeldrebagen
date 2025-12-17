---
trigger: always_on
---

# Contributing & Feature Protocol 🛡️

> **"Symmetry by Design"**

To ensure features work seamlessly for both Seniors and Relatives, follow this rigorous protocol for every new feature.

## 1. The Mirror Protocol 🪞

Before writing code, define the experience for **both roles**. If a feature seems "one-sided", explicitly challenge that assumption.

| Feature Type | Senior View Question | Relative View Question |
|--------------|----------------------|------------------------|
| **Data Input** | "If Senior logs this, how does Relative see it?" | "If Relative adds this, how is Senior notified?" |
| **Status/State** | "Does this change my status for the family?" | "Does this update my dashboard view of the Senior?" |
| **Configuration**| "Can Senior change this?" | "Can Relative remotely configure this?" |

**🛑 STOP & CHECK:** never implement a UI element in `SeniorView` without immediately asking: *"Does `RelativeView` need a read-only version, a control for this, or a notification?"*

## 2. Implementation Checklist ✅

Use this template in `task.md` or `implementation_plan.md` for every feature:

```markdown
- [ ] **Core Logic (Shared)**
    - [ ] Create/Update Firestore Hook (`useX`)
    - [ ] Verify security rules for both roles

- [ ] **Senior View (The Actor)**
    - [ ] UI Implementation (Large touch targets)
    - [ ] Feedback (Toast/Sound)

- [ ] **Relative View (The Observer/Helper)**
    - [ ] UI Implementation (Dashboard/Status)
    - [ ] Remote Control (if applicable)

- [ ] **Verification (The Switch)**
    - [ ] Test: Action in Senior View → Visible in Relative View?
    - [ ] Test: Action in Relative View → Visible in Senior View?
```

## 3. Shared Component Architecture 🧩

Avoid duplicating UI logic. If a card or widget appears in both views (even with slight differences), abstract it.

- **Bad**: `SeniorStatusCard.jsx` and `RelativeStatusCard.jsx` (duplicates logic)
- **Good**: `StatusCard.jsx` with `mode="senior" | "relative"` prop.
- **Good**: `Shared/` folder for common widgets.

## 4. Development Habits 🛠️

1.  **Simultaneous Browsers**: Always keep two browser windows open during dev:
    - Window 1: `userProfile.role = 'senior'`
    - Window 2: `userProfile.role = 'relative'`
    - *Watch real-time sync happen as you code.*

2.  **Grep Audit**: When changing a prop or constant, `grep` for it across the *entire* `src` folder, not just the file you're working on.

---
*Follow this guide to prevent "One-Sided Feature" bugs.*
