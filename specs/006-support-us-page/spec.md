# Feature Specification: Support Us Page & Cross-Site Support Link

**Feature Branch**: `006-support-us-page`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Add a Support Us page reachable from the desktop nav bar (labeled link, like the other pages) and from the mobile sidebar (before the About entry). The Support Us page content must use the same font styles as the About page and contain three ways to support the project: (1) Vote for us on mortakaz.com (link provided), (2) Contribute on GitHub (add the GitHub repo link), (3) Star the GitHub repo. Also add a clickable 'Want to support us?' link at the bottom of every page (reworded appropriately), and add a Support section to the README."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach the Support Us Page from Desktop and Mobile Navigation (Priority: P1)

A visitor who found ZakatCalc useful wants to discover how they can help the project grow. On desktop they expect to see a "Support" link in the top navigation bar alongside the other pages (Home, calculators, About); on mobile they expect to find a "Support" entry inside the navigation sidebar drawer, positioned just before "About". Clicking either entry must take them to a dedicated Support Us page.

**Why this priority**: This is the entry point for the entire feature. Without a discoverable navigation entry, none of the support options can be reached, so this is the foundational slice that makes everything else valuable.

**Independent Test**: Can be fully tested by opening the app on desktop and confirming a "Support" link appears in the top nav bar (and is highlighted when active), and on mobile by opening the sidebar drawer and confirming a "Support" entry appears immediately before "About"; selecting either navigates to the Support Us page.

**Acceptance Scenarios**:

1. **Given** a desktop user viewing any page, **When** they look at the top navigation bar, **Then** they see a "Support" link listed among the page links, and clicking it navigates to the Support Us page.
2. **Given** a desktop user on the Support Us page, **When** they view the top navigation bar, **Then** the "Support" link is visually marked as the current/active page.
3. **Given** a mobile user with the sidebar drawer open, **When** they scan the drawer entries, **Then** they see a "Support" entry positioned immediately before the "About" entry.
4. **Given** a mobile user who taps the "Support" entry in the sidebar, **When** the tap is registered, **Then** the drawer closes and the Support Us page is displayed.
5. **Given** the app language is Arabic, **When** the user views the nav bar and sidebar, **Then** the "Support" entry label appears in Arabic with correct RTL layout.

---

### User Story 2 - Read Three Concrete Ways to Support the Project (Priority: P1)

A supporter arrives on the Support Us page and wants clear, actionable ways to help. The page must present three distinct support options, each with a short explanation and a working external link that opens in a new tab: vote for the project on mortakaz.com, contribute to the project on GitHub, and star the GitHub repository. The page content must use the same typography and visual structure as the existing About page so the experience feels consistent.

**Why this priority**: This is the core value of the feature — the actual support calls-to-action. Together with User Story 1 it forms a complete MVP: users can both reach and read the support options.

**Independent Test**: Can be fully tested by navigating to the Support Us page and verifying three labeled sections, each with explanatory text and a link that opens the correct external destination in a new tab, with typography matching the About page.

**Acceptance Scenarios**:

1. **Given** a user is on the Support Us page, **When** they read the page, **Then** they see three clearly titled sections: voting on mortakaz, contributing on GitHub, and starring the GitHub repo.
2. **Given** a user is on the Support Us page, **When** they click the vote link, **Then** the mortakaz.com project page opens in a new browser tab.
3. **Given** a user is on the Support Us page, **When** they click the contribute-on-GitHub link, **Then** the project's GitHub repository opens in a new browser tab.
4. **Given** a user is on the Support Us page, **When** they click the star-the-repo link, **Then** the same GitHub repository opens in a new browser tab.
5. **Given** a user compares the Support Us page to the About page, **When** they compare headings and paragraph styling, **Then** both pages share the same font styles and content-card structure.
6. **Given** the app language is Arabic, **When** the user views the Support Us page, **Then** all section titles, explanatory text, and link labels appear in Arabic with correct RTL layout.

---

### User Story 3 - See a Support Prompt at the Bottom of Every Page (Priority: P2)

