import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

const DEFAULT_DURATION = 5000;

export function ToastProvider({ children }) {
    const [currentToast, setCurrentToast] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef(null);
    const exitTimerRef = useRef(null);
    const idCounterRef = useRef(0);

    const dismiss = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsExiting(true);
        exitTimerRef.current = setTimeout(() => {
            setCurrentToast(null);
            setIsExiting(false);
        }, 150);
    }, []);

    const show = useCallback((type, message, duration = DEFAULT_DURATION) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        setIsExiting(false);

        idCounterRef.current += 1;
        const newToast = {
            id: idCounterRef.current,
            type,
            message,
            duration,
        };
        setCurrentToast(newToast);

        timerRef.current = setTimeout(() => {
            dismiss();
        }, duration);
    }, [dismiss]);

    const toast = useMemo(() => ({
        show,
        success: (msg, dur) => show('success', msg, dur),
        error: (msg, dur) => show('error', msg, dur),
        info: (msg, dur) => show('info', msg, dur),
        dismiss,
    }), [show, dismiss]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        };
    }, []);

    const iconClass = currentToast?.type === 'success'
        ? 'fa-check-circle'
        : currentToast?.type === 'error'
            ? 'fa-exclamation-circle'
            : 'fa-info-circle';

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {currentToast && (
                <div className={styles.toastContainer} role="status" aria-live="polite">
                    <div
                        className={`${styles.toast} ${styles[currentToast.type] || styles.info} ${isExiting ? styles.exiting : ''}`}
                    >
                        <i className={`fas ${iconClass} ${styles.icon}`}></i>
                        <span className={styles.message}>{currentToast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}
