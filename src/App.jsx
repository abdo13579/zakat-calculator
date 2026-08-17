import { useCallback, useEffect, useState } from 'react';
import { useI18n } from './i18n/I18nContext.jsx';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { GlobalMessage } from './components/GlobalMessage.jsx';
import { Footer } from './components/Footer.jsx';
import { LandingView } from './views/LandingView.jsx';
import { FitrView } from './views/FitrView.jsx';
import { MalView } from './views/MalView.jsx';
import { ZuruView } from './views/ZuruView.jsx';
import { AboutView } from './views/AboutView.jsx';
import { getCurrencyRates } from './services/api.js';

export function App() {
    const { t } = useI18n();
    const [view, setView] = useState('landing');
    const [rates, setRates] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [globalMessage, setGlobalMessage] = useState({ text: null, type: 'info' });

    const handleNavigate = useCallback((targetView) => {
        setView(targetView);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    // Load currency rates on app start (legacy behavior — populate the dropdowns).
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const r = await getCurrencyRates();
                if (cancelled) return;
                if (r && r.rates) {
                    setRates(r.rates);
                } else {
                    setGlobalMessage({ text: t('error-rates-load'), type: 'error' });
                }
            } catch (err) {
                if (cancelled) return;
                console.error(err);
                setGlobalMessage({ text: t('error-rates-load'), type: 'error' });
            }
        })();
        return () => { cancelled = true; };
    }, [t]);

    // Listen for clear event from GlobalMessage.
    useEffect(() => {
        function onClear() { setGlobalMessage({ text: null, type: 'info' }); }
        window.addEventListener('zakatcalc:clear-global-message', onClear);
        return () => window.removeEventListener('zakatcalc:clear-global-message', onClear);
    }, []);

    function handleGlobalError(message) {
        setGlobalMessage({ text: message, type: 'error' });
    }

    return (
        <>
            <Header onNavigate={handleNavigate} currentView={view} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} currentView={view} />
            <main id="main-content">
                <GlobalMessage message={globalMessage.text} type={globalMessage.type} />
                {view === 'landing' && <LandingView onNavigate={handleNavigate} />}
                {view === 'fitr' && (
                    <FitrView rates={rates} />
                )}
                {view === 'mal' && (
                    <MalView rates={rates} setRates={setRates} onGlobalError={handleGlobalError} />
                )}
                {view === 'zuru' && <ZuruView />}
                {view === 'about' && <AboutView />}
            </main>
            <Footer />
        </>
    );
}
