import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import MemoryCard from './MemoryCard';
import { Memory } from '../../types';

// Mock dateUtils
vi.mock('../../utils/dateUtils', () => ({
    toJsDate: (val: any) => val ? new Date(val) : null,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('MemoryCard', () => {
    const mockMemory: Memory = {
        id: '1',
        url: 'http://example.com/audio.mp3',
        type: 'audio',
        createdByName: 'Test User',
        createdAt: '2023-01-01T12:00:00Z',
        questionText: 'Test Question',
        duration: 10,
    };

    it('renders memory details correctly', () => {
        render(<MemoryCard memory={mockMemory} />);

        expect(screen.getByText('Test Question')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        // We verify the type text is rendered (mocked translation key 'audio')
        expect(screen.getByText('audio')).toBeInTheDocument();
    });

    it('plays audio when button is clicked', () => {
        const playMock = vi.fn();
        // Mock Audio constructor
        vi.stubGlobal('Audio', vi.fn(function() {
            return { play: playMock };
        }));

        render(<MemoryCard memory={mockMemory} />);

        const button = screen.getByLabelText('play_audio');
        fireEvent.click(button);

        expect(global.Audio).toHaveBeenCalledWith('http://example.com/audio.mp3');
        expect(playMock).toHaveBeenCalled();

        vi.unstubAllGlobals();
    });
});
