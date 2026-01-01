import { Briefcase, Home, Car, Coffee, Moon, Wifi, Ear, Wrench, Star } from 'lucide-react';

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

export interface StatusOption {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
}

/**
 * Status options for family members
 */
export const STATUS_OPTIONS: StatusOption[] = [
    { id: 'work', label: 'På arbejde', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'home', label: 'Hjemme', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'traveling', label: 'Undervejs', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 'available', label: 'Har tid til en snak', icon: Coffee, color: 'bg-teal-100 text-teal-600' },
    { id: 'busy', label: 'Optaget', icon: Moon, color: 'bg-stone-100 text-stone-500' },
];

// ============================================================================
// ARCHETYPE CONFIGURATION
// ============================================================================

export type Archetype = 'tech_wizard' | 'listener' | 'fixer' | 'driver' | 'cheerleader';

export interface ArchetypeConfig {
    id: Archetype;
    icon: React.ElementType;
    label: string;
    description: string;
    action: string;
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
