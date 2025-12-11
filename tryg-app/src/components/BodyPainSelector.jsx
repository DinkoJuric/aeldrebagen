import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Body regions for pain mapping - senior-friendly large touch targets
const BODY_REGIONS = [
    { id: 'head', label: 'Hoved', emoji: '🧠' },
    { id: 'neck', label: 'Nakke', emoji: '🦴' },
    { id: 'chest', label: 'Bryst', emoji: '❤️' },
    { id: 'leftArm', label: 'Venstre arm', emoji: '💪' },
    { id: 'rightArm', label: 'Højre arm', emoji: '💪' },
    { id: 'stomach', label: 'Mave', emoji: '🤢' },
    { id: 'back', label: 'Ryg', emoji: '🔙' },
    { id: 'leftLeg', label: 'Venstre ben', emoji: '🦵' },
    { id: 'rightLeg', label: 'Højre ben', emoji: '🦵' },
];

// Pain severity levels - simple 3-level scale (NOT clinical 1-10)
const SEVERITY_LEVELS = [
    { id: 'mild', label: 'Lidt', emoji: '🙂', color: 'bg-green-100 border-green-400 text-green-700' },
    { id: 'moderate', label: 'Noget', emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
    { id: 'severe', label: 'Meget', emoji: '😣', color: 'bg-rose-100 border-rose-400 text-rose-700' },
];

// Two-step selector: body location → severity
export const BodyPainSelector = ({ onSelectLocation, onBack }) => {
    const [step, setStep] = useState(1); // 1 = location, 2 = severity
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedSeverity, setSelectedSeverity] = useState(null);

    const handleLocationSelect = (region) => {
        setSelectedLocation(region);
        setStep(2); // Move to severity selection
    };

    const handleSeveritySelect = (severity) => {
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
                        Hvor gør det ondt?
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {BODY_REGIONS.map(region => (
                            <button
                                key={region.id}
                                onClick={() => handleLocationSelect(region)}
                                className="p-4 rounded-2xl border-2 transition-all duration-200
                                    flex items-center gap-3 text-left
                                    bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50
                                    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                                aria-label={`Vælg ${region.label}`}
                            >
                                <span className="text-2xl">{region.emoji}</span>
                                <span className="font-semibold text-stone-700">{region.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label="Gå tilbage til symptomvalg"
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        Tilbage
                    </button>
                </>
            ) : (
                // Step 2: Pain severity selection
                <>
                    <div className="text-center mb-4">
                        <span className="text-3xl">{selectedLocation.emoji}</span>
                        <p className="text-lg text-stone-600 mt-2">
                            Hvor ondt gør det i <span className="font-bold text-rose-600">{selectedLocation.label.toLowerCase()}</span>?
                        </p>
                    </div>

                    <div className="space-y-3 mb-4">
                        {SEVERITY_LEVELS.map(level => (
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
                                aria-label={`Smerte niveau: ${level.label}`}
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
                            aria-label="Bekræft symptomregistrering"
                        >
                            Bekræft
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        onClick={handleBackToLocation}
                        className="w-full p-3 text-stone-500 text-sm hover:text-stone-700 
                            focus:outline-none focus:ring-2 focus:ring-stone-300"
                        aria-label="Vælg et andet sted"
                    >
                        <ChevronLeft className="w-4 h-4 inline mr-1" />
                        Vælg et andet sted
                    </button>
                </>
            )}
        </div>
    );
};

// Get label for body region by ID
export const getBodyRegionLabel = (id) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.label : id;
};

// Get emoji for body region by ID
export const getBodyRegionEmoji = (id) => {
    const region = BODY_REGIONS.find(r => r.id === id);
    return region ? region.emoji : '📍';
};

// Get severity info by ID
export const getSeverityInfo = (id) => {
    return SEVERITY_LEVELS.find(s => s.id === id);
};

export { BODY_REGIONS, SEVERITY_LEVELS };
export default BodyPainSelector;
