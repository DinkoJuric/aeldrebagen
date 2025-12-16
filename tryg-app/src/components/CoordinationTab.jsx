import React, { useState } from 'react';
import {
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp, CheckCircle,
    AlertCircle, Heart, HandHeart, X
} from 'lucide-react';
import { Button } from './ui/Button';
import { SymptomSummary } from './SymptomSummary';
import { StatusSelector, STATUS_OPTIONS } from './FamilyStatusCard';
import { MatchBanner } from './MatchCelebration';
import { FamilyPresence } from './FamilyPresence';
import { RELATIVE_OFFERS, RELATIVE_REQUESTS } from '../config/helpExchangeConfig';
import { useHelpExchangeMatch } from '../hooks/useHelpExchangeMatch';
import { FEATURES } from '../config/features';
import { Spillehjoernet } from './Spillehjoernet';
import { useCareCircleContext } from '../contexts/CareCircleContext';

// Coordination Tab - practical management focused
// Shows: Family presence, Your status, HelpExchange (bidirectional), tasks, symptom details
// Uses CareCircleContext for shared data (props as optional overrides)
export const CoordinationTab = ({
    seniorName: propSeniorName,
    userName: propUserName,
    myStatus = 'home',
    onMyStatusChange,
    memberStatuses: propMemberStatuses,
    currentUserId: propCurrentUserId,
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
    onMatchAction,
    dismissedMatchIds = new Set(),
    careCircleId: propCareCircleId
}) => {
    // Get from context, use props as override
    const context = useCareCircleContext();
    const seniorName = propSeniorName ?? context.seniorName ?? 'Senior';
    const userName = propUserName ?? context.userName ?? 'Pårørende';
    const memberStatuses = propMemberStatuses ?? context.memberStatuses ?? [];
    const currentUserId = propCurrentUserId ?? context.currentUserId;
    const careCircleId = propCareCircleId ?? context.careCircleId;

    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(true);
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === myStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    // Split relative entries into "mine" vs "other relatives"
    const myRelativeOffers = relativeOffers.filter(o => o.createdByUid === currentUserId);
    const myRelativeRequests = relativeRequests.filter(r => r.createdByUid === currentUserId);
    const otherRelativeOffers = relativeOffers.filter(o => o.createdByUid !== currentUserId);
    const otherRelativeRequests = relativeRequests.filter(r => r.createdByUid !== currentUserId);

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
    const { topMatch, hasMatches, matches } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: myStatus
    });

    // Generate a unique ID for a match (based on offer and request IDs)
    const getMatchId = (match) => {
        if (!match) return null;
        const offerId = match.offer?.docId || match.offer?.id || 'none';
        const requestId = match.request?.docId || match.request?.id || 'none';
        return `${offerId}-${requestId}`;
    };

    // Filter out dismissed matches
    const filteredTopMatch = topMatch && !dismissedMatchIds.has(getMatchId(topMatch)) ? topMatch : null;
    const hasActiveMatches = filteredTopMatch !== null;

    return (
        <div className="space-y-3">
            {/* Your Status - compact inline for tech-savvy relatives */}
            <div className="bg-indigo-600 rounded-xl px-3 py-2 text-white shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-indigo-200 font-medium">Din status:</span>
                    {showStatusPicker ? (
                        <div className="flex-1">
                            <StatusSelector
                                currentStatus={myStatus}
                                onStatusChange={(newStatus) => {
                                    onMyStatusChange(newStatus);
                                    setShowStatusPicker(false);
                                }}
                                compact={true}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowStatusPicker(true)}
                            className="flex items-center gap-2 bg-indigo-500/50 hover:bg-indigo-500 rounded-lg px-2 py-1 transition-colors"
                        >
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium text-sm">{currentStatusInfo.label}</span>
                            <span className="text-indigo-300 text-xs">▼</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Match Celebration Banner */}
            {hasActiveMatches && filteredTopMatch && (
                <MatchBanner
                    match={filteredTopMatch}
                    onClick={() => onMatchAction?.(filteredTopMatch)}
                />
            )}

            {/* Family Presence - "Familien Nu" */}
            {memberStatuses.length > 0 && (
                <FamilyPresence
                    memberStatuses={memberStatuses}
                    currentUserId={currentUserId}
                    seniorName={seniorName}
                />
            )}

            {/* Bidirectional Help Exchange */}
            <div className="bg-stone-50 border-2 border-stone-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-teal-600" />
                    Familie-udveksling
                </h3>

                {/* OTHER RELATIVES' offers/requests - show what other family members have added */}
                {(otherRelativeOffers.length > 0 || otherRelativeRequests.length > 0) && (
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Fra andre pårørende:</p>
                        <div className="flex flex-wrap gap-2">
                            {otherRelativeOffers.map((offer, i) => (
                                <span key={`oro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName}`}>
                                    💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                                </span>
                            ))}
                            {otherRelativeRequests.map((req, i) => (
                                <span key={`orr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName}`}>
                                    💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

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

                {/* Your offers */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du tilbyder:</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeOffers.map((offer, i) => (
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

                {/* Your requests */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">Du ønsker:</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeRequests.map((req, i) => (
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

            {/* Symptoms - Collapsible (today's symptoms only in header) */}
            {(() => {
                const todaySymptoms = symptomLogs.filter(s => {
                    const date = s.loggedAt?.toDate ? s.loggedAt.toDate() : new Date(s.loggedAt);
                    return date.toDateString() === new Date().toDateString();
                });
                return symptomLogs.length > 0 && (
                    <div>
                        <button
                            onClick={() => setShowSymptoms(!showSymptoms)}
                            className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                        >
                            <span className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                Symptomer i dag ({todaySymptoms.length})
                            </span>
                            {showSymptoms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showSymptoms && (
                            <SymptomSummary symptomLogs={symptomLogs} onViewReport={onViewReport} hideTitle={true} />
                        )}
                    </div>
                );
            })()}

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

            {/* Completed Tasks - DISABLED for now (uncomment to re-enable) */}
            {false && completedTasks.length > 0 && (
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
