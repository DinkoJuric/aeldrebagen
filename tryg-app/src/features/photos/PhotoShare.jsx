// PhotoShare component - Ephemeral daily photo sharing
// Take a photo → Send to family → They view and delete

import React, { useState, useRef } from 'react';
import { Camera, X, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

// Camera/upload button for the header
export const PhotoCaptureButton = ({ onCapture, disabled }) => {
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onCapture(file);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={disabled}
                className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors disabled:opacity-50"
                aria-label="Tag et billede til din familie"
            >
                <Camera className="w-5 h-5 text-indigo-600" />
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                className="hidden"
            />
        </>
    );
};

// Upload progress modal
export const PhotoUploadModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800">Sender billede...</h3>
                <p className="text-stone-500 mt-2">Et øjeblik</p>
            </div>
        </div>
    );
};

// Photo viewer modal (for recipient)
export const PhotoViewerModal = ({ photo, onDelete }) => {
    const [deleting, setDeleting] = useState(false);

    if (!photo) return null;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(photo.id, photo.storagePath);
        } catch (err) {
            console.error('Error deleting photo:', err);
            setDeleting(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                <div className="flex items-center justify-between">
                    <div className="text-white">
                        <p className="font-bold">📸 Fra {photo.fromName}</p>
                        <p className="text-sm text-white/70">
                            {photo.uploadedAt?.toDate?.()?.toLocaleTimeString('da-DK', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) || 'Lige nu'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-4">
                <img
                    src={photo.imageUrl}
                    alt="Billede fra familie"
                    className="max-w-full max-h-full object-contain rounded-xl"
                />
            </div>

            {/* Delete button */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                    {deleting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sletter...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-5 h-5" />
                            Slet
                        </>
                    )}
                </button>
                <p className="text-center text-white/60 text-sm mt-2">
                    Billedet forsvinder efter du sletter det
                </p>
            </div>
        </div>
    );
};

// Notification badge for new photo
export const PhotoNotificationBadge = ({ photo, onClick }) => {
    if (!photo) return null;

    return (
        <button
            onClick={onClick}
            className="animate-pulse bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
                <p className="font-bold">📸 Nyt billede!</p>
                <p className="text-sm text-white/80">Fra {photo.fromName}</p>
            </div>
        </button>
    );
};

export default {
    PhotoCaptureButton,
    PhotoUploadModal,
    PhotoViewerModal,
    PhotoNotificationBadge,
};
