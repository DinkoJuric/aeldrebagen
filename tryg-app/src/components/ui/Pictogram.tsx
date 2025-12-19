import React from 'react';

export type PictogramSheet = '1' | '2';
export type PictogramPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface PictogramProps {
    sheet: PictogramSheet;
    position: PictogramPosition;
    className?: string;
}

/**
 * Pictogram Component
 * 
 * Renders a specific quadrant from the 2x2 sprite sheets.
 * Sheet 1: Cooking, Visiting, Transport, Gardening
 * Sheet 2: Shopping, Tech, Learning, Craft
 */
export const Pictogram: React.FC<PictogramProps> = ({ sheet, position, className = '' }) => {
    // Determine background position coordinates
    const bgPos: Record<PictogramPosition, string> = {
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
                backgroundPosition: bgPos[position],
                backgroundSize: '200% 200%' // Zoom in to show just one quadrant
            }}
        />
    );
};

export default Pictogram;
