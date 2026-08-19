# Research: Support Us Page & Cross-Site Support Link

**Feature**: 006-support-us-page
**Date**: 2026-08-19
**Status**: Complete — no NEEDS CLARIFICATION items (all resolved via direct codebase research and the pre-specification user discussion)

This document records the technical decisions derived from researching the existing ZakatCalc codebase. Because the feature is a small, purely additive slice over well-established patterns, every "unknown" resolved to a concrete existing mechanism rather than an open technology choice.

---

## R-001: How views are registered and routed

**Decision**: Register `'support'` in the `views` array passed to `useViewHistory` and add a `{view === 'support' && <SupportView />}` branch in `App.jsx`, mirroring exactly how `'about'` is handled.

**Rationale**: `src/App.jsx:36` declares `views: ['landing', 'fitr', 'mal', 'zuru', 'anaam', 'about']` and `src/App.jsx:94-101` renders the active view via a chain of `view === '<id>' && <View />` checks. `src/hooks/useViewHistory.js:8` defaults to the same list and uses it to validate `popstate` states (`useViewHistory.js:65`). Adding `'support'` to both places gives the new page first-class back/forward history integration for free — `navigate('support')` pushes a history entry and back returns to the previous view (satisfying FR-005 and SC-002) with zero new routing code.

**Alternatives considered**:
- *Hash-based deep-linking for the Support page* — rejected: out of scope per the spec assumptions and the existing architecture records view state in `history.state` without URL changes; introducing URLs for one page would be inconsistent.
- *A separate router library* — rejected: violates Constitution Principle II (no new dependencies) and the existing single-state-hook approach already handles the requirement.

---

## R-002: Where the nav entry lives in desktop and mobile

**Decision**: Add `{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support', fullLabelKey: 'nav-support' }` to `navItems` in `src/components/Header.jsx:9-16` immediately before the `about` entry; add the same `{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support' }` to `ITEMS` in `src/components/Sidebar.jsx:5-12` immediately before `about`.

**Rationale**: Header and Sidebar each hold a single ordered array of nav items and already render an `.active` class when `currentView === item.id` (`Header.jsx:27`, `Sidebar.jsx:52`). Inserting before `about` satisfies FR-002, FR-003, FR-004 and the "before About" ordering in SC-001 without touching the rendering logic. The Sidebar's existing `onClick` (`Sidebar.jsx:53-56`) calls `onNavigate(item.id)`, which closes the drawer via the `useViewHistory` sentinel-replace path (`useViewHistory.js:83-89`) — so "tap Support → drawer closes → page shows" (acceptance scenario US1-4) works automatically.

**Alternatives considered**:
- *Icon-only heart button in the header action group* — rejected: the user explicitly retracted this in the clarification round ("do not add heart icon, add it to the side bar for mobile... for desktop add it to the nave text").
- *A dedicated Support nav section separate from the main links* — rejected: inconsistent with the established flat nav pattern and unnecessary for one entry.

---

## R-003: Font Awesome icon choice for the Support entry

**Decision**: Use `fa-hand-holding-heart` (Font Awesome 6 solid) for the Support nav entry in both Header and Sidebar.

**Rationale**: The codebase loads Font Awesome 6 from CDN (per `index.html` / README) and every existing nav item uses a `fas fa-*` icon (`Header.jsx:10-15`). `fa-hand-holding-heart` is a standard FA6 solid icon that reads as "support/give" and is visually distinct from `fa-info-circle` (About), `fa-paw` (Anaam), etc. It keeps the icon family consistent.

**Alternatives considered**:
- `fa-heart` — rejected: too generic, risks clashing with "favorites/like" semantics.
- `fa-donate` — rejected: implies money specifically; the spec's support options include non-monetary actions (voting, starring, contributing code).
- No icon — rejected: every existing entry has an icon; dropping it would break visual consistency.

---

## R-004: Support Us page typography and structure

**Decision**: Create `src/views/SupportView.jsx` + `src/views/SupportView.module.css` mirroring `AboutView` exactly: a `<section className="page">` with an `<h2>` title and a `.content` card containing `<h3>` subsections, `<p>` paragraphs, and links. Copy the `.content` card style from `AboutView.module.css:1-9` verbatim.

**Rationale**: The About page's typography is defined by global rules in `src/styles/global.css` (`h2` at `global.css:36-41`, `h3` at `global.css:43-49`, `p` inherits body) and its card by `AboutView.module.css:1-9`. Reusing the same `.content` card class definition and the same `<section className="page">` + `<h2>` + `<h3>` + `<p>` structure guarantees identical font styles (FR-009, SC-004) with no new design tokens. The `.page` class also grants the `fade-in-up` entrance animation (`global.css:57-63`) for free.

**Alternatives considered**:
- *Landing-style icon cards* — rejected by the user in clarification ("About-style text sections").
- *Importing `AboutView.module.css` directly into `SupportView`* — rejected: CSS Modules are scoped per import path; a sibling file with the same rules is cleaner and keeps the two views independently evolvable.

