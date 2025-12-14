import React, { useState } from 'react';
import {
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp, CheckCircle,
    AlertCircle, Heart, HandHeart, X
} from 'lucide-react';
import { Button } from './ui/Button';
import { SymptomSummary } from './SymptomSummary';
import { StatusSelector, STATUS_OPTIONS } from './FamilyStatusCard';
import { MatchBanner } from './MatchCelebration';
import { RELATIVE_OFFERS, RELATIVE_REQUESTS } from '../config/helpExchangeConfig';
import { useHelpExchangeMatch } from '../hooks/useHelpExchangeMatch';

// Coordination Tab - practical management focused
// Shows: Your status, HelpExchange (bidirectional), tasks, symptom details
export const CoordinationTab = ({
    seniorName,
    userName,
    myStatus = 'home',
    onMyStatusChange,
    helpOffers = [],
    helpRequests = [],
    relativeOffers = [],
    relativeRequests = [],
    onAddRelativeOffer,
    onRemoveRelativeOffer,
    onAddRelativeRequest,
    onRemoveRelativeRequest,
    openTasks = [],
    completedTasks = [],
    symptomLogs = [],
    onAddTask,
    onViewReport,
    onMatchAction
}) => {
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(true);
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === myStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    // Combine all offers and requests for match detection
    const allOffers = [
        ...helpOffers.map(o => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map(o => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map(r => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map(r => ({ ...r, createdByRole: 'relative' }))
    ];

    // Detect matches
    const { topMatch, hasMatches } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: myStatus
    });

    return (
        <div className="space-y-4">
            {/* Match Celebration Banner */}
            {hasMatches && topMatch && (
                <MatchBanner
                    match={topMatch}
                    onClick={() => onMatchAction?.(topMatch)}
                />
            )}

            {/* Your Status - visible to senior */}
            <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-wider">Din status hos {seniorName}</h3>
                    <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs">Synlig</span>
                </div>

                {showStatusPicker ? (
                    <div className="bg-white/10 rounded-xl p-3">
                        <StatusSelector
                            currentStatus={myStatus}
                            onStatusChange={(newStatus) => {
                                onMyStatusChange(newStatus);
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

            {/* Bidirectional Help Exchange */}
            <div className="bg-stone-50 border-2 border-stone-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-teal-600" />
                    Familie-udveksling
                </h3>

                {/* Senior's offers/requests - show with creator name */}
                {(helpOffers.length > 0 || helpRequests.length > 0) && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-stone-500 uppercase">Fra {seniorName}:</p>
                        <div className="flex flex-wrap gap-2">
                            {helpOffers.map((offer, i) => (
                                <span key={`so-${i}`} className="text-sm bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName || seniorName}`}>
                                    💚 {offer.label}
                                </span>
                            ))}
                            {helpRequests.map((req, i) => (
                                <span key={`sr-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName || seniorName}`}>
                                    💜 {req.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Relative's offers */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du tilbyder:</p>
                    <div className="flex flex-wrap gap-2">
                        {relativeOffers.map((offer, i) => (
                            <span
                                key={`ro-${i}`}
                                className="text-sm bg-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1"
                            >
                                {offer.emoji || '✨'} {offer.label}
                                <button
                                    onClick={() => onRemoveRelativeOffer?.(offer.docId)}
                                    className="ml-1 hover:bg-teal-600 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={() => setShowOfferPicker(!showOfferPicker)}
                            className="text-sm bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full border-2 border-dashed border-teal-200 hover:bg-teal-100 transition-colors"
                        >
                            + Tilbyd noget
                        </button>
                    </div>

                    {/* Offer picker */}
                    {showOfferPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Vælg hvad du kan tilbyde:</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_OFFERS.filter(o => !relativeOffers.some(ro => ro.id === o.id)).map(offer => (
                                    <button
                                        key={offer.id}
                                        onClick={() => {
                                            onAddRelativeOffer?.(offer);
                                            setShowOfferPicker(false);
                                        }}
                                        className="text-sm bg-stone-100 hover:bg-teal-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {offer.emoji} {offer.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Relative's requests */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du ønsker:</p>
                    <div className="flex flex-wrap gap-2">
                        {relativeRequests.map((req, i) => (
                            <span
                                key={`rr-${i}`}
                                className="text-sm bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1"
                            >
                                {req.emoji || '💜'} {req.label}
                                <button
                                    onClick={() => onRemoveRelativeRequest?.(req.docId)}
                                    className="ml-1 hover:bg-indigo-600 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={() => setShowRequestPicker(!showRequestPicker)}
                            className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                            + Bed om noget
                        </button>
                    </div>

                    {/* Request picker */}
                    {showRequestPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Hvad kunne du bruge hjælp til?</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_REQUESTS.filter(r => !relativeRequests.some(rr => rr.id === r.id)).map(request => (
                                    <button
                                        key={request.id}
                                        onClick={() => {
                                            onAddRelativeRequest?.(request);
                                            setShowRequestPicker(false);
                                        }}
                                        className="text-sm bg-stone-100 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {request.emoji} {request.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
