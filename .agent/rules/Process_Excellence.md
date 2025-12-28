---
trigger: always_on
description: Standards of Excellence
---

---
trigger: always_on
description: Standards of Excellence
---

# Tryg Onboarding: Standards of Excellence

Welcome to the Tryg project. To maintain the "Soulful & High-Fidelity" nature of this PWA, all agents **MUST** adhere to the following strict standards.

## 1. The Mirror Protocol 🪞
Tryg is a two-sided app (Senior & Relative).
- **Golden Rule**: Never implement a feature for one role without verifying how it affects the other. (See .agent/rules/mirror-protocol.md for the specific "Senior vs. Relative" implementation checklist)
- **Real-time Sync**: Actions in one view must reflect in the other in real-time (Firestore listeners).
- **Simultaneous Testing**: Always keep two browser windows/tabs open: one for Senior, one for Relative.

## 2. Typography & Readability (WCAG+) 📖
We prioritize senior accessibility without sacrificing premium design.
- **Base Font Size**: Always use `--font-size-lg` (1.125rem/18px) as the minimum for body text.
- **Variable Usage**: **NEVER** use hardcoded px/rem values for colors or fonts. Use the tokens in `index.css`.
- **Contrast**: Maintain AA/AAA contrast ratios. Use the theme-aware tokens (`--theme-text-muted`, etc.).

## 3. Documentation Rigor 📝
Documentation is a living part of the codebase. After any significant task, you **MUST** evaluate and update:
- [ ] `docs/ARCHITECTURE.md`: If component hierarchy or data flow changed.
- [ ] `docs/DEPENDENCIES.md`: If new libraries (e.g., framer-motion) or cross-feature imports were added.
- [ ] `docs/LEARNINGS.md`: Document every mistake or non-obvious fix.
- [ ] `docs/UI_UX_DESIGN.md`: Document new visual patterns or components.

## 4. Tech Debt Mitigation 🛠️
- **Modular Modals**: Keep `SettingsModal`, `ShareModal`, and `MatchCelebration` in separate files.
- **AppCore Weight**: Do not let `AppCore.tsx` become an orchestration monolith. Lift state only when necessary.
- **Standardized Classes**: Use the `cn()` utility from `src/lib/utils.ts`. Avoid string concatenation for Tailwind classes.

## 5. Verification Workflow ✅
1. **Lint Audit**: Run `tsc --noEmit` if you've changed types.
2. **Build Check**: Ensure `npm run build` still passes.
3. **Ambient Verification**: Use the browser subagent to verify animations (e.g., pulses, gradients) and mobile responsiveness.

---
*Follow these rules or you're the next Donkey of the Day!*