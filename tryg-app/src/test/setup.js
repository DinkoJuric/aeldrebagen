// Vitest setup file - runs before each test file
import '@testing-library/jest-dom'

// Mock AudioContext for sounds.js (doesn't exist in test environment)
global.AudioContext = class AudioContext {
    constructor() {
        this.state = 'running';
        this.currentTime = 0;
        this.destination = {};
    }
    createOscillator() {
        return {
            connect: () => { },
            type: 'sine',
            frequency: { setValueAtTime: () => { } },
            start: () => { },
            stop: () => { },
        };
    }
    createGain() {
        return {
            connect: () => { },
            gain: {
                setValueAtTime: () => { },
                linearRampToValueAtTime: () => { },
                exponentialRampToValueAtTime: () => { },
            },
        };
    }
    resume() { return Promise.resolve(); }
};
global.webkitAudioContext = global.AudioContext;
