import React from 'react';
import { Heart, Clock, Pill, CheckCircle, AlertCircle } from 'lucide-react';
import { SeniorStatusCard } from './SeniorStatusCard';
import { ThinkingOfYouIconButton } from './ThinkingOfYou';
import { ProgressRing } from './ProgressRing';
import { useCareCircleContext } from '../contexts/CareCircleContext';

// Peace of Mind Tab - emotional reassurance focused
// Shows: "Alt er vel" hero with Gates progress, quick glance stats, connection history
// Uses CareCircleContext for shared data (props as optional overrides)
export const PeaceOfMindTab = ({
    seniorName: propSeniorName,
    lastCheckIn,
    tasks = [],
    symptomCount = 0,
    onSendPing,
    onViewSymptoms,
    recentActivity = []
}) => {
    // Get from context, use props as override
    const context = useCareCircleContext();
    const seniorName = propSeniorName ?? context.seniorName ?? 'Senior';

    // Calculate completion rate from tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Determine peace of mind status
    const getPeaceOfMindStatus = () => {
        // Check for overdue tasks
        const currentHour = new Date().getHours();
        const morningTasks = tasks.filter(t => t.period === 'morgen');
        const morningComplete = morningTasks.every(t => t.completed);
        const afternoonTasks = tasks.filter(t => t.period === 'eftermiddag');
        const afternoonComplete = afternoonTasks.every(t => t.completed);

        // If morning is past and tasks incomplete, show warning
        if (currentHour >= 12 && morningTasks.length > 0 && !morningComplete) {
            return {
                label: 'Morgen mangler',
                sublabel: 'Ikke alle morgenopgaver er udført',
                color: 'from-orange-500 to-orange-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        // If afternoon is past and tasks incomplete
        if (currentHour >= 18 && afternoonTasks.length > 0 && !afternoonComplete) {
            return {
                label: 'Eftermiddag mangler',
                sublabel: 'Ikke alle eftermiddagsopgaver er udført',
                color: 'from-amber-500 to-amber-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        if (completionRate >= 80) {
            return {
                label: 'Alt er vel ✨',
                sublabel: `${seniorName} har det godt`,
                color: 'from-teal-500 to-teal-600',
                icon: CheckCircle,
                urgent: false
            };
        }
        if (completionRate >= 50) {
            return {
                label: 'God dag',
                sublabel: 'Dagen skrider fremad',
                color: 'from-teal-500 to-teal-600',
                icon: CheckCircle,
                urgent: false
            };
        }
        return {
            label: 'Tjek ind',
            sublabel: 'Der er opgaver at følge op på',
            color: 'from-amber-500 to-amber-600',
            icon: Clock,
            urgent: false
        };
    };

    const status = getPeaceOfMindStatus();
    const StatusIcon = status.icon;

    // Get period-specific stats for quick glance
    const getMedicineStatus = () => {
        const medTasks = tasks.filter(t => t.title?.toLowerCase().includes('medicin') || t.title?.toLowerCase().includes('pille'));
        if (medTasks.length === 0) return { text: 'Ingen planlagt', color: 'text-stone-500' };
        const completed = medTasks.filter(t => t.completed).length;
        const total = medTasks.length;
        if (completed === total) return { text: 'Alle taget ✓', color: 'text-green-600' };
        return { text: `${completed}/${total} taget`, color: completed > 0 ? 'text-amber-600' : 'text-red-600' };
    };

    const medicineStatus = getMedicineStatus();

    return (
        <div className="space-y-4">
            {/* HERO: Peace of Mind Card with Gates Progress */}
            <div className={`bg-gradient-to-br ${status.color} rounded-2xl p-6 text-white shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <StatusIcon className={`w-8 h-8 ${status.urgent ? 'animate-pulse' : ''}`} />
                        <div>
                            <h2 className="text-2xl font-bold mb-0.5">{status.label}</h2>
                            <p className="text-white/80 text-sm">{status.sublabel}</p>
                        </div>
                    </div>
                    <ThinkingOfYouIconButton onSendPing={onSendPing} />
                </div>

                {/* Gates Progress Ring */}
                <div className="flex items-center justify-center py-2">
                    <ProgressRing
                        tasks={tasks}
                        size={140}
                        strokeWidth={14}
                        showLabels={true}
                    />
                </div>

                <div className="text-center mt-2">
                    <p className="text-sm text-white/70">Sidst set {lastCheckIn || '-'}</p>
                </div>
            </div>

            {/* Quick Glance Cards - with color-coded status */}
            <div className="grid grid-cols-2 gap-3">
                <div className={`bg-white rounded-xl p-4 border-2 ${medicineStatus.color.includes('red') ? 'border-red-200' :
                    medicineStatus.color.includes('amber') ? 'border-amber-200' :
                        medicineStatus.color.includes('green') ? 'border-green-200' : 'border-stone-100'
                    } shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Pill className={`w-4 h-4 ${medicineStatus.color.includes('red') ? 'text-red-500' :
                            medicineStatus.color.includes('amber') ? 'text-amber-500' :
                                'text-teal-500'
                            }`} />
                        <span className="text-xs text-stone-500 font-medium">Medicin</span>
                    </div>
                    <p className={`text-lg font-bold ${medicineStatus.color}`}>{medicineStatus.text}</p>
                </div>
                <button
                    onClick={onViewSymptoms}
                    className={`bg-white rounded-xl p-4 border-2 ${symptomCount > 0 ? 'border-orange-200' : 'border-stone-100'} shadow-sm text-left hover:bg-orange-50 transition-colors cursor-pointer`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-stone-500 font-medium">Symptomer</span>
                    </div>
                    <p className={`text-lg font-bold ${symptomCount > 0 ? 'text-orange-600' : 'text-stone-800'}`}>
                        {symptomCount > 0 ? `${symptomCount} i dag` : 'Ingen'}
                    </p>
                </button>
            </div>

            {/* Connection History - DISABLED for now (uncomment to re-enable) */}
            {false && recentActivity.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Seneste aktivitet</h3>
                    <div className="space-y-2">
                        {recentActivity.slice(0, 5).map((activity, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                                <span className="text-stone-400">{activity.time}</span>
                                <span>{activity.emoji}</span>
                                <span>{activity.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeaceOfMindTab;

