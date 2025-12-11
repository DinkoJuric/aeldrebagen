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
    Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { SYMPTOMS_LIST } from '../data/constants';

export const SeniorView = ({ tasks, toggleTask, updateStatus, addSymptom }) => {
    const [showCallModal, setShowCallModal] = useState(false);
    const [showSymptomModal, setShowSymptomModal] = useState(false);
    const [activePeriod, setActivePeriod] = useState('morgen');

    // Reward Logic - unlock photo when morning tasks complete
    const morningTasksTotal = tasks.filter(t => t.period === 'morgen').length;
    const morningTasksDone = tasks.filter(t => t.period === 'morgen' && t.completed).length;
    const isMorningComplete = morningTasksTotal > 0 && morningTasksTotal === morningTasksDone;

    // Dynamic greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Godmorgen' : hour < 18 ? 'Goddag' : 'Godaften';

    // Get current date in Danish format
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = new Date().toLocaleDateString('da-DK', dateOptions);

    // Render task section by period
    const renderTaskSection = (periodTitle, periodKey, icon) => {
        const periodTasks = tasks.filter(t => t.period === periodKey);
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
        <div className="flex flex-col h-full bg-stone-50 relative">
            {/* Header */}
            <header className="p-6 bg-white shadow-sm rounded-b-3xl z-10">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-stone-800">{greeting}, Birthe</h1>
                    <div className="bg-teal-100 p-2 rounded-full">
                        <Sun className="text-teal-600 w-8 h-8" />
                    </div>
                </div>
                <p className="text-stone-500 text-lg capitalize">{dateString}</p>
            </header>

            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">

                {/* Reward Card (Behavioral Hook) */}
                <div className={`
                    rounded-3xl p-6 mb-6 transition-all duration-500 border-2 overflow-hidden relative
                    ${isMorningComplete ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-dashed border-stone-300'}
                `}>
                    {isMorningComplete ? (
                        <div className="animate-fade-in text-center">
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
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-4 opacity-60">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-2">
                                <ImageIcon className="w-8 h-8 text-stone-400" />
                            </div>
                            <h3 className="font-bold text-stone-500 text-lg">Dagens Billede</h3>
                            <p className="text-stone-400 text-sm">Gør din morgen færdig for at se billedet</p>
                        </div>
                    )}
                </div>

                {/* Check-in Status */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-teal-100 mb-8">
                    <h2 className="text-xl font-semibold text-stone-800 mb-4">Hvordan har du det?</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="primary"
                            size="large"
                            className="w-full h-32"
                            onClick={() => updateStatus('checked-in')}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle className="w-10 h-10" />
                                <span>Jeg har det godt</span>
                            </div>
                        </Button>

                        <Button
                            variant="secondary"
                            size="large"
                            className="w-full h-32 bg-orange-50 text-orange-800 border-2 border-orange-100 hover:bg-orange-100"
                            onClick={() => setShowSymptomModal(true)}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Heart className="w-10 h-10 text-orange-500" />
                                <span>Jeg har ondt</span>
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

            </main>

            {/* Emergency Contact Footer */}
            <footer className="p-4 bg-white border-t border-stone-200">
                <Button variant="danger" size="large" className="w-full" onClick={() => setShowCallModal(true)}>
                    <div className="flex items-center gap-3">
                        <Phone className="w-8 h-8" />
                        <span>Ring til Louise</span>
                    </div>
                </Button>
            </footer>

            {/* Symptom Modal */}
            <Modal
                isOpen={showSymptomModal}
                onClose={() => setShowSymptomModal(false)}
                title="Hvor har du ondt?"
            >
                <div className="grid grid-cols-2 gap-4">
                    {SYMPTOMS_LIST.map(sym => (
                        <button
                            key={sym.id}
                            onClick={() => {
                                addSymptom(sym);
                                setShowSymptomModal(false);
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
            </Modal>

            {/* Call Modal */}
            {showCallModal && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-slide-up">
                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="w-10 h-10 text-rose-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">Ringer op...</h3>
                        <p className="text-stone-500 mb-8">Ringer til Louise</p>
                        <Button variant="danger" onClick={() => setShowCallModal(false)}>Afslut opkald</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeniorView;
