# Implementation Plan: Constitution Stack Amendment (v2.0.0)

**Branch**: `001-constitution-stack-amendment` | **Date**: 2026-08-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-constitution-stack-amendment/spec.md`

## Summary

Amend `.specify/memory/constitution.md` from v1.0.0 to v2.0.0 (MAJOR): redefine Principle II
("Buildless Vanilla Stack") into a lean static-SPA stack principle permitting Vite + React +
CSS Modules with retained dependency-justification and static-hosting safeguards; reword
Principle III to drop the legacy `data-i18n` mandate while keeping full EN/AR parity, RTL, and
accessibility requirements; update Additional Constraints and Development Workflow for the
post-migration world (automated calculation-test merge gate, manual static deployment); preserve
Principles I, IV, and V unchanged; and prepend a Sync Impact Report. This is a single-file,
documentation-only governance change executed through the constitution workflow, and it is the
mandatory unblock for Phase 1 of `implementation-plan.md` (React migration).

## Technical Context

**Language/Version**: Markdown governance document; no application code

**Primary Dependencies**: Spec Kit template resolver (`resolve-template.sh`), the constitution
workflow (`/speckit.constitution`), git for review/approval flow

**Storage**: Single file — `.specify/memory/constitution.md`

**Testing**: Manual governance validation (placeholder scan, version/date consistency checks,
downstream-unblock mapping); no automated test suite applies to a Markdown artifact

**Target Platform**: N/A — repository governance artifact consumed by maintainers, contributors,
and Spec Kit commands at runtime

**Project Type**: documentation/governance

**Performance Goals**: N/A

**Constraints**: exactly one file modified; ratified template heading hierarchy preserved; ISO
`YYYY-MM-DD` dates; zero unresolved placeholder tokens; MAJOR bump per the constitution's own
versioning policy; amendment procedure per the Governance section (documented rationale +
maintainer approval + migration note)

**Scale/Scope**: one ~110-line document; 1 principle redefined, 1 principle reworded, 3
principles preserved verbatim in substance, 2 sections updated, 1 Sync Impact Report prepended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against constitution **v1.0.0** (the version in force when this plan executes):

| Gate | Result | Notes |
|------|--------|-------|
| I. Shariah Accuracy First | PASS | No calculation constants, formulas, or thresholds touched; disclaimer requirement unaffected |
| II. Buildless Vanilla Stack (current) | PASS | This feature modifies the governance *document* only — it introduces no framework, bundler, or runtime dependency into the codebase. The migration that would violate v1.0.0 Principle II is explicitly sequenced *after* this amendment lands (spec Edge Case: amendment precedes any migration code) |
| III. Bilingual & Accessible | PASS | No UI/strings changed; the amendment *preserves* EN/AR parity, RTL, and accessibility mandates |
| IV. Graceful Degradation | PASS | No fetch/data behavior changed; principle preserved |
| V. Client-Side Privacy | PASS | No data collection/transmission introduced; principle preserved |
| Governance procedure | PASS (conditional) | Amendment MUST ship with: documented rationale (spec.md + PR description), maintainer approval via PR, MAJOR bump with recorded rationale, and migration note (Sync Impact Report + reference to `implementation-plan.md`). This plan satisfies all four |

**Gate result**: PASS — no violations requiring Complexity Tracking justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-constitution-stack-amendment/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — amendment decisions
├── data-model.md        # Phase 1 output — constitution document entities
├── quickstart.md        # Phase 1 output — validation guide
├── contracts/           # Phase 1 output — amended-document contract
│   └── constitution-v2-contract.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit.specify)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
.specify/
└── memory/
    └── constitution.md   # THE ONLY FILE MODIFIED BY THIS FEATURE
```

**Structure Decision**: Documentation-only feature. No application source directories are
created, modified, or deleted. The single governed artifact is `.specify/memory/constitution.md`;
all design artifacts live under `specs/001-constitution-stack-amendment/`.

## Complexity Tracking

> No Constitution Check violations — section intentionally left empty.
