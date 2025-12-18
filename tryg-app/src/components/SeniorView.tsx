import React, { useState } from 'react';
import {
    CheckCircle,
    Phone,
    Heart,
    Pill,
    Activity,
    Sun,
    Moon,
    Clock,
    Coffee,
    Image as ImageIcon,
    ChevronDown,
    ChevronUp,
    Plus
} from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { LiquidList, LiquidItem } from './ui/LiquidView';
import { TaskCard } from '../features/tasks/TaskCard';
import { StatusList } from '../features/familyPresence';
import { FamilyPresence } from '../features/familyPresence';
import { ThinkingOfYouButton } from '../features/thinkingOfYou';
import { BodyPainSelector } from '../features/symptoms';
import { MemoryTrigger } from '../features/weeklyQuestion';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from '../features/weeklyQuestion';
import { HelpExchange } from '../features/helpExchange';
import { CoffeeToggle } from '../features/coffee';
import { SYMPTOMS_LIST } from '../data/constants';
import { FEATURES } from '../config/features';
import { useHelpExchangeMatch } from '../features/helpExchange';
import { useHelpExchange } from '../features/helpExchange';
import { MatchCelebration, MatchBanner } from '../features/helpExchange';
import { InlineGatesIndicator } from '../features/tasks';
import { Spillehjoernet } from '../features/wordGame';
import { HealthReport } from './HealthReport';
import { playMatchSound } from '../utils/sounds';
import { Task } from '../features/tasks/useTasks';
import { SymptomLog } from '../features/symptoms/useSymptoms';
import { Member } from '../types';
import { useTranslation } from 'react-i18next';

export interface SeniorViewProps {
    tasks: Task[];
    toggleTask: (id: string) => void;
    updateStatus: (status: string) => void;
    addSymptom: (symptom: any) => void;
    statusLastUpdated?: any;
    onSendPing: (type: string) => void;
    weeklyAnswers: any[];
    onWeeklyAnswer: (answer: string) => void;
    members?: Member[];
    memberStatuses?: any[];
    currentUserId?: string | null;
    relativeStatuses?: any[];
    userName?: string;
    relativeName?: string;
    careCircleId?: string | null;
    symptomLogs?: SymptomLog[];
    onAddTask?: (task: Partial<Task>) => void;
    onToggleLike?: (answerId: string, userId: string) => void;
    onReply?: (answerId: string, reply: any) => void;
    activeTab: 'daily' | 'family' | 'spil';
    onTabChange: (tab: 'daily' | 'family' | 'spil') => void;
    showHealthReport: boolean;
    setShowHealthReport: (show: boolean) => void;
}

