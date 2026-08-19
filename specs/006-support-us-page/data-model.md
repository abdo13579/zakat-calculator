# Data Model: Support Us Page & Cross-Site Support Link

**Feature**: 006-support-us-page
**Date**: 2026-08-19
**Spec**: [spec.md](spec.md)

This feature is a purely presentational, static addition. It introduces **no persistent state, no server-side entities, no databases, and no new domain logic**. The "data" below describes the in-memory, render-time structures the new view and the modified components consume. All structures are derived from the existing `useI18n` and `useViewHistory` mechanisms — no new stores or contexts are added.

---

## Entities

### E1: Support Option (render-time constant)

A single, titled way a user can help the project. Three instances exist, defined as a local constant array inside `SupportView.jsx` (mirroring how `AnaamView.jsx` defines its `IRRIGATION` constant).

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | string literal | hardcoded | One of `'vote'`, `'contribute'`, `'star'`. Stable key for React list rendering. |
| `icon` | string literal | hardcoded | Font Awesome 6 class, e.g. `'fa-square-poll-vertical'`, `'fa-code-pull-request'`, `'fa-star'`. Rendered as `<i className={`fas ${icon}`}>`. |
| `titleKey` | i18n key | `translations.js` | e.g. `'support-vote-title'`. Resolved via `t(titleKey)`. |
| `textKey` | i18n key | `translations.js` | e.g. `'support-vote-text'`. Resolved via `t(textKey)`. |
| `linkLabelKey` | i18n key | `translations.js` | e.g. `'support-vote-link'`. Resolved via `t(linkLabelKey)`. |
| `href` | URL string literal | hardcoded in JSX | External destination. NOT an i18n value (see FR-016 / R-005). |

**Instances**:
1. `vote` → `https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4`
2. `contribute` → `https://github.com/abdo13579/zakat-calculator`
3. `star` → `https://github.com/abdo13579/zakat-calculator`

**Validation rules**: none at runtime — values are static. The i18n keys MUST exist in both `en` and `ar` catalogs (enforced by `translations.test.js` parity test).

**Relationships**: consumed only by `SupportView` at render time. No references from domain modules.

---

### E2: Navigation Entry (Support) — extension of existing arrays

An ordered item appended to two existing constant arrays.

**In `src/components/Header.jsx` (`navItems`)**:

| Field | Value |
|---|---|
| `id` | `'support'` |
| `icon` | `'fa-hand-holding-heart'` |
| `labelKey` | `'nav-support'` |
| `fullLabelKey` | `'nav-support'` |

**In `src/components/Sidebar.jsx` (`ITEMS`)**:

| Field | Value |
|---|---|
| `id` | `'support'` |
| `icon` | `'fa-hand-holding-heart'` |
| `labelKey` | `'nav-support'` |

**Position**: inserted at the index immediately before the `about` entry in both arrays. Existing entries and their order are otherwise unchanged.

**Active-state rule**: the existing render logic (`Header.jsx:27`, `Sidebar.jsx:52`) applies the `.active` class when `currentView === item.id`. Because `'support'` is now a registered view (see E3), the Support entry is automatically marked active on the Support page (FR-004).

---

### E3: View Identifier — extension of existing view registry

A string literal `'support'` added to the `views` array in two places:

1. `src/App.jsx:36` — `views: ['landing','fitr','mal','zuru','anaam','support','about']` (inserted before `'about'`).
2. `src/hooks/useViewHistory.js:8` — default `views` list updated identically.

**Validation rule**: `useViewHistory.js:65` validates `popstate` states against this list; only listed view ids are accepted as history targets. Adding `'support'` makes it a valid history destination, so back/forward work (FR-005, SC-002).

**State transition**: none new. The existing `view` state in `useViewHistory` transitions from any current view to `'support'` via `navigate('support')`, which pushes `{ view: 'support' }` onto `history.state` (`useViewHistory.js:91`). Back pops to the previous state. No new state machine.

---

### E4: Bottom Support Prompt — render-time conditional

A UI fragment rendered by the shared `Footer` component, conditionally visible.

| Field | Type | Source | Notes |
|---|---|---|---|
| `visible` | boolean (derived) | `currentView !== 'support'` | Computed in `Footer.jsx` from the new `currentView` prop. |
| `onNavigate` | function | passed from `App.jsx` | Calls `onNavigate('support')` on click. Reuses the same history-integrated `navigate` as the nav bar. |
| `promptTextKey` | i18n key | `translations.js` | `'footer-support-prompt'` — the reworded question, also used as the link's visible text. |
| `ariaLabelKey` | i18n key | `translations.js` | `'support-link-aria'` — screen-reader label. |

**Position in tree**: rendered inside `<footer>` (Footer.jsx), above the existing copyright `<p>`. Styled by new `.supportPrompt` / `.supportLink` classes in `Footer.module.css`.

**Validation rule**: when `currentView === 'support'`, the prompt MUST NOT render (FR-011, SC-005). No other page hides it.

---

## i18n Key Additions (catalog data)

Added to BOTH `en` and `ar` objects in `src/i18n/translations.js`. No `{token}` placeholders (preserves `translations.test.js:145-156` placeholder allowlist).

| Key | Used by | Example EN value |
|---|---|---|
| `nav-support` | Header, Sidebar | "Support" |
| `support-title` | SupportView `<h2>` | "Support ZakatCalc" |
| `support-intro` | SupportView lead `<p>` | "If ZakatCalc helped you fulfill your obligation, here are three simple ways to help us reach more people." |
| `support-vote-title` | Section 1 `<h3>` | "Vote for us on Mortakaz" |
| `support-vote-text` | Section 1 `<p>` | "Help us reach more people by voting for this project on mortakaz.com — it takes a few seconds and costs nothing." |
| `support-vote-link` | Section 1 link label | "Vote on Mortakaz" |
| `support-contribute-title` | Section 2 `<h3>` | "Contribute on GitHub" |
| `support-contribute-text` | Section 2 `<p>` | "If you are a developer, contribute features, fixes, or translations to the open-source repository." |
| `support-contribute-link` | Section 2 link label | "Open the repository" |
| `support-star-title` | Section 3 `<h3>` | "Star the repository" |
| `support-star-text` | Section 3 `<p>` | "Starring the GitHub repo boosts its visibility and helps other Muslims discover the tool. Just click the ★ button." |
| `support-star-link` | Section 3 link label | "Star on GitHub" |
| `footer-support-prompt` | Footer prompt link | "Find ZakatCalc helpful? Support us" |
| `support-link-aria` | Footer prompt `aria-label` | "Go to the Support Us page" |

**Parity rule**: every key above MUST be present in `ar` with a natural, RTL-correct Arabic phrasing. The `translations.test.js:116-129` parity test enforces identical key sets automatically.

---

## No-Change Confirmations

- **Domain modules** (`src/domain/*.js`): untouched. No Zakat calculation is affected.
- **Services** (`src/services/api.js`): untouched. No new outbound requests.
- **Existing views** (`LandingView`, `FitrView`, `MalView`, `ZuruView`, `AnaamView`, `AboutView`): untouched except indirectly via the shared Footer (which now renders the prompt below their content).
- **Theme tokens** (`src/styles/tokens.css`): untouched. New styles use existing custom properties (`--color-interactive`, `--color-on-surface-muted`, `--transition-fast`, etc.).
- **Existing tests**: `translations.test.js` is NOT edited; it continues to gate parity. Domain test suites are unaffected.
