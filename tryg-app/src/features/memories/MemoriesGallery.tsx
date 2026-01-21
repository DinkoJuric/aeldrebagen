import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Memory } from '../../types';
import MemoryCard from './MemoryCard';

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
                    <MemoryCard key={memory.id} memory={memory} />
                ))}
            </div>
        </div>
    );
};
