import React, { useState } from 'react';
import { MessageCircle, X, Check, Heart, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WEEKLY_QUESTIONS, getWeekNumber } from './WeeklyQuestion';
import { WeeklyAnswer, WeeklyReply } from '../../types';
import { AudioRecorder } from '../memories/AudioRecorder';
import { Loader2, Mic, Play as PlayIcon } from 'lucide-react';

// Simple time ago formatter (no external deps)
const formatTimeAgo = (isoString: string, t: any) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return t('just_now');
        if (diffInSeconds < 3600) return t('minutes_ago', { count: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400) return t('hours_ago', { count: Math.floor(diffInSeconds / 3600) });
        return t('days_ago_relative', { count: Math.floor(diffInSeconds / 86400) });
    } catch (e) {
        return '';
    }
};

interface WeeklyQuestionWidgetProps {
    answers?: WeeklyAnswer[];
    userName: string;
    hasUnread?: boolean;
    onClick: () => void;
}

// Compact widget for header
export const WeeklyQuestionWidget: React.FC<WeeklyQuestionWidgetProps> = ({ answers = [], userName, hasUnread = false, onClick }) => {
    const { t } = useTranslation();
    const weekNumber = getWeekNumber();
    const questionKey = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const answersThisWeek = answers.filter(a => a.questionId === questionKey);
    const unreadCount = hasUnread ? answersThisWeek.filter(a => a.userName !== userName).length : 0;

    return (
        <button
            onClick={onClick}
            className="relative bg-indigo-100 p-1.5 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center shrink-0"
            aria-label={t('open_weekly_question')}
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

interface WeeklyQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    answers?: WeeklyAnswer[];
    onAnswer?: (answer: Omit<WeeklyAnswer, 'id'>) => void;
    userName: string;
    currentUserId?: string;
    onToggleLike?: (answerId: string, userId: string, isLiked: boolean) => void;
    onReply?: (answerId: string, reply: Omit<WeeklyReply, 'id'>) => void;
}

// Full modal for answering and viewing
export const WeeklyQuestionModal: React.FC<WeeklyQuestionModalProps> = ({
    isOpen,
    onClose,
    answers = [],
    onAnswer,
    userName,
    currentUserId,
    onToggleLike,
    onReply
}) => {
    const [myAnswer, setMyAnswer] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [answerType, setAnswerType] = useState<'text' | 'audio'>('text');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const { t } = useTranslation();
    const [isUploading] = useState(false); // Local state since audio upload isn't implemented yet

    const weekNumber = getWeekNumber();
    const questionKey = WEEKLY_QUESTIONS[weekNumber % WEEKLY_QUESTIONS.length];
    const question = t(questionKey);

    // Filter answers for this week's question
    const answersThisWeek = answers.filter(a => a.questionId === questionKey);
    const hasAnsweredThisWeek = answersThisWeek.some(a => a.userName === userName);

    // Sorting: Popularity (likes) -> Newest
    const sortedAnswers = [...answersThisWeek].sort((a, b) => {
        const likesA = a.likes?.length || 0;
        const likesB = b.likes?.length || 0;
        if (likesA !== likesB) return likesB - likesA; // Most likes first
        // Fallback to time if available (newest first)
        const timeA = a.answeredAt?.toMillis ? a.answeredAt.toMillis() : 0;
        const timeB = b.answeredAt?.toMillis ? b.answeredAt.toMillis() : 0;
        return timeB - timeA;
    });

    const handleSubmit = async () => {
        if (answerType === 'text' && myAnswer.trim()) {
            onAnswer?.({
                questionId: questionKey,
                text: myAnswer.trim(),
                answeredAt: new Date(),
                userName
            });
            setMyAnswer('');
        } else if (answerType === 'audio' && audioBlob) {
            // Audio submission logic will be handled here
            onAnswer?.({
                questionId: questionKey,
                text: t('audio_answer_placeholder'),
                answeredAt: new Date(),
                userName
            });
            setAudioBlob(null);
        }
    };

    const handleReplySubmit = (answerId: string) => {
        if (!replyText.trim() || !currentUserId) return;

        onReply?.(answerId, {
            userId: currentUserId,
            userName: userName,
            text: replyText.trim(),
            createdAt: new Date().toISOString()
        });
        setReplyText('');
        setReplyingToId(null);
    };

    const toggleReplyInput = (answerId: string) => {
        if (replyingToId === answerId) {
            setReplyingToId(null);
        } else {
            setReplyingToId(answerId);
            setReplyText('');
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
                        <span className="font-bold text-stone-800">{t('weekly_question_title')}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                    {/* Question */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <p className="text-indigo-200 text-sm mb-2 uppercase tracking-wide font-bold">{t('weekly_question_header')}</p>
                        <p className="text-xl font-bold leading-relaxed">{question}</p>
                    </div>

                    {/* Answer input (only if not answered) */}
                    {!hasAnsweredThisWeek ? (
                        <div className="space-y-4 animate-fade-in">
                            {/* Toggle between text and audio */}
                            <div className="flex bg-stone-100 p-1 rounded-2xl">
                                <button
                                    onClick={() => setAnswerType('text')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${answerType === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-500'}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        {t('text_answer')}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setAnswerType('audio')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${answerType === 'audio' ? 'bg-white shadow-sm text-indigo-600' : 'text-stone-500'}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Mic className="w-4 h-4" />
                                        {t('audio_answer')}
                                    </div>
                                </button>
                            </div>

                            <div className="relative">
                                {answerType === 'text' ? (
                                    <textarea
                                        value={myAnswer}
                                        onChange={(e) => setMyAnswer(e.target.value)}
                                        placeholder={t('write_answer_placeholder')}
                                        className="w-full p-4 rounded-2xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none resize-none h-32 text-lg shadow-sm"
                                    />
                                ) : (
                                    <AudioRecorder
                                        onRecordingComplete={(blob) => setAudioBlob(blob)}
                                        onReset={() => setAudioBlob(null)}
                                        placeholder={t('tell_your_story_placeholder')}
                                    />
                                )}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={answerType === 'text' ? !myAnswer.trim() : (!audioBlob || isUploading)}
                                className="w-full p-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md active:scale-95 transform transition-transform"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                {isUploading ? t('uploading') : t('share_your_answer')}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center mb-4 flex items-center justify-center gap-2">
                            <div className="bg-green-100 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-700" />
                            </div>
                            <p className="text-green-700 font-medium">{t('thanks_for_answer')}</p>
                        </div>
                    )}

                    {/* All Answers Feed */}
                    <div className="space-y-4">
                        {sortedAnswers.length > 0 ? (
                            <>
                                <p className="text-stone-500 text-sm font-bold ml-1 uppercase tracking-wide">{t('family_answers_count', { count: sortedAnswers.length })}</p>
                                {sortedAnswers.map((answer) => {
                                    const isLiked = currentUserId && answer.likes?.includes(currentUserId);
                                    const likeCount = answer.likes?.length || 0;
                                    const isReplying = replyingToId === answer.id;

                                    return (
                                        <div key={answer.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm transition-all hover:shadow-md">
                                            {/* Answer Header */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-stone-800 text-lg">{answer.userName}</p>
                                                    {answer.answeredAt && (
                                                        <p className="text-xs text-stone-400">
                                                            {formatTimeAgo(answer.answeredAt?.toDate?.()?.toISOString() || answer.answeredAt, t)}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* Like Button */}
                                                <button
                                                    onClick={() => currentUserId && onToggleLike?.(answer.id, currentUserId, !!isLiked)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${isLiked
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                        }`}
                                                >
                                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                                                    <span className="text-sm font-bold">{likeCount > 0 ? likeCount : ''}</span>
                                                </button>
                                            </div>

                                            {/* Answer Text */}
                                            {answer.audioUrl ? (
                                                <div className="mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center gap-3">
                                                    <button
                                                        onClick={() => new Audio(answer.audioUrl).play()}
                                                        className="w-10 h-10 bg-indigo-100 flex items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200"
                                                    >
                                                        <PlayIcon size={20} fill="currentColor" />
                                                    </button>
                                                    <div className="flex-1 h-1 bg-stone-200 rounded-full" />
                                                    <Mic size={16} className="text-stone-300" />
                                                </div>
                                            ) : (
                                                <p className="text-stone-700 text-lg leading-relaxed mb-4">{answer.text}</p>
                                            )}

                                            {/* Action Bar */}
                                            <div className="flex items-center gap-4 border-t border-stone-100 pt-3">
                                                <button
                                                    onClick={() => toggleReplyInput(answer.id)}
                                                    className="flex items-center gap-2 text-stone-500 hover:text-indigo-600 transition-colors text-sm font-medium"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    {answer.replies?.length ? t('replies_count', { count: answer.replies.length }) : t('reply_verb')}
                                                </button>
                                            </div>

                                            {/* Replies Section */}
                                            {(isReplying || (answer.replies && answer.replies.length > 0)) && (
                                                <div className="mt-3 pl-4 border-l-2 border-stone-100 space-y-3">
                                                    {/* Existing Replies */}
                                                    {answer.replies?.map((reply) => (
                                                        <div key={reply.id} className="bg-stone-50 rounded-lg p-3 text-sm">
                                                            <div className="flex justify-between items-baseline mb-1">
                                                                <span className="font-bold text-stone-700">{reply.userName}</span>
                                                                {/* <span className="text-xs text-stone-400">tid siden</span> */}
                                                            </div>
                                                            <p className="text-stone-600">{reply.text}</p>
                                                        </div>
                                                    ))}

                                                    {/* Reply Input */}
                                                    {isReplying && (
                                                        <div className="flex gap-2 items-end animate-fade-in mt-2">
                                                            <textarea
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                placeholder={t('write_reply_placeholder')}
                                                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2 text-sm focus:border-indigo-400 focus:outline-none resize-none h-20"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleReplySubmit(answer.id)}
                                                                disabled={!replyText.trim()}
                                                                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="text-center py-8 text-stone-400">
                                <p>{t('no_answers_yet')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyQuestionModal;
