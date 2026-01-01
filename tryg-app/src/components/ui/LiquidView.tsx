
import React from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// Define the two "Dialects" of motion
const TRANSITIONS: Record<string, Transition> = {
    senior: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, // Slow, smooth "ease out"
    relative: { type: "spring", stiffness: 400, damping: 30 } // Bouncy, fast spring
};

const VARIANTS = {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -10 }
};

/**
 * A wrapper that animates items in a list (Tasks, Cards, etc.)
 * Adjusts speed based on the logged-in user's role.
 */
export const LiquidItem = ({ children, className = '', id }: { children: React.ReactNode, className?: string, id?: string | number }) => {
    const { userProfile } = useAuth();
    const role = userProfile?.role || 'relative';

    return (
        <motion.div
            layout
            variants={VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={TRANSITIONS[role as keyof typeof TRANSITIONS] || TRANSITIONS.relative} // <--- The magic switch
            className={className}
            key={id}
        >
            {children}
        </motion.div>
    );
};

export const LiquidList = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div layout className={className}>
        <AnimatePresence mode="popLayout" initial={false}>
            {children}
        </AnimatePresence>
    </motion.div>
);
