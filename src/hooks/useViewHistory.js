import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for in-app navigation history and back/forward browser button integration.
 * Contract: specs/005-back-nav-multi-currency/contracts/navigation-api.md
 */
export function useViewHistory({
    views = ['landing', 'fitr', 'mal', 'zuru', 'anaam', 'support', 'about'],
    initialView = 'landing',
    isSidebarOpen = false,
    onCloseSidebar = null,
    onOpenSidebar = null,
} = {}) {
    const [view, setView] = useState(initialView);

    const isSidebarOpenRef = useRef(isSidebarOpen);
    const onCloseSidebarRef = useRef(onCloseSidebar);
    const onOpenSidebarRef = useRef(onOpenSidebar);

    // Synchronize refs in commit phase to prevent stale values
    useEffect(() => {
        isSidebarOpenRef.current = isSidebarOpen;
        onCloseSidebarRef.current = onCloseSidebar;
        onOpenSidebarRef.current = onOpenSidebar;
    }, [isSidebarOpen, onCloseSidebar, onOpenSidebar]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        function handlePopState(event) {
            const state = event.state;

            // If the sidebar is currently open, close it first without changing the view.
            // This consumes the back press; the next back will navigate to the preceding view entry.
            if (isSidebarOpenRef.current) {
                if (typeof onCloseSidebarRef.current === 'function') {
                    onCloseSidebarRef.current();
                }
                return;
            }

            // Forward navigation to a sidebar sentinel: reopen the sidebar
            if (state && state.sidebar === true) {
                if (typeof onOpenSidebarRef.current === 'function') {
                    onOpenSidebarRef.current();
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
    }, [views, initialView]);

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
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const onSidebarOpen = useCallback(() => {
        if (typeof window !== 'undefined' && window.history) {
            window.history.pushState({ view, sidebar: true }, '', '');
        }
    }, [view]);

    const onSidebarClosed = useCallback(() => {
        if (typeof window !== 'undefined' && window.history) {
            window.history.back();
        }
    }, []);

    return {
        view,
        navigate,
        onSidebarOpen,
        onSidebarClosed,
    };
}
