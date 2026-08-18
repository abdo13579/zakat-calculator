---
description: "Task list for Back Navigation & Multi-Currency Zakat Al-Mal"
---

# Tasks: Back Navigation & Multi-Currency Zakat Al-Mal

**Input**: Design documents from `/specs/005-back-nav-multi-currency/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: The project's constitution (Principle I, "Automated calculation-logic tests MUST pass before merge") mandates Vitest coverage for the new `calculateMalMulti` domain function, and Principle III mandates the existing i18n en/ar parity test be extended to cover new keys. Test tasks for those two areas are therefore included. UI and navigation behavior are validated manually via [quickstart.md](./quickstart.md) (no jsdom/DOM test runner is configured in `vite.config.js`).

**Organization**: Tasks are grouped by user story. Priorities from spec.md: US1 (P1) multi-currency, US2 (P1) back button, US3 (P2) Arabic currency names, US4 (P2) sidebar close-first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Single static SPA project: `src/` at repository root (matches existing layout in `plan.md`).
- Domain logic: `src/domain/` · Hooks: `src/hooks/` · Views: `src/views/` · Components: `src/components/` · Utils: `src/utils/` · i18n: `src/i18n/` · Tests: `src/**/__tests__/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the new files/directories introduced by [plan.md](./plan.md) so subsequent phases can fill them in.

- [X] T001 Create new source directories `src/hooks/` and confirm `src/components/`, `src/utils/`, `src/domain/`, `src/views/`, `src/i18n/` already exist
- [X] T002 [P] Create empty scaffold files: `src/hooks/useViewHistory.js`, `src/utils/currencyNames.js`, `src/components/WealthRow.jsx`, `src/components/WealthRow.module.css` (each with a placeholder export and a comment referencing its contract file)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared i18n keys used by multiple user stories. MUST be complete before US1 and US3.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Add all new bilingual UI keys (listed in [contracts/i18n-catalog.md](./contracts/i18n-catalog.md) "New UI keys" table) to BOTH `en` and `ar` objects in `src/i18n/translations.js`
- [X] T004 Extend `src/i18n/__tests__/translations.test.js` to assert every new key from T003 exists in both `en` and `ar` (key-set parity rule, Principle III), then run `npm test` to confirm the parity test passes

**Checkpoint**: i18n foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 - Calculate Zakat on Wealth Held in Multiple Currencies (Priority: P1) 🎯 MVP

**Goal**: A user can enter multiple wealth rows in different currencies; the app converts all to USD, auto-merges same-currency rows, sums them, compares against the USD gold nisab (85 g × gold price/gram USD), and shows the combined total + 2.5% zakat due in USD.

**Independent Test**: Enter two rows (e.g. 10 USD + 10 EGP) and verify the app shows one combined USD total and one correct zakat figure with no manual conversion. See [quickstart.md](./quickstart.md) Scenario A; single-row input must still match the prior single-currency behavior (Scenario J, SC-007).

### Tests for User Story 1

> Constitution Principle I mandates these tests; write them FIRST and confirm they FAIL before implementation.

