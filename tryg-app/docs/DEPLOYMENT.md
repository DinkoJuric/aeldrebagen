# Deployment Guide

> How to deploy and maintain Tryg App

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [Hosting Architecture](#hosting-architecture)
2. [Environment Variables](#environment-variables)
3. [Deploy Commands](#deploy-commands)
4. [Firebase Setup](#firebase-setup)
5. [Authorized Domains](#authorized-domains)
6. [Troubleshooting](#troubleshooting)
7. [iOS / Capacitor Deployment](#ios--capacitor-deployment)
8. [Related](#related)


## Hosting Architecture

```
GitHub Repository (DinkoJuric/aeldrebagen)
         ↓ push to main
GitHub Actions (build workflow)
         ↓ npm run build:pages
GitHub Pages (static hosting)
         ↓
https://dinkojuric.github.io/aeldrebagen/
```

---

## Environment Variables

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase values (from Firebase Console):
   ```
   VITE_FIREBASE_API_KEY=<your-api-key>
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

### Production (GitHub Actions)

Add secrets to GitHub repository:

1. Go to: https://github.com/DinkoJuric/aeldrebagen/settings/secrets/actions
2. Click "New repository secret"
3. Add each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

## Deploy Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build (local testing) |
| `npm run build:pages` | Production build for GitHub Pages |
| `npm run preview` | Preview production build locally |

---

## Firebase Setup

### Required Services

- **Authentication**: Email/Password + Google OAuth
- **Firestore**: Real-time database
- **Storage**: Photo uploads (requires Blaze plan)

### Console Links

- [Firebase Console](https://console.firebase.google.com/project/tryg-app-c1a93)
- [Auth Settings](https://console.firebase.google.com/project/tryg-app-c1a93/authentication)
- [Firestore](https://console.firebase.google.com/project/tryg-app-c1a93/firestore)
- [Storage](https://console.firebase.google.com/project/tryg-app-c1a93/storage)

### Deploy Security Rules

Firestore rules (in `firestore.rules`):
```bash
firebase deploy --only firestore:rules
```

Storage rules (in `storage.rules`):
```bash
firebase deploy --only storage:rules
```

Or deploy via Firebase Console directly.

---

## Authorized Domains

Add deployment domains to Firebase Auth:
1. Go to: Firebase Console → Authentication → Settings → Authorized domains
2. Add: `dinkojuric.github.io`

---

## Troubleshooting

### Build Fails on GitHub Actions
- Check secrets are set correctly
- Verify secret names match exactly (case-sensitive)

### Auth "Invalid action" Error
- Add domain to Firebase authorized domains list

### App Shows Blank Screen
- Check browser console for errors
- Verify environment variables are set
- Try hard refresh (Ctrl+Shift+R)

---

## Related

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [SECURITY.md](./SECURITY.md) - Security configuration

---

## iOS / Capacitor Deployment

### Prerequisites
- macOS with Xcode 15+
- Apple Developer Account ($99/year)

### Quick Start
1. **Build Web App**:
   ```bash
   npm run build
   npx cap sync ios
   ```
2. **Open Xcode**:
   ```bash
   npx cap open ios
   ```
3. **Configure Signing**: 
   - Select 'App' → 'Signing & Capabilities' → Select Team.
   - Bundle Identifier: `dk.tryg.app` (must match App Store Connect).

### TestFlight Upload
1. Set Version/Build in Xcode (General tab).
2. Select "Any iOS Device" as target.
3. **Product** → **Archive**.
4. Click **Distribute App** → **App Store Connect** → **Upload**.
5. Manage testers in [App Store Connect](https://appstoreconnect.apple.com).

### Troubleshooting iOS
| Issue | Solution |
|-------|----------|
| Signing error | Add Apple Developer account in Xcode preferences |
| Old content shown | Run `npx cap sync ios` after web build |
| White screen | Check `viewport-fit` meta tag or console logs via Safari Develop menu |

