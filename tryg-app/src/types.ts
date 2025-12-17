/**
 * Core Type Definitions for Tryg App
 */

export interface Member {
    docId: string;
    displayName: string;
    role: 'senior' | 'relative';
    status: 'home' | 'work' | 'traveling' | 'available' | 'busy';
    updatedAt?: any; // Firestore timestamp
    id?: string; // Sometimes used interchangeably with docId
    // Generational Orbits
    relationship?: string; // e.g. 'son', 'granddaughter'
    accessLevel?: 'admin' | 'caregiver' | 'joy' | 'guest'; // Permissions
    archetype?: 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader'; // Superpower badge
}

export interface UserProfile {
    email: string;
    displayName: string;
    role: 'senior' | 'relative';
    careCircleId?: string;
    consentGiven: boolean;
    consentTimestamp?: any;
    uid?: string;
    photoURL?: string;
}

export interface CareCircle {
    id: string;
    seniorId: string;
    seniorName: string;
    inviteCode: string;
    createdAt: any;
}

export interface CareCircleContextValue {
    careCircleId: string | null;
    seniorId: string | null;
    seniorName: string | null;
    currentUserId: string | null;
    userRole: 'senior' | 'relative' | null;
    userName: string | null;
    memberStatuses: Member[];
    relativeStatuses: Member[];
    seniorStatus?: Member;
    myStatus: string;
    setMyStatus: (status: string) => void;
}
