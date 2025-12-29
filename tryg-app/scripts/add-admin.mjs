// Script to add an admin user
// Run with: node --experimental-vm-modules scripts/add-admin.mjs <user-uid>

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

async function main() {
    try {
        const adminUid = process.argv[2];

        if (!adminUid) {
            console.error('❌ Missing required argument: User UID');
            process.exit(1);
        }

        console.log(`\n🔹 Adding admin user: ${adminUid}`);

        const adminRef = doc(db, 'admins', adminUid);
        await setDoc(adminRef, { isAdmin: true });

        console.log('✅ Admin user added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

main();
