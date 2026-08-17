import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { calculateFitr } from '../domain/fitr.js';
import { currenciesAvailable, detectUserCurrency, POPULAR_CURRENCIES } from '../utils/currency.js';
import { formatNumber, sanitizeNumericInput } from '../utils/format.js';
import { ResultCard } from '../components/ResultCard.jsx';

const FALLBACK_CURRENCIES = Array.from(new Set([...POPULAR_CURRENCIES.slice(0, 3), 'EGP', 'SAR', 'USD']));

export function FitrView({ rates, onRatesLoadFailed }) {
    const { t } = useI18n();
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
        const persons = parseFloat(individuals);
        const price = parseFloat(pricePerKg);
        if (!Number.isInteger(persons)) {
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

    return (
        <section id="zakat-al-fitr" className="page">
            <h2>{t('fitr-calculator-title')}</h2>
            <p className="section-helper-text">{t('fitr-helper-text')}</p>
            <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="food-price">{t('fitr-food-price-label')}</label>
                    <div className="input-group">
                        <input
                            type="number"
                            id="food-price"
                            step="0.01"
                            min="0"
                            value={pricePerKg}
                            onChange={(e) => setPricePerKg(sanitizeNumericInput(e.target.value))}
                            placeholder={t('fitr-food-price-placeholder')}
                            aria-describedby="food-price-addon"
                        />
                        <span id="food-price-addon" className="input-addon">
                            {currency}
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
                            <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="individuals">{t('fitr-individuals-label')}</label>
                    <input
                        type="number"
                        id="individuals"
                        min="1"
                        step="1"
                        value={individuals}
                        onChange={(e) => setIndividuals(sanitizeNumericInput(e.target.value))}
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
                        `${t('fitr-result-value')} ${formatNumber(result.totalValue)} ${result.currency}`
                    }
                >
                    <p><strong>{t('fitr-result-weight')}</strong> {formatNumber(result.totalWeightKg)} kg</p>
                    <p>
                        <strong>{t('fitr-result-value')}</strong>{' '}
                        <span className="accent-text">{formatNumber(result.totalValue)} {result.currency}</span>
                    </p>
                </ResultCard>
            )}
        </section>
    );
}
