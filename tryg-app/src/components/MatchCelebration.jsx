import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * Match Celebration Component
 * Shows animated celebration when offers match requests
 */
export const MatchCelebration = ({
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
        setTimeout(onDismiss, 300);
    };

    if (!match) return null;

    const { celebration, offer, request, isStatusMatch } = match;

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center p-4
                transition-all duration-300
                ${isVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}
            `}
            onClick={handleDismiss}
        >
            <div
                className={`
                    bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full
                    transform transition-all duration-300
                    ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Sparkle decoration */}
                <div className="absolute -top-3 -right-3">
                    <div className="bg-yellow-400 rounded-full p-2 animate-bounce">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-100"
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
                                {offer.createdByRole === 'relative' ? 'Du' : seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{offer.label}</span>
                        </div>
                    )}
                    {request && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-indigo-600">💜</span>
                            <span className="text-stone-600">
                                {request.createdByRole === 'relative' ? 'Du' : seniorName}:
                            </span>
                            <span className="font-medium text-stone-800">{request.label}</span>
                        </div>
                    )}
                    {isStatusMatch && (
                        <div className="flex items-center gap-2 text-sm text-teal-600">
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

/**
 * Mini banner version for inline display
 */
export const MatchBanner = ({ match, onClick, onDismiss }) => {
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
