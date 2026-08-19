---
description: "Task list for feature 006-support-us-page implementation"
---

# Tasks: Support Us Page & Cross-Site Support Link

**Input**: Design documents from `/specs/006-support-us-page/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contracts.md, quickstart.md

**Tests**: No new test tasks are generated. The feature relies on the existing `src/i18n/__tests__/translations.test.js` parity test as its automated gate (run in the Polish phase). The spec does not request new unit/integration tests; validation is manual per `quickstart.md`.

**Organization**: Tasks are grouped by user story. US1 (P1, navigation entry points) and US2 (P1, page content) together form the MVP; US3 (P2, bottom prompt) is incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g. US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project (static SPA)**: `src/` at repository root, plus `README.md` at repo root.
- Paths follow the existing ZakatCalc layout (`src/components/`, `src/views/`, `src/i18n/`, `src/hooks/`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the working branch and that the existing project builds and tests pass before any changes (baseline).

- [x] T001 Verify on branch `006-support-us-page` and run `npm install` to confirm dependencies are present (no new dependencies will be added this feature)
- [x] T002 Run `npm test` and `npm run build` to confirm a green baseline before changes; do not commit any baseline-only output

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared i18n keys, register the `support` view in the navigation/history system, and create a minimal `SupportView` stub so that all three user stories have a routing target and translated strings to consume.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. The i18n keys and view registration are consumed by every story.

- [x] T003 Add 14 new key pairs to BOTH `en` and `ar` objects in `src/i18n/translations.js`: `nav-support`, `support-title`, `support-intro`, `support-vote-title`, `support-vote-text`, `support-vote-link`, `support-contribute-title`, `support-contribute-text`, `support-contribute-link`, `support-star-title`, `support-star-text`, `support-star-link`, `footer-support-prompt`, `support-link-aria`. Arabic values must be natural, non-empty, RTL-correct phrasings. No `{token}` placeholders (URLs stay in JSX). See data-model.md i18n table and contracts/ui-contracts.md C-I18N-3 for guidance.
- [x] T004 Add `'support'` to the default `views` array in `src/hooks/useViewHistory.js` (insert immediately before `'about'`): `['landing', 'fitr', 'mal', 'zuru', 'anaam', 'support', 'about']` (per contracts/ui-contracts.md C-ROUTE-1)
- [x] T005 Add `'support'` to the `views` array passed to `useViewHistory` in `src/App.jsx` (currently line 36), insert immediately before `'about'` (per C-ROUTE-1)
- [x] T006 Create `src/views/SupportView.jsx` as a minimal stub: `export function SupportView() { const { t } = useI18n(); return (<section id="support" className="page"><h2>{t('support-title')}</h2></section>); }` — imports `useI18n` from `../i18n/I18nContext.jsx`. Full content is added in US2. (per C-VIEW-1)
- [x] T007 Create `src/views/SupportView.module.css` containing ONLY the `.content` rule copied verbatim from `src/views/AboutView.module.css:1-9` for now (link styles added in US2). (per C-VIEW-3)
- [x] T008 Add the `SupportView` render branch to `<main>` in `src/App.jsx` (currently lines 94-101): insert `{view === 'support' && <SupportView />}` immediately before the `about` branch, and add `import { SupportView } from './views/SupportView.jsx';` at the top. (per C-ROUTE-2)

**Checkpoint**: Foundation ready — `support` is a registered, routable view with a stub page and all translated strings available. Run `npm test` to confirm the i18n parity test still passes (it must, since keys were added to both languages).

---

## Phase 3: User Story 1 - Reach the Support Us Page from Desktop and Mobile Navigation (Priority: P1) 🎯 MVP

**Goal**: A labeled "Support" link appears in the desktop top nav bar and the mobile sidebar drawer (both positioned immediately before "About"), is marked active on the Support page, and routes to the Support page with working back navigation.

**Independent Test**: On desktop, confirm a "Support" link appears in the top nav before "About" and clicking it navigates to the Support page (stub) with the link marked active. On mobile, open the sidebar, confirm a "Support" entry appears before "About", tap it, and confirm the drawer closes and the Support page appears; pressing back returns to the prior page.

### Implementation for User Story 1

- [x] T009 [P] [US1] Add `{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support', fullLabelKey: 'nav-support' }` to the `navItems` array in `src/components/Header.jsx` (currently lines 9-16), inserted immediately before the `about` entry. No other changes — the existing `.map`, `.active` class logic, and `onNavigate` handler already cover the new item. (per C-NAV-1)
- [x] T010 [P] [US1] Add `{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support' }` to the `ITEMS` array in `src/components/Sidebar.jsx` (currently lines 5-12), inserted immediately before the `about` entry. No other changes — existing render, active-state, and tap-to-close logic cover the new item. (per C-NAV-2)

**Checkpoint**: User Story 1 is functional — "Support" is reachable from both desktop nav and mobile sidebar, marked active on the Support page, and back navigation works. (US1 + US2 together form the full MVP; US1 alone shows a stub page.)

---

## Phase 4: User Story 2 - Read Three Concrete Ways to Support the Project (Priority: P1) 🎯 MVP

**Goal**: The Support Us page displays a title, an intro paragraph, and three titled sections (Vote on Mortakaz, Contribute on GitHub, Star the repo), each with explanatory text and an external link that opens in a new tab with `rel="noopener"`. Typography and the content card match the About page.

**Independent Test**: Navigate to the Support page and confirm three titled sections with explanatory text and working links (vote → mortakaz URL, contribute → GitHub URL, star → GitHub URL), each opening in a new tab. Compare heading/paragraph styling and the content card to the About page — they must match. Toggle Arabic and confirm all text and RTL layout are correct.

### Implementation for User Story 2

- [x] T011 [US2] Expand `src/views/SupportView.jsx` from the stub into the full structure per contracts/ui-contracts.md C-VIEW-2: wrap content in `<div className={styles.content}>`, add `<p>{t('support-intro')}</p>`, then three blocks each with `<h3>{t('support-*-title')}</h3>`, `<p>{t('support-*-text')}</p>`, and `<p><a href="<URL>" target="_blank" rel="noopener">{t('support-*-link')}</a></p>`. Hardcode the URLs in JSX (NOT in i18n): vote → `https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4`, contribute → `https://github.com/abdo13579/zakat-calculator`, star → `https://github.com/abdo13579/zakat-calculator`. Optionally define a local `SUPPORT_OPTIONS` constant array and map over it (see data-model E1). No `fetch`/service imports. (per C-VIEW-2, C-VIEW-4, C-VIEW-5)
- [x] T012 [US2] Add the link styling rules to `src/views/SupportView.module.css` (after the existing `.content` rule): `.content a` (color `--color-interactive`, semibold, underline, transition), `.content a:hover` (`--color-interactive-hover`), `.content a:focus-visible` (focus ring via `--color-focus-ring`). Use only existing design tokens. (per C-VIEW-3)

**Checkpoint**: User Story 2 is functional — the Support page shows three support options with correct, safe external links and About-matching typography. Together with US1, the MVP is complete: users can reach and read the support options.

---

## Phase 5: User Story 3 - See a Support Prompt at the Bottom of Every Page (Priority: P2)

**Goal**: A reworded, clickable support question appears at the bottom of every non-Support page (in the shared footer) and navigates to the Support page on click. It is hidden on the Support page itself.

**Independent Test**: Visit Home, each calculator, and About — confirm the support prompt appears above the copyright line. Click it — confirm it navigates to the Support page and back returns to the origin. Visit the Support page — confirm the prompt is absent. Toggle Arabic and confirm the prompt text is translated with RTL.

### Implementation for User Story 3

- [x] T013 [US3] Update the `Footer` component signature and render in `src/components/Footer.jsx` to accept `{ currentView, onNavigate }` props (alongside the existing `useI18n()`). Add the conditional prompt block above the existing copyright `<p>`: render only when `currentView !== 'support' && onNavigate`, as `<p className={styles.supportPrompt}><a href="#" className={styles.supportLink} onClick={(e) => { e.preventDefault(); onNavigate('support'); }} aria-label={t('support-link-aria')}>{t('footer-support-prompt')}</a></p>`. Keep the existing `<p>{t('footer-text')}</p>` unconditional. (per C-FOOTER-1, C-FOOTER-2)
- [x] T014 [US3] Pass the new props to Footer from `src/App.jsx`: change `<Footer />` (currently line 102) to `<Footer currentView={view} onNavigate={navigate} />`. (per C-ROUTE-3)
- [x] T015 [US3] Add `.supportPrompt` and `.supportLink` rules to `src/components/Footer.module.css` (do NOT modify the existing `.footer` rule): `.supportPrompt` (margin, `--text-sm`), `.supportLink` (interactive color, medium weight, underline, cursor pointer, transition), `.supportLink:hover` (`--color-interactive-hover`), `.supportLink:focus-visible` (focus ring). Use only existing design tokens. (per C-FOOTER-3)

**Checkpoint**: User Story 3 is functional — the bottom support prompt appears on every non-Support page, is hidden on the Support page, and navigates with working back behavior. All three user stories are now complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: README documentation, final automated gates, and end-to-end manual validation.

- [x] T016 [P] Add a new `## Support` section to `README.md` immediately after the existing `## Contributing` section (around line 266) and before `## License & Author`, listing all three support options with their links (mortakaz + GitHub repo). Do not modify any existing section's content. (per C-README-1)
- [x] T017 [P] Add `SupportView.jsx` and `SupportView.module.css` entries to the Project Structure tree in `README.md` (around lines 162-171), in alphabetical position among the views. (per C-README-2)
- [x] T018 Run `npm test` and confirm the i18n parity test passes (en/ar key-set parity, non-empty values, no unknown `{token}` placeholders). This is the primary automated gate for the feature. (per quickstart.md A1)
- [x] T019 Run `npm run build` and confirm the production build succeeds with zero errors. (per quickstart.md A2)
- [x] T020 Run the manual validation scenarios M1–M7 from `specs/006-support-us-page/quickstart.md` in both English and Arabic and in both light and dark themes; confirm each produces the expected outcome.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. Confirms a green baseline.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories (i18n keys + view registration + stub are consumed by every story).
- **US1 (Phase 3)**: Depends on Foundational. Adds nav entries; the stub from T006/T008 is its navigation target.
- **US2 (Phase 4)**: Depends on Foundational (needs the i18n keys + stub file to expand). Fills in the page content.
- **US3 (Phase 5)**: Depends on Foundational (needs `footer-support-prompt`/`support-link-aria` keys + the registered `support` view to navigate to).
- **Polish (Phase 6)**: Depends on all user stories being complete (README reflects the final view; validation covers the full feature).

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only. Independently testable (nav appears, routes to the stub page, active state + back work). No dependency on US2 or US3.
- **US2 (P1)**: Depends on Foundational only. Independently testable (the page content renders; can be reached via the stub route or US1's nav). No dependency on US1 or US3.
- **US3 (P2)**: Depends on Foundational only. Independently testable (footer prompt shows on existing pages and navigates to the registered `support` view). No dependency on US1 or US2 beyond the Foundational-provided view target.
- **MVP**: US1 + US2 together (both P1) form the complete minimum viable product — users can reach and read the support options.

### Within Each User Story

- Foundational i18n keys and view registration come first (Phase 2).
- Component/markup tasks come next; CSS tasks are paired with their component.
- No services, no models, no endpoints — the feature is purely presentational.

### Parallel Opportunities

- **Phase 2**: T003 (translations.js), T004 (useViewHistory.js), T006/T007 (new SupportView files) touch different files and can run in parallel; T005 and T008 both edit `src/App.jsx` so they must be sequential (T005 before T008, or combined).
- **Phase 3**: T009 (Header.jsx) and T010 (Sidebar.jsx) are different files → parallel.
- **Phase 4**: T011 (SupportView.jsx) and T012 (SupportView.module.css) are different files → parallel.
- **Phase 5**: T013 (Footer.jsx) and T015 (Footer.module.css) are different files → parallel; T014 (App.jsx) is independent of those two → can also run in parallel with them.
- **Phase 6**: T016 and T017 both edit README.md → sequential; T018/T019 are verification commands; T020 is manual.

---

## Parallel Example: User Story 1

```bash
# Launch the two nav-entry tasks together (different files):
Task: "Add support nav item to src/components/Header.jsx (T009)"
Task: "Add support nav item to src/components/Sidebar.jsx (T010)"
```

## Parallel Example: User Story 3

```bash
# Launch the three US3 tasks together (different files, no inter-dependencies):
Task: "Update Footer component in src/components/Footer.jsx (T013)"
Task: "Pass Footer props in src/App.jsx (T014)"
Task: "Add footer prompt styles in src/components/Footer.module.css (T015)"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup (green baseline).
2. Complete Phase 2: Foundational (i18n keys, view registration, stub).
3. Complete Phase 3: US1 (nav entries) and Phase 4: US2 (page content) — these two P1 stories form the MVP.
4. **STOP and VALIDATE**: Run `npm test`, `npm run build`, and manual scenarios M1–M4. Confirm users can reach and read the three support options in both languages and both themes.
5. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → Foundation ready (registered `support` view, all strings, stub page).
2. Add US1 → Test independently (nav entries route to the stub).
3. Add US2 → Test independently (page shows three options) → **MVP complete**.
4. Add US3 → Test independently (bottom prompt on every non-Support page).
5. Polish → README updates, full validation (M1–M7), build verification.

### Parallel Team Strategy

With multiple developers after Foundational completes:
- Developer A: US1 (Header.jsx, Sidebar.jsx)
- Developer B: US2 (SupportView.jsx, SupportView.module.css)
- Developer C: US3 (Footer.jsx, Footer.module.css, App.jsx Footer props)
All three stories touch disjoint file sets (except App.jsx, where the US1/US2 view branch and the US3 Footer props are small, separate edits that can be sequenced or merged trivially).

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks.
- [Story] label maps task to specific user story for traceability.
- No new dependencies are added; `package.json` and `package-lock.json` must remain unchanged (Constitution Principle II).
- No new outbound requests; `SupportView` must not import `src/services/api.js` or call `fetch` (Constitution Principles II, IV, V).
- No calculation logic changes; `src/domain/*.js` and all calculator views are untouched (Constitution Principle I).
- The existing `translations.test.js` is the automated gate — do NOT edit it; adding keys to both `en` and `ar` keeps it green.
- External link URLs are hardcoded in JSX, never as `{token}` in translation values (preserves the placeholder allowlist test).
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
