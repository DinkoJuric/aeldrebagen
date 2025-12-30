import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCareCircle } from '../../hooks/useCareCircle';
import { SeniorWelcome } from './SeniorWelcome';
import { RelativeWelcome } from './RelativeWelcome';

interface OnboardingProps {
    show: boolean;
    onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ show, onComplete }) => {
    const { userRole } = useCareCircle();

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm"
                >
                    <div className="w-full h-full">
                        {userRole === 'senior' ? (
                            <SeniorWelcome onComplete={onComplete} />
                        ) : (
                            <RelativeWelcome onComplete={onComplete} />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
