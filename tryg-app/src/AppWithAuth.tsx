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
import { CareCircleProvider } from './components/providers/CareCircleProvider';
import { PhoneFrame } from './components/layout/PhoneFrame';
import { SensoryFeedback } from './components/SensoryFeedback';

// Main app wrapper with Firebase integration
export default function AppWithAuth() {
    // If Firebase is disabled, render the original localStorage app
    if (!FEATURES.useFirebase) {
        // Dynamically import the original app
        const TrygApp = React.lazy<React.ComponentType<unknown>>(() => import('./App'));
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
        updateMember, // Destructured
        updateAnyMember,
    } = useCareCircle(user?.uid, userProfile);

    // Auth handler for AuthScreen
    const handleAuth = async (type: string, data: unknown) => {
        setAuthFormError(null); // Clear previous errors
        const authData = data as Record<string, unknown>;
        try {
            if (type === 'login') {
                await signIn(authData.email as string, authData.password as string);
            } else if (type === 'signup') {
                await signUp(authData.email as string, authData.password as string, authData.displayName as string, authData.role as 'senior' | 'relative');
            } else if (type === 'google') {
                await signInWithGoogle(authData.role as 'senior' | 'relative');
            }
        } catch (err: unknown) {
            console.error('Auth error:', err);
            // Set user-friendly error message
            let message = (err as Error).message || 'Der opstod en fejl ved login';
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
        <CareCircleProvider
            user={user}
            userProfile={userProfile}
            careCircle={careCircle}
            members={members}
            inviteCode={inviteCode}
            onGetInviteCode={getInviteCode}
            updateMember={updateMember}
            updateAnyMember={updateAnyMember}
        >
            <SensoryFeedback />
            {/*
              PhoneFrame now wraps AppCore.
              We'll pass notification logic to PhoneFrame if we can,
              but notification state is currently inside AppCore.

              Strategy:
              AppCore is now the "Content" of the PhoneFrame.
              AppCore will render its content, but the FRAME itself is external.

              However, to use the PhoneFrame component we created, we need to wrap content in it.
              And to keep AppCore modular, AppCore should return <PhoneFrame>...</PhoneFrame> ?
              NO, the plan says:
              "App.tsx and AppCore to both be children of PhoneFrame."

              So:
              <PhoneFrame>
                 <TrygAppCore onSignOut={signOut} />
              </PhoneFrame>

              BUT PhoneFrame takes `notification` prop.
              If `notification` state lives in `TrygAppCore`, `PhoneFrame` can't see it here.

              Solution:
              1. Lift notification state to here (AppWithAuth)?
                 No, AppCore handles pings which generate notifications.
              2. Keep notification in AppCore, and AppCore renders PhoneFrame?
                 The User said: "Refactor App.tsx and AppCore to both be children of PhoneFrame."
                 This implies the parent (this file) renders PhoneFrame.

              If AppCore manages the notification state, how does PhoneFrame display it?
              Maybe AppCore *renders* the PhoneFrame?
              "AppCore should only determine which View to render... based on auth state."

              If I put PhoneFrame inside AppCore, then AppCore is not "a child of PhoneFrame".

              Let's re-read the User's "Conceptual Helper":
              <CareCircleProvider>
                 <SensoryFeedback />
                 <PhoneFrame>
                    <AppCore />
                 </PhoneFrame>
              </CareCircleProvider>

              Okay, so AppWithAuth renders this structure.
              This means `AppCore` is *inside* the screen area of `PhoneFrame`.

              What about the Notification Banner?
              It is part of `PhoneFrame`. It needs `notification` prop.
              Where does the notification come from?
              It comes from `latestPing` (in Context).

              Ah! `AppCore` had:
               useEffect(() => { if (latestPing) playPingSound(); }, [latestPing]);

              And also:
               const [notification, setNotification] = useState<any | null>(null);
               ...
               <div className="absolute top-4 ..."> {notification...} </div>

              If `SensoryFeedback` handles sounds, maybe `PhoneFrame` handles Notifications?
              Does `PhoneFrame` have access to Context?
              No, it's a layout component.
              But `AppWithAuth` is inside `CareCircleProvider` (wait, no, it RENDERS it).

              So `AppWithAuth` cannot consume the context it just created in the same render cycle easily without a sub-component.

              However, `TrygAppCore` consumes context.
              If `TrygAppCore` is inside `PhoneFrame`, `TrygAppCore` can render the banner?
              No, the banner is "OS Level" (part of the frame).

              Maybe `PhoneFrame` should consume the context to show notifications?
              If I connect `PhoneFrame` to context, it becomes "smart". User said "PhoneFrame... Responsibility: The Phone Simulator wrapper".

              Alternative: `AppCore` renders the `PhoneFrame`?
              User said "AppCore... Refactor: Extract the outer wrapper HTML".
              User said "App.tsx and AppCore to both be children of PhoneFrame".
              This strongly implies the hierarchy I wrote above.

              So, how does the Notification Banner get data?
              Options:
              A) Lift notification state to a `NotificationProvider` (or use `CareCircleContext` if suitable).
              B) Pass a `NotificationHandler` component as a sibling to `AppCore` inside `PhoneFrame`?
                 <PhoneFrame>
                    <NotificationBanner /> <-- Connected component?
                    <AppCore />
                 </PhoneFrame>
              C) Make `PhoneFrame` smart (connect to Context).

              Given `CareCircleContext` has `latestPing`, we can derive the notification from it.
              The `AppCore` logic was: `if (notification) show banner`.
              `notification` was set by... actually, `AppCore` *doesn't* seem to set `notification` based on `latestPing` in the file I read!

              Let's look at `AppCore.tsx` again.
              `const [notification, setNotification] = useState<any | null>(null);`
              `useEffect(() => { if (notification) ... timer ... }, [notification]);`
              But WHERE is `setNotification` called?
              I see `const { latestPing... } = usePings(...)`.
              I see `playPingSound()`.
              I DO NOT see `setNotification` called for pings in `AppCore.tsx`!

              Wait, `App.tsx` (Demo) sets notification on a timer.
              `AppCore.tsx` has the *state* and the *JSX*, but maybe I missed where it's used?
              Or maybe it's NOT used in `AppCore` yet?

              Let's re-read `AppCore.tsx` content from memory/history.
              `const [notification, setNotification] = useState<any | null>(null);`
              It is defined.
              It is rendered.
              But `setNotification` is NOT called except in `useEffect` (for timer to clear).
              Wait, is it passed down? No.

              Ah, `AppCore` imports `PingNotification` from `features/thinkingOfYou`.
              And renders:
              `{latestPing && (<PingNotification ping={latestPing} onDismiss={dismissPing} />)}`

              This `PingNotification` is rendered *inside* the content area (LivingBackground).
              The *Push Notification Banner* (absolute top-4) uses the `notification` state.

              So `AppCore` has TWO notification systems?
              1. The "Push Banner" (using `notification` state) -> Seems UNUSED in `AppCore` (except for the state definition).
              2. The `PingNotification` (component) -> Used for `latestPing`.

              If the "Push Banner" is unused in AppCore, then I don't need to worry about passing `notification` prop to `PhoneFrame` for `AppCore`!
              I only need to worry about `PingNotification` which is *inside* the view.

              However, `App.tsx` (Demo) DOES use the Push Banner for the water reminder.

              So:
              - `App.tsx` will pass `notification` prop to `PhoneFrame`.
              - `AppCore` (via `AppWithAuth`) will pass `null` or `undefined` to `PhoneFrame`'s `notification` prop.

              This simplifies everything.
            */}
            <PhoneFrame>
                <TrygAppCore user={user} onSignOut={signOut} />
            </PhoneFrame>
        </CareCircleProvider>
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
