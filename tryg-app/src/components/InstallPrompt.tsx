// @ts-check
/**
 * iOS PWA Install Prompt
 * 
 * Shows installation instructions for iOS Safari users who haven't
 * added the app to their home screen yet. This improves the PWA
 * experience by guiding seniors to "Add to Home Screen".
 */

import React, { useState, useEffect } from 'react';
import { X, Share, Download } from 'lucide-react';

/**
 * Android/Chrome Install Prompt Hook
 * Captures the 'beforeinstallprompt' event to show a custom install button
 */
// eslint-disable-next-line react-refresh/only-export-components
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const useAndroidInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Check if dismissed recently
            const wasDismissed = localStorage.getItem('pwa-android-dismissed');
            if (!wasDismissed) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const dismiss = () => {
        setShowPrompt(false);
        // Remember dismissal for a few days to not annoy user
        localStorage.setItem('pwa-android-dismissed', Date.now().toString());
    };

    return { showAndroidPrompt: showPrompt && !!deferredPrompt, install, dismissAndroid: dismiss };
};

/**
 * Detects if user is on iOS Safari (not in standalone/PWA mode)
 */
const useIOSInstallPrompt = () => {
    const [shouldShow, setShouldShow] = useState(false);
    const [_dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if iOS device
        // Check if iOS device
        // MSStream is IE-specific, used for detection
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

        // Check if already in standalone mode (installed as PWA)
        // standalone is Safari-specific
        interface NavigatorIOS extends Navigator {
            standalone?: boolean;
        }
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as NavigatorIOS).standalone === true;

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
    const { shouldShow: shouldShowIOS, dismiss: dismissIOS } = useIOSInstallPrompt();
    const { showAndroidPrompt, install, dismissAndroid } = useAndroidInstallPrompt();

    if (!shouldShowIOS && !showAndroidPrompt) return null;

    // ANDROID / DESKTOP CHROME PROMPT
    if (showAndroidPrompt) {
        return (
            <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl z-50 animate-slide-up border border-teal-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Download className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                        <p className="font-bold text-stone-800 text-sm">Installer appen</p>
                        <p className="text-xs text-stone-500">For nemmere adgang</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={dismissAndroid}
                        className="p-2 text-stone-400 hover:text-stone-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={install}
                        className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-teal-700 transition-colors"
                    >
                        Installer
                    </button>
                </div>
            </div>
        );
    }

    // iOS PROMPT (Existing)
    return (
        <div className="fixed bottom-0 inset-x-0 bg-white p-6 shadow-2xl z-50 animate-slide-up border-t-4 border-teal-500 safe-area-bottom">
            {/* Close button */}
            <button
                onClick={dismissIOS}
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
