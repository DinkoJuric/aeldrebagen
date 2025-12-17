// Vitest setup file - runs before each test file
import '@testing-library/jest-dom'
import { vi } from 'vitest'

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

// Mock vite-plugin-pwa virtual module (doesn't exist in test environment)
// This fixes: Error: Failed to resolve import "virtual:pwa-register/react"
vi.mock('virtual:pwa-register/react', () => ({
    useRegisterSW: () => ({
        offlineReady: [false, () => { }],
        needRefresh: [false, () => { }],
        updateServiceWorker: () => Promise.resolve(),
    }),
}));
