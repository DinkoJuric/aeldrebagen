import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { getDailyBriefing } from '../../utils/briefing';

export interface BriefingStoryProps {
    className?: string;
}

/**
 * BriefingStory - Natural language summary of the senior's day.
 * Shared by both Senior and Relative roles in the AmbientTab.
 * Uses the getDailyBriefing utility to generate an emotionally-aware message.
 */
export const BriefingStory: React.FC<BriefingStoryProps> = ({ className = '' }) => {
    const { t } = useTranslation();
    const {
        tasks = [],
        symptoms = [],
        seniorName,
        lastCheckIn
    } = useCareCircleContext();

    const briefing = getDailyBriefing({
        tasks,
        symptoms,
        seniorName,
        lastCheckIn,
        t
    });

    return (
        <div
            className={`p-5 rounded-[1.5rem] glass-premium transition-all duration-300 ${briefing.type === 'success'
                ? 'glow-warmth-success bg-gradient-to-br from-emerald-50/90 to-teal-50/80 border-emerald-100/50'
                : briefing.type === 'warning'
                    ? 'bg-gradient-to-br from-amber-50/90 to-orange-50/80 border-amber-100/50'
                    : 'bg-gradient-to-br from-stone-50/90 to-stone-100/80 border-stone-200/50'
                } ${className}`}
        >
            <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-sm">{briefing.emoji}</span>
                <div className="flex-1">
                    <p
                        className={`text-lg font-bold leading-relaxed tracking-tight ${briefing.type === 'success'
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : briefing.type === 'warning'
                                ? 'text-amber-900 dark:text-amber-100'
                                : 'theme-text'
                            }`}
                    >
                        {briefing.message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BriefingStory;
