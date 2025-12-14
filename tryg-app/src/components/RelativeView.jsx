import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
import { RelativeBottomNavigation } from './RelativeBottomNavigation';
import { PeaceOfMindTab } from './PeaceOfMindTab';
import { CoordinationTab } from './CoordinationTab';
import { MatchCelebration } from './MatchCelebration';
import { FEATURES } from '../config/features';
import { SYMPTOMS_LIST } from '../data/constants';
import { AlertCircle } from 'lucide-react';

export const RelativeView = ({
    tasks, profile, lastCheckIn, symptomLogs, onAddTask,
    myStatus = 'home', onMyStatusChange,
    onSendPing, weeklyAnswers, onWeeklyAnswer,
    helpOffers, helpRequests,
    relativeOffers = [], relativeRequests = [],
    onAddRelativeOffer, onRemoveRelativeOffer, onAddRelativeRequest, onRemoveRelativeRequest,
    onOpenSettings, userName = 'Pårørende', seniorName = 'Mor'
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' = Peace of Mind, 'family' = Coordination
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

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask({
            title: newTaskTitle.trim(),
            time: '14:00',
            type: 'appointment',
            description: `Tilføjet af ${userName}`,
            period: 'eftermiddag'
        });
        setNewTaskTitle('');
        setShowAddModal(false);
    };

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {userName?.charAt(0) || 'P'}
                        </div>
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
                {activeTab === 'daily' ? (
                    <PeaceOfMindTab
                        seniorName={seniorName}
                        lastCheckIn={lastCheckIn}
                        tasks={tasks}
                        symptomCount={todaySymptomCount}
                        onSendPing={onSendPing}
                        recentActivity={[]} // TODO: Build activity feed from pings, tasks, etc.
                    />
                ) : (
                    <CoordinationTab
                        seniorName={seniorName}
                        userName={userName}
                        myStatus={myStatus}
                        onMyStatusChange={onMyStatusChange}
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
                    />
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
                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        Denne påmindelse vil straks dukke op på {seniorName}s skærm.
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>Tilføj</Button>
                </div>
            </Modal>

            {/* Doctor Report Modal */}
            <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport til Lægen">
                <div className="space-y-6">
                    {/* 14-day symptom overview chart */}
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <h4 className="font-bold text-slate-800 mb-2">Symptom-oversigt (14 dage)</h4>
                        <div className="flex items-end gap-1 h-20 pb-2">
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
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-sm transition-opacity ${count > 0 ? 'bg-orange-400 hover:bg-orange-500' : 'bg-slate-200'}`}
                                        style={{ height: `${Math.max((count / max) * 100, 5)}%` }}
                                        title={`${count} symptomer`}
                                    />
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-14 dage</span><span>I dag</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">Overholdelse af medicin (7 dage)</h4>
                        <div className="flex items-end gap-2 h-20 pb-2">
                            {[80, 90, 100, 85, 95, 100, completionRate].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-7 dage</span><span>I dag</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-2">Symptom Log</h4>
                        {symptomLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">Ingen symptomer registreret denne uge.</p>
                        ) : (
                            <ul className="space-y-2">
                                {symptomLogs.map((log, i) => {
                                    const symptomDef = SYMPTOMS_LIST.find(s => s.id === log.id) || {};
                                    const SymptomIcon = symptomDef.icon || AlertCircle;

                                    return (
                                        <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <SymptomIcon className="w-5 h-5 text-slate-400" />
                                                <span className="font-medium text-slate-700">{log.label}</span>
                                                <span className="text-slate-400 ml-auto">{log.time}</span>
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
                        console.log('Match action:', action);
                        // TODO: Implement specific actions (call, plan, etc.)
                        setActiveMatch(null);
                    }}
                />
            )}
        </div>
    );
};

export default RelativeView;
