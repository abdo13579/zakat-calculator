# Phase 0 Research: Back Navigation & Multi-Currency Zakat Al-Mal

**Date**: 2026-08-18
**Feature spec**: [spec.md](./spec.md)

All clarifications were resolved during `/speckit-specify` grilling, so no `NEEDS CLARIFICATION` items entered planning. This document records the technical decisions that translate those product decisions into concrete design choices, with rationale and alternatives.

## R1 — Navigation model: History API without URL change

**Decision**: Use `window.history.pushState(state, '', '')` (empty URL arg → URL is unchanged) for every in-app navigation, and listen to the `popstate` event to drive view state backward/forward. Maintain a parallel session-scoped stack of visited view ids so we can decide whether the current back press should close an open sidebar or navigate.

**Rationale**: The spec mandates back/forward work in-session but explicitly accepts the trade-off that URLs do not change and refresh returns to the landing view (deep-linking is out of scope). `pushState` with an empty URL gives exactly this: the browser records a history entry so the device/browser back button is intercepted via `popstate`, but the address bar is untouched and refresh behavior is unchanged. This avoids the 404 risk of path-based routing on a static GitHub Pages host (a path like `/zakat-calculator/mal` would 404 on refresh without a fallback redirect, which the constitution does not allow us to add server-side).

**Alternatives considered**:
- *Hash routing (`#mal`)*: shareable and refresh-safe, but changes the URL, which the user explicitly declined. Would also require wiring hashchange handling and ensuring the GitHub Pages base path interacts correctly with the hash.
- *Path routing (`/mal`)*: cleanest URLs, but requires a 404→index fallback on the host; not available on plain GitHub Pages without a custom 404.html hack that the constitution's lean-stack principle discourages.
- *No history integration (current behavior)*: rejected — this is the bug being fixed.

**Boundary cases resolved**:
- Landing/first view + back: there is no prior in-app entry; the browser's default behavior (exit) is acceptable per FR-012. We do NOT push a synthetic "exit" entry.
- Rapid navigation: each `pushState` appends one entry; `popstate` pops in order — no dedup or skip logic needed.
- Sidebar open + back: the hook checks the sidebar-open flag first; if open, it closes the sidebar and pushes nothing (consuming the back press). This is implemented by intercepting the first back press: when the sidebar opens, we `pushState` a lightweight "sidebar" sentinel entry so that the next `popstate` is interpreted as "close sidebar" rather than "navigate back". When the sidebar is closed manually (tap away or item click), we `history.back()` to pop the sentinel so the history stack stays clean. This is the standard mobile-drawer pattern.

## R2 — Multi-currency conversion: single rate snapshot, USD as common currency

**Decision**: Introduce `calculateMalMulti({ entries, goldPricePerGramUsd, rates })` where `entries` is `[{ amount, currency }]` and `rates` is the object returned by `open.er-api.com/v6/latest/USD` (i.e. `rates[code]` = units of `code` per 1 USD). Conversion to USD per entry is `amount / rates[currency]` (because the rate is "currency per USD", dividing amount by the rate yields USD). The combined total is the sum of per-entry USD equivalents. Nisab in USD is `85 * goldPricePerGramUsd` (rate 1, since gold price is already per-gram USD). Eligibility: `totalUsd >= nisabUsd`. Zakat due: `eligible ? totalUsd * 0.025 : 0`.

**Rationale**: The existing `calculateMal` takes `wealth` in the user's selected currency plus an `exchangeRate` (units of selected currency per USD) and computes `nisaab = 85 * gold * exchangeRate`, `zakatDue = wealth * 0.025`. Multi-currency generalizes this: instead of converting nisab into the user's currency, convert all user amounts into USD (the currency the rate API and gold API both natively use), then compute nisab in USD. This is algebraically equivalent for a single entry and naturally extends to many. Using one rate snapshot for all entries guarantees internal consistency (no mixing of timestamps). The result is always in USD, matching the user's clarified decision.

**Same-currency merge**: Before conversion, entries with equal `currency` are summed into one per-currency total. This is a pure, order-independent transformation and belongs in the domain function so it is unit-tested.

**Alternatives considered**:
- *Convert nisab into each entry's currency and sum*: algebraically valid but more complex and harder to test; rejected in favor of a single common currency.
- *Pick a common currency other than USD*: USD is the native currency of both APIs (rate base is USD, gold price is USD), so USD minimizes conversion steps and floating-point error.
- *Per-entry timestamped rates*: the rate API returns one snapshot; per-entry timestamps are not available. Using a single snapshot is the only honest option and is documented as an assumption.

**Boundary cases resolved**:
- `rates[currency]` missing → the entry is rejected with a clear localized error and the calculation is aborted with no result displayed (FR-009/edge case).
- Rate fetch fails entirely → the view surfaces the fetch error and displays NO result (FR-009).
- Amount is 0 → contributes 0 (valid).
- Amount negative/empty/non-finite → row rejected, calculation aborted, no result displayed.
- Single entry → degenerates to the existing single-currency flow (backward compatibility, SC-007). The existing `calculateMal` is kept untouched for parity and direct unit testing; the new function is the multi-currency generalization.

## R3 — Arabic currency-name catalog

