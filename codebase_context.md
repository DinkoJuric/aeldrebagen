# Codebase Context: aeldrebagen


## File: package.json
```json
{
  "name": "tryg-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:pages": "vite build --mode pages",
    "build:ios": "vite build && npx cap sync ios",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  },
  "dependencies": {
    "@capacitor/cli": "^8.0.0",
    "@capacitor/core": "^8.0.0",
    "@capacitor/ios": "^8.0.0",
    "@sentry/react": "^10.30.0",
    "firebase": "^12.6.0",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.559.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.17",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^25.0.3",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "dotenv": "^17.2.3",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "husky": "^9.1.7",
    "jsdom": "^27.3.0",
    "lint-staged": "^16.2.7",
    "tailwindcss": "^4.1.17",
    "typescript": "^5.9.3",
    "vite": "^7.2.4",
    "vite-plugin-pwa": "^1.2.0",
    "vitest": "^4.0.15"
  },
  "lint-staged": {
    "*.{js,jsx}": "eslint --fix"
  }
}

```
---

## File: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const baseUrl = mode === 'pages' ? '/aeldrebagen/' : './';

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt', // Show update prompt instead of auto-updating
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Tryg - Familiens Omsorg',
          short_name: 'Tryg',
          description: 'Hold øje med din familie - med omsorg og værdighed',
          theme_color: '#0d9488',
          background_color: '#f5f5f4',
          display: 'standalone',
          orientation: 'portrait',
          start_url: baseUrl, // Dynamic start_url based on deployment
          scope: baseUrl,     // Dynamic scope
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/picsum\.photos\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'daily-photos',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                }
              }
            }
          ]
        }
      })
    ],
    // Use relative paths for Capacitor, absolute for GitHub Pages
    // Run: npm run build:pages for GitHub Pages deployment
    base: baseUrl,
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    // Allow external hosts for tunneling (localtunnel, ngrok, etc.)
    server: {
      allowedHosts: 'all'
    }
  };
});

```
---

## File: IDEATION.md
```md
# Tryg App - Feature Ideation

A living document for brainstorming features that could make Tryg more valuable.

> **Core Philosophy Shift**: Tryg is not a monitoring tool. It's a **shared family space** where connection flows both ways. The senior is a **host and contributor**, not a data source.

---

## 🌟 Connection-First Features (Priority)

### Bidirectional Visibility ("Mirror Features") ✅ IMPLEMENTED
The key to avoiding surveillance: **reciprocity by default**.

| Senior Sees | Family Sees |
|-------------|-------------|
| "Louise er på arbejde" | "Mor har det godt" |
| "Børnene er kommet hjem fra skole" | "Farmor tog sin morgen medicin" |
| "Emma løb 5km i morges" | "Farmor har gået en tur i haven" |

**Implementation**: ✅ `FamilyStatusCard.jsx` shows relative's status (work, home, traveling, available, busy). Picker in RelativeView, display in SeniorView.

---

### Shared Moments (Not Data)
Replace "health dashboard" with **shared experiences**.

**Photo Exchange**
- **Daily Photo Ritual**: Family sends one photo → Senior sees it as "Dagens Billede" (already built!)
- **Two-Way**: Senior can share photos back (simplified camera UI)
- **Reactions**: Simple emoji reactions (❤️ 😊 👍) on shared content

**Voice Notes** 
- 30-second voice clips instead of text (better for motor issues)
- Grandchildren recording "Godmorgen Farmor!" as morning greeting
- Senior can respond with voice, not typing

**"Jeg tænker på dig" Button** ✅ IMPLEMENTED
- ✅ One-tap "thinking of you" ping (`ThinkingOfYou.jsx`)
- ✅ Visual: Heart animation on recipient's screen
- ✅ Pink toast notification with auto-dismiss
- ✅ Web Audio ping sound for emotional feedback

---

### Weekly Rituals ✅ IMPLEMENTED

**Family Question of the Week**
> "Hvad var det bedste øjeblik denne uge?"

- ✅ Everyone answers (family + senior) via `WeeklyQuestionCard.jsx`
- ✅ Creates shared stories and memories
- ✅ Displayed as a carousel of answers
- ✅ 8 rotating questions based on week number

**Sunday Coffee Chat**
- Scheduled video drop-in time
- "Kafferum" indicator shows who's available
- Low-pressure, can leave anytime

---

### Dignity-Preserving Help Requests ✅ IMPLEMENTED

Instead of: "Alert: Mom needs help"
Reframe as: **Mutual exchange**

| Senior Can Offer | Senior Can Request |
|-----------------|-------------------|
| "Jeg kan hjælpe med at lytte" | "Kan nogen ringe mig i dag?" |
| "Jeg har en god opskrift" | "Hjælp til indkøb denne uge" |
| "Vil gerne høre om jeres dag" | "Følgeskab til lægen" |

**The senior contributes value, not just receives care.**

✅ `HelpExchange.jsx` - Two-way offers/requests with success feedback

---

## 💡 "Dancing at the Wedding" Features

Features that connect health goals to **meaningful life moments**:

### Milestone Celebrations
- "Du har gået 100 ture denne måned! 🎉"
- "Klar til at danse til Emmas bryllup"
- Connect streaks to personal goals, not abstract metrics

### Memory Triggers ✅ IMPLEMENTED
- ✅ "Husker du da...?" via `MemoryTrigger` component
- ✅ Rotating memories every 10 seconds
- ⏳ Photo memories from family shared album (TODO)

### Anticipation Calendar
- Countdown to family events
- "42 dage til Emmas bryllup"
- Daily motivation tied to real moments

---

## 🔒 Anti-Surveillance Design Principles

1. **Notification when viewed**: "Louise så din opdatering" - interaction, not silent watching
2. **Share controls**: "Del kun med nær familie / alle / kun mig"
3. **Temporary sharing**: "Del min placering de næste 2 timer"
4. **Pause mode**: "Gå på pause" - take a break from sharing
5. **Senior initiates**: Most data sharing should be senior-triggered, not automatic

---

## 🏥 Health Tracking Enhancements

### Body Pain Mapping ✅ IMPLEMENTED
When senior clicks "Jeg har ondt" → "Smerter", they can tap WHERE on their body:
- ✅ `BodyPainSelector.jsx` with large touch-friendly grid
- ✅ Regions: Head, Neck, Chest, Arms (L/R), Stomach, Back, Legs (L/R)
- ✅ Stored with timestamp and shown in doctor report
- ⏳ TODO: Visual history ("You've had head pain 3 times this week")

### Pain Severity Scale
- After location, ask "Hvor ondt?" (How much?)
- 3-level pictogram: 🙂 Lidt → 😐 Noget → 😣 Meget
- Avoid clinical 1-10 scales - too complex for seniors

### Symptom Patterns
- Weekly summary: "Du har ofte hovedpine om morgenen"
- Helpful for doctor consultations
- Non-alarming presentation

---

## 🎯 High-Value / Low-Effort (MVP+1)

| Feature | Connection Value | Effort | Status |
|---------|-----------------|--------|--------|
| Two-way status ("Louise er...") | ★★★★★ | 2h | ✅ Done |
| "Tænker på dig" one-tap ping | ★★★★★ | 1h | ✅ Done |
| Voice note sharing | ★★★★☆ | 4h | ⏳ TODO |
| Simple photo sharing from senior | ★★★★☆ | 3h | ⏳ TODO |
| Emoji reactions on photos | ★★★★☆ | 2h | ⏳ TODO |

---

## 📚 Research References

- **Reciprocity in eldercare apps**: Bidirectional features reduce surveillance perception
- **Shared activities > monitoring**: Connection comes from doing things together
- **Agency and control**: Strong privacy controls build trust
- **Voice-first**: Better for motor/vision issues and feels more personal
- **Participatory design**: Co-design with actual seniors

Sources: JMIR Formative Research, ACM CHI, PMC studies on technology for reducing elderly loneliness

---

*Last updated: 2025-12-11*

```
---

## File: tryg-app\src\App.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { PingNotification } from './features/thinkingOfYou';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_TASKS, SENIOR_PROFILE } from './data/constants';
import { playCompletionSound, playSuccessSound } from './utils/sounds';
import { FEATURES } from './config/features';
import './index.css';
import { Task } from './features/tasks/useTasks';
// import { UserProfile } from './types'; // Removed unused import

export default function TrygApp() {
    const [view, setView] = useState('senior');
    const [tasks, setTasks] = useLocalStorage<Task[]>('tryg-tasks', INITIAL_TASKS as Task[]);
    const [lastCheckIn, setLastCheckIn] = useLocalStorage<string | null>('tryg-checkin', null);
    const [symptomLogs, setSymptomLogs] = useLocalStorage<any[]>('tryg-symptoms', []);
    const [familyStatus, setFamilyStatus] = useLocalStorage<string>('tryg-family-status', 'work');
    const [activePing, setActivePing] = useState<any | null>(null);
    const [notification, setNotification] = useState<any | null>(null);

    // Phase 5: Emotional Connection state
    const [weeklyAnswers, setWeeklyAnswers] = useLocalStorage<any[]>('tryg-weekly-answers', []);
    // const [helpOffers, setHelpOffers] = useLocalStorage<any[]>('tryg-help-offers', []); // Unused in TSX views
    // const [helpRequests, setHelpRequests] = useLocalStorage<any[]>('tryg-help-requests', []); // Unused in TSX views

    // Simulated notification after 5 seconds (only if enabled)
    useEffect(() => {
        if (!FEATURES.demoNotification) return;
        const timer = setTimeout(() => {
            setNotification({
                title: "Husk at drikke vand",
                body: "Det er tid til dit glas vand kl. 10:00",
                icon: Activity
            });
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    // Clear notification after 4 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const toggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        const willBeCompleted = task && !task.completed;

        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));

        // Play sound when completing (not uncompleting)
        if (willBeCompleted) {
            playCompletionSound();
        }
    };

    const handleCheckIn = (status: string) => {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        setLastCheckIn(timeString);
        if (status === 'checked-in') {
            playSuccessSound(); // Celebratory sound for check-in
        }
    };

    const addSymptom = (symptomType: any) => {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        setSymptomLogs(prev => [{
            ...symptomType,
            time: timeString,
            date: new Date().toLocaleDateString('da-DK')
        }, ...prev]);

        console.log('Symptom logged:', symptomType.label);
    };

    const handleAddTaskFromRelative = (newTask: Partial<Task>) => {
        // Mock ID generation
        // const newId = Math.max(...tasks.map(t => typeof t.id === 'number' ? t.id : 0), 0) + 1;
        // Using string IDs to match Task interface
        const newId = `local_${Date.now()}`;
        setTasks(prev => [...prev, { ...newTask, id: newId, completed: false } as Task]);
    };

    // Send "thinking of you" ping
    const handleSendPing = (fromName: string, toView: string) => {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
        setActivePing({
            fromName,
            toView,
            time: timeString
        });
    };

    // Weekly question answer handler
    const handleWeeklyAnswer = (answer: string) => {
        setWeeklyAnswers(prev => [answer, ...prev]);
    };

    // Help exchange handlers REMOVED because SeniorView/RelativeView fetch data internally now.
    // Demo mode does not support help exchange unless we mock the hook, which is out of scope here.

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-800 p-4 font-sans">

            {/* Phone Frame Simulator */}
            <div className="relative w-full max-w-md h-[850px] bg-white rounded-[3rem] overflow-hidden border-8 border-zinc-900 shadow-2xl ring-1 ring-zinc-400/50">

                {/* Push Notification Banner */}
                <div className={`
                    absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[60]
                    transform transition-all duration-500 ease-out border border-stone-200
                    ${notification ? 'translate-y-12 opacity-100' : '-translate-y-40 opacity-0'}
                `}>
                    {notification && (
                        <div className="flex gap-3 items-center">
                            <div className="bg-teal-100 p-2 rounded-xl">
                                <notification.icon className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800 text-sm">{notification.title}</h4>
                                <p className="text-stone-500 text-xs">{notification.body}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Toggle */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-black/5 z-50 flex justify-center items-center backdrop-blur-sm">
                    <div className="bg-white/80 p-1 rounded-full flex text-xs font-bold shadow-lg">
                        <button
                            onClick={() => setView('senior')}
                            className={`px-4 py-2 rounded-full transition-colors ${view === 'senior' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                        >
                            Senior View
                        </button>
                        <button
                            onClick={() => setView('relative')}
                            className={`px-4 py-2 rounded-full transition-colors ${view === 'relative' ? 'bg-indigo-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                        >
                            Pårørende View
                        </button>
                    </div>
                </div>

                <div className="pt-14 h-full">
                    {/* Ping Notification - shows when receiving a ping in current view */}
                    {activePing && activePing.toView === view && (
                        <PingNotification
                            ping={activePing}
                            onDismiss={() => setActivePing(null)}
                        />
                    )}

                    {view === 'senior' ? (
                        <SeniorView
                            tasks={tasks}
                            toggleTask={toggleTask}
                            updateStatus={handleCheckIn}
                            addSymptom={addSymptom}
                            // familyStatus={familyStatus} // Not in props?
                            onSendPing={() => handleSendPing('Birthe', 'relative')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                        />
                    ) : (
                        <RelativeView
                            tasks={tasks}
                            profile={SENIOR_PROFILE}
                            lastCheckIn={lastCheckIn}
                            symptomLogs={symptomLogs}
                            onAddTask={handleAddTaskFromRelative}
                            // familyStatus={familyStatus} // Not in props? RelativeView has myStatus
                            myStatus={familyStatus}
                            onMyStatusChange={setFamilyStatus}
                            onSendPing={() => handleSendPing('Louise', 'senior')}
                            weeklyAnswers={weeklyAnswers}
                            onWeeklyAnswer={handleWeeklyAnswer}
                            onOpenSettings={() => { }}
                        />
                    )}
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
            </div>
        </div>
    );
}

```
---

## File: tryg-app\src\AppCore.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { CareCircleProvider } from './contexts/CareCircleContext';
import { Share2, LogOut } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { PingNotification } from './features/thinkingOfYou';
import { PrivacySettings } from './components/PrivacySettings';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateToast } from './components/UpdateToast';
import { PhotoCaptureButton, PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './features/photos';
import { useTasks } from './features/tasks';
import { useSymptoms } from './features/symptoms';
import { useSettings } from './hooks/useSettings';
import { useWeeklyQuestions } from './features/weeklyQuestion';
import { usePings } from './features/thinkingOfYou';
import { useCheckIn } from './hooks/useCheckIn';
import { usePhotos } from './features/photos';
import { useMemberStatus } from './features/familyPresence';
import { SENIOR_PROFILE } from './data/constants';
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import './index.css';
import { User } from 'firebase/auth'; // Or your custom user type
import { UserProfile, Member, CareCircle } from './types';
import { Task } from './features/tasks/useTasks';

export interface AppCoreProps {
    user: User | null;
    userProfile: UserProfile | null;
    careCircle: any; // CareCircle but mapped from hook which might differ slightly
    onSignOut: () => Promise<void>;
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    members?: Member[];
}

export default function TrygAppCore({
    user,
    userProfile,
    careCircle,
    onSignOut,
    inviteCode,
    onGetInviteCode,
    members = []
}: AppCoreProps) {
    // View is determined by user role - no toggle allowed
    const isRelative = userProfile?.role === 'relative';
    const isSenior = userProfile?.role === 'senior';
    // const [activePing, setActivePing] = useState(null); // Unused?
    const [notification, setNotification] = useState<any | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id);
    const { settings } = useSettings(careCircle?.id);
    // Per-member status tracking (each member has their own status)
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(careCircle?.id, user?.uid, userProfile?.displayName, userProfile?.role);
    const { answers: weeklyAnswers, addAnswer: addWeeklyAnswer } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid);
    // HelpExchange removed from here - moved to CoordinationTab and SeniorView
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, uploadPhoto, deletePhoto } = usePhotos(careCircle?.id, user?.uid);

    // HelpExchange filtering removed


    // Handle incoming pings from Firestore
    useEffect(() => {
        if (latestPing && FEATURES.pingSound) {
            playPingSound();
        }
    }, [latestPing]);

    // Clear notification after 4 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;

        // Wait for Firestore update to complete
        await toggleTask(id);

        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async (status: string) => {
        // Record check-in to Firestore for real-time sync
        await recordCheckIn(); // status arg removed from hook? assuming it toggles/sets 'checked-in'
        // recordCheckIn likely takes no args or specific args. Based on usage in previous file, recordCheckIn() was called.
        // Actually line 96 in AppCore.jsx called recordCheckIn() with no args.
        if (status === 'checked-in' && FEATURES.completionSounds) {
            playSuccessSound();
        }
    };

    const handleAddSymptom = async (symptomType: any) => {
        await addSymptom(symptomType);
    };

    const handleAddTaskFromRelative = async (newTask: Partial<Task>) => {
        // Include social attribution for tasks created by relatives
        await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName || userProfile?.displayName || 'Familie',
            createdByUserId: user?.uid
        });
    };

    const handleSendPing = async (fromName: string, toRole: string) => {
        // Send ping via Firestore for real-time sync
        await sendPing(fromName, user?.uid, toRole);
    };

    const handleWeeklyAnswer = async (answer: string) => {
        await addWeeklyAnswer(answer);
    };

    // Get display names
    const seniorName = careCircle?.seniorName || (userProfile?.role === 'senior' ? userProfile?.displayName : 'Senior');

    // For relatives, use the LOGGED-IN user's name, not just any relative in the circle
    const relativeName = userProfile?.role === 'relative'
        ? userProfile?.displayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    const profile = {
        ...SENIOR_PROFILE,
        name: seniorName,
    };

    return (
        <CareCircleProvider
            careCircleId={careCircle?.id}
            seniorId={careCircle?.seniorId}
            seniorName={seniorName}
            currentUserId={user?.uid}
            userRole={userProfile?.role}
            userName={isSenior ? seniorName : relativeName}
            memberStatuses={memberStatuses}
            relativeStatuses={relativeStatuses}
            seniorStatus={seniorStatus}
            myStatus={myStatus}
            setMyStatus={setMyStatus}
        >
            <div className="flex justify-center items-center min-h-screen bg-stone-50 sm:bg-zinc-800 sm:p-4 font-sans">

                {/* Phone Frame Simulator (Responsive) */}
                {/* Mobile: Full screen, no border. Desktop: Phone frame with border. */}
                <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[3rem] overflow-hidden sm:border-8 sm:border-zinc-900 shadow-2xl sm:ring-1 sm:ring-zinc-400/50">

                    {/* Push Notification Banner */}
                    <div className={`
          absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[60]
          transform transition-all duration-500 ease-out border border-stone-200
          ${notification ? 'translate-y-12 opacity-100' : '-translate-y-40 opacity-0'}
        `}>
                        {notification && (
                            <div className="flex gap-3 items-center">
                                <div className="bg-teal-100 p-2 rounded-xl">
                                    <notification.icon className="w-6 h-6 text-teal-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-800 text-sm">{notification.title}</h4>
                                    <p className="text-stone-500 text-xs">{notification.body}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Header with role indicator - COMPACT */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-black/5 z-50 flex justify-center items-center backdrop-blur-sm px-2">
                        {/* Settings button (left) */}
                        <div className="absolute left-3 flex items-center gap-1">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                                aria-label="Indstillinger"
                            >
                                <Share2 className="w-4 h-4 text-stone-600" />
                            </button>
                            {FEATURES.photoSharing && (
                                <PhotoCaptureButton
                                    onCapture={async (file) => {
                                        await uploadPhoto(file, userProfile?.displayName || 'Familie');
                                    }}
                                    disabled={uploading}
                                />
                            )}
                        </div>

                        {/* Role indicator (center) - compact */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${isSenior ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
                            }`}>
                            {isSenior ? `👤 ${seniorName}` : `👥 ${relativeName}`}
                        </div>

                        {/* Sign out button (right) */}
                        <button
                            onClick={onSignOut}
                            className="absolute right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Log ud"
                        >
                            <LogOut className="w-4 h-4 text-stone-600" />
                        </button>
                    </div>

                    {/* Settings panel (invite code + privacy) */}
                    {showSettings && (
                        <div className="absolute top-10 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-40 border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">Familie-cirkel</h3>
                            {inviteCode ? (
                                <div className="bg-stone-100 rounded-xl p-3 text-center mb-3">
                                    <p className="text-xs text-stone-500 mb-1">Invitationskode</p>
                                    <p className="text-2xl font-mono font-bold tracking-widest">{inviteCode}</p>
                                </div>
                            ) : (
                                <button
                                    onClick={onGetInviteCode}
                                    className="w-full py-2 bg-teal-100 text-teal-700 rounded-xl font-medium mb-3"
                                >
                                    Vis invitationskode
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    setShowPrivacySettings(true);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> {/* Settings icon was imported as Settings but used as Share2? No imported Settings */}
                                Privatliv & Data
                            </button>

                            <p className="text-xs text-stone-400 mt-3">
                                Logget ind som: {user?.email}
                            </p>

                            {/* Circle members list - Elder first */}
                            {members.length > 0 && (() => {
                                // Sort senior to top
                                const senior = members.find(m => m.role === 'senior');
                                const relatives = members.filter(m => m.role !== 'senior');

                                return (
                                    <div className="mt-4 pt-4 border-t border-stone-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            {/* Users icon imported */}
                                            <span className="text-sm font-medium text-stone-600">Vores Familie</span>
                                        </div>

                                        {/* The Elder - Distinguished at top */}
                                        {senior && (
                                            <div className="bg-gradient-to-r from-amber-50 to-teal-50 rounded-xl p-3 mb-3 border border-amber-200/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                        {senior.displayName?.charAt(0) || '👴'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-stone-800">{senior.displayName || 'Vores Elder'}</p>
                                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                                            <span>👑</span> Familiens hjerte
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pårørende - Simpler styling */}
                                        {relatives.length > 0 && (
                                            <div className="space-y-2 pl-2">
                                                {relatives.map((member) => (
                                                    <div key={member.id} className="flex items-center gap-2 text-sm">
                                                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                            {member.displayName?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-stone-700">{member.displayName || 'Ukendt'}</span>
                                                        <span className="text-xs text-indigo-500">Pårørende</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Privacy Settings Modal */}
                    {showPrivacySettings && (
                        <PrivacySettings
                            user={user}
                            careCircle={careCircle}
                            onClose={() => setShowPrivacySettings(false)}
                        />
                    )}

                    <div className="pt-10 h-full">
                        {/* Ping Notification from Firestore */}
                        {latestPing && (
                            <PingNotification
                                ping={{
                                    fromName: latestPing.fromName,
                                    toView: latestPing.toRole,
                                    time: (latestPing.sentAt as any)?.toLocaleTimeString?.('da-DK', { hour: '2-digit', minute: '2-digit' }) || ''
                                }}
                                onDismiss={dismissPing}
                            />
                        )}

                        {isSenior ? (
                            <SeniorView
                                tasks={tasks}
                                toggleTask={handleToggleTask}
                                updateStatus={handleCheckIn}
                                addSymptom={handleAddSymptom}
                                statusLastUpdated={settings?.lastUpdated}
                                onSendPing={() => handleSendPing(seniorName, 'relative')}
                                weeklyAnswers={weeklyAnswers}
                                onWeeklyAnswer={handleWeeklyAnswer}
                                // onset="helpExchange" // Placeholder to simplify diff, not needed in TSX
                                members={members}
                                memberStatuses={memberStatuses}
                                currentUserId={user?.uid}
                                relativeStatuses={relativeStatuses}
                                userName={seniorName}
                                relativeName={relativeName}
                                careCircleId={careCircle?.id}
                                symptomLogs={symptoms}
                                onAddTask={handleAddTaskFromRelative}
                            />
                        ) : (
                            <RelativeView
                                tasks={tasks}
                                profile={profile}
                                lastCheckIn={lastCheckIn}
                                symptomLogs={symptoms}
                                onAddTask={handleAddTaskFromRelative}
                                myStatus={myStatus}
                                onMyStatusChange={setMyStatus}
                                memberStatuses={memberStatuses}
                                currentUserId={user?.uid}
                                onSendPing={() => handleSendPing(relativeName, 'senior')}
                                weeklyAnswers={weeklyAnswers}
                                onWeeklyAnswer={handleWeeklyAnswer}
                                // onset="helpExchange"
                                onOpenSettings={() => setShowPrivacySettings(true)}
                                userName={relativeName}
                                seniorName={seniorName}
                                careCircleId={careCircle?.id}
                            />
                        )}

                        {/* Photo notification badge */}
                        {latestPhoto && (
                            <div className="absolute bottom-24 left-4 right-4 z-40 flex justify-center">
                                <PhotoNotificationBadge
                                    photo={latestPhoto}
                                    onClick={() => setShowPhotoViewer(true)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Photo upload modal */}
                    <PhotoUploadModal isOpen={uploading} />

                    {/* Photo viewer modal */}
                    {showPhotoViewer && latestPhoto && (
                        <PhotoViewerModal
                            photo={latestPhoto}
                            onDelete={async (id, path) => {
                                await deletePhoto(id, path);
                                setShowPhotoViewer(false);
                            }}
                        />
                    )}

                    {/* iOS PWA Install Prompt */}
                    <InstallPrompt />

                    {/* PWA Update Toast */}
                    <UpdateToast />

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
                </div>
            </div>
        </CareCircleProvider>
    );
}

```
---

## File: tryg-app\src\AppWithAuth.tsx
```tsx
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useCareCircle } from './hooks/useCareCircle';
import { AuthScreen } from './components/AuthScreen';
import { CircleSetup } from './components/CircleSetup';
import { ConsentModal } from './components/ConsentModal';
import TrygAppCore from './AppCore';
import { FEATURES } from './config/features';

// Main app wrapper with Firebase integration
export default function AppWithAuth() {
    // If Firebase is disabled, render the original localStorage app
    if (!FEATURES.useFirebase) {
        // Dynamically import the original app
        const TrygApp = React.lazy<React.ComponentType<any>>(() => import('./App'));
        return (
            <React.Suspense fallback={<LoadingScreen />}>
                <TrygApp />
            </React.Suspense>
        );
    }

    return <FirebaseApp />;
}

// Firebase-enabled app
function FirebaseApp() {
    const [consentLoading, setConsentLoading] = useState(false);
    const [authFormError, setAuthFormError] = useState<string | null>(null); // Track sign-in/signup errors

    const {
        user,
        userProfile,
        loading: authLoading,
        error: authError,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        recordConsent,
        resetPassword
    } = useAuth();

    const {
        careCircle,
        members,
        loading: circleLoading,
        error: circleError,
        createCareCircle,
        joinCareCircle,
        getInviteCode,
        inviteCode,
    } = useCareCircle(user?.uid, userProfile);

    // Auth handler for AuthScreen
    const handleAuth = async (type: string, data: any) => {
        setAuthFormError(null); // Clear previous errors
        try {
            if (type === 'login') {
                await signIn(data.email, data.password);
            } else if (type === 'signup') {
                await signUp(data.email, data.password, data.displayName, data.role);
            } else if (type === 'google') {
                await signInWithGoogle(data.role);
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            // Set user-friendly error message
            let message = err.message || 'Der opstod en fejl ved login';
            // Clean up Firebase error messages
            if (message.includes('auth/popup-closed-by-user')) {
                message = 'Login-vinduet blev lukket. Prøv igen.';
            } else if (message.includes('auth/invalid-credential')) {
                message = 'Forkert email eller adgangskode. Prøv igen, eller kontakt din familie for hjælp.';
            } else if (message.includes('auth/user-not-found')) {
                message = 'Ingen konto fundet med denne email. Opret en konto først.';
            } else if (message.includes('auth/wrong-password')) {
                message = 'Forkert adgangskode. Prøv igen.';
            } else if (message.includes('auth/unauthorized-domain')) {
                message = 'Denne side er ikke godkendt til login. Kontakt support.';
            } else if (message.includes('auth/network-request-failed')) {
                message = 'Netværksfejl. Tjek din internetforbindelse.';
            }
            setAuthFormError(message);
        }
    };

    // Consent handler
    const handleConsent = async () => {
        setConsentLoading(true);
        try {
            await recordConsent();
        } catch (err) {
            console.error('Consent error:', err);
        } finally {
            setConsentLoading(false);
        }
    };

    // Loading state - Wait for BOTH auth and profile to resolve
    // This prevents the "flash" of Relative view before Senior view
    if (authLoading || (user && !userProfile && !authError)) {
        return <LoadingScreen message="Indlæser profil..." />;
    }

    // Not authenticated - show auth screen
    if (!user) {
        return (
            <AuthScreen
                onAuth={handleAuth}
                onResetPassword={resetPassword}
                error={authFormError || authError || undefined}
                loading={authLoading}
            />
        );
    }

    // Authenticated but no consent given - show consent modal
    if (userProfile && !userProfile.consentGiven) {
        return (
            <ConsentModal
                userName={userProfile?.displayName || user.displayName || 'bruger'}
                onAccept={handleConsent}
                loading={consentLoading}
            />
        );
    }

    // Loading circle info
    if (circleLoading) {
        return <LoadingScreen message="Finder din familie..." />;
    }

    // Handle connection errors (e.g., offline) explicitly
    // instead of falling back to setup screen
    // Check BOTH auth errors (profile fetch) and circle errors
    const connectionError = authError || circleError;
    if (connectionError) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-stone-800 mb-2">Der opstod en fejl</h2>
                    <p className="text-stone-500 mb-6">
                        Vi kunne ikke hente dine oplysninger. Det kan skyldes manglende internetforbindelse via firewall eller VPN.
                        <br />
                        <span className="text-xs font-mono mt-2 block bg-stone-100 p-2 rounded text-red-500">
                            {connectionError}
                        </span>
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-stone-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-900 transition-colors w-full"
                    >
                        Prøv igen
                    </button>
                    {/* Fallback to setup if user insists (optional, maybe hidden) */}
                </div>
            </div>
        );
    }

    // Authenticated but no care circle - show setup
    if (!careCircle) {
        return (
            <CircleSetup
                userRole={userProfile?.role || 'relative'}
                userName={userProfile?.displayName || user.displayName || 'Bruger'}
                onCreateCircle={createCareCircle}
                onJoinCircle={joinCareCircle}
                loading={circleLoading}
                error={circleError}
            />
        );
    }

    // Fully authenticated with circle - render main app
    return (
        <TrygAppCore
            user={user}
            userProfile={userProfile}
            careCircle={careCircle}
            onSignOut={signOut}
            inviteCode={inviteCode}
            onGetInviteCode={getInviteCode}
            members={members}
        />
    );
}

// Loading screen component
interface LoadingScreenProps {
    message?: string;
}

function LoadingScreen({ message = 'Indlæser...' }: LoadingScreenProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex flex-col">
            {/* Skeleton header */}
            <div className="p-6 animate-pulse">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <div className="h-6 bg-stone-200 rounded w-32" />
                        <div className="h-4 bg-stone-200 rounded w-24" />
                    </div>
                    <div className="w-12 h-12 bg-stone-200 rounded-full" />
                </div>

                {/* Skeleton status card */}
                <div className="bg-white/60 rounded-2xl p-5 mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-stone-200 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-stone-200 rounded w-2/3" />
                            <div className="h-4 bg-stone-200 rounded w-1/2" />
                        </div>
                    </div>
                </div>

                {/* Skeleton task cards */}
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/60 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-stone-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading message at bottom */}
            <div className="mt-auto p-6 text-center">
                <p className="text-stone-400 text-sm">{message}</p>
            </div>
        </div>
    );
}

```
---

## File: tryg-app\src\components\animations\index.jsx
```jsx
// @ts-check
/**
 * Animation Components
 * 
 * Reusable framer-motion wrappers for micro-animations.
 * Provides consistent animations across the app.
 */

import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Slide out to the right when completed
 */
export const slideOutRight = {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
};

/**
 * Fade in from bottom (for modals)
 */
export const slideUpFade = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

/**
 * Simple fade
 */
export const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Scale in with spring (for success states)
 */
export const popIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};

/**
 * Stagger children (for lists)
 */
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const staggerItem = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

// ============================================================================
// WRAPPER COMPONENTS
// ============================================================================

/**
 * Animated list container - staggers child animations
 */
export const AnimatedList = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
    >
        {children}
    </motion.div>
);

/**
 * Animated list item - for items within AnimatedList
 */
export const AnimatedItem = ({ children, className = '', layoutId }) => (
    <motion.div
        className={className}
        variants={staggerItem}
        layout
        layoutId={layoutId}
    >
        {children}
    </motion.div>
);

/**
 * Task card with completion animation
 * Slides out to the right when completed
 */
export const AnimatedTaskCard = ({
    children,
    taskId,
    isCompleted,
    onAnimationComplete,
    className = ''
}) => (
    <motion.div
        key={taskId}
        layout
        initial={{ opacity: 1, x: 0, height: 'auto' }}
        animate={{
            opacity: isCompleted ? 0.6 : 1,
            x: 0,
            scale: isCompleted ? 0.98 : 1
        }}
        exit={{
            opacity: 0,
            x: 100,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        transition={{ duration: 0.2 }}
        onAnimationComplete={onAnimationComplete}
        className={className}
    >
        {children}
    </motion.div>
);

/**
 * Modal wrapper with slide-up animation
 */
export const AnimatedModal = ({ isOpen, onClose, children, className = '' }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div
                    className="fixed inset-0 bg-black/40 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                {/* Modal content */}
                <motion.div
                    className={`fixed inset-x-4 bottom-4 z-50 bg-white rounded-3xl shadow-xl max-h-[85vh] overflow-auto ${className}`}
                    variants={slideUpFade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {children}
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

/**
 * Success checkmark animation
 */
export const AnimatedCheckmark = ({ show }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                ✓
            </motion.div>
        )}
    </AnimatePresence>
);

export { AnimatePresence } from 'framer-motion';

```
---

## File: tryg-app\src\components\AuthScreen.tsx
```tsx
// Authentication screen for Tryg App
// Handles login, signup, and role selection (senior vs relative)

import React, { useState } from 'react';
import { Heart, User, Users, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export interface AuthScreenProps {
    onAuth: (type: 'login' | 'signup' | 'google', data: any) => void;
    onResetPassword: (email: string) => Promise<void>;
    error?: string | null;
    loading?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth, onResetPassword, error, loading }) => {
    const [mode, setMode] = useState<'login' | 'signup' | 'role'>('login'); // 'login', 'signup', 'role'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'senior' | 'relative' | null>(null);
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            onAuth('login', { email, password });
        } else if (mode === 'signup' && selectedRole) {
            onAuth('signup', { email, password, displayName, role: selectedRole });
        }
    };

    const handleGoogleSignIn = () => {
        if (!selectedRole) {
            setMode('role');
            return;
        }
        onAuth('google', { role: selectedRole });
    };

    const handleRoleSelect = (role: 'senior' | 'relative') => {
        setSelectedRole(role);
        setMode('signup');
    };

    const handleForgotPassword = async () => {
        if (!email) return;
        setResetLoading(true);
        try {
            await onResetPassword(email);
            setResetSent(true);
        } catch (err) {
            // Error is handled by the hook and passed as error prop
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-4">
                        <Heart className="w-10 h-10 text-teal-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-stone-800">Tryg</h1>
                    <p className="text-stone-500 mt-2">Forbind med din familie</p>
                </div>

                {/* Role Selection */}
                {mode === 'role' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-stone-800 text-center mb-6">
                            Hvem er du?
                        </h2>

                        <button
                            onClick={() => handleRoleSelect('senior')}
                            className="w-full p-6 rounded-2xl border-2 border-stone-200 hover:border-teal-400 transition-all flex items-center gap-4"
                        >
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                                <User className="w-7 h-7 text-teal-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-stone-800">Jeg er den ældre</h3>
                                <p className="text-stone-500 text-sm">Jeg vil tracke mine opgaver</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('relative')}
                            className="w-full p-6 rounded-2xl border-2 border-stone-200 hover:border-indigo-400 transition-all flex items-center gap-4"
                        >
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-stone-800">Jeg er pårørende</h3>
                                <p className="text-stone-500 text-sm">Jeg vil følge med i min families trivsel</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('login')}
                            className="w-full text-center text-stone-500 text-sm mt-4 hover:text-stone-700"
                        >
                            Har du allerede en konto? Log ind
                        </button>
                    </div>
                )}

                {/* Login / Signup Form */}
                {(mode === 'login' || mode === 'signup') && (
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Role indicator for signup */}
                        {mode === 'signup' && selectedRole && (
                            <div className={`text-center py-2 px-4 rounded-full text-sm font-medium mb-4 ${selectedRole === 'senior'
                                ? 'bg-teal-100 text-teal-700'
                                : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                {selectedRole === 'senior' ? '👤 Senior konto' : '👥 Pårørende konto'}
                            </div>
                        )}

                        {/* Display name (signup only) */}
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">Dit navn</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="F.eks. Birthe Jensen"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="din@email.dk"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">Adgangskode</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Reset password success message */}
                        {resetSent && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm">
                                📧 Vi har sendt en email til {email}. Tjek din indbakke (og spam) for at nulstille din adgangskode.
                            </div>
                        )}

                        {/* Forgot password link (login mode only) */}
                        {mode === 'login' && (
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={!email || resetLoading}
                                className="text-sm text-teal-600 hover:underline disabled:text-stone-400 disabled:no-underline"
                            >
                                {resetLoading ? 'Sender...' : 'Glemt adgangskode?'}
                            </button>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Vent...' : mode === 'login' ? 'Log ind' : 'Opret konto'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-stone-200" />
                            <span className="text-stone-400 text-sm">eller</span>
                            <div className="flex-1 h-px bg-stone-200" />
                        </div>

                        {/* Google sign in */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white border-2 border-stone-200 py-3 rounded-xl font-medium text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Log ind med Google
                        </button>

                        {/* Toggle mode */}
                        <p className="text-center text-stone-500 text-sm mt-4">
                            {mode === 'login' ? (
                                <>
                                    Ny bruger?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('role')}
                                        className="text-teal-600 font-medium hover:underline"
                                    >
                                        Opret konto
                                    </button>
                                </>
                            ) : (
                                <>
                                    Har du allerede en konto?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-teal-600 font-medium hover:underline"
                                    >
                                        Log ind
                                    </button>
                                </>
                            )}
                        </p>
                    </form>
                )}

                {/* Privacy link */}
                <p className="text-center text-stone-400 text-xs mt-6">
                    Ved at fortsætte accepterer du vores{' '}
                    <a href="/privacy-policy.html" className="underline hover:text-stone-600">
                        privatlivspolitik
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;

```
---

## File: tryg-app\src\components\BottomNavigation.tsx
```tsx

import React from 'react';
import { Heart, Users, FileText, Gamepad2 } from 'lucide-react';

export interface BottomNavigationProps {
    activeTab: 'daily' | 'family' | 'spil';
    onTabChange: (tab: 'daily' | 'family' | 'spil') => void;
    onViewReport?: () => void;
    onShowReport?: () => void; // Alias for backwards compatibility
}

/**
 * Unified Bottom Navigation for Senior and Relative Views
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabChange,
    onViewReport,
    onShowReport // Alias for backwards compatibility
}) => {
    // Support both prop names for backwards compatibility
    const handleReport = onViewReport || onShowReport;

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-3 pb-6 safe-area-bottom z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                {/* Min dag */}
                <button
                    onClick={() => onTabChange('daily')}
                    className={`flex flex - col items - center gap - 1 transition - colors ${activeTab === 'daily' ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'
                        } `}
                >
                    <Heart className={`w - 6 h - 6 ${activeTab === 'daily' ? 'fill-teal-100' : ''} `} />
                    <span className="text-xs font-bold">Min dag</span>
                </button>

                {/* Familie */}
                <button
                    onClick={() => onTabChange('family')}
                    className={`flex flex - col items - center gap - 1 transition - colors ${activeTab === 'family' ? 'text-indigo-600' : 'text-stone-400 hover:text-stone-600'
                        } `}
                >
                    <Users className={`w - 6 h - 6 ${activeTab === 'family' ? 'fill-indigo-100' : ''} `} />
                    <span className="text-xs font-bold">Familie</span>
                </button>

                {/* Rapport */}
                <button
                    onClick={handleReport}
                    className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-bold">Rapport</span>
                </button>

                {/* Spil */}
                <button
                    onClick={() => onTabChange('spil')}
                    className={`flex flex - col items - center gap - 1 transition - colors ${activeTab === 'spil' ? 'text-purple-600' : 'text-stone-400 hover:text-stone-600'
                        } `}
                >
                    <Gamepad2 className={`w - 6 h - 6 ${activeTab === 'spil' ? 'fill-purple-100' : ''} `} />
                    <span className="text-xs font-bold">Spil</span>
                </button>
            </div>
        </div>
    );
};

