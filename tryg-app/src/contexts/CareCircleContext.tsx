import { createContext, useContext } from 'react';
import { CareCircleContextValue } from '../types';

export const CareCircleContext = createContext<CareCircleContextValue>({
    careCircleId: null,
    seniorId: null,
    seniorName: 'Senior',
    currentUserId: null,
    userRole: null,
    userName: 'Bruger',
    relativeName: 'Pårørende',
    memberStatuses: [],
    members: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: null,
    setMyStatus: async () => { },
    activeTab: 'daily',
    setActiveTab: () => { },
    tasks: [],
    toggleTask: () => { },
    addTask: () => { },
    symptoms: [],
    addSymptom: () => { },
    weeklyAnswers: [],
    addWeeklyAnswer: () => { },
    toggleLike: () => { },
    addReply: () => { },
    latestPing: null,
    sendPing: () => { },
    dismissPing: () => { },
    lastCheckIn: null,
    recordCheckIn: async () => undefined,
});

/**
 * Hook to access CareCircle context
 */
export const useCareCircleContext = () => {
    const context = useContext(CareCircleContext);
    if (!context) {
        throw new Error('useCareCircleContext must be used within a CareCircleProvider');
    }
    return context;
};

/**
 * Provider component that wraps the app and provides circle state
 */
export const CareCircleProvider = CareCircleContext.Provider;
