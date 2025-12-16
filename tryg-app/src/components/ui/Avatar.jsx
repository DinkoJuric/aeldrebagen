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
    /**
     * Sprite Sheet Layout:
     * Row 1 (Y=0%): 4 Avatars - Louise, Fatima, Brad, Bearded (Senior)
     * Row 2 (Y=100%): 5 Status Icons - Home, Work, Car, Coffee, Moon
     * 
     * CSS background-position with % works relative to the difference between
     * image size and container size. For a 4-column row:
     * - Item 1: 0% (left edge)
     * - Item 2: 33.3% (1/3)
     * - Item 3: 66.6% (2/3)
     * - Item 4: 100% (right edge)
     * 
     * For a 5-column row:
     * - Item 1: 0%
     * - Item 2: 25%
     * - Item 3: 50%
     * - Item 4: 75%
     * - Item 5: 100%
     */

    // Coordinate mapping: 'X% Y%'
    const MAPPINGS = {
        // Row 1 - Avatars (4 columns, Y=0%)
        'louise': '0% 0%',       // Column 1
        'fatima': '33% 0%',      // Column 2
        'brad': '66% 0%',        // Column 3
        'bearded': '100% 0%',    // Column 4
        'senior': '100% 0%',     // Alias for bearded

        // Row 2 - Status Icons (5 columns, Y=100%)
        'home': '0% 100%',       // Column 1
        'work': '25% 100%',      // Column 2
        'car': '50% 100%',       // Column 3
        'coffee': '75% 100%',    // Column 4
        'moon': '100% 100%'      // Column 5
    };

    const SIZE_CLASSES = {
        'sm': 'w-8 h-8',
        'md': 'w-12 h-12',
        'lg': 'w-16 h-16',
        'xl': 'w-24 h-24'
    };

    // If ID not found, return fallback
    if (!MAPPINGS[id]) {
        return (
            <div className={`${SIZE_CLASSES[size]} rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 uppercase ${className}`}>
                {id ? id.charAt(0) : '?'}
            </div>
        );
    }

    // Calculate zoom based on row (avatars are larger in the sprite than icons)
    const isStatusIcon = ['home', 'work', 'car', 'coffee', 'moon'].includes(id);

    return (
        <div
            className={`bg-no-repeat rounded-full bg-stone-100 ${SIZE_CLASSES[size]} ${className}`}
            style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/sprites/family-presence.png)`,
                backgroundPosition: MAPPINGS[id],
                // Zoom: 400% width means we're showing 1/4 of the image width (good for 4-column row)
                // For 5-column row, we'd need 500% width to show 1/5
                backgroundSize: isStatusIcon
                    ? '500% 200%'  // 5 columns, 2 rows
                    : '400% 200%'  // 4 columns, 2 rows
            }}
            aria-label={id}
        />
    );
};

export default Avatar;
