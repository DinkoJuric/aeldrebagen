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
import { PhoneFrame } from './components/layout/PhoneFrame';
import './index.css';

import './index.css';

interface NotificationType {
    title: string;
    body: string;
    icon: React.ElementType;
}

export default function TrygApp() {
    const { t } = useTranslation();
    const { setMode } = useTheme();
    const [view, setView] = useState<'senior' | 'relative'>('senior');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Secret "Backdoor" Mode
    const [showSecretScreen, setShowSecretScreen] = useState(false);

    const [notification, setNotification] = useState<NotificationType | null>(null);

    // Default to Midnight Theme on mount
    useEffect(() => {
        setMode('dark');
    }, [setMode]);

    // Force Onboarding for first-time visitors (or cleared cache)
    useEffect(() => {
        // ROTATED KEY to force onboarding for everyone one last time
        const hasSeenOnboarding = localStorage.getItem('tryg_welcome_seen_v2');
        if (!hasSeenOnboarding) {
            setTimeout(() => setShowOnboarding(true), 0);
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
    }, [t]);

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
        <PhoneFrame notification={notification}>
            <div className="relative h-full overflow-y-auto no-scrollbar flex flex-col">
                {/* Role Toggles & Reset - ENHANCED VISIBILITY */}
                {/* Only show these controls in Demo Mode (App.tsx), not in real app */}
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
        </PhoneFrame>
    );
}
