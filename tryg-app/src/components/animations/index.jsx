// @ts-check
/**
 * Animation Components
 * 
 * Reusable framer-motion wrappers for micro-animations.
 * Provides consistent animations across the app.
 */

import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Slide out to the right when completed
 */
export const slideOutRight = {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
};

/**
 * Fade in from bottom (for modals)
 */
export const slideUpFade = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

/**
 * Simple fade
 */
export const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

/**
 * Scale in with spring (for success states)
 */
export const popIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};

/**
 * Stagger children (for lists)
 */
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const staggerItem = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

// ============================================================================
// WRAPPER COMPONENTS
// ============================================================================

/**
 * Animated list container - staggers child animations
 */
export const AnimatedList = ({ children, className = '' }) => (
    <motion.div
        className={className}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
    >
        {children}
    </motion.div>
);

/**
 * Animated list item - for items within AnimatedList
 */
export const AnimatedItem = ({ children, className = '', layoutId }) => (
    <motion.div
        className={className}
        variants={staggerItem}
        layout
        layoutId={layoutId}
    >
        {children}
    </motion.div>
);

/**
 * Task card with completion animation
 * Slides out to the right when completed
 */
export const AnimatedTaskCard = ({
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

/**
 * Modal wrapper with slide-up animation
 */
export const AnimatedModal = ({ isOpen, onClose, children, className = '' }) => (
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

/**
 * Success checkmark animation
 */
export const AnimatedCheckmark = ({ show }) => (
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
