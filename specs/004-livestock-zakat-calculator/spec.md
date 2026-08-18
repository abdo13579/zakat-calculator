# Feature Specification: Zakat Al-Anaam (Livestock) Calculator

**Feature Branch**: `feature/004-livestock-zakat-calculator`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "Zakat Al-Anaam (Livestock) Calculator"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calculate Zakat on Sheep/Goats (Priority: P1)

A Muslim livestock owner wants to calculate the zakat due on their flock of sheep and/or goats. They enter the total number of free-grazing sheep/goats they have owned for a full lunar year, and the calculator tells them how many animals are due as zakat.

**Why this priority**: Sheep and goats are the most commonly owned livestock globally and represent the most frequent use case for livestock zakat calculation.

**Independent Test**: Can be fully tested by entering a number of sheep/goats and verifying the correct zakat amount is displayed according to the established Shariah thresholds.

**Acceptance Scenarios**:

1. **Given** a user has 40 free-grazing sheep, **When** they enter 40 into the sheep/goats calculator, **Then** the result displays "1 sheep/goat" as the zakat due.
2. **Given** a user has 130 sheep, **When** they enter 130, **Then** the result displays "2 sheep/goats" as the zakat due.
3. **Given** a user has 350 sheep, **When** they enter 350, **Then** the result displays "3 sheep/goats" as the zakat due (within the 201-399 bracket).
4. **Given** a user has fewer than 40 sheep, **When** they enter 30, **Then** the calculator displays that no zakat is due (below nisab).
5. **Given** the user's language is Arabic, **When** they use the calculator, **Then** all labels, instructions, and results are displayed in Arabic with correct RTL layout.

---

### User Story 2 - Calculate Zakat on Cattle (Priority: P1)

A cattle owner wants to determine the zakat due on their herd. They enter the total number of free-grazing cattle owned for a full lunar year, and the calculator returns the type and number of animals due.

**Why this priority**: Cattle are a major livestock category with a distinct nisab and rate structure that must be supported alongside sheep/goats for the calculator to be useful.

**Independent Test**: Can be fully tested by entering a number of cattle and verifying the correct zakat type and quantity is displayed.

**Acceptance Scenarios**:

1. **Given** a user has 30 cattle, **When** they enter 30, **Then** the result displays "1 Tabi'/Tabi'ah (1-year-old calf)" as the zakat due.
2. **Given** a user has 40 cattle, **When** they enter 40, **Then** the result displays "1 Musinnah (2-year-old cow)" as the zakat due.
3. **Given** a user has 70 cattle, **When** they enter 70, **Then** the result displays "1 Tabi'/Tabi'ah and 1 Musinnah" as the zakat due (30 + 40 = 70).
4. **Given** a user has fewer than 30 cattle, **When** they enter 20, **Then** the calculator displays that no zakat is due (below nisab).

---

### User Story 3 - Calculate Zakat on Camels (Priority: P1)

A camel owner wants to calculate the zakat obligation on their herd. They enter the total number of free-grazing camels owned for a full lunar year, and the calculator returns the precise zakat due according to the detailed camel zakat schedule.

**Why this priority**: Camels have the most detailed and complex zakat schedule in Islamic jurisprudence. Including them is essential for a complete livestock zakat calculator.

**Independent Test**: Can be fully tested by entering various camel counts and verifying the results match the established Shariah schedule.

**Acceptance Scenarios**:

1. **Given** a user has 5 camels, **When** they enter 5, **Then** the result displays "1 sheep/goat" as the zakat due.
2. **Given** a user has 25 camels, **When** they enter 25, **Then** the result displays "1 Bint Makhad (1-year-old female camel)" as the zakat due.
3. **Given** a user has 50 camels, **When** they enter 50, **Then** the result displays "1 Hiqqah (3-year-old female camel)" as the zakat due.
4. **Given** a user has 3 camels, **When** they enter 3, **Then** the calculator displays that no zakat is due (below nisab of 5).
5. **Given** a user has 100 camels, **When** they enter 100, **Then** the result displays "2 Hiqqah (3-year-old female camels)" as the zakat due.

