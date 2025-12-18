import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Pill, Activity, Sun, Clock, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Task } from './useTasks';

/**
 * Task card container variants
 */
const cardVariants = cva(
    "relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
    {
        variants: {
            state: {
                completed: "bg-stone-100 border-stone-200",
                pending: "bg-white border-stone-200 shadow-sm hover:border-teal-400",
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
    "w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors",
    {
        variants: {
            state: {
                completed: "bg-teal-500 border-teal-500",
                pending: "border-stone-200 bg-white",
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
                    <div className={cn(iconContainerVariants({ state }))}>
                        <Icon className="w-8 h-8" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn(
                                "text-xl font-bold",
                                task.completed ? "text-stone-500 line-through" : "text-stone-800"
                            )}>
                                {task.title}
                            </h3>
                            {/* Social Attribution Stamp */}
                            {task.createdByRole === 'relative' && task.createdByName && (
                                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                    <Heart className="w-3 h-3 text-indigo-500 fill-indigo-200" />
                                    <span className="text-[10px] text-indigo-700 font-medium">Fra {task.createdByName}</span>
                                </span>
                            )}
                        </div>
                        <p className="text-stone-500 font-medium">{task.time}</p>
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
