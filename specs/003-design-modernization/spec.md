# Feature Specification: Design Modernization

**Feature Branch**: `003-design-modernization`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "Design Modernization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refined Visual Experience Across Themes (Priority: P1)

A user opens ZakatCalc in their preferred theme (light or dark) and immediately perceives a polished, premium interface. Colors are harmonious and intentional, surfaces have clear visual hierarchy through subtle depth cues, and the overall aesthetic feels modern and trustworthy — appropriate for a tool handling religious financial obligations.

**Why this priority**: The visual first impression determines whether users trust the tool enough to enter their financial data. A dated or inconsistent look undermines credibility for a Shariah-focused calculator.

**Independent Test**: Can be fully tested by loading the app in both light and dark modes and verifying that colors, surfaces, typography, and spacing feel cohesive and modern. Delivers immediate perceived-quality improvement.

**Acceptance Scenarios**:

1. **Given** a user opens the app in light mode, **When** the page loads, **Then** the background, cards, and text use a neutral, refined palette with the brand accent used sparingly for emphasis — not as a page-wide tint.
2. **Given** a user switches to dark mode, **When** the theme changes, **Then** surfaces display clear layered depth (elevated cards distinguishable from the background) rather than a flat, shadow-less appearance.
3. **Given** a user views any page, **When** they scan the interface, **Then** headings, body text, labels, and helper text follow a clear typographic hierarchy with consistent sizing and spacing throughout.

---

### User Story 2 - Consistent, Reusable Interface Components (Priority: P2)

A user interacts with form controls (buttons, inputs, dropdowns) across Fitr, Mal, and Zuru calculators and finds them visually identical in style, spacing, and behavior. Every button has the same shape and feel, every input has the same focus treatment, and every select has the same interaction pattern.

**Why this priority**: Inconsistent controls force users to re-learn interactions on each calculator page, increasing cognitive load and error rates. Uniform components also enable faster feature development.

**Independent Test**: Can be tested by navigating between all three calculators and comparing form controls for visual and behavioral consistency.

**Acceptance Scenarios**:

1. **Given** a user navigates from Fitr to Mal to Zuru calculators, **When** they interact with input fields, **Then** all inputs share the same visual style, focus ring treatment, and error state appearance.
2. **Given** a user hovers or focuses on any button, **When** the interaction occurs, **Then** the button displays a smooth, consistent transition effect (hover state, active state, and disabled state) across all pages.
3. **Given** a user views results after calculation, **When** the results card appears, **Then** it uses a standardized card component with consistent padding, elevation, and accent treatment.

---

### User Story 3 - Enhanced Form Interaction Clarity (Priority: P3)

A user filling out a calculator form can clearly see contextual information inline — such as the currency symbol beside a monetary input, or the unit "kg" near a weight field — reducing guesswork and input errors. Focus states, validation feedback, and result presentation all feel responsive and polished.

**Why this priority**: Contextual cues (unit indicators, currency labels) reduce data-entry mistakes, which is especially critical for a financial/religious calculation tool where accuracy is paramount.

**Independent Test**: Can be tested by filling out each calculator form and verifying that unit/currency labels are visible, focus states are clear, and validation messages guide the user effectively.

**Acceptance Scenarios**:

1. **Given** a user is entering a monetary value, **When** they focus the input, **Then** the associated currency is visually indicated adjacent to the input field.
2. **Given** a user is entering a weight value (e.g., harvest kg), **When** the input is active, **Then** the unit of measurement is clearly displayed as a visual label beside the input.
3. **Given** a user triggers a validation error (e.g., empty required field, non-numeric input), **When** the error is detected, **Then** the input displays a clear error state with a descriptive, localized message.

---

### User Story 4 - Seamless RTL/LTR Direction Support (Priority: P4)

A user switches between Arabic (RTL) and English (LTR), and the entire interface flips naturally — navigation, form layouts, result card accents, sidebar animations — without any visual glitches, misaligned elements, or incorrect spacing.

**Why this priority**: The app's primary audience is Arabic-speaking. RTL layout must be flawless, not a series of manual overrides that break when new elements are added. Direction-agnostic layout ensures maintainability and correctness.

**Independent Test**: Can be tested by switching languages and inspecting every page for correct alignment, spacing, border placement, and animation direction.

**Acceptance Scenarios**:

1. **Given** a user switches from English to Arabic, **When** the layout direction changes, **Then** all margins, paddings, borders, and alignment automatically mirror without dedicated directional overrides per element.
2. **Given** a user opens the mobile sidebar in Arabic mode, **When** the sidebar animates in, **Then** it slides from the correct (start) side and all internal content aligns properly.
3. **Given** a user views the results card in RTL, **When** the card renders, **Then** the accent border appears on the inline-start edge and all text aligns to the start direction.

---

### User Story 5 - Declarative Notification Feedback (Priority: P5)

A user performs an action that triggers feedback (e.g., copying a result, encountering a network error), and the notification appears as a polished, non-intrusive toast message that auto-dismisses. Notifications are consistent in style, placement, and animation regardless of which page triggered them.

**Why this priority**: Current notifications use inconsistent patterns (some imperative DOM injection, some event-based). A unified notification system improves reliability and user confidence.