- [X] T005 [P] [US1] Add Vitest vectors for `calculateMalMulti` success cases (single-entry parity with `calculateMal`, two different currencies, same-currency merge, zero amount, below nisab, boundary at nisab, multi-row EGP/SAR/USD mix) in `src/domain/__tests__/mal.test.js` per [contracts/calculation-api.md](./contracts/calculation-api.md) "Test vectors" table
- [X] T006 [P] [US1] Add Vitest vectors for `calculateMalMulti` failure cases (missing rate, negative amount, NaN amount, empty entries, invalid gold ≤ 0, invalid rates null) in `src/domain/__tests__/mal.test.js` per [contracts/calculation-api.md](./contracts/calculation-api.md) "Test vectors" table
- [X] T007 [US1] Implement `calculateMalMulti({ entries, goldPricePerGramUsd, rates })` in `src/domain/mal.js` returning the `MalMultiResult` success/failure shape defined in [contracts/calculation-api.md](./contracts/calculation-api.md) and [data-model.md](./data-model.md); keep the existing `calculateMal` function untouched for back-compat (SC-007)
- [X] T008 Run `npm test` and confirm all `calculateMalMulti` vectors from T005/T006 pass (implementation matches contract)
- [X] T009 [P] [US1] Implement the `WealthRow` component in `src/components/WealthRow.jsx` (controlled inputs: amount text + currency select, remove button) with styles in `src/components/WealthRow.module.css`; props: `{ id, amountRaw, currency, currencyOptions, onChangeAmount, onChangeCurrency, onRemove, canRemove, t }` per [data-model.md](./data-model.md) `WealthEntryInput`
- [X] T010 [US1] Rewrite `src/views/MalView.jsx` to manage a dynamic array of `WealthEntryInput` rows (at least one row always, add/remove controls), call `calculateMalMulti` on submit using the fetched `rates` + `goldPricePerGramUsd`, and render the USD result card with combined total, nisab, eligibility, zakat due, and per-currency breakdown; preserve the scholarly disclaimer; render per-row localized errors from the failure shape
- [X] T011 [US1] Verify Scenario A, B, C, D, J from [quickstart.md](./quickstart.md) manually in `npm run dev` (multi-currency calc, same-currency merge, add/remove rows, invalid input feedback, single-row back-compat)

**Checkpoint**: User Story 1 fully functional and independently testable. MVP deliverable.

---

## Phase 4: User Story 2 - Browser Back Button Returns to the Previous Page (Priority: P1)

**Goal**: Pressing the device/browser back button navigates to the previously viewed in-app page instead of exiting the site; forward works too.

**Independent Test**: Navigate landing → a calculator → press back; the app returns to landing (not exit). Navigate a chain and press back repeatedly; order is correct. See [quickstart.md](./quickstart.md) Scenario G.

### Implementation for User Story 2

- [X] T012 [US2] Implement `useViewHistory({ views, initialView })` in `src/hooks/useViewHistory.js` per [contracts/navigation-api.md](./contracts/navigation-api.md): `navigate(toView)` calls `window.history.pushState({ view: toView }, '', '')` and updates state; a `popstate` listener sets `view` from `event.state.view` (falling back to `initialView`); expose `{ view, navigate, canGoBack }`. Guard `window`/`document` for SSR safety (mirror `I18nContext.jsx` patterns). Sidebar-related parameters are added in US4.
- [X] T013 [US2] Refactor `src/App.jsx` to replace local `useState('landing')` view state with `useViewHistory({ views: ['landing','fitr','mal','zuru','anaam','about'], initialView: 'landing' })`; pass `view` and `navigate` down to `Header`, `Sidebar`, and `LandingView` in place of the previous `setView`/`handleNavigate`; preserve the existing `window.scrollTo({ top: 0, behavior: 'smooth' })` on navigate
- [X] T014 [US2] Verify Scenario G from [quickstart.md](./quickstart.md) manually: back returns to landing (not exit), forward returns to calculator, multi-step back chain lands/fitr/landing in order

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Currency Names Appear in Arabic When the App Is Arabic (Priority: P2)

**Goal**: When the UI language is Arabic, currency selectors and results render Arabic currency names (e.g. جنيه مصري instead of EGP) for every currency surfaced from the rate source; English stays ISO codes; missing names fall back to ISO.

**Independent Test**: Switch to Arabic, open a Mal currency selector — every entry shows its Arabic name; calculate and check the result currency renders its Arabic name. Switch to English — ISO codes return. See [quickstart.md](./quickstart.md) Scenario I.

### Implementation for User Story 3

