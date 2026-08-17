# Contract: Amended Constitution Document (v2.0.0)

**Phase 1 output** — this feature exposes no API or UI. Its external interface is the amended
constitution document itself, which is consumed at runtime by Spec Kit commands
(`/speckit.constitution`, `/speckit.plan` constitution checks, `/speckit.tasks`) and by human
reviewers. This contract defines the structure those consumers rely on.

## Consumers

- **Spec Kit commands**: read principles for gate evaluation; read version line for reporting.
- **Reviewers**: read principles and workflow gates to accept/reject pull requests.
- **Future amendments**: read the Governance section and Sync Impact Report format as precedent.

## Document Contract

### 1. File identity

- Path: `.specify/memory/constitution.md` (unchanged location).
- Format: Markdown with exactly one prepended HTML comment block (the Sync Impact Report)
  before the `#` title.

### 2. Required heading skeleton (order and level fixed)

```text
<!--
Sync Impact Report
...
-->
# ZakatCalc Constitution
## Core Principles
### I. Shariah Accuracy First (NON-NEGOTIABLE)
### II. <new stack principle title>
### III. Full Bilingual and Accessible Experience
### IV. Graceful Degradation of Live Data
### V. Client-Side Privacy and Transparency
## Additional Constraints
## Development Workflow
## Governance
```

- Heading levels MUST NOT be promoted or demoted relative to the ratified template.
- Section count and order MUST match the above; no section may be dropped.

### 3. Version line (last content line)

```text
**Version**: 2.0.0 | **Ratified**: 2026-08-16 | **Last Amended**: <amendment date, YYYY-MM-DD>
```

- Both dates MUST be ISO `YYYY-MM-DD`.
- The version MUST equal the version announced in the Sync Impact Report.

### 4. Sync Impact Report schema (prepended comment)

Required keys, in order:

```text
- Version change: 1.0.0 → 2.0.0
- Modified principles: <list, each as "old title → new title" or "unchanged">
- Added sections: <list or "none">
- Removed sections: <list or "none">
- Follow-up TODOs: <list or "none">
```

### 5. Principle section anatomy

Each `###` principle block MUST contain, in order: the title line (heading), the non-negotiable
rules (paragraph or bullets using MUST/SHOULD), and a rationale paragraph where the rule is not
self-evident.

### 6. Content invariants (what consumers may rely on)

| Invariant | Guarantee |
|-----------|-----------|
| Stack permission | Vite + React + CSS Modules is permitted; any additional dependency requires written justification |
| Hosting | static, serverless hosting only; no server-side component |
| Language/accessibility | full EN/AR parity, RTL correctness, semantic markup, ARIA, keyboard operability, light/dark themes — with no mechanism (e.g., `data-i18n`) mandated |
| Data endpoints | the two documented keyless, CORS-enabled public endpoints (exchange rates, gold price) remain the only permitted outbound calls |
| Merge gates | automated calculation-logic tests MUST pass; manual bilingual/RTL/theme/known-input checklist MUST be completed |
| Protected principles | Shariah accuracy, graceful degradation, and client-side privacy principles are substantively identical to v1.0.0 |

### 7. Validation rules (machine-checkable)

- `grep -nE '\[[A-Z0-9_]{2,}\]'` matches only inside the Sync Impact Report comment.
- Version line matches the regex
  `\*\*Version\*\*: \d+\.\d+\.\d+ \| \*\*Ratified\*\*: \d{4}-\d{2}-\d{2} \| \*\*Last Amended\*\*: \d{4}-\d{2}-\d{2}`.
- Exactly one file differs from the v1.0.0 baseline: `.specify/memory/constitution.md`.

## Compatibility

- **Backward compatibility**: intentionally broken (MAJOR) for stack governance only — v2.0.0
  permits what v1.0.0 forbade. All other consumer-facing invariants are preserved.
- **Migration note**: downstream work planned in `implementation-plan.md` Phase 1 becomes
  constitution-legal the moment this amendment merges.
