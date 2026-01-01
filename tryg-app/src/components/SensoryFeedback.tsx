import { useEffect, useRef } from 'react';
import { useCareCircleContext } from '../contexts/CareCircleContext';
import { playCompletionSound, playPingSound, playSuccessSound } from '../utils/sounds';
import { FEATURES } from '../config/features';

export function SensoryFeedback() {
    const { latestPing, tasks, lastCheckIn } = useCareCircleContext();

    // Track previous state to detect changes
    const prevTasksRef = useRef(tasks);
    const prevCheckInRef = useRef(lastCheckIn);

    // Effect: Incoming Ping Sound
    useEffect(() => {
        if (latestPing && FEATURES.pingSound) {
            playPingSound();
        }
    }, [latestPing]);

    // Effect: Task Completion Sound
    useEffect(() => {
        const prevTasks = prevTasksRef.current;

        // Check if any task was just completed
        const completedTask = tasks.find(t => {
            const prev = prevTasks.find(pt => pt.id === t.id);
            return t.completed && (!prev || !prev.completed);
        });

        if (completedTask && FEATURES.completionSounds) {
            playCompletionSound();
        }

        prevTasksRef.current = tasks;
    }, [tasks]);

    // Effect: Check-in Sound
    useEffect(() => {
        if (lastCheckIn && lastCheckIn !== prevCheckInRef.current && FEATURES.completionSounds) {
            playSuccessSound();
        }
        prevCheckInRef.current = lastCheckIn;
    }, [lastCheckIn]);

    return null; // No UI, just vibes
}
