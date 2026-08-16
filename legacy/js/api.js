const API = {
    async getCurrencyRates() {
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
            return null; // Return null to indicate failure
        }
    },

    async getGoldPrice() {
        try {
            // Using a CORS-enabled public endpoint that provides gold price data
            const response = await fetch('https://mintedmetal.com/api/prices.json');
            if (!response.ok) {
                throw new Error('Failed to fetch gold price.');
            }
            const data = await response.json();
            // The price is for an ounce, convert to per gram
            const pricePerOunce = data.metals.gold.price;
            const pricePerGram = pricePerOunce / 31.1035; // Ounces to grams conversion
            return {
                price: pricePerGram,
                timestamp: new Date(data.updatedAt).getTime() || null,
            };
        } catch (error) {
            console.error("Gold API Error:", error);
            return null; // Return null to indicate failure
        }
    }
};
