import { Zap, Brain, Frown, Thermometer, Moon, Droplets, Utensils } from 'lucide-react';

// Initial tasks grouped by time of day (Habit Stacking)
export const INITIAL_TASKS = [
    { id: 1, title: 'Morgenpiller', type: 'medication', time: '08:00', period: 'morgen', completed: false, description: 'Hjertemedicin (2 piller)' },
    { id: 2, title: 'Drik vand', type: 'hydration', time: '10:00', period: 'morgen', completed: false, description: 'Et stort glas' },
    { id: 3, title: 'Frokostmedicin', type: 'medication', time: '12:00', period: 'frokost', completed: false, description: 'Vitaminer' },
    { id: 4, title: 'Gåtur', type: 'activity', time: '14:00', period: 'eftermiddag', completed: false, description: '15 min i haven' },
];

// Symptom options with icons and colors
export const SYMPTOMS_LIST = [
    { id: 'pain', label: 'Smerter', icon: Zap, color: 'bg-red-100 text-red-600' },
    { id: 'dizzy', label: 'Svimmel', icon: Brain, color: 'bg-purple-100 text-purple-600' },
    { id: 'nausea', label: 'Kvalme', icon: Frown, color: 'bg-orange-100 text-orange-600' },
    { id: 'fever', label: 'Feber', icon: Thermometer, color: 'bg-amber-100 text-amber-600' },
    { id: 'sleep', label: 'Søvnbesvær', icon: Moon, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'sweats', label: 'Nattesved', icon: Droplets, color: 'bg-sky-100 text-sky-600' },
    { id: 'appetite', label: 'Appetit', icon: Utensils, color: 'bg-emerald-100 text-emerald-600' },
];

// Senior profile defaults
export const SENIOR_PROFILE = {
    name: 'Birthe Jensen',
    age: 78,
    status: 'active',
    lastActive: new Date().toISOString(),
    batteryLevel: 85,
};
