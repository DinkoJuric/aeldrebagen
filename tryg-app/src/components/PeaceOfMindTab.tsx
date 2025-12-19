// PeaceOfMindTab - Relative's main emotional tab
import React, { useMemo } from 'react';
import { CoffeeInviteCard } from '../features/coffee';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { getDailyBriefing } from '../utils/briefing';
import { useTranslation } from 'react-i18next';
import { AmbientDashboard } from '../features/familyPresence/AmbientDashboard';

/**
 * Peace of Mind Tab - emotional reassurance focused
 * Shows: Ambient Dashboard hero, smart briefing, and connection moments.
 */
export const PeaceOfMindTab: React.FC = () => {
    const { t } = useTranslation();
    const {
        seniorName,
        tasks = [],
        symptoms: symptomLogs = [],
        lastCheckIn
    } = useCareCircleContext();

    // Count today's symptoms
    const todaySymptomCount = useMemo(() => {
        return symptomLogs.filter(s => {
            const date = (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any);
            return date.toDateString() === new Date().toDateString();
        }).length;
    }, [symptomLogs]);

    // Generate activity feed from tasks and symptoms
    const recentActivity = useMemo(() => {
        const activities: any[] = [];

        // Add completed tasks
        tasks.filter(t => t.completed && t.completedAt).forEach(t => {
            activities.push({
                type: 'task',
                timestamp: (t.completedAt as any)?.toDate ? (t.completedAt as any).toDate() : new Date(t.completedAt as any),
                text: `Udført: ${t.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms
        symptomLogs.forEach(s => {
            activities.push({
                type: 'symptom',
                timestamp: (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any),
                text: `Symptom: ${s.label || s.type || 'Ukendt'}`,
                emoji: '🩺'
            });
        });

        // Sort by time (newest first)
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map(a => ({
                ...a,
                time: a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [tasks, symptomLogs]);

    return (
        <div className="space-y-6 tab-content">
            {/* Spontan Kaffe Signal */}
            <CoffeeInviteCard />

            {/* HERO: Ambient Dashboard - High Fidelity Status */}
            <AmbientDashboard
                seniorName={seniorName}
                lastCheckIn={lastCheckIn}
                tasks={tasks}
                symptomCount={todaySymptomCount}
            />

            {/* SMART SUMMARY - Natural Language Briefing */}
            {(() => {
                const briefing = getDailyBriefing({ tasks, symptoms: symptomLogs, seniorName, lastCheckIn, t });
                return (
                    <div className={`p-5 rounded-[1.5rem] border-2 shadow-sm transition-all duration-300 ${briefing.type === 'success' ? 'bg-emerald-50 border-emerald-100 shadow-emerald-50/50' :
                        briefing.type === 'warning' ? 'bg-amber-50 border-amber-100 shadow-amber-50/50' :
                            'bg-stone-50 border-stone-200 shadow-stone-50/50'
                        }`}>
                        <div className="flex items-start gap-4">
                            <span className="text-3xl filter drop-shadow-sm">{briefing.emoji}</span>
                            <div className="flex-1">
                                <p className={`text-lg font-semibold leading-relaxed ${briefing.type === 'success' ? 'text-emerald-900' :
                                    briefing.type === 'warning' ? 'text-amber-900' :
                                        'text-stone-800'
                                    }`}>
                                    {briefing.message}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Connection History */}
            {recentActivity.length > 0 && (
                <div className="bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-6 border border-stone-100 shadow-sm">
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
            )}
        </div>
    );
};

export default PeaceOfMindTab;
