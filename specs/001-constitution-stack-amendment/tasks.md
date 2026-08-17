# Tasks: Constitution Stack Amendment (v2.0.0)

**Input**: Design documents from `/specs/001-constitution-stack-amendment/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md,
contracts/constitution-v2-contract.md, quickstart.md

**Executor guidance**: Every edit task below contains the EXACT replacement text to use. Do not
paraphrase, improve, or reformat it. The only file this feature modifies is
`.specify/memory/constitution.md`. All edit tasks MUST run sequentially — they modify the same
file. If any verification task fails, STOP and fix the file before continuing.

**Tests**: Not requested in the spec — this is a documentation-only amendment. Validation is via
the grep/diff commands embedded in the verification tasks and `quickstart.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- All file paths are relative to the repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline capture and preconditions. Nothing here modifies the constitution.

- [X] T001 [P] Back up the current constitution by running
  `cp .specify/memory/constitution.md /tmp/constitution-v1.0.0-backup.md` from the repository
  root. Verify the backup exists and contains the line `**Version**: 1.0.0`.
- [X] T002 [P] Verify the baseline by running
  `grep -c '^\*\*Version\*\*: 1\.0\.0' .specify/memory/constitution.md` from the repository
  root. The output MUST be exactly `1`. If it is not, STOP — the baseline is not v1.0.0 and
  these tasks do not apply.
- [X] T003 Ensure the working branch is `001-constitution-stack-amendment`: run
  `git branch --show-current`. If it differs, ask the maintainer for confirmation, then run
  `git checkout -b 001-constitution-stack-amendment`. Do NOT commit anything in this task.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Load the governing context. No user story work may begin until this is complete.

- [X] T004 Read these files in order and confirm each statement below:
  `specs/001-constitution-stack-amendment/spec.md`,
  `specs/001-constitution-stack-amendment/contracts/constitution-v2-contract.md`,
  `specs/001-constitution-stack-amendment/quickstart.md`.
  Confirm: (a) the amended document MUST have the heading skeleton from contract section 2;
  (b) the version line MUST follow contract section 3; (c) exactly one file is modified.
  If any document is missing, STOP and report it.

**Checkpoint**: Context loaded — user story tasks can now begin (sequentially, same file).

---

## Phase 3: User Story 1 - Maintainer legitimizes the new technology stack (Priority: P1) 🎯 MVP

**Goal**: Replace Principle II ("Buildless Vanilla Stack") with a principle that permits
Vite + React + CSS Modules while retaining the dependency-justification and static-hosting
safeguards, leaving Principles I, IV, and V untouched.

**Independent Test**: Read the amended Principle II and verify (a) it permits Vite + React +
CSS Modules, (b) it retains the dependency-justification rule, (c) it retains static-serverless
hosting, and (d) the diff against the backup shows no changes inside Principles I, IV, or V.

### Implementation for User Story 1

- [X] T005 [US1] In `.specify/memory/constitution.md`, replace the ENTIRE Principle II section —
  starting from the heading line `### II. Buildless Vanilla Stack` and ending on the last line
  before the `### III. Full Bilingual and Accessible Experience` heading — with EXACTLY this
  text (preserve the blank line after it, before the `### III.` heading):

  ```markdown
  ### II. Lean Static SPA Stack

  The app MUST be built as a static single-page application using Vite, React, and CSS Modules,
  producing static output that deploys by serving the build output directory on any static
  host. The app MUST NOT include a server-side component. Any runtime or build dependency
  beyond Vite, React, ReactDOM, and Vitest requires written justification and maintainer
  approval in the pull request. Third-party assets MUST be limited to font/icon packages and
  the two documented public APIs (currency rates, gold price); no API keys MUST be required.

  Rationale: a lean, statically deployed stack keeps the project trivially deployable,
  auditable, and open to contributors, while the dependency-justification rule preserves the
  anti-bloat intent of this principle's predecessor (Buildless Vanilla Stack).
  ```

