/**
 * Zakat Al-Anaam (Livestock) Calculation Module
 * Pure functions implementing Shariah-accurate calculations for Camels, Cattle, and Sheep/Goats.
 */

export const LIVESTOCK_SPECIES = {
    CAMELS: 'camels',
    CATTLE: 'cattle',
    SHEEP_GOATS: 'sheep_goats',
};

export const NISAB_THRESHOLDS = {
    [LIVESTOCK_SPECIES.CAMELS]: 5,
    [LIVESTOCK_SPECIES.CATTLE]: 30,
    [LIVESTOCK_SPECIES.SHEEP_GOATS]: 40,
};

/**
 * Evaluates the 3 mandatory Shariah eligibility conditions for livestock Zakat:
 * 1. Sa'imah (Grazing on natural pastures > 6 months of lunar year)
 * 2. Non-working (Not used for plowing, farm labor, or transport)
 * 3. Hawl (Held for 1 full lunar year above Nisab)
 *
 * @param {Object} [conditions]
 * @param {boolean} [conditions.isGrazing=true]
 * @param {boolean} [conditions.isNonWorking=true]
 * @param {boolean} [conditions.heldForHawl=true]
 * @returns {{ isEligible: boolean, reasonKey: string | null }}
 */
export function evaluateEligibility(conditions = {}) {
    const isGrazing = conditions.isGrazing !== false;
    const isNonWorking = conditions.isNonWorking !== false;
    const heldForHawl = conditions.heldForHawl !== false;

    if (!isGrazing) {
        return { isEligible: false, reasonKey: 'anaam-ineligible-stall-fed' };
    }
    if (!isNonWorking) {
        return { isEligible: false, reasonKey: 'anaam-ineligible-working' };
    }
    if (!heldForHawl) {
        return { isEligible: false, reasonKey: 'anaam-ineligible-no-hawl' };
    }
    return { isEligible: true, reasonKey: null };
}

/**
 * Validates whether the count is a non-negative integer.
 * @param {*} count
 * @returns {boolean}
 */
function isValidCount(count) {
    return typeof count === 'number' && Number.isInteger(count) && count >= 0;
}

/**
 * Calculates Zakat for Sheep and Goats (الغنم).
 * @param {number} count
 * @returns {{ nisab: number, isEligible: boolean, zakatDueItems: Array<{ key: string, count: number, ageDescriptionKey: string }> } | null}
 */
export function calculateSheepGoats(count) {
    if (!isValidCount(count)) return null;

    const nisab = NISAB_THRESHOLDS[LIVESTOCK_SPECIES.SHEEP_GOATS];
    if (count < nisab) {
        return { nisab, isEligible: false, zakatDueItems: [] };
    }

    let dueCount = 0;
    if (count <= 120) {
        dueCount = 1;
    } else if (count <= 200) {
        dueCount = 2;
    } else if (count <= 399) {
        dueCount = 3;
    } else {
        dueCount = Math.floor(count / 100);
    }

    return {
        nisab,
        isEligible: true,
        zakatDueItems: [
            {
                key: 'anaam-animal-shah',
                count: dueCount,
                ageDescriptionKey: '',
            },
        ],
    };
}

/**
 * Calculates Zakat for Cattle and Buffalo (البقر).
 * @param {number} count
 * @returns {{ nisab: number, isEligible: boolean, zakatDueItems: Array<{ key: string, count: number, ageDescriptionKey: string }>, alternateCombinations?: Array<Array<{ key: string, count: number, ageDescriptionKey: string }>> } | null}
 */
