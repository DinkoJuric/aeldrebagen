import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
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
                        <span
                            className="text-2xl block mb-1"
                            style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
                        >
                            {lang.label.split(' ')[0]}
                        </span>
                        <span className="block text-[10px] sm:text-xs tracking-tight">{lang.label.split(' ')[1]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
