import React, { useState } from 'react';
import {
    Plus, Pill, Clock, Activity, ChevronDown, ChevronUp,
    AlertCircle, HandHeart, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';
import { SymptomSummary } from '../features/symptoms';
import { StatusSelector, STATUS_OPTIONS } from '../features/familyPresence';
import { MatchBanner } from '../features/helpExchange';
import { FamilyPresence } from '../features/familyPresence';
import { RELATIVE_OFFERS, RELATIVE_REQUESTS } from '../features/helpExchange';
import { useHelpExchangeMatch, ActiveMatch } from '../features/helpExchange/useHelpExchangeMatch';
import { useHelpExchange } from '../features/helpExchange';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { HelpOffer, HelpRequest } from '../types';
import { MemoriesGallery } from '../features/memories/MemoriesGallery';
import { FamilyTree } from '../features/visualizations/FamilyTree';
import { RelationshipMatrix } from '../features/onboarding/RelationshipMatrix';
import { LayoutGrid, Network } from 'lucide-react';
import { FEATURES } from '../config/features';

export interface CoordinationTabProps {
    onAddTask?: () => void;
    onViewReport?: () => void;
    onMatchAction?: (match: ActiveMatch) => void;
    onDismissMatch?: (matchId: string) => void;
    dismissedMatchIds?: Set<string>;
}

export const CoordinationTab: React.FC<CoordinationTabProps> = ({
    onAddTask,
    onViewReport,
    onMatchAction,
    onDismissMatch,
    dismissedMatchIds = new Set()
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        userName,
        memberStatuses = [],
        currentUserId,
        careCircleId,
        myStatus = 'home',
        setMyStatus: onMyStatusChange,
        tasks = [],
        symptoms: symptomLogs = [],
        members = [], // Added members for FamilyTree
        seniorId,

        updateAnyMember
    } = useCareCircleContext();

    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showOpenTasks, setShowOpenTasks] = useState(false);
    const [showSymptoms, setShowSymptoms] = useState(false);
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);
    const [viewMode, setViewMode] = useState<'planets' | 'tree'>('planets'); // Toggle state
    const [showRelationMatrix, setShowRelationMatrix] = useState(false);

    // Identify current member object for Matrix
    const currentMember = members.find(m => m.userId === currentUserId || m.docId === currentUserId);
    const hasEdges = currentMember?.edges && Object.keys(currentMember.edges).length > 0;

    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'relative', userName);

    const helpOffers = allOffersFetched.filter((o: HelpOffer) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: HelpRequest) => r.createdByRole === 'senior');
    const relativeOffers = allOffersFetched.filter((o: HelpOffer) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: HelpRequest) => r.createdByRole === 'relative');

    const currentStatusInfo = STATUS_OPTIONS.find(s => s.id === myStatus) || STATUS_OPTIONS[0];
    const StatusIcon = currentStatusInfo.icon;

    const otherRelativeOffers = relativeOffers.filter((o: HelpOffer) => o.createdByUid !== currentUserId);
    const otherRelativeRequests = relativeRequests.filter((r: HelpRequest) => r.createdByUid !== currentUserId);
    const myRelativeOffers = relativeOffers.filter((o: HelpOffer) => o.createdByUid === currentUserId);
    const myRelativeRequests = relativeRequests.filter((r: HelpRequest) => r.createdByUid === currentUserId);

    const allOffers = [
        ...helpOffers.map((o: HelpOffer) => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map((o: HelpOffer) => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map((r: HelpRequest) => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map((r: HelpRequest) => ({ ...r, createdByRole: 'relative' }))
    ];

    const { topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: myStatus
    });

    const getMatchId = (match: ActiveMatch) => {
        if (!match) return null;
        const offerId = match.offer?.docId || match.offer?.id || 'none';
        const requestId = match.request?.docId || match.request?.id || 'none';
        return `${offerId}-${requestId}`;
    };

    const filteredTopMatch = topMatch && !dismissedMatchIds.has(getMatchId(topMatch)!) ? topMatch : null;
    const hasActiveMatches = filteredTopMatch !== null;

    const openTasks = tasks.filter(t => !t.completed);

    return (
        <div className="space-y-3 tab-content">
            <div className="bg-indigo-600 rounded-xl px-3 py-2 text-white shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-indigo-200 font-medium">{t('din_status')}:</span>
                    {showStatusPicker ? (
                        <div className="flex-1">
                            <StatusSelector
                                currentStatus={myStatus}
                                onStatusChange={(newStatus) => {
                                    if (onMyStatusChange) onMyStatusChange(newStatus);
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
                            <span className="font-medium text-sm">{t(`status_${currentStatusInfo.id}`)}</span>
                            <span className="text-indigo-300 text-xs">▼</span>
                        </button>
                    )}
                </div>
            </div>

            {hasActiveMatches && filteredTopMatch && (
                <MatchBanner
                    match={filteredTopMatch}
                    onClick={() => onMatchAction?.(filteredTopMatch)}
                    onDismiss={() => {
                        const offerId = filteredTopMatch.offer?.docId || filteredTopMatch.offer?.id || 'none';
                        const requestId = filteredTopMatch.request?.docId || filteredTopMatch.request?.id || 'none';
                        const matchId = `${offerId}-${requestId}`;
                        onDismissMatch?.(matchId);
                    }}
                />
            )}

            {members.length > 0 && (
                <div className="space-y-2">
                    {/* View Toggle Header */}
                    <div className="flex justify-end gap-2 px-2">
                        {!hasEdges && currentMember && (
                            <button
                                onClick={() => setShowRelationMatrix(true)}
                                className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors animate-pulse"
                            >
                                🔗 Sæt relationer
                            </button>
                        )}
                        <div className="bg-stone-100 p-1 rounded-lg flex items-center shadow-inner">
                            <button
                                onClick={() => setViewMode('planets')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'planets' ? 'bg-white shadow text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('tree')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'tree' ? 'bg-white shadow text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <Network size={16} />
                            </button>
                        </div>
                    </div>

                    {viewMode === 'planets' ? (
                        <FamilyPresence
                            memberStatuses={memberStatuses}
                            currentUserId={currentUserId ?? ''}
                            seniorName={seniorName}
                        />
                    ) : (
                        <FamilyTree
                            members={members}
                            seniorId={seniorId || ''}
                            onUpdateMember={updateAnyMember}
                            currentUserId={currentUserId ?? ''}
                        />
                    )}
                </div>
            )}

            <div className="bg-stone-50 border-2 border-stone-100 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                    <HandHeart className="w-5 h-5 text-teal-600" />
                    {t('coordination_title')}
                </h3>

                {(otherRelativeOffers.length > 0 || otherRelativeRequests.length > 0) && (
                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-2">{t('others_offers')}</p>
                        <div className="flex flex-wrap gap-2">
                            {otherRelativeOffers.map((offer: HelpOffer, i: number) => (
                                <span key={`oro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
                                    💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                                </span>
                            ))}
                            {otherRelativeRequests.map((req: HelpRequest, i: number) => (
                                <span key={`orr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                                    💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {(helpOffers.length > 0 || helpRequests.length > 0) && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-stone-500 uppercase">{t('from_senior_name', { name: seniorName })}</p>
                        <div className="flex flex-wrap gap-2">
                            {helpOffers.map((offer: HelpOffer, i: number) => (
                                <span key={`so-${i}`} className="text-sm bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full">
                                    💚 {offer.label}
                                </span>
                            ))}
                            {helpRequests.map((req: HelpRequest, i: number) => (
                                <span key={`sr-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
                                    💜 {req.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">{t('you_offer')}</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeOffers.map((offer: HelpOffer, i: number) => (
                            <span key={`ro-${i}`} className="text-sm bg-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                                <span className="shrink-0">{offer.emoji || '✨'}</span>
                                <span>{offer.label}</span>
                                <button onClick={() => removeOffer?.(offer.docId)} className="ml-1 hover:bg-teal-600 rounded-full p-0.5 shrink-0">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button onClick={() => setShowOfferPicker(!showOfferPicker)} className="text-sm bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full border-2 border-dashed border-teal-200 hover:bg-teal-100 transition-colors">
                            + {t('add_offer')}
                        </button>
                    </div>

                    {showOfferPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Vælg hvad du kan tilbyde:</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_OFFERS.filter(o => !relativeOffers.some((ro: HelpOffer) => ro.id === o.id)).map(offer => (
                                    <button
                                        key={offer.id}
                                        onClick={() => {
                                            addOffer?.(offer);
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

                <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-500 uppercase">{t('you_request')}</p>
                    <div className="flex flex-wrap gap-2">
                        {myRelativeRequests.map((req: HelpRequest, i: number) => (
                            <span key={`rr-${i}`} className="text-sm bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                                <span className="shrink-0">{req.emoji || '💜'}</span>
                                <span>{req.label}</span>
                                <button onClick={() => removeRequest?.(req.docId)} className="ml-1 hover:bg-indigo-600 rounded-full p-0.5 shrink-0">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <button onClick={() => setShowRequestPicker(!showRequestPicker)} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border-2 border-dashed border-indigo-200 hover:bg-indigo-100 transition-colors">
                            + {t('add_request')}
                        </button>
                    </div>

                    {showRequestPicker && (
                        <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2">
                            <p className="text-xs text-stone-500">Hvad kunne du bruge hjælp til?</p>
                            <div className="flex flex-wrap gap-2">
                                {RELATIVE_REQUESTS.filter(r => !relativeRequests.some((rr: HelpRequest) => rr.id === r.id)).map(request => (
                                    <button
                                        key={request.id}
                                        onClick={() => {
                                            addRequest?.(request);
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

            {/* Family Heirloom - Livsbog */}
            {/* Family Heirloom - Livsbog */}
            {careCircleId && FEATURES.memoryTriggers && (
                <MemoriesGallery circleId={careCircleId} />
            )}

            {(() => {
                const todaySymptoms = symptomLogs.filter(s => {
                    const date = s.loggedAt && typeof (s.loggedAt as { toDate: () => Date }).toDate === 'function'
                        ? (s.loggedAt as { toDate: () => Date }).toDate()
                        : new Date(s.loggedAt as string | number | Date);
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
                                {t('symptoms_today')} ({todaySymptoms.length})
                            </span>
                            {showSymptoms ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showSymptoms && (
                            <SymptomSummary symptomLogs={symptomLogs} onViewReport={onViewReport} hideTitle={true} />
                        )}
                    </div>
                );
            })()}

            {openTasks.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowOpenTasks(!showOpenTasks)}
                        className="w-full flex items-center justify-between text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 pl-1"
                    >
                        <span>{t('open_tasks_count', { count: openTasks.length })}</span>
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

            <Button variant="outline" className="w-full h-auto py-4 bg-white" onClick={onAddTask}>
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>{t('add_reminder_name', { name: seniorName })}</span>
                </div>
            </Button>

            {/* Relationship Matrix Modal */}
            {showRelationMatrix && currentMember && (
                <RelationshipMatrix
                    currentMember={currentMember}
                    allMembers={members}
                    onComplete={() => setShowRelationMatrix(false)}
                />
            )}
        </div>
    );
};

export default CoordinationTab;
