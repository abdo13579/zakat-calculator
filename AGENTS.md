# AGENTS.md

Compact guidance for OpenCode sessions working in this repo. Verify against the executable sources before trusting docs.

## Commands

- `npm run dev` — Vite dev server (root path `/`).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built bundle.
- `npm test` — runs `vitest run` (no watch, exits).
- **No `lint` or `typecheck` scripts exist. Do not run or fabricate them.** If you add tooling, register it in `package.json` here so future sessions know.

Run a single test file: `npx vitest run src/domain/__tests__/mal.test.js`
Run a single test by name: `npx vitest run -t "4 persons"`

## Test layout (do not assume jsdom)

- `vitest` config in `vite.config.js`: `environment: 'node'`, include pattern `src/**/__tests__/**/*.test.{js,jsx}`.
- Tests live **only** in `src/domain/__tests__/` (pure calculation logic) and `src/i18n/__tests__/` (EN/AR catalog parity). There are **no component or view tests** — do not assume DOM testing utilities are set up; if you need them, you must add `jsdom` + a test environment override.
- Domain modules (`src/domain/{fitr,mal,zuru,anaam}.js`) are pure (zero I/O). Keep them side-effect-free so they stay unit-testable.

## Stack

Vite 5 + React 18 in plain JSX (no TypeScript) + CSS Modules + CSS custom properties. `src/main.jsx` wires providers in order: `I18nProvider → ThemeProvider → ToastProvider → App`. Don't reorder them (Toast and Theme depend on I18n).

## Routing

`App.jsx` uses a custom `useViewHistory` hook (`src/hooks/useViewHistory.js`) for history-aware view switching — **not `react-router`**. Valid views: `landing, fitr, mal, zuru, anaam, support, about`. Adding a view means registering it in the `views` array passed to `useViewHistory` and handling it in `App.jsx`'s render switch.

## i18n is enforced by tests

Every user-facing string must have both English and Arabic entries in `src/i18n/translations.js`. The parity test (`src/i18n/__tests__/translations.test.js`) fails if keys diverge between locales. **Adding a string without an Arabic translation breaks `npm test`.** Arabic must render RTL — `I18nContext` flips `dir`, don't set it manually.

## Constitution is authoritative

`.specify/memory/constitution.md` supersedes other practices. Key non-negotiables:

- **Shariah constants are frozen** (85g gold Nisaab, 2.5% rate, 3.0kg Fitr, 600kg + 10/5/7.5% Zuru, 5/30/40 Anaam with per-bracket schedules). Any change to a constant or formula **must cite a scholarly basis in the PR**.
- **No new runtime/build deps** beyond Vite/React/ReactDOM/Vitest without written justification in the PR.
- **Only two outbound endpoints allowed**: `open.er-api.com/v6/latest/USD` (FX) and `mintedmetal.com/api/prices.json` (gold, per troy oz → divide by 31.1035 for per gram). Both keyless + CORS. No API keys ever.
- All computation client-side; no user financial/household/herd data leaves the browser.
- Zakat Al-Mal is the only calculator needing the network. Fitr, Zuru, Anaam MUST work fully offline. Fetch failures in Mal MUST surface a visible error, never a silently stale result.

## Base path / deployment gotcha

`vite.config.js` sets `base: '/'`. The README and constitution still reference the stale `/zakat-calculator/` base path and GitHub Pages flow. **Trust `vite.config.js`.** Deployment target is Cloudflare Pages (`zakacalc.pages.dev`) — SPA fallback comes from `public/_redirects` (`/* /index.html 200`), the Cloudflare Pages convention. Update the stale docs if you change the base path.

## Spec-Kit workflow

This repo is spec-driven via Spec-Kit. Feature design lives in `specs/NNN-<slug>/` (`spec.md`, `plan.md`, `tasks.md`, `contracts/`, `data-model.md`). `.opencode/commands/speckit.*.md` define the workflows (`speckit-specify`, `speckit-plan`, `speckit-tasks`, `speckit-implement`, etc.). For non-trivial features, follow this flow rather than ad-hoc editing. Current active feature: `.specify/feature.json` → `specs/006-support-us-page`.

## Misc

- `legacy/` is the pre-React vanilla JS version, not part of the build. Don't edit unless explicitly asked.
- `.gitignore` contains `Agents.md` (that exact casing). Use **`AGENTS.md`** (all caps) so the file is tracked — a differently-cased variant is silently ignored on Linux.
- `CALCULATIONS.md` documents the math/fiqh formulas; update it whenever calculation methods or constants change.
- Browser automation: `.agents/mcp_config.json` wires a `chrome-devtools` MCP server at `http://127.0.0.1:9222` (launch Chrome with `--remote-debugging-port=9222` first).
