import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { toJsDate, formatTime } from '../../utils/dateUtils';

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

    // Generate activity feed from tasks and symptoms - TODAY ONLY
    const recentActivity = useMemo<ActivityItem[]>(() => {
        const activities: Omit<ActivityItem, 'time'>[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add completed tasks FROM TODAY ONLY
        tasks.filter(task => {
            if (!task.completed || !task.completedAt) return false;
            const timestamp = toJsDate(task.completedAt);
            return timestamp && timestamp >= today;
        }).forEach(task => {
            const timestamp = toJsDate(task.completedAt)!; // Safe because of filter
            activities.push({
                type: 'task',
                timestamp,
                text: `${t('task_completed')}: ${task.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms FROM TODAY ONLY
        symptoms.filter(symptom => {
            const timestamp = toJsDate(symptom.loggedAt);
            return timestamp && timestamp >= today;
        }).forEach(symptom => {
            const timestamp = toJsDate(symptom.loggedAt)!; // Safe because of filter
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
                time: formatTime(a.timestamp)
            }));
    }, [tasks, symptoms, maxItems, t]);

    if (recentActivity.length === 0) {
        return (
            <div className={`theme-card rounded-[1.5rem] p-6 shadow-sm ${className}`}>
                <p className="text-sm text-[var(--theme-text-muted)] text-center">{t('no_activity_yet')}</p>
            </div>
        );
    }

    // Relative view uses a softer, more observational style
    const containerClass = role === 'relative'
        ? 'theme-card rounded-[1.5rem] p-6 shadow-sm'
        : 'theme-card rounded-2xl p-4';

    return (
        <div className={`${containerClass} ${className}`}>
            <h3 className="text-xs font-black text-[var(--theme-text-muted)] uppercase tracking-[0.2em] mb-4">
                {t('seneste_aktivitet') || 'Seneste aktivitet'}
            </h3>
            <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[var(--theme-text)]">
                        <span className="font-bold text-[var(--theme-text-muted)] w-12">{activity.time}</span>
                        <span className="text-lg">{activity.emoji}</span>
                        <span className="font-medium">{activity.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
