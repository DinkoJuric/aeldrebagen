
import React, { useState, useEffect } from 'react';

/**
 * Time-aware background that shifts colors to match circadian rhythms.
 * * PHASES:
 * - Night (22:00 - 06:00): Deep Sleep (Dark Stone/Indigo)
 * - Morning (06:00 - 11:00): Awakening (Fresh Teal)
 * - Day (11:00 - 17:00): Activity (Warm Amber)
 * - Evening (17:00 - 22:00): Winding Down (Soft Indigo/Stone)
 */
export const LivingBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gradient, setGradient] = useState('');

    useEffect(() => {
        const updateAtmosphere = () => {
            const hour = new Date().getHours();

            if (hour >= 6 && hour < 11) {
                // MORNING: Fresh, energizing, clarity.
                setGradient('bg-gradient-to-br from-teal-50 via-white to-stone-50');
            } else if (hour >= 11 && hour < 17) {
                // DAY: Warmth, activity, sunlight.
                setGradient('bg-gradient-to-br from-amber-50 via-white to-orange-50/30');
            } else if (hour >= 17 && hour < 22) {
                // EVENING: Calm, settling, cozy.
                setGradient('bg-gradient-to-br from-indigo-50 via-stone-50 to-stone-100');
            } else {
                // NIGHT: Rest, visual comfort (Dark Mode-ish).
                setGradient('bg-gradient-to-br from-stone-900 via-slate-800 to-indigo-950 text-stone-200');
            }
        };

        updateAtmosphere();
        const timer = setInterval(updateAtmosphere, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`min-h-screen w-full transition-colors duration-[2000ms] ease-in-out ${gradient}`}>
            {children}
        </div>
    );
};
