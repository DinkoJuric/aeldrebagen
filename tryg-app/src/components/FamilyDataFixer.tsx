
import { useEffect } from 'react';
import { doc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export const FamilyDataFixer = () => {
    useEffect(() => {
        const fixData = async () => {
            console.log('🔧 Running Family Data Fixer...');

            // We need to find the specific membership documents for Louise and Juzu
            // Since IDs might be random or 'Louise', 'Juzu', we'll search by name or try direct IDs if known.
            // In POC, IDs are often just the name lowercase.



            // HEURISTIC: Search for members with these names
            const q = query(collection(db, 'careCircleMemberships'));
            const snapshot = await getDocs(q);

            snapshot.forEach(async (document) => {
                const data = document.data();
                const name = data.displayName?.toLowerCase() || '';

                if (name.includes('louise')) {
                    console.log('Updating Louise:', document.id);
                    await setDoc(doc(db, 'careCircleMemberships', document.id), {
                        relationship: 'Datter' // Relationship to Senior (Brad)
                    }, { merge: true });
                }

                if (name.includes('juzu')) {
                    console.log('Updating Juzu:', document.id);
                    await setDoc(doc(db, 'careCircleMemberships', document.id), {
                        relationship: 'Barnebarn (Han)'
                    }, { merge: true });
                }

                // Also ensure Fatima is 'Datter' if not already
                if (name.includes('fatima')) {
                    console.log('Updating Fatima:', document.id);
                    await setDoc(doc(db, 'careCircleMemberships', document.id), {
                        relationship: 'Datter'
                    }, { merge: true });
                }
            });

            console.log('✅ Family Data Fixer Complete');
        };

        fixData();
    }, []);

    return null; // Invisible component
};
