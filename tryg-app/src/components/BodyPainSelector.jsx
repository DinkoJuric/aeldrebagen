import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// Body regions for pain mapping - senior-friendly large touch targets
const BODY_REGIONS = [
    { id: 'head', label: 'Hoved', emoji: '🧠', yPos: 'top-[5%]', xPos: 'left-1/2 -translate-x-1/2' },
    { id: 'neck', label: 'Nakke', emoji: '🦴', yPos: 'top-[15%]', xPos: 'left-1/2 -translate-x-1/2' },
    { id: 'chest', label: 'Bryst', emoji: '❤️', yPos: 'top-[25%]', xPos: 'left-1/2 -translate-x-1/2' },
    { id: 'leftArm', label: 'Venstre arm', emoji: '💪', yPos: 'top-[30%]', xPos: 'left-[15%]' },
    { id: 'rightArm', label: 'Højre arm', emoji: '💪', yPos: 'top-[30%]', xPos: 'right-[15%]' },
    { id: 'stomach', label: 'Mave', emoji: '🫃', yPos: 'top-[45%]', xPos: 'left-1/2 -translate-x-1/2' },
    { id: 'back', label: 'Ryg', emoji: '🔙', yPos: 'top-[40%]', xPos: 'left-[25%]' },
    { id: 'leftLeg', label: 'Venstre ben', emoji: '🦵', yPos: 'top-[70%]', xPos: 'left-[35%]' },
    { id: 'rightLeg', label: 'Højre ben', emoji: '🦵', yPos: 'top-[70%]', xPos: 'right-[35%]' },
];

// Simple list-based selector (more accessible for seniors than body silhouette)
export const BodyPainSelector = ({ onSelectLocation, onBack }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleSelect = (region) => {
        setSelectedLocation(region.id);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            const region = BODY_REGIONS.find(r => r.id === selectedLocation);
            onSelectLocation({
                id: selectedLocation,
                label: region.label,
                emoji: region.emoji
            });
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-lg text-center text-stone-600 mb-4">
                Hvor gør det ondt?
            </p>

            {/* Large touch-friendly list of body parts */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {BODY_REGIONS.map(region => (
                    <button
                        key={region.id}
                        onClick={() => handleSelect(region)}
                        className={`
                            p-4 rounded-2xl border-2 transition-all duration-200
                            flex items-center gap-3 text-left
                            ${selectedLocation === region.id
                                ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-300'
                                : 'bg-white border-stone-200 hover:border-rose-300 hover:bg-rose-50'
                            }
                        `}
                    >
                        <span className="text-2xl">{region.emoji}</span>
                        <span className={`font-semibold ${selectedLocation === region.id ? 'text-rose-700' : 'text-stone-700'}`}>
                            {region.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Confirm button - only show when selection made */}
            {selectedLocation && (
                <button
                    onClick={handleConfirm}
                    className="w-full p-4 bg-rose-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors animate-fade-in"
                >
                    Bekræft
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Back button */}
            <button
                onClick={onBack}
                className="w-full p-3 text-stone-500 text-sm hover:text-stone-700"
            >
                ← Tilbage
            </button>
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

export { BODY_REGIONS };
export default BodyPainSelector;
