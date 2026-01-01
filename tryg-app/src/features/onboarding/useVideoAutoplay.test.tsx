import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVideoAutoplay } from './useVideoAutoplay';

describe('useVideoAutoplay', () => {
    let mockVideo: {
        play: ReturnType<typeof vi.fn>;
        pause: ReturnType<typeof vi.fn>;
        muted: boolean;
        paused: boolean;
    };

    beforeEach(() => {
        // Mock HTMLVideoElement methods and properties
        mockVideo = {
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            muted: true,
            paused: true, // Default to paused
        };
    });

    it('should handle step change correctly (Effect 1)', () => {
        // We need to setup the ref before the effect runs.
        // One way is to use a component wrapper, or simulate the flow.

        const { result, rerender } = renderHook(({ isMuted, step }) => useVideoAutoplay(isMuted, step), {
            initialProps: { isMuted: true, step: 0 }
        });

        // Assign ref
        // @ts-expect-error - Mocking readonly ref for testing purposes
        result.current.videoRef.current = mockVideo;

        // Change step to trigger Effect 1
        rerender({ isMuted: true, step: 1 });

        expect(mockVideo.muted).toBe(true);
        expect(mockVideo.play).toHaveBeenCalled();
    });

    it('should attempt to unmute and retry play if autoplay fails', async () => {
        mockVideo.play.mockRejectedValueOnce(new Error('Autoplay prevented'));

        const { result, rerender } = renderHook(({ isMuted, step }) => useVideoAutoplay(isMuted, step), {
            initialProps: { isMuted: false, step: 0 }
        });

        // @ts-expect-error - Mocking readonly ref for testing purposes
        result.current.videoRef.current = mockVideo;

        // Change step
        rerender({ isMuted: false, step: 1 });

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 0));

        // Expect it to have tried to play
        expect(mockVideo.play).toHaveBeenCalled();

        // Since we mocked play to reject, it should catch and try to mute and play again
        // However, our mock logic is simple.
        // The code:
        // .catch(error => {
        //     if (videoRef.current && !videoRef.current.muted) {
        //         videoRef.current.muted = true;
        //         videoRef.current.play().catch(...)
        //     }
        // })

        // If we passed isMuted=false, video.muted becomes false.
        // Then play() rejects.
        // Catch block runs. !video.muted is true.
        // sets muted = true.
        // calls play() again.

        // Need to verify muted became true and play called twice.
        // Note: mockVideo object is a plain object, setters won't automatically update properties unless we use getter/setter or just check calls.
        // But the code writes to .muted property.

        expect(mockVideo.muted).toBe(true);
        expect(mockVideo.play).toHaveBeenCalledTimes(2);
    });

    it('should resume playback when unmuted if paused (Effect 2)', () => {
        const { result, rerender } = renderHook(({ isMuted, step }) => useVideoAutoplay(isMuted, step), {
            initialProps: { isMuted: true, step: 0 }
        });

        // @ts-expect-error - Mocking readonly ref for testing purposes
        result.current.videoRef.current = mockVideo;
        mockVideo.paused = true; // Video is paused

        // User unmutes
        rerender({ isMuted: false, step: 0 });

        expect(mockVideo.muted).toBe(false);
        expect(mockVideo.play).toHaveBeenCalled();
    });

    it('should NOT resume playback when unmuted if NOT paused', () => {
        const { result, rerender } = renderHook(({ isMuted, step }) => useVideoAutoplay(isMuted, step), {
            initialProps: { isMuted: true, step: 0 }
        });

        // @ts-expect-error - Mocking readonly ref for testing purposes
        result.current.videoRef.current = mockVideo;
        mockVideo.paused = false; // Video is playing

        // User unmutes
        rerender({ isMuted: false, step: 0 });

        expect(mockVideo.muted).toBe(false);
        expect(mockVideo.play).not.toHaveBeenCalled();
    });

    it('should handle manual mute toggle', () => {
        const { result } = renderHook(() => useVideoAutoplay(true, 0));

        // @ts-expect-error - Mocking readonly ref for testing purposes
        result.current.videoRef.current = mockVideo;
        mockVideo.paused = true;

        act(() => {
            result.current.handleToggleMute(false); // Unmute manually
        });

        expect(mockVideo.muted).toBe(false);
        expect(mockVideo.play).toHaveBeenCalled();
    });
});
