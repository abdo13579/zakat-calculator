# Quickstart: Validating the React Migration

**Phase 1 output** — runnable scenarios proving parity end-to-end. References:
[contracts/calculation-api.md](contracts/calculation-api.md) (test vectors),
[contracts/i18n-contract.md](contracts/i18n-contract.md) (language behaviors),
[contracts/external-apis.md](contracts/external-apis.md) (API obligations),
[data-model.md](data-model.md) (entities/lifecycles).

## Prerequisites

- Branch `002-react-migration` checked out; Node.js LTS installed.
- Legacy baseline available: the live site `https://abdo13579.github.io/zakat-calculator/`
  and/or the local `legacy/` folder (until parity sign-off deletes it — FR-010).

## Scenario 1 — Setup and test gate

```bash
npm install
npm test        # Vitest
npm run dev     # local dev server
```

**Expected**: all calculation tests pass (every vector in `contracts/calculation-api.md`,
including inclusive Nisaab boundaries and invalid-input `null` cases); dev server serves the
app with no console errors.

## Scenario 2 — Known-input parity (SC-002)

For each calculator, enter the contract test vectors into BOTH the rebuilt app and the legacy
baseline; compare results.

**Expected**: 100% identical outcomes (amounts, Nisaab eligibility, due/not-due).

## Scenario 3 — Language & theme parity (SC-001, SC-006)

1. Fresh profile (cleared storage): app opens in **Arabic, RTL** (legacy default).
2. Toggle to English: every string switches, `dir` becomes `ltr` on html and body; reload —
   English persists.
3. Toggle theme dark/light; reload — choice persists.
4. Walk all five views in both languages and both themes, desktop and mobile widths, side by
   side with the legacy baseline.

**Expected**: zero unintended visual/behavioral differences; no untranslated string anywhere;
placeholders and select options translated.

## Scenario 4 — Offline & failure behavior (SC-004, Principle IV)

1. DevTools → Network → Offline: run Zakat Al-Fitr and Zakat Al-Zuru end-to-end.
2. Still offline: run Zakat Al-Mal.
3. Back online: run Zakat Al-Mal and confirm loading state, then fresh results.

**Expected**: (1) both offline calculators work fully, zero errors; (2) a clear translated
error appears, app does not crash, no stale result is shown; (3) live results compute from
fresh data.

## Scenario 5 — Build, base path, and deploy dry run (SC-005, FR-009)

```bash
npm run build
npm run preview   # serves dist/ with the /zakat-calculator/ base path
```

Open the preview URL **including the `/zakat-calculator/` sub-path**, hard-refresh, and walk
every view.

**Expected**: app loads with zero broken asset references under the sub-path; all journeys
work. Deploy when ready (manual, per research D6):

```bash
git subtree push --prefix dist origin gh-pages
```

Then verify the public URL end-to-end (all calculators, both languages, both themes).

## Scenario 6 — Constitution workflow checklist (merge gate)

Before opening the PR, confirm the constitution's Development Workflow gates:

- [ ] `npm test` passes (automated calculation-logic gate)
- [ ] Manual checklist: builds and loads from static output; both languages render correctly
      including RTL; both themes work; each calculator produces expected results for known
      inputs
- [ ] PR description states the dependency set (Vite, React, ReactDOM, Vitest) — no
      additions beyond Principle II's permitted set
- [ ] README updated: dev/build/deploy commands, new project structure (FR-010); legacy
      `legacy/` folder removed only after Scenarios 2–4 are signed off

## When all scenarios pass

Parity is proven. Merge deploys the React app to the same public URL and unblocks
`implementation-plan.md` Phase 2 (design modernization).
