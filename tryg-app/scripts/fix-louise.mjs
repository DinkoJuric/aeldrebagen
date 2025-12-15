// Script to fix Louise's account by creating her profile
// Run with: node --experimental-vm-modules scripts/fix-louise.mjs

import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';
import { config } from 'dotenv';

// Load env vars from .env.local
config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Louise's info
const LOUISE_EMAIL = 'pernillew-s@hotmail.com';
const LOUISE_NAME = 'Louise'; // Update if different

async function main() {
    try {
        console.log('[FIX] Checking and fixing Louise account:', LOUISE_EMAIL);
        console.log('-------------------------------------------\n');

        // Step 1: Check if profile exists
        console.log('1. Searching for existing profile...');
        const usersQuery = query(
            collection(db, 'users'),
            where('email', '==', LOUISE_EMAIL)
        );
        const usersSnapshot = await getDocs(usersQuery);

        if (!usersSnapshot.empty) {
            console.log('[OK] Profile already exists:');
            usersSnapshot.forEach(d => {
                console.log('    ID:', d.id);
                console.log('    Data:', JSON.stringify(d.data(), null, 2));
            });
            console.log('\n[!] Profile exists - checking for careCircleId...');

            const userData = usersSnapshot.docs[0].data();
            const userId = usersSnapshot.docs[0].id;

            if (!userData.careCircleId) {
                console.log('[!] No careCircleId - user needs to join a circle');
                console.log('    Ask Louise to use an invite code to join a circle.');
            } else {
                console.log('[OK] Has careCircleId:', userData.careCircleId);

                // Check if circle exists
                const circleDoc = await getDoc(doc(db, 'careCircles', userData.careCircleId));
                if (!circleDoc.exists()) {
                    console.log('[!] ERROR: Circle does not exist! This is the problem.');
                    console.log('    The careCircleId points to a non-existent circle.');
                    console.log('    FIX: Remove careCircleId from user profile so she can rejoin.');

                    // Fix: Remove the bad careCircleId
                    await setDoc(doc(db, 'users', userId), { careCircleId: null }, { merge: true });
                    console.log('[FIXED] Removed bad careCircleId. Louise can now rejoin a circle.');
                } else {
                    console.log('[OK] Circle exists:', circleDoc.data());
                    console.log('\n[?] Profile and circle look OK. The error may be elsewhere.');
                    console.log('    Check: consentGiven, role, network issues');
                }
            }
        } else {
            console.log('[!] NO PROFILE FOUND - This is the problem!');
            console.log('[!] Louise has Firebase Auth but no Firestore profile.');
            console.log('\nTo fix, we need her Firebase UID (from Firebase Console)');
            console.log('or she needs to sign up again with a fresh account.');
        }

        console.log('\n-------------------------------------------');
        console.log('[DONE]');
        process.exit(0);
    } catch (err) {
        console.error('[ERROR]:', err.message);
        console.error(err);
        process.exit(1);
    }
}

main();
