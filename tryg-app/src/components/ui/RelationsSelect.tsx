import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export type RelationshipType =
    | 'mother'
    | 'father'
    | 'son'
    | 'daughter'
    | 'grandson'
    | 'granddaughter'
    | 'sister'
    | 'brother'
    | 'friend'
    | 'caregiver'
    | 'other';

interface RelationsSelectProps {
    value: string;
    onChange: (value: string) => void;
    seniorName: string;
    targetGender?: 'male' | 'female' | 'other';
}

export const RelationsSelect: React.FC<RelationsSelectProps> = ({
    value,
    onChange,
    seniorName,
    targetGender
}) => {
    const { t } = useTranslation();

    const allOptions: { id: RelationshipType; label: string; gender?: 'male' | 'female' }[] = [
        { id: 'mother', label: t('relation_mother', 'Mor'), gender: 'female' },
        { id: 'father', label: t('relation_father', 'Far'), gender: 'male' },
        { id: 'son', label: t('relation_son', 'Søn'), gender: 'male' },
        { id: 'daughter', label: t('relation_daughter', 'Datter'), gender: 'female' },
        { id: 'grandson', label: t('relation_grandson', 'Barnebarn (Han)'), gender: 'male' },
        { id: 'granddaughter', label: t('relation_granddaughter', 'Barnebarn (Hun)'), gender: 'female' },
        { id: 'sister', label: t('relation_sister', 'Søster'), gender: 'female' },
        { id: 'brother', label: t('relation_brother', 'Bror'), gender: 'male' },
        { id: 'friend', label: t('relation_friend', 'Ven') },
        { id: 'caregiver', label: t('relation_caregiver', 'Hjælper') },
        { id: 'other', label: t('relation_other', 'Andet') },
    ];

    const options = allOptions.filter(opt => {
        if (!targetGender || targetGender === 'other') return true;
        if (!opt.gender) return true; // Neural options like Friend
        return opt.gender === targetGender;
    });

    return (
        <div className="space-y-3 animate-fade-in">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide">
                {t('your_relation_to_target', { name: seniorName, defaultValue: `Din relation til ${seniorName}` })}
            </label>

            <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => {
                    const isSelected = value?.toLowerCase() === opt.label.toLowerCase() || value === opt.id;

                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange(opt.label)}
                            className={cn(
                                "relative p-3 rounded-xl border text-left text-sm font-medium transition-all duration-200",
                                isSelected
                                    ? "bg-teal-50 border-teal-500 text-teal-800 shadow-sm"
                                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                            )}
                        >
                            {opt.label}
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <Check className="w-3 h-3 text-teal-600" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Fallback for custom entry if needed */}
            <div className="pt-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('relation_custom_placeholder', 'Eller skriv selv...')}
                    className="w-full text-sm p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-stone-50/50"
                />
            </div>
        </div>
    );
};
