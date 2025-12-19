import { Task } from './features/tasks/useTasks';
import { SymptomLog } from './features/symptoms/useSymptoms';


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

export type AppTab = 'daily' | 'family' | 'health' | 'spil';

export interface CareCircleContextValue {
    // Circle info
    careCircleId: string | null;
    seniorId: string | null;
    seniorName: string;

    // Current user info
    currentUserId: string | null;
    userRole: 'senior' | 'relative' | null;
    userName: string;
    relativeName: string; // Added

    // Member statuses (for FamilyPresence, etc.)
    memberStatuses: MemberStatus[];
    members: Member[];
    relativeStatuses: MemberStatus[];
    seniorStatus: MemberStatus | null;
    myStatus: string; // Changed from MemberStatus | null to string
    setMyStatus: (status: string) => Promise<void>;

    // Feature Data & Actions (The Prop Drilling Cure)
    // ---------------------------------------------

    // Navigation
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;

    // Tasks
    tasks: Task[];
    toggleTask: (id: string) => void; // Return type changed
    addTask: (task: Partial<Task>) => void; // Return type changed

    // Symptoms
    symptoms: SymptomLog[];
    addSymptom: (symptom: any) => void; // Return type changed

    // Weekly Questions
    weeklyAnswers: any[]; // Type changed from WeeklyAnswer[] to any[]
    addWeeklyAnswer: (answer: string) => void; // Return type changed
    toggleLike: (answerId: string, userId: string, isLiked: boolean) => void; // Signature changed
    addReply: (answerId: string, reply: any) => void; // Signature changed

    // "Thinking of You" (Pings)
    latestPing: any | null; // Ping type
    sendPing: (toRole: 'senior' | 'relative') => void; // Return type changed
    dismissPing: (pingId: string) => void; // Signature changed

    // Check-in
    lastCheckIn: any | null; // Type changed
    recordCheckIn: (status: string) => Promise<string | void | undefined>; // Signature changed
}
