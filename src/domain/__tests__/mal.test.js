import { describe, expect, it } from 'vitest';
import { calculateMal } from '../mal.js';

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
