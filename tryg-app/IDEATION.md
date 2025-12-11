# Tryg App - Feature Ideation

A living document for brainstorming features that could make Tryg more valuable.

---

## 🎯 High-Value / Low-Effort (MVP+1)

### Voice Check-in
> *"Hey Tryg, jeg har det godt"*
- Hands-free check-in for seniors with motor difficulties
- Could use Web Speech API (browser-native, no backend)
- Reduces friction to near-zero

### Photo Upload for Relatives
- Let relatives upload "reward photos" themselves
- Creates ongoing engagement loop
- Simple: just file input + localStorage blob

### Notification Sound Customization
- Seniors may have hearing preferences
- Offer 3-4 preset sounds (gentle chime, voice prompt, etc.)

---

## 🌟 High-Value / Medium-Effort

### Real-time Sync Between Devices
- Current: localStorage is device-local
- Add Firebase/Supabase for cross-device sync
- Family member sees live updates when senior completes tasks

### Push Notifications (PWA)
- Convert to Progressive Web App
- Service worker for background notifications
- "Time for your pills" even when app is closed

### Weekly Health Summary Email
- Auto-generated report to relatives/doctors
- Medication adherence %, symptom patterns, activity trends
- Could use a simple cron + email API

### Medication Refill Reminders
- Track pill count alongside schedule
- Alert when running low: "Du har 3 dage tilbage af Hjertemedicin"

---

## 💡 Experimental / Research-Worthy

### Passive Activity Detection
- Use device sensors to detect movement patterns
- Alert if no activity detected for X hours
- Privacy-sensitive: needs careful UX framing

### AI-Powered Symptom Triage
- "You've logged 'svimmelhed' 3 times this week - consider contacting your doctor"
- Pattern recognition across symptom history
- Requires medical disclaimer and careful design

### Social Connection Features
- Let multiple relatives share monitoring
- "Family circle" where grandchildren can send voice messages
- Balances safety with reducing isolation

### Gamification for Engagement
- Streaks: "7 days of morning routines completed!"
- Gentle, non-punishing - celebrates consistency
- Could tie into reward photos

---

## 🔒 Trust & Safety Considerations

- **Privacy**: Any sync feature needs explicit consent UX
- **Autonomy**: Avoid surveillance feeling - emphasize mutual care
- **Accessibility**: All new features must pass large-text, high-contrast checks
- **Offline-first**: Denmark has rural areas with poor connectivity

---

## 📝 User Research Questions

1. What's the #1 anxiety relatives have that we could address?
2. How often do seniors actually want to be "checked on"?
3. Would seniors use voice features, or do they prefer touch?
4. What medical data would doctors actually find useful?

---

*Last updated: 2025-12-11*
