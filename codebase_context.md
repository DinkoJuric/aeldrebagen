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
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.6.0",
    "framer-motion": "^12.23.26",
    "i18next": "^25.7.3",
    "i18next-browser-languagedetector": "^8.2.0",
    "lucide-react": "^0.559.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-i18next": "^16.5.0",
    "tailwind-merge": "^3.4.0"
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

## File: tryg-app\src\App.tsx
```tsx
import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { useTranslation } from 'react-i18next';
import { FEATURES } from './config/features';
import { cn } from './lib/utils';
import './index.css';
// import { UserProfile } from './types'; // Removed unused import

export default function TrygApp() {
    const { t } = useTranslation();
    const [view, setView] = useState('senior');
    const [notification, setNotification] = useState<any | null>(null);

    // Simulated notification after 5 seconds (only if enabled)
    useEffect(() => {
        if (!FEATURES.demoNotification) return;
        const timer = setTimeout(() => {
            setNotification({
                title: t('notification_water_title'),
                body: t('notification_water_body'),
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

                <div className="relative h-full overflow-y-auto">
                    {/* Role Toggles for Demo */}
                    <div className="absolute top-4 right-4 z-50 flex bg-stone-100 rounded-full p-1 shadow-md">
                        <button
                            onClick={() => setView('senior')}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                                view === 'senior' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            {t('role_senior')}
                        </button>
                        <button
                            onClick={() => setView('relative')}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                                view === 'relative' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            {t('role_relative')}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        {view === 'senior' ? <SeniorView /> : <RelativeView />}
                    </div>
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
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CareCircleProvider } from './contexts/CareCircleContext';
import { LogOut, Settings, Users } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavigation } from './components/BottomNavigation';
import { PingNotification } from './features/thinkingOfYou';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateToast } from './components/UpdateToast';
import { PhotoUploadModal, PhotoViewerModal, PhotoNotificationBadge } from './features/photos';
import { ShareModal } from './components/ShareModal';
import { useTasks } from './features/tasks';
import { useSymptoms } from './features/symptoms';
// import { useSettings } from './hooks/useSettings';
import { useWeeklyQuestions } from './features/weeklyQuestion';
import { usePings } from './features/thinkingOfYou';
import { useCheckIn } from './hooks/useCheckIn';
import { usePhotos } from './features/photos';
import { useMemberStatus } from './features/familyPresence';
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import { LivingBackground } from './components/ui/LivingBackground';
import './index.css';
import { User } from 'firebase/auth'; // Or your custom user type
import { AppTab, UserProfile, Member, Task, SymptomLog } from './types';


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
    const { t } = useTranslation();
    // View is determined by user role - no toggle allowed
    const isSenior = userProfile?.role === 'senior';
    // const [activePing, setActivePing] = useState(null); // Unused?
    const [notification, setNotification] = useState<any | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [activeTab, setActiveTab] = useState<AppTab>('daily');
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    // Firebase hooks for real-time data
    const { tasks, toggleTask, addTask } = useTasks(careCircle?.id);
    const { symptoms, addSymptom } = useSymptoms(careCircle?.id);
    // Per-member status tracking
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(careCircle?.id, user?.uid ?? null, (userProfile?.displayName ?? undefined) as string | null, userProfile?.role ?? 'relative');
    const {
        answers: weeklyAnswers,
        addAnswer: addWeeklyAnswer,
        toggleLike: onToggleLike,
        addReply: onReply
    } = useWeeklyQuestions(careCircle?.id);
    const { latestPing, sendPing, dismissPing } = usePings(careCircle?.id, user?.uid ?? null);
    const { lastCheckIn, recordCheckIn } = useCheckIn(careCircle?.id);
    const { latestPhoto, uploading, deletePhoto } = usePhotos(careCircle?.id, user?.uid ?? null);

    // Incoming pings logic
    useEffect(() => {
        if (latestPing && FEATURES.pingSound) {
            playPingSound();
        }
    }, [latestPing]);

    // Notification clear logic
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id || t.id === `task_${id}`);
        const willBeCompleted = task && !task.completed;
        await toggleTask(id);
        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async () => {
        await recordCheckIn();
        if (FEATURES.completionSounds) {
            playSuccessSound();
        }
    };

    const handleAddSymptom = async (symptomData: Partial<SymptomLog>) => {
        return await addSymptom(symptomData);
    };

    const handleAddTaskFromRelative = async (newTask: Partial<Task>) => {
        return await addTask({
            ...newTask,
            createdByRole: 'relative',
            createdByName: relativeName || userProfile?.displayName || 'Familie',
            createdByUserId: user?.uid
        });
    };

    const handleSendPing = async (toRole: 'senior' | 'relative') => {
        const fromName = isSenior ? seniorName : relativeName;
        return await sendPing(fromName, (user?.uid ?? undefined) as string, toRole);
    };

    const handleWeeklyAnswer = async (answer: string) => {
        return await addWeeklyAnswer({
            text: answer,
            userId: user?.uid,
            userName: isSenior ? seniorName : (relativeName || 'Pårørende')
        });
    };

    // Get display names
    const seniorName = careCircle?.seniorName || (userProfile?.role === 'senior' ? userProfile?.displayName : 'Senior');
    const relativeName = userProfile?.role === 'relative'
        ? userProfile?.displayName || 'Pårørende'
        : members.find(m => m.role === 'relative')?.displayName || 'Pårørende';

    return (
        <CareCircleProvider value={{
            careCircleId: careCircle?.id ?? null,
            seniorId: careCircle?.seniorId || null,
            seniorName: seniorName,
            currentUserId: user?.uid ?? null,
            userRole: userProfile?.role ?? null,
            userName: isSenior ? seniorName : relativeName,
            relativeName: relativeName,
            memberStatuses,
            members,
            relativeStatuses,
            seniorStatus: seniorStatus || null,
            myStatus: myStatus as any,
            setMyStatus: setMyStatus,
            activeTab: activeTab as AppTab,
            setActiveTab: setActiveTab,
            tasks,
            toggleTask: handleToggleTask,
            addTask: isSenior ? addTask : handleAddTaskFromRelative,
            symptoms,
            addSymptom: handleAddSymptom,
            weeklyAnswers,
            addWeeklyAnswer: handleWeeklyAnswer,
            toggleLike: (answerId: string, userId: string, isLiked: boolean) => onToggleLike(answerId, userId, isLiked),
            addReply: onReply,
            latestPing,
            sendPing: handleSendPing,
            dismissPing: dismissPing,
            lastCheckIn,
            recordCheckIn: handleCheckIn
        }}>
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

                    {/* Header - COMPACT: Care Circle / Settings / Logout - now theme-aware */}
                    <div className="absolute top-0 left-0 right-0 h-10 z-50 flex justify-between items-center backdrop-blur-sm px-3 bg-black/5 theme-dark:bg-white/5">
                        {/* Care Circle button - Top Left */}
                        <button
                            onClick={() => setShowShare(true)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label="Care Circle"
                        >
                            <Users className="w-5 h-5 theme-text" />
                        </button>

                        {/* Center: Settings gear (Unified Settings) */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                            aria-label={t('settings')}
                        >
                            <Settings className="w-5 h-5 theme-text" />
                        </button>

                        {/* Sign out - Top Right */}
                        <button
                            onClick={onSignOut}
                            className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                            aria-label={t('sign_out')}
                        >
                            <LogOut className="w-4 h-4 theme-text" />
                        </button>
                    </div>

                    {/* Care Circle & Family Share Modal */}
                    {showShare && (
                        <ShareModal
                            members={memberStatuses}
                            inviteCode={inviteCode}
                            onGetInviteCode={onGetInviteCode}
                            seniorName={seniorName}
                            currentUserId={user?.uid ?? undefined}
                            onClose={() => setShowShare(false)}
                        />
                    )}

                    {/* Unified Settings Modal */}
                    {showSettings && (
                        <SettingsModal
                            user={user}
                            careCircle={careCircle}
                            onClose={() => setShowSettings(false)}
                            onSignOut={onSignOut}
                        />
                    )}

                    <div className="h-full relative z-10">
                        {/* LivingBackground for circadian atmosphere (Living Design 🏠) */}
                        {FEATURES.livingDesign ? (
                            <LivingBackground>
                                <div className="h-full overflow-y-auto">
                                    {/* Ping Notification from Firestore */}
                                    {latestPing && (
                                        <PingNotification
                                            ping={latestPing}
                                            onDismiss={dismissPing}
                                        />
                                    )}

                                    {isSenior ? (
                                        <SeniorView />
                                    ) : (
                                        <RelativeView />
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
                            </LivingBackground>
                        ) : (
                            /* Fallback: Static gradient when Living Design is disabled */
                            <div className="h-full bg-gradient-to-b from-sky-100 via-sky-50 to-stone-100">
                                <div className="h-full overflow-y-auto">
                                    {latestPing && (
                                        <PingNotification
                                            ping={latestPing}
                                            onDismiss={dismissPing}
                                        />
                                    )}
                                    {isSenior ? (
                                        <SeniorView />
                                    ) : (
                                        <RelativeView />
                                    )}
                                    {latestPhoto && (
                                        <div className="absolute bottom-24 left-4 right-4 z-40 flex justify-center">
                                            <PhotoNotificationBadge
                                                photo={latestPhoto}
                                                onClick={() => setShowPhotoViewer(true)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Global Bottom Navigation */}
                        <BottomNavigation
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* Photo upload modal */}
                    <PhotoUploadModal isOpen={uploading} />

                    {/* Photo viewer modal */}
                    {showPhotoViewer && latestPhoto && (
                        <PhotoViewerModal
                            isOpen={showPhotoViewer}
                            onClose={() => setShowPhotoViewer(false)}
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
import { LivingBackground } from './components/ui/LivingBackground';
import { ThemeProvider } from './contexts/ThemeContext';

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
        const screen = (
            <AuthScreen
                onAuth={handleAuth}
                onResetPassword={resetPassword}
                error={authFormError || authError || undefined}
                loading={authLoading}
            />
        );
        // Wrap in Living Design if enabled
        return FEATURES.livingDesign ? (
            <ThemeProvider>
                <LivingBackground>{screen}</LivingBackground>
            </ThemeProvider>
        ) : screen;
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

## File: tryg-app\src\components\animations\index.tsx
```tsx
/**
 * Animation Components
 * 
 * Reusable framer-motion wrappers for micro-animations.
 * Provides consistent animations across the app.
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Slide out to the right when completed
 */
export const slideOutRight: Variants = {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
};

/**
 * Fade in from bottom (for modals)
 */
export const slideUpFade: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

/**
 * Simple fade
 */
export const fade: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Scale in with spring (for success states)
 */
export const popIn: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};

/**
 * Stagger children (for lists)
 */
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

// ============================================================================
// WRAPPER COMPONENTS
// ============================================================================

interface AnimatedListProps {
    children: ReactNode;
    className?: string;
}

/**
 * Animated list container - staggers child animations
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
    >
        {children}
    </motion.div>
);

interface AnimatedItemProps {
    children: ReactNode;
    className?: string;
    layoutId?: string;
}

/**
 * Animated list item - for items within AnimatedList
 */
export const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, className = '', layoutId }) => (
    <motion.div
        className={className}
        variants={staggerItem}
        layout
        layoutId={layoutId}
    >
        {children}
    </motion.div>
);

interface AnimatedTaskCardProps {
    children: ReactNode;
    taskId: string;
    isCompleted: boolean;
    onAnimationComplete?: () => void;
    className?: string;
}

/**
 * Task card with completion animation
 * Slides out to the right when completed
 */
