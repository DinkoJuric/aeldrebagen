import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '../../hooks/useScrollLock';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
    useScrollLock(isOpen);

    if (!isOpen) return null;

    // Use a portal to render outside the main DOM hierarchy
    // This fixes z-index wars with sticky navigation and transform contexts
    return createPortal(
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4">
            <div className={cn(
                "theme-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-0 shadow-2xl animate-slide-up max-h-[90vh] flex flex-col",
                className
            )}>
                {/* Header - Fixed/Sticky */}
                <div className="flex justify-between items-center p-6 pb-2 shrink-0">
                    <h3 className="text-xl font-bold theme-text">{title}</h3>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-stone-400",
                            "theme-dark:bg-slate-700 theme-dark:hover:bg-slate-600"
                        )}
                        aria-label="Luk"
                    >
                        <X className="w-6 h-6 theme-text-muted" />
                    </button>
                </div>

                {/* Content - Scrollable with safe area padding */}
                <div className="p-6 pt-2 pb-24 overflow-y-auto flex-1 min-h-0">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
