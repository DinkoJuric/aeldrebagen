// GDPR Consent Modal - Shown on first login before using the app
// Collects explicit consent for data processing as required by GDPR

import React, { useState } from 'react';
import { Shield, Check, ExternalLink } from 'lucide-react';

export interface ConsentModalProps {
    userName?: string;
    onAccept: () => void;
    loading?: boolean;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ userName, onAccept, loading }) => {
    const [checkedItems, setCheckedItems] = useState({
        dataProcessing: false,
        dataSharing: false,
        privacyPolicy: false,
    });

    const allChecked = Object.values(checkedItems).every(Boolean);

    const handleCheck = (key: keyof typeof checkedItems) => {
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAccept = () => {
        if (allChecked) {
            onAccept();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800">Dit privatliv er vigtigt</h2>
                    <p className="text-stone-500 mt-2">
                        Hej {userName}! Før du kan bruge Tryg, skal vi have din tilladelse.
                    </p>
                </div>

                {/* What we collect */}
                <div className="bg-stone-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Hvad vi gemmer:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Dine daglige opgaver og hvornår de fuldføres</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Symptomer du logger (smerter, søvn, appetit, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">•</span>
                            <span>Beskeder og "tænker på dig" mellem familiemedlemmer</span>
                        </li>
                    </ul>
                </div>

                {/* Who can see */}
                <div className="bg-indigo-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Hvem kan se dine data:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">•</span>
                            <span><strong>Kun din families overblik</strong> - dem du inviterer</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 mt-0.5">•</span>
                            <span>Vi sælger aldrig dine data til tredjeparter</span>
                        </li>
                    </ul>
                </div>

                {/* Your rights */}
                <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-stone-800 mb-3">Dine rettigheder:</h3>
                    <ul className="space-y-2 text-sm text-stone-600">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan altid <strong>downloade alle dine data</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan <strong>slette din konto</strong> når som helst</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>Du kan <strong>pause deling</strong> midlertidigt</span>
                        </li>
                    </ul>
                </div>

                {/* Consent checkboxes */}
                <div className="space-y-3 mb-6">
                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('dataProcessing')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.dataProcessing ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.dataProcessing && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg accepterer, at Tryg gemmer mine data som beskrevet ovenfor
                        </span>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('dataSharing')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.dataSharing ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.dataSharing && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg forstår, at min families overblik kan se mine aktiviteter
                        </span>
                    </label>

                    <label
                        className="flex items-start gap-3 cursor-pointer"
                        onClick={() => handleCheck('privacyPolicy')}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checkedItems.privacyPolicy ? 'bg-teal-600 border-teal-600' : 'border-stone-300'
                            }`}>
                            {checkedItems.privacyPolicy && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-sm text-stone-700">
                            Jeg har læst og accepterer{' '}
                            <a
                                href="/privacy-policy.html"
                                target="_blank"
                                className="text-teal-600 underline inline-flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                privatlivspolitikken
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </span>
                    </label>
                </div>

                {/* Accept button */}
                <button
                    onClick={handleAccept}
                    disabled={!allChecked || loading}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${allChecked
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Gemmer...' : 'Jeg accepterer'}
                </button>

                <p className="text-xs text-stone-400 text-center mt-4">
                    Du kan til enhver tid ændre dine præferencer i indstillinger
                </p>
            </div>
        </div>
    );
};

export default ConsentModal;
