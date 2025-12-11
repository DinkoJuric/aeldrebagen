// Firebase configuration for Tryg App
// https://console.firebase.google.com/project/tryg-app-c1a93

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    getFirestore,
    connectFirestoreEmulator,
    enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAwOIfKLSKMedGPcgAi9Qkxh5jeWD5-h5E",
    authDomain: "tryg-app-c1a93.firebaseapp.com",
    projectId: "tryg-app-c1a93",
    storageBucket: "tryg-app-c1a93.firebasestorage.app",
    messagingSenderId: "173732222262",
    appId: "1:173732222262:web:f7fead43fed4f5d14f8f97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence for Firestore
// This allows the app to work offline and sync when back online
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence unavailable: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // The current browser doesn't support persistence
        console.warn('Firestore persistence not supported by this browser');
    }
});

// Uncomment for local development with emulators
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;
