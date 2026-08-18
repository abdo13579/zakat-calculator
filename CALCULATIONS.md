# Zakat Calculation Methodology & Shariah Rules

This document provides a comprehensive and transparent explanation of how **ZakatCalc** computes Zakat across all supported categories: **Zakat Al-Fitr**, **Zakat Al-Mal**, **Zakat Al-Zuru**, and **Zakat Al-Anaam**.

All formulas, Nisab thresholds, and calculation methods are based on mainstream Islamic jurisprudence (Sunni fiqh consensus) as documented in the project constitution and verified against established scholarly sources.

---

## Table of Contents

1. [Core Jurisprudential Principles](#1-core-jurisprudential-principles)
2. [Zakat Al-Fitr (Fast-Breaking Zakat)](#2-zakat-al-fitr-fast-breaking-zakat)
3. [Zakat Al-Mal (Wealth & Liquid Assets Zakat)](#3-zakat-al-mal-wealth--liquid-assets-zakat)
4. [Zakat Al-Zuru (Agricultural Produce Zakat)](#4-zakat-al-zuru-agricultural-produce-zakat)
5. [Zakat Al-Anaam (Livestock Zakat)](#5-zakat-al-anaam-livestock-zakat)
   - [Eligibility Conditions (Shuroot)](#51-eligibility-conditions-shuroot)
   - [Sheep & Goats (الغنم - Ghanam)](#52-sheep--goats-الغنم---ghanam)
   - [Cattle & Buffalo (البقر - Baqar)](#53-cattle--buffalo-البقر---baqar)
   - [Camels (الإبل - Ibil)](#54-camels-الإبل---ibil)
6. [Mathematical Modeling & Implementation Details](#6-mathematical-modeling--implementation-details)
7. [Scholarly Disclaimer](#7-scholarly-disclaimer)

---

## 1. Core Jurisprudential Principles

Zakat is one of the Five Pillars of Islam. To ensure accuracy and trust:

- **Nisab (النصاب)**: The minimum threshold of wealth an individual must possess before Zakat becomes obligatory.
- **Hawl (الحول)**: The passage of one full Hijri (lunar) year (approximately 354 days) while holding wealth at or above the Nisab (applicable to Zakat Al-Mal and Zakat Al-Anaam; not required for Zakat Al-Zuru or Zakat Al-Fitr).
- **Sa'imah (السائمة)**: Grazing on natural, uncultivated pasture for the majority of the year (> 6 months), which is a prerequisite for livestock Zakat.
- **Client-Side Computation**: All calculations execute in the user's browser with zero transmission of financial or herd data to external servers.

---

## 2. Zakat Al-Fitr (Fast-Breaking Zakat)

### Jurisprudential Basis
Zakat Al-Fitr is an individual obligation (*Fard 'Ayn*) due before the Eid al-Fitr prayer on behalf of oneself and all dependents. Prophetic tradition specifies one *Sa'* (صاع) of staple food per person.

### Constants & Formulas
- **Standard Weight per Individual**: $3.0\text{ kg}$ (the contemporary standard equivalent of one Sa' for staple grains such as wheat, rice, or flour).
- **Total Required Weight**:
  $$\text{Total Weight (kg)} = \text{Number of Individuals} \times 3.0\text{ kg}$$
- **Total Monetary Value**:
  $$\text{Total Value} = \text{Total Weight (kg)} \times \text{Local Food Price per kg}$$

### Inputs & Validation
- `persons`: Positive integer ($\ge 1$).
- `pricePerKg`: Non-negative decimal number ($\ge 0$).
- Currency selection: User-specified currency (USD, EUR, SAR, EGP, etc.).

### Worked Example
For a family of **4 individuals** where the local price of staple grain is **$2.50 / kg**:
- $\text{Total Weight} = 4 \times 3.0 = 12.0\text{ kg}$
- $\text{Total Value} = 12.0 \times \$2.50 = \$30.00$

---

## 3. Zakat Al-Mal (Wealth & Liquid Assets Zakat)

### Jurisprudential Basis
Zakat Al-Mal is due on qualifying surplus liquid wealth (cash, savings, gold, trade assets) that has reached the Nisab and been held for one lunar year (*Hawl*).

### Nisab Benchmark
- **Gold Standard**: $85\text{ grams}$ of 24-karat pure gold (20 Mithqals / Dinar).

### Calculation Steps
1. **Live Gold Price Retrieval**: The app fetches the current spot price of gold per troy ounce from keyless, CORS-enabled public endpoints (`mintedmetal.com/api/prices.json`).
2. **Gram Conversion**:
   $$\text{Price per Gram (USD)} = \frac{\text{Price per Troy Ounce (USD)}}{31.1035}$$
3. **Currency Conversion**: Exchange rate $R$ (selected currency per 1 USD) is retrieved from `open.er-api.com/v6/latest/USD`.
4. **Nisab Determination**:
   $$\text{Nisab} = 85 \times \text{Price per Gram (USD)} \times R$$
5. **Eligibility & Obligation**:
   $$\text{Zakat Due} = \begin{cases} \text{Total Liquid Wealth} \times 0.025 & \text{if } \text{Total Liquid Wealth} \ge \text{Nisab} \\ 0 & \text{if } \text{Total Liquid Wealth} < \text{Nisab} \end{cases}$$

### Worked Example
- Gold price: **$75.00 / gram**
- User currency: **USD** ($R = 1$)
- $\text{Nisab} = 85 \times \$75.00 = \$6,375.00$
- If user holds **$10,000.00** ($\ge \$6,375.00$):
  $$\text{Zakat Due} = \$10,000.00 \times 2.5\% = \$250.00$$
- If user holds **$5,000.00** ($< \$6,375.00$):
  $$\text{Zakat Due} = \$0.00\text{ (Below Nisab)}$$

---

## 4. Zakat Al-Zuru (Agricultural Produce Zakat)

### Jurisprudential Basis
Zakat on crops and fruits is due at harvest time (*Yawm al-Hasad* / يوم الحصاد) pursuant to Surah Al-An'am (6:141). No one-year Hawl is required.

### Nisab Benchmark
- **5 Wasqs (خمسة أوسق)**: Equivalent to $300\text{ Sa'} \approx 600\text{ kg}$ of dry, storable grains/fruits (wheat, barley, dates, raisins, rice).

### Irrigation Rates
The Zakat percentage depends on the labor and financial cost invested in irrigation:

| Irrigation Type | Shariah Category | Applied Rate | Percentage |
|:---|:---|:---:|:---:|
| **Rainfed / Natural** | بعلي أو بالمطر والعيون (Ghayr Mu'anná) | $0.10$ | **10%** |
| **Irrigated / Artificial** | بالنواضح والآلات (Mu'anná) | $0.05$ | **5%** |
| **Mixed / Dual** | مشترك بالسقي والمطر | $0.075$ | **7.5%** |

### Formula
$$\text{Zakat Due (kg)} = \begin{cases} \text{Harvest Weight (kg)} \times \text{Rate} & \text{if } \text{Harvest Weight} \ge 600\text{ kg} \\ 0 & \text{if } \text{Harvest Weight} < 600\text{ kg} \end{cases}$$

### Worked Example
Harvest weight of **1,200 kg** of rainfed wheat:
- $\text{Nisab} = 600\text{ kg}$ (Met)
- $\text{Zakat Due} = 1,200\text{ kg} \times 10\% = 120\text{ kg}$

---

## 5. Zakat Al-Anaam (Livestock Zakat)

### 5.1 Eligibility Conditions (Shuroot)
Livestock Zakat is only due if all three conditions are satisfied:
1. **Sa'imah (السائمة - Grazing)**: Animals graze freely on uncultivated, natural pasture for more than 6 months of the lunar year. *Stall-fed animals fed purchased fodder are exempt from livestock Zakat (commercial trade Zakat of 2.5% applies if held as inventory for sale).*
2. **Ghayr 'Amilah (غير عاملة - Non-Working)**: Animals are not utilized for agricultural plowing, water-drawing, or riding/transport.
3. **Hawl (الحول - 1 Lunar Year)**: The herd has been held at or above Nisab for a complete lunar year.

---

### 5.2 Sheep & Goats (الغنم - Ghanam)
- **Nisab**: $40\text{ animals}$

| Herd Count ($n$) | Obligation Due | Notes |
|:---:|:---|:---|
| $1 \le n \le 39$ | $0$ | Below Nisab |
| $40 \le n \le 120$ | $1\text{ Shāh (شاة)}$ | Sheep (1+ yr) or Goat (2+ yrs) |
| $121 \le n \le 200$ | $2\text{ Shāh (شاتان)}$ | |
| $201 \le n \le 399$ | $3\text{ Shāh (ثلاث شياه)}$ | |
| $n \ge 400$ | $\lfloor n / 100 \rfloor\text{ Shāh}$ | $1\text{ Shāh}$ per full 100 animals |

---

### 5.3 Cattle & Buffalo (البقر - Baqar)
- **Nisab**: $30\text{ animals}$

#### Standard Brackets ($30 \le n \le 119$):
| Herd Count ($n$) | Obligation Due | Fiqh Term & Age |
|:---:|:---|:---|
| $1 \le n \le 29$ | $0$ | Below Nisab |
| $30 \le n \le 39$ | $1\text{ Tabī' (تبيع)}$ | 1-year-old male/female calf |
| $40 \le n \le 59$ | $1\text{ Musinnah (مسنة)}$ | 2-year-old female cow |
| $60 \le n \le 69$ | $2\text{ Tabī' (تبيعان)}$ | |
| $70 \le n \le 79$ | $1\text{ Musinnah} + 1\text{ Tabī'}$ | |
| $80 \le n \le 89$ | $2\text{ Musinnah (مسنتان)}$ | |
| $90 \le n \le 99$ | $3\text{ Tabī' (ثلاثة أتبعة)}$ | |
| $100 \le n \le 109$ | $1\text{ Musinnah} + 2\text{ Tabī'}$ | |
| $110 \le n \le 119$ | $2\text{ Musinnah} + 1\text{ Tabī'}$ | |

#### Continuation Formula ($n \ge 120$):
At 120 and above, the count is floored to the nearest multiple of 10 ($n_0 = \lfloor n/10 \rfloor \times 10$) and solved as a linear Diophantine equation:
$$40y + 30x = n_0$$
Where:
- $y =$ Count of **Musinnah** (40 animals each)
- $x =$ Count of **Tabī'** (30 animals each)

The algorithm maximizes $y$ (Musinnah-first preference) and provides any valid alternative integer combinations. For example:
- At 120: $3\text{ Musinnah}$ (primary) or $4\text{ Tabī'}$ (alternate)
- At 129: Floored to 120 $\to$ $3\text{ Musinnah}$ (primary) or $4\text{ Tabī'}$ (alternate), with 9 animals as waqs
- At 130: $1\text{ Musinnah} + 3\text{ Tabī'}$
- At 150: $3\text{ Musinnah} + 1\text{ Tabī'}$ (primary) or $5\text{ Tabī'}$ (alternate)

---

### 5.4 Camels (الإبل - Ibil)
- **Nisab**: $5\text{ animals}$

#### Standard Brackets ($5 \le n \le 120$):
| Herd Count ($n$) | Obligation Due | Age Description |
|:---:|:---|:---|
| $1 \le n \le 4$ | $0$ | Below Nisab |
| $5 \le n \le 9$ | $1\text{ Shāh (شاة)}$ | Sheep / Goat |
| $10 \le n \le 14$ | $2\text{ Shāh (شاتان)}$ | |
| $15 \le n \le 19$ | $3\text{ Shāh (ثلاث شياه)}$ | |
| $20 \le n \le 24$ | $4\text{ Shāh (أربع شياه)}$ | |
| $25 \le n \le 35$ | $1\text{ Bint Makhāḍ (بنت مخاض)}$ | 1-year-old female camel entering 2nd yr |
| $36 \le n \le 45$ | $1\text{ Bint Labūn (بنت لبون)}$ | 2-year-old female camel entering 3rd yr |
| $46 \le n \le 60$ | $1\text{ Ḥiqqah (حقة)}$ | 3-year-old female camel entering 4th yr |
| $61 \le n \le 75$ | $1\text{ Jadha'ah (جذعة)}$ | 4-year-old female camel entering 5th yr |
| $76 \le n \le 90$ | $2\text{ Bint Labūn (بنتا لبون)}$ | |
| $91 \le n \le 120$ | $2\text{ Ḥiqqah (حقتان)}$ | |

#### Continuation Formula ($n > 120$):
Above 120 camels, the count is floored to the nearest multiple of 10 ($n_0 = \lfloor n/10 \rfloor \times 10$) and solved as:
$$50x + 40y = n_0$$
Where:
- $x =$ Count of **Ḥiqqah** (50 camels each)
- $y =$ Count of **Bint Labūn** (40 camels each)

The algorithm maximizes $x$ (Ḥiqqah-first preference) and provides any valid alternative integer combinations (e.g. at 140: $2\text{ Ḥiqqah} + 1\text{ Bint Labūn}$; at 200: $4\text{ Ḥiqqah}$ primary, $5\text{ Bint Labūn}$ alternate).

---

## 6. Mathematical Modeling & Implementation Details

All calculation functions in `src/domain/` are implemented with the following software engineering guarantees:

1. **Pure Functions**: Zero side effects, zero DOM access, and zero network calls.
2. **Total Determinism**: Identical inputs always produce identical outputs.
3. **Defensive Validation & Sanitization**:
   - Negative numbers, non-finite values (`NaN`, `Infinity`), floats where integers are required, and invalid species strings safely return `null`.
   - Functions never throw uncaught runtime exceptions on unexpected input.
4. **Waqs Floor Invariance**: Waqs (the intermediate numbers between bracket thresholds) are correctly floored without fractional animal assessments.
5. **Precision Guarantee**: Monetary and weight calculations avoid floating-point drift.

---

## 7. Scholarly Disclaimer

> **Important**: This application is provided for educational and estimation purposes. While calculations reflect mainstream Sunni jurisprudential consensus, complex situations—such as mixed-species herds, partnership ownership (*Khultah* / الخلطة), debt deductions, business assets, and local custom (*'Urf*)—should be referred to a qualified Islamic scholar or local Imam.
