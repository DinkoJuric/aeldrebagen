// Vitest setup file
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Initialize i18next mock
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: () => new Promise(() => { }),
            language: 'da',
        },
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { },
    },
}));

// Mock Firebase GLOBALLY to prevent initialization errors
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
    getApp: vi.fn(),
    getApps: vi.fn(() => []),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})), // Return object
    onAuthStateChanged: vi.fn((auth, callback) => {
        callback({ uid: 'test-user' });
        return vi.fn();
    }),
    GoogleAuthProvider: vi.fn(),
    deleteUser: vi.fn(),
    reauthenticateWithPopup: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})), // Return object
    collection: vi.fn(),
    doc: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
    enableMultiTabIndexedDbPersistence: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/storage', () => ({
    getStorage: vi.fn(() => ({})), // Return object
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
}));

// Mock AudioContext
global.AudioContext = class AudioContext {
    state = 'running';
    baseLatency = 0;
    outputLatency = 0;
    currentTime = 0;
    destination = {} as AudioDestinationNode;
    sampleRate = 44100;
    listener = {} as AudioListener;
    onstatechange = null;
    createOscillator() {
        return {
            connect: (destination: AudioNode | AudioParam) => { }, // Fix signature
            type: 'sine',
            frequency: { setValueAtTime: () => { } },
            start: () => { },
            stop: () => { },
        } as unknown as OscillatorNode;
    }
    createGain() {
        return {
            connect: (destination: AudioNode | AudioParam) => { }, // Fix signature
            gain: {
                setValueAtTime: () => { },
                linearRampToValueAtTime: () => { },
                exponentialRampToValueAtTime: () => { },
            },
        } as unknown as GainNode;
    }
    resume() { return Promise.resolve(); }
    suspend() { return Promise.resolve(); }
    close() { return Promise.resolve(); }
    createMediaElementSource() { return {} as MediaElementAudioSourceNode }
    createMediaStreamSource() { return {} as MediaStreamAudioSourceNode }
    createMediaStreamDestination() { return {} as MediaStreamAudioDestinationNode }
    createBuffer() { return {} as AudioBuffer }
    createBufferSource() { return {} as AudioBufferSourceNode }
    createAnalyser() { return {} as AnalyserNode }
    createBiquadFilter() { return {} as BiquadFilterNode }
    createChannelMerger() { return {} as ChannelMergerNode }
    createChannelSplitter() { return {} as ChannelSplitterNode }
    createConvolver() { return {} as ConvolverNode }
    createDelay() { return {} as DelayNode }
    createDynamicsCompressor() { return {} as DynamicsCompressorNode }
    createIIRFilter() { return {} as IIRFilterNode }
    createPanner() { return {} as PannerNode }
    createPeriodicWave() { return {} as PeriodicWave }
    createScriptProcessor() { return {} as ScriptProcessorNode }
    createStereoPanner() { return {} as StereoPannerNode }
    createWaveShaper() { return {} as WaveShaperNode }
    decodeAudioData() { return Promise.resolve({} as AudioBuffer) }
    dispatchEvent() { return true }
    addEventListener() { }
    removeEventListener() { }
} as unknown as typeof AudioContext;

global.webkitAudioContext = global.AudioContext;

// Mock vite-plugin-pwa
vi.mock('virtual:pwa-register/react', () => ({
    useRegisterSW: () => ({
        offlineReady: [false, () => { }],
        needRefresh: [false, () => { }],
        updateServiceWorker: () => Promise.resolve(),
    }),
}));
