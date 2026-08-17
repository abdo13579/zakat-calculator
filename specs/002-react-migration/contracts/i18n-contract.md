# Contract: i18n Catalog & Language Behavior

**Consumers**: `src/i18n/I18nContext.jsx`, all views/components. This contract freezes the
legacy behaviors extracted from `js/app.js` so parity is objectively verifiable.

## Catalog shape

```text
src/i18n/translations.js → { en: { [key]: string }, ar: { [key]: string } }
```

- **Parity rule (blocking)**: every key MUST exist in BOTH `en` and `ar`. Reviewers reject any
  PR where the key sets differ (Constitution Principle III).
- **Baseline**: the ~59 keys referenced by `data-i18n` attributes in legacy `index.html`, plus
  all dynamic strings in `js/app.js` (placeholders, select options, notifications, results).
- Keys keep legacy names (e.g. `about-calc-zuru-text`) so the mapping is auditable 1:1.

## Runtime behavior (parity with legacy `js/app.js`)

| Behavior | Contract |
|----------|----------|
| Default language | **`ar`** (when `localStorage['zakatcalc_lang']` is unset) |
| Persistence | every toggle writes `zakatcalc_lang` = `'en'` or `'ar'` |
| Direction | `dir="rtl"` when `ar`, `dir="ltr"` when `en`, set on BOTH `<html>` and `<body>` |
| Lookup fallback | `translations[lang]?.[key]` → `translations.en[key]` → the raw key itself |
| Toggle | one click switches language and applies to ALL visible strings immediately |
| Placeholders | input placeholders are translated (legacy `data-i18n-placeholder` equivalents) |
| Select options | `<option>` labels are translated |

## Theme (companion behavior, same parity requirement)

| Behavior | Contract |
|----------|----------|
| Values | `'dark'` / `'light'` in `localStorage['zakatcalc_theme']` |
| Application | legacy CSS custom-property theme variables, unchanged names/values |
| Toggle | applies instantly and persists without reload |
