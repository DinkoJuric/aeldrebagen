import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ActiveMatch } from './useHelpExchangeMatch';

interface MatchCelebrationProps {
    match: ActiveMatch | null;
    onDismiss?: () => void;
    onAction?: (action: string) => void;
    seniorName?: string;
}

/**
 * Match Celebration Component
 * Shows animated celebration when offers match requests
 */
export const MatchCelebration: React.FC<MatchCelebrationProps> = ({
    match,
    onDismiss,
    onAction,
    seniorName = 'Mor'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // We need to wait for animation before calling parent
        if (onDismiss) {
            setTimeout(onDismiss, 300);
        }
    };

    if (!match) return null;

    const { celebration, offer, request, isStatusMatch } = match;

    return (
        <div
            className={`
                fixed inset-0 z-[100] flex items-center justify-center p-4
                transition-all duration-300
                ${isVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}
            `}
            onClick={handleDismiss}
        >
            <div
                className={`
                    bg-gradient-to-br from-white via-white to-amber-50 
                    rounded-3xl shadow-2xl border-4 border-white ring-4 ring-amber-100
                    p-8 max-w-sm w-full relative overflow-hidden
                    transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                    ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                {/* Sparkle decoration - positioned inside modal bounds */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full p-2 shadow-lg animate-bounce">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-stone-100 transition-colors z-20 backdrop-blur-sm"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>

                {/* Celebration content */}
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">{celebration.emoji}</div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-2">
                        {celebration.title}
                    </h2>
                    <p className="text-stone-600">{celebration.message}</p>
                </div>

                {/* Match details */}
                <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
                    {offer && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-teal-600">✨</span>
                            <span className="text-stone-600">
                                {offer.createdByName || seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{offer.label}</span>
                        </div>
                    )}
                    {request && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-indigo-600">💜</span>
                            <span className="text-stone-600">
                                {request.createdByName || seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{request.label}</span>
                        </div>
                    )}
                    {isStatusMatch && (
                        <div className="flex items-center gap-2 text-teal-600 text-sm">
                            <span>🟢</span>
                            <span>Status: Har tid nu</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        onClick={() => {
                            onAction?.(celebration.action);
                            handleDismiss();
                        }}
                    >
                        {celebration.cta} →
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="w-full text-sm text-stone-500 hover:text-stone-700 py-2"
                    >
                        Måske senere
                    </button>
                </div>
            </div>
        </div>
    );
};

interface MatchBannerProps {
    match: ActiveMatch | null;
    onClick?: () => void;
    onDismiss?: () => void;
}

/**
 * Mini banner version for inline display
 */
export const MatchBanner: React.FC<MatchBannerProps> = ({ match, onClick, onDismiss }) => {
    if (!match) return null;

    const { celebration } = match;

    return (
        <div
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className="text-3xl">{celebration.emoji}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-amber-800">{celebration.title}</span>
                    </div>
                    <p className="text-sm text-amber-700">{celebration.message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                        className="p-1 rounded-full hover:bg-amber-100"
                    >
                        <X className="w-4 h-4 text-amber-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default MatchCelebration;
