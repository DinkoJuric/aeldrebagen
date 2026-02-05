import { ReactNode, memo } from 'react';
import { InstallPrompt } from '../InstallPrompt';
import { UpdateToast } from '../UpdateToast';
import { LivingBackground } from '../ui/LivingBackground';
import { FEATURES } from '../../config/features';

interface PhoneFrameProps {
    children: ReactNode;
    notification?: {
        title: string;
        body: string;
        icon: any;
    } | null;
}

// 🚀 TURBO: Memoize the PhoneFrame component to prevent re-renders from state changes in parent components.
// Since PhoneFrame is a pure presentational component, it will only re-render if its props (children or notification) change.
const MemoizedPhoneFrame = memo(({ children, notification }: PhoneFrameProps) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-stone-50 dark:bg-zinc-950 sm:bg-zinc-800 sm:p-4 font-sans">
            {/* Phone Frame Simulator (Responsive) */}
            {/* Mobile: Full screen, no border. Desktop: Phone frame with border. */}
            <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[3rem] overflow-hidden sm:border-8 sm:border-zinc-900 shadow-2xl sm:ring-1 sm:ring-zinc-400/50 flex flex-col">

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
                                <h4 className="font-bold theme-text text-sm">{notification.title}</h4>
                                <p className="theme-text-muted text-xs opacity-80">{notification.body}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-h-0 relative z-10 flex flex-col">
                    {/* LivingBackground for circadian atmosphere (Living Design 🏠) */}
                    {FEATURES.livingDesign ? (
                        <LivingBackground>
                            <div className="h-full overflow-hidden flex flex-col">
                                {children}
                            </div>
                        </LivingBackground>
                    ) : (
                        /* Fallback: Static gradient when Living Design is disabled */
                        <div className="h-full bg-gradient-to-b from-sky-100 via-sky-50 to-stone-100 overflow-hidden flex flex-col">
                            <div className="h-full flex flex-col">
                                {children}
                            </div>
                        </div>
                    )}
                </div>

                {/* iOS PWA Install Prompt - System Level UI */}
                <InstallPrompt />

                {/* PWA Update Toast - System Level UI */}
                <UpdateToast />

                {/* Home indicator - System Level UI */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
            </div>
        </div>
    );
});

export { MemoizedPhoneFrame as PhoneFrame };
