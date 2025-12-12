---
description: How to get up to speed on the Tryg app project
---

# Tryg App Onboarding

Follow these steps to understand and work on the Tryg senior care app.

## 1. Understand the Project

Read these docs in order:
1. `docs/ARCHITECTURE.md` - System overview, hooks, data model
2. `docs/IDEATION.md` - Philosophy and design principles
3. `docs/ROADMAP.md` - Feature planning

## 2. Understand the Codebase

Key files to understand:
- `src/AppCore.jsx` - Main app with Firebase hooks
- `src/components/SeniorView.jsx` - Elder interface
- `src/components/RelativeView.jsx` - Family dashboard
- `src/hooks/` - All Firebase data hooks

## 3. Local Development Setup

```bash
cd tryg-app
cp .env.example .env.local
# Fill in Firebase credentials
npm install
npm run dev
```

## 4. Key Patterns

- **Firebase Hooks**: Each hook subscribes to Firestore with `onSnapshot`
- **Role-Based Views**: View determined by `userProfile.role`
- **Feature Flags**: Toggle in `src/config/features.js`

## 5. Deployment

See `docs/DEPLOYMENT.md` for:
- Environment variable setup
- GitHub Secrets configuration
- Firebase setup

## 6. Security

See `docs/SECURITY.md` for:
- Firestore rules
- Known limitations
- Vulnerability checklist
