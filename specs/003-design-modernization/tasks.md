# Tasks: Design Modernization

**Branch**: `003-design-modernization` | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup

**Purpose**: Establish the expanded design token foundation and no-FOUC theme initialization that all subsequent work depends on.

- [X] T001 Expand the design token scale in `src/styles/tokens.css` — replace the current 7 variables with the full two-tier token system (Primitive: color-primary-50→900, color-neutral-50→900, color-accent-50→900, color-error/success/info, spacing scale, radius scale, shadow scale, font-size scale, font-weight scale, transition durations; Semantic: color-bg, color-surface, color-surface-elevated, color-on-surface, color-on-surface-muted, color-interactive, color-interactive-hover, color-border, color-border-subtle, color-focus-ring, shadow-card, shadow-elevated) per the token scale in `specs/003-design-modernization/data-model.md`. Light mode values in `:root`, dark mode overrides in `body.dark-mode`. Preserve backward-compatible aliases for `--primary-color`, `--accent-color`, `--white-color`, `--text-color`, `--background-color`, `--border-color`, `--error-color` mapping to their semantic equivalents so existing consumers don't break during migration.
- [X] T002 Add blocking inline `<script>` tags in `index.html`: one in the `<head>` targeting `document.documentElement` and one in the `<body>` (before `#root`) targeting `document.body`, both reading `localStorage.getItem('zakatcalc_theme')` and applying the `dark-mode` class before first paint to prevent flash-of-unstyled-content, matching the `body.dark-mode` token structure per research decision R7 in `specs/003-design-modernization/research.md`.
- [X] T003 Add CSS transition declarations for theme-sensitive properties (`background-color`, `color`, `border-color`, `box-shadow`) with `0.15s ease` duration to the `body`, `.page`, and common container selectors in `src/styles/global.css` to enable smooth theme switching.

