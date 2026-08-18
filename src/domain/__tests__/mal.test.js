import { describe, expect, it } from 'vitest';
import { calculateMal, calculateMalMulti } from '../mal.js';

describe('calculateMal — contract vectors', () => {
    it('wealth 10000, gold 70/g, rate 1 → nisaab 5950, eligible, due 250', () => {
        expect(calculateMal({ wealth: 10000, goldPricePerGramUsd: 70, exchangeRate: 1 })).toEqual({
            nisaab: 5950,
            eligible: true,
            zakatDue: 250,
        });
    });

    it('wealth 5950 (boundary), gold 70/g, rate 1 → nisaab 5950, eligible, due 148.75', () => {
        const r = calculateMal({ wealth: 5950, goldPricePerGramUsd: 70, exchangeRate: 1 });
        expect(r.eligible).toBe(true);
        expect(r.nisaab).toBe(5950);
        // 5950 × 0.025 = 148.75
        expect(r.zakatDue).toBeCloseTo(148.75, 2);
    });

    it('wealth 5949.99 (just below Nisaab) → not eligible, due 0', () => {
        const r = calculateMal({ wealth: 5949.99, goldPricePerGramUsd: 70, exchangeRate: 1 });
        expect(r.eligible).toBe(false);
        expect(r.zakatDue).toBe(0);
    });

    it('wealth 50000, gold 70/g, rate 3.25 → nisaab 19337.50, eligible, due 1250', () => {
        const r = calculateMal({ wealth: 50000, goldPricePerGramUsd: 70, exchangeRate: 3.25 });
        // 85 × 70 × 3.25 = 19337.50
        expect(r.nisaab).toBeCloseTo(19337.5, 2);
        expect(r.eligible).toBe(true);
        // 50000 × 0.025 = 1250
        expect(r.zakatDue).toBeCloseTo(1250, 2);
    });

    it('returns null for negative wealth', () => {
        expect(calculateMal({ wealth: -1, goldPricePerGramUsd: 70, exchangeRate: 1 })).toBeNull();
    });

    it('returns null for non-numeric wealth', () => {
        expect(calculateMal({ wealth: NaN, goldPricePerGramUsd: 70, exchangeRate: 1 })).toBeNull();
    });

    it('returns null for goldPricePerGramUsd <= 0', () => {
        expect(calculateMal({ wealth: 10000, goldPricePerGramUsd: 0, exchangeRate: 1 })).toBeNull();
    });

    it('returns null for exchangeRate <= 0', () => {
        expect(calculateMal({ wealth: 10000, goldPricePerGramUsd: 70, exchangeRate: 0 })).toBeNull();
    });
});

describe('calculateMalMulti — success cases', () => {
    it('Single entry, eligible (parity with calculateMal)', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 10000, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: true,
            totalUsd: 10000,
            nisabUsd: 5950,
            eligible: true,
            zakatDueUsd: 250,
            perCurrency: [{ currency: 'USD', amount: 10000, amountUsd: 10000 }],
            resultCurrency: 'USD'
        });
    });

    it('Two different currencies', () => {
        const res = calculateMalMulti({
            entries: [
                { amount: 10, currency: 'USD' },
                { amount: 10, currency: 'EGP' }
            ],
            goldPricePerGramUsd: 70,
            rates: { USD: 1, EGP: 48 }
        });
        expect(res.ok).toBe(true);
        expect(res.totalUsd).toBeCloseTo(10 + 10 / 48, 4);
        expect(res.nisabUsd).toBe(5950);
        expect(res.eligible).toBe(false);
        expect(res.zakatDueUsd).toBe(0);
        expect(res.resultCurrency).toBe('USD');
        expect(res.perCurrency).toHaveLength(2);
    });

    it('Same-currency merge', () => {
        const res = calculateMalMulti({
            entries: [
                { amount: 50, currency: 'USD' },
                { amount: 30, currency: 'USD' }
            ],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: true,
            totalUsd: 80,
            nisabUsd: 5950,
            eligible: false,
            zakatDueUsd: 0,
            perCurrency: [{ currency: 'USD', amount: 80, amountUsd: 80 }],
            resultCurrency: 'USD'
        });
    });

    it('Zero amount valid', () => {
        const res = calculateMalMulti({
            entries: [
                { amount: 0, currency: 'USD' },
                { amount: 100, currency: 'USD' }
            ],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res.ok).toBe(true);
        expect(res.totalUsd).toBe(100);
    });

    it('Below nisab', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 1000, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res.ok).toBe(true);
        expect(res.eligible).toBe(false);
        expect(res.zakatDueUsd).toBe(0);
    });

    it('Boundary at nisab', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 5950, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res.ok).toBe(true);
        expect(res.eligible).toBe(true);
        expect(res.zakatDueUsd).toBeCloseTo(148.75, 2);
    });

    it('Multi-row EGP/SAR/USD mix', () => {
        const res = calculateMalMulti({
            entries: [
                { amount: 1000, currency: 'EGP' },
                { amount: 500, currency: 'SAR' },
                { amount: 200, currency: 'USD' }
            ],
            goldPricePerGramUsd: 70,
            rates: { USD: 1, EGP: 48, SAR: 3.75 }
        });
        expect(res.ok).toBe(true);
        const expectedTotalUsd = 1000 / 48 + 500 / 3.75 + 200;
        expect(res.totalUsd).toBeCloseTo(expectedTotalUsd, 2);
        expect(res.eligible).toBe(false);
        expect(res.nisabUsd).toBe(5950);
    });
});

describe('calculateMalMulti — failure cases', () => {
    it('Missing rate', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 100, currency: 'XYZ' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: 0, currency: 'XYZ', key: 'error-currency-rate' }]
        });
    });

    it('Negative amount', () => {
        const res = calculateMalMulti({
            entries: [{ amount: -5, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: 0, currency: 'USD', key: 'error-invalid-wealth' }]
        });
    });

    it('Non-finite amount', () => {
        const res = calculateMalMulti({
            entries: [{ amount: NaN, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: 0, currency: 'USD', key: 'error-invalid-wealth' }]
        });
    });

    it('Empty entries', () => {
        const res = calculateMalMulti({
            entries: [],
            goldPricePerGramUsd: 70,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-invalid-wealth' }]
        });
    });

    it('Invalid gold', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 1000, currency: 'USD' }],
            goldPricePerGramUsd: 0,
            rates: { USD: 1 }
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-api-failed' }]
        });
    });

    it('Invalid rates', () => {
        const res = calculateMalMulti({
            entries: [{ amount: 1000, currency: 'USD' }],
            goldPricePerGramUsd: 70,
            rates: null
        });
        expect(res).toEqual({
            ok: false,
            errors: [{ index: -1, currency: '', key: 'error-api-failed' }]
        });
    });
});

