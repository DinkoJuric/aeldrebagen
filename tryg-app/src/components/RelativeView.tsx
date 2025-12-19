import React, { useState, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from '../features/weeklyQuestion';
import { ThinkingOfYouIconButton } from '../features/thinkingOfYou';
import { PeaceOfMindTab } from './PeaceOfMindTab';
import { CoordinationTab } from './CoordinationTab';
import { MatchCelebration } from '../features/helpExchange';
import { TimePickerModal } from '../features/tasks';
import { Spillehjoernet } from '../features/wordGame';
import { FEATURES } from '../config/features';
import { SYMPTOMS_LIST } from '../data/constants';
import { AlertCircle } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';
import { useTranslation } from 'react-i18next';

export interface RelativeViewProps {
    tasks: Task[];
    lastCheckIn?: any;
    symptomLogs: SymptomLog[];
    onAddTask: (task: Partial<Task>) => void;
    myStatus?: string;
    onMyStatusChange?: (status: string) => void;
    memberStatuses?: any[];
    currentUserId?: string | null;
    onSendPing: (type: string) => void;
    weeklyAnswers: any[];
    onWeeklyAnswer: (answer: string) => void;
    userName: string;
    seniorName: string;
    careCircleId: any;
    onToggleLike?: (answerId: string, userId: string, isLiked: boolean) => void;
    onReply?: (answerId: string, reply: any) => void;
    activeTab: 'daily' | 'family' | 'spil';
    onTabChange: (tab: 'daily' | 'family' | 'spil') => void;
}

export const RelativeView: React.FC<RelativeViewProps> = ({
    tasks, lastCheckIn, symptomLogs, onAddTask,
    myStatus = 'home', onMyStatusChange,
    memberStatuses = [], currentUserId = null,
    onSendPing, weeklyAnswers, onWeeklyAnswer, onToggleLike, onReply,
    userName = 'Pårørende', seniorName = 'Mor', careCircleId = null,
    activeTab, onTabChange
}) => {
    const { t } = useTranslation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen'); // Period selector for new tasks
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);
    const [activeMatch, setActiveMatch] = useState<any | null>(null); // 
    const [pendingAction, setPendingAction] = useState<any | null>(null); // Stores action info for time picker
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dismissedMatchIds, setDismissedMatchIds] = useState<Set<string>>(new Set()); // Track dismissed matches

    const openTasks = tasks.filter(t => !t.completed);
    const completedTasksList = tasks.filter(t => t.completed);

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

    // Count today's symptoms
    const todaySymptomCount = symptomLogs.filter(s => {
        const date = (s.loggedAt as any)?.toDate ? (s.loggedAt as any).toDate() : new Date(s.loggedAt as any);
        return date.toDateString() === new Date().toDateString();
    }).length;

    // Period to time mapping
    const PERIOD_TIMES: Record<string, string> = {
        morgen: '08:00',
        frokost: '12:00',
        eftermiddag: '14:00',
        aften: '19:00'
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask({
            title: newTaskTitle.trim(),
            time: PERIOD_TIMES[newTaskPeriod],
            type: 'appointment',
            description: `Tilføjet af ${userName}`,
            period: newTaskPeriod,
            recurring: newTaskRecurring
        });
        setNewTaskTitle('');
        setNewTaskPeriod('morgen');
        setNewTaskRecurring(false);
        setShowAddModal(false);
    };

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
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header - COMPACT (uses theme-aware classes for dark mode) */}
            <header className="px-4 py-2 theme-header shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar
                            id={(userName.includes('Fatima') || userName === 'Test User') ? 'fatima' : userName === 'Brad' ? 'brad' : 'louise'}
                            size="md"
                            className="bg-indigo-50"
                        />
                        <span className="font-semibold theme-text text-sm">{t('greeting_relative', { name: userName })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Weekly Question widget + Thinking of You */}
                        {FEATURES.weeklyQuestion && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        <ThinkingOfYouIconButton onSendPing={() => onSendPing('thinking_of_you')} />
                    </div>
                </div>
            </header>

            {/* Main Content - Tab based */}
            <main className="flex-1 p-4 overflow-y-auto pb-28">
                {/* ===== DAILY TAB ===== */}
                {activeTab === 'daily' && (
                    <PeaceOfMindTab
                        seniorName={seniorName}
                        lastCheckIn={lastCheckIn}
                        tasks={tasks}
                        symptomCount={todaySymptomCount}
                        onSendPing={() => onSendPing('thinking_of_you')}
                        onViewSymptoms={() => onTabChange('family')}
                        recentActivity={recentActivity}
                    />
                )}

                {/* ===== FAMILY TAB ===== */}
                {activeTab === 'family' && (
                    <CoordinationTab
                        seniorName={seniorName}
                        userName={userName}
                        myStatus={myStatus || undefined}
                        onMyStatusChange={onMyStatusChange}
                        memberStatuses={memberStatuses}
                        currentUserId={currentUserId || undefined}
                        // HelpExchange props removed - now fetched internally
                        openTasks={openTasks}
                        completedTasks={completedTasksList}
                        symptomLogs={symptomLogs}
                        onAddTask={() => setShowAddModal(true)}
                        onViewReport={() => setShowReport(true)}
                        onMatchAction={(match) => setActiveMatch(match)}
                        onDismissMatch={(matchId) => {
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }}
                        dismissedMatchIds={dismissedMatchIds as Set<string>}
                        careCircleId={careCircleId}
                    />
                )}

                {/* ===== SPIL TAB ===== */}
                {activeTab === 'spil' && (
                    <div className="tab-content">
                        {FEATURES.spillehjoernet && (
                            <Spillehjoernet
                                circleId={careCircleId || undefined}
                                userId={currentUserId || undefined}
                                displayName={userName || 'User'}
                            />
                        )}
                    </div>
                )}
            </main>

            {/* Add Task Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('new_reminder')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('title_label')}</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder={t('reminder_placeholder')}
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'morgen', label: t('morning'), time: '08-11', emoji: '🌅' },
                                { id: 'frokost', label: t('lunch'), time: '12-13', emoji: '☀️' },
                                { id: 'eftermiddag', label: t('afternoon'), time: '14-17', emoji: '☕' },
                                { id: 'aften', label: t('evening'), time: '18-21', emoji: '🌙' }
                            ].map(period => (
                                <button
                                    key={period.id}
                                    onClick={() => setNewTaskPeriod(period.id)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${newTaskPeriod === period.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <span className="text-lg mr-1">{period.emoji}</span>
                                    <span className="font-medium">{period.label}</span>
                                    <span className="text-xs text-slate-500 block">{period.time}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
                        <input
                            type="checkbox"
                            id="recurring-relative"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="recurring-relative" className="flex-1 font-medium text-indigo-700 cursor-pointer">
                            {t('recurring')}
                        </label>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        {t('reminder_notice', { name: seniorName })}
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>{t('add_button')}</Button>
                </div>
            </Modal>

            {/* Doctor Report Modal */}
            <Modal isOpen={showReport} onClose={() => setShowReport(false)} title={t('doctor_report_title')}>
                <div className="space-y-6">
                    {/* Summary Stats */}
                    {(() => {
                        const totalSymptoms = symptomLogs.length;
                        const symptomCounts: Record<string, number> = {};
                        symptomLogs.forEach(log => {
                            const key = log.label || log.type || 'unknown';
                            symptomCounts[key] = (symptomCounts[key] || 0) + 1;
                        });
                        const mostCommon = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

                        return totalSymptoms > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                                    <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                                    <p className="text-xs text-orange-500">{t('symptoms_14_days')}</p>
                                </div>
                                {mostCommon && (
                                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                        <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                                        <p className="text-xs text-purple-500">{t('most_frequent_count', { count: mostCommon[1] })}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* 14-day symptom overview chart with counts */}
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <h4 className="font-bold text-slate-800 mb-2">{t('symptom_overview_14_days')}</h4>
                        <div className="flex items-end gap-1 h-24 pb-2">
                            {(() => {
                                const days = Array(14).fill(0);
                                symptomLogs.forEach(log => {
                                    const date = (log.loggedAt as any)?.toDate ? (log.loggedAt as any).toDate() : new Date(log.loggedAt as any);
                                    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
                                    if (daysAgo >= 0 && daysAgo < 14) {
                                        days[13 - daysAgo]++;
                                    }
                                });
                                const max = Math.max(...days, 1);
                                return days.map((count, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        {count > 0 && (
                                            <span className="text-[10px] font-bold text-orange-600">{count}</span>
                                        )}
                                        <div
                                            className={`w-full rounded-t-sm transition-opacity ${count > 0 ? 'bg-orange-400 hover:bg-orange-500' : 'bg-slate-200'}`}
                                            style={{ height: `${Math.max((count / max) * 60, 4)}px` }}
                                            title={t('symptoms_count', { count })}
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>{t('days_ago', { count: 14 })}</span><span>{t('today')}</span>
                        </div>
                    </div>

                    {/* Medicine compliance with percentage labels */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">{t('medicine_compliance_7_days')}</h4>
                        <div className="flex items-end gap-2 h-28 pb-2">
                            {[80, 90, 100, 85, 95, 100, completionRate].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold text-indigo-600">{h}%</span>
                                    <div
                                        className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ height: `${h * 0.6}px` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>{t('days_ago', { count: 7 })}</span><span>{t('today')}</span>
                        </div>
                    </div>

                    {/* Symptom Log - Grouped by Date */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3">{t('symptom_log_14_days')}</h4>
                        {symptomLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">{t('no_symptoms_registered')}</p>
                        ) : (
                            (() => {
                                // Group symptoms by date
                                const grouped: Record<string, any[]> = {};
                                symptomLogs.forEach(log => {
                                    const date = (log.loggedAt as any)?.toDate ? (log.loggedAt as any).toDate() : new Date(log.loggedAt as any);
                                    const dateKey = date.toLocaleDateString(t('locale_code'), { weekday: 'short', day: 'numeric', month: 'short' });
                                    if (!grouped[dateKey]) grouped[dateKey] = [];
                                    grouped[dateKey].push({ ...log, dateObj: date });
                                });

                                return (
                                    <div className="space-y-4">
                                        {Object.entries(grouped).map(([dateStr, logs]) => (
                                            <div key={dateStr}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase">{dateStr}</span>
                                                    <div className="h-px flex-1 bg-slate-200" />
                                                </div>
                                                <ul className="space-y-2">
                                                    {logs.map((log, i) => {
                                                        const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || {} as any;
                                                        const SymptomIcon = symptomDef.icon || AlertCircle;
                                                        const timeStr = log.dateObj.toLocaleTimeString(t('locale_code'), { hour: '2-digit', minute: '2-digit' });

                                                        return (
                                                            <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white border rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                                    <span className="font-medium text-slate-700">{log.label}</span>
                                                                    <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                                </div>
                                                                {log.bodyLocation && (
                                                                    <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                                        <div>📍 {t('location_label')}: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                                        {log.bodyLocation.severity && (
                                                                            <div>📊 {t('intensity_label')}: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
            </Modal>

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answer) => onWeeklyAnswer(answer.text || '')}
                userName={userName}
                onToggleLike={onToggleLike}
                onReply={onReply}
                currentUserId={currentUserId || undefined}
            />

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={seniorName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Store action info and open time picker
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = t('match_task_call_relative', { name: seniorName });
                                break;
                            case 'plan-visit':
                                taskTitle = t('match_task_visit_relative', { name: seniorName });
                                break;
                            case 'plan-meal':
                                taskTitle = t('match_task_meal', { name: seniorName });
                                break;
                            case 'plan-transport':
                                taskTitle = t('match_task_transport_relative', { name: seniorName });
                                break;
                            case 'plan-garden':
                                taskTitle = t('match_task_garden', { name: seniorName });
                                break;
                            default:
                                taskTitle = celebration?.title || t('match_task_default', { name: seniorName });
                        }

                        // Store pending action and show time picker
                        setPendingAction({
                            title: taskTitle,
                            action: action,
                            celebration: celebration,
                            matchToDissmiss: activeMatch // Store match for dismissal
                        });
                        setActiveMatch(null);
                        setShowTimePicker(true);
                    }}
                />
            )}

            {/* Time Picker Modal */}
            <TimePickerModal
                isOpen={showTimePicker}
                onClose={() => {
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
                title={t('when_question')}
                actionLabel={pendingAction?.title || t('create_task_label')}
                seniorName={seniorName}
                onConfirm={({ time, period }) => {
                    if (onAddTask && pendingAction) {
                        onAddTask({
                            title: pendingAction.title,
                            time: time,
                            period: period || 'morgen', // Include period for proper sorting
                            type: 'appointment',
                            description: `Tilføjet af ${userName}`,
                            createdByRole: 'relative'
                        });

                        // Dismiss the match so it doesn't reappear
                        if (pendingAction.matchToDissmiss) {
                            const match = pendingAction.matchToDissmiss;
                            const offerId = match.offer?.docId || match.offer?.id || 'none';
                            const requestId = match.request?.docId || match.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }

                        // Show confirmation to user
                        alert(`✅ Opgave oprettet: ${pendingAction.title} kl. ${time}`);
                    }
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
            />
        </div>
    );
};

export default RelativeView;
