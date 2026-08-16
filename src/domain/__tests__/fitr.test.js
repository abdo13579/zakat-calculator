import { describe, expect, it } from 'vitest';
import { calculateFitr } from '../fitr.js';

describe('calculateFitr — contract vectors', () => {
    it('4 persons × 15/kg → weight 12 kg, value 180', () => {
        expect(calculateFitr({ persons: 4, pricePerKg: 15 })).toEqual({
            totalWeightKg: 12,
            totalValue: 180,
        });
    });

    it('1 person × 0/kg → weight 3 kg, value 0', () => {
        expect(calculateFitr({ persons: 1, pricePerKg: 0 })).toEqual({
            totalWeightKg: 3,
            totalValue: 0,
        });
    });

    it('returns null for non-numeric persons', () => {
        expect(calculateFitr({ persons: NaN, pricePerKg: 15 })).toBeNull();
    });

    it('returns null for non-numeric pricePerKg', () => {
        expect(calculateFitr({ persons: 4, pricePerKg: NaN })).toBeNull();
    });

    it('returns null for persons < 1', () => {
        expect(calculateFitr({ persons: 0, pricePerKg: 15 })).toBeNull();
    });

    it('returns null for negative pricePerKg', () => {
        expect(calculateFitr({ persons: 4, pricePerKg: -1 })).toBeNull();
    });
});
