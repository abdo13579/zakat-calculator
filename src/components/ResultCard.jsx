import { useI18n } from '../i18n/I18nContext.jsx';
import { useToast } from '../toast/ToastContext.jsx';
import styles from './ResultCard.module.css';

export function ResultCard({ title, children, plainText, actionLabel }) {
    const { t } = useI18n();
    const toast = useToast();

    async function handleCopy() {
        const successMsg = t('copied-success');
        const failMsg = t('copy-failed');
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(plainText);
                toast.success(successMsg);
                return;
            }
        } catch (err) {
            console.warn('Clipboard API failed, attempting fallback', err);
        }

        // Fallback for non-secure contexts or legacy browsers
        try {
            const ta = document.createElement('textarea');
            ta.value = plainText;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(ta);
            if (successful) {
                toast.success(successMsg);
            } else {
                toast.error(failMsg);
            }
        } catch (fallbackErr) {
            console.error('Copy fallback failed', fallbackErr);
            toast.error(failMsg);
        }
    }

    return (
        <div className="results-container show">
            {title && <h3>{title}</h3>}
            {children}
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={handleCopy}
                >
                    <i className="fas fa-copy"></i> <span>{actionLabel || t('button-copy')}</span>
                </button>
            </div>
        </div>
    );
}
