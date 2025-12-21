import { useEffect } from 'react';

/**
 * Hook to lock the body scroll when a modal is open.
 * Prevents the "scroll behind modal" effect.
 */
export const useScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;

        if (isLocked) {
            document.body.style.overflow = 'hidden';
            // Prevent touch move on mobile to stop "rubber banding"
            // Note: This is a simple implementation. For complex scrolling inside modals on iOS, 
            // we might need more robust libraries, but this covers 90% of cases.
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [isLocked]);
};
