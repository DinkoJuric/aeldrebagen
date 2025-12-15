import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { WordGame } from './WordGame';
import { Leaderboard } from './Leaderboard';
import { useWordGame } from '../hooks/useWordGame';

// Spillehjørnet - Gaming Corner with Word of the Day
export const Spillehjoernet = ({ circleId, userId, displayName }) => {
    const {
        currentWord,
        currentWordIndex,
        totalWords,
        score,
        isComplete,
        loading,
        submitAnswer,
        leaderboard
    } = useWordGame(circleId, userId, displayName);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl">
                    <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-stone-800 text-lg">Spillehjørnet</h2>
                    <p className="text-xs text-stone-500">Dagens ordleg med familien</p>
                </div>
            </div>

            {/* Word Game */}
            <WordGame
                currentWord={currentWord}
                currentWordIndex={currentWordIndex}
                totalWords={totalWords}
                score={score}
                isComplete={isComplete}
                onAnswer={submitAnswer}
                loading={loading}
            />

            {/* Leaderboard */}
            <Leaderboard
                scores={leaderboard}
                currentUserId={userId}
            />
        </div>
    );
};

export default Spillehjoernet;
