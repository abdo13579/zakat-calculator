import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './Footer.module.css';

export function Footer() {
    const { t } = useI18n();
    return (
        <footer className={styles.footer}>
            <p>{t('footer-text')}</p>
        </footer>
    );
}
