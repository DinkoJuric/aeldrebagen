import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Mic, Play, Calendar, User, History } from 'lucide-react';
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

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ circleId }) => {
    const { t } = useTranslation();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

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

    const formatTime = (timestamp: FirestoreDate | undefined) => {
        if (!timestamp) return '';
        const date = toJsDate(timestamp);
        return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
    };

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
                    <div key={memory.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => new Audio(memory.url).play()}
                                className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                            >
                                <Play fill="currentColor" size={24} />
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
                ))}
            </div>
        </div>
    );
};
