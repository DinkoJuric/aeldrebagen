import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { WordGame } from './WordGame';
import { Leaderboard } from './Leaderboard';
import { useWordGame } from './useWordGame';
import { useTranslation } from 'react-i18next';

interface SpillehjoernetProps {
    circleId: string;
    userId: string;
    displayName: string;
}

/**
 * Spillehjørnet - Gaming Corner with Word of the Day.
 * Interactive word game with family leaderboard for daily engagement.
 * @param {SpillehjoernetProps} props - Component props
 * @param {string} props.circleId - Care circle identifier
 * @param {string} props.userId - Current user's ID
 * @param {string} props.displayName - User's display name for leaderboard
 * @returns {JSX.Element} Gaming corner component
 */
export const Spillehjoernet: React.FC<SpillehjoernetProps> = ({ circleId, userId, displayName }) => {
    const { t } = useTranslation();
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
                    <h2 className="font-bold text-stone-800 text-lg">{t('spillehjoernet_title')}</h2>
                    <p className="text-xs text-stone-500">{t('spillehjoernet_subtitle')}</p>
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
