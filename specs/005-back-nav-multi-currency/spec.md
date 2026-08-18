# Feature Specification: Back Navigation & Multi-Currency Zakat Al-Mal

**Feature Branch**: `feature/005-back-nav-multi-currency`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "This new phase is the ux and improvements phase, here is what I want in this phase: 1. on mobile, when you click the back button it closes the site and does not back to the last page, I want to fix that 2. think like if I have 10 dollars and 10 egp, how can I calc the zakat? you should use a calculator to get how much money do you have in one currency, I want to change that... so I have the ability to add different currencies and the app calcs it all and give me the result , do not forget to make a branch for this phase."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Zakat on Wealth Held in Multiple Currencies (Priority: P1)

A Muslim holds wealth in more than one currency — for example 10 US dollars and 10 Egyptian pounds — and today must manually convert everything with a separate calculator before the app can compute zakat. They want to enter each amount in its own currency directly, have the app combine them into one total, and receive a single zakat-due result without doing any manual conversion.

**Why this priority**: This is the core new capability of the phase and the primary user value. Without it, the multi-currency scenario the user described is impossible in-app, forcing error-prone manual math for a religious obligation.

**Independent Test**: Can be fully tested by entering two or more amounts in different currencies and verifying the app shows one combined total and one correct zakat-due figure, with no manual conversion required from the user.

**Acceptance Scenarios**:

1. **Given** a user has 10 USD and 10 EGP, **When** they add two wealth rows (10 USD, 10 EGP) and calculate, **Then** the app converts both to a single combined total in USD and shows whether that total reaches the gold-based nisab and the resulting zakat due in USD.
2. **Given** a user enters amounts in the same currency twice (e.g. 50 USD and 30 USD), **When** they calculate, **Then** the rows are merged into a single 80 USD contribution before the total is computed.
3. **Given** a user's combined USD total is below the nisab threshold, **When** they calculate, **Then** the result states that no zakat is due, even though combining currencies may have brought them closer to the threshold than any single currency alone.
4. **Given** a user adds three rows in three different currencies and removes one, **When** they calculate, **Then** the total reflects only the two remaining rows.
5. **Given** the user's language is Arabic, **When** they use the multi-currency calculator, **Then** all labels, row controls, and the result are displayed in Arabic with correct RTL layout.

---

### User Story 2 - Browser Back Button Returns to the Previous Page (Priority: P1)

On mobile, when a user navigates from the home page to a calculator (e.g. Zakat Al-Mal) and then presses the device or browser back button, the site currently exits entirely instead of returning to the previous page. The user expects the back button to behave like normal navigation: go back to the last viewed page within the site.

**Why this priority**: This is a fundamental navigation correctness bug on mobile that makes the app feel broken; it affects every user who navigates beyond the landing page and then tries to go back.

**Independent Test**: Can be fully tested by navigating from the landing page to any calculator and pressing back; the app must return to the landing page (not exit the site), and forward must return to the calculator.

**Acceptance Scenarios**:

1. **Given** a user is on the landing page and navigates to Zakat Al-Mal, **When** they press the device/browser back button, **Then** the app returns to the landing page instead of exiting the site.
2. **Given** a user navigates landing → Fitr → Mal → About, **When** they press back three times, **Then** they return through Mal → Fitr → landing in that order.
3. **Given** a user is on the landing page (the first/only viewed page) and presses back, **When** there is no previous in-app page, **Then** exiting the site is acceptable (no prior page to return to).
4. **Given** a user navigated to a calculator and presses back, then forward, **When** they press the browser forward button, **Then** they return to the calculator they had left.

---

### User Story 3 - Currency Names Appear in Arabic When the App Is Arabic (Priority: P2)

An Arabic-speaking user currently sees raw currency codes such as "EGP", "USD", and "SAR". They expect to read familiar Arabic currency names — for example "جنيه" instead of "EGP" — whenever the app is in Arabic, across every currency the app offers or returns from the live rate source.

**Why this priority**: Directly supports the bilingual/accessibility principle and the user's explicit request, but it is a presentation refinement layered on top of the core multi-currency capability rather than a standalone deliverable.

**Independent Test**: Can be tested by switching the app to Arabic and verifying that every currency shown in the selectors and result renders as its Arabic name, with no raw ISO code visible unless a name is genuinely unavailable.

**Acceptance Scenarios**:

