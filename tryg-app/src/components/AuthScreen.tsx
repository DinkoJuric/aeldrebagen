// Authentication screen for Tryg App
// Handles login, signup, and role selection (senior vs relative)

import React, { useState } from 'react';
import { Heart, User, Users, Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FEATURES } from '../config/features';

export interface AuthScreenProps {
    onAuth: (type: 'login' | 'signup' | 'google', data: any) => void;
    onResetPassword: (email: string) => Promise<void>;
    error?: string | null;
    loading?: boolean;
}

// User Card Component for Living Design 🏠
interface UserCardProps {
    emoji: string;
    title: string;
    subtitle: string;
    color: string;
    onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ emoji, title, subtitle, color, onClick }) => (
    <button
        onClick={onClick}
        className={`
            w-full p-5 rounded-3xl mb-3 flex items-center gap-5 
            bg-white/60 backdrop-blur-sm border-2 border-white/50 
            hover:bg-white hover:border-stone-200 hover:scale-[1.02]
            active:scale-[0.98] transition-all duration-300 group shadow-sm
        `}
    >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm ${color}`}>
            {emoji}
        </div>
        <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-stone-800 group-hover:text-black transition-colors">{title}</h3>
            <p className="text-sm text-stone-500 font-medium">{subtitle}</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 text-stone-300 group-hover:bg-teal-50 group-hover:text-teal-500 transition-all">
            <ChevronRight size={18} />
        </div>
    </button>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth, onResetPassword, error, loading }) => {
    // Start with 'welcome' when Living Design is enabled
    const [mode, setMode] = useState<'welcome' | 'login' | 'signup' | 'role'>(
        FEATURES.livingDesign ? 'welcome' : 'login'
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'senior' | 'relative' | null>(null);
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    // Time-aware greeting for Living Design 🏠
    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 5) return 'Godnat';
        if (hour < 10) return 'Godmorgen';
        if (hour < 18) return 'Goddag';
        return 'Godaften';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            onAuth('login', { email, password });
        } else if (mode === 'signup' && selectedRole) {
            onAuth('signup', { email, password, displayName, role: selectedRole });
        }
    };

    const handleGoogleSignIn = () => {
        if (!selectedRole) {
            setMode('role');
            return;
        }
        onAuth('google', { role: selectedRole });
    };

    const handleRoleSelect = (role: 'senior' | 'relative') => {
        setSelectedRole(role);
        setMode('signup');
    };

    const handleForgotPassword = async () => {
        if (!email) return;
        setResetLoading(true);
        try {
            await onResetPassword(email);
            setResetSent(true);
        } catch (err) {
            // Error is handled by the hook and passed as error prop
        } finally {
            setResetLoading(false);
        }
    };

    // Living Design: Use transparent background (LivingBackground provides gradient)
    const containerBg = FEATURES.livingDesign
        ? 'min-h-screen flex flex-col items-center justify-center p-4'
        : 'min-h-screen bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center p-4';

    const cardClass = FEATURES.livingDesign
        ? 'glass-panel p-8 w-full max-w-md'
        : 'bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md';

    return (
        <div className={containerBg}>
            {/* Living Design: Velkommen hjem greeting - theme-aware text for dark mode */}
            {FEATURES.livingDesign && (
                <div className="text-center mb-6 w-full max-w-md">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1 theme-text-muted">
                        {getTimeGreeting()}
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight theme-text">
                        Velkommen hjem.
                    </h1>
                </div>
            )}

            {/* Living Design: User Selector Cards 🏠 */}
            {mode === 'welcome' && FEATURES.livingDesign && (
                <div className="w-full max-w-sm">
                    <UserCard
                        emoji="👴"
                        title="Min Hverdag"
                        subtitle="Jeg bor her"
                        color="bg-teal-100 text-teal-800"
                        onClick={() => setMode('login')}
                    />
                    <UserCard
                        emoji="👩‍💼"
                        title="Familie"
                        subtitle="Jeg holder øje"
                        color="bg-indigo-100 text-indigo-800"
                        onClick={() => setMode('login')}
                    />

                    <div className="mt-10 text-center">
                        <p className="text-xs font-bold theme-text-muted uppercase tracking-widest mb-2">
                            Tryghed for hele familien
                        </p>
                        <div className="flex justify-center gap-2 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-current" />
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                        </div>
                    </div>
                </div>
            )}

            {/* Standard Auth Form (shown when not in 'welcome' mode or Living Design disabled) */}
            {mode !== 'welcome' && (
                <div className={cardClass}>

                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-4">
                            <Heart className="w-10 h-10 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-stone-800">Tryg</h1>
                        <p className="text-stone-500 mt-2">Forbind med din familie</p>
                    </div>

                    {/* Role Selection */}
                    {mode === 'role' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-stone-800 text-center mb-6">
                                Hvem er du?
                            </h2>

                            <button
                                onClick={() => handleRoleSelect('senior')}
                                className="w-full p-6 rounded-2xl border-2 border-stone-200 hover:border-teal-400 transition-all flex items-center gap-4"
                            >
                                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                                    <User className="w-7 h-7 text-teal-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-lg text-stone-800">Jeg er den ældre</h3>
                                    <p className="text-stone-500 text-sm">Jeg vil tracke mine opgaver</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleSelect('relative')}
                                className="w-full p-6 rounded-2xl border-2 border-stone-200 hover:border-indigo-400 transition-all flex items-center gap-4"
                            >
                                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-7 h-7 text-indigo-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-lg text-stone-800">Jeg er pårørende</h3>
                                    <p className="text-stone-500 text-sm">Jeg vil følge med i min families trivsel</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('login')}
                                className="w-full text-center text-stone-500 text-sm mt-4 hover:text-stone-700"
                            >
                                Har du allerede en konto? Log ind
                            </button>
                        </div>
                    )}

                    {/* Login / Signup Form */}
                    {(mode === 'login' || mode === 'signup') && (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Role indicator for signup */}
                            {mode === 'signup' && selectedRole && (
                                <div className={`text-center py-2 px-4 rounded-full text-sm font-medium mb-4 ${selectedRole === 'senior'
                                    ? 'bg-teal-100 text-teal-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    {selectedRole === 'senior' ? '👤 Senior konto' : '👥 Pårørende konto'}
                                </div>
                            )}

                            {/* Display name (signup only) */}
                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Dit navn</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="F.eks. Birthe Jensen"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="din@email.dk"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1">Adgangskode</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-stone-200 focus:border-teal-400 focus:outline-none transition-colors"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Reset password success message */}
                            {resetSent && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm">
                                    📧 Vi har sendt en email til {email}. Tjek din indbakke (og spam) for at nulstille din adgangskode.
                                </div>
                            )}

                            {/* Forgot password link (login mode only) */}
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={!email || resetLoading}
                                    className="text-sm text-teal-600 hover:underline disabled:text-stone-400 disabled:no-underline"
                                >
                                    {resetLoading ? 'Sender...' : 'Glemt adgangskode?'}
                                </button>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Vent...' : mode === 'login' ? 'Log ind' : 'Opret konto'}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-4">
                                <div className="flex-1 h-px bg-stone-200" />
                                <span className="text-stone-400 text-sm">eller</span>
                                <div className="flex-1 h-px bg-stone-200" />
                            </div>

                            {/* Google sign in */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full bg-white border-2 border-stone-200 py-3 rounded-xl font-medium text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Log ind med Google
                            </button>

                            {/* Toggle mode */}
                            <p className="text-center text-stone-500 text-sm mt-4">
                                {mode === 'login' ? (
                                    <>
                                        Ny bruger?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setMode('role')}
                                            className="text-teal-600 font-medium hover:underline"
                                        >
                                            Opret konto
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Har du allerede en konto?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setMode('login')}
                                            className="text-teal-600 font-medium hover:underline"
                                        >
                                            Log ind
                                        </button>
                                    </>
                                )}
                            </p>
                        </form>
                    )}

                    {/* Privacy link */}
                    <p className="text-center text-stone-400 text-xs mt-6">
                        Ved at fortsætte accepterer du vores{' '}
                        <a href="/privacy-policy.html" className="underline hover:text-stone-600">
                            privatlivspolitik
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default AuthScreen;
