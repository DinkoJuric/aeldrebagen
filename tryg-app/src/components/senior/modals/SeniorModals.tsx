import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { BodyPainSelector } from '../../../features/symptoms';
import { SYMPTOMS_LIST } from '../../../data/constants';
import { WeeklyQuestionModal } from '../../../features/weeklyQuestion';
import { MatchCelebration } from '../../../features/helpExchange';
import { useCareCircleContext } from '../../../contexts/CareCircleContext';

interface SeniorModalsProps {
    showCallModal: boolean;
    setShowCallModal: (show: boolean) => void;
    showSymptomModal: boolean;
    setShowSymptomModal: (show: boolean) => void;
    showWeeklyModal: boolean;
    setShowWeeklyModal: (show: boolean) => void;
    showAddTaskModal: boolean;
    setShowAddTaskModal: (show: boolean) => void;
    activeMatch: any | null;
    setActiveMatch: (match: any | null) => void;
}

export const SeniorModals: React.FC<SeniorModalsProps> = ({
    showCallModal,
    setShowCallModal,
    showSymptomModal,
    setShowSymptomModal,
    showWeeklyModal,
    setShowWeeklyModal,
    showAddTaskModal,
    setShowAddTaskModal,
    activeMatch,
    setActiveMatch
}) => {
    const { t } = useTranslation();
    const {
        userName,
        relativeName,
        currentUserId,
        addSymptom,
        addTask,
        weeklyAnswers,
        addWeeklyAnswer,
        toggleLike,
        addReply,
        members
    } = useCareCircleContext();

    // Symptom flow state
    const [selectedSymptom, setSelectedSymptom] = useState<any | null>(null);
    const [showBodySelector, setShowBodySelector] = useState(false);

    // Add Task state
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);

    const handleAddSymptom = (symptom: any) => {
        addSymptom(symptom);
        setShowSymptomModal(false);
        setSelectedSymptom(null);
        setShowBodySelector(false);
    };

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle.trim(),
                period: newTaskPeriod,
                type: 'activity',
                recurring: newTaskRecurring
            });
            setNewTaskTitle('');
            setNewTaskPeriod('morgen');
            setNewTaskRecurring(false);
            setShowAddTaskModal(false);
        }
    };

    return (
        <>
            {/* Call Modal */}
            {showCallModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-10 h-10 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-bold theme-text mb-2">{t('calling')}</h3>
                        <p className="theme-text-muted mb-8">{t('calling_to', { name: relativeName })}</p>
                        <Button variant="danger" onClick={() => setShowCallModal(false)}>{t('end_call')}</Button>
                    </div>
                </div>
            )}

            {/* Symptom Modal */}
            <Modal
                isOpen={showSymptomModal}
                onClose={() => {
                    setShowSymptomModal(false);
                    setSelectedSymptom(null);
                    setShowBodySelector(false);
                }}
                title={showBodySelector ? t('where_does_it_hurt') : t('how_do_you_feel')}
            >
                {showBodySelector ? (
                    <BodyPainSelector
                        onSelectLocation={(bodyLocation) => {
                            handleAddSymptom({
                                ...selectedSymptom,
                                bodyLocation
                            });
                        }}
                        onBack={() => {
                            setShowBodySelector(false);
                            setSelectedSymptom(null);
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {SYMPTOMS_LIST.map(sym => (
                            <button
                                key={sym.id}
                                onClick={() => {
                                    if (sym.id === 'pain') {
                                        setSelectedSymptom(sym);
                                        setShowBodySelector(true);
                                    } else {
                                        handleAddSymptom(sym);
                                    }
                                }}
                                className={`
                                    flex flex-col items-center justify-center gap-2 p-6 rounded-2xl
                                    transition-transform active:scale-95 border-2 border-transparent hover:border-stone-300
                                    ${sym.color}
                                `}
                            >
                                <sym.icon className="w-10 h-10" />
                                <span className="font-bold">{sym.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </Modal>

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answerObj: any) => addWeeklyAnswer(answerObj.answer)}
                userName={userName}
                currentUserId={currentUserId || undefined}
                onToggleLike={toggleLike}
                onReply={addReply}
                members={members}
            />

            {/* Add Task Modal */}
            <Modal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} title={t('add_own_task')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('what_needs_done')}</label>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder={t('example_call_doctor')}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: 'morgen', labelKey: 'time_period_morning', icon: '☀️' },
                                { key: 'frokost', labelKey: 'time_period_lunch', icon: '🍽️' },
                                { key: 'eftermiddag', labelKey: 'time_period_afternoon', icon: '🌤️' },
                                { key: 'aften', labelKey: 'time_period_evening', icon: '🌙' }
                            ].map(period => (
                                <button
                                    key={period.key}
                                    onClick={() => setNewTaskPeriod(period.key)}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${newTaskPeriod === period.key
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{period.icon}</span>
                                        <span className={`font-medium ${newTaskPeriod === period.key ? 'text-teal-700' : 'text-slate-700'}`}>
                                            {t(period.labelKey)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                        <input
                            type="checkbox"
                            toggle-id="recurring"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label className="flex-1 font-medium text-slate-700 cursor-pointer" onClick={() => setNewTaskRecurring(!newTaskRecurring)}>
                            {t('make_daily')}
                        </label>
                    </div>

                    <Button
                        onClick={handleAddTask}
                        className="w-full"
                        disabled={!newTaskTitle.trim()}
                    >
                        {t('add_task_button')}
                    </Button>
                </div>
            </Modal>

            {/* Match Celebration Modal */}
            {activeMatch && (
                <MatchCelebration
                    match={activeMatch}
                    seniorName={userName}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Action handling logic moved from SeniorView
                        let taskTitle = '';
                        switch (action) {
                            case 'call': taskTitle = t('match_task_call', { name: relativeName }); break;
                            case 'plan-visit': taskTitle = t('match_task_visit', { name: relativeName }); break;
                            case 'plan-meal': taskTitle = t('match_task_meal', { name: relativeName }); break;
                            default: taskTitle = activeMatch.celebration?.title || t('match_task_default', { name: relativeName });
                        }
                        addTask({
                            title: taskTitle,
                            period: 'eftermiddag',
                            type: 'appointment'
                        });
                        setActiveMatch(null);
                    }}
                />
            )}
        </>
    );
};
