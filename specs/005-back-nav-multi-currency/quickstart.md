# Quickstart Validation Guide: Back Navigation & Multi-Currency Zakat Al-Mal

**Date**: 2026-08-18 · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

This guide describes runnable validation scenarios that prove the feature works end-to-end. It is a manual validation/run guide; implementation details belong in `tasks.md`.

## Prerequisites

- Node.js and npm installed (existing project setup).
- The repository checked out on branch `feature/005-back-nav-multi-currency`.
- Network access is required for the live data scenarios (the rate and gold endpoints). Offline scenarios are also covered below.
- A mobile browser (or desktop browser with mobile viewport + device back button simulation) for the navigation scenarios. Chrome DevTools device mode is sufficient for most scenarios; a physical mobile device is best for the device-back-button scenario.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173/zakat-calculator/`). The app loads on the landing view, in its default language (Arabic) and default theme.

## Automated tests (calculation logic + i18n parity)

```bash
npm test
```

Expected: all Vitest tests pass, including:

- Existing `src/domain/__tests__/mal.test.js` vectors for `calculateMal` (unchanged — back-compat, SC-007).
- New `src/domain/__tests__/mal.test.js` vectors for `calculateMalMulti`:
  - single-entry parity with `calculateMal`,
  - two different currencies,
  - same-currency merge,
  - zero amount,
  - below-nisab and boundary-at-nisab,
  - missing rate, negative amount, non-finite amount, empty entries, invalid gold, invalid rates,
  - a multi-row EGP/SAR/USD mix (see contracts/calculation-api.md).
- `src/i18n/__tests__/translations.test.js`:
  - existing en/ar key-set parity,
  - all new UI keys exist in BOTH `en` and `ar`,
  - `POPULAR_CURRENCIES.every(code => CURRENCY_NAMES_AR[code])`.

See [contracts/calculation-api.md](./contracts/calculation-api.md) and [contracts/i18n-catalog.md](./contracts/i18n-catalog.md) for the authoritative vectors and rules.

## Manual validation scenarios

### Scenario A — Multi-currency zakat calculation (primary, P1)

1. From the landing page, navigate to **Zakat Al-Mal**.
2. The form shows one wealth row (amount + currency). Add a second row via **Add another currency**.
3. Enter `10` in the first row with currency `USD`, and `10` in the second row with currency `EGP`.
4. Click **Calculate**.
5. **Expected**: a single result card is shown with:
   - the combined wealth total **converted to USD** (≈ 10 + 10/`rate_EGP` ),
   - the nisab in USD (85 × current gold price per gram),
   - eligibility (almost certainly **below nisab** for these small amounts),
   - zakat due = 0 (below nisab) OR 2.5% of the combined total if above,
   - a per-currency breakdown listing each currency's amount and USD equivalent.
6. **Pass criterion**: the user performed NO manual conversion; the app produced one combined result in USD. (SC-001, SC-002, FR-001 through FR-005.)

### Scenario B — Same-currency auto-merge

1. On Zakat Al-Mal, add two rows both with currency `USD`.
2. Enter `50` in the first and `30` in the second.
3. Calculate.
4. **Expected**: the per-currency breakdown shows a single `USD` entry with amount `80` (not two separate USD rows). (FR-006.)

### Scenario C — Add and remove rows

1. Add three rows with three different currencies.
2. Remove the middle row.
3. Calculate.
4. **Expected**: only the two remaining rows contribute to the total. Attempting to remove the last remaining row is prevented by the UI. (FR-007, edge case "removing rows".)

### Scenario D — Invalid input feedback

1. Enter a negative amount (e.g. `-5`) in one row and a valid amount in another.
2. Calculate.
3. **Expected**: no result card with a partial total; instead, a localized error message appears and the offending row is highlighted. The error text matches `error-invalid-wealth` (or `error-row-invalid` summary). (FR-008, R5.)

### Scenario E — Missing currency rate

1. (Simulated) Block or alter the rate response so a selected currency is absent from `rates`.
2. Calculate with that currency selected in a row.
3. **Expected**: no partial result; a localized `error-currency-rate` error is shown for that row. (FR-009, edge case.)

### Scenario F — Rate fetch failure (offline)

1. Open DevTools → Network → Offline.
2. Reload Zakat Al-Mal and click Calculate.
3. **Expected**: a localized `error-api-failed` (or `error-rates-load`) error; NO silently stale or partial multi-currency result. (FR-009, Constitution Principle IV.)

### Scenario G — Back button navigates instead of exiting (P1)

1. From the landing page, navigate to **Zakat Al-Fitr** (or any calculator).
2. Press the browser back button (or device back on mobile).
3. **Expected**: the app returns to the landing page — it does NOT exit the site. (FR-010, SC-003.)
4. Press the browser forward button.
5. **Expected**: the app returns to the calculator you left. (FR-011.)
6. Navigate landing → Fitr → Mal → About, then press back three times.
7. **Expected**: the app returns through Mal → Fitr → landing in that order. (Acceptance scenario 2 of US2.)

### Scenario H — Sidebar close-first on back (P2)

1. On a mobile viewport (or device), open the sidebar drawer via the hamburger button.
2. Press the back button once.
3. **Expected**: the sidebar closes; the current page does NOT change. (FR-014, SC-004.)
4. Press back again.
5. **Expected**: normal navigation to the previous view occurs.

### Scenario I — Arabic currency names (P2)

1. Switch the app language to **Arabic** (default).
2. Navigate to Zakat Al-Mal and open a row's currency selector.
3. **Expected**: every listed currency is shown by its Arabic name (e.g. `جنيه مصري` instead of `EGP`, `دولار أمريكي` instead of `USD`, `ريال سعودي` instead of `SAR`). (FR-015, FR-016, SC-005.)
4. Perform a calculation and inspect the result.
5. **Expected**: the result currency (USD) is rendered by its Arabic name in the result card.
6. Switch language to **English**.
7. **Expected**: currency selectors and results revert to ISO codes (`USD`, `EGP`, `SAR`...). (FR-017.)

### Scenario J — Backward compatibility (single currency)

1. On Zakat Al-Mal, leave a single row, enter an amount in USD, and calculate.
2. **Expected**: the result matches the previous single-currency behavior (USD total, USD nisab, USD zakat due). (SC-007.)

### Scenario K — Bilingual + theme parity

1. Repeat Scenarios A, G, and I in BOTH Arabic (RTL) and English (LTR), and in BOTH light and dark themes.
2. **Expected**: all new labels, row controls, result text, and errors render correctly in every combination; RTL layout is correct for Arabic; themes apply to new controls. (FR-018, SC-006.)

## Build verification

```bash
npm run build
npm run preview
```

**Expected**: the production build succeeds, the preview serves the app under the configured base path, and Scenario A and Scenario G work against the built output. (Constitution Principle II — static SPA, no server component.)

## Done criteria (mapping to spec success criteria)

| Scenario | Validates |
|----------|-----------|
| A, B, C, D, E, F, J | SC-001, SC-002, SC-007; FR-001..FR-009, FR-021 |
| G, H | SC-003, SC-004; FR-010..FR-014 |
| I, K | SC-005, SC-006; FR-015..FR-018 |
| automated `npm test` | SC-002 (calculation accuracy), i18n parity (Principle III) |
| `npm run build` | Constitution Principle II (lean static SPA) |
