# Phase 1 Data Model: Back Navigation & Multi-Currency Zakat Al-Mal

**Date**: 2026-08-18
**Feature spec**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

This feature has no persistent storage; all entities below are in-memory, session-scoped data structures owned by the React layer and pure domain functions. Field names use camelCase to match the existing codebase.

## Entities

### WealthEntry

A single user input row in the multi-currency Zakat Al-Mal form.

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| `amount` | number | finite, ≥ 0 | User-entered cash amount. 0 is valid (contributes 0). Negative, NaN, Infinity, or empty string → invalid row. |
| `currency` | string | non-empty ISO 4217 code present in the current `rates` map | e.g. `'USD'`, `'EGP'`. Must exist as a key in the rate snapshot or the row is invalid (FR-009). |

**Lifecycle**: created when the user adds a row (default amount `''`, default currency = detected user currency or `'USD'`); mutated as the user types/selects; removed when the user clicks remove (at least one row always remains — FR-007). Before calculation, entries sharing the same `currency` are merged into a single per-currency sum (FR-006).

### WealthEntryInput (form state)

The string-form counterpart held by the view for controlled inputs.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Stable unique id for React keying (e.g. `crypto.randomUUID()` or an incrementing counter). Not part of the calculation. |
| `amountRaw` | string | Raw input value, sanitized via existing `sanitizeNumericInput`. Parsed to a number at calculation time. |
| `currency` | string | ISO code as selected in the row's `<select>`. |

### RateSnapshot

The live exchange-rate object returned by `services/api.js → getCurrencyRates()`, unchanged in shape.

| Field | Type | Notes |
|-------|------|-------|
| `rates` | `Record<ISOCode, number>` | `rates[code]` = units of `code` per 1 USD (the API's base is USD). |
| `timestamp` | number \| null | Unix seconds of the rate update, for display only. |

**Invariant used by calculation**: a single snapshot is used for all entries in one calculation (no mixing of timestamps). If `rates` is null or fetch fails, NO multi-currency result is displayed (FR-009).

### MalMultiResult

Output of `calculateMalMulti`.

**Success shape**:

| Field | Type | Notes |
|-------|------|-------|
| `ok` | `true` | Always `true` on success. |
| `totalUsd` | number | Sum of all valid entries converted to USD. |
| `nisabUsd` | number | `85 * goldPricePerGramUsd`. |
| `eligible` | boolean | `totalUsd >= nisabUsd` (inclusive boundary, matching existing `calculateMal`). |
| `zakatDueUsd` | number | `eligible ? totalUsd * 0.025 : 0`. |
| `perCurrency` | `Array<{ currency, amount, amountUsd }>` | The merged per-currency breakdown, for transparent display. Length = number of distinct currencies after merge. |
| `resultCurrency` | `'USD'` | Fixed per the user's clarified decision. |

**Failure shape** (any invalid row or missing rate):

| Field | Type | Notes |
|-------|------|-------|
| `ok` | `false` | |
| `errors` | `Array<{ id?: string, index: number, currency: string, key: 'error-invalid-wealth' \| 'error-currency-rate' \| 'error-api-failed' }>` | Per-row localized error keys. `index` is the row position in the submitted entries; `id` is echoed when supplied so the view can attach the error to the correct row. The `error-api-failed` key is used for invalid gold price or rates input. |

**Pure-function semantics**: `calculateMalMulti` is deterministic, has no I/O, no state, no DOM, never throws for bad user input — mirrors the existing domain contract. Invalid inputs produce the failure shape; unexpected internal states (e.g. `goldPricePerGramUsd <= 0`, `rates` not an object) also produce the failure shape with a generic `'error-api-failed'` key.

### ViewHistoryEntry

In-app navigation history state (not persisted; lives in `window.history` state).

| Field | Type | Notes |
|-------|------|-------|
| `view` | string | One of the existing view ids: `'landing' \| 'fitr' \| 'mal' \| 'zuru' \| 'anaam' \| 'about'`. |
| `sidebar` | boolean (optional) | `true` for the sentinel entry pushed when the sidebar opens (R4). Absent/`false` for normal view entries. |

### CurrencyDisplayName

Not an entity per se but a derived value: `currencyDisplayName(code, lang) → string`. Returns the Arabic name from `CURRENCY_NAMES_AR[code]` when `lang === 'ar'` and a name exists; otherwise returns `code` (ISO). See contracts/i18n-catalog.md.

## State transitions

### Multi-currency form

```text
[empty form: 1 row, amountRaw '', currency = detected] 
  --user types amount--> [row.amountRaw = string]
  --user changes currency--> [row.currency = code]
  --user clicks "Add row"--> [form.rows.length + 1, new row default]
  --user clicks "Remove row" (length > 1)--> [form.rows.length - 1]
  --user clicks "Calculate"-->
      parse rows → WealthEntry[] 
      → merge same-currency entries 
      → calculateMalMulti({ entries, goldPricePerGramUsd, rates })
      → MalMultiResult 
      → render (success: total/nisab/zakat in USD + per-currency breakdown; failure: per-row errors)
  --rate fetch failure--> render error-api-failed, NO result (FR-009)
```

### Navigation history

```text
[initial: view = 'landing', history length = 1 (page load)]
  --user navigates to 'mal'--> pushState({view:'mal'}) ; view = 'mal'
  --user navigates to 'about'--> pushState({view:'about'}) ; view = 'about'
  --user opens sidebar--> pushState({view:'about', sidebar:true}) sentinel
  --user presses back while sidebar open--> popstate fires; isSidebarOpen === true → close sidebar first, view unchanged (sentinel consumed)
  --user presses back again--> popstate fires; state.view = 'mal' → view = 'mal' (this is the activated entry after the close)
  --user presses back again--> popstate fires; state.view = 'landing' (or no state) → view = 'landing'
  --user presses forward--> popstate fires; state.view = 'about' → view = 'about'
  --user presses forward again--> popstate fires; state.sidebar === true → reopen sidebar, view unchanged
  --sidebar closed manually (click-away / item select)--> history.back() to pop sentinel
```

## Validation rules summary

- **Amount**: `Number.isFinite(amount) && amount >= 0`. Empty/whitespace, negative, NaN, Infinity → invalid (`error-invalid-wealth`).
- **Currency**: non-empty string AND `Object.prototype.hasOwnProperty.call(rates, currency)` AND `typeof rates[currency] === 'number' && rates[currency] > 0`. Otherwise invalid (`error-currency-rate`).
- **Gold price**: `goldPricePerGramUsd` must be a finite number > 0, otherwise the whole calculation fails with `error-api-failed` (mirrors existing `calculateMal` guard).
- **Rates**: must be a non-null object; otherwise `error-api-failed`.
- **Rows**: at least one row must be present in the form (UI enforces); an empty rows array to `calculateMalMulti` returns `{ ok: false, errors: [{ index: -1, key: 'error-invalid-wealth' }] }`.

## Constants (unchanged, Constitution Principle I)

- Gold nisab mass: **85 grams**.
- Zakat rate on eligible wealth: **2.5%** (0.025).
- Gold price source: `mintedmetal.com/api/prices.json`, ounce → gram conversion factor **31.1035** (already applied in `services/api.js`).
- Common currency for multi-currency aggregation: **USD** (matches rate API base).
