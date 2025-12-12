---
description: How to get up to speed on the Tryg app project
---

# Onboarding for New AI Sessions

When starting a new session on this project, read these files in order:

1. **README.md** (5 min) - Quick start, build commands, feature flags
2. **docs/walkthrough.md** (10 min) - What was built and why
3. **docs/competitor_analysis.md** (15 min) - Market research and strategy
4. **IDEATION.md** (5 min) - Feature philosophy and roadmap

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/config/features.js` | Feature flags to toggle features |
| `src/data/constants.js` | Tasks, symptoms, profile data |
| `src/components/SeniorView.jsx` | Main senior interface |
| `src/components/RelativeView.jsx` | Family dashboard |
| `CHANGELOG.md` | Version history |

## Current State

- Dev server: `npm run dev` (port 5174)
- Live: https://dinkojuric.github.io/aeldrebagen/
- Version: 1.3.x
- Backend: localStorage (Firebase migration planned)

## After Making Changes

1. Update `docs/walkthrough.md` if adding major features
2. Update `CHANGELOG.md` with version notes
3. Git commit with conventional commit format (`feat:`, `fix:`, etc.)
