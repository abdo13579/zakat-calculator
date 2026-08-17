# Tasks: React Migration with Feature & Visual Parity

**Input**: Design documents from `/specs/002-react-migration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (3 files),
quickstart.md — all available and loaded.

**Executor guidance**: Work on branch `002-react-migration`. Legacy sources live in `legacy/`
after T002 — treat them as the verbatim source of truth for all ports. Exact contracts for
domain functions, API behavior, and i18n behavior are in `specs/002-react-migration/contracts/`
— follow them literally; do not redesign. Tests ARE requested by the spec (FR-007, SC-003) and
are part of US2. If a verification task fails, STOP and fix before continuing. Git mutations
(commits, pushes) require explicit maintainer confirmation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1, US2, or US3 (only in user-story phases)
- All paths are relative to the repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Vite scaffold at the repository root with legacy sources preserved for parity
comparison (research D1).

- [X] T001 Verify preconditions: `git branch --show-current` prints `002-react-migration`;
  `ls index.html js css` shows the legacy app; `ls specs/002-react-migration/contracts/` shows
  3 contract files. If any check fails, STOP.
- [X] T002 Preserve legacy sources: run `mkdir -p legacy public && git mv index.html js css
  legacy/ && git mv favicon.svg img.png public/`. Verify: `ls legacy/` shows `index.html`,
  `js/`, `css/`; `ls public/` shows `favicon.svg`, `img.png`.
- [X] T003 [P] Create `package.json`: name `zakatcalc`, `"private": true`, `"type": "module"`,
  scripts `dev`/`build`/`preview` = vite, `test` = `vitest run`; dependencies `react`,
  `react-dom`; devDependencies `vite`, `@vitejs/plugin-react`, `vitest`. No other packages
  (Constitution Principle II).
- [X] T004 [P] Create `vite.config.js`: `defineConfig` with `react()` plugin and
  `base: '/zakat-calculator/'`.
- [X] T005 [P] Create root `index.html` (Vite entry): copy the `<head>` from
  `legacy/index.html` lines 3–16 EXCEPT the legacy stylesheet link (line 15); keep the Google
  verification meta, Google Fonts IBM Plex Sans Arabic link, Font Awesome 6.5.2 CDN link, and
  favicon links (research D7). Set `<html lang="ar" dir="rtl">` (parity: legacy default is
  Arabic RTL). Body contains only `<div id="root"></div>` and
  `<script type="module" src="/src/main.jsx"></script>`.
- [X] T006 [P] Create/append `.gitignore`: `node_modules/`, `dist/`.
- [X] T007 Run `npm install`, then `npm run dev`, and confirm Vite serves without errors (a
  blank/placeholder page is acceptable at this point). Stop the dev server when confirmed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared modules every view depends on. No user-story work may begin until the
checkpoint passes.

- [X] T008 [P] Create `src/i18n/translations.js`: extract the `translations` object from
  `legacy/js/app.js` (starts line 3, spans the `en` and `ar` catalogs) and re-export it as a
  named ES module export `export const translations = { en: {...}, ar: {...} }` with keys and
  strings VERBATIM — no rewording, no reformatting of values.
- [X] T009 Create `src/i18n/I18nContext.jsx`: React Context + `useI18n()` hook exposing
  `{ lang, t, toggleLang }`. Behaviors (from contracts/i18n-contract.md): initial `lang` =
  `localStorage.getItem('zakatcalc_lang') || 'ar'`; every change writes `zakatcalc_lang`;
  `dir` set to `rtl`/`ltr` on BOTH `document.documentElement` and `document.body`; fallback
  chain `translations[lang]?.[key] || translations.en[key] || key`; `toggleLang` switches
  `en`⇄`ar`. Depends on T008.
- [X] T010 [P] Create `src/theme/ThemeContext.jsx`: Context + `useTheme()` hook exposing
  `{ isDark, toggleTheme }`. Initial value from `localStorage.getItem('zakatcalc_theme')`
  (default light when unset); every toggle writes `'dark'`/`'light'` to that key and applies
  the theme by toggling the same CSS-variable mechanism the legacy stylesheet uses (inspect
  `legacy/css/style.css` `:root` and theme selectors; apply the matching attribute/class on
  the root element).
- [X] T011 [P] Create `src/services/api.js`: verbatim ES-module port of `legacy/js/api.js` —
  `getCurrencyRates()` and `getGoldPrice()` with identical URLs, identical field extraction,
  the ÷ 31.1035 ounce→gram conversion, and the `null`-on-failure contract with console error
  logging (contracts/external-apis.md).
- [X] T012 [P] Create `src/domain/fitr.js`: export `calculateFitr({ persons, pricePerKg })`
  returning `{ totalWeightKg, totalValue }` per contracts/calculation-api.md (weight =
  persons × 3.0; value = weight × price). Invalid input (non-number, negative, persons < 1)
  returns `null`.
- [X] T013 [P] Create `src/domain/mal.js`: export `calculateMal({ wealth,
  goldPricePerGramUsd, exchangeRate })` returning `{ nisaab, eligible, zakatDue }` per
  contract: nisaab = 85 × goldPricePerGramUsd × exchangeRate; eligible = wealth ≥ nisaab;
  zakatDue = eligible ? wealth × 0.025 : 0. Invalid input returns `null`.
- [X] T014 [P] Create `src/domain/zuru.js`: export `calculateZuru({ weightKg, irrigation })`
  returning `{ eligible, rate, zakatDue }` per contract: rates rainfed 0.10 / irrigated 0.05 /
  mixed 0.075; eligible = weightKg ≥ 600; invalid input (bad enum, negative) returns `null`.
- [X] T015 [P] Create `src/styles/tokens.css` and `src/styles/global.css`: move ALL CSS custom
  properties (every `:root`/theme variable block) from `legacy/css/style.css` into
  `tokens.css` unchanged; move true globals (body/main resets, page-shell layout, the `.page`
  /`.hidden` show-hide mechanism, `.cta-button`, `.form-group`, `.results-container` shared
  rules) into `global.css`. Do not restyle.
- [X] T016 Create `src/main.jsx` (imports `global.css` + `tokens.css`, renders `<App/>` wrapped
  in `I18nProvider` and `ThemeProvider`) and `src/App.jsx` (temporary shell rendering one probe
  string via `t('app-name')`). Run `npm run dev`: page shows the translated app name in Arabic
  RTL with no console errors. Depends on T009, T010, T015.

**Checkpoint**: Foundation ready — contexts, services, domain modules, and styles exist; the
shell renders translated content.

---

## Phase 3: User Story 1 - End user experiences zero change (Priority: P1) 🎯 MVP

**Goal**: The full visible app — navigation, all five views, calculators, language/theme
toggles, clipboard, loading/error/offline behavior — indistinguishable from legacy.

**Independent Test**: `npm run dev`, then walk quickstart.md Scenarios 2–4 (known-input parity,
language/theme parity, offline & failure behavior) against the legacy baseline.

### Implementation for User Story 1

- [X] T017 [P] [US1] Create `src/utils/currency.js`: port the currency helpers from
  `legacy/js/app.js` `populateCurrencyDropdowns` and `detectUserCurrency` (around lines
  385–470): the popular-currency list (USD, EUR, GBP, SAR, EGP, AED, KWD, TRY, IDR, PKR), the
  sort behavior, and user-currency detection. Export pure helper functions.
- [X] T018 [P] [US1] Create `src/utils/format.js`: port `formatNumber` (line ~471) and the
  number-input formatting behavior from `setupInputFormatting` (lines 288–307) in
  `legacy/js/app.js`.
- [X] T019 [P] [US1] Create `src/components/Header.jsx` + `src/components/Header.module.css`:
  logo, desktop nav (5 links), language toggle, theme toggle (moon/sun icon swap per legacy
  `updateThemeToggleIcon`), hamburger button — same ARIA labels as `legacy/index.html` lines
  18–40; CSS moved from the header rules in `legacy/css/style.css`.
- [X] T020 [P] [US1] Create `src/components/Sidebar.jsx` + `src/components/Sidebar.module.css`:
  mobile sidebar nav (legacy lines 42–48), open/close on hamburger click and on outside
  body-click (legacy `setupNavigation` lines 308–335); CSS from sidebar rules in
  `legacy/css/style.css`.
- [X] T021 [P] [US1] Create `src/components/GlobalMessage.jsx` +
  `src/components/GlobalMessage.module.css`: the `#global-message` toast with
  `role="status" aria-live="polite"`, info/error/success types, auto-dismiss timer, and
  clear behavior (legacy `showGlobalMessage`/`clearGlobalMessage`, lines 429–445).
