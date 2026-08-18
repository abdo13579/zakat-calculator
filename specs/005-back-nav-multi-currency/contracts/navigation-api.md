# Contract: In-App Navigation History API (NEW)

**Consumers**: `App.jsx`, `Sidebar.jsx`, the manual quickstart validation guide. Implemented by a custom hook `src/hooks/useViewHistory.js`. This contract freezes the navigation behavior mandated by spec FR-010 through FR-014.

## Behavioral contract

| Behavior | Contract |
|----------|----------|
| URL | UNCHANGED by in-app navigation. `pushState` is always called with the empty URL argument `''` so the address bar never changes. |
| Back button (device/browser) | Returns to the previously viewed in-app page instead of exiting the site, for every in-app navigation (FR-010). |
| Forward button | Navigates forward through the same in-app order the user previously traversed (FR-011). |
| Landing/first view + back | With no prior in-app entry, exiting the site is acceptable (FR-012). No synthetic "exit" entry is pushed. |
| Sidebar open + first back | Closes the sidebar; the current view does NOT change (FR-014). |
| Sidebar open + second back | Navigates to the previous view as normal (FR-014). |
| Sidebar closed manually | Click-away or item selection closes the sidebar AND pops the sentinel history entry via `history.back()` so the stack stays aligned with the visible UI. |
| Refresh | Returns to the landing view (URL unchanged → refresh loads the app at its entry state). Deep-linking is out of scope. |
| Persistence | Navigation history is NOT persisted; it is the browser's session `window.history`. |

## Hook surface

```text
useViewHistory({ views, initialView, isSidebarOpen, onCloseSidebar }) → {
  view: string,
  navigate(toView: string): void,
  onSidebarOpen(): void,
  onSidebarClosed(): void,
  canGoBack: boolean
}
```

- `views`: the list of valid view ids (`['landing','fitr','mal','zuru','anaam','about']`), used only for validation/parity.
- `initialView`: `'landing'`.
- `isSidebarOpen`: current sidebar open/close state (from `App.jsx`). The hook reads this to decide whether a `popstate` should close the sidebar or navigate.
- `onCloseSidebar`: callback the hook invokes to close the sidebar when a back press is consumed by the close-first behavior.
- `view`: the current view id to render (drives the existing `{view === 'fitr' && <FitrView/>}` branches in `App.jsx`).
- `navigate(toView)`: called by Header/Sidebar/Landing links instead of the current `setView`. Internally `pushState({ view: toView }, '')` and updates the returned `view`.
- `onSidebarOpen()`: called by the sidebar toggle handler when the sidebar transitions closed→open. Internally `pushState({ view, sidebar: true }, '')` (the sentinel entry).
- `onSidebarClosed()`: called when the sidebar is closed by any non-back means (click-away, item selection). Internally calls `history.back()` to pop the sentinel so the stack stays aligned.
- `canGoBack`: derived from `window.history.length > 1` (advisory; the hook does not require this to function).

## popstate handling

On `popstate`, the hook inspects `event.state`:

1. If `event.state?.sidebar === true` → call `onCloseSidebar()`. Do NOT change `view`. (The sentinel was consumed.)
2. Else if `event.state?.view` is a known view id → set `view = event.state.view`.
3. Else (no state, e.g. the very first load entry) → set `view = initialView` (`'landing'`).

This ordering produces the mandated UX: while the sidebar is open, the first back press hits the sentinel and closes the drawer; subsequent back presses hit real view entries and navigate.

## Edge cases

- Rapid navigation: each `navigate` pushes one entry; the browser handles ordering. No dedup.
- `pushState` is not fired as `popstate` (only `back/forward` fire `popstate`), so programmatic `navigate` does not double-trigger.
- When `navigate` is called with the same view as the current one, the hook still pushes an entry (matching the user's mental model that they "navigated"). The implementation MAY optionally no-op; chosen behavior MUST be consistent and documented in `tasks.md`. Default: push, to keep history linear with user actions.
- No persistence: on full page reload, the hook re-initializes with `view = initialView` regardless of prior session state (accepted trade-off).
- `window`/`document` are guarded for SSR safety (consistent with existing `I18nContext.jsx` guards), though the app is client-only.

## Non-goals

- No URL changes, no hash routing, no path routing.
- No scroll restoration beyond the existing `window.scrollTo({ top: 0, behavior: 'smooth' })` in `App.jsx`'s navigate wrapper.
- No analytics or telemetry on navigation (Constitution Principle V).
