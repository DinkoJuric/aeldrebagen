
// Help Exchange hook - real-time sync via Firestore
// Syncs help offers and requests across family circle members

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

import { HelpOffer, HelpRequest } from '../../types';

// Whitelist of safe fields to save to Firestore
// React components (icon) and their Symbol properties are NOT safe
const SAFE_HELP_FIELDS = ['id', 'label', 'emoji'];

export function useHelpExchange(
    circleId: string | null,
    userId: string | null = null,
    userRole: string | null = null,
    displayName: string | null = null
) {
    const [helpOffers, setHelpOffers] = useState<HelpOffer[]>([]);
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to help offers from Firestore
    useEffect(() => {
        if (!circleId) {
            setTimeout(() => {
                setHelpOffers([]);
                setHelpRequests([]);
                setLoading(false);
            }, 0);
            return;
        }

        // Subscribe to offers
        const offersRef = collection(db, 'careCircles', circleId, 'helpOffers');
        const offersQuery = query(offersRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubOffers = onSnapshot(offersQuery,
            (snapshot) => {
                const offersList = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,  // Firestore document ID for delete operations
                    ...docSnap.data()
                })) as HelpOffer[];
                setHelpOffers(offersList);
            },
            (err: unknown) => {
                console.error('Error fetching help offers:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        );

        // Subscribe to requests
        const requestsRef = collection(db, 'careCircles', circleId, 'helpRequests');
        const requestsQuery = query(requestsRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubRequests = onSnapshot(requestsQuery,
            (snapshot) => {
                const requestsList = snapshot.docs.map(docSnap => ({
                    docId: docSnap.id,  // Firestore document ID for delete operations
                    ...docSnap.data()
                })) as HelpRequest[];
                setHelpRequests(requestsList);
                setLoading(false);
            },
            (err: unknown) => {
                console.error('Error fetching help requests:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        );

        return () => {
            unsubOffers();
            unsubRequests();
        };
    }, [circleId]);

    // Whitelist of safe fields to save to Firestore
    // React components (icon) and their Symbol properties are NOT safe
    const sanitizeHelpData = useCallback((data: Partial<HelpOffer | HelpRequest>) => {
        const clean: Record<string, unknown> = {};
        const safeData = data as Record<string, unknown>;
        SAFE_HELP_FIELDS.forEach(key => {
            const val = safeData[key];
            if (val !== undefined && typeof val !== 'function' && typeof val !== 'symbol') {
                clean[key] = val;
            }
        });
        return clean;
    }, []);

    // Add a help offer
    const addOffer = useCallback(async (offer: Partial<HelpOffer>) => {
        if (!circleId) return;

        const offerId = `offer_${Date.now()}`;
        const offerRef = doc(db, 'careCircles', circleId, 'helpOffers', offerId);

        try {
            await setDoc(offerRef, {
                ...sanitizeHelpData(offer),
                createdByUid: userId,
                createdByRole: userRole,
                createdByName: displayName || 'Ukendt',
                createdAt: serverTimestamp(),
            });
            return offerId;
        } catch (err: unknown) {
            console.error('Error adding help offer:', err);
            if (err instanceof Error) setError(err.message);
            throw err;
        }
    }, [circleId, userId, userRole, displayName, sanitizeHelpData]);

    // Add a help request
    const addRequest = useCallback(async (request: Partial<HelpRequest>) => {
        if (!circleId) return;

        const requestId = `request_${Date.now()}`;
        const requestRef = doc(db, 'careCircles', circleId, 'helpRequests', requestId);

        try {
            await setDoc(requestRef, {
                ...sanitizeHelpData(request),
                createdByUid: userId,
                createdByRole: userRole,
                createdByName: displayName || 'Ukendt',
                createdAt: serverTimestamp(),
            });
            return requestId;
        } catch (err: unknown) {
            console.error('Error adding help request:', err);
            if (err instanceof Error) setError(err.message);
            throw err;
        }
    }, [circleId, userId, userRole, displayName, sanitizeHelpData]);

    // Remove an offer
    const removeOffer = useCallback(async (offerId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpOffers', offerId));
        } catch (err: unknown) {
            console.error('Error removing help offer:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId]);

    // Remove a request
    const removeRequest = useCallback(async (requestId: string) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpRequests', requestId));
        } catch (err: unknown) {
            console.error('Error removing help request:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId]);

    return {
        helpOffers,
        helpRequests,
        loading,
        error,
        addOffer,
        addRequest,
        removeOffer,
        removeRequest,
    };
}

export default useHelpExchange;
