# Data Model: React Migration with Feature & Visual Parity

**Phase 1 output** — entities from the feature spec, with validation rules and state
transitions. All data is client-side; nothing leaves the browser except the two documented
public API calls (Constitution Principle V).

## Entity: Calculator

One of three Zakat tools. Behavior contracts are defined in
[contracts/calculation-api.md](contracts/calculation-api.md).

| Variant | Inputs | Constants (Principle I, verbatim) | Nisaab | Network required |
|---------|--------|-----------------------------------|--------|------------------|
| Fitr | persons (int ≥ 1), pricePerKg (≥ 0), currency | 3.0 kg/person | none | no |
| Mal | wealth (≥ 0), currency | 85 g gold, 2.5% rate, oz→g ÷ 31.1035 | 85 g × live gold price, converted | yes |
| Zuru | weightKg (≥ 0), irrigation type | 600 kg Nisaab; rates rainfed 0.10, irrigated 0.05, mixed 0.075 | 600 kg (inclusive) | no |

**Validation rules**

- Nisaab comparisons are inclusive (wealth ≥ Nisaab ⇒ Zakat due; weight ≥ 600 ⇒ due).
- Non-numeric, negative, or empty inputs are rejected with a translated error message.
- Mal results are computed only after BOTH market data values load successfully.

## Entity: TranslationCatalog

Full contract in [contracts/i18n-contract.md](contracts/i18n-contract.md).

| Field | Rule |
|-------|------|
| languages | exactly `en` and `ar` |
| keys | identical key sets in both languages (parity rule); baseline ~59 keys extracted from legacy `index.html` `data-i18n` attributes plus dynamic strings in `js/app.js` |
| fallback | `translations[lang]?.[key] || translations.en[key] || key` |
| persistence | `localStorage['zakatcalc_lang']`; values `en`/`ar`; **default `ar`** |
| direction | `dir` set to `rtl` (ar) / `ltr` (en) on both `html` and `body` |

## Entity: ThemePreference

| Field | Rule |
|-------|------|
| values | `dark` or `light` |
| persistence | `localStorage['zakatcalc_theme']` |
| application | CSS custom-property theme variables, same variable names/values as legacy |

**State transition**: `light ⇄ dark` via header toggle; every transition persists immediately
and applies without reload.

## Entity: MarketData

Live financial data consumed by the Mal calculator only.

| Field | Source | Rule |
|-------|--------|------|
| rates | `open.er-api.com/v6/latest/USD` → `data.rates` | used to convert USD-denominated Nisaab into the selected currency |
| ratesTimestamp | `data.time_last_update_unix` | informational |
| goldPricePerGramUsd | `mintedmetal.com/api/prices.json` → `data.metals.gold.price ÷ 31.1035` | per-ounce price converted to per-gram |
| goldTimestamp | `data.updatedAt` | informational |

**Lifecycle (state machine)**:

```text
idle → loading → success → (results computed)
             ↘ error → translated user-visible error; no result rendered
```

- Any fetch failure ⇒ `error` state ⇒ clear message; the app never crashes and never shows a
  stale result as if fresh (Constitution Principle IV).
- Data is fetched on calculation demand; it is not persisted across sessions.

## Entity: AppView (navigation)

| Field | Rule |
|-------|------|
| values | `landing`, `fitr`, `mal`, `zuru`, `about` |
| transitions | landing card → calculator view; header/sidebar nav → any view; back → landing |
| mechanism | React state only — no router, no URL routes (interview decision; GitHub Pages safe) |
| responsive | sidebar/hamburger behavior matches legacy at mobile widths |
