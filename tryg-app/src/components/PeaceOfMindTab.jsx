import React from 'react';
import { Heart, Clock, Pill } from 'lucide-react';
import { SeniorStatusCard } from './SeniorStatusCard';
import { ThinkingOfYouIconButton } from './ThinkingOfYou';

// Peace of Mind Tab - emotional reassurance focused
// Shows: "Alt er vel" hero, quick glance stats, connection history
export const PeaceOfMindTab = ({
    seniorName,
    lastCheckIn,
    completionRate,
    symptomCount = 0,
    onSendPing,
    recentActivity = []
}) => {
    // Determine peace of mind status
    const getPeaceOfMindStatus = () => {
        if (completionRate >= 80) return { label: 'Alt er vel ✨', color: 'bg-emerald-500', textColor: 'text-emerald-700' };
        if (completionRate >= 50) return { label: 'God dag', color: 'bg-amber-400', textColor: 'text-amber-700' };
        return { label: 'Tjek ind', color: 'bg-orange-400', textColor: 'text-orange-700' };
    };

    const status = getPeaceOfMindStatus();

    return (
        <div className="space-y-4">
            {/* HERO: Peace of Mind Card */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{status.label}</h2>
                        <p className="text-teal-100 text-sm">{seniorName} har det godt</p>
                    </div>
                    <ThinkingOfYouIconButton onSendPing={onSendPing} />
                </div>

                {/* Progress Ring */}
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="32"
                                stroke="white"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${completionRate * 2.01} 201`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                            {completionRate}%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-teal-100">Dagens fremskridt</p>
                        <p className="text-teal-50">Sidst set {lastCheckIn || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Quick Glance Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 border-2 border-stone-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Pill className="w-4 h-4 text-teal-500" />
                        <span className="text-xs text-stone-500 font-medium">Medicin</span>
                    </div>
                    <p className="text-lg font-bold text-stone-800">{completionRate}% taget</p>
                </div>
                <div className={`bg-white rounded-xl p-4 border-2 ${symptomCount > 0 ? 'border-orange-200' : 'border-stone-100'} shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-stone-500 font-medium">Symptomer</span>
                    </div>
                    <p className={`text-lg font-bold ${symptomCount > 0 ? 'text-orange-600' : 'text-stone-800'}`}>
                        {symptomCount > 0 ? `${symptomCount} i dag` : 'Ingen'}
                    </p>
                </div>
            </div>

            {/* Connection History */}
            {recentActivity.length > 0 && (
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