export const SeniorView: React.FC<SeniorViewProps> = ({
    tasks, toggleTask, updateStatus, addSymptom, statusLastUpdated, onSendPing,
    weeklyAnswers, onWeeklyAnswer, onToggleLike, onReply,
    members = [], memberStatuses = [], currentUserId = null, relativeStatuses = [],
    userName = 'Senior', relativeName = 'Familie', careCircleId = null, symptomLogs = [], onAddTask,
    activeTab, onTabChange, showHealthReport, setShowHealthReport
}) => {
    const { t, i18n } = useTranslation();
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [rewardMinimized, setRewardMinimized] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPeriod, setNewTaskPeriod] = useState('morgen');
    const [newTaskRecurring, setNewTaskRecurring] = useState(false);
    const [activePeriod, setActivePeriod] = useState<string | null>('morgen');
    const [activeMatch, setActiveMatch] = useState<any | null>(null); // For match celebration modal
    const [dismissedMatchIds, setDismissedMatchIds] = useState(new Set()); // Track dismissed matches
    const [hideReward, setHideReward] = useState(false); // Hide medicine reward for session

    // Fetch HelpExchange data directly
    const {
        helpOffers: allOffersFetched,
        helpRequests: allRequestsFetched,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest
    } = useHelpExchange(careCircleId, currentUserId, 'senior', userName);

    // Filter offers/requests by role
    // Senior's items
    const helpOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'senior');
    const helpRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'senior');
    // Relative's items
    const relativeOffers = allOffersFetched.filter((o: any) => o.createdByRole === 'relative');
    const relativeRequests = allRequestsFetched.filter((r: any) => r.createdByRole === 'relative');

    // Map handlers
    const onHelpOffer = addOffer;
    const onHelpRequest = addRequest;
    const onRemoveOffer = removeOffer;
    const onRemoveRequest = removeRequest;

    /*
    console.debug('👴 [SeniorView] Help Data:', {
        offers: helpOffers.length,
        requests: helpRequests.length,
        relOffers: relativeOffers.length,
        relRequests: relativeRequests.length
    });
    */

    // Combine all offers/requests for match detection (using local filtered vars)
    const allOffers = [
        ...helpOffers.map((o: any) => ({ ...o, createdByRole: 'senior' })),
        ...relativeOffers.map((o: any) => ({ ...o, createdByRole: 'relative' }))
    ];
    const allRequests = [
        ...helpRequests.map((r: any) => ({ ...r, createdByRole: 'senior' })),
        ...relativeRequests.map((r: any) => ({ ...r, createdByRole: 'relative' }))
    ];

    const { hasMatches, topMatch } = useHelpExchangeMatch({
        offers: allOffers,
        requests: allRequests,
        familyStatus: null, // Senior view doesn't track their own status
        memberStatuses
    });

    // Two-step symptom flow: symptom type → body location (for pain)
    const [selectedSymptom, setSelectedSymptom] = useState<any | null>(null);
    const [showBodySelector, setShowBodySelector] = useState(false);

    // Reward Logic - unlock photo when ALL MEDICINE is complete (not all tasks)
    const medicineTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes('medicin') ||
        t.title?.toLowerCase().includes('pille') ||
        t.title?.toLowerCase().includes('lac') ||
        t.type === 'medication'
    );
    const completedMedicine = medicineTasks.filter(t => t.completed).length;
    const allMedicineComplete = medicineTasks.length > 0 && medicineTasks.length === completedMedicine;

    // For general stats
    // const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    const greetingKey = hour < 12 ? 'greeting_morning' : hour < 18 ? 'greeting_afternoon' : 'greeting_evening';
    const greeting = t(greetingKey);

    // Get current date in localized format
    const localeId = i18n.language === 'da' ? 'da-DK' : i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'bs' ? 'bs-BA' : 'da-DK';
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = new Date().toLocaleDateString(localeId, dateOptions);

    // Render task section by period (only incomplete, NON-MEDICINE tasks)
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
                    <h2 className="text-xl font-bold text-stone-800">{periodTitle}</h2>
                    {!isActive && <span className="text-sm text-stone-400">{t('press_to_see')}</span>}
                </div>

                {isActive && (
                    <LiquidList className="space-y-4 mb-8">
                        {periodTasks.map(task => (
                            <LiquidItem key={task.id} id={task.id}>
                                <TaskCard
                                    task={task}
                                    onToggle={() => toggleTask(task.id)}
                                />
                            </LiquidItem>
                        ))}
                    </LiquidList>
                )}
            </div >
        );
    };

    return (
        <div className="flex flex-col h-full bg-transparent relative pt-10">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Avatar id="senior" size="md" />
                        <h1 className="text-xl font-bold text-stone-800">{greeting}, {userName}</h1>
                    </div>
                    {/* Swap sun for Weekly Question widget on Family tab */}
                    {FEATURES.weeklyQuestion && activeTab === 'family' ? (
                        <WeeklyQuestionWidget
                            answers={weeklyAnswers}
                            userName={userName}
                            hasUnread={true}
                            onClick={() => setShowWeeklyModal(true)}
                        />
                    ) : (
                        <div className="bg-amber-100 p-1.5 rounded-full animate-sun-pulse">
                            <Sun className="text-amber-500 w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-stone-500 capitalize">{dateString}</span>
                    <InlineGatesIndicator tasks={tasks} className="ml-2 scale-90 origin-left" />
                </div>
            </header>

            {/* Main Content - Scrollable with padding for bottom nav */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">

                {/* Match Celebration Banner - Shows when there's a help exchange match */}
                {hasMatches && topMatch && (() => {
                    // Generate match ID for filtering
                    const offerId = topMatch.offer?.docId || topMatch.offer?.id || 'none';
                    const requestId = topMatch.request?.docId || topMatch.request?.id || 'none';
                    const matchId = `${offerId}-${requestId}`;

                    if (dismissedMatchIds.has(matchId)) return null;

                    return (
                        <MatchBanner
                            match={topMatch}
                            onClick={() => {
                                playMatchSound();
                                setActiveMatch(topMatch);
                            }}
                            onDismiss={() => {
                                setDismissedMatchIds(prev => new Set([...prev, matchId]));
                            }}
                        />
                    );
                })()}

                {/* ===== DAILY TAB ===== */}
                {activeTab === 'daily' && (
                    <div className="tab-content">
                        {/* Reward Card (Behavioral Hook) - Clickable to minimize, can be hidden */}
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
                                            {/* Daily nature photo - same image all day using date as seed */}
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

                        {/* MEDICINE SECTION - Separate from tasks, with tick marks */}
                        {medicineTasks.length > 0 && !allMedicineComplete && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-purple-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Pill className="w-6 h-6 text-purple-600" />
                                    <h2 className="text-lg font-bold text-purple-800">{t('medication_title')}</h2>
                                    <span className="text-sm text-purple-500 ml-auto">
                                        {completedMedicine}/{medicineTasks.length} {t('taken')}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {medicineTasks.map(med => (
                                        <button
                                            key={med.id}
                                            onClick={() => toggleTask(med.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${med.completed
                                                ? 'bg-purple-100 border-2 border-purple-200'
                                                : 'bg-white border-2 border-purple-100 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${med.completed
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-purple-300 bg-white'
                                                }`}>
                                                {med.completed && <CheckCircle className="w-5 h-5 text-white" />}
                                            </div>
                                            <span className={`font-medium ${med.completed ? 'text-purple-500 line-through' : 'text-purple-800'
                                                }`}>
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
                            <h2 className="text-xl font-semibold text-stone-800 mb-4">{t('pain_question')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="primary"
                                    size="large"
                                    className="w-full min-h-32 py-4"
                                    onClick={() => updateStatus('checked-in')}
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
                                    onClick={() => setShowSymptomModal(true)}
                                >
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <Heart className="w-10 h-10 text-orange-500 shrink-0" />
                                        <span className="text-sm leading-tight">{t('i_feel_pain')}</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Contextual Task Lists */}
                        {renderTaskSection(t('time_period_morning_full'), 'morgen', <Coffee className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection(t('time_period_lunch_full'), 'frokost', <Sun className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection(t('time_period_afternoon_full'), 'eftermiddag', <Moon className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection(t('time_period_evening_full'), 'aften', <Moon className="w-6 h-6 text-stone-600" />)}

                        {/* Add Own Task Button */}
                        <button
                            onClick={() => setShowAddTaskModal(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-white border-2 border-dashed border-teal-300 rounded-2xl text-teal-600 font-medium hover:bg-teal-50 hover:border-teal-400 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{t('add_own_task')}</span>
                        </button>

                        {/* Completed Tasks - DISABLED for now (uncomment to re-enable) */}
                        {false && completedTasks > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                    className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                        <span className="font-bold text-teal-800">{t('completed_tasks_count_special', { count: completedTasks })}</span>
                                    </div>
                                    {showCompletedTasks ? (
                                        <ChevronUp className="w-5 h-5 text-teal-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-teal-600" />
                                    )}
                                </button>

                                {showCompletedTasks && (
                                    <div className="mt-3 space-y-3">
                                        {tasks.filter(t => t.completed).map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => toggleTask(task.id)}
                                                className="p-4 rounded-2xl bg-stone-100 border-2 border-stone-200 cursor-pointer hover:border-stone-300 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-stone-200 text-stone-400">
                                                            {task.type === 'medication' && <Pill className="w-6 h-6" />}
                                                            {task.type === 'hydration' && <Activity className="w-6 h-6" />}
                                                            {task.type === 'activity' && <Sun className="w-6 h-6" />}
                                                            {task.type === 'appointment' && <Clock className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-stone-500 line-through">{task.title}</h3>
                                                            <p className="text-stone-400 text-sm">{task.time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                                                        <CheckCircle className="text-white w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== FAMILY TAB ===== */}
                {(!FEATURES.tabbedLayout || activeTab === 'family') && (
                    <div className="tab-content">
                        {/* Spontan Kaffe Signal */}
                        <CoffeeToggle />

                        {/* Thinking of You - MOVED TO TOP */}
                        {FEATURES.thinkingOfYou && (
                            <ThinkingOfYouButton onSendPing={() => onSendPing('heart')} fromName={userName} />
                        )}

                        {/* Family Presence - "Familien Nu" for bidirectional visibility */}
                        {memberStatuses.length > 0 && (
                            <FamilyPresence
                                memberStatuses={memberStatuses as any}
                                currentUserId={currentUserId || ''}
                                seniorName={userName}
                            />
                        )}

                        {/* Legacy Family Status List - fallback if no memberStatuses */}
                        {FEATURES.familyStatusCard && memberStatuses.length === 0 && (
                            <StatusList
                                members={members}
                                relativeStatuses={relativeStatuses}
                                lastUpdated={statusLastUpdated}
                            />
                        )}

                        {/* Weekly Question now in header - removed from here */}

                        {/* Memory Trigger - toggle with FEATURES.memoryTriggers */}
                        {FEATURES.memoryTriggers && <MemoryTrigger />}

                        {/* Language Selection moved to global SettingsModal */}

                        {/* Dignity-Preserving Help Exchange - toggle with FEATURES.helpExchange */}
                        {FEATURES.helpExchange && (
                            <HelpExchange
                                onOffer={onHelpOffer}
                                onRequest={onHelpRequest}
                                onRemoveOffer={onRemoveOffer}
                                onRemoveRequest={onRemoveRequest}
                                activeOffers={helpOffers}
                                activeRequests={helpRequests}
                                relativeOffers={relativeOffers}
                                relativeRequests={relativeRequests}
                                seniorName={userName}
                            />
                        )}

                    </div>
                )}

                {/* ===== SPIL TAB ===== */}
                {activeTab === 'spil' && (
                    <div className="tab-content">
                        {/* Spillehjørnet - Gaming Corner */}
                        {FEATURES.spillehjoernet && (
                            <Spillehjoernet
                                circleId={careCircleId || ''}
                                userId={currentUserId || ''}
                                displayName={userName || 'Senior'}
                            />
                        )}
                    </div>
                )}

            </main>

            {/* Symptom Modal - Two-step flow for pain */}
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
                    // Step 2: Body location selector (for Smerter)
                    <BodyPainSelector
                        onSelectLocation={(bodyLocation) => {
                            // Add symptom with body location
                            addSymptom({
                                ...selectedSymptom,
                                bodyLocation: bodyLocation
                            });
                            setShowSymptomModal(false);
                            setSelectedSymptom(null);
                            setShowBodySelector(false);
                        }}
                        onBack={() => {
                            setShowBodySelector(false);
                            setSelectedSymptom(null);
                        }}
                    />
                ) : (
                    // Step 1: Symptom type selector
                    <div className="grid grid-cols-2 gap-4">
                        {SYMPTOMS_LIST.map(sym => (
                            <button
                                key={sym.id}
                                onClick={() => {
                                    // If it's pain (smerter), show body location picker
                                    if (sym.id === 'pain') {
                                        setSelectedSymptom(sym);
                                        setShowBodySelector(true);
                                    } else {
                                        // For other symptoms, add directly
                                        addSymptom(sym);
                                        setShowSymptomModal(false);
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



            {/* Bottom Navigation */}

            {/* Call Modal */}
            {
                showCallModal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-10 h-10 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('calling')}</h3>
                            <p className="text-stone-500 mb-8">{t('calling_to', { name: relativeName })}</p>
                            <Button variant="danger" onClick={() => setShowCallModal(false)}>{t('end_call')}</Button>
                        </div>
                    </div>
                )
            }

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={(answerObj: any) => onWeeklyAnswer(answerObj.answer)}
                userName={userName}
                currentUserId={currentUserId || undefined}
                onToggleLike={onToggleLike}
                onReply={onReply}
            />
            {/* Match Celebration Modal - full screen confetti! */}
            {/* Match Celebration Modal - full screen confetti! */}
            {topMatch && !dismissedMatchIds.has(`${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`) && (
                <MatchCelebration
                    match={topMatch}
                    onDismiss={() => {
                        const mId = `${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`;
                        setDismissedMatchIds(prev => new Set([...prev, mId]));
                    }}
                    onAction={(action) => {
                        console.log('Senior action:', action);
                        if (action === 'plan-visit' || action === 'contact') {
                            // Create an appointment task automatically
                            const matchName = topMatch.celebration.title || 'Pårørende'; // Fallback
                            const taskTitle = action === 'plan-visit'
                                ? `Besøg af ${matchName}`
                                : `Ring til ${matchName}`;

                            if (onAddTask) {
                                onAddTask({
                                    title: taskTitle,
                                    period: 'eftermiddag', // Default to afternoon
                                    type: 'appointment',
                                    createdByRole: 'senior', // Self-created via match
                                    createdByName: userName
                                });
                            }

                            // Close match modal
                            const mId = `${topMatch.offer?.id || 'o'}-${topMatch.request?.id || 'r'}`;
                            setDismissedMatchIds(prev => new Set([...prev, mId]));
                        }
                    }}
                />
            )}

            {/* Health Report Modal */}
            <HealthReport
                isOpen={showHealthReport}
                onClose={() => setShowHealthReport(false)}
                symptomLogs={symptomLogs}
                tasks={tasks}
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

                    {/* Period Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('when_question')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: 'morgen', label: 'Morgen', time: 'Kl. 8-11', icon: '☀️' },
                                { key: 'frokost', label: 'Frokost', time: 'Kl. 12-13', icon: '🍽️' },
                                { key: 'eftermiddag', label: 'Eftermiddag', time: 'Kl. 14-17', icon: '🌤️' },
                                { key: 'aften', label: 'Aften', time: 'Kl. 18-21', icon: '🌙' }
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
                                        <div>
                                            <p className={`font-medium ${newTaskPeriod === period.key ? 'text-teal-700' : 'text-slate-700'}`}>
                                                {period.label}
                                            </p>
                                            <p className="text-xs text-slate-400">{period.time}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                        <input
                            type="checkbox"
                            id="recurring-senior"
                            checked={newTaskRecurring}
                            onChange={(e) => setNewTaskRecurring(e.target.checked)}
                            className="w-6 h-6 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="recurring-senior" className="flex-1 font-medium text-slate-700 cursor-pointer">
                            {t('make_daily')}
                        </label>
                    </div>

                    <Button
                        onClick={() => {
                            if (newTaskTitle.trim()) {
                                if (onAddTask) {
                                    onAddTask({
                                        title: newTaskTitle.trim(),
                                        period: newTaskPeriod,
                                        type: 'activity',
                                        recurring: newTaskRecurring
                                    });
                                }
                                setNewTaskTitle('');
                                setNewTaskPeriod('morgen');
                                setNewTaskRecurring(false);
                                setShowAddTaskModal(false);
                            }
                        }}
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
                    seniorName={userName || 'Senior'}
                    onDismiss={() => setActiveMatch(null)}
                    onAction={(action) => {
                        // Create task based on action type
                        const { celebration } = activeMatch;
                        let taskTitle = '';

                        switch (action) {
                            case 'call':
                                taskTitle = `📞 Ring med ${relativeName}`;
                                break;
                            case 'plan-visit':
                                taskTitle = `☕ Besøg fra ${relativeName}`;
                                break;
                            case 'plan-meal':
                                taskTitle = `🍳 Lav mad med ${relativeName}`;
                                break;
                            case 'plan-transport':
                                taskTitle = `🚗 Tur med ${relativeName}`;
                                break;
                            case 'plan-garden':
                                taskTitle = `🌿 Havearbejde med ${relativeName}`;
                                break;
                            default:
                                taskTitle = celebration?.title || `Aktivitet med ${relativeName}`;
                        }

                        // Create the task
                        if (onAddTask && taskTitle) {
                            onAddTask({
                                title: taskTitle,
                                time: '10:00',
                                period: 'morgen',
                                type: 'appointment',
                                createdByRole: 'senior', // Self-created via match
                                createdByName: userName
                            });

                            // Dismiss the match so it doesn't reappear
                            const offerId = activeMatch.offer?.docId || activeMatch.offer?.id || 'none';
                            const requestId = activeMatch.request?.docId || activeMatch.request?.id || 'none';
                            const matchId = `${offerId}-${requestId}`;
                            setDismissedMatchIds(prev => new Set([...prev, matchId]));

                            alert(t('task_created_alert', { title: taskTitle }));
                        }
                        setActiveMatch(null);
                    }}
                />
            )}
        </div >
    );
};

export default SeniorView;
