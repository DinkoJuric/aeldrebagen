/**
 * Daily Briefing Generator
 * 
 * Creates natural language summaries of the senior's day.
 * Designed to reduce anxiety for relatives by providing
 * a human-readable status instead of raw data.
 */

import { Task, SymptomLog } from '../types';

interface BriefingParams {
    tasks?: Task[];
    symptoms?: SymptomLog[];
    seniorName?: string;
    lastCheckIn?: string | null;
    t: any; // i18next t function
}

/**
 * Helper to check if a timestamp is from today
 */
const isToday = (date: any): boolean => {
    if (!date) return false;
    let d: Date;
    if (date.toDate) {
        d = date.toDate();
    } else if (typeof date === 'string') {
        d = new Date(date);
    } else {
        d = new Date(date);
    }
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Generate a natural language daily briefing
 */
export function getDailyBriefing({ tasks = [], symptoms = [], seniorName = 'Mor', lastCheckIn = null, t }: BriefingParams) {
    const firstName = seniorName.split(' ')[0]; // Use first name for warmth

    // Calculate task stats
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        (t as any).type === 'medication'
    );
    const allTasksComplete = tasks.length > 0 && tasks.every(t => t.completed);
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.every(t => t.completed);
    const completedMedicine = medicineTasks.filter(t => t.completed).length;

    // Today's symptoms
    const todaySymptoms = symptoms.filter(s => isToday(s.loggedAt));
    const hasSymptoms = todaySymptoms.length > 0;

    // Calculate medicine streak (simplified - just check if today's done)
    // In a real app, you'd query historical data
    // const streak = allMedicineComplete ? Math.floor(Math.random() * 7) + 1 : 0; // Placeholder - unused

    // Generate briefing based on conditions

    // Best case: Everything done, no symptoms
    if (allMedicineComplete && !hasSymptoms) {
        if (allTasksComplete) {
            return {
                message: t('daily_briefing_all_fine', { name: firstName }),
                emoji: '✨',
                type: 'success' as const
            };
        }
        return {
            message: t('daily_briefing_meds_fine', { name: firstName }),
            emoji: '💚',
            type: 'success' as const
        };
    }

    // Symptoms logged but medicine taken
    if (allMedicineComplete && hasSymptoms) {
        const symptomTypes = [...new Set(todaySymptoms.map(s => s.type))];
        const symptomName = symptomTypes[0] || 'symptom';
        const time = todaySymptoms[0]?.loggedAt?.toDate?.()?.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) || '';

        return {
            message: t('daily_briefing_symptom_noted', { name: firstName, symptom: symptomName, time }),
            emoji: '📋',
            type: 'info' as const
        };
    }

    // Medicine not complete but symptoms logged
    if (!allMedicineComplete && hasSymptoms) {
        return {
            message: t('daily_briefing_symptom_warning', { name: firstName, completed: completedMedicine, total: medicineTasks.length }),
            emoji: '⚠️',
            type: 'warning' as const
        };
    }

    // Medicine not complete, no symptoms
    if (!allMedicineComplete && medicineTasks.length > 0) {
        const remaining = medicineTasks.length - completedMedicine;
        return {
            message: t('daily_briefing_meds_missing', { name: firstName, count: remaining }),
            emoji: '💊',
            type: 'info' as const
        };
    }

    // No tasks at all - show neutral status
    if (lastCheckIn && isToday(lastCheckIn)) {
        return {
            message: t('daily_briefing_checked_in', { name: firstName }),
            emoji: '👍',
            type: 'success' as const
        };
    }

    // No activity yet today
    return {
        message: t('daily_briefing_no_activity', { name: firstName }),
        emoji: '💤',
        type: 'info' as const
    };
}

/**
 * Get streak message if applicable
 */
export function getStreakMessage(streakDays: number, _seniorName = 'Mor', t: any) {
    if (streakDays >= 7) {
        return t('streak_msg_7', { count: streakDays });
    }
    if (streakDays >= 3) {
        return t('streak_msg_3', { count: streakDays });
    }
    return null;
}

export default getDailyBriefing;
