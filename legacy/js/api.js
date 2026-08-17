const DEFAULT_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

const API = {
    async getCurrencyRates() {
        try {
            const response = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD');
            if (!response.ok) {
                throw new Error('Failed to fetch currency rates.');
            }
            const data = await response.json();
            if (!data || typeof data.rates !== 'object' || data.rates === null) {
                return null;
            }
            return {
                rates: data.rates,
                timestamp: data.time_last_update_unix || null,
            };
        } catch (error) {
            console.error("Currency API Error:", error);
            return null; // Return null to indicate failure
        }
    },

    async getGoldPrice() {
        try {
            // Using a CORS-enabled public endpoint that provides gold price data
            const response = await fetchWithTimeout('https://mintedmetal.com/api/prices.json');
            if (!response.ok) {
                throw new Error('Failed to fetch gold price.');
            }
            const data = await response.json();
            // The price is for an ounce, convert to per gram
            const pricePerOunce = data?.metals?.gold?.price;
            if (typeof pricePerOunce !== 'number' || !Number.isFinite(pricePerOunce)) {
                return null;
            }
            const pricePerGram = pricePerOunce / 31.1035; // Ounces to grams conversion
            return {
                price: pricePerGram,
                timestamp: data.updatedAt ? new Date(data.updatedAt).getTime() || null : null,
            };
        } catch (error) {
            console.error("Gold API Error:", error);
            return null; // Return null to indicate failure
        }
    }
};
