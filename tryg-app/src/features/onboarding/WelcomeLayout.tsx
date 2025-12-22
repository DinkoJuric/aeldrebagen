import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface WelcomeLayoutProps {
    children: React.ReactNode;
    step: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
    bgClass?: string;
    theme?: 'warm' | 'cool';
}

export const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({
    children,
    step,
    totalSteps,
    onNext,
    onBack,
    theme = 'warm'
}) => {
    const { t } = useTranslation();
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Theme-based colors
    const themeColors = {
        warm: {
            bg: "bg-amber-50",
            accent: "bg-amber-500",
            text: "text-amber-900",
            button: "bg-amber-600 hover:bg-amber-700 text-white"
        },
        cool: {
            bg: "bg-sky-50",
            accent: "bg-sky-500",
            text: "text-slate-900",
            button: "bg-sky-600 hover:bg-sky-700 text-white"
        }
    };

    const colors = themeColors[theme];

    return (
        <div className={cn("relative w-full h-[100dvh] overflow-hidden flex flex-col", colors.bg)}>
            {/* Top Bar: Progress & Audio (Relative - pushes content down) */}
            <div className="w-full p-6 z-20 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{
                                width: i === step ? 24 : 8,
                                opacity: i <= step ? 1 : 0.3,
                                backgroundColor: i <= step ? (theme === 'warm' ? '#d97706' : '#0284c7') : '#9ca3af'
                            }}
                            className="h-2 rounded-full transition-all duration-300"
                        />
                    ))}
                </div>

                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-stone-600 hover:bg-white/40 transition-colors"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            {/* Main Content Area (Scrollable - fills remaining space) */}
            <div className="flex-1 w-full overflow-y-auto min-h-0 scrollbar-hide">
                <div className="min-h-full flex flex-col justify-center items-center p-6 pb-4 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full max-w-sm flex flex-col items-center gap-6"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Navigation (Relative - sits at bottom of flex container) */}
            <div className="p-8 z-20 w-full flex justify-between items-center bg-transparent shrink-0">
                {/* Back Button (Hidden on step 0) */}
                <button
                    onClick={onBack}
                    className={cn(
                        "text-sm font-medium px-4 py-2 text-stone-500 hover:text-stone-800 transition-colors",
                        step === 0 && "opacity-0 pointer-events-none"
                    )}
                >
                    {t('back', 'Tilbage')}
                </button>

                {/* Next/Finish Button */}
                <button
                    onClick={onNext}
                    className={cn(
                        "flex items-center gap-2 px-8 py-4 rounded-full shadow-xl shadow-stone-200/50 transform transition-all active:scale-95",
                        colors.button
                    )}
                >
                    <span className="text-lg font-bold">
                        {step === totalSteps - 1 ? t('start', 'Start') : t('next', 'Næste')}
                    </span>
                    {step === totalSteps - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Global Audio Helper (Placeholder for future audio impl) */}
            <audio ref={audioRef} muted={isMuted} />
        </div>
    );
};
