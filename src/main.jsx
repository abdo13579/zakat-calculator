import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n/I18nContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { ToastProvider } from './toast/ToastContext.jsx';
import { App } from './App.jsx';

import './styles/tokens.css';
import './styles/global.css';

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(
        <StrictMode>
            <I18nProvider>
                <ThemeProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </ThemeProvider>
            </I18nProvider>
        </StrictMode>
    );
}
