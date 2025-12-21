import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from './ui/Avatar';
import { WeeklyQuestionWidget } from '../features/weeklyQuestion';
import { MatchBanner } from '../features/helpExchange';
import { InlineGatesIndicator } from '../features/tasks';
import { playMatchSound } from '../utils/sounds';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { FEATURES } from '../config/features';
import { useCareCircleContext } from '../contexts/CareCircleContext';

import { AmbientTab } from './shared/AmbientTab';
import { FamilyTab } from './senior/FamilyTab';
import { SpilTab } from './shared/SpilTab';
import { HealthTab } from './shared/HealthTab';
import { SeniorModals } from './senior/modals/SeniorModals';

export const SeniorView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const {
        tasks,
        userName,
        activeTab,
        weeklyAnswers,
        careCircleId,
        currentUserId,
        memberStatuses
    } = useCareCircleContext();

    // Modal Visibility State
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [activeMatch, setActiveMatch] = useState<any | null>(null);
    const [dismissedMatchIds, setDismissedMatchIds] = useState(new Set());

    // Help Exchange & Match Logic (Kept here for Banner orchestration)
    const { helpOffers: allOffers, helpRequests: allRequests } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);
    const { hasMatches, topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: null,
        memberStatuses
    });

    // Greeting & Date logic
    const hour = new Date().getHours();
    const [greeting] = useState(() => {
        const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        const randomId = Math.floor(Math.random() * 3);
        const key = randomId === 0 ? `greeting_${period}` : `greeting_${period}_${randomId}`;
        return t(key);
    });

    const localeId = i18n.language === 'da' ? 'da-DK' : i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'bs' ? 'bs-BA' : 'da-DK';
    const dateString = new Date().toLocaleDateString(localeId, { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header */}
            <header className="px-4 py-2 glass-panel shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar id="senior" size="md" />
                        <div onClick={() => setShowCallModal(true)} className="cursor-pointer">
                            <h1 className="text-2xl font-extrabold theme-text leading-tight tracking-tighter">{greeting}</h1>
                            <p className="text-base font-bold theme-text-muted opacity-90">{userName}</p>
                        </div>
                    </div>
                    {FEATURES.weeklyQuestion && activeTab === 'family' && (
                        <WeeklyQuestionWidget
                            answers={weeklyAnswers}
                            userName={userName}
                            hasUnread={true}
                            onClick={() => setShowWeeklyModal(true)}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="theme-text-muted capitalize">{dateString}</span>
                    <InlineGatesIndicator tasks={tasks} className="ml-2 scale-90 origin-left" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {hasMatches && topMatch && !dismissedMatchIds.has(`${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`) && (
                    <MatchBanner
                        match={topMatch}
                        onClick={() => {
                            playMatchSound();
                            setActiveMatch(topMatch);
                        }}
                        onDismiss={() => {
                            const mId = `${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`;
                            setDismissedMatchIds(prev => new Set([...prev, mId]));
                        }}
                    />
                )}

                {activeTab === 'daily' && <AmbientTab role="senior" onOpenSymptomModal={() => setShowSymptomModal(true)} onOpenAddTaskModal={() => setShowAddTaskModal(true)} />}
                {activeTab === 'family' && <FamilyTab />}
                {activeTab === 'health' && <HealthTab />}
                {activeTab === 'spil' && <SpilTab />}
            </main>

            <SeniorModals
                showCallModal={showCallModal}
                setShowCallModal={setShowCallModal}
                showSymptomModal={showSymptomModal}
                setShowSymptomModal={setShowSymptomModal}
                showWeeklyModal={showWeeklyModal}
                setShowWeeklyModal={setShowWeeklyModal}
                showAddTaskModal={showAddTaskModal}
                setShowAddTaskModal={setShowAddTaskModal}
                activeMatch={activeMatch}
                setActiveMatch={setActiveMatch}
            />
        </div>
    );
};

export default SeniorView;
