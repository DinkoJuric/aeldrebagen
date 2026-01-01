import React from 'react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';

/**
 * ProgressRing - A 3-segment ring showing daily progress with color-coded compliance
 * 
 * Segments: Morgen (Morning), Eftermiddag (Afternoon), Aften (Evening)
 * Colors:
 *   - Grøn (Green): Completed on time (within ±2 hours)
 *   - Gul (Yellow): Completed late (outside expected window)
 *   - Rød (Red): Not completed / Overdue
 *   - Gray: Future / Not yet due
 */

type Period = 'morgen' | 'eftermiddag' | 'aften';
type Status = 'onTime' | 'late' | 'overdue' | 'pending' | 'complete';

interface SegmentConfig {
    label: string;
    start: number;
    end: number;
    emoji: string;
}

const SEGMENT_CONFIG: Record<Period, SegmentConfig> = {
    morgen: { label: 'Morgen', start: 6, end: 12, emoji: '☀️' },
    eftermiddag: { label: 'Eftermiddag', start: 12, end: 18, emoji: '🌤️' },
    aften: { label: 'Aften', start: 18, end: 22, emoji: '🌙' }
};

interface StatusColor {
    stroke: string;
    fill: string;
    label: string;
}

const STATUS_COLORS: Record<Status, StatusColor> = {
    onTime: { stroke: '#10B981', fill: '#D1FAE5', label: 'Til tiden' },     // Green
    late: { stroke: '#F59E0B', fill: '#FEF3C7', label: 'For sent' },        // Yellow
    overdue: { stroke: '#EF4444', fill: '#FEE2E2', label: 'Mangler' },      // Red
    pending: { stroke: '#D1D5DB', fill: '#F3F4F6', label: 'Afventer' },     // Gray
    complete: { stroke: '#10B981', fill: '#D1FAE5', label: 'Færdig' }       // Green (all done)
};

/**
 * Determine segment status based on tasks and current time
 * @param {Array} tasks - Tasks for this segment
 * @param {string} period - 'morgen' | 'eftermiddag' | 'aften'
 * @param {number} currentHour - Current hour (0-23)
 */
const getSegmentStatus = (tasks: Task[], period: Period, currentHour: number): Status => {
    const config = SEGMENT_CONFIG[period];
    // Cast period check because Task.period might be string, but logic implies matching values.
    const periodTasks = tasks.filter(t => t.period === period);

    if (periodTasks.length === 0) {
        // No tasks for this period
        return currentHour >= config.end ? 'complete' : 'pending';
    }

    const completedTasks = periodTasks.filter(t => t.completed);
    const allComplete = completedTasks.length === periodTasks.length;

    // If period hasn't started yet
    if (currentHour < config.start) {
        return 'pending';
    }

    // If period is in the past
    if (currentHour >= config.end) {
        if (allComplete) {
            // Check if completed on time (simplified: assume on time if completed)
            return 'onTime';
        }
        return 'overdue';
    }

    // Period is currently active
    if (allComplete) {
        return 'onTime';
    }

    // Check if we're past the expected time window (+2 hours grace)
    const graceEnd = config.end + 2;
    if (currentHour >= graceEnd) {
        return completedTasks.length > 0 ? 'late' : 'overdue';
    }

    return 'pending';
};

