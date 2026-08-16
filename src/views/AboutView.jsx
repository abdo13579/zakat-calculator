import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './AboutView.module.css';

export function AboutView() {
    const { t } = useI18n();
    return (
        <section id="about" className="page">
            <h2>{t('about-title')}</h2>
            <div className={styles.content}>
                <p>{t('about-description')}</p>

                <h3>{t('about-calc-fitr-title')}</h3>
                <p>{t('about-calc-fitr-text')}</p>

                <h3>{t('about-calc-mal-title')}</h3>
                <p>{t('about-calc-mal-text')}</p>

                <h3>{t('about-calc-zuru-title')}</h3>
                <p>{t('about-calc-zuru-text')}</p>

                <h3>{t('about-api-title')}</h3>
                <ul>
                    <li>{t('about-api-currency')}</li>
                    <li>{t('about-api-gold')}</li>
                </ul>

                <h3>{t('about-dev-title')}</h3>
                <p><span>{t('about-dev-name')}</span> — <span>{t('about-dev-role')}</span></p>
                <div className={styles.social}>
                    <a href="https://github.com/abdo13579" target="_blank" rel="noopener" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/abdoalhythm/" target="_blank" rel="noopener" aria-label="LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="mailto:abdulrahman.contactus@example.com" aria-label="Email">
                        <i className="fas fa-envelope"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}
