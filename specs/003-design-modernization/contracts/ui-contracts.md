# UI Contracts: Design Modernization

**Feature**: [spec.md](specs/003-design-modernization/spec.md)
**Date**: 2026-08-17

## Overview

ZakatCalc is a client-side SPA with no external API surface. The "contracts" for this design modernization are **UI component contracts** — the visual and behavioral specifications that each component primitive must satisfy, ensuring consistency across all views.

---

## Contract: Button

### Visual States

| State | Background | Text Color | Border | Shadow | Transform |
|-------|-----------|------------|--------|--------|-----------|
| **Default** | `var(--color-interactive)` | `#ffffff` | none | none | none |
| **Hover** | `var(--color-interactive-hover)` | `#ffffff` | none | `var(--shadow-sm)` | `translateY(-1px)` |
| **Active** | `var(--color-interactive-hover)` | `#ffffff` | none | none | `translateY(0)` |
| **Focus** | `var(--color-interactive)` | `#ffffff` | none | `0 0 0 3px var(--color-focus-ring)` | none |
| **Disabled** | `var(--color-interactive)` at 50% opacity | `#ffffff` | none | none | none; `cursor: not-allowed` |

### Variants

| Variant | Description | Usage |
|---------|-------------|-------|
| **Primary** | Solid filled button (default) | CTA buttons: "Calculate", form submit |
| **Secondary** | Outlined, transparent background | Action buttons: "Copy Result" |

### Sizing

- Padding: `var(--space-sm) var(--space-lg)` (default)
- Font size: `var(--text-base)`
- Font weight: `var(--weight-medium)`
- Border radius: `var(--radius-md)`
- Min width: `150px` for form submit buttons
- Full width on mobile (≤768px) for primary form buttons
- Transition: `all var(--transition-fast)`

---

## Contract: Text Input

### Visual States

| State | Border Color | Shadow | Background |
|-------|-------------|--------|------------|
| **Default** | `var(--color-border)` | none | `var(--color-surface)` |
| **Hover** | `var(--color-border)` darker step | none | `var(--color-surface)` |
| **Focus** | `var(--color-interactive)` | `0 0 0 3px var(--color-focus-ring)` | `var(--color-surface)` |
| **Error** | `var(--color-error)` | `0 0 0 3px rgba(error, 0.15)` | `var(--color-surface)` |
| **Valid** | `var(--color-success)` | none | `var(--color-surface)` |
| **Disabled** | `var(--color-border)` | none | `var(--color-bg)` at 60% opacity |

### Sizing

- Padding: `var(--space-sm) var(--space-md)`
- Font size: `var(--text-base)`
- Border radius: `var(--radius-md)`
- Border width: `1px` solid
- Width: `100%` (fills container)
- Transition: `border-color var(--transition-fast), box-shadow var(--transition-fast)`

---

## Contract: Input Group (Input + Addon)

### Structure

```
┌─────────────────────────────────────────────┐
│  .input-group (display: flex)                │
│  ┌────────────────────────┬────────────────┐ │
│  │  <input>               │  .input-addon  │ │
│  │  [user types here]     │  [SAR] or [kg] │ │
│  └────────────────────────┴────────────────┘ │
└─────────────────────────────────────────────┘
```

### Behavioral Contract

- The input takes all available width (`flex: 1`)
- The addon has fixed content width (`flex: none`)
- When the input is focused, both input and addon show the focus border treatment
- The addon has no independent border — it shares a continuous border with the input
- Input has `border-inline-end: none`; addon has matching border (seamless join)
- Both use the same `border-radius` but only on their respective outer corners:
  - Input: `border-start-start-radius` and `border-end-start-radius`
  - Addon: `border-start-end-radius` and `border-end-end-radius`
- In RTL, logical properties automatically flip the border and radius

### Addon Styling

- Background: slightly muted (`var(--color-bg)`)
- Text color: `var(--color-on-surface-muted)`
- Font weight: `var(--weight-medium)`
- Padding: `var(--space-sm) var(--space-md)`
- Non-interactive (no hover/click states)

---

## Contract: Select (Dropdown)

### Visual States

Same as Text Input (default, hover, focus, error, disabled).

### Additional Rules

