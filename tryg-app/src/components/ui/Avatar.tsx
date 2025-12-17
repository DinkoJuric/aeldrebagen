import React from 'react';

type AvatarId = 'louise' | 'fatima' | 'brad' | 'bearded' | 'senior' | 'home' | 'work' | 'car' | 'coffee' | 'moon' | string;
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    id: AvatarId;
    className?: string;
    size?: AvatarSize;
}

/**
 * Avatar Component
 * 
 * Renders avatars and status icons using individual image files.
 * Much simpler and more reliable than CSS sprites.
 */
export const Avatar: React.FC<AvatarProps> = ({ id, className = '', size = 'md' }) => {
    // Map IDs to image filenames
    const IMAGE_MAP: Record<string, string> = {
        'louise': 'louise.png',
        'fatima': 'fatima.png',
        'brad': 'brad.png',
        'bearded': 'brad.png',  // Brad is the senior/bearded guy
        'senior': 'brad.png',   // Alias
        'home': 'home.png',
        'work': 'work.png',
        'car': 'car.png',
        'coffee': 'coffee.png',
        'moon': 'moon.png'
    };

    const SIZE_CLASSES: Record<AvatarSize, string> = {
        'sm': 'w-8 h-8',
        'md': 'w-12 h-12',
        'lg': 'w-16 h-16',
        'xl': 'w-24 h-24'
    };

    // If ID not found, return fallback
    if (!IMAGE_MAP[id]) {
        return (
            <div className={`${SIZE_CLASSES[size]} rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase ${className}`}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    const imagePath = `${import.meta.env.BASE_URL}assets/avatars/${IMAGE_MAP[id]}`;

    return (
        <div className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden bg-stone-100 ${className}`}>
            <img
                src={imagePath}
                alt={id}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Avatar;
