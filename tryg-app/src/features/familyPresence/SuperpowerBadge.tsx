import React, { useState } from 'react';
import { Wifi, Ear, Wrench, Car, Star, Phone, MessageCircle, X } from 'lucide-react';

export type Archetype = 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader';

interface ArchetypeConfig {
    id: Archetype;
    icon: React.ElementType;
    label: string;
    description: string;
    action: string; // What happens when tapped
    color: string;
}

export const ARCHETYPE_CONFIG: Record<Archetype, ArchetypeConfig> = {
    tech_wizard: {
        id: 'tech_wizard',
        icon: Wifi,
        label: 'Teknik-Ekspert',
        description: 'Ring når iPad driller eller WiFi ikke virker',
        action: 'call',
        color: 'bg-blue-600'
    },
    listener: {
        id: 'listener',
        icon: Ear,
        label: 'Lytteren',
        description: 'Ring for en god snak og lidt trøst',
        action: 'call',
        color: 'bg-purple-600'
    },
    fixer: {
        id: 'fixer',
        icon: Wrench,
        label: 'Fikser-Typen',
        description: 'Ring når noget skal repareres derhjemme',
        action: 'call',
        color: 'bg-orange-600'
    },
    driver: {
        id: 'driver',
        icon: Car,
        label: 'Chaufføren',
        description: 'Ring for en tur til lægen eller butikken',
        action: 'call',
        color: 'bg-green-600'
    },
    cheerleader: {
        id: 'cheerleader',
        icon: Star,
        label: 'Heppen',
        description: 'Del gode nyheder og få et stort smil',
        action: 'message',
        color: 'bg-amber-500'
    }
};

interface SuperpowerBadgeProps {
    archetype: Archetype;
    memberName: string;
    onAction?: (action: 'call' | 'message', memberName: string) => void;
    size?: 'sm' | 'md';
    interactive?: boolean;
}

export const SuperpowerBadge: React.FC<SuperpowerBadgeProps> = ({
    archetype,
    memberName,
    onAction,
    size = 'sm',
    interactive = true
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const config = ARCHETYPE_CONFIG[archetype];

    if (!config) return null;

    const Icon = config.icon;
    const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-8 h-8';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';

    const handleTap = () => {
        if (!interactive) return;
        setShowActionSheet(true);
    };

    const handleLongPress = () => {
        if (!interactive) return;
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
    };

    const handleAction = (actionType: 'call' | 'message') => {
        onAction?.(actionType, memberName);
        setShowActionSheet(false);
    };

    return (
        <>
            {/* Badge Button */}
            <button
                onClick={handleTap}
                onContextMenu={(e) => { e.preventDefault(); handleLongPress(); }}
                onTouchStart={() => {
                    const timer = setTimeout(handleLongPress, 500);
                    const cleanup = () => clearTimeout(timer);
                    document.addEventListener('touchend', cleanup, { once: true });
                }}
                className={`${sizeClasses} ${config.color} rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform hover:scale-110 active:scale-95 ${interactive ? 'cursor-pointer' : ''}`}
                aria-label={`${memberName} - ${config.label}`}
            >
                <Icon className={`${iconSize} text-white`} />
            </button>

            {/* Long-Press Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in">
                    <p className="font-bold">{config.label}</p>
                    <p className="text-slate-300">{config.description}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
            )}

            {/* Action Sheet Modal */}
            {showActionSheet && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fade-in" onClick={() => setShowActionSheet(false)}>
                    <div className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-slate-800">{memberName}</p>
                                    <p className="text-sm text-slate-500">{config.label}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowActionSheet(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <p className="text-slate-600 mb-6">{config.description}</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleAction('call')}
                                className="flex items-center justify-center gap-2 p-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Ring op
                            </button>
                            <button
                                onClick={() => handleAction('message')}
                                className="flex items-center justify-center gap-2 p-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Send besked
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Settings Panel for relatives to choose their archetype
interface ArchetypeSelectorProps {
    currentArchetype?: Archetype;
    onSelect: (archetype: Archetype) => void;
}

export const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({
    currentArchetype,
    onSelect
}) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Vælg din superkraft</h3>
            <p className="text-xs text-slate-400 mb-4">Hvordan kan du bedst hjælpe familien?</p>

            <div className="grid grid-cols-1 gap-2">
                {Object.values(ARCHETYPE_CONFIG).map((config) => {
                    const Icon = config.icon;
                    const isSelected = currentArchetype === config.id;

                    return (
                        <button
                            key={config.id}
                            onClick={() => onSelect(config.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                        >
                            <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                    {config.label}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{config.description}</p>
                            </div>
                            {isSelected && (
                                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SuperpowerBadge;
