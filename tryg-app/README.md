# Tryg App

A React-based care coordination app for elderly users and their families.

**Live Demo:** https://dinkojuric.github.io/aeldrebagen/

📖 **Developer Guide:** See [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for architecture and history.


---

## Quick Start

```bash
cd tryg-app
npm install
npm run dev
```

Open http://localhost:5174 in your browser.

---

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development with hot reload |
| `npm run build` | Default build (Capacitor/iOS) |
| `npm run build:pages` | GitHub Pages deployment |
| `npm run build:ios` | Build + sync to iOS project |

---

## Feature Flags

Toggle features on/off in `src/config/features.js`:

```javascript
export const FEATURES = {
    weeklyQuestion: true,      // ← Set to false to disable
    memoryTriggers: true,
    helpExchange: true,
    familyStatusCard: true,
    thinkingOfYou: true,
    // etc.
};
```

Components use: `{FEATURES.weeklyQuestion && <Component />}`

---

## Sharing for Testing

### Option 1: GitHub Pages (Permanent)
https://dinkojuric.github.io/aeldrebagen/

Auto-deploys on every push to `main`.

### Option 2: LocalTunnel (Temporary)

```bash
# Start tunnel
npx localtunnel --port 5174

# Stop tunnel
# Press Ctrl+C in the terminal where tunnel is running
```

Share the generated URL (e.g., `https://xyz.loca.lt`).

**Security Warning:**
- The public URL is temporary and accessible to anyone who has the link.
- **Do not** expose sensitive data.
- For more secure sharing, consider using a service with authentication like [ngrok](https://ngrok.com/) or [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/).

**Troubleshooting:**
- 503 errors = LocalTunnel servers may be overloaded, try again later.
- Slow/hanging = Consider the alternatives mentioned above.
- LocalTunnel is free but can be unreliable; GitHub Pages is more stable for persistent demos.

---

## iOS Deployment

See [IOS_DEPLOYMENT.md](./IOS_DEPLOYMENT.md) for TestFlight instructions.

---

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS v4
- Capacitor (iOS)
- Web Audio API (sounds)
- localStorage (persistence)

---

## Version Control & Reverting Changes

### Git Tags (Checkpoints)

Tags are permanent bookmarks in Git history. Use them to safely experiment:

```bash
# List all tags
git tag

# View a tag's details
git show v1.3-before-tabs

# Temporarily view old version
git checkout v1.3-before-tabs

# Return to current version
git checkout main
```

### How to Revert

**Easy way** (keep code, just hide): Set feature flag to `false` in `features.js`

**Hard revert** (remove all code since a tag):
```bash
git revert --no-commit v1.3-before-tabs..HEAD
git commit -m "Revert to pre-tabs version"
```

### Current Tags

| Tag | Description |
|-----|-------------|
| `v1.3-before-tabs` | Before tabbed layout experiment |

---

## Color System

| Element | Senior (teal) | Relative (indigo) | Neutral |
|---------|---------------|-------------------|---------|
| Primary accent | `teal-600` | `indigo-600` | - |
| Light background | `teal-50` | `indigo-50` | `stone-50` |
| Avatar background | `teal-100` | `indigo-100` | `stone-200` |
| Text | `teal-700` | `indigo-700` | `stone-700` |
