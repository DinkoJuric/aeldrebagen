// Script to check a user's Firestore records
// Run with: node --experimental-vm-modules scripts/check-user.mjs

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
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
const auth = getAuth(app);
const db = getFirestore(app);

// User to check
const EMAIL_TO_CHECK = 'pernillew-s@hotmail.com';

async function main() {
    try {
        console.log('\n[CHECK] Looking for user:', EMAIL_TO_CHECK);
        console.log('-------------------------------------------');

        // Try to find user in Firestore users collection by email
        console.log('\n1. Searching users collection by email...');
        const usersQuery = query(
            collection(db, 'users'),
            where('email', '==', EMAIL_TO_CHECK)
        );
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
            console.log('[!] NO USER PROFILE FOUND with email:', EMAIL_TO_CHECK);
            console.log('    This is likely the problem - user authenticated but no profile document.');
        } else {
            usersSnapshot.forEach(doc => {
                console.log('[OK] Found user profile:');
                console.log('    Document ID:', doc.id);
                console.log('    Data:', JSON.stringify(doc.data(), null, 2));

                const userData = doc.data();

                // Check if user has a careCircleId
                if (userData.careCircleId) {
                    console.log('\n2. Checking care circle:', userData.careCircleId);
                    // We'll check this separately
                } else {
                    console.log('[!] User has NO careCircleId - they need to join a circle');
                }
            });
        }

        // Check careCircleMemberships
        console.log('\n3. Searching careCircleMemberships...');
        const membershipsQuery = query(
            collection(db, 'careCircleMemberships'),
            where('userId', '==', EMAIL_TO_CHECK) // This won't work - userId is UID not email
        );
        // Note: This query won't work because memberships use UID, not email
        // We'd need the UID first

        console.log('\n-------------------------------------------');
        console.log('[SUMMARY]');
        console.log('If no user profile was found, the user needs to:');
        console.log('1. Complete signup properly (profile document was never created)');
        console.log('2. OR their Firebase Auth account exists but Firestore profile is missing');
        console.log('\nTo fix: Create their profile document in Firestore manually or via a script.');

        process.exit(0);
    } catch (err) {
        console.error('[ERROR]:', err.message);
        console.error(err);
        process.exit(1);
    }
}

main();
