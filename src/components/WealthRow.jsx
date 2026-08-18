import React from 'react';
import styles from './WealthRow.module.css';
import { sanitizeNumericInput } from '../utils/format.js';

/**
 * WealthRow: Single cash amount and currency input row.
 * Contract: specs/005-back-nav-multi-currency/contracts/calculation-api.md
 * Data Model: specs/005-back-nav-multi-currency/data-model.md
 */
export function WealthRow({
    id,
    amountRaw,
    currency,
    currencyOptions = [],
    onChangeAmount,
    onChangeCurrency,
    onRemove,
    canRemove,
    t,
    hasError = false,
    errorMessage = null,
    getCurrencyLabel = (code) => code,
}) {
    return (
        <div className={`${styles.wealthRow} ${hasError ? styles.hasError : ''}`}>
            <div className={styles.rowInputs}>
                <div className={styles.amountField}>
                    <label htmlFor={`amount-${id}`} className={styles.fieldLabel}>
                        {t('mal-wealth-amount-label')}
                    </label>
                    <input
                        type="number"
                        id={`amount-${id}`}
                        step="0.01"
                        min="0"
                        value={amountRaw}
                        onChange={(e) => onChangeAmount(id, sanitizeNumericInput(e.target.value))}
                        placeholder={t('mal-wealth-placeholder')}
                        className={`${styles.input} ${hasError ? styles.inputError : ''}`}
                        aria-invalid={hasError}
                        aria-describedby={hasError && errorMessage ? `error-${id}` : undefined}
                    />
                </div>
                <div className={styles.currencyField}>
                    <label htmlFor={`currency-${id}`} className={styles.fieldLabel}>
                        {t('mal-wealth-currency-label')}
                    </label>
                    <select
                        id={`currency-${id}`}
                        value={currency}
                        onChange={(e) => onChangeCurrency(id, e.target.value)}
                        className={styles.select}
                    >
                        {currencyOptions.map(code => (
                            <option key={code} value={code}>
                                {getCurrencyLabel(code)}
                            </option>
                        ))}
                    </select>
                </div>
                {canRemove && (
                    <div className={styles.actionField}>
                        <button
                            type="button"
                            onClick={() => onRemove(id)}
                            className={styles.removeBtn}
                            title={t('mal-remove-row')}
                            aria-label={`${t('mal-remove-row')} ${currency}`}
                        >
                            <i className="fa-solid fa-trash-can" aria-hidden="true"></i>
                            <span className={styles.removeText}>{t('mal-remove-row')}</span>
                        </button>
                    </div>
                )}
            </div>
            {hasError && errorMessage && (
                <div id={`error-${id}`} className={styles.errorMessage} role="alert">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}
