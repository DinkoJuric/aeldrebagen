import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { WeeklyAnswer } from '../../types';

import { WEEKLY_QUESTIONS, getWeekNumber, DEFAULT_MEMORIES } from './constants';

interface WeeklyQuestionCardProps {
    onAnswer?: (answer: Omit<WeeklyAnswer, 'id'>) => void;
    answers?: WeeklyAnswer[];
    userName?: string;
}

// Component for displaying the weekly question
export const WeeklyQuestionCard: React.FC<WeeklyQuestionCardProps> = ({ onAnswer, answers = [], userName = 'dig' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [myAnswer, setMyAnswer] = useState('');

    // Get this week's question based on week number
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];

    const handleSubmit = () => {
        if (myAnswer.trim()) {
            onAnswer?.({
                questionId: question,
                text: myAnswer.trim(),
                userId: '', // Will be filled by handler
                userName
            });
            setMyAnswer('');
            setIsExpanded(false);
        }
    };

    const hasAnsweredThisWeek = answers.some(a =>
        a.questionId === question &&
        a.userName === userName
    );

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-full">
                    <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-indigo-200 font-medium">Ugens spørgsmål</p>
                    <p className="text-lg font-bold">{question}</p>
                </div>
            </div>

            {!isExpanded ? (
                <>
                    {/* Show existing answers */}
                    {answers.filter(a => a.questionId === question).length > 0 && (
                        <div className="space-y-2 mb-3">
                            {answers
                                .filter(a => a.questionId === question)
                                .slice(0, 3)
                                .map((answer, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl p-3">
                                        <p className="font-medium text-indigo-100">{answer.userName}:</p>
                                        <p className="text-white/90 text-sm">{answer.text}</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {!hasAnsweredThisWeek && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full p-3 bg-white/20 rounded-xl text-white font-semibold 
                                hover:bg-white/30 transition-colors flex items-center justify-center gap-2
                                focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Svar på ugens spørgsmål"
                        >
                            <Sparkles className="w-4 h-4" />
                            Del dit svar
                        </button>
                    )}
                </>
            ) : (
                <div className="space-y-3">
                    <textarea
                        value={myAnswer}
                        onChange={(e) => setMyAnswer(e.target.value)}
                        placeholder="Skriv dit svar her..."
                        className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 
                            border-2 border-white/20 focus:border-white/50 focus:outline-none
                            resize-none h-24"
                        aria-label="Dit svar"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="flex-1 p-3 bg-white/10 rounded-xl text-white 
                                hover:bg-white/20 transition-colors"
                        >
                            Annuller
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!myAnswer.trim()}
                            className="flex-1 p-3 bg-white rounded-xl text-indigo-600 font-bold 
                                hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send dit svar"
                        >
                            Send
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface Memory {
    date: string;
    text: string;
    emoji: string;
}

interface MemoryTriggerProps {
    memories?: Memory[];
}

// Memory trigger component - "Husker du da...?"
export const MemoryTrigger: React.FC<MemoryTriggerProps> = ({ memories = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Default memories if none provided
    const allMemories = memories.length > 0 ? memories : DEFAULT_MEMORIES;
    const memory = allMemories[currentIndex % allMemories.length];

    useEffect(() => {
        // Rotate memories every 10 seconds
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % allMemories.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [allMemories.length]);

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
                <span className="text-3xl">{memory.emoji}</span>
                <div className="flex-1">
                    <p className="text-amber-800 font-medium">Husker du da...?</p>
                    <p className="text-amber-600 text-sm">{memory.date}: {memory.text}</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyQuestionCard;