export const AnimatedTaskCard: React.FC<AnimatedTaskCardProps> = ({
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

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

/**
 * Modal wrapper with slide-up animation
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({ isOpen, onClose, children, className = '' }) => (
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

interface AnimatedCheckmarkProps {
    show: boolean;
}

/**
 * Success checkmark animation
 */
export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({ show }) => (
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
import { Heart, User, Users, Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FEATURES } from '../config/features';

export interface AuthScreenProps {
    onAuth: (type: 'login' | 'signup' | 'google', data: any) => void;
    onResetPassword: (email: string) => Promise<void>;
    error?: string | null;
    loading?: boolean;
}

// User Card Component for Living Design 🏠
interface UserCardProps {
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
    onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ emoji, title, subtitle, color, onClick }) => (
    <button
        onClick={onClick}
        className={`
            w-full p-5 rounded-3xl mb-3 flex items-center gap-5 
            bg-white/60 backdrop-blur-sm border-2 border-white/50 
            hover:bg-white hover:border-stone-200 hover:scale-[1.02]
            active:scale-[0.98] transition-all duration-300 group shadow-sm
        `}
    >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm ${color}`}>
            {emoji}
        </div>
        <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-stone-800 group-hover:text-black transition-colors">{title}</h3>
            <p className="text-sm text-stone-500 font-medium">{subtitle}</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 text-stone-300 group-hover:bg-teal-50 group-hover:text-teal-500 transition-all">
            <ChevronRight size={18} />
        </div>
    </button>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth, onResetPassword, error, loading }) => {
    // Start with 'welcome' when Living Design is enabled
    const [mode, setMode] = useState<'welcome' | 'login' | 'signup' | 'role'>(
        FEATURES.livingDesign ? 'welcome' : 'login'
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'senior' | 'relative' | null>(null);
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    // Time-aware greeting for Living Design 🏠
    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 5) return 'Godnat';
        if (hour < 10) return 'Godmorgen';
        if (hour < 18) return 'Goddag';
        return 'Godaften';
    };

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

    // Living Design: Use transparent background (LivingBackground provides gradient)
    const containerBg = FEATURES.livingDesign
        ? 'min-h-screen flex flex-col items-center justify-center p-4'
        : 'min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center p-4';

    const cardClass = FEATURES.livingDesign
        ? 'glass-panel p-8 w-full max-w-md'
        : 'bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md';

    return (
        <div className={containerBg}>
            {/* Living Design: Velkommen hjem greeting - theme-aware text for dark mode */}
            {FEATURES.livingDesign && (
                <div className="text-center mb-6 w-full max-w-md">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1 theme-text-muted">
                        {getTimeGreeting()}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight theme-text">
                        Velkommen hjem.
                    </h1>
                </div>
            )}

            {/* Living Design: User Selector Cards 🏠 */}
            {mode === 'welcome' && FEATURES.livingDesign && (
                <div className="w-full max-w-sm">
                    <UserCard
                        emoji="👴"
                        title="Min Hverdag"
                        subtitle="Jeg bor her"
                        color="bg-teal-100 text-teal-800"
                        onClick={() => setMode('login')}
                    />
                    <UserCard
                        emoji="👩‍💼"
                        title="Familie"
                        subtitle="Jeg holder øje"
                        color="bg-indigo-100 text-indigo-800"
                        onClick={() => setMode('login')}
                    />

                    <div className="mt-10 text-center">
                        <p className="text-xs font-bold theme-text-muted uppercase tracking-widest mb-2">
                            Tryghed for hele familien
                        </p>
                        <div className="flex justify-center gap-2 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-current" />
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Auth Form (shown when not in 'welcome' mode or Living Design disabled) */}
            {mode !== 'welcome' && (
                <div className={cardClass}>

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
            )}
        </div>
    );
};

export default AuthScreen;

```
---

## File: tryg-app\src\components\BottomNavigation.tsx
```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Heart, Users, FileText, Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

/**
 * Navigation tab variants using CVA
 */
const tabVariants = cva(
    "flex flex-col items-center gap-1 transition-colors",
    {
        variants: {
            state: {
                active: "",
                inactive: "text-stone-400 hover:text-stone-600",
            },
            color: {
                teal: "text-teal-600",
                indigo: "text-indigo-600",
                purple: "text-purple-600",
                stone: "text-stone-400",
            },
        },
        defaultVariants: {
            state: "inactive",
            color: "stone",
        },
    }
);

import { AppTab } from '../types';

export interface BottomNavigationProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
    onViewReport?: () => void; // Keep for now, but will likely be removed
    onShowReport?: () => void;
}

interface NavTabProps extends VariantProps<typeof tabVariants> {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
    activeColor: 'teal' | 'indigo' | 'purple';
    fillClass?: string;
}

const NavTab: React.FC<NavTabProps> = ({ icon, label, onClick, isActive, activeColor, fillClass }) => (
    <button
        onClick={onClick}
        className={cn(
            tabVariants({
                state: isActive ? 'active' : 'inactive',
                color: isActive ? activeColor : 'stone'
            })
        )}
    >
        <div className={cn("w-6 h-6", isActive && fillClass)}>
            {icon}
        </div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

/**
 * Unified Bottom Navigation for Senior and Relative Views
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="sticky bottom-0 left-0 right-0 theme-card border-t border-stone-200 px-2 py-2 pb-5 z-40">
            <div className="flex justify-around items-center max-w-sm mx-auto">
                <NavTab
                    icon={<Heart className={cn("w-6 h-6", activeTab === 'daily' && "fill-teal-100")} />}
                    label={t('bottom_nav_daily')}
                    onClick={() => onTabChange('daily')}
                    isActive={activeTab === 'daily'}
                    activeColor="teal"
                />

                <NavTab
                    icon={<Users className={cn("w-6 h-6", activeTab === 'family' && "fill-indigo-100")} />}
                    label={t('bottom_nav_family')}
                    onClick={() => onTabChange('family')}
                    isActive={activeTab === 'family'}
                    activeColor="indigo"
                />

                <NavTab
                    icon={<FileText className={cn("w-6 h-6", activeTab === 'health' && "fill-sky-100")} />}
                    label={t('bottom_nav_report')} // User can rename this in i18n later if they want "Health"
                    onClick={() => onTabChange('health')}
                    isActive={activeTab === 'health'}
                    activeColor="indigo" // Or another color variant if added
                />

                <NavTab
                    icon={<Gamepad2 className={cn("w-6 h-6", activeTab === 'spil' && "fill-purple-100")} />}
                    label={t('bottom_nav_spil')}
                    onClick={() => onTabChange('spil')}
                    isActive={activeTab === 'spil'}
                    activeColor="purple"
                />
            </div>
        </div>
    );
};

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
    onCreateCircle: (userName: string) => Promise<string | undefined>;
    onJoinCircle: (code: string, userName: string) => Promise<string | undefined | void>;
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
            setCreatedCode(code ?? null);
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
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp,
    AlertCircle, HandHeart, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { SymptomSummary } from '../features/symptoms';
import { StatusSelector, STATUS_OPTIONS } from '../features/familyPresence';
import { MatchBanner } from '../features/helpExchange';
import { FamilyPresence } from '../features/familyPresence';
import { RELATIVE_OFFERS, RELATIVE_REQUESTS } from '../features/helpExchange';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { MemoriesGallery } from '../features/memories/MemoriesGallery';

export interface CoordinationTabProps {
    onAddTask?: () => void;
    onViewReport?: () => void;
    onMatchAction?: (match: any) => void;
    onDismissMatch?: (matchId: string) => void;
    dismissedMatchIds?: Set<string>;
}

export const CoordinationTab: React.FC<CoordinationTabProps> = ({
    onAddTask,
    onViewReport,
    onMatchAction,
    onDismissMatch,
    dismissedMatchIds = new Set()
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        userName,
        memberStatuses = [],
        currentUserId,
        careCircleId,
        myStatus = 'home',
        setMyStatus: onMyStatusChange,
        tasks = [],
        symptoms: symptomLogs = []
    } = useCareCircleContext();

    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(true);
    const [showSymptoms, setShowSymptoms] = useState(true);
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'relative', userName);

    const helpOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'senior');
    const relativeOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'relative');

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === myStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    const otherRelativeOffers = relativeOffers.filter((o: any) => o.createdByUid !== currentUserId);
    const otherRelativeRequests = relativeRequests.filter((r: any) => r.createdByUid !== currentUserId);
    const myRelativeOffers = relativeOffers.filter((o: any) => o.createdByUid === currentUserId);
    const myRelativeRequests = relativeRequests.filter((r: any) => r.createdByUid === currentUserId);

    const allOffers = [
        ...helpOffers.map((o: any) => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map((o: any) => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map((r: any) => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map((r: any) => ({ ...r, createdByRole: 'relative' }))
    ];

    const { topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: myStatus
    });

    const getMatchId = (match: any) => {
        if (!match) return null;
        const offerId = match.offer?.docId || match.offer?.id || 'none';
        const requestId = match.request?.docId || match.request?.id || 'none';
        return `${offerId}-${requestId}`;
    };

    const filteredTopMatch = topMatch && !dismissedMatchIds.has(getMatchId(topMatch)!) ? topMatch : null;
    const hasActiveMatches = filteredTopMatch !== null;

    const openTasks = tasks.filter(t => !t.completed);

    return (
        <div className="space-y-3 tab-content">
            <div className="bg-indigo-600 rounded-xl px-3 py-2 text-white shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-indigo-200 font-medium">{t('din_status')}:</span>
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
                            <span className="font-medium text-sm">{t(`status_${currentStatusInfo.id}`)}</span>
                            <span className="text-indigo-300 text-xs">▼</span>
                        </button>
                    )}
                </div>
            </div>

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

            {memberStatuses.length > 0 && (
                <FamilyPresence
                    memberStatuses={memberStatuses}
                    currentUserId={currentUserId ?? ''}
                    seniorName={seniorName}
                />
            )}

            <div className="bg-stone-50 border-2 border-stone-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-teal-600" />
                    {t('coordination_title')}
                </h3>

                {(otherRelativeOffers.length > 0 || otherRelativeRequests.length > 0) && (
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">{t('others_offers')}</p>
                        <div className="flex flex-wrap gap-2">
                            {otherRelativeOffers.map((offer: any, i: number) => (
                                <span key={`oro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
                                    💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                                </span>
                            ))}
                            {otherRelativeRequests.map((req: any, i: number) => (
                                <span key={`orr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                                    💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {(helpOffers.length > 0 || helpRequests.length > 0) && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-stone-500 uppercase">{t('from_senior_name', { name: seniorName })}</p>
                        <div className="flex flex-wrap gap-2">
                            {helpOffers.map((offer: any, i: number) => (
                                <span key={`so-${i}`} className="text-sm bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full">
                                    💚 {offer.label}
                                </span>
                            ))}
                            {helpRequests.map((req: any, i: number) => (
                                <span key={`sr-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
                                    💜 {req.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">{t('you_offer')}</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeOffers.map((offer: any, i: number) => (
                            <span key={`ro-${i}`} className="text-sm bg-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                                {offer.emoji || '✨'} {offer.label}
                                <button onClick={() => removeOffer?.(offer.docId)} className="ml-1 hover:bg-teal-600 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button onClick={() => setShowOfferPicker(!showOfferPicker)} className="text-sm bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full border-2 border-dashed border-teal-200 hover:bg-teal-100 transition-colors">
                            + {t('add_offer')}
                        </button>
                    </div>

                    {showOfferPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Vælg hvad du kan tilbyde:</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_OFFERS.filter(o => !relativeOffers.some((ro: any) => ro.id === o.id)).map(offer => (
                                    <button
                                        key={offer.id}
                                        onClick={() => {
                                            addOffer?.(offer);
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

                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">{t('you_request')}</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeRequests.map((req: any, i: number) => (
                            <span key={`rr-${i}`} className="text-sm bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                                {req.emoji || '💜'} {req.label}
                                <button onClick={() => removeRequest?.(req.docId)} className="ml-1 hover:bg-indigo-600 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button onClick={() => setShowRequestPicker(!showRequestPicker)} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors">
                            + {t('add_request')}
                        </button>
                    </div>

                    {showRequestPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Hvad kunne du bruge hjælp til?</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_REQUESTS.filter(r => !relativeRequests.some((rr: any) => rr.id === r.id)).map(request => (
                                    <button
                                        key={request.id}
                                        onClick={() => {
                                            addRequest?.(request);
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

            {/* Family Heirloom - Livsbog */}
            {careCircleId && (
                <MemoriesGallery circleId={careCircleId} />
            )}

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
                                {t('symptoms_today')} ({todaySymptoms.length})
                            </span>
                            {showSymptoms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showSymptoms && (
                            <SymptomSummary symptomLogs={symptomLogs} onViewReport={onViewReport} hideTitle={true} />
                        )}
                    </div>
                );
            })()}

            {openTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowOpenTasks(!showOpenTasks)}
                        className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                    >
                        <span>{t('open_tasks_count', { count: openTasks.length })}</span>
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

            <Button variant="outline" className="w-full h-auto py-4 bg-white" onClick={onAddTask}>
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>{t('add_reminder_name', { name: seniorName })}</span>
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
        Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
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

import { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';

/**
 * Detects if user is on iOS Safari (not in standalone/PWA mode)
 */
const useIOSInstallPrompt = () => {
    const [shouldShow, setShouldShow] = useState(false);
    const [_dismissed, setDismissed] = useState(false);

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

## File: tryg-app\src\components\LanguageSwitcher.tsx
```tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const { userProfile, updateLanguagePreference } = useAuth();

    const languages = [
        { code: 'da', label: '🇩🇰 Dansk' },
        { code: 'tr', label: '🇹🇷 Türkçe' },
        { code: 'bs', label: '🇧🇦 Bosanski' }
    ];

    // Sync i18n state with user profile on load
    useEffect(() => {
        if (userProfile?.languagePreference && i18n.language !== userProfile.languagePreference) {
            i18n.changeLanguage(userProfile.languagePreference);
        }
    }, [userProfile?.languagePreference, i18n]);

    const handleLanguageChange = async (code: string) => {
        await i18n.changeLanguage(code);
        if (updateLanguagePreference) {
            await updateLanguagePreference(code);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`
                            flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200
                            ${i18n.language === lang.code
                                ? 'bg-white shadow-md text-teal-700 border border-teal-100 scale-[1.02]'
                                : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'}
                        `}
                    >
                        <span
                            className="text-2xl block mb-1"
                            style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
                        >
                            {lang.label.split(' ')[0]}
                        </span>
                        <span className="block text-[10px] sm:text-xs tracking-tight">{lang.label.split(' ')[1]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

```
---

## File: tryg-app\src\components\layouts\RelativeViewLayout.tsx
```tsx
/**
 * RelativeViewLayout - Dumb layout shell for the Relative dashboard
 * 
 * This is a pure layout component with no business logic.
 * Uses "slot" pattern for composability.
 */

import React, { ReactNode } from 'react';

interface RelativeViewLayoutProps {
    header?: ReactNode;
    content: ReactNode;
    footer?: ReactNode;
    modals?: ReactNode;
    backgroundClass?: string;
}

export const RelativeViewLayout: React.FC<RelativeViewLayoutProps> = ({
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

## File: tryg-app\src\components\PrivacySettings.tsx
```tsx
// Privacy Settings Screen - GDPR data export, deletion, and pause controls
// Accessible from app settings

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { CareCircle } from '../types';
import { Task, SymptomLog } from '../types';

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
    const { t } = useTranslation();
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
            alert(t('privacy_export_error'));
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
                setDeleteError(t('privacy_error_relogin'));
            } else {
                setDeleteError(t('privacy_error_generic'));
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
                        <h2 className="text-xl font-bold text-stone-800">{t('privacy_title')}</h2>
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
                                    <h3 className="font-bold text-stone-800">{t('privacy_pause_sharing')}</h3>
                                    <p className="text-sm text-stone-500">
                                        {isPaused ? t('privacy_pause_on') : t('privacy_pause_off')}
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
                                <h3 className="font-bold text-stone-800">{t('privacy_download_data')}</h3>
                                <p className="text-sm text-stone-500">{t('privacy_download_desc')}</p>
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
                                    <h3 className="font-bold text-red-800">{t('privacy_delete_account')}</h3>
                                    <p className="text-sm text-red-600">{t('privacy_delete_desc')}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                    ) : (
                        <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="font-bold text-red-800">{t('privacy_confirm_title')}</h3>
                            </div>
                            <p className="text-sm text-red-700 mb-4">
                                {t('privacy_confirm_desc')}
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
                                    {t('privacy_cancel')}
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {t('privacy_deleting')}
                                        </>
                                    ) : (
                                        t('privacy_confirm_delete')
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info section */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-stone-400">
                            {t('privacy_info_storage')}
                        </p>
                        <a
                            href="/privacy-policy.html"
                            className="text-xs text-teal-600 hover:underline"
                        >
                            {t('privacy_policy_link')}
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

## File: tryg-app\src\components\relative\modals\RelativeModals.tsx
```tsx
import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { WeeklyQuestionModal } from '../../../features/weeklyQuestion';
import { MatchCelebration } from '../../../features/helpExchange';
import { TimePickerModal } from '../../../features/tasks';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../../contexts/CareCircleContext';

interface RelativeModalsProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showWeeklyModal: boolean;
    setShowWeeklyModal: (show: boolean) => void;
    activeMatch: any | null;
    setActiveMatch: (match: any | null) => void;
    showTimePicker: boolean;
    setShowTimePicker: (show: boolean) => void;
    onDismissMatch: (matchId: string) => void;
}

export const RelativeModals: React.FC<RelativeModalsProps> = ({
    showAddModal,
    setShowAddModal,
    showWeeklyModal,
    setShowWeeklyModal,
    activeMatch,
    setActiveMatch,
    showTimePicker,
    setShowTimePicker,
    onDismissMatch
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        userName,
        addTask,
        weeklyAnswers,
        addWeeklyAnswer,
        toggleLike,
        addReply,
        currentUserId
    } = useCareCircleContext();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);
    const [pendingAction, setPendingAction] = useState<any | null>(null);

    const PERIOD_TIMES: Record<string, string> = {
        morgen: '08:00',
        frokost: '12:00',
        eftermiddag: '14:00',
        aften: '19:00'
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        addTask({
            title: newTaskTitle.trim(),
            time: PERIOD_TIMES[newTaskPeriod],
            type: 'appointment',
            description: `Tilføjet af ${userName}`,
            period: newTaskPeriod,
            recurring: newTaskRecurring
        });
        setNewTaskTitle('');
        setNewTaskPeriod('morgen');
        setNewTaskRecurring(false);
        setShowAddModal(false);
    };

    return (
        <>
            {/* Add Task Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('new_reminder')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('title_label')}</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-sans"
                            placeholder={t('reminder_placeholder')}
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'morgen', label: t('morning'), time: '08-11', emoji: '🌅' },
                                { id: 'frokost', label: t('lunch'), time: '12-13', emoji: '☀️' },
                                { id: 'eftermiddag', label: t('afternoon'), time: '14-17', emoji: '☕' },
                                { id: 'aften', label: t('evening'), time: '18-21', emoji: '🌙' }
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

                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
                        <input
                            type="checkbox"
                            id="recurring-relative"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="recurring-relative" className="flex-1 font-medium text-indigo-700 cursor-pointer">
                            {t('recurring')}
                        </label>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        {t('reminder_notice', { name: seniorName })}
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>{t('add_button')}</Button>
                </div>
            </Modal>

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answer) => addWeeklyAnswer(answer.text || '')}
                userName={userName}
                onToggleLike={toggleLike}
                onReply={addReply}
                currentUserId={currentUserId || undefined}
            />

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={seniorName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = t('match_task_call_relative', { name: seniorName });
                                break;
                            case 'plan-visit':
                                taskTitle = t('match_task_visit_relative', { name: seniorName });
                                break;
                            case 'plan-meal':
                                taskTitle = t('match_task_meal', { name: seniorName });
                                break;
                            case 'plan-transport':
                                taskTitle = t('match_task_transport_relative', { name: seniorName });
                                break;
                            case 'plan-garden':
                                taskTitle = t('match_task_garden', { name: seniorName });
                                break;
                            default:
                                taskTitle = celebration?.title || t('match_task_default', { name: seniorName });
                        }

                        setPendingAction({
                            title: taskTitle,
                            action: action,
                            celebration: celebration,
                            matchToDissmiss: activeMatch
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
                title={t('when_question')}
                actionLabel={pendingAction?.title || t('create_task_label')}
                seniorName={seniorName}
                onConfirm={({ time, period }) => {
                    if (addTask && pendingAction) {
                        addTask({
                            title: pendingAction.title,
                            time: time,
                            period: period || 'morgen',
                            type: 'appointment',
                            description: `Tilføjet af ${userName}`,
                            createdByRole: 'relative'
                        });

                        if (pendingAction.matchToDissmiss) {
                            const match = pendingAction.matchToDissmiss;
                            const offerId = match.offer?.docId || match.offer?.id || 'none';
                            const requestId = match.request?.docId || match.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            onDismissMatch(matchId);
                        }
                    }
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
            />
        </>
    );
};

```
---

## File: tryg-app\src\components\RelativeView.tsx
```tsx
import React, { useState } from 'react';
import { WeeklyQuestionWidget } from '../features/weeklyQuestion';
import { ThinkingOfYouIconButton } from '../features/thinkingOfYou';
import { AmbientTab } from './shared/AmbientTab';
import { CoordinationTab } from './CoordinationTab';
import { HealthTab } from './shared/HealthTab';
import { SpilTab } from './shared/SpilTab';
import { RelativeModals } from './relative/modals/RelativeModals';
import { FEATURES } from '../config/features';
import { Avatar } from './ui/Avatar';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../contexts/CareCircleContext';

export const RelativeView: React.FC = () => {
    const { t } = useTranslation();
    const {
        userName,
        weeklyAnswers,
        sendPing,
        activeTab,
        setActiveTab
    } = useCareCircleContext();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [activeMatch, setActiveMatch] = useState<any | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dismissedMatchIds, setDismissedMatchIds] = useState<Set<string>>(new Set());

    return (
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 theme-header shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar
                            id={(userName.includes('Fatima') || userName === 'Test User') ? 'fatima' : userName === 'Brad' ? 'brad' : 'louise'}
                            size="md"
                            className="bg-indigo-50"
                        />
                        <span className="font-semibold theme-text text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                            {t('greeting_relative', { name: userName })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {FEATURES.weeklyQuestion && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        <ThinkingOfYouIconButton onSendPing={() => sendPing('senior')} />
                    </div>
                </div>
            </header>

            {/* Main Content - Tab based */}
            <main className="flex-1 p-4 overflow-y-auto pb-28">
                {activeTab === 'daily' && <AmbientTab role="relative" />}

                {activeTab === 'family' && (
                    <CoordinationTab
                        onAddTask={() => setShowAddModal(true)}
                        onViewReport={() => setActiveTab('health')}
                        onMatchAction={(match) => setActiveMatch(match)}
                        onDismissMatch={(matchId) => {
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }}
                        dismissedMatchIds={dismissedMatchIds}
                    />
                )}

                {activeTab === 'health' && <HealthTab />}

                {activeTab === 'spil' && <SpilTab />}
            </main>

            {/* Centralized Relative Modals */}
            <RelativeModals
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                showWeeklyModal={showWeeklyModal}
                setShowWeeklyModal={setShowWeeklyModal}
                activeMatch={activeMatch}
                setActiveMatch={setActiveMatch}
                showTimePicker={showTimePicker}
                setShowTimePicker={setShowTimePicker}
                onDismissMatch={(matchId) => {
                    setDismissedMatchIds(prev => new Set([...prev, matchId]));
                }}
            />
        </div>
    );
};

export default RelativeView;

```
---

## File: tryg-app\src\components\senior\FamilyTab.tsx
```tsx
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { CoffeeToggle } from '../../features/coffee';
import { ThinkingOfYouButton } from '../../features/thinkingOfYou';
import { FamilyPresence, StatusList } from '../../features/familyPresence';
import { MemoryTrigger } from '../../features/weeklyQuestion';
import { HelpExchange } from '../../features/helpExchange';
import { FEATURES } from '../../config/features';
import { useHelpExchange } from '../../features/helpExchange';

export const FamilyTab: React.FC = () => {

    const {
        userName,
        careCircleId,
        currentUserId,
        memberStatuses,
        members,
        relativeStatuses,

        sendPing
    } = useCareCircleContext();

    // Fetch HelpExchange data directly in the tab
    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);

    // Filter offers/requests by role
    const helpOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'senior');
    const relativeOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'relative');

    return (
        <div className="tab-content animate-fade-in space-y-4">
            {/* Spontan Kaffe Signal */}
            <CoffeeToggle />

            {/* Thinking of You */}
            {FEATURES.thinkingOfYou && (
                <ThinkingOfYouButton
                    onSendPing={() => sendPing('relative')}
                    fromName={userName}
                />
            )}

            {/* Family Presence */}
            {memberStatuses.length > 0 && (
                <FamilyPresence
                    memberStatuses={memberStatuses as any}
                    currentUserId={currentUserId || ''}
                    seniorName={userName}
                />
            )}

            {/* Legacy Family Status List */}
            {FEATURES.familyStatusCard && memberStatuses.length === 0 && (
                <StatusList
                    members={members}
                    relativeStatuses={relativeStatuses}
                    lastUpdated={null} // statusLastUpdated was passed before, but it was just 'null' in AppCore call mostly
                />
            )}

            {/* Memory Trigger */}
            {FEATURES.memoryTriggers && <MemoryTrigger />}

            {/* Help Exchange */}
            {FEATURES.helpExchange && (
                <HelpExchange
                    onOffer={addOffer}
                    onRequest={addRequest}
                    onRemoveOffer={removeOffer}
                    onRemoveRequest={removeRequest}
                    activeOffers={helpOffers}
                    activeRequests={helpRequests}
                    relativeOffers={relativeOffers}
                    relativeRequests={relativeRequests}
                    seniorName={userName}
                />
            )}
        </div>
    );
};

```
---

## File: tryg-app\src\components\senior\modals\SeniorModals.tsx
```tsx
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { BodyPainSelector } from '../../../features/symptoms';
import { SYMPTOMS_LIST } from '../../../data/constants';
import { WeeklyQuestionModal } from '../../../features/weeklyQuestion';
import { MatchCelebration } from '../../../features/helpExchange';
import { useCareCircleContext } from '../../../contexts/CareCircleContext';

interface SeniorModalsProps {
    showCallModal: boolean;
    setShowCallModal: (show: boolean) => void;
    showSymptomModal: boolean;
    setShowSymptomModal: (show: boolean) => void;
    showWeeklyModal: boolean;
    setShowWeeklyModal: (show: boolean) => void;
    showAddTaskModal: boolean;
    setShowAddTaskModal: (show: boolean) => void;
    activeMatch: any | null;
    setActiveMatch: (match: any | null) => void;
}

export const SeniorModals: React.FC<SeniorModalsProps> = ({
    showCallModal,
    setShowCallModal,
    showSymptomModal,
    setShowSymptomModal,
    showWeeklyModal,
    setShowWeeklyModal,
    showAddTaskModal,
    setShowAddTaskModal,
    activeMatch,
    setActiveMatch
}) => {
    const { t } = useTranslation();
    const {
        userName,
        relativeName,
        currentUserId,
        addSymptom,
        addTask,
        weeklyAnswers,
        addWeeklyAnswer,
        toggleLike,
        addReply
    } = useCareCircleContext();

    // Symptom flow state
    const [selectedSymptom, setSelectedSymptom] = useState<any | null>(null);
    const [showBodySelector, setShowBodySelector] = useState(false);

    // Add Task state
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);

    const handleAddSymptom = (symptom: any) => {
        addSymptom(symptom);
        setShowSymptomModal(false);
        setSelectedSymptom(null);
        setShowBodySelector(false);
    };

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle.trim(),
                period: newTaskPeriod,
                type: 'activity',
                recurring: newTaskRecurring
            });
            setNewTaskTitle('');
            setNewTaskPeriod('morgen');
            setNewTaskRecurring(false);
            setShowAddTaskModal(false);
        }
    };

    return (
        <>
            {/* Call Modal */}
            {showCallModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-10 h-10 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-bold theme-text mb-2">{t('calling')}</h3>
                        <p className="theme-text-muted mb-8">{t('calling_to', { name: relativeName })}</p>
                        <Button variant="danger" onClick={() => setShowCallModal(false)}>{t('end_call')}</Button>
                    </div>
                </div>
            )}

            {/* Symptom Modal */}
            <Modal
                isOpen={showSymptomModal}
                onClose={() => {
                    setShowSymptomModal(false);
                    setSelectedSymptom(null);
                    setShowBodySelector(false);
                }}
                title={showBodySelector ? t('where_does_it_hurt') : t('how_do_you_feel')}
            >
                {showBodySelector ? (
                    <BodyPainSelector
                        onSelectLocation={(bodyLocation) => {
                            handleAddSymptom({
                                ...selectedSymptom,
                                bodyLocation
                            });
                        }}
                        onBack={() => {
                            setShowBodySelector(false);
                            setSelectedSymptom(null);
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {SYMPTOMS_LIST.map(sym => (
                            <button
                                key={sym.id}
                                onClick={() => {
                                    if (sym.id === 'pain') {
                                        setSelectedSymptom(sym);
                                        setShowBodySelector(true);
                                    } else {
                                        handleAddSymptom(sym);
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

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answerObj: any) => addWeeklyAnswer(answerObj.answer)}
                userName={userName}
                currentUserId={currentUserId || undefined}
                onToggleLike={toggleLike}
                onReply={addReply}
            />

            {/* Add Task Modal */}
            <Modal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} title={t('add_own_task')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('what_needs_done')}</label>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder={t('example_call_doctor')}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: 'morgen', labelKey: 'time_period_morning', icon: '☀️' },
                                { key: 'frokost', labelKey: 'time_period_lunch', icon: '🍽️' },
                                { key: 'eftermiddag', labelKey: 'time_period_afternoon', icon: '🌤️' },
                                { key: 'aften', labelKey: 'time_period_evening', icon: '🌙' }
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
                                        <span className={`font-medium ${newTaskPeriod === period.key ? 'text-teal-700' : 'text-slate-700'}`}>
                                            {t(period.labelKey)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                        <input
                            type="checkbox"
                            toggle-id="recurring"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label className="flex-1 font-medium text-slate-700 cursor-pointer" onClick={() => setNewTaskRecurring(!newTaskRecurring)}>
                            {t('make_daily')}
                        </label>
                    </div>

                    <Button
                        onClick={handleAddTask}
                        className="w-full"
                        disabled={!newTaskTitle.trim()}
                    >
                        {t('add_task_button')}
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
                        // Action handling logic moved from SeniorView
                        let taskTitle = '';
                        switch (action) {
                            case 'call': taskTitle = t('match_task_call', { name: relativeName }); break;
                            case 'plan-visit': taskTitle = t('match_task_visit', { name: relativeName }); break;
                            case 'plan-meal': taskTitle = t('match_task_meal', { name: relativeName }); break;
                            default: taskTitle = activeMatch.celebration?.title || t('match_task_default', { name: relativeName });
                        }
                        addTask({
                            title: taskTitle,
                            period: 'eftermiddag',
                            type: 'appointment'
                        });
                        setActiveMatch(null);
                    }}
                />
            )}
        </>
    );
};

```
---

## File: tryg-app\src\components\SeniorView.tsx
```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from './ui/Avatar';
import { WeeklyQuestionWidget } from '../features/weeklyQuestion';
import { MatchBanner } from '../features/helpExchange';
import { InlineGatesIndicator } from '../features/tasks';
import { playMatchSound } from '../utils/sounds';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { FEATURES } from '../config/features';
import { useCareCircleContext } from '../contexts/CareCircleContext';

import { AmbientTab } from './shared/AmbientTab';
import { FamilyTab } from './senior/FamilyTab';
import { SpilTab } from './shared/SpilTab';
import { HealthTab } from './shared/HealthTab';
import { SeniorModals } from './senior/modals/SeniorModals';

export const SeniorView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const {
        tasks,
        userName,
        activeTab,
        weeklyAnswers,
        careCircleId,
        currentUserId,
        memberStatuses
    } = useCareCircleContext();

    // Modal Visibility State
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [activeMatch, setActiveMatch] = useState<any | null>(null);
    const [dismissedMatchIds, setDismissedMatchIds] = useState(new Set());

    // Help Exchange & Match Logic (Kept here for Banner orchestration)
    const { helpOffers: allOffers, helpRequests: allRequests } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);
    const { hasMatches, topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: null,
        memberStatuses
    });

    // Greeting & Date logic
    const hour = new Date().getHours();
    const [greeting] = useState(() => {
        const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        const randomId = Math.floor(Math.random() * 3);
        const key = randomId === 0 ? `greeting_${period}` : `greeting_${period}_${randomId}`;
        return t(key);
    });

    const localeId = i18n.language === 'da' ? 'da-DK' : i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'bs' ? 'bs-BA' : 'da-DK';
    const dateString = new Date().toLocaleDateString(localeId, { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header */}
            <header className="px-4 py-2 theme-header shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar id="senior" size="md" />
                        <div onClick={() => setShowCallModal(true)} className="cursor-pointer">
                            <h1 className="text-xl font-bold theme-text leading-tight">{greeting}</h1>
                            <p className="text-sm theme-text-muted">{userName}</p>
                        </div>
                    </div>
                    {FEATURES.weeklyQuestion && activeTab === 'family' && (
                        <WeeklyQuestionWidget
                            answers={weeklyAnswers}
                            userName={userName}
                            hasUnread={true}
                            onClick={() => setShowWeeklyModal(true)}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="theme-text-muted capitalize">{dateString}</span>
                    <InlineGatesIndicator tasks={tasks} className="ml-2 scale-90 origin-left" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {hasMatches && topMatch && !dismissedMatchIds.has(`${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`) && (
                    <MatchBanner
                        match={topMatch}
                        onClick={() => {
                            playMatchSound();
                            setActiveMatch(topMatch);
                        }}
                        onDismiss={() => {
                            const mId = `${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`;
                            setDismissedMatchIds(prev => new Set([...prev, mId]));
                        }}
                    />
                )}

                {activeTab === 'daily' && <AmbientTab role="senior" onOpenSymptomModal={() => setShowSymptomModal(true)} onOpenAddTaskModal={() => setShowAddTaskModal(true)} />}
                {activeTab === 'family' && <FamilyTab />}
                {activeTab === 'health' && <HealthTab />}
                {activeTab === 'spil' && <SpilTab />}
            </main>

            <SeniorModals
                showCallModal={showCallModal}
                setShowCallModal={setShowCallModal}
                showSymptomModal={showSymptomModal}
                setShowSymptomModal={setShowSymptomModal}
                showWeeklyModal={showWeeklyModal}
                setShowWeeklyModal={setShowWeeklyModal}
                showAddTaskModal={showAddTaskModal}
                setShowAddTaskModal={setShowAddTaskModal}
                activeMatch={activeMatch}
                setActiveMatch={setActiveMatch}
            />
        </div>
    );
};

export default SeniorView;

```
---

## File: tryg-app\src\components\SettingsModal.tsx
```tsx
import React, { useState } from 'react';
import { X, Lock, Shield, Trash2, Download, Globe, LogOut, Sun, Moon, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface SettingsModalProps {
    user: any;
    careCircle: any;
    onClose: () => void;
    onSignOut: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    user,
    careCircle,
    onClose,
    onSignOut
}) => {
    const { t } = useTranslation();
    const { mode, setMode } = useTheme();
    const [activeTab, setActiveTab] = useState<'general' | 'privacy'>('general');


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="theme-card w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl theme-aware-border">
                {/* Header */}
                <div className="px-6 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{t('settings')}</h2>
                        <p className="text-xs text-stone-500 font-medium">{user?.email}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-stone-100">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'general'
                            ? 'border-teal-500 text-teal-700'
                            : 'border-transparent text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        {t('general')}
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'privacy'
                            ? 'border-teal-500 text-teal-700'
                            : 'border-transparent text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        {t('privacy_data')}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === 'general' ? (
                        <>
                            {/* Theme Selection */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-stone-600 mb-1">
                                    <Zap className="w-4 h-4" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">{t('theme')}</h3>
                                </div>
                                <div className="flex bg-stone-100 p-1 rounded-2xl">
                                    {[
                                        { id: 'auto', label: t('theme_auto'), icon: Sun },
                                        { id: 'light', label: t('theme_light'), icon: Sun },
                                        { id: 'dark', label: t('theme_dark'), icon: Moon }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMode(m.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all ${mode === m.id
                                                ? 'bg-white text-teal-700 shadow-sm'
                                                : 'text-stone-500 hover:text-stone-700'
                                                }`}
                                        >
                                            <m.icon className={`w-3.5 h-3.5 ${mode === m.id ? 'text-teal-500' : 'text-stone-400'}`} />
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Language Selection */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-stone-600 mb-1">
                                    <Globe className="w-4 h-4" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">{t('language_selection')}</h3>
                                </div>
                                <LanguageSwitcher />
                            </section>

                            {/* Sign Out */}
                            <section className="pt-4">
                                <button
                                    onClick={onSignOut}
                                    className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t('sign_out')}
                                </button>
                            </section>
                        </>
                    ) : (
                        // Simplified Privacy view (reusing logic from PrivacySettings)
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                <Shield className="w-6 h-6 text-orange-500" />
                                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                    {t('privacy_notice', 'Dine data gemmes sikkert og deles kun med din lukkede familie-cirkel.')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t('data_management', 'Data Management')}</h4>
                                <button className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-colors text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-5 h-5 text-stone-500" />
                                        <span>{t('export_my_data', 'Eksporter mine data')}</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors text-sm font-medium text-stone-600">
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="w-5 h-5" />
                                        <span>{t('delete_my_account', 'Slet min konto')}</span>
                                    </div>
                                </button>
                            </div>

                            <div className="p-4 bg-stone-50 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-stone-500">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('security', 'Sikkerhed')}</span>
                                </div>
                                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">Care Circle ID</p>
                                <p className="text-xs font-mono text-stone-500 truncate">{careCircle?.id}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer safe area */}
                <div className="h-8 sm:h-0" />
            </div>
        </div>
    );
};

export default SettingsModal;

```
---

## File: tryg-app\src\components\shared\AmbientTab.tsx
```tsx
import React, { useState } from 'react';
import {
    Pill,
    Sun,
    Moon,
    Coffee,
    Image as ImageIcon,
    Plus,
    CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { LiquidList, LiquidItem } from '../ui/LiquidView';
import { TaskCard } from '../../features/tasks/TaskCard';
import { playCompletionSound } from '../../utils/sounds';
import { FEATURES } from '../../config/features';
import { CoffeeInviteCard } from '../../features/coffee';
import { AmbientHero, BriefingStory, ActivityTimeline } from '../../features/ambient';

export interface AmbientTabProps {
    role: 'senior' | 'relative';
    onOpenSymptomModal?: () => void;
    onOpenAddTaskModal?: () => void;
}

/**
 * AmbientTab - The unified "Daily" (Senior) and "Peace of Mind" (Relative) tab.
 * Uses role-aware rendering to switch between interactive (Senior) and ambient (Relative) modes.
 * Strengthens the Mirror Protocol by ensuring both roles see reflections of the same data.
 */
export const AmbientTab: React.FC<AmbientTabProps> = ({
    role,
    onOpenSymptomModal,
    onOpenAddTaskModal
}) => {
    const { t } = useTranslation();
    const {
        tasks = [],
        toggleTask,
        recordCheckIn
    } = useCareCircleContext();

    const [rewardMinimized, setRewardMinimized] = useState(true);
    const [hideReward, setHideReward] = useState(false);
    const [activePeriod, setActivePeriod] = useState<string | null>('morgen');

    // Medicine logic (Senior only)
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        t.title?.toLowerCase().includes('lac') ||
        t.type === 'medication'
    );
    const completedMedicineCount = medicineTasks.filter(t => t.completed).length;
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.length === completedMedicineCount;

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        const willBeCompleted = task && !task.completed;
        await toggleTask(id);
        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async () => {
        await recordCheckIn();
    };

    // Senior task section renderer
    const renderTaskSection = (periodTitle: string, periodKey: string, icon: React.ReactNode) => {
        const periodTasks = tasks.filter(t =>
            t.period === periodKey &&
            !t.completed &&
            !(t.title?.toLowerCase().includes('medicin') || t.title?.toLowerCase().includes('pille') || t.title?.toLowerCase().includes('lac') || t.type === 'medication')
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
                    <h2 className="text-xl font-bold theme-text">{periodTitle}</h2>
                    {!isActive && <span className="text-sm theme-text-muted">{t('press_to_see')}</span>}
                </div>

                {isActive && (
                    <LiquidList className="space-y-4 mb-8">
                        {periodTasks.map(task => (
                            <LiquidItem key={task.id} id={task.id}>
                                <TaskCard
                                    task={task}
                                    onToggle={() => handleToggleTask(task.id)}
                                />
                            </LiquidItem>
                        ))}
                    </LiquidList>
                )}
            </div>
        );
    };

    // ========== RELATIVE MODE ==========
    if (role === 'relative') {
        return (
            <div className="space-y-6 tab-content">
                {/* Coffee Signal */}
                <CoffeeInviteCard />

                {/* Hero: Ambient Dashboard Rings */}
                <AmbientHero role="relative" />

                {/* Smart Briefing */}
                <BriefingStory />

                {/* Activity Timeline */}
                <ActivityTimeline role="relative" />
            </div>
        );
    }

    // ========== SENIOR MODE ==========
    return (
        <div className="tab-content animate-fade-in">
            {/* Reward Card (Photo unlock on all medicine complete) */}
            {allMedicineComplete && !hideReward && (
                rewardMinimized ? (
                    <div className="relative w-full rounded-xl p-3 mb-4 bg-indigo-100 border-2 border-indigo-200 flex items-center justify-between">
                        <button
                            onClick={() => setRewardMinimized(false)}
                            className="flex-1 flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <ImageIcon className="w-5 h-5 text-indigo-600" />
                            <div>
                                <span className="font-bold text-indigo-700">{t('daily_photo_title')}</span>
                                <p className="text-xs text-indigo-500">{t('daily_photo_subtitle')}</p>
                            </div>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400">{t('press_to_show')}</span>
                            <button
                                onClick={() => setHideReward(true)}
                                className="p-1 rounded-full hover:bg-indigo-200 text-indigo-400 hover:text-indigo-600"
                                title={t('hide')}
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
                            title={t('hide')}
                        >
                            ✕
                        </button>
                        <button
                            onClick={() => setRewardMinimized(true)}
                            className="w-full text-center"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <ImageIcon className="w-6 h-6 text-indigo-200" />
                                <span className="font-bold text-indigo-100 uppercase tracking-widest text-sm">{t('daily_photo_title')}</span>
                            </div>
                            <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-3 overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={`https://picsum.photos/seed/${new Date().toISOString().split('T')[0]}/600/400`}
                                    alt="Dagens billede"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-bold text-lg">{t('medication_taken')}</p>
                            <p className="text-indigo-200 text-sm">{t('press_to_minimize')}</p>
                        </button>
                    </div>
                )
            )}

            {/* Medicine Section */}
            {medicineTasks.length > 0 && !allMedicineComplete && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Pill className="w-6 h-6 text-purple-600" />
                        <h2 className="text-lg font-bold text-purple-800">{t('medication_title')}</h2>
                        <span className="text-sm text-purple-500 ml-auto">
                            {completedMedicineCount}/{medicineTasks.length} {t('taken')}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {medicineTasks.filter(m => !m.completed).map(med => (
                            <button
                                key={med.id}
                                onClick={() => handleToggleTask(med.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all bg-white border-2 border-purple-100 hover:border-purple-300"
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-purple-300 bg-white flex items-center justify-center transition-colors">
                                </div>
                                <span className="font-medium text-purple-800">
                                    {med.title}
                                </span>
                                <span className="text-purple-400 text-sm ml-auto">{med.time}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Medicine Complete Badge */}
            {medicineTasks.length > 0 && allMedicineComplete && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 mb-4 border border-green-200 flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-green-700 font-medium">{t('medication_taken_check')}</span>
                </div>
            )}

            {/* Hero: Check-in Buttons */}
            <AmbientHero
                role="senior"
                onCheckIn={handleCheckIn}
                onOpenSymptomModal={onOpenSymptomModal}
            />

            {/* Contextual Task Lists */}
            {renderTaskSection(t('time_period_morning_full'), 'morgen', <Coffee className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_lunch_full'), 'frokost', <Sun className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_afternoon_full'), 'eftermiddag', <Moon className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_evening_full'), 'aften', <Moon className="w-6 h-6 theme-text-muted" />)}

            {/* Add Own Task Button */}
            <button
                onClick={onOpenAddTaskModal}
                className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-white border-2 border-dashed border-teal-300 rounded-2xl text-teal-600 font-medium hover:bg-teal-50 hover:border-teal-400 transition-colors"
            >
                <Plus className="w-5 h-5" />
                <span>{t('add_own_task')}</span>
            </button>
        </div>
    );
};

export default AmbientTab;

```
---

## File: tryg-app\src\components\shared\HealthTab.tsx
```tsx
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { SYMPTOMS_LIST } from '../../data/constants';

export const HealthTab: React.FC = () => {
    const { t } = useTranslation();
    const {
        symptoms: symptomLogs = []
    } = useCareCircleContext();

    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(() => {
        const today = new Date().toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
        return { [today]: true };
    });
    const [filterDate, setFilterDate] = useState<string | null>(null);


    // Group symptoms by date
    const groupedSymptoms = useMemo<Record<string, any[]>>(() => {
        const grouped: Record<string, any[]> = {};
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

    const displayedSymptoms = useMemo<Record<string, any[]>>(() => {
        if (!filterDate) return groupedSymptoms;
        return { [filterDate]: groupedSymptoms[filterDate] || [] };
    }, [groupedSymptoms, filterDate]);

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
            setFilterDate(null);
        } else {
            setFilterDate(dateKey);
            setExpandedDates(prev => ({ ...prev, [dateKey]: true }));
        }
    };

    return (
        <div className="tab-content animate-fade-in p-4 space-y-6">
            <h2 className="text-2xl font-bold theme-text mb-2">{t('health_title')}</h2>

            {/* Summary Stats */}
            {totalSymptoms > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="theme-card-secondary rounded-xl p-3 border border-orange-100">
                        <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                        <p className="text-xs text-orange-500">Symptomer (14 dage)</p>
                    </div>
                    {mostCommon && (
                        <div className="theme-card-secondary rounded-xl p-3 border border-purple-100">
                            <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                            <p className="text-xs text-purple-500">Mest hyppige ({mostCommon[1]}x)</p>
                        </div>
                    )}
                </div>
            )}

            {/* Clickable Chart */}
            <div className="p-4 theme-card-secondary rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold theme-text">Symptom-oversigt (14 dage)</h4>
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate(null)}
                            className="text-xs text-orange-600 font-medium hover:underline"
                        >
                            {t('view_all')}
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-500 mb-3">{t('chart_filter_hint')}</p>
                <div className="flex items-end gap-1 h-24 pb-2">
                    {chartData.map((day, i) => (
                        <button
                            key={i}
                            onClick={() => day.count > 0 && handleChartClick(day.dateKey)}
                            className={`flex-1 flex flex-col items-center gap-1 transition-all ${filterDate === day.dateKey ? 'scale-110' : ''} ${day.count > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {day.count > 0 && (
                                <span className={`text-[10px] font-bold ${filterDate === day.dateKey ? 'text-orange-800' : 'text-orange-600'}`}>{day.count}</span>
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
                <div className="flex justify-between text-[10px] text-stone-400 font-bold px-2">
                    <span>{t('time_days_ago_short', { count: 14 })}</span><span>{t('today')}</span>
                </div>
            </div>

            {/* Steps Trend */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">{t('health_steps')}</h4>
                    <span className="text-teal-600 font-black">6.420 {t('steps_avg')}</span>
                </div>
                <div className="h-16 flex items-end gap-1 mb-2">
                    {[35, 45, 30, 65, 85, 40, 55].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-teal-200 rounded-t-sm"
                            style={{ height: `${h}%` }}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-bold px-2">
                    <span>{t('time_days_ago_short', { count: 7 })}</span><span>{t('today')}</span>
                </div>
            </div>

            {/* Symptom Log */}
            <div>
                <h4 className="font-bold theme-text mb-3">
                    {t('symptom_log_title')} {filterDate ? `(${filterDate})` : t('symptom_log_last_14_days')}
                </h4>
                {Object.keys(displayedSymptoms).length === 0 ? (
                    <p className="text-slate-500 text-sm italic">{t('no_symptoms_recorded')}</p>
                ) : (
                    <div className="space-y-2">
                        {Object.entries(displayedSymptoms).map(([dateStr, logs]) => (
                            <div key={dateStr} className="border rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleDate(dateStr)}
                                    className="w-full flex items-center justify-between p-3 theme-card-secondary hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-bold theme-text">{dateStr}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{logs?.length || 0} {t('symptoms_count_label')}</span>
                                        {expandedDates[dateStr] ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                </button>

                                {expandedDates[dateStr] && logs && (
                                    <ul className="divide-y border-t bg-white">
                                        {logs.map((log: any, i: number) => {
                                            const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || { icon: AlertCircle, label: t('unknown') };
                                            const SymptomIcon = symptomDef.icon || AlertCircle;
                                            const timeStr = log.dateObj.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

                                            return (
                                                <li key={i} className="flex flex-col gap-1 text-sm p-3">
                                                    <div className="flex items-center gap-3">
                                                        <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                        <span className="font-medium theme-text">{log.label}</span>
                                                        <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                    </div>
                                                    {log.bodyLocation && (
                                                        <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                            <div>📍 {t('location_prefix')}: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                            {log.bodyLocation.severity && (
                                                                <div>📊 {t('intensity_prefix')}: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
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
    );
};

```
---

## File: tryg-app\src\components\shared\SpilTab.tsx
```tsx
import React from 'react';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Spillehjoernet } from '../../features/wordGame';
import { FEATURES } from '../../config/features';

export const SpilTab: React.FC = () => {
    const { careCircleId, currentUserId, userName, userRole } = useCareCircleContext();

    if (!FEATURES.spillehjoernet) return null;

    return (
        <div className="tab-content animate-fade-in">
            <Spillehjoernet
                circleId={careCircleId || ''}
                userId={currentUserId || ''}
                displayName={userName || (userRole === 'senior' ? 'Senior' : 'Pårørende')}
            />
        </div>
    );
};

```
---

## File: tryg-app\src\components\ShareModal.tsx
```tsx
import React from 'react';
import { X, Copy, Users, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { FamilyConstellation } from '../features/familyPresence';

export interface ShareModalProps {
    members: any[];
    inviteCode: string | null;
    onGetInviteCode: () => Promise<void>;
    onClose: () => void;
    seniorName: string;
    currentUserId?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    members,
    inviteCode,
    onGetInviteCode,
    onClose,
    seniorName,
    currentUserId
}) => {
    const { t } = useTranslation();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="px-6 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{t('family_circle')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Invite Code Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-stone-600">
                            <Shield className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">{t('invite_code')}</h3>
                        </div>

                        <div className="bg-stone-50 rounded-2xl p-6 border-2 border-dashed border-stone-200 text-center relative group">
                            {inviteCode ? (
                                <>
                                    <p className="text-3xl font-mono font-bold tracking-[0.2em] text-stone-800 mb-2">{inviteCode}</p>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        className="mx-auto flex items-center gap-2"
                                        onClick={() => copyToClipboard(inviteCode)}
                                    >
                                        <Copy className="w-4 h-4" />
                                        {t('copy', 'Kopier')}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={onGetInviteCode}
                                >
                                    {t('show_invite_code')}
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-stone-400 text-center leading-relaxed">
                            {t('invite_notice', 'Del denne kode med familiemedlemmer, du ønsker at invitere til din Care Circle.')}
                        </p>
                    </section>

                    {/* Family Constellation Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-stone-600">
                            <Users className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">{t('family_heart')}</h3>
                        </div>

                        <div className="bg-stone-50 rounded-3xl p-4 border border-stone-100 flex justify-center">
                            <div className="scale-90 sm:scale-100 origin-center py-4">
                                <FamilyConstellation
                                    members={members as any}
                                    centerMemberName={seniorName}
                                    currentUserId={currentUserId}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer safe area */}
                <div className="h-8 sm:h-6" />
            </div>
        </div>
    );
};

export default ShareModal;

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
/// <reference types="vite/client" />
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Avatar size variants using CVA
 */
const avatarVariants = cva(
    "rounded-full overflow-hidden bg-stone-100",
    {
        variants: {
            size: {
                sm: "w-8 h-8",
                md: "w-12 h-12",
                lg: "w-16 h-16",
                xl: "w-24 h-24",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

type AvatarId = 'louise' | 'fatima' | 'brad' | 'bearded' | 'senior' | 'home' | 'work' | 'car' | 'coffee' | 'moon' | string;

interface AvatarProps extends VariantProps<typeof avatarVariants> {
    id: AvatarId;
    className?: string;
}

// Map IDs to image filenames
const IMAGE_MAP: Record<string, string> = {
    'louise': 'louise.png',
    'fatima': 'fatima.png',
    'brad': 'brad.png',
    'bearded': 'brad.png',
    'senior': 'brad.png',
    'home': 'home.png',
    'work': 'work.png',
    'car': 'car.png',
    'coffee': 'coffee.png',
    'moon': 'moon.png'
};

/**
 * Avatar Component
 * Renders avatars and status icons using individual image files.
 */
export const Avatar: React.FC<AvatarProps> = ({ id, className, size }) => {
    // Fallback for unknown IDs
    if (!IMAGE_MAP[id]) {
        return (
            <div className={cn(
                avatarVariants({ size }),
                "bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase",
                className
            )}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    const imagePath = `${import.meta.env.BASE_URL}assets/avatars/${IMAGE_MAP[id]}`;

    return (
        <div className={cn(avatarVariants({ size }), className)}>
            <img
                src={imagePath}
                alt={id}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export { avatarVariants };
export default Avatar;

```
---

## File: tryg-app\src\components\ui\Button.tsx
```tsx
import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Button variants using CVA for type-safe, maintainable styling
 */
const buttonVariants = cva(
    // Base styles (always applied)
    "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",
    {
        variants: {
            variant: {
                primary: "bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700 active:scale-95",
                secondary: "bg-stone-100 text-stone-800 hover:bg-stone-200",
                danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-2 border-rose-200",
                outline: "border-2 border-teal-600 text-teal-700 hover:bg-teal-50",
                ghost: "bg-transparent text-stone-500 hover:text-stone-800",
                locked: "bg-stone-200 text-stone-400 cursor-not-allowed",
            },
            size: {
                small: "py-2 px-4 text-sm",
                normal: "py-3 px-6 text-base",
                large: "py-6 px-8 text-xl h-24",
                xl: "py-8 px-8 text-2xl h-32",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "normal",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant,
    size,
    className,
    disabled = false,
    'aria-label': ariaLabel,
    ...props
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
                buttonVariants({
                    variant: disabled ? 'locked' : variant,
                    size
                }),
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// Export variants for external use (e.g., link styled as button)
export { buttonVariants };

export default Button;

```
---

## File: tryg-app\src\components\ui\LiquidView.tsx
```tsx

import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// Define the two "Dialects" of motion
const TRANSITIONS: Record<string, Transition> = {
    senior: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, // Slow, smooth "ease out"
    relative: { type: "spring", stiffness: 400, damping: 30 } // Bouncy, fast spring
};

const VARIANTS = {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -10 }
};

/**
 * A wrapper that animates items in a list (Tasks, Cards, etc.)
 * Adjusts speed based on the logged-in user's role.
 */
export const LiquidItem = ({ children, className = '', id }: { children: React.ReactNode, className?: string, id?: string | number }) => {
    const { userProfile } = useAuth();
    const role = userProfile?.role || 'relative';

    return (
        <motion.div
            layout
            variants={VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITIONS[role as keyof typeof TRANSITIONS] || TRANSITIONS.relative} // <--- The magic switch
            className={className}
            key={id}
        >
            {children}
        </motion.div>
    );
};

export const LiquidList = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div layout className={className}>
        <AnimatePresence mode="popLayout" initial={false}>
            {children}
        </AnimatePresence>
    </motion.div>
);

```
---

## File: tryg-app\src\components\ui\LivingBackground.tsx
```tsx
import { useTheme } from '../../contexts/ThemeContext';
import React, { useMemo } from 'react';

/**
 * LivingBackground 2.0 - Ambient circadian atmosphere
 * Uses subtle animated SVG blobs and time-aware gradients
 * NOW respects isDark for manual dark mode toggle
 */
export const LivingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { circadianTheme, isDark } = useTheme();

    const theme = useMemo(() => {
        // If user explicitly set dark mode, OR it's evening/night, use dark themes
        if (isDark) {
            // Dark mode: use night-like colors regardless of actual time
            return {
                gradient: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950',
                blob1: 'fill-indigo-500/10',
                blob2: 'fill-slate-700/20'
            };
        }

        // Light mode: use circadian time-based gradients
        switch (circadianTheme) {
            case 'morning':
                return {
                    gradient: 'bg-gradient-to-br from-teal-50 via-white to-stone-50',
                    blob1: 'fill-teal-200/40',
                    blob2: 'fill-sky-100/30'
                };
            case 'day':
                return {
                    gradient: 'bg-gradient-to-br from-amber-50 via-white to-orange-50/40',
                    blob1: 'fill-amber-200/20',
                    blob2: 'fill-orange-100/30'
                };
            case 'evening':
                // Evening is NOW darker (deep indigo twilight)
                return {
                    gradient: 'bg-gradient-to-br from-indigo-200 via-slate-200 to-stone-300',
                    blob1: 'fill-indigo-300/30',
                    blob2: 'fill-slate-400/20'
                };
            case 'night':
                return {
                    gradient: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950',
                    blob1: 'fill-indigo-500/10',
                    blob2: 'fill-slate-700/20'
                };
            default:
                return {
                    gradient: 'bg-stone-50',
                    blob1: 'fill-teal-200/30',
                    blob2: 'fill-amber-100/20'
                };
        }
    }, [circadianTheme, isDark]);

    return (
        <div className={`h-full w-full transition-all duration-[3000ms] ease-in-out relative ${theme.gradient}`}>
            {/* Ambient Background Blobs - Increased visibility & soft blur */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden blur-3xl opacity-80">
                <svg viewBox="0 0 100 100" className="absolute -top-10 -left-10 w-96 h-96 transition-colors duration-[3000ms]">
                    <path
                        className={`${theme.blob1} animate-breathe`}
                        d="M33,-47.1C43.3,-40.3,52.5,-30.9,57.1,-19.5C61.7,-8,61.7,5.5,57.9,18C54,30.5,46.3,42,35.3,49.8C24.3,57.6,10.1,61.7,-3.4,66.4C-16.9,71.1,-29.7,76.4,-40.7,71.7C-51.7,67,-61,52.3,-66.2,37.3C-71.4,22.3,-72.6,7,-67.7,-5.7C-62.8,-18.3,-51.8,-28.3,-40.3,-35.1C-28.8,-41.8,-16.8,-45.3,-4.2,-39.5C8.3,-33.7,19.9,-18.6,33,-47.1Z"
                        transform="translate(50 50)"
                    />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] transition-colors duration-[3000ms]">
                    <path
                        className={`${theme.blob2} animate-glow-loop`}
                        d="M45.5,-63.3C58.3,-55.8,67.6,-41.2,71.2,-26C74.8,-10.8,72.7,4.9,67.8,20.1C62.9,35.3,55.1,50.1,42.7,58.8C30.3,67.6,13.2,70.2,-4,75.7C-21.2,81.1,-38.5,89.4,-51.7,85.2C-64.9,81,-74,64.2,-78.3,47.1C-82.6,30,-82,12.5,-77.7,-3.7C-73.4,-19.9,-65.4,-34.8,-53.8,-42.6C-42.2,-50.3,-27,-51,-13.3,-55.7C0.4,-60.4,14.6,-69,30.3,-70.8C46.1,-72.6,63.3,-67.6,45.5,-63.3Z"
                        transform="translate(50 50)"
                    />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

```
---

## File: tryg-app\src\components\ui\Modal.tsx
```tsx
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4">
            <div className={cn(
                "theme-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto flex flex-col",
                className
            )}>
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold theme-text">{title}</h3>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-stone-400",
                            "theme-dark:bg-slate-700 theme-dark:hover:bg-slate-600"
                        )}
                        aria-label="Luk"
                    >
                        <X className="w-6 h-6 theme-text-muted" />
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

export type PictogramSheet = '1' | '2';
export type PictogramPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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

## File: tryg-app\src\config\features.ts
```ts
// Feature flags for toggling features on/off
// Set to false to temporarily disable a feature

export const FEATURES = {
    // Layout
    tabbedLayout: true,        // Use tabs instead of scrolling (experimental)
    livingDesign: true,        // 🏠 New "Velkommen Hjem" aesthetic (set false to fallback)

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
export const isFeatureEnabled = (featureName: keyof typeof FEATURES): boolean => {
    return FEATURES[featureName] ?? true;
};

export default FEATURES;

```
---

## File: tryg-app\src\config\firebase.ts
```ts
// Firebase configuration for Tryg App
// Values loaded from environment variables (.env.local for dev, GitHub Secrets for prod)
// See .env.example for required variables

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
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

## File: tryg-app\src\contexts\CareCircleContext.tsx
```tsx
import { createContext, useContext } from 'react';
import { CareCircleContextValue } from '../types';

export const CareCircleContext = createContext<CareCircleContextValue>({
    careCircleId: null,
    seniorId: null,
    seniorName: 'Senior',
    currentUserId: null,
    userRole: null,
    userName: 'Bruger',
    relativeName: 'Pårørende',
    memberStatuses: [],
    members: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: 'home',
    setMyStatus: async () => { },
    activeTab: 'daily',
    setActiveTab: () => { },
    tasks: [],
    toggleTask: () => { },
    addTask: () => { },
    symptoms: [],
    addSymptom: async () => undefined,
    weeklyAnswers: [],
    addWeeklyAnswer: async () => undefined,
    toggleLike: async () => { },
    addReply: async () => { },
    latestPing: null,
    sendPing: async () => undefined,
    dismissPing: () => { },
    lastCheckIn: null,
    recordCheckIn: async () => undefined,
});

/**
 * Hook to access CareCircle context
 */
export const useCareCircleContext = () => {
    const context = useContext(CareCircleContext);
    if (!context) {
        throw new Error('useCareCircleContext must be used within a CareCircleProvider');
    }
    return context;
};

/**
 * Provider component that wraps the app and provides circle state
 */
export const CareCircleProvider = CareCircleContext.Provider;

```
---

## File: tryg-app\src\contexts\ThemeContext.tsx
```tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';
type CircadianTheme = 'morning' | 'day' | 'evening' | 'night';

interface ThemeContextType {
    mode: ThemeMode;
    circadianTheme: CircadianTheme;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load persisted mode or default to auto
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode');
        return (saved as ThemeMode) || 'auto';
    });

    const [circadianTheme, setCircadianTheme] = useState<CircadianTheme>('day');

    // Update circadian theme based on time
    useEffect(() => {
        const updateTheme = () => {
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 11) setCircadianTheme('morning');
            else if (hour >= 11 && hour < 17) setCircadianTheme('day');
            else if (hour >= 17 && hour < 22) setCircadianTheme('evening');
            else setCircadianTheme('night');
        };

        updateTheme();
        const timer = setInterval(updateTheme, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    // Persist mode changes
    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    // Determine if we should be in dark mode
    const isDark = useMemo(() => {
        if (mode === 'dark') return true;
        if (mode === 'light') return false;
        // AUTO: Dark in evening and night
        return circadianTheme === 'evening' || circadianTheme === 'night';
    }, [mode, circadianTheme]);

    // Apply theme class to body
    useEffect(() => {
        const body = document.body;
        if (isDark) {
            body.classList.add('theme-dark');
        } else {
            body.classList.remove('theme-dark');
        }
    }, [isDark]);

    const value = useMemo(() => ({
        mode,
        circadianTheme,
        setMode,
        isDark
    }), [mode, circadianTheme, isDark]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

```
---

## File: tryg-app\src\data\constants.ts
```ts
import { Zap, Brain, Frown, Thermometer, Moon, Droplets, Utensils } from 'lucide-react';

// Initial tasks grouped by time of day (Habit Stacking)
export const INITIAL_TASKS = [
    { id: '1', title: 'Morgenpiller', type: 'medication', time: '08:00', period: 'morgen', completed: false, description: 'Hjertemedicin (2 piller)' },
    { id: '2', title: 'Drik vand', type: 'hydration', time: '10:00', period: 'morgen', completed: false, description: 'Et stort glas' },
    { id: '3', title: 'Frokostmedicin', type: 'medication', time: '12:00', period: 'frokost', completed: false, description: 'Vitaminer' },
    { id: '4', title: 'Gåtur', type: 'activity', time: '14:00', period: 'eftermiddag', completed: false, description: '15 min i haven' },
];

// Symptom type definition
export interface SymptomOption {
    id: string;
    label: string;
    icon: typeof Zap;
    color: string;
}

// Localized symptoms list - returns translated labels
export const getSymptomsList = (t: (key: string) => string): SymptomOption[] => [
    { id: 'pain', label: t('symptom_pain'), icon: Zap, color: 'bg-red-100 text-red-600' },
    { id: 'dizzy', label: t('symptom_dizzy'), icon: Brain, color: 'bg-purple-100 text-purple-600' },
    { id: 'nausea', label: t('symptom_nausea'), icon: Frown, color: 'bg-orange-100 text-orange-600' },
    { id: 'fever', label: t('symptom_fever'), icon: Thermometer, color: 'bg-amber-100 text-amber-600' },
    { id: 'sleep', label: t('symptom_sleep'), icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'sweats', label: t('symptom_sweats'), icon: Droplets, color: 'bg-sky-100 text-sky-600' },
    { id: 'appetite', label: t('symptom_appetite'), icon: Utensils, color: 'bg-emerald-100 text-emerald-600' },
];

// Symptom options with icons and colors (Danish fallback for backwards compatibility)
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
    name: 'Bozana Cosic',
    age: 78,
    status: 'active',
    lastActive: new Date().toISOString(),
    batteryLevel: 85,
};

```
---

## File: tryg-app\src\data\wordGameData.ts
```ts
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
    const seededRandom = (i: number): number => {
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
export function shuffleAnswers(word: { id: string; correctAnswer: string; wrongAnswer: string }, seed = 0) {
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

## File: tryg-app\src\data\wordGameData_bs.ts
```ts
// Word Game Data - Bosnian words with definitions for "Word of the Day" game
// Each word has a correct meaning and a plausible wrong answer

export const WORD_LIST_BS = [
    {
        id: 'sevdah',
        word: 'Sevdah',
        correctAnswer: 'Osjećaj duboke čežnje i melanholije',
        wrongAnswer: 'Tradicionalni bosanski ples',
        category: 'emocije'
    },
    {
        id: 'merak',
        word: 'Merak',
        correctAnswer: 'Uživanje i zadovoljstvo u nečemu',
        wrongAnswer: 'Vrsta tradicionalne hrane',
        category: 'emocije'
    },
    {
        id: 'ćeif',
        word: 'Ćeif',
        correctAnswer: 'Dobro raspoloženje i uživanje',
        wrongAnswer: 'Vrsta kafe',
        category: 'emocije'
    },
    {
        id: 'dert',
        word: 'Dert',
        correctAnswer: 'Tuga ili briga koja tišti srce',
        wrongAnswer: 'Vrsta zemljišta',
        category: 'emocije'
    },
    {
        id: 'kahva',
        word: 'Kahva',
        correctAnswer: 'Bosanska kafa pripremljena u džezvi',
        wrongAnswer: 'Hladni napitak od voća',
        category: 'hrana'
    },
    {
        id: 'avlija',
        word: 'Avlija',
        correctAnswer: 'Dvorište oko kuće',
        wrongAnswer: 'Udaljena planina',
        category: 'prostor'
    },
    {
        id: 'mahala',
        word: 'Mahala',
        correctAnswer: 'Komšiluk ili gradska četvrt',
        wrongAnswer: 'Velika rijeka',
        category: 'prostor'
    },
    {
        id: 'čaršija',
        word: 'Čaršija',
        correctAnswer: 'Stari trgovački centar grada',
        wrongAnswer: 'Vrsta sladoleda',
        category: 'prostor'
    },
    {
        id: 'hajat',
        word: 'Hajat',
        correctAnswer: 'Natkriveni hodnik ispred kuće',
        wrongAnswer: 'Vrsta cvijeta',
        category: 'arhitektura'
    },
    {
        id: 'pendžer',
        word: 'Pendžer',
        correctAnswer: 'Prozor',
        wrongAnswer: 'Vrsta ptice',
        category: 'arhitektura'
    },
    {
        id: 'ašik',
        word: 'Ašik',
        correctAnswer: 'Zaljubljena osoba',
        wrongAnswer: 'Vrsta drveta',
        category: 'ljubav'
    },
    {
        id: 'dilber',
        word: 'Dilber',
        correctAnswer: 'Lijepa djevojka',
        wrongAnswer: 'Vrsta tkanine',
        category: 'ljubav'
    },
    {
        id: 'ćemer',
        word: 'Ćemer',
        correctAnswer: 'Pojas ili dio mostovske konstrukcije',
        wrongAnswer: 'Vrsta kolača',
        category: 'predmeti'
    },
    {
        id: 'dimije',
        word: 'Dimije',
        correctAnswer: 'Tradicionalne široke hlače',
        wrongAnswer: 'Vrsta sira',
        category: 'odjeća'
    },
    {
        id: 'feredža',
        word: 'Feredža',
        correctAnswer: 'Tradicionalni ženski kaput',
        wrongAnswer: 'Vrsta plesa',
        category: 'odjeća'
    },
    {
        id: 'ćilim',
        word: 'Ćilim',
        correctAnswer: 'Ručno tkani tepih',
        wrongAnswer: 'Vrsta začina',
        category: 'predmeti'
    },
    {
        id: 'džamija',
        word: 'Džamija',
        correctAnswer: 'Muslimanski hram za molitvu',
        wrongAnswer: 'Vrsta pekarske robe',
        category: 'religija'
    },
    {
        id: 'sofra',
        word: 'Sofra',
        correctAnswer: 'Niski okrugli stol za jelo',
        wrongAnswer: 'Vrsta povrća',
        category: 'namještaj'
    },
    {
        id: 'šehit',
        word: 'Šehit',
        correctAnswer: 'Osoba koja je poginula braneći domovinu',
        wrongAnswer: 'Vrsta instrumenta',
        category: 'povijest'
    },
    {
        id: 'inšallah',
        word: 'Inšallah',
        correctAnswer: 'Ako Bog da',
        wrongAnswer: 'Vrsta pozdrava',
        category: 'izrazi'
    },
    {
        id: 'esselamu',
        word: 'Merhaba',
        correctAnswer: 'Pozdrav, dobrodošlica',
        wrongAnswer: 'Vrsta slastice',
        category: 'izrazi'
    },
    {
        id: 'komšija',
        word: 'Komšija',
        correctAnswer: 'Susjed',
        wrongAnswer: 'Vrsta kolača',
        category: 'ljudi'
    },
    {
        id: 'raja',
        word: 'Raja',
        correctAnswer: 'Prijatelji, ekipa',
        wrongAnswer: 'Historijski porez',
        category: 'ljudi'
    },
    {
        id: 'ćorava',
        word: 'Sokak',
        correctAnswer: 'Uska ulica u starom dijelu grada',
        wrongAnswer: 'Vrsta voća',
        category: 'prostor'
    },
    {
        id: 'bunar',
        word: 'Bunar',
        correctAnswer: 'Izvor vode iskopan u zemlji',
        wrongAnswer: 'Vrsta ribe',
        category: 'prostor'
    },
    {
        id: 'turbé',
        word: 'Turbé',
        correctAnswer: 'Grobnica značajne osobe',
        wrongAnswer: 'Vrsta šešira',
        category: 'arhitektura'
    },
    {
        id: 'mangala',
        word: 'Mangala',
        correctAnswer: 'Mali roštilj za ćumur',
        wrongAnswer: 'Vrsta voća',
        category: 'predmeti'
    },
    {
        id: 'ibrik',
        word: 'Ibrik',
        correctAnswer: 'Posuda za vodu ili kafu',
        wrongAnswer: 'Vrsta ptice',
        category: 'predmeti'
    },
    {
        id: 'šeher',
        word: 'Šeher',
        correctAnswer: 'Grad',
        wrongAnswer: 'Vrsta hrane',
        category: 'prostor'
    },
    {
        id: 'pazar',
        word: 'Pazar',
        correctAnswer: 'Tržnica ili dan za kupovinu',
        wrongAnswer: 'Vrsta plesa',
        category: 'trgovina'
    }
];

/**
 * Get today's 5 words - same for all users based on date
 * Uses date as seed to ensure consistency across family
 */
export function getTodaysWordsBS(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateStr, 10);

    const seededRandom = (i: number) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
    };

    const shuffled = [...WORD_LIST_BS]
        .map((word, i) => ({ word, sort: seededRandom(i) }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ word }) => word);

    return shuffled.slice(0, 5);
}

/**
 * Shuffle answers for a word (returns [option1, option2] in random order)
 */
export function shuffleAnswersBS(word: typeof WORD_LIST_BS[0], seed = 0) {
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

export default { WORD_LIST_BS, getTodaysWordsBS, shuffleAnswersBS };

```
---

## File: tryg-app\src\data\wordGameData_tr.ts
```ts
// Word Game Data - Turkish words with definitions for "Word of the Day" game
// Each word has a correct meaning and a plausible wrong answer

export const WORD_LIST_TR = [
    {
        id: 'keyif',
        word: 'Keyif',
        correctAnswer: 'Rahat ve huzurlu bir şekilde zaman geçirmek',
        wrongAnswer: 'Bir tür kahve',
        category: 'duygular'
    },
    {
        id: 'hüzün',
        word: 'Hüzün',
        correctAnswer: 'Derin bir üzüntü ve melankoli hissi',
        wrongAnswer: 'Bir tür müzik aleti',
        category: 'duygular'
    },
    {
        id: 'gönül',
        word: 'Gönül',
        correctAnswer: 'Kalp, duygusal merkez',
        wrongAnswer: 'Bir tür çiçek',
        category: 'duygular'
    },
    {
        id: 'hasret',
        word: 'Hasret',
        correctAnswer: 'Birini veya bir şeyi çok özlemek',
        wrongAnswer: 'Bir tür yemek',
        category: 'duygular'
    },
    {
        id: 'sılasever',
        word: 'Gurbet',
        correctAnswer: 'Memleketten uzakta yaşamak',
        wrongAnswer: 'Bir tür dans',
        category: 'duygular'
    },
    {
        id: 'misafirpervane',
        word: 'Misafirperverlik',
        correctAnswer: 'Konuklara cömertçe davranma geleneği',
        wrongAnswer: 'Bir tür festival',
        category: 'gelenek'
    },
    {
        id: 'konak',
        word: 'Konak',
        correctAnswer: 'Büyük ve tarihi ev',
        wrongAnswer: 'Bir tür balık',
        category: 'mimari'
    },
    {
        id: 'çeşme',
        word: 'Çeşme',
        correctAnswer: 'Su akan kaynağa veya yapıya',
        wrongAnswer: 'Bir tür meyve',
        category: 'mimari'
    },
    {
        id: 'hamam',
        word: 'Hamam',
        correctAnswer: 'Geleneksel Türk banyosu',
        wrongAnswer: 'Bir tür spor',
        category: 'gelenek'
    },
    {
        id: 'cami',
        word: 'Cami',
        correctAnswer: 'Müslümanların ibadet ettiği yer',
        wrongAnswer: 'Bir tür cam eşya',
        category: 'din'
    },
    {
        id: 'muhabbet',
        word: 'Muhabbet',
        correctAnswer: 'Samimi ve keyifli sohbet',
        wrongAnswer: 'Bir tür kuş',
        category: 'iletişim'
    },
    {
        id: 'komşu',
        word: 'Komşu',
        correctAnswer: 'Yanınızda oturan kişi',
        wrongAnswer: 'Bir tür ağaç',
        category: 'insanlar'
    },
    {
        id: 'aşık',
        word: 'Aşık',
        correctAnswer: 'Derin sevgi duyan kişi',
        wrongAnswer: 'Bir tür taş',
        category: 'aşk'
    },
    {
        id: 'dilber',
        word: 'Dilber',
        correctAnswer: 'Çok güzel kadın',
        wrongAnswer: 'Bir tür elbise',
        category: 'aşk'
    },
    {
        id: 'yaren',
        word: 'Yaren',
        correctAnswer: 'Yakın arkadaş, sırdaş',
        wrongAnswer: 'Bir tür hayvan',
        category: 'insanlar'
    },
    {
        id: 'kısmet',
        word: 'Kısmet',
        correctAnswer: 'Kader, nasip',
        wrongAnswer: 'Bir tür kumaş',
        category: 'inanç'
    },
    {
        id: 'nazar',
        word: 'Nazar',
        correctAnswer: 'Kötü bakış, göz değmesi',
        wrongAnswer: 'Bir tür gözlük',
        category: 'inanç'
    },
    {
        id: 'maşallah',
        word: 'Maşallah',
        correctAnswer: 'Allah korusun, takdir ifadesi',
        wrongAnswer: 'Bir tür tatlı',
        category: 'ifadeler'
    },
    {
        id: 'inşallah',
        word: 'İnşallah',
        correctAnswer: 'Allah izin verirse',
        wrongAnswer: 'Bir tür selamlama',
        category: 'ifadeler'
    },
    {
        id: 'merhaba',
        word: 'Merhaba',
        correctAnswer: 'Hoş geldin anlamında selam',
        wrongAnswer: 'Bir tür baharat',
        category: 'ifadeler'
    },
    {
        id: 'sofra',
        word: 'Sofra',
        correctAnswer: 'Yemek masası veya örtüsü',
        wrongAnswer: 'Bir tür sebze',
        category: 'ev'
    },
    {
        id: 'kilim',
        word: 'Kilim',
        correctAnswer: 'El dokuması halı',
        wrongAnswer: 'Bir tür baharat',
        category: 'ev'
    },
    {
        id: 'simit',
        word: 'Simit',
        correctAnswer: 'Susamlı halka ekmek',
        wrongAnswer: 'Bir tür kumaş',
        category: 'yemek'
    },
    {
        id: 'lokum',
        word: 'Lokum',
        correctAnswer: 'Geleneksel şekerli tatlı',
        wrongAnswer: 'Bir tür mobilya',
        category: 'yemek'
    },
    {
        id: 'baklava',
        word: 'Baklava',
        correctAnswer: 'İnce hamur ve fıstıkla yapılan tatlı',
        wrongAnswer: 'Bir tür giysi',
        category: 'yemek'
    },
    {
        id: 'çay',
        word: 'Çay',
        correctAnswer: 'En sevilen Türk içeceği',
        wrongAnswer: 'Bir tür ot',
        category: 'içecek'
    },
    {
        id: 'kahve',
        word: 'Türk Kahvesi',
        correctAnswer: 'Geleneksel yöntemle pişirilen koyu kahve',
        wrongAnswer: 'Bir tür tatlı',
        category: 'içecek'
    },
    {
        id: 'memleket',
        word: 'Memleket',
        correctAnswer: 'Doğduğun yer, vatan',
        wrongAnswer: 'Bir tür bitki',
        category: 'yer'
    },
    {
        id: 'pazar',
        word: 'Pazar',
        correctAnswer: 'Açık hava çarşısı veya hafta sonu günü',
        wrongAnswer: 'Bir tür dans',
        category: 'ticaret'
    },
    {
        id: 'çarşı',
        word: 'Çarşı',
        correctAnswer: 'Alışveriş merkezi, pazar yeri',
        wrongAnswer: 'Bir tür müzik',
        category: 'ticaret'
    }
];

/**
 * Get today's 5 words - same for all users based on date
 * Uses date as seed to ensure consistency across family
 */
export function getTodaysWordsTR(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateStr, 10);

    const seededRandom = (i: number) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
    };

    const shuffled = [...WORD_LIST_TR]
        .map((word, i) => ({ word, sort: seededRandom(i) }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ word }) => word);

    return shuffled.slice(0, 5);
}

/**
 * Shuffle answers for a word (returns [option1, option2] in random order)
 */
export function shuffleAnswersTR(word: typeof WORD_LIST_TR[0], seed = 0) {
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

export default { WORD_LIST_TR, getTodaysWordsTR, shuffleAnswersTR };

```
---

## File: tryg-app\src\features\ambient\ActivityTimeline.tsx
```tsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';

export interface ActivityTimelineProps {
    role: 'senior' | 'relative';
    maxItems?: number;
    className?: string;
}

interface ActivityItem {
    type: 'task' | 'symptom';
    timestamp: Date;
    text: string;
    emoji: string;
    time: string;
}

/**
 * ActivityTimeline - A unified activity feed for both roles.
 * - Senior Mode: Shows completed tasks and logged symptoms (interactive context)
 * - Relative Mode: Shows the same data as a read-only "connection history"
 */
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
    role,
    maxItems = 5,
    className = ''
}) => {
    const { t } = useTranslation();
    const {
        tasks = [],
        symptoms = []
    } = useCareCircleContext();

    // Generate activity feed from tasks and symptoms
    const recentActivity = useMemo<ActivityItem[]>(() => {
        const activities: Omit<ActivityItem, 'time'>[] = [];

        // Add completed tasks
        tasks.filter(task => task.completed && task.completedAt).forEach(task => {
            const timestamp = (task.completedAt as any)?.toDate
                ? (task.completedAt as any).toDate()
                : new Date(task.completedAt as any);
            activities.push({
                type: 'task',
                timestamp,
                text: `${t('task_completed')}: ${task.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms
        symptoms.forEach(symptom => {
            const timestamp = (symptom.loggedAt as any)?.toDate
                ? (symptom.loggedAt as any).toDate()
                : new Date(symptom.loggedAt as any);
            activities.push({
                type: 'symptom',
                timestamp,
                text: `${t('symptom_log_item', { label: symptom.label || symptom.type || t('unknown') })}`,
                emoji: '🩺'
            });
        });

        // Sort by time (newest first) and limit
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, maxItems)
            .map(a => ({
                ...a,
                time: a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [tasks, symptoms, maxItems, t]);

    if (recentActivity.length === 0) {
        return (
            <div className={`bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-stone-100 shadow-sm ${className}`}>
                <p className="text-sm text-stone-400 text-center">{t('no_activity_yet')}</p>
            </div>
        );
    }

    // Relative view uses a softer, more observational style
    const containerClass = role === 'relative'
        ? 'bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-stone-100 shadow-sm'
        : 'bg-stone-50 rounded-2xl p-4 border border-stone-100';

    return (
        <div className={`${containerClass} ${className}`}>
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-4">
                {t('seneste_aktivitet') || 'Seneste aktivitet'}
            </h3>
            <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-stone-700">
                        <span className="font-bold text-stone-300 w-12">{activity.time}</span>
                        <span className="text-lg">{activity.emoji}</span>
                        <span className="font-medium">{activity.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;

```
---

## File: tryg-app\src\features\ambient\AmbientHero.tsx
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Heart, Clock, Activity, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

export interface AmbientHeroProps {
    role: 'senior' | 'relative';
    onCheckIn?: () => void;
    onOpenSymptomModal?: () => void;
}

/**
 * AmbientHero - The emotional centerpiece of the AmbientTab.
 * - Senior Mode: Interactive check-in buttons ("I'm okay" / "I have pain")
 * - Relative Mode: Ambient status visualization (rings, pulse, gradient)
 *   → Bursts with celebratory animation when Senior checks in!
 */
export const AmbientHero: React.FC<AmbientHeroProps> = ({
    role,
    onCheckIn,
    onOpenSymptomModal
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        tasks = [],
        symptoms = [],
        lastCheckIn
    } = useCareCircleContext();

    // ========== BURST ANIMATION STATE (Relative Mode) ==========
    const [isBursting, setIsBursting] = useState(false);
    const prevCheckInRef = useRef<string | null>(null);

    // Detect check-in changes and trigger burst animation
    useEffect(() => {
        if (role !== 'relative') return;

        // If lastCheckIn changed to a new value
        if (lastCheckIn && lastCheckIn !== prevCheckInRef.current) {
            // Trigger celebratory burst!
            setIsBursting(true);

            // Reset after 3 seconds
            const timer = setTimeout(() => setIsBursting(false), 3000);

            prevCheckInRef.current = lastCheckIn;
            return () => clearTimeout(timer);
        }
    }, [lastCheckIn, role]);

    // Calculate today's symptom count
    const todaySymptomCount = symptoms.filter(s => {
        const date = (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any);
        return date.toDateString() === new Date().toDateString();
    }).length;

    // Calculate completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Derived status for Relative mode
    const status = React.useMemo(() => {
        if (todaySymptomCount > 0) return 'symptom';
        if (completionRate < 50 && totalTasks > 0) return 'warning';
        if (completionRate >= 80) return 'calm';
        return 'neutral';
    }, [todaySymptomCount, completionRate, totalTasks]);

    // Theme mapping
    const theme = React.useMemo(() => {
        switch (status) {
            case 'symptom':
                return {
                    gradient: 'from-rose-400 to-orange-500',
                    blob: 'fill-rose-200/40',
                    pulseScale: [1, 1.15, 1],
                    label: t('dashboard_symptoms'),
                    icon: AlertCircle,
                    shadow: 'shadow-rose-200/50'
                };
            case 'warning':
                return {
                    gradient: 'from-amber-400 to-orange-400',
                    blob: 'fill-amber-200/40',
                    pulseScale: [1, 1.05, 1],
                    label: t('dashboard_tasks_missing'),
                    icon: Clock,
                    shadow: 'shadow-amber-100/50'
                };
            case 'calm':
                return {
                    gradient: 'from-teal-400 to-emerald-500',
                    blob: 'fill-teal-100/40',
                    pulseScale: [1, 1.02, 1],
                    label: t('peace_all_well'),
                    icon: CheckCircle,
                    shadow: 'shadow-teal-100/50'
                };
            default:
                return {
                    gradient: 'from-stone-400 to-stone-500',
                    blob: 'fill-stone-200/40',
                    pulseScale: [1, 1, 1],
                    label: t('peace_good_day'),
                    icon: Activity,
                    shadow: 'shadow-stone-100/50'
                };
        }
    }, [status, t]);

    // ========== SENIOR MODE ==========
    if (role === 'senior') {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                <h2 className="text-xl font-semibold theme-text mb-4">{t('pain_question')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="primary"
                        size="large"
                        className="w-full min-h-32 py-4"
                        onClick={onCheckIn}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <CheckCircle className="w-10 h-10 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_good')}</span>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        size="large"
                        className="w-full min-h-32 py-4 bg-orange-50 text-orange-800 border-2 border-orange-100 hover:bg-orange-100"
                        onClick={onOpenSymptomModal}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Heart className="w-10 h-10 text-orange-500 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_pain')}</span>
                        </div>
                    </Button>
                </div>
            </div>
        );
    }

    // ========== RELATIVE MODE ==========
    return (
        <motion.div
            layout
            className={`
                relative overflow-hidden rounded-[2rem] p-8 shadow-2xl border border-white/30
                bg-gradient-to-br ${theme.gradient}
                ${theme.shadow}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden blur-3xl opacity-60">
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute -top-1/4 -left-1/4 w-full h-full"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <path
                        className={theme.blob}
                        d="M33,-47.1C43.3,-40.3,52.5,-30.9,57.1,-19.5C61.7,-8,61.7,5.5,57.9,18C54,30.5,46.3,42,35.3,49.8C24.3,57.6,10.1,61.7,-3.4,66.4C-16.9,71.1,-29.7,76.4,-40.7,71.7C-51.7,67,-61,52.3,-66.2,37.3C-71.4,22.3,-72.6,7,-67.7,-5.7C-62.8,-18.3,-51.8,-28.3,-40.3,-35.1C-28.8,-41.8,-16.8,-45.3,-4.2,-39.5C8.3,-33.7,19.9,-18.6,33,-47.1Z"
                        transform="translate(50 50)"
                    />
                </motion.svg>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Senior Presence Heartbeat - Bursts when check-in detected! */}
                <div className="relative mb-6">
                    <motion.div
                        className="absolute inset-0 bg-white/40 rounded-full blur-xl"
                        animate={{
                            scale: isBursting ? [1, 1.5, 1, 1.3, 1] : theme.pulseScale,
                            opacity: isBursting ? [0.5, 1, 0.5, 0.8, 0.3] : [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: isBursting ? 0.6 : (status === 'calm' ? 4 : status === 'warning' ? 2 : 1.5),
                            repeat: isBursting ? 5 : Infinity,
                            ease: isBursting ? "easeOut" : "easeInOut"
                        }}
                    />
                    <motion.div
                        className="p-1.5 bg-white/20 rounded-full backdrop-blur-xl border border-white/40"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Avatar id="senior" size="xl" className="border-4 border-white shadow-xl" />
                    </motion.div>
                </div>

                {/* Status Messaging */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-2"
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {theme.label}
                        </h2>
                        <p className="text-white/80 font-medium text-lg drop-shadow-sm px-4">
                            {status === 'calm'
                                ? t('peace_sub_all_well', { name: seniorName })
                                : status === 'symptom'
                                    ? t('dashboard_symptoms_sub', { count: todaySymptomCount })
                                    : t('dashboard_tasks_missing_sub')}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Secondary Info Pills */}
                <div className="mt-8 flex gap-3">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Clock className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {typeof lastCheckIn === 'string' ? lastCheckIn : '-'}
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Activity className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {completionRate}% {t('taken')}
                    </div>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </motion.div>
    );
};

export default AmbientHero;

```
---

## File: tryg-app\src\features\ambient\BriefingStory.tsx
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { getDailyBriefing } from '../../utils/briefing';

export interface BriefingStoryProps {
    className?: string;
}

/**
 * BriefingStory - Natural language summary of the senior's day.
 * Shared by both Senior and Relative roles in the AmbientTab.
 * Uses the getDailyBriefing utility to generate an emotionally-aware message.
 */
export const BriefingStory: React.FC<BriefingStoryProps> = ({ className = '' }) => {
    const { t } = useTranslation();
    const {
        tasks = [],
        symptoms = [],
        seniorName,
        lastCheckIn
    } = useCareCircleContext();

    const briefing = getDailyBriefing({
        tasks,
        symptoms,
        seniorName,
        lastCheckIn,
        t
    });

    return (
        <div
            className={`p-5 rounded-[1.5rem] border-2 shadow-sm transition-all duration-300 ${briefing.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 shadow-emerald-50/50'
                    : briefing.type === 'warning'
                        ? 'bg-amber-50 border-amber-100 shadow-amber-50/50'
                        : 'bg-stone-50 border-stone-200 shadow-stone-50/50'
                } ${className}`}
        >
            <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-sm">{briefing.emoji}</span>
                <div className="flex-1">
                    <p
                        className={`text-lg font-semibold leading-relaxed ${briefing.type === 'success'
                                ? 'text-emerald-900'
                                : briefing.type === 'warning'
                                    ? 'text-amber-900'
                                    : 'text-stone-800'
                            }`}
                    >
                        {briefing.message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BriefingStory;

```
---

## File: tryg-app\src\features\ambient\index.ts
```ts
// Ambient Feature - Unified AmbientTab Components
export { AmbientHero } from './AmbientHero';
export { BriefingStory } from './BriefingStory';
export { ActivityTimeline } from './ActivityTimeline';

```
---

## File: tryg-app\src\features\coffee\CoffeeInviteCard.tsx
```tsx
import { Coffee } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { usePings } from '../thinkingOfYou/usePings';
import { useTranslation } from 'react-i18next';

export const CoffeeInviteCard = () => {
    const {
        careCircleId,
        currentUserId,
        userName,
        seniorStatus,
        setMyStatus,
        seniorName
    } = useCareCircleContext();
    const { t } = useTranslation();
    const { sendPing } = usePings(careCircleId, currentUserId);

    if (seniorStatus?.status !== 'coffee_ready') return null;

    const handleAcceptInvite = async () => {
        // Update relative's status to notify the circle they are coming
        await setMyStatus('traveling');
        // Send a response ping to the senior
        await sendPing('senior', 'coffee_coming', t('coffee_coming_msg', { name: userName }));
    };

    return (
        <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-1 shadow-xl animate-slide-in mb-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                    <Coffee className="w-8 h-8 text-amber-600 animate-wiggle" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-amber-950">{t('coffee_invite_title', { name: seniorName })}</h3>
                    <p className="text-amber-800/80 text-sm">{t('coffee_invite_sub')}</p>
                </div>
                <Button size="small" variant="primary" onClick={handleAcceptInvite}>
                    {t('coffee_invite_accept')}
                </Button>
            </div>
        </div>
    );
};

export default CoffeeInviteCard;

```
---

## File: tryg-app\src\features\coffee\CoffeeToggle.tsx
```tsx
import { Coffee } from 'lucide-react';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { useTranslation } from 'react-i18next';
import { usePings } from '../thinkingOfYou/usePings';

/**
 * Coffee availability toggle for seniors.
 * Broadcasts "coffee_ready" status to relatives and sends a ping notification.
 * Uses amber color palette intentionally to evoke coffee warmth.
 * @returns {JSX.Element} Coffee toggle button component
 */
export const CoffeeToggle = () => {
    const {
        myStatus,
        setMyStatus,
        seniorStatus,
        careCircleId,
        currentUserId
    } = useCareCircleContext();
    const { t } = useTranslation();
    const { sendPing } = usePings(careCircleId, currentUserId);

    const isCoffeeTime = myStatus === 'coffee_ready';
    const isCoffeeComing = myStatus === 'coffee_coming' || seniorStatus?.status === 'coffee_coming';

    const toggleCoffee = async () => {
        if (isCoffeeTime) {
            // Turn it off (back to normal home)
            await setMyStatus('home');
        } else {
            // Turn it on
            await setMyStatus('coffee_ready');
            // Send a ping to relatives
            await sendPing('relative');
        }
    };

    return (
        <button
            onClick={toggleCoffee}
            className={`
                relative w-full p-6 rounded-3xl transition-all duration-500 border-2
                flex items-center justify-between overflow-hidden
                ${isCoffeeTime
                    ? 'bg-amber-100 border-amber-400 shadow-amber-200 shadow-lg scale-[1.02]'
                    : 'bg-stone-50 border-stone-200 grayscale-[0.5]'
                }
                ${isCoffeeComing ? 'ring-4 ring-green-400' : ''}
            `}
        >
            <div className="z-10 text-left">
                <h3 className={`text-xl font-bold ${isCoffeeTime ? 'text-amber-900' : 'text-stone-500'}`}>
                    {isCoffeeTime ? t('status_coffee_ready') : t('coffee_give_button')}
                </h3>
                <p className={`text-sm ${isCoffeeTime ? 'text-amber-800' : 'text-stone-400'}`}>
                    {isCoffeeTime
                        ? (isCoffeeComing ? t('coffee_coming_title') : t('coffee_ready_desc'))
                        : t('coffee_off_desc')}
                </p>
            </div>

            {/* The Icon */}
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                ${isCoffeeTime ? 'bg-amber-500 text-white animate-bounce-slow' : 'bg-stone-200 text-stone-400'}
            `}>
                <Coffee size={32} />
            </div>

            {/* Background Steam Effect (CSS Decoration) */}
            {isCoffeeTime && (
                <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
            )}
        </button>
    );
};

export default CoffeeToggle;

```
---

## File: tryg-app\src\features\coffee\index.ts
```ts
export { CoffeeToggle } from './CoffeeToggle';
export { CoffeeInviteCard } from './CoffeeInviteCard';

```
---

## File: tryg-app\src\features\familyPresence\AmbientDashboard.tsx
```tsx
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/ui/Avatar';
import { Task } from '../../types';

export interface AmbientDashboardProps {
    seniorName: string;
    lastCheckIn?: any;
    tasks: Task[];
    symptomCount: number;
    className?: string;
}

/**
 * AmbientDashboard - A passive, atmospheric view of the senior's status.
 * Communicates wellbeing through color, light, and motion instead of just data.
 */
export const AmbientDashboard: React.FC<AmbientDashboardProps> = ({
    seniorName,
    lastCheckIn,
    tasks,
    symptomCount,
    className = ""
}) => {
    const { t } = useTranslation();

    // Calculate completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Derived Status state
    const status = useMemo(() => {
        if (symptomCount > 0) return 'symptom';
        if (completionRate < 50 && totalTasks > 0) return 'warning';
        if (completionRate >= 80) return 'calm';
        return 'neutral';
    }, [symptomCount, completionRate, totalTasks]);

    // Theme mapping for the ambient feel
    const theme = useMemo(() => {
        switch (status) {
            case 'symptom':
                return {
                    gradient: 'from-rose-400 to-orange-500',
                    blob: 'fill-rose-200/40',
                    pulseScale: [1, 1.15, 1],
                    label: t('dashboard_symptoms'),
                    icon: AlertCircle,
                    shadow: 'shadow-rose-200/50'
                };
            case 'warning':
                return {
                    gradient: 'from-amber-400 to-orange-400',
                    blob: 'fill-amber-200/40',
                    pulseScale: [1, 1.05, 1],
                    label: t('dashboard_tasks_missing'),
                    icon: Clock,
                    shadow: 'shadow-amber-100/50'
                };
            case 'calm':
                return {
                    gradient: 'from-teal-400 to-emerald-500',
                    blob: 'fill-teal-100/40',
                    pulseScale: [1, 1.02, 1],
                    label: t('peace_all_well'),
                    icon: CheckCircle,
                    shadow: 'shadow-teal-100/50'
                };
            default:
                return {
                    gradient: 'from-stone-400 to-stone-500',
                    blob: 'fill-stone-200/40',
                    pulseScale: [1, 1, 1],
                    label: t('peace_good_day'),
                    icon: Activity,
                    shadow: 'shadow-stone-100/50'
                };
        }
    }, [status, t]);

    return (
        <motion.div
            layout
            className={`
                relative overflow-hidden rounded-[2rem] p-8 shadow-2xl border border-white/30
                bg-gradient-to-br ${theme.gradient}
                ${theme.shadow} ${className}
            `}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 z-0 overflow-hidden blur-3xl opacity-60">
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute -top-1/4 -left-1/4 w-full h-full"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <path
                        className={theme.blob}
                        d="M33,-47.1C43.3,-40.3,52.5,-30.9,57.1,-19.5C61.7,-8,61.7,5.5,57.9,18C54,30.5,46.3,42,35.3,49.8C24.3,57.6,10.1,61.7,-3.4,66.4C-16.9,71.1,-29.7,76.4,-40.7,71.7C-51.7,67,-61,52.3,-66.2,37.3C-71.4,22.3,-72.6,7,-67.7,-5.7C-62.8,-18.3,-51.8,-28.3,-40.3,-35.1C-28.8,-41.8,-16.8,-45.3,-4.2,-39.5C8.3,-33.7,19.9,-18.6,33,-47.1Z"
                        transform="translate(50 50)"
                    />
                </motion.svg>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center text-center">

                {/* Senior Presence Heartbeat */}
                <div className="relative mb-6">
                    <motion.div
                        className="absolute inset-0 bg-white/40 rounded-full blur-xl"
                        animate={{
                            scale: theme.pulseScale,
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: status === 'calm' ? 4 : status === 'warning' ? 2 : 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="p-1.5 bg-white/20 rounded-full backdrop-blur-xl border border-white/40"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Avatar id="senior" size="xl" className="border-4 border-white shadow-xl" />
                    </motion.div>
                </div>

                {/* Status Messaging */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-2"
                    >
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {theme.label}
                        </h2>
                        <p className="text-white/80 font-medium text-lg drop-shadow-sm px-4">
                            {status === 'calm'
                                ? t('peace_sub_all_well', { name: seniorName })
                                : status === 'symptom'
                                    ? t('dashboard_symptoms_sub', { count: symptomCount })
                                    : t('dashboard_tasks_missing_sub')}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Secondary Info Pill */}
                <div className="mt-8 flex gap-3">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Clock className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {typeof lastCheckIn === 'string' ? lastCheckIn : '-'}
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                        <Activity className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                        {completionRate}% {t('taken')}
                    </div>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </motion.div>
    );
};

```
---

## File: tryg-app\src\features\familyPresence\FamilyConstellation.tsx
```tsx
import { useMemo } from 'react';
import { Member } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { SuperpowerBadge, Archetype } from './SuperpowerBadge';
import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FamilyConstellationProps {
    members: Member[];
    centerMemberName: string;
    currentUserId?: string;
    onMemberClick?: (member: Member) => void;
    onBadgeAction?: (action: 'call' | 'message', memberName: string) => void;
}

// Determine which ring based on accessLevel from Firestore
const getOrbitLayer = (member: Member): 'inner' | 'outer' => {
    if (member.accessLevel === 'admin' || member.accessLevel === 'caregiver') {
        return 'inner';
    }

    const rel = member.relationship?.toLowerCase();
    if (['son', 'daughter', 'husband', 'wife', 'spouse', 'sister', 'brother'].includes(rel || '')) {
        return 'inner';
    }

    return 'outer';
};

const INNER_RADIUS = 110;
const OUTER_RADIUS = 160;
const CENTER_XY = 200;

export const FamilyConstellation: React.FC<FamilyConstellationProps> = ({
    members,
    centerMemberName,
    onMemberClick,
    onBadgeAction
}) => {
    const relatives = useMemo(() => members.filter(m => m.role !== 'senior'), [members]);

    const positionedMembers = useMemo(() => {
        const innerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'inner');
        const outerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'outer');

        const calculatePos = (list: Member[], radius: number, offsetAngle: number = 0) => {
            return list.map((member, index) => {
                const count = list.length || 1;
                const angle = (index / count) * 2 * Math.PI + offsetAngle;
                return {
                    ...member,
                    x: CENTER_XY + radius * Math.cos(angle),
                    y: CENTER_XY + radius * Math.sin(angle)
                };
            });
        };

        return [
            ...calculatePos(innerRingMembers, INNER_RADIUS, 0),
            ...calculatePos(outerRingMembers, OUTER_RADIUS, Math.PI / 4)
        ];
    }, [relatives]);

    const getAvatarId = (name: string) => {
        const lower = name?.toLowerCase() || '';
        if (lower.includes('fatima') || lower === 'test user') return 'fatima';
        if (lower === 'brad') return 'brad';
        return 'louise';
    };

    // Default archetype based on name/relationship if not set in Firestore
    const getArchetype = (member: Member): Archetype | undefined => {
        if (member.archetype) return member.archetype as Archetype;

        // Fallback defaults when Firestore doesn't have archetype
        const name = member.displayName?.toLowerCase() || '';
        if (name.includes('fatima')) return 'tech_wizard';
        if (name.includes('louise')) return 'fixer';
        if (name.includes('brad')) return 'cheerleader';

        // Default based on orbit layer
        return getOrbitLayer(member) === 'inner' ? 'listener' : 'driver';
    };

    return (
        <div className="w-full aspect-square max-w-md mx-auto relative bg-slate-50/50 rounded-full border border-slate-100 shadow-inner">
            <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none">
                {/* Orbit Rings */}
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={INNER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6"
                />
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={OUTER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"
                />

                {/* Center Pulse Effect */}
                <circle cx={CENTER_XY} cy={CENTER_XY} r="45" fill="url(#centerGradient)" opacity="0.1" className="animate-pulse" />
                <defs>
                    <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Senior (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
                <div className="relative">
                    <Avatar id="senior" size="lg" className="border-4 border-white shadow-lg z-10" />
                    <Heart className="absolute -top-2 -right-2 w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
                </div>
                <span className="mt-1 text-xs font-bold text-slate-600 bg-white/80 px-2 rounded-full">{centerMemberName}</span>
            </div>

            {/* Relatives (Planets) */}
            {positionedMembers.map((member) => (
                <button
                    key={member.docId || member.id}
                    onClick={() => onMemberClick?.(member)}
                    className={cn(
                        "absolute w-12 h-12 -ml-6 -mt-6 rounded-full",
                        "transition-transform hover:scale-110 active:scale-95",
                        "pointer-events-auto group"
                    )}
                    style={{ left: member.x, top: member.y }}
                    aria-label={`View ${member.displayName}`}
                >
                    {/* Avatar */}
                    <Avatar
                        id={getAvatarId(member.displayName)}
                        size="md"
                        className={cn(
                            "border-2 shadow-md",
                            getOrbitLayer(member) === 'inner' ? "border-indigo-200" : "border-amber-200"
                        )}
                    />

                    {/* Superpower Badge - always show with fallback */}
                    <div className="absolute -bottom-1 -right-1 z-20">
                        <SuperpowerBadge
                            archetype={getArchetype(member)!}
                            memberName={member.displayName}
                            onAction={onBadgeAction}
                            size="sm"
                        />
                    </div>

                    {/* Name Label (Hover Tooltip) */}
                    <div className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-1",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        "bg-white/90 px-2 py-0.5 rounded-md shadow-sm",
                        "text-xs font-bold text-slate-700 whitespace-nowrap",
                        "pointer-events-none z-30"
                    )}>
                        {member.displayName}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default FamilyConstellation;

```
---

## File: tryg-app\src\features\familyPresence\FamilyPresence.tsx
```tsx
import React from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// @ts-ignore - Context not yet converted
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Avatar } from '../../components/ui/Avatar';
import { MemberStatus } from './useMemberStatus';

interface MemberStatusRowProps {
    name: string;
    status: string;
    role: string;
    timestamp?: any;
    isCurrentUser?: boolean;
}

const MemberStatusRow: React.FC<MemberStatusRowProps> = ({ name, status, role, timestamp, isCurrentUser = false }) => {
    const { t } = useTranslation();
    const avatarId = role === 'senior' ? 'senior' :
        (name.includes('Fatima') || name === 'Test User') ? 'fatima' :
            name === 'Brad' ? 'brad' : 'louise';

    const statusIdMapping: Record<string, string> = {
        'home': 'home',
        'work': 'work',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon',
        'good': 'home',
        'default': 'home'
    };

    const statusIconId = statusIdMapping[status] || 'home';
    const config = role === 'senior'
        ? { label: t('peace_all_well'), color: 'text-green-600' }
        : { label: t(`status_${status}`), color: 'text-stone-500' };

    let timeString = '';
    if (timestamp) {
        const date = (timestamp && typeof timestamp.toDate === 'function')
            ? timestamp.toDate()
            : new Date(timestamp);

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
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
            <div className="flex items-center gap-3">
                {/* Avatar with connection glow when available */}
                <div className={`relative ${status === 'available' ? 'animate-glow' : ''}`}>
                    <Avatar id={avatarId} size="md" className="shadow-sm border-2 border-white" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'available' ? 'bg-teal-500' :
                        status === 'home' ? 'bg-green-500' :
                            status === 'work' ? 'bg-indigo-500' :
                                status === 'traveling' ? 'bg-amber-500' : 'bg-stone-400'
                        }`} />
                </div>
                <div>
                    <span className={`text-sm font-bold block text-left ${isCurrentUser ? 'text-indigo-900' : 'text-stone-700'}`}>
                        {name} {isCurrentUser && <span className="opacity-50 text-xs font-normal">({t('you')})</span>}
                    </span>
                    <span className={`text-xs font-medium block text-left ${config.color || 'text-stone-500'}`}>
                        {config.label}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
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

export const FamilyPresence: React.FC<FamilyPresenceProps> = ({
    memberStatuses: propsMembers,
    currentUserId: propsUserId,
    seniorName: propsSeniorName,
    compact = false
}) => {
    const { t } = useTranslation();
    const context = useCareCircleContext() as any;
    const memberStatuses = propsMembers ?? context?.memberStatuses ?? [];
    const currentUserId = propsUserId ?? context?.currentUserId;
    const seniorName = propsSeniorName ?? context?.seniorName ?? 'Far/Mor';

    if (memberStatuses.length === 0) {
        return (
            <div className={`bg-stone-50 rounded-xl ${compact ? 'p-3' : 'p-4'} border border-stone-200`}>
                <p className="text-stone-400 text-sm text-center">{t('no_relatives')}</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl ${compact ? 'p-3' : 'p-4'} border border-stone-100 shadow-sm overflow-hidden`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                        <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                        {t('family_circle')}
                    </h4>
                </div>
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

## File: tryg-app\src\features\familyPresence\index.ts
```ts
// Family Presence Feature - Public API
export { FamilyPresence } from './FamilyPresence';
export { StatusCard, StatusSelector, StatusList, STATUS_OPTIONS } from './StatusCard';
export { useMemberStatus } from './useMemberStatus';
export { FamilyConstellation } from './FamilyConstellation';
export { SuperpowerBadge, ArchetypeSelector, ARCHETYPE_CONFIG } from './SuperpowerBadge';

```
---

## File: tryg-app\src\features\familyPresence\StatusCard.tsx
```tsx
import React from 'react';
import { Clock, Pill, Briefcase, Home, Car, Coffee, Moon } from 'lucide-react';
import { InlineGatesIndicator } from '../tasks/ProgressRing';
import { Avatar } from '../../components/ui/Avatar';
import { Task, MemberStatus } from '../../types';
import { useTranslation } from 'react-i18next';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

interface StatusOption {
    id: string;
    label: string;
    icon: React.ElementType;
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
export const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onStatusChange }) => {
    const { t } = useTranslation();
    return (
        <div className="flex gap-2 justify-between">
            {STATUS_OPTIONS.map(status => {
                const isActive = currentStatus === status.id;
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
                        title={t(`status_${status.id}`)}
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
                            {t(`status_${status.id}`)}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StatusCardProps {
    mode?: 'senior' | 'relative';
    name?: string;
    status?: string;
    timestamp?: any;
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
 */
export const StatusCard: React.FC<StatusCardProps> = ({
    mode = 'relative',
    name = 'Bruger',
    status: statusId,
    timestamp,
    className = '',
    completionRate = 0,
    tasks = [],
    symptomCount = 0,
    onViewSymptoms = null
}) => {
    const { t } = useTranslation();

    if (mode === 'senior') {
        const getSeniorStatus = () => {
            if (!timestamp) return {
                label: t('waiting_first_check'),
                theme: 'neutral',
                bgPos: '50% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 80 && symptomCount === 0) return {
                label: t('peace_all_well'),
                theme: 'calm',
                bgPos: '0% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 50) return {
                label: t('peace_good_day'),
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
                label: t('peace_check_in'),
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
                    ${statusInfo.theme === 'calm' ? 'animate-breathe' : ''}
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
                                    <span>{t('last_checked_in')}: {typeof timestamp === 'string' ? timestamp : '-'}</span>
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
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">{t('peace_check_in')}</p>
                                <p className="text-sm font-bold">{typeof timestamp === 'string' ? timestamp : t('peace_check_in')}</p>
                            </div>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">{t('medication_title')}</p>
                                <p className="text-sm font-bold">{completionRate}% {t('taken')}</p>
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

    const statusObj = STATUS_OPTIONS.find(s => s.id === statusId) || STATUS_OPTIONS[0];
    const avatarId = ({
        'work': 'work',
        'home': 'home',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon'
    } as Record<string, string>)[statusId || ''] || 'home';

    let timeString = '-';
    if (timestamp) {
        if (typeof timestamp === 'string') {
            timeString = timestamp;
        } else {
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
                            {t(`status_${statusObj.id}`)}
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

interface StatusListProps {
    members?: MemberStatus[];
    relativeStatuses?: any[];
    lastUpdated?: any;
    maxDisplay?: number;
}

export const StatusList: React.FC<StatusListProps> = ({
    members = [],
    relativeStatuses = [],
    lastUpdated,
    maxDisplay = 3
}) => {
    const { t } = useTranslation();
    const relatives = members.filter(m => m.role === 'relative');

    if (relatives.length === 0 && relativeStatuses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-100 mb-4">
                <p className="text-stone-400 text-sm text-center">{t('no_relatives')}</p>
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
                    key={member.docId || member.userId || index}
                    name={member.displayName || 'Pårørende'}
                    status={member.status}
                    timestamp={member.updatedAt || lastUpdated}
                />
            ))}
            {hiddenCount > 0 && (
                <div className="text-center py-2">
                    <span className="text-sm text-stone-400">
                        +{hiddenCount} {hiddenCount === 1 ? t('more') : t('others')}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatusCard;

```
---

## File: tryg-app\src\features\familyPresence\SuperpowerBadge.tsx
```tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { Wifi, Ear, Wrench, Car, Star, Phone, MessageCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type Archetype = 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader';

interface ArchetypeConfig {
    id: Archetype;
    icon: React.ElementType;
    label: string;
    description: string;
    action: string;
    color: string;
}

export const ARCHETYPE_CONFIG: Record<Archetype, ArchetypeConfig> = {
    tech_wizard: {
        id: 'tech_wizard',
        icon: Wifi,
        label: 'Teknik-Ekspert',
        description: 'Ring når iPad driller eller WiFi ikke virker',
        action: 'call',
        color: 'bg-blue-600'
    },
    listener: {
        id: 'listener',
        icon: Ear,
        label: 'Lytteren',
        description: 'Ring for en god snak og lidt trøst',
        action: 'call',
        color: 'bg-purple-600'
    },
    fixer: {
        id: 'fixer',
        icon: Wrench,
        label: 'Fikser-Typen',
        description: 'Ring når noget skal repareres derhjemme',
        action: 'call',
        color: 'bg-orange-600'
    },
    driver: {
        id: 'driver',
        icon: Car,
        label: 'Chaufføren',
        description: 'Ring for en tur til lægen eller butikken',
        action: 'call',
        color: 'bg-green-600'
    },
    cheerleader: {
        id: 'cheerleader',
        icon: Star,
        label: 'Heppen',
        description: 'Del gode nyheder og få et stort smil',
        action: 'message',
        color: 'bg-amber-500'
    }
};

/**
 * Badge size variants using CVA
 */
const badgeVariants = cva(
    "rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform hover:scale-110 active:scale-95",
    {
        variants: {
            size: {
                sm: "w-5 h-5",
                md: "w-8 h-8",
            },
        },
        defaultVariants: {
            size: "sm",
        },
    }
);

const iconVariants = cva(
    "text-white",
    {
        variants: {
            size: {
                sm: "w-3 h-3",
                md: "w-5 h-5",
            },
        },
        defaultVariants: {
            size: "sm",
        },
    }
);

interface SuperpowerBadgeProps extends VariantProps<typeof badgeVariants> {
    archetype: Archetype;
    memberName: string;
    onAction?: (action: 'call' | 'message', memberName: string) => void;
    interactive?: boolean;
}

export const SuperpowerBadge: React.FC<SuperpowerBadgeProps> = ({
    archetype,
    memberName,
    onAction,
    size = 'sm',
    interactive = true
}) => {
    const [showActionSheet, setShowActionSheet] = useState(false);
    const config = ARCHETYPE_CONFIG[archetype];

    if (!config) return null;

    const Icon = config.icon;

    const handleTap = () => {
        if (!interactive) return;
        setShowActionSheet(true);
    };

    const handleAction = (actionType: 'call' | 'message') => {
        onAction?.(actionType, memberName);
        setShowActionSheet(false);
    };

    return (
        <>
            {/* Badge Button */}
            <button
                onClick={handleTap}
                className={cn(
                    badgeVariants({ size }),
                    config.color,
                    interactive && "cursor-pointer"
                )}
                aria-label={`${memberName} - ${config.label}`}
            >
                <Icon className={cn(iconVariants({ size }))} />
            </button>

            {/* Action Sheet Modal - Portal to escape CSS transform context */}
            {showActionSheet && createPortal(
                <div
                    className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-fade-in"
                    onClick={() => setShowActionSheet(false)}
                >
                    <div
                        className="bg-white w-11/12 max-w-sm rounded-2xl p-6 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", config.color)}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-800">{memberName}</p>
                                    <p className="text-sm text-slate-500">{config.label}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowActionSheet(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <p className="text-slate-600 mb-6">{config.description}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleAction('call')}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4",
                                    "bg-green-500 text-white font-bold rounded-2xl",
                                    "hover:bg-green-600 transition-colors"
                                )}
                            >
                                <Phone className="w-5 h-5" />
                                Ring op
                            </button>
                            <button
                                onClick={() => handleAction('message')}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4",
                                    "bg-indigo-500 text-white font-bold rounded-2xl",
                                    "hover:bg-indigo-600 transition-colors"
                                )}
                            >
                                <MessageCircle className="w-5 h-5" />
                                Send besked
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

// Settings Panel for relatives to choose their archetype
interface ArchetypeSelectorProps {
    currentArchetype?: Archetype;
    onSelect: (archetype: Archetype) => void;
}

export const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({
    currentArchetype,
    onSelect
}) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Vælg din superkraft</h3>
            <p className="text-xs text-slate-400 mb-4">Hvordan kan du bedst hjælpe familien?</p>

            <div className="grid grid-cols-1 gap-2">
                {Object.values(ARCHETYPE_CONFIG).map((config) => {
                    const Icon = config.icon;
                    const isSelected = currentArchetype === config.id;

                    return (
                        <button
                            key={config.id}
                            onClick={() => onSelect(config.id)}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                isSelected
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", config.color)}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn("font-bold", isSelected ? "text-indigo-700" : "text-slate-700")}>
                                    {config.label}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{config.description}</p>
                            </div>
                            {isSelected && (
                                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export { badgeVariants };
export default SuperpowerBadge;

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

import { PictogramPosition } from '../../components/ui/Pictogram';

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
import { HelpOffer, HelpRequest } from '../../types';

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
    seniorName: _seniorName = 'Senior'
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

## File: tryg-app\src\features\helpExchange\index.ts
```ts
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
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                            <span>{t('status_avail_now')}</span>
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
                        {t('maybe_later')}
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

import { HelpOffer, HelpRequest } from '../../types';

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

    const sanitizeHelpData = (data: Partial<HelpOffer | HelpRequest>) => {
        const clean: Record<string, any> = {};
        SAFE_HELP_FIELDS.forEach(key => {
            const val = (data as any)[key];
            if (val !== undefined && typeof val !== 'function' && typeof val !== 'symbol') {
                clean[key] = val;
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
import { HelpOffer, HelpRequest } from '../../types';
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

## File: tryg-app\src\features\memories\AudioRecorder.tsx
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    onReset?: () => void;
    placeholder?: string;
    maxLengthSeconds?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onRecordingComplete,
    onReset,
    placeholder,
    maxLengthSeconds = 300 // Default 5 minutes
}) => {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check if MediaRecorder is supported
            if (!window.MediaRecorder) {
                setError(t('audio_recorder_not_supported'));
                return;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onRecordingComplete(blob);

                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setDuration(0);

            // Timer for duration and max length
            timerRef.current = setInterval(() => {
                setDuration(prev => {
                    if (prev >= maxLengthSeconds) {
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err: any) {
            console.error('Recording error:', err);
            if (err.name === 'NotAllowedError') {
                setError(t('mic_permission_denied'));
            } else {
                setError(t('mic_access_error'));
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const handleReset = () => {
        setAudioUrl(null);
        setDuration(0);
        setError(null);
        if (onReset) onReset();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 transition-all">
            {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-medium animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {!audioUrl ? (
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`
                            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                            ${isRecording
                                ? 'bg-rose-500 scale-110 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                                : 'bg-teal-500 shadow-[0_10px_20px_rgba(20,184,166,0.3)] hover:scale-105 active:scale-95'
                            }
                        `}
                        aria-label={isRecording ? t('stop_recording') : t('start_recording')}
                    >
                        {isRecording ? <Square className="text-white fill-white w-8 h-8" /> : <Mic className="text-white w-8 h-8" />}
                    </button>

                    <div className="text-center">
                        <p className={`font-bold transition-colors ${isRecording ? 'text-rose-600' : 'text-stone-600'}`}>
                            {isRecording ? t('recording_active') : placeholder || t('press_to_tell_story')}
                        </p>
                        {isRecording && (
                            <p className="text-rose-400 font-mono text-xl mt-1">{formatDuration(duration)}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full space-y-4 animate-fade-in">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
                        <button
                            onClick={() => new Audio(audioUrl).play()}
                            className="w-12 h-12 bg-teal-100 flex items-center justify-center rounded-full hover:bg-teal-200 transition-colors group"
                            aria-label={t('play_recording')}
                        >
                            <Play className="w-6 h-6 text-teal-700 fill-teal-700 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 w-full opacity-30" />
                        </div>

                        <span className="text-sm font-mono text-stone-400">{formatDuration(duration)}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 flex items-center justify-center gap-2 p-3 bg-stone-100 text-stone-600 font-bold rounded-2xl hover:bg-stone-200 transition-colors active:scale-95"
                        >
                            <Trash2 className="w-5 h-5" />
                            {t('delete_and_retry')}
                        </button>
                        <div className="flex-[0.3] p-3 bg-teal-50 text-teal-600 flex items-center justify-center rounded-2xl">
                            <Check className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

```
---

## File: tryg-app\src\features\memories\MemoriesGallery.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Mic, Play, Calendar, User, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Memory {
    id: string;
    url: string;
    type: 'audio' | 'photo' | 'video';
    createdByName: string;
    createdAt: any;
    questionText?: string;
    duration?: number;
}

interface MemoriesGalleryProps {
    circleId: string;
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ circleId }) => {
    const { t } = useTranslation();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!circleId) return;

        const memoriesRef = collection(db, 'careCircles', circleId, 'memories');
        const q = query(memoriesRef, orderBy('createdAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const memoriesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Memory[];
            setMemories(memoriesList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [circleId]);

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="bg-stone-50 rounded-2xl p-8 text-center border-2 border-dashed border-stone-200">
                <History className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">{t('no_memories_yet')}</p>
                <p className="text-xs text-stone-400 mt-1">{t('memories_will_appear_here')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-500" />
                    {t('livsbog_title')}
                </h3>
                <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-1 rounded-full">
                    {memories.length} {t('stories')}
                </span>
            </div>

            <div className="grid gap-4">
                {memories.map((memory) => (
                    <div key={memory.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => new Audio(memory.url).play()}
                                className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                            >
                                <Play fill="currentColor" size={24} />
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-stone-800 truncate">
                                    {memory.questionText || t('untilted_memory')}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                                    <span className="flex items-center gap-1">
                                        <User size={12} />
                                        {memory.createdByName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {formatTime(memory.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mic size={12} />
                                        {memory.type === 'audio' ? t('audio') : memory.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

```
---

## File: tryg-app\src\features\memories\useMemories.ts
```ts
import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';

export interface MemoryMetadata {
    title?: string;
    description?: string;
    type: 'audio' | 'photo' | 'video';
    circleId: string;
    createdByUid: string;
    createdByName: string;
    questionId?: string;
    questionText?: string;
    duration?: number;
}

export const useMemories = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadMemory = useCallback(async (blob: Blob, metadata: MemoryMetadata) => {
        if (!metadata.circleId || !metadata.createdByUid) {
            setError('Missing required metadata (circleId or uid)');
            return null;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // 1. Generate unique file name
            const timestamp = Date.now();
            const extension = metadata.type === 'audio' ? 'webm' : 'jpg';
            const fileName = `memories/${metadata.circleId}/${metadata.type}_${timestamp}.${extension}`;
            const storageRef = ref(storage, fileName);

            // 2. Upload to Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, blob);

            return new Promise<string | null>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (err) => {
                        console.error('Upload error:', err);
                        setError(err.message);
                        setIsUploading(false);
                        reject(err);
                    },
                    async () => {
                        try {
                            // 3. Get Download URL
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

                            // 4. Save to Firestore
                            const memoriesRef = collection(db, 'careCircles', metadata.circleId, 'memories');
                            await addDoc(memoriesRef, {
                                ...metadata,
                                url: downloadUrl,
                                storagePath: fileName,
                                createdAt: serverTimestamp(),
                            });

                            setIsUploading(false);
                            setUploadProgress(100);
                            resolve(downloadUrl);
                        } catch (err: any) {
                            console.error('Firestore save error:', err);
                            setError(err.message);
                            setIsUploading(false);
                            reject(err);
                        }
                    }
                );
            });
        } catch (err: any) {
            console.error('Memory upload error initiation:', err);
            setError(err.message);
            setIsUploading(false);
            return null;
        }
    }, []);

    return {
        uploadMemory,
        isUploading,
        uploadProgress,
        error
    };
};

```
---

## File: tryg-app\src\features\photos\index.ts
```ts
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
import { Photo } from '../../types';

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
    isOpen: boolean;
    onClose: () => void;
    photo: Photo | null;
    onDelete: (id: string, storagePath?: string) => Promise<void>;
}

// Photo viewer modal (for recipient)
export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({ isOpen, onClose, photo, onDelete }) => {
    const [deleting, setDeleting] = useState(false);

    if (!isOpen || !photo) return null;

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
                    <button
                        onClick={onClose}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
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
    limit
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { resizeImage } from '../../utils/imageUtils';

import { Photo } from '../../types';

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
import { useTranslation } from 'react-i18next';

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
// Returns localized labels using translation function
export const getBodyRegions = (t: (key: string) => string): BodyRegion[] => [
    { id: 'head', label: t('body_head'), emoji: '🧠' },
    { id: 'neck', label: t('body_neck'), emoji: '🦴' },
    { id: 'chest', label: t('body_chest'), emoji: '❤️' },
    { id: 'back', label: t('body_back'), emoji: '🔙' },
    { id: 'stomach', label: t('body_stomach'), emoji: '🤢' },
    { id: 'leftArm', label: t('body_left_arm'), emoji: '💪' },
    { id: 'rightArm', label: t('body_right_arm'), emoji: '💪' },
    { id: 'leftLeg', label: t('body_left_leg'), emoji: '🦵' },
    { id: 'rightLeg', label: t('body_right_leg'), emoji: '🦵' },
];

// Pain severity levels - simple 3-level scale (localized)
export const getSeverityLevels = (t: (key: string) => string): SeverityLevel[] => [
    { id: 'mild', label: t('severity_mild'), emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: t('severity_moderate'), emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: t('severity_severe'), emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

// Keep the old exports for backwards compatibility (Danish fallback)
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
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1 = location, 2 = severity
    const [selectedLocation, setSelectedLocation] = useState<BodyRegion | null>(null);
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);

    // Get localized regions and severity levels
    const bodyRegions = getBodyRegions(t);
    const severityLevels = getSeverityLevels(t);

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
                        {t('where_does_it_hurt')}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {bodyRegions.map(region => (
                            <button
                                key={region.id}
                                onClick={() => handleLocationSelect(region)}
                                className="p-4 rounded-2xl border-2 transition-all duration-200
                                    flex items-center gap-3 text-left
                                    bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50
                                    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                                aria-label={t('select_location', { label: region.label })}
                            >
                                <span className="text-2xl">{region.emoji}</span>
                                <span className="font-semibold text-stone-700">{region.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label={t('go_back_symptom_selection')}
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        {t('back')}
                    </button>
                </>
            ) : (
                // Step 2: Pain severity selection
                <>
                    <div className="text-center mb-4">
                        <span className="text-3xl">{selectedLocation?.emoji}</span>
                        <p className="text-lg text-stone-600 mt-2">
                            {t('pain_how_much', { location: selectedLocation?.label.toLowerCase() })}
                        </p>
                    </div>

                    <div className="space-y-3 mb-4">
                        {severityLevels.map(level => (
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
                                aria-label={t('pain_level_label', { level: level.label })}
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
                            aria-label={t('confirm')}
                        >
                            {t('confirm')}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={handleBackToLocation}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 
                            focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label={t('select_another_location')}
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        {t('select_another_location')}
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

## File: tryg-app\src\features\symptoms\index.ts
```ts
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
import { useTranslation } from 'react-i18next';
import { SymptomLog } from '../../types';

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
const analyzeTrend = (symptoms: SymptomLog[], t: any): TrendAnalysis => {
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
            message: t('severe_symptoms_count', { count: severeCount }),
            cta: { icon: Phone, text: t('contact_doctor_cta'), action: 'call' }
        };
    }

    if (last3Days > prev4Days * 1.5 && last3Days >= 3) {
        return {
            trend: 'increasing',
            message: t('increasing_symptoms_msg'),
            cta: { icon: Calendar, text: t('book_doctor_cta'), action: 'book' }
        };
    }

    if (last3Days < prev4Days * 0.5) {
        return {
            trend: 'decreasing',
            message: t('decreasing_symptoms_msg'),
            cta: null
        };
    }

    return {
        trend: 'stable',
        message: t('stable_symptoms_msg', { count: symptoms.length }),
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
    const { t } = useTranslation();
    const [showOlder, setShowOlder] = useState(false);

    // Split symptoms
    const { todaySymptoms, weekSymptoms } = useMemo(() => {
        const today = symptomLogs.filter(s => isToday(s.loggedAt));
        const week = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7) && !isToday(s.loggedAt));
        return { todaySymptoms: today, weekSymptoms: week };
    }, [symptomLogs]);

    // Get trend analysis
    const weeklySymptoms = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7));
    const trend = useMemo(() => analyzeTrend(weeklySymptoms, t), [weeklySymptoms, t]);

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
                            {t('symptoms_today_count', { count: todaySymptoms.length })}
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
                                {trend.message || t('symptoms_this_week', { count: weekSymptoms.length })}
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
                    {t('see_full_history')}
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

import { SymptomLog, SymptomStats } from '../../types';

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

    const sanitizeSymptomData = (data: Partial<SymptomLog>) => {
        const clean: Record<string, any> = {};
        SAFE_SYMPTOM_FIELDS.forEach(key => {
            const val = (data as any)[key];
            if (val !== undefined && typeof val !== 'function' && typeof val !== 'symbol') {
                clean[key] = val;
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

## File: tryg-app\src\features\tasks\index.ts
```ts
// Tasks Feature - Public API
export { ProgressRing, InlineGatesIndicator } from './ProgressRing';
export { TimePickerModal } from './TimePickerModal';
export { useTasks } from './useTasks';

```
---

## File: tryg-app\src\features\tasks\ProgressRing.tsx
```tsx
import { Task } from '../../types';
import { cn } from '../../lib/utils';

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
            {/* SVG Ring with celebratory glow at 100% */}
            <svg
                width={size}
                height={size}
                className={cn(
                    "transform -rotate-90 transition-all duration-1000",
                    progressPercent === 100 && "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                )}
            >
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
                {segments.map((seg) => (
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
export const ProgressRingCompact: React.FC<ProgressRingCompactProps> = ({ tasks = [] }) => {
    const currentHour = new Date().getHours();
    const segments = (['morgen', 'eftermiddag', 'aften'] as Period[]).map(period =>
        getSegmentStatus(tasks, period, currentHour)
    );

    const hasOverdue = segments.includes('overdue');
    const hasLate = segments.includes('late');

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

## File: tryg-app\src\features\tasks\TaskCard.tsx
```tsx
import { cva } from 'class-variance-authority';
import { CheckCircle, Pill, Activity, Sun, Clock, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from '../../types';

/**
 * Task card container variants
 */
const cardVariants = cva(
    "relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
    {
        variants: {
            state: {
                completed: "bg-stone-100 border-stone-200",
                pending: "bg-white border-stone-200 shadow-sm hover:border-teal-400",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

const iconContainerVariants = cva(
    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
    {
        variants: {
            state: {
                completed: "bg-stone-200 text-stone-400",
                pending: "bg-blue-50 text-blue-600",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

const checkboxVariants = cva(
    "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors",
    {
        variants: {
            state: {
                completed: "bg-teal-500 border-teal-500",
                pending: "border-stone-200 bg-white",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

interface TaskCardProps {
    task: Task;
    onToggle: () => void;
}

const TASK_ICONS: Record<string, React.ElementType> = {
    medication: Pill,
    hydration: Activity,
    activity: Sun,
    appointment: Clock,
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
    const state = task.completed ? 'completed' : 'pending';
    const Icon = TASK_ICONS[task.type || 'activity'] || Sun;

    return (
        <div
            onClick={onToggle}
            className={cn(cardVariants({ state }))}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Pictogram Container */}
                    <div className={cn(iconContainerVariants({ state }))}>
                        <Icon className="w-8 h-8" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn(
                                "text-xl font-bold",
                                task.completed ? "text-stone-500 line-through" : "text-stone-800"
                            )}>
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

                {/* Checkbox with celebration animation */}
                <div className={cn(
                    checkboxVariants({ state }),
                    task.completed && 'animate-celebrate relative'
                )}>
                    {task.completed && <CheckCircle className="text-white w-8 h-8" />}
                    {/* Celebration ring burst */}
                    {task.completed && (
                        <span className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-75" />
                    )}
                </div>
            </div>
        </div>
    );
};

export { cardVariants, iconContainerVariants, checkboxVariants };

```
---

## File: tryg-app\src\features\tasks\TimePickerModal.tsx
```tsx
import { useState } from 'react';
import { X, Clock, Phone } from 'lucide-react';
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
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { INITIAL_TASKS } from '../../data/constants';

import { Task } from '../../types';

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

    // Check for daily reset on load
    useEffect(() => {
        if (circleId && tasks.length > 0) {
            checkDailyReset(circleId, tasks);
        }
    }, [circleId, tasks.length > 0]);

    const checkDailyReset = async (cId: string, currentTasks: Task[]) => {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const circleRef = doc(db, 'careCircles', cId);
            const circleDoc = await getDoc(circleRef);

            if (circleDoc.exists()) {
                const data = circleDoc.data();
                if (data.lastResetDate !== today) {
                    console.log('🌅 New day detected! Resetting daily tasks...');
                    await performDailyReset(cId, currentTasks, today);
                }
            }
        } catch (err) {
            console.error('Error checking daily reset:', err);
        }
    };

    const performDailyReset = async (cId: string, currentTasks: Task[], dateStr: string) => {
        try {
            // 1. Reset all recurring tasks
            for (const task of currentTasks) {
                // Medication tasks are recurring by default
                const isMedication = task.type === 'medication' || task.title?.toLowerCase().includes('medicin');
                const isRecurring = task.recurring || isMedication;

                if (isRecurring) {
                    const docId = task.id.startsWith('task_') ? task.id : `task_${task.id}`;
                    await updateDoc(doc(db, 'careCircles', cId, 'tasks', docId), {
                        completed: false,
                        completedAt: null
                    });
                } else if (task.completed) {
                    // Optional: Archive or delete old non-recurring tasks
                    // For now, we'll just leave them or you could delete them if they are older than 24h
                }
            }

            // 2. Update the reset date
            await updateDoc(doc(db, 'careCircles', cId), {
                lastResetDate: dateStr
            });
            console.log('✅ Daily reset complete for', dateStr);
        } catch (err) {
            console.error('Error performing daily reset:', err);
        }
    };

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
                recurring: newTask.recurring || false,
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

## File: tryg-app\src\features\thinkingOfYou\index.ts
```ts
// Thinking of You Feature - Public API
export { ThinkingOfYouButton, ThinkingOfYouIconButton, PingNotification } from './ThinkingOfYou';
export { usePings } from './usePings';

```
---

## File: tryg-app\src\features\thinkingOfYou\ThinkingOfYou.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore - sounds util not converted yet
import { playPingSound } from '../../utils/sounds';
import { Avatar } from '../../components/ui/Avatar';
import { Ping } from '../../types';

interface FloatingHeart {
    id: number;
    x: number;
    size: number;
    duration: number;
}

// "Thinking of you" ping button - one-tap warmth without obligation
export const ThinkingOfYouButton: React.FC<{ onSendPing?: () => void, fromName?: string }> = ({ onSendPing }) => {
    const [isSending, setIsSending] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();

        // Create 5 random floating hearts
        const newHearts = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 200 - 100, // Range -100 to 100
            size: 15 + Math.random() * 15,
            duration: 1.5 + Math.random() * 1.5
        }));
        setFloatingHearts(newHearts);

        // Reset animation states
        setTimeout(() => setIsSending(false), 2000);
        setTimeout(() => setFloatingHearts([]), 3000);
    };

    return (
        <div className="relative w-full">
            <AnimatePresence>
                {floatingHearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{ opacity: 1, y: -200, x: heart.x }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: heart.duration, ease: "easeOut" }}
                        className="absolute left-1/2 top-0 pointer-events-none z-50"
                        style={{ marginLeft: -15 }}
                    >
                        <Heart
                            className="text-pink-400 fill-pink-400"
                            size={heart.size}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            <button
                onClick={handleSend}
                disabled={isSending}
                className={`
                    w-full p-4 rounded-2xl border-2 transition-all duration-300
                    flex items-center justify-center gap-3
                    ${isSending
                        ? 'bg-pink-100 border-pink-300 scale-95 shadow-inner'
                        : 'bg-white border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95 shadow-sm'
                    }
                `}
            >
                <div className={`relative ${isSending ? 'animate-celebrate' : ''}`}>
                    <Heart
                        className={`w-8 h-8 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
                    />
                    {isSending && (
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-glow" />
                    )}
                </div>
                <span className={`font-semibold text-xl ${isSending ? 'text-pink-600' : 'text-pink-500'}`}>
                    {isSending ? 'Sendt! ❤️' : 'Tænker på dig'}
                </span>
            </button>
        </div>
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
                        <p className="font-bold">
                            {ping.message || `${ping.fromName} tænker på dig ❤️`}
                        </p>
                        <p className="text-pink-100 text-sm">
                            {ping.sentAt?.toLocaleTimeString?.('da-DK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
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
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

import { Ping } from '../../types';

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
                        toUserId: data.toUserId,
                        type: data.type,
                        message: data.message
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
    const sendPing = useCallback(async (toView: 'senior' | 'relative', type: string = 'thinking_of_you', message: string = '') => {
        if (!circleId || !currentUserId) return;

        const pingId = `ping_${Date.now()}`;
        const pingRef = doc(db, 'careCircles', circleId, 'pings', pingId);

        try {
            await setDoc(pingRef, {
                fromUserId: currentUserId,
                toRole: toView,
                sentAt: serverTimestamp(),
                type,
                message
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

## File: tryg-app\src\features\weeklyQuestion\index.ts
```ts
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
    limit,
    updateDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from '../../config/firebase';

import { WeeklyAnswer, WeeklyReply } from '../../types';

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

    // Toggle Like
    const toggleLike = useCallback(async (answerId: string, userId: string, isLiked: boolean) => {
        if (!circleId) return;
        const answerRef = doc(db, 'careCircles', circleId, 'weeklyAnswers', answerId);
        try {
            await updateDoc(answerRef, {
                likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
            });
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    }, [circleId]);

    // Add Reply
    const addReply = useCallback(async (answerId: string, reply: Omit<WeeklyReply, 'id'>) => {
        if (!circleId) return;
        const answerRef = doc(db, 'careCircles', circleId, 'weeklyAnswers', answerId);
        const newReply: WeeklyReply = {
            id: `reply_${Date.now()}`,
            ...reply
        };

        try {
            await updateDoc(answerRef, {
                replies: arrayUnion(newReply)
            });
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    }, [circleId]);

    return {
        answers,
        loading,
        error,
        addAnswer,
        toggleLike,
        addReply
    };
}

export default useWeeklyQuestions;

```
---

## File: tryg-app\src\features\weeklyQuestion\WeeklyQuestion.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { WeeklyAnswer } from '../../types';

// Weekly questions to rotate through
export const WEEKLY_QUESTIONS = [
    "weekly_question_1",
    "weekly_question_2"
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
                questionId: question,
                text: myAnswer.trim(),
                userId: '', // Will be filled by handler
                userName
            });
            setMyAnswer('');
            setIsExpanded(false);
        }
    };

    const hasAnsweredThisWeek = answers.some(a =>
        a.questionId === question &&
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
                    {answers.filter(a => a.questionId === question).length > 0 && (
                        <div className="space-y-2 mb-3">
                            {answers
                                .filter(a => a.questionId === question)
                                .slice(0, 3)
                                .map((answer, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl p-3">
                                        <p className="font-medium text-indigo-100">{answer.userName}:</p>
                                        <p className="text-white/90 text-sm">{answer.text}</p>
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
import React, { useState } from 'react';
import { MessageCircle, X, Check, Heart, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WEEKLY_QUESTIONS, getWeekNumber } from './WeeklyQuestion';
import { WeeklyAnswer, WeeklyReply } from '../../types';
import { AudioRecorder } from '../memories/AudioRecorder';
import { Loader2, Mic, Play as PlayIcon } from 'lucide-react';

// Simple time ago formatter (no external deps)
const formatTimeAgo = (isoString: string, t: any) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t('just_now');
        if (diffInSeconds < 3600) return t('minutes_ago', { count: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400) return t('hours_ago', { count: Math.floor(diffInSeconds / 3600) });
        return t('days_ago_relative', { count: Math.floor(diffInSeconds / 86400) });
    } catch (e) {
        return '';
    }
};

interface WeeklyQuestionWidgetProps {
    answers?: WeeklyAnswer[];
    userName: string;
    hasUnread?: boolean;
    onClick: () => void;
}

// Compact widget for header
export const WeeklyQuestionWidget: React.FC<WeeklyQuestionWidgetProps> = ({ answers = [], userName, hasUnread = false, onClick }) => {
    const { t } = useTranslation();
    const weekNumber = getWeekNumber();
    const questionKey = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const answersThisWeek = answers.filter(a => a.questionId === questionKey);
    const unreadCount = hasUnread ? answersThisWeek.filter(a => a.userName !== userName).length : 0;

    return (
        <button
            onClick={onClick}
            className="relative bg-indigo-100 p-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center shrink-0"
            aria-label={t('open_weekly_question')}
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
    currentUserId?: string;
    onToggleLike?: (answerId: string, userId: string, isLiked: boolean) => void;
    onReply?: (answerId: string, reply: Omit<WeeklyReply, 'id'>) => void;
}

// Full modal for answering and viewing
export const WeeklyQuestionModal: React.FC<WeeklyQuestionModalProps> = ({
    isOpen,
    onClose,
    answers = [],
    onAnswer,
    userName,
    currentUserId,
    onToggleLike,
    onReply
}) => {
    const [myAnswer, setMyAnswer] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [answerType, setAnswerType] = useState<'text' | 'audio'>('text');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { t } = useTranslation();
    const [isUploading] = useState(false); // Local state since audio upload isn't implemented yet

    const weekNumber = getWeekNumber();
    const questionKey = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const question = t(questionKey);

    // Filter answers for this week's question
    const answersThisWeek = answers.filter(a => a.questionId === questionKey);
    const hasAnsweredThisWeek = answersThisWeek.some(a => a.userName === userName);

    // Sorting: Popularity (likes) -> Newest
    const sortedAnswers = [...answersThisWeek].sort((a, b) => {
        const likesA = a.likes?.length || 0;
        const likesB = b.likes?.length || 0;
        if (likesA !== likesB) return likesB - likesA; // Most likes first
        // Fallback to time if available (newest first)
        const timeA = a.answeredAt?.toMillis ? a.answeredAt.toMillis() : 0;
        const timeB = b.answeredAt?.toMillis ? b.answeredAt.toMillis() : 0;
        return timeB - timeA;
    });

    const handleSubmit = async () => {
        if (answerType === 'text' && myAnswer.trim()) {
            onAnswer?.({
                questionId: questionKey,
                text: myAnswer.trim(),
                answeredAt: new Date(),
                userName
            });
            setMyAnswer('');
        } else if (answerType === 'audio' && audioBlob) {
            // Audio submission logic will be handled here
            onAnswer?.({
                questionId: questionKey,
                text: t('audio_answer_placeholder'),
                answeredAt: new Date(),
                userName
            });
            setAudioBlob(null);
        }
    };

    const handleReplySubmit = (answerId: string) => {
        if (!replyText.trim() || !currentUserId) return;

        onReply?.(answerId, {
            userId: currentUserId,
            userName: userName,
            text: replyText.trim(),
            createdAt: new Date().toISOString()
        });
        setReplyText('');
        setReplyingToId(null);
    };

    const toggleReplyInput = (answerId: string) => {
        if (replyingToId === answerId) {
            setReplyingToId(null);
        } else {
            setReplyingToId(answerId);
            setReplyText('');
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
                        <span className="font-bold text-stone-800">{t('weekly_question_title')}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                    {/* Question */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <p className="text-indigo-200 text-sm mb-2 uppercase tracking-wide font-bold">{t('weekly_question_header')}</p>
                        <p className="text-xl font-bold leading-relaxed">{question}</p>
                    </div>

                    {/* Answer input (only if not answered) */}
                    {!hasAnsweredThisWeek ? (
                        <div className="space-y-4 animate-fade-in">
                            {/* Toggle between text and audio */}
                            <div className="flex bg-stone-100 p-1 rounded-2xl">
                                <button
                                    onClick={() => setAnswerType('text')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${answerType === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-500'}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        {t('text_answer')}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setAnswerType('audio')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${answerType === 'audio' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-500'}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Mic className="w-4 h-4" />
                                        {t('audio_answer')}
                                    </div>
                                </button>
                            </div>

                            <div className="relative">
                                {answerType === 'text' ? (
                                    <textarea
                                        value={myAnswer}
                                        onChange={(e) => setMyAnswer(e.target.value)}
                                        placeholder={t('write_answer_placeholder')}
                                        className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none resize-none h-32 text-lg shadow-sm"
                                    />
                                ) : (
                                    <AudioRecorder
                                        onRecordingComplete={(blob) => setAudioBlob(blob)}
                                        onReset={() => setAudioBlob(null)}
                                        placeholder={t('tell_your_story_placeholder')}
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={answerType === 'text' ? !myAnswer.trim() : (!audioBlob || isUploading)}
                                className="w-full p-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md active:scale-95 transform transition-transform"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                {isUploading ? t('uploading') : t('share_your_answer')}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center mb-4 flex items-center justify-center gap-2">
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-700" />
                            </div>
                            <p className="text-green-700 font-medium">{t('thanks_for_answer')}</p>
                        </div>
                    )}

                    {/* All Answers Feed */}
                    <div className="space-y-4">
                        {sortedAnswers.length > 0 ? (
                            <>
                                <p className="text-stone-500 text-sm font-bold ml-1 uppercase tracking-wide">{t('family_answers_count', { count: sortedAnswers.length })}</p>
                                {sortedAnswers.map((answer) => {
                                    const isLiked = currentUserId && answer.likes?.includes(currentUserId);
                                    const likeCount = answer.likes?.length || 0;
                                    const isReplying = replyingToId === answer.id;

                                    return (
                                        <div key={answer.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm transition-all hover:shadow-md">
                                            {/* Answer Header */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-stone-800 text-lg">{answer.userName}</p>
                                                    {answer.answeredAt && (
                                                        <p className="text-xs text-stone-400">
                                                            {formatTimeAgo(answer.answeredAt?.toDate?.()?.toISOString() || answer.answeredAt, t)}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Like Button */}
                                                <button
                                                    onClick={() => currentUserId && onToggleLike?.(answer.id, currentUserId, !!isLiked)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${isLiked
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                        }`}
                                                >
                                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                                                    <span className="text-sm font-bold">{likeCount > 0 ? likeCount : ''}</span>
                                                </button>
                                            </div>

                                            {/* Answer Text */}
                                            {answer.audioUrl ? (
                                                <div className="mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center gap-3">
                                                    <button
                                                        onClick={() => new Audio(answer.audioUrl).play()}
                                                        className="w-10 h-10 bg-indigo-100 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200"
                                                    >
                                                        <PlayIcon size={20} fill="currentColor" />
                                                    </button>
                                                    <div className="flex-1 h-1 bg-stone-200 rounded-full" />
                                                    <Mic size={16} className="text-stone-300" />
                                                </div>
                                            ) : (
                                                <p className="text-stone-700 text-lg leading-relaxed mb-4">{answer.text}</p>
                                            )}

                                            {/* Action Bar */}
                                            <div className="flex items-center gap-4 border-t border-stone-100 pt-3">
                                                <button
                                                    onClick={() => toggleReplyInput(answer.id)}
                                                    className="flex items-center gap-2 text-stone-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    {answer.replies?.length ? t('replies_count', { count: answer.replies.length }) : t('reply_verb')}
                                                </button>
                                            </div>

                                            {/* Replies Section */}
                                            {(isReplying || (answer.replies && answer.replies.length > 0)) && (
                                                <div className="mt-3 pl-4 border-l-2 border-stone-100 space-y-3">
                                                    {/* Existing Replies */}
                                                    {answer.replies?.map((reply) => (
                                                        <div key={reply.id} className="bg-stone-50 rounded-lg p-3 text-sm">
                                                            <div className="flex justify-between items-baseline mb-1">
                                                                <span className="font-bold text-stone-700">{reply.userName}</span>
                                                                {/* <span className="text-xs text-stone-400">tid siden</span> */}
                                                            </div>
                                                            <p className="text-stone-600">{reply.text}</p>
                                                        </div>
                                                    ))}

                                                    {/* Reply Input */}
                                                    {isReplying && (
                                                        <div className="flex gap-2 items-end animate-fade-in mt-2">
                                                            <textarea
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                placeholder={t('write_reply_placeholder')}
                                                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2 text-sm focus:border-indigo-400 focus:outline-none resize-none h-20"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleReplySubmit(answer.id)}
                                                                disabled={!replyText.trim()}
                                                                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="text-center py-8 text-stone-400">
                                <p>{t('no_answers_yet')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyQuestionModal;

```
---

## File: tryg-app\src\features\wordGame\index.ts
```ts
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
import { Crown, Medal, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LeaderboardEntry } from './useWordGame';

interface LeaderboardProps {
    scores: LeaderboardEntry[];
    currentUserId: string;
}

// Leaderboard Component - Family rankings for word game
export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, currentUserId }) => {
    const { t } = useTranslation();
    if (!scores || scores.length === 0) {
        return (
            <div className="bg-stone-50 rounded-xl p-4 text-center">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-400 text-sm">{t('no_one_played_today')}</p>
                <p className="text-stone-300 text-xs">{t('be_the_first')}</p>
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
                {t('todays_leaderboard')}
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
                                            {t('you_caps')}
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
import { Gamepad2 } from 'lucide-react';
import { WordGame } from './WordGame';
import { Leaderboard } from './Leaderboard';
import { useWordGame } from './useWordGame';
import { useTranslation } from 'react-i18next';

interface SpillehjoernetProps {
    circleId?: string;
    userId?: string;
    displayName: string;
}

/**
 * Spillehjørnet - Gaming Corner with Word of the Day.
 * Interactive word game with family leaderboard for daily engagement.
 * @param {SpillehjoernetProps} props - Component props
 * @param {string} props.circleId - Care circle identifier
 * @param {string} props.userId - Current user's ID
 * @param {string} props.displayName - User's display name for leaderboard
 * @returns {JSX.Element} Gaming corner component
 */
export const Spillehjoernet: React.FC<SpillehjoernetProps> = ({ circleId, userId, displayName }) => {
    const { t } = useTranslation();
    const {
        currentWord,
        currentWordIndex,
        totalWords,
        score,
        isComplete,
        loading,
        submitAnswer,
        leaderboard
    } = useWordGame(circleId ?? null, userId ?? null, displayName);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold theme-text text-lg">{t('spillehjoernet_title')}</h2>
                    <p className="text-xs theme-text-muted">{t('spillehjoernet_subtitle')}</p>
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
                currentUserId={userId ?? ''}
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
import { useTranslation } from 'react-i18next';
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
import { getTodaysWordsBS, shuffleAnswersBS } from '../../data/wordGameData_bs';
import { getTodaysWordsTR, shuffleAnswersTR } from '../../data/wordGameData_tr';

// Get today's date key for localStorage
const getTodayKey = () => new Date().toISOString().split('T')[0];

export interface Word {
    id: string;
    word: string;
    correctAnswer: string;
    wrongAnswer?: string;
    options?: { text: string; isCorrect: boolean }[];
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
    const { i18n } = useTranslation();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, boolean>>({}); // { wordId: isCorrect }
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Get locale-specific word functions
    const { getWords, shuffle } = useMemo(() => {
        switch (i18n.language) {
            case 'bs':
                return { getWords: getTodaysWordsBS, shuffle: shuffleAnswersBS };
            case 'tr':
                return { getWords: getTodaysWordsTR, shuffle: shuffleAnswersTR };
            default:
                return { getWords: getTodaysWords, shuffle: shuffleAnswers };
        }
    }, [i18n.language]);

    // Get today's words (memoized, same for all family, locale-specific)
    const todaysWords = useMemo(() => getWords(), [getWords]);

    // Current word with shuffled answers
    const currentWord = useMemo(() => {
        if (currentWordIndex >= todaysWords.length) return null;
        const word = todaysWords[currentWordIndex];
        return {
            ...word,
            options: shuffle(word, currentWordIndex)
        };
    }, [todaysWords, currentWordIndex, shuffle]);

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
import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Word } from './useWordGame';
import { useTranslation } from 'react-i18next';

interface WordGameProps {
    currentWord: Word | null;
    currentWordIndex: number;
    totalWords: number;
    score: number;
    isComplete: boolean;
    onAnswer: (wordId: string, isCorrect: boolean) => Promise<void | { isCorrect: boolean; newScore: number; isComplete: boolean }>;
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
    const { t } = useTranslation();
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
                        alt="Success Trophy"
                        className="w-full max-w-[200px] mx-auto object-contain animate-in zoom-in duration-500 drop-shadow-xl"
                    />
                </div>

                <h3 className="text-2xl font-bold mb-2 relative z-10">{t('word_game_complete')}</h3>
                <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm relative z-10">
                    <p className="text-4xl font-bold">{score}/{totalWords}</p>
                    <p className="text-amber-100">{t('correct_answers')}</p>
                </div>
                <p className="text-amber-100 text-sm relative z-10">
                    {percentage >= 80
                        ? t('word_game_80_percent')
                        : percentage >= 60
                            ? t('word_game_60_percent')
                            : t('word_game_below_60')}
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
                    {feedback.isCorrect ? t('answer_correct') : t('answer_wrong')}
                </h3>
                <p className="text-white/80 mb-4 text-sm">
                    <span className="font-bold">{feedback.word}</span> {t('word_means')}
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
                    {t('next_word')} <ArrowRight className="w-4 h-4" />
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
                    {t('word_of', { current: currentWordIndex + 1, total: totalWords })}
                </span>
                <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {score} {t('points')}
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
                    <span className="text-xs text-stone-400 uppercase tracking-wider">{t('what_does_mean')}</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{currentWord?.word}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {currentWord?.options?.map((option, i) => (
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

    // Update language preference
    const updateLanguagePreference = useCallback(async (lang: string) => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), {
                languagePreference: lang,
            }, { merge: true });
            setUserProfile(prev => prev ? ({ ...prev, languagePreference: lang }) : null);
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
        updateLanguagePreference,
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
    deleteDoc
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

export function useCareCircle(userId: string | undefined, _userProfile: UserProfile | null) {
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

## File: tryg-app\src\i18n.ts
```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import da from './locales/da.json';
import tr from './locales/tr.json';
import bs from './locales/bs.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            da: { translation: da },
            tr: { translation: tr },
            bs: { translation: bs },
        },
        fallbackLng: 'da',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18n;

```
---

## File: tryg-app\src\index.css
```css
@import "tailwindcss";

/* ============================================
   TRYG DESIGN SYSTEM - Hygge-Inspired Tokens
   ============================================ */

:root {
  /* === Color Palette (Hygge-Inspired) === */

  /* Primary - Warm Teal (not cold) */
  --color-primary: 174 55% 38%;
  --color-primary-light: 174 50% 92%;
  --color-primary-dark: 174 60% 28%;

  /* Warm Stone (not gray) */
  --color-stone: 37 20% 95%;
  --color-stone-medium: 37 15% 85%;
  --color-stone-dark: 37 15% 45%;

  /* Accent - Soft Gold (warmth) */
  --color-accent: 43 80% 60%;
  --color-accent-light: 43 75% 92%;

  /* Success - Soft Green (not harsh) */
  --color-success: 152 45% 50%;
  --color-success-light: 152 40% 92%;

  /* Warning - Warm Amber */
  --color-warning: 38 92% 50%;
  --color-warning-light: 38 85% 92%;

  /* Alert - Warm Red (not alarming) */
  --color-alert: 8 65% 55%;
  --color-alert-light: 8 60% 92%;

  /* === Spacing Scale === */
  --space-xs: 0.25rem;
  /* 4px */
  --space-sm: 0.5rem;
  /* 8px */
  --space-md: 1rem;
  /* 16px */
  --space-lg: 1.5rem;
  /* 24px */
  --space-xl: 2rem;
  /* 32px */
  --space-2xl: 3rem;
  /* 48px */

  /* === Border Radius (Warm, not sharp) === */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* === Typography === */
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  /* 12px */
  --font-size-sm: 0.875rem;
  /* 14px */
  --font-size-base: 1rem;
  /* 16px */
  --font-size-lg: 1.125rem;
  /* 18px - WCAG minimum */
  --font-size-xl: 1.25rem;
  /* 20px */
  --font-size-2xl: 1.5rem;
  /* 24px */
  --font-size-3xl: 2rem;
  /* 32px */

  /* === Animation Timing === */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* === Theme Tokens (Circadian Defaults) === */
  --theme-bg: hsl(37 20% 95%);
  --theme-text: hsl(200 10% 20%);
  --theme-text-muted: hsl(200 10% 45%);
  --theme-card-bg: white;
  --theme-card-border: hsl(37 15% 90%);
  --theme-nav-bg: rgba(255, 255, 255, 0.8);
}

/* === Dark Mode Tokens === */
.theme-dark {
  --theme-bg: hsl(220 30% 10%);
  --theme-text: hsl(220 20% 95%);
  --theme-text-muted: hsl(220 15% 75%);
  --theme-card-bg: hsl(220 25% 15%);
  --theme-card-border: hsl(220 20% 25%);
  --theme-nav-bg: rgba(15, 23, 42, 0.8);
}

/* === Theme-Aware Utility Classes === */
/* Use these instead of hardcoded bg-white/text-stone-800 for dark mode support */
.theme-card {
  background: var(--theme-card-bg);
  color: var(--theme-text);
  border-color: var(--theme-card-border);
}

.theme-header {
  background: var(--theme-card-bg);
  color: var(--theme-text);
  border-color: var(--theme-card-border);
}

.theme-text {
  color: var(--theme-text);
}

.theme-text-muted {
  color: var(--theme-text-muted);
}

.theme-bg {
  background: var(--theme-bg);
}

/* ============================================
   MICRO-INTERACTION ANIMATIONS
   ============================================ */

/* === Breathing Pulse (Peace of Mind) === */
@keyframes gentle-breathe {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.95;
  }

  50% {
    transform: scale(1.015);
    opacity: 1;
  }
}

.animate-breathe {
  animation: gentle-breathe 4s ease-in-out infinite;
}

/* === Connection Glow (Family Activity) === */
@keyframes connection-glow {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.4);
  }

  50% {
    box-shadow: 0 0 20px 8px rgba(13, 148, 136, 0.15);
  }
}

.animate-glow {
  animation: connection-glow 2s ease-in-out;
}

.animate-glow-loop {
  animation: connection-glow 3s ease-in-out infinite;
}

/* === Task Celebration === */
@keyframes celebrate-check {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes celebrate-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-celebrate {
  animation: celebrate-check 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

/* === Slide Up === */
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

.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === Fade In === */
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === Sun Pulse (Morning) === */
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

/* === Slow Bounce (Coffee feature) === */
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* === Wiggle (Fun micro-interaction) === */
@keyframes wiggle {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-5deg);
  }

  75% {
    transform: rotate(5deg);
  }
}

.animate-wiggle {
  animation: wiggle 0.3s ease-in-out;
}

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

/* Tab content transition wrapper */
.tab-content {
  animation: tab-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes tab-enter {
  from {
    opacity: 0;
    transform: translateX(8px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fade transition for view switching */
.view-transition-enter {
  animation: view-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes view-enter {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ============================================
   COMPONENT UTILITIES
   ============================================ */

/* Card with warm rounded corners */
.card-warm {
  border-radius: var(--radius-lg);
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  color: var(--theme-text);
  transition: background-color var(--duration-normal), border-color var(--duration-normal), color var(--duration-normal);
}

/* Glassmorphic panel for Living Design 🏠 */
.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Gradient header (warm teal) */
.header-gradient {
  background: linear-gradient(180deg,
      hsl(174 62% 35%) 0%,
      hsl(174 55% 42%) 100%);
}

/* Peace of mind card gradient states */
.peace-card-ok {
  background: linear-gradient(135deg, hsl(152 45% 45%) 0%, hsl(174 50% 40%) 100%);
}

.peace-card-warning {
  background: linear-gradient(135deg, hsl(38 80% 50%) 0%, hsl(25 75% 50%) 100%);
}

.peace-card-neutral {
  background: linear-gradient(135deg, hsl(200 15% 50%) 0%, hsl(200 10% 55%) 100%);
}

/* ============================================
   BASE STYLES
   ============================================ */

body {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100dvh;
  width: 100vw;
  /* Removed: overflow: hidden - was blocking scroll! */
  background-color: var(--theme-bg);
  color: var(--theme-text);
  line-height: 1.5;
  transition: background-color var(--duration-slow), color var(--duration-slow);
}

#root {
  height: 100dvh;
  width: 100vw;
  /* Removed: overflow: hidden - was blocking scroll! */
}

/* Visible focus indicators for accessibility */
*:focus-visible {
  outline: 2px solid hsl(174 55% 38%);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Touch target minimum size for seniors (48x48) */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Smooth scrolling */
* {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background-color: hsl(174 50% 85%);
  color: hsl(174 60% 25%);
}
```
---

## File: tryg-app\src\lib\utils.ts
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes safely.
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts.
 * 
 * @example
 * cn("flex", isActive && "bg-blue-500", "p-4")
 * cn(buttonVariants({ variant: "primary" }), className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

```
---

## File: tryg-app\src\locales\bs.json
```json
{
    "settings": "Postavke",
    "language_selection": "Izbor jezika",
    "sign_out": "Odjavi se",
    "family_circle": "Porodični krug",
    "invite_code": "Pozivni kod",
    "show_invite_code": "Prikaži pozivni kod",
    "logged_in_as": "Prijavljeni kao",
    "family_heart": "Porodično srce",
    "medication_title": "Lijekovi",
    "pain_question": "Kako se osjećate?",
    "greeting_morning": "Dobro jutro",
    "greeting_morning_1": "Dobro jutro – spremni za novi dan?",
    "greeting_morning_2": "Dobro jutro, nadam se da ste dobro spavali",
    "greeting_afternoon": "Dobar dan",
    "greeting_afternoon_1": "Dobar dan – kako ste?",
    "greeting_afternoon_2": "Dobar dan, nadam se da uživate u danu",
    "greeting_evening": "Dobro veče",
    "greeting_evening_1": "Dobra večer – vrijeme za odmor i ugodu",
    "greeting_evening_2": "Dobra večer, lijep dan se bliži kraju",
    "bottom_nav_daily": "Moj dan",
    "bottom_nav_family": "Porodica",
    "bottom_nav_report": "Izvještaj",
    "bottom_nav_spil": "Igre",
    "role_senior": "Pregled za seniora",
    "role_relative": "Pregled za člana porodice",
    "notification_water_title": "Ne zaboravite popiti vodu",
    "notification_water_body": "Vrijeme je za vaš čaš vode u 10:00",
    "coffee_invite_title": "{{name}} zove na kafu!",
    "coffee_invite_sub": "Stavila je kafu i ima vremena za posjetu.",
    "coffee_invite_accept": "Svratiću",
    "coffee_ready_desc": "Porodica može vidjeti da imate vremena.",
    "coffee_off_desc": "Pokažite da su vaša vrata otvorena.",
    "coffee_coming_title": "Neko je na putu! 🚗",
    "coffee_coming_msg": "{{name}} dolazi na kafu! ☕️",
    "coffee_give_button": "Zovite na kafu?",
    "peace_all_well": "Sve je u redu ✨",
    "peace_good_day": "Dobar dan",
    "peace_check_in": "Provjeri",
    "peace_morning_missing": "Jutro nedostaje",
    "peace_afternoon_missing": "Popodne nedostaje",
    "peace_sub_all_well": "{{name}} je dobro",
    "peace_sub_good_day": "Dan napreduje",
    "peace_sub_check_in": "Ima zadataka na koje treba obratiti pažnju",
    "peace_sub_morning_missing": "Nisu svi jutarnji zadaci obavljeni",
    "peace_sub_afternoon_missing": "Nisu svi popodnevni zadaci obavljeni",
    "daily_briefing_all_fine": "Sve izgleda u redu. {{name}} je imala miran dan.",
    "daily_briefing_meds_fine": "{{name}} je uzela sve lijekove. Sve je dobro.",
    "daily_briefing_symptom_noted": "{{name}} je zabilježila {{symptom}} u {{time}}, ali je uzela lijek.",
    "daily_briefing_symptom_warning": "{{name}} je zabilježila simptome. Lijekovi: {{completed}}/{{total}} uzeto.",
    "daily_briefing_meds_missing": "{{name}} nedostaje {{count}} lijekova danas.",
    "daily_briefing_checked_in": "{{name}} se prijavila danas. Sve izgleda u redu.",
    "daily_briefing_no_activity": "Danas još nema aktivnosti od {{name}}.",
    "streak_msg_7": "🏆 {{count}}. dan zaredom da su svi lijekovi uzeti!",
    "streak_msg_3": "🎉 {{count}}. dan zaredom!",
    "maybe_later": "Možda kasnije",
    "status_avail_now": "Status: Ima vremena sada",
    "coordination_title": "Porodična razmjena",
    "others_offers": "Od ostalih rođaka:",
    "from_senior_name": "Od {{name}}:",
    "you_offer": "Vi nudite:",
    "you_request": "Vi želite:",
    "add_offer": "Ponudi nešto",
    "add_request": "Zatraži nešto",
    "symptoms_today": "Današnji simptomi",
    "open_tasks_count": "Otvoreni zadaci ({{count}})",
    "completed_tasks_count": "Obavljeni zadaci ({{count}})",
    "add_reminder_name": "Dodaj podsjetnik za {{name}}",
    "status_work": "Na poslu",
    "status_home": "Kod kuće",
    "status_traveling": "Na putu",
    "status_available": "Ima vremena za razgovor",
    "status_busy": "Zauzeto",
    "status_coffee_ready": "Kafa je gotova!",
    "status_coffee_coming": "Neko je na putu!",
    "no_relatives": "Još nema rođaka",
    "more": "više",
    "others": "ostali",
    "din_status": "Vaš status",
    "waiting_first_check": "Čeka se prva provjera...",
    "last_checked_in": "Zadnji put",
    "taken": "obavljeno",
    "you": "ti",
    "today": "Danas",
    "days_ago": "-{{count}} dana",
    "see_details": "Vidi detalje",
    "no_one_played_today": "Danas još niko nije igrao",
    "press_to_see": "(Pritisni za pregled)",
    "symptoms_reported_today": "⚠️ Danas prijavljeno {{count}} simptoma",
    "symptoms_reported_today_plural": "⚠️ Danas prijavljeno {{count}} simptoma",
    "weekly_question_1": "O kome razmišljate danas?",
    "weekly_question_2": "Šta vas je danas nasmijalo?",
    "weekly_question_title": "Sedmično pitanje",
    "weekly_question_header": "Sedmično pitanje",
    "write_answer_placeholder": "Napišite svoj odgovor...",
    "share_your_answer": "Podijelite odgovor",
    "thanks_for_answer": "Hvala na odgovoru!",
    "family_answers_count": "Odgovori porodice ({{count}})",
    "just_now": "Upravo sada",
    "minutes_ago": "prije {{count}}m",
    "hours_ago": "prije {{count}}s",
    "days_ago_relative": "prije {{count}}d",
    "replies_count": "{{count}} odgovora",
    "reply_verb": "Odgovori",
    "write_reply_placeholder": "Napišite odgovor...",
    "no_answers_yet": "Još nema odgovora. Budi prvi!",
    "open_weekly_question": "Otvori sedmično pitanje",
    "symptoms_today_count": "Današnji simptomi ({{count}})",
    "be_the_first": "Budi prvi!",
    "you_caps": "TI",
    "todays_leaderboard": "Današnja rang lista",
    "greeting_relative": "Zdravo, {{name}}",
    "new_reminder": "Novi podsjetnik",
    "title_label": "Naslov",
    "reminder_placeholder": "Npr. Posjeta doktoru",
    "when_question": "Kada?",
    "morning": "Jutro",
    "lunch": "Ručak",
    "afternoon": "Popodne",
    "evening": "Veče",
    "reminder_notice": "Ovaj podsjetnik će se odmah pojaviti na ekranu korisnika {{name}}.",
    "add_button": "Dodaj",
    "doctor_report_title": "Izvještaj za doktora",
    "symptoms_14_days": "Simptomi (14 dana)",
    "most_frequent_count": "Najčešći ({{count}}x)",
    "symptom_overview_14_days": "Pregled simptoma (14 dana)",
    "symptoms_count": "{{count}} simptoma",
    "medicine_compliance_7_days": "Uzimanje lijekova (7 dana)",
    "symptom_log_14_days": "Dnevnik simptoma (zadnjih 14 dana)",
    "no_symptoms_registered": "Nema registrovanih simptoma.",
    "locale_code": "bs-BA",
    "location_label": "Lokacija",
    "intensity_label": "Intensitet",
    "create_task_label": "Kreiraj zadatak",
    "severe_symptoms_count": "{{count}} teških simptoma ove sedmice",
    "contact_doctor_cta": "Razmislite o kontaktiranju doktora",
    "increasing_symptoms_msg": "Povećan broj simptoma u zadnjim danima",
    "book_doctor_cta": "Zakazati termin kod doktora?",
    "decreasing_symptoms_msg": "Simptomi se povlače 👍",
    "stable_symptoms_msg": "{{count}} simptoma ove sedmice",
    "symptoms_this_week": "{{count}} simptoma ove sedmice",
    "see_full_history": "Vidi punu historiju simptoma →",
    "no_activity_yet": "Još nema aktivnosti",
    "add_own_task": "Dodaj vlastiti zadatak",
    "completed_tasks_count_special": "Obavljeni zadaci ({{count}})",
    "time_period_morning": "Jutro",
    "time_period_lunch": "Ručak",
    "time_period_afternoon": "Popodne",
    "time_period_evening": "Veče",
    "time_period_morning_full": "Jutro (08-11)",
    "time_period_lunch_full": "Ručak (12-13)",
    "time_period_afternoon_full": "Popodne (14-17)",
    "time_period_evening_full": "Veče (18-21)",
    "where_does_it_hurt": "Gdje boli?",
    "how_do_you_feel": "Kako se osjećate?",
    "i_feel_good": "Dobro sam",
    "i_feel_pain": "Imam bolove",
    "task_completed": "Završeno",
    "symptom_log_item": "Simptom: {{label}}",
    "text_answer": "Tekst",
    "audio_answer": "Glas",
    "audio_answer_placeholder": "🎙️ Audio snimak",
    "tell_your_story_placeholder": "Pritisnite da ispričate priču",
    "stop_recording": "Zaustavi",
    "start_recording": "Snimaj",
    "recording_active": "Snima se...",
    "play_recording": "Pusti",
    "delete_and_retry": "Obriši i ponovi",
    "mic_permission_denied": "Pristup mikrofonu odbijen",
    "mic_access_error": "Greška pri pristupu mikrofonu",
    "audio_recorder_not_supported": "Snimanje zvuka nije podržano",
    "livsbog_title": "Životna knjiga (Sjećanja)",
    "no_memories_yet": "Još nema sjećanja",
    "memories_will_appear_here": "Životne priče će se pojaviti ovdje",
    "stories": "priče",
    "untilted_memory": "Bez naslova",
    "audio": "Audio",
    "uploading": "Učitavanje...",
    "spillehjoernet_title": "Igraonica",
    "spillehjoernet_subtitle": "Dnevna igra riječi s porodicom",
    "word_game_complete": "Danas su riječi završene!",
    "correct_answers": "tačnih odgovora",
    "word_game_80_percent": "Fantastično! Ti si majstor riječi!",
    "word_game_60_percent": "Dobro urađeno! Poznaješ svoje riječi.",
    "word_game_below_60": "Dobar pokušaj! Probaj ponovo sutra.",
    "word_of": "Riječ {{current}} od {{total}}",
    "points": "bodova",
    "what_does_mean": "Šta znači",
    "answer_correct": "Potpuno tačno! 🎉",
    "answer_wrong": "Ne baš...",
    "word_means": "znači:",
    "next_word": "Sljedeća riječ",
    "symptom_pain": "Bol",
    "symptom_dizzy": "Vrtoglavica",
    "symptom_nausea": "Mučnina",
    "symptom_fever": "Temperatura",
    "symptom_sleep": "Problemi sa spavanjem",
    "symptom_sweats": "Noćno znojenje",
    "symptom_appetite": "Apetit",
    "body_head": "Glava",
    "body_neck": "Vrat",
    "body_chest": "Prsa",
    "body_back": "Leđa",
    "body_stomach": "Stomak",
    "body_left_arm": "Lijeva ruka",
    "body_right_arm": "Desna ruka",
    "body_left_leg": "Lijeva noga",
    "body_right_leg": "Desna noga",
    "severity_mild": "Malo",
    "severity_moderate": "Umjereno",
    "severity_severe": "Jako",
    "pain_how_much": "Koliko boli u {{location}}?",
    "select_location": "Izaberi {{label}}",
    "pain_level_label": "Nivo boli: {{level}}",
    "confirm": "Potvrdi",
    "back": "Nazad",
    "health_title": "Zdravlje i blagostanje",
    "view_all": "Prikaži sve",
    "chart_filter_hint": "Pritisnite na stubac za filtriranje",
    "symptom_log_title": "Dnevnik simptoma",
    "symptom_log_last_14_days": "(zadnjih 14 dana)",
    "no_symptoms_recorded": "Nema registriranih simptoma.",
    "symptoms_count_label": "simptoma",
    "unknown": "Nepoznato",
    "location_prefix": "Lokacija",
    "intensity_prefix": "Intenzitet",
    "health_steps": "Koraci",
    "steps_avg": "prosjek",
    "select_another_location": "Izaberi drugo mjesto",
    "go_back_symptom_selection": "Vrati se na izbor simptoma",
    "daily_photo_title": "Danas slika",
    "daily_photo_subtitle": "Od porodice s ljubavlju ❤️",
    "press_to_show": "Pritisni za prikaz",
    "hide": "Sakrij",
    "medication_taken": "Lijekovi uzeti! ❤️",
    "press_to_minimize": "Pritisni za smanjenje",
    "calling": "Zovem...",
    "calling_to": "Zovem {{name}}",
    "end_call": "Završi poziv",
    "what_needs_done": "Šta treba uraditi?",
    "example_call_doctor": "Npr. Nazvati doktora",
    "add_task_button": "Dodaj zadatak",
    "task_created_alert": "✅ Zadatak kreiran: {{title}}",
    "dashboard_symptoms": "⚠️ Novi simptomi",
    "dashboard_symptoms_sub": "Prijavljeno je {{count}} simptoma danas",
    "dashboard_tasks_missing": "Nedostaju zadaci",
    "dashboard_tasks_missing_sub": "Provjerite današnje podsjetnike",
    "theme": "Izgled",
    "theme_auto": "Automatski (Prati sunce)",
    "theme_light": "Svijetlo",
    "theme_dark": "Tamno",
    "recurring": "Ponavljaj svaki dan",
    "make_daily": "Ponavljaj svaki dan",
    "privacy_title": "Privatnost & Podaci",
    "privacy_pause_sharing": "Pauziraj dijeljenje",
    "privacy_pause_on": "Vaša porodica ne može vidjeti vaše aktivnosti",
    "privacy_pause_off": "Vaša porodica može vidjeti vaše aktivnosti",
    "privacy_download_data": "Preuzmi moje podatke",
    "privacy_download_desc": "Preuzmite kopiju svih vaših podataka",
    "privacy_delete_account": "Obriši moj račun",
    "privacy_delete_desc": "Trajno briše sve vaše podatke",
    "privacy_confirm_title": "Jeste li sigurni?",
    "privacy_confirm_desc": "Ovo će trajno obrisati sve vaše podatke, uključujući zadatke, simptome i vaš račun. Ovo se ne može poništiti.",
    "privacy_cancel": "Otkaži",
    "privacy_confirm_delete": "Da, obriši sve",
    "privacy_deleting": "Brisanje...",
    "privacy_error_relogin": "Morate se ponovo prijaviti da biste obrisali račun. Odjavite se i ponovo se prijavite.",
    "privacy_error_generic": "Došlo je do greške. Pokušajte ponovo kasnije.",
    "privacy_export_error": "Došlo je do greške pri izvozu podataka",
    "privacy_info_storage": "Vaši podaci se čuvaju u EU (Frankfurt) i šifrirani su.",
    "privacy_policy_link": "Pročitajte našu punu politiku privatnosti",
    "match_task_call": "📞 Razgovor sa {{name}}",
    "match_task_visit": "☕ Posjeta od {{name}}",
    "match_task_meal": "🍳 Kuhanje sa {{name}}",
    "match_task_transport": "🚗 Vožnja sa {{name}}",
    "match_task_garden": "🌿 Vrtlarenje sa {{name}}",
    "match_task_default": "Aktivnost sa {{name}}",
    "match_task_call_relative": "📞 Nazovi {{name}}",
    "match_task_visit_relative": "☕ Posjeti {{name}}",
    "match_task_transport_relative": "🚗 Odvezi {{name}}",
    "time_days_ago_short": "prije {{count}} dana",
    "today": "Danas",
    "task_completed": "Završeno",
    "symptom_log_item": "Simptom: {{label}}",
    "no_activity_yet": "Još nema aktivnosti",
    "general": "Općenito",
    "privacy_data": "Privatnost i podaci",
    "seneste_aktivitet": "Nedavna aktivnost"
}
```
---

## File: tryg-app\src\locales\da.json
```json
{
    "settings": "Indstillinger",
    "language_selection": "Vælg sprog",
    "sign_out": "Log ud",
    "family_circle": "Familie-cirkel",
    "invite_code": "Invitationskode",
    "show_invite_code": "Vis invitationskode",
    "logged_in_as": "Logget ind som",
    "family_heart": "Familiens Hjerte",
    "medication_title": "Medicin",
    "pain_question": "Hvordan har du det?",
    "greeting_morning": "Godmorgen",
    "greeting_morning_1": "Godmorgen – klar til en ny dag?",
    "greeting_morning_2": "Godmorgen, håber du har sovet godt",
    "greeting_afternoon": "Goddag",
    "greeting_afternoon_1": "Goddag – hvordan går det?",
    "greeting_afternoon_2": "Goddag, håber du nyder dagen",
    "greeting_evening": "Godaften",
    "greeting_evening_1": "Godaften – tid til ro og hygge",
    "greeting_evening_2": "Godaften, en dejlig dag går på hæld",
    "medication_taken_check": "Al medicin er ordnet! ❤️",
    "bottom_nav_daily": "Min dag",
    "bottom_nav_family": "Familie",
    "bottom_nav_report": "Rapport",
    "bottom_nav_spil": "Spil",
    "role_senior": "Senior oversigt",
    "role_relative": "Pårørende oversigt",
    "notification_water_title": "Husk at drikke vand",
    "notification_water_body": "Det er tid til dit glas vand kl. 10:00",
    "coffee_invite_title": "{{name}} giver kaffe!",
    "coffee_invite_sub": "Hun har sat kanden over og har tid til besøg.",
    "coffee_invite_accept": "Jeg kigger forbi",
    "coffee_ready_desc": "Familien kan se, at du har tid.",
    "coffee_off_desc": "Vis at din dør er åben.",
    "coffee_coming_title": "Nogen er på vej! 🚗",
    "coffee_coming_msg": "{{name}} kigger forbi til kaffe! ☕️",
    "coffee_give_button": "Giv kaffe?",
    "peace_all_well": "Alt er vel ✨",
    "peace_good_day": "God dag",
    "peace_check_in": "Tjek ind",
    "peace_morning_missing": "Morgen mangler",
    "peace_afternoon_missing": "Eftermiddag mangler",
    "peace_sub_all_well": "{{name}} har det godt",
    "peace_sub_good_day": "Dagen skrider fremad",
    "peace_sub_check_in": "Der er opgaver at følge op på",
    "peace_sub_morning_missing": "Ikke alle morgenopgaver er udført",
    "peace_sub_afternoon_missing": "Ikke alle eftermiddagsopgaver er udført",
    "daily_briefing_all_fine": "Alt ser fint ud. {{name}} har haft en rolig dag.",
    "daily_briefing_meds_fine": "{{name}} har taget al medicin. Alt er godt.",
    "daily_briefing_symptom_noted": "{{name}} har noteret {{symptom}} kl. {{time}}, men har taget sin medicin.",
    "daily_briefing_symptom_warning": "{{name}} har logget symptomer. Medicin: {{completed}}/{{total}} taget.",
    "daily_briefing_meds_missing": "{{name}} mangler {{count}} mediciner i dag.",
    "daily_briefing_checked_in": "{{name}} har tjekket ind i dag. Alt ser fint ud.",
    "daily_briefing_no_activity": "Ingen aktivitet fra {{name}} endnu i dag.",
    "streak_msg_7": "🏆 {{count}}. dag i træk med alt medicin taget!",
    "streak_msg_3": "🎉 {{count}}. dag i træk!",
    "maybe_later": "Måske senere",
    "status_avail_now": "Status: Har tid nu",
    "coordination_title": "Familie-udveksling",
    "others_offers": "Fra andre pårørende:",
    "from_senior_name": "Fra {{name}}:",
    "you_offer": "Du tilbyder:",
    "you_request": "Du ønsker:",
    "add_offer": "Tilbyd noget",
    "add_request": "Bed om noget",
    "symptoms_today": "Symptomer i dag",
    "open_tasks_count": "Åbne opgaver ({{count}})",
    "completed_tasks_count": "Udførte opgaver ({{count}})",
    "add_reminder_name": "Tilføj påmindelse til {{name}}",
    "status_work": "På arbejde",
    "status_home": "Hjemme",
    "status_traveling": "Undervejs",
    "status_available": "Har tid til en snak",
    "status_busy": "Optaget",
    "status_coffee_ready": "Kaffen er klar!",
    "status_coffee_coming": "Nogen er på vej!",
    "no_relatives": "Ingen pårørende endnu",
    "more": "mere",
    "others": "andre",
    "din_status": "Din status",
    "waiting_first_check": "Venter på første tjek...",
    "last_checked_in": "Sidst",
    "taken": "ordnet",
    "you": "dig",
    "today": "I dag",
    "days_ago": "-{{count}} dage",
    "see_details": "Se detaljer",
    "no_one_played_today": "Ingen har spillet endnu i dag",
    "press_to_see": "(Tryk for at se)",
    "symptoms_reported_today": "⚠️ {{count}} symptom rapporteret i dag",
    "symptoms_reported_today_plural": "⚠️ {{count}} symptomer rapporteret i dag",
    "weekly_question_1": "Hvem tænker du på i dag?",
    "weekly_question_2": "Hvad har fået dig til at smile i dag?",
    "weekly_question_title": "Ugens spørgsmål",
    "weekly_question_header": "Denne uges spørgsmål",
    "write_answer_placeholder": "Skriv dit svar her...",
    "share_your_answer": "Del dit svar",
    "thanks_for_answer": "Tak for dit svar!",
    "family_answers_count": "Svar fra familien ({{count}})",
    "just_now": "Lige nu",
    "minutes_ago": "{{count}}m siden",
    "hours_ago": "{{count}}t siden",
    "days_ago_relative": "{{count}}d siden",
    "replies_count": "{{count}} svar",
    "reply_verb": "Svar",
    "write_reply_placeholder": "Skriv et svar...",
    "no_answers_yet": "Ingen svar endnu. Vær den første!",
    "open_weekly_question": "Åbn ugens spørgsmål",
    "symptoms_today_count": "Symptomer i dag ({{count}})",
    "be_the_first": "Vær den første!",
    "you_caps": "DIG",
    "todays_leaderboard": "Dagens Rangliste",
    "greeting_relative": "Hej, {{name}}",
    "new_reminder": "Ny påmindelse",
    "title_label": "Titel",
    "reminder_placeholder": "F.eks. Lægebesøg",
    "when_question": "Hvornår?",
    "morning": "Morgen",
    "lunch": "Frokost",
    "afternoon": "Eftermiddag",
    "evening": "Aften",
    "reminder_notice": "Denne påmindelse vil straks dukke op på {{name}}s skærm.",
    "add_button": "Tilføj",
    "doctor_report_title": "Rapport til Lægen",
    "symptoms_14_days": "Symptomer (14 dage)",
    "most_frequent_count": "Mest hyppige ({{count}}x)",
    "symptom_overview_14_days": "Symptom-oversigt (14 dage)",
    "symptoms_count": "{{count}} symptomer",
    "medicine_compliance_7_days": "Overholdelse af medicin (7 dage)",
    "symptom_log_14_days": "Symptom Log (sidste 14 dage)",
    "no_symptoms_registered": "Ingen symptomer registreret.",
    "locale_code": "da-DK",
    "location_label": "Lokation",
    "intensity_label": "Intensitet",
    "create_task_label": "Opret opgave",
    "severe_symptoms_count": "{{count}} alvorlige symptomer denne uge",
    "contact_doctor_cta": "Overvej at kontakte læge",
    "increasing_symptoms_msg": "Flere symptomer de seneste dage",
    "book_doctor_cta": "Book tid hos læge?",
    "decreasing_symptoms_msg": "Symptomerne aftager 👍",
    "stable_symptoms_msg": "{{count}} symptomer denne uge",
    "symptoms_this_week": "{{count}} symptomer denne uge",
    "see_full_history": "Se fuld symptom-historik →",
    "no_activity_yet": "Ingen aktivitet endnu",
    "add_own_task": "Tilføj egen opgave",
    "completed_tasks_count_special": "Udførte opgaver ({{count}})",
    "time_period_morning": "Morgen",
    "time_period_lunch": "Frokost",
    "time_period_afternoon": "Eftermiddag",
    "time_period_evening": "Aften",
    "time_period_morning_full": "Morgen (Kl. 8-11)",
    "time_period_lunch_full": "Frokost (Kl. 12-13)",
    "time_period_afternoon_full": "Eftermiddag (Kl. 14-17)",
    "time_period_evening_full": "Aften (Kl. 18-21)",
    "where_does_it_hurt": "Hvor gør det ondt?",
    "how_do_you_feel": "Hvordan har du det?",
    "i_feel_good": "Jeg har det godt",
    "i_feel_pain": "Jeg har ondt",
    "task_completed": "Udført",
    "symptom_log_item": "Symptom: {{label}}",
    "text_answer": "Skriv",
    "audio_answer": "Fortæl",
    "audio_answer_placeholder": "🎙️ Lydoptagelse",
    "tell_your_story_placeholder": "Tryk for at fortælle din historie",
    "stop_recording": "Stop optagelse",
    "start_recording": "Start optagelse",
    "recording_active": "Optager...",
    "play_recording": "Afspil",
    "delete_and_retry": "Slet og prøv igen",
    "mic_permission_denied": "Mikrofonadgang nægtet",
    "mic_access_error": "Fejl ved mikrofonadgang",
    "audio_recorder_not_supported": "Lydoptagelse understøttes ikke",
    "livsbog_title": "Livsbog (Minder)",
    "no_memories_yet": "Ingen minder endnu",
    "memories_will_appear_here": "Livshistorier vil dukke op her",
    "stories": "historier",
    "untilted_memory": "Uden titel",
    "audio": "Lyd",
    "uploading": "Uploader...",
    "spillehjoernet_title": "Spillehjørnet",
    "spillehjoernet_subtitle": "Dagens ordleg med familien",
    "word_game_complete": "Dagens ord er klaret!",
    "correct_answers": "rigtige svar",
    "word_game_80_percent": "Fantastisk! Du er en ordmester!",
    "word_game_60_percent": "Godt gået! Du kender dine ord.",
    "word_game_below_60": "Godt forsøgt! Prøv igen i morgen.",
    "word_of": "Ord {{current}} af {{total}}",
    "points": "point",
    "what_does_mean": "Hvad betyder",
    "answer_correct": "Helt rigtigt! 🎉",
    "answer_wrong": "Ikke helt...",
    "word_means": "betyder:",
    "next_word": "Næste ord",
    "symptom_pain": "Smerter",
    "symptom_dizzy": "Svimmel",
    "symptom_nausea": "Kvalme",
    "symptom_fever": "Feber",
    "symptom_sleep": "Søvnbesvær",
    "symptom_sweats": "Nattesved",
    "symptom_appetite": "Appetit",
    "body_head": "Hoved",
    "body_neck": "Nakke",
    "body_chest": "Bryst",
    "body_back": "Ryg",
    "body_stomach": "Mave",
    "body_left_arm": "Venstre arm",
    "body_right_arm": "Højre arm",
    "body_left_leg": "Venstre ben",
    "body_right_leg": "Højre ben",
    "severity_mild": "Lidt",
    "severity_moderate": "Noget",
    "severity_severe": "Meget",
    "pain_how_much": "Hvor ondt gør det i {{location}}?",
    "select_location": "Vælg {{label}}",
    "pain_level_label": "Smerte niveau: {{level}}",
    "confirm": "Bekræft",
    "back": "Tilbage",
    "health_title": "Sundhed & Velvære",
    "view_all": "Vis alle",
    "chart_filter_hint": "Tryk på en søjle for at filtrere",
    "symptom_log_title": "Symptom Log",
    "symptom_log_last_14_days": "(sidste 14 dage)",
    "no_symptoms_recorded": "Ingen symptomer registreret.",
    "symptoms_count_label": "symptomer",
    "unknown": "Ukendt",
    "location_prefix": "Lokation",
    "intensity_prefix": "Intensitet",
    "health_steps": "Skridt",
    "steps_avg": "gennemsnit",
    "select_another_location": "Vælg et andet sted",
    "go_back_symptom_selection": "Gå tilbage til symptomvalg",
    "daily_photo_title": "Dagens Billede",
    "daily_photo_subtitle": "Fra familien med kærlighed ❤️",
    "press_to_show": "Tryk for at vise",
    "hide": "Skjul",
    "medication_taken": "Medicin taget! ❤️",
    "press_to_minimize": "Tryk for at minimere",
    "calling": "Ringer op...",
    "calling_to": "Ringer til {{name}}",
    "end_call": "Afslut opkald",
    "what_needs_done": "Hvad skal gøres?",
    "example_call_doctor": "F.eks. Ring til lægen",
    "add_task_button": "Tilføj opgave",
    "task_created_alert": "✅ Opgave oprettet: {{title}}",
    "dashboard_symptoms": "⚠️ Nye symptomer",
    "dashboard_symptoms_sub": "Der er rapporteret {{count}} symptomer i dag",
    "dashboard_tasks_missing": "Mangler opgaver",
    "dashboard_tasks_missing_sub": "Tjek op på dagens påmindelser",
    "theme": "Udseende",
    "theme_dark": "Mørkt",
    "recurring": "Gentag dagligt",
    "make_daily": "Gentag dagligt",
    "privacy_title": "Privatliv & Data",
    "privacy_pause_sharing": "Pause deling",
    "privacy_pause_on": "Din familie kan ikke se dine aktiviteter",
    "privacy_pause_off": "Din familie kan se dine aktiviteter",
    "privacy_download_data": "Download mine data",
    "privacy_download_desc": "Få en kopi af alle dine data",
    "privacy_delete_account": "Slet min konto",
    "privacy_delete_desc": "Sletter alle dine data permanent",
    "privacy_confirm_title": "Er du sikker?",
    "privacy_confirm_desc": "Dette vil permanent slette alle dine data, inklusiv opgaver, symptomer, og din konto. Dette kan ikke fortrydes.",
    "privacy_cancel": "Annuller",
    "privacy_confirm_delete": "Ja, slet alt",
    "privacy_deleting": "Sletter...",
    "privacy_error_relogin": "Du skal logge ind igen for at slette din konto. Log ud og log ind igen.",
    "privacy_error_generic": "Der opstod en fejl. Prøv igen senere.",
    "privacy_export_error": "Der opstod en fejl ved eksport af data",
    "privacy_info_storage": "Dine data opbevares i EU (Frankfurt) og er krypteret.",
    "privacy_policy_link": "Læs vores fulde privatlivspolitik",
    "match_task_call": "📞 Ring med {{name}}",
    "match_task_visit": "☕ Besøg fra {{name}}",
    "match_task_meal": "🍳 Lav mad med {{name}}",
    "match_task_transport": "🚗 Tur med {{name}}",
    "match_task_garden": "🌿 Havearbejde med {{name}}",
    "match_task_default": "Aktivitet med {{name}}",
    "match_task_call_relative": "📞 Ring til {{name}}",
    "match_task_visit_relative": "☕ Besøg hos {{name}}",
    "match_task_transport_relative": "🚗 Kør {{name}}",
    "time_days_ago_short": "{{count}} dage siden",
    "today": "I dag",
    "task_completed": "Udført",
    "symptom_log_item": "Symptom: {{label}}",
    "no_activity_yet": "Ingen aktivitet endnu",
    "theme_auto": "Auto",
    "theme_light": "Lys",
    "theme_dark": "Mørk",
    "general": "Generelt",
    "privacy_data": "Privatliv & data",
    "seneste_aktivitet": "Seneste aktivitet"
}
```
---

## File: tryg-app\src\locales\tr.json
```json
{
    "settings": "Ayarlar",
    "language_selection": "Dil Seçimi",
    "sign_out": "Oturumu Kapat",
    "family_circle": "Aile Çemberi",
    "invite_code": "Davet Kodu",
    "show_invite_code": "Davet kodunu göster",
    "logged_in_as": "Olarak giriş yapıldı",
    "family_heart": "Aile Kalbi",
    "medication_title": "İlaç",
    "pain_question": "Nasıl hissediyorsun?",
    "greeting_morning": "Günaydın",
    "greeting_morning_1": "Günaydın – yeni bir güne hazır mısınız?",
    "greeting_morning_2": "Günaydın, umarım iyi uyudunuz",
    "greeting_afternoon": "İyi Günler",
    "greeting_afternoon_1": "İyi günler – nasılsınız?",
    "greeting_afternoon_2": "İyi günler, umarım gününüz güzel geçiyordur",
    "greeting_evening": "İyi Akşamlar",
    "greeting_evening_1": "İyi akşamlar – dinlenme ve huzur zamanı",
    "greeting_evening_2": "İyi akşamlar, güzel bir gün sona eriyor",
    "bottom_nav_daily": "Günüm",
    "bottom_nav_family": "Aile",
    "bottom_nav_report": "Rapor",
    "bottom_nav_spil": "Oyunlar",
    "role_senior": "Yaşlı Bakım Özeti",
    "role_relative": "Akraba Özeti",
    "notification_water_title": "Su içmeyi unutmayın",
    "notification_water_body": "Saat 10:00'da su bardağınız için zamanı",
    "coffee_invite_title": "{{name}} kahve ikram ediyor!",
    "coffee_invite_sub": "Kahveyi hazırladı ve ziyarete zamanı var.",
    "coffee_invite_accept": "Uğrayacağım",
    "coffee_ready_desc": "Ailen müsait olduğunu görebilir.",
    "coffee_off_desc": "Kapının açık olduğunu göster.",
    "coffee_coming_title": "Birisi yolda! 🚗",
    "coffee_coming_msg": "{{name}} kahveye geliyor! ☕️",
    "coffee_give_button": "Kahve verilsin mi?",
    "peace_all_well": "Her şey yolunda ✨",
    "peace_good_day": "İyi günler",
    "peace_check_in": "Kontrol et",
    "peace_morning_missing": "Sabah eksik",
    "peace_afternoon_missing": "Öğleden sonra eksik",
    "peace_sub_all_well": "{{name}} iyi durumda",
    "peace_sub_good_day": "Gün ilerliyor",
    "peace_sub_check_in": "Takip edilecek görevler var",
    "peace_sub_morning_missing": "Tüm sabah görevleri tamamlanmadı",
    "peace_sub_afternoon_missing": "Tüm öğleden sonra görevleri tamamlanmadı",
    "daily_briefing_all_fine": "Her şey yolunda görünüyor. {{name}} sakin bir gün geçirdi.",
    "daily_briefing_meds_fine": "{{name}} tüm ilaçlarını aldı. Her şey güzel.",
    "daily_briefing_symptom_noted": "{{name}}, saat {{time}}'de {{symptom}} not etti ancak ilacını aldı.",
    "daily_briefing_symptom_warning": "{{name}} belirti kaydetti. İlaç: {{completed}}/{{total}} alındı.",
    "daily_briefing_meds_missing": "{{name}} bugün {{count}} ilacı eksik.",
    "daily_briefing_checked_in": "{{name}} bugün giriş yaptı. Her şey yolunda görünüyor.",
    "daily_briefing_no_activity": "{{name}} tarafından bugün henüz aktivite yok.",
    "streak_msg_7": "🏆 Üst üste {{count}}. gün tüm ilaçlar alındı!",
    "streak_msg_3": "🎉 Üst üste {{count}}. gün!",
    "maybe_later": "Belki sonra",
    "status_avail_now": "Durum: Şu an müsait",
    "coordination_title": "Aile Paylaşımı",
    "others_offers": "Diğer akrabalardan:",
    "from_senior_name": "{{name}}'den:",
    "you_offer": "Sundukların:",
    "you_request": "İsteklerin:",
    "add_offer": "Bir şey teklif et",
    "add_request": "Bir şey iste",
    "symptoms_today": "Bugünkü belirtiler",
    "open_tasks_count": "Açık görevler ({{count}})",
    "completed_tasks_count": "Tamamlanan görevler ({{count}})",
    "add_reminder_name": "{{name}} için hatırlatıcı ekle",
    "status_work": "İşte",
    "status_home": "Evde",
    "status_traveling": "Yolda",
    "status_available": "Sohbet etmek için zamanı var",
    "status_busy": "Meşgul",
    "status_coffee_ready": "Kahve hazır!",
    "status_coffee_coming": "Birisi yolda!",
    "no_relatives": "Henüz akraba yok",
    "more": "daha",
    "others": "diğer",
    "din_status": "Durumun",
    "waiting_first_check": "İlk kontrol bekleniyor...",
    "last_checked_in": "Son",
    "taken": "tamamlandı",
    "you": "sen",
    "today": "Bugün",
    "days_ago": "-{{count}} gün",
    "see_details": "Detayları gör",
    "no_one_played_today": "Bugün henüz kimse oynamadı",
    "press_to_see": "(Görmek için tıkla)",
    "symptoms_reported_today": "⚠️ Bugün {{count}} belirti bildirildi",
    "symptoms_reported_today_plural": "⚠️ Bugün {{count}} belirti bildirildi",
    "weekly_question_1": "Bugün kimi düşünüyorsun?",
    "weekly_question_2": "Bugün seni ne gülümsetti?",
    "weekly_question_title": "Haftanın Sorusu",
    "weekly_question_header": "Bu haftanın sorusu",
    "write_answer_placeholder": "Cevabını buraya yaz...",
    "share_your_answer": "Cevabını paylaş",
    "thanks_for_answer": "Cevabın için teşekkürler!",
    "family_answers_count": "Aileden cevaplar ({{count}})",
    "just_now": "Az önce",
    "minutes_ago": "{{count}}dk önce",
    "hours_ago": "{{count}}sa önce",
    "days_ago_relative": "{{count}}g önce",
    "replies_count": "{{count}} cevap",
    "reply_verb": "Cevapla",
    "write_reply_placeholder": "Bir cevap yaz...",
    "no_answers_yet": "Henüz cevap yok. İlk sen ol!",
    "open_weekly_question": "Haftanın sorusunu aç",
    "symptoms_today_count": "Bugünkü belirtiler ({{count}})",
    "be_the_first": "İlk sen ol!",
    "you_caps": "SEN",
    "todays_leaderboard": "Bugünkü Sıralama",
    "greeting_relative": "Merhaba, {{name}}",
    "new_reminder": "Yeni Hatırlatıcı",
    "title_label": "Başlık",
    "reminder_placeholder": "Örn. Doktor randevusu",
    "when_question": "Ne zaman?",
    "morning": "Sabah",
    "lunch": "Öğle",
    "afternoon": "Öğleden Sonra",
    "evening": "Akşam",
    "reminder_notice": "Bu hatırlatıcı hemen {{name}}'in ekranında görünecektir.",
    "add_button": "Ekle",
    "doctor_report_title": "Doktor Raporu",
    "symptoms_14_days": "Belirtiler (14 gün)",
    "most_frequent_count": "En sık ({{count}} kez)",
    "symptom_overview_14_days": "Belirti Özeti (14 gün)",
    "symptoms_count": "{{count}} belirti",
    "medicine_compliance_7_days": "İlaç Uyumu (7 gün)",
    "symptom_log_14_days": "Belirti Kaydı (son 14 gün)",
    "no_symptoms_registered": "Kayıtlı belirti yok.",
    "locale_code": "tr-TR",
    "location_label": "Konum",
    "intensity_label": "Yoğunluk",
    "create_task_label": "Görev oluştur",
    "severe_symptoms_count": "Bu hafta {{count}} ciddi belirti",
    "contact_doctor_cta": "Doktorla iletişime geçmeyi düşünün",
    "increasing_symptoms_msg": "Son günlerde artan belirtiler",
    "book_doctor_cta": "Doktor randevusu al?",
    "decreasing_symptoms_msg": "Belirtiler azalıyor 👍",
    "stable_symptoms_msg": "Bu hafta {{count}} belirti",
    "symptoms_this_week": "Bu hafta {{count}} belirti",
    "see_full_history": "Tam belirti geçmişini gör →",
    "no_activity_yet": "Henüz aktivite yok",
    "add_own_task": "Kendi görevini ekle",
    "completed_tasks_count_special": "Tamamlanan görevler ({{count}})",
    "time_period_morning": "Sabah",
    "time_period_lunch": "Öğle",
    "time_period_afternoon": "Öğleden Sonra",
    "time_period_evening": "Akşam",
    "time_period_morning_full": "Sabah (08-11)",
    "time_period_lunch_full": "Öğle (12-13)",
    "time_period_afternoon_full": "Öğleden Sonra (14-17)",
    "time_period_evening_full": "Akşam (18-21)",
    "where_does_it_hurt": "Neresi ağrıyor?",
    "how_do_you_feel": "Nasıl hissediyorsun?",
    "i_feel_good": "İyiyim",
    "i_feel_pain": "Ağrım var",
    "task_completed": "Tamamlandı",
    "symptom_log_item": "Belirti: {{label}}",
    "text_answer": "Metin",
    "audio_answer": "Ses",
    "audio_answer_placeholder": "🎙️ Ses kaydı",
    "tell_your_story_placeholder": "Hikayenizi anlatmak için basın",
    "stop_recording": "Durdur",
    "start_recording": "Kaydet",
    "recording_active": "Kaydediliyor...",
    "play_recording": "Oynat",
    "delete_and_retry": "Sil ve tekrar dene",
    "mic_permission_denied": "Mikrofon izni reddedildi",
    "mic_access_error": "Mikrofon erişim hatası",
    "audio_recorder_not_supported": "Ses kaydı desteklenmiyor",
    "livsbog_title": "Yaşam Defteri (Anılar)",
    "no_memories_yet": "Henüz anı yok",
    "memories_will_appear_here": "Yaşam hikayeleri burada görünecek",
    "stories": "hikaye",
    "untilted_memory": "Adsız",
    "audio": "Ses",
    "uploading": "Yükleniyor...",
    "spillehjoernet_title": "Oyun Köşesi",
    "spillehjoernet_subtitle": "Aile ile günlük kelime oyunu",
    "word_game_complete": "Günün kelimeleri tamamlandı!",
    "correct_answers": "doğru cevap",
    "word_game_80_percent": "Harika! Sen bir kelime ustasısın!",
    "word_game_60_percent": "İyi iş! Kelimelerini biliyorsun.",
    "word_game_below_60": "İyi deneme! Yarın tekrar dene.",
    "word_of": "Kelime {{current}} / {{total}}",
    "points": "puan",
    "what_does_mean": "Ne demek",
    "answer_correct": "Tamamen doğru! 🎉",
    "answer_wrong": "Tam değil...",
    "word_means": "anlamı:",
    "next_word": "Sonraki kelime",
    "symptom_pain": "Ağrı",
    "symptom_dizzy": "Baş dönmesi",
    "symptom_nausea": "Mide bulantısı",
    "symptom_fever": "Ateş",
    "symptom_sleep": "Uyku problemi",
    "symptom_sweats": "Gece terlemesi",
    "symptom_appetite": "İştah",
    "body_head": "Baş",
    "body_neck": "Boyun",
    "body_chest": "Göğüs",
    "body_back": "Sırt",
    "body_stomach": "Mide",
    "body_left_arm": "Sol kol",
    "body_right_arm": "Sağ kol",
    "body_left_leg": "Sol bacak",
    "body_right_leg": "Sağ bacak",
    "severity_mild": "Az",
    "severity_moderate": "Orta",
    "severity_severe": "Çok",
    "pain_how_much": "{{location}} ne kadar ağrıyor?",
    "select_location": "{{label}} seç",
    "pain_level_label": "Ağrı seviyesi: {{level}}",
    "confirm": "Onayla",
    "back": "Geri",
    "health_title": "Sağlık ve İyilik",
    "view_all": "Tümünü Görüntüle",
    "chart_filter_hint": "Filtrelemek için bir sütuna dokunun",
    "symptom_log_title": "Semptom Günlüğü",
    "symptom_log_last_14_days": "(son 14 gün)",
    "no_symptoms_recorded": "Kayıtlı semptom yok.",
    "symptoms_count_label": "semptom",
    "unknown": "Bilinmeyen",
    "location_prefix": "Konum",
    "intensity_prefix": "Yoğunluk",
    "health_steps": "Adımlar",
    "steps_avg": "ortalama",
    "select_another_location": "Başka yer seç",
    "go_back_symptom_selection": "Belirti seçimine dön",
    "daily_photo_title": "Günün Fotoğrafı",
    "daily_photo_subtitle": "Aileden sevgiyle ❤️",
    "press_to_show": "Göstermek için dokun",
    "hide": "Gizle",
    "medication_taken": "İlaç alındı! ❤️",
    "press_to_minimize": "Küçültmek için dokun",
    "calling": "Arıyor...",
    "calling_to": "{{name}} aranıyor",
    "end_call": "Aramayı bitir",
    "what_needs_done": "Ne yapılması gerekiyor?",
    "example_call_doctor": "Örn. Doktoru ara",
    "add_task_button": "Görev ekle",
    "task_created_alert": "✅ Görev oluşturuldu: {{title}}",
    "dashboard_symptoms": "⚠️ Yeni semptomlar",
    "dashboard_symptoms_sub": "Bugün {{count}} semptom bildirildi",
    "dashboard_tasks_missing": "Eksik görevler",
    "dashboard_tasks_missing_sub": "Bugünün hatırlatıcılarını kontrol edin",
    "theme": "Görünüm",
    "theme_auto": "Otomatik (Güneşi takip et)",
    "theme_light": "Açık",
    "theme_dark": "Koyu",
    "recurring": "Her gün tekrarla",
    "make_daily": "Her gün tekrarla",
    "privacy_title": "Gizlilik & Veriler",
    "privacy_pause_sharing": "Paylaşımı duraklat",
    "privacy_pause_on": "Ailen aktivitelerini göremez",
    "privacy_pause_off": "Ailen aktivitelerini görebilir",
    "privacy_download_data": "Verilerimi indir",
    "privacy_download_desc": "Tüm verilerinizin bir kopyasını alın",
    "privacy_delete_account": "Hesabımı sil",
    "privacy_delete_desc": "Tüm verilerinizi kalıcı olarak siler",
    "privacy_confirm_title": "Emin misiniz?",
    "privacy_confirm_desc": "Bu işlem görevler, semptomlar ve hesabınız dahil tüm verilerinizi kalıcı olarak silecektir. Bu geri alınamaz.",
    "privacy_cancel": "İptal",
    "privacy_confirm_delete": "Evet, hepsini sil",
    "privacy_deleting": "Siliniyor...",
    "privacy_error_relogin": "Hesabınızı silmek için tekrar giriş yapmanız gerekiyor. Çıkış yapıp tekrar giriş yapın.",
    "privacy_error_generic": "Bir hata oluştu. Daha sonra tekrar deneyin.",
    "privacy_export_error": "Veri dışa aktarılırken bir hata oluştu",
    "privacy_info_storage": "Verileriniz AB'de (Frankfurt) saklanır ve şifrelenir.",
    "privacy_policy_link": "Gizlilik politikamızın tamamını okuyun",
    "match_task_call": "📞 {{name}} ile ara",
    "match_task_visit": "☕ {{name}}'den ziyaret",
    "match_task_meal": "🍳 {{name}} ile yemek yap",
    "match_task_transport": "🚗 {{name}} ile tur",
    "match_task_garden": "🌿 {{name}} ile bahçe işi",
    "match_task_default": "{{name}} ile etkinlik",
    "match_task_call_relative": "📞 {{name}}'i ara",
    "match_task_visit_relative": "☕ {{name}}'i ziyaret et",
    "match_task_transport_relative": "🚗 {{name}}'i götür",
    "time_days_ago_short": "{{count}} gün önce",
    "today": "Bugün",
    "task_completed": "Tamamlandı",
    "symptom_log_item": "Semptom: {{label}}",
    "no_activity_yet": "Henüz aktivite yok",
    "general": "Genel",
    "privacy_data": "Gizlilik ve veriler",
    "seneste_aktivitet": "Son aktivite"
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
import './i18n'

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

import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <ThemeProvider>
                <AppWithAuth />
            </ThemeProvider>
        </ErrorBoundary>
    </StrictMode>,
)

```
---

## File: tryg-app\src\test\components.test.jsx
```jsx
// P2 Component Tests - Feature robustness
// Tests for ProgressRing, InlineGatesIndicator, SeniorStatusCard

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

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
import { render } from '@testing-library/react'

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
export interface Task {
    id: string;
    title: string;
    period: string;
    time: string;
    emoji?: string;
    completed: boolean;
    createdAt?: any;
    completedAt?: any;
    recurring?: boolean;
    originalId?: string;
    type?: string; // e.g. 'medication'
    [key: string]: any;
}
export interface WeeklyReply {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
}

export interface WeeklyAnswer {
    id: string;
    questionId?: string;
    text?: string;
    userId?: string;
    userName?: string;
    answeredAt?: any; // Firestore Timestamp
    likes?: string[];
    replies?: WeeklyReply[];
    audioUrl?: string;
}

export interface Ping {
    id: string;
    fromName: string;
    fromUserId: string;
    toRole: 'senior' | 'relative';
    sentAt: any; // Date | Timestamp
    toUserId?: string;
    type?: string;
    message?: string;
}

export interface Photo {
    id: string;
    imageUrl: string;
    storagePath?: string;
    fromUserId: string;
    fromName: string;
    uploadedAt: any;
    viewedAt?: any;
}

export interface HelpOffer {
    docId: string;
    id: string;
    label: string;
    emoji: string;
    createdByUid?: string;
    createdByRole?: string;
    createdByName?: string;
    createdAt?: any;
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
}

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
    type?: string; // e.g. 'pain', 'dizzy'
    color?: string;
    bodyLocation?: BodyLocation;
    time: string;
    date: string;
    loggedAt?: any; // Firestore Timestamp
}

export interface SymptomStats {
    count: number;
    lastOccurrence: string | null;
}

/**
 * Core Type Definitions for Tryg App
 */

export interface Member {
    docId: string;
    displayName: string;
    role: 'senior' | 'relative';
    status: 'home' | 'work' | 'traveling' | 'available' | 'busy' | 'coffee_ready' | 'coffee_coming';
    updatedAt?: any; // Firestore timestamp
    id?: string; // Sometimes used interchangeably with docId
    // Generational Orbits
    relationship?: string; // e.g. 'son', 'granddaughter'
    accessLevel?: 'admin' | 'caregiver' | 'joy' | 'guest'; // Permissions
    archetype?: 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader'; // Superpower badge
}

export interface MemberStatus {
    docId: string; // This is the userId
    status: string;
    displayName: string;
    role: 'senior' | 'relative';
    updatedAt?: any;
    [key: string]: any;
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
    languagePreference?: string;
}

export interface CareCircle {
    id: string;
    seniorId: string;
    seniorName: string;
    inviteCode: string;
    createdAt: any;
    lastResetDate?: string; // Daily reset tracker (YYYY-MM-DD)
}

export type AppTab = 'daily' | 'family' | 'health' | 'spil';

export interface CareCircleContextValue {
    // Circle info
    careCircleId: string | null;
    seniorId: string | null;
    seniorName: string;

    // Current user info
    currentUserId: string | null;
    userRole: 'senior' | 'relative' | null;
    userName: string;
    relativeName: string; // Added

    // Member statuses (for FamilyPresence, etc.)
    memberStatuses: MemberStatus[];
    members: Member[];
    relativeStatuses: MemberStatus[];
    seniorStatus: MemberStatus | null;
    myStatus: string; // Changed from MemberStatus | null to string
    setMyStatus: (status: string) => Promise<void>;

    // Feature Data & Actions (The Prop Drilling Cure)
    // ---------------------------------------------

    // Navigation
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;

    // Tasks
    tasks: Task[];
    toggleTask: (id: string) => void; // Return type changed
    addTask: (task: Partial<Task>) => void; // Return type changed

    // Symptoms
    symptoms: SymptomLog[];
    addSymptom: (symptom: Partial<SymptomLog>) => Promise<string | undefined>;

    // Weekly Questions
    weeklyAnswers: WeeklyAnswer[];
    addWeeklyAnswer: (answer: string) => Promise<string | undefined>;
    toggleLike: (answerId: string, userId: string, isLiked: boolean) => Promise<void>;
    addReply: (answerId: string, reply: Omit<WeeklyReply, 'id'>) => Promise<void>;

    // "Thinking of You" (Pings)
    latestPing: Ping | null;
    sendPing: (toRole: 'senior' | 'relative') => Promise<string | undefined>;
    dismissPing: () => void;

    // Check-in
    lastCheckIn: string | null;
    recordCheckIn: () => Promise<string | void | undefined>;
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

import { Task, SymptomLog } from '../types';

interface BriefingParams {
    tasks?: Task[];
    symptoms?: SymptomLog[];
    seniorName?: string;
    lastCheckIn?: string | null;
    t: any; // i18next t function
}

/**
 * Helper to check if a timestamp is from today
 */
const isToday = (date: any): boolean => {
    if (!date) return false;
    let d: Date;
    if (date.toDate) {
        d = date.toDate();
    } else if (typeof date === 'string') {
        d = new Date(date);
    } else {
        d = new Date(date);
    }
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Generate a natural language daily briefing
 */
export function getDailyBriefing({ tasks = [], symptoms = [], seniorName = 'Mor', lastCheckIn = null, t }: BriefingParams) {
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
                message: t('daily_briefing_all_fine', { name: firstName }),
                emoji: '✨',
                type: 'success' as const
            };
        }
        return {
            message: t('daily_briefing_meds_fine', { name: firstName }),
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
            message: t('daily_briefing_symptom_noted', { name: firstName, symptom: symptomName, time }),
            emoji: '📋',
            type: 'info' as const
        };
    }

    // Medicine not complete but symptoms logged
    if (!allMedicineComplete && hasSymptoms) {
        return {
            message: t('daily_briefing_symptom_warning', { name: firstName, completed: completedMedicine, total: medicineTasks.length }),
            emoji: '⚠️',
            type: 'warning' as const
        };
    }

    // Medicine not complete, no symptoms
    if (!allMedicineComplete && medicineTasks.length > 0) {
        const remaining = medicineTasks.length - completedMedicine;
        return {
            message: t('daily_briefing_meds_missing', { name: firstName, count: remaining }),
            emoji: '💊',
            type: 'info' as const
        };
    }

    // No tasks at all - show neutral status
    if (lastCheckIn && isToday(lastCheckIn)) {
        return {
            message: t('daily_briefing_checked_in', { name: firstName }),
            emoji: '👍',
            type: 'success' as const
        };
    }

    // No activity yet today
    return {
        message: t('daily_briefing_no_activity', { name: firstName }),
        emoji: '💤',
        type: 'info' as const
    };
}

/**
 * Get streak message if applicable
 */
export function getStreakMessage(streakDays: number, _seniorName = 'Mor', t: any) {
    if (streakDays >= 7) {
        return t('streak_msg_7', { count: streakDays });
    }
    if (streakDays >= 3) {
        return t('streak_msg_3', { count: streakDays });
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

## File: tryg-app\src\utils\notifications.ts
```ts
/**
 * PWA Notification Helper
 * Provides utilities for requesting notification permissions and displaying
 * medication reminders as browser notifications.
 */

/**
 * Request notification permission from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn('📵 This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.warn('🚫 Notification permission was previously denied');
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Check if notifications are currently supported and permitted.
 */
export function isNotificationEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Show a medication reminder notification.
 */
export function showMedicationReminder(taskTitle: string, time: string): void {
    if (!isNotificationEnabled()) {
        console.warn('⚠️ Cannot show notification - not enabled');
        return;
    }

    const notification = new Notification(`💊 ${taskTitle}`, {
        body: `Det er tid til ${taskTitle} (${time})`,
        icon: '/icons/pill-192.png',
        tag: `medication-${taskTitle}-${time}`,
        requireInteraction: true,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Auto-close after 30 seconds
    setTimeout(() => notification.close(), 30000);
}

/**
 * Schedule a notification for a specific time today.
 * Returns a timeout ID that can be used to cancel the notification.
 */
export function scheduleNotification(
    taskTitle: string,
    timeString: string // 'HH:MM' format
): number | null {
    if (!isNotificationEnabled()) {
        return null;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
    );

    // If the time has already passed today, don't schedule
    if (scheduledTime <= now) {
        return null;
    }

    const msUntilNotification = scheduledTime.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
        showMedicationReminder(taskTitle, timeString);
    }, msUntilNotification);

    console.log(`⏰ Scheduled notification for ${taskTitle} at ${timeString} (in ${Math.round(msUntilNotification / 60000)} minutes)`);

    return timeoutId;
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
