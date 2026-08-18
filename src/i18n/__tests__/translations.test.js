import { describe, expect, it } from 'vitest';
import { translations } from '../translations.js';

function sortedKeys(obj) {
    return Object.keys(obj).sort();
}

const REQUIRED_LEGACY_KEYS = [
    'app-name',
    'page-title',
    'nav-home',
    'nav-zakat-fitr',
    'nav-zakat-fitr-full',
    'nav-zakat-mal',
    'nav-zakat-mal-full',
    'nav-about',
    'landing-title',
    'landing-subtitle',
    'fitr-title',
    'fitr-description',
    'fitr-button',
    'fitr-calculator-title',
    'fitr-helper-text',
    'mal-title',
    'mal-description',
    'mal-button',
    'nav-zakat-zuru',
    'nav-zakat-zuru-full',
    'zuru-title',
    'zuru-description',
    'zuru-button',
    'zuru-calculator-title',
    'zuru-helper-text',
    'zuru-weight-label',
    'zuru-weight-placeholder',
    'zuru-irrigation-label',
    'zuru-rainfed',
    'zuru-irrigated',
    'zuru-mixed',
    'zuru-result-title',
    'zuru-result-nisaab',
    'zuru-result-eligible',
    'zuru-result-not-eligible',
    'zuru-result-rate',
    'zuru-result-due',
    'mal-calculator-title',
    'mal-helper-text',
    'fitr-food-price-label',
    'fitr-food-price-placeholder',
    'fitr-currency-label',
    'fitr-individuals-label',
    'fitr-individuals-placeholder',
    'mal-wealth-label',
    'mal-wealth-placeholder',
    'mal-currency-label',
    'button-calculate',
    'about-title',
    'about-description',
    'about-api-title',
    'about-api-currency',
    'about-api-gold',
    'about-calc-fitr-title',
    'about-calc-fitr-text',
    'about-calc-mal-title',
    'about-calc-mal-text',
    'about-calc-zuru-title',
    'about-calc-zuru-text',
    'about-dev-title',
    'about-dev-name',
    'about-dev-role',
    'footer-text',
    'fitr-result-title',
    'fitr-result-weight',
    'fitr-result-value',
    'mal-result-title',
    'mal-result-nisaab',
    'mal-result-above',
    'mal-result-above-cont',
    'mal-result-due',
    'mal-result-below',
    'mal-result-below-cont',
    'error-invalid-input',
    'error-invalid-wealth',
    'error-api-failed',
    'error-currency-rate',
    'error-rates-load',
    'calculating',
    'button-copy',
    'copied-success',
];

const REQUIRED_MULTI_CURRENCY_KEYS = [
    'mal-wealth-row-label',
    'mal-wealth-amount-label',
    'mal-wealth-currency-label',
    'mal-add-row',
    'mal-remove-row',
    'mal-result-currency',
    'mal-result-total',
    'mal-result-breakdown',
    'mal-result-zakat',
    'mal-result-below-multi',
    'mal-result-below-multi-cont',
    'mal-result-above-multi',
    'mal-result-above-multi-cont',
    'error-row-invalid',
];

describe('translation catalog parity', () => {
    it('exports both en and ar catalogs at the same shape', () => {
        expect(translations).toBeTypeOf('object');
        expect(translations.en).toBeTypeOf('object');
        expect(translations.ar).toBeTypeOf('object');
    });

    it('en and ar have exactly the same key sets (parity rule)', () => {
        const enKeys = sortedKeys(translations.en);
        const arKeys = sortedKeys(translations.ar);
        expect(arKeys).toEqual(enKeys);
    });

    it('every key has a non-empty string value in both languages', () => {
        for (const k of Object.keys(translations.en)) {
            expect(translations.en[k], `en[${k}]`).toBeTypeOf('string');
            expect(translations.en[k].length).toBeGreaterThan(0);
            expect(translations.ar[k], `ar[${k}]`).toBeTypeOf('string');
            expect(translations.ar[k].length).toBeGreaterThan(0);
        }
    });

    it('contains all required legacy keys in both translations.en and translations.ar', () => {
        for (const key of REQUIRED_LEGACY_KEYS) {
            expect(translations.en).toHaveProperty(key);
            expect(translations.ar).toHaveProperty(key);
        }
    });

    it('contains all new multi-currency UI keys in both translations.en and translations.ar', () => {
        for (const key of REQUIRED_MULTI_CURRENCY_KEYS) {
            expect(translations.en).toHaveProperty(key);
            expect(translations.ar).toHaveProperty(key);
        }
    });
});

import { POPULAR_CURRENCIES, currencyDisplayName } from '../../utils/currency.js';
import { CURRENCY_NAMES_AR } from '../../utils/currencyNames.js';

describe('currency names catalog and helper', () => {
    it('covers all popular currencies in CURRENCY_NAMES_AR (Principle III coverage rule)', () => {
        expect(POPULAR_CURRENCIES.every(code => typeof CURRENCY_NAMES_AR[code] === 'string' && CURRENCY_NAMES_AR[code].length > 0)).toBe(true);
    });

    it('returns Arabic name when lang === "ar" and name exists', () => {
        expect(currencyDisplayName('USD', 'ar')).toBe('دولار أمريكي');
        expect(currencyDisplayName('EGP', 'ar')).toBe('جنيه مصري');
        expect(currencyDisplayName('SAR', 'ar')).toBe('ريال سعودي');
    });

    it('returns ISO code when lang === "en"', () => {
        expect(currencyDisplayName('USD', 'en')).toBe('USD');
        expect(currencyDisplayName('EGP', 'en')).toBe('EGP');
        expect(currencyDisplayName('SAR', 'en')).toBe('SAR');
    });

    it('falls back to ISO code for unknown currency in Arabic mode', () => {
        expect(currencyDisplayName('UNKNOWN_XYZ', 'ar')).toBe('UNKNOWN_XYZ');
    });
});


