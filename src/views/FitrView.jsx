import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { calculateFitr } from '../domain/fitr.js';
import { currenciesAvailable, detectUserCurrency, POPULAR_CURRENCIES, currencyDisplayName } from '../utils/currency.js';
import { formatNumber } from '../utils/format.js';
import { ResultCard } from '../components/ResultCard.jsx';

const FALLBACK_CURRENCIES = Array.from(new Set([...POPULAR_CURRENCIES.slice(0, 3), 'EGP', 'SAR', 'USD']));

export function FitrView({ rates, onRatesLoadFailed }) {
    const { t, lang } = useI18n();
    const [pricePerKg, setPricePerKg] = useState('');
    const [individuals, setIndividuals] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const currencyOptions = useMemo(() => {
        const available = currenciesAvailable(rates);
        return available.length > 0 ? available : FALLBACK_CURRENCIES;
    }, [rates]);

    useEffect(() => {
        const preferred = detectUserCurrency();
        const initial = currencyOptions.includes(preferred) ? preferred : (currencyOptions[0] || 'USD');
        setCurrency(prev => (currencyOptions.includes(prev) ? prev : initial));
    }, [currencyOptions]);

    function onSubmit(e) {
        e.preventDefault();
        const persons = /^\s*\d+\s*$/.test(individuals) ? Number(individuals.trim()) : NaN;
        const price = /^\s*\d+(?:\.\d+)?\s*$/.test(pricePerKg) ? Number(pricePerKg.trim()) : NaN;
        if (!Number.isInteger(persons) || isNaN(price)) {
            setError('error-invalid-input');
            setResult(null);
            return;
        }
        const calc = calculateFitr({ persons, pricePerKg: price });
        if (calc === null) {
            setError('error-invalid-input');
            setResult(null);
            return;
        }
        setError(null);
        setResult({ ...calc, currency });
    }

    const curLabel = currencyDisplayName(currency, lang);

    return (
        <section id="zakat-al-fitr" className="page">
            <h2>{t('fitr-calculator-title')}</h2>
            <p className="section-helper-text">{t('fitr-helper-text')}</p>
            <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="food-price">{t('fitr-food-price-label')}</label>
                    <div className="input-group">
                        <input
                            type="text"
                            inputMode="decimal"
                            id="food-price"
                            value={pricePerKg}
                            onChange={(e) => setPricePerKg(e.target.value)}
                            placeholder={t('fitr-food-price-placeholder')}
                            aria-describedby="food-price-addon"
                        />
                        <span id="food-price-addon" className="input-addon">
                            {curLabel}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="currency">{t('fitr-currency-label')}</label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {currencyOptions.map(code => (
                            <option key={code} value={code}>
                                {currencyDisplayName(code, lang)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="individuals">{t('fitr-individuals-label')}</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        id="individuals"
                        value={individuals}
                        onChange={(e) => setIndividuals(e.target.value)}
                        placeholder={t('fitr-individuals-placeholder')}
                    />
                </div>
                <button type="submit" className="cta-button">{t('button-calculate')}</button>
            </form>

            {error && (
                <ResultCard title={null} plainText={t(error)}>
                    <p className="error">{t(error)}</p>
                </ResultCard>
            )}
            {result && (
                <ResultCard
                    title={t('fitr-result-title')}
                    plainText={
                        `${t('fitr-result-title')}\n` +
                        `${t('fitr-result-weight')} ${formatNumber(result.totalWeightKg)} kg\n` +
                        `${t('fitr-result-value')} ${formatNumber(result.totalValue)} ${currencyDisplayName(result.currency, lang)}`
                    }
                >
                    <p><strong>{t('fitr-result-weight')}</strong> {formatNumber(result.totalWeightKg)} kg</p>
                    <p>
                        <strong>{t('fitr-result-value')}</strong>{' '}
                        <span className="accent-text">{formatNumber(result.totalValue)} {currencyDisplayName(result.currency, lang)}</span>
                    </p>
                </ResultCard>
            )}
        </section>
    );
}
