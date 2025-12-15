// Script to add Louise to the main care circle
// Run with: node --experimental-vm-modules scripts/add-louise-to-circle.mjs

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
const LOUISE_UID = 'p4y6L8sbpthKq3wbcTJlVMdGjil2';
const LOUISE_NAME = 'Louise';
const INVITE_CODE = '6C9Y3M'; // The known circle invite code

async function main() {
    try {
        console.log('[ADD] Adding Louise to care circle...\n');

        // Step 1: Find the circle by invite code
        console.log('1. Finding circle with code:', INVITE_CODE);
        const circlesQuery = query(
            collection(db, 'careCircles'),
            where('inviteCode', '==', INVITE_CODE)
        );
        const circlesSnapshot = await getDocs(circlesQuery);

        if (circlesSnapshot.empty) {
            console.log('[ERROR] No circle found with invite code:', INVITE_CODE);
            process.exit(1);
        }

        const circleDoc = circlesSnapshot.docs[0];
        const circleId = circleDoc.id;
        console.log('[OK] Found circle:', circleId);
        console.log('    Data:', JSON.stringify(circleDoc.data(), null, 2));

        // Step 2: Update Louise's user profile with careCircleId
        console.log('\n2. Updating Louise\'s profile with careCircleId...');
        const userRef = doc(db, 'users', LOUISE_UID);
        await setDoc(userRef, {
            careCircleId: circleId
        }, { merge: true });
        console.log('[OK] Updated user profile');

        // Step 3: Create membership document
        console.log('\n3. Creating careCircleMembership...');
        const membershipId = `${circleId}_${LOUISE_UID}`;
        const membershipRef = doc(db, 'careCircleMemberships', membershipId);
        await setDoc(membershipRef, {
            circleId,
            userId: LOUISE_UID,
            role: 'relative',
            displayName: LOUISE_NAME,
            joinedAt: serverTimestamp(),
        });
        console.log('[OK] Created membership:', membershipId);

        console.log('\n-------------------------------------------');
        console.log('[SUCCESS] Louise has been added to the circle!');
        console.log('She should now be able to log in and see the RelativeView.');
        process.exit(0);
    } catch (err) {
        console.error('[ERROR]:', err.message);
        console.error(err);
        process.exit(1);
    }
}

main();
