# Implementation Plan — ZakatCalc: React Migration, Redesign & Al-Anaam Calculator

**Status**: Draft for review · **Created**: 2026-08-16
**Scope**: Transform ZakatCalc from vanilla HTML/CSS/JS to Vite + React + CSS Modules,
modernize the current design, then add a Zakat Al-Anaam (livestock) calculator.

---

## 1. Goals

1. Migrate the app to **Vite + React (JSX) + CSS Modules** with full feature and
   visual parity before any redesign.
2. **Modernize the current design** (same palette & branding; refined components,
   spacing, typography) using CSS Modules and design tokens.
3. Add a **Zakat Al-Anaam calculator** (camels, cattle/buffalo, sheep & goats) with a
   guided eligibility flow, per the documented fiqh guide.
4. Ship in **independently deployable phases**, each verifiable against the
   constitution.

## 2. Locked Decisions (from planning interview)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Governance | Phase 0 amends the constitution (MAJOR → v2.0.0) **before** any React code |
| 2 | Phase order | Parity-first: migrate → redesign → Al-Anaam |
| 3 | Design direction | Modernize current design (keep palette/branding) |
| 4 | Livestock scope | Camels, cattle (incl. water buffalo), sheep & goats |
| 5 | Fiqh basis | User-provided *Zakat al-An'am* guide (standard majority tables), encoded verbatim, with in-app disclaimer (Constitution Principle I) |
| 6 | i18n | Custom React Context + hook, key-value EN/AR JSON (replaces `data-i18n`) |
| 7 | Navigation | State-driven views (no router; preserves current behavior and GitHub Pages compatibility) |
| 8 | Testing | Vitest unit tests for all calculation logic; manual checklist for UI |
| 9 | Deployment | Manual: `vite build` → publish `dist/` to `gh-pages` branch |
| 10 | Al-Anaam UX | Guided flow with eligibility gate (Sa'imah, non-working, Hawl) before count input |

---

## Phase 0 — Constitution Amendment (v1.0.0 → v2.0.0)

**Goal**: Unblock the framework migration legally per the Governance section (MAJOR
bump: redefinition of Principle II).

**Tasks**

1. Run the constitution workflow (`.specify/memory/constitution.md`):
   - Rewrite **Principle II (Buildless Vanilla Stack)** → e.g. *"Lean Static SPA
     Stack"*: Vite + React + CSS Modules, static output, no server component, no
     state-management library, dependencies require justification.
   - Update **Principle III** wording: `data-i18n` → i18n Context with EN/AR JSON.
   - Update **Additional Constraints**: stack (Vite, React, CSS Modules, Vitest),
     Vite `base: '/zakat-calculator/'`, manual `gh-pages` deploy; API endpoints and
     keyless/CORS constraints unchanged.
   - Update **Development Workflow**: add `npm test` (Vitest) as a merge gate for
     calculation logic; keep the bilingual/RTL/theme manual checklist.
   - Principles I (Shariah accuracy), IV (graceful degradation), V (client-side
     privacy) remain unchanged in substance.
2. Verify the Sync Impact Report and version line (2.0.0, MAJOR rationale recorded).

**Deliverable**: Amended constitution, committed separately before code work.
**Exit criteria**: Constitution v2.0.0 merged; no `[PLACEHOLDER]` tokens remain.

---

## Phase 1 — Vite + React Migration (Feature & Visual Parity)

**Goal**: The React app looks and behaves exactly like the current live app. No design
changes in this phase.

### Tasks

1. **Scaffold**: `npm create vite@latest` (React, JavaScript) at the repo root on a
   `feat/react-migration` branch; configure `vite.config.js` with
   `base: '/zakat-calculator/'`.
2. **Structure** (target):
   ```
   ├── index.html                 # Vite entry (replaces current index.html)
   ├── vite.config.js
   ├── public/                    # favicon.svg, img.png
   └── src/
       ├── main.jsx, App.jsx
       ├── i18n/                  # I18nContext + hook, en.json, ar.json
       ├── theme/                 # ThemeContext (localStorage persistence)
       ├── services/api.js        # getCurrencyRates(), getGoldPrice() — ported 1:1
       ├── domain/                # fitr.js, mal.js, zuru.js (pure calc functions)
       ├── components/            # Header, Nav, Footer, CalculatorCard, ...
       ├── views/                 # Landing, FitrView, MalView, ZuruView, AboutView
       └── styles/                # tokens.css (CSS custom properties), global.css
   ```
3. **Port i18n**: extract every `data-i18n` string from the current `index.html` and
   `app.js` into `en.json` / `ar.json`; build `I18nContext` with `lang`, `t(key)`,
   `dir`; document RTL switching (`document.dir`) parity.
4. **Port theme**: light/dark via CSS custom properties + `localStorage`, matching
   current behavior.
5. **Port views** with CSS Modules: split `css/style.css` into per-component
   `.module.css` files, copying rules 1:1 (no visual edits); shared values go to
   `styles/tokens.css`.
6. **Port logic**: move all calculator math into pure functions under `src/domain/`;
   components only handle form state and rendering. Port `api.js` unchanged
   (including `null`-on-failure contract and per-gram conversion ÷ 31.1035).
7. **State-driven navigation**: replicate current section show/hide behavior with
   React state; preserve landing → calculator → back flow, hamburger/sidebar on
   mobile.
8. **Tests**: add Vitest; unit-test `fitr.js`, `mal.js`, `zuru.js` against the README
   formulas with known inputs/outputs.
9. **Cleanup & docs**: delete vanilla `js/`, `css/`, and old `index.html` once parity
   is verified; update README (dev: `npm run dev`, build: `npm run build`, deploy
   steps, new project structure).
10. **Deploy**: `npm run build`, publish `dist/` to `gh-pages` manually; smoke-test
    the live URL.

**Exit criteria** (all required)

- Visual diff vs. current live site: no unintended differences in EN or AR (RTL).
- All three calculators return identical results for a fixed set of known inputs.
- Theme persistence, copy-to-clipboard, loading/error states, and offline behavior
  for Fitr/Zuru all work as before.
- `npm test` green; manual constitution checklist (bilingual, RTL, themes, known
  inputs) signed off in the PR.

---

## Phase 2 — Design Modernization

**Goal**: A visibly refreshed UI that keeps the current palette and brand identity.

### Tasks

1. **Design tokens**: consolidate `tokens.css` — color scale (existing palette),
   spacing scale, type scale, radii, shadows; both themes.
2. **Typography**: refine hierarchy and Arabic/Latin pairing (keep IBM Plex Sans
   Arabic or justify a change); establish a type scale.
3. **Component polish** (CSS Modules only, no component library): buttons, form
   fields, calculator cards, result panels, header/nav, sidebar; consistent focus
   rings and hover states.
4. **Icons** *(open decision)*: replace CDN Font Awesome with `lucide-react`
   (tree-shaken React components). Default: adopt lucide-react unless vetoed during
   this phase's review.
5. **Responsive & motion**: tighten mobile breakpoints; add subtle transitions
   (theme toggle, view switches) respecting `prefers-reduced-motion`.
6. **Accessibility pass**: contrast ratios, visible focus states, ARIA on all
   interactive elements, keyboard walkthrough of every view (Constitution
   Principle III).
7. Update README screenshot (`img.png`).

**Exit criteria**: design review approval (screenshots EN+AR, both themes, desktop +
mobile in PR); accessibility checklist signed off; `npm test` still green; manual
deploy to Pages.

---

## Phase 3 — Zakat Al-Anaam (Livestock) Calculator

**Goal**: A guided, bilingual livestock Zakat calculator encoding the user-provided
fiqh guide verbatim.

### Domain model (`src/domain/anaam.js`) — pure functions + data tables

1. **Species**: camels (`ibil`), cattle incl. water buffalo (`baqar`), sheep & goats
   combined (`ghanam`).
2. **Eligibility gate** (all must be true, else "no Zakat due" with explanation):
   grazing Sa'imah > 6 months/year, non-working animals, Nisab held one full Hawl.
   Stall-fed-for-trade is shown as an informational note pointing to trade-goods
   Zakat (2.5%) — not calculated here.
3. **Camel table** (verbatim from the guide): 5–9→1 shāh; 10–14→2; 15–19→3; 20–24→4;
   25–35→1 bint makhāḍ; 36–45→1 bint labūn; 46–60→1 ḥiqqah; 61–75→1 jadha'ah;
   76–90→2 bint labūn; 91–120→2 ḥiqqah.
   **>120 rule**: floor to the nearest multiple of 10 (waqs), decompose
   `n = 50·x + 40·y` maximizing `x` → `x` ḥiqqah + `y` bint labūn. Ties (e.g. 200)
   resolve to the ḥiqqah-max form (guide lists "4 Ḥiqqah" first); the alternative is
   noted in the result.
4. **Cattle table** (verbatim): 30–39→1 tabī'; 40–59→1 musinnah; 60–69→2 tabī';
   70–79→1 musinnah + 1 tabī'; 80–89→2 musinnah; 90–99→3 tabī'; 100–109→1 musinnah
   + 2 tabī'; 110–119→2 musinnah + 1 tabī'; 120–129→3 musinnah.
   **≥130 rule**: floor to multiple of 10 (waqs), decompose `n = 40·y + 30·x`
   maximizing `y` → `y` musinnah + `x` tabī' (ties resolve musinnah-first, matching
   the guide's ordering).
5. **Sheep & goats** (verbatim): 40–120→1; 121–200→2; 201–399→3; ≥400→`floor(n/100)`.
6. **Output**: structured result — list of due animals with Arabic fiqh terms +
   transliteration + plain-language description (e.g. "2 Ḥiqqah — two female camels
   entering their 4th year"), or "below Nisab / conditions not met" messaging.

### UI flow (new `AnaamView`)

1. Species selector (three cards).
2. Eligibility checklist (grazing, non-working, Hawl) — any "no" short-circuits to
   an explanation screen.
3. Count input → live result with breakdown; copy-to-clipboard support.
4. Fiqh note + scholarly disclaimer (Constitution Principle I); reference to the
   source guide in the README.
5. Landing page card + navigation entry; full EN/AR strings for all fiqh terms
   (بنت مخاض، بنت لبون، حقة، جذعة، تبيع، مسنة، شاة…).

### Tests (Vitest) — the merge gate

- Every bracket boundary of all three tables (e.g. 4→0, 5→1 shāh, 24→4, 25→bint
  makhāḍ; 29→0, 30→tabī'; 39→0, 40→1, 399→3, 400→4).
- The guide's three worked examples as literal test cases: 260 sheep→3; 75 cattle→1
  musinnah + 1 tabī'; 140 camels→2 ḥiqqah + 1 bint labūn.
- Waqs cases (e.g. 65 cattle→2 tabī'; 135 camels→result for 130) and tie cases
  (200 camels→4 ḥiqqah).

**Exit criteria**: all tests green; guided flow verified in EN and AR (RTL);
eligibility dead-ends show correct explanations; README updated (usage + calculation
method + disclaimer); manual deploy to Pages.

---

## 3. Testing & Verification Strategy (all phases)

- `npm test` (Vitest) must pass before every merge; calculation logic is 100%
  unit-tested (Constitution Principle I).
- Manual checklist per PR: loads from a static host, EN/AR parity, RTL correctness,
  both themes, keyboard navigation, known-input results.
- Each phase ends with a manual GitHub Pages deploy and a live smoke test.

## 4. Deployment (manual)

1. `npm run build` → `dist/`.
2. Publish `dist/` to the `gh-pages` branch (e.g. `git subtree push` or
   `gh-pages` package — pick during Phase 1).
3. Verify `https://abdo13579.github.io/zakat-calculator/` after each phase.

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Fiqh table mis-encoding (Principle I breach) | Tables encoded verbatim from the user-provided guide; boundary tests; worked examples as tests; disclaimer retained |
| RTL regressions in React | RTL check in every phase's exit criteria; AR strings reviewed per PR |
| Bundle/dependency creep | Constitution v2.0.0 keeps "dependencies require justification"; only react, react-dom, vite, vitest (+ lucide-react pending decision) |
| Parity drift during Phase 1 | Side-by-side screenshot comparison against current live site before merge |

## 6. Out of Scope (explicit)

- Cash-value (Qimah) livestock payment option (Hanafi position) — future candidate.
- Khultah (partnership/joint herd) calculations — future candidate.
- Multiple madhhab tables / madhhab selector.
- Trade-goods Zakat for stall-fed herds (referenced as a note only).
- Automated CI/CD pipeline (deployment stays manual per decision #9).
- React Router (state-driven navigation per decision #7).
