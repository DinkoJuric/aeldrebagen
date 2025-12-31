import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, SunMoon, Globe, Shield, LogOut, Download, Trash2, ChevronRight, BookOpen } from 'lucide-react';
import { User } from 'firebase/auth';
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { resolvePath } from '../utils/assetUtils';

interface SettingsModalProps {
    user: User | null;
    careCircle: any;
    onClose: () => void;
    onSignOut: () => void;
    onStartOnboarding: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    user,
    careCircle,
    onClose,
    onSignOut,
    onStartOnboarding
}) => {
    const { t, i18n } = useTranslation();
    const { mode, setMode } = useTheme();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pauseSharing, setPauseSharing] = useState(false);

    const languages = [
        { code: 'da', label: 'Dansk', flag: '🇩🇰' },
        { code: 'bs', label: 'Bosanski', flag: '🇧🇦' },
        { code: 'tr', label: 'Türkçe', flag: '🇹🇷' }
    ];

    const themes = [
        { id: 'auto', label: t('theme_auto', 'Auto (Følger solen)'), icon: SunMoon },
        { id: 'light', label: t('theme_light', 'Lys'), icon: Sun },
        { id: 'dark', label: t('theme_dark', 'Mørk'), icon: Moon }
    ];

    const handleDeleteAccount = async () => {
        if (!user) return;
        setDeleting(true);
        try {
            // Re-authenticate if needed
            try {
                await deleteUser(user);
            } catch (err: any) {
                if (err.code === 'auth/requires-recent-login') {
                    const provider = new GoogleAuthProvider();
                    await reauthenticateWithPopup(user, provider);
                    await deleteUser(user);
                } else {
                    throw err;
                }
            }
            onClose();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(t('privacy_error_generic'));
        } finally {
            setDeleting(false);
        }
    };

    const handleExportData = async () => {
        // Simple data export - in production would be more comprehensive
        const data = {
            email: user?.email,
            circleId: careCircle?.id,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tryg-data-export.json';
        a.click();
    };

    // Privacy sub-view
    if (showPrivacy) {
        return (
            <Modal isOpen={true} onClose={() => setShowPrivacy(false)} title={t('privacy_title')}>
                <div className="space-y-4 relative min-h-[400px] pb-12">
                    {/* Pause Sharing Toggle */}
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                        <div>
                            <h4 className="font-bold text-stone-800">{t('privacy_pause_sharing')}</h4>
                            <p className="text-xs text-stone-500">
                                {pauseSharing ? t('privacy_pause_on') : t('privacy_pause_off')}
                            </p>
                        </div>
                        <button
                            onClick={() => setPauseSharing(!pauseSharing)}
                            className={`w-14 h-8 rounded-full transition-colors ${pauseSharing ? 'bg-amber-500' : 'bg-stone-300'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${pauseSharing ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Download Data */}
                    <button
                        onClick={handleExportData}
                        className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-teal-600" />
                            <div className="text-left">
                                <h4 className="font-bold text-stone-800">{t('privacy_download_data')}</h4>
                                <p className="text-xs text-stone-500">{t('privacy_download_desc')}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400" />
                    </button>

                    {/* Delete Account */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-5 h-5 text-red-600" />
                                <div className="text-left">
                                    <h4 className="font-bold text-red-700">{t('privacy_delete_account')}</h4>
                                    <p className="text-xs text-red-500">{t('privacy_delete_desc')}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-400" />
                        </button>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200 space-y-3">
                            <h4 className="font-bold text-red-700">{t('privacy_confirm_title')}</h4>
                            <p className="text-sm text-red-600">{t('privacy_confirm_desc')}</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1"
                                >
                                    {t('privacy_cancel')}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    {deleting ? t('privacy_deleting') : t('privacy_confirm_delete')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <p className="text-xs text-stone-400 text-center pt-2 pb-6">
                        {t('privacy_info_storage')}
                    </p>

                    <Button variant="secondary" className="w-full" onClick={() => setShowPrivacy(false)}>
                        {t('back')}
                    </Button>
                </div>
            </Modal >
        );
    }

return (
    <Modal isOpen={true} onClose={onClose} title={t('settings')}>
        <div className="space-y-6">

            {/* General Section */}
            <section>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">{t('general')}</h3>

                {/* Theme Selection */}
                <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium text-stone-700">{t('theme')}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setMode(theme.id as 'auto' | 'light' | 'dark')}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${mode === theme.id
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-stone-200 hover:border-teal-300'
                                    }`}
                            >
                                <theme.icon className={`w-5 h-5 ${mode === theme.id ? 'text-teal-600' : 'text-stone-500'}`} />
                                <span className={`text-xs font-medium ${mode === theme.id ? 'text-teal-700' : 'text-stone-600'}`}>
                                    {theme.label.split(' ')[0]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t('language_selection')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => i18n.changeLanguage(lang.code)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${i18n.language === lang.code
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-stone-200 hover:border-teal-300'
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span className={`text-xs font-medium ${i18n.language === lang.code ? 'text-teal-700' : 'text-stone-600'}`}>
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Onboarding Button */}
                <div className="pt-4">
                    <button
                        onClick={onStartOnboarding}
                        className="w-full flex items-center justify-between p-4 bg-teal-50 border-2 border-teal-100 rounded-xl hover:bg-teal-100 hover:border-teal-200 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-full text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-teal-900">{t('app_guide_button', 'App Guide')}</h4>
                                <p className="text-xs text-teal-700">{t('app_guide_desc', 'Se hvordan appen virker')}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-teal-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            </section>

            {/* Privacy & Data Section */}
            <section>
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">{t('privacy_data')}</h3>
                <button
                    onClick={() => setShowPrivacy(true)}
                    className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-teal-600" />
                        <span className="font-medium text-stone-800">{t('privacy_title')}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400" />
                </button>
            </section>

            {/* Sign Out */}
            <div className="border-t border-stone-100 pt-4">
                <button
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
                >
                    <LogOut className="w-5 h-5" />
                    {t('sign_out')}
                </button>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-stone-300">Version 1.0.3 • Build 2024</p>
                </div>
            </div>
        </div>
    </Modal>
);
};
