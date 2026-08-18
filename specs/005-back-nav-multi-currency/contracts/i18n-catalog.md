# Contract: i18n Catalog Additions & Currency-Name Catalog (NEW)

**Consumers**: `src/i18n/translations.js`, `src/i18n/__tests__/translations.test.js`, `src/utils/currencyNames.js`, `src/utils/currency.js`, `MalView.jsx`, `WealthRow.jsx`. Extends `specs/002-react-migration/contracts/i18n-contract.md`.

## Catalog parity rule (UNCHANGED, blocking)

Every key in `en` MUST exist in `ar` and vice versa. Reviewers reject any PR where the key sets differ (Constitution Principle III). The existing `translations.test.js` enforces this; it is extended to also cover the new keys below.

## New UI keys (added to both `en` and `ar`)

| Key | `en` | `ar` | Used by |
|-----|------|------|---------|
| `mal-wealth-row-label` | `Wealth Entry` | `إدخال ثروة` | `WealthRow` |
| `mal-wealth-amount-label` | `Amount` | `المبلغ` | `WealthRow` |
| `mal-wealth-currency-label` | `Currency` | `العملة` | `WealthRow` |
| `mal-add-row` | `Add another currency` | `أضف عملة أخرى` | `MalView` |
| `mal-remove-row` | `Remove` | `إزالة` | `WealthRow` |
| `mal-result-currency` | `Result currency` | `عملة النتيجة` | `MalView` (read-only display, always USD) |
| `mal-result-total` | `Combined wealth (converted to USD):` | `إجمالي الثروة (محوّل إلى دولار أمريكي):` | `MalView` |
| `mal-result-breakdown` | `Per-currency breakdown` | `تفصيل حسب العملة` | `MalView` |
| `mal-result-zakat` | `Zakat Due (2.5% of combined total):` | `الزكاة المستحقة (2.5% من الإجمالي):` | `MalView` |
| `mal-result-below-multi` | `Your combined wealth of` | `ثروتك المجمعة البالغة` | `MalView` (below-nisab variant) |
| `mal-result-below-multi-cont` | `has not reached the Nisaab.` | `لم تصل إلى النصاب.` | `MalView` |
| `mal-result-above-multi` | `Your combined wealth of` | `ثروتك المجمعة البالغة` | `MalView` (above-nisab variant) |
| `mal-result-above-multi-cont` | `is above the Nisaab.` | `تتجاوز النصاب.` | `MalView` |
| `error-row-invalid` | `One or more entries are invalid. Please fix the highlighted rows.` | `واحد أو أكثر من الإدخالات غير صالح. يرجى تصحيح الصفوف المظللة.` | `MalView` |

Existing keys reused (NOT redefined): `mal-calculator-title`, `mal-helper-text`, `mal-wealth-label`, `mal-wealth-placeholder`, `mal-currency-label`, `button-calculate`, `calculating`, `mal-result-title`, `mal-result-nisaab`, `mal-result-due`, `error-invalid-wealth`, `error-currency-rate`, `error-api-failed`, `error-rates-load`, plus all existing navigation/theme/footer strings.

## Currency-name catalog (NEW module)

**Location**: `src/utils/currencyNames.js`.

**Shape**:

```text
export const CURRENCY_NAMES_AR = Object.freeze({
  USD: 'دولار أمريكي',
  EGP: 'جنيه مصري',
  SAR: 'ريال سعودي',
  EUR: 'يورو',
  GBP: 'جنيه إسترليني',
  AED: 'درهم إماراتي',
  KWD: 'دينار كويتي',
  QAR: 'ريال قطري',
  BHD: 'دينار بحريني',
  OMR: 'ريال عماني',
  JOD: 'دينار أردني',
  TRY: 'ليرة تركية',
  IDR: 'روبية إندونيسية',
  PKR: 'روبية باكستانية',
  // … full coverage of every ISO code returned by open.er-api.com/v6/latest/USD
});
```

**Coverage rule**: every key present in `POPULAR_CURRENCIES` AND every key the rate API may return under `rates` MUST have an entry in `CURRENCY_NAMES_AR`. The parity test asserts:

1. `POPULAR_CURRENCIES.every(code => CURRENCY_NAMES_AR[code])` — the popular set is fully covered.
2. A documented superset sample (e.g. the codes enumerated in the rate API's known output) is covered. The full enumeration lives in the module itself, which is the source of truth.

**Fallback**: if a code surfaced at runtime is not in `CURRENCY_NAMES_AR` (unexpected gap), the helper returns the ISO code unchanged so the UI never breaks (FR-016). This is a defensive fallback only, not a license to skip entries.

## Display helper (extends `src/utils/currency.js`)

```text
currencyDisplayName(code: string, lang: 'en' | 'ar') → string
```

- If `lang === 'ar'` AND `CURRENCY_NAMES_AR[code]` exists → return the Arabic name.
- Else → return `code` (the ISO code), which is the existing English behavior (FR-017).

The view obtains `lang` from `useI18n()` and passes it to the helper; the helper itself does not read React context, keeping it pure and unit-testable.

## Runtime behavior table (additions to the existing i18n contract)

| Behavior | Contract |
|----------|----------|
| Arabic currency display | When `lang === 'ar'`, `<option>` labels and result displays show `currencyDisplayName(code, 'ar')` (the Arabic name). |
| English currency display | When `lang === 'en'`, displays show `currencyDisplayName(code, 'en')` = the ISO code (unchanged). |
| Defensive fallback | Missing Arabic name → ISO code shown; never an empty string or `undefined`. |
| Direction | `dir="rtl"` when `ar`, `dir="ltr"` when `en"`, unchanged. New rows and breakdowns render correctly in RTL. |
| Theme | New controls render in both light and dark themes (reusing existing tokens). |

## Non-goals

- No new translation keys for individual currency names inside `translations.js` — names live in the dedicated `CURRENCY_NAMES_AR` module to avoid bloating the i18n catalog.
- No dynamic fetching of currency names from any external API (Constitution Principles II and V).
- No change to English currency display.
