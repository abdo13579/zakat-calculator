# Feature Specification: Constitution Stack Amendment (v2.0.0)

**Feature Branch**: `001-constitution-stack-amendment`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "create spec for only phase 0" — Phase 0 of `implementation-plan.md`:
amend the project constitution (v1.0.0 → v2.0.0, MAJOR) to permit a Vite + React + CSS Modules
stack before any migration code lands, per the constitution's own Governance section.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Maintainer legitimizes the new technology stack (Priority: P1)

The project maintainer needs the constitution's stack principle — which currently prohibits
frameworks and build steps outright — redefined so that the planned React migration can proceed
without violating project governance. The redefined principle must still keep the project lean:
static output, no server component, and justification required for any new dependency.

**Why this priority**: This is the entire unblock. Every subsequent phase of the implementation
plan (React migration, redesign, Al-Anaam calculator) is governance-illegal until this principle
is amended. Without it, no code can be written.

**Independent Test**: Read the amended Principle II and verify that (a) a Vite + React + CSS
Modules application is permitted, (b) the dependency-justification rule is retained, and (c) the
static-hosting constraint is preserved. Delivers a constitutionally valid foundation on its own.

**Acceptance Scenarios**:

1. **Given** the ratified v1.0.0 constitution, **When** the amendment is applied, **Then** the
   stack principle permits Vite + React + CSS Modules and no longer states "no frameworks, no
   build step".
2. **Given** the amended stack principle, **When** a reviewer checks it for lean-stack
   safeguards, **Then** it still requires written justification for new dependencies and still
   mandates static, serverless hosting.
3. **Given** the amended constitution, **When** compared against v1.0.0, **Then** Principles I
   (Shariah Accuracy), IV (Graceful Degradation), and V (Client-Side Privacy) are unchanged in
   substance.

---

### User Story 2 - Contributors get workflow rules aligned with the new stack (Priority: P2)

A contributor (human or AI agent) preparing a pull request needs the Development Workflow and
Additional Constraints sections to describe the world after the migration: automated calculation
tests as a merge gate, the updated technology constraints, and the updated deployment process —
while keeping the existing bilingual/RTL/theme manual verification checklist intact.

**Why this priority**: An amended principle without updated workflow rules leaves governance
internally inconsistent — reviewers would enforce checklists referencing files and mechanisms
that no longer exist after migration. Second only to the unblock itself.

**Independent Test**: Read the amended workflow and constraints sections and verify every review
gate references something that will actually exist post-migration (test command, translation
mechanism, build/deploy process), and that the manual bilingual/RTL/theme checklist survives.

**Acceptance Scenarios**:

1. **Given** the amended workflow section, **When** a reviewer checks a pull request against it,
   **Then** it requires automated calculation-logic tests to pass before merge.
2. **Given** the amended constraints section, **When** audited against the implementation plan,
   **Then** it reflects the new stack and manual static deployment while preserving the keyless,
   CORS-enabled public API constraints.
3. **Given** the amended constitution, **When** the i18n-related principle is read, **Then** it
   no longer mandates the legacy `data-i18n` attribute mechanism but still mandates full EN/AR
   parity, RTL correctness, and accessibility.

---

### User Story 3 - Governance integrity is demonstrably preserved (Priority: P3)

The maintainer needs the amendment itself to follow the constitution's own Governance rules:
correct SemVer bump classification, preserved ratification date, updated amendment date, and a
Sync Impact Report documenting exactly what changed — so the amendment is auditable and sets the
precedent for future amendments.

**Why this priority**: It does not change what the constitution permits, but it proves the
governance process works and makes the amendment reviewable. Important, but the document would
still function without it.

**Independent Test**: Inspect the amended file's version line and prepended Sync Impact Report
and verify bump-type rationale (principle redefinition = MAJOR), date handling, and the
old-principle → new-principle mapping are all present and internally consistent.

**Acceptance Scenarios**:

1. **Given** the amendment redefines an existing principle, **When** the version is assigned,
   **Then** it is a MAJOR bump (1.0.0 → 2.0.0) with the rationale recorded.
2. **Given** the amended document, **When** the version line is inspected, **Then** the
   ratification date (2026-08-16) is preserved and the last-amended date equals the amendment
   date.
