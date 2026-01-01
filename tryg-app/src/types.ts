import { Timestamp } from 'firebase/firestore';

export type FirestoreDate = Timestamp | Date | string | number | null;

export interface Task {
    id: string;
    title: string;
    period: string;
    time: string;
    emoji?: string;
    description?: string;
    completed: boolean;
    createdAt?: FirestoreDate;
    completedAt?: FirestoreDate;
    recurring?: boolean;
    originalId?: string;
    type?: string; // e.g. 'medication'
    [key: string]: unknown;
}
export interface WeeklyReply {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
}

export interface WeeklyAnswer {
    id: string;
    questionId?: string;
    text?: string;
    userId?: string;
    userName?: string;
    answeredAt?: FirestoreDate; // Firestore Timestamp
    likes?: string[];
    replies?: WeeklyReply[];
    audioUrl?: string;
}

export interface Ping {
    id: string;
    fromName: string;
    fromUserId: string;
    toRole: 'senior' | 'relative';
    sentAt: FirestoreDate; // Date | Timestamp
    toUserId?: string;
    type?: string;
    message?: string;
}

export interface Photo {
    id: string;
    imageUrl: string;
    storagePath?: string;
    fromUserId: string;
    fromName: string;
    uploadedAt: FirestoreDate;
    viewedAt?: FirestoreDate;
}

export interface HelpOffer {
    docId: string;
    id: string;
    label: string;
    emoji: string;
    createdByUid?: string;
    createdByRole?: string;
    createdByName?: string;
    createdAt?: FirestoreDate;
}

export interface HelpRequest {
    docId: string;
    id: string;
    label: string;
    emoji: string;
    createdByUid?: string;
    createdByRole?: string;
    createdByName?: string;
    createdAt?: FirestoreDate;
}

export interface Severity {
    id: 'mild' | 'moderate' | 'severe';
    label: string;
    emoji: string;
    level: number;
}

export interface BodyLocation {
    id: string;
    label: string;
    emoji: string;
    severity?: Severity;
}

export interface SymptomLog {
    id: string;
    label?: string;
    type?: string; // e.g. 'pain', 'dizzy'
    color?: string;
    bodyLocation?: BodyLocation;
    time: string;
    date: string;
    loggedAt?: FirestoreDate; // Firestore Timestamp
}

export interface SymptomStats {
    count: number;
    lastOccurrence: string | null;
}

/**
 * Core Type Definitions for Tryg App
 */

export interface Member {
    docId: string;
    userId?: string; // Added userId
    displayName: string;
    gender?: 'male' | 'female' | 'other';
    role: 'senior' | 'relative';
    status: 'home' | 'work' | 'traveling' | 'available' | 'busy' | 'coffee_ready' | 'coffee_coming';
    updatedAt?: FirestoreDate; // Firestore timestamp
    id?: string; // Sometimes used interchangeably with docId
    // Generational Orbits
    relationship?: string; // e.g. 'son', 'granddaughter'
    edges?: Record<string, string>; // Map of relation to other members { [userId]: "brother" }
    relationsLastUpdated?: FirestoreDate;
    accessLevel?: 'admin' | 'caregiver' | 'joy' | 'guest'; // Permissions
    archetype?: 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader'; // Superpower badge
}

export interface MemberStatus {
    docId: string; // This is the userId
    status: string;
    displayName: string;
    role: 'senior' | 'relative';
    updatedAt?: FirestoreDate;
    [key: string]: unknown;
}

export interface UserProfile {
    email: string;
    displayName: string;
    role: 'senior' | 'relative';
    careCircleId?: string;
    consentGiven: boolean;
    consentTimestamp?: FirestoreDate;
    uid?: string;
    photoURL?: string;
    languagePreference?: string;
}

export interface CareCircle {
    id: string;
    seniorId: string;
    seniorName: string;
    inviteCode: string;
    createdAt: FirestoreDate;
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
    addSymptom: (symptom: Partial<SymptomLog>) => Promise<string | undefined>;

    // Weekly Questions
    weeklyAnswers: WeeklyAnswer[];
    addWeeklyAnswer: (answer: string) => Promise<string | undefined>;
    toggleLike: (answerId: string, userId: string, isLiked: boolean) => Promise<void>;
    addReply: (answerId: string, reply: Omit<WeeklyReply, 'id'>) => Promise<void>;

    // "Thinking of You" (Pings)
    latestPing: Ping | null;
    sendPing: (toRole: 'senior' | 'relative') => Promise<string | undefined>;
    dismissPing: () => void;

    // Check-in
    lastCheckIn: string | null;
    recordCheckIn: () => Promise<string | void | undefined>;

    // Member Management
    updateMember: (data: Partial<Member>) => Promise<void>;
    updateAnyMember: (memberId: string, data: Partial<Member>) => Promise<void>;
}
