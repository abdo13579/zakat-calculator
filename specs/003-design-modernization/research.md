# Research: Design Modernization

**Feature**: [spec.md](specs/003-design-modernization/spec.md)
**Date**: 2026-08-17

## Research Tasks & Findings

### R1: Expanded Design Token Scale

**Task**: Determine the optimal token architecture for a bilingual (RTL/LTR) calculator app with light/dark theme support.

**Decision**: Three-tier token hierarchy — Primitive → Semantic → Component.

**Rationale**: Primitive tokens define raw values (colors, spacing, radii, shadows). Semantic tokens map primitives to purpose (e.g., `--color-surface`, `--color-on-surface`, `--color-interactive`). Component tokens are scoped overrides for specific components where needed. This is the standard approach used by Material Design, Spectrum, and Radix — it balances flexibility with maintainability. For a project of this size (~12 CSS files), two tiers (primitive + semantic) are sufficient, with component-level overrides handled in CSS Module files.

**Alternatives considered**:
- Flat single-tier tokens (current state: 7 variables) — rejected because it forces hardcoded values everywhere and makes theme switching fragile.
- Full three-tier with component tokens in `:root` — rejected as over-engineered for this project size.

---

### R2: Color Palette Refinement

**Task**: Define a refined palette that preserves the teal/cyan brand identity while eliminating the overpowering cyan page tint.

**Decision**: Retain the primary hue (`#01c5d3` teal) and gold accent (`#d4af37`) but shift backgrounds to warm neutrals. Define a full shade scale (50–900) for primary, neutral, and accent colors. Light mode uses neutral warm grays (`#fafafa` / `#f5f5f4`) for backgrounds instead of `#d6fcff`. Dark mode uses slate-based backgrounds (`#0f172a`, `#1e293b`, `#334155`) for layered depth.

**Rationale**: The current `#d6fcff` background overwhelms the content with cyan tint, making the app feel clinical rather than trustworthy. Neutral backgrounds let the teal accent shine as interactive highlights (buttons, links, focus rings) rather than ambient noise. The 3-level dark mode surface scale (base → surface → elevated) solves the flat `box-shadow: none` problem.

**Alternatives considered**:
- Pure white backgrounds — rejected as too flat and lacking warmth for the domain.
- Complete rebrand with new hue — rejected per spec assumption: refine, don't replace.

---

### R3: CSS Logical Properties Migration Strategy

**Task**: Determine the best approach for migrating physical CSS properties to logical equivalents.

**Decision**: Replace all physical directional properties (`left`, `right`, `margin-left`, `padding-right`, `border-left`, `text-align: left/right`, `float: left/right`) with logical equivalents (`inset-inline-start`, `inset-inline-end`, `margin-inline-start`, `padding-inline-end`, `border-inline-start`, `text-align: start/end`). Remove all `body[dir="rtl"]` override blocks once the logical equivalents are in place.

**Rationale**: CSS logical properties are supported in all target browsers (Chrome 87+, Firefox 66+, Safari 15+, Edge 87+). They automatically flip for RTL without any directional overrides, making the codebase more maintainable and less error-prone when adding new elements. This directly addresses the current pain of maintaining parallel `body[dir="rtl"]` rules.

**Alternatives considered**:
- Keep physical properties with RTL overrides — rejected because it's fragile and maintenance-heavy.
- Use a CSS-in-JS library for auto-flipping — rejected per constitution Principle II (no new dependencies).

---

### R4: Dark Mode Elevation & Depth Strategy

**Task**: Determine how to create visual depth and layered surfaces in dark mode.

**Decision**: Use a combination of surface color stepping and subtle border tinting. Define 3 surface levels: `--color-surface-base` (darkest), `--color-surface-card` (mid), `--color-surface-elevated` (lightest). Add subtle `1px` borders with low-opacity white (`rgba(255,255,255,0.06)`) on cards and elevated surfaces. Restore `box-shadow` in dark mode with very subtle, tinted shadows rather than removing them entirely.

