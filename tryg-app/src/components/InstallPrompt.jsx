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
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Check if already in standalone mode (installed as PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;

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
export const InstallPrompt = () => {
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
