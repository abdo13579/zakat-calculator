# Implementation Plan: Back Navigation & Multi-Currency Zakat Al-Mal

**Branch**: `feature/005-back-nav-multi-currency` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-back-nav-multi-currency/spec.md`

## Summary

Two UX improvements to the existing static React SPA. (1) Restore correct in-app back/forward navigation: today `App.jsx` holds a `view` state with no browser-history integration, so the mobile back button exits the site; we wire view changes to `window.history` (pushState + popstate) without changing the URL, and make the first back press close an open mobile sidebar. (2) Extend Zakat Al-Mal from a single currency entry to multiple cash entries in different currencies: each row is `{ amount, currency }`, all rows are converted to USD via the live rate snapshot, same-currency rows auto-merge, the combined USD total is compared against the USD nisab (85 g gold × gold price per gram in USD), and 2.5% zakat is computed on the eligible combined total — result always displayed in USD. Additionally, every currency code surfaced from the rate source gets a registered Arabic display name, rendered when the UI language is Arabic (ISO code as defensive fallback).

## Technical Context

**Language/Version**: JavaScript (ES2020+), JSX; React 18.3, ReactDOM 18.3.

**Primary Dependencies**: Vite 5.4 (build/dev), `@vitejs/plugin-react` 4.3, Vitest 1.6 (calculation-logic unit tests). Font Awesome via CDN (icons). No new runtime dependency is introduced by this feature.

**Storage**: None server-side. Client-side only: existing `localStorage` keys `zakatcalc_lang` and `zakatcalc_theme` are reused; navigation history is the browser's own `window.history` (session-scoped, not persisted). No new persistence is added.

**Testing**: Vitest, configuration in `vite.config.js` (`environment: 'node'`, `include: ['src/**/__tests__/**/*.test.{js,jsx}']`). Existing pattern: pure domain functions in `src/domain/*.js` tested via `src/domain/__tests__/*.test.js`; i18n catalog parity tested in `src/i18n/__tests__/translations.test.js`. New tests will follow the same pure-function + catalog-parity patterns. UI/navigation behavior is validated via the manual quickstart guide (no DOM/jsdom test runner is currently configured).

**Target Platform**: Static single-page application served from `dist/` on GitHub Pages under base path `/zakat-calculator/`. Supported browsers: current Chrome, Firefox, Safari, Edge (incl. mobile).

**Project Type**: Web app (static SPA).

**Performance Goals**: Calculations remain instant (pure, synchronous, sub-millisecond). Navigation history updates are O(1) `pushState` calls. No animation or rendering performance budgets are introduced.

**Constraints**: Constitution Principle II — no runtime dependency beyond Vite, React, ReactDOM, Vitest; no server component; only the two documented keyless CORS-enabled endpoints (`open.er-api.com/v6/latest/USD`, `mintedmetal.com/api/prices.json`) may be called. Constitution Principle IV — every external fetch must surface a clear error state on failure and never display a silently stale multi-currency result. Constitution Principle V — all computation client-side; no telemetry; no transmission of wealth data.

**Scale/Scope**: 1 new domain function (multi-currency Mal) + extension of `MalView` UI (rows) + 1 new history hook + 1 new currency-name catalog + i18n key additions + minor `Sidebar`/`App` wiring for the sidebar-close-first back behavior. Approximately 4 source files modified/added plus translations and tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Shariah Accuracy First (NON-NEGOTIABLE)** | ✅ Pass | Nisab (85 g gold) and rate (2.5%) are unchanged. Multi-currency change is purely an aggregation of the existing formula: convert each entry to USD using the live rate snapshot, sum, then apply `eligible = totalUsd ≥ (85 × goldPricePerGramUsd)` and `zakatDue = eligible ? totalUsd × 0.025 : 0`. No constant or threshold is altered. Scholarly disclaimer remains visible on MalView. |
| **II. Lean Static SPA Stack** | ✅ Pass | No new runtime or build dependency. Uses existing React + Vite + CSS Modules + Vitest. Uses the two already-documented keyless endpoints. No server component. |
| **III. Full Bilingual and Accessible Experience** | ✅ Pass | Every new user-facing string (row labels, add/remove controls, multi-currency result text, errors) is added to BOTH `en` and `ar` in `translations.js` (parity rule enforced by the existing `translations.test.js`). Arabic RTL layout is preserved. New Arabic currency-name catalog is bilingual. ARIA labels added for new controls. Light/dark themes preserved. |
| **IV. Graceful Degradation of Live Data** | ✅ Pass | Multi-currency conversion depends on a successful rate fetch. On fetch failure or missing rate for a selected currency, the app surfaces a clear localized error and displays NO partial/incorrect result (per FR-009). Loading state shown while fetches are in flight (existing pattern). Fitr/Zuru remain fully offline-functional (unchanged). |
| **V. Client-Side Privacy and Transparency** | ✅ Pass | All aggregation/conversion runs in the browser. No wealth data is transmitted, stored externally, or used for telemetry. The only outbound requests remain the two documented endpoints. Calculation method is openly explainable and is documented in the data model and README update. |

**Gate result**: PASS — no violations. No complexity tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/005-back-nav-multi-currency/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── calculation-api.md   # extended Mal contract (multi-currency)
│   ├── navigation-api.md    # new in-app history contract
│   └── i18n-catalog.md      # currency-name catalog + new keys
└── tasks.md             # /speckit.tasks output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── App.jsx                      # modified: history-driven view state + sidebar-close-first back
├── domain/
│   ├── mal.js                   # extended: new calculateMalMulti() (existing calculateMal kept for parity/back-compat)
│   └── __tests__/
│       └── mal.test.js          # extended: multi-currency vectors, same-currency merge, invalid rows
├── hooks/                       # NEW directory
│   └── useViewHistory.js        # new: encapsulates pushState/popstate, back/forward, sidebar-aware back
├── views/
│   └── MalView.jsx              # modified: dynamic wealth rows, USD result, Arabic currency-name rendering
├── components/
│   ├── Sidebar.jsx              # minor: expose isOpen state to history hook for close-first behavior
│   └── WealthRow.jsx            # NEW: single {amount, currency} row with add/remove controls (CSS Modules sibling)
├── utils/
│   ├── currency.js              # extended: currencyDisplayName(code, lang) using new name catalog
│   └── currencyNames.js         # NEW: ISO code → Arabic name map + accessor
├── i18n/
│   ├── translations.js          # extended: new en/ar keys (rows, controls, multi-currency result, errors, currency names)
│   └── __tests__/
│       └── translations.test.js # extended: assert new keys exist in BOTH en and ar; currency-name parity
└── styles/
    └── (existing tokens/global CSS reused; minor additions for row layout in WealthRow.module.css)
```

**Structure Decision**: Single-project static SPA (the existing layout). Two new files/directories are introduced: `src/hooks/useViewHistory.js` (the navigation history hook) and `src/utils/currencyNames.js` plus `src/components/WealthRow.jsx` (with its CSS Module). Everything else is an extension of existing files. No new top-level project, no backend, no separate frontend/backend split.
