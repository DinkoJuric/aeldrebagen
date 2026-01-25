import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoriesGallery } from './MemoriesGallery';
import * as firestore from 'firebase/firestore';

// Mock Firestore
vi.mock('firebase/firestore', async () => {
    const actual = await vi.importActual('firebase/firestore');
    return {
        ...actual,
        collection: vi.fn(),
        query: vi.fn(),
        orderBy: vi.fn(),
        limit: vi.fn(),
        onSnapshot: vi.fn(),
        getFirestore: vi.fn(() => ({})),
    };
});

// Mock Audio
const mockPlay = vi.fn(() => Promise.resolve()); // Return a Promise
const mockPause = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Use a proper function/class for the mock to support 'new Audio()'
const MockAudio = vi.fn(function() {
    return {
        play: mockPlay,
        pause: mockPause,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        src: '',
    };
});

describe('MemoriesGallery', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('Audio', MockAudio);

        // Mock onSnapshot to return data immediately
        (firestore.onSnapshot as any).mockImplementation((query: any, callback: any) => {
            const mockData = [
                {
                    id: 'mem1',
                    data: () => ({
                        url: 'http://audio1.mp3',
                        type: 'audio',
                        createdByName: 'User 1',
                        createdAt: { seconds: 1000, nanoseconds: 0 },
                        questionText: 'Question 1'
                    })
                },
                {
                    id: 'mem2',
                    data: () => ({
                        url: 'http://audio2.mp3',
                        type: 'audio',
                        createdByName: 'User 2',
                        createdAt: { seconds: 2000, nanoseconds: 0 },
                        questionText: 'Question 2'
                    })
                }
            ];

            callback({
                docs: mockData,
                forEach: (fn: any) => mockData.forEach(fn)
            });

            return vi.fn(); // unsubscribe
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render memories correctly', () => {
        render(<MemoriesGallery circleId="test-circle" />);
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    it('should stop current audio when playing a new one', () => {
        render(<MemoriesGallery circleId="test-circle" />);

        const playButtons = screen.getAllByRole('button');
        expect(playButtons.length).toBeGreaterThanOrEqual(2);

        // Play first
        fireEvent.click(playButtons[0]);
        expect(mockPlay).toHaveBeenCalledTimes(1);

        // Play second
        fireEvent.click(playButtons[1]);

        // Expect pause to have been called on the first instance
        expect(mockPause).toHaveBeenCalled();
    });
});