- Custom dropdown arrow icon (using CSS background-image or Font Awesome icon)
- Arrow position: `inline-end` (adapts to direction)
- Same height and border treatment as text inputs for visual alignment
- `appearance: none` with custom styling

---

## Contract: Card

### Variants

| Variant | Usage | Elevation |
|---------|-------|-----------|
| **Surface** | Calculator result cards, about content | `var(--shadow-card)` |
| **Interactive** | Landing page feature cards | `var(--shadow-card)` → `var(--shadow-elevated)` on hover |

### Visual Properties

- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)` (light mode), `1px solid var(--color-border-subtle)` (dark mode, for depth)
- Border radius: `var(--radius-lg)`
- Padding: `var(--space-lg)`
- Dark mode: retains subtle shadow (not `box-shadow: none`)

### Result Card Specific

- Accent border: `3px solid var(--color-interactive)` on `border-inline-start` (adapts to direction)
- Contains heading (`var(--text-lg)`, `var(--weight-semibold)`), result body, and action bar
- Action bar separated by `1px solid var(--color-border)` divider

---

## Contract: Toast Notification

### Layout

- Container: fixed position, top-center, below header (`top: 5rem`)
- Max width: `480px`, centered horizontally
- Z-index: above content, below header (`z-index: 998`)

### Visual Variants

| Variant | Background | Text | Border | Icon |
|---------|-----------|------|--------|------|
| **Success** | `var(--color-success)` tinted bg | contrast text | `1px solid` tinted border | `fa-check-circle` |
| **Error** | `var(--color-error)` tinted bg | contrast text | `1px solid` tinted border | `fa-exclamation-circle` |
| **Info** | `var(--color-info)` tinted bg | contrast text | `1px solid` tinted border | `fa-info-circle` |

### Animation

- **Enter**: slide down + fade in (150ms ease-out)
- **Exit**: slide up + fade out (150ms ease-in)
- Auto-dismiss: 5 seconds
- Replacement: current toast exits, new toast enters (no overlap)

### Accessibility

- `role="status"`, `aria-live="polite"`
- Keyboard: not focusable (auto-dismisses), but visible to screen readers

---

## Contract: Typography Scale

| Level | Token | Size | Weight | Color | Usage |
|-------|-------|------|--------|-------|-------|
| **Display** | `--text-2xl` | `1.75rem` | `var(--weight-bold)` | `var(--color-interactive)` | Page title (h1) |
| **Heading** | `--text-xl` | `1.375rem` | `var(--weight-semibold)` | `var(--color-interactive)` | Section heading (h2) |
| **Subheading** | `--text-lg` | `1.125rem` | `var(--weight-semibold)` | `var(--color-interactive)` | Card/result heading (h3) |
| **Body** | `--text-base` | `1rem` | `var(--weight-normal)` | `var(--color-on-surface)` | Paragraphs, form labels |
| **Caption** | `--text-sm` | `0.875rem` | `var(--weight-normal)` | `var(--color-on-surface-muted)` | Helper text, footer |
| **Small** | `--text-xs` | `0.75rem` | `var(--weight-normal)` | `var(--color-on-surface-muted)` | Fine print |

---

## CSS Logical Properties Migration Map

This contract defines the 1:1 replacement for every physical directional CSS property used in the codebase.

| Physical Property | Logical Replacement |
|------------------|-------------------- |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |
| `border-top-left-radius` | `border-start-start-radius` |
| `border-top-right-radius` | `border-start-end-radius` |
| `border-bottom-left-radius` | `border-end-start-radius` |
| `border-bottom-right-radius` | `border-end-end-radius` |

### RTL Override Blocks to Remove

After migration, the following `body[dir="rtl"]` blocks can be **deleted entirely**:

- `global.css`: `body[dir="rtl"] .feature-card`, `body[dir="rtl"] .form-group`, `body[dir="rtl"] .results-container`, `body[dir="rtl"] .about-content`
- `Header.module.css`: `body[dir="rtl"] .headerContainer`, `body[dir="rtl"] .desktopNav`, `body[dir="rtl"] .headerActions`
- `Sidebar.module.css`: `body[dir="rtl"] .sidebar`, `body[dir="rtl"] .open`
- `LandingView.module.css`: `body[dir="rtl"] .card`
- `AboutView.module.css`: `body[dir="rtl"] .content`
