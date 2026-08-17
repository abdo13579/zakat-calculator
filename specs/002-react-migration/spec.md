# Feature Specification: React Migration with Feature & Visual Parity

**Feature Branch**: `002-react-migration`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "phase 1 only, and this time pull changes from remote and create a
branch" — Phase 1 of `implementation-plan.md`: migrate ZakatCalc from vanilla HTML/CSS/JS to
Vite + React (JSX) + CSS Modules with exact feature and visual parity, automated calculation
tests, and manual static deployment. No design changes and no new features in this phase.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - End user experiences zero change (Priority: P1)

A user of the current live app visits the rebuilt app and cannot tell anything changed: all
three calculators (Zakat Al-Fitr, Zakat Al-Mal, Zakat Al-Zuru) accept the same inputs and return
the same results; the full English/Arabic experience with correct RTL layout works; dark/light
theme toggle persists their preference; copy-to-clipboard works; loading and error states behave
the same; and the offline-capable calculators keep working without a network connection.

**Why this priority**: Parity is the entire promise of this phase. The migration exists to
change the codebase, not the product — any user-visible difference is a defect. Every later
phase (redesign, Al-Anaam) builds on this baseline.

**Independent Test**: Run the rebuilt app side by side with the legacy live site and walk every
screen in both languages and both themes, on desktop and mobile widths, comparing behavior and
appearance; run each calculator on the known-input test set and compare results.

**Acceptance Scenarios**:

1. **Given** the rebuilt app and the legacy app, **When** the same known inputs are entered into
   each of the three calculators, **Then** both apps return identical results (amounts, Nisaab
   checks, and due/not-due outcomes).
2. **Given** the rebuilt app in Arabic, **When** any screen is viewed, **Then** every string has
   an Arabic entry, the layout is fully RTL, and no string appears untranslated.
3. **Given** a user who selected dark theme, **When** they close and reopen the app, **Then**
   the dark theme is still active.
4. **Given** the network is unavailable, **When** the user runs Zakat Al-Fitr or Zakat Al-Zuru,
   **Then** results are produced normally with no errors.
5. **Given** the live-data endpoints fail, **When** the user runs Zakat Al-Mal, **Then** a clear
   user-visible error is shown, the app does not crash, and no silently stale result is
   displayed.

---

### User Story 2 - Maintainer gains a trustworthy, maintainable codebase (Priority: P2)

The maintainer gets a modular component codebase where calculation logic lives in pure,
separately testable functions guarded by automated tests that assert the documented Zakat
formulas; translations live in editable language-data files (English and Arabic) rather than
being embedded in markup; and theme/language behavior is centralized instead of scattered
through one large script.

**Why this priority**: This is the reason the migration exists — but it only matters once
parity (P1) is proven. Automated calculation tests are the standing enforcement mechanism for
the constitution's Shariah-accuracy principle, and they become critical for the bracket-heavy
Al-Anaam logic arriving in Phase 3.

**Independent Test**: Run the automated test suite (all calculation tests must pass); add a
translation key to both language files and confirm it renders without touching component code;
locate each calculator's math in a single pure module.

**Acceptance Scenarios**:

1. **Given** the migrated codebase, **When** the automated test suite runs, **Then** every
   calculation test passes, covering each calculator's documented formula including boundary
   cases (e.g., wealth exactly at Nisaab, harvest exactly at 600 kg).
2. **Given** a new user-facing string, **When** entries are added to the English and Arabic
   language data only, **Then** the string renders correctly in both languages with no
   component changes.
3. **Given** any calculation formula is changed incorrectly, **When** the test suite runs,
   **Then** at least one automated test fails — demonstrating the safety net works.

---

### User Story 3 - Maintainer publishes to the same URL with the same simplicity (Priority: P3)

The maintainer can build the app into static files and publish them manually to the existing
static host so the app keeps working at its current public URL — with no server-side component,
no API keys, and no change to the hosting arrangement.

**Why this priority**: Necessary to ship, but it is a maintainer-facing operational outcome and
depends on P1/P2 being worth shipping. The current zero-infrastructure hosting is a
constitution-level constraint and must survive the migration intact.

**Independent Test**: Build the app, publish the output to the host, and verify the public URL
loads the app with all assets, runs every calculator, and works when refreshed or opened
directly.

**Acceptance Scenarios**:

1. **Given** a fresh checkout, **When** the documented build command runs, **Then** a static
   output directory is produced that requires no server-side runtime.
2. **Given** the built output is published to the static host, **When** the public URL is
   opened, **Then** the app loads with zero broken asset references and all calculators work.
3. **Given** the published app, **When** Zakat Al-Mal runs with network access, **Then** it
   uses the same two documented keyless public endpoints as before, with no API keys required.

