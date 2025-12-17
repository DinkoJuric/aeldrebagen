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
