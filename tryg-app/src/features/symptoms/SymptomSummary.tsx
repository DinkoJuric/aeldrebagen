import React, { useState, useMemo } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Phone, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SymptomLog } from '../../types';

interface TrendAnalysis {
    trend: 'none' | 'warning' | 'increasing' | 'decreasing' | 'stable';
    message: string | null;
    cta: {
        icon: React.ElementType;
        text: string;
        action: string;
    } | null;
}

// Check if a date is today
const isToday = (timestamp: any) => {
    if (!timestamp) return false;
    const today = new Date();
    const date = (timestamp && typeof timestamp.toDate === 'function')
        ? timestamp.toDate()
        : new Date(timestamp);
    return date.toDateString() === today.toDateString();
};

// Check if date is within last N days
const isWithinDays = (timestamp: any, days: number) => {
    if (!timestamp) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const date = (timestamp && typeof timestamp.toDate === 'function')
        ? timestamp.toDate()
        : new Date(timestamp);
    return date >= cutoff;
};

// Get trend analysis for symptoms
const analyzeTrend = (symptoms: SymptomLog[], t: any): TrendAnalysis => {
    if (symptoms.length === 0) return { trend: 'none', message: null, cta: null };

    // Count symptoms by day for last 7 days
    const last3Days = symptoms.filter(s => isWithinDays(s.loggedAt, 3)).length;
    const prev4Days = symptoms.filter(s =>
        isWithinDays(s.loggedAt, 7) && !isWithinDays(s.loggedAt, 3)
    ).length;

    // Count severe symptoms
    const severeCount = symptoms.filter(s =>
        s.bodyLocation?.severity?.id === 'severe'
    ).length;

    // Analyze patterns
    if (severeCount >= 2) {
        return {
            trend: 'warning',
            message: t('severe_symptoms_count', { count: severeCount }),
            cta: { icon: Phone, text: t('contact_doctor_cta'), action: 'call' }
        };
    }

    if (last3Days > prev4Days * 1.5 && last3Days >= 3) {
        return {
            trend: 'increasing',
            message: t('increasing_symptoms_msg'),
            cta: { icon: Calendar, text: t('book_doctor_cta'), action: 'book' }
        };
    }

    if (last3Days < prev4Days * 0.5) {
        return {
            trend: 'decreasing',
            message: t('decreasing_symptoms_msg'),
            cta: null
        };
    }

    return {
        trend: 'stable',
        message: t('stable_symptoms_msg', { count: symptoms.length }),
        cta: null
    };
};

interface SymptomSummaryProps {
    symptomLogs?: SymptomLog[];
    onViewReport?: () => void;
    hideTitle?: boolean;
}

// Symptom Summary Card - shows today's symptoms with 7-day overview
export const SymptomSummary: React.FC<SymptomSummaryProps> = ({ symptomLogs = [], onViewReport, hideTitle = false }) => {
    const { t } = useTranslation();
    const [showOlder, setShowOlder] = useState(false);

    // Split symptoms
    const { todaySymptoms, weekSymptoms } = useMemo(() => {
        const today = symptomLogs.filter(s => isToday(s.loggedAt));
        const week = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7) && !isToday(s.loggedAt));
        return { todaySymptoms: today, weekSymptoms: week };
    }, [symptomLogs]);

    // Get trend analysis
    const weeklySymptoms = symptomLogs.filter(s => isWithinDays(s.loggedAt, 7));
    const trend = useMemo(() => analyzeTrend(weeklySymptoms, t), [weeklySymptoms, t]);

    // Count symptoms by type for summary
    const symptomCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        weekSymptoms.forEach(s => {
            const type = s.label || s.id;
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    }, [weekSymptoms]);

    if (symptomLogs.length === 0) return null;

    return (
        <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 space-y-3">
            {/* Today's Symptoms */}
            {todaySymptoms.length > 0 && (
                <div>
                    {!hideTitle && (
                        <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            {t('symptoms_today_count', { count: todaySymptoms.length })}
                        </h4>
                    )}
                    <div className="space-y-2">
                        {todaySymptoms.map((log, i) => (
                            <div key={i} className="flex items-center justify-between text-sm text-orange-900 bg-white/70 p-3 rounded-xl">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium">{log.label}</span>
                                    {log.bodyLocation && (
                                        <span className="text-orange-600 text-xs bg-orange-100 px-2 py-0.5 rounded-full">
                                            {log.bodyLocation.emoji} {log.bodyLocation.label}
                                        </span>
                                    )}
                                    {log.bodyLocation?.severity && (
                                        <span className="text-xs bg-orange-200 px-2 py-0.5 rounded-full">
                                            {log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}
                                        </span>
                                    )}
                                </div>
                                <span className="text-orange-500 text-xs whitespace-nowrap">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7-Day Summary */}
            {weekSymptoms.length > 0 && (
                <div className="border-t border-orange-200 pt-3">
                    <button
                        onClick={() => setShowOlder(!showOlder)}
                        className="w-full flex items-center justify-between text-sm"
                    >
                        <div className="flex items-center gap-2 text-orange-700">
                            {trend.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-500" />}
                            {trend.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-green-500" />}
                            {trend.trend === 'stable' && <AlertCircle className="w-4 h-4" />}
                            {trend.trend === 'warning' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            <span className="font-medium">
                                {trend.message || t('symptoms_this_week', { count: weekSymptoms.length })}
                            </span>
                        </div>
                        {showOlder ? (
                            <ChevronUp className="w-4 h-4 text-orange-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-orange-500" />
                        )}
                    </button>

                    {/* Collapsed summary */}
                    {!showOlder && symptomCounts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {symptomCounts.map(([type, count], i) => (
                                <span key={i} className="text-xs text-orange-600 bg-white/60 px-2 py-1 rounded-full">
                                    {type} ({count}x)
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Expanded view */}
                    {showOlder && (
                        <div className="space-y-2 mt-3">
                            {/* When in warning mode, only show severe symptoms */}
                            {(trend.trend === 'warning'
                                ? weekSymptoms.filter(s => s.bodyLocation?.severity?.id === 'severe')
                                : weekSymptoms
                            ).map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-sm text-orange-800 bg-white/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span>{log.label}</span>
                                        {log.bodyLocation && (
                                            <span className="text-xs text-orange-500">
                                                {log.bodyLocation.emoji}
                                            </span>
                                        )}
                                        {log.bodyLocation?.severity && (
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${log.bodyLocation.severity.id === 'severe'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {log.bodyLocation.severity.label}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-orange-400">{log.date || log.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Trend-based CTA */}
            {trend.cta && (
                <div className="border-t border-orange-200 pt-3">
                    <button
                        onClick={() => {
                            // Future: integrate with phone/calendar
                            if (trend.cta?.action === 'call') {
                                alert('Ring til læge funktionalitet kommer snart');
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl text-sm font-medium transition-colors"
                    >
                        <trend.cta.icon className="w-4 h-4" />
                        {trend.cta.text}
                    </button>
                </div>
            )}

            {/* Link to full report */}
            {onViewReport && (
                <button
                    onClick={onViewReport}
                    className="w-full text-center text-xs text-orange-500 hover:text-orange-700 transition-colors"
                >
                    {t('see_full_history')}
                </button>
            )}
        </div>
    );
};

export default SymptomSummary;
