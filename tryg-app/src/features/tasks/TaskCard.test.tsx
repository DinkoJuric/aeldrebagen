import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import { Task } from '../../types';
import { vi, describe, it, expect } from 'vitest';

describe('TaskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Drink Water',
        period: 'morning',
        time: '08:00',
        completed: false,
        type: 'hydration',
        createdByName: 'Mom',
        createdByRole: 'relative'
    };

    it('renders task details correctly', () => {
        render(<TaskCard task={mockTask} onToggle={() => {}} />);
        expect(screen.getByText('Drink Water')).toBeDefined();
        expect(screen.getByText('08:00')).toBeDefined();
        expect(screen.getByText('Fra Mom')).toBeDefined();
    });

    it('calls onToggle when clicked', () => {
        const handleToggle = vi.fn();
        render(<TaskCard task={mockTask} onToggle={handleToggle} />);

        fireEvent.click(screen.getByText('Drink Water'));
        expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it('renders completed state correctly', () => {
        const completedTask = { ...mockTask, completed: true };
        const { container } = render(<TaskCard task={completedTask} onToggle={() => {}} />);

        // Check for strikethrough class or visual indicator
        const title = screen.getByText('Drink Water');
        expect(title.className).toContain('line-through');
    });
});
