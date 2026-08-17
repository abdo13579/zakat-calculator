import { useI18n } from '../i18n/I18nContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import styles from './Header.module.css';

export function Header({ onNavigate, currentView, onToggleSidebar }) {
    const { t, toggleLang } = useI18n();
    const { isDark, toggleTheme } = useTheme();

    const navItems = [
        { id: 'landing', icon: 'fa-home', labelKey: 'nav-home', fullLabelKey: 'nav-home' },
        { id: 'fitr', icon: 'fa-calculator', labelKey: 'nav-zakat-fitr', fullLabelKey: 'nav-zakat-fitr-full' },
        { id: 'mal', icon: 'fa-money-bill-wave', labelKey: 'nav-zakat-mal', fullLabelKey: 'nav-zakat-mal-full' },
        { id: 'zuru', icon: 'fa-seedling', labelKey: 'nav-zakat-zuru', fullLabelKey: 'nav-zakat-zuru-full' },
        { id: 'about', icon: 'fa-info-circle', labelKey: 'nav-about', fullLabelKey: 'nav-about' },
    ];

    return (
        <header>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>{t('app-name')}</div>
                <nav className={styles.desktopNav}>
                    {navItems.map(item => (
                        <a
                            key={item.id}
                            href="#"
                            className={`${styles.navLink} ${currentView === item.id ? styles.active : ''}`}
                            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                            data-page={item.id}
                        >
                            <i className={`fas ${item.icon}`}></i> <span>{t(item.labelKey)}</span>
                        </a>
                    ))}
                </nav>
                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={toggleLang}
                        aria-label={t('toggle-language')}
                    >
                        <i className="fas fa-language"></i>
                    </button>
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={toggleTheme}
                        aria-label={t(isDark ? 'switch-light-mode' : 'switch-dark-mode')}
                    >
                        <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                    <button
                        type="button"
                        data-testid="hamburger"
                        className={`${styles.iconButton} ${styles.hamburger}`}
                        onClick={onToggleSidebar}
                        aria-label={t('toggle-menu')}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}
