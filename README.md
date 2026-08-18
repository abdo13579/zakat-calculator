# ZakatCalc

A modern, bilingual web application that helps Muslims calculate **Zakat Al-Fitr**, **Zakat Al-Mal** (wealth Zakat), **Zakat Al-Zuru** (agriculture Zakat), and **Zakat Al-Anaam** (livestock Zakat) accurately using real-time gold prices, currency exchange rates, and Islamic jurisprudence.

**[→ Live Application](https://abdo13579.github.io/zakat-calculator/)** | **[→ Calculation Methodology & Shariah Rules](CALCULATIONS.md)**

![ZakatCalc homepage](public/img.png)

---

## Overview

ZakatCalc provides an intuitive, trustworthy, and privacy-first way to fulfill the Islamic obligation of Zakat. The application supports **English** and **Arabic** (with full RTL layout), operates offline for non-market calculators, ensures a sticky viewport layout, and uses live financial data for Zakat Al-Mal to keep Nisaab thresholds current.

---

## Features

### Supported Calculators

- **Zakat Al-Fitr** — Calculate the fast-breaking Zakat due before Eid:
  - **3.0 kg** of staple food per person (fixed weight)
  - Local food price per kilogram
  - Number of individuals in the household
  - Multiple global and regional currencies (USD, EUR, GBP, SAR, EGP, AED, KWD, TRY, IDR, PKR, etc.)
  - 100% offline capable

- **Zakat Al-Mal** — Check if liquid wealth meets the Nisaab and compute obligation:
  - Nisaab based on **85 grams of 24k gold** at current market spot price
  - **2.5%** rate on total liquid wealth when at or above Nisaab
  - Real-time gold price and currency exchange rates with graceful offline degradation

- **Zakat Al-Zuru** — Calculate Zakat on agricultural crops and fruit produce:
  - Nisaab of **600 kg** of harvest weight (5 Wasqs)
  - Jurisprudential rates: rainfed (10%), irrigated (5%), mixed (7.5%)
  - Due at harvest time (no 1-year Hawl required)
  - 100% offline capable

- **Zakat Al-Anaam** — Calculate Zakat on grazing livestock:
  - **Camels** (*Ibil* / الإبل): Nisab of 5 camels (Shah, Bint Makhad, Bint Labun, Hiqqah, Jadha'ah, and $> 120$ integer decomposition)
  - **Cattle & Buffalo** (*Baqar* / البقر): Nisab of 30 cattle (Tabi', Musinnah, and $\ge 130$ integer decomposition)
  - **Sheep & Goats** (*Ghanam* / الغنم): Nisab of 40 animals (Shah)
  - Interactive Shariah eligibility checklist (Sa'imah grazing pasture, non-working, 1-year Hawl) with diagnostic feedback
  - Interactive reference schedule tables and fiqh age descriptions
  - 100% offline capable

### User Experience & Design

- **Bilingual & RTL**: Seamless toggle between English and Arabic with automated text direction (`dir="ltr"` / `dir="rtl"`) and typography via IBM Plex Sans Arabic.
- **Theme Support**: Dark and light modes with smooth transitions and persistent user preference in `localStorage`.
- **Responsive & Accessible**: Fully fluid layout from mobile devices to large desktop screens, semantic HTML5 landmarks, ARIA labels, and complete keyboard operability.
- **Sticky Footer**: Robust viewport layout ensuring the footer stays pinned to the bottom on short pages and flows naturally with longer content.
- **Copy & Feedback**: One-click copy of detailed calculation results to clipboard with accessible toast notifications.
- **Zero-Telemetry Privacy**: 100% client-side computation. No user financial, household, or herd data is ever transmitted or stored on any server.

---

## How Calculations Work

For the complete jurisprudential formulas, edge cases, and worked examples, see **[CALCULATIONS.md](CALCULATIONS.md)**.

### Summary Table

| Calculator | Nisab Threshold | Hawl Required? | Applied Rate / Obligation | Live API Required? |
|:---|:---|:---:|:---|:---:|
| **Zakat Al-Fitr** | 1 person | No | $3.0\text{ kg} \times \text{Persons} \times \text{Price/kg}$ | No |
| **Zakat Al-Mal** | 85g gold value | Yes (1 year) | $2.5\%$ on total liquid wealth | Yes (Gold & FX) |
| **Zakat Al-Zuru** | 600 kg harvest | No (at harvest) | $10\%$ (Rainfed) / $5\%$ (Irrigated) / $7.5\%$ (Mixed) | No |
| **Zakat Al-Anaam** | 5 camels / 30 cattle / 40 sheep | Yes (1 year) | Specific animal ages per fiqh brackets | No |

---

## Tech Stack

- **Framework & Core**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: Vanilla CSS Modules + CSS Custom Properties Design Tokens
- **Testing**: [Vitest 1.6](https://vitest.dev/) (pure domain calculation test suites)
- **Typography & Icons**: IBM Plex Sans Arabic (Google Fonts), Font Awesome 6 (CDN)
- **APIs**: Keyless, CORS-enabled public price/rate endpoints

---

## APIs Used

| Purpose | API Endpoint | Notes |
|:---|:---|:---|
| **Currency Exchange** | [`https://open.er-api.com/v6/latest/USD`](https://open.er-api.com/v6/latest/USD) | USD-based real-time conversion rates |
| **Gold Price** | [`https://mintedmetal.com/api/prices.json`](https://mintedmetal.com/api/prices.json) | Price per troy ounce, converted to per gram ($\div 31.1035$) |

No API keys are required. Outbound network requests are limited strictly to these two public endpoints when using Zakat Al-Mal.

---

## Project Structure

```text
zakat-calculator/
├── index.html                  # Vite HTML entry point (fonts & icons)
├── vite.config.js              # Vite configuration (base: '/zakat-calculator/')
├── package.json                # Dependencies & scripts
├── public/                     # Static public assets
│   ├── favicon.svg             # App SVG icon
│   └── img.png                 # App preview banner
├── src/
│   ├── main.jsx                # Application root entry point
│   ├── App.jsx                 # Main layout & view router
│   ├── components/             # Reusable UI components
│   │   ├── Header.jsx          # Top navigation bar, language & theme toggles
│   │   ├── Header.module.css
│   │   ├── Sidebar.jsx         # Mobile drawer navigation menu
│   │   ├── Sidebar.module.css
│   │   ├── Footer.jsx          # Sticky application footer
│   │   ├── Footer.module.css
│   │   ├── ResultCard.jsx      # Result card with copy-to-clipboard action
│   │   └── ResultCard.module.css
│   ├── domain/                 # Pure mathematical domain modules (zero I/O)
│   │   ├── fitr.js             # Zakat Al-Fitr calculation logic
│   │   ├── mal.js              # Zakat Al-Mal calculation logic
│   │   ├── zuru.js             # Zakat Al-Zuru calculation logic
│   │   ├── anaam.js            # Zakat Al-Anaam calculation & eligibility logic
│   │   └── __tests__/          # Vitest unit test suites
│   │       ├── fitr.test.js
│   │       ├── mal.test.js
│   │       ├── zuru.test.js
│   │       └── anaam.test.js
│   ├── i18n/                   # Internationalization
│   │   ├── I18nContext.jsx     # Language context, translation hook, RTL sync
│   │   ├── translations.js     # English and Arabic translation catalogs
│   │   └── __tests__/          # Translation catalog parity tests
│   │       └── translations.test.js
│   ├── services/
│   │   └── api.js              # Fetch services for gold price and exchange rates
│   ├── styles/                 # Global design system
│   │   ├── tokens.css          # Semantic CSS custom properties & color scales
│   │   └── global.css          # Layout resets, typography, and utility classes
│   ├── theme/                  # Theme state management
│   │   └── ThemeContext.jsx    # Dark/light mode context & localStorage sync
│   ├── toast/                  # Feedback toast notifications
│   │   ├── ToastContext.jsx
│   │   └── Toast.module.css
│   ├── utils/                  # Formatting & helper utilities
│   │   ├── currency.js         # Currency detection & list formatting
│   │   └── format.js           # Number formatting & input sanitization
│   └── views/                  # Calculator view pages
│       ├── LandingView.jsx     # Home view with calculator cards
│       ├── LandingView.module.css
│       ├── FitrView.jsx        # Zakat Al-Fitr calculator view
│       ├── MalView.jsx         # Zakat Al-Mal calculator view
│       ├── ZuruView.jsx        # Zakat Al-Zuru calculator view
│       ├── AnaamView.jsx       # Zakat Al-Anaam calculator view
│       ├── AnaamView.module.css
│       ├── AboutView.jsx       # Methodology & developer info view
│       └── AboutView.module.css
├── specs/                      # Feature specifications and design contracts
├── CALCULATIONS.md             # Detailed mathematical & Shariah calculation guide
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js**: LTS version (18.x or higher)
- **Package Manager**: npm, yarn, or pnpm
- **Browser**: Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/abdo13579/zakat-calculator.git
cd zakat-calculator

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The Vite dev server will start at `http://localhost:5173/zakat-calculator/` (or next free port).

### Running Tests

```bash
npm test
```

Runs the automated Vitest test suite covering all pure domain calculation functions and i18n catalog parity.

### Building for Production

```bash
npm run build
```

Generates optimized static assets in the `dist/` directory ready for deployment on any static hosting provider.

### Previewing Production Build

```bash
npm run preview
```

Serves the production bundle locally at `http://localhost:4173/zakat-calculator/`.

---

## Deployment

ZakatCalc is a static Single-Page Application (SPA) with zero server dependencies. To deploy to GitHub Pages:

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

---

## Contributing

Contributions are welcome! This project follows a specification-driven development workflow powered by **Spec-Kit**:

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature-name`.
2. Use **Spec-Kit** workflows to design and execute your feature:
   - Run `/speckit-specify` to define the functional specification in `specs/`.
   - Run `/speckit-plan` to generate the implementation plan and architecture contracts.
   - Run `/speckit-tasks` to produce a dependency-ordered task breakdown.
   - Run `/speckit-implement` to execute and verify the tasks.
3. Ensure all changes adhere strictly to the project constitution in [`.specify/memory/constitution.md`](.specify/memory/constitution.md).
4. Add or update Vitest unit tests in `src/domain/__tests__/` and verify that `npm test` and `npm run build` pass with zero errors.
5. Commit your changes and open a Pull Request.

---

## License & Author

Created by **Abdulrahman Alhaytham** — [GitHub](https://github.com/abdo13579) · [LinkedIn](https://www.linkedin.com/in/abdoalhythm/).
Released under the MIT License.