- [X] T022 [P] [US1] Create `src/components/Footer.jsx` + `src/components/Footer.module.css`:
  legacy lines 176–178 with the `footer-text` translation key.
- [X] T023 [US1] Create `src/components/ResultCard.jsx` +
  `src/components/ResultCard.module.css`: shared result panel with translated labels,
  formatted numbers (uses T018), copy-to-clipboard button with `navigator.clipboard` AND the
  legacy fallback path (`copyToClipboard`, lines 481–501), success message on copy, and
  scroll-into-view on new results (`scrollToResults`, lines 475–480). CSS from
  `.results-container` rules in `legacy/css/style.css`.
- [X] T024 [P] [US1] Create `src/views/LandingView.jsx` + `src/components/LandingView.module.css`:
  title, subtitle, and the three feature cards with CTA buttons navigating to their calculator
  views (legacy lines 53–76; translation keys `landing-*`, `fitr-*`, `mal-*`, `zuru-*`).
- [X] T025 [P] [US1] Create `src/views/FitrView.jsx` + `src/components/FitrView.module.css`:
  form (food price, currency select, individuals) per legacy lines 78–101; submits through
  `calculateFitr` (T012) and renders via ResultCard; translated validation errors; currency
  select populated via T017 with legacy defaults (EGP/SAR/USD present in markup). Works fully
  offline.
