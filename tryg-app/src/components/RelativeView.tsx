import React, { useState } from 'react';
import { WeeklyQuestionWidget } from '../features/weeklyQuestion';
import { ActiveMatch } from '../features/helpExchange';
import { ThinkingOfYouIconButton } from '../features/thinkingOfYou';
import { AmbientTab } from './shared/AmbientTab';
import { CoordinationTab } from './CoordinationTab';
import { HealthTab } from './shared/HealthTab';
import { SpilTab } from './shared/SpilTab';
import { RelativeModals } from './relative/modals/RelativeModals';
import { FEATURES } from '../config/features';
import { Avatar } from './ui/Avatar';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { getAvatarId } from '../utils/memberUtils';

export const RelativeView: React.FC = () => {
    const { t } = useTranslation();
    const {
        userName,
        weeklyAnswers,
        sendPing,
        activeTab,
        setActiveTab
    } = useCareCircleContext();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dismissedMatchIds, setDismissedMatchIds] = useState<Set<string>>(new Set());

    return (
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 glass-panel rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar
                            id={getAvatarId('relative', userName)}
                            size="md"
                            className="bg-indigo-50"
                        />
                        <span className="font-semibold theme-text text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                            {t('greeting_relative', { name: userName })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {FEATURES.weeklyQuestion && (
                            <WeeklyQuestionWidget
                                answers={weeklyAnswers}
                                userName={userName}
                                hasUnread={true}
                                onClick={() => setShowWeeklyModal(true)}
                            />
                        )}
                        <ThinkingOfYouIconButton onSendPing={() => sendPing('senior')} />
                    </div>
                </div>
            </header>

            {/* Main Content - Tab based */}
            <main className="flex-1 p-4 overflow-y-auto pb-28">
                {activeTab === 'daily' && <AmbientTab role="relative" />}

                {activeTab === 'family' && (
                    <CoordinationTab
                        onAddTask={() => setShowAddModal(true)}
                        onViewReport={() => setActiveTab('health')}
                        onMatchAction={(match) => setActiveMatch(match)}
                        onDismissMatch={(matchId) => {
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));
                        }}
                        dismissedMatchIds={dismissedMatchIds}
                    />
                )}

                {activeTab === 'health' && <HealthTab />}

                {activeTab === 'spil' && <SpilTab />}
            </main>

            {/* Centralized Relative Modals */}
            <RelativeModals
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                showWeeklyModal={showWeeklyModal}
                setShowWeeklyModal={setShowWeeklyModal}
                activeMatch={activeMatch}
                setActiveMatch={setActiveMatch}
                showTimePicker={showTimePicker}
                setShowTimePicker={setShowTimePicker}
                onDismissMatch={(matchId) => {
                    setDismissedMatchIds(prev => new Set([...prev, matchId]));
                }}
            />
        </div>
    );
};

export default RelativeView;
