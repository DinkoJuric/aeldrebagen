// Care Circle hook - manages the shared family space
// Handles creating circles, joining via code, and real-time membership

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    DocumentData,
    QuerySnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CareCircle, Member, UserProfile } from '../types';

// Generate a random 6-character invite code
const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCareCircle(userId: string | undefined, _userProfile: UserProfile | null) {
    const [careCircle, setCareCircle] = useState<CareCircle | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    // Find user's care circle on mount
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const findCareCircle = async () => {
            try {
                // Query for user's circle memberships
                const membershipsQuery = query(
                    collection(db, 'careCircleMemberships'),
                    where('userId', '==', userId)
                );
                let membershipsSnapshot: QuerySnapshot<DocumentData> | { empty: boolean; docs: DocumentData[] } = await getDocs(membershipsQuery);

                if (!membershipsSnapshot.empty) {
                    const membership = membershipsSnapshot.docs[0].data();
                    const circleRef = doc(db, 'careCircles', membership.circleId);
                    const circleDoc = await getDoc(circleRef);

                    if (circleDoc.exists()) {
                        setCareCircle({ id: circleDoc.id, ...circleDoc.data() } as CareCircle);
                    } else {
                        console.warn('[useCareCircle] Circle doc does not exist:', membership.circleId);
                    }
                }
            } catch (err: unknown) {
                console.error('[useCareCircle] Error finding care circle:', err);
                const errorMessage = (err as Error).message || '';
                // Check if it's a missing index error
                if (errorMessage.includes('index')) {
                    setError('Database index mangler. Kontakt support.');
                } else {
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        findCareCircle();
    }, [userId]);

    // Subscribe to members when we have a circle
    useEffect(() => {
        if (!careCircle?.id) return;

        const membersQuery = query(
            collection(db, 'careCircleMemberships'),
            where('circleId', '==', careCircle.id)
        );

        const unsubscribe = onSnapshot(membersQuery, (snapshot) => {
            const memberList = snapshot.docs.map(doc => ({
                id: doc.id,
                docId: doc.id, // Explicitly map docId for Member interface compliance
                ...doc.data()
            })) as Member[];
            setMembers(memberList);
        });

        return () => unsubscribe();
    }, [careCircle?.id]);

    // Create a new care circle (for seniors)
    const createCareCircle = useCallback(async (seniorName: string) => {
        if (!userId) return;

        try {
            setError(null);
            const newCode = generateInviteCode();
            const circleId = `circle_${userId}_${Date.now()}`;

            // Create the circle
            await setDoc(doc(db, 'careCircles', circleId), {
                seniorId: userId,
                seniorName,
                inviteCode: newCode,
                createdAt: serverTimestamp(),
            });

            // Add senior as first member
            await setDoc(doc(db, 'careCircleMemberships', `${circleId}_${userId}`), {
                circleId,
                userId,
                displayName: seniorName,
                role: 'senior',
                joinedAt: serverTimestamp(),
            });

            // Initialize default settings
            await setDoc(doc(db, 'careCircles', circleId, 'settings', 'main'), {
                familyStatus: 'home',
                lastUpdated: serverTimestamp(),
            });

            const newCircle: CareCircle = {
                id: circleId,
                seniorId: userId,
                seniorName,
                inviteCode: newCode,
                createdAt: new Date().toISOString() // Approximate time for client immediately
            }

            setCareCircle(newCircle);
            setInviteCode(newCode);

            return circleId;
        } catch (err: unknown) {
            console.error('Error creating care circle:', err);
            const message = (err as Error).message;
            setError(message);
            throw err;
        }
    }, [userId]);

    // Join an existing care circle via invite code
    const joinCareCircle = useCallback(async (code: string, displayName: string, relationship?: string) => {
        if (!userId) return;

        try {
            setError(null);

            // Find circle by invite code
            const circlesQuery = query(
                collection(db, 'careCircles'),
                where('inviteCode', '==', code.toUpperCase())
            );
            const circlesSnapshot = await getDocs(circlesQuery);

            if (circlesSnapshot.empty) {
                throw new Error('Ugyldig invitationskode');
            }

            const circleDoc = circlesSnapshot.docs[0];
            const circleId = circleDoc.id;
            const circleData = circleDoc.data();

            // Add user as member
            await setDoc(doc(db, 'careCircleMemberships', `${circleId}_${userId}`), {
                circleId,
                userId,
                displayName,
                role: 'relative',
                joinedAt: serverTimestamp(),
                relationship: relationship || 'family' // Default if not provided
            });

            setCareCircle({ id: circleId, ...circleData } as CareCircle);

            return circleId;
        } catch (err: unknown) {
            console.error('Error joining care circle:', err);
            const message = (err as Error).message;
            setError(message);
            throw err;
        }
    }, [userId]);

    // Get invite code for sharing
    const getInviteCode = useCallback(async () => {
        if (!careCircle?.id) return null;

        try {
            const circleDoc = await getDoc(doc(db, 'careCircles', careCircle.id));
            if (circleDoc.exists()) {
                const code = circleDoc.data().inviteCode;
                setInviteCode(code);
                return code;
            }
        } catch (err) {
            console.error('Error getting invite code:', err);
        }
        return null;
    }, [careCircle?.id]);

    // Leave care circle
    const leaveCareCircle = useCallback(async () => {
        if (!careCircle?.id || !userId) return;

        try {
            await deleteDoc(doc(db, 'careCircleMemberships', `${careCircle.id}_${userId}`));
            setCareCircle(null);
            setMembers([]);
        } catch (err: unknown) {
            console.error('Error leaving care circle:', err);
            const message = (err as Error).message;
            setError(message);
            throw err;
        }
    }, [careCircle?.id, userId]);

    // Update member profile (Self)
    const updateMember = useCallback(async (data: Partial<Member>) => {
        if (!careCircle?.id || !userId) return;

        try {
            const memberRef = doc(db, 'careCircleMemberships', `${careCircle.id}_${userId}`);
            await setDoc(memberRef, data, { merge: true });
        } catch (err: unknown) {
            console.error('Error updating member:', err);
            throw err;
        }
    }, [careCircle?.id, userId]);

    // Update ANY member (Admin Action) - Renaming/Relation changes
    const updateMemberByDocId = useCallback(async (memberId: string, data: Partial<Member>) => {
        if (!careCircle?.id) return;

        try {
            console.log("📝 Updating member:", memberId, data);
            const memberRef = doc(db, 'careCircleMemberships', memberId);
            await setDoc(memberRef, data, { merge: true });
        } catch (err: unknown) {
            console.error('Error updating member (Admin):', err);
            throw err;
        }
    }, [careCircle?.id]);

    return {
        careCircle,
        members,
        loading,
        error,
        inviteCode,
        createCareCircle,
        joinCareCircle,
        getInviteCode,
        leaveCareCircle,
        updateMember,
        updateAnyMember: updateMemberByDocId,
        hasCareCircle: !!careCircle,
    };
}

export default useCareCircle;