export function calculateCattle(count) {
    if (!isValidCount(count)) return null;

    const nisab = NISAB_THRESHOLDS[LIVESTOCK_SPECIES.CATTLE];
    if (count < nisab) {
        return { nisab, isEligible: false, zakatDueItems: [] };
    }

    const itemTabi = (c) => ({
        key: 'anaam-animal-tabi',
        count: c,
        ageDescriptionKey: 'anaam-desc-tabi',
    });

    const itemMusinnah = (c) => ({
        key: 'anaam-animal-musinnah',
        count: c,
        ageDescriptionKey: 'anaam-desc-musinnah',
    });

    if (count <= 39) {
        return { nisab, isEligible: true, zakatDueItems: [itemTabi(1)] };
    }
    if (count <= 59) {
        return { nisab, isEligible: true, zakatDueItems: [itemMusinnah(1)] };
    }
    if (count <= 69) {
        return { nisab, isEligible: true, zakatDueItems: [itemTabi(2)] };
    }
    if (count <= 79) {
        return { nisab, isEligible: true, zakatDueItems: [itemMusinnah(1), itemTabi(1)] };
    }
    if (count <= 89) {
        return { nisab, isEligible: true, zakatDueItems: [itemMusinnah(2)] };
    }
    if (count <= 99) {
        return { nisab, isEligible: true, zakatDueItems: [itemTabi(3)] };
    }
    if (count <= 109) {
        return { nisab, isEligible: true, zakatDueItems: [itemMusinnah(1), itemTabi(2)] };
    }
    if (count <= 119) {
        return { nisab, isEligible: true, zakatDueItems: [itemMusinnah(2), itemTabi(1)] };
    }

    // >= 120 continuation: decompose floor to multiple of 10 into 40y + 30x (maximize y: Musinnah)
    const floored = Math.floor(count / 10) * 10;
    const maxMusinnah = Math.floor(floored / 40);

    const allValidDecompositions = [];
    for (let y = maxMusinnah; y >= 0; y--) {
        const remainder = floored - 40 * y;
        if (remainder % 30 === 0) {
            const x = remainder / 30;
            allValidDecompositions.push({ y, x });
        }
    }

    let optimalMusinnah = 0;
    let optimalTabi = 0;
    let alternateCombinations = null;

    if (allValidDecompositions.length > 0) {
        optimalMusinnah = allValidDecompositions[0].y;
        optimalTabi = allValidDecompositions[0].x;

        if (allValidDecompositions.length > 1) {
            alternateCombinations = allValidDecompositions.slice(1).map((combo) => {
                const altItems = [];
                if (combo.y > 0) altItems.push(itemMusinnah(combo.y));
                if (combo.x > 0) altItems.push(itemTabi(combo.x));
                return altItems;
            });
        }
    }

    const items = [];
    if (optimalMusinnah > 0) {
        items.push(itemMusinnah(optimalMusinnah));
    }
    if (optimalTabi > 0) {
        items.push(itemTabi(optimalTabi));
    }

    const result = {
        nisab,
        isEligible: true,
        zakatDueItems: items,
    };

    if (alternateCombinations && alternateCombinations.length > 0) {
        result.alternateCombinations = alternateCombinations;
    }

    return result;
}

/**
 * Calculates Zakat for Camels (الإبل).
 * @param {number} count
 * @returns {{ nisab: number, isEligible: boolean, zakatDueItems: Array<{ key: string, count: number, ageDescriptionKey: string }>, alternateCombinations?: Array<Array<{ key: string, count: number, ageDescriptionKey: string }>> } | null}
 */
