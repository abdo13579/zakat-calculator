# Implementation Tasks: Zakat Al-Anaam (Livestock) Calculator

**Feature Branch**: `feature/004-livestock-zakat-calculator`
**Specification**: [spec.md](spec.md)
**Implementation Plan**: [plan.md](plan.md)
**Contracts**: [contracts/calculation-api.md](contracts/calculation-api.md), [contracts/i18n-anaam-contract.md](contracts/i18n-anaam-contract.md)  

---

## Phase 1: Setup (Translations & Scaffolding)

**Purpose**: Establish the bilingual translation keys, view components, and navigation entry points.

- [X] T001 [P] Add all English and Arabic translation keys for Zakat Al-Anaam to `src/i18n/translations.js` per i18n contract
- [X] T002 [P] Create initial domain calculation module scaffold in `src/domain/anaam.js` with exported empty functions
- [X] T003 [P] Create initial test suite scaffold in `src/domain/__tests__/anaam.test.js`

---

## Phase 2: Foundational (Core Domain Infrastructure & Eligibility)

**Purpose**: Core calculation input validation and Shariah eligibility evaluation that all livestock species depend on.

- [X] T004 Implement `evaluateEligibility` in `src/domain/anaam.js` to evaluate Sa'imah (grazing), non-working status, and 1-year Hawl
- [X] T005 Implement input sanitization, integer checks, and null-on-invalid error semantics in `src/domain/anaam.js`
- [X] T006 [P] Add unit tests for eligibility conditions and input sanitization in `src/domain/__tests__/anaam.test.js`

---

## Phase 3: User Story 1 - Calculate Zakat on Sheep/Goats (Priority: P1) 🎯 MVP

**Goal**: Enable users to calculate Shariah-accurate Zakat on sheep and goats (*Ghanam* / الغنم) with full English/Arabic support.

**Independent Test**: Enter numbers across sheep brackets (39 $\to$ 0, 40 $\to$ 1, 120 $\to$ 1, 121 $\to$ 2, 200 $\to$ 2, 201 $\to$ 3, 260 $\to$ 3, 399 $\to$ 3, 400 $\to$ 4, 500 $\to$ 5) and verify instant, accurate results.

### Tests for User Story 1
- [X] T007 [P] [US1] Add unit test vectors for all sheep/goat bracket boundaries (39, 40, 120, 121, 200, 201, 260, 399, 400, 499, 500) in `src/domain/__tests__/anaam.test.js`

### Implementation for User Story 1
- [X] T008 [US1] Implement `calculateSheepGoats` function and wire into `calculateAnaam` in `src/domain/anaam.js`
- [X] T009 [US1] Create `src/views/AnaamView.module.css` with design tokens and CSS logical properties
- [X] T010 [US1] Create `src/views/AnaamView.jsx` with species selection, count input, result rendering, and clipboard copy
- [X] T011 [US1] Register `anaam` view in `src/App.jsx`, `src/components/Header.jsx`, `src/components/Sidebar.jsx`, and `src/views/LandingView.jsx`

**Checkpoint**: User Story 1 is functional as an MVP — sheep/goat Zakat can be calculated end-to-end in English and Arabic.

---

## Phase 4: User Story 2 - Calculate Zakat on Cattle (Priority: P1)

**Goal**: Enable users to calculate Zakat on cattle and water buffalo (*Baqar* / البقر) including the $\ge 130$ waqs decomposition ($40y + 30x$).

**Independent Test**: Enter cattle numbers (29 $\to$ 0, 30 $\to$ 1 Tabi', 40 $\to$ 1 Musinnah, 60 $\to$ 2 Tabi', 70 $\to$ 1 Musinnah + 1 Tabi', 75 $\to$ 1 Musinnah + 1 Tabi', 120 $\to$ 3 Musinnah, 130 $\to$ 1 Musinnah + 3 Tabi', 140 $\to$ 2 Musinnah + 2 Tabi') and verify exact output.

### Tests for User Story 2
- [X] T012 [P] [US2] Add unit test vectors for all cattle brackets, waqs cases (65, 75), and $\ge 130$ combinations in `src/domain/__tests__/anaam.test.js`

