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
