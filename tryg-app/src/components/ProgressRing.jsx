import React from 'react';

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

const SEGMENT_CONFIG = {
    morgen: { label: 'Morgen', start: 6, end: 12, emoji: '☀️' },
    eftermiddag: { label: 'Eftermiddag', start: 12, end: 18, emoji: '🌤️' },
    aften: { label: 'Aften', start: 18, end: 22, emoji: '🌙' }
};

const STATUS_COLORS = {
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
const getSegmentStatus = (tasks, period, currentHour) => {
    const config = SEGMENT_CONFIG[period];
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

export const ProgressRing = ({
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

    const segments = ['morgen', 'eftermiddag', 'aften'].map((period, index) => {
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
            {/* SVG Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
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
                {segments.map((seg, i) => (
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
                <span className="text-2xl font-bold text-stone-800">{progressPercent}%</span>
                <span className="text-xs text-stone-500">færdig</span>
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
                            <span className="text-xs text-stone-600">{seg.config.emoji}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Compact version for inline use
 */
export const ProgressRingCompact = ({ tasks = [], size = 48 }) => {
    const currentHour = new Date().getHours();
    const segments = ['morgen', 'eftermiddag', 'aften'].map(period =>
        getSegmentStatus(tasks, period, currentHour)
    );

    const hasOverdue = segments.includes('overdue');
    const hasLate = segments.includes('late');
    const allGood = !hasOverdue && !hasLate;

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

export default ProgressRing;
