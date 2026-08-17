# Quickstart: Validating the Constitution Stack Amendment

**Phase 1 output** — runnable validation scenarios proving the amendment works end-to-end.
References: [data-model.md](data-model.md) for entities/validation rules,
[contracts/constitution-v2-contract.md](contracts/constitution-v2-contract.md) for the document
contract.

## Prerequisites

- Repository checkout on the amendment branch (`001-constitution-stack-amendment` or its PR).
- The amendment applied to `.specify/memory/constitution.md` via the constitution workflow.
- No other file changes in the change set.

## Scenario 1 — Governance self-consistency (FR-006, FR-007, FR-008)

```bash
# 1. No unresolved placeholders outside the Sync Impact Report
grep -nE '\[[A-Z0-9_]{2,}\]' .specify/memory/constitution.md
# EXPECTED: matches only within the leading HTML comment block (old-name references)

# 2. Version line format and value
grep -n '^\*\*Version\*\*: 2\.0\.0 | \*\*Ratified\*\*: 2026-08-16 | \*\*Last Amended\*\*: [0-9-]\{10\}$' \
  .specify/memory/constitution.md
# EXPECTED: exactly one match; Last Amended equals the amendment date

# 3. Sync Impact Report announces the same bump
grep -n 'Version change: 1.0.0 → 2.0.0' .specify/memory/constitution.md
# EXPECTED: exactly one match, inside the leading comment
```

**Pass criteria**: all three checks produce exactly the expected output.

## Scenario 2 — Protected principles preserved (FR-003)

```bash
git diff <v1.0.0-baseline> -- .specify/memory/constitution.md
```

Inspect the diff hunks for Principles I, IV, and V.

**Pass criteria**: no substantive edits inside those three principle sections (whitespace-only
or cross-reference-only changes acceptable); Principles II and III show the redefinition and
rewording respectively.

## Scenario 3 — Single-file blast radius (SC-004)

```bash
git diff --name-only <v1.0.0-baseline>
# EXPECTED: .specify/memory/constitution.md   (and nothing else)
```

**Pass criteria**: exactly one application-governance file changed; spec artifacts under
`specs/` are process documents, not product change.

## Scenario 4 — Downstream unblock (SC-001)

Manually map each Phase 1 work item from `implementation-plan.md` (Vite scaffold, React
components, CSS Modules, Vitest setup, manual `gh-pages` deploy) against the amended
constitution.

**Pass criteria**: every work item is permitted by at least one principle and forbidden by
none; the dependency-justification rule is the only approval step required for new packages.

## Scenario 5 — Contract conformance

Walk the amended document against
[contracts/constitution-v2-contract.md](contracts/constitution-v2-contract.md) sections 2–7
(heading skeleton, version line, report schema, principle anatomy, invariants, validation
rules).

**Pass criteria**: every contract clause verifies; reviewer sign-off recorded in the PR.

## When all scenarios pass

The amendment is governance-complete and may merge. Merging unblocks `/speckit.tasks` for this
feature's execution and, subsequently, Phase 1 (React migration) of the implementation plan.
