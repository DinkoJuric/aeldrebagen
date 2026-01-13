import React, { createContext, useContext, useMemo } from 'react';
import { useMemberStatus } from '../features/familyPresence/useMemberStatus';
import { Member, MemberStatus } from '../types';

interface FamilyContextValue {
    members: Member[];
    memberStatuses: MemberStatus[];
    relativeStatuses: MemberStatus[];
    seniorStatus: MemberStatus | null;
    myStatus: string;
    setMyStatus: (status: string) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

export const useFamilyContext = () => {
    const context = useContext(FamilyContext);
    if (!context) {
        throw new Error('useFamilyContext must be used within a FamilyProvider');
    }
    return context;
};

interface FamilyProviderProps {
    children: React.ReactNode;
    careCircleId: string | null;
    userId: string | null;
    userDisplayName: string | null;
    userRole: 'senior' | 'relative' | null;
    members: Member[];
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({
    children,
    careCircleId,
    userId,
    userDisplayName,
    userRole,
    members,
}) => {
    const {
        memberStatuses,
        myStatus,
        setMyStatus,
        relativeStatuses,
        seniorStatus
    } = useMemberStatus(
        careCircleId,
        userId,
        userDisplayName,
        userRole ?? 'relative'
    );

    const value = useMemo(() => ({
        members,
        memberStatuses,
        relativeStatuses,
        seniorStatus,
        myStatus,
        setMyStatus,
    }), [members, memberStatuses, relativeStatuses, seniorStatus, myStatus, setMyStatus]);

    return (
        <FamilyContext.Provider value={value}>
            {children}
        </FamilyContext.Provider>
    );
};
