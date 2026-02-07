# ZakaCalc

A modern, bilingual web application that helps Muslims calculate **Zakat Al-Mal** (wealth Zakat) and **Zakat Al-Fitr** (charity of breaking the fast) accurately using real-time gold prices and currency exchange rates.

**[→ Live version](https://zakacalc.netlify.app/)**

![ZakaCalc homepage](img.png)

---

## Overview

ZakaCalc provides a simple and trustworthy way to fulfill the Islamic obligation of Zakat. The app supports **English** and **Arabic** (with full RTL layout), works offline for Zakat Al-Fitr, and uses live financial data for Zakat Al-Mal so Nisaab and amounts stay up to date.

---

## Features

### Calculators

- **Zakat Al-Fitr** — Calculate the amount due based on:
  - Local food price per kilogram
  - Number of individuals in the household
  - Food type: Rice (2.0 kg), Wheat (2.5 kg), Dates (3.0 kg), Raisins (1.625 kg), or Corn (2.0 kg) per person
  - Multiple currencies (USD, EUR, GBP, SAR, EGP, AED, KWD, TRY, IDR, PKR)

- **Zakat Al-Mal** — Check if your wealth meets the Nisaab and compute Zakat:
  - Nisaab based on **85 grams of gold** at current market price
  - **2.5%** Zakat on total liquid wealth when above Nisaab
  - Real-time gold price and exchange rates
  - Same currency options as above

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

- **Total weight** = Number of individuals × Food weight per person (by chosen type)
- **Total value** = Total weight × Food price per kilogram  
- Result is shown in the selected currency (no API needed for this calculator).

### Zakat Al-Mal

- **Nisaab** = 85 grams × current gold price per gram (USD), then converted to selected currency via live exchange rate.
- If **wealth ≥ Nisaab**: **Zakat due** = Wealth × 2.5% (0.025).
- If **wealth < Nisaab**: No Zakat is due.

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
| Gold price           | [data-asg.goldprice.org/dbXRates/USD](https://data-asg.goldprice.org/dbXRates/USD) | Price per ounce, converted to per gram (÷ 31.1035) |

No API keys are required; the app uses these public endpoints when you use the Zakat Al-Mal calculator (and for loading currency options).

---

## Project structure

```
zakacalc/
├── index.html          # Single-page app: landing, Zakat Al-Fitr, Zakat Al-Mal, About
├── favicon.svg         # App icon
├── img.png             # Screenshot for README
├── css/
│   └── style.css       # Global styles, theme variables, layout, components
├── js/
│   ├── api.js          # getCurrencyRates(), getGoldPrice()
│   └── app.js          # i18n, theme, navigation, form handling, both calculators
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

1. **Home** — Choose “Zakat Al-Fitr” or “Zakat Al-Mal.”
2. **Zakat Al-Fitr** — Enter price per kg, currency, number of people, and food type → **Calculate**.
3. **Zakat Al-Mal** — Enter total liquid wealth and currency → **Calculate** (app fetches gold price and rates).
4. Use **Copy** on the result if needed; switch **language** or **theme** via the header.

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
