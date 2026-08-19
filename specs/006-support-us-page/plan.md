# Implementation Plan: Support Us Page & Cross-Site Support Link

**Branch**: `006-support-us-page` | **Date**: 2026-08-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-support-us-page/spec.md`

## Summary

Add a first-class, bilingual "Support Us" page to ZakatCalc with three static support options (vote on mortakaz, contribute on GitHub, star the GitHub repo), reusing the About page's typography and content-card structure. Reach it via a labeled "Support" link inserted before "About" in both the desktop top nav bar and the mobile sidebar drawer, integrated with the existing in-app navigation history. Add a reworded, clickable support prompt to the shared global footer (hidden on the Support page itself), and document the same three options in a new README "Support" section. No new dependencies, no new outbound requests, no calculation changes.

## Technical Context

**Language/Version**: JavaScript (ES2020+), JSX; React 18.3; Vite 5.4

**Primary Dependencies**: React 18 (`react`, `react-dom`), Vite, `@vitejs/plugin-react`. Third-party assets only: IBM Plex Sans Arabic (Google Fonts), Font Awesome 6 (CDN). No new dependencies added by this feature.

**Storage**: N/A — purely static informational page; no persistence, no user data, no localStorage changes.

**Testing**: Vitest 1.6. The existing `src/i18n/__tests__/translations.test.js` enforces strict en/ar key-set parity and a placeholder allowlist (`tabi`, `bintLabun`); new translation keys must satisfy both rules. New strings will be embedded in JSX (URLs are NOT interpolation tokens), so the placeholder test is unaffected.

**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge); static SPA hosted on GitHub Pages at base path `/zakat-calculator/`.

**Project Type**: Web app (static single-page application).

**Performance Goals**: Feature is static markup + CSS; no runtime cost beyond a few extra DOM nodes and one nav entry. No measurable latency impact. Existing `fade-in-up` page animation and `--transition-fast` theming are reused.

**Constraints**: 
- No new runtime dependencies (Constitution Principle II).
- No new outbound network requests — support links are plain `<a target="_blank" rel="noopener">` anchors the browser handles (Principles II, IV, V).
- Every new user-facing string MUST exist in both `en` and `ar` with RTL-correct rendering (Principle III).
- No changes to calculation logic, existing views, or existing navigation behavior beyond the additive Support entry and footer prompt (Principle I & scope).

**Scale/Scope**: 1 new view (`SupportView`), 1 new CSS module, edits to 4 existing files (`Header.jsx`, `Sidebar.jsx`, `App.jsx`, `Footer.jsx` + `Footer.module.css`), 1 i18n catalog edit (`translations.js`), 1 README edit. ~12 new translation key pairs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file: [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md) (v2.1.0).

| Principle | Status | Notes |
|---|---|---|
| **I. Shariah Accuracy First** (NON-NEGOTIABLE) | ✅ PASS | No calculation constants, formulas, or Nisaab thresholds are touched. No calculator view is modified. The scholarly disclaimer on Zakat Al-Mal is untouched. |
| **II. Lean Static SPA Stack** | ✅ PASS | No new runtime dependencies. Stays within Vite + React + CSS Modules + Vitest. No server-side component. Third-party assets remain the already-approved font/icon CDNs. |
| **III. Full Bilingual and Accessible Experience** | ✅ PASS (by design) | Every new string gets `en` + `ar` entries; `dir` is already managed globally by `I18nContext`. New nav entry and links get ARIA labels and are keyboard-operable. Both themes inherit via existing CSS custom properties. The parity test gate enforces this. |
| **IV. Graceful Degradation of Live Data** | ✅ PASS | No new outbound fetches. Support links are browser-handled anchors; unreachability is the browser's concern and cannot crash or stale the app. Offline behavior of all calculators is unchanged. |
| **V. Client-Side Privacy and Transparency** | ✅ PASS | No user data collected, stored, or transmitted. The only outbound URIs are the two documented endpoints (unchanged) and the user-clicked external support anchors (browser-level navigation, not app telemetry). |

**Gate result**: No violations. No Complexity Tracking entries required. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/006-support-us-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-contracts.md  # Navigation, view, footer, i18n contracts
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── App.jsx                       # EDIT: register 'support' in views array + view switch; pass currentView & onNavigate to Footer
├── components/
│   ├── Header.jsx                # EDIT: add 'support' nav item before 'about'
│   ├── Header.module.css         # (unchanged — reuses .navLink / .active)
│   ├── Sidebar.jsx               # EDIT: add 'support' item before 'about'
│   ├── Sidebar.module.css        # (unchanged — reuses .navLink / .active)
│   ├── Footer.jsx                # EDIT: render conditional support prompt; accept currentView + onNavigate props
│   └── Footer.module.css         # EDIT: add .supportPrompt + .supportLink styles
├── i18n/
│   └── translations.js           # EDIT: add ~12 key pairs (en + ar) — no {token} placeholders
└── views/
    ├── SupportView.jsx           # NEW: mirrors AboutView structure (.content card, h2/h3/p, external links)
    └── SupportView.module.css    # NEW: mirrors AboutView.module.css .content card

README.md                         # EDIT: add ## Support section after ## Contributing
```

**Structure Decision**: Single-project static SPA. The feature is purely additive: one new view + its CSS module, additive edits to the shared nav (Header, Sidebar), the shared Footer, the i18n catalog, and the README. No new directories, no new domain logic, no new services, no new tests directory (the existing i18n parity test automatically covers new keys).

## Complexity Tracking

> Not applicable — Constitution Check has no violations to justify.
