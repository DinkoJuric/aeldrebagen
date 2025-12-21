# Security Documentation

> Security model, authentication, and known limitations

> **Note to Agents:** Always update the Table of Contents below when adding new sections.

## 📖 Table of Contents
1. [Authentication](#authentication)
2. [Authorization Model](#authorization-model)
3. [Firestore Security Rules](#firestore-security-rules)
4. [Environment Variables](#environment-variables)
5. [Known Limitations](#known-limitations)
6. [Vulnerability Checklist](#vulnerability-checklist)
7. [Incident Response](#incident-response)
8. [Related](#related)


## Authentication

### Providers
- **Email/Password**: Standard signup/login
- **Google OAuth**: One-click sign-in

### Flow
1. User signs up with email and password
2. Firestore profile created with role selection (senior/relative)
3. GDPR consent recorded with timestamp
4. User creates or joins care circle

---

## Authorization Model

### Care Circle Membership

Users must be members of a care circle to access shared data:

```javascript
function isMemberOfCircle(circleId) {
  return exists(/careCircleMemberships/{circleId}_{userId});
}
```

### Role-Based Access

| Role | Can View | Can Edit |
|------|----------|----------|
| Senior | Own tasks, symptoms | Complete tasks, log symptoms |
| Relative | Senior's tasks, symptoms | Add reminders, family status |

---

## Firestore Security Rules

Located in `firestore.rules`:

```javascript
// Users can only read/write their own profile
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// ADMIN OVERRIDE (POC ONLY)
// Allows admin email to bypass all checks for circle maintenance
match /careCircleMemberships/{document=**} {
  allow read, write: if request.auth.token.email == 'dinko1991@hotmail.com';
}

// Circle members can read/write shared data

match /careCircles/{circleId}/tasks/{taskId} {
  allow read, write: if isMemberOfCircle(circleId);
}

// Member statuses: anyone in circle can read, only self can write
match /careCircles/{circleId}/memberStatuses/{userId} {
  allow read: if isMemberOfCircle(circleId);
  allow write: if request.auth.uid == userId && isMemberOfCircle(circleId);
}
```

### Deploying Rules
```bash
firebase deploy --only firestore:rules
```

---

## Environment Variables

Sensitive values stored as environment variables:

| Variable | Purpose | Exposure Risk |
|----------|---------|---------------|
| `VITE_FIREBASE_API_KEY` | Identifies Firebase project | Low (public by design) |
| `VITE_FIREBASE_APP_ID` | App identifier | Low |

**Note**: Firebase API keys are designed to be public. Security comes from Firestore rules, not API key secrecy.

---

## Known Limitations

### PWA Limitations
- **Battery API**: Not available in most browsers (removed from display)
- **Push Notifications**: Limited on iOS (requires Safari 16.4+, app added to home screen)

### Data Privacy
- **GDPR Consent**: Recorded in user profile with timestamp
- **Data Export**: Users can download their data as JSON
- **Account Deletion**: Deletes user profile, circle membership, and all shared data

### Photo Feature
- Requires Firebase Blaze (pay-as-you-go) plan
- Currently disabled via feature flag

---

## Vulnerability Checklist

| Risk | Status | Mitigation |
|------|--------|------------|
| API key exposure | ✅ Mitigated | Firebase rules protect data |
| Unauthorized data access | ✅ Protected | Firestore rules check membership |
| XSS attacks | ✅ Protected | React automatic escaping |
| CSRF attacks | ✅ Protected | Firebase Auth handles tokens |
| Data in transit | ✅ Protected | HTTPS enforced by GitHub Pages |

---

## Incident Response

If security issue discovered:
1. Rotate Firebase API key (Google Cloud Console)
2. Update GitHub Secrets
3. Re-deploy
4. Notify affected users if data was accessed

---

## Related

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [firebase_learnings.md](./firebase_learnings.md) - Lessons learned
