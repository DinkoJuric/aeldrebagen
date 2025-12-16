// @ts-check
/**
 * CareCircleContext
 * 
 * Provides shared care circle data to all components without prop drilling.
 * Use `useCareCircleContext()` to access data like careCircleId, memberStatuses, etc.
 */

import { createContext, useContext } from 'react';
import '../types'; // Import types for JSDoc

// Create the context with default values
const CareCircleContext = createContext({
    // Circle info
    careCircleId: null,
    seniorId: null,
    seniorName: 'Senior',

    // Current user info
    currentUserId: null,
    userRole: null,
    userName: '',

    // Member statuses (for FamilyPresence, etc.)
    memberStatuses: [],
    relativeStatuses: [],
    seniorStatus: null,
    myStatus: null,
    setMyStatus: () => { },
});

/**
 * Hook to access CareCircle context
 * @returns {Object} Care circle data and functions
 * @throws {Error} If used outside of CareCircleProvider
 */
export function useCareCircleContext() {
    const context = useContext(CareCircleContext);
    if (!context) {
        throw new Error('useCareCircleContext must be used within a CareCircleProvider');
    }
    return context;
}

/**
 * Provider component that wraps the app and provides care circle data
 */
export function CareCircleProvider({
    children,
    careCircleId,
    seniorId,
    seniorName,
    currentUserId,
    userRole,
    userName,
    memberStatuses = [],
    relativeStatuses = [],
    seniorStatus = null,
    myStatus = null,
    setMyStatus = () => { },
}) {
    const value = {
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
