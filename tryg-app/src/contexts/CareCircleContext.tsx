/**
 * CareCircleContext
 * 
 * Provides shared care circle data to all components without prop drilling.
 * Use `useCareCircleContext()` to access data like careCircleId, memberStatuses, etc.
 */

import { createContext, useContext, ReactNode } from 'react';
import { CareCircleContextValue } from '../types';


const defaultValue: CareCircleContextValue = {
    careCircleId: null,
    seniorId: null,
    seniorName: 'Senior',
    currentUserId: null,
    userRole: null,
    userName: '',
    memberStatuses: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: null,
    setMyStatus: async () => { },
};

const CareCircleContext = createContext<CareCircleContextValue>(defaultValue);

/**
 * Hook to access CareCircle context
 */
export function useCareCircleContext(): CareCircleContextValue {
    const context = useContext(CareCircleContext);
    if (!context) {
        throw new Error('useCareCircleContext must be used within a CareCircleProvider');
    }
    return context;
}

export interface CareCircleProviderProps extends Partial<CareCircleContextValue> {
    children: ReactNode;
}

/**
 * Provider component that wraps the app and provides care circle data
 */
export function CareCircleProvider({
    children,
    careCircleId = null,
    seniorId = null,
    seniorName = 'Senior',
    currentUserId = null,
    userRole = null,
    userName = '',
    memberStatuses = [],
    relativeStatuses = [],
    seniorStatus = null,
    myStatus = null,
    setMyStatus = async () => { },
}: CareCircleProviderProps) {
    const value: CareCircleContextValue = {
        careCircleId,
        seniorId,
        seniorName,
        currentUserId,
        userRole,
        userName,
        memberStatuses,
        relativeStatuses,
        seniorStatus,
        myStatus,
        setMyStatus,
    };

    return (
        <CareCircleContext.Provider value={value}>
            {children}
        </CareCircleContext.Provider>
    );
}

export default CareCircleContext;