A user finishing a calculation or reading the About page is given a gentle, clickable prompt at the bottom of the page inviting them to support the project. Clicking it navigates to the Support Us page. The prompt appears on every page except the Support Us page itself (where it would be redundant).

**Why this priority**: This is a discovery booster layered on top of the core entry points; it increases the chance a satisfied user notices they can help, but the feature is usable without it.

**Independent Test**: Can be fully tested by visiting each non-Support page and confirming a reworded support question link is present at the bottom and navigates to the Support Us page, and by visiting the Support Us page and confirming the link is absent.

**Acceptance Scenarios**:

1. **Given** a user is on the Home page, **When** they scroll to the bottom of the page content, **Then** they see a clickable question inviting them to support the project.
2. **Given** a user is on any calculator or the About page, **When** they view the bottom of the page, **Then** the same clickable support prompt is present.
3. **Given** a user clicks the bottom support prompt, **When** the click is registered, **Then** the app navigates to the Support Us page.
4. **Given** a user is already on the Support Us page, **When** they view the bottom of the page, **Then** the support prompt is NOT shown (to avoid redundancy).
5. **Given** the app language is Arabic, **When** the user views the support prompt, **Then** the question text appears in Arabic with correct RTL layout.

---

### Edge Cases

- What happens when a user opens an external support link? → The link opens in a new browser tab (`target="_blank"` with `rel="noopener"` for security); the Support Us page remains open behind it.
- What happens if a navigation entry for Support is clicked while already on the Support Us page? → The app stays on the Support Us page (no duplicate history entry / no-op navigation), and the entry remains marked active.
- What happens when the mobile sidebar is open and the user taps "Support"? → The drawer closes and the Support Us page displays, consistent with the existing sidebar-tap behavior for other pages.
- What happens when the user navigates to Support via the bottom prompt and then presses the device/browser back button? → The app returns to the previously viewed page, consistent with the existing in-app back-navigation behavior.
- What happens to the bottom support prompt on the Support Us page itself? → It is hidden so the page does not link to itself.
- What happens if the app's external GitHub or mortakaz destination is unreachable? → The link still opens (or the browser shows its standard unreachable-page state); the app itself is unaffected because support links are plain outbound anchors and require no in-app network request.
- What happens to existing navigation order in the top nav bar and sidebar? → The "Support" entry is inserted immediately before "About" in both; all other entries keep their existing order and behavior.
- What happens to the README? → A new "Support" section is added describing the same three support options with their links, without altering existing README content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST add a new "Support" page reachable as a first-class navigable view alongside the existing pages (Home, calculators, About).
- **FR-002**: The desktop top navigation bar MUST include a labeled "Support" link among the page links, positioned immediately before the "About" link.
- **FR-003**: The mobile sidebar drawer MUST include a "Support" entry positioned immediately before the "About" entry, with the same tap-to-navigate behavior as the other drawer entries.
- **FR-004**: The "Support" navigation entry MUST be visually marked as active whenever the user is on the Support Us page, consistent with how other nav entries are marked active.
- **FR-005**: Navigating to the Support Us page MUST integrate with the existing in-app navigation history so the device/browser back button returns the user to the previously viewed page.
- **FR-006**: The Support Us page MUST display three distinct, titled sections describing ways to support the project: voting on mortakaz, contributing on GitHub, and starring the GitHub repository.
- **FR-007**: Each support section MUST include a short explanatory paragraph and a clickable link to the relevant external destination, and every external link MUST open in a new browser tab with `rel="noopener"` set.
- **FR-008**: The mortakaz support link MUST point to the project's mortakaz.com page, and the GitHub contribute and star links MUST point to the project's GitHub repository.
- **FR-009**: The Support Us page content MUST use the same typography and content-card visual structure as the existing About page (shared heading and paragraph styling).
- **FR-010**: The app MUST display a clickable support prompt at the bottom of every page (Home, all calculators, About) that navigates to the Support Us page when clicked.
- **FR-011**: The bottom support prompt MUST be hidden when the user is already on the Support Us page.
- **FR-012**: The bottom support prompt wording MUST be a reworded question inviting the user to support the project (not a literal "Want to support us?" string), phrased to feel natural in both supported languages.
- **FR-013**: Every user-facing string introduced by this feature — nav entry label, page title, section titles, section explanatory text, link labels, bottom prompt question, and any aria-labels — MUST be available in both English and Arabic, with correct RTL layout for Arabic, and MUST render correctly in both light and dark themes.
- **FR-014**: The README MUST be updated with a new "Support" section that describes the same three support options and includes their links, without modifying the existing README sections.
- **FR-015**: The feature MUST NOT introduce any new runtime dependencies, any new outbound network requests, or any change to the calculation logic, existing pages, or existing navigation behavior beyond adding the Support entry and the bottom prompt.
- **FR-016**: All external support links MUST be embedded in the page markup (not as interpolation placeholders inside the bilingual string catalog) so that the existing translation-catalog parity and placeholder rules remain satisfied.

