
// Tasks hook - real-time task sync via Firestore
// Replaces localStorage for multi-user task management

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { INITIAL_TASKS } from '../../data/constants';

export interface Task {
    id: string;
    title: string;
    period: string;
    time: string;
    emoji: string;
    completed: boolean;
    createdAt?: any;
    completedAt?: any;
    [key: string]: any; // Allow other props
}

export function useTasks(circleId: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            (err: any) => {
                console.error('Error fetching tasks:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId]);

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

    // Toggle task completion
    const toggleTask = useCallback(async (taskId: string) => {
        if (!circleId) return;

        const task = tasks.find(t => t.id === taskId || t.id === `task_${taskId}`);
        if (!task) return;

        const taskRef = doc(db, 'careCircles', circleId, 'tasks',
            task.id.startsWith('task_') ? task.id : `task_${task.id}`);

        try {
            await setDoc(taskRef, {
                completed: !task.completed,
                completedAt: !task.completed ? serverTimestamp() : null,
            }, { merge: true });
        } catch (err: any) {
            console.error('Error toggling task:', err);
            setError(err.message);
        }
    }, [circleId, tasks]);

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
                createdAt: serverTimestamp(),
                completedAt: null,
            });
            return taskId;
        } catch (err: any) {
            console.error('Error adding task:', err);
            setError(err.message);
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
        } catch (err: any) {
            console.error('Error removing task:', err);
            setError(err.message);
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
        } catch (err: any) {
            console.error('Error resetting tasks:', err);
            setError(err.message);
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
