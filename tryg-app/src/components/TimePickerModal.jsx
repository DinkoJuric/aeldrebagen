import React, { useState } from 'react';
import { X, Clock, Phone, Calendar } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * Time Picker Modal for scheduling tasks from match actions
 */
export const TimePickerModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Hvornår vil du ringe?',
    actionLabel = 'Ring til',
    seniorName = 'Senior'
}) => {
    const [selectedPeriod, setSelectedPeriod] = useState('morgen');

    const PERIODS = [
        { id: 'morgen', label: 'Morgen', time: '09:00', emoji: '🌅' },
        { id: 'formiddag', label: 'Formiddag', time: '11:00', emoji: '☀️' },
        { id: 'eftermiddag', label: 'Eftermiddag', time: '14:00', emoji: '🌤️' },
        { id: 'aften', label: 'Aften', time: '18:00', emoji: '🌙' }
    ];

    if (!isOpen) return null;

    const handleConfirm = () => {
        const period = PERIODS.find(p => p.id === selectedPeriod);
        onConfirm({
            period: selectedPeriod,
            time: period?.time || '10:00',
            label: period?.label || 'Morgen'
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                >
                    <X className="w-5 h-5 text-stone-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Phone className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-800">{title}</h2>
                    <p className="text-stone-500 text-sm mt-1">
                        {actionLabel} {seniorName}
                    </p>
                </div>

                {/* Time Period Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {PERIODS.map(period => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={`
                                p-4 rounded-xl border-2 transition-all text-left
                                ${selectedPeriod === period.id
                                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                }
                            `}
                        >
                            <div className="text-2xl mb-1">{period.emoji}</div>
                            <div className="font-bold text-stone-800">{period.label}</div>
                            <div className="text-xs text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {period.time}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Confirm Button */}
                <Button
                    className="w-full"
                    onClick={handleConfirm}
                >
                    📞 Opret opgave
                </Button>

                <button
                    onClick={onClose}
                    className="w-full text-sm text-stone-500 hover:text-stone-700 py-3 mt-2"
                >
                    Annuller
                </button>
            </div>
        </div>
    );
};

export default TimePickerModal;
