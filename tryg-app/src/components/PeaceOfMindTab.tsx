import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { StatusCard } from '../features/familyPresence';
import { CoffeeInviteCard } from '../features/coffee';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { getDailyBriefing } from '../utils/briefing';
import { useTranslation } from 'react-i18next';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';

export interface PeaceOfMindTabProps {
    seniorName?: string;
    lastCheckIn?: any;
    tasks?: Task[];
    symptomCount?: number;
    symptoms?: SymptomLog[];
    onSendPing?: () => void;
    onViewSymptoms?: () => void;
    recentActivity?: any[];
}

// Peace of Mind Tab - emotional reassurance focused
// Shows: "Alt er vel" hero with Gates progress, quick glance stats, connection history
// Uses CareCircleContext for shared data (props as optional overrides)
export const PeaceOfMindTab: React.FC<PeaceOfMindTabProps> = ({
    seniorName: propSeniorName,
    lastCheckIn,
    tasks = [],
    symptomCount = 0,
    symptoms = [],
    onViewSymptoms,
    recentActivity = []
}) => {
    const { t } = useTranslation();
    const context = useCareCircleContext();
    const seniorName = propSeniorName ?? context.seniorName;

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
                label: t('peace_morning_missing'),
                sublabel: t('peace_sub_morning_missing'),
                color: 'from-orange-500 to-orange-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        // If afternoon is past and tasks incomplete
        if (currentHour >= 18 && afternoonTasks.length > 0 && !afternoonComplete) {
            return {
                label: t('peace_afternoon_missing'),
                sublabel: t('peace_sub_afternoon_missing'),
                color: 'from-amber-500 to-amber-600',
                icon: AlertCircle,
                urgent: true
            };
        }

        if (completionRate >= 80) {
            return {
                label: t('peace_all_well'),
                sublabel: t('peace_sub_all_well', { name: seniorName }),
                color: 'from-teal-500 to-teal-600',
                icon: CheckCircle,
                urgent: false
            };
        }
        if (completionRate >= 50) {
            return {
                label: t('peace_good_day'),
                sublabel: t('peace_sub_good_day'),
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

    getPeaceOfMindStatus();


    return (
        <div className="space-y-4">
            {/* Spontan Kaffe Signal */}
            <CoffeeInviteCard />

            {/* HERO: Peace of Mind Card with Atmospheric Background details */}
            <StatusCard
                mode="senior"
                name={seniorName}
                timestamp={lastCheckIn}
                completionRate={completionRate}
                tasks={tasks}
                symptomCount={symptomCount}
                onViewSymptoms={onViewSymptoms}
            />

            {/* SMART SUMMARY - Natural Language Briefing */}
            {(() => {
                const briefing = getDailyBriefing({ tasks, symptoms, seniorName, lastCheckIn, t });
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
