
// Weekly Questions hook - real-time sync via Firestore
// Syncs weekly question answers across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface WeeklyAnswer {
    id: string;
    questionId?: string;
    text?: string;
    userId?: string;
    userName?: string;
    answeredAt?: any; // Firestore Timestamp
    [key: string]: any;
}

export function useWeeklyQuestions(circleId: string | null) {
    const [answers, setAnswers] = useState<WeeklyAnswer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to weekly answers from Firestore
    useEffect(() => {
        if (!circleId) {
            setAnswers([]);
            setLoading(false);
            return;
        }

        const answersRef = collection(db, 'careCircles', circleId, 'weeklyAnswers');
        const answersQuery = query(answersRef, orderBy('answeredAt', 'desc'), limit(20));

        const unsubscribe = onSnapshot(answersQuery,
            (snapshot) => {
                const answersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as WeeklyAnswer[];
                setAnswers(answersList);
                setLoading(false);
            },
            (err: any) => {
                console.error('Error fetching weekly answers:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Add new answer
    const addAnswer = useCallback(async (answerData: Partial<WeeklyAnswer>) => {
        if (!circleId) return;

        const answerId = `answer_${Date.now()}`;
        const answerRef = doc(db, 'careCircles', circleId, 'weeklyAnswers', answerId);

        try {
            await setDoc(answerRef, {
                ...answerData,
                answeredAt: serverTimestamp(),
            });
            return answerId;
        } catch (err: any) {
            console.error('Error adding weekly answer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    return {
        answers,
        loading,
        error,
        addAnswer,
    };
}

export default useWeeklyQuestions;