- [X] T006 [US1] Verify the replacement in `.specify/memory/constitution.md`: run
  `grep -n 'Lean Static SPA Stack' .specify/memory/constitution.md` (exactly 1 match) and
  `grep -c 'Buildless Vanilla Stack' .specify/memory/constitution.md` (MUST be exactly 1 — the
  remaining mention is inside the new Rationale sentence; if it is 2 or more, the old section
  was not fully removed).
- [X] T007 [US1] Verify protected principles are untouched: run
  `diff /tmp/constitution-v1.0.0-backup.md .specify/memory/constitution.md` and confirm every
  changed hunk falls between the `### II.` heading and the `### III.` heading only. If any hunk
  touches Principles I, IV, or V, STOP and restore those sections from the backup.

**Checkpoint**: User Story 1 complete — the stack principle is redefined and protected
principles are verified intact.

---

## Phase 4: User Story 2 - Contributors get workflow rules aligned with the new stack (Priority: P2)

**Goal**: Reword Principle III (drop the `data-i18n` mechanism mandate), and replace the
Additional Constraints and Development Workflow sections with post-migration rules, while
keeping the EN/AR parity, RTL, accessibility mandates and the manual verification checklist.

**Independent Test**: Read the three amended sections and verify every review gate references
post-migration tooling (automated calculation tests, build output, base path), the manual
bilingual/RTL/theme checklist survives, and `data-i18n` no longer appears anywhere.

### Implementation for User Story 2

- [X] T008 [US2] In `.specify/memory/constitution.md`, replace the body of the Principle III
  section — everything from the line after the `### III. Full Bilingual and Accessible
  Experience` heading through the last line before the `### IV. Graceful Degradation of Live
  Data` heading (keep the heading itself unchanged) — with EXACTLY this text:

  ```markdown
  Every user-facing string MUST be translatable and MUST have both English and Arabic entries.
  Arabic MUST render in a correct RTL layout. Markup MUST be semantic HTML with appropriate
  ARIA labels, and all controls MUST be operable by keyboard. Dark/light theme support MUST be
  preserved.

  Rationale: the audience is global and largely Arabic-speaking; a feature that ships in only
  one language, or is inaccessible, is an incomplete feature.
  ```

- [X] T009 [US2] In `.specify/memory/constitution.md`, replace the ENTIRE Additional Constraints
  section — from the `## Additional Constraints` heading through the last line before the
  `## Development Workflow` heading — with EXACTLY this text:

  ```markdown
  ## Additional Constraints

  - Technology stack: Vite + React (JSX) + CSS Modules; Vitest for calculation-logic unit
    tests; font and icon packages via npm or CDN.
  - External APIs: `open.er-api.com/v6/latest/USD` for exchange rates and
    `mintedmetal.com/api/prices.json` for gold price (per ounce, converted to per gram by
    dividing by 31.1035). Replacement endpoints MUST remain keyless and CORS-enabled.
  - Build and deployment: static hosting only (GitHub Pages); no server-side component; the
    site is built with the base path `/zakat-calculator/` and the build output is published
    manually to the `gh-pages` branch.
  - Supported browsers: current versions of Chrome, Firefox, Safari, and Edge.
  - Transition note: until the React migration (`implementation-plan.md`, Phase 1) merges, the
    running app remains the legacy vanilla HTML/CSS/JS stack; the stack constraints above take
    full effect with that migration.
  ```

- [X] T010 [US2] In `.specify/memory/constitution.md`, replace the ENTIRE Development Workflow
  section — from the `## Development Workflow` heading through the last line before the
  `## Governance` heading — with EXACTLY this text:

  ```markdown
  ## Development Workflow

  - Changes are proposed via a feature branch and a pull request, per the README contributing
    guide.
  - Every pull request MUST be reviewed against this constitution: calculation changes against
    Principle I, new user-facing strings against Principle III, new outbound requests against
    Principle IV, and any new dependency against Principle II.
  - Automated calculation-logic tests MUST pass before merge.
  - Manual verification checklist before merge: the app builds and loads from its static
    output, both languages render correctly including RTL, both themes work, and each
    calculator produces the expected result for known inputs.
  - Any added complexity (including a new dependency) MUST be justified in writing and approved
    through the review process.
  ```

