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
    ChevronUp
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { FamilyStatusCard } from './FamilyStatusCard';
import { ThinkingOfYouButton } from './ThinkingOfYou';
import { BodyPainSelector } from './BodyPainSelector';
import { MemoryTrigger } from './WeeklyQuestion';
import { WeeklyQuestionWidget, WeeklyQuestionModal } from './WeeklyQuestionWidget';
import { HelpExchange } from './HelpExchange';
import { BottomNavigation } from './BottomNavigation';
import { SYMPTOMS_LIST } from '../data/constants';
import { FEATURES } from '../config/features';

export const SeniorView = ({
    tasks, toggleTask, updateStatus, addSymptom, familyStatus, statusLastUpdated, onSendPing,
    weeklyAnswers, onWeeklyAnswer, helpOffers, helpRequests, onHelpOffer, onHelpRequest,
    userName = 'Senior', relativeName = 'Familie'
}) => {
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [showWeeklyModal, setShowWeeklyModal] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [activePeriod, setActivePeriod] = useState('morgen');
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'family'

    // Two-step symptom flow: symptom type → body location (for pain)
    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [showBodySelector, setShowBodySelector] = useState(false);

    // Reward Logic - unlock photo when ALL tasks complete
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const allTasksComplete = totalTasks > 0 && totalTasks === completedTasks;

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Godmorgen' : hour < 18 ? 'Goddag' : 'Godaften';

    // Get current date in Danish format
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = new Date().toLocaleDateString('da-DK', dateOptions);

    // Render task section by period (only incomplete tasks)
    const renderTaskSection = (periodTitle, periodKey, icon) => {
        const periodTasks = tasks.filter(t => t.period === periodKey && !t.completed);
        if (periodTasks.length === 0) return null;

        const isActive = activePeriod === periodKey;

        return (
            <div className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                <div
                    className="flex items-center gap-2 mb-4 cursor-pointer"
                    onClick={() => setActivePeriod(periodKey)}
                >
                    {icon}
                    <h2 className="text-xl font-bold text-stone-800">{periodTitle}</h2>
                    {!isActive && <span className="text-sm text-stone-400">(Tryk for at se)</span>}
                </div>

                {isActive && (
                    <div className="space-y-4 mb-8">
                        {periodTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`
                                    relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                                    ${task.completed
                                        ? 'bg-stone-100 border-stone-200'
                                        : 'bg-white border-stone-200 shadow-sm hover:border-teal-400'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Pictogram Container */}
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner
                                            ${task.completed ? 'bg-stone-200 text-stone-400' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            {task.type === 'medication' && <Pill className="w-8 h-8" />}
                                            {task.type === 'hydration' && <Activity className="w-8 h-8" />}
                                            {task.type === 'activity' && <Sun className="w-8 h-8" />}
                                            {task.type === 'appointment' && <Clock className="w-8 h-8" />}
                                        </div>

                                        <div>
                                            <h3 className={`text-xl font-bold ${task.completed ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-stone-500 font-medium">{task.time}</p>
                                        </div>
                                    </div>

                                    {/* Checkbox */}
                                    <div className={`
                                        w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors
                                        ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-stone-200 bg-white'}
                                    `}>
                                        {task.completed && <CheckCircle className="text-white w-8 h-8" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-stone-50 relative overflow-hidden">
            {/* Header - COMPACT */}
            <header className="px-4 py-2 bg-white shadow-sm rounded-b-3xl z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-stone-800">{greeting}, {userName}</h1>
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
                    <span className="text-teal-600 font-medium">· Alt er vel ✨</span>
                </div>
            </header>

            {/* Main Content - Scrollable with padding for bottom nav */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">

                {/* ===== DAILY TAB ===== */}
                {activeTab === 'daily' && (
                    <>
                        {/* Reward Card (Behavioral Hook) - Hidden until ALL tasks complete */}
                        {allTasksComplete ? (
                            <div className="rounded-3xl p-6 mb-6 bg-indigo-600 border-2 border-indigo-600 text-white animate-fade-in">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <ImageIcon className="w-6 h-6 text-indigo-200" />
                                        <span className="font-bold text-indigo-100 uppercase tracking-widest text-sm">Dagens Billede</span>
                                    </div>
                                    <div className="w-full h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-3 overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                                        <span className="text-white/80 text-6xl">🌳👨‍👩‍👧‍👦</span>
                                    </div>
                                    <p className="font-bold text-lg">Godt klaret, Farmor! ❤️</p>
                                    <p className="text-indigo-200 text-sm">Her er et billede fra vores tur i skoven.</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Check-in Status */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                            <h2 className="text-xl font-semibold text-stone-800 mb-4">Hvordan har du det?</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="primary"
                                    size="large"
                                    className="w-full min-h-32 py-4"
                                    onClick={() => updateStatus('checked-in')}
                                >
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <CheckCircle className="w-10 h-10 shrink-0" />
                                        <span className="text-sm leading-tight">Jeg har det godt</span>
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
                                        <span className="text-sm leading-tight">Jeg har ondt</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Contextual Task Lists */}
                        {renderTaskSection('Morgen (Kl. 8-11)', 'morgen', <Coffee className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection('Frokost (Kl. 12-13)', 'frokost', <Sun className="w-6 h-6 text-stone-600" />)}
                        <div className="h-px bg-stone-200 my-4" />
                        {renderTaskSection('Eftermiddag (Kl. 14-17)', 'eftermiddag', <Moon className="w-6 h-6 text-stone-600" />)}

                        {/* Completed Tasks - Collapsible Section */}
                        {completedTasks > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                    className="w-full flex items-center justify-between p-4 bg-teal-50 rounded-2xl border-2 border-teal-100 hover:bg-teal-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-teal-600" />
                                        <span className="font-bold text-teal-800">Udførte opgaver ({completedTasks})</span>
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
                    </>
                )}

                {/* ===== FAMILY TAB ===== */}
                {(!FEATURES.tabbedLayout || activeTab === 'family') && (
                    <>
                        {/* Family Status - toggle with FEATURES.familyStatusCard */}
                        {FEATURES.familyStatusCard && (
                            <FamilyStatusCard familyStatus={familyStatus} familyName={relativeName} lastUpdated={statusLastUpdated} />
                        )}

                        {/* Thinking of You - toggle with FEATURES.thinkingOfYou */}
                        {FEATURES.thinkingOfYou && (
                            <ThinkingOfYouButton onSendPing={onSendPing} fromName={userName} />
                        )}

                        {/* Weekly Question now in header - removed from here */}

                        {/* Memory Trigger - toggle with FEATURES.memoryTriggers */}
                        {FEATURES.memoryTriggers && <MemoryTrigger />}

                        {/* Dignity-Preserving Help Exchange - toggle with FEATURES.helpExchange */}
                        {FEATURES.helpExchange && (
                            <HelpExchange
                                onOffer={onHelpOffer}
                                onRequest={onHelpRequest}
                                activeOffers={helpOffers}
                                activeRequests={helpRequests}
                            />
                        )}
                    </>
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
                title={showBodySelector ? "Hvor gør det ondt?" : "Hvordan har du det?"}
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
            <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCall={() => setShowCallModal(true)}
            />

            {/* Call Modal */}
            {
                showCallModal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-10 h-10 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-stone-800 mb-2">Ringer op...</h3>
                            <p className="text-stone-500 mb-8">Ringer til {relativeName}</p>
                            <Button variant="danger" onClick={() => setShowCallModal(false)}>Afslut opkald</Button>
                        </div>
                    </div>
                )
            }

            {/* Weekly Question Modal */}
            <WeeklyQuestionModal
                isOpen={showWeeklyModal}
                onClose={() => setShowWeeklyModal(false)}
                answers={weeklyAnswers}
                onAnswer={onWeeklyAnswer}
                userName={userName}
            />
        </div >
    );
};

export default SeniorView;
