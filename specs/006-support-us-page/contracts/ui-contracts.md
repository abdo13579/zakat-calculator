# UI Contracts: Support Us Page & Cross-Site Support Link

**Feature**: 006-support-us-page
**Date**: 2026-08-19
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

This project is a React SPA; its user-facing surface is the UI. These contracts define the additions and modifications to that surface so the implementation phase can proceed without ambiguity. All contracts are additive — they preserve existing behavior unless explicitly stated.

---

## Contract C-NAV: Navigation Entries

**Scope**: `src/components/Header.jsx`, `src/components/Sidebar.jsx`

### C-NAV-1: New `support` item in Header `navItems`

The `navItems` array (`Header.jsx:9-16`) MUST contain a new entry inserted immediately before the `about` entry:

```js
{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support', fullLabelKey: 'nav-support' }
```

- **Render contract**: the existing `.map` (`Header.jsx:23-33`) renders this as `<a className="navLink ..."><i className="fas fa-hand-holding-heart"></i> <span>{t('nav-support')}</span></a>` with no code change to the render loop.
- **Active state**: when `currentView === 'support'`, the `.active` class is applied (existing logic, `Header.jsx:27`). No new CSS.
- **Click behavior**: `onClick` calls `onNavigate('support')` (existing handler). No new handler.

### C-NAV-2: New `support` item in Sidebar `ITEMS`

The `ITEMS` array (`Sidebar.jsx:5-12`) MUST contain a new entry inserted immediately before the `about` entry:

```js
{ id: 'support', icon: 'fa-hand-holding-heart', labelKey: 'nav-support' }
```

- **Render contract**: the existing `.map` (`Sidebar.jsx:48-60`) renders this identically to other items.
- **Active state**: `.active` class applied when `currentView === 'support'` (existing logic, `Sidebar.jsx:52`).
- **Click → drawer close**: the existing `onClick` calls `onNavigate(item.id)`; `useViewHistory.navigate` (`useViewHistory.js:81-99`) detects the open sidebar via `isSidebarOpenRef` and replaces the sentinel then calls `onCloseSidebarRef.current()` (`useViewHistory.js:87-89`), closing the drawer. No new logic required. → Satisfies acceptance US1-4.

### C-NAV-3: No-op when already on Support

If the user clicks the Support entry while `currentView === 'support'`:
- Header: `onNavigate('support')` is still called. `useViewHistory.navigate` pushes a new `{ view: 'support' }` history entry and sets `view` to `'support'` (already the current value). The visible result is a no-op — the page stays Support and the entry stays active. (Accepted per edge case: "stays on the Support Us page".)
- This is the same behavior as clicking any other nav entry while already on that page; no special handling is introduced.

---

## Contract C-VIEW: Support Us View

**Scope**: `src/views/SupportView.jsx` (NEW), `src/views/SupportView.module.css` (NEW)

### C-VIEW-1: Component signature

```jsx
export function SupportView() {
  const { t } = useI18n();
  // ... renders a <section className="page">
}
```

No props. Reads only from `useI18n` (same as `AboutView`). No state, no effects, no fetches.

### C-VIEW-2: Rendered structure

```text
<section id="support" className="page">
  <h2>{t('support-title')}</h2>
  <div className={styles.content}>
    <p>{t('support-intro')}</p>

    <h3>{t('support-vote-title')}</h3>
    <p>{t('support-vote-text')}</p>
    <p><a href="<MORTAKAZ_URL>" target="_blank" rel="noopener">{t('support-vote-link')}</a></p>

    <h3>{t('support-contribute-title')}</h3>
    <p>{t('support-contribute-text')}</p>
    <p><a href="<GITHUB_REPO_URL>" target="_blank" rel="noopener">{t('support-contribute-link')}</a></p>

    <h3>{t('support-star-title')}</h3>
    <p>{t('support-star-text')}</p>
    <p><a href="<GITHUB_REPO_URL>" target="_blank" rel="noopener">{t('support-star-link')}</a></p>
  </div>
</section>
```

- `<section className="page">` grants the global `fade-in-up` entrance animation and the 760px max-width centering (`global.css:57-63`).
- `<h2>` / `<h3>` / `<p>` use the global typography rules (`global.css:36-49`) — identical to `AboutView`. This is the mechanism that satisfies FR-009 / SC-004 ("same font styles").
- `styles.content` is the card wrapper, defined in `SupportView.module.css` (see C-VIEW-3).
- The three support options may be rendered by mapping over a local `SUPPORT_OPTIONS` constant (see data-model E1) OR by writing three explicit blocks. Either is acceptable as long as the rendered DOM matches the structure above and the i18n keys are correct.

