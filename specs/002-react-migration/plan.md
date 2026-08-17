# Implementation Plan: React Migration with Feature & Visual Parity

**Branch**: `002-react-migration` | **Date**: 2026-08-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-react-migration/spec.md`

## Summary

Rebuild ZakatCalc as a Vite + React (JSX) + CSS Modules static SPA with exact feature and
visual parity to the legacy vanilla app. Calculation logic moves into pure domain modules
(`src/domain/`) guarded by Vitest tests asserting the README formulas and Nisaab boundaries;
the custom i18n and theme behavior of the legacy app (localStorage keys, Arabic default, RTL
switching, fallback chain) is replicated exactly via React Context; navigation remains
state-driven; the two keyless public APIs are consumed through a ported service module with the
same null-on-failure contract; the build deploys manually to GitHub Pages under the
`/zakat-calculator/` base path. No design changes, no new features, no extra dependencies.

## Technical Context

**Language/Version**: JavaScript (ES2022+) with JSX; Node.js LTS for build tooling only

**Primary Dependencies**: Vite, React, ReactDOM, Vitest — the exact set permitted by
Constitution Principle II; any addition requires written justification in the PR

**Storage**: `localStorage` only — keys `zakatcalc_lang` and `zakatcalc_theme` (parity with
legacy); no backend, no cookies, no analytics

**Testing**: Vitest (node environment) for pure calculation/domain modules; no component-test
library in this phase

**Target Platform**: static site on GitHub Pages (`/zakat-calculator/` sub-path); current
Chrome, Firefox, Safari, Edge

**Project Type**: web (static single-page application)

**Performance Goals**: no regression vs. the legacy static app (instant load from static
output, calculations are O(1) pure functions)

**Constraints**: base path `/zakat-calculator/`; static hosting only, no server component; only
the two documented keyless CORS-enabled endpoints (`open.er-api.com`, `mintedmetal.com`); full
EN/AR parity with RTL; manual publish to `gh-pages` branch

**Scale/Scope**: 3 calculators, 5 views (landing, Fitr, Mal, Zuru, about), ~59 translation keys
× 2 languages, port of legacy `js/app.js` (~33 KB) and `css/style.css` (~12 KB)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution **v2.0.0** (merged on `main`, PR #2):

| Gate | Result | Evidence in this plan |
|------|--------|-----------------------|
| I. Shariah Accuracy First | PASS | Constants ported verbatim into pure modules; Vitest tests assert README formulas and inclusive Nisaab boundaries (see `contracts/calculation-api.md` test vectors); disclaimer retained in About view and README |
| II. Lean Static SPA Stack | PASS | Exactly Vite + React + CSS Modules + Vitest; no other dependency (manual deploy via `git subtree`, zero added packages — research D6); static output, no server |
| III. Full Bilingual and Accessible Experience | PASS | i18n contract (`contracts/i18n-contract.md`) mandates EN/AR key parity, RTL via `dir` on html+body, semantic/ARIA markup ported from legacy, keyboard-operable controls, both themes |
| IV. Graceful Degradation of Live Data | PASS | API service port keeps the null-on-failure contract and loading/error states (`contracts/external-apis.md`); Fitr/Zuru need no network |
| V. Client-Side Privacy and Transparency | PASS | All computation client-side; only the two documented endpoints; no user data transmitted or stored beyond localStorage prefs |
| Workflow gates | PASS | Plan includes Vitest suite as merge gate and the manual bilingual/RTL/theme/known-input checklist (quickstart.md) |

**Gate result**: PASS — no violations; Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-react-migration/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — migration decisions D1–D7
├── data-model.md        # Phase 1 output — app entities and state
├── quickstart.md        # Phase 1 output — validation guide
├── contracts/           # Phase 1 output
│   ├── calculation-api.md   # pure domain function contracts + test vectors
│   ├── external-apis.md     # public endpoint consumption contracts
│   └── i18n-contract.md     # translation catalog & language behavior contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit.specify)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
├── index.html                  # Vite entry (replaces legacy page; CDN fonts/icons kept)
├── vite.config.js              # base: '/zakat-calculator/'
├── package.json
├── public/                     # favicon.svg, img.png
├── legacy/                     # TEMPORARY: legacy index.html/js/css for local parity
│   └── ...                     #   comparison; deleted at parity sign-off (FR-010)
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # state-driven view switching (landing/fitr/mal/zuru/about)
    ├── i18n/
    │   ├── I18nContext.jsx     # lang state, t(), dir sync, persistence
    │   └── translations.js     # { en: {...}, ar: {...} } — ~59 keys each
    ├── theme/
    │   └── ThemeContext.jsx    # dark/light + localStorage persistence
    ├── services/
    │   └── api.js              # getCurrencyRates(), getGoldPrice() — ported 1:1
    ├── domain/
    │   ├── fitr.js             # calculateFitr (pure)
    │   ├── mal.js              # calculateMal (pure)
    │   └── zuru.js             # calculateZuru (pure)
    ├── domain/__tests__/       # Vitest: fitr.test.js, mal.test.js, zuru.test.js
    ├── components/             # Header, Sidebar, Footer, ResultCard, FormField, ...
    ├── views/                  # LandingView, FitrView, MalView, ZuruView, AboutView
    └── styles/
        ├── tokens.css          # CSS custom properties (colors, both themes)
        └── global.css          # resets, layout shell; per-component *.module.css colocated
```

**Structure Decision**: Single project, in-place scaffold at repository root (research D1).
Legacy sources move to `legacy/` for local side-by-side comparison during development and are
deleted at parity sign-off before merge (FR-010). The deployed parity baseline remains the live
site (`https://abdo13579.github.io/zakat-calculator/`), served from `main`.

## Complexity Tracking

> No Constitution Check violations — section intentionally left empty.
