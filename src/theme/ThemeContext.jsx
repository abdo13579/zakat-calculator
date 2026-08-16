import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Parity behaviors per specs/002-react-migration/contracts/i18n-contract.md (companion section):
//   - values: 'dark' | 'light'
//   - persist to localStorage['zakatcalc_theme']
//   - apply via the same custom-property variables legacy uses (set body.dark-mode)

const ThemeContext = createContext(null);
const STORAGE_KEY = 'zakatcalc_theme';

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem(STORAGE_KEY) === 'dark';
    });

    useEffect(() => {
        if (typeof document === 'undefined') return;
        document.body.classList.toggle('dark-mode', isDark);
    }, [isDark]);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
            }
            return next;
        });
    }, []);

    const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}