- [X] T011 [US2] Verify all three replacements in `.specify/memory/constitution.md`. Run these
  commands from the repository root and confirm every expected result:
  `grep -c 'data-i18n' .specify/memory/constitution.md` → MUST be `0`;
  `grep -c 'Automated calculation-logic tests MUST pass before merge' .specify/memory/constitution.md` → `1`;
  `grep -c '/zakat-calculator/' .specify/memory/constitution.md` → at least `1`;
  `grep -c 'open.er-api.com/v6/latest/USD' .specify/memory/constitution.md` → `1`;
  `grep -c 'mintedmetal.com/api/prices.json' .specify/memory/constitution.md` → `1`;
  `grep -c 'Manual verification checklist' .specify/memory/constitution.md` → `1`.

**Checkpoint**: User Story 2 complete — workflow and constraints now describe the
post-migration world with all safeguards retained.

---

## Phase 5: User Story 3 - Governance integrity is demonstrably preserved (Priority: P3)

**Goal**: Apply the MAJOR version bump with correct dates and prepend the Sync Impact Report,
then run the machine-checkable validation rules.

**Independent Test**: Inspect the version line and the prepended Sync Impact Report; verify the
bump classification (principle redefinition = MAJOR), preserved ratification date, amendment
date in ISO format, report/version-line consistency, and a clean placeholder scan.

### Implementation for User Story 3

- [X] T012 [US3] In `.specify/memory/constitution.md`, replace the final version line
  `**Version**: 1.0.0 | **Ratified**: 2026-08-16 | **Last Amended**: 2026-08-16` with
  `**Version**: 2.0.0 | **Ratified**: 2026-08-16 | **Last Amended**: <DATE>` where `<DATE>` is
  the output of running `date +%F` (ISO format, e.g. `2026-08-16`). The ratified date MUST stay
  `2026-08-16`.
- [X] T013 [US3] In `.specify/memory/constitution.md`, prepend EXACTLY this comment block as the
  very first content of the file (before the `# ZakatCalc Constitution` title, followed by one
  blank line):

  ```markdown
  <!--
  Sync Impact Report
  - Version change: 1.0.0 → 2.0.0
  - Modified principles:
    - I. Shariah Accuracy First → unchanged
    - II. Buildless Vanilla Stack → II. Lean Static SPA Stack (redefined: permits Vite + React + CSS Modules)
    - III. Full Bilingual and Accessible Experience → unchanged title, reworded body (removes the data-i18n mechanism mandate)
    - IV. Graceful Degradation of Live Data → unchanged
    - V. Client-Side Privacy and Transparency → unchanged
  - Added sections: none
  - Removed sections: none
  - Follow-up TODOs: none
  -->
  ```

  Note: this comment intentionally contains the strings `Buildless Vanilla Stack` and
  `data-i18n` as historical references. After this task, the counts in T006 and T011 change:
  `Buildless Vanilla Stack` appears 2 times total and `data-i18n` appears 1 time total — all
  remaining occurrences MUST be inside the new Rationale sentence or this comment only.
- [X] T014 [US3] Run the machine-checkable validation from the contract (section 7) against
  `.specify/memory/constitution.md` and confirm all three pass:
  (a) `grep -nE '\[[A-Z0-9_]{2,}\]' .specify/memory/constitution.md` → no output at all;
  (b) `grep -cE '^\*\*Version\*\*: 2\.0\.0 \| \*\*Ratified\*\*: 2026-08-16 \| \*\*Last Amended\*\*: [0-9]{4}-[0-9]{2}-[0-9]{2}$' .specify/memory/constitution.md` → `1`;
  (c) `grep -c 'Version change: 1.0.0 → 2.0.0' .specify/memory/constitution.md` → `1`.
  If (a) produces any output, remove the offending bracketed token and re-check.

