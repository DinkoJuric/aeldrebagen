// Sound utilities for emotional feedback
// Using Web Audio API for gentle, cross-platform sounds

let audioContext = null;

// Lazy init AudioContext to avoid iOS autoplay restrictions
const getAudioContext = () => {
    if (!audioContext && typeof window !== 'undefined') {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio not available:', e);
            return null;
        }
    }
    return audioContext;
};

// Gentle completion chime - warm and reassuring
export async function playCompletionSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        // Resume context if suspended (iOS requirement)
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const now = ctx.currentTime;

        // Create a warm, gentle two-note chime
        const frequencies = [523.25, 659.25]; // C5 and E5 - major third, warm and happy

        frequencies.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now);

            // Soft envelope
            gainNode.gain.setValueAtTime(0, now + (i * 0.1));
            gainNode.gain.linearRampToValueAtTime(0.15, now + (i * 0.1) + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

            oscillator.start(now + (i * 0.1));
            oscillator.stop(now + (i * 0.1) + 0.5);
        });
    } catch (e) {
        console.warn('Sound playback failed:', e);
    }
}

// Gentle "thinking of you" ping - single soft tone
export async function playPingSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const now = ctx.currentTime;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now); // A5 - clear but not harsh

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.35);
    } catch (e) {
        console.warn('Ping sound failed:', e);
    }
}

// Success celebration - slightly more elaborate
export async function playSuccessSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const now = ctx.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio

        frequencies.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now);

            gainNode.gain.setValueAtTime(0, now + (i * 0.12));
            gainNode.gain.linearRampToValueAtTime(0.12, now + (i * 0.12) + 0.03);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.12) + 0.5);

            oscillator.start(now + (i * 0.12));
            oscillator.stop(now + (i * 0.12) + 0.6);
        });
    } catch (e) {
        console.warn('Success sound failed:', e);
    }
}

export default {
    playCompletionSound,
    playPingSound,
    playSuccessSound
};