- [X] T015 [P] [US3] Populate `src/utils/currencyNames.js` with `CURRENCY_NAMES_AR` — a frozen `Object.freeze` map of ISO code → Arabic display name covering every code in `POPULAR_CURRENCIES` plus every ISO code the `open.er-api.com/v6/latest/USD` endpoint returns (e.g. `USD:'دولار أمريكي'`, `EGP:'جنيه مصري'`, `SAR:'ريال سعودي'`, `EUR:'يورو'`, `GBP:'جنيه إسترليني'`, `AED:'درهم إماراتي'`, `KWD:'دينار كويتي'` … full list per [contracts/i18n-catalog.md](./contracts/i18n-catalog.md) "Coverage rule")
- [X] T016 [P] [US3] Implement `currencyDisplayName(code, lang)` in `src/utils/currency.js` that returns `CURRENCY_NAMES_AR[code]` when `lang === 'ar'` and a name exists, otherwise returns `code` (ISO fallback, FR-016/FR-017); import `CURRENCY_NAMES_AR` from `./currencyNames.js`
- [X] T017 [P] [US3] Extend `src/i18n/__tests__/translations.test.js` with assertions that `POPULAR_CURRENCIES.every(code => CURRENCY_NAMES_AR[code])` (Principle III coverage rule from [contracts/i18n-catalog.md](./contracts/i18n-catalog.md)), then run `npm test` to confirm
- [X] T018 [US3] Wire `currencyDisplayName` into `src/components/WealthRow.jsx` (currency `<option>` labels) and `src/views/MalView.jsx` (result currency display) using `lang` from `useI18n()`; pass `lang` into the row component so options render Arabic names in Arabic mode and ISO codes in English
- [X] T019 [US3] Verify Scenario I from [quickstart.md](./quickstart.md) manually: Arabic shows currency names everywhere, English shows ISO codes, no empty/undefined labels

**Checkpoint**: User Stories 1, 2, AND 3 all work independently.

---

## Phase 6: User Story 4 - Back Button Closes an Open Sidebar Before Navigating (Priority: P2)

**Goal**: With the mobile sidebar drawer open, the first back press closes the sidebar (current page unchanged); a second back press then navigates normally.

**Independent Test**: Open the sidebar, press back once — sidebar closes, page stays; press back again — normal navigation occurs. See [quickstart.md](./quickstart.md) Scenario H.

### Implementation for User Story 4

- [X] T020 [US4] Extend `useViewHistory({ views, initialView, isSidebarOpen, onCloseSidebar })` in `src/hooks/useViewHistory.js` with the sentinel pattern from [contracts/navigation-api.md](./contracts/navigation-api.md): expose `onSidebarOpen()` (pushes `{ view, sidebar: true }` sentinel) and `onSidebarClosed()` (calls `history.back()` to pop the sentinel); in the `popstate` handler, if `event.state?.sidebar === true` call `onCloseSidebar()` and do NOT change `view`
- [X] T021 [US4] Wire `src/App.jsx` to pass `isSidebarOpen` and `onCloseSidebar={() => setSidebarOpen(false)}` into `useViewHistory`; call `onSidebarOpen()` from the sidebar-toggle handler when the sidebar transitions closed→open, and `onSidebarClosed()` when it closes by click-away or item selection (in `src/components/Sidebar.jsx`)
- [X] T022 [US4] Verify Scenario H from [quickstart.md](./quickstart.md) manually: first back closes sidebar (page unchanged), second back navigates; also verify manual close (click-away / item select) keeps the history stack aligned (no extra back press needed afterwards)

**Checkpoint**: All four user stories independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, build verification, and cross-story validation.

- [X] T023 [P] Update `README.md` to document the multi-currency Zakat Al-Mal flow (enter wealth in multiple currencies; app aggregates to USD; result in USD) and the in-app back/forward navigation behavior, preserving the scholarly disclaimer
- [X] T024 Run `npm test` and confirm the full suite passes (`calculateMal` back-compat, `calculateMalMulti` vectors, i18n parity incl. new keys and currency-name coverage)
- [X] T025 Run `npm run build` and `npm run preview`; confirm the production build succeeds and Scenarios A, G, H, I from [quickstart.md](./quickstart.md) work against the built output (Constitution Principle II — static SPA, no server component)
- [X] T026 Run the full manual validation matrix [quickstart.md](./quickstart.md) Scenarios A–K in both Arabic (RTL) and English (LTR) and in both light and dark themes; confirm SC-006 (bilingual + theme parity)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories (US1 and US3 both need the new i18n keys).
- **User Stories (Phase 3–6)**: All depend on Foundational completion.
  - US1 (Phase 3) — MVP, no dependency on other stories.
  - US2 (Phase 4) — independent of US1; can run in parallel with US1 after Foundational.
  - US3 (Phase 5) — depends on US1 (extends `WealthRow.jsx` and `MalView.jsx` rendering that US1 created).
  - US4 (Phase 6) — depends on US2 (extends the `useViewHistory` hook that US2 created).
