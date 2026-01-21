import React from 'react';
import { Play, Calendar, User, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Memory } from '../../types';
import { toJsDate } from '../../utils/dateUtils';

interface MemoryCardProps {
    memory: Memory;
}

// 🚀 TURBO: Memoized MemoryCard to prevent re-renders when parent list updates.
// Custom comparison ensures we only re-render if the actual content changes,
// ignoring the new object reference created by parent's map().
const MemoryCard: React.FC<MemoryCardProps> = React.memo(({ memory }) => {
    const { t } = useTranslation();

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = toJsDate(timestamp);
        return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '';
    };

    const handlePlay = () => {
        new Audio(memory.url).play();
    };

    return (
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <button
                    onClick={handlePlay}
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
}, (prev, next) => {
    const p = prev.memory;
    const n = next.memory;

    // Quick ID check
    if (p.id !== n.id) return false;

    // Content check
    if (
        p.url !== n.url ||
        p.questionText !== n.questionText ||
        p.createdByName !== n.createdByName ||
        p.type !== n.type
    ) {
        return false;
    }

    // Timestamp check
    const pTime = p.createdAt as any;
    const nTime = n.createdAt as any;

    if (pTime === nTime) return true;
    if (!pTime || !nTime) return pTime === nTime;

    // Firestore Timestamp
    if (typeof pTime === 'object' && typeof nTime === 'object' && 'seconds' in pTime && 'seconds' in nTime) {
        return pTime.seconds === nTime.seconds && pTime.nanoseconds === nTime.nanoseconds;
    }

    // Fallback to JS Date/String
    const pDate = toJsDate(p.createdAt);
    const nDate = toJsDate(n.createdAt);
    return pDate?.getTime() === nDate?.getTime();
});

export default MemoryCard;
