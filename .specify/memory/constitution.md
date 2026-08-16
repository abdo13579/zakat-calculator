<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0
- Modified principles:
  - I. Shariah Accuracy First → unchanged
  - II. Buildless Vanilla Stack → II. Lean Static SPA Stack (redefined: permits Vite + React + CSS Modules)
  - III. Full Bilingual and Accessible Experience → unchanged title, reworded body (removes the data-i18n mechanism mandate)
  - IV. Graceful Degradation of Live Data → unchanged
  - V. Client-Side Privacy and Transparency → unchanged
- Added sections: none
- Removed sections: none
- Follow-up TODOs: none
-->

# ZakatCalc Constitution

## Core Principles

### I. Shariah Accuracy First (NON-NEGOTIABLE)

Calculation constants and methods MUST follow mainstream Islamic jurisprudence as
documented in the README: 85 g gold Nisaab, 2.5% rate on eligible wealth, 3.0 kg of
staple food per person for Zakat Al-Fitr, 600 kg Nisaab and 10%/5%/7.5% irrigation
rates for Zakat Al-Zuru. Any change to a constant, formula, or Nisaab threshold MUST
cite a documented scholarly basis in the pull request. The scholarly disclaimer MUST
remain visible in the app and the README.

Rationale: users rely on this tool for a religious obligation; an incorrect result is
the worst possible defect, worse than any outage or visual bug.

### II. Lean Static SPA Stack

The app MUST be built as a static single-page application using Vite, React, and CSS Modules,
producing static output that deploys by serving the build output directory on any static
host. The app MUST NOT include a server-side component. Any runtime or build dependency
beyond Vite, React, ReactDOM, and Vitest requires written justification and maintainer
approval in the pull request. Third-party assets MUST be limited to font/icon packages and
the two documented public APIs (currency rates, gold price); no API keys MUST be required.

Rationale: a lean, statically deployed stack keeps the project trivially deployable,
auditable, and open to contributors, while the dependency-justification rule preserves the
anti-bloat intent of this principle's predecessor (Buildless Vanilla Stack).

### III. Full Bilingual and Accessible Experience

Every user-facing string MUST be translatable and MUST have both English and Arabic entries.
Arabic MUST render in a correct RTL layout. Markup MUST be semantic HTML with appropriate
ARIA labels, and all controls MUST be operable by keyboard. Dark/light theme support MUST be
preserved.

Rationale: the audience is global and largely Arabic-speaking; a feature that ships in only
one language, or is inaccessible, is an incomplete feature.

### IV. Graceful Degradation of Live Data

Zakat Al-Mal depends on live gold and exchange-rate data; every external fetch MUST
handle failure explicitly, surface a clear user-visible error state, and MUST never
crash the app or display a silently stale result. Zakat Al-Fitr and Zakat Al-Zuru MUST
remain fully functional with no network access. Loading states MUST be shown while
fetches are in flight.

Rationale: users may be offline or the public endpoints may fail; the tool MUST stay
honest and useful in both cases.

### V. Client-Side Privacy and Transparency

All computation MUST run in the browser. The app MUST NOT collect, store, or transmit
user-entered financial or household data to any server; the only outbound requests
permitted are the documented public price/rate endpoints. Calculation methods MUST be
explained openly (README and/or in-app) so results are verifiable by the user.

Rationale: wealth data is sensitive; a zero-collection design eliminates the privacy
risk by construction and builds trust.

## Additional Constraints

- Technology stack: Vite + React (JSX) + CSS Modules; Vitest for calculation-logic unit
  tests; font and icon packages via npm or CDN.
- External APIs: `open.er-api.com/v6/latest/USD` for exchange rates and
  `mintedmetal.com/api/prices.json` for gold price (per ounce, converted to per gram by
  dividing by 31.1035). Replacement endpoints MUST remain keyless and CORS-enabled.
- Build and deployment: static hosting only (GitHub Pages); no server-side component; the
  site is built with the base path `/zakat-calculator/` and the build output is published
  manually to the `gh-pages` branch.
- Supported browsers: current versions of Chrome, Firefox, Safari, and Edge.
- Transition note: until the React migration (`implementation-plan.md`, Phase 1) merges, the
  running app remains the legacy vanilla HTML/CSS/JS stack; the stack constraints above take
  full effect with that migration.

## Development Workflow

- Changes are proposed via a feature branch and a pull request, per the README contributing
  guide.
- Every pull request MUST be reviewed against this constitution: calculation changes against
  Principle I, new user-facing strings against Principle III, new outbound requests against
  Principle IV, and any new dependency against Principle II.
- Automated calculation-logic tests MUST pass before merge.
- Manual verification checklist before merge: the app builds and loads from its static
  output, both languages render correctly including RTL, both themes work, and each
  calculator produces the expected result for known inputs.
- Any added complexity (including a new dependency) MUST be justified in writing and approved
  through the review process.

## Governance

This constitution supersedes other development practices for this project. Amendments
require: (1) a documented rationale in the pull request, (2) maintainer approval, and
(3) a migration note describing any impact on existing behavior. The constitution
follows semantic versioning: MAJOR for backward-incompatible principle removals or
redefinitions, MINOR for new principles or materially expanded sections, PATCH for
clarifications and non-semantic refinements. All pull requests and reviews MUST verify
compliance with the principles; any deviation MUST be either corrected or resolved
through a formal amendment. The README serves as the runtime user guidance file and
MUST be updated whenever calculation methods or user-visible behavior change.

**Version**: 2.0.0 | **Ratified**: 2026-08-16 | **Last Amended**: 2026-08-16
