import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './SupportView.module.css';

const SUPPORT_OPTIONS = [
    {
        id: 'vote',
        titleKey: 'support-vote-title',
        textKey: 'support-vote-text',
        linkLabelKey: 'support-vote-link',
        href: 'https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4',
    },
    {
        id: 'contribute',
        titleKey: 'support-contribute-title',
        textKey: 'support-contribute-text',
        linkLabelKey: 'support-contribute-link',
        href: 'https://github.com/abdo13579/zakat-calculator',
    },
    {
        id: 'star',
        titleKey: 'support-star-title',
        textKey: 'support-star-text',
        linkLabelKey: 'support-star-link',
        href: 'https://github.com/abdo13579/zakat-calculator',
    },
];

export function SupportView() {
    const { t } = useI18n();
    return (
        <section id="support" className="page">
            <h2>{t('support-title')}</h2>
            <div className={styles.content}>
                <p>{t('support-intro')}</p>

                {SUPPORT_OPTIONS.map((option) => (
                    <div key={option.id}>
                        <h3>{t(option.titleKey)}</h3>
                        <p>{t(option.textKey)}</p>
                        <p>
                            <a
                                href={option.href}
                                target="_blank"
                                rel="noopener"
                            >
                                {t(option.linkLabelKey)}
                            </a>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
