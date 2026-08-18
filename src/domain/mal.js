// calculateMal: pure, contract-driven.
// Contract: specs/002-react-migration/contracts/calculation-api.md
// Inputs:
//   wealth:                 number ≥ 0 (user-selected currency)
//   goldPricePerGramUsd:    number > 0 (already per-gram, ÷ 31.1035 applied upstream)
//   exchangeRate:           number > 0 (units of selected currency per 1 USD)

export function calculateMal({ wealth, goldPricePerGramUsd, exchangeRate }) {
    if (
        typeof wealth !== 'number' || !Number.isFinite(wealth) ||
        typeof goldPricePerGramUsd !== 'number' || !Number.isFinite(goldPricePerGramUsd) ||
        typeof exchangeRate !== 'number' || !Number.isFinite(exchangeRate) ||
        wealth < 0 || goldPricePerGramUsd <= 0 || exchangeRate <= 0
    ) return null;

    const nisaab = 85 * goldPricePerGramUsd * exchangeRate;
    const eligible = wealth >= nisaab;
    const zakatDue = eligible ? wealth * 0.025 : 0;
    return { nisaab, eligible, zakatDue };
}

/**
 * calculateMalMulti: Multi-currency Zakat Al-Mal calculation.
 * Contract: specs/005-back-nav-multi-currency/contracts/calculation-api.md
 * Data Model: specs/005-back-nav-multi-currency/data-model.md
 */
export function calculateMalMulti({ entries, goldPricePerGramUsd, rates }) {
    if (typeof goldPricePerGramUsd !== 'number' || !Number.isFinite(goldPricePerGramUsd) || goldPricePerGramUsd <= 0) {
        return {
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-api-failed' }]
        };
    }

    if (!rates || typeof rates !== 'object') {
        return {
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-api-failed' }]
        };
    }

    if (!Array.isArray(entries) || entries.length === 0) {
        return {
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-invalid-wealth' }]
        };
    }

    const errors = [];
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const errorObj = { index: i, currency: entry && typeof entry.currency === 'string' ? entry.currency : '' };
        if (entry && entry.id) {
            errorObj.id = entry.id;
        }

        if (!entry || typeof entry.amount !== 'number' || !Number.isFinite(entry.amount) || entry.amount < 0) {
            errorObj.key = 'error-invalid-wealth';
            errors.push(errorObj);
            continue;
        }

        if (
            typeof entry.currency !== 'string' ||
            entry.currency.trim() === '' ||
            !Object.prototype.hasOwnProperty.call(rates, entry.currency) ||
            typeof rates[entry.currency] !== 'number' ||
            !Number.isFinite(rates[entry.currency]) ||
            rates[entry.currency] <= 0
        ) {
            errorObj.key = 'error-currency-rate';
            errors.push(errorObj);
            continue;
        }
    }

    if (errors.length > 0) {
        return {
            ok: false,
            errors
        };
    }

    // Merge entries by currency
    const mergedMap = new Map();
    for (const entry of entries) {
        const current = mergedMap.get(entry.currency) || 0;
        const merged = current + entry.amount;
        if (!Number.isFinite(merged)) {
            return {
                ok: false,
                errors: [{ index: -1, currency: entry.currency, key: 'error-api-failed' }]
            };
        }
        mergedMap.set(entry.currency, merged);
    }

    const perCurrency = [];
    let totalUsd = 0;
    for (const [currency, amount] of mergedMap.entries()) {
        const rate = rates[currency];
        const amountUsd = amount / rate;
        if (!Number.isFinite(amountUsd)) {
            return {
                ok: false,
                errors: [{ index: -1, currency, key: 'error-api-failed' }]
            };
        }
        totalUsd += amountUsd;
        if (!Number.isFinite(totalUsd)) {
            return {
                ok: false,
                errors: [{ index: -1, currency, key: 'error-api-failed' }]
            };
        }
        perCurrency.push({
            currency,
            amount,
            amountUsd
        });
    }

    const nisabUsd = 85 * goldPricePerGramUsd;
    const eligible = totalUsd >= nisabUsd;
    const zakatDueUsd = eligible ? totalUsd * 0.025 : 0;

    return {
        ok: true,
        totalUsd,
        nisabUsd,
        eligible,
        zakatDueUsd,
        perCurrency,
        resultCurrency: 'USD'
    };
}

