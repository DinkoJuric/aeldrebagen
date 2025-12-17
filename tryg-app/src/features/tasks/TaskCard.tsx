
import React from 'react';
import { CheckCircle, Pill, Activity, Sun, Clock, Heart } from 'lucide-react';
import { Task } from './useTasks';

interface TaskCardProps {
    task: Task;
    onToggle: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
    return (
        <div
            onClick={onToggle}
            className={`
                relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${task.completed
                    ? 'bg-stone-100 border-stone-200'
                    : 'bg-white border-stone-200 shadow-sm hover:border-teal-400'
                }
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Pictogram Container */}
                    <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner
                        ${task.completed ? 'bg-stone-200 text-stone-400' : 'bg-blue-50 text-blue-600'}
                    `}>
                        {task.type === 'medication' && <Pill className="w-8 h-8" />}
                        {task.type === 'hydration' && <Activity className="w-8 h-8" />}
                        {task.type === 'activity' && <Sun className="w-8 h-8" />}
                        {task.type === 'appointment' && <Clock className="w-8 h-8" />}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-xl font-bold ${task.completed ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
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

                {/* Checkbox */}
                <div className={`
                    w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors
                    ${task.completed ? 'bg-teal-500 border-teal-500' : 'border-stone-200 bg-white'}
                `}>
                    {task.completed && <CheckCircle className="text-white w-8 h-8" />}
                </div>
            </div>
        </div>
    );
};
