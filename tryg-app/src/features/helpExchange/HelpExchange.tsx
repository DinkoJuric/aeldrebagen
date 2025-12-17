import React, { useState } from 'react';
import { HandHeart, X, Plus } from 'lucide-react';
import { SENIOR_OFFERS, SENIOR_REQUESTS, ItemTemplate } from './config';
import { Pictogram } from '../../components/ui/Pictogram';
import { HelpOffer, HelpRequest } from './useHelpExchange';

interface HelpExchangeProps {
    onOffer?: (item: ItemTemplate) => void;
    onRequest?: (item: ItemTemplate) => void;
    onRemoveOffer?: (docId: string) => void;
    onRemoveRequest?: (docId: string) => void;
    activeOffers?: HelpOffer[];
    activeRequests?: HelpRequest[];
    relativeOffers?: HelpOffer[];
    relativeRequests?: HelpRequest[];
    seniorName?: string;
}

// Dashboard-style HelpExchange for Senior (aligned with RelativeView)
export const HelpExchange: React.FC<HelpExchangeProps> = ({
    onOffer,
    onRequest,
    onRemoveOffer,
    onRemoveRequest,
    activeOffers = [],
    activeRequests = [],
    relativeOffers = [],
    relativeRequests = [],
    seniorName = 'Senior'
}) => {
    // Pure "Dumb" Component - relies on props
    const [showOfferPicker, setShowOfferPicker] = useState(false);
    const [showRequestPicker, setShowRequestPicker] = useState(false);

    // Helpers to render icon or emoji
    const renderIcon = (item: ItemTemplate | HelpOffer | HelpRequest, size: 'md' | 'lg' | 'xl' = 'md') => {
        if ('sprite' in item && item.sprite) {
            const dims = size === 'lg' ? 'w-10 h-10' : size === 'xl' ? 'w-16 h-16' : 'w-8 h-8';
            return <Pictogram sheet={item.sprite.sheet} position={item.sprite.pos} className={`${dims} shrink-0`} />;
        }
        return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>{item.emoji}</span>;
    };

    // Filter out already active items
    const availableOffers = SENIOR_OFFERS.filter(o => !activeOffers.some(active => active.id === o.id));
    const availableRequests = SENIOR_REQUESTS.filter(r => !activeRequests.some(active => active.id === r.id));

    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-5">
            <h3 className="text-stone-700 font-bold flex items-center gap-2">
                <HandHeart className="w-5 h-5 text-teal-600" />
                Familie-Børsen
            </h3>

            {/* RELATIVES' ENTRIES - Show what family members have added */}
            {(relativeOffers.length > 0 || relativeRequests.length > 0) && (
                <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Fra familien:</p>
                    <div className="flex flex-wrap gap-2">
                        {relativeOffers.map((offer, i) => (
                            <span key={`ro-${i}`} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full" title={`Fra: ${offer.createdByName}`}>
                                💚 {offer.label} <span className="text-indigo-400 text-xs">({offer.createdByName})</span>
                            </span>
                        ))}
                        {relativeRequests.map((req, i) => (
                            <span key={`rr-${i}`} className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full" title={`Fra: ${req.createdByName}`}>
                                💜 {req.label} <span className="text-purple-400 text-xs">({req.createdByName})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* OFFERS SECTION */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-500 uppercase tracking-wide">Du tilbyder:</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Active Offers */}
                    {activeOffers.map((item) => (
                        <span
                            key={item.docId}
                            className="bg-teal-500 text-white pl-1.5 pr-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            {renderIcon(item, 'md')}
                            <span className="font-medium text-sm">{item.label}</span>
                            <button
                                onClick={() => onRemoveOffer?.(item.docId)}
                                className="ml-1 p-0.5 hover:bg-teal-600 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </span>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={() => setShowOfferPicker(!showOfferPicker)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-dashed transition-all
                            ${showOfferPicker
                                ? 'bg-teal-50 border-teal-300 text-teal-700'
                                : 'border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'}
                        `}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm">Tilbyd</span>
                    </button>
                </div>

                {/* Offer Picker */}
                {showOfferPicker && (
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 animate-in slide-in-from-top-2">
                        <p className="text-xs text-stone-500 mb-2 font-medium">Vælg hvad du vil tilbyde:</p>
                        <div className="flex flex-wrap gap-2">
                            {availableOffers.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onOffer?.(item);
                                        setShowOfferPicker(false);
                                    }}
                                    className="bg-white border border-stone-200 hover:border-teal-400 hover:bg-teal-50 px-3 py-2 rounded-lg 
                                        flex items-center gap-2 text-sm transition-colors text-left shadow-sm"
                                >
                                    {renderIcon(item, 'lg')}
                                    <span className="text-stone-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* SEPARATOR */}
            <div className="border-t border-stone-100"></div>

            {/* REQUESTS SECTION */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-500 uppercase tracking-wide">Du ønsker:</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Active Requests */}
                    {activeRequests.map((item) => (
                        <span
                            key={item.docId}
                            className="bg-indigo-500 text-white pl-1.5 pr-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200"
                        >
                            {renderIcon(item, 'md')}
                            <span className="font-medium text-sm">{item.label}</span>
                            <button
                                onClick={() => onRemoveRequest?.(item.docId)}
                                className="ml-1 p-0.5 hover:bg-indigo-600 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </span>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={() => setShowRequestPicker(!showRequestPicker)}
                        className={`px-3 py-2 rounded-xl flex items-center gap-2 border-2 border-dashed transition-all
                            ${showRequestPicker
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                : 'border-stone-200 text-stone-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}
                        `}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium text-sm">Bed om</span>
                    </button>
                </div>

                {/* Request Picker */}
                {showRequestPicker && (
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 animate-in slide-in-from-top-2">
                        <p className="text-xs text-stone-500 mb-2 font-medium">Hvad har du brug for?</p>
                        <div className="flex flex-wrap gap-2">
                            {availableRequests.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onRequest?.(item);
                                        setShowRequestPicker(false);
                                    }}
                                    className="bg-white border border-stone-200 hover:border-indigo-400 hover:bg-indigo-50 px-3 py-2 rounded-lg 
                                        flex items-center gap-2 text-sm transition-colors text-left shadow-sm"
                                >
                                    {renderIcon(item, 'lg')}
                                    <span className="text-stone-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpExchange;
