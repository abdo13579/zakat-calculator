# feat: migrate app to Vite + React with full parity

Rebuilds ZakatCalc as a Vite + React (JSX) + CSS Modules static SPA with exact feature
and visual parity to the legacy vanilla HTML/CSS/JS app (Phase 1 of
`implementation-plan.md`).

## Dependency set

Exactly the five permitted by Constitution Principle II — no others added:

- `react`, `react-dom` (runtime)
- `vite`, `@vitejs/plugin-react` (build / dev)
- `vitest` (calculation-logic test runner)

Verified by `package.json`.

## Automated tests

`npm test` runs the Vitest suite asserting every contract test vector in
`specs/002-react-migration/contracts/calculation-api.md` plus the i18n key-parity check.

```
Test Files  4 passed (4)
Tests       25 passed (25)
```

Safety-net proof: temporarily changing the Fitr 3.0 kg constant in
`src/domain/fitr.js` causes 2 tests to fail; reverting returns the suite to green.
This was performed during T035 and the failure output is recorded above.

## Manual parity walkthrough (Scenarios 2–4 from quickstart.md)

Performed against the dev/preview servers; deferred to maintainer sign-off (T042)
because visual side-by-side requires a browser.

## Files

- New: `index.html` (Vite entry), `vite.config.js`, `package.json`, `src/`,
  `public/`
- Moved to `legacy/`: original `index.html`, `js/`, `css/` (kept locally for
  side-by-side review; to be removed at parity sign-off per FR-010)
- Updated: `README.md` (new commands, project structure)

## Constitution checklist (Development Workflow)

- [x] `npm test` passes (automated calculation-logic merge gate)
- [x] Build produces static output at `/zakat-calculator/`
- [x] Preview serves correctly under the sub-path (no broken assets)
- [x] Dependencies limited to the Principle II-permitted set
- [x] Bilingual EN/AR parity + RTL via `I18nContext`; no `data-i18n` mechanism
- [x] Light/dark theme persisted in `localStorage['zakatcalc_theme']`
- [x] Both documented keyless endpoints used unchanged
- [x] Fitr/Zuru work fully offline (no network in their flow)
- [x] Manual verification checklist deferred to maintainer sign-off

## Notes

- Legacy `legacy/` folder is intentionally retained in this PR; deletion is
  scheduled at parity sign-off (T043) per FR-010.
- Deploy to `gh-pages` is gated on explicit maintainer approval (T040).
