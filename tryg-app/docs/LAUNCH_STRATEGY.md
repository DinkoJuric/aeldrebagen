# Launch Strategy: MVP → Loveable → Launch

A strategic guide for shipping Tryg professionally.

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [The Machiavellian Principles](#the-machiavellian-principles)
2. [Launch Phases](#launch-phases)
3. [Professional Habits to Adopt](#professional-habits-to-adopt)
4. [Messaging & Pitching](#messaging--pitching)
5. [Your Immediate Next Steps](#your-immediate-next-steps)
6. [Metrics That Matter](#metrics-that-matter)


---

## The Machiavellian Principles

> "Everyone sees what you appear to be, few experience what you really are."

### 1. **Ship Early, Control Perception**
Don't wait for perfection. Ship something that *feels* polished to the user, even if backend is held together with localStorage and prayers.

### 2. **Feature Flags are Your Ally**
Never remove code, only hide it. You can:
- Demo a "stable" version to stakeholders (flags off)
- Test experimental features yourself (flags on)
- Rollback in seconds, not hours

### 3. **Tests Protect Your Reputation**
When something breaks in production, the question isn't "who broke it" but "did you have tests?"

---

## Launch Phases

### Phase A: Internal Testing (Current)
- ✅ MVP features working
- ✅ Feature flags for experimental UI
- ✅ Unit tests for core logic
- 🔄 Designer feedback on tabbed layout

**Gate:** Designer approves core UI

---

### Phase B: Beta Testing (1-2 weeks)

**Goal:** Real users, controlled environment

**Without a Mac (TestFlight alternatives):**

| Option | Description | Best For |
|--------|-------------|----------|
| **PWA** | Add to Home Screen on iOS/Android | Quick testing, no app store |
| **GitHub Pages** | Already deployed | Web-only users |
| **Appetize.io** | iOS simulator in browser | Demo without real device |
| **MacStadium** | Cloud Mac rental ($49/mo) | If you need TestFlight later |
| **Friend with Mac** | They build, you distribute | Free, but coordination needed |

**Recommended:** Use **PWA** for beta. Add this to your index.html:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/icon-192.png">
```

**Gate:** 3+ real users complete daily tasks for 1 week

---

### Phase C: Polish Sprint (3-5 days)

Based on beta feedback, prioritize:
1. Critical bugs (anything that blocks core flow)
2. Confusion points (where users got stuck)
3. Performance issues (slow loads, battery drain)

**NOT in scope:**
- New features (add to backlog)
- "Nice to haves" (future version)

**Gate:** Zero critical bugs in 48 hours

---

### Phase D: Launch

**For Web (GitHub Pages):**
1. Custom domain (optional)
2. Add analytics (Vercel Analytics or Plausible)
3. Social sharing meta tags

**For iOS (when ready):**
1. Get access to a Mac (rent/borrow)
2. Follow IOS_DEPLOYMENT.md
3. Submit to TestFlight → App Store

---

## Professional Habits to Adopt

### 1. **Semantic Versioning**
```
v1.3.0 → v1.3.1 (bug fix)
v1.3.0 → v1.4.0 (new feature)
v1.3.0 → v2.0.0 (breaking change)
```

### 2. **Git Tags for Releases**
```bash
git tag v1.4.0 -m "Released with tabbed layout"
git push --tags
```

### 3. **CHANGELOG Discipline**
Every version gets an entry. Future you will thank present you.

### 4. **Tests Before Features**
Write a failing test → Write code → Test passes → Commit

### 5. **Feature Flags by Default**
New feature? Wrap it in a flag. Always.

---

## Messaging & Pitching

### The Porch Light Metaphor

> *"Tryg is like leaving the porch light on for your parents — a quiet signal that says 'I'm thinking of you' without the intrusion of knocking on their door five times a day."*

Use this to differentiate from Life360 and medical alert buttons (surveillance vs. connection).

### 1-Sentence Pitch (for elevators)

> *"Tryg gives adult children daily peace of mind that their aging parent is okay — without surveillance, micromanagement, or awkward daily phone calls."*

### 3-Sentence Pitch (for meetings)

> *"Tryg is a Danish elder care app that replaces the 'daily worry call' with a simple 'mor har det godt' check-in system. Unlike GPS trackers that treat seniors like children, Tryg is bidirectional — parents can see what their adult kids are up to too, making it feel like connection, not surveillance. It bundles medication reminders, symptom tracking, and family status into one calm interface designed for 70+ year olds with tremors, reduced vision, and Danish sensibilities."*

---

## Your Immediate Next Steps

1. **Get designer feedback** on GitHub Pages deployment
2. **Test PWA install** on an iPhone (Add to Home Screen)
3. **Find 2-3 beta users** (ideally actual elderly + family pairs)
4. **Set up error tracking** (Sentry or LogRocket)

---

## Metrics That Matter

| Metric | What It Tells You |
|--------|-------------------|
| Daily active sessions | Is it useful? |
| Task completion rate | Is it usable? |
| Time in app | Is it engaging? |
| Symptom logs per week | Is health tracking working? |
| Pings sent | Is connection feature valued? |

---

> "The wise man does at once what the fool does finally."
> — Machiavelli

Ship it. Iterate. Ship again.
