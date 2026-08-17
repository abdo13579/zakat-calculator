# Research: React Migration with Feature & Visual Parity

**Phase 0 output** — all decisions resolved from the implementation-plan interview, the merged
constitution v2.0.0, and targeted inspection of the legacy code (`js/app.js`, `index.html`).
No open NEEDS CLARIFICATION items remain.

## D1. Scaffold placement and legacy coexistence

- **Decision**: Scaffold Vite in place at the repository root (its `index.html` becomes the app
  entry). Move legacy `index.html`, `js/`, `css/` into a temporary `legacy/` folder for local
  side-by-side comparison during development; delete `legacy/` at parity sign-off (FR-010).
- **Rationale**: Vite requires a root `index.html`, which collides with the legacy page. The
  `legacy/` move preserves a runnable local baseline without affecting the deployed parity
  baseline (the live site is served from `main`, untouched by this branch).
- **Alternatives considered**: scaffold in a subfolder and move later (rejected — path churn and
  a second big-bang move); delete legacy immediately (rejected — loses the local comparison
  baseline before parity is proven); keep legacy at root alongside Vite (impossible — entry
  file name collision).

## D2. CSS Modules mapping

- **Decision**: Split legacy `css/style.css` 1:1 into per-component `*.module.css` files;
  extract shared custom properties (color/theme variables) into `src/styles/tokens.css` and
  true globals (reset, layout shell) into `src/styles/global.css`. No visual edits.
- **Rationale**: Parity demands byte-level visual equivalence; a mechanical 1:1 mapping makes
  the CSS review a pure move operation with an auditable mapping table.
- **Alternatives considered**: redesign during the move (rejected — Phase 2 scope); a single
  global stylesheet kept as-is (rejected — defeats CSS Modules and Phase 2 tokenization).

## D3. i18n mechanism (replicates legacy behavior exactly)

- **Decision**: `I18nContext` holding `lang` with `t(key)`, backed by
  `src/i18n/translations.js` shaped `{ en: {...}, ar: {...} }`. Exact legacy behaviors to
  replicate: persistence in `localStorage['zakatcalc_lang']`; **default language `ar`**;
  `dir="rtl|ltr"` set on BOTH `html` and `body`; fallback chain
  `translations[lang]?.[key] || translations.en[key] || key`; placeholders translated
  (legacy `data-i18n-placeholder`); select `<option>` labels translated.
- **Rationale**: These behaviors were extracted directly from `js/app.js` (lines 3, 179,
  214–261); parity means users and their stored preferences notice nothing.
- **Alternatives considered**: react-i18next (rejected — interview decision; unnecessary
  dependency under Principle II); default `en` (rejected — legacy default is `ar`; changing it
  would be a user-visible regression).

## D4. Theme mechanism

- **Decision**: `ThemeContext` with `dark`/`light`, persisted in
  `localStorage['zakatcalc_theme']`, applied via the same CSS custom-property theme variables
  as legacy.
- **Rationale**: Matches legacy `js/app.js` (lines 337–346) exactly, including storage key and
  values.
- **Alternatives considered**: `prefers-color-scheme`-only without persistence (rejected —
  parity requires the persisted manual toggle).

## D5. Testing approach

- **Decision**: Vitest with the default node environment; tests target only the pure domain
  modules (`fitr.js`, `mal.js`, `zuru.js`) using the vectors in
  `contracts/calculation-api.md`, including inclusive Nisaab boundaries (≥).
- **Rationale**: Interview decision (calc-logic testing); pure functions need no DOM, keeping
  the suite fast and dependency-free. Satisfies the constitution's automated-test merge gate.
- **Alternatives considered**: adding React Testing Library / jsdom for component tests
  (rejected for this phase — extra dependencies, manual checklist covers UI parity; candidate
  for later phases).

## D6. Manual deployment mechanics

- **Decision**: Deploy with `git subtree push --prefix dist origin gh-pages` after
  `npm run build`; document the exact commands in the README.
- **Rationale**: Zero added dependencies — the `gh-pages` npm package would itself require a
  Principle II justification; `git subtree` is built in and reproducible.
- **Alternatives considered**: `gh-pages` package (rejected — unjustified dependency); GitHub
  Actions CI (rejected — interview decision #9 chose manual deploy).

## D7. Third-party assets (fonts, icons)

- **Decision**: Keep Font Awesome 6 and IBM Plex Sans Arabic as CDN `<link>` tags in
  `index.html`, exactly as legacy.
- **Rationale**: Parity phase — no visual or asset changes; constitution explicitly permits
  "font and icon packages via npm or CDN".
- **Alternatives considered**: npm-bundled fonts/icons (deferred — the icon-library decision,
  e.g. lucide-react, belongs to Phase 2's design modernization).
