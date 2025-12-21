import { db } from './src/config/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

async function fixData() {
    console.log('--- DATA CLEANUP START ---');

    const circleId = 'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765474633095';
    const bradId = 'rlqMo1ifbncpeh00ZEblq8gGgps1';
    const fatimaId = '0Z1HtHTGt2Ri1HR8x1FX9cmzUc93';
    const louiseId = 'p4y6L8sbpthKq3wbcTJlVMdGjil2';
    const juzuId = 'awV1tkDPT7hnL9lOLAOCZgJ1LSI2';

    // 1. Delete redundant circles for Brad
    const ghostCircles = [
        'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709013322',
        'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709013712',
        'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709016030',
        'circle_rlqMo1ifbncpeh00ZEblq8gGgps1_1765709016370'
    ];

    for (const ghostId of ghostCircles) {
        try {
            await deleteDoc(doc(db, 'careCircleMemberships', `${ghostId}_${bradId}`));
            console.log(`Deleted ghost membership: ${ghostId}`);
        } catch (e) {
            console.error(`Failed to delete ${ghostId}`, e);
        }
    }

    // 2. Set active circle for Brad
    try {
        await updateDoc(doc(db, 'users', bradId), {
            activeCircleId: circleId,
            careCircleId: circleId
        });
        console.log('Updated Brad profile with activeCircleId');
    } catch (e) {
        console.error('Failed to update Brad profile', e);
    }

    // 3. Fix Fatima's name in the correct circle
    try {
        await updateDoc(doc(db, 'careCircleMemberships', `${circleId}_${fatimaId}`), {
            displayName: 'Fatima',
            relationship: 'Datter'
        });
        console.log('Updated Fatima in family circle');
    } catch (e) {
        console.error('Failed to update Fatima', e);
    }

    // 4. Update Juzu's relationship (relative to Brad)
    try {
        await updateDoc(doc(db, 'careCircleMemberships', `${circleId}_${juzuId}`), {
            relationship: 'Barnebarn (Han)'
        });
        console.log('Fixed Juzu relation');
    } catch (e) {
        console.error('Failed to update Juzu', e);
    }

    console.log('--- DATA CLEANUP DONE ---');
}

// I can't run this script as a standalone TS file easily without setup
// I will use individual MCP calls instead.
