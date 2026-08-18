# Phase 0 Research: Zakat Al-Anaam (Livestock) Calculator

**Feature**: `004-livestock-zakat-calculator`
**Date**: 2026-08-18
**Status**: Completed

## 1. Domain & Jurisprudential (Fiqh) Rules

### 1.1 Species & Nisab Thresholds

Mainstream Sunni fiqh consensus defines three categories of livestock eligible for Zakat Al-Anaam (*al-an'ām*):

1. **Camels (`ibil` / الإبل)**:
   - **Nisab**: 5 animals.
   - **1–4**: 0 (Below Nisab).
   - **5–9**: 1 shāh (شاة - 1 sheep or goat).
   - **10–14**: 2 shāh (شاتان).
   - **15–19**: 3 shāh (ثلاث شياه).
   - **20–24**: 4 shāh (أربع شياه).
   - **25–35**: 1 bint makhāḍ (بنت مخاض - female camel in her 2nd year).
   - **36–45**: 1 bint labūn (بنت لبون - female camel in her 3rd year).
   - **46–60**: 1 ḥiqqah (حقة - female camel in her 4th year).
   - **61–75**: 1 jadha'ah (جذعة - female camel in her 5th year).
   - **76–90**: 2 bint labūn (بنتا لبون).
   - **91–120**: 2 ḥiqqah (حقتان).
   - **> 120 Continuation Rule (Waqs / وقص)**:
     - Floor to the nearest multiple of 10 (`Math.floor(n / 10) * 10`).
     - Decompose into $50x + 40y = n$ where $x$ represents the count of Ḥiqqahs (50 each) and $y$ represents the count of Bint Labūns (40 each).
     - Maximizing $x$ (Ḥiqqah) is the primary fiqh preference in standard charts (e.g., 200 camels $\to$ 4 Ḥiqqahs; alternatively 5 Bint Labūns noted as valid secondary).

2. **Cattle & Water Buffalo (`baqar` / البقر)**:
   - **Nisab**: 30 animals.
   - **1–29**: 0 (Below Nisab).
   - **30–39**: 1 tabī' / tabī'ah (تبيع أو تبيعة - 1-year-old male or female calf).
   - **40–59**: 1 musinnah (مسنة - 2-year-old female cow).
   - **60–69**: 2 tabī' (تبيعان).
   - **70–79**: 1 musinnah + 1 tabī' (مسنة وتبيع).
   - **80–89**: 2 musinnah (مسنتان).
   - **90–99**: 3 tabī' (ثلاثة أتبعة).
   - **100–109**: 1 musinnah + 2 tabī' (مسنة وتبيعان).
   - **110–119**: 2 musinnah + 1 tabī' (مسنتان وتبيع).
   - **120–129**: 3 musinnah or 4 tabī' (3 مسنات أو 4 أتبعة; standard preference: 3 musinnah).
   - **$\ge 130$ Continuation Rule**:
     - Floor to the nearest multiple of 10 (`Math.floor(n / 10) * 10`).
     - Decompose into $40y + 30x = n$ where $y$ represents the count of Musinnahs (40 each) and $x$ represents the count of Tabī's (30 each).
     - Maximizing $y$ (Musinnah-first) is preferred, with alternate valid combinations displayed or noted.

3. **Sheep & Goats (`ghanam` / الغنم)**:
   - **Nisab**: 40 animals.
   - **1–39**: 0 (Below Nisab).
   - **40–120**: 1 shāh (شاة - 1 sheep or goat).
   - **121–200**: 2 shāh (شاتان).
   - **201–399**: 3 shāh (ثلاث شياه).
   - **$\ge 400$**: 1 shāh per 100 animals (`Math.floor(n / 100)`). E.g., 400 $\to$ 4, 499 $\to$ 4, 500 $\to$ 5.

### 1.2 Eligibility Prerequisites

Livestock Zakat is only due if all three conditions are satisfied:
1. **Sa'imah (السائمة - Grazing)**: Animals graze on uncultivated, free natural pasture for more than six months (> half the lunar year). Stall-fed animals (`ma'lūfah`) are exempt from livestock Zakat (though trade goods Zakat of 2.5% may apply if held for commercial trading).
2. **Non-working (`ghayr 'āmilah` - غير عاملة)**: Animals are not used for agricultural labor, plowing, water-drawing, or riding/transport.
3. **Hawl (`ḥawl` - الحول)**: The owner has maintained full ownership of at least the Nisab amount for one complete Hijri (lunar) year.

---

## 2. Technical Decisions & Rationale

### 2.1 Domain Logic Separation (`src/domain/anaam.js`)

- **Decision**: Implement all mathematical decompositions, bracket tables, and eligibility logic inside `src/domain/anaam.js` as pure functions with zero UI or side-effect dependencies.
- **Rationale**:
  - Complies with Constitution Principle I (Shariah Accuracy First) and Principle II (Lean Static SPA).
  - Enables 100% test coverage with Vitest for every bracket boundary, waqs scenario, and worked example.
- **Alternatives Considered**:
  - Inline logic in UI components (rejected: untestable, violates codebase architecture).

### 2.2 Waq Decomposition Algorithm

- **Decision**:
  - For camels $>120$: iterate through possible count of 50s ($x$) downwards from $\lfloor n / 50 \rfloor$ to 0; if $(n - 50x) \pmod{40} == 0$, set $y = (n - 50x) / 40$. Return $x$ Ḥiqqahs and $y$ Bint Labūns.
  - For cattle $\ge 130$: iterate through possible count of 40s ($y$) downwards from $\lfloor n / 40 \rfloor$ to 0; if $(n - 40y) \pmod{30} == 0$, set $x = (n - 40y) / 30$. Return $y$ Musinnahs and $x$ Tabī's.
- **Rationale**:
  - Exact integer arithmetic; guaranteed $O(1)$ constant time as the search space is at most $\sim 10$ steps even for herds of thousands.
  - Verifiably adheres to the fiqh preferences (maximum 50s for camels, maximum 40s for cattle).

### 2.3 UI & Navigation Integration

- **Decision**:
  - Add `'anaam'` to `App.jsx` navigation alongside `landing`, `fitr`, `mal`, `zuru`, and `about`.
  - Add card in `LandingView.jsx`, entry in `Header.jsx` and `Sidebar.jsx`.
  - Implement `src/views/AnaamView.jsx` with an interactive, accessible 3-step flow:
    1. Category Selector (Camels, Cattle, Sheep/Goats).
    2. Guided Eligibility Checklist (Grazing, Non-working, Hawl) with explanatory feedback if conditions are not met.
    3. Herd Count Input with instant live calculation, breakdown of due animal types, and copyable `ResultCard`.
- **Rationale**:
  - Consistent with the existing views (`FitrView`, `MalView`, `ZuruView`).
  - Follows Constitution Principle III (Full bilingual, accessible, semantic HTML, RTL).

### 2.4 Offline-First & Privacy Compliance

- **Decision**: Zero network requests; all calculations occur strictly in-memory in the browser.
- **Rationale**:
  - Complies with Constitution Principle IV (Offline-capable for non-market calculators) and Principle V (Client-Side Privacy & Transparency).