**Independent Test**: Can be tested by triggering success (copy result) and error (network failure) notifications on different pages and verifying consistent appearance and behavior.

**Acceptance Scenarios**:

1. **Given** a user copies a calculation result, **When** the copy succeeds, **Then** a success toast notification appears with consistent styling, animates in smoothly, and auto-dismisses after a brief period.
2. **Given** a network error occurs during gold price fetch, **When** the error is surfaced, **Then** an error notification appears in the same toast area with error-appropriate styling and a clear message.
3. **Given** multiple notifications are triggered in sequence, **When** they appear, **Then** they stack or replace gracefully without overlapping content or layout shifts.

---

### Edge Cases

- What happens when a user rapidly toggles between light and dark themes? Transitions should remain smooth without flash-of-unstyled-content or color flickering.
- How does the interface respond when the browser uses a very large or very small font size (accessibility zoom)? All components should scale proportionally without overflow or clipping.
- What happens when a notification is triggered while another is already visible? The system should handle stacking or replacement gracefully.
- How do form controls behave when the user pastes very long numbers? Input fields should handle overflow gracefully (truncation or scroll).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST present a cohesive, harmonious color palette across all pages, with the brand accent color used for interactive elements and emphasis — not as a background tint.
- **FR-002**: The application MUST display clear visual depth in dark mode, with elevated surfaces (cards, headers, modals) visually distinguishable from the base background.
- **FR-003**: All text content MUST follow a defined typographic hierarchy: distinct sizing, weight, and spacing for headings (multiple levels), body text, labels, and helper/caption text.
- **FR-004**: All interactive form controls (buttons, text inputs, number inputs, dropdowns) MUST share a unified visual style and consistent focus, hover, active, and disabled states across every page.
- **FR-005**: Monetary input fields MUST display the associated currency identifier adjacent to the input.
- **FR-006**: Weight input fields MUST display the associated unit of measurement (e.g., kg, g) adjacent to the input.
- **FR-007**: Form validation errors MUST be displayed with a visually distinct error state on the input and an accompanying localized error message.
- **FR-008**: The layout MUST adapt to text direction (LTR/RTL) automatically using direction-agnostic spacing and alignment, eliminating dedicated per-element directional overrides.
- **FR-009**: User-facing notifications (success, error, informational) MUST appear in a consistent toast-style format with smooth entrance/exit transitions and auto-dismissal.
- **FR-010**: All color values used in the interface MUST be defined through a centralized set of named design tokens rather than scattered hardcoded values.
- **FR-011**: The light-to-dark and dark-to-light theme transitions MUST occur without visible flashes of unstyled content.
- **FR-012**: All interactive elements MUST display micro-interaction feedback (hover transitions, focus rings, press states) that completes within 200ms to feel responsive.
- **FR-013**: The result card component MUST use a standardized card pattern with consistent padding, border treatment, and elevation across all calculator views.
- **FR-014**: The landing page cards MUST display clear hover/focus feedback and maintain consistent sizing and spacing.

### Key Entities

- **Design Token**: A named value (color, spacing, radius, shadow, font property) that defines a single aspect of the visual language, referenced throughout the interface.
- **Component Primitive**: A foundational UI element (button, input, select, card) with a defined visual contract (states, sizing, spacing) used consistently across all views.
- **Notification**: A transient, non-blocking message displayed to the user with a type (success, error, info), content, and auto-dismiss behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of color values in the interface trace back to named design tokens — zero hardcoded color values outside the token definitions.
- **SC-002**: Switching between Arabic (RTL) and English (LTR) produces zero layout misalignments, overflow issues, or incorrectly-placed directional elements across all pages.
- **SC-003**: In dark mode, at least 3 visually distinguishable surface elevation levels are present (background, card/surface, elevated/header), verified by contrast measurement.
- **SC-004**: All form controls (buttons, inputs, selects) pass visual consistency review: identical styling for the same control type across Fitr, Mal, and Zuru calculator pages.
- **SC-005**: Users can identify the unit or currency associated with every input field without reading external labels or help text, measured by 90% task-success rate in usability review.
- **SC-006**: All hover and focus transitions complete in under 200ms, producing a responsive feel with no perceptible lag.
- **SC-007**: Theme switching (light ↔ dark) completes without visible flash-of-unstyled-content, verified by visual inspection on standard browsers.
- **SC-008**: Notification messages (success and error) appear and auto-dismiss consistently across all pages, with identical animation, timing, and placement.

## Assumptions

- The existing brand identity (teal/cyan primary, gold accent) will be refined and expanded, not replaced with an entirely new brand palette.
- This modernization is purely visual and interaction-focused; no changes to calculation logic, data flow, or business rules are in scope.
- The existing bilingual translation dictionary covers all current strings; this feature does not add new user-facing copy beyond what exists, except potential labels for unit indicators (e.g., "kg", currency codes) which are already present in translations or are language-neutral.
- The landing page layout (3-card grid) and overall page structure (header, content, footer) remain the same; the modernization refines their appearance, not their arrangement.
- Mobile responsiveness behavior (breakpoints, sidebar navigation) remains structurally unchanged; only the visual treatment of these elements is modernized.
- Existing accessibility requirements (semantic HTML, ARIA labels, keyboard navigation) from the constitution are maintained and not regressed.