- **Polish (Phase 7)**: Depends on all four user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational. No dependencies on other stories.
- **US2 (P1)**: Starts after Foundational. Independent of US1 (different files: `src/hooks/useViewHistory.js`, `src/App.jsx` view wiring vs `src/domain/mal.js`, `src/views/MalView.jsx`). Can be done in parallel with US1.
- **US3 (P2)**: Starts after US1 — US3 wires `currencyDisplayName` into `WealthRow.jsx`/`MalView.jsx` that US1 introduces.
- **US4 (P2)**: Starts after US2 — US4 extends `useViewHistory` (built in US2) with the sidebar sentinel.

### Within Each User Story

- Constitution-mandated calculation tests (US1: T005, T006) written FIRST and FAILING before implementation (T007).
- Pure domain logic before view/component code.
- View integration before manual scenario validation.
- Story checkpoint reached only after its quickstart scenarios pass.

### Parallel Opportunities

- T002 sub-tasks (four scaffold files) — all parallel.
- T005 and T006 (US1 test vectors, same file but additive) — parallel.
- T009 (WealthRow) parallel with T007 (calculateMalMulti) — different files, no dependency.
- T015 (currencyNames catalog) and T016 (helper) parallel with US1/US2 work once US3 phase starts (different files).
- US1 (Phase 3) and US2 (Phase 4) can be worked in parallel by different developers after Foundational, since they touch disjoint files.

---

## Parallel Example: User Story 1

```bash
# Launch US1 test vectors together (both additive to the same test file):
Task: "T005 Add success-case vectors for calculateMalMulti in src/domain/__tests__/mal.test.js"
Task: "T006 Add failure-case vectors for calculateMalMulti in src/domain/__tests__/mal.test.js"

# After tests FAIL, launch implementation in parallel (different files):
Task: "T007 Implement calculateMalMulti in src/domain/mal.js"
Task: "T009 Implement WealthRow in src/components/WealthRow.jsx (+ WealthRow.module.css)"
```

## Parallel Example: Post-Foundational (US1 + US2)

```bash
# After Phase 2, two developers can work in parallel:
Developer A (US1): T005 → T006 → T007 → T008 → T009 → T010 → T011
Developer B (US2): T012 → T013 → T014
# Files are disjoint: A touches src/domain/mal.js, src/views/MalView.jsx, src/components/WealthRow*;
# B touches src/hooks/useViewHistory.js, src/App.jsx.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (scaffold files).
2. Complete Phase 2: Foundational (i18n keys + parity test).
3. Complete Phase 3: User Story 1 (multi-currency Zakat Al-Mal).
4. **STOP and VALIDATE**: Run `npm test`; manually run quickstart Scenarios A, B, C, D, J.
5. The app now delivers the primary new capability — multi-currency zakat — even though back navigation is still broken.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add US1 → test independently → demo (MVP).
3. Add US2 → test independently → demo (back button fixed).
4. Add US3 → test independently → demo (Arabic currency names).
5. Add US4 → test independently → demo (sidebar-aware back).
6. Polish → README, full build, full validation matrix.

### Parallel Team Strategy

With two developers after Foundational:
- Developer A: US1 then US3 (US3 depends on US1's files).
- Developer B: US2 then US4 (US4 depends on US2's hook).
Both chains converge at Phase 7 (Polish).

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [Story] labels map tasks to specific user stories for traceability.
- Each user story is independently completable and testable per its quickstart scenario(s).
- Constitution-mandated tests (calculation logic + i18n parity) are written BEFORE implementation and must FAIL first; UI/navigation behavior is validated manually via [quickstart.md](./quickstart.md) (no DOM test runner configured).
- Commit after each task or logical group; do not commit secrets.
- Stop at any checkpoint to validate the story independently before proceeding.
