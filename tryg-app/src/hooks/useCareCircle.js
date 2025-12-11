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
    deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generate a random 6-character invite code
const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

export function useCareCircle(userId, userProfile) {
    const [careCircle, setCareCircle] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inviteCode, setInviteCode] = useState(null);

    // Find user's care circle on mount
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const findCareCircle = async () => {
            try {
                // First, check if user is a member of any circle
                const membershipsQuery = query(
                    collection(db, 'careCircleMemberships'),
                    where('userId', '==', userId)
                );
                const membershipsSnapshot = await getDocs(membershipsQuery);

                if (!membershipsSnapshot.empty) {
                    const membership = membershipsSnapshot.docs[0].data();
                    const circleRef = doc(db, 'careCircles', membership.circleId);
                    const circleDoc = await getDoc(circleRef);

                    if (circleDoc.exists()) {
                        setCareCircle({ id: circleDoc.id, ...circleDoc.data() });
                    }
                }
            } catch (err) {
                console.error('Error finding care circle:', err);
                setError(err.message);
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
                ...doc.data()
            }));
            setMembers(memberList);
        });

        return () => unsubscribe();
    }, [careCircle?.id]);

    // Create a new care circle (for seniors)
    const createCareCircle = useCallback(async (seniorName) => {
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

            setCareCircle({ id: circleId, seniorId: userId, seniorName, inviteCode: newCode });
            setInviteCode(newCode);

            return circleId;
        } catch (err) {
            console.error('Error creating care circle:', err);
            setError(err.message);
            throw err;
        }
    }, [userId]);

    // Join an existing care circle via invite code
    const joinCareCircle = useCallback(async (code, displayName) => {
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
            });

            setCareCircle({ id: circleId, ...circleData });

            return circleId;
        } catch (err) {
            console.error('Error joining care circle:', err);
            setError(err.message);
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
        } catch (err) {
            console.error('Error leaving care circle:', err);
            setError(err.message);
            throw err;
        }
    }, [careCircle?.id, userId]);

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
        hasCareCircle: !!careCircle,
    };
}

export default useCareCircle;
