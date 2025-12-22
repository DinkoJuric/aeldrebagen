import { useState, useEffect } from 'react';
import { Activity, RotateCcw, X } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { SeniorWelcome } from './features/onboarding/SeniorWelcome';
import { RelativeWelcome } from './features/onboarding/RelativeWelcome';
import { useTranslation } from 'react-i18next';
import { FEATURES } from './config/features';
import { cn } from './lib/utils';
import { useTheme } from './contexts/ThemeContext';
import './index.css';

export default function TrygApp() {
    const { t } = useTranslation();
    const { setMode } = useTheme();
    const [view, setView] = useState<'senior' | 'relative'>('senior');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Secret "Backdoor" Mode
    const [showSecretScreen, setShowSecretScreen] = useState(false);

    const [notification, setNotification] = useState<any | null>(null);

    // Default to Midnight Theme on mount
    useEffect(() => {
        setMode('dark');
    }, [setMode]);

    // Force Onboarding for first-time visitors (or cleared cache)
    useEffect(() => {
        // ROTATED KEY to force onboarding for everyone one last time
        const hasSeenOnboarding = localStorage.getItem('tryg_welcome_seen_v2');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    // Listen for the secret event from SettingsModal
    useEffect(() => {
        const handleSecret = () => setShowSecretScreen(true);
        window.addEventListener('trigger-secret-unicorn', handleSecret);
        return () => window.removeEventListener('trigger-secret-unicorn', handleSecret);
    }, []);

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

    const handleOnboardingComplete = () => {
        localStorage.setItem('tryg_welcome_seen_v2', 'true');
        setShowOnboarding(false);
    };

    const handleResetOnboarding = () => {
        localStorage.removeItem('tryg_welcome_seen_v2');
        // Also remove old key to be clean
        localStorage.removeItem('tryg_welcome_seen');
        setShowOnboarding(true);
    };

    // Render the Secret Screen (Isolated)
    if (showSecretScreen) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-900 p-4 font-sans">
                <div className="relative w-full max-w-md h-[850px] bg-black rounded-[3rem] overflow-hidden border-8 border-zinc-800 shadow-2xl ring-1 ring-zinc-700/50">
                    <button
                        onClick={() => setShowSecretScreen(false)}
                        className="absolute top-6 right-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    {view === 'senior' ? (
                        <SeniorWelcome onComplete={() => setShowSecretScreen(false)} />
                    ) : (
                        <RelativeWelcome onComplete={() => setShowSecretScreen(false)} />
                    )}
                </div>
            </div>
        );
    }

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

                <div className="relative h-full overflow-y-auto no-scrollbar">
                    {/* Role Toggles & Reset - ENHANCED VISIBILITY */}
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <button
                            onClick={handleResetOnboarding}
                            className="p-2 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-white/50 dark:border-zinc-700/50 rounded-full text-stone-900 dark:text-stone-100 shadow-sm transition-all hover:bg-white/60"
                            title="Reset Onboarding"
                        >
                            <RotateCcw size={16} />
                        </button>
                        <div className="flex bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-white/50 dark:border-zinc-700/50 rounded-full p-1 shadow-sm">
                            <button
                                onClick={() => setView('senior')}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
                                    view === 'senior'
                                        ? "bg-white text-stone-900 shadow-sm"
                                        : "text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white"
                                )}
                            >
                                {t('role_senior')}
                            </button>
                            <button
                                onClick={() => setView('relative')}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
                                    view === 'relative'
                                        ? "bg-white text-stone-900 shadow-sm"
                                        : "text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white"
                                )}
                            >
                                {t('role_relative')}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden h-full">
                        {showOnboarding ? (
                            view === 'senior' ? (
                                <SeniorWelcome onComplete={handleOnboardingComplete} />
                            ) : (
                                <RelativeWelcome onComplete={handleOnboardingComplete} />
                            )
                        ) : (
                            view === 'senior' ? <SeniorView /> : <RelativeView />
                        )}
                    </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
            </div>
        </div>
    );
}
