import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './Footer.module.css';

export function Footer({ currentView, onNavigate }) {
    const { t } = useI18n();
    return (
        <footer className={styles.footer}>
            {currentView !== 'support' && onNavigate && (
                <p className={styles.supportPrompt}>
                    <button
                        type="button"
                        className={styles.supportLink}
                        onClick={() => onNavigate('support')}
                        aria-label={t('support-link-aria')}
                    >
                        {t('footer-support-prompt')}
                    </button>
                </p>
            )}
            <p>{t('footer-text')}</p>
        </footer>
    );
}
