// calculateZuru: pure, contract-driven.
// Contract: specs/002-react-migration/contracts/calculation-api.md

const RATE_BY_IRRIGATION = {
    rainfed: 0.10,
    irrigated: 0.05,
    mixed: 0.075,
};

export function calculateZuru({ weightKg, irrigation }) {
    if (
        typeof weightKg !== 'number' || !Number.isFinite(weightKg) ||
        weightKg < 0 ||
        !(irrigation in RATE_BY_IRRIGATION)
    ) return null;

    const rate = RATE_BY_IRRIGATION[irrigation];
    const eligible = weightKg >= 600;
    const zakatDue = eligible ? weightKg * rate : 0;
    return { eligible, rate, zakatDue };
}
