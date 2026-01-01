
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Member } from '../../types';
import { RelationsSelect } from '../../components/ui/RelationsSelect';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Check, X } from 'lucide-react'; // StepIcon, Users, UserPlus removed as unused

interface RelationshipMatrixProps {
    currentMember: Member;
    allMembers: Member[];
    onComplete: () => void;
}

export function RelationshipMatrix({ currentMember, allMembers, onComplete }: RelationshipMatrixProps) {
    // Filter out self
    const targets = allMembers.filter(m => m.userId !== currentMember.userId);

    const [step, setStep] = useState<'gender' | 'matrix'>(currentMember.gender ? 'matrix' : 'gender');
    const [myGender, setMyGender] = useState<'male' | 'female' | 'other' | undefined>(currentMember.gender);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [relations, setRelations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const currentTarget = targets[currentIndex];
    const isLast = currentIndex === targets.length - 1;

    const [targetGender, setTargetGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);

    // Reset target gender when index changes
    useEffect(() => {
        setTargetGender(undefined);
    }, [currentIndex]);

    const handleGenderSelect = (gender: 'male' | 'female' | 'other') => {
        setMyGender(gender);
        setStep('matrix');
    };

    const handleSelect = (relation: string) => {
        setRelations(prev => ({
            ...prev,
            [currentTarget.userId || currentTarget.docId]: relation
        }));
    };

    const handleNext = async () => {
        if (isLast) {
            await saveEdges();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const saveEdges = async () => {
        setLoading(true);
        try {
            const memberRef = doc(db, 'careCircleMemberships', currentMember.docId!);

            // Prepare update data
            const updateData: Record<string, unknown> = {
                edges: relations,
                relationsLastUpdated: new Date()
            };

            // Only update gender if it wasn't set before
            if (!currentMember.gender && myGender) {
                updateData.gender = myGender;
            }

            await updateDoc(memberRef, updateData);
            onComplete();
        } catch (err) {
            console.error("Error saving family edges:", err);
            alert("Der skete en fejl. Prøv igen.");
        } finally {
            setLoading(false);
        }
    };

    if (targets.length === 0 && step === 'matrix') return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4">
            <div className="w-full max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">

                {/* Header (Progress & Close) */}
                <div className="relative">
                    {step === 'matrix' && (
                        <div className="h-1 bg-stone-100">
                            <motion.div
                                className="h-full bg-teal-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / targets.length) * 100}%` }}
                            />
                        </div>
                    )}
                    <button
                        onClick={onComplete}
                        className="absolute top-3 right-3 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                    <div className="p-6 pb-2 text-center">
                        <h2 className="text-xl font-bold text-stone-800">
                            {step === 'gender' ? 'Velkommen' : 'Hvem er du?'}
                        </h2>
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    {step === 'gender' ? (
                        <div className="space-y-6 text-center">
                            <p className="text-stone-500">
                                For at gøre det nemmere at vælge relationer, skal vi vide dit køn.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <button onClick={() => handleGenderSelect('female')} className="p-4 rounded-xl border border-stone-200 hover:border-pink-300 hover:bg-pink-50 transition-all font-medium text-stone-700 hover:text-pink-800 flex items-center justify-center gap-2">
                                    👩 Kvinde
                                </button>
                                <button onClick={() => handleGenderSelect('male')} className="p-4 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50 transition-all font-medium text-stone-700 hover:text-blue-800 flex items-center justify-center gap-2">
                                    👨 Mand
                                </button>
                                <button onClick={() => handleGenderSelect('other')} className="p-4 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all font-medium text-stone-600">
                                    Andet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTarget.userId || currentTarget.docId}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center border-4 border-white shadow-sm">
                                    <span className="text-xl font-bold text-stone-600">
                                        {currentTarget.displayName?.[0] || '?'}
                                    </span>
                                </div>

                                <div className="w-full space-y-4">
                                    <p className="text-lg font-medium text-stone-800 text-center">
                                        Hvem er <span className="text-teal-600">{currentTarget.displayName}</span> for dig?
                                    </p>

                                    {/* Target Gender Toggle for Decluttering */}
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => setTargetGender(targetGender === 'female' ? undefined : 'female')}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${targetGender === 'female' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
                                        >
                                            Hun
                                        </button>
                                        <button
                                            onClick={() => setTargetGender(targetGender === 'male' ? undefined : 'male')}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${targetGender === 'male' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
                                        >
                                            Han
                                        </button>
                                    </div>

                                    <div className="max-w-xs mx-auto text-left">
                                        <RelationsSelect
                                            value={relations[currentTarget.userId || currentTarget.docId] || ''}
                                            onChange={handleSelect}
                                            seniorName={currentTarget.displayName}
                                            targetGender={targetGender} // Use manual target gender
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Sticky Footer */}
                {step === 'matrix' && (
                    <div className="p-4 border-t border-stone-100 bg-white flex justify-end shrink-0 safe-area-bottom">
                        <button
                            onClick={handleNext}
                            disabled={!relations[currentTarget.userId || currentTarget.docId] || loading}
                            className="px-8 py-3 bg-stone-900 text-white rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
                        >
                            {loading ? 'Gemmer...' : isLast ? 'Færdig' : 'Næste'}
                            {!loading && <Check size={18} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
