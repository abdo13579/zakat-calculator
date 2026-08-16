import { useEffect } from 'react';
import styles from './GlobalMessage.module.css';

const AUTO_DISMISS_MS = 8000;

export function GlobalMessage({ message, type }) {
    useEffect(() => {
        if (!message) return undefined;
        const t = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('zakatcalc:clear-global-message'));
        }, AUTO_DISMISS_MS);
        return () => clearTimeout(t);
    }, [message]);

    if (!message) return null;
    const cls = type === 'error' ? styles.error : styles.info;
    return (
        <div
            id="global-message"
            className={`${styles.msg} ${cls}`}
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}