---

### Edge Cases

- What happens when the gold-price or exchange-rate endpoint fails mid-calculation? A clear
  error state is shown; the app never crashes and never displays a silently stale result.
- How does the app behave fully offline? Zakat Al-Fitr and Zakat Al-Zuru work end-to-end; Zakat
  Al-Mal reports that live data is unavailable.
- What happens when the user switches language mid-calculation? All visible strings, including
  results and errors, render in the newly selected language with correct direction.
- What happens on a hard refresh of the published site? The app loads correctly under its
  hosted sub-path with no broken assets.
- What happens to legacy vanilla source files? They are removed only after parity is verified
  and signed off — never before.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The rebuilt app MUST provide the same three calculators with identical outcomes
  for known inputs: Zakat Al-Fitr (total weight = persons × 3.0 kg; value = weight × price per
  kg), Zakat Al-Mal (Nisaab = 85 g × current gold price per gram, converted to the selected
  currency; Zakat = 2.5% of wealth when wealth ≥ Nisaab, otherwise none), and Zakat Al-Zuru
  (Nisaab = 600 kg; rates 10% rainfed, 5% irrigated, 7.5% mixed).
- **FR-002**: Every user-facing string MUST have both English and Arabic entries; Arabic MUST
  render in a fully RTL layout; language switching MUST be one click and apply everywhere,
  including results and error messages.
- **FR-003**: The app MUST offer dark and light themes with the selection persisted across
  sessions.
- **FR-004**: Every live-data fetch MUST show a loading state, handle failure explicitly with a
  clear user-visible error, and MUST never crash the app or display a silently stale result.
- **FR-005**: Zakat Al-Fitr and Zakat Al-Zuru MUST remain fully functional with no network
  access.
- **FR-006**: Users MUST be able to copy any calculation result to the clipboard.
- **FR-007**: All calculation logic MUST be covered by automated tests asserting the documented
  formulas, including boundary cases (exactly at Nisaab, just below Nisaab).
- **FR-008**: The app MUST NOT require a server-side component or API keys, MUST NOT transmit
  user-entered data anywhere, and MUST contact only the two documented keyless public endpoints
  (currency exchange rates, gold price).
- **FR-009**: The app MUST build to static files deployable under the existing hosted sub-path
  (`/zakat-calculator/`) and MUST be publishable manually to the existing host.
- **FR-010**: Legacy vanilla source files MUST be removed only after parity verification is
  signed off, and the README MUST be updated to reflect the new development, build, and
  deployment workflow.

### Key Entities *(include if feature involves data)*

- **Calculator**: One of three Zakat tools (Fitr, Mal, Zuru); attributes: inputs, formula,
  Nisaab threshold (where applicable), offline capability, result presentation.
- **Translation Catalog**: The complete set of user-facing strings; two instances exist
  (English, Arabic); every key MUST exist in both.
- **Theme Preference**: The user's light/dark choice; persisted locally on the device.
- **Market Data**: Live exchange rates and gold price fetched on demand; attributes: values,
  fetch timestamp, failure state; never persisted beyond the session and never keyed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Side-by-side comparison of the rebuilt app against the legacy live site (both
  languages, both themes, desktop and mobile) finds zero unintended visual or behavioral
  differences.
- **SC-002**: 100% of the known-input test set produces identical results across all three
  calculators when compared to the legacy app.
- **SC-003**: 100% of calculation functions are covered by automated tests, and the full suite
  passes on the final build.
- **SC-004**: Zakat Al-Fitr and Zakat Al-Zuru complete end-to-end with the network fully
  disabled, with zero errors.
- **SC-005**: The published app at the existing public URL loads with zero broken asset
  references, and every user journey (all calculators, language toggle, theme toggle, copy)
  completes successfully.
- **SC-006**: 100% of user-facing strings have both English and Arabic entries; no untranslated
  string appears in either language.

## Assumptions

- The constitution amendment v2.0.0 (feature 001) is ratified and merged, so this migration is
  governance-legal; the amended Principle II (Lean Static SPA Stack) governs this work.
- The current live site is the parity baseline; "identical" is judged against it.
- Locked decisions from the implementation-plan interview apply: a custom in-app translation
  mechanism (no i18n library), state-driven navigation (no routing library), automated
  calculation tests, and manual deployment to the static host.
- No design changes, new features, or new dependencies beyond the migration baseline are in
  scope; the icon approach stays as-is (the icon-library decision is deferred to Phase 2).
- The two public data endpoints remain available, keyless, and CORS-enabled; if one must be
  replaced, the replacement obeys the same constraints per the constitution.
