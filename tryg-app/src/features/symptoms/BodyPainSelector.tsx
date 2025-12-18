import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SeverityLevel {
    id: 'mild' | 'moderate' | 'severe';
    label: string;
    emoji: string;
    color: string;
}

export interface BodyRegion {
    id: string;
    label: string;
    emoji: string;
    severity?: Omit<SeverityLevel, 'color'>; // When selected, we store severity details
}

// Body regions for pain mapping - ordered anatomically (top → bottom)
// Returns localized labels using translation function
export const getBodyRegions = (t: (key: string) => string): BodyRegion[] => [
    { id: 'head', label: t('body_head'), emoji: '🧠' },
    { id: 'neck', label: t('body_neck'), emoji: '🦴' },
    { id: 'chest', label: t('body_chest'), emoji: '❤️' },
    { id: 'back', label: t('body_back'), emoji: '🔙' },
    { id: 'stomach', label: t('body_stomach'), emoji: '🤢' },
    { id: 'leftArm', label: t('body_left_arm'), emoji: '💪' },
    { id: 'rightArm', label: t('body_right_arm'), emoji: '💪' },
    { id: 'leftLeg', label: t('body_left_leg'), emoji: '🦵' },
    { id: 'rightLeg', label: t('body_right_leg'), emoji: '🦵' },
];

// Pain severity levels - simple 3-level scale (localized)
export const getSeverityLevels = (t: (key: string) => string): SeverityLevel[] => [
    { id: 'mild', label: t('severity_mild'), emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: t('severity_moderate'), emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: t('severity_severe'), emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

// Keep the old exports for backwards compatibility (Danish fallback)
export const BODY_REGIONS: BodyRegion[] = [
    { id: 'head', label: 'Hoved', emoji: '🧠' },
    { id: 'neck', label: 'Nakke', emoji: '🦴' },
    { id: 'chest', label: 'Bryst', emoji: '❤️' },
    { id: 'back', label: 'Ryg', emoji: '🔙' },
    { id: 'stomach', label: 'Mave', emoji: '🤢' },
    { id: 'leftArm', label: 'Venstre arm', emoji: '💪' },
    { id: 'rightArm', label: 'Højre arm', emoji: '💪' },
    { id: 'leftLeg', label: 'Venstre ben', emoji: '🦵' },
    { id: 'rightLeg', label: 'Højre ben', emoji: '🦵' },
];

export const SEVERITY_LEVELS: SeverityLevel[] = [
    { id: 'mild', label: 'Lidt', emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: 'Noget', emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: 'Meget', emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

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

// Get label for body region by ID
export const getBodyRegionLabel = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.label : id;
};

// Get emoji for body region by ID
export const getBodyRegionEmoji = (id: string) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.emoji : '📍';
};

// Get severity info by ID
export const getSeverityInfo = (id: string) => {
    return SEVERITY_LEVELS.find(s => s.id === id);
};

export default BodyPainSelector;
