
// Photos hook - ephemeral daily photo sharing via Firestore + Storage
// Photos are deleted after viewing (client-side delete)

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
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { resizeImage } from '../../utils/imageUtils';

import { Photo } from '../../types';

export function usePhotos(circleId: string | null, currentUserId: string | null) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [latestPhoto, setLatestPhoto] = useState<Photo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to photos from Firestore
    useEffect(() => {
        if (!circleId) {
            setTimeout(() => {
                setPhotos([]);
                setLatestPhoto(null);
                setLoading(false);
            }, 0);
            return;
        }

        const photosRef = collection(db, 'careCircles', circleId, 'photos');
        const photosQuery = query(photosRef, orderBy('uploadedAt', 'desc'), limit(5));

        const unsubscribe = onSnapshot(photosQuery,
            (snapshot) => {
                const photosList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Photo[];
                setPhotos(photosList);

                // Find latest unviewed photo from another user
                const unviewedPhoto = photosList.find(p =>
                    p.fromUserId !== currentUserId && !p.viewedAt
                );
                setLatestPhoto(unviewedPhoto || null);

                setLoading(false);
            },
            (err: unknown) => {
                console.error('Error fetching photos:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [circleId, currentUserId]);

    // Upload a photo
    const uploadPhoto = useCallback(async (file: File, fromName: string) => {
        if (!circleId || !currentUserId) return;

        setUploading(true);
        setError(null);

        try {
            // Resize image before upload
            const resizedBlob = await resizeImage(file, 1200, 0.85);

            // Generate unique filename
            const photoId = `photo_${Date.now()}`;
            const storagePath = `careCircles/${circleId}/photos/${photoId}.jpg`;
            const storageRef = ref(storage, storagePath);

            // Upload to Storage
            await uploadBytes(storageRef, resizedBlob, {
                contentType: 'image/jpeg',
            });

            // Get download URL
            const downloadUrl = await getDownloadURL(storageRef);

            // Create Firestore doc
            const photoRef = doc(db, 'careCircles', circleId, 'photos', photoId);
            await setDoc(photoRef, {
                imageUrl: downloadUrl,
                storagePath,
                fromUserId: currentUserId,
                fromName: fromName || 'Familie',
                uploadedAt: serverTimestamp(),
                viewedAt: null,
            });

            setUploading(false);
            return photoId;
        } catch (err: unknown) {
            console.error('Error uploading photo:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setUploading(false);
            throw err;
        }
    }, [circleId, currentUserId]);

    // Delete a photo (called when viewer closes it)
    const deletePhoto = useCallback(async (photoId: string, storagePath?: string) => {
        if (!circleId) return;

        try {
            // Delete from Storage
            if (storagePath) {
                const storageRef = ref(storage, storagePath);
                await deleteObject(storageRef).catch(() => {
                    // Ignore if already deleted
                });
            }

            // Delete from Firestore
            await deleteDoc(doc(db, 'careCircles', circleId, 'photos', photoId));

            // Clear from local state
            if (latestPhoto?.id === photoId) {
                setLatestPhoto(null);
            }
        } catch (err: unknown) {
            console.error('Error deleting photo:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, [circleId, latestPhoto]);

    // Mark photo as viewed (for tracking, before delete)
    const markViewed = useCallback(async (photoId: string) => {
        if (!circleId) return;

        try {
            await setDoc(doc(db, 'careCircles', circleId, 'photos', photoId), {
                viewedAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Error marking photo viewed:', err);
        }
    }, [circleId]);

    return {
        photos,
        latestPhoto,
        loading,
        uploading,
        error,
        uploadPhoto,
        deletePhoto,
        markViewed,
    };
}

export default usePhotos;
