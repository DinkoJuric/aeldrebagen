import { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export function CloudDataCleaner() {
    useEffect(() => {
        const cleanup = async () => {
            console.log('🧹 Cloud Cleanup Initiated...');
            const circleId = 'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765474633095';
            const bradId = 'rlqMo1ifbncpeh00ZEblq8gGgps1';
            const fatimaId = '0Z1HtHTGt2Ri1HR8x1FX9cmzUc93';
            const juzuId = 'awV1tkDPT7hnL9lOLAOCZgJ1LSI2';

            try {
                // 1. Delete ghost memberships for Brad
                const ghosts = [
                    'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709013322',
                    'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709013712',
                    'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709016030',
                    'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709016370'
                ];
                for (const g of ghosts) {
                    await deleteDoc(doc(db, 'careCircleMemberships', `${g}_${bradId}`));
                }

                // 2. Consolidate Brad
                await updateDoc(doc(db, 'users', bradId), {
                    activeCircleId: circleId,
                    careCircleId: circleId
                });

                // 3. Fix Fatima Identity
                await updateDoc(doc(db, 'careCircleMemberships', `${circleId}_${fatimaId}`), {
                    displayName: 'Fatima',
                    relationship: 'Datter'
                });

                // 4. Fix Juzu Identity
                await updateDoc(doc(db, 'careCircleMemberships', `${circleId}_${juzuId}`), {
                    relationship: 'Barnebarn (Han)'
                });

                console.log('✅ Cloud Cleanup Successful. You can now remove this component.');
            } catch (err) {
                console.error('❌ Cloud Cleanup Failed:', err);
            }
        };

        cleanup();
    }, []);

    return null;
}
