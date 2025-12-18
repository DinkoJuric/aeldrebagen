/**
 * Core Type Definitions for Tryg App
 */

export interface Member {
    docId: string;
    displayName: string;
    role: 'senior' | 'relative';
    status: 'home' | 'work' | 'traveling' | 'available' | 'busy' | 'coffee_ready' | 'coffee_coming';
    updatedAt?: any; // Firestore timestamp
    id?: string; // Sometimes used interchangeably with docId
    // Generational Orbits
    relationship?: string; // e.g. 'son', 'granddaughter'
    accessLevel?: 'admin' | 'caregiver' | 'joy' | 'guest'; // Permissions
    archetype?: 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader'; // Superpower badge
}

export interface MemberStatus {
    docId: string; // This is the userId
    status: string;
    displayName: string;
    role: 'senior' | 'relative';
    updatedAt?: any;
    [key: string]: any;
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
    languagePreference?: string;
}

export interface CareCircle {
    id: string;
    seniorId: string;
    seniorName: string;
    inviteCode: string;
    createdAt: any;
    lastResetDate?: string; // Daily reset tracker (YYYY-MM-DD)
}

export interface CareCircleContextValue {
    // Circle info
    careCircleId: string | null;
    seniorId: string | null;
    seniorName: string;

    // Current user info
    currentUserId: string | null;
    userRole: 'senior' | 'relative' | null;
    userName: string;

    // Member statuses (for FamilyPresence, etc.)
    memberStatuses: MemberStatus[];
    relativeStatuses: MemberStatus[];
    seniorStatus: MemberStatus | null;
    myStatus: MemberStatus | null;
    setMyStatus: (status: string) => Promise<void>;
}
