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

        // 2. Fetch tasks for analysis and potential purge
        const tasksRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'tasks');
        const tasksSnap = await getDocs(tasksRef);

        // 3. Clear medicine tasks (Purge legacy data)
        console.log('\n💊 Purging medicine-related tasks...');
        const medicineCount = tasksSnap.docs.filter(docSnap => {
            const data = docSnap.data();
            return data.title?.toLowerCase().includes('medicin') ||
                data.title?.toLowerCase().includes('pille') ||
                data.title?.toLowerCase().includes('lac') ||
                data.type === 'medication';
        }).length;

        const taskPurgeBatch = writeBatch(db);
        let purgedCount = 0;
        tasksSnap.forEach((docSnap) => {
            const data = docSnap.data();
            const isMed = data.title?.toLowerCase().includes('medicin') ||
                data.title?.toLowerCase().includes('pille') ||
                data.title?.toLowerCase().includes('lac') ||
                data.type === 'medication';

            if (isMed) {
                taskPurgeBatch.delete(docSnap.ref);
                purgedCount++;
            }
        });

        if (purgedCount > 0) {
            await taskPurgeBatch.commit();
            console.log(`   ✅ Purged ${purgedCount} medicine tasks`);
        } else {
            console.log('   ℹ️  No medicine tasks to purge');
        }

        // 3. Reset OTHER task completion status (keep non-med tasks, just uncheck them)
        console.log('\n📝 Resetting remaining task completion status...');
        let resetCount = 0;
        for (const docSnap of tasksSnap.docs) {
            const taskData = docSnap.data();
            // Don't try to update if we just deleted it
            const isMed = taskData.title?.toLowerCase().includes('medicin') ||
                taskData.title?.toLowerCase().includes('pille') ||
                taskData.title?.toLowerCase().includes('lac') ||
                taskData.type === 'medication';

            if (!isMed && (taskData.completed || taskData.completedAt)) {
                await updateDoc(docSnap.ref, {
                    completed: false,
                    completedAt: null
                });
                resetCount++;
            }
        }

        console.log(`   ✅ Reset ${resetCount} completed tasks`);

        // 4. Clear activity pings
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

        // 5. Reset lastResetDate to today
        console.log('\n📅 Setting lastResetDate to today...');
        const circleRef = doc(db, 'careCircles', CARE_CIRCLE_ID);
        await updateDoc(circleRef, {
            lastResetDate: new Date().toISOString().split('T')[0]
        });
        console.log('   ✅ Updated lastResetDate');

        console.log('\n✨ Data reset and purge complete!\n');
        console.log('Your app will now start fresh with 0 medicine tasks.');
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
