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
import { db } from '../config/firebase';

export function useHelpExchange(circleId) {
    const [helpOffers, setHelpOffers] = useState([]);
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subscribe to help offers from Firestore
    useEffect(() => {
        if (!circleId) {
            setHelpOffers([]);
            setHelpRequests([]);
            setLoading(false);
            return;
        }

        // Subscribe to offers
        const offersRef = collection(db, 'careCircles', circleId, 'helpOffers');
        const offersQuery = query(offersRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubOffers = onSnapshot(offersQuery,
            (snapshot) => {
                const offersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHelpOffers(offersList);
            },
            (err) => {
                console.error('Error fetching help offers:', err);
                setError(err.message);
            }
        );

        // Subscribe to requests
        const requestsRef = collection(db, 'careCircles', circleId, 'helpRequests');
        const requestsQuery = query(requestsRef, orderBy('createdAt', 'desc'), limit(10));

        const unsubRequests = onSnapshot(requestsQuery,
            (snapshot) => {
                const requestsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHelpRequests(requestsList);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching help requests:', err);
                setError(err.message);
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
    const SAFE_HELP_FIELDS = ['id', 'label', 'emoji'];

    const sanitizeHelpData = (data) => {
        const clean = {};
        SAFE_HELP_FIELDS.forEach(key => {
            if (data[key] !== undefined && typeof data[key] !== 'function' && typeof data[key] !== 'symbol') {
                clean[key] = data[key];
            }
        });
        return clean;
    };

    // Add a help offer
    const addOffer = useCallback(async (offer) => {
        if (!circleId) return;

        const offerId = `offer_${Date.now()}`;
        const offerRef = doc(db, 'careCircles', circleId, 'helpOffers', offerId);

        try {
            await setDoc(offerRef, {
                ...sanitizeHelpData(offer),
                createdAt: serverTimestamp(),
            });
            return offerId;
        } catch (err) {
            console.error('Error adding help offer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Add a help request
    const addRequest = useCallback(async (request) => {
        if (!circleId) return;

        const requestId = `request_${Date.now()}`;
        const requestRef = doc(db, 'careCircles', circleId, 'helpRequests', requestId);

        try {
            await setDoc(requestRef, {
                ...sanitizeHelpData(request),
                createdAt: serverTimestamp(),
            });
            return requestId;
        } catch (err) {
            console.error('Error adding help request:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Remove an offer
    const removeOffer = useCallback(async (offerId) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpOffers', offerId));
        } catch (err) {
            console.error('Error removing help offer:', err);
            setError(err.message);
            throw err;
        }
    }, [circleId]);

    // Remove a request
    const removeRequest = useCallback(async (requestId) => {
        if (!circleId) return;

        try {
            await deleteDoc(doc(db, 'careCircles', circleId, 'helpRequests', requestId));
        } catch (err) {
            console.error('Error removing help request:', err);
            setError(err.message);
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