### Key Entities

- **Support Option**: A single, titled way a user can help the project, consisting of a short title, an explanatory paragraph, and a destination URL; three support options exist (vote, contribute, star).
- **Bottom Support Prompt**: A page-level, clickable question rendered near the bottom of each non-Support page that navigates the user to the Support Us page; hidden on the Support Us page itself.
- **Navigation Entry (Support)**: A labeled, active-state-aware link in both the desktop top nav bar and the mobile sidebar drawer that routes the user to the Support Us page, positioned immediately before the About entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of desktop test sessions show a "Support" link in the top navigation bar positioned before "About", and 100% of mobile test sessions show a "Support" entry in the sidebar drawer positioned before "About".
- **SC-002**: A user can navigate from any page to the Support Us page in a single tap/click in 100% of test cases, and the device/browser back button returns them to the originating page in 100% of test cases.
- **SC-003**: The Support Us page presents exactly three support sections, each with explanatory text and a working external link that opens the correct destination in a new tab, in 100% of test cases.
- **SC-004**: The Support Us page's headings and paragraph styling match the About page's typography in 100% of side-by-side comparison checks, in both light and dark themes.
- **SC-005**: 100% of non-Support pages display the bottom support prompt, and the Support Us page does NOT display it, in 100% of test cases.
- **SC-006**: Every new user-facing string renders correctly in both English and Arabic with correct RTL layout and in both themes, with the translation catalogs maintaining exact key-set parity between languages.
- **SC-007**: The README contains a new "Support" section listing all three support options with correct links, and all pre-existing README sections remain unchanged.

## Assumptions

- The Support Us page is a static informational page with no forms, no calculations, and no outbound network requests from the app itself; its links are plain anchors that the browser handles.
- The three external destinations are: the mortakaz.com project page URL provided by the user, and the project's GitHub repository URL (already referenced elsewhere in the app and README).
- "Same font styles as the About page" means reusing the same heading and paragraph styling and the same content-card visual structure as the existing About page; no new typography or design tokens are introduced.
- The bottom support prompt is delivered through the existing global footer (the single shared bottom strip) so it appears on every page automatically, with the Support Us page excluding it to avoid self-linking.
- The support navigation entry is added to both the desktop top nav bar and the mobile sidebar, positioned immediately before the "About" entry, matching the existing labeled-link pattern used for the other pages.
- The existing in-app navigation history mechanism is reused for the Support view so back/forward behavior is consistent with the other pages; no new routing approach is introduced.
- External link URLs are embedded directly in the page markup rather than as `{token}` placeholders in the translation strings, preserving the existing translation-catalog parity and placeholder-validation rules.
- The feature introduces no new runtime dependencies, no new outbound requests, and no changes to calculation logic or existing pages, in keeping with the project constitution.
- The reworded bottom prompt question will be phrased naturally per language (for example, "Find ZakatCalc helpful? Support us" in English and an equivalent natural Arabic phrasing), rather than a literal "Want to support us?".
