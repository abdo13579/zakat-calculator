import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations.js';

// Parity behaviors per specs/002-react-migration/contracts/i18n-contract.md:
//   - default lang: 'ar'
//   - persist to localStorage['zakatcalc_lang']
//   - set dir on BOTH document.documentElement and document.body
//   - fallback: translations[lang]?.[key] || translations.en[key] || key
//   - toggleLang flips en <-> ar

const I18nContext = createContext(null);
const STORAGE_KEY = 'zakatcalc_lang';

export function I18nProvider({ children }) {
    const [lang, setLang] = useState(() => {
        if (typeof window === 'undefined') return 'ar';
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === 'en' || stored === 'ar' ? stored : 'ar';
    });

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);
        document.body.setAttribute('dir', dir);
    }, [lang]);

    useEffect(() => {
        // Update document.title to mirror legacy behavior (translations[lang]['page-title'])
        if (typeof document !== 'undefined' && translations[lang]?.['page-title']) {
            document.title = translations[lang]['page-title'];
        }
    }, [lang]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, lang);
        }
    }, [lang]);

    const t = useCallback((key, params) => {
        const langCatalog = translations[lang];
        const raw = (langCatalog && Object.prototype.hasOwnProperty.call(langCatalog, key))
            ? langCatalog[key]
            : (translations.en[key] ?? key);
        if (!params) return raw;
        return raw.replace(/\{(\w+)\}/g, (m, name) =>
            Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : m
        );
    }, [lang]);

    const toggleLang = useCallback(() => {
        setLang(prev => (prev === 'en' ? 'ar' : 'en'));
    }, []);

    const value = useMemo(() => ({ lang, t, toggleLang }), [lang, t, toggleLang]);
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
    return ctx;
}
