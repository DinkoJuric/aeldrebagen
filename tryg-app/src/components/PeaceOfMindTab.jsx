import React from 'react';
import { Heart, Clock, Pill, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { SeniorStatusCard } from './SeniorStatusCard';
import { ThinkingOfYouIconButton } from './ThinkingOfYou';
import { ProgressRing } from './ProgressRing';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { getDailyBriefing } from '../utils/briefing';

// Peace of Mind Tab - emotional reassurance focused
// Shows: "Alt er vel" hero with Gates progress, quick glance stats, connection history
// Uses CareCircleContext for shared data (props as optional overrides)
export const PeaceOfMindTab = ({
    seniorName: propSeniorName,
    lastCheckIn,
    tasks = [],
    symptomCount = 0,
    symptoms = [],
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
            {/* HERO: Peace of Mind Card with Atmospheric Background details */}
            <SeniorStatusCard
                seniorName={seniorName}
                lastCheckIn={lastCheckIn}
                completionRate={completionRate}
                tasks={tasks}
                symptomCount={symptomCount}
                onViewSymptoms={onViewSymptoms}
            />
            {/* Thinking of You - moved outside card if needed or keep inside? SeniorStatusCard doesn't have it built-in. */}
            {/* Adding ThinkingOfYouIconButton below the card or integrate into a separate actions row if preferred. */}
            <div className="flex justify-end -mt-2 mb-2">
                <ThinkingOfYouIconButton onSendPing={onSendPing} />
            </div>

            {/* SMART SUMMARY - Natural Language Briefing */}
            {(() => {
                const briefing = getDailyBriefing({ tasks, symptoms, seniorName, lastCheckIn });
                return (
                    <div className={`p-4 rounded-xl border-2 ${briefing.type === 'success' ? 'bg-green-50 border-green-200' :
                        briefing.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                            'bg-stone-50 border-stone-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{briefing.emoji}</span>
                            <div className="flex-1">
                                <p className={`font-medium ${briefing.type === 'success' ? 'text-green-800' :
                                    briefing.type === 'warning' ? 'text-amber-800' :
                                        'text-stone-700'
                                    }`}>
                                    {briefing.message}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

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

