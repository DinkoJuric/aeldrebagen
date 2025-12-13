import React, { useState } from 'react';
import {
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp, CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { SymptomSummary } from './SymptomSummary';
import { StatusSelector, STATUS_OPTIONS } from './FamilyStatusCard';

// Coordination Tab - practical management focused
// Shows: Your status, HelpExchange, tasks, symptom details
export const CoordinationTab = ({
    seniorName,
    userName,
    familyStatus,
    onFamilyStatusChange,
    helpOffers = [],
    helpRequests = [],
    openTasks = [],
    completedTasks = [],
    symptomLogs = [],
    onAddTask,
    onViewReport
}) => {
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(true);

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === familyStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    return (
        <div className="space-y-4">
            {/* Your Status - visible to senior */}
            <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-wider">Din status hos {seniorName}</h3>
                    <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">Synlig</span>
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
                    <button
                        onClick={() => setShowStatusPicker(true)}
                        className="w-full flex items-center gap-3 hover:bg-indigo-500/30 rounded-lg p-2 -m-2 transition-colors"
                    >
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-bold">{currentStatusInfo.label}</p>
                            <p className="text-indigo-200 text-xs">Tryk for at ændre</p>
                        </div>
                    </button>
                )}
            </div>

            {/* Help Exchange - from senior */}
            {(helpOffers.length > 0 || helpRequests.length > 0) && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h4 className="text-teal-700 font-bold mb-2">Fra {seniorName}:</h4>
                    <div className="space-y-2 text-sm">
                        {helpOffers.map((offer, i) => (
                            <div key={`o-${i}`} className="text-teal-600 bg-white/60 px-3 py-2 rounded-lg">
                                💚 {offer.label}
                            </div>
                        ))}
                        {helpRequests.map((req, i) => (
                            <div key={`r-${i}`} className="text-indigo-600 bg-white/60 px-3 py-2 rounded-lg">
                                💜 {req.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Symptoms - Collapsible */}
            {symptomLogs.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowSymptoms(!showSymptoms)}
                        className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                    >
                        <span className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            Symptomer ({symptomLogs.length})
                        </span>
                        {showSymptoms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showSymptoms && (
                        <SymptomSummary symptomLogs={symptomLogs} onViewReport={onViewReport} />
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
                        {showOpenTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
            {completedTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors mb-3"
                    >
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-teal-600" />
                            <span className="font-bold text-teal-800">Udførte opgaver ({completedTasks.length})</span>
                        </div>
                        {showCompleted ? <ChevronUp className="w-5 h-5 text-teal-600" /> : <ChevronDown className="w-5 h-5 text-teal-600" />}
                    </button>

                    {showCompleted && (
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-stone-100 overflow-hidden">
                            {completedTasks.map((task, idx) => (
                                <div key={task.id} className={`p-4 flex items-center gap-4 ${idx !== completedTasks.length - 1 ? 'border-b border-stone-100' : ''}`}>
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

            {/* Add Task Button */}
            <Button
                variant="outline"
                className="w-full h-auto py-4 bg-white"
                onClick={onAddTask}
            >
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Tilføj påmindelse til {seniorName}</span>
                </div>
            </Button>
        </div>
    );
};

export default CoordinationTab;
