import React, { useMemo } from 'react';
import { Member } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { SuperpowerBadge, Archetype } from './SuperpowerBadge';
import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FamilyConstellationProps {
    members: Member[];
    centerMemberName: string;
    currentUserId?: string;
    onMemberClick?: (member: Member) => void;
    onBadgeAction?: (action: 'call' | 'message', memberName: string) => void;
}

// Determine which ring based on accessLevel from Firestore
const getOrbitLayer = (member: Member): 'inner' | 'outer' => {
    if (member.accessLevel === 'admin' || member.accessLevel === 'caregiver') {
        return 'inner';
    }

    const rel = member.relationship?.toLowerCase();
    if (['son', 'daughter', 'husband', 'wife', 'spouse', 'sister', 'brother'].includes(rel || '')) {
        return 'inner';
    }

    return 'outer';
};

const INNER_RADIUS = 110;
const OUTER_RADIUS = 160;
const CENTER_XY = 200;

export const FamilyConstellation: React.FC<FamilyConstellationProps> = ({
    members,
    centerMemberName,
    onMemberClick,
    onBadgeAction
}) => {
    const relatives = useMemo(() => members.filter(m => m.role !== 'senior'), [members]);

    const positionedMembers = useMemo(() => {
        const innerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'inner');
        const outerRingMembers = relatives.filter(m => getOrbitLayer(m) === 'outer');

        const calculatePos = (list: Member[], radius: number, offsetAngle: number = 0) => {
            return list.map((member, index) => {
                const count = list.length || 1;
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
            ...calculatePos(outerRingMembers, OUTER_RADIUS, Math.PI / 4)
        ];
    }, [relatives]);

    const getAvatarId = (name: string) => {
        const lower = name?.toLowerCase() || '';
        if (lower.includes('fatima') || lower === 'test user') return 'fatima';
        if (lower === 'brad') return 'brad';
        return 'louise';
    };

    return (
        <div className="w-full aspect-square max-w-md mx-auto relative bg-slate-50/50 rounded-full border border-slate-100 shadow-inner">
            <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none">
                {/* Orbit Rings */}
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={INNER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6"
                />
                <circle
                    cx={CENTER_XY} cy={CENTER_XY} r={OUTER_RADIUS}
                    fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" opacity="0.6"
                />

                {/* Center Pulse Effect */}
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
                <span className="mt-1 text-xs font-bold text-slate-600 bg-white/80 px-2 rounded-full">{centerMemberName}</span>
            </div>

            {/* Relatives (Planets) */}
            {positionedMembers.map((member) => (
                <button
                    key={member.docId || member.id}
                    onClick={() => onMemberClick?.(member)}
                    className={cn(
                        "absolute w-12 h-12 -ml-6 -mt-6 rounded-full",
                        "transition-transform hover:scale-110 active:scale-95",
                        "pointer-events-auto group"
                    )}
                    style={{ left: member.x, top: member.y }}
                    aria-label={`View ${member.displayName}`}
                >
                    {/* Avatar */}
                    <Avatar
                        id={getAvatarId(member.displayName)}
                        size="md"
                        className={cn(
                            "border-2 shadow-md",
                            getOrbitLayer(member) === 'inner' ? "border-indigo-200" : "border-amber-200"
                        )}
                    />

                    {/* Superpower Badge */}
                    {member.archetype && (
                        <div className="absolute -bottom-1 -right-1 z-20">
                            <SuperpowerBadge
                                archetype={member.archetype as Archetype}
                                memberName={member.displayName}
                                onAction={onBadgeAction}
                                size="sm"
                            />
                        </div>
                    )}

                    {/* Name Label (Hover Tooltip) */}
                    <div className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-1",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        "bg-white/90 px-2 py-0.5 rounded-md shadow-sm",
                        "text-xs font-bold text-slate-700 whitespace-nowrap",
                        "pointer-events-none z-30"
                    )}>
                        {member.displayName}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default FamilyConstellation;
