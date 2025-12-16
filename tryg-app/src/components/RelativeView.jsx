import React, { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
import { RelativeBottomNavigation } from './RelativeBottomNavigation';
import { PeaceOfMindTab } from './PeaceOfMindTab';
import { CoordinationTab } from './CoordinationTab';
import { MatchCelebration } from './MatchCelebration';
import { Spillehjoernet } from './Spillehjoernet';
import { FEATURES } from '../config/features';
import { SYMPTOMS_LIST } from '../data/constants';
import { AlertCircle } from 'lucide-react';
import { Avatar } from './ui/Avatar';

export const RelativeView = ({
    tasks, profile, lastCheckIn, symptomLogs, onAddTask,
    myStatus = 'home', onMyStatusChange,
    memberStatuses = [], currentUserId = null,
    onSendPing, weeklyAnswers, onWeeklyAnswer,
    helpOffers, helpRequests,
    relativeOffers = [], relativeRequests = [],
    onAddRelativeOffer, onRemoveRelativeOffer, onAddRelativeRequest, onRemoveRelativeRequest,
    onOpenSettings, userName = 'Pårørende', seniorName = 'Mor', careCircleId = null
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen'); // Period selector for new tasks
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' = Peace of Mind, 'family' = Coordination, 'spil' = Gaming
    const [activeMatch, setActiveMatch] = useState(null);

    const openTasks = tasks.filter(t => !t.completed);
    const completedTasksList = tasks.filter(t => t.completed);

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

    // Count today's symptoms
    const todaySymptomCount = symptomLogs.filter(s => {
        const date = s.loggedAt?.toDate ? s.loggedAt.toDate() : new Date(s.loggedAt);
        return date.toDateString() === new Date().toDateString();
    }).length;

    // Period to time mapping
    const PERIOD_TIMES = {
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
            period: newTaskPeriod
        });
        setNewTaskTitle('');
        setNewTaskPeriod('morgen');
        setShowAddModal(false);
    };

    // Generate activity feed from tasks and symptoms
    const recentActivity = useMemo(() => {
        const activities = [];

        // Add completed tasks
        tasks.filter(t => t.completed && t.completedAt).forEach(t => {
            activities.push({
                type: 'task',
                timestamp: t.completedAt?.toDate ? t.completedAt.toDate() : new Date(t.completedAt),
                text: `Udført: ${t.title}`,
                emoji: '✅'
            });
        });

        // Add symptoms
        symptomLogs.forEach(s => {
            activities.push({
                type: 'symptom',
                timestamp: s.loggedAt?.toDate ? s.loggedAt.toDate() : new Date(s.loggedAt),
                text: `Symptom: ${s.label || s.type || 'Ukendt'}`,
                emoji: '🩺'
            });
        });

        // Sort by time (newest first)
        return activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5)
            .map(a => ({
                ...a,
                time: a.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
    }, [tasks, symptomLogs]);

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar
                            id={(userName.includes('Fatima') || userName === 'Test User') ? 'fatima' : userName === 'Brad' ? 'brad' : 'louise'}
                            size="md"
                            className="bg-indigo-50"
                        />
                        <span className="font-semibold text-stone-700 text-sm">Hej, {userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Weekly Question widget */}
                        {FEATURES.weeklyQuestion && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        <button
                            onClick={onOpenSettings}
                            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                            aria-label="Indstillinger"
                        >
                            <Settings className="w-5 h-5 text-stone-500" />
                        </button>
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
                        onSendPing={onSendPing}
                        onViewSymptoms={() => setActiveTab('family')}
                        recentActivity={recentActivity}
                    />
                )}

                {/* ===== FAMILY TAB ===== */}
                {activeTab === 'family' && (
                    <CoordinationTab
                        seniorName={seniorName}
                        userName={userName}
                        myStatus={myStatus}
                        onMyStatusChange={onMyStatusChange}
                        memberStatuses={memberStatuses}
                        currentUserId={currentUserId}
                        helpOffers={helpOffers}
                        helpRequests={helpRequests}
                        relativeOffers={relativeOffers}
                        relativeRequests={relativeRequests}
                        onAddRelativeOffer={onAddRelativeOffer}
                        onRemoveRelativeOffer={onRemoveRelativeOffer}
                        onAddRelativeRequest={onAddRelativeRequest}
                        onRemoveRelativeRequest={onRemoveRelativeRequest}
                        openTasks={openTasks}
                        completedTasks={completedTasksList}
                        symptomLogs={symptomLogs}
                        onAddTask={() => setShowAddModal(true)}
                        onViewReport={() => setShowReport(true)}
                        onMatchAction={(match) => setActiveMatch(match)}
                        careCircleId={careCircleId}
                    />
                )}

                {/* ===== SPIL TAB ===== */}
                {activeTab === 'spil' && (
                    <>
                        {FEATURES.spillehjoernet && (
                            <Spillehjoernet
                                circleId={careCircleId}
                                userId={currentUserId}
                                displayName={userName}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            <RelativeBottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onShowReport={() => setShowReport(true)}
            />

            {/* Add Task Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ny påmindelse">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Titel</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="F.eks. Lægebesøg"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hvornår?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'morgen', label: 'Morgen', time: '8-11', emoji: '☀️' },
                                { id: 'frokost', label: 'Frokost', time: '12-13', emoji: '🍽️' },
                                { id: 'eftermiddag', label: 'Eftermiddag', time: '14-17', emoji: '🌤️' },
                                { id: 'aften', label: 'Aften', time: '18-21', emoji: '🌙' }
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

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        Denne påmindelse vil straks dukke op på {seniorName}s skærm.
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>Tilføj</Button>
                </div>
            </Modal>

            {/* Doctor Report Modal */}
            <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport til Lægen">
                <div className="space-y-6">
                    {/* Summary Stats */}
                    {(() => {
                        const totalSymptoms = symptomLogs.length;
                        const symptomCounts = {};
                        symptomLogs.forEach(log => {
                            symptomCounts[log.label] = (symptomCounts[log.label] || 0) + 1;
                        });
                        const mostCommon = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

                        return totalSymptoms > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                                    <p className="text-2xl font-bold text-orange-600">{totalSymptoms}</p>
                                    <p className="text-xs text-orange-500">Symptomer (14 dage)</p>
                                </div>
                                {mostCommon && (
                                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                        <p className="text-lg font-bold text-purple-600 truncate">{mostCommon[0]}</p>
                                        <p className="text-xs text-purple-500">Mest hyppige ({mostCommon[1]}x)</p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* 14-day symptom overview chart with counts */}
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <h4 className="font-bold text-slate-800 mb-2">Symptom-oversigt (14 dage)</h4>
                        <div className="flex items-end gap-1 h-24 pb-2">
                            {(() => {
                                const days = Array(14).fill(0);
                                symptomLogs.forEach(log => {
                                    const date = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt);
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
                                            title={`${count} symptomer`}
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-14 dage</span><span>I dag</span>
                        </div>
                    </div>

                    {/* Medicine compliance with percentage labels */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">Overholdelse af medicin (7 dage)</h4>
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
                            <span>-7 dage</span><span>I dag</span>
                        </div>
                    </div>

                    {/* Symptom Log - Grouped by Date */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3">Symptom Log (sidste 14 dage)</h4>
                        {symptomLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">Ingen symptomer registreret.</p>
                        ) : (
                            (() => {
                                // Group symptoms by date
                                const grouped = {};
                                symptomLogs.forEach(log => {
                                    const date = log.loggedAt?.toDate ? log.loggedAt.toDate() : new Date(log.loggedAt);
                                    const dateKey = date.toLocaleDateString('da-DK', { weekday: 'short', day: 'numeric', month: 'short' });
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
                                                        const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || {};
                                                        const SymptomIcon = symptomDef.icon || AlertCircle;
                                                        const timeStr = log.dateObj.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });

                                                        return (
                                                            <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white border rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                                    <span className="font-medium text-slate-700">{log.label}</span>
                                                                    <span className="text-slate-400 ml-auto">{timeStr}</span>
                                                                </div>
                                                                {log.bodyLocation && (
                                                                    <div className="ml-8 text-xs text-slate-500 space-y-1">
                                                                        <div>📍 Lokation: <span className="font-medium">{log.bodyLocation.emoji} {log.bodyLocation.label}</span></div>
                                                                        {log.bodyLocation.severity && (
                                                                            <div>📊 Intensitet: <span className="font-medium">{log.bodyLocation.severity.emoji} {log.bodyLocation.severity.label}</span></div>
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
                onAnswer={onWeeklyAnswer}
                userName={userName}
            />

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={seniorName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Create task based on action type
                        const { celebration, offer, request } = activeMatch;
                        let taskTitle = '';
                        let taskType = 'appointment';

                        switch (action) {
                            case 'call':
                                taskTitle = `📞 Ring til ${seniorName}`;
                                break;
                            case 'plan-visit':
                                taskTitle = `☕ Besøg hos ${seniorName}`;
                                break;
                            case 'plan-meal':
                                taskTitle = `🍳 Lav mad med ${seniorName}`;
                                break;
                            case 'plan-transport':
                                taskTitle = `🚗 Kør ${seniorName}`;
                                break;
                            case 'plan-garden':
                                taskTitle = `🌿 Havearbejde med ${seniorName}`;
                                break;
                            default:
                                taskTitle = celebration?.title || `Opgave med ${seniorName}`;
                        }

                        // Create the task
                        if (onAddTask && taskTitle) {
                            onAddTask({
                                title: taskTitle,
                                time: '10:00',
                                type: taskType,
                                createdBy: userName
                            });
                            console.log('Task created:', taskTitle);
                        }
                        setActiveMatch(null);
                    }}
                />
            )}
        </div>
    );
};

export default RelativeView;
