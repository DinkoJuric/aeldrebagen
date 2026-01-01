import { useRef, useEffect } from 'react';

export const useVideoAutoplay = (isMuted: boolean, step: number) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Effect 1: Handle Lifecycle & Autoplay (Run only when step changes)
    useEffect(() => {
        if (videoRef.current) {
            // iOS Critical: Always reset to muted before attempting autoplay
            videoRef.current.muted = isMuted;

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                    if (videoRef.current && !videoRef.current.muted) {
                        videoRef.current.muted = true;
                        videoRef.current.play().catch(e => console.error("Retry failed", e));
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    // Effect 2: Handle Audio Toggle (User Interaction)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            // Critical fix: If user unmutes, we must ensure playback resumes if it was paused
            if (!isMuted && videoRef.current.paused) {
                videoRef.current.play().catch(e => console.log("Resume on unmute failed:", e));
            }
        }
    }, [isMuted]);

    // Handle mute toggle directly from the button click
    const handleToggleMute = (newMuted: boolean) => {
        if (videoRef.current) {
            videoRef.current.muted = newMuted;
            if (!newMuted && videoRef.current.paused) {
                videoRef.current.play().catch(e => console.error("Play failed", e));
            }
        }
    };

    return { videoRef, handleToggleMute };
};
