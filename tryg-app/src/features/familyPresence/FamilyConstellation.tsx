import React, { useMemo } from 'react';
import { Member } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Wifi, Ear, Wrench, Car, Heart, Shield, Star } from 'lucide-react';

interface FamilyConstellationProps {
    members: Member[];
    centerMemberName: string; // The Senior
    currentUserId?: string;
    onMemberClick?: (member: Member) => void;
}

// Helpers
const getOrbitLayer = (member: Member): 'inner' | 'outer' => {
    // Admin/Caregiver -> Inner Ring (Duty)
    if (member.accessLevel === 'admin' || member.accessLevel === 'caregiver') return 'inner';

    // Fallback based on relationship if accessLevel missing (Migration support)
    const rel = member.relationship?.toLowerCase();
    if (['son', 'daughter', 'husband', 'wife', 'spouse'].includes(rel || '')) return 'inner';

    return 'outer'; // Grandchildren, friends -> Outer Ring (Joy)
};

const getBadgeIcon = (archetype?: string) => {
    switch (archetype) {
        case 'tech_wizard': return <Wifi className="w-3 h-3 text-white" />;
        case 'listener': return <Ear className="w-3 h-3 text-white" />;
        case 'fixer': return <Wrench className="w-3 h-3 text-white" />;
        case 'driver': return <Car className="w-3 h-3 text-white" />;
        case 'cheerleader': return <Star className="w-3 h-3 text-white" />;
        default: return null;
    }
};

const INNER_RADIUS = 110;
const OUTER_RADIUS = 160;
const CENTER_XY = 200; // SVG viewBox center (400x400)

export const FamilyConstellation: React.FC<FamilyConstellationProps> = ({
    members,
    centerMemberName,
    currentUserId,
    onMemberClick
}) => {
    // Filter out senior (center) if present in members list
    // And enrich with mock data for demo purposes if not set in Firestore
    const relatives = useMemo(() => members.filter(m => m.role !== 'senior').map(m => {
        // Mock data fallback for demo (remove in production)
        const mockData: Partial<Member> = {};
        const nameLower = m.displayName?.toLowerCase() || '';

        if (nameLower.includes('fatima') || nameLower === 'test user') {
            mockData.relationship = m.relationship || 'sister';
            mockData.accessLevel = m.accessLevel || 'caregiver';
            mockData.archetype = m.archetype || 'listener';
        } else if (nameLower === 'brad') {
            mockData.relationship = m.relationship || 'son';
            mockData.accessLevel = m.accessLevel || 'admin';
            mockData.archetype = m.archetype || 'tech_wizard';
        } else if (nameLower === 'louise') {
            mockData.relationship = m.relationship || 'daughter';
            mockData.accessLevel = m.accessLevel || 'caregiver';
            mockData.archetype = m.archetype || 'fixer';
        }

        return { ...m, ...mockData };
    }), [members]);

    // Calculate positions
    const positionedMembers = useMemo(() => {
        const innerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'inner');
        const outerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'outer');

        const calculatePos = (list: Member[], radius: number, offsetAngle: number = 0) => {
            return list.map((member, index) => {
                const count = list.length;
                // Distribute evenly: angle = (index / count) * 2PI
                // Add offset to prevent overlap with other ring logic if needed
                const angle = (index / count) * 2 * Math.PI + offsetAngle;
                return {
                    ...member,
                    x: CENTER_XY + radius * Math.cos(angle),
                    y: CENTER_XY + radius * Math.sin(angle)
                };
            });
        };

        return [
            ...calculatePos(innerRingMembers, INNER_RADIUS, 0),
            ...calculatePos(outerRingMembers, OUTER_RADIUS, Math.PI / 4) // Offset outer ring by 45deg for aesthetics
        ];
    }, [relatives]);

    return (
        <div className="w-full aspect-square max-w-md mx-auto relative bg-slate-50/50 rounded-full border border-slate-100 shadow-inner">
            <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none">
                {/* Orbits */}
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={INNER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6"
                />
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={OUTER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"
                />

                {/* Connecting Lines (Optional - e.g. for collaboration) */}
                {/* Placeholder for "Safety Net" lines could go here */}

                {/* Center Pulse */}
                <circle cx={CENTER_XY} cy={CENTER_XY} r="45" fill="url(#centerGradient)" opacity="0.1" className="animate-pulse" />
                <defs>
                    <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>

            {/* Senior (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
                <div className="relative">
                    <Avatar id="senior" size="lg" className="border-4 border-white shadow-lg z-10" />
                    <Heart className="absolute -top-2 -right-2 w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
                </div>
                {/* <span className="mt-1 text-sm font-bold text-slate-700 bg-white/80 px-2 rounded-full">{centerMemberName}</span> */}
            </div>

            {/* Relatives (Planets) */}
            {positionedMembers.map((member) => (
                <button
                    key={member.docId || member.id}
                    onClick={() => onMemberClick?.(member)}
                    className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full transition-transform hover:scale-110 active:scale-95 pointer-events-auto group"
                    style={{ left: member.x, top: member.y }}
                    aria-label={`View ${member.displayName}`}
                >
                    {/* Avatar */}
                    <Avatar
                        id={member.displayName.toLowerCase().includes('fatima') ? 'fatima' : member.displayName.toLowerCase().includes('brad') ? 'brad' : 'louise'}
                        size="md"
                        className={`border-2 shadow-md ${getOrbitLayer(member) === 'inner' ? 'border-indigo-200' : 'border-amber-200'}`}
                    />

                    {/* Superpower Badge */}
                    {member.archetype && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border border-white shadow-sm z-20">
                            {getBadgeIcon(member.archetype)}
                        </div>
                    )}

                    {/* Name Label (Tooltip-ish) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-0.5 rounded-md shadow-sm text-xs font-bold text-slate-700 whitespace-nowrap pointer-events-none z-30">
                        {member.displayName}
                    </div>
                </button>
            ))}
        </div>
    );
};
