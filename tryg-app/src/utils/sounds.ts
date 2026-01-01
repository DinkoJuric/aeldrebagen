// Sound utilities for emotional feedback
// Using Web Audio API for gentle, cross-platform sounds

// Define AudioContext type if needed, but it should be available in lib.dom.d.ts
// We use 'any' for window properties to avoid strict checks if types are missing
interface WindowWithAudio extends Window {
    webkitAudioContext?: typeof AudioContext;
}
const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as unknown as WindowWithAudio).webkitAudioContext) : null;
const audioContext = AudioContextClass ? new AudioContextClass() : null;

// Gentle completion chime - warm and reassuring
export function playCompletionSound() {
    if (!audioContext) return;

    // Resume context if suspended (iOS requirement)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Create a warm, gentle two-note chime
    const frequencies = [523.25, 659.25]; // C5 and E5 - major third, warm and happy

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        // Soft envelope
        gainNode.gain.setValueAtTime(0, now + (i * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.15, now + (i * 0.1) + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + (i * 0.1) + 0.5);
    });
}

// Gentle "thinking of you" ping - single soft tone
export function playPingSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, now); // A5 - clear but not harsh

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.35);
}

// Success celebration - slightly more elaborate
export function playSuccessSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0, now + (i * 0.12));
        gainNode.gain.linearRampToValueAtTime(0.12, now + (i * 0.12) + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.12) + 0.5);

        oscillator.start(now + (i * 0.12));
        oscillator.stop(now + (i * 0.12) + 0.6);
    });
}

// Match celebration - exciting ascending notes for help exchange match
export function playMatchSound() {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const now = audioContext.currentTime;
    // Bright, cheerful ascending notes: G5, B5, D6, G6
    const frequencies = [783.99, 987.77, 1174.66, 1567.98];

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0, now + (i * 0.1));
        gainNode.gain.linearRampToValueAtTime(0.15, now + (i * 0.1) + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.4);

        oscillator.start(now + (i * 0.1));
        oscillator.stop(now + (i * 0.1) + 0.5);
    });
}

export default {
    playCompletionSound,
    playPingSound,
    playSuccessSound,
    playMatchSound
};
