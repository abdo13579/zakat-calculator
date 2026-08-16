import { describe, expect, it } from 'vitest';
import { translations } from '../translations.js';

function sortedKeys(obj) {
    return Object.keys(obj).sort();
}

describe('translation catalog parity', () => {
    it('exports both en and ar catalogs at the same shape', () => {
        expect(translations).toBeTypeOf('object');
        expect(translations.en).toBeTypeOf('object');
        expect(translations.ar).toBeTypeOf('object');
    });

    it('en and ar have exactly the same key sets (parity rule)', () => {
        const enKeys = sortedKeys(translations.en);
        const arKeys = sortedKeys(translations.ar);
        expect(arKeys).toEqual(enKeys);
    });

    it('every key has a non-empty string value in both languages', () => {
        for (const k of Object.keys(translations.en)) {
            expect(translations.en[k], `en[${k}]`).toBeTypeOf('string');
            expect(translations.en[k].length).toBeGreaterThan(0);
            expect(translations.ar[k], `ar[${k}]`).toBeTypeOf('string');
            expect(translations.ar[k].length).toBeGreaterThan(0);
        }
    });

    it('has at least the legacy baseline key count (≥ 70 to cover ~59 static + dynamic)', () => {
        const count = Object.keys(translations.en).length;
        expect(count).toBeGreaterThanOrEqual(70);
    });
});
