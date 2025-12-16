// @ts-check
import React from 'react';

/**
 * Pictogram Component
 * 
 * Renders a specific quadrant from the 2x2 sprite sheets.
 * Sheet 1: Cooking, Visiting, Transport, Gardening
 * Sheet 2: Shopping, Tech, Learning, Craft
 * 
 * @param {Object} props
 * @param {string} props.sheet - '1' or '2'
 * @param {string} props.position - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 * @param {string} [props.className] - Additional classes
 */
export const Pictogram = ({ sheet, position, className = '' }) => {
    // Determine background position coordinates
    const bgPos = {
        'top-left': '0% 0%',
        'top-right': '100% 0%',
        'bottom-left': '0% 100%',
        'bottom-right': '100% 100%'
    };

    return (
        <div
            className={`bg-no-repeat bg-cover rounded-xl overflow-hidden ${className}`}
            style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}assets/sprites/help-sheet-${sheet}.png)`,
                // @ts-ignore - Valid keys constrained by props
                backgroundPosition: bgPos[position],
                backgroundSize: '200% 200%' // Zoom in to show just one quadrant
            }}
        />
    );
};

export default Pictogram;
