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

// Helper to get friendly advice based on symptom
const getSymptomAdvice = (symptomLabel: string, t: any): string => {
    const label = symptomLabel.toLowerCase();
    if (label.includes('kvalme')) return t('symptom_advice_nausea', 'Kvalme kan lindres med ingefær-te og frisk luft.');
    if (label.includes('hovedpine')) return t('symptom_advice_headache', 'Husk at drikke vand og sikre ro omkring dig.');
    if (label.includes('svimmel')) return t('symptom_advice_dizzyness', 'Rejs dig langsomt og støt dig til noget fast.');
    if (label.includes('smerte')) return t('symptom_advice_pain', 'Spørg om medicin skal justeres, hvis smerter fortsætter.');
    return t('symptom_advice_generic', 'Ring og hør hvordan det går. En stemme varmer.');
};

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

    // Most frequent symptom for Nudge
    const topSymptom = useMemo(() => {
        if (weekSymptoms.length === 0) return null;
        const counts: Record<string, number> = {};
        weekSymptoms.forEach(s => {
            const type = s.label || s.id;
            counts[type] = (counts[type] || 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[0] ? sorted[0][0] : null;
    }, [weekSymptoms]);

    // Hide entire component if NO symptoms at all (Today or Week)
    // "Remove or hide the entire element, when there are no symptoms that day" 
    // (INTERPRETATION: User likely meant "If nothing to show, show nothing". 
    // But keeps Week view if relevant.)
    if (todaySymptoms.length === 0 && weekSymptoms.length === 0) return null;

    return (
        <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 space-y-3 shadow-sm">
            {/* Today's Symptoms - Only show if present */}
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
                            <div key={i} className="flex items-center justify-between text-sm text-orange-900 bg-white/70 p-3 rounded-xl border border-orange-100">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold">{log.label}</span>
                                    {log.bodyLocation && (
                                        <span className="text-orange-600 text-xs bg-orange-100 px-2 py-0.5 rounded-full">
                                            {log.bodyLocation.emoji} {log.bodyLocation.label}
                                        </span>
                                    )}
                                </div>
                                <span className="text-orange-500 text-xs font-medium whitespace-nowrap">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7-Day Summary Nudge - "Insight" instead of "Count" */}
            {weekSymptoms.length > 0 && (
                <div className={`${todaySymptoms.length > 0 ? 'border-t border-orange-200 pt-3' : ''}`}>
                    <button
                        onClick={() => setShowOlder(!showOlder)}
                        className="w-full text-left"
                    >
                        {/* Insight Nudge Header */}
                        <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-2 rounded-full mt-1">
                                <Phone className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-orange-900">
                                    {topSymptom ? t('symptom_insight_title', { symptom: topSymptom }) : t('symptom_insight_general')}
                                </h5>
                                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                    {topSymptom ? getSymptomAdvice(topSymptom, t) : t('symptom_insight_generic_body')}
                                </p>
                                <button className="mt-2 text-xs font-bold text-orange-800 bg-white/70 px-3 py-1 rounded-full border border-orange-200 hover:bg-white shadow-sm transition-colors" onClick={(e) => {
                                    e.stopPropagation();
                                    alert('Ringer til familien...');
                                }}>
                                    📞 Ring nu
                                </button>
                            </div>
                            <div className="ml-auto pl-2">
                                {showOlder ? <ChevronUp className="w-4 h-4 text-orange-400" /> : <ChevronDown className="w-4 h-4 text-orange-400" />}
                            </div>
                        </div>
                    </button>

                    {/* Expanded History */}
                    {
                        showOlder && (
                            <div className="space-y-2 mt-4 animate-fade-in">
                                <h6 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">{t('history_last_7_days')}</h6>
                                {weekSymptoms.map((log, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm text-orange-800 bg-white/50 p-2 rounded-lg">
                                        <span>{log.label}</span>
                                        <span className="text-xs text-orange-400">{log.date}</span>
                                    </div>
                                ))}
                                {onViewReport && (
                                    <button
                                        onClick={onViewReport}
                                        className="w-full text-center text-xs text-orange-500 hover:text-orange-700 transition-colors mt-2 font-medium"
                                    >
                                        {t('see_full_history')} →
                                    </button>
                                )}
                            </div>
                        )
                    }
                </div >
            )}

            {/* Trend-based CTA */}
            {
                trend.cta && (
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
                )
            }

            {/* Link to full report */}
            {
                onViewReport && !showOlder && ( // Only show if not already shown in expanded view
                    <button
                        onClick={onViewReport}
                        className="w-full text-center text-xs text-orange-500 hover:text-orange-700 transition-colors"
                    >
                        {t('see_full_history')}
                    </button>
                )
            }
        </div >
    );
};

export default SymptomSummary;
