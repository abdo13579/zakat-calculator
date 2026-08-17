# Contract: External Public APIs

**Consumers**: `src/services/api.js` (ported 1:1 from legacy `js/api.js`) and `MalView`.
Constitution constraints: keyless, CORS-enabled, and these are the ONLY permitted outbound
requests (Principles II, IV, V).

## Endpoint 1 — Currency exchange rates

- **URL**: `https://open.er-api.com/v6/latest/USD` (GET, no key)
- **Fields used**: `data.rates` (map: currency code → units per 1 USD),
  `data.time_last_update_unix` (informational timestamp)
- **Returns**: `{ rates, timestamp }` on success; **`null` on any failure** (network error,
  non-OK status, malformed body) with the error logged to console

## Endpoint 2 — Gold price

- **URL**: `https://mintedmetal.com/api/prices.json` (GET, no key)
- **Fields used**: `data.metals.gold.price` (price per **ounce**, USD),
  `data.updatedAt` (informational timestamp)
- **Conversion**: `pricePerGram = pricePerOunce ÷ 31.1035` (constant fixed by Principle I)
- **Returns**: `{ price: <per-gram USD>, timestamp }` on success; **`null` on any failure**

## Consumer obligations (Principle IV)

- Callers MUST treat `null` as the failure signal and drive the MarketData lifecycle
  (`loading → error`) — see [../data-model.md](../data-model.md).
- Callers MUST show a loading state while either request is in flight.
- No result may be rendered for Zakat Al-Mal unless BOTH calls succeeded for the current
  calculation run (never reuse stale values silently).
- Fetches are triggered on calculation demand; nothing is fetched on app load except what the
  legacy app fetched (currency options for the dropdown — preserve legacy behavior).
