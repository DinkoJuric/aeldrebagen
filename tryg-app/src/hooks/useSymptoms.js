// Symptoms hook - real-time symptom log sync via Firestore
// Replaces localStorage for multi-user symptom tracking

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useSymptoms(circleId) {
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to symptoms from Firestore (most recent first, limited)
    useEffect(() => {
        if (!circleId) {
            setSymptoms([]);
            setLoading(false);
            return;
        }

        const symptomsRef = collection(db, 'careCircles', circleId, 'symptoms');
        const symptomsQuery = query(symptomsRef, orderBy('loggedAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(symptomsQuery,
            (snapshot) => {
                const symptomsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSymptoms(symptomsList);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching symptoms:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Helper to sanitize data for Firestore
    const sanitizeData = (data) => {
        const clean = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            // Skip symbols, functions, and undefined
            if (typeof value === 'symbol' || typeof value === 'function' || value === undefined) return;
            // Skip React-specific props
            if (key.startsWith('_') || key === 'nativeEvent' || key === 'target') return;
            clean[key] = value;
        });
        return clean;
    };

    // Add a new symptom log
    const addSymptom = useCallback(async (symptomData) => {
        if (!circleId) return;

        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
        const dateString = now.toLocaleDateString('da-DK');

        const symptomId = `symptom_${Date.now()}`;
        const symptomRef = doc(db, 'careCircles', circleId, 'symptoms', symptomId);

        try {
            await setDoc(symptomRef, {
                ...sanitizeData(symptomData),
                time: timeString,
                date: dateString,
                loggedAt: serverTimestamp(),
            });
            return symptomId;
        } catch (err) {
            console.error('Error adding symptom:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Delete a symptom log
    const removeSymptom = useCallback(async (symptomId) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'symptoms', symptomId));
        } catch (err) {
            console.error('Error removing symptom:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Get symptoms for a specific date range (for reports)
    const getSymptomsByDateRange = useCallback((startDate, endDate) => {
        return symptoms.filter(s => {
            const symptomDate = new Date(s.loggedAt?.toDate?.() || s.loggedAt);
            return symptomDate >= startDate && symptomDate <= endDate;
        });
    }, [symptoms]);

    // Get symptom stats for doctor report
    const getSymptomStats = useCallback(() => {
        const stats = {};
        symptoms.forEach(s => {
            const type = s.id || s.label;
            if (!stats[type]) {
                stats[type] = { count: 0, lastOccurrence: null };
            }
            stats[type].count++;
            if (!stats[type].lastOccurrence) {
                stats[type].lastOccurrence = s.date;
            }
        });
        return stats;
    }, [symptoms]);

    return {
        symptoms,
        loading,
        error,
        addSymptom,
        removeSymptom,
        getSymptomsByDateRange,
        getSymptomStats,
    };
}

export default useSymptoms;
