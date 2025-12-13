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
import { ThinkingOfYouButton, ThinkingOfYouIconButton } from './ThinkingOfYou';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
import { TabNavigation } from './TabNavigation';
import { FEATURES } from '../config/features';

export const RelativeView = ({
    tasks, profile, lastCheckIn, symptomLogs, onAddTask, familyStatus,
    onFamilyStatusChange, onSendPing, weeklyAnswers, onWeeklyAnswer,
    helpOffers, helpRequests, onOpenSettings, userName = 'Pårørende', seniorName = 'Mor'
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
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
            {/* Header with ping button */}
            <header className="p-4 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                            {userName?.charAt(0) || 'P'}
                        </div>
                        <span className="font-semibold text-stone-700">Hej, {userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                        <Button variant="ghost" size="small" aria-label="Indstillinger" onClick={onOpenSettings}><Settings className="w-5 h-5" /></Button>
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

                {/* Peace of Mind Status Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-teal-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-teal-100 rounded-full overflow-hidden flex items-center justify-center">
                                <User className="w-7 h-7 text-teal-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-800">{profile.name}</h2>
                                <div className="flex items-center gap-1 text-sm text-stone-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Sidst tjekket ind: {lastCheckIn || 'Ingen endnu'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                            Alt er vel
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Sidst Tjekket</p>
                            <div className="flex items-center gap-2 text-stone-800">
                                <Clock className="w-4 h-4 text-teal-500" />
                                <span className="font-semibold">{lastCheckIn || 'Venter...'}</span>
                            </div>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-1">Medicin</p>
                            <div className="flex items-center gap-2 text-stone-800">
                                <Pill className="w-4 h-4 text-teal-500" />
                                <span className="font-semibold">{completionRate}% taget</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Symptom Alerts */}
                {symptomLogs.length > 0 && (
                    <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4">
                        <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5" />
                            Nye symptomer registreret
                        </h4>
                        <div className="space-y-2">
                            {symptomLogs.map((log, i) => (
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

                {/* Open Tasks */}
                {openTasks.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1">Åbne opgaver ({openTasks.length})</h3>
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
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-2">Overholdelse af medicin (7 dage)</h4>
                        <div className="flex items-end gap-2 h-24 pb-2">
                            {[80, 90, 100, 85, 95, 100, completionRate].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Man</span><span>...</span><span>I dag</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-2">Symptom Log</h4>
                        {symptomLogs.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">Ingen symptomer registreret denne uge.</p>
                        ) : (
                            <ul className="space-y-2">
                                {symptomLogs.map((log, i) => (
                                    <li key={i} className="flex flex-col gap-1 text-sm p-3 bg-white border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <log.icon className="w-5 h-5 text-slate-400" />
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
                                ))}
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
