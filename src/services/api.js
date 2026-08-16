// External API service — verbatim port of legacy `js/api.js`.
// Contracts: see specs/002-react-migration/contracts/external-apis.md
// Both functions return `null` on any failure (null-on-failure contract).

export async function getCurrencyRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
            throw new Error('Failed to fetch currency rates.');
        }
        const data = await response.json();
        return {
            rates: data.rates,
            timestamp: data.time_last_update_unix || null,
        };
    } catch (error) {
        console.error("Currency API Error:", error);
        return null; // null-on-failure contract
    }
}

export async function getGoldPrice() {
    try {
        const response = await fetch('https://mintedmetal.com/api/prices.json');
        if (!response.ok) {
            throw new Error('Failed to fetch gold price.');
        }
        const data = await response.json();
        const pricePerOunce = data.metals.gold.price;
        const pricePerGram = pricePerOunce / 31.1035; // ounces → grams
        return {
            price: pricePerGram,
            timestamp: new Date(data.updatedAt).getTime() || null,
        };
    } catch (error) {
        console.error("Gold API Error:", error);
        return null;
    }
}
