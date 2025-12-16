// @ts-check
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
import { db } from '../config/firebase';
import '../types'; // Import types for JSDoc

/**
 * Hook to manage per-member status in a care circle
 * Each member's status is stored separately in memberStatuses/{userId}
 * 
 * @param {string} circleId - The care circle ID
 * @param {string} userId - Current user's ID
 * @param {string} displayName - Current user's display name
 * @param {'senior' | 'relative'} role - Current user's role
 * @returns {import('../types').UseMemberStatusReturn & { loading: boolean, error: string|null }}
 */
export function useMemberStatus(circleId, userId, displayName, role) {
    /** @type {[import('../types').Member[], function]} */
    const [memberStatuses, setMemberStatuses] = useState([]);
    /** @type {[string, function]} */
    const [myStatus, setMyStatusState] = useState('home');
    const [loading, setLoading] = useState(true);
    /** @type {[string|null, function]} */
    const [error, setError] = useState(null);

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
                    docId: docSnap.id, // This is the userId
                    ...docSnap.data()
                }));

                // Debug: Log status changes
                console.log('[useMemberStatus] Received statuses:', statuses.length, statuses.map(s => `${s.displayName}: ${s.status}`));

                setMemberStatuses(statuses);

                // Update my own status from the fetched data
                const myStatusDoc = statuses.find(s => s.docId === userId);
                if (myStatusDoc) {
                    setMyStatusState(myStatusDoc.status);
                }

                setLoading(false);
            },
            (err) => {
                console.error('Error fetching member statuses:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, userId]);

    // Update current user's status
    /** @param {string} status */
    const setMyStatus = useCallback(async (status) => {
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
        } catch (err) {
            console.error('Error updating member status:', err);
            setError(/** @type {Error} */(err).message);
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
