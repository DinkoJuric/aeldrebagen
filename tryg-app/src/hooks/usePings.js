// Pings hook - real-time "thinking of you" sync via Firestore
// Syncs ping notifications across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function usePings(circleId, currentUserId) {
    const [pings, setPings] = useState([]);
    const [latestPing, setLatestPing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to recent pings from Firestore
    useEffect(() => {
        if (!circleId) {
            setPings([]);
            setLoading(false);
            return;
        }

        const pingsRef = collection(db, 'careCircles', circleId, 'pings');
        // Get pings from the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const pingsQuery = query(
            pingsRef,
            orderBy('sentAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(pingsQuery,
            (snapshot) => {
                const pingsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Convert Firestore timestamp to Date
                    sentAt: doc.data().sentAt?.toDate?.() || new Date()
                }));
                setPings(pingsList);

                // Set latest ping if it's for this user and recent (within last minute)
                const now = new Date();
                const recentPing = pingsList.find(p => {
                    const pingAge = now - p.sentAt;
                    const isRecent = pingAge < 60000; // Within last minute
                    const isForMe = p.toUserId !== currentUserId && p.fromUserId !== currentUserId;
                    const isFromOther = p.fromUserId !== currentUserId;
                    return isRecent && isFromOther;
                });

                if (recentPing && (!latestPing || recentPing.id !== latestPing.id)) {
                    setLatestPing(recentPing);
                }

                setLoading(false);
            },
            (err) => {
                console.error('Error fetching pings:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, currentUserId]);

    // Send a ping
    const sendPing = useCallback(async (fromName, fromUserId, toRole) => {
        if (!circleId) return;

        const pingId = `ping_${Date.now()}`;
        const pingRef = doc(db, 'careCircles', circleId, 'pings', pingId);

        try {
            await setDoc(pingRef, {
                fromName,
                fromUserId,
                toRole, // 'senior' or 'relative'
                sentAt: serverTimestamp(),
            });
            return pingId;
        } catch (err) {
            console.error('Error sending ping:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Dismiss latest ping
    const dismissPing = useCallback(() => {
        setLatestPing(null);
    }, []);

    return {
        pings,
        latestPing,
        loading,
        error,
        sendPing,
        dismissPing,
    };
}

export default usePings;