### Implementation for User Story 2
- [X] T013 [US2] Implement `calculateCattle` with optimal $40y + 30x$ integer decomposition in `src/domain/anaam.js`
- [X] T014 [US2] Update `src/views/AnaamView.jsx` to render cattle results with multiple animal types (Musinnah + Tabi') and age descriptions

**Checkpoint**: User Stories 1 and 2 both operate independently and accurately.

---

## Phase 5: User Story 3 - Calculate Zakat on Camels (Priority: P1)

**Goal**: Enable users to calculate Zakat on camels (*Ibil* / الإبل) across all 10 standard brackets and $>120$ waqs decomposition ($50x + 40y$).

**Independent Test**: Enter camel counts (4 $\to$ 0, 5 $\to$ 1 Shah, 24 $\to$ 4 Shah, 25 $\to$ 1 Bint Makhad, 36 $\to$ 1 Bint Labun, 46 $\to$ 1 Hiqqah, 61 $\to$ 1 Jadha'ah, 76 $\to$ 2 Bint Labun, 91 $\to$ 2 Hiqqah, 120 $\to$ 2 Hiqqah, 140 $\to$ 2 Hiqqah + 1 Bint Labun, 200 $\to$ 4 Hiqqah) and verify exact output.

### Tests for User Story 3
- [X] T015 [P] [US3] Add unit test vectors for all 10 camel brackets, $>120$ waqs decompositions (130, 135, 140, 150), and tie resolutions (200) in `src/domain/__tests__/anaam.test.js`

### Implementation for User Story 3
- [X] T016 [US3] Implement `calculateCamels` with all 10 brackets and $>120$ $50x + 40y$ decomposition in `src/domain/anaam.js`
- [X] T017 [US3] Update `src/views/AnaamView.jsx` to render camel results displaying specific fiqh terms and secondary alternatives where applicable

**Checkpoint**: All three livestock categories (Sheep/Goats, Cattle, Camels) calculate accurately according to fiqh rules.

---

## Phase 6: User Story 4 - Understand Zakat Eligibility Conditions (Priority: P2)

**Goal**: Provide an interactive eligibility checklist with diagnostic explanations for stall-fed, working, or incomplete-Hawl herds.

**Independent Test**: Uncheck any eligibility condition in `AnaamView` and verify appropriate informational alert is displayed explaining why livestock Zakat is not due.

### Implementation for User Story 4
- [X] T018 [US4] Add interactive eligibility checklist UI controls (Sa'imah, Non-working, Hawl) in `src/views/AnaamView.jsx`
- [X] T019 [US4] Implement conditional diagnostic message panels explaining exemptions (stall-fed trade goods Zakat note, working animal exemption, Hawl requirement) in `src/views/AnaamView.jsx`

**Checkpoint**: Users receive clear guidance on Shariah eligibility criteria before and during calculation.

---

## Phase 7: User Story 5 - Complete Reference Schedules & Disclaimers (Priority: P3)

**Goal**: Display full reference brackets and scholarly disclaimer in `AnaamView` and update the About methodology page.

**Independent Test**: Verify reference tables and scholarly disclaimer are accessible in `AnaamView` and `AboutView` in both English and Arabic.

### Implementation for User Story 5
- [X] T020 [P] [US5] Add collapsible/expandable reference schedule tables for all species in `src/views/AnaamView.jsx`
- [X] T021 [P] [US5] Add Zakat Al-Anaam methodology and scholarly disclaimer section in `src/views/AboutView.jsx`

**Checkpoint**: Complete educational reference and disclaimers are available across the application.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification, accessibility, documentation, and regression testing.

- [X] T022 [P] Run full test suite (`npm test`) to ensure zero regressions across all calculators
- [X] T023 [P] Update `README.md` with Zakat Al-Anaam usage, calculation formulas, and scholarly disclaimer
- [X] T024 Perform manual verification following `quickstart.md` (English/Arabic RTL parity, light/dark theme contrast, keyboard accessibility, result copy)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
     ↓
Phase 2: Foundational (Eligibility & Input Validation)
     ↓
Phase 3: User Story 1 (Sheep/Goats) [MVP]
     ↓
Phase 4: User Story 2 (Cattle)
     ↓
Phase 5: User Story 3 (Camels)
     ↓
Phase 6: User Story 4 (Eligibility Guidance)
     ↓
Phase 7: User Story 5 (Reference Schedules & About View)
     ↓
Phase 8: Polish & Cross-Cutting Verification
```

### User Story Dependencies

- **US1 (Sheep/Goats - P1)**: Depends on Phase 1 & 2. Delivers the core MVP calculator.
- **US2 (Cattle - P1)**: Extends `anaam.js` with cattle logic and updates `AnaamView.jsx`.
- **US3 (Camels - P1)**: Extends `anaam.js` with camel brackets/waqs and updates `AnaamView.jsx`.
- **US4 (Eligibility - P2)**: Adds interactive checklist and diagnostic panels in `AnaamView.jsx`.
- **US5 (Reference Tables - P3)**: Adds reference accordion and updates `AboutView.jsx`.

---

## Parallel Opportunities

```bash
# Phase 1 Parallel Setup:
T001 (translations.js) || T002 (anaam.js scaffold) || T003 (anaam.test.js scaffold)

# User Story Tests (TDD):
T007 (Sheep tests) can be written before T008
T012 (Cattle tests) can be written before T013
T015 (Camel tests) can be written before T016

# Phase 7 Documentation & About View:
T020 (AnaamView reference) || T021 (AboutView methodology)

# Phase 8 Polish:
T022 (npm test) || T023 (README.md)
```

---

## Implementation Strategy (MVP First)

1. **Phase 1 + 2**: Complete translations and foundational module structure.
2. **Phase 3 (MVP)**: Deliver sheep/goat calculation with navigation integration. Test independently.
3. **Phase 4**: Add cattle calculation with $40y + 30x$ waqs decomposition.
4. **Phase 5**: Add camel calculation with all 10 brackets and $>120$ $50x + 40y$ decomposition.
5. **Phase 6 + 7**: Add eligibility checklist, diagnostic feedback, reference tables, and About view methodology.
6. **Phase 8**: Run full Vitest suite, verify RTL/theme compatibility, and update documentation.
