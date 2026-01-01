
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
import { db } from '../../config/firebase';

import { SymptomLog, SymptomStats } from '../../types';
import { toJsDate } from '../../utils/dateUtils';

export function useSymptoms(circleId: string | null) {
    const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to symptoms from Firestore (most recent first, limited)
    useEffect(() => {
        if (!circleId) {
            setTimeout(() => {
                setSymptoms([]);
                setLoading(false);
            }, 0);
            return;
        }

        const symptomsRef = collection(db, 'careCircles', circleId, 'symptoms');
        const symptomsQuery = query(symptomsRef, orderBy('loggedAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(symptomsQuery,
            (snapshot) => {
                const symptomsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SymptomLog[];
                setSymptoms(symptomsList);
                setLoading(false);
            },
            (err: unknown) => {
                console.error('Error fetching symptoms:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Whitelist of safe fields to save to Firestore
    // React components and their Symbol properties are NOT safe
    const SAFE_SYMPTOM_FIELDS = ['id', 'label', 'color', 'bodyLocation'];

    const sanitizeSymptomData = useCallback((data: Partial<SymptomLog>) => {
        const clean: Record<string, unknown> = {};
        const safeData = data as Record<string, unknown>;
        SAFE_SYMPTOM_FIELDS.forEach(key => {
            const val = safeData[key];
            if (val !== undefined && typeof val !== 'function' && typeof val !== 'symbol') {
                clean[key] = val;
            }
        });
        return clean;
    }, []);

    // Add a new symptom log
    const addSymptom = useCallback(async (symptomData: Partial<SymptomLog>) => {
        if (!circleId) return;

        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
        const dateString = now.toLocaleDateString('da-DK');

        const symptomId = `symptom_${Date.now()}`;
        const symptomRef = doc(db, 'careCircles', circleId, 'symptoms', symptomId);

        try {
            await setDoc(symptomRef, {
                ...sanitizeSymptomData(symptomData),
                time: timeString,
                date: dateString,
                loggedAt: serverTimestamp(),
            });
            return symptomId;
        } catch (err: unknown) {
            console.error('Error adding symptom:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId, sanitizeSymptomData]);

    // Delete a symptom log
    const removeSymptom = useCallback(async (symptomId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'symptoms', symptomId));
        } catch (err: unknown) {
            console.error('Error removing symptom:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId]);

    // Get symptoms for a specific date range (for reports)
    const getSymptomsByDateRange = useCallback((startDate: Date, endDate: Date) => {
        return symptoms.filter(s => {
            const symptomDate = toJsDate(s.loggedAt);
            if (!symptomDate) return false;
            return symptomDate >= startDate && symptomDate <= endDate;
        });
    }, [symptoms]);

    // Get symptom stats for doctor report
    const getSymptomStats = useCallback(() => {
        const stats: Record<string, SymptomStats> = {};
        symptoms.forEach(s => {
            const type = s.id || s.label || 'unknown';
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
