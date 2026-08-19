// External API service — verbatim port of legacy `js/api.js`.
// Contracts: see specs/002-react-migration/contracts/external-apis.md
// Both functions return `null` on any failure (null-on-failure contract).

import { GRAMS_PER_TROY_OUNCE } from '../domain/mal.js';

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

export async function getCurrencyRates() {
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
        return null; // null-on-failure contract
    }
}

export async function getGoldPrice() {
    try {
        const response = await fetchWithTimeout('https://mintedmetal.com/api/prices.json');
        if (!response.ok) {
            throw new Error('Failed to fetch gold price.');
        }
        const data = await response.json();
        const pricePerOunce = data?.metals?.gold?.price;
        if (typeof pricePerOunce !== 'number' || !Number.isFinite(pricePerOunce)) {
            return null;
        }
        const pricePerGram = pricePerOunce / GRAMS_PER_TROY_OUNCE; // ounces → grams
        return {
            price: pricePerGram,
            timestamp: data.updatedAt ? new Date(data.updatedAt).getTime() || null : null,
        };
    } catch (error) {
        console.error("Gold API Error:", error);
        return null;
    }
}
