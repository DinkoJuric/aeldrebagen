import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useCircadianTheme, CircadianPhase } from '../hooks/useCircadianTheme';

type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    circadianPhase: CircadianPhase;
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

    // Use the robust Circadian Engine
    const circadianPhase = useCircadianTheme(mode === 'dark');

    // Persist mode changes
    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    // Determine if we should be in dark mode
    // Determine if we should be in dark mode
    const isDark = useMemo(() => {
        if (mode === 'dark') return true;
        if (mode === 'light') return false;
        // AUTO: Phase 'midnight' is strictly for dark mode
        return circadianPhase === 'midnight';
    }, [mode, circadianPhase]);

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
        circadianPhase,
        setMode,
        isDark
    }), [mode, circadianPhase, isDark]);

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
