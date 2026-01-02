import React from 'react';
import { cva } from 'class-variance-authority';
import { CheckCircle, Pill, Activity, Sun, Clock, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from '../../types';

/**
 * Task card container variants
 * Premium styling with glass effect and plush shadows
 */
const cardVariants = cva(
    "relative p-4 rounded-2xl border transition-all cursor-pointer",
    {
        variants: {
            state: {
                completed: "bg-gradient-to-br from-stone-50/90 to-stone-100/80 border-stone-200/50 shadow-sm",
                pending: "glass-premium shadow-plush hover:shadow-plush-lg hover:border-teal-200/60",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

const iconContainerVariants = cva(
    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
    {
        variants: {
            state: {
                completed: "bg-stone-200 text-stone-400",
                pending: "bg-blue-50 text-blue-600",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

const checkboxVariants = cva(
    "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all",
    {
        variants: {
            state: {
                completed: "bg-teal-500 border-teal-500 shadow-[0_0_16px_4px_hsl(174_55%_38%/0.3)]",
                pending: "border-stone-200 bg-white shadow-sm hover:border-teal-300 hover:shadow-plush",
            },
        },
        defaultVariants: {
            state: "pending",
        },
    }
);

interface TaskCardProps {
    task: Task;
    onToggle: () => void;
}

const TASK_ICONS: Record<string, React.ElementType> = {
    medication: Pill,
    hydration: Activity,
    activity: Sun,
    appointment: Clock,
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
    const state = task.completed ? 'completed' : 'pending';
    const Icon = TASK_ICONS[task.type || 'activity'] || Sun;

    return (
        <div
            onClick={onToggle}
            className={cn(cardVariants({ state }))}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Pictogram Container */}
                    <div className={cn(iconContainerVariants({ state }), "shrink-0")}>
                        <Icon className="w-8 h-8" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn(
                                "text-xl font-bold tracking-tight",
                                task.completed ? "theme-text-muted opacity-60 line-through" : "theme-text"
                            )}>
                                {(task.title ?? '') as string}
                            </h3>
                            {/* Social Attribution Stamp */}
                            {task.createdByRole === 'relative' && task.createdByName && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                    <Heart className="w-3 h-3 text-indigo-500 fill-indigo-200" />
                                    <span className="text-[10px] text-indigo-700 font-medium">Fra {task.createdByName as string}</span>
                                </span>
                            )}
                        </div>
                        <p className="theme-text-muted font-medium opacity-80">{task.time}</p>
                    </div>
                </div>

                {/* Checkbox with celebration animation */}
                <div className={cn(
                    checkboxVariants({ state }),
                    task.completed && 'animate-celebrate relative'
                )}>
                    {task.completed && <CheckCircle className="text-white w-8 h-8" />}
                    {/* Celebration ring burst */}
                    {task.completed && (
                        <span className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-75" />
                    )}
                </div>
            </div>
        </div>
    );
};

export { cardVariants, iconContainerVariants, checkboxVariants };
