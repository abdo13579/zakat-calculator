import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useToast } from '../toast/ToastContext.jsx';
import { calculateMalMulti } from '../domain/mal.js';
import { currenciesAvailable, detectUserCurrency, POPULAR_CURRENCIES, currencyDisplayName } from '../utils/currency.js';
import { formatNumber } from '../utils/format.js';
import { getGoldPrice, getCurrencyRates } from '../services/api.js';
import { ResultCard } from '../components/ResultCard.jsx';
import { WealthRow } from '../components/WealthRow.jsx';
import styles from './MalView.module.css';

export function MalView({ rates, setRates }) {
    const { t, lang } = useI18n();
    const toast = useToast();
    const nextRowIdRef = useRef(1);

    function generateRowId() {
        return `mal-row-${nextRowIdRef.current++}`;
    }

    const available = useMemo(() => currenciesAvailable(rates), [rates]);

    const initialCurrency = useMemo(() => {
        if (!rates) return detectUserCurrency() || 'USD';
        const preferred = detectUserCurrency();
        return available.includes(preferred) ? preferred : (available[0] || 'USD');
    }, [rates, available]);

    const [rows, setRows] = useState(() => [
        { id: 'mal-row-0', amountRaw: '', currency: 'USD' }
    ]);
    const [rowErrors, setRowErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!rates) return;
        setRows(prev => prev.map(r => ({
            ...r,
            currency: available.includes(r.currency) ? r.currency : (available.includes(initialCurrency) ? initialCurrency : 'USD')
        })));
    }, [rates, available, initialCurrency]);

    const currencyOptions = useMemo(() => {
        if (rates && available.length > 0) return available;
        return POPULAR_CURRENCIES;
    }, [rates, available]);

    function handleAddRow() {
        setRows(prev => [
            ...prev,
            { id: generateRowId(), amountRaw: '', currency: initialCurrency || 'USD' }
        ]);
    }

    function handleRemoveRow(id) {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter(r => r.id !== id));
        setRowErrors(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }

    function handleChangeAmount(id, value) {
        setRows(prev => prev.map(r => (r.id === id ? { ...r, amountRaw: value } : r)));
        if (rowErrors[id]) {
            setRowErrors(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
        if (globalError) setGlobalError(null);
    }

    function handleChangeCurrency(id, value) {
        setRows(prev => prev.map(r => (r.id === id ? { ...r, currency: value } : r)));
        if (rowErrors[id]) {
            setRowErrors(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
        if (globalError) setGlobalError(null);
    }

    function getOptionLabel(code) {
        if (typeof currencyDisplayName === 'function') {
            return currencyDisplayName(code, lang);
        }
        return code;
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setGlobalError(null);
        setRowErrors({});

        // Client-side quick check on amounts
        const errors = {};
        const entries = rows.map((r, idx) => {
            const amountNum = parseFloat(r.amountRaw);
            if (isNaN(amountNum) || amountNum < 0) {
                errors[r.id] = t('error-invalid-wealth');
            }
            return {
                id: r.id,
                index: idx,
                amount: amountNum,
                currency: r.currency
            };
        });

        if (Object.keys(errors).length > 0) {
            setRowErrors(errors);
            setGlobalError(t('error-row-invalid'));
            setLoading(false);
            return;
        }

        try {
            const [goldResult, ratesResult] = await Promise.all([
                getGoldPrice(),
                rates ? Promise.resolve({ rates }) : getCurrencyRates(),
            ]);

            if (ratesResult && ratesResult.rates && !rates) {
                setRates(ratesResult.rates);
            }

            const currentRates = ratesResult?.rates || rates;
            if (!goldResult || !currentRates) {
                setGlobalError(t('error-api-failed'));
                setLoading(false);
                toast.error(t('error-api-failed'));
                return;
            }

            const goldPricePerGramUsd = goldResult.price;
            const calc = calculateMalMulti({
                entries,
                goldPricePerGramUsd,
                rates: currentRates
            });

            if (!calc.ok) {
                const newRowErrors = {};
                let hasRowSpecificError = false;
                for (const err of calc.errors) {
                    const rowId = err.id || (err.index >= 0 && rows[err.index] ? rows[err.index].id : null);
                    if (rowId) {
                        newRowErrors[rowId] = err.key === 'error-currency-rate'
                            ? `${t('error-currency-rate')} ${err.currency}.`
                            : t(err.key);
                        hasRowSpecificError = true;
                    }
                }
                setRowErrors(newRowErrors);
                const summaryMsg = hasRowSpecificError
                    ? t('error-row-invalid')
                    : t(calc.errors[0]?.key || 'error-api-failed');
                setGlobalError(summaryMsg);
                setLoading(false);
                toast.error(summaryMsg);
                return;
            }

            setResult(calc);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setGlobalError(t('error-api-failed'));
            setLoading(false);
            toast.error(t('error-api-failed'));
        }
    }

    function renderResultBody() {
        if (loading) {
            return (
                <div className="results-container show">
                    <div className="loader"></div>
                    <p>{t('calculating')}</p>
                </div>
            );
        }

        if (globalError && Object.keys(rowErrors).length === 0) {
            return (
                <ResultCard title={null} plainText={globalError}>
                    <p className="error">{globalError}</p>
                </ResultCard>
            );
        }

        if (result) {
            const { totalUsd, nisabUsd, eligible, zakatDueUsd, perCurrency, resultCurrency } = result;
            const resCurLabel = getOptionLabel(resultCurrency);

            const aboveHtml = (
                <>
                    <p>
                        {t('mal-result-above-multi')} <strong>{formatNumber(totalUsd)} {resCurLabel}</strong> {t('mal-result-above-multi-cont')}
                    </p>
                    <p>
                        <strong>{t('mal-result-zakat')}</strong> <span className="accent-text">{formatNumber(zakatDueUsd)} {resCurLabel}</span>
                    </p>
                </>
            );

            const belowHtml = (
                <p>
                    {t('mal-result-below-multi')} <strong>{formatNumber(totalUsd)} {resCurLabel}</strong> {t('mal-result-below-multi-cont')}
                </p>
            );

            const breakdownLines = perCurrency.map(item =>
                `• ${formatNumber(item.amount)} ${getOptionLabel(item.currency)} ≈ ${formatNumber(item.amountUsd)} ${resCurLabel}`
            ).join('\n');

            const aboveText = `${t('mal-result-above-multi')} ${formatNumber(totalUsd)} ${resCurLabel} ${t('mal-result-above-multi-cont')}\n${t('mal-result-zakat')} ${formatNumber(zakatDueUsd)} ${resCurLabel}`;
            const belowText = `${t('mal-result-below-multi')} ${formatNumber(totalUsd)} ${resCurLabel} ${t('mal-result-below-multi-cont')}`;

            const plainText = [
                t('mal-result-title'),
                `${t('mal-result-nisaab')} ${formatNumber(nisabUsd)} ${resCurLabel}`,
                eligible ? aboveText : belowText,
                t('mal-result-breakdown') + ':',
                breakdownLines
            ].join('\n');

            return (
                <ResultCard
                    title={t('mal-result-title')}
                    plainText={plainText}
                >
                    <p>
                        {t('mal-result-nisaab')} <br />
                        <strong>{formatNumber(nisabUsd)} {resCurLabel}</strong>.
                    </p>
                    <hr />
                    {eligible ? aboveHtml : belowHtml}

                    {perCurrency.length > 0 && (
                        <div className={styles.breakdownSection}>
                            <h4 className={styles.breakdownTitle}>{t('mal-result-breakdown')}</h4>
                            <table className={styles.breakdownTable}>
                                <thead>
                                    <tr>
                                        <th>{t('mal-wealth-currency-label')}</th>
                                        <th>{t('mal-wealth-amount-label')}</th>
                                        <th className={styles.breakdownUsd}>{t('mal-result-currency')} ({resCurLabel})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {perCurrency.map(item => (
                                        <tr key={item.currency}>
                                            <td><strong>{getOptionLabel(item.currency)}</strong></td>
                                            <td>{formatNumber(item.amount)}</td>
                                            <td className={styles.breakdownUsd}>≈ {formatNumber(item.amountUsd)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className={styles.disclaimer}>
                        {t('about-calc-mal-text')}
                    </p>
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
                {globalError && Object.keys(rowErrors).length > 0 && (
                    <div className={styles.errorBanner} role="alert">
                        {globalError}
                    </div>
                )}

                <div className={styles.rowsContainer}>
                    <div className={styles.rowsHeader}>
                        <h3 className={styles.rowsTitle}>{t('mal-wealth-row-label')}</h3>
                    </div>

                    {rows.map((row) => (
                        <WealthRow
                            key={row.id}
                            id={row.id}
                            amountRaw={row.amountRaw}
                            currency={row.currency}
                            currencyOptions={currencyOptions}
                            onChangeAmount={handleChangeAmount}
                            onChangeCurrency={handleChangeCurrency}
                            onRemove={handleRemoveRow}
                            canRemove={rows.length > 1}
                            t={t}
                            hasError={Boolean(rowErrors[row.id])}
                            errorMessage={rowErrors[row.id]}
                            getCurrencyLabel={getOptionLabel}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={handleAddRow}
                        className={styles.addRowBtn}
                    >
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        <span>{t('mal-add-row')}</span>
                    </button>
                </div>

                <button type="submit" className="cta-button" disabled={loading}>
                    {t('button-calculate')}
                </button>
            </form>

            {renderResultBody()}
        </section>
    );
}
