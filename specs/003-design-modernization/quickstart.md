# Quickstart Validation Guide: Design Modernization

**Feature**: [spec.md](spec.md)
**Date**: 2026-08-17

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Development server available (`npm run dev`)

## Setup

```bash
# From project root
git checkout 003-design-modernization
npm install    # No new dependencies expected
npm run dev    # Start Vite dev server (default: http://localhost:5173)
```

## Validation Scenarios

### V1: Design Token Completeness (SC-001)

**Goal**: Verify zero hardcoded color values remain outside token definitions.

1. Open the browser DevTools on any page
2. Inspect various elements (header, cards, buttons, inputs, text, footer)
3. Verify every `color`, `background-color`, `border-color`, and `box-shadow` value traces to a `var(--...)` custom property
4. Search the codebase for raw hex codes outside `tokens.css`:
   ```bash
   grep -rn '#[0-9a-fA-F]\{3,8\}' src/styles/ src/components/*.css src/views/*.css \
     --include='*.css' | grep -v 'tokens.css'
   ```
5. **Expected**: Zero matches (all colors defined in `tokens.css`)

---

### V2: Theme Switching — No FOUC (SC-007)

**Goal**: Verify smooth light ↔ dark transitions without flash-of-unstyled-content.

1. Load the app in light mode
2. Click the theme toggle button
3. **Expected**: Background, surfaces, text, and borders transition smoothly (no white flash on dark, no dark flash on light)
4. Refresh the page in dark mode
5. **Expected**: Page loads directly in dark mode — no momentary light-mode flash before dark applies
6. Repeat steps 2–5 for dark → light

---

### V3: Dark Mode Depth (SC-003)

**Goal**: Verify 3 distinguishable surface elevation levels in dark mode.

1. Switch to dark mode
2. Navigate to any calculator view (e.g., Fitr)
3. Identify 3 distinct surface levels:
   - **Level 1 (Base)**: The page background behind everything
   - **Level 2 (Surface)**: The calculator form card / results card
   - **Level 3 (Elevated)**: The header bar
4. **Expected**: Each level is visually distinguishable from adjacent levels through color difference and/or subtle border treatment. Use a color picker to verify at least a 5% lightness difference between adjacent levels.

---

### V4: Form Control Consistency (SC-004)

**Goal**: Verify all form controls look and behave identically across calculator pages.

1. Navigate to Fitr calculator → observe input fields, select dropdown, and calculate button
2. Navigate to Mal calculator → compare the same control types
3. Navigate to Zuru calculator → compare again
4. **Expected**: Identical border radius, padding, font size, focus ring color/size, hover effects, and disabled states across all three views
5. Tab through all inputs on each page → verify consistent focus ring treatment

---

### V5: Input Group — Unit/Currency Indicators (SC-005)

**Goal**: Verify unit and currency labels are visible adjacent to inputs.

1. Navigate to Fitr calculator → verify "kg" indicator near the food price weight input and currency code near monetary fields
2. Navigate to Mal calculator → verify currency code indicator near the wealth input
3. Navigate to Zuru calculator → verify "kg" indicator near the harvest weight input
4. **Expected**: Each addon badge is visually connected to its input (shared border, seamless appearance) and clearly readable

---

### V6: RTL/LTR Layout Correctness (SC-002)

**Goal**: Verify zero layout misalignments when switching directions.

1. Load the app in Arabic (RTL)
2. Check each page:
   - Landing: Cards and text aligned to start (right)
   - Calculator forms: Labels and inputs aligned to start
   - Result cards: Accent border on inline-start (right side in RTL)
   - Header: Logo on inline-end (right in LTR, left in RTL), nav on opposite side
   - Sidebar: Slides from inline-end
3. Switch to English (LTR)
4. Repeat checks — everything should mirror
5. **Expected**: Zero per-element `body[dir="rtl"]` overrides in CSS. All mirroring handled by logical properties.
6. Verification script:
   ```bash
   grep -rn 'body\[dir="rtl"\]' src/ --include='*.css'
   ```
   **Expected**: Zero matches

---

### V7: Toast Notifications (SC-008)

**Goal**: Verify consistent notification behavior.

1. Navigate to Mal calculator
2. Enter valid inputs and trigger a calculation → click "Copy Result"
3. **Expected**: Success toast appears at top-center, below header, with smooth slide-in animation, auto-dismisses after ~5 seconds
4. Disconnect from the network (DevTools → Network → Offline)
5. Reload and trigger the gold price fetch
6. **Expected**: Error toast appears in the same position with error styling
7. Repeat copy result on Fitr and Zuru pages
8. **Expected**: Identical toast placement, animation, and timing on all pages

---

### V8: Hover & Focus Transitions (SC-006)

**Goal**: Verify micro-interactions are responsive.

1. Hover over landing page cards → verify smooth elevation change
2. Hover over navigation links → verify smooth background transition
3. Tab through form inputs → verify focus ring appears instantly
4. Hover over buttons → verify smooth color/shadow transition
5. **Expected**: All transitions feel snappy (≤200ms). No sluggish or janky animations.

---

### V9: Build Verification

**Goal**: Ensure the production build succeeds with no errors.

```bash
npm run build
```

**Expected**: Build completes successfully. No CSS warnings, no unused variable warnings. Output in `dist/`.

```bash
npm run preview
```

**Expected**: Preview server loads the app correctly. Repeat V2 (theme switch) and V6 (RTL/LTR) on the production build.

---

### V10: Accessibility Regression Check

**Goal**: Ensure accessibility features are preserved.

1. Tab through the entire app using keyboard only
2. **Expected**: All interactive elements (nav links, buttons, inputs, selects) are focusable with visible focus indicators
3. Check semantic HTML with DevTools:
   - `<header>`, `<main>`, `<footer>` elements present
   - `<nav>` or appropriate role on navigation
   - Form labels associated with inputs
   - Toast has `role="status"` and `aria-live="polite"`
4. **Expected**: No regressions from current accessible markup
