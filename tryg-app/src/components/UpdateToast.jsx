/**
 * PWA Update Toast
 * 
 * Shows a notification when a new app version is available.
 * Uses vite-plugin-pwa's service worker registration.
 */

import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const UpdateToast = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onRegistered(r) {
            // Check for updates every hour
            r && setInterval(() => {
                r.update();
            }, 60 * 60 * 1000);
        },
        onRegisterError(error) {
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
