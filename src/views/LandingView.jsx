import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './LandingView.module.css';

export function LandingView({ onNavigate }) {
    const { t } = useI18n();

    const cards = [
        {
            id: 'fitr',
            icon: 'fa-bowl-rice',
            titleKey: 'fitr-title',
            descKey: 'fitr-description',
            btnKey: 'fitr-button',
        },
        {
            id: 'mal',
            icon: 'fa-coins',
            titleKey: 'mal-title',
            descKey: 'mal-description',
            btnKey: 'mal-button',
        },
        {
            id: 'zuru',
            icon: 'fa-seedling',
            titleKey: 'zuru-title',
            descKey: 'zuru-description',
            btnKey: 'zuru-button',
        },
        {
            id: 'anaam',
            icon: 'fa-paw',
            titleKey: 'anaam-title',
            descKey: 'anaam-description',
            btnKey: 'anaam-button',
        },
    ];

    return (
        <section id="landing-page" className="page">
            <h1>{t('landing-title')}</h1>
            <p>{t('landing-subtitle')}</p>
            <div className={styles.grid}>
                {cards.map(card => (
                    <article key={card.id} className={styles.card}>
                        <h2><i className={`fas ${card.icon}`}></i> <span>{t(card.titleKey)}</span></h2>
                        <p>{t(card.descKey)}</p>
                        <button
                            type="button"
                            className={`cta-button ${styles.navLink}`}
                            onClick={() => onNavigate(card.id)}
                            data-page={card.id}
                        >
                            <span>{t(card.btnKey)}</span>
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