// Backwards compatibility alias
export const RelativeBottomNavigation = BottomNavigation;

export default BottomNavigation;

```
---

## File: tryg-app\src\components\CircleSetup.tsx
```tsx
// Circle setup screen - shown after auth if user has no care circle
// Seniors create a new circle, relatives join via invite code

import React, { useState } from 'react';
import { Users, Plus, Key, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';

export interface CircleSetupProps {
    userRole?: 'senior' | 'relative';
    userName?: string;
    onCreateCircle: (userName: string) => Promise<string>;
    onJoinCircle: (code: string, userName: string) => Promise<void>;
    loading?: boolean;
    error?: string | null;
}

export const CircleSetup: React.FC<CircleSetupProps> = ({ userRole, userName, onCreateCircle, onJoinCircle, loading, error }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState<'initial' | 'creating' | 'created' | 'joining'>('initial'); // 'initial', 'creating', 'created', 'joining'

    const handleCreate = async () => {
        setStep('creating');
        try {
            const code = await onCreateCircle(userName || '');
            setCreatedCode(code);
            setStep('created');
        } catch (err) {
            setStep('initial');
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteCode.length !== 6) return;
        await onJoinCircle(inviteCode.toUpperCase(), userName || '');
    };

    const copyCode = () => {
        if (createdCode) {
            navigator.clipboard.writeText(createdCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Senior flow - create circle
    if (userRole === 'senior') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
                        <Users className="w-10 h-10 text-teal-600" />
                    </div>

                    {step === 'initial' && (
                        <>
                            <h1 className="text-2xl font-bold text-stone-800 mb-2">Velkommen, {userName}!</h1>
                            <p className="text-stone-500 mb-8">
                                Lad os oprette din familie-cirkel, så dine pårørende kan følge med.
                            </p>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Opret min familie-cirkel
                            </button>
                        </>
                    )}

                    {step === 'creating' && (
                        <div className="py-8">
                            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                            <p className="text-stone-500">Opretter din cirkel...</p>
                        </div>
                    )}

                    {step === 'created' && (
                        <>
                            <h1 className="text-2xl font-bold text-stone-800 mb-2">Din cirkel er klar! 🎉</h1>
                            <p className="text-stone-500 mb-6">
                                Del denne kode med dine pårørende, så de kan tilslutte sig:
                            </p>

                            <div className="bg-stone-100 rounded-2xl p-6 mb-6">
                                <p className="text-sm text-stone-500 mb-2">Invitationskode</p>
                                <p className="text-4xl font-mono font-bold text-stone-800 tracking-widest">
                                    {createdCode}
                                </p>
                            </div>

                            <button
                                onClick={copyCode}
                                className="w-full bg-stone-200 text-stone-700 py-3 rounded-xl font-medium hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 mb-4"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Kopieret!' : 'Kopier kode'}
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Fortsæt til appen
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mt-4">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Relative flow - join circle
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">

                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <Key className="w-10 h-10 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold text-stone-800 mb-2">Velkommen, {userName}!</h1>
                <p className="text-stone-500 mb-6">
                    Indtast invitationskoden fra din pårørende for at tilslutte dig deres cirkel.
                </p>

                <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
                            placeholder="XXXXXX"
                            className="w-full text-center text-3xl font-mono font-bold tracking-widest py-4 rounded-xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none transition-colors uppercase"
                            maxLength={6}
                            autoComplete="off"
                        />
                        <p className="text-sm text-stone-400 mt-2">6-tegns kode</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || inviteCode.length !== 6}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Tilslut cirkel
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CircleSetup;

```
---

## File: tryg-app\src\components\ConsentModal.tsx
```tsx
// GDPR Consent Modal - Shown on first login before using the app
// Collects explicit consent for data processing as required by GDPR

import React, { useState } from 'react';
import { Shield, Check, ExternalLink } from 'lucide-react';

export interface ConsentModalProps {
    userName?: string;
    onAccept: () => void;
    loading?: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ userName, onAccept, loading }) => {
    const [checkedItems, setCheckedItems] = useState({
        dataProcessing: false,
        dataSharing: false,
        privacyPolicy: false,
    });

    const allChecked = Object.values(checkedItems).every(Boolean);

    const handleCheck = (key: keyof typeof checkedItems) => {
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAccept = () => {
        if (allChecked) {
            onAccept();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800">Dit privatliv er vigtigt</h2>
                    <p className="text-stone-500 mt-2">
                        Hej {userName}! Før du kan bruge Tryg, skal vi have din tilladelse.
                    </p>
                </div>

                {/* What we collect */}
                <div className="bg-stone-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Hvad vi gemmer:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Dine daglige opgaver og hvornår de fuldføres</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Symptomer du logger (smerter, søvn, appetit, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Beskeder og "tænker på dig" mellem familiemedlemmer</span>
                        </li>
                    </ul>
                </div>

                {/* Who can see */}
                <div className="bg-indigo-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Hvem kan se dine data:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">•</span>
                            <span><strong>Kun din familie-cirkel</strong> - dem du inviterer</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">•</span>
                            <span>Vi sælger aldrig dine data til tredjeparter</span>
                        </li>
                    </ul>
                </div>

                {/* Your rights */}
                <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Dine rettigheder:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan altid <strong>downloade alle dine data</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan <strong>slette din konto</strong> når som helst</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan <strong>pause deling</strong> midlertidigt</span>
                        </li>
                    </ul>
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-3 mb-6">
                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('dataProcessing')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.dataProcessing ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.dataProcessing && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg accepterer, at Tryg gemmer mine data som beskrevet ovenfor
                        </span>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('dataSharing')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.dataSharing ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.dataSharing && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg forstår, at min familie-cirkel kan se mine aktiviteter
                        </span>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('privacyPolicy')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.privacyPolicy ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.privacyPolicy && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg har læst og accepterer{' '}
                            <a
                                href="/privacy-policy.html"
                                target="_blank"
                                className="text-teal-600 underline inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                privatlivspolitikken
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </span>
                    </label>
                </div>

                {/* Accept button */}
                <button
                    onClick={handleAccept}
                    disabled={!allChecked || loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${allChecked
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Gemmer...' : 'Jeg accepterer'}
                </button>

                <p className="text-xs text-stone-400 text-center mt-4">
                    Du kan til enhver tid ændre dine præferencer i indstillinger
                </p>
            </div>
        </div>
    );
};

export default ConsentModal;

```
---

## File: tryg-app\src\components\CoordinationTab.tsx
```tsx
import React, { useState } from 'react';
import {
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp, CheckCircle,
    AlertCircle, Heart, HandHeart, X
} from 'lucide-react';
import { Button } from './ui/Button';
import { SymptomSummary } from '../features/symptoms';
import { StatusSelector, STATUS_OPTIONS } from '../features/familyPresence';
import { MatchBanner } from '../features/helpExchange';
import { FamilyPresence } from '../features/familyPresence';
import { RELATIVE_OFFERS, RELATIVE_REQUESTS } from '../features/helpExchange';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { Member, CareCircleContextValue } from '../types';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';

export interface CoordinationTabProps {
    seniorName?: string;
    userName?: string;
    myStatus?: string;
    onMyStatusChange?: (status: string) => void;
    memberStatuses?: Member[];
    currentUserId?: string;
    openTasks?: Task[];
    completedTasks?: Task[];
    symptomLogs?: SymptomLog[];
    onAddTask?: () => void;
    onViewReport?: () => void;
    onMatchAction?: (match: any) => void;
    onDismissMatch?: (matchId: string) => void;
    dismissedMatchIds?: Set<string>;
    careCircleId?: string;
}

// Coordination Tab - practical management focused
// Shows: Family presence, Your status, HelpExchange (bidirectional), tasks, symptom details
// Uses CareCircleContext for shared data (props as optional overrides)
export const CoordinationTab: React.FC<CoordinationTabProps> = ({
    seniorName: propSeniorName,
    userName: propUserName,
    myStatus = 'home',
    onMyStatusChange,
    memberStatuses: propMemberStatuses,
    currentUserId: propCurrentUserId,
    // HelpExchange props removed
    openTasks = [],
    completedTasks = [],
    symptomLogs = [],
    onAddTask,
    onViewReport,
    onMatchAction,
    onDismissMatch,
    dismissedMatchIds = new Set(),
    careCircleId: propCareCircleId
}) => {
    // Get from context, use props as override
    const context = useCareCircleContext() as CareCircleContextValue;
    const seniorName = propSeniorName ?? context.seniorName ?? 'Senior';
    const userName = propUserName ?? context.userName ?? 'Pårørende';
    const memberStatuses = propMemberStatuses ?? context.memberStatuses ?? [];
    const currentUserId = propCurrentUserId ?? context.currentUserId;
    const careCircleId = propCareCircleId ?? context.careCircleId;

    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(true);
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    // Fetch HelpExchange data directly
    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'relative', userName);

    // Filter offers/requests by role
    // Senior's items
    const helpOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'senior');
    // Relative's items
    const relativeOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'relative');

    // Map handlers
    const onAddRelativeOffer = addOffer;
    const onRemoveRelativeOffer = removeOffer;
    const onAddRelativeRequest = addRequest;
    const onRemoveRelativeRequest = removeRequest;

    console.debug('🤝 [CoordinationTab] Help Data:', {
        offers: helpOffers.length,
        requests: helpRequests.length,
        relOffers: relativeOffers.length,
        relRequests: relativeRequests.length
    });

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === myStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    // Split relative entries into "mine" vs "other relatives"
    const myRelativeOffers = relativeOffers.filter((o: any) => o.createdByUid === currentUserId);
    const myRelativeRequests = relativeRequests.filter((r: any) => r.createdByUid === currentUserId);
    const otherRelativeOffers = relativeOffers.filter((o: any) => o.createdByUid !== currentUserId);
    const otherRelativeRequests = relativeRequests.filter((r: any) => r.createdByUid !== currentUserId);

    // Combine all offers and requests for match detection (using local filtered vars)
    const allOffers = [
        ...helpOffers.map((o: any) => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map((o: any) => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map((r: any) => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map((r: any) => ({ ...r, createdByRole: 'relative' }))
    ];

    // Detect matches
    const { topMatch, hasMatches, matches } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: myStatus
    });

    // Generate a unique ID for a match (based on offer and request IDs)
    const getMatchId = (match: any) => {
        if (!match) return null;
        const offerId = match.offer?.docId || match.offer?.id || 'none';
        const requestId = match.request?.docId || match.request?.id || 'none';
        return `${offerId}-${requestId}`;
    };

    // Filter out dismissed matches
    const filteredTopMatch = topMatch && !dismissedMatchIds.has(getMatchId(topMatch)!) ? topMatch : null;
    const hasActiveMatches = filteredTopMatch !== null;

    return (
        <div className="space-y-3">
            {/* Your Status - compact inline for tech-savvy relatives */}
            <div className="bg-indigo-600 rounded-xl px-3 py-2 text-white shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-indigo-200 font-medium">Din status:</span>
                    {showStatusPicker ? (
                        <div className="flex-1">
                            <StatusSelector
                                currentStatus={myStatus}
                                onStatusChange={(newStatus) => {
                                    if (onMyStatusChange) onMyStatusChange(newStatus);
                                    setShowStatusPicker(false);
                                }}
                                compact={true}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowStatusPicker(true)}
                            className="flex items-center gap-2 bg-indigo-500/50 hover:bg-indigo-500 rounded-lg px-2 py-1 transition-colors"
                        >
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium text-sm">{currentStatusInfo.label}</span>
                            <span className="text-indigo-300 text-xs">▼</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Match Celebration Banner */}
            {hasActiveMatches && filteredTopMatch && (
                <MatchBanner
                    match={filteredTopMatch}
                    onClick={() => onMatchAction?.(filteredTopMatch)}
                    onDismiss={() => {
                        const offerId = filteredTopMatch.offer?.docId || filteredTopMatch.offer?.id || 'none';
                        const requestId = filteredTopMatch.request?.docId || filteredTopMatch.request?.id || 'none';
                        const matchId = `${offerId}-${requestId}`;
                        onDismissMatch?.(matchId);
                    }}
                />
            )}

            {/* Family Presence - "Familien Nu" */}
            {memberStatuses.length > 0 && (
                <FamilyPresence
                    memberStatuses={memberStatuses}
                    currentUserId={currentUserId}
                    seniorName={seniorName}
                />
            )}

            {/* Bidirectional Help Exchange */}
            <div className="bg-stone-50 border-2 border-stone-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-teal-600" />
                    Familie-udveksling
                </h3>

                {/* OTHER RELATIVES' offers/requests - show what other family members have added */}
                {(otherRelativeOffers.length > 0 || otherRelativeRequests.length > 0) && (
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Fra andre pårørende:</p>
                        <div className="flex flex-wrap gap-2">
                            {otherRelativeOffers.map((offer: any, i: number) => (
                                <span key={`oro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName}`}>
                                    💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                                </span>
                            ))}
                            {otherRelativeRequests.map((req: any, i: number) => (
                                <span key={`orr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName}`}>
                                    💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Senior's offers/requests - show with creator name */}
                {(helpOffers.length > 0 || helpRequests.length > 0) && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-stone-500 uppercase">Fra {seniorName}:</p>
                        <div className="flex flex-wrap gap-2">
                            {helpOffers.map((offer: any, i: number) => (
                                <span key={`so-${i}`} className="text-sm bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName || seniorName}`}>
                                    💚 {offer.label}
                                </span>
                            ))}
                            {helpRequests.map((req: any, i: number) => (
                                <span key={`sr-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName || seniorName}`}>
                                    💜 {req.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Your offers */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du tilbyder:</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeOffers.map((offer: any, i: number) => (
                            <span
                                key={`ro-${i}`}
                                className="text-sm bg-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1"
                            >
                                {offer.emoji || '✨'} {offer.label}
                                <button
                                    onClick={() => onRemoveRelativeOffer?.(offer.docId)}
                                    className="ml-1 hover:bg-teal-600 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={() => setShowOfferPicker(!showOfferPicker)}
                            className="text-sm bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full border-2 border-dashed border-teal-200 hover:bg-teal-100 transition-colors"
                        >
                            + Tilbyd noget
                        </button>
                    </div>

                    {/* Offer picker */}
                    {showOfferPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Vælg hvad du kan tilbyde:</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_OFFERS.filter(o => !relativeOffers.some((ro: any) => ro.id === o.id)).map(offer => (
                                    <button
                                        key={offer.id}
                                        onClick={() => {
                                            onAddRelativeOffer?.(offer);
                                            setShowOfferPicker(false);
                                        }}
                                        className="text-sm bg-stone-100 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {offer.emoji} {offer.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Your requests */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du ønsker:</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeRequests.map((req: any, i: number) => (
                            <span
                                key={`rr-${i}`}
                                className="text-sm bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1"
                            >
                                {req.emoji || '💜'} {req.label}
                                <button
                                    onClick={() => onRemoveRelativeRequest?.(req.docId)}
                                    className="ml-1 hover:bg-indigo-600 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={() => setShowRequestPicker(!showRequestPicker)}
                            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                            + Bed om noget
                        </button>
                    </div>

                    {/* Request picker */}
                    {showRequestPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Hvad kunne du bruge hjælp til?</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_REQUESTS.filter(r => !relativeRequests.some((rr: any) => rr.id === r.id)).map(request => (
                                    <button
                                        key={request.id}
                                        onClick={() => {
                                            onAddRelativeRequest?.(request);
                                            setShowRequestPicker(false);
                                        }}
                                        className="text-sm bg-stone-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {request.emoji} {request.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Symptoms - Collapsible (today's symptoms only in header) */}
            {(() => {
                const todaySymptoms = symptomLogs.filter(s => {
                    const date = s.loggedAt?.toDate ? s.loggedAt.toDate() : new Date(s.loggedAt);
                    return date.toDateString() === new Date().toDateString();
                });
                return symptomLogs.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowSymptoms(!showSymptoms)}
                            className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                        >
                            <span className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                Symptomer i dag ({todaySymptoms.length})
                            </span>
                            {showSymptoms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showSymptoms && (
                            <SymptomSummary symptomLogs={symptomLogs} onViewReport={onViewReport} hideTitle={true} />
                        )}
                    </div>
                );
            })()}

            {/* Open Tasks - Collapsible */}
            {openTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowOpenTasks(!showOpenTasks)}
                        className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                    >
                        <span>Åbne opgaver ({openTasks.length})</span>
                        {showOpenTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showOpenTasks && (
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-stone-100 overflow-hidden">
                            {openTasks.map((task, idx) => (
                                <div key={task.id} className={`p-4 flex items-center gap-4 ${idx !== openTasks.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                        {task.type === 'medication' ? <Pill className="w-5 h-5" /> :
                                            task.type === 'appointment' ? <Clock className="w-5 h-5" /> :
                                                <Activity className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-stone-700">{task.title}</p>
                                        <p className="text-xs text-stone-500">{task.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Completed Tasks - DISABLED for now (uncomment to re-enable) */}
            {false && completedTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors mb-3"
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-teal-600" />
                            <span className="font-bold text-teal-800">Udførte opgaver ({completedTasks.length})</span>
                        </div>
                        {showCompleted ? <ChevronUp className="w-5 h-5 text-teal-600" /> : <ChevronDown className="w-5 h-5 text-teal-600" />}
                    </button>

                    {showCompleted && (
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-stone-100 overflow-hidden">
                            {completedTasks.map((task, idx) => (
                                <div key={task.id} className={`p-4 flex items-center gap-4 ${idx !== completedTasks.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                    <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600">
                                        {task.type === 'medication' ? <Pill className="w-5 h-5" /> :
                                            task.type === 'appointment' ? <Clock className="w-5 h-5" /> :
                                                <Activity className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-stone-500 line-through">{task.title}</p>
                                        <p className="text-xs text-stone-400">{task.description}</p>
                                    </div>
                                    <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">UDFØRT</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Task Button */}
            <Button
                variant="outline"
                className="w-full h-auto py-4 bg-white"
                onClick={onAddTask}
            >
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Tilføj påmindelse til {seniorName}</span>
                </div>
            </Button>
        </div>
    );
};

export default CoordinationTab;

```
---

## File: tryg-app\src\components\ErrorBoundary.tsx
```tsx
import React, { ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to console in development
        console.error('App Error:', error, errorInfo);

        // Send to Sentry for production monitoring
        Sentry.captureException(error, { extra: errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-8 text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-orange-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-stone-800 mb-2">
                        Ups! Noget gik galt
                    </h1>

                    <p className="text-stone-500 mb-8 max-w-xs">
                        Der opstod en fejl. Prøv at genstarte appen.
                    </p>

                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-teal-700 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Prøv igen
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mt-8 text-left bg-stone-100 p-4 rounded-xl max-w-sm">
                            <summary className="text-sm text-stone-600 cursor-pointer">
                                Tekniske detaljer
                            </summary>
                            <pre className="text-xs text-red-600 mt-2 overflow-auto">
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

```
---

## File: tryg-app\src\components\HealthReport.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { SYMPTOMS_LIST } from '../data/constants';
// Import types
import { SymptomLog } from '../features/symptoms/useSymptoms';
import { Task } from '../features/tasks/useTasks';

export interface HealthReportProps {
    isOpen: boolean;
    onClose: () => void;
    symptomLogs?: SymptomLog[];
    tasks?: Task[];
    title?: string;
}

// Health Report Component - Shows symptoms and medicine compliance
// Used by both SeniorView and RelativeView
export const HealthReport: React.FC<HealthReportProps> = ({
    isOpen,
    onClose,
    symptomLogs = [],
    tasks = [],
    title = "Rapport til Lægen"
}) => {
    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(() => {
        // Today's date key for default expansion
        const today = new Date().toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
        return { [today]: true };
    });
    const [filterDate, setFilterDate] = useState<string | null>(null); // null = show all

    // Calculate completion rate
    const completionRate = useMemo(() => {
        if (tasks.length === 0) return 100;
        return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
    }, [tasks]);

    // Group symptoms by date
    const groupedSymptoms = useMemo(() => {
        const grouped: Record<string, (SymptomLog & { dateObj: Date })[]> = {};
        symptomLogs.forEach(log => {
            const date = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt);
            const dateKey = date.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push({ ...log, dateObj: date });
        });
        return grouped;
    }, [symptomLogs]);

    // Chart data - 14 days
    const chartData = useMemo(() => {
        const days = Array(14).fill(null).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            return {
                date: d,
                dateKey: d.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' }),
                count: 0
            };
        });

        symptomLogs.forEach(log => {
            const date = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt);
            const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (daysAgo >= 0 && daysAgo < 14) {
                days[13 - daysAgo].count++;
            }
        });

        return days;
    }, [symptomLogs]);

    const maxCount = Math.max(...chartData.map(d => d.count), 1);

    // Filter symptoms based on chart selection
    const displayedSymptoms = useMemo(() => {
        if (!filterDate) return groupedSymptoms;
        return { [filterDate]: groupedSymptoms[filterDate] || [] };
    }, [groupedSymptoms, filterDate]);

    // Summary stats
    const totalSymptoms = symptomLogs.length;
    const symptomCounts: Record<string, number> = {};
    symptomLogs.forEach(log => {
        const label = log.label || 'Unknown';
        symptomCounts[label] = (symptomCounts[label] || 0) + 1;
    });
    const mostCommon = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

    const toggleDate = (dateKey: string) => {
        setExpandedDates(prev => ({
            ...prev,
            [dateKey]: !prev[dateKey]
        }));
    };

    const handleChartClick = (dateKey: string) => {
        if (filterDate === dateKey) {
            setFilterDate(null); // Clear filter
        } else {
            setFilterDate(dateKey);
            // Also expand that date
            setExpandedDates(prev => ({ ...prev, [dateKey]: true }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                {/* Summary Stats */}
                {totalSymptoms > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                            <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                            <p className="text-xs text-orange-500">Symptomer (14 dage)</p>
                        </div>
                        {mostCommon && (
                            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                                <p className="text-xs text-purple-500">Mest hyppige ({mostCommon[1]}x)</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Clickable Chart */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800">Symptom-oversigt (14 dage)</h4>
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate(null)}
                                className="text-xs text-orange-600 font-medium hover:underline"
                            >
                                Vis alle
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Tryk på en søjle for at filtrere</p>
                    <div className="flex items-end gap-1 h-24 pb-2">
                        {chartData.map((day, i) => (
                            <button
                                key={i}
                                onClick={() => day.count > 0 && handleChartClick(day.dateKey)}
                                className={`flex-1 flex flex-col items-center gap-1 transition-all ${filterDate === day.dateKey ? 'scale-110' : ''
                                    } ${day.count > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {day.count > 0 && (
                                    <span className={`text-[10px] font-bold ${filterDate === day.dateKey ? 'text-orange-800' : 'text-orange-600'
                                        }`}>{day.count}</span>
                                )}
                                <div
                                    className={`w-full rounded-t-sm transition-all ${day.count > 0
                                        ? filterDate === day.dateKey
                                            ? 'bg-orange-600'
                                            : 'bg-orange-400 hover:bg-orange-500'
                                        : 'bg-slate-200'
                                        }`}
                                    style={{ height: `${Math.max((day.count / maxCount) * 60, 4)}px` }}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>-14 dage</span><span>I dag</span>
                    </div>
                </div>

                {/* Medicine compliance with percentage labels */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">Overholdelse af medicin (7 dage)</h4>
                    <div className="flex items-end gap-2 h-28 pb-2">
                        {[80, 90, 100, 85, 95, 100, completionRate].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-indigo-600">{h}%</span>
                                <div
                                    className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ height: `${h * 0.6}px` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>-7 dage</span><span>I dag</span>
                    </div>
                </div>

                {/* Symptom Log - Accordion by Date */}
                <div>
                    <h4 className="font-bold text-slate-800 mb-3">
                        Symptom Log {filterDate ? `(${filterDate})` : '(sidste 14 dage)'}
                    </h4>
                    {Object.keys(displayedSymptoms).length === 0 ? (
                        <p className="text-slate-500 text-sm italic">Ingen symptomer registreret.</p>
                    ) : (
                        <div className="space-y-2">
                            {Object.entries(displayedSymptoms).map(([dateStr, logs]) => (
                                <div key={dateStr} className="border rounded-xl overflow-hidden">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleDate(dateStr)}
                                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <span className="font-bold text-slate-700">{dateStr}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{logs?.length || 0} symptomer</span>
                                            {expandedDates[dateStr] ? (
                                                <ChevronUp className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Accordion Content */}
                                    {expandedDates[dateStr] && logs && (
                                        <ul className="divide-y border-t">
                                            {logs.map((log, i) => {
                                                const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || { icon: AlertCircle, label: 'Ukendt' };
                                                const SymptomIcon = symptomDef.icon || AlertCircle;
                                                const timeStr = log.dateObj.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });


                                                return (
                                                    <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white">
                                                        <div className="flex items-center gap-3">
                                                            <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                            <span className="font-medium text-slate-700">{log.label}</span>
                                                            <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                        </div>
                                                        {log.bodyLocation && (
                                                            <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                                <div>📍 Lokation: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                                {log.bodyLocation.severity && (
                                                                    <div>📊 Intensitet: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default HealthReport;

```
---

## File: tryg-app\src\components\InstallPrompt.tsx
```tsx
// @ts-check
/**
 * iOS PWA Install Prompt
 * 
 * Shows installation instructions for iOS Safari users who haven't
 * added the app to their home screen yet. This improves the PWA
 * experience by guiding seniors to "Add to Home Screen".
 */

import React, { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';

/**
 * Detects if user is on iOS Safari (not in standalone/PWA mode)
 */
const useIOSInstallPrompt = () => {
    const [shouldShow, setShouldShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if iOS device
        // @ts-ignore - MSStream is IE-specific, used for detection
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // Check if already in standalone mode (installed as PWA)
        // @ts-ignore - standalone is Safari-specific
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        // Check if already dismissed (stored in localStorage)
        const wasDismissed = localStorage.getItem('pwa-install-dismissed');

        if (isIOS && !isStandalone && !wasDismissed) {
            // Delay showing prompt for better UX
            const timer = setTimeout(() => setShouldShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setDismissed(true);
        setShouldShow(false);
        // Remember dismissal for 7 days
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    return { shouldShow, dismiss };
};

/**
 * PWA Install Prompt Component
 * Shows localized (Danish) instructions for adding to home screen
 */
export const InstallPrompt: React.FC = () => {
    const { shouldShow, dismiss } = useIOSInstallPrompt();

    if (!shouldShow) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 bg-white p-6 shadow-2xl z-50 animate-slide-up border-t-4 border-teal-500 safe-area-bottom">
            {/* Close button */}
            <button
                onClick={dismiss}
                className="absolute top-3 right-3 p-2 text-stone-400 hover:text-stone-600"
                aria-label="Luk"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Share className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                    <p className="font-bold text-lg text-stone-800">Få den bedste oplevelse</p>
                    <p className="text-sm text-stone-500">Installer appen på din hjemmeskærm</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <ol className="space-y-3 text-stone-700">
                    <li className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        <span>Tryk på <span className="inline-flex items-center gap-1 font-bold text-blue-600"><Share className="w-4 h-4" /> Del</span> knappen nedenfor</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        <span>Vælg <span className="font-bold">"Føj til hjemmeskærm"</span></span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        <span>Tryk <span className="font-bold">"Tilføj"</span> øverst til højre</span>
                    </li>
                </ol>
            </div>

            {/* Bouncing arrow pointing to Safari's share button */}
            <div className="flex flex-col items-center text-stone-400">
                <span className="text-xs mb-1">Del-knappen er her</span>
                <span className="text-2xl animate-bounce">👇</span>
            </div>
        </div>
    );
};

export default InstallPrompt;

```
---

## File: tryg-app\src\components\layouts\RelativeViewLayout.jsx
```jsx
/**
 * RelativeViewLayout - Dumb layout shell for the Relative dashboard
 * 
 * This is a pure layout component with no business logic.
 * Uses "slot" pattern for composability.
 */

import React from 'react';

export const RelativeViewLayout = ({
    header,
    content,
    footer,
    modals,
    backgroundClass = 'bg-stone-50'
}) => (
    <div className={`flex flex-col h-full ${backgroundClass}`}>
        {/* Header slot */}
        {header && <div className="z-10 flex-shrink-0">{header}</div>}

        {/* Main content area - scrollable */}
        <main className="flex-1 overflow-y-auto">
            {content}
        </main>

        {/* Footer slot (e.g., bottom navigation) */}
        {footer && <div className="z-20 flex-shrink-0">{footer}</div>}

        {/* Modals slot - rendered at top level for proper z-index */}
        {modals}
    </div>
);

export default RelativeViewLayout;

```
---

## File: tryg-app\src\components\PeaceOfMindTab.tsx
```tsx
import React from 'react';
import { Heart, Clock, Pill, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { StatusCard } from '../features/familyPresence';
import { ThinkingOfYouIconButton } from '../features/thinkingOfYou';
import { ProgressRing } from '../features/tasks';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { getDailyBriefing } from '../utils/briefing';
import { Member, CareCircleContextValue } from '../types';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';

export interface PeaceOfMindTabProps {
    seniorName?: string;
    lastCheckIn?: any;
    tasks?: Task[];
    symptomCount?: number;
    symptoms?: SymptomLog[];
    onSendPing?: () => void;
    onViewSymptoms?: () => void;
    recentActivity?: any[];
}

// Peace of Mind Tab - emotional reassurance focused
// Shows: "Alt er vel" hero with Gates progress, quick glance stats, connection history
// Uses CareCircleContext for shared data (props as optional overrides)
export const PeaceOfMindTab: React.FC<PeaceOfMindTabProps> = ({
    seniorName: propSeniorName,
    lastCheckIn,
    tasks = [],
    symptomCount = 0,
    symptoms = [],
    onSendPing,
    onViewSymptoms,
    recentActivity = []
}) => {
    // Get from context, use props as override
    const context = useCareCircleContext() as CareCircleContextValue;
    const seniorName = propSeniorName ?? context.seniorName ?? 'Senior';

    // Calculate completion rate from tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Determine peace of mind status
    const getPeaceOfMindStatus = () => {
        // Check for overdue tasks
        const currentHour = new Date().getHours();
        const morningTasks = tasks.filter(t => t.period === 'morgen');
        const morningComplete = morningTasks.every(t => t.completed);
        const afternoonTasks = tasks.filter(t => t.period === 'eftermiddag');
        const afternoonComplete = afternoonTasks.every(t => t.completed);

        // If morning is past and tasks incomplete, show warning
        if (currentHour >= 12 && morningTasks.length > 0 && !morningComplete) {
            return {
                label: 'Morgen mangler',
                sublabel: 'Ikke alle morgenopgaver er udført',
                color: 'from-orange-500 to-orange-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        // If afternoon is past and tasks incomplete
        if (currentHour >= 18 && afternoonTasks.length > 0 && !afternoonComplete) {
            return {
                label: 'Eftermiddag mangler',
                sublabel: 'Ikke alle eftermiddagsopgaver er udført',
                color: 'from-amber-500 to-amber-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        if (completionRate >= 80) {
            return {
                label: 'Alt er vel ✨',
                sublabel: `${seniorName} har det godt`,
                color: 'from-teal-500 to-teal-600',
                icon: CheckCircle,
                urgent: false
            };
        }
        if (completionRate >= 50) {
            return {
                label: 'God dag',
                sublabel: 'Dagen skrider fremad',
                color: 'from-teal-500 to-teal-600',
                icon: CheckCircle,
                urgent: false
            };
        }
        return {
            label: 'Tjek ind',
            sublabel: 'Der er opgaver at følge op på',
            color: 'from-amber-500 to-amber-600',
            icon: Clock,
            urgent: false
        };
    };

    const status = getPeaceOfMindStatus();
    const StatusIcon = status.icon;

    // Get period-specific stats for quick glance
    const getMedicineStatus = () => {
        const medTasks = tasks.filter(t => t.title?.toLowerCase().includes('medicin') || t.title?.toLowerCase().includes('pille'));
        if (medTasks.length === 0) return { text: 'Ingen planlagt', color: 'text-stone-500' };
        const completed = medTasks.filter(t => t.completed).length;
        const total = medTasks.length;
        if (completed === total) return { text: 'Alle taget ✓', color: 'text-green-600' };
        return { text: `${completed}/${total} taget`, color: completed > 0 ? 'text-amber-600' : 'text-red-600' };
    };

    const medicineStatus = getMedicineStatus();

    return (
        <div className="space-y-4">
            {/* HERO: Peace of Mind Card with Atmospheric Background details */}
            <StatusCard
                mode="senior"
                name={seniorName}
                timestamp={lastCheckIn}
                completionRate={completionRate}
                tasks={tasks}
                symptomCount={symptomCount}
                onViewSymptoms={onViewSymptoms}
            />
            {/* Thinking of You - moved outside card if needed or keep inside? SeniorStatusCard doesn't have it built-in. */}
            {/* Adding ThinkingOfYouIconButton below the card or integrate into a separate actions row if preferred. */}
            <div className="flex justify-end -mt-2 mb-2">
                <ThinkingOfYouIconButton onSendPing={onSendPing} />
            </div>

            {/* SMART SUMMARY - Natural Language Briefing */}
            {(() => {
                const briefing = getDailyBriefing({ tasks, symptoms, seniorName, lastCheckIn });
                return (
                    <div className={`p-4 rounded-xl border-2 ${briefing.type === 'success' ? 'bg-green-50 border-green-200' :
                        briefing.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                            'bg-stone-50 border-stone-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{briefing.emoji}</span>
                            <div className="flex-1">
                                <p className={`font-medium ${briefing.type === 'success' ? 'text-green-800' :
                                    briefing.type === 'warning' ? 'text-amber-800' :
                                        'text-stone-700'
                                    }`}>
                                    {briefing.message}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Connection History - DISABLED for now (uncomment to re-enable) */}
            {false && recentActivity.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Seneste aktivitet</h3>
                    <div className="space-y-2">
                        {recentActivity.slice(0, 5).map((activity, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                                <span className="text-stone-400">{activity.time}</span>
                                <span>{activity.emoji}</span>
                                <span>{activity.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeaceOfMindTab;

```
---

## File: tryg-app\src\components\PrivacySettings.tsx
```tsx
// Privacy Settings Screen - GDPR data export, deletion, and pause controls
// Accessible from app settings

import React, { useState } from 'react';
import {
    Shield,
    Download,
    Trash2,
    Pause,
    Play,
    ChevronRight,
    AlertTriangle,
    Check,
    Loader2,
    X
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { CareCircle } from '../types';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';

export interface PrivacySettingsProps {
    user: any; // User from firebase/auth
    careCircle: CareCircle | null;
    onClose: () => void;
    onPauseChange?: (paused: boolean) => void;
    isPaused?: boolean;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
    user,
    careCircle,
    onClose,
    onPauseChange,
    isPaused = false
}) => {
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Export all user data as JSON
    const handleExportData = async () => {
        setExporting(true);
        try {
            const exportData = {
                exportDate: new Date().toISOString(),
                user: {
                    email: user.email,
                    displayName: user.displayName,
                    uid: user.uid,
                },
                careCircle: careCircle ? {
                    id: careCircle.id,
                    seniorName: careCircle.seniorName,
                } : null,
                tasks: [] as Task[],
                symptoms: [] as SymptomLog[],
                settings: [] as any[],
            };

            if (careCircle?.id) {
                // Fetch tasks
                const tasksSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'tasks')
                );
                exportData.tasks = tasksSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Task[];

                // Fetch symptoms
                const symptomsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'symptoms')
                );
                exportData.symptoms = symptomsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as SymptomLog[];

                // Fetch settings
                const settingsDoc = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'settings')
                );
                exportData.settings = settingsDoc.docs.map(d => ({ id: d.id, ...d.data() }));
            }

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tryg-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setExported(true);
            setTimeout(() => setExported(false), 3000);
        } catch (err) {
            console.error('Export error:', err);
            alert('Der opstod en fejl ved eksport af data');
        } finally {
            setExporting(false);
        }
    };

    // Delete all user data and account
    const handleDeleteAccount = async () => {
        setDeleting(true);
        setDeleteError(null);

        try {
            const batch = writeBatch(db);

            // Delete care circle data if exists
            if (careCircle?.id) {
                // Delete tasks
                const tasksSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'tasks')
                );
                tasksSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete symptoms
                const symptomsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'symptoms')
                );
                symptomsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete settings
                const settingsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'settings')
                );
                settingsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete pings
                const pingsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'pings')
                );
                pingsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete membership
                batch.delete(doc(db, 'careCircleMemberships', `${careCircle.id}_${user.uid}`));

                // If user is the senior (owner), delete the circle itself
                if (careCircle.seniorId === user.uid) {
                    batch.delete(doc(db, 'careCircles', careCircle.id));
                }
            }

            // Delete user profile
            batch.delete(doc(db, 'users', user.uid));

            // Commit all deletes
            await batch.commit();

            // Delete Firebase Auth account
            if (auth.currentUser) {
                await deleteUser(auth.currentUser);
            }

            // User is now logged out, page will redirect to login
        } catch (err: any) {
            console.error('Delete error:', err);
            if (err.code === 'auth/requires-recent-login') {
                setDeleteError('Du skal logge ind igen for at slette din konto. Log ud og log ind igen.');
            } else {
                setDeleteError('Der opstod en fejl. Prøv igen senere.');
            }
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white p-4 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-teal-600" />
                        </div>
                        <h2 className="text-xl font-bold text-stone-800">Privatliv & Data</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">

                    {/* Pause Sharing */}
                    <div className="bg-stone-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isPaused ? (
                                    <Pause className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <Play className="w-6 h-6 text-teal-600" />
                                )}
                                <div>
                                    <h3 className="font-bold text-stone-800">Pause deling</h3>
                                    <p className="text-sm text-stone-500">
                                        {isPaused ? 'Din familie kan ikke se dine aktiviteter' : 'Din familie kan se dine aktiviteter'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onPauseChange?.(!isPaused)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${isPaused ? 'bg-amber-500' : 'bg-teal-500'
                                    }`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${isPaused ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Export Data */}
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="w-full bg-stone-50 rounded-2xl p-4 flex items-center justify-between hover:bg-stone-100 transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3">
                            {exporting ? (
                                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                            ) : exported ? (
                                <Check className="w-6 h-6 text-teal-600" />
                            ) : (
                                <Download className="w-6 h-6 text-teal-600" />
                            )}
                            <div className="text-left">
                                <h3 className="font-bold text-stone-800">Download mine data</h3>
                                <p className="text-sm text-stone-500">Få en kopi af alle dine data</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400" />
                    </button>

                    {/* Delete Account */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-50 rounded-2xl p-4 flex items-center justify-between hover:bg-red-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-6 h-6 text-red-600" />
                                <div className="text-left">
                                    <h3 className="font-bold text-red-800">Slet min konto</h3>
                                    <p className="text-sm text-red-600">Sletter alle dine data permanent</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                    ) : (
                        <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="font-bold text-red-800">Er du sikker?</h3>
                            </div>
                            <p className="text-sm text-red-700 mb-4">
                                Dette vil permanent slette alle dine data, inklusiv opgaver, symptomer, og din konto.
                                Dette kan ikke fortrydes.
                            </p>

                            {deleteError && (
                                <div className="bg-red-100 text-red-800 p-3 rounded-xl text-sm mb-4">
                                    {deleteError}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-white text-stone-700 rounded-xl font-medium hover:bg-stone-100"
                                >
                                    Annuller
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sletter...
                                        </>
                                    ) : (
                                        'Ja, slet alt'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info section */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-stone-400">
                            Dine data opbevares i EU (Frankfurt) og er krypteret.
                        </p>
                        <a
                            href="/privacy-policy.html"
                            className="text-xs text-teal-600 hover:underline"
                        >
                            Læs vores fulde privatlivspolitik
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;

```
---

## File: tryg-app\src\components\RelativeView.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from '../features/weeklyQuestion';
import { RelativeBottomNavigation } from './BottomNavigation';
import { PeaceOfMindTab } from './PeaceOfMindTab';
import { CoordinationTab } from './CoordinationTab';
import { MatchCelebration } from '../features/helpExchange';
import { TimePickerModal } from '../features/tasks';
import { Spillehjoernet } from '../features/wordGame';
import { FEATURES } from '../config/features';
import { SYMPTOMS_LIST } from '../data/constants';
import { AlertCircle } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';

export interface RelativeViewProps {
    tasks: Task[];
    profile: any; // UserProfile
    lastCheckIn?: any;
    symptomLogs: SymptomLog[];
    onAddTask: (task: Partial<Task>) => void;
    myStatus?: string;
    onMyStatusChange?: (status: string) => void;
    memberStatuses?: any[];
    currentUserId?: string | null;
    onSendPing: (type: string) => void;
    weeklyAnswers: any[];
    onWeeklyAnswer: (answer: string) => void;
    onOpenSettings: () => void;
    userName?: string;
    seniorName?: string;
    careCircleId?: string | null;
}

export const RelativeView: React.FC<RelativeViewProps> = ({
    tasks, profile, lastCheckIn, symptomLogs, onAddTask,
    myStatus = 'home', onMyStatusChange,
    memberStatuses = [], currentUserId = null,
    onSendPing, weeklyAnswers, onWeeklyAnswer,
    // HelpExchange props removed
    onOpenSettings, userName = 'Pårørende', seniorName = 'Mor', careCircleId = null
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen'); // Period selector for new tasks
    const [activeTab, setActiveTab] = useState<'daily' | 'family' | 'spil'>('daily'); // 'daily' = Peace of Mind, 'family' = Coordination, 'spil' = Gaming
    const [activeMatch, setActiveMatch] = useState<any | null>(null); // 
    const [pendingAction, setPendingAction] = useState<any | null>(null); // Stores action info for time picker
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dismissedMatchIds, setDismissedMatchIds] = useState(new Set()); // Track dismissed matches

    const openTasks = tasks.filter(t => !t.completed);
    const completedTasksList = tasks.filter(t => t.completed);

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

    // Count today's symptoms
    const todaySymptomCount = symptomLogs.filter(s => {
        const date = (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any);
        return date.toDateString() === new Date().toDateString();
    }).length;

    // Period to time mapping
    const PERIOD_TIMES: Record<string, string> = {
        morgen: '08:00',
        frokost: '12:00',
        eftermiddag: '14:00',
        aften: '19:00'
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask({
            title: newTaskTitle.trim(),
            time: PERIOD_TIMES[newTaskPeriod],
            type: 'appointment',
            description: `Tilføjet af ${userName}`,
            period: newTaskPeriod
        });
        setNewTaskTitle('');
        setNewTaskPeriod('morgen');
        setShowAddModal(false);
    };

    // Generate activity feed from tasks and symptoms
    const recentActivity = useMemo(() => {
        const activities: any[] = [];

        // Add completed tasks
        tasks.filter(t => t.completed && t.completedAt).forEach(t => {
            activities.push({
                type: 'task',
                timestamp: (t.completedAt as any)?.toDate ? (t.completedAt as any).toDate() : new Date(t.completedAt as any),
                text: `Udført: ${t.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms
        symptomLogs.forEach(s => {
            activities.push({
                type: 'symptom',
                timestamp: (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any),
                text: `Symptom: ${s.label || s.type || 'Ukendt'}`,
                emoji: '🩺'
            });
        });

        // Sort by time (newest first)
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map(a => ({
                ...a,
                time: a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [tasks, symptomLogs]);

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar
                            id={(userName.includes('Fatima') || userName === 'Test User') ? 'fatima' : userName === 'Brad' ? 'brad' : 'louise'}
                            size="md"
                            className="bg-indigo-50"
                        />
                        <span className="font-semibold text-stone-700 text-sm">Hej, {userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Weekly Question widget */}
                        {FEATURES.weeklyQuestion && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        <button
                            onClick={onOpenSettings}
                            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                            aria-label="Indstillinger"
                        >
                            <Settings className="w-5 h-5 text-stone-500" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Tab based */}
            <main className="flex-1 p-4 overflow-y-auto pb-28">
                {/* ===== DAILY TAB ===== */}
                {activeTab === 'daily' && (
                    <PeaceOfMindTab
                        seniorName={seniorName}
                        lastCheckIn={lastCheckIn}
                        tasks={tasks}
                        symptomCount={todaySymptomCount}
                        onSendPing={onSendPing}
                        onViewSymptoms={() => setActiveTab('family')}
                        recentActivity={recentActivity}
                    />
                )}

                {/* ===== FAMILY TAB ===== */}
                {activeTab === 'family' && (
                    <CoordinationTab
                        seniorName={seniorName}
                        userName={userName}
                        myStatus={myStatus}
                        onMyStatusChange={onMyStatusChange}
                        memberStatuses={memberStatuses}
                        currentUserId={currentUserId}
                        // HelpExchange props removed - now fetched internally
                        openTasks={openTasks}
                        completedTasks={completedTasksList}
                        symptomLogs={symptomLogs}
                        onAddTask={() => setShowAddModal(true)}
                        onViewReport={() => setShowReport(true)}
                        onMatchAction={(match) => setActiveMatch(match)}
                        onDismissMatch={(matchId) => {
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }}
                        dismissedMatchIds={dismissedMatchIds}
                        careCircleId={careCircleId}
                    />
                )}

                {/* ===== SPIL TAB ===== */}
                {activeTab === 'spil' && (
                    <>
                        {FEATURES.spillehjoernet && (
                            <Spillehjoernet
                                circleId={careCircleId || undefined}
                                userId={currentUserId || undefined}
                                displayName={userName}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            <RelativeBottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onShowReport={() => setShowReport(true)}
            />

            {/* Add Task Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ny påmindelse">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Titel</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="F.eks. Lægebesøg"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hvornår?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'morgen', label: 'Morgen', time: '8-11', emoji: '☀️' },
                                { id: 'frokost', label: 'Frokost', time: '12-13', emoji: '🍽️' },
                                { id: 'eftermiddag', label: 'Eftermiddag', time: '14-17', emoji: '🌤️' },
                                { id: 'aften', label: 'Aften', time: '18-21', emoji: '🌙' }
                            ].map(period => (
                                <button
                                    key={period.id}
                                    onClick={() => setNewTaskPeriod(period.id)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${newTaskPeriod === period.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <span className="text-lg mr-1">{period.emoji}</span>
                                    <span className="font-medium">{period.label}</span>
                                    <span className="text-xs text-slate-500 block">{period.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        Denne påmindelse vil straks dukke op på {seniorName}s skærm.
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>Tilføj</Button>
                </div>
            </Modal>

            {/* Doctor Report Modal */}
            <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport til Lægen">
                <div className="space-y-6">
                    {/* Summary Stats */}
                    {(() => {
                        const totalSymptoms = symptomLogs.length;
                        const symptomCounts: Record<string, number> = {};
                        symptomLogs.forEach(log => {
                            symptomCounts[log.label] = (symptomCounts[log.label] || 0) + 1;
                        });
                        const mostCommon = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

                        return totalSymptoms > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                                    <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                                    <p className="text-xs text-orange-500">Symptomer (14 dage)</p>
                                </div>
                                {mostCommon && (
                                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                        <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                                        <p className="text-xs text-purple-500">Mest hyppige ({mostCommon[1]}x)</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* 14-day symptom overview chart with counts */}
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <h4 className="font-bold text-slate-800 mb-2">Symptom-oversigt (14 dage)</h4>
                        <div className="flex items-end gap-1 h-24 pb-2">
                            {(() => {
                                const days = Array(14).fill(0);
                                symptomLogs.forEach(log => {
                                    const date = (log.loggedAt as any)?.toDate ? (log.loggedAt as any).toDate() : new Date(log.loggedAt as any);
                                    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
                                    if (daysAgo >= 0 && daysAgo < 14) {
                                        days[13 - daysAgo]++;
                                    }
                                });
                                const max = Math.max(...days, 1);
                                return days.map((count, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        {count > 0 && (
                                            <span className="text-[10px] font-bold text-orange-600">{count}</span>
                                        )}
                                        <div
                                            className={`w-full rounded-t-sm transition-opacity ${count > 0 ? 'bg-orange-400 hover:bg-orange-500' : 'bg-slate-200'}`}
                                            style={{ height: `${Math.max((count / max) * 60, 4)}px` }}
                                            title={`${count} symptomer`}
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-14 dage</span><span>I dag</span>
                        </div>
                    </div>

                    {/* Medicine compliance with percentage labels */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">Overholdelse af medicin (7 dage)</h4>
                        <div className="flex items-end gap-2 h-28 pb-2">
                            {[80, 90, 100, 85, 95, 100, completionRate].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold text-indigo-600">{h}%</span>
                                    <div
                                        className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ height: `${h * 0.6}px` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-7 dage</span><span>I dag</span>
                        </div>
                    </div>

                    {/* Symptom Log - Grouped by Date */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3">Symptom Log (sidste 14 dage)</h4>
                        {symptomLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">Ingen symptomer registreret.</p>
                        ) : (
                            (() => {
                                // Group symptoms by date
                                const grouped: Record<string, any[]> = {};
                                symptomLogs.forEach(log => {
                                    const date = (log.loggedAt as any)?.toDate ? (log.loggedAt as any).toDate() : new Date(log.loggedAt as any);
                                    const dateKey = date.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
                                    if (!grouped[dateKey]) grouped[dateKey] = [];
                                    grouped[dateKey].push({ ...log, dateObj: date });
                                });

                                return (
                                    <div className="space-y-4">
                                        {Object.entries(grouped).map(([dateStr, logs]) => (
                                            <div key={dateStr}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase">{dateStr}</span>
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                </div>
                                                <ul className="space-y-2">
                                                    {logs.map((log, i) => {
                                                        const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || {} as any;
                                                        const SymptomIcon = symptomDef.icon || AlertCircle;
                                                        const timeStr = log.dateObj.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

                                                        return (
                                                            <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white border rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                                    <span className="font-medium text-slate-700">{log.label}</span>
                                                                    <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                                </div>
                                                                {log.bodyLocation && (
                                                                    <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                                        <div>📍 Lokation: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                                        {log.bodyLocation.severity && (
                                                                            <div>📊 Intensitet: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
            </Modal>

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={onWeeklyAnswer}
                userName={userName}
            />

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={seniorName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Store action info and open time picker
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = `📞 Ring til ${seniorName}`;
                                break;
                            case 'plan-visit':
                                taskTitle = `☕ Besøg hos ${seniorName}`;
                                break;
                            case 'plan-meal':
                                taskTitle = `🍳 Lav mad med ${seniorName}`;
                                break;
                            case 'plan-transport':
                                taskTitle = `🚗 Kør ${seniorName}`;
                                break;
                            case 'plan-garden':
                                taskTitle = `🌿 Havearbejde med ${seniorName}`;
                                break;
                            default:
                                taskTitle = celebration?.title || `Opgave med ${seniorName}`;
                        }

                        // Store pending action and show time picker
                        setPendingAction({
                            title: taskTitle,
                            action: action,
                            celebration: celebration,
                            matchToDissmiss: activeMatch // Store match for dismissal
                        });
                        setActiveMatch(null);
                        setShowTimePicker(true);
                    }}
                />
            )}

            {/* Time Picker Modal */}
            <TimePickerModal
                isOpen={showTimePicker}
                onClose={() => {
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
                title="Hvornår?"
                actionLabel={pendingAction?.title || 'Opret opgave'}
                seniorName={seniorName}
                onConfirm={({ time, label, period }) => {
                    if (onAddTask && pendingAction) {
                        onAddTask({
                            title: pendingAction.title,
                            time: time,
                            period: period || 'morgen', // Include period for proper sorting
                            type: 'appointment',
                            description: `Tilføjet af ${userName}`,
                            createdByRole: 'relative'
                        });

                        // Dismiss the match so it doesn't reappear
                        if (pendingAction.matchToDissmiss) {
                            const match = pendingAction.matchToDissmiss;
                            const offerId = match.offer?.docId || match.offer?.id || 'none';
                            const requestId = match.request?.docId || match.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }

                        // Show confirmation to user
                        alert(`✅ Opgave oprettet: ${pendingAction.title} kl. ${time}`);
                    }
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
            />
        </div>
    );
};

export default RelativeView;

```
---

## File: tryg-app\src\components\SeniorView.tsx
```tsx
import React, { useState } from 'react';
import {
    CheckCircle,
    Phone,
    Heart,
    Pill,
    Activity,
    Sun,
    Moon,
    Clock,
    Coffee,
    Image as ImageIcon,
    ChevronDown,
    ChevronUp,
    Plus
} from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { StatusList } from '../features/familyPresence';
import { FamilyPresence } from '../features/familyPresence';
import { ThinkingOfYouButton } from '../features/thinkingOfYou';
import { BodyPainSelector } from '../features/symptoms';
import { MemoryTrigger } from '../features/weeklyQuestion';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from '../features/weeklyQuestion';
import { HelpExchange } from '../features/helpExchange';
import { BottomNavigation } from './BottomNavigation';
import { SYMPTOMS_LIST } from '../data/constants';
import { FEATURES } from '../config/features';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { MatchCelebration, MatchBanner } from '../features/helpExchange';
import { InlineGatesIndicator } from '../features/tasks';
import { Spillehjoernet } from '../features/wordGame';
import { HealthReport } from './HealthReport';
import { playMatchSound } from '../utils/sounds';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';
import { Member } from '../types';

export interface SeniorViewProps {
    tasks: Task[];
    toggleTask: (id: string) => void;
    updateStatus: (status: string) => void;
    addSymptom: (symptom: any) => void;
    statusLastUpdated?: any;
    onSendPing: (type: string) => void;
    weeklyAnswers: any[];
    onWeeklyAnswer: (answer: string) => void;
    members?: Member[];
    memberStatuses?: any[];
    currentUserId?: string | null;
    relativeStatuses?: any[];
    userName?: string;
    relativeName?: string;
    careCircleId?: string | null;
    symptomLogs?: SymptomLog[];
    onAddTask?: (task: Partial<Task>) => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
    tasks, toggleTask, updateStatus, addSymptom, statusLastUpdated, onSendPing,
    weeklyAnswers, onWeeklyAnswer,
    // HelpExchange props removed
    members = [], memberStatuses = [], currentUserId = null, relativeStatuses = [],
    userName = 'Senior', relativeName = 'Familie', careCircleId = null, symptomLogs = [], onAddTask
}) => {
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showHealthReport, setShowHealthReport] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [rewardMinimized, setRewardMinimized] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [activePeriod, setActivePeriod] = useState<string | null>('morgen');
    const [activeTab, setActiveTab] = useState<'daily' | 'family' | 'spil'>('daily'); // 'daily', 'family', or 'spil'
    const [activeMatch, setActiveMatch] = useState<any | null>(null); // For match celebration modal
    const [dismissedMatchIds, setDismissedMatchIds] = useState(new Set()); // Track dismissed matches
    const [hideReward, setHideReward] = useState(false); // Hide medicine reward for session

    // Fetch HelpExchange data directly
    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);

    // Filter offers/requests by role
    // Senior's items
    const helpOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'senior');
    // Relative's items
    const relativeOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'relative');

    // Map handlers
    const onHelpOffer = addOffer;
    const onHelpRequest = addRequest;
    const onRemoveOffer = removeOffer;
    const onRemoveRequest = removeRequest;

    /*
    console.debug('👴 [SeniorView] Help Data:', {
        offers: helpOffers.length,
        requests: helpRequests.length,
        relOffers: relativeOffers.length,
        relRequests: relativeRequests.length
    });
    */

    // Combine all offers/requests for match detection (using local filtered vars)
    const allOffers = [
        ...helpOffers.map((o: any) => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map((o: any) => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map((r: any) => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map((r: any) => ({ ...r, createdByRole: 'relative' }))
    ];

    const { match, dismissMatch, hasMatches, topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: null, // Senior view doesn't track their own status
        memberStatuses
    });

    // Two-step symptom flow: symptom type → body location (for pain)
    const [selectedSymptom, setSelectedSymptom] = useState<any | null>(null);
    const [showBodySelector, setShowBodySelector] = useState(false);

    // Reward Logic - unlock photo when ALL MEDICINE is complete (not all tasks)
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        t.type === 'medication'
    );
    const completedMedicine = medicineTasks.filter(t => t.completed).length;
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.length === completedMedicine;

    // For general stats
    // const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Godmorgen' : hour < 18 ? 'Goddag' : 'Godaften';

    // Get current date in Danish format
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = new Date().toLocaleDateString('da-DK', dateOptions);

    // Render task section by period (only incomplete, NON-MEDICINE tasks)
    const renderTaskSection = (periodTitle: string, periodKey: string, icon: React.ReactNode) => {
        const periodTasks = tasks.filter(t =>
            t.period === periodKey &&
            !t.completed &&
            !(t.title?.toLowerCase().includes('medicin') || t.title?.toLowerCase().includes('pille') || t.type === 'medication')
        );
        if (periodTasks.length === 0) return null;

        const isActive = activePeriod === periodKey;

        return (
            <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                <div
                    className="flex items-center gap-2 mb-4 cursor-pointer"
                    onClick={() => setActivePeriod(activePeriod === periodKey ? null : periodKey)}
                >
                    {icon}
                    <h2 className="text-xl font-bold text-stone-800">{periodTitle}</h2>
                    {!isActive && <span className="text-sm text-stone-400">(Tryk for at se)</span>}
                </div>

                {isActive && (
                    <div className="space-y-4 mb-8">
                        {periodTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`
                                    relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                                    ${task.completed
                                        ? 'bg-stone-100 border-stone-200'
                                        : 'bg-white border-stone-200 shadow-sm hover:border-teal-400'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Pictogram Container */}
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner
                                            ${task.completed ? 'bg-stone-200 text-stone-400' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            {task.type === 'medication' && <Pill className="w-8 h-8" />}
                                            {task.type === 'hydration' && <Activity className="w-8 h-8" />}
                                            {task.type === 'activity' && <Sun className="w-8 h-8" />}
                                            {task.type === 'appointment' && <Clock className="w-8 h-8" />}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={`text-xl font-bold ${task.completed ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                                                    {task.title}
                                                </h3>
                                                {/* Social Attribution Stamp */}
                                                {task.createdByRole === 'relative' && task.createdByName && (
                                                    <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                                        <Heart className="w-3 h-3 text-indigo-500 fill-indigo-200" />
                                                        <span className="text-[10px] text-indigo-700 font-medium">Fra {task.createdByName}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-stone-500 font-medium">{task.time}</p>
                                        </div>
                                    </div>

                                    {/* Checkbox */}
                                    <div className={`
                                        w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors
                                        ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-stone-200 bg-white'}
                                    `}>
                                        {task.completed && <CheckCircle className="text-white w-8 h-8" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar id="senior" size="md" />
                        <h1 className="text-xl font-bold text-stone-800">{greeting}, {userName}</h1>
                    </div>
                    {/* Swap sun for Weekly Question widget on Family tab */}
                    {FEATURES.weeklyQuestion && activeTab === 'family' ? (
                        <WeeklyQuestionWidget
                            answers={weeklyAnswers}
                            userName={userName}
                            hasUnread={true}
                            onClick={() => setShowWeeklyModal(true)}
                        />
                    ) : (
                        <div className="bg-amber-100 p-1.5 rounded-full animate-sun-pulse">
                            <Sun className="text-amber-500 w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-500 capitalize">{dateString}</span>
                    <InlineGatesIndicator tasks={tasks} className="ml-2 scale-90 origin-left" />
                </div>
            </header>

            {/* Main Content - Scrollable with padding for bottom nav */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">

                {/* Match Celebration Banner - Shows when there's a help exchange match */}
                {hasMatches && topMatch && (() => {
                    // Generate match ID for filtering
                    const offerId = topMatch.offer?.docId || topMatch.offer?.id || 'none';
                    const requestId = topMatch.request?.docId || topMatch.request?.id || 'none';
                    const matchId = `${offerId}-${requestId}`;

                    if (dismissedMatchIds.has(matchId)) return null;

                    return (
                        <MatchBanner
                            match={topMatch}
                            onClick={() => {
                                playMatchSound();
                                setActiveMatch(topMatch);
                            }}
                            onDismiss={() => {
                                setDismissedMatchIds(prev => new Set([...prev, matchId]));
                            }}
                        />
                    );
                })()}

                {/* ===== DAILY TAB ===== */}
                {activeTab === 'daily' && (
                    <>
                        {/* Reward Card (Behavioral Hook) - Clickable to minimize, can be hidden */}
                        {allMedicineComplete && !hideReward && (
                            rewardMinimized ? (
                                <div className="relative w-full rounded-xl p-3 mb-4 bg-indigo-100 border-2 border-indigo-200 flex items-center justify-between">
                                    <button
                                        onClick={() => setRewardMinimized(false)}
                                        className="flex-1 flex items-center gap-2 hover:opacity-80 transition-opacity"
                                    >
                                        <ImageIcon className="w-5 h-5 text-indigo-600" />
                                        <div>
                                            <span className="font-bold text-indigo-700">Dagens Billede</span>
                                            <p className="text-xs text-indigo-500">Fra familien med kærlighed ❤️</p>
                                        </div>
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-indigo-400">Tryk for at vise</span>
                                        <button
                                            onClick={() => setHideReward(true)}
                                            className="p-1 rounded-full hover:bg-indigo-200 text-indigo-400 hover:text-indigo-600"
                                            title="Skjul"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full rounded-3xl p-6 mb-6 bg-indigo-600 border-2 border-indigo-600 text-white animate-fade-in">
                                    <button
                                        onClick={() => setHideReward(true)}
                                        className="absolute top-2 right-2 p-1 rounded-full bg-indigo-500 hover:bg-indigo-400 text-indigo-200 hover:text-white text-sm"
                                        title="Skjul"
                                    >
                                        ✕
                                    </button>
                                    <button
                                        onClick={() => setRewardMinimized(true)}
                                        className="w-full text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <ImageIcon className="w-6 h-6 text-indigo-200" />
                                            <span className="font-bold text-indigo-100 uppercase tracking-widest text-sm">Dagens Billede</span>
                                        </div>
                                        <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-3 overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                            {/* Daily nature photo - same image all day using date as seed */}
                                            <img
                                                src={`https://picsum.photos/seed/${new Date().toISOString().split('T')[0]}/600/400`}
                                                alt="Dagens billede"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="font-bold text-lg">Medicin taget! ❤️</p>
                                        <p className="text-indigo-200 text-sm">Tryk for at minimere</p>
                                    </button>
                                </div>
                            )
                        )}

                        {/* MEDICINE SECTION - Separate from tasks, with tick marks */}
                        {medicineTasks.length > 0 && !allMedicineComplete && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-purple-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Pill className="w-6 h-6 text-purple-600" />
                                    <h2 className="text-lg font-bold text-purple-800">Medicin</h2>
                                    <span className="text-sm text-purple-500 ml-auto">
                                        {completedMedicine}/{medicineTasks.length} taget
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {medicineTasks.map(med => (
                                        <button
                                            key={med.id}
                                            onClick={() => toggleTask(med.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${med.completed
                                                ? 'bg-purple-100 border-2 border-purple-200'
                                                : 'bg-white border-2 border-purple-100 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${med.completed
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-purple-300 bg-white'
                                                }`}>
                                                {med.completed && <CheckCircle className="w-5 h-5 text-white" />}
                                            </div>
                                            <span className={`font-medium ${med.completed ? 'text-purple-500 line-through' : 'text-purple-800'
                                                }`}>
                                                {med.title}
                                            </span>
                                            <span className="text-purple-400 text-sm ml-auto">{med.time}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Medicine Complete Collapsed State */}
                        {medicineTasks.length > 0 && allMedicineComplete && (
                            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 mb-4 border border-green-200 flex items-center gap-3">
                                <div className="bg-green-500 rounded-full p-1.5">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-green-700 font-medium">Medicin taget ✓</span>
                            </div>
                        )}

                        {/* Check-in Status */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                            <h2 className="text-xl font-semibold text-stone-800 mb-4">Hvordan har du det?</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="primary"
                                    size="large"
                                    className="w-full min-h-32 py-4"
                                    onClick={() => updateStatus('checked-in')}
                                >
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <CheckCircle className="w-10 h-10 shrink-0" />
                                        <span className="text-sm leading-tight">Jeg har det godt</span>
                                    </div>
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="large"
                                    className="w-full min-h-32 py-4 bg-orange-50 text-orange-800 border-2 border-orange-100 hover:bg-orange-100"
                                    onClick={() => setShowSymptomModal(true)}
                                >
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <Heart className="w-10 h-10 text-orange-500 shrink-0" />
                                        <span className="text-sm leading-tight">Jeg har ondt</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Contextual Task Lists */}
                        {renderTaskSection('Morgen (Kl. 8-11)', 'morgen', <Coffee className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection('Frokost (Kl. 12-13)', 'frokost', <Sun className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection('Eftermiddag (Kl. 14-17)', 'eftermiddag', <Moon className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection('Aften (Kl. 18-21)', 'aften', <Moon className="w-6 h-6 text-stone-600" />)}

                        {/* Add Own Task Button */}
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-white border-2 border-dashed border-teal-300 rounded-2xl text-teal-600 font-medium hover:bg-teal-50 hover:border-teal-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Tilføj egen opgave</span>
                        </button>

                        {/* Completed Tasks - DISABLED for now (uncomment to re-enable) */}
                        {false && completedTasks > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                    className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                        <span className="font-bold text-teal-800">Udførte opgaver ({completedTasks})</span>
                                    </div>
                                    {showCompletedTasks ? (
                                        <ChevronUp className="w-5 h-5 text-teal-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-teal-600" />
                                    )}
                                </button>

                                {showCompletedTasks && (
                                    <div className="mt-3 space-y-3">
                                        {tasks.filter(t => t.completed).map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => toggleTask(task.id)}
                                                className="p-4 rounded-2xl bg-stone-100 border-2 border-stone-200 cursor-pointer hover:border-stone-300 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-stone-200 text-stone-400">
                                                            {task.type === 'medication' && <Pill className="w-6 h-6" />}
                                                            {task.type === 'hydration' && <Activity className="w-6 h-6" />}
                                                            {task.type === 'activity' && <Sun className="w-6 h-6" />}
                                                            {task.type === 'appointment' && <Clock className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-stone-500 line-through">{task.title}</h3>
                                                            <p className="text-stone-400 text-sm">{task.time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                                                        <CheckCircle className="text-white w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ===== FAMILY TAB ===== */}
                {(!FEATURES.tabbedLayout || activeTab === 'family') && (
                    <>
                        {/* Thinking of You - MOVED TO TOP */}
                        {FEATURES.thinkingOfYou && (
                            <ThinkingOfYouButton onSendPing={onSendPing} fromName={userName} />
                        )}

                        {/* Family Presence - "Familien Nu" for bidirectional visibility */}
                        {memberStatuses.length > 0 && (
                            <FamilyPresence
                                memberStatuses={memberStatuses}
                                currentUserId={currentUserId}
                                seniorName={userName}
                            />
                        )}

                        {/* Legacy Family Status List - fallback if no memberStatuses */}
                        {FEATURES.familyStatusCard && memberStatuses.length === 0 && (
                            <StatusList
                                members={members}
                                relativeStatuses={relativeStatuses}
                                lastUpdated={statusLastUpdated}
                            />
                        )}

                        {/* Weekly Question now in header - removed from here */}

                        {/* Memory Trigger - toggle with FEATURES.memoryTriggers */}
                        {FEATURES.memoryTriggers && <MemoryTrigger />}

                        {/* Dignity-Preserving Help Exchange - toggle with FEATURES.helpExchange */}
                        {FEATURES.helpExchange && (
                            <HelpExchange
                                onOffer={onHelpOffer}
                                onRequest={onHelpRequest}
                                onRemoveOffer={onRemoveOffer}
                                onRemoveRequest={onRemoveRequest}
                                activeOffers={helpOffers}
                                activeRequests={helpRequests}
                                relativeOffers={relativeOffers}
                                relativeRequests={relativeRequests}
                                seniorName={userName}
                            />
                        )}

                    </>
                )}

                {/* ===== SPIL TAB ===== */}
                {activeTab === 'spil' && (
                    <>
                        {/* Spillehjørnet - Gaming Corner */}
                        {FEATURES.spillehjoernet && (
                            <Spillehjoernet
                                circleId={careCircleId || undefined}
                                userId={currentUserId || undefined}
                                displayName={userName}
                            />
                        )}
                    </>
                )}

            </main>

            {/* Symptom Modal - Two-step flow for pain */}
            <Modal
                isOpen={showSymptomModal}
                onClose={() => {
                    setShowSymptomModal(false);
                    setSelectedSymptom(null);
                    setShowBodySelector(false);
                }}
                title={showBodySelector ? "Hvor gør det ondt?" : "Hvordan har du det?"}
            >
                {showBodySelector ? (
                    // Step 2: Body location selector (for Smerter)
                    <BodyPainSelector
                        onSelectLocation={(bodyLocation) => {
                            // Add symptom with body location
                            addSymptom({
                                ...selectedSymptom,
                                bodyLocation: bodyLocation
                            });
                            setShowSymptomModal(false);
                            setSelectedSymptom(null);
                            setShowBodySelector(false);
                        }}
                        onBack={() => {
                            setShowBodySelector(false);
                            setSelectedSymptom(null);
                        }}
                    />
                ) : (
                    // Step 1: Symptom type selector
                    <div className="grid grid-cols-2 gap-4">
                        {SYMPTOMS_LIST.map(sym => (
                            <button
                                key={sym.id}
                                onClick={() => {
                                    // If it's pain (smerter), show body location picker
                                    if (sym.id === 'pain') {
                                        setSelectedSymptom(sym);
                                        setShowBodySelector(true);
                                    } else {
                                        // For other symptoms, add directly
                                        addSymptom(sym);
                                        setShowSymptomModal(false);
                                    }
                                }}
                                className={`
                                    flex flex-col items-center justify-center gap-2 p-6 rounded-2xl
                                    transition-transform active:scale-95 border-2 border-transparent hover:border-stone-300
                                    ${sym.color}
                                `}
                            >
                                <sym.icon className="w-10 h-10" />
                                <span className="font-bold">{sym.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </Modal>



            {/* Bottom Navigation */}
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onViewReport={() => setShowHealthReport(true)}
            />

            {/* Call Modal */}
            {
                showCallModal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-10 h-10 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800 mb-2">Ringer op...</h3>
                            <p className="text-stone-500 mb-8">Ringer til {relativeName}</p>
                            <Button variant="danger" onClick={() => setShowCallModal(false)}>Afslut opkald</Button>
                        </div>
                    </div>
                )
            }

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={onWeeklyAnswer}
                userName={userName}
            />
            {/* Match Celebration Modal - full screen confetti! */}
            {/* Match Celebration Modal - full screen confetti! */}
            {match && (
                <MatchCelebration
                    match={match}
                    onDismiss={dismissMatch}
                    onAction={(action) => {
                        console.log('Senior action:', action);
                        if (action === 'plan-visit' || action === 'contact') {
                            // Create an appointment task automatically
                            const matchName = match.relativeName || 'Pårørende'; // Fallback
                            const taskTitle = action === 'plan-visit'
                                ? `Besøg af ${matchName}`
                                : `Ring til ${matchName}`;

                            if (onAddTask) {
                                onAddTask({
                                    title: taskTitle,
                                    period: 'eftermiddag', // Default to afternoon
                                    type: 'appointment',
                                    createdByRole: 'senior', // Self-created via match
                                    createdByName: userName
                                });
                            }

                            // Close match modal
                            dismissMatch();
                        }
                    }}
                />
            )}

            {/* Health Report Modal */}
            <HealthReport
                isOpen={showHealthReport}
                onClose={() => setShowHealthReport(false)}
                symptomLogs={symptomLogs}
                tasks={tasks}
            />

            {/* Add Task Modal */}
            <Modal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} title="Tilføj egen opgave">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hvad skal gøres?</label>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="F.eks. Ring til lægen"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                            autoFocus
                        />
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hvornår?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: 'morgen', label: 'Morgen', time: 'Kl. 8-11', icon: '☀️' },
                                { key: 'frokost', label: 'Frokost', time: 'Kl. 12-13', icon: '🍽️' },
                                { key: 'eftermiddag', label: 'Eftermiddag', time: 'Kl. 14-17', icon: '🌤️' },
                                { key: 'aften', label: 'Aften', time: 'Kl. 18-21', icon: '🌙' }
                            ].map(period => (
                                <button
                                    key={period.key}
                                    onClick={() => setNewTaskPeriod(period.key)}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${newTaskPeriod === period.key
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{period.icon}</span>
                                        <div>
                                            <p className={`font-medium ${newTaskPeriod === period.key ? 'text-teal-700' : 'text-slate-700'}`}>
                                                {period.label}
                                            </p>
                                            <p className="text-xs text-slate-400">{period.time}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            if (newTaskTitle.trim()) {
                                if (onAddTask) {
                                    onAddTask({
                                        title: newTaskTitle.trim(),
                                        period: newTaskPeriod,
                                        type: 'activity'
                                    });
                                }
                                setNewTaskTitle('');
                                setNewTaskPeriod('morgen');
                                setShowAddTaskModal(false);
                            }
                        }}
                        className="w-full"
                        disabled={!newTaskTitle.trim()}
                    >
                        Tilføj opgave
                    </Button>
                </div>
            </Modal>

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={userName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Create task based on action type
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = `📞 Ring med ${relativeName}`;
                                break;
                            case 'plan-visit':
                                taskTitle = `☕ Besøg fra ${relativeName}`;
                                break;
                            case 'plan-meal':
                                taskTitle = `🍳 Lav mad med ${relativeName}`;
                                break;
                            case 'plan-transport':
                                taskTitle = `🚗 Tur med ${relativeName}`;
                                break;
                            case 'plan-garden':
                                taskTitle = `🌿 Havearbejde med ${relativeName}`;
                                break;
                            default:
                                taskTitle = celebration?.title || `Aktivitet med ${relativeName}`;
                        }

                        // Create the task
                        if (onAddTask && taskTitle) {
                            onAddTask({
                                title: taskTitle,
                                time: '10:00',
                                period: 'morgen',
                                type: 'appointment',
                                createdByRole: 'senior', // Self-created via match
                                createdByName: userName
                            });

                            // Dismiss the match so it doesn't reappear
                            const offerId = activeMatch.offer?.docId || activeMatch.offer?.id || 'none';
                            const requestId = activeMatch.request?.docId || activeMatch.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));

                            alert(`✅ Opgave oprettet: ${taskTitle}`);
                        }
                        setActiveMatch(null);
                    }}
                />
            )}
        </div >
    );
};

export default SeniorView;

```
---

## File: tryg-app\src\components\TabNavigation.tsx
```tsx
import React from 'react';
import { Calendar, Heart } from 'lucide-react';

// Tab definitions for SeniorView navigation
export const TABS = [
    { id: 'daily', label: 'Min dag', icon: Calendar, emoji: '📋' },
    { id: 'family', label: 'Familie', icon: Heart, emoji: '💜' },
];

export interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex gap-2 p-2 bg-stone-100 rounded-2xl">
            {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                            font-semibold text-lg transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
                            ${isActive
                                ? 'bg-white text-teal-600 shadow-md'
                                : 'text-stone-500 hover:bg-stone-200'
                            }
                        `}
                        aria-label={tab.label}
                        aria-selected={isActive}
                        role="tab"
                    >
                        <span className="text-xl">{tab.emoji}</span>
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TabNavigation;

```
---

## File: tryg-app\src\components\ui\Avatar.tsx
```tsx
import React from 'react';

type AvatarId = 'louise' | 'fatima' | 'brad' | 'bearded' | 'senior' | 'home' | 'work' | 'car' | 'coffee' | 'moon' | string;
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    id: AvatarId;
    className?: string;
    size?: AvatarSize;
}

/**
 * Avatar Component
 * 
 * Renders avatars and status icons using individual image files.
 * Much simpler and more reliable than CSS sprites.
 */
export const Avatar: React.FC<AvatarProps> = ({ id, className = '', size = 'md' }) => {
    // Map IDs to image filenames
    const IMAGE_MAP: Record<string, string> = {
        'louise': 'louise.png',
        'fatima': 'fatima.png',
        'brad': 'brad.png',
        'bearded': 'brad.png',  // Brad is the senior/bearded guy
        'senior': 'brad.png',   // Alias
        'home': 'home.png',
        'work': 'work.png',
        'car': 'car.png',
        'coffee': 'coffee.png',
        'moon': 'moon.png'
    };

    const SIZE_CLASSES: Record<AvatarSize, string> = {
        'sm': 'w-8 h-8',
        'md': 'w-12 h-12',
        'lg': 'w-16 h-16',
        'xl': 'w-24 h-24'
    };

    // If ID not found, return fallback
    if (!IMAGE_MAP[id]) {
        return (
            <div className={`${SIZE_CLASSES[size]} rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase ${className}`}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    const imagePath = `${import.meta.env.BASE_URL}assets/avatars/${IMAGE_MAP[id]}`;

    return (
        <div className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden bg-stone-100 ${className}`}>
            <img
                src={imagePath}
                alt={id}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Avatar;

```
---

## File: tryg-app\src\components\ui\Button.tsx
```tsx
import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'locked';
type ButtonSize = 'small' | 'normal' | 'large' | 'xl';

const variants: Record<ButtonVariant, string> = {
    primary: "bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700 active:scale-95",
    secondary: "bg-stone-100 text-stone-800 hover:bg-stone-200",
    danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-2 border-rose-200",
    outline: "border-2 border-teal-600 text-teal-700 hover:bg-teal-50",
    ghost: "bg-transparent text-stone-500 hover:text-stone-800",
    locked: "bg-stone-200 text-stone-400 cursor-not-allowed"
};

const sizes: Record<ButtonSize, string> = {
    small: "py-2 px-4 text-sm",
    normal: "py-3 px-6 text-base",
    large: "py-6 px-8 text-xl h-24",
    xl: "py-8 px-8 text-2xl h-32"
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    size = 'normal',
    disabled = false,
    'aria-label': ariaLabel,
    ...props
}) => {
    const baseStyle = "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${baseStyle} ${disabled ? variants.locked : variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

```
---

## File: tryg-app\src\components\ui\Modal.tsx
```tsx
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-stone-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
                        aria-label="Luk"
                    >
                        <X className="w-6 h-6 text-stone-600" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;

```
---

## File: tryg-app\src\components\ui\Pictogram.tsx
```tsx
import React from 'react';

type PictogramSheet = '1' | '2';
type PictogramPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface PictogramProps {
    sheet: PictogramSheet;
    position: PictogramPosition;
    className?: string;
}

/**
 * Pictogram Component
 * 
 * Renders a specific quadrant from the 2x2 sprite sheets.
 * Sheet 1: Cooking, Visiting, Transport, Gardening
 * Sheet 2: Shopping, Tech, Learning, Craft
 */
export const Pictogram: React.FC<PictogramProps> = ({ sheet, position, className = '' }) => {
    // Determine background position coordinates
    const bgPos: Record<PictogramPosition, string> = {
        'top-left': '0% 0%',
        'top-right': '100% 0%',
        'bottom-left': '0% 100%',
        'bottom-right': '100% 100%'
    };

    return (
        <div
            className={`bg-no-repeat bg-cover rounded-xl overflow-hidden ${className}`}
            style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/sprites/help-sheet-${sheet}.png)`,
                backgroundPosition: bgPos[position],
                backgroundSize: '200% 200%' // Zoom in to show just one quadrant
            }}
        />
    );
};

export default Pictogram;

```
---

## File: tryg-app\src\components\ui\Skeleton.tsx
```tsx
/**
 * Skeleton Loading Components
 * 
 * Skeleton screens reduce perceived loading time by showing
 * placeholder shapes that match the content being loaded.
 * Much better UX than spinners for seniors.
 */

import React, { CSSProperties } from 'react';

interface SkeletonProps {
    className?: string;
    style?: CSSProperties;
}

/**
 * Base skeleton block with pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style = {} }) => (
    <div
        className={`bg-stone-200 rounded-2xl animate-pulse ${className}`}
        style={style}
    />
);

/**
 * Skeleton for task cards (medicine/daily tasks)
 */
export const SkeletonTaskCard: React.FC = () => (
    <div className="bg-stone-100 rounded-2xl p-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
        </div>
    </div>
);

/**
 * Skeleton for status/presence cards
 */
export const SkeletonStatusCard: React.FC = () => (
    <div className="bg-stone-100 rounded-2xl p-4 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-stone-200 rounded w-1/2" />
                <div className="h-3 bg-stone-200 rounded w-1/3" />
            </div>
            <div className="w-16 h-8 bg-stone-200 rounded-full" />
        </div>
    </div>
);

/**
 * Skeleton for the Senior Status Card in RelativeView
 */
export const SkeletonSeniorCard: React.FC = () => (
    <div className="bg-stone-100 rounded-2xl p-5 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-stone-200 rounded-full" />
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-stone-200 rounded w-2/3" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="flex gap-2 mt-3">
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                    <div className="h-6 w-16 bg-stone-200 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Skeleton for activity feed items
 */
export const SkeletonFeedItem: React.FC = () => (
    <div className="bg-stone-50 rounded-xl p-3 animate-pulse flex items-center gap-3">
        <div className="w-10 h-10 bg-stone-200 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-4/5" />
            <div className="h-3 bg-stone-200 rounded w-1/3" />
        </div>
    </div>
);

interface SkeletonListProps {
    count?: number;
}

/**
 * Skeleton loader for task list (multiple cards)
 */
export const SkeletonTaskList: React.FC<SkeletonListProps> = ({ count = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonTaskCard key={i} />
        ))}
    </div>
);

/**
 * Skeleton loader for activity feed (multiple items)
 */
export const SkeletonFeed: React.FC<SkeletonListProps> = ({ count = 4 }) => (
    <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonFeedItem key={i} />
        ))}
    </div>
);

/**
 * Full page skeleton for initial app load
 */
export const SkeletonPage: React.FC = () => (
    <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-6 bg-stone-200 rounded w-32" />
                <div className="h-4 bg-stone-200 rounded w-24" />
            </div>
            <div className="w-12 h-12 bg-stone-200 rounded-full" />
        </div>

        {/* Content skeleton */}
        <SkeletonSeniorCard />
        <SkeletonTaskList count={3} />
    </div>
);

export default {
    Skeleton,
    SkeletonTaskCard,
    SkeletonStatusCard,
    SkeletonSeniorCard,
    SkeletonFeedItem,
    SkeletonTaskList,
    SkeletonFeed,
    SkeletonPage
};

```
---

## File: tryg-app\src\components\UpdateToast.tsx
```tsx
// @ts-check
/**
 * PWA Update Toast
 * 
 * Shows a notification when a new app version is available.
 * Uses vite-plugin-pwa's service worker registration.
 */

import React from 'react';
// @ts-ignore - Virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const UpdateToast: React.FC = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker
    } = useRegisterSW({
        /** @param {any} r */
        onRegistered(r: any) {
            // Check for updates every hour
            r && setInterval(() => {
                r.update();
            }, 60 * 60 * 1000);
        },
        /** @param {any} error */
        onRegisterError(error: any) {
            console.error('SW registration error:', error);
        }
    });

    const close = () => {
        setNeedRefresh(false);
    };

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-20 inset-x-4 z-50 animate-slide-up">
            <div className="bg-teal-600 text-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold">Ny opdatering klar</p>
                    <p className="text-teal-100 text-sm">Tryk for at opdatere appen</p>
                </div>
                <button
                    onClick={() => updateServiceWorker(true)}
                    className="bg-white text-teal-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors shrink-0"
                >
                    Opdater
                </button>
                <button
                    onClick={close}
                    className="p-2 text-teal-200 hover:text-white"
                    aria-label="Luk"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default UpdateToast;

```
---

## File: tryg-app\src\config\features.js
```js
// Feature flags for toggling features on/off
// Set to false to temporarily disable a feature

export const FEATURES = {
    // Layout
    tabbedLayout: true,        // Use tabs instead of scrolling (experimental)

    // Phase 5: Emotional Connection
    weeklyQuestion: true,      // Weekly Question of the Week card
    memoryTriggers: false,      // "Husker du da...?" memories
    helpExchange: true,        // Dignity-preserving help offers/requests
    spillehjoernet: true,      // Gaming corner with Word of the Day

    // Phase 4: Polish
    morningAnimation: true,    // Sun pulse animation in header
    reassuringCopy: true,      // "Alt er vel ✨" message

    // Phase 3: Health Tracking
    painSeverity: true,        // 3-level pain scale after body location

    // Phase 2: Connection
    familyStatusCard: true,    // Show relative's status to senior
    thinkingOfYou: true,       // One-tap ping button

    // Sounds
    completionSounds: true,    // Task completion chimes
    pingSound: true,           // Ping notification sound

    // Demo/Testing
    demoNotification: false,   // Water reminder notification (5s after load)

    // Backend
    useFirebase: true,         // Use Firebase for multi-user sync (false = localStorage demo mode)
    photoSharing: false,       // Ephemeral photo sharing (requires Firebase Storage = Blaze plan)
};

// Helper to check if feature is enabled
export const isFeatureEnabled = (featureName) => {
    return FEATURES[featureName] ?? true;
};

export default FEATURES;

```
---

## File: tryg-app\src\config\firebase.js
```js
// Firebase configuration for Tryg App
// Values loaded from environment variables (.env.local for dev, GitHub Secrets for prod)
// See .env.example for required variables

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    getFirestore,
    connectFirestoreEmulator,
    enableIndexedDbPersistence
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
// This allows the app to work offline and sync when back online
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence unavailable: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Firestore persistence not supported by this browser');
    }
});

// Uncomment for local development with emulators
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;

```
---

## File: tryg-app\src\contexts\CareCircleContext.jsx
```jsx
// @ts-check
/**
 * CareCircleContext
 * 
 * Provides shared care circle data to all components without prop drilling.
 * Use `useCareCircleContext()` to access data like careCircleId, memberStatuses, etc.
 */

import { createContext, useContext } from 'react';
import '../types'; // Import types for JSDoc

// Create the context with default values
const CareCircleContext = createContext({
    // Circle info
    careCircleId: null,
    seniorId: null,
    seniorName: 'Senior',

    // Current user info
    currentUserId: null,
    userRole: null,
    userName: '',

    // Member statuses (for FamilyPresence, etc.)
    memberStatuses: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: null,
    setMyStatus: () => { },
});

/**
 * Hook to access CareCircle context
 * @returns {Object} Care circle data and functions
 * @throws {Error} If used outside of CareCircleProvider
 */
export function useCareCircleContext() {
    const context = useContext(CareCircleContext);
    if (!context) {
        throw new Error('useCareCircleContext must be used within a CareCircleProvider');
    }
    return context;
}

/**
 * Provider component that wraps the app and provides care circle data
 */
export function CareCircleProvider({
    children,
    careCircleId,
    seniorId,
    seniorName,
    currentUserId,
    userRole,
    userName,
    memberStatuses = [],
    relativeStatuses = [],
    seniorStatus = null,
    myStatus = null,
    setMyStatus = () => { },
}) {
    const value = {
        careCircleId,
        seniorId,
        seniorName,
        currentUserId,
        userRole,
        userName,
        memberStatuses,
        relativeStatuses,
        seniorStatus,
        myStatus,
        setMyStatus,
    };

    return (
        <CareCircleContext.Provider value={value}>
            {children}
        </CareCircleContext.Provider>
    );
}

export default CareCircleContext;

```
---

## File: tryg-app\src\data\constants.js
```js
import { Zap, Brain, Frown, Thermometer, Moon, Droplets, Utensils } from 'lucide-react';

// Initial tasks grouped by time of day (Habit Stacking)
export const INITIAL_TASKS = [
    { id: 1, title: 'Morgenpiller', type: 'medication', time: '08:00', period: 'morgen', completed: false, description: 'Hjertemedicin (2 piller)' },
    { id: 2, title: 'Drik vand', type: 'hydration', time: '10:00', period: 'morgen', completed: false, description: 'Et stort glas' },
    { id: 3, title: 'Frokostmedicin', type: 'medication', time: '12:00', period: 'frokost', completed: false, description: 'Vitaminer' },
    { id: 4, title: 'Gåtur', type: 'activity', time: '14:00', period: 'eftermiddag', completed: false, description: '15 min i haven' },
];

// Symptom options with icons and colors
export const SYMPTOMS_LIST = [
    { id: 'pain', label: 'Smerter', icon: Zap, color: 'bg-red-100 text-red-600' },
    { id: 'dizzy', label: 'Svimmel', icon: Brain, color: 'bg-purple-100 text-purple-600' },
    { id: 'nausea', label: 'Kvalme', icon: Frown, color: 'bg-orange-100 text-orange-600' },
    { id: 'fever', label: 'Feber', icon: Thermometer, color: 'bg-amber-100 text-amber-600' },
    { id: 'sleep', label: 'Søvnbesvær', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'sweats', label: 'Nattesved', icon: Droplets, color: 'bg-sky-100 text-sky-600' },
    { id: 'appetite', label: 'Appetit', icon: Utensils, color: 'bg-emerald-100 text-emerald-600' },
];

// Senior profile defaults
export const SENIOR_PROFILE = {
    name: 'Birthe Jensen',
    age: 78,
    status: 'active',
    lastActive: new Date().toISOString(),
    batteryLevel: 85,
};

```
---

## File: tryg-app\src\data\wordGameData.js
```js
// Word Game Data - CHALLENGING Danish words with definitions for "Word of the Day" game
// Each word has a correct meaning and a plausible wrong answer

export const WORD_LIST = [
    {
        id: 'bjornetjeneste',
        word: 'Bjørnetjeneste',
        correctAnswer: 'En handling der gør mere skade end gavn',
        wrongAnswer: 'En utrolig stor og hjælpsom tjeneste',
        category: 'udtryk'
    },
    {
        id: 'tanketorsk',
        word: 'Tanketorsk',
        correctAnswer: 'En dum og utilsigtet fejl',
        wrongAnswer: 'En traditionel dansk fiskeret',
        category: 'sprog'
    },
    {
        id: 'ildsjael',
        word: 'Ildsjæl',
        correctAnswer: 'En person med stor begejstring for en sag',
        wrongAnswer: 'En meget stærk chilipeber',
        category: 'personlighed'
    },
    {
        id: 'koldbotte',
        word: 'Koldbøtte',
        correctAnswer: 'En rullebevægelse forover (gymnastik)',
        wrongAnswer: 'En beholder til kolde drikkevarer',
        category: 'aktiviteter'
    },
    {
        id: 'lurendrejer',
        word: 'Lurendrejer',
        correctAnswer: 'En upålidelig og snu person',
        wrongAnswer: 'En gammeldags uldspinder',
        category: 'personlighed'
    },
    {
        id: 'soforklaring',
        word: 'Søforklaring',
        correctAnswer: 'En dårlig eller utroværdig undskyldning',
        wrongAnswer: 'Instruktioner til at sejle et skib',
        category: 'udtryk'
    },
    {
        id: 'agurketid',
        word: 'Agurketid',
        correctAnswer: 'Periode med få nyheder (sommerferien)',
        wrongAnswer: 'Sæsonen hvor man høster grøntsager',
        category: 'medier'
    },
    {
        id: 'bagstraever',
        word: 'Bagstræver',
        correctAnswer: 'En der modarbejder udvikling og nytænkning',
        wrongAnswer: 'En bager der laver wienerbrød',
        category: 'samfund'
    },
    {
        id: 'ulvetimen',
        word: 'Ulvetimen',
        correctAnswer: 'Den travle time før aftensmad med børn',
        wrongAnswer: 'Tidspunktet på natten hvor ulve hyler',
        category: 'familie'
    },
    {
        id: 'aandsnaervaerelse',
        word: 'Åndsnærværelse',
        correctAnswer: 'Evnen til at tænke hurtigt i en presset situation',
        wrongAnswer: 'Troen på spøgelser og ånder',
        category: 'sind'
    },
    {
        id: 'dognflue',
        word: 'Døgnflue',
        correctAnswer: 'Noget der kun er populært i meget kort tid',
        wrongAnswer: 'En flue der er vågen i 24 timer',
        category: 'kultur'
    },
    {
        id: 'klamphugger',
        word: 'Klamphugger',
        correctAnswer: 'En håndværker der laver dårligt arbejde',
        wrongAnswer: 'En skovhugger der fælder træer',
        category: 'arbejde'
    },
    {
        id: 'blaaojet',
        word: 'Blåøjet',
        correctAnswer: 'At være naiv og godtroende',
        wrongAnswer: 'At have en øjensygdom',
        category: 'personlighed'
    },
    {
        id: 'vemodig',
        word: 'Vemodig',
        correctAnswer: 'En følelse af sorg blandet med længsel',
        wrongAnswer: 'At være meget vred og aggressiv',
        category: 'følelser'
    },
    {
        id: 'bjorneloes',
        word: 'Bjørneløs',
        correctAnswer: 'At være uden penge (slang)',
        wrongAnswer: 'En zoologisk have uden bjørne',
        category: 'slang'
    },
    {
        id: 'honsefodder',
        word: 'Hønsefødder',
        correctAnswer: 'Meget gnidret og ulæselig håndskrift',
        wrongAnswer: 'En ingrediens i dansk suppe',
        category: 'sprog'
    },
    {
        id: 'skrankepave',
        word: 'Skrankepave',
        correctAnswer: 'En arrogant og bureaukratisk medarbejder',
        wrongAnswer: 'En religiøs leder i kirken',
        category: 'arbejde'
    },
    {
        id: 'himmelfalden',
        word: 'Himmelfalden',
        correctAnswer: 'At være meget overrasket eller paf',
        wrongAnswer: 'At falde ned fra en stor højde',
        category: 'følelser'
    },
    {
        id: 'gratist',
        word: 'Gratist',
        correctAnswer: 'En der sniger sig ind uden at betale',
        wrongAnswer: 'En person der deler gaver ud',
        category: 'samfund'
    },
    {
        id: 'bjorneklo',
        word: 'Bjørneklo',
        correctAnswer: 'En giftig plante (invasiv art)',
        wrongAnswer: 'En kage formet som en pote',
        category: 'natur'
    },
    {
        id: 'solstraalehistorie',
        word: 'Solstrålehistorie',
        correctAnswer: 'En meget positiv og livsbekræftende nyhed',
        wrongAnswer: 'Den videnskabelige historie om solen',
        category: 'medier'
    },
    {
        id: 'efternoeler',
        word: 'Efternøler',
        correctAnswer: 'Et barn født længe efter sine søskende',
        wrongAnswer: 'En person der bliver for længe til en fest',
        category: 'familie'
    },
    {
        id: 'svensknoegle',
        word: 'Svensknøgle',
        correctAnswer: 'En justerbar skruenøgle',
        wrongAnswer: 'Nøglen til et svensk sommerhus',
        category: 'værktøj'
    },
    {
        id: 'hojtbelagt',
        word: 'Højtbelagt',
        correctAnswer: 'Smørrebrød med ekstra meget pålæg',
        wrongAnswer: 'Noget der er placeret på øverste hylde',
        category: 'mad'
    },
    {
        id: 'indforstaaet',
        word: 'Indforstået',
        correctAnswer: 'Noget der er underforstået uden at blive sagt',
        wrongAnswer: 'At være lukket inde i et rum',
        category: 'kommunikation'
    },
    {
        id: 'pyt',
        word: 'Pyt',
        correctAnswer: 'Udtryk for at give slip på bekymringer',
        wrongAnswer: 'En lille vandpyt på gaden',
        category: 'filosofi'
    },
    {
        id: 'graazone',
        word: 'Gråzone',
        correctAnswer: 'Et område hvor reglerne er uklare',
        wrongAnswer: 'En parkeringsplads for ældre',
        category: 'jura'
    },
    {
        id: 'flov',
        word: 'Flov',
        correctAnswer: 'At skamme sig eller være forlegen',
        wrongAnswer: 'Når vinden ikke blæser (vindstille)',
        category: 'følelser'
    },
    {
        id: 'morketal',
        word: 'Mørketal',
        correctAnswer: 'Hændelser der aldrig bliver registreret',
        wrongAnswer: 'Tal der er skrevet med sort blæk',
        category: 'statistik'
    },
    {
        id: 'mundgodt',
        word: 'Mundgodt',
        correctAnswer: 'Lækkerier eller slik',
        wrongAnswer: 'At være god til at tale for sig',
        category: 'mad'
    },
    {
        id: 'overbaerende',
        word: 'Overbærende',
        correctAnswer: 'Tålmodig og villig til at tilgive fejl',
        wrongAnswer: 'At bære på alt for tunge ting',
        category: 'adfærd'
    },
    {
        id: 'vindbojtel',
        word: 'Vindbøjtel',
        correctAnswer: 'En person uden faste meninger',
        wrongAnswer: 'En måler der viser vindretningen',
        category: 'personlighed'
    },
    {
        id: 'skinhellig',
        word: 'Skinhellig',
        correctAnswer: 'En der lader som om de er moralsk bedre end andre',
        wrongAnswer: 'Et lys der skinner meget kraftigt',
        category: 'personlighed'
    },
    {
        id: 'stumpvinkel',
        word: 'Stumpvinkel',
        correctAnswer: 'En vinkel over 90 grader',
        wrongAnswer: 'Et hjørne hvor man ofte støder tåen',
        category: 'videnskab'
    },
    {
        id: 'tumleplads',
        word: 'Tumleplads',
        correctAnswer: 'Sted med frihed til at udfolde sig',
        wrongAnswer: 'Et sted hvor man kaster affald',
        category: 'udtryk'
    },
    {
        id: 'klaphat',
        word: 'Klaphat',
        correctAnswer: 'En dum person / En hat til fodbold',
        wrongAnswer: 'En hat der klapper når man går',
        category: 'slang'
    },
    {
        id: 'haengehoved',
        word: 'Hængehoved',
        correctAnswer: 'En trist eller pessimistisk person',
        wrongAnswer: 'En hovedpine der varer hele dagen',
        category: 'personlighed'
    },
    {
        id: 'gaekkebrev',
        word: 'Gækkebrev',
        correctAnswer: 'Anonymt digt man sender til påske',
        wrongAnswer: 'Et brev fra skattevæsenet',
        category: 'tradition'
    },
    {
        id: 'vaerthus',
        word: 'Værtshus',
        correctAnswer: 'En pub eller en bar',
        wrongAnswer: 'Et hus hvor værten til en fest bor',
        category: 'kultur'
    },
    {
        id: 'sovepude',
        word: 'Sovepude',
        correctAnswer: 'En undskyldning for ikke at gøre noget (metafor)',
        wrongAnswer: 'En pude fyldt med sovemedicin',
        category: 'udtryk'
    },
    {
        id: 'bagklog',
        word: 'Bagklog',
        correctAnswer: 'At vide bedst efter noget er sket',
        wrongAnswer: 'At være klog på at bage kager',
        category: 'adfærd'
    },
    {
        id: 'kanonkonge',
        word: 'Kanonkonge',
        correctAnswer: 'En meget succesfuld person i en branche',
        wrongAnswer: 'En konge der skyder med kanoner',
        category: 'slang'
    },
    {
        id: 'polsk',
        word: 'På polsk',
        correctAnswer: 'At leve sammen uden at være gift',
        wrongAnswer: 'At tale et sprog fra Østeuropa',
        category: 'udtryk'
    },
    {
        id: 'oerefigen',
        word: 'Ørefigen',
        correctAnswer: 'Et slag (lussing) på øret',
        wrongAnswer: 'En eksotisk frugt',
        category: 'handling'
    },
    {
        id: 'guldregn',
        word: 'Guldregn',
        correctAnswer: 'En plante med gule blomster',
        wrongAnswer: 'Når man vinder mange penge',
        category: 'natur'
    },
    {
        id: 'hudloes',
        word: 'Hudløs',
        correctAnswer: 'Følelsesmæssigt sårbar eller ærlig',
        wrongAnswer: 'En person der har slået sig',
        category: 'følelser'
    },
    {
        id: 'appelsinfri',
        word: 'Appelsinfri',
        correctAnswer: 'At have ferie / fri fra arbejde',
        wrongAnswer: 'En juice uden frugtkød',
        category: 'slang'
    },
    {
        id: 'tudse',
        word: 'En tudse',
        correctAnswer: 'En 1000-kroneseddel (slang)',
        wrongAnswer: 'En frø der bor i vandet',
        category: 'slang'
    },
    {
        id: 'himmelbla',
        word: 'En himmelblå',
        correctAnswer: 'En politibetjent (slang)',
        wrongAnswer: 'En skyfri sommerdag',
        category: 'slang'
    },
    {
        id: 'skadefryd',
        word: 'Skadefryd',
        correctAnswer: 'Glæde over andres ulykke',
        wrongAnswer: 'En fugl der er kommet til skade',
        category: 'følelser'
    }
];

/**
 * Get today's 5 words - same for all users based on date
 * Uses date as seed to ensure consistency across family
 */
export function getTodaysWords(date = new Date()) {
    // Create a seed from the date (YYYYMMDD format)
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateStr, 10);

    // Simple seeded random using the date
    const seededRandom = (i) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
    };

    // Shuffle word list using seeded random
    const shuffled = [...WORD_LIST]
        .map((word, i) => ({ word, sort: seededRandom(i) }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ word }) => word);

    // Return first 5
    return shuffled.slice(0, 5);
}

/**
 * Shuffle answers for a word (returns [option1, option2] in random order)
 */
export function shuffleAnswers(word, seed = 0) {
    const x = Math.sin(seed + word.id.charCodeAt(0)) * 10000;
    const random = x - Math.floor(x);

    if (random > 0.5) {
        return [
            { text: word.correctAnswer, isCorrect: true },
            { text: word.wrongAnswer, isCorrect: false }
        ];
    } else {
        return [
            { text: word.wrongAnswer, isCorrect: false },
            { text: word.correctAnswer, isCorrect: true }
        ];
    }
}

export default { WORD_LIST, getTodaysWords, shuffleAnswers };
```
---

## File: tryg-app\src\features\familyPresence\FamilyPresence.tsx
```tsx
// FamilyPresence - "Familien Nu" section showing all family members' statuses
// Reusable on both Connection (Min Dag) and Koordinering (Familie) tabs
// Now uses CareCircleContext for shared data (props are optional overrides)

import React from 'react';
import { Users, Home, Briefcase, Car, Coffee, Moon, Heart } from 'lucide-react';
// @ts-ignore - Context not yet converted
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Avatar } from '../../components/ui/Avatar';
import { MemberStatus } from './useMemberStatus';

// Status display configuration
interface StatusConfigItem {
    label: string;
    icon: React.ElementType;
    color: string;
}

const STATUS_CONFIG: Record<string, StatusConfigItem> = {
    home: { label: 'Hjemme', icon: Home, color: 'text-green-600' },
    work: { label: 'På arbejde', icon: Briefcase, color: 'text-indigo-600' },
    traveling: { label: 'Undervejs', icon: Car, color: 'text-amber-600' },
    available: { label: 'Har tid til en snak', icon: Coffee, color: 'text-teal-600' },
    busy: { label: 'Optaget', icon: Moon, color: 'text-stone-500' },
};

// Senior status display (different from relatives)
const SENIOR_STATUS: Record<string, StatusConfigItem> = {
    good: { label: 'Har det godt', icon: Heart, color: 'text-green-600' },
    default: { label: 'Aktiv', icon: Heart, color: 'text-stone-500' },
};

interface MemberStatusRowProps {
    name: string;
    status: string;
    role: string;
    timestamp?: any; // Firestore timestamp or Date
    isCurrentUser?: boolean;
}

/**
 * Compact status display row for a family member
 */
const MemberStatusRow: React.FC<MemberStatusRowProps> = ({ name, status, role, timestamp, isCurrentUser = false }) => {
    // Determine avatar ID based on name or role
    const avatarId = role === 'senior' ? 'senior' :
        (name.includes('Fatima') || name === 'Test User') ? 'fatima' :
            name === 'Brad' ? 'brad' : 'louise';

    // Status mapping for sprite IDs
    const statusIdMapping: Record<string, string> = {
        'home': 'home',
        'work': 'work',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon',
        'good': 'home', // Fallback for senior
        'default': 'home'
    };

    const statusIconId = statusIdMapping[status] || 'home';
    const config = role === 'senior'
        ? (SENIOR_STATUS[status] || SENIOR_STATUS.default)
        : (STATUS_CONFIG[status] || STATUS_CONFIG.home);

    // Format timestamp
    let timeString = '';
    if (timestamp) {
        const date = (timestamp && typeof timestamp.toDate === 'function')
            ? timestamp.toDate()
            : new Date(timestamp);

        const now = new Date();
        const diffMs = now.getTime() - date.getTime(); // Use getTime() to ensure number arithmetic
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) {
            timeString = `${diffMins}m`;
        } else if (diffMins < 1440) {
            timeString = `${Math.floor(diffMins / 60)}t`;
        } else {
            timeString = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
        }
    }

    return (
        <div className={`
            flex items-center justify-between p-3 rounded-xl transition-all
            ${isCurrentUser ? 'bg-indigo-50/50 border border-indigo-100/50' : 'hover:bg-stone-50 border border-transparent hover:border-stone-100'}
        `}>
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar id={avatarId} size="md" className="shadow-sm border-2 border-white" />
                    {/* Tiny status indicator dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'available' ? 'bg-teal-500' :
                        status === 'home' ? 'bg-green-500' :
                            status === 'work' ? 'bg-indigo-500' :
                                status === 'traveling' ? 'bg-amber-500' : 'bg-stone-400'
                        }`} />
                </div>

                <div>
                    <span className={`text-sm font-bold block text-left ${isCurrentUser ? 'text-indigo-900' : 'text-stone-700'}`}>
                        {name} {isCurrentUser && <span className="opacity-50 text-xs font-normal">(dig)</span>}
                    </span>
                    <span className={`text-xs font-medium block text-left ${config.color || 'text-stone-500'}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            {/* Right: Pictogram + Time */}
            <div className="flex flex-col items-end gap-1">
                {/* Status Pictogram - Subtle glass feel */}
                <div className="bg-stone-100/80 p-1.5 rounded-lg backdrop-blur-sm">
                    <Avatar id={statusIconId} size="sm" />
                </div>

                {timeString && (
                    <span className="text-[10px] font-medium text-stone-400 tabular-nums">
                        {timeString}
                    </span>
                )}
            </div>
        </div>
    );
};

interface FamilyPresenceProps {
    memberStatuses?: MemberStatus[];
    currentUserId?: string;
    seniorName?: string;
    compact?: boolean;
}

/**
 * Family Presence section - "Familien Nu"
 * Shows all family members' current statuses
 * 
 * Uses CareCircleContext for data, with props as optional overrides.
 */
export const FamilyPresence: React.FC<FamilyPresenceProps> = ({
    memberStatuses: propsMembers,
    currentUserId: propsUserId,
    seniorName: propsSeniorName,
    compact = false
}) => {
    // Get from context, use props as override if provided
    const context = useCareCircleContext();
    const memberStatuses = propsMembers ?? context.memberStatuses ?? [];
    const currentUserId = propsUserId ?? context.currentUserId;
    const seniorName = propsSeniorName ?? context.seniorName ?? 'Far/Mor';

    if (memberStatuses.length === 0) {
        return (
            <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
                <p className="text-stone-400 text-sm text-center">Ingen familiemedlemmer endnu</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl ${compact ? 'p-3' : 'p-4'} border border-stone-100 shadow-sm`}>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                    Familien nu
                </h4>
            </div>

            <div className="space-y-1">
                {memberStatuses.map((member: MemberStatus, index: number) => (
                    <MemberStatusRow
                        key={member.docId || index}
                        name={member.displayName || (member.role === 'senior' ? seniorName : 'Pårørende')}
                        status={member.status}
                        role={member.role}
                        timestamp={member.updatedAt}
                        isCurrentUser={member.docId === currentUserId}
                    />
                ))}
            </div>
        </div>
    );
};

export default FamilyPresence;

```
---

## File: tryg-app\src\features\familyPresence\index.js
```js
// Family Presence Feature - Public API
export { FamilyPresence } from './FamilyPresence';
export { StatusCard, StatusSelector, StatusList, STATUS_OPTIONS } from './StatusCard';
export { useMemberStatus } from './useMemberStatus';

```
---

## File: tryg-app\src\features\familyPresence\StatusCard.tsx
```tsx
import React from 'react';
import { Clock, Pill, Briefcase, Home, Car, Coffee, Moon } from 'lucide-react';
import { InlineGatesIndicator } from '../tasks/ProgressRing';
import { Avatar } from '../../components/ui/Avatar';
import { Task } from '../tasks/useTasks';
import { MemberStatus } from './useMemberStatus';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

interface StatusOption {
    id: string;
    label: string;
    icon: React.ElementType; // Icon component type
    color: string;
}

/**
 * Status options for family members
 */
export const STATUS_OPTIONS: StatusOption[] = [
    { id: 'work', label: 'På arbejde', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'home', label: 'Hjemme', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'traveling', label: 'Undervejs', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 'available', label: 'Har tid til en snak', icon: Coffee, color: 'bg-teal-100 text-teal-600' },
    { id: 'busy', label: 'Optaget', icon: Moon, color: 'bg-stone-100 text-stone-500' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StatusSelectorProps {
    currentStatus: string;
    onStatusChange: (status: string) => void;
    compact?: boolean;
}

/**
 * Status selector for RELATIVE to set their status
 */
export const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange, compact = false }) => {
    return (
        <div className="flex gap-2 justify-between">
            {STATUS_OPTIONS.map(status => {
                const isActive = currentStatus === status.id;
                // Map status ID to Avatar ID
                const avatarId = ({
                    'work': 'work',
                    'home': 'home',
                    'traveling': 'car',
                    'available': 'coffee',
                    'busy': 'moon'
                } as Record<string, string>)[status.id] || 'home';

                return (
                    <button
                        key={status.id}
                        onClick={() => onStatusChange(status.id)}
                        className={`
                            group relative flex items-center justify-center p-2 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-white shadow-md ring-2 ring-indigo-500 scale-110 z-10'
                                : 'bg-white/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-200'
                            }
                        `}
                        title={status.label}
                    >
                        <Avatar
                            id={avatarId}
                            size="sm"
                            className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />
                        {/* Tooltip */}
                        <div className={`
                            absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-bold bg-stone-800 text-white
                            pointer-events-none transition-all duration-200 z-20
                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}
                        `}>
                            {status.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT VARIABLES
// ============================================================================

interface StatusCardProps {
    mode?: 'senior' | 'relative';
    name?: string;
    status?: string;
    timestamp?: any; // Start as any to handle Firestore timestamp loosely, refine later
    className?: string;

    // Senior specifics
    completionRate?: number;
    tasks?: Task[];
    symptomCount?: number;
    onViewSymptoms?: (() => void) | null;

    // Relative specifics
    onStatusChange?: (status: string) => void;
}

/**
 * Unified Status Card Component
 * Renders appropriate card based on `mode`.
 */
export const StatusCard: React.FC<StatusCardProps> = ({
    mode = 'relative',
    name = 'Bruger',
    status: statusId,
    timestamp,
    className = '',
    // Senior specifics
    completionRate = 0,
    tasks = [],
    symptomCount = 0,
    onViewSymptoms = null,
    // Relative specifics
    onStatusChange
}) => {
    // -------------------------------------------------------------------------
    // RENDER: SENIOR MODE (Dashboard Style)
    // -------------------------------------------------------------------------
    if (mode === 'senior') {
        const getSeniorStatus = () => {
            if (!timestamp) return {
                label: 'Venter på første tjek...',
                theme: 'neutral',
                bgPos: '50% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 80 && symptomCount === 0) return {
                label: 'Alt er vel',
                theme: 'calm',
                bgPos: '0% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 50) return {
                label: 'God dag',
                theme: 'neutral',
                bgPos: '50% 0%',
                textColor: 'text-white'
            };
            if (symptomCount > 0) return {
                label: 'OBS: Symptomer',
                theme: 'warm',
                bgPos: '100% 0%',
                textColor: 'text-white'
            };
            return {
                label: 'Tjek ind',
                theme: 'warm',
                bgPos: '100% 0%',
                textColor: 'text-white'
            };
        };

        const statusInfo = getSeniorStatus();
        const baseUrl = import.meta.env.BASE_URL;
        const bgUrl = `${baseUrl}assets/bg-atmospheric.png`;

        return (
            <div
                className={`
                    relative overflow-hidden rounded-2xl shadow-lg border border-white/20 p-6 
                    transition-all duration-500 ease-in-out
                    ${className}
                `}
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    backgroundPosition: statusInfo.bgPos,
                    backgroundSize: '300% 100%'
                }}
            >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                <div className="relative z-10 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-white/20 rounded-full backdrop-blur-md">
                                <Avatar id="senior" size="md" className="border-2 border-white/40" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl leading-tight drop-shadow-sm">{name}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/10 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1 w-fit">
                                    <Clock className="w-3 h-3" />
                                    <span>Sidst: {typeof timestamp === 'string' ? timestamp : '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                            {statusInfo.label}
                        </div>
                    </div>

                    {tasks.length > 0 && (
                        <div className="mb-4 py-2 px-3 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
                            <InlineGatesIndicator tasks={tasks} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Tjekket ind</p>
                                <p className="text-sm font-bold">{typeof timestamp === 'string' ? timestamp : 'Venter'}</p>
                            </div>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Medicin</p>
                                <p className="text-sm font-bold">{completionRate}% ordnet</p>
                            </div>
                        </div>
                    </div>

                    {symptomCount > 0 && (
                        <button
                            onClick={onViewSymptoms ? onViewSymptoms : undefined}
                            className={`w-full mt-3 p-2 bg-orange-500/20 backdrop-blur-md rounded-lg border border-orange-200/30 text-center animate-pulse ${onViewSymptoms ? 'cursor-pointer hover:bg-orange-500/30 transition-colors' : ''}`}
                        >
                            <span className="text-xs font-bold text-white drop-shadow-md flex items-center justify-center gap-2">
                                ⚠️ {symptomCount} symptom{symptomCount > 1 ? 'er' : ''} rapporteret i dag
                                {onViewSymptoms && <span className="text-[10px] opacity-80 font-normal underline">Se detaljer</span>}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: RELATIVE MODE (List Item Style)
    // -------------------------------------------------------------------------
    const statusObj = STATUS_OPTIONS.find(s => s.id === statusId) || STATUS_OPTIONS[0];
    const avatarId = ({
        'work': 'work',
        'home': 'home',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon'
    } as Record<string, string>)[statusId || ''] || 'home';

    // Format timestamp if it's a Firestore object or Date
    let timeString = '-';
    if (timestamp) {
        if (typeof timestamp === 'string') {
            timeString = timestamp;
        } else {
            // Check for Firestore Timestamp structure
            const date = (timestamp && typeof timestamp.toDate === 'function')
                ? timestamp.toDate()
                : new Date(timestamp);
            timeString = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
        }
    }

    return (
        <div className={`bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-3 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                <Avatar id={name === 'Brad' ? 'brad' : name.includes('Fatima') ? 'fatima' : 'louise'} size="md" />
                <div>
                    <h4 className="font-bold text-stone-800 text-sm">{name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            {statusObj.label}
                        </span>
                        <span className="text-[10px] text-stone-400">• {timeString}</span>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                <Avatar id={avatarId} size="sm" />
            </div>
        </div>
    );
};

// ============================================================================
// LIST LIST COMPONENT
// ============================================================================

interface StatusListProps {
    members?: MemberStatus[]; // Using strict MemberStatus
    relativeStatuses?: any[]; // Keep permissive for now
    lastUpdated?: any;
    maxDisplay?: number;
}

export const StatusList: React.FC<StatusListProps> = ({
    members = [],
    relativeStatuses = [],
    lastUpdated,
    maxDisplay = 3
}) => {
    // Filter to only relatives
    const relatives = members.filter(m => m.role === 'relative');

    if (relatives.length === 0 && relativeStatuses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-100 mb-4">
                <p className="text-stone-400 text-sm text-center">Ingen pårørende endnu</p>
            </div>
        );
    }

    const statusData = relativeStatuses.length > 0
        ? relativeStatuses
        : relatives.map(m => ({ docId: m.docId, userId: m.userId, displayName: m.displayName, status: 'home', updatedAt: null }));

    const displayedMembers = statusData.slice(0, maxDisplay);
    const hiddenCount = Math.max(0, statusData.length - maxDisplay);

    return (
        <div className="space-y-2 mb-4">
            {displayedMembers.map((member, index) => (
                <StatusCard
                    mode="relative" // Use relative mode
                    key={member.docId || member.userId || index}
                    name={member.displayName || 'Pårørende'}
                    status={member.status}
                    timestamp={member.updatedAt || lastUpdated}
                />
            ))}
            {hiddenCount > 0 && (
                <div className="text-center py-2">
                    <span className="text-sm text-stone-400">
                        +{hiddenCount} {hiddenCount === 1 ? 'mere' : 'andre'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatusCard;

```
---

## File: tryg-app\src\features\familyPresence\useMemberStatus.ts
```ts

// Member Status hook - per-member status tracking via Firestore
// Allows each family member to have their own status (visible to others in the circle)

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface MemberStatus {
    docId: string; // This is the userId
    status: string;
    displayName: string;
    role: 'senior' | 'relative';
    updatedAt?: any;
    [key: string]: any;
}

export function useMemberStatus(
    circleId: string | null,
    userId: string | null,
    displayName: string | null,
    role: 'senior' | 'relative' | null
) {
    const [memberStatuses, setMemberStatuses] = useState<MemberStatus[]>([]);
    const [myStatus, setMyStatusState] = useState<string>('home');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to all member statuses in the circle
    useEffect(() => {
        if (!circleId) {
            setMemberStatuses([]);
            setLoading(false);
            return;
        }

        const statusesRef = collection(db, 'careCircles', circleId, 'memberStatuses');
        const statusesQuery = query(statusesRef);

        const unsubscribe = onSnapshot(statusesQuery,
            (snapshot) => {
                const statuses = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,
                    ...docSnap.data()
                })) as MemberStatus[];

                // Debug: Log status changes
                // console.log('[useMemberStatus] Received statuses:', statuses.length, statuses.map(s => `${s.displayName}: ${s.status}`));

                setMemberStatuses(statuses);

                // Update my own status from the fetched data
                if (userId) {
                    const myStatusDoc = statuses.find(s => s.docId === userId);
                    if (myStatusDoc) {
                        setMyStatusState(myStatusDoc.status);
                    }
                }

                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching member statuses:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, userId]);

    // Update current user's status
    const setMyStatus = useCallback(async (status: string) => {
        if (!circleId || !userId) return;

        const statusRef = doc(db, 'careCircles', circleId, 'memberStatuses', userId);

        try {
            await setDoc(statusRef, {
                status,
                displayName: displayName || 'Ukendt',
                role: role || 'relative',
                updatedAt: serverTimestamp(),
            }, { merge: true });

            // Optimistic update
            setMyStatusState(status);
        } catch (err: any) {
            console.error('Error updating member status:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId, userId, displayName, role]);

    // Get relative statuses only (for senior to see)
    const relativeStatuses = memberStatuses.filter(s => s.role === 'relative');

    // Get senior status (for relatives to see)
    const seniorStatus = memberStatuses.find(s => s.role === 'senior');

    return {
        memberStatuses,      // All members' statuses
        relativeStatuses,    // Only relatives (for SeniorView)
        seniorStatus,        // Only senior (for RelativeView)
        myStatus,            // Current user's status
        setMyStatus,         // Update current user's status
        loading,
        error,
    };
}

export default useMemberStatus;

```
---

## File: tryg-app\src\features\helpExchange\config.ts
```ts
// HelpExchange Match Pairs Configuration
// Easy to extend - just add new entries to the arrays

import { PictogramPosition, PictogramSheet } from '../../components/ui/Pictogram';

// Re-export this if needed elsewhere, but Pictogram defines them
type SpriteConfig = {
    sheet: '1' | '2'; // PictogramSheet
    pos: PictogramPosition;
};

export interface Celebration {
    emoji: string;
    title: string;
    message: string;
    cta: string;
    action: string;
}

export interface MatchPairConfig {
    offerId: string;
    requestId: string;
    celebration: Celebration;
}

export interface StatusMatchConfig {
    statusId: string;
    requestId: string;
    celebration: Celebration;
}

export interface ItemTemplate {
    id: string;
    label: string;
    emoji: string;
    sprite?: SpriteConfig;
}

// Match pairs: when an offer matches a request
export const MATCH_PAIRS: MatchPairConfig[] = [
    {
        offerId: 'cook',
        requestId: 'shop',
        celebration: {
            emoji: '🍽️',
            title: 'Perfekt match!',
            message: 'I kan lave et måltid sammen',
            cta: 'Planlæg madlavning',
            action: 'plan-meal'
        }
    },
    {
        offerId: 'visit',
        requestId: 'company',
        celebration: {
            emoji: '☕',
            title: 'Match!',
            message: 'Tid til en hyggelig visit',
            cta: 'Aftal besøg',
            action: 'plan-visit'
        }
    },
    {
        offerId: 'drive',
        requestId: 'transport',
        celebration: {
            emoji: '🚗',
            title: 'Transport-match!',
            message: 'Koordinér turen sammen',
            cta: 'Planlæg kørsel',
            action: 'plan-transport'
        }
    },
    {
        offerId: 'garden',
        requestId: 'outdoor',
        celebration: {
            emoji: '🌿',
            title: 'Have-match!',
            message: 'Tid i haven sammen',
            cta: 'Planlæg havearbejde',
            action: 'plan-garden'
        }
    },
    {
        offerId: 'tech',
        requestId: 'help-tech',
        celebration: {
            emoji: '💻',
            title: 'Tech-hjælp!',
            message: 'Hjælp med teknologi',
            cta: 'Ring og hjælp',
            action: 'call'
        }
    }
];

// Status-based matches: when a status aligns with a request
export const STATUS_MATCHES: StatusMatchConfig[] = [
    {
        statusId: 'available',  // "Har tid til snak"
        requestId: 'talk',
        celebration: {
            emoji: '📞',
            title: 'Tid til en snak!',
            message: 'Ring nu - der er tid til at snakke',
            cta: 'Ring nu',
            action: 'call'
        }
    },
    {
        statusId: 'home',  // "Hjemme"
        requestId: 'visit',
        celebration: {
            emoji: '🏠',
            title: 'Kom forbi!',
            message: 'Der er nogen hjemme - perfekt til et besøg',
            cta: 'Aftal besøg',
            action: 'plan-visit'
        }
    }
];

// All available offers for relatives to choose from
export const RELATIVE_OFFERS: ItemTemplate[] = [
    { id: 'cook', label: 'Lave mad til dig', emoji: '🍳', sprite: { sheet: '1', pos: 'top-left' } },
    { id: 'visit', label: 'Komme på besøg', emoji: '☕', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'drive', label: 'Køre dig et sted hen', emoji: '🚗', sprite: { sheet: '1', pos: 'bottom-left' } },
    { id: 'shop', label: 'Handle ind for dig', emoji: '🛒', sprite: { sheet: '2', pos: 'top-left' } },
    { id: 'garden', label: 'Hjælpe i haven', emoji: '🌿', sprite: { sheet: '1', pos: 'bottom-right' } },
    { id: 'tech', label: 'Hjælpe med teknologi', emoji: '💻', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'call', label: 'Ringe og snakke', emoji: '📞', sprite: { sheet: '2', pos: 'top-right' } }, // Reusing tech/talk icon
    { id: 'company', label: 'Holde dig med selskab', emoji: '🤗', sprite: { sheet: '1', pos: 'top-right' } }
];

// All available requests for relatives to make
export const RELATIVE_REQUESTS: ItemTemplate[] = [
    { id: 'recipe', label: 'Lære en opskrift', emoji: '📖', sprite: { sheet: '2', pos: 'bottom-left' } },
    { id: 'advice', label: 'Gode råd', emoji: '💡', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'story', label: 'Høre en historie', emoji: '📚', sprite: { sheet: '2', pos: 'bottom-left' } },
    { id: 'babysit', label: 'Hjælp med børnene', emoji: '👶', sprite: { sheet: '2', pos: 'bottom-right' } },
    { id: 'craft', label: 'Lave noget kreativt sammen', emoji: '🎨', sprite: { sheet: '2', pos: 'bottom-right' } }
];

// Senior's available offers (what they can contribute)
export const SENIOR_OFFERS: ItemTemplate[] = [
    { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'recipe', label: 'Jeg har en god opskrift', emoji: '👩‍🍳', sprite: { sheet: '1', pos: 'top-left' } },
    { id: 'stories', label: 'Vil gerne høre om jeres dag', emoji: '💬', sprite: { sheet: '1', pos: 'top-right' } },
    { id: 'cook', label: 'Kan lave mad til os', emoji: '🍳', sprite: { sheet: '1', pos: 'top-left' } }, // Match for shop
    { id: 'teach', label: 'Vil gerne lære fra mig', emoji: '📚', sprite: { sheet: '2', pos: 'bottom-left' } }
];

// Senior's available requests (what they need)
export const SENIOR_REQUESTS: ItemTemplate[] = [
    { id: 'call', label: 'Kan nogen ringe mig i dag?', emoji: '📞', sprite: { sheet: '2', pos: 'top-right' } },
    { id: 'shop', label: 'Hjælp til indkøb denne uge', emoji: '🛒', sprite: { sheet: '2', pos: 'top-left' } }, // Match for cook
    { id: 'transport', label: 'Følgeskab til lægen/aftale', emoji: '🚗', sprite: { sheet: '1', pos: 'bottom-left' } }, // Match for drive
    { id: 'company', label: 'Bare noget selskab', emoji: '☕', sprite: { sheet: '1', pos: 'top-right' } }, // Match for visit
    { id: 'outdoor', label: 'Gå en tur sammen', emoji: '🌿', sprite: { sheet: '1', pos: 'bottom-right' } }, // Match for garden
    { id: 'help-tech', label: 'Hjælp med telefon/computer', emoji: '📱', sprite: { sheet: '2', pos: 'top-right' } } // Match for tech
];

export default { MATCH_PAIRS, STATUS_MATCHES, RELATIVE_OFFERS, RELATIVE_REQUESTS, SENIOR_OFFERS, SENIOR_REQUESTS };

```
---

## File: tryg-app\src\features\helpExchange\HelpExchange.tsx
```tsx
import React, { useState } from 'react';
import { HandHeart, X, Plus } from 'lucide-react';
import { SENIOR_OFFERS, SENIOR_REQUESTS, ItemTemplate } from './config';
import { Pictogram } from '../../components/ui/Pictogram';
import { HelpOffer, HelpRequest } from './useHelpExchange';

interface HelpExchangeProps {
    onOffer?: (item: ItemTemplate) => void;
    onRequest?: (item: ItemTemplate) => void;
    onRemoveOffer?: (docId: string) => void;
    onRemoveRequest?: (docId: string) => void;
    activeOffers?: HelpOffer[];
    activeRequests?: HelpRequest[];
    relativeOffers?: HelpOffer[];
    relativeRequests?: HelpRequest[];
    seniorName?: string;
}

// Dashboard-style HelpExchange for Senior (aligned with RelativeView)
export const HelpExchange: React.FC<HelpExchangeProps> = ({
    onOffer,
    onRequest,
    onRemoveOffer,
    onRemoveRequest,
    activeOffers = [],
    activeRequests = [],
    relativeOffers = [],
    relativeRequests = [],
    seniorName = 'Senior'
}) => {
    // Pure "Dumb" Component - relies on props
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    // Helpers to render icon or emoji
    const renderIcon = (item: ItemTemplate | HelpOffer | HelpRequest, size: 'md' | 'lg' | 'xl' = 'md') => {
        if ('sprite' in item && item.sprite) {
            const dims = size === 'lg' ? 'w-10 h-10' : size === 'xl' ? 'w-16 h-16' : 'w-8 h-8';
            return <Pictogram sheet={item.sprite.sheet} position={item.sprite.pos} className={`${dims} shrink-0`} />;
        }
        return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>{item.emoji}</span>;
    };

    // Filter out already active items
    const availableOffers = SENIOR_OFFERS.filter(o => !activeOffers.some(active => active.id === o.id));
    const availableRequests = SENIOR_REQUESTS.filter(r => !activeRequests.some(active => active.id === r.id));

    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-5">
            <h3 className="text-stone-700 font-bold flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-teal-600" />
                Familie-Børsen
            </h3>

            {/* RELATIVES' ENTRIES - Show what family members have added */}
            {(relativeOffers.length > 0 || relativeRequests.length > 0) && (
                <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Fra familien:</p>
                    <div className="flex flex-wrap gap-2">
                        {relativeOffers.map((offer, i) => (
                            <span key={`ro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName}`}>
                                💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                            </span>
                        ))}
                        {relativeRequests.map((req, i) => (
                            <span key={`rr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName}`}>
                                💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* OFFERS SECTION */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-500 uppercase tracking-wide">Du tilbyder:</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Active Offers */}
                    {activeOffers.map((item) => (
                        <span
                            key={item.docId}
                            className="bg-teal-500 text-white pl-1.5 pr-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            {renderIcon(item, 'md')}
                            <span className="font-medium text-sm">{item.label}</span>
                            <button
                                onClick={() => onRemoveOffer?.(item.docId)}
                                className="ml-1 p-0.5 hover:bg-teal-600 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </span>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={() => setShowOfferPicker(!showOfferPicker)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-dashed transition-all
                            ${showOfferPicker
                                ? 'bg-teal-50 border-teal-300 text-teal-700'
                                : 'border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'}
                        `}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm">Tilbyd</span>
                    </button>
                </div>

                {/* Offer Picker */}
                {showOfferPicker && (
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 animate-in slide-in-from-top-2">
                        <p className="text-xs text-stone-500 mb-2 font-medium">Vælg hvad du vil tilbyde:</p>
                        <div className="flex flex-wrap gap-2">
                            {availableOffers.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onOffer?.(item);
                                        setShowOfferPicker(false);
                                    }}
                                    className="bg-white border border-stone-200 hover:border-teal-400 hover:bg-teal-50 px-3 py-2 rounded-lg 
                                        flex items-center gap-2 text-sm transition-colors text-left shadow-sm"
                                >
                                    {renderIcon(item, 'lg')}
                                    <span className="text-stone-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* SEPARATOR */}
            <div className="border-t border-stone-100"></div>

            {/* REQUESTS SECTION */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-500 uppercase tracking-wide">Du ønsker:</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Active Requests */}
                    {activeRequests.map((item) => (
                        <span
                            key={item.docId}
                            className="bg-indigo-500 text-white pl-1.5 pr-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            {renderIcon(item, 'md')}
                            <span className="font-medium text-sm">{item.label}</span>
                            <button
                                onClick={() => onRemoveRequest?.(item.docId)}
                                className="ml-1 p-0.5 hover:bg-indigo-600 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </span>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={() => setShowRequestPicker(!showRequestPicker)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-dashed transition-all
                            ${showRequestPicker
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                : 'border-stone-200 text-stone-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}
                        `}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm">Bed om</span>
                    </button>
                </div>

                {/* Request Picker */}
                {showRequestPicker && (
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 animate-in slide-in-from-top-2">
                        <p className="text-xs text-stone-500 mb-2 font-medium">Hvad har du brug for?</p>
                        <div className="flex flex-wrap gap-2">
                            {availableRequests.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onRequest?.(item);
                                        setShowRequestPicker(false);
                                    }}
                                    className="bg-white border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50 px-3 py-2 rounded-lg 
                                        flex items-center gap-2 text-sm transition-colors text-left shadow-sm"
                                >
                                    {renderIcon(item, 'lg')}
                                    <span className="text-stone-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpExchange;

```
---

## File: tryg-app\src\features\helpExchange\index.js
```js
// Help Exchange Feature - Public API
// All exports from this feature should go through this file

export { HelpExchange } from './HelpExchange';
export { MatchCelebration, MatchBanner } from './MatchCelebration';
export { useHelpExchange } from './useHelpExchange';
export { useHelpExchangeMatch } from './useHelpExchangeMatch';
export {
    RELATIVE_OFFERS,
    RELATIVE_REQUESTS,
    SENIOR_OFFERS,
    SENIOR_REQUESTS,
    MATCH_PAIRS,
    STATUS_MATCHES
} from './config';

```
---

## File: tryg-app\src\features\helpExchange\MatchCelebration.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ActiveMatch } from './useHelpExchangeMatch';

interface MatchCelebrationProps {
    match: ActiveMatch | null;
    onDismiss?: () => void;
    onAction?: (action: string) => void;
    seniorName?: string;
}

/**
 * Match Celebration Component
 * Shows animated celebration when offers match requests
 */
export const MatchCelebration: React.FC<MatchCelebrationProps> = ({
    match,
    onDismiss,
    onAction,
    seniorName = 'Mor'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // We need to wait for animation before calling parent
        if (onDismiss) {
            setTimeout(onDismiss, 300);
        }
    };

    if (!match) return null;

    const { celebration, offer, request, isStatusMatch } = match;

    return (
        <div
            className={`
                fixed inset-0 z-[100] flex items-center justify-center p-4
                transition-all duration-300
                ${isVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}
            `}
            onClick={handleDismiss}
        >
            <div
                className={`
                    bg-gradient-to-br from-white via-white to-amber-50 
                    rounded-3xl shadow-2xl border-4 border-white ring-4 ring-amber-100
                    p-8 max-w-sm w-full relative overflow-hidden
                    transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                {/* Sparkle decoration - positioned inside modal bounds */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full p-2 shadow-lg animate-bounce">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-stone-100 transition-colors z-20 backdrop-blur-sm"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>

                {/* Celebration content */}
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">{celebration.emoji}</div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-2">
                        {celebration.title}
                    </h2>
                    <p className="text-stone-600">{celebration.message}</p>
                </div>

                {/* Match details */}
                <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
                    {offer && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-teal-600">✨</span>
                            <span className="text-stone-600">
                                {offer.createdByName || seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{offer.label}</span>
                        </div>
                    )}
                    {request && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-indigo-600">💜</span>
                            <span className="text-stone-600">
                                {request.createdByName || seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{request.label}</span>
                        </div>
                    )}
                    {isStatusMatch && (
                        <div className="flex items-center gap-2 text-teal-600 text-sm">
                            <span>🟢</span>
                            <span>Status: Har tid nu</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        onClick={() => {
                            onAction?.(celebration.action);
                            handleDismiss();
                        }}
                    >
                        {celebration.cta} →
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="w-full text-sm text-stone-500 hover:text-stone-700 py-2"
                    >
                        Måske senere
                    </button>
                </div>
            </div>
        </div>
    );
};

interface MatchBannerProps {
    match: ActiveMatch | null;
    onClick?: () => void;
    onDismiss?: () => void;
}

/**
 * Mini banner version for inline display
 */
export const MatchBanner: React.FC<MatchBannerProps> = ({ match, onClick, onDismiss }) => {
    if (!match) return null;

    const { celebration } = match;

    return (
        <div
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className="text-3xl">{celebration.emoji}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-amber-800">{celebration.title}</span>
                    </div>
                    <p className="text-sm text-amber-700">{celebration.message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                        className="p-1 rounded-full hover:bg-amber-100"
                    >
                        <X className="w-4 h-4 text-amber-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MatchCelebration;

```
---

## File: tryg-app\src\features\helpExchange\useHelpExchange.ts
```ts

// Help Exchange hook - real-time sync via Firestore
// Syncs help offers and requests across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface HelpOffer {
    docId: string;
    id: string;
    label: string;
    emoji: string;
    createdByUid?: string;
    createdByRole?: string;
    createdByName?: string;
    createdAt?: any;
    [key: string]: any;
}

export interface HelpRequest {
    docId: string;
    id: string;
    label: string;
    emoji: string;
    createdByUid?: string;
    createdByRole?: string;
    createdByName?: string;
    createdAt?: any;
    [key: string]: any;
}

export function useHelpExchange(
    circleId: string | null,
    userId: string | null = null,
    userRole: string | null = null,
    displayName: string | null = null
) {
    const [helpOffers, setHelpOffers] = useState<HelpOffer[]>([]);
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to help offers from Firestore
    useEffect(() => {
        if (!circleId) {
            setHelpOffers([]);
            setHelpRequests([]);
            setLoading(false);
            return;
        }

        // Subscribe to offers
        const offersRef = collection(db, 'careCircles', circleId, 'helpOffers');
        const offersQuery = query(offersRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubOffers = onSnapshot(offersQuery,
            (snapshot) => {
                const offersList = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,  // Firestore document ID for delete operations
                    ...docSnap.data()
                })) as HelpOffer[];
                setHelpOffers(offersList);
            },
            (err: any) => {
                console.error('Error fetching help offers:', err);
                setError(err.message);
            }
        );

        // Subscribe to requests
        const requestsRef = collection(db, 'careCircles', circleId, 'helpRequests');
        const requestsQuery = query(requestsRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubRequests = onSnapshot(requestsQuery,
            (snapshot) => {
                const requestsList = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,  // Firestore document ID for delete operations
                    ...docSnap.data()
                })) as HelpRequest[];
                setHelpRequests(requestsList);
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching help requests:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => {
            unsubOffers();
            unsubRequests();
        };
    }, [circleId]);

    // Whitelist of safe fields to save to Firestore
    // React components (icon) and their Symbol properties are NOT safe
    const SAFE_HELP_FIELDS = ['id', 'label', 'emoji'];

    const sanitizeHelpData = (data: any) => {
        const clean: any = {};
        SAFE_HELP_FIELDS.forEach(key => {
            if (data[key] !== undefined && typeof data[key] !== 'function' && typeof data[key] !== 'symbol') {
                clean[key] = data[key];
            }
        });
        return clean;
    };

    // Add a help offer
    const addOffer = useCallback(async (offer: Partial<HelpOffer>) => {
        if (!circleId) return;

        const offerId = `offer_${Date.now()}`;
        const offerRef = doc(db, 'careCircles', circleId, 'helpOffers', offerId);

        try {
            await setDoc(offerRef, {
                ...sanitizeHelpData(offer),
                createdByUid: userId,
                createdByRole: userRole,
                createdByName: displayName || 'Ukendt',
                createdAt: serverTimestamp(),
            });
            return offerId;
        } catch (err: any) {
            console.error('Error adding help offer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId, userId, userRole, displayName]);

    // Add a help request
    const addRequest = useCallback(async (request: Partial<HelpRequest>) => {
        if (!circleId) return;

        const requestId = `request_${Date.now()}`;
        const requestRef = doc(db, 'careCircles', circleId, 'helpRequests', requestId);

        try {
            await setDoc(requestRef, {
                ...sanitizeHelpData(request),
                createdByUid: userId,
                createdByRole: userRole,
                createdByName: displayName || 'Ukendt',
                createdAt: serverTimestamp(),
            });
            return requestId;
        } catch (err: any) {
            console.error('Error adding help request:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId, userId, userRole, displayName]);

    // Remove an offer
    const removeOffer = useCallback(async (offerId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpOffers', offerId));
        } catch (err: any) {
            console.error('Error removing help offer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Remove a request
    const removeRequest = useCallback(async (requestId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpRequests', requestId));
        } catch (err: any) {
            console.error('Error removing help request:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        helpOffers,
        helpRequests,
        loading,
        error,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest,
    };
}

export default useHelpExchange;

```
---

## File: tryg-app\src\features\helpExchange\useHelpExchangeMatch.ts
```ts
import { useMemo } from 'react';
import { MATCH_PAIRS, STATUS_MATCHES, Celebration } from './config';
import { HelpOffer, HelpRequest } from './useHelpExchange';
import { MemberStatus } from '../familyPresence/useMemberStatus';

interface MatchProps {
    offers?: HelpOffer[];
    requests?: HelpRequest[];
    familyStatus?: string | null;
    memberStatuses?: MemberStatus[];
}

export interface ActiveMatch {
    type: 'offer-request' | 'status-request';
    offer?: HelpOffer;
    request?: HelpRequest;
    celebration: Celebration;
    isCrossFamily?: boolean;
    isStatusMatch?: boolean;
}

/**
 * Hook to detect matches between offers, requests, and status
 * Returns array of active matches with celebration data
 */
export const useHelpExchangeMatch = ({
    offers = [],
    requests = [],
    familyStatus = null,
    memberStatuses = []
}: MatchProps) => {
    const matches = useMemo(() => {
        const activeMatches: ActiveMatch[] = [];

        // Check offer-request pairs
        MATCH_PAIRS.forEach(pair => {
            const matchingOffer = offers.find(o => o.id === pair.offerId);
            const matchingRequest = requests.find(r => r.id === pair.requestId);

            if (matchingOffer && matchingRequest) {
                // Check if from different roles (true cross-family match!)
                const fromDifferentRoles = matchingOffer.createdByRole !== matchingRequest.createdByRole;

                activeMatches.push({
                    type: 'offer-request',
                    offer: matchingOffer,
                    request: matchingRequest,
                    celebration: pair.celebration,
                    isCrossFamily: fromDifferentRoles
                });
            }
        });

        // Check status-request pairs
        STATUS_MATCHES.forEach(pair => {
            // Check if any family member's status matches
            const hasMatchingStatus = memberStatuses.some(m => m.status === pair.statusId) ||
                familyStatus === pair.statusId;
            const matchingRequest = requests.find(r => r.id === pair.requestId);

            if (hasMatchingStatus && matchingRequest) {
                activeMatches.push({
                    type: 'status-request',
                    request: matchingRequest,
                    celebration: pair.celebration,
                    isStatusMatch: true
                });
            }
        });

        if (activeMatches.length > 0) {
            console.debug('🧩 [useHelpExchangeMatch] Matches detected:', activeMatches);
        }

        return activeMatches;
    }, [offers, requests, familyStatus, memberStatuses]);

    // Prioritize cross-family matches (real connections!)
    const prioritizedMatches = useMemo(() => {
        return [...matches].sort((a, b) => {
            // Cross-family matches first
            if (a.isCrossFamily && !b.isCrossFamily) return -1;
            if (!a.isCrossFamily && b.isCrossFamily) return 1;
            return 0;
        });
    }, [matches]);

    return {
        matches: prioritizedMatches,
        hasMatches: matches.length > 0,
        topMatch: prioritizedMatches[0] || null
    };
};

export default useHelpExchangeMatch;

```
---

## File: tryg-app\src\features\photos\index.js
```js
// Photos Feature - Public API
export { PhotoCaptureButton, PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './PhotoShare';
export { usePhotos } from './usePhotos';

```
---

## File: tryg-app\src\features\photos\PhotoShare.tsx
```tsx
// PhotoShare component - Ephemeral daily photo sharing
// Take a photo → Send to family → They view and delete

import React, { useState, useRef } from 'react';
import { Camera, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Photo } from './usePhotos';

interface PhotoCaptureButtonProps {
    onCapture: (file: File) => void;
    disabled?: boolean;
}

// Camera/upload button for the header
export const PhotoCaptureButton: React.FC<PhotoCaptureButtonProps> = ({ onCapture, disabled }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onCapture(file);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={disabled}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors disabled:opacity-50"
                aria-label="Tag et billede til din familie"
            >
                <Camera className="w-5 h-5 text-indigo-600" />
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                className="hidden"
            />
        </>
    );
};

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose?: () => void;
}

// Upload progress modal
export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800">Sender billede...</h3>
                <p className="text-stone-500 mt-2">Et øjeblik</p>
            </div>
        </div>
    );
};

interface PhotoViewerModalProps {
    photo: Photo | null;
    onDelete: (id: string, storagePath: string) => Promise<void>;
}

// Photo viewer modal (for recipient)
export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ photo, onDelete }) => {
    const [deleting, setDeleting] = useState(false);

    if (!photo) return null;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(photo.id, photo.storagePath);
        } catch (err) {
            console.error('Error deleting photo:', err);
            setDeleting(false);
        }
    };

    // Helper to format date
    const formatDate = (date: any) => {
        if (!date) return 'Lige nu';
        if (typeof date.toDate === 'function') {
            return date.toDate().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
        }
        return new Date(date).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <p className="font-bold">📸 Fra {photo.fromName}</p>
                        <p className="text-sm text-white/70">
                            {formatDate(photo.uploadedAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-4">
                <img
                    src={photo.imageUrl}
                    alt="Billede fra familie"
                    className="max-w-full max-h-full object-contain rounded-xl"
                />
            </div>

            {/* Delete button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                    {deleting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sletter...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-5 h-5" />
                            Slet
                        </>
                    )}
                </button>
                <p className="text-center text-white/60 text-sm mt-2">
                    Billedet forsvinder efter du sletter det
                </p>
            </div>
        </div>
    );
};

interface PhotoNotificationBadgeProps {
    photo: Photo | null;
    onClick: () => void;
}

// Notification badge for new photo
export const PhotoNotificationBadge: React.FC<PhotoNotificationBadgeProps> = ({ photo, onClick }) => {
    if (!photo) return null;

    return (
        <button
            onClick={onClick}
            className="animate-pulse bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
                <p className="font-bold">📸 Nyt billede!</p>
                <p className="text-sm text-white/80">Fra {photo.fromName}</p>
            </div>
        </button>
    );
};

export default {
    PhotoCaptureButton,
    PhotoUploadModal,
    PhotoViewerModal,
    PhotoNotificationBadge,
};

```
---

## File: tryg-app\src\features\photos\usePhotos.ts
```ts

// Photos hook - ephemeral daily photo sharing via Firestore + Storage
// Photos are deleted after viewing (client-side delete)

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { resizeImage } from '../../utils/imageUtils';

export interface Photo {
    id: string;
    imageUrl: string;
    storagePath?: string;
    fromUserId: string;
    fromName: string;
    uploadedAt: any; // Firestore Timestamp
    viewedAt?: any; // Firestore Timestamp
    [key: string]: any;
}

export function usePhotos(circleId: string | null, currentUserId: string | null) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [latestPhoto, setLatestPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to photos from Firestore
    useEffect(() => {
        if (!circleId) {
            setPhotos([]);
            setLatestPhoto(null);
            setLoading(false);
            return;
        }

        const photosRef = collection(db, 'careCircles', circleId, 'photos');
        const photosQuery = query(photosRef, orderBy('uploadedAt', 'desc'), limit(5));

        const unsubscribe = onSnapshot(photosQuery,
            (snapshot) => {
                const photosList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Photo[];
                setPhotos(photosList);

                // Find latest unviewed photo from another user
                const unviewedPhoto = photosList.find(p =>
                    p.fromUserId !== currentUserId && !p.viewedAt
                );
                setLatestPhoto(unviewedPhoto || null);

                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching photos:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, currentUserId]);

    // Upload a photo
    const uploadPhoto = useCallback(async (file: File, fromName: string) => {
        if (!circleId || !currentUserId) return;

        setUploading(true);
        setError(null);

        try {
            // Resize image before upload
            const resizedBlob = await resizeImage(file, 1200, 0.85);

            // Generate unique filename
            const photoId = `photo_${Date.now()}`;
            const storagePath = `careCircles/${circleId}/photos/${photoId}.jpg`;
            const storageRef = ref(storage, storagePath);

            // Upload to Storage
            await uploadBytes(storageRef, resizedBlob, {
                contentType: 'image/jpeg',
            });

            // Get download URL
            const downloadUrl = await getDownloadURL(storageRef);

            // Create Firestore doc
            const photoRef = doc(db, 'careCircles', circleId, 'photos', photoId);
            await setDoc(photoRef, {
                imageUrl: downloadUrl,
                storagePath,
                fromUserId: currentUserId,
                fromName: fromName || 'Familie',
                uploadedAt: serverTimestamp(),
                viewedAt: null,
            });

            setUploading(false);
            return photoId;
        } catch (err: any) {
            console.error('Error uploading photo:', err);
            setError(err.message);
            setUploading(false);
            throw err;
        }
    }, [circleId, currentUserId]);

    // Delete a photo (called when viewer closes it)
    const deletePhoto = useCallback(async (photoId: string, storagePath?: string) => {
        if (!circleId) return;

        try {
            // Delete from Storage
            if (storagePath) {
                const storageRef = ref(storage, storagePath);
                await deleteObject(storageRef).catch(() => {
                    // Ignore if already deleted
                });
            }

            // Delete from Firestore
            await deleteDoc(doc(db, 'careCircles', circleId, 'photos', photoId));

            // Clear from local state
            if (latestPhoto?.id === photoId) {
                setLatestPhoto(null);
            }
        } catch (err: any) {
            console.error('Error deleting photo:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId, latestPhoto]);

    // Mark photo as viewed (for tracking, before delete)
    const markViewed = useCallback(async (photoId: string) => {
        if (!circleId) return;

        try {
            await setDoc(doc(db, 'careCircles', circleId, 'photos', photoId), {
                viewedAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Error marking photo viewed:', err);
        }
    }, [circleId]);

    return {
        photos,
        latestPhoto,
        loading,
        uploading,
        error,
        uploadPhoto,
        deletePhoto,
        markViewed,
    };
}

export default usePhotos;

```
---

## File: tryg-app\src\features\symptoms\BodyPainSelector.tsx
```tsx
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface SeverityLevel {
    id: 'mild' | 'moderate' | 'severe';
    label: string;
    emoji: string;
    color: string;
}

export interface BodyRegion {
    id: string;
    label: string;
    emoji: string;
    severity?: Omit<SeverityLevel, 'color'>; // When selected, we store severity details
}

// Body regions for pain mapping - ordered anatomically (top → bottom)
export const BODY_REGIONS: BodyRegion[] = [
    { id: 'head', label: 'Hoved', emoji: '🧠' },
    { id: 'neck', label: 'Nakke', emoji: '🦴' },
    { id: 'chest', label: 'Bryst', emoji: '❤️' },
    { id: 'back', label: 'Ryg', emoji: '🔙' },
    { id: 'stomach', label: 'Mave', emoji: '🤢' },
    { id: 'leftArm', label: 'Venstre arm', emoji: '💪' },
    { id: 'rightArm', label: 'Højre arm', emoji: '💪' },
    { id: 'leftLeg', label: 'Venstre ben', emoji: '🦵' },
    { id: 'rightLeg', label: 'Højre ben', emoji: '🦵' },
];

// Pain severity levels - simple 3-level scale
export const SEVERITY_LEVELS: SeverityLevel[] = [
    { id: 'mild', label: 'Lidt', emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: 'Noget', emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: 'Meget', emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

interface BodyPainSelectorProps {
    onSelectLocation: (location: BodyRegion) => void;
    onBack?: () => void;
}

// Two-step selector: body location → severity
export const BodyPainSelector: React.FC<BodyPainSelectorProps> = ({ onSelectLocation, onBack }) => {
    const [step, setStep] = useState(1); // 1 = location, 2 = severity
    const [selectedLocation, setSelectedLocation] = useState<BodyRegion | null>(null);
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);

    const handleLocationSelect = (region: BodyRegion) => {
        setSelectedLocation(region);
        setStep(2); // Move to severity selection
    };

    const handleSeveritySelect = (severity: SeverityLevel) => {
        setSelectedSeverity(severity);
    };

    const handleConfirm = () => {
        if (selectedLocation && selectedSeverity) {
            onSelectLocation({
                id: selectedLocation.id,
                label: selectedLocation.label,
                emoji: selectedLocation.emoji,
                severity: {
                    id: selectedSeverity.id,
                    label: selectedSeverity.label,
                    emoji: selectedSeverity.emoji
                }
            });
        }
    };

    const handleBackToLocation = () => {
        setStep(1);
        setSelectedSeverity(null);
    };

    return (
        <div className="space-y-4">
            {step === 1 ? (
                // Step 1: Body location selection
                <>
                    <p className="text-lg text-center text-stone-600 mb-4">
                        Hvor gør det ondt?
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {BODY_REGIONS.map(region => (
                            <button
                                key={region.id}
                                onClick={() => handleLocationSelect(region)}
                                className="p-4 rounded-2xl border-2 transition-all duration-200
                                    flex items-center gap-3 text-left
                                    bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50
                                    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                                aria-label={`Vælg ${region.label}`}
                            >
                                <span className="text-2xl">{region.emoji}</span>
                                <span className="font-semibold text-stone-700">{region.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label="Gå tilbage til symptomvalg"
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        Tilbage
                    </button>
                </>
            ) : (
                // Step 2: Pain severity selection
                <>
                    <div className="text-center mb-4">
                        <span className="text-3xl">{selectedLocation?.emoji}</span>
                        <p className="text-lg text-stone-600 mt-2">
                            Hvor ondt gør det i <span className="font-bold text-rose-600">{selectedLocation?.label.toLowerCase()}</span>?
                        </p>
                    </div>

                    <div className="space-y-3 mb-4">
                        {SEVERITY_LEVELS.map(level => (
                            <button
                                key={level.id}
                                onClick={() => handleSeveritySelect(level)}
                                className={`
                                    w-full p-5 rounded-2xl border-2 transition-all duration-200
                                    flex items-center justify-center gap-4 text-xl font-bold
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${selectedSeverity?.id === level.id
                                        ? `${level.color} ring-2 ring-offset-1`
                                        : 'bg-white border-stone-200 hover:bg-stone-50'
                                    }
                                `}
                                aria-label={`Smerte niveau: ${level.label}`}
                            >
                                <span className="text-4xl">{level.emoji}</span>
                                <span>{level.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Confirm button */}
                    {selectedSeverity && (
                        <button
                            onClick={handleConfirm}
                            className="w-full p-4 bg-rose-500 text-white rounded-2xl font-bold text-lg 
                                flex items-center justify-center gap-2 hover:bg-rose-600 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                            aria-label="Bekræft symptomregistrering"
                        >
                            Bekræft
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={handleBackToLocation}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 
                            focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label="Vælg et andet sted"
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        Vælg et andet sted
                    </button>
                </>
            )}
        </div>
    );
};

// Get label for body region by ID
export const getBodyRegionLabel = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.label : id;
};

// Get emoji for body region by ID
export const getBodyRegionEmoji = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.emoji : '📍';
};

// Get severity info by ID
export const getSeverityInfo = (id: string) => {
    return SEVERITY_LEVELS.find(s => s.id === id);
};

export default BodyPainSelector;

```
---

## File: tryg-app\src\features\symptoms\index.js
```js
// Symptoms Feature - Public API
export { BodyPainSelector } from './BodyPainSelector';
export { SymptomSummary } from './SymptomSummary';
export { useSymptoms } from './useSymptoms';

```
---

## File: tryg-app\src\features\symptoms\SymptomSummary.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Phone, Calendar } from 'lucide-react';
import { SYMPTOMS_LIST } from '../../data/constants';
import { SymptomLog } from './useSymptoms';

interface TrendAnalysis {
    trend: 'none' | 'warning' | 'increasing' | 'decreasing' | 'stable';
    message: string | null;
    cta: {
        icon: React.ElementType;
        text: string;
        action: string;
    } | null;
}

// Check if a date is today
const isToday = (timestamp: any) => {
    if (!timestamp) return false;
    const today = new Date();
    const date = (timestamp && typeof timestamp.toDate === 'function')
        ? timestamp.toDate()
        : new Date(timestamp);
    return date.toDateString() === today.toDateString();
};

// Check if date is within last N days
const isWithinDays = (timestamp: any, days: number) => {
    if (!timestamp) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const date = (timestamp && typeof timestamp.toDate === 'function')
        ? timestamp.toDate()
        : new Date(timestamp);
    return date >= cutoff;
};

// Get trend analysis for symptoms
const analyzeTrend = (symptoms: SymptomLog[]): TrendAnalysis => {
    if (symptoms.length === 0) return { trend: 'none', message: null, cta: null };

    // Count symptoms by day for last 7 days
    const last3Days = symptoms.filter(s => isWithinDays(s.loggedAt, 3)).length;
    const prev4Days = symptoms.filter(s =>
        isWithinDays(s.loggedAt, 7) && !isWithinDays(s.loggedAt, 3)
    ).length;

    // Count severe symptoms
    const severeCount = symptoms.filter(s =>
        s.bodyLocation?.severity?.id === 'severe'
    ).length;

    // Analyze patterns
    if (severeCount >= 2) {
        return {
            trend: 'warning',
            message: `${severeCount} alvorlige symptomer denne uge`,
            cta: { icon: Phone, text: 'Overvej at kontakte læge', action: 'call' }
        };
    }

    if (last3Days > prev4Days * 1.5 && last3Days >= 3) {
        return {
            trend: 'increasing',
            message: 'Flere symptomer de seneste dage',
            cta: { icon: Calendar, text: 'Book tid hos læge?', action: 'book' }
        };
    }

    if (last3Days < prev4Days * 0.5) {
        return {
            trend: 'decreasing',
            message: 'Symptomerne aftager 👍',
            cta: null
        };
    }

    return {
        trend: 'stable',
        message: `${symptoms.length} symptomer denne uge`,
        cta: null
    };
};

interface SymptomSummaryProps {
    symptomLogs?: SymptomLog[];
    onViewReport?: () => void;
    hideTitle?: boolean;
}

// Symptom Summary Card - shows today's symptoms with 7-day overview
export const SymptomSummary: React.FC<SymptomSummaryProps> = ({ symptomLogs = [], onViewReport, hideTitle = false }) => {
    const [showOlder, setShowOlder] = useState(false);

    // Split symptoms
    const { todaySymptoms, weekSymptoms } = useMemo(() => {
        const today = symptomLogs.filter(s => isToday(s.loggedAt));
        const week = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7) && !isToday(s.loggedAt));
        return { todaySymptoms: today, weekSymptoms: week };
    }, [symptomLogs]);

    // Get trend analysis
    const weeklySymptoms = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7));
    const trend = useMemo(() => analyzeTrend(weeklySymptoms), [weeklySymptoms]);

    // Count symptoms by type for summary
    const symptomCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        weekSymptoms.forEach(s => {
            const type = s.label || s.id;
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    }, [weekSymptoms]);

    if (symptomLogs.length === 0) return null;

    return (
        <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 space-y-3">
            {/* Today's Symptoms */}
            {todaySymptoms.length > 0 && (
                <div>
                    {!hideTitle && (
                        <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            Symptomer i dag ({todaySymptoms.length})
                        </h4>
                    )}
                    <div className="space-y-2">
                        {todaySymptoms.map((log, i) => (
                            <div key={i} className="flex items-center justify-between text-sm text-orange-900 bg-white/70 p-3 rounded-xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium">{log.label}</span>
                                    {log.bodyLocation && (
                                        <span className="text-orange-600 text-xs bg-orange-100 px-2 py-0.5 rounded-full">
                                            {log.bodyLocation.emoji} {log.bodyLocation.label}
                                        </span>
                                    )}
                                    {log.bodyLocation?.severity && (
                                        <span className="text-xs bg-orange-200 px-2 py-0.5 rounded-full">
                                            {log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}
                                        </span>
                                    )}
                                </div>
                                <span className="text-orange-500 text-xs whitespace-nowrap">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7-Day Summary */}
            {weekSymptoms.length > 0 && (
                <div className="border-t border-orange-200 pt-3">
                    <button
                        onClick={() => setShowOlder(!showOlder)}
                        className="w-full flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2 text-orange-700">
                            {trend.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-500" />}
                            {trend.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-green-500" />}
                            {trend.trend === 'stable' && <AlertCircle className="w-4 h-4" />}
                            {trend.trend === 'warning' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            <span className="font-medium">
                                {trend.message || `${weekSymptoms.length} symptomer denne uge`}
                            </span>
                        </div>
                        {showOlder ? (
                            <ChevronUp className="w-4 h-4 text-orange-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-orange-500" />
                        )}
                    </button>

                    {/* Collapsed summary */}
                    {!showOlder && symptomCounts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {symptomCounts.map(([type, count], i) => (
                                <span key={i} className="text-xs text-orange-600 bg-white/60 px-2 py-1 rounded-full">
                                    {type} ({count}x)
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Expanded view */}
                    {showOlder && (
                        <div className="space-y-2 mt-3">
                            {/* When in warning mode, only show severe symptoms */}
                            {(trend.trend === 'warning'
                                ? weekSymptoms.filter(s => s.bodyLocation?.severity?.id === 'severe')
                                : weekSymptoms
                            ).map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-sm text-orange-800 bg-white/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span>{log.label}</span>
                                        {log.bodyLocation && (
                                            <span className="text-xs text-orange-500">
                                                {log.bodyLocation.emoji}
                                            </span>
                                        )}
                                        {log.bodyLocation?.severity && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${log.bodyLocation.severity.id === 'severe'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {log.bodyLocation.severity.label}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-orange-400">{log.date || log.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Trend-based CTA */}
            {trend.cta && (
                <div className="border-t border-orange-200 pt-3">
                    <button
                        onClick={() => {
                            // Future: integrate with phone/calendar
                            if (trend.cta?.action === 'call') {
                                alert('Ring til læge funktionalitet kommer snart');
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl text-sm font-medium transition-colors"
                    >
                        <trend.cta.icon className="w-4 h-4" />
                        {trend.cta.text}
                    </button>
                </div>
            )}

            {/* Link to full report */}
            {onViewReport && (
                <button
                    onClick={onViewReport}
                    className="w-full text-center text-xs text-orange-500 hover:text-orange-700 transition-colors"
                >
                    Se fuld symptom-historik →
                </button>
            )}
        </div>
    );
};

export default SymptomSummary;

```
---

## File: tryg-app\src\features\symptoms\useSymptoms.ts
```ts

// Symptoms hook - real-time symptom log sync via Firestore
// Replaces localStorage for multi-user symptom tracking

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Severity {
    id: 'mild' | 'moderate' | 'severe';
    label: string;
    emoji: string;
    level: number;
}

export interface BodyLocation {
    id: string;
    label: string;
    emoji: string;
    severity?: Severity;
}

export interface SymptomLog {
    id: string;
    label?: string;
    color?: string;
    bodyLocation?: BodyLocation;
    time: string;
    date: string;
    loggedAt?: any; // Firestore Timestamp
    [key: string]: any;
}

export interface SymptomStats {
    count: number;
    lastOccurrence: string | null;
}

export function useSymptoms(circleId: string | null) {
    const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to symptoms from Firestore (most recent first, limited)
    useEffect(() => {
        if (!circleId) {
            setSymptoms([]);
            setLoading(false);
            return;
        }

        const symptomsRef = collection(db, 'careCircles', circleId, 'symptoms');
        const symptomsQuery = query(symptomsRef, orderBy('loggedAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(symptomsQuery,
            (snapshot) => {
                const symptomsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SymptomLog[];
                setSymptoms(symptomsList);
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching symptoms:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Whitelist of safe fields to save to Firestore
    // React components and their Symbol properties are NOT safe
    const SAFE_SYMPTOM_FIELDS = ['id', 'label', 'color', 'bodyLocation'];

    const sanitizeSymptomData = (data: any) => {
        const clean: any = {};
        SAFE_SYMPTOM_FIELDS.forEach(key => {
            if (data[key] !== undefined && typeof data[key] !== 'function' && typeof data[key] !== 'symbol') {
                clean[key] = data[key];
            }
        });
        return clean;
    };

    // Add a new symptom log
    const addSymptom = useCallback(async (symptomData: Partial<SymptomLog>) => {
        if (!circleId) return;

        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
        const dateString = now.toLocaleDateString('da-DK');

        const symptomId = `symptom_${Date.now()}`;
        const symptomRef = doc(db, 'careCircles', circleId, 'symptoms', symptomId);

        try {
            await setDoc(symptomRef, {
                ...sanitizeSymptomData(symptomData),
                time: timeString,
                date: dateString,
                loggedAt: serverTimestamp(),
            });
            return symptomId;
        } catch (err: any) {
            console.error('Error adding symptom:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Delete a symptom log
    const removeSymptom = useCallback(async (symptomId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'symptoms', symptomId));
        } catch (err: any) {
            console.error('Error removing symptom:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Get symptoms for a specific date range (for reports)
    const getSymptomsByDateRange = useCallback((startDate: Date, endDate: Date) => {
        return symptoms.filter(s => {
            const symptomDate = new Date(s.loggedAt?.toDate?.() || s.loggedAt);
            return symptomDate >= startDate && symptomDate <= endDate;
        });
    }, [symptoms]);

    // Get symptom stats for doctor report
    const getSymptomStats = useCallback(() => {
        const stats: Record<string, SymptomStats> = {};
        symptoms.forEach(s => {
            const type = s.id || s.label || 'unknown';
            if (!stats[type]) {
                stats[type] = { count: 0, lastOccurrence: null };
            }
            stats[type].count++;
            if (!stats[type].lastOccurrence) {
                stats[type].lastOccurrence = s.date;
            }
        });
        return stats;
    }, [symptoms]);

    return {
        symptoms,
        loading,
        error,
        addSymptom,
        removeSymptom,
        getSymptomsByDateRange,
        getSymptomStats,
    };
}

export default useSymptoms;

```
---

## File: tryg-app\src\features\tasks\index.js
```js
// Tasks Feature - Public API
export { ProgressRing, InlineGatesIndicator } from './ProgressRing';
export { TimePickerModal } from './TimePickerModal';
export { useTasks } from './useTasks';

```
---

## File: tryg-app\src\features\tasks\ProgressRing.tsx
```tsx
import React from 'react';
// We assume Task is exported from useTasks. If not, we might need to view useTasks.ts, but standard practice is to export interfaces.
import { Task } from './useTasks';

/**
 * ProgressRing - A 3-segment ring showing daily progress with color-coded compliance
 * 
 * Segments: Morgen (Morning), Eftermiddag (Afternoon), Aften (Evening)
 * Colors:
 *   - Grøn (Green): Completed on time (within ±2 hours)
 *   - Gul (Yellow): Completed late (outside expected window)
 *   - Rød (Red): Not completed / Overdue
 *   - Gray: Future / Not yet due
 */

type Period = 'morgen' | 'eftermiddag' | 'aften';
type Status = 'onTime' | 'late' | 'overdue' | 'pending' | 'complete';

interface SegmentConfig {
    label: string;
    start: number;
    end: number;
    emoji: string;
}

const SEGMENT_CONFIG: Record<Period, SegmentConfig> = {
    morgen: { label: 'Morgen', start: 6, end: 12, emoji: '☀️' },
    eftermiddag: { label: 'Eftermiddag', start: 12, end: 18, emoji: '🌤️' },
    aften: { label: 'Aften', start: 18, end: 22, emoji: '🌙' }
};

interface StatusColor {
    stroke: string;
    fill: string;
    label: string;
}

const STATUS_COLORS: Record<Status, StatusColor> = {
    onTime: { stroke: '#10B981', fill: '#D1FAE5', label: 'Til tiden' },     // Green
    late: { stroke: '#F59E0B', fill: '#FEF3C7', label: 'For sent' },        // Yellow
    overdue: { stroke: '#EF4444', fill: '#FEE2E2', label: 'Mangler' },      // Red
    pending: { stroke: '#D1D5DB', fill: '#F3F4F6', label: 'Afventer' },     // Gray
    complete: { stroke: '#10B981', fill: '#D1FAE5', label: 'Færdig' }       // Green (all done)
};

/**
 * Determine segment status based on tasks and current time
 * @param {Array} tasks - Tasks for this segment
 * @param {string} period - 'morgen' | 'eftermiddag' | 'aften'
 * @param {number} currentHour - Current hour (0-23)
 */
const getSegmentStatus = (tasks: Task[], period: Period, currentHour: number): Status => {
    const config = SEGMENT_CONFIG[period];
    // Cast period check because Task.period might be string, but logic implies matching values.
    const periodTasks = tasks.filter(t => t.period === period);

    if (periodTasks.length === 0) {
        // No tasks for this period
        return currentHour >= config.end ? 'complete' : 'pending';
    }

    const completedTasks = periodTasks.filter(t => t.completed);
    const allComplete = completedTasks.length === periodTasks.length;

    // If period hasn't started yet
    if (currentHour < config.start) {
        return 'pending';
    }

    // If period is in the past
    if (currentHour >= config.end) {
        if (allComplete) {
            // Check if completed on time (simplified: assume on time if completed)
            return 'onTime';
        }
        return 'overdue';
    }

    // Period is currently active
    if (allComplete) {
        return 'onTime';
    }

    // Check if we're past the expected time window (+2 hours grace)
    const graceEnd = config.end + 2;
    if (currentHour >= graceEnd) {
        return completedTasks.length > 0 ? 'late' : 'overdue';
    }

    return 'pending';
};

interface ProgressRingProps {
    tasks?: Task[];
    size?: number;
    strokeWidth?: number;
    showLabels?: boolean;
    className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    tasks = [],
    size = 120,
    strokeWidth = 12,
    showLabels = true,
    className = ''
}) => {
    const currentHour = new Date().getHours();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const segmentLength = circumference / 3;
    const gap = 4; // Gap between segments

    const segments = (['morgen', 'eftermiddag', 'aften'] as Period[]).map((period, index) => {
        const status = getSegmentStatus(tasks, period, currentHour);
        const colors = STATUS_COLORS[status];
        const config = SEGMENT_CONFIG[period];

        // Calculate stroke dash offset for each segment
        const offset = index * segmentLength;

        return {
            period,
            status,
            colors,
            config,
            offset,
            dashArray: `${segmentLength - gap} ${circumference - segmentLength + gap}`
        };
    });

    // Calculate overall progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            {/* SVG Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />

                {/* Colored segments */}
                {segments.map((seg, i) => (
                    <circle
                        key={seg.period}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={seg.colors.stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={-seg.offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                ))}
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-stone-800">{progressPercent}%</span>
                <span className="text-xs text-stone-500">færdig</span>
            </div>

            {/* Legend */}
            {showLabels && (
                <div className="flex gap-3 mt-3">
                    {segments.map(seg => (
                        <div key={seg.period} className="flex items-center gap-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: seg.colors.stroke }}
                            />
                            <span className="text-xs text-stone-600">{seg.config.emoji}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ProgressRingCompactProps {
    tasks?: Task[];
    size?: number;
}

/**
 * Compact version for inline use
 */
export const ProgressRingCompact: React.FC<ProgressRingCompactProps> = ({ tasks = [], size = 48 }) => {
    const currentHour = new Date().getHours();
    const segments = (['morgen', 'eftermiddag', 'aften'] as Period[]).map(period =>
        getSegmentStatus(tasks, period, currentHour)
    );

    const hasOverdue = segments.includes('overdue');
    const hasLate = segments.includes('late');
    const allGood = !hasOverdue && !hasLate;

    const borderColor = hasOverdue ? 'border-red-400' : hasLate ? 'border-yellow-400' : 'border-green-400';
    const bgColor = hasOverdue ? 'bg-red-50' : hasLate ? 'bg-yellow-50' : 'bg-green-50';
    const textColor = hasOverdue ? 'text-red-600' : hasLate ? 'text-yellow-600' : 'text-green-600';

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    return (
        <div className={`w-12 h-12 rounded-full border-4 ${borderColor} ${bgColor} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${textColor}`}>{progressPercent}%</span>
        </div>
    );
};

interface InlineGatesIndicatorProps {
    tasks?: Task[];
    className?: string;
}

/**
 * Inline Gates Indicator - compact horizontal view of all 3 periods
 * Design: ⬤ Morgen ✓  ⬤ Eftermiddag  ⬤ Aften
 */
export const InlineGatesIndicator: React.FC<InlineGatesIndicatorProps> = ({ tasks = [], className = '' }) => {
    const currentHour = new Date().getHours();

    const periods = (['morgen', 'eftermiddag', 'aften'] as Period[]).map(period => {
        const status = getSegmentStatus(tasks, period, currentHour);
        const colors = STATUS_COLORS[status];
        const config = SEGMENT_CONFIG[period];

        // Determine checkmark or status indicator
        const isComplete = status === 'onTime' || status === 'complete';
        const isPending = status === 'pending';
        const isOverdue = status === 'overdue';
        const isLate = status === 'late';

        return {
            period,
            label: config.label,
            isComplete,
            isPending,
            isOverdue,
            isLate,
            color: colors.stroke
        };
    });

    return (
        <div className={`flex items-center justify-center gap-2 text-xs ${className}`}>
            {periods.map(p => (
                <div
                    key={p.period}
                    className="flex items-center gap-1"
                    title={`${p.label}: ${p.isComplete ? 'Færdig' : p.isPending ? 'Afventer' : p.isOverdue ? 'Mangler' : 'For sent'}`}
                >
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                    />
                    <span className={`font-medium ${p.isComplete ? 'text-green-700' : p.isOverdue ? 'text-red-600' : 'text-stone-500'}`}>
                        {p.label.slice(0, 3)}
                        {p.isComplete && ' ✓'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ProgressRing;

```
---

## File: tryg-app\src\features\tasks\TimePickerModal.tsx
```tsx
import React, { useState } from 'react';
import { X, Clock, Phone, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface TimeConfirmData {
    period: string;
    time: string;
    label: string;
}

interface TimePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: TimeConfirmData) => void;
    title?: string;
    actionLabel?: string;
    seniorName?: string;
}

/**
 * Time Picker Modal for scheduling tasks from match actions
 */
export const TimePickerModal: React.FC<TimePickerModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Hvornår vil du ringe?',
    actionLabel = 'Ring til',
    seniorName = 'Senior'
}) => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('morgen');

    const PERIODS = [
        { id: 'morgen', label: 'Morgen', time: '09:00', emoji: '🌅' },
        { id: 'formiddag', label: 'Formiddag', time: '11:00', emoji: '☀️' },
        { id: 'eftermiddag', label: 'Eftermiddag', time: '14:00', emoji: '🌤️' },
        { id: 'aften', label: 'Aften', time: '18:00', emoji: '🌙' }
    ];

    if (!isOpen) return null;

    const handleConfirm = () => {
        const period = PERIODS.find(p => p.id === selectedPeriod);
        onConfirm({
            period: selectedPeriod,
            time: period?.time || '10:00',
            label: period?.label || 'Morgen'
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Phone className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-800">{title}</h2>
                    <p className="text-stone-500 text-sm mt-1">
                        {actionLabel} {seniorName}
                    </p>
                </div>

                {/* Time Period Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {PERIODS.map(period => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={`
                                p-4 rounded-xl border-2 transition-all text-left
                                ${selectedPeriod === period.id
                                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                }
                            `}
                        >
                            <div className="text-2xl mb-1">{period.emoji}</div>
                            <div className="font-bold text-stone-800">{period.label}</div>
                            <div className="text-xs text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {period.time}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Confirm Button */}
                <Button
                    className="w-full"
                    onClick={handleConfirm}
                >
                    📞 Opret opgave
                </Button>

                <button
                    onClick={onClose}
                    className="w-full text-sm text-stone-500 hover:text-stone-700 py-3 mt-2"
                >
                    Annuller
                </button>
            </div>
        </div>
    );
};

export default TimePickerModal;

```
---

## File: tryg-app\src\features\tasks\useTasks.ts
```ts

// Tasks hook - real-time task sync via Firestore
// Replaces localStorage for multi-user task management

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { INITIAL_TASKS } from '../../data/constants';

export interface Task {
    id: string;
    title: string;
    period: string;
    time: string;
    emoji: string;
    completed: boolean;
    createdAt?: any;
    completedAt?: any;
    [key: string]: any; // Allow other props
}

export function useTasks(circleId: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to tasks from Firestore
    useEffect(() => {
        if (!circleId) {
            setTasks(INITIAL_TASKS as Task[]); // Fallback to defaults
            setLoading(false);
            return;
        }

        const tasksRef = collection(db, 'careCircles', circleId, 'tasks');
        const tasksQuery = query(tasksRef, orderBy('period'), orderBy('time'));

        const unsubscribe = onSnapshot(tasksQuery,
            (snapshot) => {
                if (snapshot.empty) {
                    // Initialize with default tasks if none exist
                    initializeDefaultTasks(circleId);
                } else {
                    const tasksList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Task[];
                    setTasks(tasksList);
                }
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching tasks:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Initialize default tasks for new circles
    const initializeDefaultTasks = async (cId: string) => {
        try {
            for (const task of INITIAL_TASKS) {
                await setDoc(doc(db, 'careCircles', cId, 'tasks', `task_${task.id}`), {
                    ...task,
                    createdAt: serverTimestamp(),
                    completedAt: null,
                });
            }
        } catch (err) {
            console.error('Error initializing tasks:', err);
        }
    };

    // Toggle task completion
    const toggleTask = useCallback(async (taskId: string) => {
        if (!circleId) return;

        const task = tasks.find(t => t.id === taskId || t.id === `task_${taskId}`);
        if (!task) return;

        const taskRef = doc(db, 'careCircles', circleId, 'tasks',
            task.id.startsWith('task_') ? task.id : `task_${task.id}`);

        try {
            await setDoc(taskRef, {
                completed: !task.completed,
                completedAt: !task.completed ? serverTimestamp() : null,
            }, { merge: true });
        } catch (err: any) {
            console.error('Error toggling task:', err);
            setError(err.message);
        }
    }, [circleId, tasks]);

    // Add a new task (from relative or senior)
    const addTask = useCallback(async (newTask: Partial<Task>) => {
        if (!circleId) return;

        const taskId = `task_${Date.now()}`;
        const taskRef = doc(db, 'careCircles', circleId, 'tasks', taskId);

        // Default time based on period if not provided
        const defaultTimes: Record<string, string> = {
            morgen: '09:00',
            frokost: '12:00',
            eftermiddag: '15:00',
            aften: '19:00'
        };

        try {
            await setDoc(taskRef, {
                id: taskId,
                ...newTask,
                time: newTask.time || (newTask.period ? defaultTimes[newTask.period] : '12:00'),
                completed: false,
                createdAt: serverTimestamp(),
                completedAt: null,
            });
            return taskId;
        } catch (err: any) {
            console.error('Error adding task:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Remove a task
    const removeTask = useCallback(async (taskId: string) => {
        if (!circleId) return;

        const docId = taskId.startsWith('task_') ? taskId : `task_${taskId}`;
        const taskRef = doc(db, 'careCircles', circleId, 'tasks', docId);

        try {
            await deleteDoc(taskRef);
        } catch (err: any) {
            console.error('Error removing task:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Reset all tasks (mark incomplete)
    const resetTasks = useCallback(async () => {
        if (!circleId) return;

        try {
            for (const task of tasks) {
                const docId = task.id.startsWith('task_') ? task.id : `task_${task.id}`;
                await setDoc(doc(db, 'careCircles', circleId, 'tasks', docId), {
                    completed: false,
                    completedAt: null,
                }, { merge: true });
            }
        } catch (err: any) {
            console.error('Error resetting tasks:', err);
            setError(err.message);
        }
    }, [circleId, tasks]);

    return {
        tasks,
        loading,
        error,
        toggleTask,
        addTask,
        removeTask,
        resetTasks,
    };
}

export default useTasks;

```
---

## File: tryg-app\src\features\thinkingOfYou\index.js
```js
// Thinking of You Feature - Public API
export { ThinkingOfYouButton, ThinkingOfYouIconButton, PingNotification } from './ThinkingOfYou';
export { usePings } from './usePings';

```
---

## File: tryg-app\src\features\thinkingOfYou\ThinkingOfYou.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
// @ts-ignore - sounds util not converted yet
import { playPingSound } from '../../utils/sounds';
import { Avatar } from '../../components/ui/Avatar';
import { Ping } from './usePings';

interface ThinkingOfYouButtonProps {
    onSendPing?: () => void;
    fromName?: string;
}

// "Thinking of you" ping button - one-tap warmth without obligation
export const ThinkingOfYouButton: React.FC<ThinkingOfYouButtonProps> = ({ onSendPing, fromName = 'Louise' }) => {
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();

        // Reset animation after 1.5s
        setTimeout(() => setIsSending(false), 1500);
    };

    return (
        <button
            onClick={handleSend}
            disabled={isSending}
            className={`
                w-full p-4 rounded-2xl border-2 transition-all duration-300
                flex items-center justify-center gap-3
                ${isSending
                    ? 'bg-pink-100 border-pink-300 scale-95'
                    : 'bg-white border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95'
                }
            `}
        >
            <div className={`
                relative transition-transform duration-300
                ${isSending ? 'scale-125' : ''}
            `}>
                <Heart
                    className={`w-8 h-8 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
                />
                {isSending && (
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-ping" />
                )}
            </div>
            <span className={`font-semibold text-lg ${isSending ? 'text-pink-600' : 'text-pink-500'}`}>
                {isSending ? 'Sendt! ❤️' : 'Tænker på dig'}
            </span>
        </button>
    );
};

interface ThinkingOfYouIconButtonProps {
    onSendPing?: () => void;
}

// Compact icon-only version for header placement
export const ThinkingOfYouIconButton: React.FC<ThinkingOfYouIconButtonProps> = ({ onSendPing }) => {
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();
        setTimeout(() => setIsSending(false), 1500);
    };

    return (
        <button
            onClick={handleSend}
            disabled={isSending}
            aria-label="Send kærlighed"
            className={`
                p-2 rounded-full transition-all duration-300 relative
                ${isSending
                    ? 'bg-pink-200 scale-110'
                    : 'bg-pink-50 hover:bg-pink-100 active:scale-95'
                }
            `}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
            />
            {isSending && (
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-pink-400 animate-ping" />
            )}
        </button>
    );
};

interface PingNotificationProps {
    ping: Ping | null;
    onDismiss?: () => void;
}

// Ping notification that appears in recipient's view
export const PingNotification: React.FC<PingNotificationProps> = ({ ping, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (ping) {
            setIsVisible(true);
            playPingSound();

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onDismiss?.(), 500); // Wait for fade-out
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [ping, onDismiss]);

    if (!ping) return null;

    return (
        <div className={`
            fixed top-20 left-4 right-4 z-50 transition-all duration-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}>
            <div
                onClick={() => { setIsVisible(false); setTimeout(() => onDismiss?.(), 300); }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-2xl shadow-xl text-white cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1 rounded-full">
                        <Avatar id={ping.fromName?.toLowerCase() || 'louise'} size="md" className="border-2 border-white/50" />
                    </div>
                    <div>
                        <p className="font-bold">{ping.fromName} tænker på dig ❤️</p>
                        <p className="text-pink-100 text-sm">{ping.time}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThinkingOfYouButton;

```
---

## File: tryg-app\src\features\thinkingOfYou\usePings.ts
```ts

// Pings hook - real-time "thinking of you" sync via Firestore
// Syncs ping notifications across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Ping {
    id: string;
    fromName: string;
    fromUserId: string;
    toRole: 'senior' | 'relative';
    sentAt: Date;
    toUserId?: string;
}

export function usePings(circleId: string | null, currentUserId: string | null) {
    const [pings, setPings] = useState<Ping[]>([]);
    const [latestPing, setLatestPing] = useState<Ping | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to recent pings from Firestore
    useEffect(() => {
        if (!circleId) {
            setPings([]);
            setLoading(false);
            return;
        }

        const pingsRef = collection(db, 'careCircles', circleId, 'pings');

        const pingsQuery = query(
            pingsRef,
            orderBy('sentAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(pingsQuery,
            (snapshot) => {
                const pingsList: Ping[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to Date
                    const sentAt = data.sentAt?.toDate?.() || new Date();

                    return {
                        id: doc.id,
                        fromName: data.fromName,
                        fromUserId: data.fromUserId,
                        toRole: data.toRole as 'senior' | 'relative',
                        sentAt,
                        toUserId: data.toUserId
                    };
                });

                setPings(pingsList);

                // Set latest ping if it's for this user and recent (within last minute)
                const now = new Date();
                const recentPing = pingsList.find(p => {
                    const pingAge = now.getTime() - p.sentAt.getTime();
                    const isRecent = pingAge < 60000; // Within last minute
                    // const isForMe = p.toUserId !== currentUserId && p.fromUserId !== currentUserId;
                    const isFromOther = p.fromUserId !== currentUserId;
                    return isRecent && isFromOther;
                });

                if (recentPing && (!latestPing || recentPing.id !== latestPing.id)) {
                    setLatestPing(recentPing);
                }

                setLoading(false);
            },
            (err) => {
                console.error('Error fetching pings:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, currentUserId]);

    // Send a ping
    const sendPing = useCallback(async (fromName: string, fromUserId: string, toRole: 'senior' | 'relative') => {
        if (!circleId) return;

        const pingId = `ping_${Date.now()}`;
        const pingRef = doc(db, 'careCircles', circleId, 'pings', pingId);

        try {
            await setDoc(pingRef, {
                fromName,
                fromUserId,
                toRole,
                sentAt: serverTimestamp(),
            });
            return pingId;
        } catch (err: any) {
            console.error('Error sending ping:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Dismiss latest ping
    const dismissPing = useCallback(() => {
        setLatestPing(null);
    }, []);

    return {
        pings,
        latestPing,
        loading,
        error,
        sendPing,
        dismissPing,
    };
}

export default usePings;

```
---

## File: tryg-app\src\features\weeklyQuestion\index.js
```js
// Weekly Question Feature - Public API
export { WeeklyQuestionCard, MemoryTrigger } from './WeeklyQuestion';
export { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
export { useWeeklyQuestions } from './useWeeklyQuestions';

```
---

## File: tryg-app\src\features\weeklyQuestion\useWeeklyQuestions.ts
```ts

// Weekly Questions hook - real-time sync via Firestore
// Syncs weekly question answers across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface WeeklyAnswer {
    id: string;
    questionId?: string;
    text?: string;
    userId?: string;
    userName?: string;
    answeredAt?: any; // Firestore Timestamp
    [key: string]: any;
}

export function useWeeklyQuestions(circleId: string | null) {
    const [answers, setAnswers] = useState<WeeklyAnswer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to weekly answers from Firestore
    useEffect(() => {
        if (!circleId) {
            setAnswers([]);
            setLoading(false);
            return;
        }

        const answersRef = collection(db, 'careCircles', circleId, 'weeklyAnswers');
        const answersQuery = query(answersRef, orderBy('answeredAt', 'desc'), limit(20));

        const unsubscribe = onSnapshot(answersQuery,
            (snapshot) => {
                const answersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as WeeklyAnswer[];
                setAnswers(answersList);
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching weekly answers:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Add new answer
    const addAnswer = useCallback(async (answerData: Partial<WeeklyAnswer>) => {
        if (!circleId) return;

        const answerId = `answer_${Date.now()}`;
        const answerRef = doc(db, 'careCircles', circleId, 'weeklyAnswers', answerId);

        try {
            await setDoc(answerRef, {
                ...answerData,
                answeredAt: serverTimestamp(),
            });
            return answerId;
        } catch (err: any) {
            console.error('Error adding weekly answer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        answers,
        loading,
        error,
        addAnswer,
    };
}

export default useWeeklyQuestions;

```
---

## File: tryg-app\src\features\weeklyQuestion\WeeklyQuestion.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { WeeklyAnswer } from './useWeeklyQuestions';

// Weekly questions to rotate through
export const WEEKLY_QUESTIONS = [
    "Hvad var det bedste øjeblik denne uge?",
    "Hvad glæder du dig til i denne uge?",
    "Hvem tænker du på i dag?",
    "Hvad har fået dig til at smile i dag?",
    "Hvad er du taknemmelig for?",
    "Hvad vil du gerne fortælle din familie?",
    "Hvad har du lært denne uge?",
    "Hvad savner du?",
];

// Get week number of the year
export const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // ms in a week
    return Math.floor(diff / oneWeek);
};

interface WeeklyQuestionCardProps {
    onAnswer?: (answer: Omit<WeeklyAnswer, 'id'>) => void;
    answers?: WeeklyAnswer[];
    userName?: string;
}

// Component for displaying the weekly question
export const WeeklyQuestionCard: React.FC<WeeklyQuestionCardProps> = ({ onAnswer, answers = [], userName = 'dig' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [myAnswer, setMyAnswer] = useState('');

    // Get this week's question based on week number
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];

    const handleSubmit = () => {
        if (myAnswer.trim()) {
            onAnswer?.({
                question,
                answer: myAnswer.trim(),
                timestamp: new Date().toISOString(),
                userName
            });
            setMyAnswer('');
            setIsExpanded(false);
        }
    };

    const hasAnsweredThisWeek = answers.some(a =>
        a.question === question &&
        a.userName === userName
    );

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-indigo-200 font-medium">Ugens spørgsmål</p>
                    <p className="text-lg font-bold">{question}</p>
                </div>
            </div>

            {!isExpanded ? (
                <>
                    {/* Show existing answers */}
                    {answers.filter(a => a.question === question).length > 0 && (
                        <div className="space-y-2 mb-3">
                            {answers
                                .filter(a => a.question === question)
                                .slice(0, 3)
                                .map((answer, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl p-3">
                                        <p className="font-medium text-indigo-100">{answer.userName}:</p>
                                        <p className="text-white/90 text-sm">{answer.answer}</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {!hasAnsweredThisWeek && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full p-3 bg-white/20 rounded-xl text-white font-semibold 
                                hover:bg-white/30 transition-colors flex items-center justify-center gap-2
                                focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Svar på ugens spørgsmål"
                        >
                            <Sparkles className="w-4 h-4" />
                            Del dit svar
                        </button>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    <textarea
                        value={myAnswer}
                        onChange={(e) => setMyAnswer(e.target.value)}
                        placeholder="Skriv dit svar her..."
                        className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 
                            border-2 border-white/20 focus:border-white/50 focus:outline-none
                            resize-none h-24"
                        aria-label="Dit svar"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="flex-1 p-3 bg-white/10 rounded-xl text-white 
                                hover:bg-white/20 transition-colors"
                        >
                            Annuller
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!myAnswer.trim()}
                            className="flex-1 p-3 bg-white rounded-xl text-indigo-600 font-bold 
                                hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send dit svar"
                        >
                            Send
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface Memory {
    date: string;
    text: string;
    emoji: string;
}

interface MemoryTriggerProps {
    memories?: Memory[];
}

// Memory trigger component - "Husker du da...?"
export const MemoryTrigger: React.FC<MemoryTriggerProps> = ({ memories = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Default memories if none provided
    const defaultMemories: Memory[] = [
        { date: '3 år siden', text: 'Familietur til Skagen', emoji: '🏖️' },
        { date: '5 år siden', text: 'Emmas fødselsdag', emoji: '🎂' },
        { date: '2 år siden', text: 'Jul hos farmor', emoji: '🎄' },
    ];

    const allMemories = memories.length > 0 ? memories : defaultMemories;
    const memory = allMemories[currentIndex % allMemories.length];

    useEffect(() => {
        // Rotate memories every 10 seconds
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % allMemories.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [allMemories.length]);

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
                <span className="text-3xl">{memory.emoji}</span>
                <div className="flex-1">
                    <p className="text-amber-800 font-medium">Husker du da...?</p>
                    <p className="text-amber-600 text-sm">{memory.date}: {memory.text}</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyQuestionCard;

```
---

## File: tryg-app\src\features\weeklyQuestion\WeeklyQuestionWidget.tsx
```tsx
// Compact Weekly Question widget for hero section
// Shows notification badge when relative answers, opens modal on tap

import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Sparkles } from 'lucide-react';
import { WEEKLY_QUESTIONS, getWeekNumber } from './WeeklyQuestion';
import { WeeklyAnswer } from './useWeeklyQuestions';

interface WeeklyQuestionWidgetProps {
    answers?: WeeklyAnswer[];
    userName: string;
    hasUnread?: boolean;
    onClick: () => void;
}

// Compact widget for header
export const WeeklyQuestionWidget: React.FC<WeeklyQuestionWidgetProps> = ({ answers = [], userName, hasUnread = false, onClick }) => {
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const answersThisWeek = answers.filter(a => a.question === question);
    const unreadCount = hasUnread ? answersThisWeek.filter(a => a.userName !== userName).length : 0;

    return (
        <button
            onClick={onClick}
            className="relative bg-indigo-100 p-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center shrink-0"
            aria-label="Åbn ugens spørgsmål"
            style={{ width: '36px', height: '36px' }}
        >
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

interface WeeklyQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    answers?: WeeklyAnswer[];
    onAnswer?: (answer: Omit<WeeklyAnswer, 'id'>) => void;
    userName: string;
}

// Full modal for answering and viewing
export const WeeklyQuestionModal: React.FC<WeeklyQuestionModalProps> = ({ isOpen, onClose, answers = [], onAnswer, userName }) => {
    const [myAnswer, setMyAnswer] = useState('');
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];

    const answersThisWeek = answers.filter(a => a.question === question);
    const hasAnsweredThisWeek = answersThisWeek.some(a => a.userName === userName);
    const otherAnswers = answersThisWeek.filter(a => a.userName !== userName);

    const handleSubmit = () => {
        if (myAnswer.trim()) {
            onAnswer?.({
                question,
                answer: myAnswer.trim(),
                timestamp: new Date().toISOString(),
                userName
            });
            setMyAnswer('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fade-in pb-0 sm:pb-0">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] h-[85vh] flex flex-col animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] safe-area-bottom">
                {/* Drag Handle Indicator */}
                <div className="w-full flex justify-center pt-3 pb-1" onTouchStart={onClose}>
                    <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <MessageCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-stone-800">Ugens spørgsmål</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Question */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
                        <p className="text-indigo-200 text-sm mb-1">Denne uges spørgsmål</p>
                        <p className="text-lg font-bold">{question}</p>
                    </div>

                    {/* Answer input */}
                    {!hasAnsweredThisWeek ? (
                        <div className="space-y-3">
                            <textarea
                                value={myAnswer}
                                onChange={(e) => setMyAnswer(e.target.value)}
                                placeholder="Skriv dit svar her..."
                                className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none resize-none h-24"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!myAnswer.trim()}
                                className="w-full p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4" />
                                Del dit svar
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                            <p className="text-green-700 font-medium">✓ Du har svaret denne uge</p>
                        </div>
                    )}

                    {/* Other answers */}
                    {otherAnswers.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-stone-500 text-sm font-medium">Svar fra familien</p>
                            {otherAnswers.map((answer, i) => (
                                <div key={i} className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                                    <p className="font-medium text-stone-700">{answer.userName}</p>
                                    <p className="text-stone-600">{answer.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {otherAnswers.length === 0 && hasAnsweredThisWeek && (
                        <p className="text-stone-400 text-center text-sm">
                            Ingen andre har svaret endnu denne uge
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeeklyQuestionModal;

```
---

## File: tryg-app\src\features\wordGame\index.js
```js
// Word Game Feature - Public API
// All exports from this feature should go through this file

export { WordGame } from './WordGame';
export { Leaderboard } from './Leaderboard';
export { Spillehjoernet } from './Spillehjoernet';
export { useWordGame } from './useWordGame';

```
---

## File: tryg-app\src\features\wordGame\Leaderboard.tsx
```tsx
import React from 'react';
import { Crown, Medal, Award, Users } from 'lucide-react';
import { LeaderboardEntry } from './useWordGame';

interface LeaderboardProps {
    scores: LeaderboardEntry[];
    currentUserId: string;
}

// Leaderboard Component - Family rankings for word game
export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, currentUserId }) => {
    if (!scores || scores.length === 0) {
        return (
            <div className="bg-stone-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">Ingen har spillet endnu i dag</p>
                <p className="text-stone-300 text-xs">Vær den første!</p>
            </div>
        );
    }

    // Get medal/rank icon
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 0: return <Crown className="w-5 h-5 text-amber-500" />;
            case 1: return <Medal className="w-5 h-5 text-stone-400" />;
            case 2: return <Award className="w-5 h-5 text-amber-700" />;
            default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-stone-400">{rank + 1}</span>;
        }
    };

    // Get rank colors
    const getRankStyle = (rank: number, isMe: boolean) => {
        let base = 'flex items-center gap-3 p-3 rounded-xl transition-all';

        if (isMe) {
            return `${base} bg-indigo-50 border-2 border-indigo-200`;
        }

        switch (rank) {
            case 0: return `${base} bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200`;
            case 1: return `${base} bg-stone-50 border border-stone-200`;
            case 2: return `${base} bg-orange-50/50 border border-orange-100`;
            default: return `${base} bg-white border border-stone-100`;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-4 border-2 border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Dagens Rangliste
            </h3>

            <div className="space-y-2">
                {scores.map((entry, i) => {
                    const isMe = entry.userId === currentUserId;
                    const percentage = Math.round((entry.score / entry.total) * 100);

                    return (
                        <div key={entry.id} className={getRankStyle(i, isMe)}>
                            {/* Rank icon */}
                            <div className="shrink-0">
                                {getRankIcon(i)}
                            </div>

                            {/* Name and score */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-sm truncate ${isMe ? 'text-indigo-700' : 'text-stone-800'}`}>
                                        {entry.displayName}
                                    </span>
                                    {isMe && (
                                        <span className="text-[10px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">
                                            DIG
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Score */}
                            <div className="text-right shrink-0">
                                <span className={`text-lg font-bold ${percentage >= 80 ? 'text-green-600' :
                                    percentage >= 60 ? 'text-amber-600' : 'text-stone-600'
                                    }`}>
                                    {entry.score}/{entry.total}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;

```
---

## File: tryg-app\src\features\wordGame\Spillehjoernet.tsx
```tsx
import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { WordGame } from './WordGame';
import { Leaderboard } from './Leaderboard';
import { useWordGame } from './useWordGame';

interface SpillehjoernetProps {
    circleId: string;
    userId: string;
    displayName: string;
}

// Spillehjørnet - Gaming Corner with Word of the Day
export const Spillehjoernet: React.FC<SpillehjoernetProps> = ({ circleId, userId, displayName }) => {
    const {
        currentWord,
        currentWordIndex,
        totalWords,
        score,
        isComplete,
        loading,
        submitAnswer,
        leaderboard
    } = useWordGame(circleId, userId, displayName);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-stone-800 text-lg">Spillehjørnet</h2>
                    <p className="text-xs text-stone-500">Dagens ordleg med familien</p>
                </div>
            </div>

            {/* Word Game */}
            <WordGame
                currentWord={currentWord}
                currentWordIndex={currentWordIndex}
                totalWords={totalWords}
                score={score}
                isComplete={isComplete}
                onAnswer={submitAnswer}
                loading={loading}
            />

            {/* Leaderboard */}
            <Leaderboard
                scores={leaderboard}
                currentUserId={userId}
            />
        </div>
    );
};

export default Spillehjoernet;

```
---

## File: tryg-app\src\features\wordGame\useWordGame.ts
```ts

// Word Game Hook - manages game state and Firestore sync
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getTodaysWords, shuffleAnswers } from '../../data/wordGameData';

// Get today's date key for localStorage
const getTodayKey = () => new Date().toISOString().split('T')[0];

export interface Word {
    id: string;
    danish: string;
    english: string;
    options?: string[];
    [key: string]: any;
}

export interface LeaderboardEntry {
    id: string;
    userId: string;
    displayName: string;
    score: number;
    total: number;
    date: string;
    completedAt?: any;
    [key: string]: any;
}

export function useWordGame(circleId: string | null, userId: string | null, displayName: string | null) {
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, boolean>>({}); // { wordId: isCorrect }
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Get today's words (memoized, same for all family)
    const todaysWords = useMemo(() => getTodaysWords(), []);

    // Current word with shuffled answers
    const currentWord = useMemo(() => {
        if (currentWordIndex >= todaysWords.length) return null;
        const word = todaysWords[currentWordIndex];
        return {
            ...word,
            options: shuffleAnswers(word, currentWordIndex)
        };
    }, [todaysWords, currentWordIndex]);

    // Load saved progress from localStorage on mount
    useEffect(() => {
        if (!userId) return;

        const savedKey = `wordGame_${getTodayKey()}_${userId}`;
        const saved = localStorage.getItem(savedKey);

        if (saved) {
            try {
                const { answers: savedAnswers, score: savedScore, complete } = JSON.parse(saved);
                setAnswers(savedAnswers || {});
                setScore(savedScore || 0);
                setIsComplete(complete || false);

                // Calculate current word index from saved answers
                const answeredCount = Object.keys(savedAnswers || {}).length;
                setCurrentWordIndex(answeredCount);
            } catch (e) {
                console.error('Error loading saved game:', e);
            }
        }
        setLoading(false);
    }, [userId]);

    // Subscribe to leaderboard from Firestore
    useEffect(() => {
        if (!circleId) return;

        const todayKey = getTodayKey();
        const scoresRef = collection(db, 'careCircles', circleId, 'wordGameScores');
        const scoresQuery = query(scoresRef, orderBy('score', 'desc'));

        const unsub = onSnapshot(scoresQuery, (snapshot) => {
            const scores = snapshot.docs
                .filter(doc => doc.data().date === todayKey)
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as LeaderboardEntry[];
            setLeaderboard(scores);
        }, (err) => {
            console.error('Error fetching leaderboard:', err);
        });

        return () => unsub();
    }, [circleId]);

    // Save progress to localStorage and Firestore
    const saveProgress = useCallback(async (newAnswers: Record<string, boolean>, newScore: number, complete: boolean) => {
        if (!userId) return;

        const todayKey = getTodayKey();
        const savedKey = `wordGame_${todayKey}_${userId}`;

        // Save to localStorage
        localStorage.setItem(savedKey, JSON.stringify({
            answers: newAnswers,
            score: newScore,
            complete
        }));

        // Save to Firestore if game is complete
        if (complete && circleId) {
            const scoreRef = doc(db, 'careCircles', circleId, 'wordGameScores', `${userId}_${todayKey}`);
            await setDoc(scoreRef, {
                userId,
                displayName: displayName || 'Ukendt',
                score: newScore,
                total: todaysWords.length,
                date: todayKey,
                completedAt: serverTimestamp()
            });

            // 🎮 Social Spark: Post game completion to activity feed
            const pingRef = doc(db, 'careCircles', circleId, 'pings', `game_${userId}_${todayKey}`);
            await setDoc(pingRef, {
                type: 'game_complete',
                fromName: displayName || 'Ukendt',
                fromUserId: userId,
                score: newScore,
                total: todaysWords.length,
                sentAt: serverTimestamp()
            });
        }
    }, [circleId, userId, displayName, todaysWords.length]);

    // Submit an answer
    const submitAnswer = useCallback(async (wordId: string, isCorrect: boolean) => {
        // Already answered this word?
        if (answers[wordId] !== undefined) return;

        const newAnswers = { ...answers, [wordId]: isCorrect };
        const newScore = isCorrect ? score + 1 : score;
        const nextIndex = currentWordIndex + 1;
        const isNowComplete = nextIndex >= todaysWords.length;

        setAnswers(newAnswers);
        setScore(newScore);
        setCurrentWordIndex(nextIndex);
        setIsComplete(isNowComplete);

        await saveProgress(newAnswers, newScore, isNowComplete);

        return { isCorrect, newScore, isComplete: isNowComplete };
    }, [answers, score, currentWordIndex, todaysWords.length, saveProgress]);

    // Reset game (for testing only)
    const resetGame = useCallback(() => {
        if (!userId) return;

        const todayKey = getTodayKey();
        const savedKey = `wordGame_${todayKey}_${userId}`;
        localStorage.removeItem(savedKey);
        setAnswers({});
        setScore(0);
        setCurrentWordIndex(0);
        setIsComplete(false);
    }, [userId]);

    return {
        // Game state
        currentWord,
        currentWordIndex,
        totalWords: todaysWords.length,
        score,
        isComplete,
        loading,

        // Actions
        submitAnswer,
        resetGame,

        // Leaderboard
        leaderboard,

        // For debugging
        todaysWords
    };
}

export default useWordGame;

```
---

## File: tryg-app\src\features\wordGame\WordGame.tsx
```tsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Word } from './useWordGame';

interface WordGameProps {
    currentWord: Word | null;
    currentWordIndex: number;
    totalWords: number;
    score: number;
    isComplete: boolean;
    onAnswer: (wordId: string, isCorrect: boolean) => Promise<void>;
    loading: boolean;
}

interface FeedbackState {
    isCorrect: boolean;
    correctAnswer: string;
    word: string;
}

// Word Game Component - Daily word guessing game
export const WordGame: React.FC<WordGameProps> = ({
    currentWord,
    currentWordIndex,
    totalWords,
    score,
    isComplete,
    onAnswer,
    loading
}) => {
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // @ts-ignore - Check for import.meta.env
    const baseUrl = import.meta.env.BASE_URL;

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 border-2 border-stone-100 text-center">
                <div className="animate-pulse">
                    <div className="h-6 bg-stone-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-10 bg-stone-200 rounded w-3/4 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Game complete screen
    if (isComplete) {
        const percentage = Math.round((score / totalWords) * 100);

        return (
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-lg overflow-hidden relative">
                {/* Success Trophy Image */}
                <div className="mb-4 -mt-2">
                    <img
                        src={`${baseUrl}assets/success_trophy.png`}
                        alt="Succes Trophy"
                        className="w-full max-w-[200px] mx-auto object-contain animate-in zoom-in duration-500 drop-shadow-xl"
                    />
                </div>

                <h3 className="text-2xl font-bold mb-2 relative z-10">Dagens ord er klaret!</h3>
                <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm relative z-10">
                    <p className="text-4xl font-bold">{score}/{totalWords}</p>
                    <p className="text-amber-100">rigtige svar</p>
                </div>
                <p className="text-amber-100 text-sm relative z-10">
                    {percentage >= 80
                        ? 'Fantastisk! Du er en ordmester!'
                        : percentage >= 60
                            ? 'Godt gået! Du kender dine ord.'
                            : 'Godt forsøgt! Prøv igen i morgen.'}
                </p>
            </div>
        );
    }

    // Show feedback after answer
    if (feedback) {
        return (
            <div className={`rounded-2xl p-6 text-center shadow-lg ${feedback.isCorrect
                ? 'bg-gradient-to-br from-green-400 to-teal-500'
                : 'bg-gradient-to-br from-orange-400 to-red-400'
                } text-white`}>
                <div className="text-4xl mb-3">
                    {feedback.isCorrect ? <CheckCircle className="w-12 h-12 mx-auto" /> : <XCircle className="w-12 h-12 mx-auto" />}
                </div>
                <h3 className="text-xl font-bold mb-2">
                    {feedback.isCorrect ? 'Helt rigtigt! 🎉' : 'Ikke helt...'}
                </h3>
                <p className="text-white/80 mb-4 text-sm">
                    <span className="font-bold">{feedback.word}</span> betyder:
                    <br />
                    "{feedback.correctAnswer}"
                </p>
                <button
                    onClick={() => {
                        setFeedback(null);
                        setSelectedIndex(null);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-colors"
                >
                    Næste ord <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // Main game UI
    const handleAnswer = async (option: { text: string, isCorrect: boolean }, index: number) => {
        if (!currentWord) return;

        setSelectedIndex(index);

        // Store the current word in feedback BEFORE calling onAnswer (which advances)
        const feedbackData = {
            isCorrect: option.isCorrect,
            correctAnswer: currentWord.correctAnswer,
            word: currentWord.word  // Capture the word before it advances
        };

        await onAnswer(currentWord.id, option.isCorrect);

        // Show feedback with the captured word
        setFeedback(feedbackData);
    };

    return (
        <div className="bg-white rounded-2xl p-5 border-2 border-stone-100 shadow-sm">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
                    Ord {currentWordIndex + 1} af {totalWords}
                </span>
                <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {score} point
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-stone-100 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(currentWordIndex / totalWords) * 100}%` }}
                />
            </div>

            {/* Word */}
            <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-stone-400 uppercase tracking-wider">Hvad betyder</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{currentWord?.word}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {currentWord?.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(option, i)}
                        disabled={selectedIndex !== null}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2
                            ${selectedIndex === i
                                ? 'border-amber-400 bg-amber-50'
                                : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white'
                            }
                            ${selectedIndex !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
                        `}
                    >
                        <span className="font-medium text-stone-700 text-sm leading-snug">
                            {option.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WordGame;

```
---

## File: tryg-app\src\hooks\useAuth.ts
```ts
import { useState, useEffect, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    updateProfile,
    sendPasswordResetEmail,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore with retry logic
                // Firestore may not be ready when auth fires from cache
                const fetchProfileWithRetry = async (retries = 3, delay = 500) => {
                    for (let attempt = 1; attempt <= retries; attempt++) {
                        try {
                            const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (profileDoc.exists()) {
                                setUserProfile(profileDoc.data() as UserProfile);
                                setError(null); // Clear any previous error
                            }
                            return; // Success, exit
                        } catch (err: any) {
                            console.error(`Error fetching user profile (attempt ${attempt}/${retries}):`, err);

                            // If offline error and we have retries left, wait and retry
                            if (err.message?.includes('offline') && attempt < retries) {
                                await new Promise(resolve => setTimeout(resolve, delay));
                                delay *= 2; // Exponential backoff
                            } else if (attempt === retries) {
                                // Final attempt failed
                                setError(err.message || 'Could not load profile');
                            }
                        }
                    }
                };

                await fetchProfileWithRetry();
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Create user profile in Firestore
    const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            createdAt: serverTimestamp(),
            consentGiven: false,
            consentTimestamp: null,
        });
    };

    // Sign up with email and password
    const signUp = useCallback(async (email: string, password: string, displayName: string, role: 'senior' | 'relative') => {
        setError(null);
        try {
            const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(newUser, { displayName });

            // Create Firestore profile
            const profileData: Partial<UserProfile> = {
                email,
                displayName,
                role, // 'senior' or 'relative'
            };
            await createUserProfile(newUser.uid, profileData);

            // Set userProfile immediately so consent flow works
            setUserProfile({
                email,
                displayName,
                role,
                consentGiven: false,
                consentTimestamp: null,
                ...profileData
            } as UserProfile);

            return newUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with email and password
    const signIn = useCallback(async (email: string, password: string) => {
        setError(null);
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            return user;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with Google
    const signInWithGoogle = useCallback(async (role: 'senior' | 'relative') => {
        setError(null);
        try {
            const { user: googleUser } = await signInWithPopup(auth, googleProvider);

            // Check if user profile exists, if not create one
            const profileDoc = await getDoc(doc(db, 'users', googleUser.uid));
            if (!profileDoc.exists()) {
                await createUserProfile(googleUser.uid, {
                    email: googleUser.email!,
                    displayName: googleUser.displayName!,
                    role,
                });
            }

            return googleUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        setError(null);
        try {
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Update user role
    const updateRole = useCallback(async (role: 'senior' | 'relative') => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
            setUserProfile(prev => prev ? ({ ...prev, role }) : null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    // Record consent
    const recordConsent = useCallback(async () => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), {
                consentGiven: true,
                consentTimestamp: serverTimestamp(),
            }, { merge: true });
            setUserProfile(prev => prev ? ({ ...prev, consentGiven: true }) : null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    // Reset password
    const resetPassword = useCallback(async (email: string) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        user,
        userProfile,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateRole,
        recordConsent,
        resetPassword,
        isAuthenticated: !!user,
    };
}

export default useAuth;

```
---

## File: tryg-app\src\hooks\useCareCircle.ts
```ts
// Care Circle hook - manages the shared family space
// Handles creating circles, joining via code, and real-time membership

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CareCircle, Member, UserProfile } from '../types';

// Generate a random 6-character invite code
const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export function useCareCircle(userId: string | undefined, userProfile: UserProfile | null) {
    const [careCircle, setCareCircle] = useState<CareCircle | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    // Find user's care circle on mount
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const findCareCircle = async () => {
            try {
                // Query for user's circle memberships
                const membershipsQuery = query(
                    collection(db, 'careCircleMemberships'),
                    where('userId', '==', userId)
                );
                let membershipsSnapshot: any = await getDocs(membershipsQuery);

                if (membershipsSnapshot.empty) {
                    // FALLBACK: Fetch all and filter client-side (works around index issues)
                    const allMembershipsSnapshot = await getDocs(collection(db, 'careCircleMemberships'));
                    const matchingDocs = allMembershipsSnapshot.docs.filter(
                        (doc: any) => doc.data().userId === userId
                    );

                    if (matchingDocs.length > 0) {
                        membershipsSnapshot = {
                            empty: false,
                            docs: matchingDocs
                        };
                    }
                }

                if (!membershipsSnapshot.empty) {
                    const membership = membershipsSnapshot.docs[0].data();
                    const circleRef = doc(db, 'careCircles', membership.circleId);
                    const circleDoc = await getDoc(circleRef);

                    if (circleDoc.exists()) {
                        setCareCircle({ id: circleDoc.id, ...circleDoc.data() } as CareCircle);
                    } else {
                        console.warn('[useCareCircle] Circle doc does not exist:', membership.circleId);
                    }
                }
            } catch (err: any) {
                console.error('[useCareCircle] Error finding care circle:', err);
                // Check if it's a missing index error
                if (err.message?.includes('index')) {
                    setError('Database index mangler. Kontakt support.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        findCareCircle();
    }, [userId]);

    // Subscribe to members when we have a circle
    useEffect(() => {
        if (!careCircle?.id) return;

        const membersQuery = query(
            collection(db, 'careCircleMemberships'),
            where('circleId', '==', careCircle.id)
        );

        const unsubscribe = onSnapshot(membersQuery, (snapshot) => {
            const memberList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Member[];
            setMembers(memberList);
        });

        return () => unsubscribe();
    }, [careCircle?.id]);

    // Create a new care circle (for seniors)
    const createCareCircle = useCallback(async (seniorName: string) => {
        if (!userId) return;

        try {
            setError(null);
            const newCode = generateInviteCode();
            const circleId = `circle_${userId}_${Date.now()}`;

            // Create the circle
            await setDoc(doc(db, 'careCircles', circleId), {
                seniorId: userId,
                seniorName,
                inviteCode: newCode,
                createdAt: serverTimestamp(),
            });

            // Add senior as first member
            await setDoc(doc(db, 'careCircleMemberships', `${circleId}_${userId}`), {
                circleId,
                userId,
                displayName: seniorName,
                role: 'senior',
                joinedAt: serverTimestamp(),
            });

            // Initialize default settings
            await setDoc(doc(db, 'careCircles', circleId, 'settings', 'main'), {
                familyStatus: 'home',
                lastUpdated: serverTimestamp(),
            });

            const newCircle: CareCircle = {
                id: circleId,
                seniorId: userId,
                seniorName,
                inviteCode: newCode,
                createdAt: new Date().toISOString() // Approximate time for client immediately
            }

            setCareCircle(newCircle);
            setInviteCode(newCode);

            return circleId;
        } catch (err: any) {
            console.error('Error creating care circle:', err);
            setError(err.message);
            throw err;
        }
    }, [userId]);

    // Join an existing care circle via invite code
    const joinCareCircle = useCallback(async (code: string, displayName: string) => {
        if (!userId) return;

        try {
            setError(null);

            // Find circle by invite code
            const circlesQuery = query(
                collection(db, 'careCircles'),
                where('inviteCode', '==', code.toUpperCase())
            );
            const circlesSnapshot = await getDocs(circlesQuery);

            if (circlesSnapshot.empty) {
                throw new Error('Ugyldig invitationskode');
            }

            const circleDoc = circlesSnapshot.docs[0];
            const circleId = circleDoc.id;
            const circleData = circleDoc.data();

            // Add user as member
            await setDoc(doc(db, 'careCircleMemberships', `${circleId}_${userId}`), {
                circleId,
                userId,
                displayName,
                role: 'relative',
                joinedAt: serverTimestamp(),
            });

            setCareCircle({ id: circleId, ...circleData } as CareCircle);

            return circleId;
        } catch (err: any) {
            console.error('Error joining care circle:', err);
            setError(err.message);
            throw err;
        }
    }, [userId]);

    // Get invite code for sharing
    const getInviteCode = useCallback(async () => {
        if (!careCircle?.id) return null;

        try {
            const circleDoc = await getDoc(doc(db, 'careCircles', careCircle.id));
            if (circleDoc.exists()) {
                const code = circleDoc.data().inviteCode;
                setInviteCode(code);
                return code;
            }
        } catch (err) {
            console.error('Error getting invite code:', err);
        }
        return null;
    }, [careCircle?.id]);

    // Leave care circle
    const leaveCareCircle = useCallback(async () => {
        if (!careCircle?.id || !userId) return;

        try {
            await deleteDoc(doc(db, 'careCircleMemberships', `${careCircle.id}_${userId}`));
            setCareCircle(null);
            setMembers([]);
        } catch (err: any) {
            console.error('Error leaving care circle:', err);
            setError(err.message);
            throw err;
        }
    }, [careCircle?.id, userId]);

    return {
        careCircle,
        members,
        loading,
        error,
        inviteCode,
        createCareCircle,
        joinCareCircle,
        getInviteCode,
        leaveCareCircle,
        hasCareCircle: !!careCircle,
    };
}

export default useCareCircle;

```
---

## File: tryg-app\src\hooks\useCheckIn.ts
```ts
// Check-in hook - real-time sync via Firestore
// Tracks when senior last checked in, visible to relatives

import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useCheckIn(circleId: string | undefined) {
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to check-in status from settings
    useEffect(() => {
        if (!circleId) {
            setLastCheckIn(null);
            setLoading(false);
            return;
        }

        const checkInRef = doc(db, 'careCircles', circleId, 'settings', 'checkIn');

        const unsubscribe = onSnapshot(checkInRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    if (data.lastCheckIn) {
                        try {
                            const date = data.lastCheckIn.toDate?.() || new Date(data.lastCheckIn);
                            const timeString = date.toLocaleTimeString('da-DK', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            setLastCheckIn(timeString);
                        } catch (err) {
                            console.error('[useCheckIn] Error parsing timestamp:', err);
                            setLastCheckIn(null);
                        }
                    } else {
                        setLastCheckIn(null);
                    }
                } else {
                    // Document doesn't exist yet - this is normal for new circles
                    setLastCheckIn(null);
                }
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching check-in:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Record a check-in
    const recordCheckIn = useCallback(async () => {
        if (!circleId) return;

        const checkInRef = doc(db, 'careCircles', circleId, 'settings', 'checkIn');

        try {
            await setDoc(checkInRef, {
                lastCheckIn: serverTimestamp(),
            }, { merge: true });

            // Update local state immediately for responsive UI
            const now = new Date();
            const timeString = now.toLocaleTimeString('da-DK', {
                hour: '2-digit',
                minute: '2-digit'
            });
            setLastCheckIn(timeString);

            return timeString;
        } catch (err: any) {
            console.error('Error recording check-in:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        lastCheckIn,
        loading,
        error,
        recordCheckIn,
    };
}

export default useCheckIn;

```
---

## File: tryg-app\src\hooks\useLocalStorage.ts
```ts
// @ts-check
import { useState, useEffect } from 'react';

// Check if localStorage is available (private browsing, quota exceeded, etc.)
const isLocalStorageAvailable = (): boolean => {
    try {
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const storageAvailable = isLocalStorageAvailable();

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Get stored value or use initial
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (!storageAvailable) {
            console.warn('localStorage not available, using in-memory storage');
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    useEffect(() => {
        if (!storageAvailable) return; // Graceful degradation - just use state
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

// Named export for testing/util availability
export { isLocalStorageAvailable };

// Default export for convenience
export default useLocalStorage;

```
---

## File: tryg-app\src\hooks\useSettings.ts
```ts
// Settings hook - real-time settings sync via Firestore
// Handles family status and other circle-wide settings

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Settings {
    familyStatus: string;
    [key: string]: any;
}

export function useSettings(circleId: string | undefined) {
    const [settings, setSettings] = useState<Settings>({
        familyStatus: 'home',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to settings from Firestore
    useEffect(() => {
        if (!circleId) {
            setLoading(false);
            return;
        }

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        const unsubscribe = onSnapshot(settingsRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as Settings);
                }
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching settings:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Update family status
    const setFamilyStatus = useCallback(async (status: string) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                familyStatus: status,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err: any) {
            console.error('Error updating family status:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Update any setting
    const updateSetting = useCallback(async (key: string, value: any) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                [key]: value,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err: any) {
            console.error('Error updating setting:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        settings,
        familyStatus: settings.familyStatus,
        loading,
        error,
        setFamilyStatus,
        updateSetting,
    };
}

export default useSettings;

```
---

## File: tryg-app\src\index.css
```css
@import "tailwindcss";

/* Custom animations */
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Morning sun pulse - gentle warmth animation */
@keyframes sun-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.animate-sun-pulse {
  animation: sun-pulse 3s ease-in-out infinite;
}

/* Base styles */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
}

#root {
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
}

/* Visible focus indicators for accessibility */
*:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}
```
---

## File: tryg-app\src\main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import AppWithAuth from './AppWithAuth'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// ============================================================================
// CRASH LOOP DETECTION - Self-healing mechanism
// ============================================================================
// If the app crashes 3+ times within 5 minutes, automatically reset state
// to prevent seniors from getting stuck with a "broken" app.

const CRASH_THRESHOLD = 3;
const CRASH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const checkCrashLoop = () => {
    const crashes = parseInt(localStorage.getItem('crash_count') || '0');
    const lastCrash = parseInt(localStorage.getItem('last_crash_time') || '0');
    const now = Date.now();

    // If 3+ crashes within 5 minutes, reset app state
    if (crashes >= CRASH_THRESHOLD && (now - lastCrash) < CRASH_WINDOW_MS) {
        console.warn('🔧 Crash loop detected. Auto-resetting app state to recover...');
        Sentry.captureMessage('Crash loop detected - auto-reset triggered', 'warning');

        // Clear problematic state but preserve auth
        const keysToKeep = ['firebase:authUser']; // Keep auth-related keys
        const authData: Record<string, string> = {};
        keysToKeep.forEach(key => {
            const match = Object.keys(localStorage).find(k => k.includes(key.split(':')[1] || key));
            if (match) {
                const val = localStorage.getItem(match);
                if (val) authData[match] = val;
            }
        });

        localStorage.clear();

        // Restore auth data
        Object.entries(authData).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
        });

        localStorage.setItem('crash_count', '0');
        localStorage.setItem('app_reset_time', now.toString());

        return true; // Indicate reset happened
    }
    return false;
};

const recordCrash = () => {
    const crashes = parseInt(localStorage.getItem('crash_count') || '0');
    localStorage.setItem('crash_count', (crashes + 1).toString());
    localStorage.setItem('last_crash_time', Date.now().toString());
};

// Check for crash loop on startup
const wasReset = checkCrashLoop();
if (wasReset) {
    console.log('✅ App state has been reset. Starting fresh.');
}

// ============================================================================
// SENTRY INITIALIZATION
// ============================================================================

Sentry.init({
    dsn: "https://b2835d041b4b45c69260083398ea6814@o4510541870465024.ingest.de.sentry.io/4510541878919248",
    // Only enable in production
    enabled: import.meta.env.PROD,
    // Set sample rate for performance monitoring (optional, can enable later)
    // tracesSampleRate: 1.0,
});

// ============================================================================
// GLOBAL ERROR HANDLERS
// ============================================================================

window.onerror = (msg, src, line, col, err) => {
    console.error('Global error:', { msg, src, line, col, err });
    recordCrash(); // Track for crash loop detection
    if (err) Sentry.captureException(err);
};

window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    recordCrash(); // Track for crash loop detection
    Sentry.captureException(event.reason);
};

// ============================================================================
// APP RENDER
// ============================================================================

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <AppWithAuth />
        </ErrorBoundary>
    </StrictMode>,
)

```
---

## File: tryg-app\src\test\components.test.jsx
```jsx
// P2 Component Tests - Feature robustness
// Tests for ProgressRing, InlineGatesIndicator, SeniorStatusCard

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('ProgressRing Component', () => {
    it('can be imported without error', async () => {
        const { ProgressRing } = await import('../features/tasks')
        expect(ProgressRing).toBeDefined()
    })

    it('renders with empty tasks', async () => {
        const { ProgressRing } = await import('../features/tasks')

        const { container } = render(<ProgressRing tasks={[]} />)
        expect(container).toBeTruthy()
    })

    it('renders with tasks in different periods', async () => {
        const { ProgressRing } = await import('../features/tasks')

        const tasks = [
            { id: 1, title: 'Morning Med', period: 'morgen', completed: true },
            { id: 2, title: 'Lunch Med', period: 'eftermiddag', completed: false },
            { id: 3, title: 'Evening Med', period: 'aften', completed: false }
        ]

        const { container } = render(<ProgressRing tasks={tasks} />)
        expect(container).toBeTruthy()
    })

    it('shows correct percentage in center', async () => {
        const { ProgressRing } = await import('../features/tasks')

        const tasks = [
            { id: 1, period: 'morgen', completed: true },
            { id: 2, period: 'morgen', completed: true },
            { id: 3, period: 'morgen', completed: false },
            { id: 4, period: 'morgen', completed: false }
        ]

        render(<ProgressRing tasks={tasks} />)
        // 2 of 4 = 50%
        expect(screen.getByText('50%')).toBeTruthy()
    })
})

describe('InlineGatesIndicator Component', () => {
    it('can be imported without error', async () => {
        const { InlineGatesIndicator } = await import('../features/tasks')
        expect(InlineGatesIndicator).toBeDefined()
    })

    it('renders with empty tasks', async () => {
        const { InlineGatesIndicator } = await import('../features/tasks')

        const { container } = render(<InlineGatesIndicator tasks={[]} />)
        expect(container).toBeTruthy()
    })

    it('shows all three period labels', async () => {
        const { InlineGatesIndicator } = await import('../features/tasks')

        render(<InlineGatesIndicator tasks={[]} />)

        // Should show abbreviated period labels
        expect(screen.getByText(/Mor/)).toBeTruthy() // Morgen
        expect(screen.getByText(/Eft/)).toBeTruthy() // Eftermiddag
        expect(screen.getByText(/Aft/)).toBeTruthy() // Aften
    })
})

describe('StatusCard Component', () => {
    it('can be imported without error', async () => {
        const { StatusCard } = await import('../features/familyPresence')
        expect(StatusCard).toBeDefined()
    })

    it('renders with minimal props in senior mode', async () => {
        const { StatusCard } = await import('../features/familyPresence')

        const { container } = render(<StatusCard mode="senior" />)
        expect(container).toBeTruthy()
    })

    it('shows inline gates when tasks provided', async () => {
        const { StatusCard } = await import('../features/familyPresence')

        const tasks = [
            { id: 1, title: 'Med', period: 'morgen', completed: true }
        ]

        const { container } = render(
            <StatusCard
                mode="senior"
                name="Brad"
                tasks={tasks}
                lastCheckIn="kl. 09:00"
                completionRate={100}
            />
        )

        expect(container).toBeTruthy()
        expect(screen.getByText('Brad')).toBeTruthy()
    })

    it('shows symptom indicator when symptomCount > 0', async () => {
        const { StatusCard } = await import('../features/familyPresence')

        render(
            <StatusCard
                mode="senior"
                name="Brad"
                symptomCount={3}
            />
        )

        expect(screen.getByText(/3 symptomer/)).toBeTruthy()
    })
})

describe('useHelpExchangeMatch Hook', () => {
    it('can be imported without error', async () => {
        const { useHelpExchangeMatch } = await import('../features/helpExchange')
        expect(useHelpExchangeMatch).toBeDefined()
    })

    it('returns expected shape with no matches', async () => {
        const { useHelpExchangeMatch } = await import('../features/helpExchange')
        const { renderHook } = await import('@testing-library/react')

        const { result } = renderHook(() =>
            useHelpExchangeMatch({
                offers: [],
                requests: [],
                familyStatus: null
            })
        )

        expect(result.current).toHaveProperty('topMatch')
        expect(result.current).toHaveProperty('hasMatches')
        expect(result.current.hasMatches).toBe(false)
    })
})

```
---

## File: tryg-app\src\test\features.test.js
```js
// Tests for feature flags
import { describe, it, expect } from 'vitest'
import { FEATURES, isFeatureEnabled } from '../config/features'

describe('Feature Flags', () => {
    it('FEATURES object exists and has expected structure', () => {
        expect(FEATURES).toBeDefined()
        expect(typeof FEATURES).toBe('object')
    })

    it('all feature values are booleans', () => {
        Object.entries(FEATURES).forEach(([key, value]) => {
            expect(typeof value).toBe('boolean')
        })
    })

    it('isFeatureEnabled returns correct value for existing features', () => {
        Object.entries(FEATURES).forEach(([key, value]) => {
            expect(isFeatureEnabled(key)).toBe(value)
        })
    })

    it('isFeatureEnabled returns true for unknown features (safe default)', () => {
        expect(isFeatureEnabled('unknownFeature')).toBe(true)
    })

    it('critical features are defined', () => {
        // These features must exist - breaking if removed
        const criticalFeatures = [
            'tabbedLayout',
            'thinkingOfYou',
            'weeklyQuestion',
            'helpExchange',
            'familyStatusCard'
        ]

        criticalFeatures.forEach(feature => {
            expect(FEATURES).toHaveProperty(feature)
        })
    })
})

```
---

## File: tryg-app\src\test\hooks.test.js
```js
// P1 Hook Tests - Core functionality verification
// Tests for useMemberStatus, useHelpExchange, useTasks

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

// Mock Firebase
vi.mock('../config/firebase', () => ({
    db: {},
    auth: { currentUser: { uid: 'test-user' } },
    storage: {}
}))

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn((query, callback) => {
        // Simulate empty snapshot
        callback({ docs: [] })
        return vi.fn() // unsubscribe
    }),
    setDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    serverTimestamp: vi.fn(() => new Date()),
    Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) }
}))

describe('useMemberStatus Hook', () => {
    it('can be imported without error', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')
        expect(useMemberStatus).toBeDefined()
        expect(typeof useMemberStatus).toBe('function')
    })

    it('returns expected shape with empty data', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')

        const { result } = renderHook(() =>
            useMemberStatus('circle123', 'user123', 'TestUser', 'relative')
        )

        // Should return the expected object shape
        expect(result.current).toHaveProperty('memberStatuses')
        expect(result.current).toHaveProperty('myStatus')
        expect(result.current).toHaveProperty('setMyStatus')
        expect(result.current).toHaveProperty('relativeStatuses')
        expect(result.current).toHaveProperty('seniorStatus')
    })

    it('handles null circleId gracefully', async () => {
        const { useMemberStatus } = await import('../features/familyPresence')

        const { result } = renderHook(() =>
            useMemberStatus(null, 'user123', 'TestUser', 'relative')
        )

        expect(result.current.memberStatuses).toEqual([])
        expect(result.current.myStatus).toBe('home')
    })
})

describe('useHelpExchange Hook', () => {
    it('can be imported without error', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')
        expect(useHelpExchange).toBeDefined()
    })

    it('returns expected shape', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')

        const { result } = renderHook(() =>
            useHelpExchange('circle123', 'user123', 'relative', 'TestUser')
        )

        expect(result.current).toHaveProperty('helpOffers')
        expect(result.current).toHaveProperty('helpRequests')
        expect(result.current).toHaveProperty('addOffer')
        expect(result.current).toHaveProperty('addRequest')
        expect(result.current).toHaveProperty('removeOffer')
        expect(result.current).toHaveProperty('removeRequest')
    })

    it('handles null circleId gracefully', async () => {
        const { useHelpExchange } = await import('../features/helpExchange')

        const { result } = renderHook(() =>
            useHelpExchange(null, 'user123', 'relative', 'TestUser')
        )

        expect(result.current.helpOffers).toEqual([])
        expect(result.current.helpRequests).toEqual([])
    })
})

describe('useTasks Hook', () => {
    it('can be imported without error', async () => {
        const { useTasks } = await import('../features/tasks')
        expect(useTasks).toBeDefined()
    })

    it('returns expected shape', async () => {
        const { useTasks } = await import('../features/tasks')

        const { result } = renderHook(() => useTasks('circle123'))

        expect(result.current).toHaveProperty('tasks')
        expect(result.current).toHaveProperty('toggleTask')
        expect(result.current).toHaveProperty('addTask')
        expect(Array.isArray(result.current.tasks)).toBe(true)
    })

    it('falls back to INITIAL_TASKS when no circleId', async () => {
        const { useTasks } = await import('../features/tasks')

        const { result } = renderHook(() => useTasks(null))

        // Should have default tasks
        expect(result.current.tasks.length).toBeGreaterThan(0)
    })
})

```
---

## File: tryg-app\src\test\integration.test.jsx
```jsx
// P3 Integration Tests - End-to-end feature validation
// Tests for CoordinationTab, HelpExchange flow, MatchCelebration

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock Firebase and hooks
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

vi.mock('../features/helpExchange/useHelpExchangeMatch', () => ({
    useHelpExchangeMatch: () => ({
        topMatch: null,
        hasMatches: false,
        match: null,
        dismissMatch: vi.fn()
    })
}))

describe('CoordinationTab Integration', () => {
    it('can be imported without error', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')
        expect(CoordinationTab).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const { container } = render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                onMyStatusChange={vi.fn()}
            />
        )
        expect(container).toBeTruthy()
    })

    it('renders FamilyPresence when memberStatuses provided', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        const memberStatuses = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' }
        ]

        const { container } = render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                memberStatuses={memberStatuses}
                currentUserId="louise"
                onMyStatusChange={vi.fn()}
            />
        )

        expect(container).toBeTruthy()
        // FamilyPresence should render with header
        expect(screen.getByText(/Familien nu/i)).toBeTruthy()
    })

    it('shows status selector for user', async () => {
        const { CoordinationTab } = await import('../components/CoordinationTab')

        render(
            <CoordinationTab
                seniorName="Brad"
                userName="Louise"
                myStatus="home"
                onMyStatusChange={vi.fn()}
            />
        )

        // Should show status section header
        expect(screen.getByText(/Din status/i)).toBeTruthy()
    })
})

describe('HelpExchange Component', () => {
    it('can be imported without error', async () => {
        const { HelpExchange } = await import('../features/helpExchange')
        expect(HelpExchange).toBeDefined()
    })

    it('renders with minimal props', async () => {
        const { HelpExchange } = await import('../features/helpExchange')

        const { container } = render(
            <HelpExchange
                onOffer={vi.fn()}
                onRequest={vi.fn()}
            />
        )
        expect(container).toBeTruthy()
    })

    it('shows active offers when provided', async () => {
        const { HelpExchange } = await import('../features/helpExchange')

        const activeOffers = [
            { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂' }
        ]

        render(
            <HelpExchange
                activeOffers={activeOffers}
                onOffer={vi.fn()}
                onRequest={vi.fn()}
                onRemoveOffer={vi.fn()}
            />
        )

        // Should show the active offer
        expect(screen.getByText(/lytte/)).toBeTruthy()
    })
})

describe('MatchCelebration Component', () => {
    it('can be imported without error', async () => {
        const { MatchCelebration, MatchBanner } = await import('../features/helpExchange')
        expect(MatchCelebration).toBeDefined()
        expect(MatchBanner).toBeDefined()
    })

    it('MatchBanner renders with match data', async () => {
        const { MatchBanner } = await import('../features/helpExchange')

        const mockMatch = {
            celebration: {
                emoji: '🍽️',
                title: 'Match!',
                message: 'I kan lave mad sammen'
            }
        }

        const { container } = render(
            <MatchBanner match={mockMatch} onClick={vi.fn()} />
        )

        expect(container).toBeTruthy()
        expect(screen.getByText('Match!')).toBeTruthy()
    })

    it('MatchCelebration renders null when no match', async () => {
        const { MatchCelebration } = await import('../features/helpExchange')

        const { container } = render(
            <MatchCelebration match={null} onDismiss={vi.fn()} />
        )

        // Should render empty
        expect(container.innerHTML).toBe('')
    })
})

describe('Match Detection Logic', () => {
    it('detects cook-shop match pair', async () => {
        const { MATCH_PAIRS } = await import('../features/helpExchange')

        const cookShopMatch = MATCH_PAIRS.find(
            p => p.offerId === 'cook' && p.requestId === 'shop'
        )

        expect(cookShopMatch).toBeDefined()
        expect(cookShopMatch.celebration.emoji).toBe('🍽️')
    })

    it('detects visit-company match pair', async () => {
        const { MATCH_PAIRS } = await import('../features/helpExchange')

        const visitMatch = MATCH_PAIRS.find(
            p => p.offerId === 'visit' && p.requestId === 'company'
        )

        expect(visitMatch).toBeDefined()
        expect(visitMatch.celebration.emoji).toBe('☕')
    })

    it('has status-based matches defined', async () => {
        const { STATUS_MATCHES } = await import('../features/helpExchange')

        expect(STATUS_MATCHES).toBeDefined()
        expect(Array.isArray(STATUS_MATCHES)).toBe(true)
        expect(STATUS_MATCHES.length).toBeGreaterThan(0)
    })
})

```
---

## File: tryg-app\src\test\mocks\pwa-register.js
```js
// Mock for virtual:pwa-register/react
// This virtual module only exists during Vite build with vite-plugin-pwa
// In tests, we provide this mock instead
export const useRegisterSW = () => ({
    offlineReady: [false, () => { }],
    needRefresh: [false, () => { }],
    updateServiceWorker: () => Promise.resolve(),
});

```
---

## File: tryg-app\src\test\setup.js
```js
// Vitest setup file - runs before each test file
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock AudioContext for sounds.js (doesn't exist in test environment)
global.AudioContext = class AudioContext {
    constructor() {
        this.state = 'running';
        this.currentTime = 0;
        this.destination = {};
    }
    createOscillator() {
        return {
            connect: () => { },
            type: 'sine',
            frequency: { setValueAtTime: () => { } },
            start: () => { },
            stop: () => { },
        };
    }
    createGain() {
        return {
            connect: () => { },
            gain: {
                setValueAtTime: () => { },
                linearRampToValueAtTime: () => { },
                exponentialRampToValueAtTime: () => { },
            },
        };
    }
    resume() { return Promise.resolve(); }
};
global.webkitAudioContext = global.AudioContext;

// Mock vite-plugin-pwa virtual module (doesn't exist in test environment)
// This fixes: Error: Failed to resolve import "virtual:pwa-register/react"
vi.mock('virtual:pwa-register/react', () => ({
    useRegisterSW: () => ({
        offlineReady: [false, () => { }],
        needRefresh: [false, () => { }],
        updateServiceWorker: () => Promise.resolve(),
    }),
}));

```
---

## File: tryg-app\src\test\smoke.test.js
```js
// Smoke tests for Firebase configuration
// These tests verify the app can initialize without crashing
import { describe, it, expect } from 'vitest'

describe('Firebase Configuration', () => {
    it('firebase config module exports required objects', async () => {
        // Dynamic import to catch initialization errors
        const firebase = await import('../config/firebase')

        expect(firebase.auth).toBeDefined()
        expect(firebase.db).toBeDefined()
        expect(firebase.storage).toBeDefined()
    })

    it('FEATURES config exports expected flags', async () => {
        const { FEATURES } = await import('../config/features')

        // Firebase flag must exist
        expect(FEATURES).toHaveProperty('useFirebase')
        expect(typeof FEATURES.useFirebase).toBe('boolean')
    })
})

describe('App Entry Points', () => {
    it('AppWithAuth module can be imported', async () => {
        // This catches any top-level import errors
        const module = await import('../AppWithAuth')
        expect(module.default).toBeDefined()
    })

    it('main hooks can be imported without error', async () => {
        // Import all critical hooks - catches missing dependencies
        const [useAuth, useCareCircle, useTasks, useSettings] = await Promise.all([
            import('../hooks/useAuth'),
            import('../hooks/useCareCircle'),
            import('../features/tasks'),
            import('../hooks/useSettings'),
        ])

        expect(useAuth.useAuth).toBeDefined()
        expect(useCareCircle.useCareCircle).toBeDefined()
        expect(useTasks.useTasks).toBeDefined()
        expect(useSettings.useSettings).toBeDefined()
    })
})

```
---

## File: tryg-app\src\test\useLocalStorage.test.js
```js
// Tests for useLocalStorage hook
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('returns initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
        expect(result.current[0]).toBe('initial')
    })

    it('stores value in localStorage when updated', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

        act(() => {
            result.current[1]('new value')
        })

        expect(result.current[0]).toBe('new value')
        expect(JSON.parse(localStorage.getItem('test-key'))).toBe('new value')
    })

    it('retrieves existing value from localStorage', () => {
        localStorage.setItem('existing-key', JSON.stringify('stored value'))

        const { result } = renderHook(() => useLocalStorage('existing-key', 'initial'))

        expect(result.current[0]).toBe('stored value')
    })

    it('handles objects correctly', () => {
        const testObject = { name: 'Birthe', tasks: [1, 2, 3] }
        const { result } = renderHook(() => useLocalStorage('object-key', {}))

        act(() => {
            result.current[1](testObject)
        })

        expect(result.current[0]).toEqual(testObject)
    })

    it('handles arrays correctly', () => {
        const testArray = [{ id: 1, completed: false }, { id: 2, completed: true }]
        const { result } = renderHook(() => useLocalStorage('array-key', []))

        act(() => {
            result.current[1](testArray)
        })

        expect(result.current[0]).toEqual(testArray)
    })
})

```
---

## File: tryg-app\src\test\views.test.jsx
```jsx
// P0 Smoke Tests for View Components
// These tests ensure components render without crashing with minimal props
// Critical: Would have caught the PWA crash from undefined familyStatus

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock Firebase modules before importing components
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {},
    storage: {}
}))

// Mock all hooks that use Firebase
vi.mock('../features/helpExchange/useHelpExchangeMatch', () => ({
    useHelpExchangeMatch: () => ({ match: null, dismissMatch: vi.fn() })
}))

describe('SeniorView Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { SeniorView } = await import('../components/SeniorView')
        expect(SeniorView).toBeDefined()
        expect(typeof SeniorView).toBe('function')
    })

    it('renders without crashing with minimal props', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        // These are the minimum required props
        const minimalProps = {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
        }

        // This should NOT crash - if it does, we have an undefined variable issue
        const { container } = render(<SeniorView {...minimalProps} />)
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { SeniorView } = await import('../components/SeniorView')

        const propsWithMemberStatuses = {
            tasks: [],
            toggleTask: vi.fn(),
            updateStatus: vi.fn(),
            addSymptom: vi.fn(),
            onSendPing: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Louise', status: 'home', role: 'relative' }
            ],
            currentUserId: 'user1'
        }

        const { container } = render(<SeniorView {...propsWithMemberStatuses} />)
        expect(container).toBeTruthy()
    })
})

describe('RelativeView Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { RelativeView } = await import('../components/RelativeView')
        expect(RelativeView).toBeDefined()
        expect(typeof RelativeView).toBe('function')
    })

    it('renders without crashing with minimal props', async () => {
        const { RelativeView } = await import('../components/RelativeView')

        const minimalProps = {
            tasks: [],
            profile: {},
            symptomLogs: [],
            onAddTask: vi.fn(),
        }

        const { container } = render(<RelativeView {...minimalProps} />)
        expect(container).toBeTruthy()
    })

    it('renders with memberStatuses prop (FamilyPresence)', async () => {
        const { RelativeView } = await import('../components/RelativeView')

        const propsWithMemberStatuses = {
            tasks: [],
            profile: {},
            symptomLogs: [],
            onAddTask: vi.fn(),
            memberStatuses: [
                { docId: 'user1', displayName: 'Brad', status: 'good', role: 'senior' }
            ],
            currentUserId: 'user2'
        }

        const { container } = render(<RelativeView {...propsWithMemberStatuses} />)
        expect(container).toBeTruthy()
    })
})

describe('FamilyPresence Smoke Tests', () => {
    it('can be imported without error', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')
        expect(FamilyPresence).toBeDefined()
    })

    it('renders with empty memberStatuses', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')

        const { container } = render(
            <FamilyPresence memberStatuses={[]} currentUserId="user1" />
        )
        expect(container).toBeTruthy()
    })

    it('renders with populated memberStatuses', async () => {
        const { FamilyPresence } = await import('../features/familyPresence')

        const memberStatuses = [
            { docId: 'brad', displayName: 'Brad', status: 'good', role: 'senior' },
            { docId: 'louise', displayName: 'Louise', status: 'home', role: 'relative' }
        ]

        const { container } = render(
            <FamilyPresence memberStatuses={memberStatuses} currentUserId="louise" />
        )
        expect(container).toBeTruthy()
    })
})

```
---

## File: tryg-app\src\types.ts
```ts
/**
 * Core Type Definitions for Tryg App
 */

export interface Member {
    docId: string;
    displayName: string;
    role: 'senior' | 'relative';
    status: 'home' | 'work' | 'traveling' | 'available' | 'busy';
    updatedAt?: any; // Firestore timestamp
    id?: string; // Sometimes used interchangeably with docId
}

export interface UserProfile {
    email: string;
    displayName: string;
    role: 'senior' | 'relative';
    careCircleId?: string;
    consentGiven: boolean;
    consentTimestamp?: any;
    uid?: string;
    photoURL?: string;
}

export interface CareCircle {
    id: string;
    seniorId: string;
    seniorName: string;
    inviteCode: string;
    createdAt: any;
}

export interface CareCircleContextValue {
    careCircleId: string | null;
    seniorId: string | null;
    seniorName: string | null;
    currentUserId: string | null;
    userRole: 'senior' | 'relative' | null;
    userName: string | null;
    memberStatuses: Member[];
    relativeStatuses: Member[];
    seniorStatus?: Member;
    myStatus: string;
    setMyStatus: (status: string) => void;
}

```
---

## File: tryg-app\src\utils\briefing.ts
```ts
/**
 * Daily Briefing Generator
 * 
 * Creates natural language summaries of the senior's day.
 * Designed to reduce anxiety for relatives by providing
 * a human-readable status instead of raw data.
 */

import { Task } from '../features/tasks/useTasks';

interface BriefingParams {
    tasks?: Task[];
    symptoms?: any[]; // Keep flexible if Symptom type not strictly defined globally yet
    seniorName?: string;
    lastCheckIn?: any;
}

/**
 * Helper to check if a timestamp is from today
 */
const isToday = (date: any): boolean => {
    if (!date) return false;
    // @ts-ignore - Firestore timestamps have toDate()
    const d = date.toDate ? date.toDate() : new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Generate a natural language daily briefing
 */
export function getDailyBriefing({ tasks = [], symptoms = [], seniorName = 'Mor', lastCheckIn = null }: BriefingParams) {
    const firstName = seniorName.split(' ')[0]; // Use first name for warmth

    // Calculate task stats
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        (t as any).type === 'medication'
    );
    const allTasksComplete = tasks.length > 0 && tasks.every(t => t.completed);
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.every(t => t.completed);
    const completedMedicine = medicineTasks.filter(t => t.completed).length;

    // Today's symptoms
    const todaySymptoms = symptoms.filter(s => isToday(s.loggedAt));
    const hasSymptoms = todaySymptoms.length > 0;

    // Calculate medicine streak (simplified - just check if today's done)
    // In a real app, you'd query historical data
    // const streak = allMedicineComplete ? Math.floor(Math.random() * 7) + 1 : 0; // Placeholder - unused

    // Generate briefing based on conditions

    // Best case: Everything done, no symptoms
    if (allMedicineComplete && !hasSymptoms) {
        if (allTasksComplete) {
            return {
                message: `Alt ser fint ud. ${firstName} har haft en rolig dag.`,
                emoji: '✨',
                type: 'success' as const
            };
        }
        return {
            message: `${firstName} har taget al medicin. Alt er godt.`,
            emoji: '💚',
            type: 'success' as const
        };
    }

    // Symptoms logged but medicine taken
    if (allMedicineComplete && hasSymptoms) {
        const symptomTypes = [...new Set(todaySymptoms.map(s => s.type))];
        const symptomName = symptomTypes[0] || 'symptom';
        const time = todaySymptoms[0]?.loggedAt?.toDate?.()?.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) || '';

        return {
            message: `${firstName} har noteret ${symptomName}${time ? ` kl. ${time}` : ''}, men har taget sin medicin.`,
            emoji: '📋',
            type: 'info' as const
        };
    }

    // Medicine not complete but symptoms logged
    if (!allMedicineComplete && hasSymptoms) {
        return {
            message: `${firstName} har logget symptomer. Medicin: ${completedMedicine}/${medicineTasks.length} taget.`,
            emoji: '⚠️',
            type: 'warning' as const
        };
    }

    // Medicine not complete, no symptoms
    if (!allMedicineComplete && medicineTasks.length > 0) {
        const remaining = medicineTasks.length - completedMedicine;
        return {
            message: `${firstName} mangler ${remaining} medicin${remaining > 1 ? 'er' : ''} i dag.`,
            emoji: '💊',
            type: 'info' as const
        };
    }

    // No tasks at all - show neutral status
    if (lastCheckIn && isToday(lastCheckIn)) {
        return {
            message: `${firstName} har tjekket ind i dag. Alt ser fint ud.`,
            emoji: '👍',
            type: 'success' as const
        };
    }

    // No activity yet today
    return {
        message: `Ingen aktivitet fra ${firstName} endnu i dag.`,
        emoji: '💤',
        type: 'info' as const
    };
}

/**
 * Get streak message if applicable
 */
export function getStreakMessage(streakDays: number, seniorName = 'Mor') {
    if (streakDays >= 7) {
        return `🏆 ${streakDays}. dag i træk med alt medicin taget!`;
    }
    if (streakDays >= 3) {
        return `🎉 ${streakDays}. dag i træk!`;
    }
    return null;
}

export default getDailyBriefing;

```
---

## File: tryg-app\src\utils\imageUtils.ts
```ts
// Image utilities for photo sharing
// Resizes images before upload to optimize bandwidth and storage

/**
 * Resize an image file to a maximum dimension while maintaining aspect ratio
 * @param {File} file - The image file to resize
 * @param {number} maxSize - Maximum width or height in pixels (default 1200)
 * @param {number} quality - JPEG quality 0-1 (default 0.85)
 * @returns {Promise<Blob>} - Resized image as a Blob
 */
export async function resizeImage(file: File, maxSize = 1200, quality = 0.85): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                // Create canvas and resize
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create image blob'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            if (event.target && typeof event.target.result === 'string') {
                img.src = event.target.result;
            } else {
                reject(new Error('Failed to load image data'));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * Get a data URL preview of an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - Data URL for preview
 */
export function getImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
                resolve(e.target.result);
            } else {
                reject(new Error('Failed to get image data'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

```
---

## File: tryg-app\src\utils\sounds.ts
```ts
// Sound utilities for emotional feedback
// Using Web Audio API for gentle, cross-platform sounds

// Define AudioContext type if needed, but it should be available in lib.dom.d.ts
// We use 'any' for window properties to avoid strict checks if types are missing
const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;
const audioContext = AudioContextClass ? new AudioContextClass() : null;

// Gentle completion chime - warm and reassuring
export function playCompletionSound() {
    if (!audioContext) return;

    // Resume context if suspended (iOS requirement)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Create a warm, gentle two-note chime
    const frequencies = [523.25, 659.25]; // C5 and E5 - major third, warm and happy

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // Soft envelope
        gainNode.gain.setValueAtTime(0, now + (i * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.15, now + (i * 0.1) + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + (i * 0.1) + 0.5);
    });
}

// Gentle "thinking of you" ping - single soft tone
export function playPingSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, now); // A5 - clear but not harsh

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.35);
}

// Success celebration - slightly more elaborate
export function playSuccessSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0, now + (i * 0.12));
        gainNode.gain.linearRampToValueAtTime(0.12, now + (i * 0.12) + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.12) + 0.5);

        oscillator.start(now + (i * 0.12));
        oscillator.stop(now + (i * 0.12) + 0.6);
    });
}

// Match celebration - exciting ascending notes for help exchange match
export function playMatchSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    // Bright, cheerful ascending notes: G5, B5, D6, G6
    const frequencies = [783.99, 987.77, 1174.66, 1567.98];

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0, now + (i * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.15, now + (i * 0.1) + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + (i * 0.1) + 0.5);
    });
}

export default {
    playCompletionSound,
    playPingSound,
    playSuccessSound,
    playMatchSound
};

```
---
