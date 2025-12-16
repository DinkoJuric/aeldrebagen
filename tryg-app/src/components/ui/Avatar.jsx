// @ts-check
import React from 'react';

/**
 * Avatar Component
 * 
 * Renders avatars and status icons from the family-presence sprite sheet.
 * 
 * Sprite Sheet Layout (approximate grid):
 * Row 1: Louise (Glasses), Fatima (Bun), Brad (Beanie), Bearded Guy
 * Row 2: Home, Work, Car, Coffee, Moon
 * 
 * @param {Object} props
 * @param {string} props.id - 'louise', 'fatima', 'brad', 'bearded', 'home', 'work', 'car', 'coffee', 'moon'
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.size] - 'sm', 'md', 'lg', 'xl'
 */
export const Avatar = ({ id, className = '', size = 'md' }) => {
    // Coordinate mapping (x% y%)
    // Row 1 (Avatars)
    const MAPPINGS = {
        // Row 1 - Avatars
        'louise': '2% 5%',    // Glasses woman
        'fatima': '34% 5%',   // Bun woman
        'brad': '66% 5%',     // Beanie man
        'bearded': '98% 5%',  // Curly hair man
        'senior': '98% 5%',   // Using Bearded as Senior Placeholder

        // Row 2 - Status Icons
        'home': '5% 95%',
        'work': '28% 95%',    // Briefcase
        'car': '52% 95%',
        'coffee': '75% 95%',
        'moon': '96% 91%'
    };

    const SIZE_CLASSES = {
        'sm': 'w-8 h-8',
        'md': 'w-12 h-12',
        'lg': 'w-16 h-16',
        'xl': 'w-24 h-24'
    };

    // If ID not found, return fallback (first letter)
    if (!MAPPINGS[id]) {
        return (
            <div className={`${SIZE_CLASSES[size]} rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase ${className}`}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    return (
        <div
            className={`bg-no-repeat rounded-full bg-stone-100 ${SIZE_CLASSES[size]} ${className}`}
            style={{
                backgroundImage: 'url(/assets/sprites/family-presence.png)',
                // @ts-ignore
                backgroundPosition: MAPPINGS[id],
                backgroundSize: '400% 210%' // Zoom to fit 4 cols, ~2 rows
            }}
            aria-label={id}
        />
    );
};

export default Avatar;
