// Check-in hook - real-time sync via Firestore
// Tracks when senior last checked in, visible to relatives

import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useCheckIn(circleId) {
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to check-in status from settings
    useEffect(() => {
        if (!circleId) {
            setLastCheckIn(null);
            setLoading(false);
            return;
        }

        const checkInRef = doc(db, 'careCircles', circleId, 'settings', 'checkIn');

        const unsubscribe = onSnapshot(checkInRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    if (data.lastCheckIn) {
                        try {
                            const date = data.lastCheckIn.toDate?.() || new Date(data.lastCheckIn);
                            const timeString = date.toLocaleTimeString('da-DK', {
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            setLastCheckIn(timeString);
                        } catch (err) {
                            console.error('[useCheckIn] Error parsing timestamp:', err);
                            setLastCheckIn(null);
                        }
                    } else {
                        setLastCheckIn(null);
                    }
                } else {
                    // Document doesn't exist yet - this is normal for new circles
                    setLastCheckIn(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching check-in:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Record a check-in
    const recordCheckIn = useCallback(async () => {
        if (!circleId) return;

        const checkInRef = doc(db, 'careCircles', circleId, 'settings', 'checkIn');

        try {
            await setDoc(checkInRef, {
                lastCheckIn: serverTimestamp(),
            }, { merge: true });

            // Update local state immediately for responsive UI
            const now = new Date();
            const timeString = now.toLocaleTimeString('da-DK', {
                hour: '2-digit',
                minute: '2-digit'
            });
            setLastCheckIn(timeString);

            return timeString;
        } catch (err) {
            console.error('Error recording check-in:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        lastCheckIn,
        loading,
        error,
        recordCheckIn,
    };
}

export default useCheckIn;