- [X] T026 [P] [US1] Create `src/views/MalView.jsx` + `src/components/MalView.module.css`: form
  (wealth, currency) per legacy lines 103–122; on submit drives the MarketData lifecycle
  (data-model.md): loading state → call both T011 endpoints → on success `calculateMal` (T013)
  with the selected currency's rate → ResultCard; on any `null` → translated global error via
  T021, no stale result (contracts/external-apis.md).
- [X] T027 [P] [US1] Create `src/views/ZuruView.jsx` + `src/components/ZuruView.module.css`:
  form (harvest weight, irrigation select with translated options rainfed/irrigated/mixed) per
  legacy lines 124–143; `calculateZuru` (T014) → ResultCard. Works fully offline.
- [X] T028 [P] [US1] Create `src/views/AboutView.jsx` + `src/components/AboutView.module.css`:
  full About content including API-usage list, developer credits/social links, and the
  scholarly disclaimer (legacy lines 145–173; `about-*` keys). The disclaimer MUST be present
  (Constitution Principle I).
- [X] T029 [US1] Wire `src/App.jsx`: state-driven navigation across `landing`, `fitr`, `mal`,
  `zuru`, `about` (data-model.md AppView) replicating legacy `showPage` (lines 360–384):
  hidden/visible section toggling, active nav-link highlighting, and scroll-to-top on
  navigation. Renders Header, Sidebar, GlobalMessage, the active view, Footer. Depends on
  T019–T028.
- [X] T030 [US1] Verify US1: run `npm run dev` and execute quickstart.md Scenario 2 (all
  known-input vectors vs legacy), Scenario 3 (Arabic default on fresh storage, language toggle
  + persistence, theme toggle + persistence, all 5 views × 2 languages × 2 themes), and
  Scenario 4 (offline Fitr/Zuru; offline Mal shows translated error without crash). Record
  pass/fail per item; fix and re-run on any failure.

**Checkpoint**: US1 complete — the rebuilt app is behaviorally identical to legacy.

---

## Phase 4: User Story 2 - Maintainer gains a trustworthy, maintainable codebase (Priority: P2)

**Goal**: Automated calculation tests asserting the contract vectors, translation key parity
enforced by test, and proof the safety net catches formula regressions.

**Independent Test**: `npm test` — all suites pass; the parity test fails if a key is missing
from either language; the break-and-restore demonstration shows a formula change fails tests.

### Tests for User Story 2 (requested by spec FR-007)

