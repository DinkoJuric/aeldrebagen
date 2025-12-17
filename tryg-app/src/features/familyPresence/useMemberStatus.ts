
// Member Status hook - per-member status tracking via Firestore
// Allows each family member to have their own status (visible to others in the circle)

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface MemberStatus {
    docId: string; // This is the userId
    status: string;
    displayName: string;
    role: 'senior' | 'relative';
    updatedAt?: any;
    [key: string]: any;
}

export function useMemberStatus(
    circleId: string | null,
    userId: string | null,
    displayName: string | null,
    role: 'senior' | 'relative' | null
) {
    const [memberStatuses, setMemberStatuses] = useState<MemberStatus[]>([]);
    const [myStatus, setMyStatusState] = useState<string>('home');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to all member statuses in the circle
    useEffect(() => {
        if (!circleId) {
            setMemberStatuses([]);
            setLoading(false);
            return;
        }

        const statusesRef = collection(db, 'careCircles', circleId, 'memberStatuses');
        const statusesQuery = query(statusesRef);

        const unsubscribe = onSnapshot(statusesQuery,
            (snapshot) => {
                const statuses = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,
                    ...docSnap.data()
                })) as MemberStatus[];

                // Debug: Log status changes
                // console.log('[useMemberStatus] Received statuses:', statuses.length, statuses.map(s => `${s.displayName}: ${s.status}`));

                setMemberStatuses(statuses);

                // Update my own status from the fetched data
                if (userId) {
                    const myStatusDoc = statuses.find(s => s.docId === userId);
                    if (myStatusDoc) {
                        setMyStatusState(myStatusDoc.status);
                    }
                }

                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching member statuses:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, userId]);

    // Update current user's status
    const setMyStatus = useCallback(async (status: string) => {
        if (!circleId || !userId) return;

        const statusRef = doc(db, 'careCircles', circleId, 'memberStatuses', userId);

        try {
            await setDoc(statusRef, {
                status,
                displayName: displayName || 'Ukendt',
                role: role || 'relative',
                updatedAt: serverTimestamp(),
            }, { merge: true });

            // Optimistic update
            setMyStatusState(status);
        } catch (err: any) {
            console.error('Error updating member status:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId, userId, displayName, role]);

    // Get relative statuses only (for senior to see)
    const relativeStatuses = memberStatuses.filter(s => s.role === 'relative');

    // Get senior status (for relatives to see)
    const seniorStatus = memberStatuses.find(s => s.role === 'senior');

    return {
        memberStatuses,      // All members' statuses
        relativeStatuses,    // Only relatives (for SeniorView)
        seniorStatus,        // Only senior (for RelativeView)
        myStatus,            // Current user's status
        setMyStatus,         // Update current user's status
        loading,
        error,
    };
}

export default useMemberStatus;
