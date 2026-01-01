// Weekly questions to rotate through
export const WEEKLY_QUESTIONS = [
    "weekly_question_1",
    "weekly_question_2"
];

// Get week number of the year
export const getWeekNumber = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // ms in a week
    return Math.floor(diff / oneWeek);
};

export const DEFAULT_MEMORIES = [
    { date: '3 år siden', text: 'Familietur til Skagen', emoji: '🏖️' },
    { date: '5 år siden', text: 'Emmas fødselsdag', emoji: '🎂' },
    { date: '2 år siden', text: 'Jul hos farmor', emoji: '🎄' },
];
