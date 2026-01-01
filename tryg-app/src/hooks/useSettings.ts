// Settings hook - real-time settings sync via Firestore
// Handles family status and other circle-wide settings

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Settings {
    familyStatus: string;
    [key: string]: unknown;
}

export function useSettings(circleId: string | undefined) {
    const [settings, setSettings] = useState<Settings>({
        familyStatus: 'home',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to settings from Firestore
    useEffect(() => {
        if (!circleId) {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        const unsubscribe = onSnapshot(settingsRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as Settings);
                }
                setLoading(false);
            },
            (err: unknown) => {
                console.error('Error fetching settings:', err);
                const message = (err as Error).message;
                setError(message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Update family status
    const setFamilyStatus = useCallback(async (status: string) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                familyStatus: status,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err: unknown) {
            console.error('Error updating family status:', err);
            const message = (err as Error).message;
            setError(message);
            throw err;
        }
    }, [circleId]);

    // Update any setting
    const updateSetting = useCallback(async (key: string, value: unknown) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                [key]: value,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err: unknown) {
            console.error('Error updating setting:', err);
            const message = (err as Error).message;
            setError(message);
            throw err;
        }
    }, [circleId]);

    return {
        settings,
        familyStatus: settings.familyStatus,
        loading,
        error,
        setFamilyStatus,
        updateSetting,
    };
}

export default useSettings;