### C-VIEW-3: `SupportView.module.css` — `.content`

The `.content` rule MUST be identical in effect to `AboutView.module.css:1-9`:

```css
.content {
  text-align: start;
  background: var(--color-surface);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  transition: background-color var(--transition-fast), color var(--transition-fast),
              border-color var(--transition-fast), box-shadow var(--transition-fast);
}
```

Link styling inside `.content` (new rule, theme-aware via existing tokens):

```css
.content a {
  color: var(--color-interactive);
  font-weight: var(--weight-semibold);
  text-decoration: underline;
  transition: color var(--transition-fast);
}
.content a:hover {
  color: var(--color-interactive-hover);
}
.content a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

No other CSS rules are needed. No new design tokens.

### C-VIEW-4: External link URLs (hardcoded)

The URLs are embedded as literal `href` values in JSX, NOT as i18n values (per FR-016 / R-005, to keep the `translations.test.js` placeholder allowlist test green):

| Section | `href` |
|---|---|
| Vote | `https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4` |
| Contribute | `https://github.com/abdo13579/zakat-calculator` |
| Star | `https://github.com/abdo13579/zakat-calculator` |

Every `<a>` MUST have `target="_blank"` and `rel="noopener"` (FR-007).

### C-VIEW-5: No outbound fetch

`SupportView` MUST NOT call `fetch`, `getGoldPrice`, `getCurrencyRates`, or any service. It is purely static. (Constitution Principle IV / V; FR-015.)

---

## Contract C-ROUTE: View Registration

**Scope**: `src/App.jsx`, `src/hooks/useViewHistory.js`

### C-ROUTE-1: Register `'support'` in the views list

Both the `views` array passed to `useViewHistory` in `App.jsx` (currently line 36) and the default `views` parameter in `useViewHistory.js` (line 8) MUST include `'support'`, inserted immediately before `'about'`:

```js
['landing', 'fitr', 'mal', 'zuru', 'anaam', 'support', 'about']
```

This makes `'support'` a valid `history.state.view` target (`useViewHistory.js:65`), giving the page first-class back/forward integration (FR-005, SC-002).

### C-ROUTE-2: Render branch in `App.jsx`

Add to the `<main>` view switch (currently `App.jsx:94-101`):

```jsx
{view === 'support' && <SupportView />}
```

Position before the `about` branch. Import `SupportView` at the top of `App.jsx`.

### C-ROUTE-3: Pass props to Footer

Change the Footer render (currently `App.jsx:102`) from `<Footer />` to:

```jsx
<Footer currentView={view} onNavigate={navigate} />
```

This wires the bottom support prompt (C-FOOTER).

---

## Contract C-FOOTER: Bottom Support Prompt

**Scope**: `src/components/Footer.jsx`, `src/components/Footer.module.css`

### C-FOOTER-1: Footer component signature

```jsx
export function Footer({ currentView, onNavigate }) {
  const { t } = useI18n();
  // ...
}
```

Both props are optional in the sense that the prompt simply won't render if `onNavigate` is absent, but `App.jsx` always passes both (C-ROUTE-3). The existing copyright `<p>` continues to render unconditionally.

### C-FOOTER-2: Rendered structure

```text
<footer className={styles.footer}>
  {currentView !== 'support' && onNavigate && (
    <p className={styles.supportPrompt}>
      <a
        href="#"
        className={styles.supportLink}
        onClick={(e) => { e.preventDefault(); onNavigate('support'); }}
        aria-label={t('support-link-aria')}
      >
        {t('footer-support-prompt')}
      </a>
    </p>
  )}
  <p>{t('footer-text')}</p>
</footer>
```

- **Visibility rule**: the prompt renders if and only if `currentView !== 'support'` AND `onNavigate` is truthy. → Satisfies FR-010, FR-011, SC-005.
- **Click behavior**: `preventDefault` (the `href="#"` is a no-op anchor for keyboard accessibility) then `onNavigate('support')`. This reuses the same history-integrated `navigate` as the nav bar, so back returns to the originating page (FR-005, acceptance US3-3).
- **Accessibility**: the `<a>` has `aria-label={t('support-link-aria')}` and is keyboard-focusable; Enter triggers the same `onClick`. → FR-013.
- **Wording**: the visible text is `t('footer-support-prompt')` — a reworded question, NOT the literal "Want to support us?" (FR-012).