- [X] T031 [P] [US2] Create `src/domain/__tests__/fitr.test.js`: Vitest suite covering every
  `calculateFitr` vector in contracts/calculation-api.md (4 persons @15 → 12 kg/180; 1 person
  @0 → 3 kg/0) plus invalid inputs (negative persons, NaN price, persons 0) → `null`.
- [X] T032 [P] [US2] Create `src/domain/__tests__/mal.test.js`: all `calculateMal` vectors —
  10000/70/1 → nisaab 5950, due 250; boundary 5950 → eligible, due 148.75; 5949.99 → not
  eligible, due 0; 50000/70/3.25 → nisaab 19337.50, due 1250; invalid inputs → `null`.
- [X] T033 [P] [US2] Create `src/domain/__tests__/zuru.test.js`: all `calculateZuru` vectors —
  599.99 rainfed → not eligible; 600 rainfed → due 60; 1000 irrigated → due 50; 1000 mixed →
  due 75; bad irrigation enum and negative weight → `null`.
- [X] T034 [P] [US2] Create `src/i18n/__tests__/translations.test.js`: asserts the `en` and
  `ar` key sets in `src/i18n/translations.js` are exactly equal (sorted deep-equal), and that
  the count matches the legacy baseline (≥ the number of `data-i18n` attributes in
  `legacy/index.html` — 59 — plus dynamic-string keys).
- [X] T035 [US2] Safety-net proof: temporarily change one constant (e.g. Fitr 3.0 → 3.5 in
  `src/domain/fitr.js`), run `npm test`, confirm at least one test FAILS, then revert the
  change and confirm the suite is green again. Record the observed failure output in the PR
  description.
- [X] T036 [US2] Run `npm test` and confirm the full suite passes; also confirm (per
  US2 acceptance scenario) that adding a new key to both catalogs renders without component
  changes (demonstrate with a temporary key, then remove it).

**Checkpoint**: US2 complete — calculation logic is test-guarded and catalog parity is
enforced.

---

## Phase 5: User Story 3 - Maintainer publishes to the same URL with the same simplicity (Priority: P3)

**Goal**: Production build works under the `/zakat-calculator/` base path, and the manual
publish path to GitHub Pages is documented and verified.

**Independent Test**: `npm run build` + `npm run preview`, open the app at the
`/zakat-calculator/` sub-path, hard-refresh, and walk every view — zero broken assets.

### Implementation for User Story 3

- [X] T037 [US3] Run `npm run build`; verify `dist/index.html` references assets with the
  `/zakat-calculator/` prefix (`grep -o '/zakat-calculator/[^"]*' dist/index.html` shows
  asset URLs) and the build completes with no warnings about missing files.
- [X] T038 [US3] Run `npm run preview`, open `http://localhost:4173/zakat-calculator/`, and
  walk all five views with a hard refresh on each; verify zero 404s in the network tab and
  that fonts/icons load from their CDNs.
- [X] T039 [US3] Update `README.md`: replace the "Run locally" section with the new commands
  (`npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run preview`), replace the
  project-structure block with the `src/` layout from plan.md, and document manual deployment
  exactly as: `npm run build` then `git subtree push --prefix dist origin gh-pages`
  (research D6). Keep the calculation-methods and disclaimer sections unchanged (Principle I).
- [ ] T040 [US3] Deploy ONLY with explicit maintainer confirmation: run `npm run build`, then
  `git subtree push --prefix dist origin gh-pages`, then verify
  `https://abdo13579.github.io/zakat-calculator/` end-to-end (all calculators, both languages,
  both themes — quickstart Scenario 5).

**Checkpoint**: US3 complete — the React app can ship to the existing public URL.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation, legacy cleanup, and governance handoff.

- [X] T041 Run every scenario in `specs/002-react-migration/quickstart.md` (Scenarios 1–6) and
  record pass/fail for each; all MUST pass before sign-off.
- [ ] T042 Final parity sign-off (SC-001): side-by-side comparison against
  `https://abdo13579.github.io/zakat-calculator/` — both languages, both themes, desktop and
  mobile widths — recording zero unintended differences (or a list of intended ones approved
  by the maintainer).
- [ ] T043 After sign-off, delete the `legacy/` folder (`git rm -r legacy/`), run
  `npm run build` and `npm test` again to confirm nothing referenced it (FR-010).
