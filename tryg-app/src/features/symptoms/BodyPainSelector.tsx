import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
    BodyRegion,
    SeverityLevel,
    getBodyRegions,
    getSeverityLevels
} from './constants';

interface BodyPainSelectorProps {
    onSelectLocation: (location: BodyRegion) => void;
    onBack?: () => void;
}

// Two-step selector: body location → severity
export const BodyPainSelector: React.FC<BodyPainSelectorProps> = ({ onSelectLocation, onBack }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1 = location, 2 = severity
    const [selectedLocation, setSelectedLocation] = useState<BodyRegion | null>(null);
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);

    // Get localized regions and severity levels
    const bodyRegions = getBodyRegions(t);
    const severityLevels = getSeverityLevels(t);

    const handleLocationSelect = (region: BodyRegion) => {
        setSelectedLocation(region);
        setStep(2); // Move to severity selection
    };

    const handleSeveritySelect = (severity: SeverityLevel) => {
        setSelectedSeverity(severity);
    };

    const handleConfirm = () => {
        if (selectedLocation && selectedSeverity) {
            onSelectLocation({
                id: selectedLocation.id,
                label: selectedLocation.label,
                emoji: selectedLocation.emoji,
                severity: {
                    id: selectedSeverity.id,
                    label: selectedSeverity.label,
                    emoji: selectedSeverity.emoji
                }
            });
        }
    };

    const handleBackToLocation = () => {
        setStep(1);
        setSelectedSeverity(null);
    };

    return (
        <div className="space-y-4">
            {step === 1 ? (
                // Step 1: Body location selection
                <>
                    <p className="text-lg text-center text-stone-600 mb-4">
                        {t('where_does_it_hurt')}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {bodyRegions.map(region => (
                            <button
                                key={region.id}
                                onClick={() => handleLocationSelect(region)}
                                className="p-4 rounded-2xl border-2 transition-all duration-200
                                    flex items-center gap-3 text-left
                                    bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50
                                    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                                aria-label={t('select_location', { label: region.label })}
                            >
                                <span className="text-2xl">{region.emoji}</span>
                                <span className="font-semibold text-stone-700">{region.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label={t('go_back_symptom_selection')}
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        {t('back')}
                    </button>
                </>
            ) : (
                // Step 2: Pain severity selection
                <>
                    <div className="text-center mb-4">
                        <span className="text-3xl">{selectedLocation?.emoji}</span>
                        <p className="text-lg text-stone-600 mt-2">
                            {t('pain_how_much', { location: selectedLocation?.label.toLowerCase() })}
                        </p>
                    </div>

                    <div className="space-y-3 mb-4">
                        {severityLevels.map(level => (
                            <button
                                key={level.id}
                                onClick={() => handleSeveritySelect(level)}
                                className={`
                                    w-full p-5 rounded-2xl border-2 transition-all duration-200
                                    flex items-center justify-center gap-4 text-xl font-bold
                                    focus:outline-none focus:ring-2 focus:ring-offset-2
                                    ${selectedSeverity?.id === level.id
                                        ? `${level.color} ring-2 ring-offset-1`
                                        : 'bg-white border-stone-200 hover:bg-stone-50'
                                    }
                                `}
                                aria-label={t('pain_level_label', { level: level.label })}
                            >
                                <span className="text-4xl">{level.emoji}</span>
                                <span>{level.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Confirm button */}
                    {selectedSeverity && (
                        <button
                            onClick={handleConfirm}
                            className="w-full p-4 bg-rose-500 text-white rounded-2xl font-bold text-lg 
                                flex items-center justify-center gap-2 hover:bg-rose-600 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                            aria-label={t('confirm')}
                        >
                            {t('confirm')}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={handleBackToLocation}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 
                            focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label={t('select_another_location')}
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        {t('select_another_location')}
                    </button>
                </>
            )}
        </div>
    );
};



export default BodyPainSelector;
