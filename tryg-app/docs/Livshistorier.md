# Family Heirloom (Livshistorier) - Walkthrough

The Family Heirloom feature transforms the app from a "burden manager" into a legacy-preserving tool by allowing seniors to record audio stories in response to weekly questions.

## Changes Made

### New Files Created

| File | Purpose |
|------|---------|
| [AudioRecorder.tsx](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/features/memories/AudioRecorder.tsx) | Modular audio recording component with visual feedback |
| [useMemories.ts](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/features/memories/useMemories.ts) | Hook for uploading to Firebase Storage and saving to Firestore |
| [MemoriesGallery.tsx](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/features/memories/MemoriesGallery.tsx) | Life Book gallery for relatives to browse memories |

---

### Modified Files

| File | Changes |
|------|---------|
| [WeeklyQuestionWidget.tsx](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/features/weeklyQuestion/WeeklyQuestionWidget.tsx) | Added text/audio toggle, integrated AudioRecorder, audio playback for answers |
| [useWeeklyQuestions.ts](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/features/weeklyQuestion/useWeeklyQuestions.ts) | Added `audioUrl` field to `WeeklyAnswer` type |
| [CoordinationTab.tsx](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/components/CoordinationTab.tsx) | Integrated `MemoriesGallery` for relatives |
| [da.json](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/locales/da.json), [bs.json](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/locales/bs.json), [tr.json](file:///c:/Users/dinko/Projects/PNWS/tryg-app/src/locales/tr.json) | Added 20+ translation keys for recording UI |

---

## Mirror Protocol Compliance

| Role | Experience |
|------|------------|
| **Senior** | Can toggle between text and audio when answering weekly questions. Recording includes visual feedback and playback. |
| **Relative** | Sees audio answers in the Weekly Question feed with a play button. Can browse all memories in the "Livsbog" section on the Coordination tab. |

---

## Verification Results

- ✅ **Build:** `npm run build` completed successfully
- ⏳ **Manual Testing:** Ready for browser testing

## Next Steps

1. Run `npm run dev` and open the app as a Senior
2. Navigate to the Weekly Question modal
3. Toggle to "Fortæl" (Audio) mode
4. Record a short test message
5. Switch to Relative view and verify the audio appears

