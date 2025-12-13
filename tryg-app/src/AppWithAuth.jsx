// App wrapper with Firebase authentication
// Shows AuthScreen if not logged in, ConsentModal if no consent, CircleSetup if no circle, then main TrygApp

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
        const TrygApp = React.lazy(() => import('./App'));
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
    const [authFormError, setAuthFormError] = useState(null); // Track sign-in/signup errors

    const {
        user,
        userProfile,
        loading: authLoading,
        error: authError,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        recordConsent
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
    const handleAuth = async (type, data) => {
        setAuthFormError(null); // Clear previous errors
        try {
            if (type === 'login') {
                await signIn(data.email, data.password);
            } else if (type === 'signup') {
                await signUp(data.email, data.password, data.displayName, data.role);
            } else if (type === 'google') {
                await signInWithGoogle(data.role);
            }
        } catch (err) {
            console.error('Auth error:', err);
            // Set user-friendly error message
            let message = err.message || 'Der opstod en fejl ved login';
            // Clean up Firebase error messages
            if (message.includes('auth/popup-closed-by-user')) {
                message = 'Login-vinduet blev lukket. Prøv igen.';
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

    // Loading state
    if (authLoading) {
        return <LoadingScreen message="Logger ind..." />;
    }

    // Not authenticated - show auth screen
    if (!user) {
        return (
            <AuthScreen
                onAuth={handleAuth}
                error={authFormError || authError}
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
function LoadingScreen({ message = 'Indlæser...' }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                <p className="text-stone-500">{message}</p>
            </div>
        </div>
    );
}
