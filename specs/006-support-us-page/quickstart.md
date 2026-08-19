# Quickstart Validation: Support Us Page & Cross-Site Support Link

**Feature**: 006-support-us-page
**Date**: 2026-08-19
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Contracts**: [contracts/ui-contracts.md](contracts/ui-contracts.md) | **Data Model**: [data-model.md](data-model.md)

This is a runnable validation guide — how to confirm the feature works end-to-end after implementation. It is NOT an implementation document; code bodies, full test suites, and migrations belong in `tasks.md` and the implementation phase.

---

## Prerequisites

- Node.js LTS (18.x+) and npm installed.
- The repository checked out on the `006-support-us-page` branch with dependencies installed (`npm install`).
- No environment variables or API keys required (the feature makes no outbound requests).
- A modern browser (Chrome, Firefox, Safari, or Edge) for manual UI checks.

---

## Automated Validation

### A1 — Translation catalog parity (the gate)

This is the primary automated gate for the feature because all new user-facing strings land in the i18n catalog, and the existing test enforces en/ar key-set parity, non-empty values, and the placeholder allowlist.

```bash
npm test
```

**Expected outcome**:
- All tests in `src/i18n/__tests__/translations.test.js` pass.
- Specifically: "en and ar have exactly the same key sets (parity rule)" passes → confirms every new key (`nav-support`, `support-title`, `support-intro`, `support-vote-*`, `support-contribute-*`, `support-star-*`, `footer-support-prompt`, `support-link-aria`) was added to BOTH `en` and `ar`.
- "every key has a non-empty string value in both languages" passes → no empty Arabic translations.
- "placeholders in translation strings are resolvable via known keys" passes → confirms URLs were kept in JSX, not as `{token}` in translation values (per FR-016 / C-I18N-2).
- All domain calculation tests (`src/domain/__tests__/*`) continue to pass unchanged.

**If this fails**: the implementation either added a key to only one language, left an Arabic value empty, or embedded a URL as a `{placeholder}`. Fix in `src/i18n/translations.js`; do NOT edit the test.

### A2 — Production build

```bash
npm run build
```

**Expected outcome**: Vite builds the static bundle into `dist/` with zero errors and zero warnings about missing modules. The new `SupportView.jsx` / `SupportView.module.css` compile cleanly. (The feature adds no dependencies, so `package.json` is unchanged.)

---

## Manual Validation Scenarios

Run the dev server, then walk through each scenario. Toggle language (🌐) and theme (🌙/☀️) where indicated to verify bilingual + theming coverage.

```bash
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173/zakat-calculator/`).

---

### M1 — Desktop: Support entry in the top nav bar (US1, FR-002, FR-004, SC-001)

1. On a desktop-width window (≥769px), load the app on the Home page.
2. Inspect the top navigation bar.
3. **Expect**: a "Support" link appears among the page links, positioned immediately before "About", with a heart-in-hand icon.
4. Click the "Support" link.
5. **Expect**: the Support Us page appears, and the "Support" nav link is visually marked active (same active style as other pages when current).
6. Toggle language to Arabic (🌐).
7. **Expect**: the "Support" nav label and page content switch to Arabic; layout flips to RTL; the active state remains.

### M2 — Mobile: Support entry in the sidebar drawer (US1, FR-003, SC-001)

1. Narrow the window to ≤768px (or use device emulation).
2. Open the sidebar drawer via the hamburger button.
3. **Expect**: a "Support" entry appears in the drawer, positioned immediately before "About".
4. Tap "Support".
5. **Expect**: the drawer closes and the Support Us page is displayed.
6. Press the device/browser back button once.
7. **Expect**: the app returns to the page you were on before tapping Support (not a site exit). → FR-005, SC-002.

### M3 — Support page content: three options + links (US2, FR-006, FR-007, FR-008, SC-003)