**Checkpoint**: User Story 3 complete — the amendment is versioned, reported, and
machine-validated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and maintainer handoff.

- [X] T015 Run every scenario in `specs/001-constitution-stack-amendment/quickstart.md`
  (Scenarios 1–5) against the amended `.specify/memory/constitution.md` and record pass/fail
  for each. All five MUST pass; on any failure, return to the responsible story phase and fix.
- [X] T016 Read the final `.specify/memory/constitution.md` end to end and confirm: the heading
  skeleton order matches the contract (Core Principles → Additional Constraints → Development
  Workflow → Governance); exactly one blank line separates sections; no line has trailing
  whitespace (`grep -nE ' $' .specify/memory/constitution.md` produces no output).
- [X] T017 Run `git diff` and `git status` and present the full diff to the maintainer for
  approval. Only after explicit maintainer confirmation, stage
  `.specify/memory/constitution.md` and commit with the message
  `docs: amend constitution to v2.0.0 (stack principle redefinition)`. Do NOT push unless the
  maintainer asks.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. T001 and T002 are parallelizable
  (different operations, no conflicts); T003 needs only git.
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all story phases.
- **User Stories (Phases 3–5)**: All edit tasks modify the SAME file
  (`.specify/memory/constitution.md`), so phases and tasks MUST run strictly in order:
  Phase 3 → Phase 4 → Phase 5. No parallel execution of edit tasks is possible.
- **Polish (Phase 6)**: Depends on all story phases being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Independent content-wise; MUST run before US2/US3 only because of the
  shared file. Independently testable via T006–T007.
- **User Story 2 (P2)**: Independent content-wise (different sections of the same file);
  independently testable via T011.
- **User Story 3 (P3)**: Depends on US1 and US2 being applied — the Sync Impact Report and
  version line describe the final document state. Testable via T014.

### Within Each User Story

- Edit task(s) first, then that story's verification task(s).
- If a verification task fails: fix the file, re-run ALL verifications for that story, and only
  then continue.

### Parallel Opportunities

- T001 and T002 (Setup) can run in parallel.
- Everything else is sequential: all edits target one file. This is intentional and expected
  for a single-document amendment.

---

## Parallel Example: Setup

```bash
# These two are independent and can run together:
cp .specify/memory/constitution.md /tmp/constitution-v1.0.0-backup.md   # T001
grep -c '^\*\*Version\*\*: 1\.0\.0' .specify/memory/constitution.md     # T002
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1): the stack principle is redefined and verified.
3. **STOP and VALIDATE**: T006–T007 pass → the core unblock exists in the working tree.
   Note: a shippable amendment still needs US3 (version bump + report); US1 alone proves the
   central requirement but is not merge-ready.

### Incremental Delivery (recommended: single PR, sequential tasks)

1. T001–T004 → baseline secured, context loaded.
2. T005–T007 → Principle II redefined (MVP content).
3. T008–T011 → Principle III + constraints + workflow aligned.
4. T012–T014 → version bump + Sync Impact Report + machine validation.
5. T015–T016 → end-to-end quickstart validation.
6. T017 → maintainer review and commit.
7. Merge of the amendment PR unblocks Phase 1 of `implementation-plan.md` (React migration).

---

## Notes

- All edits target ONE file: `.specify/memory/constitution.md` — sequential execution only.
- Replacement texts are verbatim: do not reword, re-wrap, or "improve" them.
- `date +%F` provides the ISO amendment date for T012.
- The backup at `/tmp/constitution-v1.0.0-backup.md` (T001) is required by T007; do not skip.
- Remaining occurrences of `Buildless Vanilla Stack` (2×) and `data-i18n` (1×) after T013 are
  intentional historical references inside the Rationale sentence and the Sync Impact Report.
- Git mutations (branch, commit) require explicit maintainer confirmation — see T003 and T017.
