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
