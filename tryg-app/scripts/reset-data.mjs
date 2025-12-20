/**
 * Firestore Data Reset Script
 * 
 * This script clears old symptoms and resets completed tasks
 * to start fresh tracking from today.
 * 
 * Usage:
 *   1. Create a .env file in the tryg-app root with your Firebase config
 *   2. Run: node --env-file=.env.local scripts/reset-data.mjs <circle-id>
 * 
 * Or set environment variables directly:
 *   FIREBASE_API_KEY=xxx node scripts/reset-data.mjs <circle-id>
 */

import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    doc,
    writeBatch
} from 'firebase/firestore';

// Validate environment variables
const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('\nRun with: node --env-file=.env.local scripts/reset-data.mjs <circle-id>');
    process.exit(1);
}

// Firebase config from environment
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The care circle ID to reset
const CARE_CIRCLE_ID = process.argv[2];

if (!CARE_CIRCLE_ID) {
    console.error('❌ Please provide the care circle ID as an argument:');
    console.error('   node --env-file=.env.local scripts/reset-data.mjs <circle-id>');
    console.error('\n   To find your circle ID:');
    console.error('   1. Open Firebase Console → Firestore Database');
    console.error('   2. Look in the careCircles collection');
    console.error('   3. Copy the document ID (e.g., "abc123xyz")');
    process.exit(1);
}

async function resetData() {
    console.log(`\n🔄 Resetting data for care circle: ${CARE_CIRCLE_ID}\n`);

    try {
        // 1. Delete all symptoms
        console.log('📊 Deleting symptoms...');
        const symptomsRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'symptoms');
        const symptomsSnap = await getDocs(symptomsRef);

        const symptomBatch = writeBatch(db);
        let symptomCount = 0;
        symptomsSnap.forEach((docSnap) => {
            symptomBatch.delete(docSnap.ref);
            symptomCount++;
        });

        if (symptomCount > 0) {
            await symptomBatch.commit();
            console.log(`   ✅ Deleted ${symptomCount} symptoms`);
        } else {
            console.log('   ℹ️  No symptoms to delete');
        }

        // 2. Reset task completion status (keep tasks, just uncheck them)
        console.log('\n📝 Resetting task completion status...');
        const tasksRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'tasks');
        const tasksSnap = await getDocs(tasksRef);

        let taskCount = 0;
        for (const docSnap of tasksSnap.docs) {
            const taskData = docSnap.data();
            if (taskData.completed || taskData.completedAt) {
                await updateDoc(docSnap.ref, {
                    completed: false,
                    completedAt: null
                });
                taskCount++;
            }
        }

        console.log(`   ✅ Reset ${taskCount} completed tasks`);

        // 3. Clear activity pings
        console.log('\n💬 Clearing old pings...');
        const pingsRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'pings');
        const pingsSnap = await getDocs(pingsRef);

        const pingBatch = writeBatch(db);
        let pingCount = 0;
        pingsSnap.forEach((docSnap) => {
            pingBatch.delete(docSnap.ref);
            pingCount++;
        });

        if (pingCount > 0) {
            await pingBatch.commit();
            console.log(`   ✅ Deleted ${pingCount} pings`);
        } else {
            console.log('   ℹ️  No pings to delete');
        }

        // 4. Reset lastResetDate to today
        console.log('\n📅 Setting lastResetDate to today...');
        const circleRef = doc(db, 'careCircles', CARE_CIRCLE_ID);
        await updateDoc(circleRef, {
            lastResetDate: new Date().toISOString().split('T')[0]
        });
        console.log('   ✅ Updated lastResetDate');

        console.log('\n✨ Data reset complete!\n');
        console.log('Your app will now start fresh from today.');
        console.log('Refresh the browser to see the changes.\n');

    } catch (error) {
        console.error('❌ Error resetting data:', error);
        if (error.code === 'permission-denied') {
            console.error('\n   This usually means you need to be authenticated.');
            console.error('   Try running from the Firebase Console instead.');
        }
        process.exit(1);
    }

    process.exit(0);
}

resetData();
