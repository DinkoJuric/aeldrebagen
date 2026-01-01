import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';

export interface MemoryMetadata {
    title?: string;
    description?: string;
    type: 'audio' | 'photo' | 'video';
    circleId: string;
    createdByUid: string;
    createdByName: string;
    questionId?: string;
    questionText?: string;
    duration?: number;
}

export const useMemories = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadMemory = useCallback(async (blob: Blob, metadata: MemoryMetadata) => {
        if (!metadata.circleId || !metadata.createdByUid) {
            setError('Missing required metadata (circleId or uid)');
            return null;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // 1. Generate unique file name
            const timestamp = Date.now();
            const extension = metadata.type === 'audio' ? 'webm' : 'jpg';
            const fileName = `memories/${metadata.circleId}/${metadata.type}_${timestamp}.${extension}`;
            const storageRef = ref(storage, fileName);

            // 2. Upload to Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, blob);

            return new Promise<string | null>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (err: unknown) => {
                        console.error('Upload error:', err);
                        setError(err instanceof Error ? err.message : 'Unknown upload error');
                        setIsUploading(false);
                        reject(err);
                    },
                    async () => {
                        try {
                            // 3. Get Download URL
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

                            // 4. Save to Firestore
                            const memoriesRef = collection(db, 'careCircles', metadata.circleId, 'memories');
                            await addDoc(memoriesRef, {
                                ...metadata,
                                url: downloadUrl,
                                storagePath: fileName,
                                createdAt: serverTimestamp(),
                            });

                            setIsUploading(false);
                            setUploadProgress(100);
                            setUploadProgress(100);
                            resolve(downloadUrl);
                        } catch (err: unknown) {
                            console.error('Firestore save error:', err);
                            setError(err instanceof Error ? err.message : 'Unknown error');
                            setIsUploading(false);
                            reject(err);
                        }
                    }
                );
            });
        } catch (err: unknown) {
            console.error('Memory upload error initiation:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsUploading(false);
            return null;
        }
    }, []);

    return {
        uploadMemory,
        isUploading,
        uploadProgress,
        error
    };
};
