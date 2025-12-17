/// <reference types="vite/client" />
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Avatar size variants using CVA
 */
const avatarVariants = cva(
    "rounded-full overflow-hidden bg-stone-100",
    {
        variants: {
            size: {
                sm: "w-8 h-8",
                md: "w-12 h-12",
                lg: "w-16 h-16",
                xl: "w-24 h-24",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

type AvatarId = 'louise' | 'fatima' | 'brad' | 'bearded' | 'senior' | 'home' | 'work' | 'car' | 'coffee' | 'moon' | string;

interface AvatarProps extends VariantProps<typeof avatarVariants> {
    id: AvatarId;
    className?: string;
}

// Map IDs to image filenames
const IMAGE_MAP: Record<string, string> = {
    'louise': 'louise.png',
    'fatima': 'fatima.png',
    'brad': 'brad.png',
    'bearded': 'brad.png',
    'senior': 'brad.png',
    'home': 'home.png',
    'work': 'work.png',
    'car': 'car.png',
    'coffee': 'coffee.png',
    'moon': 'moon.png'
};

/**
 * Avatar Component
 * Renders avatars and status icons using individual image files.
 */
export const Avatar: React.FC<AvatarProps> = ({ id, className, size }) => {
    // Fallback for unknown IDs
    if (!IMAGE_MAP[id]) {
        return (
            <div className={cn(
                avatarVariants({ size }),
                "bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase",
                className
            )}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    const imagePath = `${import.meta.env.BASE_URL}assets/avatars/${IMAGE_MAP[id]}`;

    return (
        <div className={cn(avatarVariants({ size }), className)}>
            <img
                src={imagePath}
                alt={id}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export { avatarVariants };
export default Avatar;
