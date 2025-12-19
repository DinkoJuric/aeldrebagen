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
            className={`p-5 rounded-[1.5rem] border-2 shadow-sm transition-all duration-300 ${briefing.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 shadow-emerald-50/50'
                    : briefing.type === 'warning'
                        ? 'bg-amber-50 border-amber-100 shadow-amber-50/50'
                        : 'bg-stone-50 border-stone-200 shadow-stone-50/50'
                } ${className}`}
        >
            <div className="flex items-start gap-4">
                <span className="text-3xl filter drop-shadow-sm">{briefing.emoji}</span>
                <div className="flex-1">
                    <p
                        className={`text-lg font-semibold leading-relaxed ${briefing.type === 'success'
                                ? 'text-emerald-900'
                                : briefing.type === 'warning'
                                    ? 'text-amber-900'
                                    : 'text-stone-800'
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
