# Data Model: Zakat Al-Anaam (Livestock) Calculator

**Feature**: `004-livestock-zakat-calculator`
**Date**: 2026-08-18

## 1. Entities and Types

### 1.1 `LivestockSpecies` (Enum)

Represents the valid livestock categories:

```typescript
type LivestockSpecies = 'camels' | 'cattle' | 'sheep_goats';
```

- `'camels'`: Camels (*Ibil* / الإبل)
- `'cattle'`: Cattle, cows, and water buffalo (*Baqar* / البقر)
- `'sheep_goats'`: Sheep and goats combined (*Ghanam* / الغنم)

---

### 1.2 `EligibilityConditions` (Object)

Represents the Shariah prerequisite answers provided by the user:

```typescript
interface EligibilityConditions {
    isGrazing: boolean;       // Sa'imah: Grazes on natural pasture > 6 months of lunar year
    isNonWorking: boolean;    // Ghayr 'Amilah: Not used for agriculture, plowing, or transport
    heldForHawl: boolean;     // Hawl: Minimum Nisab count owned continuously for one full lunar year
}
```

**Validation & Gate Logic**:
- An animal herd is eligible for livestock Zakat **if and only if** `isGrazing === true && isNonWorking === true && heldForHawl === true`.
- If any condition is `false`, `isEligible === false` with specific diagnostic key indicating reason (e.g. `'stall-fed'`, `'working'`, `'hawl-incomplete'`).

---

### 1.3 `ZakatDueItem` (Object)

Represents an individual type and quantity of animal required to be paid:

```typescript
interface ZakatDueItem {
    key: string;             // Translation key for animal type (e.g., 'anaam-animal-shah', 'anaam-animal-bint-makhad')
    count: number;           // Quantity of this animal type due (e.g., 2)
    ageDescriptionKey: string; // Translation key describing the age/sex (e.g., 'anaam-desc-bint-labun')
}
```

---

### 1.4 `LivestockCalculationInput` (Object)

Input payload for calculation function:

```typescript
interface LivestockCalculationInput {
    species: LivestockSpecies;
    count: number;
    conditions?: EligibilityConditions;
}
```

**Validation Rules**:
- `species`: Must be one of `'camels'`, `'cattle'`, `'sheep_goats'`.
- `count`: Must be a finite, non-negative integer (`Number.isInteger(count) && count >= 0`). Fractional animals are rejected (`null`).
- `conditions`: Optional. If omitted, defaults to all conditions satisfied (`true`).

---

### 1.5 `LivestockCalculationResult` (Object)

Result returned by the pure calculation function:

```typescript
interface LivestockCalculationResult {
    species: LivestockSpecies;
    count: number;
    nisab: number;
    isEligible: boolean;
    ineligibilityReason?: 'below-nisab' | 'not-grazing' | 'is-working' | 'no-hawl';
    zakatDueItems: ZakatDueItem[];
    alternateCombinations?: ZakatDueItem[][];
    explanationKey?: string;
}
```

---

## 2. Threshold Tables and State Transitions

### 2.1 Camels (*Ibil*) State Transitions

| Herd Count ($n$) | Nisab Met | Primary Obligation | Alternate / Notes |
|:---|:---:|:---|:---|
| $0 \le n \le 4$ | ❌ No | None ($0$) | Below Nisab ($5$) |
| $5 \le n \le 9$ | ✅ Yes | 1 Shāh (sheep/goat) | |
| $10 \le n \le 14$ | ✅ Yes | 2 Shāh | |
| $15 \le n \le 19$ | ✅ Yes | 3 Shāh | |
| $20 \le n \le 24$ | ✅ Yes | 4 Shāh | |
| $25 \le n \le 35$ | ✅ Yes | 1 Bint Makhāḍ (1-year female camel) | |
| $36 \le n \le 45$ | ✅ Yes | 1 Bint Labūn (2-year female camel) | |
| $46 \le n \le 60$ | ✅ Yes | 1 Ḥiqqah (3-year female camel) | |
| $61 \le n \le 75$ | ✅ Yes | 1 Jadha'ah (4-year female camel) | |
| $76 \le n \le 90$ | ✅ Yes | 2 Bint Labūn | |
| $91 \le n \le 120$ | ✅ Yes | 2 Ḥiqqah | |
| $n > 120$ | ✅ Yes | Decompose $\lfloor n/10 \rfloor \times 10 = 50x + 40y$ (max $x$) | $x$ Ḥiqqah + $y$ Bint Labūn |

---

### 2.2 Cattle (*Baqar*) State Transitions

| Herd Count ($n$) | Nisab Met | Primary Obligation | Alternate / Notes |
|:---|:---:|:---|:---|
| $0 \le n \le 29$ | ❌ No | None ($0$) | Below Nisab ($30$) |
| $30 \le n \le 39$ | ✅ Yes | 1 Tabī' / Tabī'ah (1-year calf) | |
| $40 \le n \le 59$ | ✅ Yes | 1 Musinnah (2-year cow) | |
| $60 \le n \le 69$ | ✅ Yes | 2 Tabī' | |
| $70 \le n \le 79$ | ✅ Yes | 1 Musinnah + 1 Tabī' | |
| $80 \le n \le 89$ | ✅ Yes | 2 Musinnah | |
| $90 \le n \le 99$ | ✅ Yes | 3 Tabī' | |
| $100 \le n \le 109$ | ✅ Yes | 1 Musinnah + 2 Tabī' | |
| $110 \le n \le 119$ | ✅ Yes | 2 Musinnah + 1 Tabī' | |
| $120 \le n \le 129$ | ✅ Yes | 3 Musinnah | Alternate: 4 Tabī' |
| $n \ge 130$ | ✅ Yes | Decompose $\lfloor n/10 \rfloor \times 10 = 40y + 30x$ (max $y$) | $y$ Musinnah + $x$ Tabī' |

---

### 2.3 Sheep & Goats (*Ghanam*) State Transitions

| Herd Count ($n$) | Nisab Met | Primary Obligation |
|:---|:---:|:---|
| $0 \le n \le 39$ | ❌ No | None ($0$) |
| $40 \le n \le 120$ | ✅ Yes | 1 Shāh (sheep/goat) |
| $121 \le n \le 200$ | ✅ Yes | 2 Shāh |
| $201 \le n \le 399$ | ✅ Yes | 3 Shāh |
| $n \ge 400$ | ✅ Yes | $\lfloor n / 100 \rfloor$ Shāh (1 per full hundred) |
