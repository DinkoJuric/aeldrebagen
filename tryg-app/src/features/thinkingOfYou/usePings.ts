
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
    Timestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Ping {
    id: string;
    fromName: string;
    fromUserId: string;
    toRole: 'senior' | 'relative';
    sentAt: Date;
    toUserId?: string;
}

export function usePings(circleId: string | null, currentUserId: string | null) {
    const [pings, setPings] = useState<Ping[]>([]);
    const [latestPing, setLatestPing] = useState<Ping | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to recent pings from Firestore
    useEffect(() => {
        if (!circleId) {
            setPings([]);
            setLoading(false);
            return;
        }

        const pingsRef = collection(db, 'careCircles', circleId, 'pings');

        const pingsQuery = query(
            pingsRef,
            orderBy('sentAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(pingsQuery,
            (snapshot) => {
                const pingsList: Ping[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firestore timestamp to Date
                    const sentAt = data.sentAt?.toDate?.() || new Date();

                    return {
                        id: doc.id,
                        fromName: data.fromName,
                        fromUserId: data.fromUserId,
                        toRole: data.toRole as 'senior' | 'relative',
                        sentAt,
                        toUserId: data.toUserId
                    };
                });

                setPings(pingsList);

                // Set latest ping if it's for this user and recent (within last minute)
                const now = new Date();
                const recentPing = pingsList.find(p => {
                    const pingAge = now.getTime() - p.sentAt.getTime();
                    const isRecent = pingAge < 60000; // Within last minute
                    // const isForMe = p.toUserId !== currentUserId && p.fromUserId !== currentUserId;
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
    const sendPing = useCallback(async (fromName: string, fromUserId: string, toRole: 'senior' | 'relative') => {
        if (!circleId) return;

        const pingId = `ping_${Date.now()}`;
        const pingRef = doc(db, 'careCircles', circleId, 'pings', pingId);

        try {
            await setDoc(pingRef, {
                fromName,
                fromUserId,
                toRole,
                sentAt: serverTimestamp(),
            });
            return pingId;
        } catch (err: any) {
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
