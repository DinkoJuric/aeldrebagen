import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { WeeklyQuestionModal } from '../../../features/weeklyQuestion';
import { MatchCelebration } from '../../../features/helpExchange';
import { ActiveMatch } from '../../../features/helpExchange/useHelpExchangeMatch';
import { Celebration } from '../../../features/helpExchange/config';
import { TimePickerModal } from '../../../features/tasks';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../../contexts/CareCircleContext';

interface RelativeModalsProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showWeeklyModal: boolean;
    setShowWeeklyModal: (show: boolean) => void;
    activeMatch: ActiveMatch | null;
    setActiveMatch: (match: ActiveMatch | null) => void;
    showTimePicker: boolean;
    setShowTimePicker: (show: boolean) => void;
    onDismissMatch: (matchId: string) => void;
}

interface PendingAction {
    title: string;
    action: string;
    celebration?: Celebration;
    matchToDissmiss?: ActiveMatch;
}

export const RelativeModals: React.FC<RelativeModalsProps> = ({
    showAddModal,
    setShowAddModal,
    showWeeklyModal,
    setShowWeeklyModal,
    activeMatch,
    setActiveMatch,
    showTimePicker,
    setShowTimePicker,
    onDismissMatch
}) => {
    const { t } = useTranslation();
    const {
        seniorName,
        userName,
        addTask,
        weeklyAnswers,
        addWeeklyAnswer,
        toggleLike,
        addReply,
        currentUserId,
        members
    } = useCareCircleContext();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const PERIOD_TIMES: Record<string, string> = {
        morgen: '08:00',
        frokost: '12:00',
        eftermiddag: '14:00',
        aften: '19:00'
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        addTask({
            title: newTaskTitle.trim(),
            time: PERIOD_TIMES[newTaskPeriod],
            type: 'appointment',
            description: `Tilføjet af ${userName}`,
            period: newTaskPeriod,
            recurring: newTaskRecurring
        });
        setNewTaskTitle('');
        setNewTaskPeriod('morgen');
        setNewTaskRecurring(false);
        setShowAddModal(false);
    };

    return (
        <>
            {/* Add Task Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('new_reminder')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('title_label')}</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-sans"
                            placeholder={t('reminder_placeholder')}
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'morgen', label: t('morning'), time: '08-11', emoji: '🌅' },
                                { id: 'frokost', label: t('lunch'), time: '12-13', emoji: '☀️' },
                                { id: 'eftermiddag', label: t('afternoon'), time: '14-17', emoji: '☕' },
                                { id: 'aften', label: t('evening'), time: '18-21', emoji: '🌙' }
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

                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
                        <input
                            type="checkbox"
                            id="recurring-relative"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="recurring-relative" className="flex-1 font-medium text-indigo-700 cursor-pointer">
                            {t('recurring')}
                        </label>
                    </div>

                    <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-xl">
                        {t('reminder_notice', { name: seniorName })}
                    </div>
                    <Button className="w-full" onClick={handleAddTask}>{t('add_button')}</Button>
                </div>
            </Modal>

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answer) => addWeeklyAnswer(answer)}
                userName={userName}
                onToggleLike={toggleLike}
                onReply={addReply}
                currentUserId={currentUserId || undefined}
                members={members}
            />

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={seniorName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = t('match_task_call_relative', { name: seniorName });
                                break;
                            case 'plan-visit':
                                taskTitle = t('match_task_visit_relative', { name: seniorName });
                                break;
                            case 'plan-meal':
                                taskTitle = t('match_task_meal', { name: seniorName });
                                break;
                            case 'plan-transport':
                                taskTitle = t('match_task_transport_relative', { name: seniorName });
                                break;
                            case 'plan-garden':
                                taskTitle = t('match_task_garden', { name: seniorName });
                                break;
                            default:
                                taskTitle = celebration?.title || t('match_task_default', { name: seniorName });
                        }

                        setPendingAction({
                            title: taskTitle,
                            action: action,
                            celebration: celebration,
                            matchToDissmiss: activeMatch
                        });
                        setActiveMatch(null);
                        setShowTimePicker(true);
                    }}
                />
            )}

            {/* Time Picker Modal */}
            <TimePickerModal
                isOpen={showTimePicker}
                onClose={() => {
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
                title={t('when_question')}
                actionLabel={pendingAction?.title || t('create_task_label')}
                seniorName={seniorName}
                onConfirm={({ time, period }) => {
                    if (addTask && pendingAction) {
                        addTask({
                            title: pendingAction.title,
                            time: time,
                            period: period || 'morgen',
                            type: 'appointment',
                            description: `Tilføjet af ${userName}`,
                            createdByRole: 'relative'
                        });

                        if (pendingAction.matchToDissmiss) {
                            const match = pendingAction.matchToDissmiss;
                            const offerId = match.offer?.docId || match.offer?.id || 'none';
                            const requestId = match.request?.docId || match.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            onDismissMatch(matchId);
                        }
                    }
                    setShowTimePicker(false);
                    setPendingAction(null);
                }}
            />
        </>
    );
};
