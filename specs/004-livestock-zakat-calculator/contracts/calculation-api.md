# Contract: Livestock Calculation Domain API

**Consumers**: `AnaamView.jsx`, `LandingView.jsx`, and Vitest test suites (`src/domain/__tests__/anaam.test.js`).
**Module**: `src/domain/anaam.js`
**Nature**: Pure functions, deterministic, zero I/O, no DOM dependencies.
**Principle**: Follows Constitution Principle I (Shariah Accuracy First).

---

## 1. Exported Function Signatures

### 1.1 `calculateAnaam` (Primary Entry Point)

```javascript
calculateAnaam({ species, count, conditions }) → LivestockCalculationResult | null
```

#### Parameters:
- `species`: `'camels' | 'cattle' | 'sheep_goats'`
- `count`: integer $\ge 0$
- `conditions` *(optional)*: `{ isGrazing?: boolean, isNonWorking?: boolean, heldForHawl?: boolean }` (defaults to all `true`)

#### Output (`LivestockCalculationResult`):
```javascript
{
  species: 'camels',
  count: 140,
  nisab: 5,
  isEligible: true,
  ineligibilityReason: null, // or 'below-nisab' | 'anaam-ineligible-stall-fed' | 'anaam-ineligible-working' | 'anaam-ineligible-no-hawl'
  zakatDueItems: [
    { key: 'anaam-animal-hiqqah', count: 2, ageDescriptionKey: 'anaam-desc-hiqqah' },
    { key: 'anaam-animal-bint-labun', count: 1, ageDescriptionKey: 'anaam-desc-bint-labun' }
  ],
  alternateCombinations: null, // or array of alternative valid ZakatDueItem[]
  explanationKey: null
}
```

---

### 1.2 Individual Helper Functions

```javascript
calculateCamels(count) → { nisab: 5, isEligible: boolean, zakatDueItems: ZakatDueItem[], alternateCombinations?: ZakatDueItem[][] } | null
calculateCattle(count) → { nisab: 30, isEligible: boolean, zakatDueItems: ZakatDueItem[], alternateCombinations?: ZakatDueItem[][] } | null
calculateSheepGoats(count) → { nisab: 40, isEligible: boolean, zakatDueItems: ZakatDueItem[] } | null
evaluateEligibility(conditions) → { isEligible: boolean, reasonKey: string | null }
```

---

## 2. Error Semantics

- If `count` is negative, non-integer (`40.5`), `NaN`, `Infinity`, or not a number $\implies$ returns `null`.
- If `species` is not one of `'camels'`, `'cattle'`, `'sheep_goats'` $\implies$ returns `null`.
- Functions must **never throw exceptions** on invalid user input.

---

## 3. Mandatory Test Vectors (Vitest Merge Gate)

### 3.1 Sheep & Goats (*Ghanam*)

| Count | Eligible | Items Due | Notes |
|:---:|:---:|:---|:---|
| `39` | ❌ No | `[]` | Below Nisab ($40$) |
| `40` | ✅ Yes | `1 Shāh` | Lower boundary |
| `120` | ✅ Yes | `1 Shāh` | Upper boundary |
| `121` | ✅ Yes | `2 Shāh` | Lower boundary |
| `200` | ✅ Yes | `2 Shāh` | Upper boundary |
| `201` | ✅ Yes | `3 Shāh` | Lower boundary |
| `260` | ✅ Yes | `3 Shāh` | Worked example |
| `399` | ✅ Yes | `3 Shāh` | Upper boundary |
| `400` | ✅ Yes | `4 Shāh` | $\lfloor 400/100 \rfloor = 4$ |
| `499` | ✅ Yes | `4 Shāh` | $\lfloor 499/100 \rfloor = 4$ (waqs) |
| `500` | ✅ Yes | `5 Shāh` | $\lfloor 500/100 \rfloor = 5$ |

---

### 3.2 Cattle (*Baqar*)

