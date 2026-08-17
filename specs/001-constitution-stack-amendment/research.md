# Research: Constitution Stack Amendment (v2.0.0)

**Phase 0 output** — all decisions were resolved during the implementation-plan interview and
the specify pass; no external unknowns remained. This document consolidates them in
Decision / Rationale / Alternatives form.

## D1. Version bump classification

- **Decision**: MAJOR — 1.0.0 → 2.0.0.
- **Rationale**: Principle II is being *redefined*, not clarified. v1.0.0 forbids what v2.0.0
  permits (frameworks, bundler), which is backward-incompatible governance — the constitution's
  own versioning policy assigns MAJOR to "principle removals or redefinitions".
- **Alternatives considered**: MINOR (rejected — a redefinition is not an additive expansion;
  misclassification would fail the governance self-check, SC-002); no bump (rejected — violates
  the constitution's SemVer policy outright).

## D2. Substance of the redefined stack principle

- **Decision**: Replace "Buildless Vanilla Stack" with a "lean static SPA" principle that (a)
  permits Vite + React + CSS Modules, (b) retains mandatory written justification for any new
  dependency, (c) retains static, serverless hosting as a hard constraint.
- **Rationale**: Permits the planned migration while keeping the original principle's *intent*
  (trivial deployability, auditability, low barrier to contribution) enforceable through the
  retained justification and hosting rules.
- **Alternatives considered**: unrestricted stack freedom (rejected — removes the lean safeguard
  that made the project maintainable); a fixed framework whitelist without a justification rule
  (rejected — brittle; every future tool decision would require another MAJOR amendment).

## D3. i18n principle wording

- **Decision**: Reword Principle III to mandate outcomes (full EN/AR parity, correct RTL,
  semantic markup, ARIA, keyboard operability, both themes) without mandating the legacy
  `data-i18n` attribute mechanism.
- **Rationale**: Governance should bind *outcomes*, not mechanisms; the React migration replaces
  `data-i18n` with an i18n Context (interview decision #6), and the constitution must not force
  a DOM-attribute pattern onto a component architecture.
- **Alternatives considered**: keep `data-i18n` (rejected — binds governance to a mechanism the
  migration deletes); name a specific React i18n library (rejected — over-specifies; the custom
  Context hook was already chosen in the interview).

## D4. Workflow gate addition

- **Decision**: Development Workflow gains "automated calculation-logic tests MUST pass before
  merge" alongside the retained manual checklist (bilingual parity, RTL, themes, known-input
  results). Additional Constraints names the post-migration stack and the manual static-deploy
  process with the repository-name base path.
- **Rationale**: Principle I makes calculation accuracy the top risk; an automated gate is the
  cheapest enforcement. The manual checklist remains because RTL/a11y verification is not
  automated in this project.
- **Alternatives considered**: manual-only verification (rejected — insufficient for the
  bracket-heavy Al-Anaam logic arriving in Phase 3); fully automated UI testing mandate
  (rejected — disproportionate for a static SPA of this size).

## D5. Amendment execution path

- **Decision**: Execute the amendment through the existing constitution workflow
  (`/speckit.constitution`), which owns template resolution, placeholder validation, and Sync
  Impact Report generation.
- **Rationale**: The workflow already encodes the validation rules FR-006–FR-008 require;
  reusing it avoids hand-rolled drift and dogfoods the governance process.
- **Alternatives considered**: direct hand-edit of the file (rejected — bypasses the established
  validation and reporting steps; sets a bad precedent for future amendments).

## D6. Date handling

- **Decision**: Ratified date preserved at 2026-08-16 (original adoption); Last Amended set to
  the date the amendment is applied, ISO format.
- **Rationale**: Matches the constitution workflow's date semantics and the spec's FR-006.
- **Alternatives considered**: resetting ratification to the amendment date (rejected — erases
  the adoption history the field exists to record).
