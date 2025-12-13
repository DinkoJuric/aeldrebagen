// Test script to create a relative user and join a circle
// Run with: node --experimental-vm-modules scripts/create-test-user.mjs

import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
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

console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING!'
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test user config
const TEST_USER = {
    email: 'louise.relative@test.com',
    password: 'Test1234!',
    displayName: 'Fatima',
    role: 'relative'
};

const INVITE_CODE = '6C9Y3M';

async function main() {
    try {
        console.log('\n🔹 Creating test user:', TEST_USER.email);

        // Create user
        let userCred;
        try {
            userCred = await createUserWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
            console.log('✅ User created:', userCred.user.uid);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                console.log('⚠️ User exists, logging in...');
                userCred = await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
                console.log('✅ Logged in:', userCred.user.uid);
            } else {
                throw err;
            }
        }

        const userId = userCred.user.uid;

        // Create user profile
        console.log('\n🔹 Creating user profile...');
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            email: TEST_USER.email,
            displayName: TEST_USER.displayName,
            role: TEST_USER.role,
            createdAt: serverTimestamp(),
            consentGiven: true,
            consentTimestamp: serverTimestamp(),
        }, { merge: true });
        console.log('✅ Profile created');

        // Find circle by invite code
        console.log('\n🔹 Finding circle with code:', INVITE_CODE);
        const circlesQuery = query(
            collection(db, 'careCircles'),
            where('inviteCode', '==', INVITE_CODE)
        );
        const snapshot = await getDocs(circlesQuery);

        if (snapshot.empty) {
            console.error('❌ No circle found with invite code:', INVITE_CODE);
            process.exit(1);
        }

        const circleDoc = snapshot.docs[0];
        const circleId = circleDoc.id;
        console.log('✅ Found circle:', circleId);

        // Create membership
        console.log('\n🔹 Adding user to circle...');
        const membershipId = `${circleId}_${userId}`;
        const membershipRef = doc(db, 'careCircleMemberships', membershipId);
        await setDoc(membershipRef, {
            circleId,
            userId,
            role: TEST_USER.role,
            displayName: TEST_USER.displayName,
            joinedAt: serverTimestamp(),
        });
        console.log('✅ Membership created');

        // Update user with circle reference
        await setDoc(userRef, { careCircleId: circleId }, { merge: true });

        console.log('\n✅✅✅ SUCCESS! Test user ready:');
        console.log('   Email:', TEST_USER.email);
        console.log('   Password:', TEST_USER.password);
        console.log('   Circle:', circleId);
        console.log('\n👉 Login at http://localhost:5173 to see the RelativeView!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

main();
