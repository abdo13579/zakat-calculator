import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './Sidebar.module.css';

const ITEMS = [
    { id: 'landing', icon: 'fa-home', labelKey: 'nav-home' },
    { id: 'fitr', icon: 'fa-calculator', labelKey: 'nav-zakat-fitr-full' },
    { id: 'mal', icon: 'fa-money-bill-wave', labelKey: 'nav-zakat-mal-full' },
    { id: 'zuru', icon: 'fa-seedling', labelKey: 'nav-zakat-zuru-full' },
    { id: 'about', icon: 'fa-info-circle', labelKey: 'nav-about' },
];

export function Sidebar({ isOpen, onClose, onNavigate, currentView }) {
    const { t } = useI18n();

    useEffect(() => {
        function onToggle() {
            // Header's hamburger dispatches this; Sidebar responds by reading localStorage-less state.
            document.body.classList.toggle('sidebar-open');
        }
        function onClickAway(e) {
            if (!document.body.classList.contains('sidebar-open')) return;
            const sb = document.getElementById('zakatcalc-sidebar');
            const hb = document.querySelector('[data-testid="hamburger"]');
            if (sb && !sb.contains(e.target) && hb && !hb.contains(e.target)) {
                document.body.classList.remove('sidebar-open');
            }
        }
        window.addEventListener('zakatcalc:toggle-sidebar', onToggle);
        document.body.addEventListener('click', onClickAway);
        return () => {
            window.removeEventListener('zakatcalc:toggle-sidebar', onToggle);
            document.body.removeEventListener('click', onClickAway);
        };
    }, []);

    return (
        <nav
            id="zakatcalc-sidebar"
            className={`${styles.sidebar} ${document.body.classList.contains('sidebar-open') ? styles.open : ''}`}
        >
            {ITEMS.map(item => (
                <a
                    key={item.id}
                    href="#"
                    className={`${styles.navLink} ${currentView === item.id ? styles.active : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                        onClose();
                    }}
                >
                    <i className={`fas ${item.icon}`}></i> <span>{t(item.labelKey)}</span>
                </a>
            ))}
        </nav>
    );
}
