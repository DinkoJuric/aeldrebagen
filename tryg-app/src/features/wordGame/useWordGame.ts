
// Word Game Hook - manages game state and Firestore sync
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getTodaysWords, shuffleAnswers } from '../../data/wordGameData';
import { getTodaysWordsBS, shuffleAnswersBS } from '../../data/wordGameData_bs';
import { getTodaysWordsTR, shuffleAnswersTR } from '../../data/wordGameData_tr';

// Get today's date key for localStorage
const getTodayKey = () => new Date().toISOString().split('T')[0];

export interface Word {
    id: string;
    word: string;
    correctAnswer: string;
    wrongAnswer?: string;
    options?: { text: string; isCorrect: boolean }[];
    [key: string]: unknown;
}

export interface LeaderboardEntry {
    id: string;
    userId: string;
    displayName: string;
    score: number;
    total: number;
    date: string;
    completedAt?: unknown;
    [key: string]: unknown;
}

export function useWordGame(circleId: string | null, userId: string | null, displayName: string | null) {
    const { i18n } = useTranslation();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, boolean>>({}); // { wordId: isCorrect }
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Get locale-specific word functions
    const { getWords, shuffle } = useMemo(() => {
        switch (i18n.language) {
            case 'bs':
                return { getWords: getTodaysWordsBS, shuffle: shuffleAnswersBS };
            case 'tr':
                return { getWords: getTodaysWordsTR, shuffle: shuffleAnswersTR };
            default:
                return { getWords: getTodaysWords, shuffle: shuffleAnswers };
        }
    }, [i18n.language]);

    // Get today's words (memoized, same for all family, locale-specific)
    const todaysWords = useMemo(() => getWords(), [getWords]);

    // Current word with shuffled answers
    const currentWord = useMemo(() => {
        if (currentWordIndex >= todaysWords.length) return null;
        const word = todaysWords[currentWordIndex];
        return {
            ...word,
            options: shuffle(word, currentWordIndex)
        };
    }, [todaysWords, currentWordIndex, shuffle]);

    // Load saved progress from localStorage on mount
    useEffect(() => {
        if (!userId) return;

        const savedKey = `wordGame_${getTodayKey()}_${userId}`;
        const saved = localStorage.getItem(savedKey);

        if (saved) {
            try {
                const { answers: savedAnswers, score: savedScore, complete } = JSON.parse(saved);
                setTimeout(() => {
                    setAnswers(savedAnswers || {});
                    setScore(savedScore || 0);
                    setIsComplete(complete || false);
                }, 0);

                // Calculate current word index from saved answers
                const answeredCount = Object.keys(savedAnswers || {}).length;
                setTimeout(() => {
                    setCurrentWordIndex(answeredCount);
                }, 0);
            } catch (e) {
                console.error('Error loading saved game:', e);
            }
        }
        setTimeout(() => setLoading(false), 0);
    }, [userId]);

    // Subscribe to leaderboard from Firestore
    useEffect(() => {
        if (!circleId) return;

        const todayKey = getTodayKey();
        const scoresRef = collection(db, 'careCircles', circleId, 'wordGameScores');
        const scoresQuery = query(scoresRef, orderBy('score', 'desc'));

        const unsub = onSnapshot(scoresQuery, (snapshot) => {
            const scores = snapshot.docs
                .filter(doc => doc.data().date === todayKey)
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as LeaderboardEntry[];
            setLeaderboard(scores);
        }, (err) => {
            console.error('Error fetching leaderboard:', err);
        });

        return () => unsub();
    }, [circleId]);

    // Save progress to localStorage and Firestore
    const saveProgress = useCallback(async (newAnswers: Record<string, boolean>, newScore: number, complete: boolean) => {
        if (!userId) return;

        const todayKey = getTodayKey();
        const savedKey = `wordGame_${todayKey}_${userId}`;

        // Save to localStorage
        localStorage.setItem(savedKey, JSON.stringify({
            answers: newAnswers,
            score: newScore,
            complete
        }));

        // Save to Firestore if game is complete
        if (complete && circleId) {
            const scoreRef = doc(db, 'careCircles', circleId, 'wordGameScores', `${userId}_${todayKey}`);
            await setDoc(scoreRef, {
                userId,
                displayName: displayName || 'Ukendt',
                score: newScore,
                total: todaysWords.length,
                date: todayKey,
                completedAt: serverTimestamp()
            });

            // 🎮 Social Spark: Post game completion to activity feed
            const pingRef = doc(db, 'careCircles', circleId, 'pings', `game_${userId}_${todayKey}`);
            await setDoc(pingRef, {
                type: 'game_complete',
                fromName: displayName || 'Ukendt',
                fromUserId: userId,
                score: newScore,
                total: todaysWords.length,
                sentAt: serverTimestamp()
            });
        }
    }, [circleId, userId, displayName, todaysWords.length]);

    // Submit an answer
    const submitAnswer = useCallback(async (wordId: string, isCorrect: boolean) => {
        // Already answered this word?
        if (answers[wordId] !== undefined) return;

        const newAnswers = { ...answers, [wordId]: isCorrect };
        const newScore = isCorrect ? score + 1 : score;
        const nextIndex = currentWordIndex + 1;
        const isNowComplete = nextIndex >= todaysWords.length;

        setAnswers(newAnswers);
        setScore(newScore);
        setCurrentWordIndex(nextIndex);
        setIsComplete(isNowComplete);

        await saveProgress(newAnswers, newScore, isNowComplete);

        return { isCorrect, newScore, isComplete: isNowComplete };
    }, [answers, score, currentWordIndex, todaysWords.length, saveProgress]);

    // Reset game (for testing only)
    const resetGame = useCallback(() => {
        if (!userId) return;

        const todayKey = getTodayKey();
        const savedKey = `wordGame_${todayKey}_${userId}`;
        localStorage.removeItem(savedKey);
        setAnswers({});
        setScore(0);
        setCurrentWordIndex(0);
        setIsComplete(false);
    }, [userId]);

    return {
        // Game state
        currentWord,
        currentWordIndex,
        totalWords: todaysWords.length,
        score,
        isComplete,
        loading,

        // Actions
        submitAnswer,
        resetGame,

        // Leaderboard
        leaderboard,

        // For debugging
        todaysWords
    };
}

export default useWordGame;
