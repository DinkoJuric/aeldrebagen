import React, { useState } from 'react';
import { X, Lock, Shield, Trash2, Download, Globe, LogOut, Sun, Moon, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface SettingsModalProps {
    user: any;
    careCircle: any;
    onClose: () => void;
    onSignOut: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    user,
    careCircle,
    onClose,
    onSignOut
}) => {
    const { t } = useTranslation();
    const { mode, setMode } = useTheme();
    const [activeTab, setActiveTab] = useState<'general' | 'privacy'>('general');


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl theme-aware-border">
                {/* Header */}
                <div className="px-6 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{t('settings')}</h2>
                        <p className="text-xs text-stone-500 font-medium">{user?.email}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-stone-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-stone-100">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'general'
                            ? 'border-teal-500 text-teal-700'
                            : 'border-transparent text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        {t('general')}
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'privacy'
                            ? 'border-teal-500 text-teal-700'
                            : 'border-transparent text-stone-400 hover:text-stone-600'
                            }`}
                    >
                        {t('privacy_data')}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === 'general' ? (
                        <>
                            {/* Theme Selection */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-stone-600 mb-1">
                                    <Zap className="w-4 h-4" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">{t('theme')}</h3>
                                </div>
                                <div className="flex bg-stone-100 p-1 rounded-2xl">
                                    {[
                                        { id: 'auto', label: t('theme_auto'), icon: Sun },
                                        { id: 'light', label: t('theme_light'), icon: Sun },
                                        { id: 'dark', label: t('theme_dark'), icon: Moon }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMode(m.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-all ${mode === m.id
                                                ? 'bg-white text-teal-700 shadow-sm'
                                                : 'text-stone-500 hover:text-stone-700'
                                                }`}
                                        >
                                            <m.icon className={`w-3.5 h-3.5 ${mode === m.id ? 'text-teal-500' : 'text-stone-400'}`} />
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Language Selection */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-stone-600 mb-1">
                                    <Globe className="w-4 h-4" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">{t('language_selection')}</h3>
                                </div>
                                <LanguageSwitcher />
                            </section>

                            {/* Sign Out */}
                            <section className="pt-4">
                                <button
                                    onClick={onSignOut}
                                    className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t('sign_out')}
                                </button>
                            </section>
                        </>
                    ) : (
                        // Simplified Privacy view (reusing logic from PrivacySettings)
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                <Shield className="w-6 h-6 text-orange-500" />
                                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                    {t('privacy_notice', 'Dine data gemmes sikkert og deles kun med din lukkede familie-cirkel.')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t('data_management', 'Data Management')}</h4>
                                <button className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 rounded-2xl transition-colors text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-5 h-5 text-stone-500" />
                                        <span>{t('export_my_data', 'Eksporter mine data')}</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors text-sm font-medium text-stone-600">
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="w-5 h-5" />
                                        <span>{t('delete_my_account', 'Slet min konto')}</span>
                                    </div>
                                </button>
                            </div>

                            <div className="p-4 bg-stone-50 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-stone-500">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t('security', 'Sikkerhed')}</span>
                                </div>
                                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tight">Care Circle ID</p>
                                <p className="text-xs font-mono text-stone-500 truncate">{careCircle?.id}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer safe area */}
                <div className="h-8 sm:h-0" />
            </div>
        </div>
    );
};

export default SettingsModal;
