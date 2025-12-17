import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';

// Word Game Component - Daily word guessing game
export const WordGame = ({
    currentWord,
    currentWordIndex,
    totalWords,
    score,
    isComplete,
    onAnswer,
    loading
}) => {
    const [feedback, setFeedback] = useState(null); // { isCorrect, correctAnswer }
    const [selectedIndex, setSelectedIndex] = useState(null);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 border-2 border-stone-100 text-center">
                <div className="animate-pulse">
                    <div className="h-6 bg-stone-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-10 bg-stone-200 rounded w-3/4 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Game complete screen
    if (isComplete) {
        const percentage = Math.round((score / totalWords) * 100);
        const celebration = percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '👍';

        return (
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-lg overflow-hidden relative">
                {/* Success Trophy Image */}
                <div className="mb-4 -mt-2">
                    <img
                        src={`${import.meta.env.BASE_URL}assets/success_trophy.png`}
                        alt="Succes Trophy"
                        className="w-full max-w-[200px] mx-auto object-contain animate-in zoom-in duration-500 drop-shadow-xl"
                    />
                </div>

                <h3 className="text-2xl font-bold mb-2 relative z-10">Dagens ord er klaret!</h3>
                <div className="bg-white/20 rounded-xl p-4 mb-4 backdrop-blur-sm relative z-10">
                    <p className="text-4xl font-bold">{score}/{totalWords}</p>
                    <p className="text-amber-100">rigtige svar</p>
                </div>
                <p className="text-amber-100 text-sm relative z-10">
                    {percentage >= 80
                        ? 'Fantastisk! Du er en ordmester!'
                        : percentage >= 60
                            ? 'Godt gået! Du kender dine ord.'
                            : 'Godt forsøgt! Prøv igen i morgen.'}
                </p>
            </div>
        );
    }

    // Show feedback after answer
    if (feedback) {
        return (
            <div className={`rounded-2xl p-6 text-center shadow-lg ${feedback.isCorrect
                ? 'bg-gradient-to-br from-green-400 to-teal-500'
                : 'bg-gradient-to-br from-orange-400 to-red-400'
                } text-white`}>
                <div className="text-4xl mb-3">
                    {feedback.isCorrect ? <CheckCircle className="w-12 h-12 mx-auto" /> : <XCircle className="w-12 h-12 mx-auto" />}
                </div>
                <h3 className="text-xl font-bold mb-2">
                    {feedback.isCorrect ? 'Helt rigtigt! 🎉' : 'Ikke helt...'}
                </h3>
                <p className="text-white/80 mb-4 text-sm">
                    <span className="font-bold">{feedback.word}</span> betyder:
                    <br />
                    "{feedback.correctAnswer}"
                </p>
                <button
                    onClick={() => {
                        setFeedback(null);
                        setSelectedIndex(null);
                    }}
                    className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-colors"
                >
                    Næste ord <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // Main game UI
    const handleAnswer = async (option, index) => {
        setSelectedIndex(index);

        // Store the current word in feedback BEFORE calling onAnswer (which advances)
        const feedbackData = {
            isCorrect: option.isCorrect,
            correctAnswer: currentWord.correctAnswer,
            word: currentWord.word  // Capture the word before it advances
        };

        await onAnswer(currentWord.id, option.isCorrect);

        // Show feedback with the captured word
        setFeedback(feedbackData);
    };

    return (
        <div className="bg-white rounded-2xl p-5 border-2 border-stone-100 shadow-sm">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
                    Ord {currentWordIndex + 1} af {totalWords}
                </span>
                <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {score} point
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-stone-100 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(currentWordIndex / totalWords) * 100}%` }}
                />
            </div>

            {/* Word */}
            <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-stone-400 uppercase tracking-wider">Hvad betyder</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{currentWord?.word}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
                {currentWord?.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(option, i)}
                        disabled={selectedIndex !== null}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2
                            ${selectedIndex === i
                                ? 'border-amber-400 bg-amber-50'
                                : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:bg-white'
                            }
                            ${selectedIndex !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
                        `}
                    >
                        <span className="font-medium text-stone-700 text-sm leading-snug">
                            {option.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WordGame;
