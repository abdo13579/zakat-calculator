import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './AboutView.module.css';

export function AboutView() {
    const { t } = useI18n();
    return (
        <section id="about" className="page">
            <h2>{t('about-title')}</h2>
            <div className={styles.content}>
                <p className={styles.lead}>{t('about-description')}</p>

                <div className={styles.terms}>
                    <h3>{t('about-terms-title')}</h3>
                    <p className={styles.subtle}>{t('about-terms-intro')}</p>
                    <dl className={styles.termList}>
                        <div className={styles.termRow}>
                            <dt>{t('about-term-nisab-title')}</dt>
                            <dd>{t('about-term-nisab-text')}</dd>
                        </div>
                        <div className={styles.termRow}>
                            <dt>{t('about-term-hawl-title')}</dt>
                            <dd>{t('about-term-hawl-text')}</dd>
                        </div>
                        <div className={styles.termRow}>
                            <dt>{t('about-term-saimah-title')}</dt>
                            <dd>{t('about-term-saimah-text')}</dd>
                        </div>
                    </dl>
                </div>

                <article className={styles.card}>
                    <h3>{t('about-calc-fitr-title')}</h3>
                    <p>{t('about-calc-fitr-text')}</p>
                    <p className={styles.example}>
                        <span className={styles.exampleLabel}>{t('about-example-label')}</span>
                        {t('about-calc-fitr-example')}
                    </p>
                </article>

                <article className={styles.card}>
                    <h3>{t('about-calc-mal-title')}</h3>
                    <p>{t('about-calc-mal-text')}</p>
                    <p className={styles.example}>
                        <span className={styles.exampleLabel}>{t('about-example-label')}</span>
                        {t('about-calc-mal-example')}
                    </p>
                </article>

                <article className={styles.card}>
                    <h3>{t('about-calc-zuru-title')}</h3>
                    <p>{t('about-calc-zuru-text')}</p>
                    <p className={styles.example}>
                        <span className={styles.exampleLabel}>{t('about-example-label')}</span>
                        {t('about-calc-zuru-example')}
                    </p>
                </article>

                <article className={styles.card}>
                    <h3>{t('about-calc-anaam-title')}</h3>
                    <p>{t('about-calc-anaam-text')}</p>
                    <p className={styles.conditions}>
                        <strong>{t('about-calc-anaam-conditions-title')}:</strong>{' '}
                        {t('about-calc-anaam-conditions')}
                    </p>
                </article>

                <div className={styles.notice}>
                    <h3>{t('about-privacy-title')}</h3>
                    <p>{t('about-privacy-text')}</p>
                </div>

                <div className={`${styles.notice} ${styles.disclaimer}`}>
                    <h3>{t('about-disclaimer-title')}</h3>
                    <p>{t('about-disclaimer-text')}</p>
                </div>

                <div className={styles.api}>
                    <h3>{t('about-api-title')}</h3>
                    <ul>
                        <li><code>{t('about-api-currency')}</code></li>
                        <li><code>{t('about-api-gold')}</code></li>
                    </ul>
                </div>

                <h3>{t('about-dev-title')}</h3>
                <p className={styles.dev}>
                    <span>{t('about-dev-name')}</span> — <span>{t('about-dev-role')}</span>
                </p>
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
