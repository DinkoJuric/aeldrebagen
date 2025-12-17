/**
 * Daily Briefing Generator
 * 
 * Creates natural language summaries of the senior's day.
 * Designed to reduce anxiety for relatives by providing
 * a human-readable status instead of raw data.
 */

import { Task } from '../features/tasks/useTasks';

interface BriefingParams {
    tasks?: Task[];
    symptoms?: any[]; // Keep flexible if Symptom type not strictly defined globally yet
    seniorName?: string;
    lastCheckIn?: any;
}

/**
 * Helper to check if a timestamp is from today
 */
const isToday = (date: any): boolean => {
    if (!date) return false;
    // @ts-ignore - Firestore timestamps have toDate()
    const d = date.toDate ? date.toDate() : new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

/**
 * Generate a natural language daily briefing
 */
export function getDailyBriefing({ tasks = [], symptoms = [], seniorName = 'Mor', lastCheckIn = null }: BriefingParams) {
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
                message: `Alt ser fint ud. ${firstName} har haft en rolig dag.`,
                emoji: '✨',
                type: 'success' as const
            };
        }
        return {
            message: `${firstName} har taget al medicin. Alt er godt.`,
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
            message: `${firstName} har noteret ${symptomName}${time ? ` kl. ${time}` : ''}, men har taget sin medicin.`,
            emoji: '📋',
            type: 'info' as const
        };
    }

    // Medicine not complete but symptoms logged
    if (!allMedicineComplete && hasSymptoms) {
        return {
            message: `${firstName} har logget symptomer. Medicin: ${completedMedicine}/${medicineTasks.length} taget.`,
            emoji: '⚠️',
            type: 'warning' as const
        };
    }

    // Medicine not complete, no symptoms
    if (!allMedicineComplete && medicineTasks.length > 0) {
        const remaining = medicineTasks.length - completedMedicine;
        return {
            message: `${firstName} mangler ${remaining} medicin${remaining > 1 ? 'er' : ''} i dag.`,
            emoji: '💊',
            type: 'info' as const
        };
    }

    // No tasks at all - show neutral status
    if (lastCheckIn && isToday(lastCheckIn)) {
        return {
            message: `${firstName} har tjekket ind i dag. Alt ser fint ud.`,
            emoji: '👍',
            type: 'success' as const
        };
    }

    // No activity yet today
    return {
        message: `Ingen aktivitet fra ${firstName} endnu i dag.`,
        emoji: '💤',
        type: 'info' as const
    };
}

/**
 * Get streak message if applicable
 */
export function getStreakMessage(streakDays: number, seniorName = 'Mor') {
    if (streakDays >= 7) {
        return `🏆 ${streakDays}. dag i træk med alt medicin taget!`;
    }
    if (streakDays >= 3) {
        return `🎉 ${streakDays}. dag i træk!`;
    }
    return null;
}

export default getDailyBriefing;