1. Navigate to the Support Us page.
2. **Expect**: a page title, an intro paragraph, and three clearly titled sections — Vote on Mortakaz, Contribute on GitHub, Star the repo — each with explanatory text and a link.
3. Click the "Vote on Mortakaz" link.
4. **Expect**: `https://www.mortakaz.com/projects/68dffdf65cb77a75592628f4` opens in a NEW browser tab; the Support page remains open behind it.
5. Return to the Support page. Click the "Contribute on GitHub" link.
6. **Expect**: `https://github.com/abdo13579/zakat-calculator` opens in a new tab.
7. Return. Click the "Star on GitHub" link.
8. **Expect**: the same GitHub repo opens in a new tab.
9. Toggle to Arabic.
10. **Expect**: all three section titles, explanatory paragraphs, and link labels render in Arabic with RTL layout. Repeat the link clicks — the same URLs open.

### M4 — Typography parity with About (US2, FR-009, SC-004)

1. Navigate to the About page. Note the heading sizes, weights, and the content card (background, padding, border, shadow).
2. Navigate to the Support Us page.
3. **Expect**: the `<h2>` title, `<h3>` section headings, and `<p>` text use the identical fonts, sizes, and weights as About; the content card looks the same (same background, padding, border, shadow).
4. Toggle dark/light theme (☀️/🌙).
5. **Expect**: both pages transition identically; no unthemed elements on the Support page.

### M5 — Bottom support prompt on every non-Support page (US3, FR-010, FR-011, SC-005)

1. On the Home page, scroll to the bottom.
2. **Expect**: above the copyright line, a clickable question link is present (reworded, e.g. "Find ZakatCalc helpful? Support us" — NOT the literal "Want to support us?").
3. Repeat on each calculator page (Fitr, Mal, Zuru, Anaam) and the About page.
4. **Expect**: the same prompt appears on every one of those pages.
5. Navigate to the Support Us page.
6. **Expect**: the prompt is NOT shown (only the copyright line appears). → FR-011.
7. Toggle to Arabic.
8. **Expect**: the prompt text appears in Arabic with RTL on every non-Support page, and is absent on the Support page.

### M6 — Bottom prompt navigation + back button (US3, FR-005, SC-002)

1. On the Home page, click the bottom support prompt.
2. **Expect**: the app navigates to the Support Us page.
3. Press the browser/device back button.
4. **Expect**: the app returns to the Home page (not a site exit).
5. Repeat from a calculator page (e.g. Mal) to confirm the prompt navigates and back returns to Mal.

### M7 — Keyboard accessibility (FR-013)

1. On any non-Support page, press Tab repeatedly to reach the bottom support prompt link.
2. **Expect**: the link receives a visible focus ring.
3. Press Enter.
4. **Expect**: the app navigates to the Support Us page.
5. On the Support page, Tab through the three external links and press Enter on each.
6. **Expect**: each opens its URL in a new tab.

---

## README Validation (FR-014, SC-007)

1. Open `README.md`.
2. **Expect**: a `## Support` section exists immediately after `## Contributing` and before `## License & Author`.
3. **Expect**: the section lists all three support options (vote, contribute, star) with the correct links (`mortakaz.com/...` and `github.com/abdo13579/zakat-calculator`).
4. **Expect**: all pre-existing sections (Overview, Features, Tech Stack, APIs, Project Structure, Getting Started, Deployment, Contributing, License & Author) are present and unmodified in content.
5. In the Project Structure tree, **expect** `SupportView.jsx` and `SupportView.module.css` listed among the views.

---

## Constitution Compliance Cross-Check

After validation, confirm by inspection:

- **No new dependencies**: `package.json` and `package-lock.json` are unchanged (Principle II).
- **No new outbound requests**: `src/services/api.js` is unchanged; `SupportView.jsx` contains no `fetch`/import of services (Principles II, IV, V).
- **No calculation changes**: `src/domain/*.js` and all calculator views are unchanged (Principle I).
- **Bilingual + accessible**: every new string has an Arabic counterpart (A1 proves this); new links have `aria-label` and are keyboard-operable (M7) (Principle III).

---

## Done When

- [ ] `npm test` passes (A1) — i18n parity gate green.
- [ ] `npm run build` succeeds with no errors (A2).
- [ ] M1–M7 all produce the expected outcomes in both English and Arabic, in both light and dark themes.
- [ ] README validation (above) passes.
- [ ] Constitution compliance cross-check confirms no new deps, no new requests, no calc changes.
