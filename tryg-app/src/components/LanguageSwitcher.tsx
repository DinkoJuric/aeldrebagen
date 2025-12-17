import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const { userProfile, updateLanguagePreference } = useAuth();

    const languages = [
        { code: 'da', label: '🇩🇰 Dansk' },
        { code: 'tr', label: '🇹🇷 Türkçe' },
        { code: 'bs', label: '🇧🇦 Bosanski' }
    ];

    // Sync i18n state with user profile on load
    useEffect(() => {
        if (userProfile?.languagePreference && i18n.language !== userProfile.languagePreference) {
            i18n.changeLanguage(userProfile.languagePreference);
        }
    }, [userProfile?.languagePreference, i18n]);

    const handleLanguageChange = async (code: string) => {
        await i18n.changeLanguage(code);
        if (updateLanguagePreference) {
            await updateLanguagePreference(code);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 px-1">
                {t('language_selection')}
            </h4>
            <div className="flex gap-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`
                            flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200
                            ${i18n.language === lang.code
                                ? 'bg-white shadow-md text-teal-700 border border-teal-100 scale-[1.02]'
                                : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'}
                        `}
                    >
                        <span className="text-lg block mb-0.5">{lang.label.split(' ')[0]}</span>
                        <span className="block text-[10px] sm:text-xs">{lang.label.split(' ')[1]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
