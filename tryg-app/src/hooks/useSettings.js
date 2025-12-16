// @ts-check
// Settings hook - real-time settings sync via Firestore
// Handles family status and other circle-wide settings

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useSettings(circleId) {
    const [settings, setSettings] = useState({
        familyStatus: 'home',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to settings from Firestore
    useEffect(() => {
        if (!circleId) {
            setLoading(false);
            return;
        }

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        const unsubscribe = onSnapshot(settingsRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching settings:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Update family status
    const setFamilyStatus = useCallback(async (status) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                familyStatus: status,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Error updating family status:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Update any setting
    const updateSetting = useCallback(async (key, value) => {
        if (!circleId) return;

        const settingsRef = doc(db, 'careCircles', circleId, 'settings', 'main');

        try {
            await setDoc(settingsRef, {
                [key]: value,
                lastUpdated: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Error updating setting:', err);
            setError(err.message);
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