### C-FOOTER-3: `Footer.module.css` additions

Add (do not replace the existing `.footer` rule):

```css
.supportPrompt {
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--text-sm);
}

.supportLink {
  color: var(--color-interactive);
  font-weight: var(--weight-medium);
  text-decoration: underline;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.supportLink:hover {
  color: var(--color-interactive-hover);
}

.supportLink:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

All values use existing design tokens, so light/dark themes and RTL flip automatically.

---

## Contract C-I18N: Translation Catalog Additions

**Scope**: `src/i18n/translations.js`

### C-I18N-1: Key set

Add the following keys to BOTH the `en` object (currently ends ~line 152) and the `ar` object (currently ends ~line 304). See data-model.md for the full table. Keys:

`nav-support`, `support-title`, `support-intro`, `support-vote-title`, `support-vote-text`, `support-vote-link`, `support-contribute-title`, `support-contribute-text`, `support-contribute-link`, `support-star-title`, `support-star-text`, `support-star-link`, `footer-support-prompt`, `support-link-aria`.

### C-I18N-2: Constraints (enforced by existing tests, NOT edited)

- **Parity**: `en` and `ar` MUST have identical key sets. Enforced by `translations.test.js:116-120`. Adding each key to both catalogs keeps this green.
- **Non-empty strings**: every value MUST be a non-empty string in both languages. Enforced by `translations.test.js:122-129`.
- **No `{token}` placeholders**: no value may contain `{anything}` unless the token is `tabi` or `bintLabun`. Enforced by `translations.test.js:145-156`. URLs stay in JSX (C-VIEW-4), so no new placeholders are introduced.
- **RTL**: Arabic strings must be natural phrasings; layout RTL is handled globally by `I18nContext.jsx:22-27`. No per-string direction handling needed.

### C-I18N-3: Arabic phrasing guidance

Arabic values should be natural, not literal translations. Suggested (final wording owned by implementation):
- `nav-support`: "ادعمنا"
- `support-title`: "ادعم حاسبة الزكاة"
- `footer-support-prompt`: "هل وجدت حاسبة الزكاة مفيدة؟ ادعمنا"
- `support-link-aria`: "الانتقال إلى صفحة الدعم"

(Full Arabic values for all keys are produced in the implementation phase.)

---

## Contract C-README: README Update

**Scope**: `README.md`

### C-README-1: New `## Support` section

Insert a new `## Support` section immediately after the existing `## Contributing` section (around line 266) and before `## License & Author`. The section MUST list the same three support options with their links, e.g.:

```markdown
## Support

If ZakatCalc helped you fulfill the obligation of Zakat, here are three simple ways to help us reach more Muslims:

1. **Vote for us on Mortakaz** — Help us reach more people by voting for this project on [mortakaz.com](https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4).
2. **Contribute on GitHub** — Developers can contribute features, fixes, or translations via pull requests at [github.com/abdo13579/zakat-calculator](https://github.com/abdo13579/zakat-calculator).
3. **Star the repository** — Starring the [GitHub repo](https://github.com/abdo13579/zakat-calculator) boosts its visibility and helps others discover the tool.

You can also reach the in-app **Support** page from the navigation bar or the bottom of any page.
```

No existing section's content is modified (FR-014, SC-007).

### C-README-2: Project Structure tree update

In the `## Project Structure` code block (around `README.md:162-171`), add the two new view files in alphabetical order among the views:

```text
│       ├── SupportView.jsx      # Support us view (vote, contribute, star)
│       ├── SupportView.module.css
```

---

## Cross-Contract Invariants

1. **Single navigation mechanism**: the Header nav, the Sidebar drawer, and the Footer prompt ALL call the same `navigate('support')` from `useViewHistory`. There is exactly one navigation path; no contract invents its own router.
2. **Single i18n source**: all visible strings come from `translations.js` via `t()`. No hardcoded user-facing text in components. URLs are the only literals in JSX and are not user-facing "strings" in the i18n sense.
3. **No new dependencies**: every contract is expressible with React, existing CSS Modules, and existing design tokens. `package.json` is not modified.
4. **No new outbound requests**: only the user-clicked external anchors leave the app; the app itself makes no new fetches.