**Checkpoint**: Tokens defined, backward-compatible aliases in place, FOUC prevention active. App should look identical to before (aliases map to original values) but with the new token infrastructure ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migrate `global.css` from hardcoded colors to token references and from physical to logical properties. This unblocks all user story phases.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Refactor `src/styles/global.css` — replace all hardcoded color values (`#01a0ab`, `#6c757d`, `#28a745`, `#155724`, `#d4edda`, `#c3e6cb`, `#1e3a1e`, `#90ee90`, `#2d5a2d`, `#d6fcff`, `#111827`, `#020617`, `#e5e7eb`, `#1f2937`, `rgba(1, 197, 211, 0.1)`, `rgba(1, 197, 211, 0.3)`) with their semantic token equivalents (`var(--color-interactive-hover)`, `var(--color-on-surface-muted)`, `var(--color-success)`, etc.). Update the `body.dark-mode` block to only override semantic tokens (already done in T001's `tokens.css`), removing duplicated dark-mode color overrides from `global.css`.
- [X] T005 Migrate all physical directional properties in `src/styles/global.css` to CSS logical equivalents per the migration map in `specs/003-design-modernization/contracts/ui-contracts.md` — replace `text-align: left` with `text-align: start`, `border-left` with `border-inline-start`, etc. Delete all `body[dir="rtl"]` override blocks from `global.css` (`body[dir="rtl"] .feature-card`, `body[dir="rtl"] .form-group`, `body[dir="rtl"] .results-container`, `body[dir="rtl"] .about-content`).
- [X] T006 Refactor the `.cta-button` styles in `src/styles/global.css` to use token references — apply the Button contract from `specs/003-design-modernization/contracts/ui-contracts.md` (token-based colors, `var(--radius-md)`, `var(--transition-fast)`, hover/focus/active/disabled states using `var(--color-interactive)`, `var(--color-interactive-hover)`, `var(--color-focus-ring)`).
- [X] T007 Refactor the `.form-group input` and `.form-group select` styles in `src/styles/global.css` to use token references — apply the Text Input and Select contracts from `specs/003-design-modernization/contracts/ui-contracts.md` (token-based borders, focus rings, error/valid states, `var(--radius-md)`, `var(--transition-fast)`). Remove the hardcoded `#28a745` valid border color and `translateY(-1px)` on focus.
- [X] T008 Refactor the `.results-container` styles in `src/styles/global.css` to use the Card (Surface variant) contract — token-based background (`var(--color-surface)`), border (`var(--color-border)`), shadow (`var(--shadow-card)`), accent border using `border-inline-start: 3px solid var(--color-interactive)` (logical property, auto-mirrors for RTL). Remove the dedicated RTL override block for `.results-container`.
- [X] T009 Refactor the `.success-message` styles in `src/styles/global.css` to use semantic tokens — replace hardcoded success colors with token equivalents for both light and dark modes. Remove the separate `body.dark-mode .success-message` block (handled by token switching).
- [X] T010 Apply the Typography Scale contract from `specs/003-design-modernization/contracts/ui-contracts.md` to `h1`, `h2`, `h3`, `.section-helper-text`, and body text styles in `src/styles/global.css` — use `var(--text-2xl)`, `var(--text-xl)`, `var(--text-lg)`, `var(--text-sm)`, `var(--weight-bold)`, `var(--weight-semibold)`, etc.
- [X] T011 Add the `.input-group` and `.input-addon` base styles to `src/styles/global.css` per the Input Group contract in `specs/003-design-modernization/contracts/ui-contracts.md` — flex container, `flex: 1` input, `flex: none` addon, seamless border join using logical border-radius properties, focus-within treatment, muted addon background.

**Checkpoint**: `global.css` fully tokenized and using logical properties. Zero hardcoded colors outside `tokens.css`. Zero `body[dir="rtl"]` overrides in `global.css`. All base component styles (button, input, select, card, input-group) defined via tokens. App should render correctly in both themes and both directions.

---

## Phase 3: User Story 1 — Refined Visual Experience Across Themes (Priority: P1) 🎯 MVP

**Goal**: Deliver the polished color palette, dark mode depth with 3 elevation levels, and typographic hierarchy across all pages.

**Independent Test**: Load the app in light and dark modes. Verify neutral backgrounds (not cyan tint), layered dark mode surfaces, and consistent typography. Run quickstart V2 (no-FOUC) and V3 (dark mode depth).

### Implementation for User Story 1

- [X] T012 [US1] Update `src/components/Header.module.css` — replace all hardcoded colors with token references (`var(--color-surface-elevated)` for header background, `var(--color-interactive)` for logo/nav, `var(--shadow-elevated)` for header shadow). Remove `box-shadow: none` from dark mode treatment — use `var(--shadow-elevated)` which already has dark-aware values. Replace `rgba(0,0,0,0.1)` shadow with `var(--shadow-elevated)`.
- [X] T013 [P] [US1] Update `src/components/Footer.module.css` — replace hardcoded `#6c757d` with `var(--color-on-surface-muted)`, replace `var(--white-color)` with `var(--color-surface)`, remove `body.dark-mode .footer { box-shadow: none; }` block.
- [X] T014 [P] [US1] Update `src/views/AboutView.module.css` — replace `var(--white-color)` with `var(--color-surface)`, add `var(--shadow-card)` for card elevation, replace `var(--border-color)` with `var(--color-border)`. Remove the `body[dir="rtl"] .content` block (replace `text-align: left` with `text-align: start` on `.content`). Remove the `body.dark-mode .content` block that sets `box-shadow: none`.
- [X] T015 [P] [US1] Update `src/views/LandingView.module.css` — replace `var(--white-color)` with `var(--color-surface)`, replace hardcoded shadows (`0 2px 6px rgba(0,0,0,0.06)` and `0 4px 12px rgba(0,0,0,0.12)`) with `var(--shadow-card)` and `var(--shadow-elevated)`, replace `var(--border-color)` with `var(--color-border)`, update `border-radius: 10px` to `var(--radius-lg)`. Remove `body[dir="rtl"] .card` block (replace `text-align: left` with `text-align: start`).
- [X] T016 [US1] Update `src/components/ResultCard.module.css` — replace hardcoded colors in `.actionBtn` with token references, replace `rgba(0, 0, 0, 0.1)` shadow with `var(--shadow-sm)`, replace hardcoded `.cta-button:hover` color `#01a0ab` with `var(--color-interactive-hover)` and shadow `rgba(1, 197, 211, 0.3)` with `var(--color-focus-ring)`, replace `var(--background-color)` in `.loader` with `var(--color-border)` for the loader ring track.
- [X] T017 [P] [US1] Update `src/views/MalView.module.css` — replace hardcoded loader colors with token references (match T016 loader pattern). Remove duplicated `@keyframes spin` (already in ResultCard.module.css or define once in global.css).
- [X] T018 [US1] Update `src/components/GlobalMessage.module.css` — replace all hardcoded info/error colors (`#e7f5ff`, `#084298`, `#b6d4fe`, `#ffe3e6`, `#842029`, `#f5c2c7`, `#0f172a`, `#e5e7eb`, `#1e293b`, `#7f1d1d`, `#fee2e2`, `#991b1b`) with semantic token references for info/error states in both themes. Remove the `body.dark-mode .info` and `body.dark-mode .error` blocks (handled by token theme switching).
- [X] T019 [US1] Visual verification — load every page (Landing, Fitr, Mal, Zuru, About) in both light and dark modes. Confirm: (1) light mode has neutral background (not cyan `#d6fcff`), (2) dark mode has 3 distinguishable surface levels (base, surface, elevated), (3) typography hierarchy is consistent, (4) no hardcoded colors remain outside `tokens.css` (run: `grep -rn '#[0-9a-fA-F]\{3,8\}' src/ --include='*.css' | grep -v tokens.css`).

**Checkpoint**: US1 complete. The app looks modern in both themes with clear depth, neutral backgrounds, and consistent typography. Zero hardcoded colors outside tokens.

---

## Phase 4: User Story 2 — Consistent, Reusable Interface Components (Priority: P2)

**Goal**: Unify all form controls (buttons, inputs, selects) and card components across Fitr, Mal, and Zuru so they share identical visual treatment.

**Independent Test**: Navigate between all three calculators. Verify buttons, inputs, selects, and result cards look identical. Run quickstart V4 (form control consistency).

### Implementation for User Story 2

- [X] T020 [US2] Migrate `src/components/Header.module.css` to logical properties — replace `right: -300px`/`left: 0` positioning patterns with `inset-inline-end`, remove all `body[dir="rtl"] .headerContainer`, `body[dir="rtl"] .desktopNav`, `body[dir="rtl"] .headerActions` blocks. Replace `flex-direction: row-reverse` RTL overrides with direction-agnostic flex layout.
- [X] T021 [US2] Migrate `src/components/Sidebar.module.css` to logical properties — replace `right: -300px`/`left: -300px` with `inset-inline-end: -300px`, `box-shadow: -2px` / `2px` with logical shadow, remove all `body[dir="rtl"] .sidebar` and `body[dir="rtl"] .open` override blocks. Use `inset-inline-end: 0` for the `.open` state.
- [X] T022 [P] [US2] Ensure `src/views/FitrView.module.css` has token-based component styles — verify the form controls inherit the global `.form-group`, `.cta-button` token styles (from T006/T007). Add any view-specific refinements using tokens only.
- [X] T023 [P] [US2] Ensure `src/views/MalView.module.css` has token-based component styles — same verification as T022 for Mal view form controls.
- [X] T024 [P] [US2] Ensure `src/views/ZuruView.module.css` has token-based component styles — same verification as T022 for Zuru view form controls.
- [X] T025 [US2] Cross-view consistency verification — open Fitr, Mal, and Zuru side by side (or tab between them). Verify: identical button styling (radius, padding, hover effect), identical input styling (border, focus ring, error state), identical select styling, identical result card appearance.

**Checkpoint**: US2 complete. All form controls and cards visually identical across all three calculator views.

---

## Phase 5: User Story 3 — Enhanced Form Interaction Clarity (Priority: P3)

**Goal**: Add inline currency/unit indicator badges to form inputs across all calculator views so users can immediately see what unit each input expects.

**Independent Test**: Fill out each calculator form. Verify currency codes and unit labels are visible adjacent to inputs. Run quickstart V5 (input group indicators).

### Implementation for User Story 3

- [X] T026 [US3] Update `src/views/FitrView.jsx` — wrap the food price input in a `.input-group` container with a `.input-addon` span showing the selected currency code. Wrap the number-of-individuals input similarly if a unit label applies. Connect addon to input via `aria-describedby`. Wrap the food price weight input with a "kg" addon.
- [X] T027 [US3] Add input-group specific styles to `src/views/FitrView.module.css` — import/extend the base `.input-group` and `.input-addon` styles from global.css, add any Fitr-specific refinements (e.g., addon width adjustments).
- [X] T028 [P] [US3] Update `src/views/MalView.jsx` — wrap the wealth input in a `.input-group` container with a `.input-addon` span showing the selected currency code. Connect addon to input via `aria-describedby`.
- [X] T029 [P] [US3] Add input-group specific styles to `src/views/MalView.module.css` — extend the base input-group styles, add any Mal-specific refinements.
- [X] T030 [P] [US3] Update `src/views/ZuruView.jsx` — wrap the harvest weight input in a `.input-group` container with a `.input-addon` span showing "kg". Connect addon to input via `aria-describedby`.
- [X] T031 [P] [US3] Add input-group specific styles to `src/views/ZuruView.module.css` — extend the base input-group styles, add any Zuru-specific refinements.
- [X] T032 [US3] Verify input group rendering in both LTR and RTL — switch between English and Arabic on all three calculator pages. Confirm addons appear at `inline-end` and the border join is seamless in both directions.

**Checkpoint**: US3 complete. Every monetary/weight input has a visible, direction-aware unit or currency badge.

---

## Phase 6: User Story 4 — Seamless RTL/LTR Direction Support (Priority: P4)

**Goal**: Eliminate all remaining `body[dir="rtl"]` CSS overrides by completing the logical property migration across all CSS Module files.

**Independent Test**: Switch between Arabic and English on every page. Verify zero misalignments. Run quickstart V6 (RTL/LTR correctness) and the zero-match grep check.

### Implementation for User Story 4

- [X] T033 [US4] Audit all CSS files for remaining `body[dir="rtl"]` blocks — run `grep -rn 'body\[dir="rtl"\]' src/ --include='*.css'` and list every remaining override that wasn't already removed in Phases 2–5.
- [X] T034 [US4] Migrate any remaining physical properties found in T033 to logical equivalents per the migration map in `specs/003-design-modernization/contracts/ui-contracts.md` and delete the corresponding `body[dir="rtl"]` blocks.
- [X] T035 [US4] Update `src/components/Sidebar.jsx` — verify the sidebar open/close animation logic works with logical CSS properties (the `isOpen` class toggling `inset-inline-end: 0` from T021). Ensure click-outside dismissal still works correctly in RTL mode.
- [X] T036 [US4] Full RTL/LTR regression test — switch to Arabic, navigate every page (Landing, Fitr, Mal, Zuru, About), open/close sidebar, perform a calculation, view results, copy result. Then switch to English and repeat. Verify zero misalignments, correct border placement, correct sidebar animation direction. Run: `grep -rn 'body\[dir="rtl"\]' src/ --include='*.css'` — expected: zero matches.

**Checkpoint**: US4 complete. Zero `body[dir="rtl"]` overrides in the codebase. All layout direction handled by logical properties.

---

## Phase 7: User Story 5 — Declarative Notification Feedback (Priority: P5)

**Goal**: Replace the imperative DOM-based notification system with a declarative React ToastContext, providing consistent toast notifications across all pages.

**Independent Test**: Trigger success (copy) and error (network) notifications on multiple pages. Verify identical appearance, animation, and auto-dismiss. Run quickstart V7 (toast notifications).

### Implementation for User Story 5

- [X] T037 [US5] Create `src/toast/ToastContext.jsx` — implement the ToastProvider and `useToast()` hook per the Toast Notification entity in `specs/003-design-modernization/data-model.md`. State shape: `{ id, type, message, duration }`. Expose `toast.success(msg)`, `toast.error(msg)`, `toast.info(msg)` methods. Render a fixed-position toast container. Auto-dismiss after 5 seconds. Replacement strategy (not stacking). Include `role="status"` and `aria-live="polite"` on the toast container.
- [X] T038 [US5] Create toast CSS styles — either extend `src/components/GlobalMessage.module.css` or create `src/toast/Toast.module.css` with styles per the Toast Notification contract in `specs/003-design-modernization/contracts/ui-contracts.md`: fixed top-center positioning below header, max-width 480px, slide-down entrance / slide-up exit animations (150ms), success/error/info variant colors using semantic tokens, dark mode support via tokens.
- [X] T039 [US5] Update `src/App.jsx` — wrap the app content with `<ToastProvider>` (inside existing `<ThemeProvider>` and `<I18nProvider>`). Remove the `globalMessage` state, the `handleGlobalError` function, the `zakatcalc:clear-global-message` event listener, and the `<GlobalMessage>` component render. Replace `onGlobalError` prop on `<MalView>` with the toast context (MalView will call `useToast()` directly).
- [X] T040 [US5] Update `src/main.jsx` — add the `ToastProvider` import. Ensure provider ordering is: `I18nProvider` → `ThemeProvider` → `ToastProvider` → `App`.
- [X] T041 [US5] Refactor `src/components/ResultCard.jsx` — remove the `showSuccessMessage()` function (imperative DOM creation), remove the `legacyCopy()` fallback's DOM-based textarea approach (keep navigator.clipboard with a simple fallback). Import and use `useToast()` hook. Call `toast.success(t('copied-success'))` on successful copy instead of injecting a DOM element.
- [X] T042 [US5] Update `src/views/MalView.jsx` — remove the `onGlobalError` prop usage. Import and use `useToast()` hook. Call `toast.error(message)` for gold price or rate fetch errors instead of calling `onGlobalError`.
- [X] T043 [US5] Update `src/App.jsx` — remove the `onGlobalError` prop passed to `<MalView>` (now handled internally by MalView via ToastContext). Clean up any unused imports (`GlobalMessage`).
- [X] T044 [US5] Remove or repurpose `src/components/GlobalMessage.jsx` and `src/components/GlobalMessage.module.css` — if no longer used anywhere, delete both files. If the component needs to remain for backward compatibility, leave it as a thin wrapper around `useToast()`.
- [X] T045 [US5] Remove the global `.success-message` styles from `src/styles/global.css` (the imperative toast styles are no longer needed since toasts are now rendered by ToastContext with their own module CSS).
- [X] T046 [US5] Toast notification verification — trigger success notification (copy result on Fitr, Mal, Zuru pages) and error notification (disable network in DevTools, reload Mal page for gold price fetch). Verify: consistent appearance, smooth animation, auto-dismiss after ~5 seconds, correct positioning below header, works in both themes and both directions.

**Checkpoint**: US5 complete. All notifications flow through the declarative ToastContext. Zero imperative DOM manipulation for notifications.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, verification, and build validation.

- [X] T047 [P] Run the full hardcoded color audit: `grep -rn '#[0-9a-fA-F]\{3,8\}' src/ --include='*.css' | grep -v tokens.css` — fix any remaining hardcoded colors found.
- [X] T048 [P] Run the RTL override audit: `grep -rn 'body\[dir="rtl"\]' src/ --include='*.css'` — fix any remaining physical override blocks found.
- [X] T049 [P] Run `npm run build` and verify the production build succeeds with no errors or warnings. Run `npm run preview` and verify the built app loads correctly per quickstart V9.
- [X] T050 Perform the full quickstart validation — execute all 10 validation scenarios from `specs/003-design-modernization/quickstart.md` (V1–V10) on the development server. Document pass/fail for each.
- [X] T051 Remove backward-compatible token aliases from `src/styles/tokens.css` — delete the aliases for `--primary-color`, `--accent-color`, `--white-color`, `--text-color`, `--background-color`, `--border-color`, `--error-color` that were added in T001. These are no longer needed since all consumers have been migrated. Verify no CSS file still references the old token names.
- [X] T052 Accessibility regression check — tab through the entire app with keyboard only. Verify all interactive elements are focusable with visible focus indicators. Check `role="status"` and `aria-live="polite"` on toast container. Verify semantic HTML structure preserved (`<header>`, `<main>`, `<footer>`). Per quickstart V10.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001 tokens must exist before T004–T011 can reference them)
- **User Stories (Phases 3–7)**: All depend on Phase 2 completion (global.css must be tokenized first)
  - US1 (Phase 3): Can start after Phase 2
  - US2 (Phase 4): Can start after Phase 2 — partially depends on US1 tokens being verified
  - US3 (Phase 5): Can start after Phase 2 — depends on T011 (input-group base styles)
  - US4 (Phase 6): Best done after US1–US3 are complete (audits remaining RTL blocks)
  - US5 (Phase 7): Can start after Phase 2 — independent of US1–US4
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **US2 (P2)**: Can start after Phase 2 — Benefits from US1 being done (tokens verified)
- **US3 (P3)**: Can start after Phase 2 — Requires T011 (input-group styles from Phase 2)
- **US4 (P4)**: Best after US1–US3 — Audits remaining RTL blocks as cleanup
- **US5 (P5)**: Can start after Phase 2 — Fully independent of US1–US4