**Decision**: Add `src/utils/currencyNames.js` exporting a frozen map `CURRENCY_NAMES_AR` from ISO code → Arabic display name (e.g. `USD → 'دولار أمريكي'`, `EGP → 'جنيه مصري'`, `SAR → 'ريال سعودي'`). Add a helper `currencyDisplayName(code, lang)` in `src/utils/currency.js` that returns the Arabic name when `lang === 'ar'` and a name exists, otherwise falls back to the ISO code. The view passes the current `lang` from `useI18n()` to the helper.

**Coverage**: Per the user's clarification, every currency surfaced by the app must have an Arabic name. The set of surfaced currencies = `POPULAR_CURRENCIES` ∪ `Object.keys(rates)` (everything the rate API returns). The catalog will therefore include Arabic names for all ~160 ISO codes the `open.er-api.com` endpoint can return, curated from common Arabic financial usage. The ISO-code fallback handles any unexpected gap so the UI never breaks.

**Rationale**: Keeps the catalog as data (not inline JSX), is trivially testable (parity + presence), and reuses the existing i18n `lang` signal without inventing a new mechanism. Storing currency names in a dedicated module rather than inside `translations.js` keeps the translation file focused on UI strings and avoids flooding it with 160+ key pairs; the `lang` parameter preserves the bilingual contract (Principle III) — the catalog is the Arabic-side companion to the existing English ISO-code display.

**Alternatives considered**:
- *Put currency names directly in `translations.js` as `currency-USD` etc.*: would more literally follow the i18n contract but bloats the catalog with 160+ keys and complicates the parity test. Rejected in favor of a dedicated module, while still keeping the bilingual principle by gating on `lang`.
- *Only name the popular few*: explicitly rejected by the user ("for each currency you get or send to api, make translation for it").
- *Fetch names from another API*: violates the lean-stack and privacy principles (a new outbound endpoint). Rejected.

## R4 — Sidebar-aware back: sentinel history entry

**Decision**: When the sidebar opens, push a sentinel history entry (state `{ view, sidebar: true }`). On `popstate`, if the sidebar is currently open (`isSidebarOpen === true`), close the sidebar and do NOT change the view, consuming the back press. This closes the drawer first; the next back press then processes the preceding real `{ view }` entry and navigates. When the sidebar closes by any other means (click-away, item selection), programmatically call `history.back()` to pop the sentinel so the history stack stays aligned with what the user sees. Forward navigation to a `{ sidebar: true }` sentinel reopens the sidebar.

**Rationale**: This is the standard mobile-drawer pattern and gives the user-experience the spec mandates (FR-014): first back closes the drawer, second back navigates. Checking the current `isSidebarOpen` state ensures the close happens first, then the preceding view entry becomes the back destination. Keeping the sentinel in history state (not URL) is consistent with R1's no-URL-change decision. The hook owns this logic so `Sidebar.jsx` only needs to notify the hook of open/close transitions; the hook stays the single source of truth for history.

**Alternatives considered**:
- *Skip the sentinel and just check a sidebar-open ref on popstate*: race-prone because `popstate` firing and the ref reading are not atomic with the browser's history transition; the sentinel makes the intent explicit and reversible.
- *Always navigate on back, leave sidebar to close itself*: explicitly rejected by the user during grilling.

## R5 — Validation and error semantics for multi-currency rows

**Decision**: The domain function validates each entry: `amount` must be a finite number ≥ 0 and `currency` must be a non-empty string present in `rates`. Invalid entries cause the function to return a structured result `{ ok: false, errors: [{ index, code, messageKey }] }` rather than `null`, so the view can render per-row localized errors. Any invalid row (bad amount OR missing rate) aborts the calculation entirely and surfaces errors; no partial result is computed or displayed. The user must fix or remove the bad row before obtaining a result. This is the safest interpretation of the Shariah-accuracy-first principle for a multi-row form.

**Rationale**: The existing single-currency `calculateMal` returns `null` on invalid input. The multi-row form needs per-row feedback to be usable, but mixing partial results with religious calculations is dangerous. Aborting on any bad row, while showing which rows are bad, balances usability with the no-silent-stale-result rule.

**Alternatives considered**:
- *Compute from valid rows only, ignore bad ones*: rejected — risks a silently incorrect total that could mislead the user about their religious obligation.
- *Return `null` for the whole form on any bad row*: usable but loses per-row feedback.

## R6 — Backward compatibility and testing strategy

**Decision**: Keep `calculateMal` (single-currency) untouched so the existing `mal.test.js` vectors continue to pass and the single-entry UX path is preserved (SC-007). Add `calculateMalMulti` with new test vectors covering: single entry (parity with `calculateMal`), two different currencies, same-currency merge, zero amount, below-nisab combined total, above-nisab combined total, missing rate, invalid amount, empty entries. Extend `translations.test.js` to assert all new keys exist in both `en` and `ar`, and assert the Arabic currency-name catalog covers every key in `POPULAR_CURRENCIES` (sampling full coverage at test time is feasible since the catalog is static data).

**Rationale**: The constitution requires automated calculation-logic tests to pass before merge, and the i18n parity test is the enforcement mechanism for Principle III. Extending both is the minimal change that preserves existing guarantees while covering new behavior.

**Output**: All research decisions are reflected in Phase 1 design artifacts (`data-model.md`, `contracts/`, `quickstart.md`).
