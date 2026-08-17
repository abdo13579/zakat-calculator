# Data Model: Design Modernization

**Feature**: [spec.md](specs/003-design-modernization/spec.md)
**Date**: 2026-08-17

## Overview

This feature is purely visual — it does not introduce persistent data entities or modify existing data flows. The "data model" here describes the structural contracts for the design token system and the toast notification state that drive the UI modernization.

## Entity: Design Token Scale

Design tokens are CSS custom properties organized in a two-tier hierarchy. They are not runtime data — they are static declarations consumed by the browser's CSS engine.

### Tier 1: Primitive Tokens (raw values)

| Token Category | Token Pattern | Example Values |
|---------------|--------------|----------------|
| **Color — Primary** | `--color-primary-{50-900}` | `#e6fafb` (50) → `#01c5d3` (500) → `#014f54` (900) |
| **Color — Neutral** | `--color-neutral-{50-900}` | `#fafafa` (50) → `#737373` (500) → `#171717` (900) |
| **Color — Accent** | `--color-accent-{50-900}` | `#fdf8e8` (50) → `#d4af37` (500) → `#5a4a17` (900) |
| **Color — Semantic** | `--color-error`, `--color-success`, `--color-info` | `#dc3545`, `#22c55e`, `#3b82f6` |
| **Spacing** | `--space-{xs,sm,md,lg,xl,2xl}` | `0.25rem` → `3rem` |
| **Radius** | `--radius-{sm,md,lg,pill}` | `4px`, `8px`, `12px`, `999px` |
| **Shadow** | `--shadow-{sm,md,lg}` | Subtle elevation levels |
| **Font Size** | `--text-{xs,sm,base,lg,xl,2xl,3xl}` | `0.75rem` → `2rem` |
| **Font Weight** | `--weight-{normal,medium,semibold,bold}` | `400`, `500`, `600`, `700` |
| **Transition** | `--transition-fast`, `--transition-normal` | `150ms ease`, `200ms ease` |

### Tier 2: Semantic Tokens (purpose-mapped, theme-aware)

| Token | Light Mode Value | Dark Mode Value | Purpose |
|-------|-----------------|-----------------|---------|
| `--color-bg` | `var(--color-neutral-50)` | `#0f172a` | Page background |
| `--color-surface` | `#ffffff` | `#1e293b` | Card / container background |
| `--color-surface-elevated` | `#ffffff` | `#334155` | Header, elevated panels |
| `--color-on-surface` | `var(--color-neutral-900)` | `var(--color-neutral-100)` | Primary text on surface |
| `--color-on-surface-muted` | `var(--color-neutral-500)` | `var(--color-neutral-400)` | Helper/caption text |
| `--color-interactive` | `var(--color-primary-500)` | `var(--color-primary-400)` | Buttons, links, focus rings |
| `--color-interactive-hover` | `var(--color-primary-600)` | `var(--color-primary-300)` | Hover state |
| `--color-border` | `var(--color-neutral-200)` | `rgba(255,255,255,0.08)` | Default borders |
| `--color-border-subtle` | `var(--color-neutral-100)` | `rgba(255,255,255,0.04)` | Subtle card borders in dark |
| `--color-focus-ring` | `rgba(1,197,211,0.25)` | `rgba(1,197,211,0.35)` | Focus ring glow |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.08)` | `0 1px 2px rgba(0,0,0,0.3)` | Card elevation |
| `--shadow-elevated` | `0 4px 12px rgba(0,0,0,0.1)` | `0 2px 8px rgba(0,0,0,0.4)` | Header, elevated panels |

## Entity: Toast Notification

A transient message managed by the ToastContext provider.

### State Shape

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Auto-incrementing unique identifier |
| `type` | `'success' \| 'error' \| 'info'` | Visual variant |
| `message` | `string` | Localized display text |
| `duration` | `number` | Auto-dismiss milliseconds (default: 5000) |

### State Transitions

```
[idle] --toast(msg)--> [visible] --timeout/dismiss--> [exiting] --animation end--> [removed]
```

- **idle → visible**: Component calls `toast.success(msg)` or `toast.error(msg)`
- **visible → exiting**: Timer expires or user dismisses; exit animation starts
- **exiting → removed**: CSS transition ends; toast removed from state array
- **visible → visible (replace)**: New toast replaces current with brief cross-fade

### Constraints

- Maximum 1 active toast at a time (replace strategy, not stacking)
- Auto-dismiss timer resets on replacement
- Toast container positioned at top-center of viewport, below header
- Toast must be accessible: `role="status"` with `aria-live="polite"`

## Entity: Input Group

A visual composition of an input element and an adjacent unit/currency addon.

### Structure

| Element | Role | Content |
|---------|------|---------|
| `.input-group` wrapper | Flex container | Contains input + addon |
| `<input>` | User input | Numeric value |
| `.input-addon` | Visual label | Currency code or unit (e.g., "SAR", "kg") |

### Relationships

- The addon is linked to the input via `aria-describedby`
- The addon position is always `inline-end` (adapts to LTR/RTL automatically)
- The addon inherits border and background from the input to appear seamless

## Entities NOT Changed

The following existing data entities are **explicitly unchanged** by this feature:

- **Zakat calculation parameters** (Nisaab thresholds, rates, formulas)
- **Translation dictionary** (structure unchanged; only minor additions for unit labels if needed)
- **Currency rates / gold price** (API fetch and storage unchanged)
- **User preferences** (localStorage keys and values for theme and language unchanged)