**Rationale**: Material Design 3's dark theme guidance recommends surface tinting (lighter = more elevated) with subtle borders for definition. This creates perceptible depth without the harsh contrast that box-shadows produce on dark backgrounds. The current approach of `box-shadow: none` for dark mode creates a flat, indistinguishable layout.

**Alternatives considered**:
- Glassmorphism (backdrop-filter blur) — rejected as too heavy for a utility calculator and potentially problematic on older mobile browsers.
- Only color stepping without borders — rejected because on some displays the color difference between adjacent surfaces is imperceptible without border delineation.

---

### R5: Form Input Group Pattern

**Task**: Determine the best pattern for inline unit/currency indicators adjacent to form inputs.

**Decision**: Input group pattern — a flex container wrapping an `<input>` element and an adjacent `<span>` addon badge that displays the unit/currency. The addon sits at the `inline-end` position for currency inputs (e.g., `[123.45] [SAR]`) and at the `inline-end` for weight inputs (e.g., `[50] [kg]`). The addon inherits the input's border and background to appear as a seamless extension.

**Rationale**: This is the most universally recognized input group pattern (used by Bootstrap, Material, Ant Design). It's accessible (the addon is connected via `aria-describedby`), direction-agnostic (using `inline-end` placement), and doesn't require new dependencies — just CSS flex styling on a wrapper `<div>`.

**Alternatives considered**:
- Floating label inside the input — rejected because currency codes and units are metadata, not labels, and floating labels can conflict with the actual input label.
- Prefix position (addon before input) — rejected as inconsistent with how users read number-then-unit in both Arabic and English contexts for weights, though currency could work either way. Consistent `inline-end` for all addons is simpler.

---

### R6: Declarative Toast/Notification Architecture

**Task**: Determine the best pattern to replace imperative DOM injection for notifications.

**Decision**: Create a `ToastContext` provider + `useToast()` hook pattern. The provider maintains a state array of active toasts. Components call `toast.success(message)` or `toast.error(message)`. The provider renders a toast container portal at the top of the DOM tree. Each toast auto-dismisses after 5 seconds (configurable). Sequential toasts replace the previous one with a brief exit/enter transition.

**Rationale**: This follows the same context-provider pattern already used for theme (`ThemeContext`) and i18n (`I18nContext`) in this project. It's zero new dependencies, fully declarative React state, and eliminates both the imperative `document.createElement` + `setTimeout` in ResultCard and the `CustomEvent` dispatch in GlobalMessage. The replacement-over-stacking model is simpler for a utility app (users rarely trigger rapid-fire notifications).

**Alternatives considered**:
- React portal with stacking queue — rejected as over-complex for the notification frequency in this app.
- Third-party toast library (react-hot-toast, sonner) — rejected per constitution Principle II (no new runtime dependencies without justification, and the functionality is simple enough to build in-house).
- Keep GlobalMessage as-is and only fix ResultCard — rejected because half-modern half-imperative is worse than fully consistent.

---

### R7: Theme Transition (No-FOUC) Strategy

**Task**: Determine how to prevent flash-of-unstyled-content during theme switching.

**Decision**: Apply the theme class (`dark-mode`) synchronously via a blocking inline script in `<head>` that reads `localStorage` before the page renders. CSS transitions on `background-color`, `color`, and `border-color` with a `0.15s ease` duration handle smooth animated switching. The `ThemeContext` initializes from the same `localStorage` value to stay in sync.

**Rationale**: The current `ThemeContext` already reads `localStorage` on mount, but if the body class is applied after React hydration, there's a brief flash. A tiny inline `<script>` in `<head>` that applies the class before first paint is the standard solution (used by Next.js, Docusaurus, etc.). CSS transitions on theme-sensitive properties complete the smooth switch.

**Alternatives considered**:
- `prefers-color-scheme` media query only — rejected because the app has an explicit toggle and users expect their choice to persist.
- `color-scheme` CSS property — can be used as a supplement but doesn't replace the need for custom token switching.
