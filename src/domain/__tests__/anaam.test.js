import { describe, expect, it } from 'vitest';
import {
    LIVESTOCK_SPECIES,
    NISAB_THRESHOLDS,
    calculateAnaam,
    calculateCamels,
    calculateCattle,
    calculateSheepGoats,
    evaluateEligibility,
} from '../anaam.js';

describe('Zakat Al-Anaam Domain Logic', () => {
    describe('Constants and Thresholds', () => {
        it('exports correct species enums and Nisab values', () => {
            expect(LIVESTOCK_SPECIES.CAMELS).toBe('camels');
            expect(LIVESTOCK_SPECIES.CATTLE).toBe('cattle');
            expect(LIVESTOCK_SPECIES.SHEEP_GOATS).toBe('sheep_goats');

            expect(NISAB_THRESHOLDS[LIVESTOCK_SPECIES.CAMELS]).toBe(5);
            expect(NISAB_THRESHOLDS[LIVESTOCK_SPECIES.CATTLE]).toBe(30);
            expect(NISAB_THRESHOLDS[LIVESTOCK_SPECIES.SHEEP_GOATS]).toBe(40);
        });
    });

    describe('Eligibility Evaluation', () => {
        it('returns eligible when all conditions are true or default', () => {
            expect(evaluateEligibility()).toEqual({ isEligible: true, reasonKey: null });
            expect(
                evaluateEligibility({ isGrazing: true, isNonWorking: true, heldForHawl: true })
            ).toEqual({ isEligible: true, reasonKey: null });
        });

        it('returns stall-fed reason when not grazing', () => {
            const res = evaluateEligibility({ isGrazing: false, isNonWorking: true, heldForHawl: true });
            expect(res.isEligible).toBe(false);
            expect(res.reasonKey).toBe('anaam-ineligible-stall-fed');
        });

        it('returns working reason when working', () => {
            const res = evaluateEligibility({ isGrazing: true, isNonWorking: false, heldForHawl: true });
            expect(res.isEligible).toBe(false);
            expect(res.reasonKey).toBe('anaam-ineligible-working');
        });

        it('returns no-hawl reason when hawl incomplete', () => {
            const res = evaluateEligibility({ isGrazing: true, isNonWorking: true, heldForHawl: false });
            expect(res.isEligible).toBe(false);
            expect(res.reasonKey).toBe('anaam-ineligible-no-hawl');
        });
    });

    describe('Input Sanitization & Error Semantics', () => {
        it('returns null on invalid counts or species', () => {
            expect(calculateAnaam({ species: 'unknown', count: 40 })).toBeNull();
            expect(calculateAnaam({ species: 'camels', count: -1 })).toBeNull();
            expect(calculateAnaam({ species: 'camels', count: 40.5 })).toBeNull();
            expect(calculateAnaam({ species: 'camels', count: NaN })).toBeNull();
            expect(calculateAnaam({ species: 'camels', count: Infinity })).toBeNull();
            expect(calculateAnaam({ species: 'camels', count: '40' })).toBeNull();

            expect(calculateSheepGoats(-5)).toBeNull();
            expect(calculateSheepGoats(10.5)).toBeNull();
            expect(calculateCattle(-1)).toBeNull();
            expect(calculateCamels(-1)).toBeNull();
        });
    });

    describe('User Story 1: Sheep & Goats (الغنم)', () => {
        it('handles below Nisab (< 40)', () => {
            const res = calculateSheepGoats(39);
            expect(res.isEligible).toBe(false);
            expect(res.nisab).toBe(40);
            expect(res.zakatDueItems).toEqual([]);
        });

        it('calculates 40 to 120 (1 Shah)', () => {
            const res40 = calculateSheepGoats(40);
            expect(res40.isEligible).toBe(true);
            expect(res40.zakatDueItems).toEqual([
                { key: 'anaam-animal-shah', count: 1, ageDescriptionKey: '' },
            ]);

            const res120 = calculateSheepGoats(120);
            expect(res120.zakatDueItems[0].count).toBe(1);
        });

        it('calculates 121 to 200 (2 Shah)', () => {
            const res121 = calculateSheepGoats(121);
            expect(res121.zakatDueItems[0].count).toBe(2);

            const res200 = calculateSheepGoats(200);
            expect(res200.zakatDueItems[0].count).toBe(2);
        });

        it('calculates 201 to 399 (3 Shah)', () => {
            const res201 = calculateSheepGoats(201);
            expect(res201.zakatDueItems[0].count).toBe(3);

            const res260 = calculateSheepGoats(260);
            expect(res260.zakatDueItems[0].count).toBe(3);

            const res399 = calculateSheepGoats(399);
            expect(res399.zakatDueItems[0].count).toBe(3);
        });

        it('calculates >= 400 (1 Shah per 100)', () => {
            const res400 = calculateSheepGoats(400);
            expect(res400.zakatDueItems[0].count).toBe(4);

            const res499 = calculateSheepGoats(499);
            expect(res499.zakatDueItems[0].count).toBe(4);

            const res500 = calculateSheepGoats(500);
            expect(res500.zakatDueItems[0].count).toBe(5);
        });
    });

    describe('User Story 2: Cattle & Buffalo (البقر)', () => {
        it('handles below Nisab (< 30)', () => {
            const res = calculateCattle(29);
            expect(res.isEligible).toBe(false);
            expect(res.nisab).toBe(30);
            expect(res.zakatDueItems).toEqual([]);
        });

        it('calculates standard brackets up to 129', () => {
            // 30 - 39: 1 Tabi'
            expect(calculateCattle(30).zakatDueItems).toEqual([
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);
            expect(calculateCattle(39).zakatDueItems).toEqual([
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 40 - 59: 1 Musinnah
            expect(calculateCattle(40).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
            ]);
            expect(calculateCattle(59).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
            ]);

            // 60 - 69: 2 Tabi' (including waqs 65)
            expect(calculateCattle(60).zakatDueItems).toEqual([
                { key: 'anaam-animal-tabi', count: 2, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);
            expect(calculateCattle(65).zakatDueItems).toEqual([
                { key: 'anaam-animal-tabi', count: 2, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 70 - 79: 1 Musinnah + 1 Tabi' (including worked example 75)
            expect(calculateCattle(70).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);
            expect(calculateCattle(75).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 80 - 89: 2 Musinnah
            expect(calculateCattle(80).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 2, ageDescriptionKey: 'anaam-desc-musinnah' },
            ]);

            // 90 - 99: 3 Tabi'
            expect(calculateCattle(90).zakatDueItems).toEqual([
                { key: 'anaam-animal-tabi', count: 3, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 100 - 109: 1 Musinnah + 2 Tabi'
            expect(calculateCattle(100).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 2, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 110 - 119: 2 Musinnah + 1 Tabi'
            expect(calculateCattle(110).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 2, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 120 - 129: 3 Musinnah (with alternate 4 Tabi')
            const res120 = calculateCattle(120);
            expect(res120.zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 3, ageDescriptionKey: 'anaam-desc-musinnah' },
            ]);
            expect(res120.alternateCombinations).toEqual([
                [{ key: 'anaam-animal-tabi', count: 4, ageDescriptionKey: 'anaam-desc-tabi' }],
            ]);
        });

        it('calculates >= 130 decomposition (40y + 30x)', () => {
            // 130: 1 Musinnah (40) + 3 Tabi' (90) = 130
            expect(calculateCattle(130).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 1, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 3, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 140: 2 Musinnah (80) + 2 Tabi' (60) = 140
            expect(calculateCattle(140).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 2, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 2, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);

            // 150: 3 Musinnah (120) + 1 Tabi' (30) = 150 (primary), 5 Tabi' (alternate)
            const res150 = calculateCattle(150);
            expect(res150.zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 3, ageDescriptionKey: 'anaam-desc-musinnah' },
                { key: 'anaam-animal-tabi', count: 1, ageDescriptionKey: 'anaam-desc-tabi' },
            ]);
            expect(res150.alternateCombinations).toEqual([
                [{ key: 'anaam-animal-tabi', count: 5, ageDescriptionKey: 'anaam-desc-tabi' }],
            ]);

            // 160: 4 Musinnah (160) = 160
            expect(calculateCattle(160).zakatDueItems).toEqual([
                { key: 'anaam-animal-musinnah', count: 4, ageDescriptionKey: 'anaam-desc-musinnah' },
            ]);
        });
    });

    describe('User Story 3: Camels (الإبل)', () => {
        it('handles below Nisab (< 5)', () => {
            const res = calculateCamels(4);
            expect(res.isEligible).toBe(false);
            expect(res.nisab).toBe(5);
            expect(res.zakatDueItems).toEqual([]);
        });

        it('calculates standard 10 brackets up to 120', () => {
            // 5 - 9: 1 Shah
            expect(calculateCamels(5).zakatDueItems).toEqual([
                { key: 'anaam-animal-shah', count: 1, ageDescriptionKey: '' },
            ]);
            expect(calculateCamels(9).zakatDueItems).toEqual([
                { key: 'anaam-animal-shah', count: 1, ageDescriptionKey: '' },
            ]);

            // 10 - 14: 2 Shah
            expect(calculateCamels(10).zakatDueItems[0].count).toBe(2);

            // 20 - 24: 4 Shah
            expect(calculateCamels(24).zakatDueItems[0].count).toBe(4);

            // 25 - 35: 1 Bint Makhad
            expect(calculateCamels(25).zakatDueItems).toEqual([
                { key: 'anaam-animal-bint-makhad', count: 1, ageDescriptionKey: 'anaam-desc-bint-makhad' },
            ]);
            expect(calculateCamels(35).zakatDueItems[0].key).toBe('anaam-animal-bint-makhad');

            // 36 - 45: 1 Bint Labun
            expect(calculateCamels(36).zakatDueItems).toEqual([
                { key: 'anaam-animal-bint-labun', count: 1, ageDescriptionKey: 'anaam-desc-bint-labun' },
            ]);
            expect(calculateCamels(45).zakatDueItems[0].key).toBe('anaam-animal-bint-labun');

            // 46 - 60: 1 Hiqqah
            expect(calculateCamels(46).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 1, ageDescriptionKey: 'anaam-desc-hiqqah' },
            ]);
            expect(calculateCamels(60).zakatDueItems[0].key).toBe('anaam-animal-hiqqah');

            // 61 - 75: 1 Jadha'ah
            expect(calculateCamels(61).zakatDueItems).toEqual([
                { key: 'anaam-animal-jadhaah', count: 1, ageDescriptionKey: 'anaam-desc-jadhaah' },
            ]);
            expect(calculateCamels(75).zakatDueItems[0].key).toBe('anaam-animal-jadhaah');

            // 76 - 90: 2 Bint Labun
            expect(calculateCamels(76).zakatDueItems).toEqual([
                { key: 'anaam-animal-bint-labun', count: 2, ageDescriptionKey: 'anaam-desc-bint-labun' },
            ]);
            expect(calculateCamels(90).zakatDueItems[0].count).toBe(2);

            // 91 - 120: 2 Hiqqah
            expect(calculateCamels(91).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 2, ageDescriptionKey: 'anaam-desc-hiqqah' },
            ]);
            expect(calculateCamels(120).zakatDueItems[0].count).toBe(2);
        });

        it('calculates > 120 decomposition (50x + 40y)', () => {
            // 130: 1 Hiqqah (50) + 2 Bint Labun (80) = 130
            expect(calculateCamels(130).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 1, ageDescriptionKey: 'anaam-desc-hiqqah' },
                { key: 'anaam-animal-bint-labun', count: 2, ageDescriptionKey: 'anaam-desc-bint-labun' },
            ]);

            // 135: waqs to 130
            expect(calculateCamels(135).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 1, ageDescriptionKey: 'anaam-desc-hiqqah' },
                { key: 'anaam-animal-bint-labun', count: 2, ageDescriptionKey: 'anaam-desc-bint-labun' },
            ]);

            // 140: 2 Hiqqah (100) + 1 Bint Labun (40) = 140
            expect(calculateCamels(140).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 2, ageDescriptionKey: 'anaam-desc-hiqqah' },
                { key: 'anaam-animal-bint-labun', count: 1, ageDescriptionKey: 'anaam-desc-bint-labun' },
            ]);

            // 150: 3 Hiqqah (150)
            expect(calculateCamels(150).zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 3, ageDescriptionKey: 'anaam-desc-hiqqah' },
            ]);

            // 200: 4 Hiqqah (200) preferred, 5 Bint Labun as alternate
            const res200 = calculateCamels(200);
            expect(res200.zakatDueItems).toEqual([
                { key: 'anaam-animal-hiqqah', count: 4, ageDescriptionKey: 'anaam-desc-hiqqah' },
            ]);
            expect(res200.alternateCombinations).toEqual([
                [{ key: 'anaam-animal-bint-labun', count: 5, ageDescriptionKey: 'anaam-desc-bint-labun' }],
            ]);
        });
    });

    describe('Primary calculateAnaam Function', () => {
        it('correctly dispatches across all species and eligibility conditions', () => {
            const res = calculateAnaam({
                species: LIVESTOCK_SPECIES.SHEEP_GOATS,
                count: 40,
                conditions: { isGrazing: true, isNonWorking: true, heldForHawl: true },
            });
            expect(res.isEligible).toBe(true);
            expect(res.species).toBe('sheep_goats');
            expect(res.zakatDueItems[0].count).toBe(1);

            const stallFed = calculateAnaam({
                species: LIVESTOCK_SPECIES.CAMELS,
                count: 100,
                conditions: { isGrazing: false, isNonWorking: true, heldForHawl: true },
            });
            expect(stallFed.isEligible).toBe(false);
            expect(stallFed.ineligibilityReason).toBe('anaam-ineligible-stall-fed');
            expect(stallFed.zakatDueItems).toEqual([]);
        });
    });
});
