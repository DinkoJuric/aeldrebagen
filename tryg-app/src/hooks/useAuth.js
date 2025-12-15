// Authentication hook for Firebase
// Provides user state, loading state, and auth methods

import { useState, useEffect, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore with retry logic
                // Firestore may not be ready when auth fires from cache
                const fetchProfileWithRetry = async (retries = 3, delay = 500) => {
                    for (let attempt = 1; attempt <= retries; attempt++) {
                        try {
                            const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (profileDoc.exists()) {
                                setUserProfile(profileDoc.data());
                                setError(null); // Clear any previous error
                            }
                            return; // Success, exit
                        } catch (err) {
                            console.error(`Error fetching user profile (attempt ${attempt}/${retries}):`, err);

                            // If offline error and we have retries left, wait and retry
                            if (err.message?.includes('offline') && attempt < retries) {
                                await new Promise(resolve => setTimeout(resolve, delay));
                                delay *= 2; // Exponential backoff
                            } else if (attempt === retries) {
                                // Final attempt failed
                                setError(err.message || 'Could not load profile');
                            }
                        }
                    }
                };

                await fetchProfileWithRetry();
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Create user profile in Firestore
    const createUserProfile = async (userId, data) => {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            createdAt: serverTimestamp(),
            consentGiven: false,
            consentTimestamp: null,
        });
    };

    // Sign up with email and password
    const signUp = useCallback(async (email, password, displayName, role) => {
        setError(null);
        try {
            const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(newUser, { displayName });

            // Create Firestore profile
            const profileData = {
                email,
                displayName,
                role, // 'senior' or 'relative'
            };
            await createUserProfile(newUser.uid, profileData);

            // Set userProfile immediately so consent flow works
            setUserProfile({
                ...profileData,
                consentGiven: false,
                consentTimestamp: null,
            });

            return newUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with email and password
    const signIn = useCallback(async (email, password) => {
        setError(null);
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with Google
    const signInWithGoogle = useCallback(async (role) => {
        setError(null);
        try {
            const { user: googleUser } = await signInWithPopup(auth, googleProvider);

            // Check if user profile exists, if not create one
            const profileDoc = await getDoc(doc(db, 'users', googleUser.uid));
            if (!profileDoc.exists()) {
                await createUserProfile(googleUser.uid, {
                    email: googleUser.email,
                    displayName: googleUser.displayName,
                    role,
                });
            }

            return googleUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        setError(null);
        try {
            await firebaseSignOut(auth);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Update user role
    const updateRole = useCallback(async (role) => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
            setUserProfile(prev => ({ ...prev, role }));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    // Record consent
    const recordConsent = useCallback(async () => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), {
                consentGiven: true,
                consentTimestamp: serverTimestamp(),
            }, { merge: true });
            setUserProfile(prev => ({ ...prev, consentGiven: true }));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    // Reset password
    const resetPassword = useCallback(async (email) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        user,
        userProfile,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateRole,
        recordConsent,
        resetPassword,
        isAuthenticated: !!user,
    };
}

export default useAuth;
