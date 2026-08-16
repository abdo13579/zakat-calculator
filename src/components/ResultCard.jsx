import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { formatNumber } from '../utils/format.js';
import styles from './ResultCard.module.css';

function showSuccessMessage(text) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
    const main = document.getElementById('main-content');
    if (main) main.insertBefore(div, main.firstChild.nextSibling);
    setTimeout(() => div.remove(), 3000);
}

// Fallback clipboard path matches legacy copyToClipboard in js/app.js.
function legacyCopy(text, successKey) {
    return () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showSuccessMessage(successKey);
    };
}

function copyToClipboard(text, successKey) {
    const fallback = legacyCopy(text, successKey);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
            () => showSuccessMessage(successKey),
            fallback
        );
    } else {
        fallback();
    }
}

export function ResultCard({ title, children, plainText, actionLabel }) {
    const { t } = useI18n();
    const [visible, setVisible] = useState(true);
    // Keep the container invisible until first render kicks in (parity with legacy .show class).
    if (!visible) return null;

    return (
        <div className={`results-container show`}>
            {title && <h3>{title}</h3>}
            {children}
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => copyToClipboard(plainText, t('copied-success'))}
                >
                    <i className="fas fa-copy"></i> {actionLabel || t('button-copy')}
                </button>
            </div>
        </div>
    );
}

export function formatResultNumber(num) {
    return formatNumber(num);
}
