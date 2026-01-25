import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Mic, Play, Calendar, User, History, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FirestoreDate } from '../../types';
import { toJsDate } from '../../utils/dateUtils';

interface Memory {
    id: string;
    url: string;
    type: 'audio' | 'photo' | 'video';
    createdByName: string;
    createdAt: FirestoreDate;
    questionText?: string;
    duration?: number;
}

interface MemoriesGalleryProps {
    circleId: string;
}

// 🚀 TURBO: Memoized list item to prevent re-rendering the entire list when one item updates (e.g. toggling playback)
const MemoryItem = React.memo(({ memory, isPlaying, onPlay, formatTime, t }: {
    memory: Memory;
    isPlaying: boolean;
    onPlay: (url: string, id: string) => void;
    formatTime: (d: FirestoreDate | undefined) => string;
    t: (k: string) => string;
}) => {
    return (
        <div className={`bg-white rounded-2xl p-4 border transition-all ${isPlaying ? 'border-indigo-200 shadow-md ring-1 ring-indigo-100' : 'border-stone-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex items-start gap-4">
                <button
                    onClick={() => onPlay(memory.url, memory.id)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-colors shrink-0 ${isPlaying ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                    aria-label={isPlaying ? t('pause_audio') : t('play_audio')}
                >
                    {isPlaying ? <Square fill="currentColor" size={16} /> : <Play fill="currentColor" size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 truncate">
                        {memory.questionText || t('untilted_memory')}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                            <User size={12} />
                            {memory.createdByName}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatTime(memory.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Mic size={12} />
                            {memory.type === 'audio' ? t('audio') : memory.type}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ circleId }) => {
    const { t } = useTranslation();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    // 🚀 TURBO: Single audio instance management to prevent overlapping playback and memory leaks
    const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!circleId) return;

        const memoriesRef = collection(db, 'careCircles', circleId, 'memories');
        const q = query(memoriesRef, orderBy('createdAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const memoriesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Memory[];
            setMemories(memoriesList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [circleId]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePlay = useCallback((url: string, id: string) => {
        // If clicking the currently playing item, toggle (pause)
        if (activeAudioId === id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setActiveAudioId(null);
            return;
        }

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Start new audio
        const audio = new Audio(url);
        audioRef.current = audio;
        setActiveAudioId(id);

        audio.play().catch(err => {
            console.error("Audio playback failed", err);
            setActiveAudioId(null);
            audioRef.current = null;
        });

        audio.addEventListener('ended', () => {
            setActiveAudioId(null);
            audioRef.current = null;
        });
    }, [activeAudioId]);

    const formatTime = useCallback((timestamp: FirestoreDate | undefined) => {
        if (!timestamp) return '';
        const date = toJsDate(timestamp);
        return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="bg-stone-50 rounded-2xl p-8 text-center border-2 border-dashed border-stone-200">
                <History className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">{t('no_memories_yet')}</p>
                <p className="text-xs text-stone-400 mt-1">{t('memories_will_appear_here')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-500" />
                    {t('livsbog_title')}
                </h3>
                <span className="text-xs text-stone-400 font-medium bg-stone-100 px-2 py-1 rounded-full">
                    {memories.length} {t('stories')}
                </span>
            </div>

            <div className="grid gap-4">
                {memories.map((memory) => (
                    <MemoryItem
                        key={memory.id}
                        memory={memory}
                        isPlaying={activeAudioId === memory.id}
                        onPlay={handlePlay}
                        formatTime={formatTime}
                        t={t}
                    />
                ))}
            </div>
        </div>
    );
};
