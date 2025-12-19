import React, { useState } from 'react';
import {
    CheckCircle,
    Heart,
    Pill,
    Sun,
    Moon,
    Coffee,
    Image as ImageIcon,
    Plus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCareCircleContext } from '../../contexts/CareCircleContext';
import { Button } from '../ui/Button';
import { LiquidList, LiquidItem } from '../ui/LiquidView';
import { TaskCard } from '../../features/tasks/TaskCard';
import { playCompletionSound } from '../../utils/sounds';
import { FEATURES } from '../../config/features';

interface DailyTabProps {
    onOpenSymptomModal: () => void;
    onOpenAddTaskModal: () => void;
}

export const DailyTab: React.FC<DailyTabProps> = ({
    onOpenSymptomModal,
    onOpenAddTaskModal,
}) => {
    const { t } = useTranslation();
    const {
        tasks,
        toggleTask,
        recordCheckIn,
    } = useCareCircleContext();

    const [rewardMinimized, setRewardMinimized] = useState(true);
    const [hideReward, setHideReward] = useState(false);
    const [activePeriod, setActivePeriod] = useState<string | null>('morgen');

    // Reward Logic - unlock photo when ALL MEDICINE is complete
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        t.title?.toLowerCase().includes('lac') ||
        t.type === 'medication'
    );
    const completedMedicineCount = medicineTasks.filter(t => t.completed).length;
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.length === completedMedicineCount;

    const handleToggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        const willBeCompleted = task && !task.completed;
        await toggleTask(id);
        if (willBeCompleted && FEATURES.completionSounds) {
            playCompletionSound();
        }
    };

    const handleCheckIn = async () => {
        await recordCheckIn();
    };

    const renderTaskSection = (periodTitle: string, periodKey: string, icon: React.ReactNode) => {
        const periodTasks = tasks.filter(t =>
            t.period === periodKey &&
            !t.completed &&
            !(t.title?.toLowerCase().includes('medicin') || t.title?.toLowerCase().includes('pille') || t.title?.toLowerCase().includes('lac') || t.type === 'medication')
        );
        if (periodTasks.length === 0) return null;

        const isActive = activePeriod === periodKey;

        return (
            <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                <div
                    className="flex items-center gap-2 mb-4 cursor-pointer"
                    onClick={() => setActivePeriod(activePeriod === periodKey ? null : periodKey)}
                >
                    {icon}
                    <h2 className="text-xl font-bold theme-text">{periodTitle}</h2>
                    {!isActive && <span className="text-sm theme-text-muted">{t('press_to_see')}</span>}
                </div>

                {isActive && (
                    <LiquidList className="space-y-4 mb-8">
                        {periodTasks.map(task => (
                            <LiquidItem key={task.id} id={task.id}>
                                <TaskCard
                                    task={task}
                                    onToggle={() => handleToggleTask(task.id)}
                                />
                            </LiquidItem>
                        ))}
                    </LiquidList>
                )}
            </div >
        );
    };

    return (
        <div className="tab-content animate-fade-in">
            {/* Reward Card (Behavioral Hook) */}
            {allMedicineComplete && !hideReward && (
                rewardMinimized ? (
                    <div className="relative w-full rounded-xl p-3 mb-4 bg-indigo-100 border-2 border-indigo-200 flex items-center justify-between">
                        <button
                            onClick={() => setRewardMinimized(false)}
                            className="flex-1 flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <ImageIcon className="w-5 h-5 text-indigo-600" />
                            <div>
                                <span className="font-bold text-indigo-700">{t('daily_photo_title')}</span>
                                <p className="text-xs text-indigo-500">{t('daily_photo_subtitle')}</p>
                            </div>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400">{t('press_to_show')}</span>
                            <button
                                onClick={() => setHideReward(true)}
                                className="p-1 rounded-full hover:bg-indigo-200 text-indigo-400 hover:text-indigo-600"
                                title={t('hide')}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full rounded-3xl p-6 mb-6 bg-indigo-600 border-2 border-indigo-600 text-white animate-fade-in">
                        <button
                            onClick={() => setHideReward(true)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-indigo-500 hover:bg-indigo-400 text-indigo-200 hover:text-white text-sm"
                            title={t('hide')}
                        >
                            ✕
                        </button>
                        <button
                            onClick={() => setRewardMinimized(true)}
                            className="w-full text-center"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <ImageIcon className="w-6 h-6 text-indigo-200" />
                                <span className="font-bold text-indigo-100 uppercase tracking-widest text-sm">{t('daily_photo_title')}</span>
                            </div>
                            <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-3 overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={`https://picsum.photos/seed/${new Date().toISOString().split('T')[0]}/600/400`}
                                    alt="Dagens billede"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-bold text-lg">{t('medication_taken')}</p>
                            <p className="text-indigo-200 text-sm">{t('press_to_minimize')}</p>
                        </button>
                    </div>
                )
            )}

            {/* MEDICINE SECTION */}
            {medicineTasks.length > 0 && !allMedicineComplete && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Pill className="w-6 h-6 text-purple-600" />
                        <h2 className="text-lg font-bold text-purple-800">{t('medication_title')}</h2>
                        <span className="text-sm text-purple-500 ml-auto">
                            {completedMedicineCount}/{medicineTasks.length} {t('taken')}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {medicineTasks.filter(m => !m.completed).map(med => (
                            <button
                                key={med.id}
                                onClick={() => handleToggleTask(med.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all bg-white border-2 border-purple-100 hover:border-purple-300"
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-purple-300 bg-white flex items-center justify-center transition-colors">
                                </div>
                                <span className="font-medium text-purple-800">
                                    {med.title}
                                </span>
                                <span className="text-purple-400 text-sm ml-auto">{med.time}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Medicine Complete Collapsed State */}
            {medicineTasks.length > 0 && allMedicineComplete && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 mb-4 border border-green-200 flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-green-700 font-medium">{t('medication_taken_check')}</span>
                </div>
            )}

            {/* Check-in Status */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                <h2 className="text-xl font-semibold theme-text mb-4">{t('pain_question')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="primary"
                        size="large"
                        className="w-full min-h-32 py-4"
                        onClick={handleCheckIn}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <CheckCircle className="w-10 h-10 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_good')}</span>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        size="large"
                        className="w-full min-h-32 py-4 bg-orange-50 text-orange-800 border-2 border-orange-100 hover:bg-orange-100"
                        onClick={onOpenSymptomModal}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Heart className="w-10 h-10 text-orange-500 shrink-0" />
                            <span className="text-sm leading-tight">{t('i_feel_pain')}</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Contextual Task Lists */}
            {renderTaskSection(t('time_period_morning_full'), 'morgen', <Coffee className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_lunch_full'), 'frokost', <Sun className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_afternoon_full'), 'eftermiddag', <Moon className="w-6 h-6 theme-text-muted" />)}
            <div className="h-px bg-current opacity-10 my-4" />
            {renderTaskSection(t('time_period_evening_full'), 'aften', <Moon className="w-6 h-6 theme-text-muted" />)}

            {/* Add Own Task Button */}
            <button
                onClick={onOpenAddTaskModal}
                className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-white border-2 border-dashed border-teal-300 rounded-2xl text-teal-600 font-medium hover:bg-teal-50 hover:border-teal-400 transition-colors"
            >
                <Plus className="w-5 h-5" />
                <span>{t('add_own_task')}</span>
            </button>
        </div>
    );
};