- [X] T044 Prepare the PR description: state the dependency set (react, react-dom, vite,
  @vitejs/plugin-react, vitest — nothing else, per Principle II), paste the T035 safety-net
  evidence, the T041/T042 validation results, and the constitution manual-checklist
  confirmation.
- [ ] T045 Present `git status` and the full change summary to the maintainer; commit ONLY
  after explicit confirmation with message `feat: migrate app to Vite + React with full
  parity`. Do NOT push unless the maintainer asks.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. T003–T006 are [P] after T002.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories. T008, T010–T015
  are [P]; T009 needs T008; T016 needs T009, T010, T015.
- **US1 (Phase 3)**: Depends on Foundational. T017–T022 [P]; T023 needs T018; T024–T028 [P]
  once T017, T018, T023 are done; T029 needs T019–T028; T030 last.
- **US2 (Phase 4)**: Depends on Foundational (domain modules T012–T014, catalog T008) — NOT on
  US1; can start in parallel with US1 if staffing allows. T031–T034 [P]; T035 needs T031–T034
  green first.
- **US3 (Phase 5)**: Depends on Phase 1 config (T003–T005) and is meaningfully testable only
  once US1 views exist (T038 walks all views). T037–T039 [P]-capable; T040 gated on maintainer.
- **Polish (Phase 6)**: Depends on all stories. Sequential.

### User Story Dependencies

- **US1 (P1)**: Foundational only — independently completable and testable (T030).
- **US2 (P2)**: Foundational only — independently completable and testable (T036); zero
  coupling to US1 views.
- **US3 (P3)**: Setup config + benefits from US1 for the preview walkthrough; independently
  testable via build/preview even before US1 (shell-only preview), but full validation needs
  US1.

### Parallel Opportunities

- Phase 1: T003, T004, T005, T006 together.
- Phase 2: T008, T010, T011, T012, T013, T014, T015 together (7 tasks).
- US1: T017–T022 together (6 tasks); T024–T028 together (5 tasks) after T023.
- US2: T031, T032, T033, T034 together (4 tasks).

## Parallel Examples

```bash
# Foundational batch (7 independent files):
Task: "Create src/i18n/translations.js from legacy/js/app.js"
Task: "Create src/theme/ThemeContext.jsx"
Task: "Create src/services/api.js from legacy/js/api.js"
Task: "Create src/domain/fitr.js per contract"
Task: "Create src/domain/mal.js per contract"
Task: "Create src/domain/zuru.js per contract"
Task: "Create src/styles/tokens.css + global.css from legacy/css/style.css"

# US2 test batch (4 independent files):
Task: "fitr.test.js vectors"
Task: "mal.test.js vectors"
Task: "zuru.test.js vectors"
Task: "translations key-parity test"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2 → foundation with contexts, services, domain modules.
2. Phase 3 (US1) → the complete visible app; validate via T030.
3. **STOP**: the app is user-identical to legacy. US2 (tests) and US3 (deploy) remain before
   merge, because the constitution requires the automated-test gate.

### Incremental Delivery

1. Setup + Foundational → shell renders translated content (T016 checkpoint).
2. US1 → full parity app, locally verified (T030).
3. US2 → test safety net + catalog parity enforcement (T036).
4. US3 → build/preview/deploy path proven (T038), deploy on approval (T040).
5. Polish → quickstart sign-off, legacy removal, PR (T041–T045).

---

## Notes

- Contracts are normative: `specs/002-react-migration/contracts/` defines function signatures,
  test vectors, API failure semantics, and i18n behaviors — implement to the contract, not to
  taste.
- Principle I constants (3.0 kg, 85 g, 2.5%, 600 kg, 0.10/0.05/0.075, ÷ 31.1035) are
  non-negotiable — copy them exactly as specified in the contracts.
- The legacy default language is **Arabic** and legacy storage keys are `zakatcalc_lang` /
  `zakatcalc_theme` — parity requires preserving both (i18n contract).
- Font Awesome and IBM Plex Sans Arabic stay as CDN links (research D7); the icon-library
  decision is deferred to implementation-plan Phase 2.
- Do not add ANY npm dependency beyond the five in T003 — Principle II requires written
  justification for anything more.
