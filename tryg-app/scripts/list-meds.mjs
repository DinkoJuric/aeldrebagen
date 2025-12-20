
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
    console.log(`🔍 Listing medicine tasks for: ${CARE_CIRCLE_ID}`);
    const tasksRef = collection(db, 'careCircles', CARE_CIRCLE_ID, 'tasks');
    const tasksSnap = await getDocs(tasksRef);

    const medicineTasks = [];
    tasksSnap.forEach(docSnap => {
        const data = docSnap.data();
        const isMed = data.title?.toLowerCase().includes('medicin') ||
            data.title?.toLowerCase().includes('pille') ||
            data.title?.toLowerCase().includes('lac') ||
            data.type === 'medication';
        if (isMed) {
            medicineTasks.push({ id: docSnap.id, ...data });
        }
    });

    console.log(`Found ${medicineTasks.length} medicine tasks:`);
    medicineTasks.forEach(task => {
        console.log(`- [${task.id}] ${task.title} (Type: ${task.type}, CreatedAt: ${task.createdAt})`);
    });
}

listMedicineTasks();
