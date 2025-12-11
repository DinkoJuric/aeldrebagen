import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { playPingSound } from '../utils/sounds';

// "Thinking of you" ping button - one-tap warmth without obligation
export const ThinkingOfYouButton = ({ onSendPing, fromName = 'Louise' }) => {
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();

        // Reset animation after 1.5s
        setTimeout(() => setIsSending(false), 1500);
    };

    return (
        <button
            onClick={handleSend}
            disabled={isSending}
            className={`
                w-full p-4 rounded-2xl border-2 transition-all duration-300
                flex items-center justify-center gap-3
                ${isSending
                    ? 'bg-pink-100 border-pink-300 scale-95'
                    : 'bg-white border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95'
                }
            `}
        >
            <div className={`
                relative transition-transform duration-300
                ${isSending ? 'scale-125' : ''}
            `}>
                <Heart
                    className={`w-8 h-8 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
                />
                {isSending && (
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-ping" />
                )}
            </div>
            <span className={`font-semibold text-lg ${isSending ? 'text-pink-600' : 'text-pink-500'}`}>
                {isSending ? 'Sendt! ❤️' : 'Tænker på dig'}
            </span>
        </button>
    );
};

// Ping notification that appears in recipient's view
export const PingNotification = ({ ping, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (ping) {
            setIsVisible(true);
            playPingSound();

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onDismiss, 500); // Wait for fade-out
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [ping, onDismiss]);

    if (!ping) return null;

    return (
        <div className={`
            fixed top-20 left-4 right-4 z-50 transition-all duration-500
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        `}>
            <div
                onClick={() => { setIsVisible(false); setTimeout(onDismiss, 300); }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-2xl shadow-xl text-white cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Heart className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                        <p className="font-bold">{ping.fromName} tænker på dig ❤️</p>
                        <p className="text-pink-100 text-sm">{ping.time}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThinkingOfYouButton;
