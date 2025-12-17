import { useState, useEffect, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    updateProfile,
    sendPasswordResetEmail,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore with retry logic
                // Firestore may not be ready when auth fires from cache
                const fetchProfileWithRetry = async (retries = 3, delay = 500) => {
                    for (let attempt = 1; attempt <= retries; attempt++) {
                        try {
                            const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                            if (profileDoc.exists()) {
                                setUserProfile(profileDoc.data() as UserProfile);
                                setError(null); // Clear any previous error
                            }
                            return; // Success, exit
                        } catch (err: any) {
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
    const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...data,
            createdAt: serverTimestamp(),
            consentGiven: false,
            consentTimestamp: null,
        });
    };

    // Sign up with email and password
    const signUp = useCallback(async (email: string, password: string, displayName: string, role: 'senior' | 'relative') => {
        setError(null);
        try {
            const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(newUser, { displayName });

            // Create Firestore profile
            const profileData: Partial<UserProfile> = {
                email,
                displayName,
                role, // 'senior' or 'relative'
            };
            await createUserProfile(newUser.uid, profileData);

            // Set userProfile immediately so consent flow works
            setUserProfile({
                email,
                displayName,
                role,
                consentGiven: false,
                consentTimestamp: null,
                ...profileData
            } as UserProfile);

            return newUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with email and password
    const signIn = useCallback(async (email: string, password: string) => {
        setError(null);
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            return user;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign in with Google
    const signInWithGoogle = useCallback(async (role: 'senior' | 'relative') => {
        setError(null);
        try {
            const { user: googleUser } = await signInWithPopup(auth, googleProvider);

            // Check if user profile exists, if not create one
            const profileDoc = await getDoc(doc(db, 'users', googleUser.uid));
            if (!profileDoc.exists()) {
                await createUserProfile(googleUser.uid, {
                    email: googleUser.email!,
                    displayName: googleUser.displayName!,
                    role,
                });
            }

            return googleUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        setError(null);
        try {
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Update user role
    const updateRole = useCallback(async (role: 'senior' | 'relative') => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
            setUserProfile(prev => prev ? ({ ...prev, role }) : null);
        } catch (err: any) {
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
            setUserProfile(prev => prev ? ({ ...prev, consentGiven: true }) : null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    // Reset password
    const resetPassword = useCallback(async (email: string) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
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
