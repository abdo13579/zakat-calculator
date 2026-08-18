# Contract: Internationalization (i18n) for Zakat Al-Anaam

**Consumers**: `AnaamView.jsx`, `LandingView.jsx`, `Header.jsx`, `Sidebar.jsx`, `AboutView.jsx`.
**Catalog File**: `src/i18n/translations.js`
**Principles**: Adheres to Constitution Principle III (Full Bilingual and Accessible Experience).

---

## Required Translation Keys

### 1. Navigation & Headers

| Key | English (`en`) | Arabic (`ar`) |
|:---|:---|:---|
| `nav-zakat-anaam` | Zakat Al-Anaam | زكاة الأنعام |
| `nav-zakat-anaam-full` | Calculate Zakat Al-Anaam | حساب زكاة الأنعام |
| `anaam-title` | Zakat Al-Anaam | زكاة الأنعام |
| `anaam-description` | Calculate Zakat on livestock (camels, cattle, sheep and goats) based on Islamic jurisprudence. | حساب الزكاة الواجبة في بهيمة الأنعام (الإبل، البقر، الغنم) وفق الأحكام الفقهية. |
| `anaam-button` | Go to Zakat Al-Anaam | الانتقال إلى زكاة الأنعام |
| `anaam-calculator-title` | Zakat Al-Anaam (Livestock) Calculator | حاسبة زكاة الأنعام |
| `anaam-helper-text` | Calculate the Zakat due on your grazing livestock based on established Shariah brackets and thresholds. | احسب الزكاة الواجبة في الأنعام السائمة وفق الأنصبة والمقادير الشرعية المعتمدة. |

---

### 2. Species Selection

| Key | English (`en`) | Arabic (`ar`) |
|:---|:---|:---|
| `anaam-species-label` | Select Livestock Category | اختر نوع الأنعام |
| `anaam-species-camels` | Camels (الإبل) | الإبل |
| `anaam-species-cattle` | Cattle & Buffalo (البقر) | البقر والجاموس |
| `anaam-species-sheep-goats` | Sheep & Goats (الغنم) | الغنم (الضأن والماعز) |
| `anaam-count-label` | Total Number of Animals | إجمالي عدد الرؤوس |
| `anaam-count-placeholder` | e.g., 40 | مثال: 40 |

---

### 3. Eligibility Checklist & Warnings

| Key | English (`en`) | Arabic (`ar`) |
|:---|:---|:---|
| `anaam-eligibility-title` | Shariah Conditions for Livestock Zakat | الشروط الشرعية لوجوب زكاة الأنعام |
| `anaam-cond-grazing` | Sa'imah (Grazing): Grazes freely on natural pastures for most of the year (> 6 months). | السائمة: أن ترعى في الكلأ المباح معظم الحول (أكثر من 6 أشهر). |
| `anaam-cond-nonworking` | Non-Working: Not used for farm labor, plowing, or transport. | غير عاملة: ألا تكون مستعملة في العمل أو الحرث أو الحمل. |
| `anaam-cond-hawl` | Hawl: Owned for one full Hijri (lunar) year above Nisab. | الحول: أن يمضي عليها عام هجري كامل وهي بالغة للنصاب. |
| `anaam-ineligible-stall-fed` | Stall-fed livestock fed purchased fodder are exempt from livestock Zakat. If held for trade, business Zakat (2.5% of market value) may apply. | الأنعام المعلوفة التي تُعلف معظم العام لا تجب فيها زكاة الأنعام، وإن كانت للتجارة فتُزكى زكاة عروض التجارة (2.5%). |
| `anaam-ineligible-working` | Working animals used for labor/plowing are exempt from Zakat. | الأنعام العاملة المستخدمة في الحرث أو السقي أو الركوب معفاة من الزكاة. |
| `anaam-ineligible-no-hawl` | Zakat is only due after a complete lunar year has passed while holding the Nisab. | لا تجب الزكاة إلا بعد مضي حول هجري كامل على ملك النصاب. |

---

### 4. Animal Fiqh Names & Descriptions

| Key | English (`en`) | Arabic (`ar`) |
|:---|:---|:---|
| `anaam-animal-shah` | Sheep / Goat (Shāh) | شاة (ضأن أو ماعز) |
| `anaam-animal-bint-makhad` | Bint Makhāḍ | بنت مخاض |
| `anaam-desc-bint-makhad` | 1-year-old female camel (in her 2nd year) | ناقة أنثى أتمت سنة ودخلت في الثانية |
| `anaam-animal-bint-labun` | Bint Labūn | بنت لبون |
| `anaam-desc-bint-labun` | 2-year-old female camel (in her 3rd year) | ناقة أنثى أتمت سنتين ودخلت في الثالثة |
| `anaam-animal-hiqqah` | Ḥiqqah | حِقّة |
| `anaam-desc-hiqqah` | 3-year-old female camel (in her 4th year) | ناقة أنثى أتمت 3 سنوات ودخلت في الرابعة |
| `anaam-animal-jadhaah` | Jadha'ah | جَذَعَة |
| `anaam-desc-jadhaah` | 4-year-old female camel (in her 5th year) | ناقة أنثى أتمت 4 سنوات ودخلت في الخامسة |
| `anaam-animal-tabi` | Tabī' / Tabī'ah | تبيع أو تبيعة |
| `anaam-desc-tabi` | 1-year-old calf entering 2nd year (male or female) | عجل أتم سنة ودخل في الثانية (ذكر أو أنثى) |
| `anaam-animal-musinnah` | Musinnah | مُسِنّة |
| `anaam-desc-musinnah` | 2-year-old cow entering 3rd year (female) | بقرة أنثى أتمت سنتين ودخلت في الثالثة |

---

### 5. Results & Disclaimers

| Key | English (`en`) | Arabic (`ar`) |
|:---|:---|:---|
| `anaam-result-title` | Zakat Al-Anaam Result | نتيجة زكاة الأنعام |
| `anaam-result-nisab` | Nisab for this category: | نصاب هذا النوع: |
| `anaam-result-eligible` | This herd has reached the Nisab and meets all Zakat conditions. | هذا القطيع بلغ النصاب وتوفرت فيه شروط وجوب الزكاة. |
| `anaam-result-not-eligible` | This herd has not reached the Nisab. No Zakat is due. | هذا العدد لم يبلغ النصاب الشرعي، ولا زكاة واجبة فيه. |
| `anaam-result-due` | Total Zakat Obligation Due: | مقدار الزكاة الواجب إخراجها: |
| `anaam-result-alternate` | Acceptable Alternative Combination: | خيار بديل جائز شرعاً: |
| `anaam-disclaimer` | Note: Results are based on mainstream Islamic jurisprudence. For mixed herds or partnership ownership (Khultah), please consult a qualified scholar. | تنبيه: الحسابات مبنية على الراجح من أقوال جمهور الفقهاء. في حالات الخلطة أو الأوضاع الخاصة يُرجى استشارة أهل العلم. |