export function calculateCamels(count) {
    if (!isValidCount(count)) return null;

    const nisab = NISAB_THRESHOLDS[LIVESTOCK_SPECIES.CAMELS];
    if (count < nisab) {
        return { nisab, isEligible: false, zakatDueItems: [] };
    }

    const itemShah = (c) => ({
        key: 'anaam-animal-shah',
        count: c,
        ageDescriptionKey: '',
    });
    const itemBintMakhad = (c) => ({
        key: 'anaam-animal-bint-makhad',
        count: c,
        ageDescriptionKey: 'anaam-desc-bint-makhad',
    });
    const itemBintLabun = (c) => ({
        key: 'anaam-animal-bint-labun',
        count: c,
        ageDescriptionKey: 'anaam-desc-bint-labun',
    });
    const itemHiqqah = (c) => ({
        key: 'anaam-animal-hiqqah',
        count: c,
        ageDescriptionKey: 'anaam-desc-hiqqah',
    });
    const itemJadhaah = (c) => ({
        key: 'anaam-animal-jadhaah',
        count: c,
        ageDescriptionKey: 'anaam-desc-jadhaah',
    });

    if (count <= 9) {
        return { nisab, isEligible: true, zakatDueItems: [itemShah(1)] };
    }
    if (count <= 14) {
        return { nisab, isEligible: true, zakatDueItems: [itemShah(2)] };
    }
    if (count <= 19) {
        return { nisab, isEligible: true, zakatDueItems: [itemShah(3)] };
    }
    if (count <= 24) {
        return { nisab, isEligible: true, zakatDueItems: [itemShah(4)] };
    }
    if (count <= 35) {
        return { nisab, isEligible: true, zakatDueItems: [itemBintMakhad(1)] };
    }
    if (count <= 45) {
        return { nisab, isEligible: true, zakatDueItems: [itemBintLabun(1)] };
    }
    if (count <= 60) {
        return { nisab, isEligible: true, zakatDueItems: [itemHiqqah(1)] };
    }
    if (count <= 75) {
        return { nisab, isEligible: true, zakatDueItems: [itemJadhaah(1)] };
    }
    if (count <= 90) {
        return { nisab, isEligible: true, zakatDueItems: [itemBintLabun(2)] };
    }
    if (count <= 120) {
        return { nisab, isEligible: true, zakatDueItems: [itemHiqqah(2)] };
    }

    // > 120 continuation: decompose floor to multiple of 10 into 50x + 40y (maximize x: Hiqqah)
    const floored = Math.floor(count / 10) * 10;
    const maxHiqqah = Math.floor(floored / 50);

    let optimalHiqqah = null;
    let optimalBintLabun = null;
    let alternateCombinations = null;

    // Check if there are multiple decompositions (e.g. at 200: 4 Hiqqah vs 5 Bint Labun)
    const allValidDecompositions = [];

    for (let x = maxHiqqah; x >= 0; x--) {
        const remainder = floored - 50 * x;
        if (remainder % 40 === 0) {
            const y = remainder / 40;
            allValidDecompositions.push({ x, y });
        }
    }

    if (allValidDecompositions.length > 0) {
        optimalHiqqah = allValidDecompositions[0].x;
        optimalBintLabun = allValidDecompositions[0].y;

        if (allValidDecompositions.length > 1) {
            alternateCombinations = allValidDecompositions.slice(1).map((combo) => {
                const altItems = [];
                if (combo.x > 0) altItems.push(itemHiqqah(combo.x));
                if (combo.y > 0) altItems.push(itemBintLabun(combo.y));
                return altItems;
            });
        }
    }

    const items = [];
    if (optimalHiqqah > 0) {
        items.push(itemHiqqah(optimalHiqqah));
    }
    if (optimalBintLabun > 0) {
        items.push(itemBintLabun(optimalBintLabun));
    }

    const result = {
        nisab,
        isEligible: true,
        zakatDueItems: items,
    };

    if (alternateCombinations && alternateCombinations.length > 0) {
        result.alternateCombinations = alternateCombinations;
    }

    return result;
}

/**
 * Primary calculation entry point for Zakat Al-Anaam.
 *
 * @param {Object} input
 * @param {'camels' | 'cattle' | 'sheep_goats'} input.species
 * @param {number} input.count
 * @param {Object} [input.conditions]
 * @returns {Object | null}
 */
export function calculateAnaam({ species, count, conditions = {} }) {
    if (!Object.values(LIVESTOCK_SPECIES).includes(species)) {
        return null;
    }

    if (!isValidCount(count)) {
        return null;
    }

    const nisab = NISAB_THRESHOLDS[species];
    const eligibility = evaluateEligibility(conditions);

    if (!eligibility.isEligible) {
        return {
            species,
            count,
            nisab,
            isEligible: false,
            ineligibilityReason: eligibility.reasonKey,
            zakatDueItems: [],
            alternateCombinations: null,
            explanationKey: null,
        };
    }

    let calculation = null;
    switch (species) {
        case LIVESTOCK_SPECIES.CAMELS:
            calculation = calculateCamels(count);
            break;
        case LIVESTOCK_SPECIES.CATTLE:
            calculation = calculateCattle(count);
            break;
        case LIVESTOCK_SPECIES.SHEEP_GOATS:
            calculation = calculateSheepGoats(count);
            break;
        default:
            return null;
    }

    if (!calculation) return null;

    return {
        species,
        count,
        nisab: calculation.nisab,
        isEligible: calculation.isEligible,
        ineligibilityReason: calculation.isEligible ? null : 'below-nisab',
        zakatDueItems: calculation.zakatDueItems,
        alternateCombinations: calculation.alternateCombinations || null,
        explanationKey: null,
    };
}
