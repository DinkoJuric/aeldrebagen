import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';

export interface ActivityTimelineProps {
    role: 'senior' | 'relative';
    maxItems?: number;
    className?: string;
}

interface ActivityItem {
    type: 'task' | 'symptom';
    timestamp: Date;
    text: string;
    emoji: string;
    time: string;
}

/**
 * ActivityTimeline - A unified activity feed for both roles.
 * - Senior Mode: Shows completed tasks and logged symptoms (interactive context)
 * - Relative Mode: Shows the same data as a read-only "connection history"
 */
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
    role,
    maxItems = 5,
    className = ''
}) => {
    const { t } = useTranslation();
    const {
        tasks = [],
        symptoms = []
    } = useCareCircleContext();

    // Generate activity feed from tasks and symptoms
    const recentActivity = useMemo<ActivityItem[]>(() => {
        const activities: Omit<ActivityItem, 'time'>[] = [];

        // Add completed tasks
        tasks.filter(task => task.completed && task.completedAt).forEach(task => {
            const timestamp = (task.completedAt as any)?.toDate
                ? (task.completedAt as any).toDate()
                : new Date(task.completedAt as any);
            activities.push({
                type: 'task',
                timestamp,
                text: `${t('task_completed')}: ${task.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms
        symptoms.forEach(symptom => {
            const timestamp = (symptom.loggedAt as any)?.toDate
                ? (symptom.loggedAt as any).toDate()
                : new Date(symptom.loggedAt as any);
            activities.push({
                type: 'symptom',
                timestamp,
                text: `${t('symptom_log_item', { label: symptom.label || symptom.type || t('unknown') })}`,
                emoji: '🩺'
            });
        });

        // Sort by time (newest first) and limit
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, maxItems)
            .map(a => ({
                ...a,
                time: a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [tasks, symptoms, maxItems, t]);

    if (recentActivity.length === 0) {
        return (
            <div className={`bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-stone-100 shadow-sm ${className}`}>
                <p className="text-sm text-stone-400 text-center">{t('no_activity_yet')}</p>
            </div>
        );
    }

    // Relative view uses a softer, more observational style
    const containerClass = role === 'relative'
        ? 'bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-stone-100 shadow-sm'
        : 'bg-stone-50 rounded-2xl p-4 border border-stone-100';

    return (
        <div className={`${containerClass} ${className}`}>
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-4">
                {t('seneste_aktivitet') || 'Seneste aktivitet'}
            </h3>
            <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-stone-700">
                        <span className="font-bold text-stone-300 w-12">{activity.time}</span>
                        <span className="text-lg">{activity.emoji}</span>
                        <span className="font-medium">{activity.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