1. **Given** the app language is Arabic, **When** the user opens a currency selector, **Then** every listed currency is shown by its Arabic name (e.g. "جنيه" for EGP, "دولار" for USD, "ريال" for SAR).
2. **Given** the app language is Arabic and the user calculates multi-currency zakat, **When** the result is displayed, **Then** the result currency is shown by its Arabic name.
3. **Given** the app language is English, **When** the user views currency selectors and results, **Then** currencies display as their ISO code (existing behavior unchanged).
4. **Given** a currency surfaced from the live rate source has no registered Arabic name (unexpected gap), **When** it is rendered in Arabic, **Then** the ISO code is shown as a defensive fallback so the UI never breaks.

---

### User Story 4 - Back Button Closes an Open Sidebar Before Navigating (Priority: P2)

On mobile, a user opens the navigation sidebar drawer and then presses the back button. Rather than immediately leaving the current page, they expect the first back press to simply close the sidebar, and a subsequent back press to then navigate to the previous page — matching standard mobile drawer behavior.

**Why this priority**: A polish interaction that prevents accidental navigation and matches user expectations on mobile, but is secondary to the core back-navigation fix.

**Independent Test**: Can be tested by opening the sidebar and pressing back; the sidebar must close and the current page must remain, then a second back press navigates normally.

**Acceptance Scenarios**:

1. **Given** the mobile sidebar drawer is open, **When** the user presses the back button once, **Then** the sidebar closes and the user stays on the current page.
2. **Given** the sidebar was just closed by the first back press, **When** the user presses back again, **Then** the app navigates to the previously viewed page as in User Story 2.

---

### Edge Cases

- What happens when the user enters 0 as an amount in a row? → Valid input; that row contributes 0 to the combined total and does not affect eligibility.
- What happens when the user enters a negative amount? → Invalid input; the row is rejected with a clear error message and excluded from the total.
- What happens when a row's amount is empty or non-numeric? → Invalid input; the row is rejected with a clear error and excluded from the total.
- What happens when only one currency row is present? → The calculation still works, preserving the existing single-currency flow as a degenerate case of the multi-currency calculator.
- What happens when the live exchange-rate fetch fails (offline or endpoint down)? → The app MUST surface a clear user-visible error and MUST NOT display a silently incorrect or partially converted result; multi-currency conversion depends on successful rate retrieval.
- What happens when a chosen currency is not present in the returned rates? → The app surfaces a clear error for that entry and excludes it, rather than guessing a rate.
- What happens when the combined total is below nisab but one currency alone would have been close? → The result states no zakat is due; the combined total is still shown for transparency.
- What happens when the user navigates very rapidly between pages and presses back repeatedly? → The back navigation follows the recorded order and does not skip or duplicate entries.
- What happens when the user refreshes the page mid-session? → Because URLs are unchanged in this phase, refresh returns to the landing view; deep-linking/restoring the exact view on refresh is out of scope and accepted as a trade-off.
- What happens when the user is on the landing view and presses back? → With no prior in-app page, exiting the site is acceptable.
- What happens when a currency from the rate source has no Arabic name registered? → The ISO code is shown as a defensive fallback (English unaffected).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Zakat Al-Mal calculator MUST allow users to enter multiple wealth entries, each consisting of an amount and a currency.
- **FR-002**: The system MUST convert every wealth entry into a single common currency (USD) using the live exchange rates and sum them into one combined wealth total.
- **FR-003**: The system MUST determine nisab as the value of 85 grams of gold expressed in USD, and MUST assess eligibility by comparing the combined USD total against that USD nisab.
- **FR-004**: The system MUST display the combined wealth total, the nisab threshold, and the zakat-due amount in USD.
- **FR-005**: The system MUST apply the 2.5% zakat rate to the combined eligible total when it meets or exceeds nisab, and MUST report zero zakat due when it is below nisab.
- **FR-006**: The system MUST automatically merge wealth entries that share the same currency into a single summed contribution per currency before computing the total.
- **FR-007**: The system MUST let users dynamically add new wealth rows and remove existing rows, while always keeping at least one row available.
- **FR-008**: The system MUST validate each wealth entry as a non-negative finite number; negative, empty, non-numeric, or non-finite entries MUST be rejected with a clear, localized error message and excluded from the total.
- **FR-009**: The system MUST handle exchange-rate retrieval failure with a clear user-visible error state and MUST NOT display a silently stale or incorrect multi-currency result (multi-currency conversion requires successful rate retrieval).
- **FR-010**: The device/browser back button MUST navigate to the previously viewed in-app page instead of exiting the site, for every in-app navigation the user performs.
- **FR-011**: The browser forward button MUST navigate forward through the same in-app navigation order the user previously traversed.
- **FR-012**: When the user is on the first/landing view and there is no prior in-app page, pressing back MAY exit the app.
- **FR-013**: Every in-app navigation (selecting a calculator or page) MUST record a navigation history entry so that back and forward work across the session.
- **FR-014**: When the mobile sidebar drawer is open, the first back press MUST close the sidebar without leaving the current page; a subsequent back press MUST then navigate to the previous page.
- **FR-015**: Every currency code surfaced by the app — whether offered in a selector or returned from the live rate source — MUST have an Arabic display name registered in the bilingual string catalog.
- **FR-016**: When the UI language is Arabic, currency selectors and result displays MUST render the Arabic currency name instead of the ISO code; if an Arabic name is unexpectedly missing, the ISO code MUST be shown as a defensive fallback so the UI never breaks.
- **FR-017**: When the UI language is English, currency codes MUST continue to display as their ISO code (existing behavior unchanged).
- **FR-018**: All new user-facing strings (row labels, add/remove controls, multi-currency result text, errors) MUST be available in both English and Arabic, with correct RTL layout for Arabic, and MUST work in both light and dark themes.
- **FR-019**: The scholarly disclaimer MUST remain visible on the Zakat Al-Mal calculator.
- **FR-020**: All computation MUST run client-side; the app MUST NOT transmit, store externally, or use for telemetry any user-entered wealth data; the only outbound requests permitted are the documented public exchange-rate and gold-price endpoints.
- **FR-021**: Zakat Al-Fitr and Zakat Al-Zuru MUST remain unchanged in this phase — multi-currency entry applies to Zakat Al-Mal only.

