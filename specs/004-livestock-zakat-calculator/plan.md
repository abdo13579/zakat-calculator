# Implementation Plan: Zakat Al-Anaam (Livestock) Calculator

**Branch**: `feature/004-livestock-zakat-calculator` | **Date**: 2026-08-18 | **Spec**: [spec.md](file:///home/abdoalhythm/Documents/Projects/zakat-calculator/specs/004-livestock-zakat-calculator/spec.md)

**Input**: Feature specification from `/specs/004-livestock-zakat-calculator/spec.md`

## Summary

Add a dedicated, guided Zakat Al-Anaam (Livestock) calculator supporting the three Shariah-defined livestock categories: Camels (*Ibil*), Cattle & Water Buffalo (*Baqar*), and Sheep & Goats (*Ghanam*). The feature delivers a pure mathematical domain calculation module (`src/domain/anaam.js`) with comprehensive boundary and waqs decomposition logic, unit tests in Vitest, an interactive bilingual React view (`src/views/AnaamView.jsx`) with eligibility checks and live results, and integration into the landing page, header, and sidebar navigation.

## Technical Context

**Language/Version**: JavaScript (ES2022 / Node.js 18+)  
**Primary Dependencies**: React 18, Vite, CSS Modules (No external component or state libraries)  
**Storage**: Client-side state only (React `useState`, optional localStorage for UI preferences)  
**Testing**: Vitest (`npm test`)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge); static deployment on GitHub Pages  
**Project Type**: Static Single-Page Web Application (SPA)  
**Performance Goals**: Instant client-side calculation (< 5ms), zero network overhead  
**Constraints**: 100% offline-capable, zero external data collection, strict bilingual parity (English & Arabic with RTL), full keyboard & screen reader accessibility  
**Scale/Scope**: 1 new domain module, 1 new view component, 1 test suite, updates to App/Header/Sidebar/LandingView/translations  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I: Shariah Accuracy First**
  - Status: **PASS**
  - Rationale: All calculation schedules (camel brackets up to 120, >120 waqs decomposition $50x + 40y$, cattle brackets and $\ge 130$ decomposition $40y + 30x$, sheep/goat brackets and $\ge 400$ rate) are encoded verbatim from mainstream Sunni fiqh consensus with full boundary test vectors. Disclaimer and fiqh explanations are preserved.
- **Principle II: Lean Static SPA Stack**
  - Status: **PASS**
  - Rationale: Implemented purely using existing React + CSS Modules + Vitest setup. Zero new runtime or build dependencies added.
- **Principle III: Full Bilingual and Accessible Experience**
  - Status: **PASS**
  - Rationale: Every user-facing term and description has full English and Arabic translations in `src/i18n/translations.js`. Semantic HTML, ARIA labels, and RTL CSS logical properties are used.
- **Principle IV: Graceful Degradation of Live Data**
  - Status: **PASS**
  - Rationale: Zakat Al-Anaam requires no live market prices and operates 100% offline.
- **Principle V: Client-Side Privacy and Transparency**
  - Status: **PASS**
  - Rationale: Zero telemetry or network transmission. All herd figures remain strictly local in the browser.

## Project Structure

### Documentation (this feature)

```text
specs/004-livestock-zakat-calculator/
├── plan.md              # This file (/speckit-plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── calculation-api.md
│   └── i18n-anaam-contract.md
├── checklists/
│   └── requirements.md
├── spec.md
└── tasks.md             # Phase 2 output (/speckit-tasks output)
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── anaam.js                    # [NEW] Pure calculation and eligibility functions for livestock
│   └── __tests__/
│       └── anaam.test.js            # [NEW] Vitest suite for all bracket boundaries, waqs, worked examples
├── views/
│   ├── AnaamView.jsx               # [NEW] Livestock calculator view with species selector & eligibility checks
│   ├── AnaamView.module.css        # [NEW] Scoped styles for AnaamView using CSS logical properties & design tokens
│   ├── LandingView.jsx             # [MODIFY] Add Zakat Al-Anaam card
│   └── AboutView.jsx               # [MODIFY] Add Zakat Al-Anaam methodology explanation
├── components/
│   ├── Header.jsx                  # [MODIFY] Add navigation link for Zakat Al-Anaam
│   └── Sidebar.jsx                 # [MODIFY] Add drawer navigation link for Zakat Al-Anaam
├── i18n/
│   └── translations.js             # [MODIFY] Add all bilingual keys for livestock Zakat
└── App.jsx                         # [MODIFY] Register 'anaam' view in state-driven router
```

**Structure Decision**: Retain the clean, modular SPA architecture. Pure calculation logic in `src/domain/` with 100% test coverage, UI in `src/views/` using CSS Modules and shared design tokens, state-driven view switching in `App.jsx`.

## Complexity Tracking

> **No violations. All architectural decisions strictly align with Constitution v2.0.0.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|:---|:---|:---|
| *None* | N/A | N/A |
