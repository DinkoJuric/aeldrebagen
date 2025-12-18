import React, { useState, useEffect } from 'react';

/**
 * LivingBackground 2.0 - Ambient circadian atmosphere
 * Uses subtle animated SVG blobs and time-aware gradients
 */
export const LivingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState({
        gradient: 'bg-stone-50',
        blob1: 'fill-teal-200/30',
        blob2: 'fill-amber-100/20'
    });

    useEffect(() => {
        const updateAtmosphere = () => {
            const hour = new Date().getHours();

            if (hour >= 6 && hour < 11) {
                // MORNING: Fresh clarity
                setTheme({
                    gradient: 'bg-gradient-to-br from-teal-50 via-white to-stone-50',
                    blob1: 'fill-teal-200/40',
                    blob2: 'fill-sky-100/30'
                });
            } else if (hour >= 11 && hour < 17) {
                // DAY: Warm activity
                setTheme({
                    gradient: 'bg-gradient-to-br from-amber-50 via-white to-orange-50/40',
                    blob1: 'fill-amber-200/20',
                    blob2: 'fill-orange-100/30'
                });
            } else if (hour >= 17 && hour < 22) {
                // EVENING: Soft cozy settling
                setTheme({
                    gradient: 'bg-gradient-to-br from-indigo-50 via-stone-50 to-stone-100',
                    blob1: 'fill-indigo-200/20',
                    blob2: 'fill-stone-300/30'
                });
            } else {
                // NIGHT: Deep rest
                setTheme({
                    gradient: 'bg-gradient-to-br from-stone-900 via-slate-800 to-indigo-950',
                    blob1: 'fill-indigo-500/10',
                    blob2: 'fill-slate-700/20'
                });
            }
        };

        updateAtmosphere();
        const timer = setInterval(updateAtmosphere, 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-all duration-[3000ms] ease-in-out relative overflow-hidden ${theme.gradient}`}>
            {/* Ambient Background Blobs - Increased visibility & soft blur */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden blur-3xl opacity-80">
                <svg viewBox="0 0 100 100" className="absolute -top-10 -left-10 w-96 h-96 transition-colors duration-[3000ms]">
                    <path
                        className={`${theme.blob1} animate-breathe`}
                        d="M33,-47.1C43.3,-40.3,52.5,-30.9,57.1,-19.5C61.7,-8,61.7,5.5,57.9,18C54,30.5,46.3,42,35.3,49.8C24.3,57.6,10.1,61.7,-3.4,66.4C-16.9,71.1,-29.7,76.4,-40.7,71.7C-51.7,67,-61,52.3,-66.2,37.3C-71.4,22.3,-72.6,7,-67.7,-5.7C-62.8,-18.3,-51.8,-28.3,-40.3,-35.1C-28.8,-41.8,-16.8,-45.3,-4.2,-39.5C8.3,-33.7,19.9,-18.6,33,-47.1Z"
                        transform="translate(50 50)"
                    />
                </svg>
                <svg viewBox="0 0 100 100" className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] transition-colors duration-[3000ms]">
                    <path
                        className={`${theme.blob2} animate-glow-loop`}
                        d="M45.5,-63.3C58.3,-55.8,67.6,-41.2,71.2,-26C74.8,-10.8,72.7,4.9,67.8,20.1C62.9,35.3,55.1,50.1,42.7,58.8C30.3,67.6,13.2,70.2,-4,75.7C-21.2,81.1,-38.5,89.4,-51.7,85.2C-64.9,81,-74,64.2,-78.3,47.1C-82.6,30,-82,12.5,-77.7,-3.7C-73.4,-19.9,-65.4,-34.8,-53.8,-42.6C-42.2,-50.3,-27,-51,-13.3,-55.7C0.4,-60.4,14.6,-69,30.3,-70.8C46.1,-72.6,63.3,-67.6,45.5,-63.3Z"
                        transform="translate(50 50)"
                    />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen">
                {children}
            </div>
        </div>
    );
};
