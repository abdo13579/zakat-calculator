# ZakatCalc

A modern, bilingual web application that helps Muslims calculate **Zakat Al-Fitr**, **Zakat Al-Mal** (wealth Zakat), and **Zakat Al-Zuru** (agriculture Zakat) accurately using real-time gold prices, currency exchange rates, and Islamic jurisprudence.

**[→ Live version](https://zakacalc.netlify.app/)**

![ZakaCalc homepage](img.png)

---

## Overview

ZakaCalc provides a simple and trustworthy way to fulfill the Islamic obligation of Zakat. The app supports **English** and **Arabic** (with full RTL layout), works offline for Zakat Al-Fitr, and uses live financial data for Zakat Al-Mal so Nisaab and amounts stay up to date.

---

## Features

### Calculators

- **Zakat Al-Fitr** — Calculate the amount due based on:
  - **3.0 kg** of staple food per person (fixed weight)
  - Local food price per kilogram
  - Number of individuals in the household
  - Multiple currencies (USD, EUR, GBP, SAR, EGP, AED, KWD, TRY, IDR, PKR)
  - No API needed

- **Zakat Al-Mal** — Check if your wealth meets the Nisaab and compute Zakat:
  - Nisaab based on **85 grams of gold** at current market price
  - **2.5%** Zakat on total liquid wealth when above Nisaab
  - Real-time gold price and exchange rates

- **Zakat Al-Zuru** — Calculate Zakat on agricultural produce:
  - Nisaab of **600 kg** of harvest weight
  - Rates: rainfed (10%), irrigated (5%), mixed (7.5%)
  - No API needed

### User experience

- **Bilingual**: English and Arabic with one-click language toggle; Arabic uses RTL layout
- **Dark mode**: Theme toggle with preference saved in `localStorage`
- **Responsive**: Desktop and mobile; hamburger menu and sidebar on small screens
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard-friendly controls
- **Copy results**: Copy calculation results to the clipboard
- **Clear feedback**: Loading states, error messages, and success notifications

---

## How the calculations work

### Zakat Al-Fitr

- **Total weight** = Number of individuals × 3.0 kg
- **Total value** = Total weight × Food price per kilogram
- Result is shown in the selected currency (no API needed).

### Zakat Al-Mal

- **Nisaab** = 85 grams × current gold price per gram (USD), then converted to selected currency via live exchange rate.
- If **wealth ≥ Nisaab**: **Zakat due** = Wealth × 2.5% (0.025).
- If **wealth < Nisaab**: No Zakat is due.

### Zakat Al-Zuru

- **Nisaab** = 600 kg harvest weight.
- If **weight ≥ Nisaab**: **Zakat due** = Weight × Rate (0.10 / 0.05 / 0.075 depending on irrigation).
- If **weight < Nisaab**: No Zakat is due.

No API needed for this calculator.

Gold price and exchange rates are fetched when you run the calculation so Nisaab and Zakat amounts reflect current markets.

---

## Tech stack

- **HTML5** — Semantic structure, `data-i18n` for translations
- **CSS3** — Custom properties (light/dark), Flexbox/Grid, responsive layout, IBM Plex Sans Arabic font
- **Vanilla JavaScript (ES6)** — No frameworks; modular `api.js` and `app.js`
- **Font Awesome 6** — Icons
- **External APIs** (see below)

---

## APIs used

| Purpose              | API | Notes |
|----------------------|-----|--------|
| Currency exchange    | [open.er-api.com/v6/latest/USD](https://open.er-api.com/v6/latest/USD) | USD-based rates for conversion |
| Gold price           | [mintedmetal.com/api/prices.json](https://mintedmetal.com/api/prices.json) | Price per ounce, converted to per gram (÷ 31.1035) |

No API keys are required; the app uses these public endpoints when you use the Zakat Al-Mal calculator (and for loading currency options).

---

## Project structure

```
zakacalc/
├── index.html          # Single-page app: landing, Fitr, Mal, Zuru, About
├── favicon.svg         # App icon
├── img.png             # Screenshot for README
├── css/
│   └── style.css       # Global styles, theme variables, layout, components
├── js/
│   ├── api.js          # getCurrencyRates(), getGoldPrice()
│   └── app.js          # i18n, theme, navigation, form handling, all calculators
└── README.md
```

---

## Getting started

### Prerequisites

- A modern browser (Chrome, Firefox, Safari, Edge)
- For Zakat Al-Mal: internet connection (to load rates and gold price)

### Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/zakacalc.git
   cd zakacalc
   ```
2. Open `index.html` in your browser (e.g. double-click or `open index.html`).
3. No build step or server is required.

### Deploy

The app is static. You can deploy the folder to any static host (e.g. Netlify, Vercel, GitHub Pages) by serving the project root; the live site is hosted on [Netlify](https://zakacalc.netlify.app/).

---

## Usage summary

1. **Home** — Choose a calculator from the landing cards.
2. **Zakat Al-Fitr** — Enter food price per kg, currency, and number of people → **Calculate**.
3. **Zakat Al-Mal** — Enter total liquid wealth and currency → **Calculate** (app fetches gold price and rates).
4. **Zakat Al-Zuru** — Enter harvest weight (kg) and select irrigation type → **Calculate**.
5. Use **Copy** on any result; switch **language** or **theme** via the header.

---

## Disclaimer

This tool is for **informational purposes only** and is not a substitute for guidance from a qualified Islamic scholar. Calculations are based on common methods (85g gold Nisaab, 2.5% rate, and standard Zakat Al-Fitr weights). For personal rulings and edge cases, please consult your local Imam or scholar.

---

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature-or-fix-name`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push: `git push origin feature-or-fix-name`.
5. Open a Pull Request.

---

## Contact

For questions or suggestions, please open an issue in the repository or contact the maintainer.
