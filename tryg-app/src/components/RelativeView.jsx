import React, { useState } from 'react';
import {
    Clock,
    Settings,
    User,
    Activity,
    Plus,
    Pill,
    FileText,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    CheckCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { StatusSelector, STATUS_OPTIONS } from './FamilyStatusCard';
import { SeniorStatusCard } from './SeniorStatusCard';
import { ThinkingOfYouButton, ThinkingOfYouIconButton } from './ThinkingOfYou';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
import { TabNavigation } from './TabNavigation';
import { SymptomSummary } from './SymptomSummary';
import { FEATURES } from '../config/features';
import { SYMPTOMS_LIST } from '../data/constants';

export const RelativeView = ({
    tasks, profile, lastCheckIn, symptomLogs, onAddTask, familyStatus,
    onFamilyStatusChange, onSendPing, weeklyAnswers, onWeeklyAnswer,
    helpOffers, helpRequests, onOpenSettings, userName = 'Pårørende', seniorName = 'Mor'
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(true);  // Collapsible symptoms
    const [showOpenTasks, setShowOpenTasks] = useState(true); // Collapsible open tasks
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' = Oversigt, 'family' = Familie

    const openTasks = tasks.filter(t => !t.completed);
    const completedTasksList = tasks.filter(t => t.completed);

    const completionRate = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

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

    // Get current status info
    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === familyStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header with ping button - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {userName?.charAt(0) || 'P'}
                        </div>
                        <span className="font-semibold text-stone-700 text-sm">Hej, {userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Weekly Question widget on Family tab */}
                        {FEATURES.weeklyQuestion && activeTab === 'family' && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        {/* Compact ping button in header */}
                        {FEATURES.thinkingOfYou && (
                            <ThinkingOfYouIconButton onSendPing={onSendPing} />
                        )}
                        <Button variant="ghost" size="small" aria-label="Indstillinger" onClick={onOpenSettings}><Settings className="w-4 h-4" /></Button>
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-6 overflow-y-auto pb-24">

                {/* Tab Navigation - only show if tabbedLayout enabled */}
                {FEATURES.tabbedLayout && (
                    <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                )}

                {/* ===== DAILY/OVERVIEW TAB ===== */}
                {(!FEATURES.tabbedLayout || activeTab === 'daily') && (
                    <>
                        {/* Reciprocity Feature: Status Sharing - Now with picker */}
                        <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-wider">Din status hos mor</h3>
                                <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">Synlig for {seniorName}</span>
                            </div>

                            {showStatusPicker ? (
                                <div className="bg-white/10 rounded-xl p-3">
                                    <StatusSelector
                                        currentStatus={familyStatus}
                                        onStatusChange={(newStatus) => {
                                            onFamilyStatusChange(newStatus);
                                            setShowStatusPicker(false);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3" onClick={() => setShowStatusPicker(true)}>
                                    <div className="p-2 bg-indigo-500 rounded-lg">
                                        <StatusIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{currentStatusInfo.label}</p>
                                        <p className="text-indigo-200 text-xs">Tryk for at ændre</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ===== FAMILY TAB ===== */}
                {(!FEATURES.tabbedLayout || activeTab === 'family') && (
                    <>
                        {/* Weekly Question now in header widget - removed from here */}

                        {/* Show active help offers/requests from senior */}
                        {(helpOffers?.length > 0 || helpRequests?.length > 0) && (
                            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                                <h4 className="text-teal-700 font-bold mb-2">Fra mor:</h4>
                                <div className="space-y-2 text-sm">
                                    {helpOffers?.map((offer, i) => (
                                        <div key={`o-${i}`} className="text-teal-600">
                                            💚 {offer.label}
                                        </div>
                                    ))}
                                    {helpRequests?.map((req, i) => (
                                        <div key={`r-${i}`} className="text-indigo-600">
                                            💜 {req.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Peace of Mind Status Card - Modular Component */}
                <SeniorStatusCard
                    seniorName={profile.name}
                    lastCheckIn={lastCheckIn}
                    completionRate={completionRate}
                />

                {/* Symptom Summary - Collapsible */}
                {symptomLogs.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowSymptoms(!showSymptoms)}
                            className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                        >
                            <span>Symptomer ({symptomLogs.length})</span>
                            {showSymptoms ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>
                        {showSymptoms && (
                            <SymptomSummary
                                symptomLogs={symptomLogs}
                                onViewReport={() => setShowReport(true)}
                            />
                        )}
                    </div>
                )}

                {/* Open Tasks - Collapsible */}
                {openTasks.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowOpenTasks(!showOpenTasks)}
                            className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                        >
                            <span>Åbne opgaver ({openTasks.length})</span>
                            {showOpenTasks ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>
                        {showOpenTasks && (
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-stone-100 overflow-hidden">
                                {openTasks.map((task, idx) => (
                                    <div key={task.id} className={`p-4 flex items-center gap-4 ${idx !== openTasks.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                            {task.type === 'medication' ? <Pill className="w-5 h-5" /> :
                                                task.type === 'appointment' ? <Clock className="w-5 h-5" /> :
                                                    <Activity className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-stone-700">{task.title}</p>
                                            <p className="text-xs text-stone-500">{task.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Completed Tasks - Collapsible */}
                {completedTasksList.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                            className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors mb-3"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-teal-600" />
                                <span className="font-bold text-teal-800">Udførte opgaver ({completedTasksList.length})</span>
                            </div>
                            {showCompletedTasks ? <ChevronUp className="w-5 h-5 text-teal-600" /> : <ChevronDown className="w-5 h-5 text-teal-600" />}
                        </button>

                        {showCompletedTasks && (
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-stone-100 overflow-hidden">
                                {completedTasksList.map((task, idx) => (
                                    <div key={task.id} className={`p-4 flex items-center gap-4 ${idx !== completedTasksList.length - 1 ? 'border-b border-stone-100' : ''}`}>
                                        <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600">
                                            {task.type === 'medication' ? <Pill className="w-5 h-5" /> :
                                                task.type === 'appointment' ? <Clock className="w-5 h-5" /> :
                                                    <Activity className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-stone-500 line-through">{task.title}</p>
                                            <p className="text-xs text-stone-400">{task.description}</p>
                                        </div>
                                        <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">UDFØRT</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 bg-white" onClick={() => setShowAddModal(true)}>
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="w-6 h-6" />
                            <span className="text-sm">Tilføj påmindelse</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 bg-white" onClick={() => setShowReport(true)}>
                        <div className="flex flex-col items-center gap-2">
                            <FileText className="w-6 h-6" />
                            <span className="text-sm">Helbredsrapport</span>
                        </div>
                    </Button>
                </div>
            </main>

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
                                // Generate 14-day symptom counts
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
                                        className={`flex-1 rounded-t-sm transition-opacity ${count > 0 ? 'bg-orange-400 hover:bg-orange-500' : 'bg-slate-200'
                                            }`}
                                        style={{ height: `${Math.max((count / max) * 100, 5)}%` }}
                                        title={`${count} symptomer`}
                                    />
                                ));
                            })()}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-14 dage</span>
                            <span>I dag</span>
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
                                    // Lookup icon from SYMPTOMS_LIST by ID
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
        </div>
    );
};

export default RelativeView;
