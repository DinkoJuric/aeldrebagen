import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithContext } from './test-utils';
import { AmbientTab } from '../components/shared/AmbientTab';
import { Task } from '../types';

// Mock Firebase config
vi.mock('../config/firebase', () => ({
    db: {},
    auth: {}
}));

// Mock sub-components that we don't need to test deeply
vi.mock('../features/ambient', () => ({
    AmbientHero: () => <div data-testid="ambient-hero">Hero</div>,
    BriefingStory: () => <div data-testid="briefing-story">Briefing</div>,
    ActivityTimeline: () => <div data-testid="activity-timeline">Timeline</div>
}));

vi.mock('../features/coffee', () => ({
    CoffeeInviteCard: () => <div data-testid="coffee-card">Coffee</div>
}));

// Mock LiquidView to render children directly (avoid framer-motion complexity in test)
vi.mock('../components/ui/LiquidView', () => ({
    LiquidList: ({ children }: any) => <div>{children}</div>,
    LiquidItem: ({ children }: any) => <div>{children}</div>
}));

// We WANT to use real TaskCard? Or mock it to verify props?
// Real TaskCard is fine, but maybe safer to mock it to verify onToggle prop directly?
// Let's use real TaskCard to ensure integration works.
// But TaskCard uses framer-motion/cva etc.
// Let's mock TaskCard for simplicity and to verify EXACTLY what I changed.
vi.mock('../features/tasks/TaskCard', () => ({
    TaskCard: ({ task, onToggle }: any) => (
        <button data-testid={`task-${task.id}`} onClick={() => onToggle(task.id)}>
            {task.title}
        </button>
    )
}));

describe('AmbientTab Integration', () => {
    it('passes toggleTask correctly to TaskCard', () => {
        const mockToggleTask = vi.fn();
        const tasks: Task[] = [
            {
                id: 'task1',
                title: 'Test Task',
                completed: false,
                period: 'morgen',
                time: '09:00',
                type: 'activity'
            }
        ];

        renderWithContext(<AmbientTab role="senior" />, {
            tasks: tasks,
            toggleTask: mockToggleTask
        });

        // Find task (Morgen is open by default)
        const taskButton = screen.getByTestId('task-task1');
        expect(taskButton).toBeInTheDocument();

        // Click task
        fireEvent.click(taskButton);

        // Verify toggleTask called with ID
        expect(mockToggleTask).toHaveBeenCalledWith('task1');
    });
});