### Within Each User Story

- CSS updates before JSX markup changes
- Base styles before view-specific styles
- Implementation before verification tasks

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T004–T011 in Phase 2: T005/T006/T007/T008/T009/T010/T011 all modify `global.css` — execute sequentially. However, T004 must come first (removes hardcoded colors that others reference).
- Phase 3: T013, T014, T015, T017 can run in parallel (different CSS module files)
- Phase 5: T028/T029, T030/T031 can run in parallel (different view files)
- Phase 7: T037 and T038 can run in parallel (JSX context vs CSS styles)
- Phase 8: T047, T048, T049 can all run in parallel

---

## Parallel Example: User Story 1

```text
# Sequential first:
T012 — Header.module.css (token migration + elevation)

# Then parallel (different files):
T013 — Footer.module.css (token migration)
T014 — AboutView.module.css (token migration)
T015 — LandingView.module.css (token migration)
T017 — MalView.module.css (loader token migration)

# Then sequential:
T016 — ResultCard.module.css (depends on token patterns established above)
T018 — GlobalMessage.module.css (token migration)

# Then verification:
T019 — Visual check + grep audit
```

## Parallel Example: User Story 5

```text
# Parallel (different files):
T037 — ToastContext.jsx (new file)
T038 — Toast styles (new CSS file)

# Then sequential:
T039 — App.jsx (add ToastProvider, remove GlobalMessage)
T040 — main.jsx (provider ordering)
T041 — ResultCard.jsx (consume useToast)
T042 — MalView.jsx (consume useToast)
T043 — App.jsx (cleanup)
T044 — Delete GlobalMessage files
T045 — Remove .success-message from global.css
T046 — Verification
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T011)
3. Complete Phase 3: User Story 1 (T012–T019)
4. **STOP and VALIDATE**: App should look modern in both themes with tokenized colors and depth
5. Deploy/demo if ready — this alone is a significant visual improvement

### Incremental Delivery

1. Setup + Foundational → Token infrastructure ready
2. Add US1 → Modern visual experience → **Deploy (MVP!)**
3. Add US2 → Consistent components → Deploy
4. Add US3 → Input group indicators → Deploy
5. Add US4 → Clean RTL logical properties → Deploy
6. Add US5 → Declarative toast notifications → Deploy
7. Polish → Final cleanup and validation → Deploy

### Recommended Sequential Order

For a single developer, execute in strict phase order (1 → 2 → 3 → 4 → 5 → 6 → 7 → 8) since each phase builds on the previous. US5 (Phase 7) could be done earlier (after Phase 2) if notifications are a higher priority, as it's fully independent.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US*] label maps task to specific user story for traceability
- Each user story is independently completable and testable after Phase 2
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate the current state independently
- Phase 2 touches `global.css` heavily — tasks T004–T011 should be done sequentially within that phase to avoid merge conflicts
