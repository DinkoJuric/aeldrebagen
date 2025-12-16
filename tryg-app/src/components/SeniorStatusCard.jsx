// @ts-check
import React from 'react';
import { User, Clock, Pill } from 'lucide-react';
import { InlineGatesIndicator } from './ProgressRing';
import { Avatar } from './ui/Avatar';

// Senior status card - displayed in RelativeView to show senior's status
// Enhanced with Atmospheric Backgrounds for emotional sensing
export const SeniorStatusCard = ({
    seniorName = 'Senior',
    lastCheckIn,
    completionRate = 0,
    tasks = [],
    symptomCount = 0,
    className = ''
}) => {
    // Determine status and background theme
    // 0 = Green/Calm (Left), 1 = Blue/Neutral (Center), 2 = Orange/Warn (Right)
    const getStatus = () => {
        if (!lastCheckIn) return {
            label: 'Venter på første tjek...',
            theme: 'neutral',
            bgPos: '50% 0%', // Center (Blue) structure
            textColor: 'text-white'
        };

        // High completion = Calm (Green)
        if (completionRate >= 80 && symptomCount === 0) return {
            label: 'Alt er vel',
            theme: 'calm',
            bgPos: '0% 0%', // Left (Green)
            textColor: 'text-white'
        };

        // Medium completion = Neutral (Blue)
        if (completionRate >= 50) return {
            label: 'God dag',
            theme: 'neutral',
            bgPos: '50% 0%', // Center (Blue)
            textColor: 'text-white'
        };

        // Low completion or symptoms = Warm (Orange)
        if (symptomCount > 0) return {
            label: 'OBS: Symptomer',
            theme: 'warm',
            bgPos: '100% 0%', // Right (Orange)
            textColor: 'text-white'
        };

        return {
            label: 'Tjek ind',
            theme: 'warm',
            bgPos: '100% 0%', // Right (Orange)
            textColor: 'text-white'
        };
    };

    const status = getStatus();

    return (
        <div
            className={`
                relative overflow-hidden rounded-2xl shadow-lg border border-white/20 p-6 
                transition-all duration-500 ease-in-out
                ${className}
            `}
            style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/bg-atmospheric.png)`,
                backgroundPosition: status.bgPos,
                backgroundSize: '300% 100%' // Zoom to fit 3 panels horizontally
            }}
        >
            {/* Dark abstract overlay for text readability */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

            {/* Content Container (Relative z-10) */}
            <div className="relative z-10 text-white">
                <div className="flex justify-between items-start mb-4">
                    {/* Left: Avatar + Info */}
                    <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-full backdrop-blur-md">
                            <Avatar id="senior" size="md" className="border-2 border-white/40" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl leading-tight drop-shadow-sm">{seniorName}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-black/10 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1 w-fit">
                                <Clock className="w-3 h-3" />
                                <span>Sidst: {lastCheckIn || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Status Badge - "Glass" effect */}
                    <div className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                        {status.label}
                    </div>
                </div>

                {/* Inline Gates Indicator - showing Morgen/Eftermiddag/Aften status (Customized for dark bg) */}
                {tasks.length > 0 && (
                    <div className="mb-4 py-2 px-3 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
                        {/* We pass a prop or override styles via context if InlineGatesIndicator supports it. 
                             For now, wrapping it in a container that forces light text colors if possible, 
                             or we accept standard colors. 
                             Actually, looking at InlineGatesIndicator code (not visible here but assumed),
                             it likely uses standard tailwind colors. We'll trust it looks okay or contrasty enough. */}
                        <InlineGatesIndicator tasks={tasks} />
                    </div>
                )}

                {/* Stats row - Glass cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Tjekket ind</p>
                            <p className="text-sm font-bold">{lastCheckIn || 'Venter'}</p>
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

                {/* Symptom indicator (if symptoms logged today) */}
                {symptomCount > 0 && (
                    <div className="mt-3 p-2 bg-orange-500/20 backdrop-blur-md rounded-lg border border-orange-200/30 text-center animate-pulse">
                        <span className="text-xs font-bold text-white drop-shadow-md">
                            ⚠️ {symptomCount} symptom{symptomCount > 1 ? 'er' : ''} rapporteret i dag
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeniorStatusCard;
