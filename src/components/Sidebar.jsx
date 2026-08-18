import { useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './Sidebar.module.css';

const ITEMS = [
    { id: 'landing', icon: 'fa-home', labelKey: 'nav-home' },
    { id: 'fitr', icon: 'fa-calculator', labelKey: 'nav-zakat-fitr-full' },
    { id: 'mal', icon: 'fa-money-bill-wave', labelKey: 'nav-zakat-mal-full' },
    { id: 'zuru', icon: 'fa-seedling', labelKey: 'nav-zakat-zuru-full' },
    { id: 'anaam', icon: 'fa-paw', labelKey: 'nav-zakat-anaam-full' },
    { id: 'about', icon: 'fa-info-circle', labelKey: 'nav-about' },
];

export function Sidebar({ isOpen, onClose, onNavigate, currentView }) {
    const { t } = useI18n();

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.classList.toggle('sidebar-open', isOpen);
        }
        return () => {
            if (typeof document !== 'undefined') {
                document.body.classList.remove('sidebar-open');
            }
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        function onClickAway(e) {
            const sb = document.getElementById('zakatcalc-sidebar');
            const hb = document.querySelector('[data-testid="hamburger"]');
            if (sb && !sb.contains(e.target) && (!hb || !hb.contains(e.target))) {
                onClose?.();
            }
        }
        document.body.addEventListener('click', onClickAway);
        return () => {
            document.body.removeEventListener('click', onClickAway);
        };
    }, [isOpen, onClose]);

    return (
        <nav
            id="zakatcalc-sidebar"
            className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        >
            {ITEMS.map(item => (
                <a
                    key={item.id}
                    href="#"
                    className={`${styles.navLink} ${currentView === item.id ? styles.active : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                    }}
                >
                    <i className={`fas ${item.icon}`}></i> <span>{t(item.labelKey)}</span>
                </a>
            ))}
        </nav>
    );
}
