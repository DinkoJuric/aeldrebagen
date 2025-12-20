
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs
} from 'firebase/firestore';

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
const CARE_CIRCLE_ID = process.argv[2];

async function listMedicineTasks() {
    const tasksRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'tasks');
    const tasksSnap = await getDocs(tasksRef);

    let medicineCount = 0;
    tasksSnap.forEach(docSnap => {
        const data = docSnap.data();
        const isMed = data.title?.toLowerCase().includes('medicin') ||
            data.title?.toLowerCase().includes('pille') ||
            data.title?.toLowerCase().includes('lac') ||
            data.type === 'medication';

        if (isMed) {
            medicineCount++;
            console.log(`- [${docSnap.id}] "${data.title}" | Type: ${data.type} | Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
        }
    });
    console.log(`\n✅ Found total of ${medicineCount} medicine tasks.`);
}

listMedicineTasks();
