import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { calculateMal } from '../domain/mal.js';
import { currenciesAvailable, detectUserCurrency, POPULAR_CURRENCIES } from '../utils/currency.js';
import { formatNumber, sanitizeNumericInput } from '../utils/format.js';
import { getCurrencyRates, getGoldPrice } from '../services/api.js';
import { ResultCard } from '../components/ResultCard.jsx';
import styles from './MalView.module.css';

export function MalView({ rates, setRates, onGlobalError }) {
    const { t } = useI18n();
    const [wealth, setWealth] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const available = useMemo(() => currenciesAvailable(rates), [rates]);

    useEffect(() => {
        if (!rates) return;
        const preferred = detectUserCurrency();
        const initial = available.includes(preferred) ? preferred : (available[0] || 'USD');
        setCurrency(prev => (available.includes(prev) ? prev : initial));
    }, [rates, available]);

    async function onSubmit(e) {
        e.preventDefault();
        const wealthNum = parseFloat(wealth);
        if (isNaN(wealthNum) || wealthNum < 0) {
            setError(t('error-invalid-wealth'));
            setResult(null);
            return;
        }
        setLoading(true);
        setResult(null);
        setError(null);

        let ratesToUse = rates;
        try {
            const [goldResult, ratesResult] = await Promise.all([
                getGoldPrice(),
                rates ? Promise.resolve({ rates }) : getCurrencyRates(),
            ]);
            if (ratesResult && ratesResult.rates && !rates) setRates(ratesResult.rates);

            if (!goldResult || !(ratesResult?.rates || rates)) {
                setError(t('error-api-failed'));
                setLoading(false);
                onGlobalError?.(t('error-api-failed'));
                return;
            }
            ratesToUse = ratesResult?.rates || rates;
            const goldPricePerGramUsd = goldResult.price;
            const exchangeRate = ratesToUse[currency];
            if (!exchangeRate) {
                setError(`${t('error-currency-rate')} ${currency}.`);
                setLoading(false);
                return;
            }
            const calc = calculateMal({ wealth: wealthNum, goldPricePerGramUsd, exchangeRate });
            if (calc === null) {
                setError(t('error-invalid-wealth'));
                setLoading(false);
                return;
            }
            setResult({ ...calc, wealth: wealthNum, currency });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(t('error-api-failed'));
            setLoading(false);
            onGlobalError?.(t('error-api-failed'));
        }
    }

    function renderResultBody() {
        if (loading) {
            return (
                <div>
                    <div className={styles.loader}></div>
                    <p>{t('calculating')}</p>
                </div>
            );
        }
        if (error) {
            return <p className="error">{error}</p>;
        }
        if (result) {
            const { nisaab, eligible, zakatDue, wealth: w, currency: cur } = result;
            const aboveHtml = (
                <>
                    <p>{t('mal-result-above')} <strong>{formatNumber(w)} {cur}</strong> {t('mal-result-above-cont')}</p>
                    <p><strong>{t('mal-result-due')}</strong> <span className="accent-text">{formatNumber(zakatDue)} {cur}</span></p>
                </>
            );
            const belowHtml = (
                <p>{t('mal-result-below')} <strong>{formatNumber(w)} {cur}</strong> {t('mal-result-below-cont')}</p>
            );
            const aboveText = `${t('mal-result-above')} ${formatNumber(w)} ${cur} ${t('mal-result-above-cont')}\n${t('mal-result-due')} ${formatNumber(zakatDue)} ${cur}`;
            const belowText = `${t('mal-result-below')} ${formatNumber(w)} ${cur} ${t('mal-result-below-cont')}`;
            return (
                <ResultCard
                    title={t('mal-result-title')}
                    plainText={
                        `${t('mal-result-title')}\n${t('mal-result-nisaab')} ${formatNumber(nisaab)} ${cur}\n` +
                        (eligible ? aboveText : belowText)
                    }
                >
                    <p>{t('mal-result-nisaab')} <br /><strong>{formatNumber(nisaab)} {cur}</strong>.</p>
                    <hr />
                    {eligible ? aboveHtml : belowHtml}
                </ResultCard>
            );
        }
        return null;
    }

    return (
        <section id="zakat-al-mal" className="page">
            <h2>{t('mal-calculator-title')}</h2>
            <p className="section-helper-text">{t('mal-helper-text')}</p>
            <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="wealth">{t('mal-wealth-label')}</label>
                    <input
                        type="number"
                        id="wealth"
                        step="0.01"
                        value={wealth}
                        onChange={(e) => setWealth(sanitizeNumericInput(e.target.value))}
                        placeholder={t('mal-wealth-placeholder')}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mal-currency">{t('mal-currency-label')}</label>
                    <select
                        id="mal-currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        {(rates ? available : POPULAR_CURRENCIES.slice(0, 3)).map(code => (
                            <option key={code} value={code}>{code}</option>
                        ))}
                        {!rates && (
                            <>
                                <option value="EGP">EGP</option>
                                <option value="SAR">SAR</option>
                                <option value="USD">USD</option>
                            </>
                        )}
                    </select>
                </div>
                <button type="submit" className="cta-button" disabled={loading}>
                    {t('button-calculate')}
                </button>
            </form>
            {renderResultBody()}
        </section>
    );
}
