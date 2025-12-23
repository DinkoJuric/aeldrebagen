import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true); // Default to muted for better autoplay support

    return (
        <AudioContext.Provider value={{ isMuted, setIsMuted }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
