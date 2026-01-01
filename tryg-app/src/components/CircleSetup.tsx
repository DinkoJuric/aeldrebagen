// Circle setup screen - shown after auth if user has no care circle
// Seniors create a new circle, relatives join via invite code

import React, { useState } from 'react';
import { Users, Plus, Key, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { RelationsSelect } from './ui/RelationsSelect';

export interface CircleSetupProps {
    userRole?: 'senior' | 'relative';
    userName?: string;
    onCreateCircle: (userName: string) => Promise<string | undefined>;
    onJoinCircle: (code: string, userName: string, relationship?: string) => Promise<string | undefined | void>;
    loading?: boolean;
    error?: string | null;
}



export const CircleSetup: React.FC<CircleSetupProps> = ({ userRole, userName, onCreateCircle, onJoinCircle, loading, error }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [createdCode, setCreatedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState<'initial' | 'creating' | 'created' | 'joining'>('initial'); // 'initial', 'creating', 'created', 'joining'
    const [relationship, setRelationship] = useState<string>('');

    const handleCreate = async () => {
        setStep('creating');
        try {
            const code = await onCreateCircle(userName || '');
            setCreatedCode(code ?? null);
            setStep('created');
        } catch {
            setStep('initial');
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteCode.length !== 6 || !relationship) return;
        await onJoinCircle(inviteCode.toUpperCase(), userName || '', relationship);
    };

    const copyCode = () => {
        if (createdCode) {
            navigator.clipboard.writeText(createdCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Senior flow - create circle
    if (userRole === 'senior') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
                        <Users className="w-10 h-10 text-teal-600" />
                    </div>

                    {step === 'initial' && (
                        <>
                            <h1 className="text-2xl font-bold text-stone-800 mb-2">Velkommen, {userName}!</h1>
                            <p className="text-stone-500 mb-8">
                                Lad os oprette dit familiens overblik, så dine pårørende kan følge med.
                            </p>

                            <button
                                onClick={handleCreate}
                                disabled={loading}
                                className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Opret min families overblik
                            </button>
                        </>
                    )}

                    {step === 'creating' && (
                        <div className="py-8">
                            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
                            <p className="text-stone-500">Opretter din cirkel...</p>
                        </div>
                    )}

                    {step === 'created' && (
                        <>
                            <h1 className="text-2xl font-bold text-stone-800 mb-2">Din cirkel er klar! 🎉</h1>
                            <p className="text-stone-500 mb-6">
                                Del denne kode med dine pårørende, så de kan tilslutte sig:
                            </p>

                            <div className="bg-stone-100 rounded-2xl p-6 mb-6">
                                <p className="text-sm text-stone-500 mb-2">Invitationskode</p>
                                <p className="text-4xl font-mono font-bold text-stone-800 tracking-widest">
                                    {createdCode}
                                </p>
                            </div>

                            <button
                                onClick={copyCode}
                                className="w-full bg-stone-200 text-stone-700 py-3 rounded-xl font-medium hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 mb-4"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Kopieret!' : 'Kopier kode'}
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Fortsæt til appen
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mt-4">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Relative flow - join circle
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">

                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <Key className="w-10 h-10 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold text-stone-800 mb-2">Velkommen, {userName}!</h1>
                <p className="text-stone-500 mb-6">
                    Indtast invitationskoden fra din pårørende for at tilslutte dig deres cirkel.
                </p>

                <form onSubmit={handleJoin} className="space-y-4">
                    {/* Relationship Selector */}
                    <RelationsSelect
                        value={relationship}
                        onChange={setRelationship}
                        seniorName="Senioren"
                    />

                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1 ml-1 text-left">Invitationskode</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
                            placeholder="XXXXXX"
                            className="w-full text-center text-3xl font-mono font-bold tracking-widest py-4 rounded-xl border-2 border-stone-200 focus:border-indigo-400 focus:outline-none transition-colors uppercase"
                            maxLength={6}
                            autoComplete="off"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || inviteCode.length !== 6 || !relationship}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Tilslut cirkel
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CircleSetup;
