import React from 'react';
import { Play, Calendar, User, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FirestoreDate } from '../../types';
import { toJsDate } from '../../utils/dateUtils';

export interface Memory {
    id: string;
    url: string;
    type: 'audio' | 'photo' | 'video';
    createdByName: string;
    createdAt: FirestoreDate;
    questionText?: string;
    duration?: number;
}

interface MemoryItemProps {
    memory: Memory;
    onPlay: (url: string) => void;
}

// 🚀 TURBO: Memoized MemoryItem to prevent re-renders when parent (MemoriesGallery) updates.
// Also extracts the item logic to keep the list clean.
export const MemoryItem: React.FC<MemoryItemProps> = React.memo(({ memory, onPlay }) => {
    const { t } = useTranslation();

    const formatTime = (timestamp: FirestoreDate | undefined) => {
        if (!timestamp) return '';
        const date = toJsDate(timestamp);
        return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
    };

    return (
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <button
                    onClick={() => onPlay(memory.url)}
                    className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-2xl text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                    aria-label={t('play_audio')}
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
    );
});
