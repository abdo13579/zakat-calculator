# Contract: Calculation Domain API

**Consumers**: calculator views (`FitrView`, `MalView`, `ZuruView`) and the Vitest suite.
Pure functions in `src/domain/` — no I/O, no state, no DOM. Constants are fixed by
Constitution Principle I and MUST NOT change without a documented scholarly basis.

## calculateFitr

```text
calculateFitr({ persons, pricePerKg }) → { totalWeightKg, totalValue }
```

- `persons`: integer ≥ 1 · `pricePerKg`: number ≥ 0
- `totalWeightKg = persons × 3.0`
- `totalValue = totalWeightKg × pricePerKg`
- Currency is a display concern of the view; the function is currency-agnostic.

## calculateMal

```text
calculateMal({ wealth, goldPricePerGramUsd, exchangeRate }) → { nisaab, eligible, zakatDue }
```

- `wealth`: number ≥ 0 (in user's selected currency)
- `goldPricePerGramUsd`: number > 0 (from `services/api.js`, already ÷ 31.1035)
- `exchangeRate`: number > 0 (units of selected currency per 1 USD)
- `nisaab = 85 × goldPricePerGramUsd × exchangeRate` (in selected currency)
- `eligible = wealth ≥ nisaab` (inclusive boundary)
- `zakatDue = eligible ? wealth × 0.025 : 0`

## calculateZuru

```text
calculateZuru({ weightKg, irrigation }) → { eligible, rate, zakatDue }
```

- `weightKg`: number ≥ 0
- `irrigation`: one of `'rainfed' | 'irrigated' | 'mixed'`
- `rate`: `0.10` / `0.05` / `0.075` respectively
- `eligible = weightKg ≥ 600` (inclusive boundary)
- `zakatDue = eligible ? weightKg × rate : 0`

## Error semantics

- Invalid inputs (non-numeric, negative, wrong enum) ⇒ functions return `null`; the view
  renders the translated validation error. Functions never throw for bad user input.

## Test vectors (mandatory Vitest coverage)

| Function | Input | Expected |
|----------|-------|----------|
| fitr | 4 persons, 15/kg | weight 12 kg, value 180 |
| fitr | 1 person, 0/kg | weight 3 kg, value 0 |
| mal | wealth 10000, gold 70/g, rate 1 | nisaab 5950, eligible, due 250 |
| mal | wealth 5950, gold 70/g, rate 1 | nisaab 5950, eligible (boundary), due 148.75 |
| mal | wealth 5949.99, gold 70/g, rate 1 | not eligible, due 0 |
| mal | wealth 50000, gold 70/g, rate 3.25 | nisaab 19337.50, eligible, due 1250 |
| zuru | 599.99, rainfed | not eligible, due 0 |
| zuru | 600, rainfed | eligible (boundary), due 60 |
| zuru | 1000, irrigated | due 50 |
| zuru | 1000, mixed | due 75 |
| any | negative / NaN input | `null` |
