/**
 * Animation Components
 * 
 * Reusable framer-motion wrappers for micro-animations.
 * Provides consistent animations across the app.
 */

import React, { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Slide out to the right when completed
 */
export const slideOutRight: Variants = {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
};

/**
 * Fade in from bottom (for modals)
 */
export const slideUpFade: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

/**
 * Simple fade
 */
export const fade: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Scale in with spring (for success states)
 */
export const popIn: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};

/**
 * Stagger children (for lists)
 */
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

// ============================================================================
// WRAPPER COMPONENTS
// ============================================================================

interface AnimatedListProps {
    children: ReactNode;
    className?: string;
}

/**
 * Animated list container - staggers child animations
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
    >
        {children}
    </motion.div>
);

interface AnimatedItemProps {
    children: ReactNode;
    className?: string;
    layoutId?: string;
}

/**
 * Animated list item - for items within AnimatedList
 */
export const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, className = '', layoutId }) => (
    <motion.div
        className={className}
        variants={staggerItem}
        layout
        layoutId={layoutId}
    >
        {children}
    </motion.div>
);

interface AnimatedTaskCardProps {
    children: ReactNode;
    taskId: string;
    isCompleted: boolean;
    onAnimationComplete?: () => void;
    className?: string;
}

/**
 * Task card with completion animation
 * Slides out to the right when completed
 */
export const AnimatedTaskCard: React.FC<AnimatedTaskCardProps> = ({
    children,
    taskId,
    isCompleted,
    onAnimationComplete,
    className = ''
}) => (
    <motion.div
        key={taskId}
        layout
        initial={{ opacity: 1, x: 0, height: 'auto' }}
        animate={{
            opacity: isCompleted ? 0.6 : 1,
            x: 0,
            scale: isCompleted ? 0.98 : 1
        }}
        exit={{
            opacity: 0,
            x: 100,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }}
        transition={{ duration: 0.2 }}
        onAnimationComplete={onAnimationComplete}
        className={className}
    >
        {children}
    </motion.div>
);

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

/**
 * Modal wrapper with slide-up animation
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({ isOpen, onClose, children, className = '' }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div
                    className="fixed inset-0 bg-black/40 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
                {/* Modal content */}
                <motion.div
                    className={`fixed inset-x-4 bottom-4 z-50 bg-white rounded-3xl shadow-xl max-h-[85vh] overflow-auto ${className}`}
                    variants={slideUpFade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {children}
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

interface AnimatedCheckmarkProps {
    show: boolean;
}

/**
 * Success checkmark animation
 */
export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({ show }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                variants={popIn}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                ✓
            </motion.div>
        )}
    </AnimatePresence>
);

export { AnimatePresence } from 'framer-motion';