### Key Entities

- **Wealth Entry**: A single user input consisting of an amount and a currency code; the atomic unit of multi-currency wealth input.
- **Combined Wealth Total**: The sum of all wealth entries after conversion to the common currency (USD); the basis for eligibility and zakat calculation.
- **Navigation History**: The ordered, session-scoped record of pages the user has viewed, used to drive back/forward navigation.
- **Currency Display Name**: A localized (Arabic) name associated with an ISO currency code, rendered in place of the code when the UI language is Arabic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user holding wealth in two or more currencies can enter their amounts and obtain a single zakat-due result in under 45 seconds, with no manual currency conversion.
- **SC-002**: 100% of multi-currency test cases (combinations of USD, EGP, SAR, EUR, and other available currencies) produce a combined total and zakat-due figure that match a manual conversion-and-calculation to the Shariah-standard result (85 g gold nisab, 2.5% rate).
- **SC-003**: On mobile, pressing the device/browser back button from any calculator returns the user to the previously viewed in-app page — not the OS/browser exit — in 100% of in-app navigation test cases.
- **SC-004**: When the mobile sidebar is open, the first back press closes it (and keeps the current page) in 100% of test cases; a second back press then navigates.
- **SC-005**: 100% of currency codes rendered while the app is in Arabic appear as Arabic names; users see a raw ISO code only when a name is genuinely unavailable (defensive fallback).
- **SC-006**: All new labels, row controls, result text, and error messages render correctly in both English and Arabic (with correct RTL layout) and in both light and dark themes.
- **SC-007**: The Zakat Al-Mal calculator continues to function for a single currency entry exactly as before, preserving backward compatibility.

## Assumptions

- Multi-currency wealth entry applies to Zakat Al-Mal only; Zakat Al-Fitr and Zakat Al-Zuru remain single-currency / unit-based and are out of scope for this phase.
- The combined total, nisab, and zakat-due result are always displayed in USD (the common currency), as decided during clarification.
- Conversion uses a single snapshot of live exchange rates retrieved for the session; all entries convert using that same snapshot.
- The chosen navigation approach records in-app history entries without changing the URL. As an accepted trade-off, a page refresh does NOT restore the previously viewed calculator (it returns to the landing view), and views are not shareable via URL in this phase; deep-linking is out of scope.
- Pressing back on the landing/first view exits the app, since there is no prior in-app page to return to.
- Arabic currency names are registered for every currency surfaced from the live rate source (and any offered in selectors); the ISO code is the defensive fallback for any unexpected gap only.
- English continues to display ISO currency codes; no change to English currency display.
- Wealth entries that share the same currency are automatically merged into one summed contribution per currency.
- The feature follows the existing static single-page-application architecture and the existing bilingual (i18n) and theme systems; no new runtime dependencies are introduced beyond what the constitution already permits.
- The external endpoints (exchange rates and gold price) and their graceful-degradation behavior are unchanged; multi-currency conversion simply extends the existing dependency on a successful rate fetch.
