import React, { useState } from 'react';
import { Heart, HelpCircle, Phone, ShoppingCart, Car, ChefHat, Ear, ChevronRight, X } from 'lucide-react';

// What senior can offer to family
const OFFERS = [
    { id: 'listen', label: 'Jeg kan hjælpe med at lytte', emoji: '👂', icon: Ear },
    { id: 'recipe', label: 'Jeg har en god opskrift', emoji: '👩‍🍳', icon: ChefHat },
    { id: 'stories', label: 'Vil gerne høre om jeres dag', emoji: '💬', icon: Heart },
];

// What senior can request from family
const REQUESTS = [
    { id: 'call', label: 'Kan nogen ringe mig i dag?', emoji: '📞', icon: Phone },
    { id: 'shopping', label: 'Hjælp til indkøb denne uge', emoji: '🛒', icon: ShoppingCart },
    { id: 'escort', label: 'Følgeskab til lægen', emoji: '🚗', icon: Car },
];

// Dignity-preserving help exchange - senior contributes, not just receives
export const HelpExchange = ({
    onOffer,
    onRequest,
    onRemoveOffer,
    onRemoveRequest,
    activeOffers = [],
    activeRequests = []
}) => {
    const [mode, setMode] = useState(null); // 'offer' or 'request'
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSelect = (item, type) => {
        if (type === 'offer') {
            onOffer?.(item);
            setSuccessMessage('✨ Familie kan nu se, at du gerne vil hjælpe');
        } else {
            onRequest?.(item);
            setSuccessMessage('💕 Familie har modtaget din besked');
        }
        setShowSuccess(true);
        setMode(null);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    if (showSuccess) {
        return (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                <p className="text-teal-700 font-medium text-lg">{successMessage}</p>
            </div>
        );
    }

    if (mode === null) {
        return (
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-stone-700 font-bold text-center mb-2">Familie-udveksling</h3>

                <button
                    onClick={() => setMode('offer')}
                    className="w-full p-4 bg-teal-50 rounded-xl border-2 border-teal-200 
                        hover:bg-teal-100 transition-colors flex items-center gap-3
                        focus:outline-none focus:ring-2 focus:ring-teal-400"
                    aria-label="Tilbyd at hjælpe"
                >
                    <div className="p-2 bg-teal-100 rounded-full">
                        <Heart className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-teal-700">Jeg kan tilbyde...</p>
                        <p className="text-sm text-teal-600">Del hvad du gerne vil bidrage med</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-teal-400" />
                </button>

                <button
                    onClick={() => setMode('request')}
                    className="w-full p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200 
                        hover:bg-indigo-100 transition-colors flex items-center gap-3
                        focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Bed om hjælp"
                >
                    <div className="p-2 bg-indigo-100 rounded-full">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-indigo-700">Jeg kunne godt bruge...</p>
                        <p className="text-sm text-indigo-600">Fortæl hvad du har brug for</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-400" />
                </button>

                {/* Show active items with dismiss buttons */}
                {(activeOffers.length > 0 || activeRequests.length > 0) && (
                    <div className="pt-2 mt-2 border-t border-stone-100">
                        <p className="text-xs text-stone-400 mb-2">Aktive (tryk for at fjerne):</p>
                        <div className="flex flex-wrap gap-2">
                            {activeOffers.map((item) => (
                                <button
                                    key={item.docId}
                                    onClick={() => {
                                        console.log('[HelpExchange] Removing offer:', item.docId, 'onRemoveOffer:', typeof onRemoveOffer);
                                        onRemoveOffer?.(item.docId);
                                    }}
                                    className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full 
                                        flex items-center gap-1 hover:bg-teal-200 transition-colors
                                        focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    aria-label={`Fjern ${item.label}`}
                                >
                                    {item.emoji} {item.label?.split(' ').slice(0, 2).join(' ')}...
                                    <X className="w-3 h-3" />
                                </button>
                            ))}
                            {activeRequests.map((item) => (
                                <button
                                    key={item.docId}
                                    onClick={() => onRemoveRequest?.(item.docId)}
                                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full 
                                        flex items-center gap-1 hover:bg-indigo-200 transition-colors
                                        focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    aria-label={`Fjern ${item.label}`}
                                >
                                    {item.emoji} {item.label?.split(' ').slice(0, 2).join(' ')}...
                                    <X className="w-3 h-3" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Show offer or request options
    const items = mode === 'offer' ? OFFERS : REQUESTS;
    const colors = mode === 'offer'
        ? { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'text-teal-600' }
        : { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: 'text-indigo-600' };

    return (
        <div className={`${colors.bg} border ${colors.border} rounded-2xl p-4 space-y-3`}>
            <h3 className={`${colors.text} font-bold text-center`}>
                {mode === 'offer' ? 'Hvad vil du gerne tilbyde?' : 'Hvad har du brug for?'}
            </h3>

            {items.map(item => (
                <button
                    key={item.id}
                    onClick={() => handleSelect(item, mode)}
                    className={`w-full p-4 bg-white rounded-xl border-2 ${colors.border}
                        hover:shadow-md transition-all flex items-center gap-3
                        focus:outline-none focus:ring-2 focus:ring-offset-1`}
                    aria-label={item.label}
                >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className={`font-medium ${colors.text}`}>{item.label}</span>
                </button>
            ))}

            <button
                onClick={() => setMode(null)}
                className="w-full p-2 text-stone-500 text-sm hover:text-stone-700"
            >
                ← Tilbage
            </button>
        </div>
    );
};

export { OFFERS, REQUESTS };
export default HelpExchange;
