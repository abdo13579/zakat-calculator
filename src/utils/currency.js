import { CURRENCY_NAMES_AR } from './currencyNames.js';

// Currency helpers ported from legacy js/app.js (populateCurrencyDropdowns / detectUserCurrency).

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'SAR', 'EGP', 'AED', 'KWD', 'TRY', 'IDR', 'PKR'];

export function sortedPopularCurrencies() {
    // Sort popular currencies alphabetically, but place USD first.
    return [...POPULAR_CURRENCIES].sort((a, b) => {
        if (a === 'USD') return -1;
        if (b === 'USD') return 1;
        return a.localeCompare(b);
    });
}

export const REGION_CURRENCY = {
    US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR',
    ES: 'EUR', NL: 'EUR', SA: 'SAR', AE: 'AED', EG: 'EGP', KW: 'KWD',
    TR: 'TRY', ID: 'IDR', PK: 'PKR', QA: 'QAR', BH: 'BHD', JO: 'JOD',
    CA: 'CAD', AU: 'AUD', JP: 'JPY', CN: 'CNY', IN: 'INR', SG: 'SGD',
    MY: 'MYR', PH: 'PHP', BD: 'BDT', NG: 'NGN', ZA: 'ZAR',
};

export function detectUserCurrency() {
    try {
        const locale = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
        const parts = locale.split('-');
        const region = parts[parts.length - 1].toUpperCase();
        return REGION_CURRENCY[region] || 'USD';
    } catch {
        return 'USD';
    }
}

// Returns the list of currencies we can render in a dropdown given an `appState.rates` map.
// Only includes currencies that have a non-null entry in `rates`.
export function currenciesAvailable(rates) {
    if (!rates) return [];
    return sortedPopularCurrencies().filter(code => rates[code] != null);
}

/**
 * Returns Arabic display name when lang === 'ar' and name exists, else code.
 * Contract: specs/005-back-nav-multi-currency/contracts/i18n-catalog.md
 */
export function currencyDisplayName(code, lang) {
    if (!code) return '';
    if (lang === 'ar' && CURRENCY_NAMES_AR && CURRENCY_NAMES_AR[code]) {
        return CURRENCY_NAMES_AR[code];
    }
    return code;
}
