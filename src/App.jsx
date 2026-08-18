import { useCallback, useEffect, useState } from 'react';
import { useI18n } from './i18n/I18nContext.jsx';
import { useToast } from './toast/ToastContext.jsx';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Footer } from './components/Footer.jsx';
import { LandingView } from './views/LandingView.jsx';
import { FitrView } from './views/FitrView.jsx';
import { MalView } from './views/MalView.jsx';
import { ZuruView } from './views/ZuruView.jsx';
import { AnaamView } from './views/AnaamView.jsx';
import { AboutView } from './views/AboutView.jsx';
import { getCurrencyRates } from './services/api.js';

export function App() {
    const { t } = useI18n();
    const toast = useToast();
    const [view, setView] = useState('landing');
    const [rates, setRates] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavigate = useCallback((targetView) => {
        setView(targetView);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    // Load currency rates on app start
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const r = await getCurrencyRates();
                if (cancelled) return;
                if (r && r.rates) {
                    setRates(r.rates);
                } else {
                    toast.error(t('error-rates-load'));
                }
            } catch (err) {
                if (cancelled) return;
                console.error(err);
                toast.error(t('error-rates-load'));
            }
        })();
        return () => { cancelled = true; };
    }, [t, toast]);

    return (
        <>
            <Header onNavigate={handleNavigate} currentView={view} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} currentView={view} />
            <main id="main-content">
                {view === 'landing' && <LandingView onNavigate={handleNavigate} />}
                {view === 'fitr' && <FitrView rates={rates} />}
                {view === 'mal' && <MalView rates={rates} setRates={setRates} />}
                {view === 'zuru' && <ZuruView />}
                {view === 'anaam' && <AnaamView />}
                {view === 'about' && <AboutView />}
            </main>
            <Footer />
        </>
    );
}
