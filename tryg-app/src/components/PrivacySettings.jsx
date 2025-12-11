// Privacy Settings Screen - GDPR data export, deletion, and pause controls
// Accessible from app settings

import React, { useState } from 'react';
import {
    Shield,
    Download,
    Trash2,
    Pause,
    Play,
    ChevronRight,
    AlertTriangle,
    Check,
    Loader2,
    X
} from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../config/firebase';

export const PrivacySettings = ({
    user,
    careCircle,
    onClose,
    onPauseChange,
    isPaused = false
}) => {
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Export all user data as JSON
    const handleExportData = async () => {
        setExporting(true);
        try {
            const exportData = {
                exportDate: new Date().toISOString(),
                user: {
                    email: user.email,
                    displayName: user.displayName,
                    uid: user.uid,
                },
                careCircle: careCircle ? {
                    id: careCircle.id,
                    seniorName: careCircle.seniorName,
                } : null,
                tasks: [],
                symptoms: [],
                settings: null,
            };

            if (careCircle?.id) {
                // Fetch tasks
                const tasksSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'tasks')
                );
                exportData.tasks = tasksSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                // Fetch symptoms
                const symptomsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'symptoms')
                );
                exportData.symptoms = symptomsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                // Fetch settings
                const settingsDoc = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'settings')
                );
                exportData.settings = settingsDoc.docs.map(d => ({ id: d.id, ...d.data() }));
            }

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tryg-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setExported(true);
            setTimeout(() => setExported(false), 3000);
        } catch (err) {
            console.error('Export error:', err);
            alert('Der opstod en fejl ved eksport af data');
        } finally {
            setExporting(false);
        }
    };

    // Delete all user data and account
    const handleDeleteAccount = async () => {
        setDeleting(true);
        setDeleteError(null);

        try {
            const batch = writeBatch(db);

            // Delete care circle data if exists
            if (careCircle?.id) {
                // Delete tasks
                const tasksSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'tasks')
                );
                tasksSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete symptoms
                const symptomsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'symptoms')
                );
                symptomsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete settings
                const settingsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'settings')
                );
                settingsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete pings
                const pingsSnapshot = await getDocs(
                    collection(db, 'careCircles', careCircle.id, 'pings')
                );
                pingsSnapshot.docs.forEach(d => batch.delete(d.ref));

                // Delete membership
                batch.delete(doc(db, 'careCircleMemberships', `${careCircle.id}_${user.uid}`));

                // If user is the senior (owner), delete the circle itself
                if (careCircle.seniorId === user.uid) {
                    batch.delete(doc(db, 'careCircles', careCircle.id));
                }
            }

            // Delete user profile
            batch.delete(doc(db, 'users', user.uid));

            // Commit all deletes
            await batch.commit();

            // Delete Firebase Auth account
            await deleteUser(auth.currentUser);

            // User is now logged out, page will redirect to login
        } catch (err) {
            console.error('Delete error:', err);
            if (err.code === 'auth/requires-recent-login') {
                setDeleteError('Du skal logge ind igen for at slette din konto. Log ud og log ind igen.');
            } else {
                setDeleteError('Der opstod en fejl. Prøv igen senere.');
            }
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white p-4 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-teal-600" />
                        </div>
                        <h2 className="text-xl font-bold text-stone-800">Privatliv & Data</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">

                    {/* Pause Sharing */}
                    <div className="bg-stone-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isPaused ? (
                                    <Pause className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <Play className="w-6 h-6 text-teal-600" />
                                )}
                                <div>
                                    <h3 className="font-bold text-stone-800">Pause deling</h3>
                                    <p className="text-sm text-stone-500">
                                        {isPaused ? 'Din familie kan ikke se dine aktiviteter' : 'Din familie kan se dine aktiviteter'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onPauseChange?.(!isPaused)}
                                className={`w-14 h-8 rounded-full transition-colors relative ${isPaused ? 'bg-amber-500' : 'bg-teal-500'
                                    }`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${isPaused ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Export Data */}
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="w-full bg-stone-50 rounded-2xl p-4 flex items-center justify-between hover:bg-stone-100 transition-colors disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3">
                            {exporting ? (
                                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                            ) : exported ? (
                                <Check className="w-6 h-6 text-teal-600" />
                            ) : (
                                <Download className="w-6 h-6 text-teal-600" />
                            )}
                            <div className="text-left">
                                <h3 className="font-bold text-stone-800">Download mine data</h3>
                                <p className="text-sm text-stone-500">Få en kopi af alle dine data</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400" />
                    </button>

                    {/* Delete Account */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-50 rounded-2xl p-4 flex items-center justify-between hover:bg-red-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-6 h-6 text-red-600" />
                                <div className="text-left">
                                    <h3 className="font-bold text-red-800">Slet min konto</h3>
                                    <p className="text-sm text-red-600">Sletter alle dine data permanent</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                    ) : (
                        <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                <h3 className="font-bold text-red-800">Er du sikker?</h3>
                            </div>
                            <p className="text-sm text-red-700 mb-4">
                                Dette vil permanent slette alle dine data, inklusiv opgaver, symptomer, og din konto.
                                Dette kan ikke fortrydes.
                            </p>

                            {deleteError && (
                                <div className="bg-red-100 text-red-800 p-3 rounded-xl text-sm mb-4">
                                    {deleteError}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-white text-stone-700 rounded-xl font-medium hover:bg-stone-100"
                                >
                                    Annuller
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sletter...
                                        </>
                                    ) : (
                                        'Ja, slet alt'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info section */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-stone-400">
                            Dine data opbevares i EU (Frankfurt) og er krypteret.
                        </p>
                        <a
                            href="/privacy-policy.html"
                            className="text-xs text-teal-600 hover:underline"
                        >
                            Læs vores fulde privatlivspolitik
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
