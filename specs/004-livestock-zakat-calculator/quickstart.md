# Quickstart & Validation Guide: Zakat Al-Anaam Calculator

**Feature**: `004-livestock-zakat-calculator`
**Branch**: `feature/004-livestock-zakat-calculator`
**Date**: 2026-08-18

This guide outlines the commands and manual validation workflows to test and verify the Zakat Al-Anaam calculator end-to-end.

---

## 1. Prerequisites & Setup

Ensure dependencies are installed and test environment is ready:

```bash
# Verify Node and dependencies
npm install

# Run automated tests
npm test
```

---

## 2. Automated Test Validation (Vitest)

Execute Vitest to verify all mathematical formulas, bracket boundaries, waqs decompositions, and eligibility gates:

```bash
# Run domain calculation unit tests
npx vitest run src/domain/__tests__/anaam.test.js

# Run full project test suite (ensures zero regression)
npm test
```

### Key Automated Vectors to Check:
- **Sheep & Goats**: 39 (0), 40 (1), 120 (1), 121 (2), 200 (2), 201 (3), 260 (3), 399 (3), 400 (4), 499 (4), 500 (5).
- **Cattle**: 29 (0), 30 (1 Tabi'), 40 (1 Musinnah), 60 (2 Tabi'), 70 (1 Musinnah + 1 Tabi'), 75 (1 Musinnah + 1 Tabi'), 80 (2 Musinnah), 120 (3 Musinnah), 130 (1 Musinnah + 3 Tabi'), 140 (2 Musinnah + 2 Tabi').
- **Camels**: 4 (0), 5 (1 Shah), 24 (4 Shah), 25 (1 Bint Makhad), 36 (1 Bint Labun), 46 (1 Hiqqah), 61 (1 Jadha'ah), 76 (2 Bint Labun), 91 (2 Hiqqah), 120 (2 Hiqqah), 140 (2 Hiqqah + 1 Bint Labun), 200 (4 Hiqqah).

---

## 3. Manual Interactive Validation (Browser)

Start the local Vite development server:

```bash
npm run dev
```

Open the local preview URL (typically `http://localhost:5173/zakat-calculator/` or `http://localhost:5173/`).

### Test Flow 1: Sheep & Goats Journey
1. Click **Zakat Al-Anaam** on the Landing page or navigation bar.
2. Select **Sheep & Goats** (*Ghanam*).
3. Ensure all three eligibility checkboxes are checked (Grazing, Non-working, 1-year Hawl).
4. Enter `40` $\to$ verify result: **1 Shāh (sheep/goat)**.
5. Enter `260` $\to$ verify result: **3 Shāh**.
6. Switch language to **Arabic (العربية)** $\to$ verify correct RTL layout and terms: **3 شياه**.

### Test Flow 2: Cattle Journey
1. Select **Cattle & Buffalo** (*Baqar*).
2. Enter `75` $\to$ verify result: **1 Musinnah (2-year-old cow) and 1 Tabī' (1-year-old calf)**.
3. In Arabic: verify **1 مسنة و 1 تبيع**.
4. Enter `140` $\to$ verify result: **2 Musinnah and 2 Tabī'**.

### Test Flow 3: Camels Journey
1. Select **Camels** (*Ibil*).
2. Enter `140` $\to$ verify result: **2 Ḥiqqah (3-year-old) and 1 Bint Labūn (2-year-old)**.
3. In Arabic: verify **2 حقة و 1 بنت لبون**.
4. Enter `4` $\to$ verify message: **Below Nisab (5 camels)**.

### Test Flow 4: Ineligibility Gate Validation
1. Uncheck "Grazing (Sa'imah)" $\to$ verify educational note explaining that stall-fed animals are exempt from livestock Zakat.
2. Uncheck "Held for 1 Lunar Year" $\to$ verify message indicating Hawl has not elapsed.

### Test Flow 5: Accessibility, Theme & Copy
1. Switch to Dark theme $\to$ check contrast and visual harmony.
2. Click **Copy Result** $\to$ verify toast notification and clipboard content.
3. Test tab navigation with keyboard.