3. **Given** the amended document, **When** scanned for unresolved placeholders, **Then** no
   unexplained bracketed tokens remain anywhere outside the Sync Impact Report's intentional
   old-name references.

---

### Edge Cases

- What if the amendment accidentally weakens Shariah-accuracy, degradation, or privacy
  principles? The amendment MUST be rejected in review; these are out of amendment scope here.
- What if the bump type is misclassified (e.g., MINOR)? The governance check must catch that a
  principle redefinition is backward-incompatible with v1.0.0 and therefore MAJOR.
- What if workflow gates reference post-migration tooling before the migration exists? The
  amendment lands first by design; the implementation plan sequences Phase 1 immediately after,
  and until then review gates are interpreted against the pre-migration stack.
- What if only some sections are updated (partial amendment)? The sync report and validation
  must ensure constraints, workflow, and principles are amended as one coherent unit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The constitution MUST replace the principle that prohibits frameworks and build
  steps ("Buildless Vanilla Stack") with a principle that permits a lean static single-page
  application stack (Vite + React + CSS Modules), retains mandatory written justification for
  any new dependency, and retains the static-serverless-hosting constraint.
- **FR-002**: The bilingual/accessibility principle MUST be updated so it no longer mandates the
  legacy `data-i18n` attribute mechanism, while continuing to mandate full English/Arabic
  parity, correct RTL rendering, semantic markup, ARIA labeling, keyboard operability, and
  light/dark theme support.
- **FR-003**: Principles I (Shariah Accuracy First), IV (Graceful Degradation of Live Data), and
  V (Client-Side Privacy and Transparency) MUST remain substantively unchanged.
- **FR-004**: The Development Workflow section MUST add passing automated calculation-logic
  tests as a merge gate and MUST retain the existing manual verification checklist (bilingual
  parity, RTL, themes, known-input results).
- **FR-005**: The Additional Constraints section MUST be updated to describe the post-migration
  stack and manual static deployment (including the repository-name base path), while preserving
  the documented keyless, CORS-enabled public data endpoints unchanged.
- **FR-006**: The version MUST be bumped MAJOR (1.0.0 → 2.0.0) per the constitution's own
  versioning policy, the ratification date MUST be preserved, and the last-amended date MUST be
  set to the amendment date in ISO format.
- **FR-007**: A Sync Impact Report MUST be prepended as an HTML comment documenting the version
  change, the redefined/renamed principles (old title → new title), added and removed sections,
  and any deferred follow-ups.
- **FR-008**: The amended document MUST contain no unresolved placeholder tokens and MUST keep
  the existing heading hierarchy of the ratified template.

### Key Entities *(include if feature involves data)*

- **Constitution**: The single governance document at `.specify/memory/constitution.md`;
  attributes: version, ratification date, last-amended date, principles, constraint sections,
  governance rules.
- **Principle**: A named, numbered, non-negotiable rule with rationale; the unit of amendment
  (one redefined, one reworded, three preserved).
- **Sync Impact Report**: The prepended audit comment recording the amendment delta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the implementation plan's Phase 1 work items (React migration) can be
  executed without violating any ratified principle — verified by checking each planned work
  item against the amended constitution.
- **SC-002**: The amendment passes the constitution's own governance validation: bump type
  matches change class (principle redefinition = MAJOR), dates are ISO format, version line
  matches the Sync Impact Report — zero discrepancies.
- **SC-003**: All five principles remain individually testable: a reviewer can determine, for
  each principle, whether a given pull request complies, with no subjective judgment required
  for the pass/fail call.
- **SC-004**: The amendment is delivered as a single self-contained change touching exactly one
  file (`.specify/memory/constitution.md`) and is approved in one review cycle without
  correction requests.

## Assumptions

- The amendment scope is defined by Phase 0 of `implementation-plan.md`, which was reviewed and
  accepted; this spec does not re-open those decisions.
- Amendment authorship and approval rest with the project maintainer via the normal pull-request
  review, satisfying the Governance section's "documented rationale + maintainer approval"
  requirement.
- The amendment precedes any migration code; no application source files change as part of this
  feature.
- The ratification date (2026-08-16) is the constitution's original adoption date and is
  preserved; the last-amended date is set when the amendment is applied.
- The new stack principle's exact title and wording are finalized during the amendment itself
  (the constitution workflow owns the document text); this spec fixes only the required
  substance.
