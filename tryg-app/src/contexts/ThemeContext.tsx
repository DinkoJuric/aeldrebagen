import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type ThemeMode = 'auto' | 'light' | 'dark';
type CircadianTheme = 'morning' | 'day' | 'evening' | 'night';

interface ThemeContextType {
    mode: ThemeMode;
    circadianTheme: CircadianTheme;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load persisted mode or default to auto
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode');
        return (saved as ThemeMode) || 'auto';
    });

    const [circadianTheme, setCircadianTheme] = useState<CircadianTheme>('day');

    // Update circadian theme based on time
    useEffect(() => {
        const updateTheme = () => {
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 11) setCircadianTheme('morning');
            else if (hour >= 11 && hour < 17) setCircadianTheme('day');
            else if (hour >= 17 && hour < 22) setCircadianTheme('evening');
            else setCircadianTheme('night');
        };

        updateTheme();
        const timer = setInterval(updateTheme, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    // Persist mode changes
    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    // Determine if we should be in dark mode
    const isDark = useMemo(() => {
        if (mode === 'dark') return true;
        if (mode === 'light') return false;
        // AUTO: Dark in evening and night
        return circadianTheme === 'evening' || circadianTheme === 'night';
    }, [mode, circadianTheme]);

    // Apply theme class to body
    useEffect(() => {
        const body = document.body;
        if (isDark) {
            body.classList.add('theme-dark');
        } else {
            body.classList.remove('theme-dark');
        }
    }, [isDark]);

    const value = useMemo(() => ({
        mode,
        circadianTheme,
        setMode,
        isDark
    }), [mode, circadianTheme, isDark]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
