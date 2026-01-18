
// Tasks hook - real-time task sync via Firestore
// Replaces localStorage for multi-user task management

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { INITIAL_TASKS } from '../../data/constants';

import { Task } from '../../types';

export function useTasks(circleId: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const tasksRef = useRef<Task[]>(tasks);

    // Keep ref in sync
    useEffect(() => {
        tasksRef.current = tasks;
    }, [tasks]);

    // Subscribe to tasks from Firestore
    useEffect(() => {
        if (!circleId) {
            setTasks(INITIAL_TASKS as Task[]); // Fallback to defaults
            setLoading(false);
            return;
        }

        const tasksRef = collection(db, 'careCircles', circleId, 'tasks');
        const tasksQuery = query(tasksRef, orderBy('period'), orderBy('time'));

        const unsubscribe = onSnapshot(tasksQuery,
            (snapshot) => {
                if (snapshot.empty) {
                    // Initialize with default tasks if none exist
                    // Initialize with default tasks if none exist
                    initializeDefaultTasks(circleId);
                } else {
                    const tasksList = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Task[];
                    setTasks(tasksList);
                }
                setLoading(false);
            },
            (err: unknown) => {
                console.error('Error fetching tasks:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

    // Check for daily reset on load
    useEffect(() => {
        if (circleId && tasks.length > 0) {
            checkDailyReset(circleId, tasks);
        }
    }, [circleId, tasks.length > 0]);

    const checkDailyReset = async (cId: string, currentTasks: Task[]) => {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const circleRef = doc(db, 'careCircles', cId);
            const circleDoc = await getDoc(circleRef);

            if (circleDoc.exists()) {
                const data = circleDoc.data();
                if (data.lastResetDate !== today) {
                    console.log('🌅 New day detected! Resetting daily tasks...');
                    await performDailyReset(cId, currentTasks, today);
                }
            }
        } catch (err) {
            console.error('Error checking daily reset:', err);
        }
    };

    const performDailyReset = async (cId: string, currentTasks: Task[], dateStr: string) => {
        try {
            // 1. Reset all recurring tasks
            for (const task of currentTasks) {
                // Medication tasks are recurring by default
                const isMedication = task.type === 'medication' || task.title?.toLowerCase().includes('medicin');
                const isRecurring = task.recurring || isMedication;

                if (isRecurring) {
                    const docId = task.id.startsWith('task_') ? task.id : `task_${task.id}`;
                    await updateDoc(doc(db, 'careCircles', cId, 'tasks', docId), {
                        completed: false,
                        completedAt: null
                    });
                } else if (task.completed) {
                    // Optional: Archive or delete old non-recurring tasks
                    // For now, we'll just leave them or you could delete them if they are older than 24h
                }
            }

            // 2. Update the reset date
            await updateDoc(doc(db, 'careCircles', cId), {
                lastResetDate: dateStr
            });
            console.log('✅ Daily reset complete for', dateStr);
        } catch (err) {
            console.error('Error performing daily reset:', err);
        }
    };



    // Toggle task completion
    const toggleTask = useCallback(async (taskId: string) => {
        if (!circleId) return;

        const task = tasksRef.current.find(t => t.id === taskId || t.id === `task_${taskId}`);
        if (!task) return;

        const taskRef = doc(db, 'careCircles', circleId, 'tasks',
            task.id.startsWith('task_') ? task.id : `task_${task.id}`);

        try {
            await setDoc(taskRef, {
                completed: !task.completed,
                completedAt: !task.completed ? serverTimestamp() : null,
            }, { merge: true });
        } catch (err: unknown) {
            console.error('Error toggling task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, [circleId]); // Stable callback, independent of tasks

    // Add a new task (from relative or senior)
    const addTask = useCallback(async (newTask: Partial<Task>) => {
        if (!circleId) return;

        const taskId = `task_${Date.now()}`;
        const taskRef = doc(db, 'careCircles', circleId, 'tasks', taskId);

        // Default time based on period if not provided
        const defaultTimes: Record<string, string> = {
            morgen: '09:00',
            frokost: '12:00',
            eftermiddag: '15:00',
            aften: '19:00'
        };

        try {
            await setDoc(taskRef, {
                id: taskId,
                ...newTask,
                time: newTask.time || (newTask.period ? defaultTimes[newTask.period] : '12:00'),
                completed: false,
                recurring: newTask.recurring || false,
                createdAt: serverTimestamp(),
                completedAt: null,
            });
            return taskId;
        } catch (err: unknown) {
            console.error('Error adding task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId]);

    // Remove a task
    const removeTask = useCallback(async (taskId: string) => {
        if (!circleId) return;

        const docId = taskId.startsWith('task_') ? taskId : `task_${taskId}`;
        const taskRef = doc(db, 'careCircles', circleId, 'tasks', docId);

        try {
            await deleteDoc(taskRef);
        } catch (err: unknown) {
            console.error('Error removing task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId]);

    // Reset all tasks (mark incomplete)
    const resetTasks = useCallback(async () => {
        if (!circleId) return;

        try {
            for (const task of tasks) {
                const docId = task.id.startsWith('task_') ? task.id : `task_${task.id}`;
                await setDoc(doc(db, 'careCircles', circleId, 'tasks', docId), {
                    completed: false,
                    completedAt: null,
                }, { merge: true });
            }
        } catch (err: unknown) {
            console.error('Error resetting tasks:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, [circleId, tasks]);

    return {
        tasks,
        loading,
        error,
        toggleTask,
        addTask,
        removeTask,
        resetTasks,
    };
}

export default useTasks;

// Initialize default tasks for new circles
const initializeDefaultTasks = async (cId: string) => {
    try {
        for (const task of INITIAL_TASKS) {
            await setDoc(doc(db, 'careCircles', cId, 'tasks', `task_${task.id}`), {
                ...task,
                createdAt: serverTimestamp(),
                completedAt: null,
            });
        }
    } catch (err) {
        console.error('Error initializing tasks:', err);
    }
};