---

## R-005: External link safety and the i18n placeholder test

**Decision**: Render the three external URLs directly in `SupportView.jsx` as `<a href="https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4" target="_blank" rel="noopener">…</a>` (and the two GitHub links to `https://github.com/abdo13579/zakat-calculator`). Only the link *labels* and surrounding *text* are translated via `t('…')`; the URLs are literal markup.

**Rationale**: `src/i18n/__tests__/translations.test.js:145-156` scans every translation value for `{token}` placeholders and fails if any token is not in `KNOWN_PARAMS = {'tabi','bintLabun'}`. Embedding URLs as `{url}` placeholders in translation strings would break this test. Keeping URLs in JSX and translating only human-readable text satisfies FR-016 and keeps the parity test green with no test edits. `target="_blank" rel="noopener"` satisfies FR-007's new-tab + security requirement.

**Alternatives considered**:
- *Expanding `KNOWN_PARAMS` to include URL tokens* — rejected: adds test maintenance burden and couples translation strings to external URLs; the constitution favors keeping the catalog URL-free.
- *A config file of support links imported by the view* — rejected as over-engineering for three static links; a constant block at the top of `SupportView.jsx` is sufficient and matches how `AnaamView.jsx` defines its `IRRIGATION` constant locally.

---

## R-006: Bottom support prompt placement and the conditional hide

**Decision**: Put the support prompt inside the shared `src/components/Footer.jsx`, above the existing copyright `<p>`. Pass `currentView` and `onNavigate` props from `App.jsx` (`<Footer currentView={view} onNavigate={navigate} />`). Render the prompt only when `currentView !== 'support'`.

**Rationale**: The Footer is the single shared bottom strip rendered once in `App.jsx:102` after `<main>`, so it appears on every page automatically (FR-010). The Support view is rendered inside `<main>` and the Footer sits below it, so a single `currentView !== 'support'` guard satisfies FR-011/SC-005 (hide on the Support page). Using `onNavigate('support')` on click reuses the same history-integrated navigation as the nav bar (FR-005, acceptance US3-3), so back-button behavior is consistent with no extra code. New `.supportPrompt` / `.supportLink` styles in `Footer.module.css` keep it visually distinct from the copyright line and theme-aware via existing CSS custom properties.

**Alternatives considered**:
- *Per-view `<SupportLink>` rendered at the end of each view's JSX* — rejected by the user in clarification (chose "In global Footer"). Also less DRY: requires edits to all six existing views.
- *A floating action button* — rejected: intrusive, inconsistent with the app's calm design language, and not requested.

---

## R-007: Translation key set and parity

**Decision**: Add the following keys to BOTH `en` and `ar` in `src/i18n/translations.js` (no placeholders, so the `{token}` test is unaffected):

- `nav-support` (nav entry label, shared by Header + Sidebar)
- `support-title` (page `<h2>`)
- `support-intro` (lead paragraph under the title)
- `support-vote-title`, `support-vote-text`, `support-vote-link` (section 1)
- `support-contribute-title`, `support-contribute-text`, `support-contribute-link` (section 2)
- `support-star-title`, `support-star-text`, `support-star-link` (section 3)
- `footer-support-prompt` (the reworded bottom question, used as the clickable link text)
- `support-link-aria` (aria-label for the bottom prompt link, for keyboard/screen-reader users)

**Rationale**: The parity test (`translations.test.js:116-129`) requires `en` and `ar` to have identical key sets and every value to be a non-empty string. Adding each key to both catalogs simultaneously keeps the test green without editing it (FR-013, SC-006). The Arabic entries will be natural, RTL-correct phrasings (not the literal English), per the user's "reword the question yourself" instruction and FR-012.

**Alternatives considered**:
- *Reusing the `footer-text` key* — rejected: the prompt is a distinct, clickable question, not the copyright line.
- *A single combined `support-options` JSON blob* — rejected: the catalog is a flat key→string map by convention; nested structures would break the parity test's `Object.keys` scan.

---

## R-008: README section placement

**Decision**: Insert a new `## Support` section in `README.md` immediately after the existing `## Contributing` section (around line 266) and before `## License & Author`. Also append `SupportView.jsx` / `SupportView.module.css` to the Project Structure tree block (`README.md:162-171`) in alphabetical position among the views.

**Rationale**: The README's section order is Overview → Features → How Calculations Work → Tech Stack → APIs → Project Structure → Getting Started → Deployment → Contributing → License. "Support" logically follows "Contributing" (both are community-facing) and precedes the closing License/Author block, satisfying FR-014 and SC-007 without altering any existing section's content. Updating the Project Structure tree keeps the documented layout honest.

**Alternatives considered**:
- *Merging support into the Contributing section* — rejected: the spec asks for a distinct Support section, and support actions (vote, star) are lower-friction than contributing code.
- *Placing Support near the top* — rejected: would disrupt the existing narrative flow and push technical content down.