---

### User Story 4 - Understand Zakat Eligibility Conditions (Priority: P2)

A livestock owner is unsure whether their animals qualify for zakat. Before calculating, they want to understand the eligibility conditions — specifically the grazing (Sa'imah) requirement and the one-lunar-year ownership period (Hawl).

**Why this priority**: Without understanding eligibility, users may incorrectly calculate zakat on ineligible animals (stall-fed, working animals, or recently acquired). This educational context is important but secondary to the core calculation.

**Independent Test**: Can be tested by verifying that the eligibility information is clearly displayed and accessible without performing any calculation.

**Acceptance Scenarios**:

1. **Given** a user navigates to the Zakat Al-Anaam calculator, **When** the page loads, **Then** the eligibility conditions (free-grazing for most of the year, owned for one lunar year, reaching nisab) are clearly visible.
2. **Given** a user is reading eligibility conditions in Arabic, **When** they switch to Arabic, **Then** all conditions are fully translated with correct RTL layout.

---

### User Story 5 - View the Complete Zakat Schedule Reference (Priority: P3)

A user wants to review the full zakat schedule tables for all three livestock types as an educational reference, without necessarily calculating for their own animals.

**Why this priority**: Serves as a reference tool and builds trust by transparently showing the source rules. Nice-to-have but not essential for calculating zakat.

**Independent Test**: Can be tested by verifying that the reference tables for camels, cattle, and sheep/goats are displayed correctly and match established Shariah sources.

**Acceptance Scenarios**:

1. **Given** a user wants to see the full camel zakat schedule, **When** they view the reference section, **Then** all 10 camel brackets (5–9, 10–14, 15–19, 20–24, 25–35, 36–45, 46–60, 61–75, 76–90, 91–120) are listed with the correct zakat due for each.
2. **Given** a user views the reference in Arabic, **When** the language is set to Arabic, **Then** all animal type names and bracket descriptions are in Arabic.

---

### Edge Cases

- What happens when the user enters 0? → Valid input; display "no zakat due" (below nisab).
- What happens when the user enters a negative number? → Invalid input; API returns null.
- What happens when the user enters a non-integer value (e.g., 40.5)? → The input should only accept whole numbers since animals cannot be fractional.
- What happens when the user enters an extremely large number of camels (e.g., above 120)? → The calculator must apply the continuation rule: for every 40 camels above 120, 1 Bint Labun; for every 50, 1 Hiqqah. The optimal combination yielding the fewest animals should be computed.
- What happens when the user enters a number of cattle that is not a multiple of 10 (e.g., 125, 135)? → For counts >= 120, the calculator floors to the nearest multiple of 10 (waqs normalization), then finds the optimal combination. The remainder is waqs (intermediate animals not counted).
- What happens when the user clears the input field? → Reset to the initial state with no result displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Zakat Al-Anaam calculator accessible as a new tab alongside the existing Zakat Al-Mal, Zakat Al-Fitr, and Zakat Al-Zuru calculators.
- **FR-002**: System MUST support three livestock categories: camels (إبل), cattle (بقر), and sheep/goats (غنم).
- **FR-003**: System MUST accept a whole-number count of animals for each livestock category as input.
- **FR-004**: System MUST calculate the zakat due for sheep/goats using the following schedule:
  - Below 40: No zakat due
  - 40–120: 1 sheep/goat
  - 121–200: 2 sheep/goats
  - 201–300: 3 sheep/goats
  - Above 300: 3 sheep/goats + 1 additional for every 100 above 300
- **FR-005**: System MUST calculate the zakat due for cattle using the following rules:
  - Below 30: No zakat due
  - 30-119: Fixed brackets per fiqh schedule
  - 120 and above: Normalize the count down to the nearest multiple of 10 (waqs flooring), then find the optimal combination of 30s (Tabi') and 40s (Musinnah) that covers the normalized count, maximizing Musinnah
  - Example: 35 cattle yields 1 Tabi' (30 cattle), with 5 as waqs; 135 cattle normalizes to 130, yielding 1 Musinnah + 3 Tabi', with 5 as waqs
- **FR-006**: System MUST calculate the zakat due for camels using the following schedule:
  - Below 5: No zakat due
  - 5–9: 1 sheep/goat
  - 10–14: 2 sheep/goats
  - 15–19: 3 sheep/goats
  - 20–24: 4 sheep/goats
  - 25–35: 1 Bint Makhad (female camel, 1 year old)
  - 36–45: 1 Bint Labun (female camel, 2 years old)
  - 46–60: 1 Hiqqah (female camel, 3 years old)
  - 61–75: 1 Jadha'ah (female camel, 4 years old)
  - 76–90: 2 Bint Labun
  - 91–120: 2 Hiqqah
  - Above 120: Restart counting using Bint Labun per 40 and Hiqqah per 50
- **FR-007**: System MUST display the zakat result in a human-readable format, including the animal type name in both English and Arabic.
- **FR-008**: System MUST display the eligibility conditions for livestock zakat (free-grazing/Sa'imah, one lunar year ownership/Hawl, reaching nisab) prominently before the calculation inputs.
- **FR-009**: System MUST display results immediately upon user action without requiring network access — all calculation logic runs client-side with no external API dependency.
- **FR-010**: System MUST validate input to accept non-negative whole numbers (including zero) and gracefully handle invalid input. Negative numbers, fractional values, non-finite values (NaN, Infinity), and empty inputs are invalid and return null. Zero count is valid and returns "no zakat due" result.
- **FR-011**: All user-facing strings MUST be available in both English and Arabic, with correct RTL layout for Arabic.
- **FR-012**: The calculator MUST work in both light and dark themes.
- **FR-013**: System MUST include a scholarly disclaimer indicating that users should consult a qualified scholar for specific personal circumstances.
- **FR-014**: System MUST NOT transmit, store externally, or use for telemetry any user-entered herd data; all livestock count inputs and eligibility conditions remain strictly local to the user's browser session.

### Key Entities

- **Livestock Category**: One of three types — Camels, Cattle, or Sheep/Goats — each with its own nisab and zakat schedule.
- **Zakat Schedule**: The mapping from animal count ranges to the type and quantity of animals due as zakat for a given livestock category.
- **Zakat Result**: The output of a calculation, consisting of one or more animal types and their quantities (e.g., "2 Bint Labun and 1 Hiqqah").
- **Eligibility Conditions**: The prerequisites that must be met for livestock zakat to be obligatory (Sa'imah, Hawl, Nisab).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can calculate zakat for any of the three livestock types in under 30 seconds from opening the calculator tab.
- **SC-002**: 100% of calculations for all documented test cases (the 10 camel brackets, cattle combinations up to 200, sheep/goat ranges up to 1000) return Shariah-accurate results.
- **SC-003**: All calculator labels, instructions, results, and eligibility information are available in both English and Arabic.
- **SC-004**: The calculator functions fully without any network connection, producing correct results offline.
- **SC-005**: Users can identify the eligibility conditions for livestock zakat without scrolling past the calculator inputs.

## Assumptions

- The user has accurate knowledge of the number and type of their livestock — the calculator does not help with counting or categorizing mixed herds.
- The calculator addresses the mainstream Sunni jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali) consensus on livestock zakat. Minor inter-school differences (e.g., exact age terminology) are documented but a single consistent schedule is used.
- Sheep and goats are grouped as a single category ("Ghanam") per the established jurisprudential practice.
- The calculator does not handle mixed-species herds (e.g., combining camels and cattle into one calculation) — each category is calculated independently.
- No monetary conversion is provided — the result is expressed in animals, not cash equivalents.
- The feature follows the existing app architecture: React component with CSS Modules, integrated as a new tab, using the existing i18n and theme systems.
