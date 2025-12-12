# Firebase Integration Learnings

> Lessons from building multi-user real-time sync for Tryg (December 2025)

---

## 🎯 What Went Wrong (And How We Fixed It)

### 1. Hardcoded Names Scattered Everywhere

**Issue**: "Birthe" and "Louise" were hardcoded in 12+ places across components.

**Root Cause**: Demo-first development → names used as placeholders → forgotten when going multi-user.

**Fix**: Passed dynamic props (`userName`, `seniorName`, `relativeName`) from AppCore down through all views.

**Lesson**: When building a demo, use placeholder constants like `DEMO_SENIOR_NAME` that are obviously temporary. Makes grep-and-replace trivial later.

---

### 2. Signup Flow Showed Wrong Screen

**Issue**: New users saw circle setup immediately after signup instead of consent modal.

**Root Cause**: `signUp` function created user in Firebase Auth + Firestore, but `userProfile` state wasn't updated locally. The `onAuthStateChanged` listener would eventually fetch it, but React rendered the wrong screen in the gap.

**Fix**: Set `userProfile` immediately after `createUserProfile()`:
```javascript
setUserProfile({
    ...profileData,
    consentGiven: false,
    consentTimestamp: null,
});
```

**Lesson**: When creating user documents, update local state synchronously. Don't rely on Firestore listeners for immediate UI state changes.

---

### 3. Features Not Syncing Across Devices

**Issue**: Weekly questions and pings worked locally but didn't appear on partner's device.

**Root Cause**: These features still used `useState` (localStorage origin) instead of Firestore hooks.

**Fix**: Created `useWeeklyQuestions` and `usePings` hooks with Firestore real-time subscriptions.

**Lesson**: When migrating from localStorage to Firestore, audit EVERY piece of shared state. Create a checklist:
- [x] Tasks → useTasks
- [x] Symptoms → useSymptoms
- [x] Settings → useSettings
- [x] Weekly Answers → useWeeklyQuestions ← forgot this initially
- [x] Pings → usePings ← forgot this initially
- [ ] Help Offers/Requests → TODO

---

### 4. View Toggle Exposed Both Interfaces

**Issue**: Seniors could see the relative view and vice versa - violates privacy model.

**Root Cause**: Development convenience feature (toggle between views) shipped to production.

**Fix**: Removed toggle. View is now determined solely by `userProfile.role`:
```javascript
const isSenior = userProfile?.role === 'senior';
{isSenior ? <SeniorView /> : <RelativeView />}
```

**Lesson**: Development conveniences should be behind feature flags or removed before release. The toggle was useful for testing but violated the core design principle.

---

### 5. Firebase Domain Not Authorized

**Issue**: Google OAuth returned "Requested action is invalid."

**Root Cause**: GitHub Pages domain (`dinkojuric.github.io`) not in Firebase authorized domains list.

**Fix**: Firebase Console → Authentication → Settings → Authorized domains → Add domain.

**Lesson**: When deploying to new domains, always check:
1. Firebase Auth authorized domains
2. CORS settings if using Cloud Functions
3. OAuth redirect URIs

---

## 💡 What Worked Well

### Feature Flags for Mode Switching

```javascript
useFirebase: true  // Enable Firebase mode
useFirebase: false // Fall back to localStorage demo
```

This allowed testing Firebase integration without breaking the demo deployment.

### Props-Down Architecture

Passing `user`, `userProfile`, `careCircle` from `AppWithAuth` → `AppCore` → Views kept auth state centralized and predictable.

### Firestore Hook Pattern

Each hook follows the same pattern:
1. Subscribe to collection with `onSnapshot`
2. Update local state on changes
3. Provide mutation functions (add, update, delete)
4. Return loading/error states

---

## 📋 Pre-Launch Checklist (Derived from Bugs)

Before deploying multi-user features:

- [ ] Grep for hardcoded demo names/values
- [ ] Verify signup → consent → setup flow
- [ ] Test real-time sync on two devices
- [ ] Check role-based view isolation
- [ ] Add deployment domain to Firebase Auth
- [ ] Audit all shared state for Firestore migration

---

## 🔗 Related Documentation

- [Implementation Plan](./implementation_plan.md) - Original Firebase architecture
- [IDEATION.md](./IDEATION.md) - Anti-surveillance philosophy (why view isolation matters)
- [Competitor Analysis](./competitor_analysis.md) - Why invite codes over email lookup

---

## 6. Secrets Don't Trigger Builds

**Issue**: User added GitHub Secrets, but app showed white screen 8 hours later.

**Root Cause**: Adding secrets to GitHub doesn't trigger a workflow run. The previous build had empty `import.meta.env.*` values baked in.

**What Should Have Happened**:
```bash
# After adding secrets, always trigger rebuild
git commit --allow-empty -m "chore: trigger rebuild with secrets"
git push
```

**Lesson for Agents**: When a user says "push" after a CI/CD configuration change (secrets, env vars, workflow edits), don't check `git status` - think about whether a **rebuild** is needed, not whether there are file changes.

**Pattern to Recognize**:
- User adds GitHub Secrets → Need rebuild
- User edits workflow file → Will auto-rebuild on push
- User changes env vars in Vercel/Netlify → Usually auto-rebuilds
- User changes Firebase config → May need cache clear

**Prevention**: After any environment/secrets change, always ask: "Do we need to trigger a new build for this to take effect?"
