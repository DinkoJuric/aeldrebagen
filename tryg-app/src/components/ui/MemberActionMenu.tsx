
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Member } from '../../types';
import { X, Edit2, UserCog, Save } from 'lucide-react';
import { RelationsSelect } from './RelationsSelect';

interface MemberActionMenuProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userId: string, data: Partial<Member>) => Promise<void>;
}

type Mode = 'menu' | 'rename' | 'relation';

import { createPortal } from 'react-dom';

export const MemberActionMenu: React.FC<MemberActionMenuProps> = ({ member, isOpen, onClose, onUpdate }) => {
    // ... (state hooks remain same)
    const [mode, setMode] = useState<Mode>('menu');
    const [newName, setNewName] = useState('');
    const [newRelation, setNewRelation] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Reset state when opening
    React.useEffect(() => {
        if (isOpen && member) {
            setMode('menu');
            setNewName(member.displayName || '');
            setNewRelation(member.relationship || '');
        }
    }, [isOpen, member]);

    if (!isOpen || !member) return null;

    const handleSaveName = async () => {
        setIsSaving(true);
        try {
            if (!member.docId) throw new Error("Missing docId");
            await onUpdate(member.docId, { displayName: newName });
            onClose();
        } catch (e) {
            console.error("Failed to rename", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveRelation = async () => {
        setIsSaving(true);
        try {
            if (!member.docId) throw new Error("Missing docId");
            await onUpdate(member.docId, { relationship: newRelation });
            onClose();
        } catch (e) {
            console.error("Failed to update relation", e);
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-[110]" // Higher Z-index than ShareModal (100)
                    />

                    {/* Menu Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl z-[120] p-6 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-heading font-bold text-stone-800 truncate pr-4">
                                {member.displayName}
                            </h3>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                                <X className="w-5 h-5 text-stone-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="min-h-[150px]">
                            {mode === 'menu' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setMode('rename')}
                                        className="w-full p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center gap-3 hover:bg-stone-50 transition-all group"
                                    >
                                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                            <Edit2 className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-stone-700">Omdøb</div>
                                            <div className="text-xs text-stone-500">Ændre navn på familiemedlem</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setMode('relation')}
                                        className="w-full p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center gap-3 hover:bg-stone-50 transition-all group"
                                    >
                                        <div className="p-2 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                                            <UserCog className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-stone-700">Ret Relation</div>
                                            <div className="text-xs text-stone-500">Ændre hvordan de er relateret</div>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {mode === 'rename' && (
                                <div className="space-y-4 animate-fade-in">
                                    <label className="block text-xs font-bold text-stone-500 uppercase">Nyt Navn</label>
                                    <input
                                        autoFocus
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full text-lg font-bold p-3 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none bg-transparent text-stone-900"
                                        placeholder="Indtast navn..."
                                    />
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={() => setMode('menu')}
                                            className="flex-1 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100"
                                        >
                                            Tilbage
                                        </button>
                                        <button
                                            disabled={isSaving || !newName.trim()}
                                            onClick={handleSaveName}
                                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? 'Gemmer...' : <><Save className="w-4 h-4" /> Gem</>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {mode === 'relation' && (
                                <div className="space-y-4 animate-fade-in">
                                    <RelationsSelect
                                        value={newRelation}
                                        onChange={setNewRelation}
                                        seniorName="Senioren"
                                        targetGender={member.gender} // Optional filtering
                                    />
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={() => setMode('menu')}
                                            className="flex-1 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100"
                                        >
                                            Tilbage
                                        </button>
                                        <button
                                            disabled={isSaving || !newRelation}
                                            onClick={handleSaveRelation}
                                            className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? 'Gemmer...' : <><Save className="w-4 h-4" /> Gem</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
