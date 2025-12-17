// Compact Weekly Question widget for hero section
// Shows notification badge when relative answers, opens modal on tap

import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Sparkles } from 'lucide-react';

// Weekly questions to rotate through
const WEEKLY_QUESTIONS = [
    "Hvad var det bedste øjeblik denne uge?",
    "Hvad glæder du dig til i denne uge?",
    "Hvem tænker du på i dag?",
    "Hvad har fået dig til at smile i dag?",
    "Hvad er du taknemmelig for?",
    "Hvad vil du gerne fortælle din familie?",
    "Hvad har du lært denne uge?",
    "Hvad savner du?",
];

// Get week number of the year
const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.floor(diff / oneWeek);
};

// Compact widget for header
export const WeeklyQuestionWidget = ({ answers = [], userName, hasUnread = false, onClick }) => {
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const answersThisWeek = answers.filter(a => a.question === question);
    const unreadCount = hasUnread ? answersThisWeek.filter(a => a.userName !== userName).length : 0;

    return (
        <button
            onClick={onClick}
            className="relative bg-indigo-100 p-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center shrink-0"
            aria-label="Åbn ugens spørgsmål"
            style={{ width: '36px', height: '36px' }}
        >
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                </span>
            )}
        </button>
    );
};

// Full modal for answering and viewing
export const WeeklyQuestionModal = ({ isOpen, onClose, answers = [], onAnswer, userName }) => {
    const [myAnswer, setMyAnswer] = useState('');
    const weekNumber = getWeekNumber();
    const question = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];

    const answersThisWeek = answers.filter(a => a.question === question);
    const hasAnsweredThisWeek = answersThisWeek.some(a => a.userName === userName);
    const otherAnswers = answersThisWeek.filter(a => a.userName !== userName);

    const handleSubmit = () => {
        if (myAnswer.trim()) {
            onAnswer?.({
                question,
                answer: myAnswer.trim(),
                timestamp: new Date().toISOString(),
                userName
            });
            setMyAnswer('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fade-in pb-0 sm:pb-0">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] h-[85vh] flex flex-col animate-slide-up shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] safe-area-bottom">
                {/* Drag Handle Indicator */}
                <div className="w-full flex justify-center pt-3 pb-1" onTouchStart={onClose}>
                    <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <MessageCircle className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-stone-800">Ugens spørgsmål</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Question */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
                        <p className="text-indigo-200 text-sm mb-1">Denne uges spørgsmål</p>
                        <p className="text-lg font-bold">{question}</p>
                    </div>

                    {/* Answer input */}
                    {!hasAnsweredThisWeek ? (
                        <div className="space-y-3">
                            <textarea
                                value={myAnswer}
                                onChange={(e) => setMyAnswer(e.target.value)}
                                placeholder="Skriv dit svar her..."
                                className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none resize-none h-24"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!myAnswer.trim()}
                                className="w-full p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4" />
                                Del dit svar
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                            <p className="text-green-700 font-medium">✓ Du har svaret denne uge</p>
                        </div>
                    )}

                    {/* Other answers */}
                    {otherAnswers.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-stone-500 text-sm font-medium">Svar fra familien</p>
                            {otherAnswers.map((answer, i) => (
                                <div key={i} className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                                    <p className="font-medium text-stone-700">{answer.userName}</p>
                                    <p className="text-stone-600">{answer.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {otherAnswers.length === 0 && hasAnsweredThisWeek && (
                        <p className="text-stone-400 text-center text-sm">
                            Ingen andre har svaret endnu denne uge
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export { WEEKLY_QUESTIONS, getWeekNumber };
