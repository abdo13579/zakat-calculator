import { describe, expect, it } from 'vitest';
import { calculateZuru } from '../zuru.js';

describe('calculateZuru — contract vectors', () => {
    it('599.99 kg rainfed → not eligible, due 0', () => {
        const r = calculateZuru({ weightKg: 599.99, irrigation: 'rainfed' });
        expect(r.eligible).toBe(false);
        expect(r.rate).toBe(0.10);
        expect(r.zakatDue).toBe(0);
    });

    it('600 kg rainfed (boundary) → eligible, due 60', () => {
        const r = calculateZuru({ weightKg: 600, irrigation: 'rainfed' });
        expect(r.eligible).toBe(true);
        expect(r.rate).toBe(0.10);
        expect(r.zakatDue).toBe(60);
    });

    it('1000 kg irrigated → due 50 (0.05 rate)', () => {
        const r = calculateZuru({ weightKg: 1000, irrigation: 'irrigated' });
        expect(r.eligible).toBe(true);
        expect(r.rate).toBe(0.05);
        expect(r.zakatDue).toBe(50);
    });

    it('1000 kg mixed → due 75 (0.075 rate)', () => {
        const r = calculateZuru({ weightKg: 1000, irrigation: 'mixed' });
        expect(r.eligible).toBe(true);
        expect(r.rate).toBe(0.075);
        expect(r.zakatDue).toBe(75);
    });

    it('returns null for unknown irrigation enum', () => {
        expect(calculateZuru({ weightKg: 1000, irrigation: 'foo' })).toBeNull();
    });

    it('returns null for inherited properties like toString', () => {
        expect(calculateZuru({ weightKg: 1000, irrigation: 'toString' })).toBeNull();
    });

    it('returns null for negative weight', () => {
        expect(calculateZuru({ weightKg: -10, irrigation: 'rainfed' })).toBeNull();
    });

    it('returns null for NaN weight', () => {
        expect(calculateZuru({ weightKg: NaN, irrigation: 'rainfed' })).toBeNull();
    });
});
