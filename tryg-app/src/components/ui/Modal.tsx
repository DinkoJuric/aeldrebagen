import React, { ReactNode } from 'react';
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
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4">
            <div className={cn(
                "bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto flex flex-col",
                className
            )}>
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-xl font-bold text-stone-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className={cn(
                            "p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-stone-400"
                        )}
                        aria-label="Luk"
                    >
                        <X className="w-6 h-6 text-stone-600" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
