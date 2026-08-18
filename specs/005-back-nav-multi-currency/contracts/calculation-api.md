# Contract: Calculation Domain API (extended for multi-currency)

**Consumers**: `MalView`, the Vitest suite. Pure functions in `src/domain/mal.js` — no I/O, no state, no DOM. Constants fixed by Constitution Principle I.

This contract extends `specs/002-react-migration/contracts/calculation-api.md`. The existing `calculateMal` (single-currency) is **unchanged** and remains the parity reference for the single-entry path (SC-007).

## calculateMal (UNCHANGED — preserved for back-compat)

```text
calculateMal({ wealth, goldPricePerGramUsd, exchangeRate }) → { nisaab, eligible, zakatDue } | null
```

See the original contract in `specs/002-react-migration/contracts/calculation-api.md`. Kept so existing test vectors and the single-currency code path continue to work.

## calculateMalMulti (NEW)

```text
calculateMalMulti({ entries, goldPricePerGramUsd, rates }) → MalMultiResult
```

### Inputs

- `entries`: `Array<{ amount, currency }>` (see `WealthEntry` in data-model.md). May be empty.
- `goldPricePerGramUsd`: number > 0 (from `services/api.js`, already ÷ 31.1035).
- `rates`: `Record<ISOCode, number>` where `rates[code]` = units of `code` per 1 USD (the shape returned by `getCurrencyRates().rates`).

### Conversion rule

For a single entry `{ amount, currency }` with rate `r = rates[currency]` (units of `currency` per 1 USD):

```text
amountUsd = amount / r
```

Because the rate is "currency per USD", dividing the user's amount by the rate yields USD.

### Aggregation

1. **Merge**: group entries by `currency`, summing `amount` per currency. Output: `Array<{ currency, amount }>` (one per distinct currency).
2. **Convert**: for each merged entry, compute `amountUsd = amount / rates[currency]`.
3. **Total**: `totalUsd = Σ amountUsd`.
4. **Nisab**: `nisabUsd = 85 * goldPricePerGramUsd` (rate 1, gold already per-gram USD).
5. **Eligibility**: `eligible = totalUsd >= nisabUsd` (inclusive boundary, matching `calculateMal`).
6. **Zakat due**: `zakatDueUsd = eligible ? totalUsd * 0.025 : 0`.

### Result — success shape

```text
{
  ok: true,
  totalUsd: number,
  nisabUsd: number,
  eligible: boolean,
  zakatDueUsd: number,
  perCurrency: Array<{ currency: string, amount: number, amountUsd: number }>,
  resultCurrency: 'USD'
}
```

### Result — failure shape

```text
{
  ok: false,
  errors: Array<{ index: number, currency: string, key: 'error-invalid-wealth' | 'error-currency-rate' | 'error-api-failed' }>
}
```

Any invalid row (bad amount OR missing/invalid rate) aborts the calculation and returns the failure shape listing every offending row (see R5). The view renders per-row localized errors and displays NO partial result (FR-009).

### Error semantics

- `amount` not a finite number, or `amount < 0` → `key: 'error-invalid-wealth'`.
- `currency` empty, not a string, missing from `rates`, or `rates[currency]` not a positive finite number → `key: 'error-currency-rate'`.
- `goldPricePerGramUsd` not a finite number > 0 → single error `{ index: -1, currency: '', key: 'error-api-failed' }`.
- `rates` not a non-null object → single error `{ index: -1, currency: '', key: 'error-api-failed' }`.
- `entries` empty array → single error `{ index: -1, currency: '', key: 'error-invalid-wealth' }`.
- The function never throws for bad user input (mirrors the existing domain contract).

### Test vectors (mandatory Vitest coverage)

| Case | Inputs | Expected |
|------|--------|----------|
| Single entry, eligible (parity with calculateMal) | `entries=[{amount:10000,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:true, totalUsd:10000, nisabUsd:5950, eligible:true, zakatDueUsd:250, perCurrency=[{currency:'USD',amount:10000,amountUsd:10000}]` |
| Two different currencies | `entries=[{amount:10,currency:'USD'},{amount:10,currency:'EGP'}]`, `gold=70`, `rates={USD:1,EGP:48}` | `ok:true, totalUsd=10 + 10/48 ≈ 10.2083, nisabUsd:5950, eligible:false, zakatDueUsd:0` |
| Same-currency merge | `entries=[{amount:50,currency:'USD'},{amount:30,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:true, totalUsd:80, perCurrency=[{currency:'USD',amount:80,amountUsd:80}]` |
| Zero amount valid | `entries=[{amount:0,currency:'USD'},{amount:100,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:true, totalUsd:100` |
| Below nisab | `entries=[{amount:1000,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:true, eligible:false, zakatDueUsd:0` |
| Boundary at nisab | `entries=[{amount:5950,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:true, eligible:true, zakatDueUsd:148.75` |
| Missing rate | `entries=[{amount:100,currency:'XYZ'}]`, `gold=70`, `rates={USD:1}` | `ok:false, errors=[{index:0,currency:'XYZ',key:'error-currency-rate'}]` |
| Negative amount | `entries=[{amount:-5,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:false, errors=[{index:0,currency:'USD',key:'error-invalid-wealth'}]` |
| Non-finite amount | `entries=[{amount:NaN,currency:'USD'}]`, `gold=70`, `rates={USD:1}` | `ok:false, errors=[{index:0,currency:'USD',key:'error-invalid-wealth'}]` |
| Empty entries | `entries=[]`, `gold=70`, `rates={USD:1}` | `ok:false, errors=[{index:-1,currency:'',key:'error-invalid-wealth'}]` |
| Invalid gold | `entries=[{amount:1000,currency:'USD'}]`, `gold=0`, `rates={USD:1}` | `ok:false, errors=[{index:-1,currency:'',key:'error-api-failed'}]` |
| Invalid rates | `entries=[{amount:1000,currency:'USD'}]`, `gold=70`, `rates=null` | `ok:false, errors=[{index:-1,currency:'',key:'error-api-failed'}]` |
| Multi-row EGP/SAR/USD mix | `entries=[{amount:1000,currency:'EGP'},{amount:500,currency:'SAR'},{amount:200,currency:'USD'}]`, `gold=70`, `rates={USD:1,EGP:48,SAR:3.75}` | `ok:true, totalUsd = 1000/48 + 500/3.75 + 200 ≈ 20.83 + 133.33 + 200 = 354.17, eligible:false vs 5950` |

(Floating-point comparisons use `toBeCloseTo(value, 2)` as in the existing `mal.test.js`.)

## Non-goals

- `calculateMalMulti` does NOT fetch rates or gold; the view passes already-fetched values. This keeps the function pure and testable.
- `calculateMalMulti` does NOT format numbers or translate strings; it returns i18n *keys* for errors, and the view renders localized text via `t(key)`.
- `calculateMalMulti` does NOT handle the result display currency — it is always USD (`resultCurrency: 'USD'`).