interface ProgressRingProps {
    tasks?: Task[];
    size?: number;
    strokeWidth?: number;
    showLabels?: boolean;
    className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    tasks = [],
    size = 120,
    strokeWidth = 12,
    showLabels = true,
    className = ''
}) => {
    const currentHour = new Date().getHours();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const segmentLength = circumference / 3;
    const gap = 4; // Gap between segments

    const segments = (['morgen', 'eftermiddag', 'aften'] as Period[]).map((period, index) => {
        const status = getSegmentStatus(tasks, period, currentHour);
        const colors = STATUS_COLORS[status];
        const config = SEGMENT_CONFIG[period];

        // Calculate stroke dash offset for each segment
        const offset = index * segmentLength;

        return {
            period,
            status,
            colors,
            config,
            offset,
            dashArray: `${segmentLength - gap} ${circumference - segmentLength + gap}`
        };
    });

    // Calculate overall progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            {/* SVG Ring with celebratory glow at 100% */}
            <svg
                width={size}
                height={size}
                className={cn(
                    "transform -rotate-90 transition-all duration-1000",
                    progressPercent === 100 && "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                )}
            >
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />

                {/* Colored segments */}
                {segments.map((seg) => (
                    <circle
                        key={seg.period}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={seg.colors.stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={-seg.offset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />
                ))}
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold theme-text tracking-tighter leading-none">{progressPercent}%</span>
                <span className="text-[10px] font-bold theme-text-muted uppercase tracking-widest opacity-80">færdig</span>
            </div>

            {/* Legend */}
            {showLabels && (
                <div className="flex gap-3 mt-3">
                    {segments.map(seg => (
                        <div key={seg.period} className="flex items-center gap-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: seg.colors.stroke }}
                            />
                            <span className="text-[10px] theme-text-muted font-bold">{seg.config.emoji}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ProgressRingCompactProps {
    tasks?: Task[];
    size?: number;
}

/**
 * Compact version for inline use
 */
export const ProgressRingCompact: React.FC<ProgressRingCompactProps> = ({ tasks = [] }) => {
    const currentHour = new Date().getHours();
    const segments = (['morgen', 'eftermiddag', 'aften'] as Period[]).map(period =>
        getSegmentStatus(tasks, period, currentHour)
    );

    const hasOverdue = segments.includes('overdue');
    const hasLate = segments.includes('late');

    const borderColor = hasOverdue ? 'border-red-400' : hasLate ? 'border-yellow-400' : 'border-green-400';
    const bgColor = hasOverdue ? 'bg-red-50' : hasLate ? 'bg-yellow-50' : 'bg-green-50';
    const textColor = hasOverdue ? 'text-red-600' : hasLate ? 'text-yellow-600' : 'text-green-600';

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    return (
        <div className={`w-12 h-12 rounded-full border-4 ${borderColor} ${bgColor} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${textColor}`}>{progressPercent}%</span>
        </div>
    );
};

interface InlineGatesIndicatorProps {
    tasks?: Task[];
    className?: string;
}

/**
 * Inline Gates Indicator - compact horizontal view of all 3 periods
 * Design: ⬤ Morgen ✓  ⬤ Eftermiddag  ⬤ Aften
 */
export const InlineGatesIndicator: React.FC<InlineGatesIndicatorProps> = ({ tasks = [], className = '' }) => {
    const currentHour = new Date().getHours();

    const periods = (['morgen', 'eftermiddag', 'aften'] as Period[]).map(period => {
        const status = getSegmentStatus(tasks, period, currentHour);
        const colors = STATUS_COLORS[status];
        const config = SEGMENT_CONFIG[period];

        // Determine checkmark or status indicator
        const isComplete = status === 'onTime' || status === 'complete';
        const isPending = status === 'pending';
        const isOverdue = status === 'overdue';
        const isLate = status === 'late';

        return {
            period,
            label: config.label,
            isComplete,
            isPending,
            isOverdue,
            isLate,
            color: colors.stroke
        };
    });

    return (
        <div className={`flex items-center justify-center gap-2 text-xs ${className}`}>
            {periods.map(p => (
                <div
                    key={p.period}
                    className="flex items-center gap-1"
                    title={`${p.label}: ${p.isComplete ? 'Færdig' : p.isPending ? 'Afventer' : p.isOverdue ? 'Mangler' : 'For sent'}`}
                >
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                    />
                    <span className={`font-bold tracking-tight ${p.isComplete ? 'text-green-700' : p.isOverdue ? 'text-red-600' : 'theme-text-muted'}`}>
                        {p.label.slice(0, 3)}
                        {p.isComplete && ' ✓'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ProgressRing;