| Count | Eligible | Items Due | Alternate | Notes |
|:---:|:---:|:---|:---|:---|
| `29` | ❌ No | `[]` | - | Below Nisab ($30$) |
| `30` | ✅ Yes | `1 Tabī'` | - | Lower boundary |
| `39` | ✅ Yes | `1 Tabī'` | - | Upper boundary |
| `40` | ✅ Yes | `1 Musinnah` | - | Lower boundary |
| `59` | ✅ Yes | `1 Musinnah` | - | Upper boundary |
| `60` | ✅ Yes | `2 Tabī'` | - | Lower boundary |
| `65` | ✅ Yes | `2 Tabī'` | - | Waqs (same as 60) |
| `70` | ✅ Yes | `1 Musinnah + 1 Tabī'` | - | Lower boundary |
| `75` | ✅ Yes | `1 Musinnah + 1 Tabī'` | - | Worked example |
| `80` | ✅ Yes | `2 Musinnah` | - | Lower boundary |
| `90` | ✅ Yes | `3 Tabī'` | - | Lower boundary |
| `100` | ✅ Yes | `1 Musinnah + 2 Tabī'` | - | Lower boundary |
| `110` | ✅ Yes | `2 Musinnah + 1 Tabī'` | - | Lower boundary |
| `120` | ✅ Yes | `3 Musinnah` | `4 Tabī'` | 3 Musinnah preferred |
| `130` | ✅ Yes | `1 Musinnah + 3 Tabī'` | - | $40(1) + 30(3) = 130$ |
| `140` | ✅ Yes | `2 Musinnah + 2 Tabī'` | - | $40(2) + 30(2) = 140$ |
| `150` | ✅ Yes | `0 Musinnah + 5 Tabī'` | - | $30(5) = 150$ |
| `160` | ✅ Yes | `4 Musinnah` | - | $40(4) = 160$ |

---

### 3.3 Camels (*Ibil*)

| Count | Eligible | Items Due | Alternate | Notes |
|:---:|:---:|:---|:---|:---|
| `4` | ❌ No | `[]` | - | Below Nisab ($5$) |
| `5` | ✅ Yes | `1 Shāh` | - | Lower boundary |
| `9` | ✅ Yes | `1 Shāh` | - | Upper boundary |
| `10` | ✅ Yes | `2 Shāh` | - | Lower boundary |
| `24` | ✅ Yes | `4 Shāh` | - | Upper boundary |
| `25` | ✅ Yes | `1 Bint Makhāḍ` | - | Lower boundary |
| `35` | ✅ Yes | `1 Bint Makhāḍ` | - | Upper boundary |
| `36` | ✅ Yes | `1 Bint Labūn` | - | Lower boundary |
| `45` | ✅ Yes | `1 Bint Labūn` | - | Upper boundary |
| `46` | ✅ Yes | `1 Ḥiqqah` | - | Lower boundary |
| `60` | ✅ Yes | `1 Ḥiqqah` | - | Upper boundary |
| `61` | ✅ Yes | `1 Jadha'ah` | - | Lower boundary |
| `75` | ✅ Yes | `1 Jadha'ah` | - | Upper boundary |
| `76` | ✅ Yes | `2 Bint Labūn` | - | Lower boundary |
| `90` | ✅ Yes | `2 Bint Labūn` | - | Upper boundary |
| `91` | ✅ Yes | `2 Ḥiqqah` | - | Lower boundary |
| `120` | ✅ Yes | `2 Ḥiqqah` | - | Upper boundary |
| `130` | ✅ Yes | `1 Ḥiqqah + 2 Bint Labūn` | - | $50(1) + 40(2) = 130$ |
| `135` | ✅ Yes | `1 Ḥiqqah + 2 Bint Labūn` | - | Waqs (same as 130) |
| `140` | ✅ Yes | `2 Ḥiqqah + 1 Bint Labūn` | - | Worked example ($50\cdot 2 + 40\cdot 1$) |
| `150` | ✅ Yes | `3 Ḥiqqah` | - | $50(3) = 150$ |
| `200` | ✅ Yes | `4 Ḥiqqah` | `5 Bint Labūn` | 4 Ḥiqqah preferred |
