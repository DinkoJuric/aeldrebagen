// @ts-check
// Word Game Hook - manages game state and Firestore sync
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getTodaysWords, shuffleAnswers } from '../data/wordGameData';

// Get today's date key for localStorage
const getTodayKey = () => new Date().toISOString().split('T')[0];

export function useWordGame(circleId, userId, displayName) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState({}); // { wordId: isCorrect }
    const [isComplete, setIsComplete] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get today's words (memoized, same for all family)
    const todaysWords = useMemo(() => getTodaysWords(), []);

    // Current word with shuffled answers
    const currentWord = useMemo(() => {
        if (currentWordIndex >= todaysWords.length) return null;
        const word = todaysWords[currentWordIndex];
        return {
            ...word,
            options: shuffleAnswers(word, currentWordIndex)
        };
    }, [todaysWords, currentWordIndex]);

    // Load saved progress from localStorage on mount
    useEffect(() => {
        const savedKey = `wordGame_${getTodayKey()}_${userId}`;
        const saved = localStorage.getItem(savedKey);

        if (saved) {
            try {
                const { answers: savedAnswers, score: savedScore, complete } = JSON.parse(saved);
                setAnswers(savedAnswers || {});
                setScore(savedScore || 0);
                setIsComplete(complete || false);

                // Calculate current word index from saved answers
                const answeredCount = Object.keys(savedAnswers || {}).length;
                setCurrentWordIndex(answeredCount);
            } catch (e) {
                console.error('Error loading saved game:', e);
            }
        }
        setLoading(false);
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
                }));
            setLeaderboard(scores);
        }, (err) => {
            console.error('Error fetching leaderboard:', err);
        });

        return () => unsub();
    }, [circleId]);

    // Save progress to localStorage and Firestore
    const saveProgress = useCallback(async (newAnswers, newScore, complete) => {
        const todayKey = getTodayKey();
        const savedKey = `wordGame_${todayKey}_${userId}`;

        // Save to localStorage
        localStorage.setItem(savedKey, JSON.stringify({
            answers: newAnswers,
            score: newScore,
            complete
        }));

        // Save to Firestore if game is complete
        if (complete && circleId && userId) {
            const scoreRef = doc(db, 'careCircles', circleId, 'wordGameScores', `${userId}_${todayKey}`);
            await setDoc(scoreRef, {
                userId,
                displayName: displayName || 'Ukendt',
                score: newScore,
                total: todaysWords.length,
                date: todayKey,
                completedAt: serverTimestamp()
            });
        }
    }, [circleId, userId, displayName, todaysWords.length]);

    // Submit an answer
    const submitAnswer = useCallback(async (wordId, isCorrect) => {
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

