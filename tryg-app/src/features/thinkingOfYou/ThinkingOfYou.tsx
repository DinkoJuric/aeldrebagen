import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore - sounds util not converted yet
import { playPingSound } from '../../utils/sounds';
import { Avatar } from '../../components/ui/Avatar';
import { Ping } from './usePings';

interface FloatingHeart {
    id: number;
    x: number;
    size: number;
    duration: number;
}

// "Thinking of you" ping button - one-tap warmth without obligation
export const ThinkingOfYouButton: React.FC<{ onSendPing?: () => void, fromName?: string }> = ({ onSendPing }) => {
    const [isSending, setIsSending] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();

        // Create 5 random floating hearts
        const newHearts = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 200 - 100, // Range -100 to 100
            size: 15 + Math.random() * 15,
            duration: 1.5 + Math.random() * 1.5
        }));
        setFloatingHearts(newHearts);

        // Reset animation states
        setTimeout(() => setIsSending(false), 2000);
        setTimeout(() => setFloatingHearts([]), 3000);
    };

    return (
        <div className="relative w-full">
            <AnimatePresence>
                {floatingHearts.map(heart => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{ opacity: 1, y: -200, x: heart.x }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: heart.duration, ease: "easeOut" }}
                        className="absolute left-1/2 top-0 pointer-events-none z-50"
                        style={{ marginLeft: -15 }}
                    >
                        <Heart
                            className="text-pink-400 fill-pink-400"
                            size={heart.size}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            <button
                onClick={handleSend}
                disabled={isSending}
                className={`
                    w-full p-4 rounded-2xl border-2 transition-all duration-300
                    flex items-center justify-center gap-3
                    ${isSending
                        ? 'bg-pink-100 border-pink-300 scale-95 shadow-inner'
                        : 'bg-white border-pink-200 hover:border-pink-400 hover:bg-pink-50 active:scale-95 shadow-sm'
                    }
                `}
            >
                <div className={`relative ${isSending ? 'animate-celebrate' : ''}`}>
                    <Heart
                        className={`w-8 h-8 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
                    />
                    {isSending && (
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-glow" />
                    )}
                </div>
                <span className={`font-semibold text-xl ${isSending ? 'text-pink-600' : 'text-pink-500'}`}>
                    {isSending ? 'Sendt! ❤️' : 'Tænker på dig'}
                </span>
            </button>
        </div>
    );
};

interface ThinkingOfYouIconButtonProps {
    onSendPing?: () => void;
}

// Compact icon-only version for header placement
export const ThinkingOfYouIconButton: React.FC<ThinkingOfYouIconButtonProps> = ({ onSendPing }) => {
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        playPingSound();
        onSendPing?.();
        setTimeout(() => setIsSending(false), 1500);
    };

    return (
        <button
            onClick={handleSend}
            disabled={isSending}
            aria-label="Send kærlighed"
            className={`
                p-2 rounded-full transition-all duration-300 relative
                ${isSending
                    ? 'bg-pink-200 scale-110'
                    : 'bg-pink-50 hover:bg-pink-100 active:scale-95'
                }
            `}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-300 ${isSending ? 'text-pink-500 fill-pink-500' : 'text-pink-400'}`}
            />
            {isSending && (
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-pink-400 animate-ping" />
            )}
        </button>
    );
};

interface PingNotificationProps {
    ping: Ping | null;
    onDismiss?: () => void;
}

// Ping notification that appears in recipient's view
export const PingNotification: React.FC<PingNotificationProps> = ({ ping, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (ping) {
            setIsVisible(true);
            playPingSound();

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onDismiss?.(), 500); // Wait for fade-out
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
                onClick={() => { setIsVisible(false); setTimeout(() => onDismiss?.(), 300); }}
                className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-2xl shadow-xl text-white cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-1 rounded-full">
                        <Avatar id={ping.fromName?.toLowerCase() || 'louise'} size="md" className="border-2 border-white/50" />
                    </div>
                    <div>
                        <p className="font-bold">
                            {ping.message || `${ping.fromName} tænker på dig ❤️`}
                        </p>
                        <p className="text-pink-100 text-sm">
                            {ping.sentAt?.toLocaleTimeString?.('da-DK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThinkingOfYouButton;
