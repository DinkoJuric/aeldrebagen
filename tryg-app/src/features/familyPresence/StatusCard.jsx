// @ts-check
import React from 'react';
import { User, Clock, Pill, Briefcase, Home, Car, Coffee, Moon } from 'lucide-react';
import { InlineGatesIndicator } from '../tasks/ProgressRing';
import { Avatar } from '../../components/ui/Avatar';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

/**
 * Status options for family members
 */
export const STATUS_OPTIONS = [
    { id: 'work', label: 'På arbejde', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'home', label: 'Hjemme', icon: Home, color: 'bg-green-100 text-green-600' },
    { id: 'traveling', label: 'Undervejs', icon: Car, color: 'bg-amber-100 text-amber-600' },
    { id: 'available', label: 'Har tid til en snak', icon: Coffee, color: 'bg-teal-100 text-teal-600' },
    { id: 'busy', label: 'Optaget', icon: Moon, color: 'bg-stone-100 text-stone-500' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Status selector for RELATIVE to set their status
 * @param {Object} props
 * @param {string} props.currentStatus
 * @param {(status: string) => void} props.onStatusChange
 * @param {boolean} [props.compact]
 */
export const StatusSelector = ({ currentStatus, onStatusChange, compact = false }) => {
    return (
        <div className="flex gap-2 justify-between">
            {STATUS_OPTIONS.map(status => {
                const isActive = currentStatus === status.id;
                // Map status ID to Avatar ID
                const avatarId = {
                    'work': 'work',
                    'home': 'home',
                    'traveling': 'car',
                    'available': 'coffee',
                    'busy': 'moon'
                }[status.id] || 'home';

                return (
                    <button
                        key={status.id}
                        onClick={() => onStatusChange(status.id)}
                        className={`
                            group relative flex items-center justify-center p-2 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-white shadow-md ring-2 ring-indigo-500 scale-110 z-10'
                                : 'bg-white/50 hover:bg-white hover:shadow-sm border border-transparent hover:border-stone-200'
                            }
                        `}
                        title={status.label}
                    >
                        <Avatar
                            id={avatarId}
                            size="sm"
                            className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />
                        {/* Tooltip */}
                        <div className={`
                            absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-bold bg-stone-800 text-white
                            pointer-events-none transition-all duration-200 z-20
                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}
                        `}>
                            {status.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Unified Status Card Component
 * Renders appropriate card based on `mode`.
 * 
 * @param {Object} props
 * @param {'senior' | 'relative'} [props.mode] - Which version to render
 * @param {string} [props.name] - Display name
 * @param {string} [props.status] - Status ID (for relative) or implied
 * @param {Object|string} [props.timestamp] - Last updated timestamp
 * @param {string} [props.className]
 * 
 * -- Senior Mode Props --
 * @param {number} [props.completionRate]
 * @param {Array<import('../../types').Task>} [props.tasks]
 * @param {number} [props.symptomCount]
 * @param {(() => void)|null} [props.onViewSymptoms]
 * 
 * -- Relative Mode Props --
 * @param {(status: string) => void} [props.onStatusChange]
 */
export const StatusCard = ({
    mode = 'relative',
    name = 'Bruger',
    status: statusId,
    timestamp,
    className = '',
    // Senior specifics
    completionRate = 0,
    tasks = [],
    symptomCount = 0,
    onViewSymptoms = null,
    // Relative specifics
    onStatusChange
}) => {
    // -------------------------------------------------------------------------
    // RENDER: SENIOR MODE (Dashboard Style)
    // -------------------------------------------------------------------------
    if (mode === 'senior') {
        const getSeniorStatus = () => {
            if (!timestamp) return {
                label: 'Venter på første tjek...',
                theme: 'neutral',
                bgPos: '50% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 80 && symptomCount === 0) return {
                label: 'Alt er vel',
                theme: 'calm',
                bgPos: '0% 0%',
                textColor: 'text-white'
            };
            if (completionRate >= 50) return {
                label: 'God dag',
                theme: 'neutral',
                bgPos: '50% 0%',
                textColor: 'text-white'
            };
            if (symptomCount > 0) return {
                label: 'OBS: Symptomer',
                theme: 'warm',
                bgPos: '100% 0%',
                textColor: 'text-white'
            };
            return {
                label: 'Tjek ind',
                theme: 'warm',
                bgPos: '100% 0%',
                textColor: 'text-white'
            };
        };

        const statusInfo = getSeniorStatus();
        // @ts-ignore - Check for test environment
        const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.BASE_URL : '/';
        const bgUrl = `${baseUrl}assets/bg-atmospheric.png`;

        return (
            <div
                className={`
                    relative overflow-hidden rounded-2xl shadow-lg border border-white/20 p-6 
                    transition-all duration-500 ease-in-out
                    ${className}
                `}
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    backgroundPosition: statusInfo.bgPos,
                    backgroundSize: '300% 100%'
                }}
            >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                <div className="relative z-10 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-white/20 rounded-full backdrop-blur-md">
                                <Avatar id="senior" size="md" className="border-2 border-white/40" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl leading-tight drop-shadow-sm">{name}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/10 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1 w-fit">
                                    <Clock className="w-3 h-3" />
                                    <span>Sidst: {typeof timestamp === 'string' ? timestamp : '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                            {statusInfo.label}
                        </div>
                    </div>

                    {tasks.length > 0 && (
                        <div className="mb-4 py-2 px-3 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
                            <InlineGatesIndicator tasks={tasks} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Tjekket ind</p>
                                <p className="text-sm font-bold">{typeof timestamp === 'string' ? timestamp : 'Venter'}</p>
                            </div>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Pill className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Medicin</p>
                                <p className="text-sm font-bold">{completionRate}% ordnet</p>
                            </div>
                        </div>
                    </div>

                    {symptomCount > 0 && (
                        <button
                            onClick={onViewSymptoms ? onViewSymptoms : undefined}
                            className={`w-full mt-3 p-2 bg-orange-500/20 backdrop-blur-md rounded-lg border border-orange-200/30 text-center animate-pulse ${onViewSymptoms ? 'cursor-pointer hover:bg-orange-500/30 transition-colors' : ''}`}
                        >
                            <span className="text-xs font-bold text-white drop-shadow-md flex items-center justify-center gap-2">
                                ⚠️ {symptomCount} symptom{symptomCount > 1 ? 'er' : ''} rapporteret i dag
                                {onViewSymptoms && <span className="text-[10px] opacity-80 font-normal underline">Se detaljer</span>}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // RENDER: RELATIVE MODE (List Item Style)
    // -------------------------------------------------------------------------
    // @ts-ignore
    const statusObj = STATUS_OPTIONS.find(s => s.id === statusId) || STATUS_OPTIONS[0];
    const avatarId = {
        'work': 'work',
        'home': 'home',
        'traveling': 'car',
        'available': 'coffee',
        'busy': 'moon'
        // @ts-ignore
    }[statusId] || 'home';

    // Format timestamp if it's a Firestore object or Date
    let timeString = '-';
    if (timestamp) {
        if (typeof timestamp === 'string') {
            timeString = timestamp;
        } else {
            // @ts-ignore - Firestore timestamp check
            const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
            timeString = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
        }
    }

    return (
        <div className={`bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-3 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                <Avatar id={name === 'Brad' ? 'brad' : name.includes('Fatima') ? 'fatima' : 'louise'} size="md" />
                <div>
                    <h4 className="font-bold text-stone-800 text-sm">{name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            {statusObj.label}
                        </span>
                        <span className="text-[10px] text-stone-400">• {timeString}</span>
                    </div>
                </div>
            </div>
            <div className="bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                <Avatar id={avatarId} size="sm" />
            </div>
        </div>
    );
};

// ============================================================================
// LIST LIST COMPONENT
// ============================================================================

export const StatusList = ({
    members = [],
    relativeStatuses = [],
    lastUpdated,
    maxDisplay = 3
}) => {
    // Filter to only relatives
    const relatives = members.filter(m => m.role === 'relative');

    if (relatives.length === 0 && relativeStatuses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-100 mb-4">
                <p className="text-stone-400 text-sm text-center">Ingen pårørende endnu</p>
            </div>
        );
    }

    const statusData = relativeStatuses.length > 0
        ? relativeStatuses
        : relatives.map(m => ({ displayName: m.displayName, status: 'home', updatedAt: null }));

    const displayedMembers = statusData.slice(0, maxDisplay);
    const hiddenCount = Math.max(0, statusData.length - maxDisplay);

    return (
        <div className="space-y-2 mb-4">
            {displayedMembers.map((member, index) => (
                <StatusCard
                    mode="relative" // Use relative mode
                    key={member.docId || member.userId || index}
                    name={member.displayName || 'Pårørende'}
                    status={member.status}
                    timestamp={member.updatedAt || lastUpdated}
                />
            ))}
            {hiddenCount > 0 && (
                <div className="text-center py-2">
                    <span className="text-sm text-stone-400">
                        +{hiddenCount} {hiddenCount === 1 ? 'mere' : 'andre'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatusCard;
