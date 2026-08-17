# Implementation Plan: Design Modernization

**Branch**: `003-design-modernization` | **Date**: 2026-08-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-design-modernization/spec.md`

## Summary

Modernize ZakatCalc's visual design system by expanding the CSS custom property token scale, introducing layered surface elevation for dark mode, unifying form controls into reusable component styles, adding inline unit/currency indicators to inputs, migrating all physical CSS directional properties to logical equivalents for seamless RTL/LTR support, and replacing imperative DOM-based notification patterns with a declarative toast system. No calculation logic or business rules change.

## Technical Context

**Language/Version**: JavaScript (ES2020+), JSX, CSS3

**Primary Dependencies**: React 18.3, ReactDOM 18.3, Vite 5.4 (build tooling only — no new runtime dependencies required)

**Storage**: N/A (client-side only, localStorage for theme/language preferences — unchanged)

**Testing**: Manual visual verification across themes and directions; existing Vitest suite for calculation logic (unchanged)

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge current versions), static hosting (GitHub Pages)

**Project Type**: Static single-page application (SPA)

**Performance Goals**: All CSS transitions complete within 200ms; theme switching without flash-of-unstyled-content; no increase in bundle size beyond token/style additions

**Constraints**: Per constitution Principle II — no new runtime dependencies beyond Vite, React, ReactDOM. All changes limited to CSS files, JSX component markup, and the notification context. Per Principle III — full bilingual (EN/AR) and accessible (semantic HTML, ARIA, keyboard) compliance maintained. Per Principle V — zero server-side component.

**Scale/Scope**: 11 CSS files (1 token, 1 global, 9 module), 5 view components, 5 shared components, 1 new context provider (Toast/Notification)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| **I. Shariah Accuracy First** | ✅ PASS | No changes to calculation constants, formulas, or Nisaab thresholds. Visual-only modernization. |
| **II. Lean Static SPA Stack** | ✅ PASS | No new runtime dependencies. Changes limited to CSS tokens/styles, JSX markup adjustments, and one new React context (ToastContext). All within approved Vite + React + CSS Modules stack. |
| **III. Full Bilingual & Accessible** | ✅ PASS | RTL support improved (logical properties replace physical overrides). ARIA labels and keyboard navigation preserved. New unit indicator labels use existing translation keys or language-neutral symbols. |
| **IV. Graceful Degradation** | ✅ PASS | No changes to API fetch patterns or error handling behavior. Visual treatment of error states modernized but degradation logic unchanged. |
| **V. Client-Side Privacy** | ✅ PASS | No new outbound requests. No data collection changes. Pure visual/UI modernization. |

**Gate Result**: ✅ ALL PASS — no violations, no complexity tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-design-modernization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-contracts.md  # UI component visual contracts
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── styles/
│   ├── tokens.css            # [MODIFY] Expanded design token scale
│   └── global.css            # [MODIFY] Refactored global styles using tokens + logical properties
├── components/
│   ├── Header.jsx            # [MODIFY] Consume token-based styles
│   ├── Header.module.css     # [MODIFY] Logical properties, token refs
│   ├── Sidebar.jsx           # [MODIFY] Logical property animations
│   ├── Sidebar.module.css    # [MODIFY] Logical properties, token refs
│   ├── Footer.jsx            # [MINOR] Token refs only
│   ├── Footer.module.css     # [MODIFY] Token refs
│   ├── GlobalMessage.jsx     # [REPLACE] Remove imperative DOM, consume ToastContext
│   ├── GlobalMessage.module.css # [REPLACE] Redesigned toast styles
│   ├── ResultCard.jsx        # [MODIFY] Remove imperative toast DOM, consume ToastContext, add component styles
│   └── ResultCard.module.css # [MODIFY] Standardized card pattern, token refs, logical properties
├── views/
│   ├── LandingView.jsx       # [MINOR] Consume updated card styles
│   ├── LandingView.module.css # [MODIFY] Token refs, hover/focus polish
│   ├── FitrView.jsx          # [MODIFY] Add unit indicator markup
│   ├── FitrView.module.css   # [MODIFY] Input group styles, token refs
│   ├── MalView.jsx           # [MODIFY] Add currency indicator markup
│   ├── MalView.module.css    # [MODIFY] Input group styles, token refs
│   ├── ZuruView.jsx          # [MODIFY] Add unit indicator markup
│   ├── ZuruView.module.css   # [MODIFY] Input group styles, token refs
│   ├── AboutView.jsx         # [MINOR] Token refs only
│   └── AboutView.module.css  # [MODIFY] Token refs
├── theme/
│   └── ThemeContext.jsx       # [MINOR] Ensure no-FOUC transition logic
├── toast/
│   └── ToastContext.jsx       # [NEW] Declarative toast provider + useToast hook
├── i18n/
│   ├── I18nContext.jsx        # [UNCHANGED]
│   └── translations.js       # [MINOR] Add any new unit indicator labels
├── services/
│   └── api.js                 # [UNCHANGED]
├── utils/
│   ├── currency.js            # [UNCHANGED]
│   └── format.js              # [UNCHANGED]
├── domain/                    # [UNCHANGED]
├── App.jsx                    # [MODIFY] Add ToastProvider wrapper
└── main.jsx                   # [MINOR] Provider ordering
```

**Structure Decision**: Flat single-project SPA structure maintained. One new directory (`src/toast/`) added for the toast notification context — follows the existing pattern of `src/theme/` and `src/i18n/` for context providers. No structural reorganization required.
