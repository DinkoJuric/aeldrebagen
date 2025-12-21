import { useState, useEffect } from 'react';

export type CircadianPhase = 'dawn' | 'day' | 'golden' | 'midnight';

/**
 * useCircadianTheme 2.0 (The Time Engine)
 * Determines the ambient theme based on 4 distinct phases logic.
 * 
 * Phases:
 * - Dawn    (05:00 - 09:00): Soft awakening
 * - Day     (09:00 - 17:00): Clear & Bright
 * - Golden  (17:00 - 18:00): Hygge "Sunset" transition
 * - Midnight(18:00 - 05:00): Premium Dark Mode
 */
export const useCircadianTheme = (manualDarkMode: boolean) => {
    const [phase, setPhase] = useState<CircadianPhase>('day');

    useEffect(() => {
        const updatePhase = () => {
            // If user FORCES manual dark mode, they always get the "Midnight" experience
            if (manualDarkMode) {
                setPhase('midnight');
                return;
            }

            const now = new Date();
            const hour = now.getHours();

            // Logic Check: 18:00 MUST be Midnight start
            if (hour >= 5 && hour < 9) {
                setPhase('dawn');
            } else if (hour >= 9 && hour < 17) {
                setPhase('day');
            } else if (hour >= 17 && hour < 18) {
                setPhase('golden'); // Short "Hygge Hour"
            } else {
                setPhase('midnight'); // 18:00 - 05:00
            }
        };

        updatePhase();
        const timer = setInterval(updatePhase, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [manualDarkMode]);

    return phase;
};
