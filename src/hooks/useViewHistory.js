import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for in-app navigation history and back/forward browser button integration.
 * Contract: specs/005-back-nav-multi-currency/contracts/navigation-api.md
 */
export function useViewHistory({
    views = ['landing', 'fitr', 'mal', 'zuru', 'anaam', 'about'],
    initialView = 'landing',
    isSidebarOpen = false,
    onCloseSidebar = null,
} = {}) {
    const [view, setView] = useState(initialView);
    const [historyLength, setHistoryLength] = useState(() => (
        typeof window !== 'undefined' && window.history ? window.history.length : 1
    ));

    const isSidebarOpenRef = useRef(isSidebarOpen);
    isSidebarOpenRef.current = isSidebarOpen;

    const onCloseSidebarRef = useRef(onCloseSidebar);
    onCloseSidebarRef.current = onCloseSidebar;

    const syncHistoryLength = useCallback(() => {
        if (typeof window !== 'undefined' && window.history) {
            setHistoryLength(window.history.length);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        function handlePopState(event) {
            syncHistoryLength();
            const state = event.state;

            // If the sidebar was open when the back button was pressed, the browser
            // popped the sentinel entry. We close the sidebar and leave the current view unchanged.
            if (isSidebarOpenRef.current) {
                if (typeof onCloseSidebarRef.current === 'function') {
                    onCloseSidebarRef.current();
                }
                return;
            }

            // Normal in-app navigation through history stack
            if (state && typeof state.view === 'string' && views.includes(state.view)) {
                setView(state.view);
            } else {
                setView(initialView);
            }
            if (typeof window !== 'undefined') {
                window.scrollTo(0, 0);
            }
        }

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [views, initialView, syncHistoryLength]);

    const navigate = useCallback((toView) => {
        if (typeof window !== 'undefined' && window.history) {
            if (isSidebarOpenRef.current) {
                // When navigating from an open sidebar drawer, replace the sentinel entry
                // with the new view so the history stack remains linear and forward button works.
                window.history.replaceState({ view: toView }, '', '');
                if (typeof onCloseSidebarRef.current === 'function') {
                    onCloseSidebarRef.current();
                }
            } else {
                window.history.pushState({ view: toView }, '', '');
            }
        }
        setView(toView);
        syncHistoryLength();
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [syncHistoryLength]);

    const onSidebarOpen = useCallback(() => {
        if (typeof window !== 'undefined' && window.history) {
            window.history.pushState({ view, sidebar: true }, '', '');
            syncHistoryLength();
        }
    }, [view, syncHistoryLength]);

    const onSidebarClosed = useCallback(() => {
        if (typeof window !== 'undefined' && window.history) {
            window.history.back();
            syncHistoryLength();
        }
    }, [syncHistoryLength]);

    const canGoBack = historyLength > 1;

    return {
        view,
        navigate,
        onSidebarOpen,
        onSidebarClosed,
        canGoBack,
    };
}
