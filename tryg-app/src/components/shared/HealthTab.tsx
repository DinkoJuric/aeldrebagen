import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { SYMPTOMS_LIST } from '../../data/constants';
import { SymptomLog } from '../../types';

export const HealthTab: React.FC = () => {
    const { t } = useTranslation();
    const {
        symptoms: symptomLogs = []
    } = useCareCircleContext();

    const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(() => {
        const today = new Date().toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
        return { [today]: true };
    });
    const [filterDate, setFilterDate] = useState<string | null>(null);


    // Group symptoms by date
    const groupedSymptoms = useMemo<Record<string, (SymptomLog & { dateObj: Date })[]>>(() => {
        const grouped: Record<string, (SymptomLog & { dateObj: Date })[]> = {};
        symptomLogs.forEach((log: SymptomLog) => {
            const date = (log.loggedAt as { toDate?: () => Date })?.toDate ? (log.loggedAt as { toDate: () => Date }).toDate() : new Date((log.loggedAt as unknown as string) || Date.now());
            const dateKey = date.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push({ ...log, dateObj: date } as SymptomLog & { dateObj: Date });
        });
        return grouped;
    }, [symptomLogs]);

    // Chart data - 14 days
    // Fix: Calculate 'now' inside useMemo (or outside) to avoid dependency issues, but acknowledge it changes daily.
    const chartData = useMemo(() => {
        const nowTime = Date.now();
        const days = Array(14).fill(null).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            return {
                date: d,
                dateKey: d.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' }),
                count: 0
            };
        });

        symptomLogs.forEach((log: SymptomLog) => {
            const date = (log.loggedAt as { toDate?: () => Date })?.toDate ? (log.loggedAt as { toDate: () => Date }).toDate() : new Date((log.loggedAt as unknown as string) || nowTime);
            const daysAgo = Math.floor((nowTime - date.getTime()) / (1000 * 60 * 60 * 24));
            if (daysAgo >= 0 && daysAgo < 14) {
                days[13 - daysAgo].count++;
            }
        });

        return days;
    }, [symptomLogs]);

    const maxCount = Math.max(...chartData.map(d => d.count), 1);

    const displayedSymptoms = useMemo<Record<string, (SymptomLog & { dateObj: Date })[]>>(() => {
        if (!filterDate) return groupedSymptoms;
        return { [filterDate]: groupedSymptoms[filterDate] || [] };
    }, [groupedSymptoms, filterDate]);

    const totalSymptoms = symptomLogs.length;
    const symptomCounts: Record<string, number> = {};
    symptomLogs.forEach(log => {
        const label = log.label || 'Unknown';
        symptomCounts[label] = (symptomCounts[label] || 0) + 1;
    });
    const mostCommon = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

    const toggleDate = (dateKey: string) => {
        setExpandedDates(prev => ({
            ...prev,
            [dateKey]: !prev[dateKey]
        }));
    };

    const handleChartClick = (dateKey: string) => {
        if (filterDate === dateKey) {
            setFilterDate(null);
        } else {
            setFilterDate(dateKey);
            setExpandedDates(prev => ({ ...prev, [dateKey]: true }));
        }
    };

    return (
        <div className="tab-content animate-fade-in p-4 space-y-6">
            <h2 className="text-2xl font-bold theme-text mb-2">{t('health_title')}</h2>

            {/* Summary Stats */}
            {totalSymptoms > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="theme-card-secondary rounded-xl p-3 border border-orange-100">
                        <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                        <p className="text-xs text-orange-500">Symptomer (14 dage)</p>
                    </div>
                    {mostCommon && (
                        <div className="theme-card-secondary rounded-xl p-3 border border-purple-100">
                            <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                            <p className="text-xs text-purple-500">Mest hyppige ({mostCommon[1]}x)</p>
                        </div>
                    )}
                </div>
            )}

            {/* Clickable Chart */}
            <div className="p-4 theme-card-secondary rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold theme-text">Symptom-oversigt (14 dage)</h4>
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate(null)}
                            className="text-xs text-orange-600 font-medium hover:underline"
                        >
                            {t('view_all')}
                        </button>
                    )}
                </div>
                <p className="text-xs text-slate-500 mb-3">{t('chart_filter_hint')}</p>
                <div className="flex items-end gap-1 h-24 pb-2">
                    {chartData.map((day, i) => (
                        <button
                            key={i}
                            onClick={() => day.count > 0 && handleChartClick(day.dateKey)}
                            className={`flex-1 flex flex-col items-center gap-1 transition-all ${filterDate === day.dateKey ? 'scale-110' : ''} ${day.count > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {day.count > 0 && (
                                <span className={`text-[10px] font-bold ${filterDate === day.dateKey ? 'text-orange-800' : 'text-orange-600'}`}>{day.count}</span>
                            )}
                            <div
                                className={`w-full rounded-t-sm transition-all ${day.count > 0
                                    ? filterDate === day.dateKey
                                        ? 'bg-orange-600'
                                        : 'bg-orange-400 hover:bg-orange-500'
                                    : 'bg-slate-200'
                                    }`}
                                style={{ height: `${Math.max((day.count / maxCount) * 60, 4)}px` }}
                            />
                        </button>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-bold px-2">
                    <span>{t('time_days_ago_short', { count: 14 })}</span><span>{t('today')}</span>
                </div>
            </div>



            {/* Symptom Log */}
            <div>
                <h4 className="font-bold theme-text mb-3">
                    {t('symptom_log_title')} {filterDate ? `(${filterDate})` : t('symptom_log_last_14_days')}
                </h4>
                {Object.keys(displayedSymptoms).length === 0 ? (
                    <p className="text-slate-500 text-sm italic">{t('no_symptoms_recorded')}</p>
                ) : (
                    <div className="space-y-2">
                        {Object.entries(displayedSymptoms).map(([dateStr, logs]) => (
                            <div key={dateStr} className="border rounded-xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleDate(dateStr)}
                                    className="w-full flex items-center justify-between p-3 theme-card-secondary hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-bold theme-text">{dateStr}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{logs?.length || 0} {t('symptoms_count_label')}</span>
                                        {expandedDates[dateStr] ? (
                                            <ChevronUp className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                </button>

                                {expandedDates[dateStr] && logs && (
                                    <ul className="divide-y border-t bg-white">
                                        {logs.map((log: SymptomLog & { dateObj: Date }, i: number) => {
                                            const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || { icon: AlertCircle, label: t('unknown') };
                                            const SymptomIcon = symptomDef.icon || AlertCircle;
                                            const timeStr = log.dateObj.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

                                            return (
                                                <li key={i} className="flex flex-col gap-1 text-sm p-3">
                                                    <div className="flex items-center gap-3">
                                                        <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                        <span className="font-medium theme-text">{log.label}</span>
                                                        <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                    </div>
                                                    {log.bodyLocation && (
                                                        <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                            <div>📍 {t('location_prefix')}: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                            {log.bodyLocation.severity && (
                                                                <div>📊 {t('intensity_prefix')}: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
