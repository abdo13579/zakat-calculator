# Data Model: Constitution Stack Amendment (v2.0.0)

**Phase 1 output** — entities derived from the feature spec. This feature governs a single
Markdown document, so the "data model" is the document's entity structure and its validation
rules.

## Entity: Constitution

The governance document at `.specify/memory/constitution.md`.

| Field | Type | Constraints / Validation |
|-------|------|--------------------------|
| version | SemVer string | MUST be `2.0.0` after amendment; bump type MUST equal MAJOR because a principle is redefined (FR-006) |
| ratified_date | ISO `YYYY-MM-DD` | MUST remain `2026-08-16` (original adoption date preserved) (FR-006) |
| last_amended_date | ISO `YYYY-MM-DD` | MUST equal the date the amendment is applied (FR-006) |
| sync_impact_report | HTML comment, prepended | MUST record version change, principle renames/redefinitions (old → new), added/removed sections, deferred follow-ups (FR-007) |
| principles | ordered list of Principle | Exactly 5; 1 redefined, 1 reworded, 3 substantively unchanged (FR-001..FR-003) |
| sections | ordered list of Section | `Core Principles`, `Additional Constraints`, `Development Workflow`, `Governance`; heading hierarchy of the ratified template preserved (FR-008) |

**Document-level invariants**

- No unresolved `[ALL_CAPS]` placeholder tokens anywhere except intentional old-name references
  inside the Sync Impact Report (FR-008).
- Version line format: `**Version**: X | **Ratified**: Y | **Last Amended**: Z`, consistent with
  the Sync Impact Report (FR-006, FR-007).
- Principles I (Shariah Accuracy First), IV (Graceful Degradation of Live Data), V (Client-Side
  Privacy and Transparency) substantively unchanged (FR-003).

## Entity: Principle

A named, numbered, non-negotiable governance rule.

| Field | Type | Constraints / Validation |
|-------|------|--------------------------|
| ordinal | roman numeral | Stable ordering I–V maintained |
| name | string | Succinct title line; redefined principle receives a new title recorded old → new in the Sync Impact Report |
| rules | paragraph or bullet list | Declarative, testable statements using MUST/SHOULD; no vague "should" without rationale |
| rationale | paragraph | Required when the rule is not self-evident |

**Per-principle change map**

| # | Title (v1.0.0 → v2.0.0) | Change class | Required substance |
|---|--------------------------|--------------|--------------------|
| I | Shariah Accuracy First → unchanged | preserved | verbatim substance (FR-003) |
| II | Buildless Vanilla Stack → new lean-static-SPA title | redefined | permits Vite + React + CSS Modules; retains dependency-justification rule; retains static-serverless hosting (FR-001) |
| III | Full Bilingual and Accessible Experience → unchanged title | reworded | drops `data-i18n` mechanism mandate; keeps EN/AR parity, RTL, semantic markup, ARIA, keyboard, themes (FR-002) |
| IV | Graceful Degradation of Live Data → unchanged | preserved | verbatim substance (FR-003) |
| V | Client-Side Privacy and Transparency → unchanged | preserved | verbatim substance (FR-003) |

## Entity: Sync Impact Report

The prepended audit comment.

| Field | Type | Constraints / Validation |
|-------|------|--------------------------|
| version_change | string | `1.0.0 → 2.0.0` with bump rationale |
| modified_principles | list of mappings | every changed principle as old title → new title (or "unchanged") |
| added_sections | list | sections introduced by this amendment (none expected) |
| removed_sections | list | sections removed by this amendment (none expected) |
| follow_ups | list | deferred items; empty list stated explicitly if none |

## Entity: WorkflowGate (updated section content)

The Development Workflow section's review gates after amendment.

| Gate | Type | Post-amendment requirement |
|------|------|----------------------------|
| automated calculation tests | automated merge gate | MUST pass before merge (FR-004) |
| manual verification checklist | manual merge gate | retained: bilingual parity, RTL, both themes, known-input results (FR-004) |
| dependency justification | written approval | required for any new dependency (carried into redefined Principle II, FR-001) |

No state transitions exist — the constitution is a static document; the only lifecycle event is
the atomic replacement of v1.0.0 content with v2.0.0 content in a single commit.
